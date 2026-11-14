import { and, asc, desc, eq, sql } from "drizzle-orm";
import { tables, withTenant, type Db, type Tx } from "@varchasv/db";
import { ALL_PERMISSIONS, businessDate, checkSeriesPattern } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";

interface Actor { tenantId: string; userId: string | null; ip?: string | undefined }

type Entity = "item" | "account" | "role" | "number_series";
/** What can be dated ahead, per kind of record, and how each value must look. */
const FIELDS: Record<Entity, Record<string, { kind: "rate" | "money" | "days" | "perms" | "pattern"; nullable: boolean }>> = {
  item: {
    gstRate: { kind: "rate", nullable: false }, cessRate: { kind: "rate", nullable: false },
    saleRate: { kind: "money", nullable: false }, purchaseRate: { kind: "money", nullable: false }, mrp: { kind: "money", nullable: true },
  },
  account: {
    creditLimit: { kind: "money", nullable: true }, creditDays: { kind: "days", nullable: true }, interestRate: { kind: "rate", nullable: true },
  },
  // A role's whole set of permissions, and a numbering series' pattern, can start on a day too (a new financial year's series, a stricter role from the first).
  role: { permissions: { kind: "perms", nullable: false } },
  number_series: { pattern: { kind: "pattern", nullable: false } },
};

export const SCHEDULABLE = Object.fromEntries(Object.entries(FIELDS).map(([e, f]) => [e, Object.keys(f)])) as Record<Entity, string[]>;

function checkValue(entity: Entity, field: string, value: string | null) {
  const spec = FIELDS[entity][field];
  if (!spec) throw badRequest("field_not_schedulable");
  if (value === null || value === "") {
    if (!spec.nullable) throw badRequest("value_required");
    return null;
  }
  if (spec.kind === "perms") {
    let list: unknown;
    try { list = JSON.parse(value); } catch { throw badRequest("invalid_value"); }
    if (!Array.isArray(list) || !list.length || list.some((p) => typeof p !== "string" || !(ALL_PERMISSIONS as string[]).includes(p))) throw badRequest("invalid_value");
    return JSON.stringify([...new Set(list as string[])].sort());
  }
  if (spec.kind === "pattern") {
    if (value.length > 40 || checkSeriesPattern(value) !== null) throw badRequest("invalid_value");
    return value;
  }
  const ok = spec.kind === "days" ? /^\d{1,4}$/.test(value) : spec.kind === "rate" ? /^\d{1,3}(\.\d{1,2})?$/.test(value) && Number(value) <= 100 : /^\d{1,14}(\.\d{1,4})?$/.test(value);
  if (!ok) throw badRequest("invalid_value");
  return value;
}

async function load(tx: Tx, entity: Entity, id: string) {
  if (entity === "item") {
    const [r] = await tx.select().from(tables.items).where(eq(tables.items.id, id));
    return r ? { name: r.name, row: r as unknown as Record<string, unknown> } : null;
  }
  if (entity === "role") {
    const [r] = await tx.select().from(tables.roles).where(eq(tables.roles.id, id));
    if (r?.key === "owner") throw badRequest("owner_role_fixed");
    return r ? { name: r.name, row: { permissions: JSON.stringify([...r.permissions].sort()) } as Record<string, unknown> } : null;
  }
  if (entity === "number_series") {
    const [r] = await tx.select().from(tables.numberSeries).where(eq(tables.numberSeries.id, id));
    return r ? { name: r.name, row: r as unknown as Record<string, unknown> } : null;
  }
  const [r] = await tx.select().from(tables.accounts).where(eq(tables.accounts.id, id));
  return r ? { name: r.name, row: r as unknown as Record<string, unknown> } : null;
}

const show = (v: unknown) => (v === null || v === undefined ? null : String(v));

export async function scheduleChange(tx: Tx, actor: Actor & { userId: string }, input: { entity: Entity; entityId: string; field: string; value: string | null; effectiveFrom: string; note?: string | null | undefined }) {
  const value = checkValue(input.entity, input.field, input.value);
  if (input.effectiveFrom <= businessDate()) throw badRequest("date_not_future");
  const target = await load(tx, input.entity, input.entityId);
  if (!target) throw notFound();
  const [clash] = await tx.select({ id: tables.scheduledChanges.id }).from(tables.scheduledChanges).where(and(
    eq(tables.scheduledChanges.entityId, input.entityId), eq(tables.scheduledChanges.field, input.field), eq(tables.scheduledChanges.effectiveFrom, input.effectiveFrom), eq(tables.scheduledChanges.status, "pending"))).limit(1);
  if (clash) throw conflict("change_already_scheduled");
  const [row] = await tx.insert(tables.scheduledChanges).values({
    tenantId: actor.tenantId, entity: input.entity, entityId: input.entityId, entityName: target.name, field: input.field, value, effectiveFrom: input.effectiveFrom, note: input.note ?? null, createdBy: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "scheduled_change", entityId: row!.id, after: { entity: input.entity, name: target.name, field: input.field, value, effectiveFrom: input.effectiveFrom }, ip: actor.ip });
  return row!;
}

export async function cancelScheduledChange(tx: Tx, actor: Actor & { userId: string }, id: string) {
  const [c] = await tx.select().from(tables.scheduledChanges).where(eq(tables.scheduledChanges.id, id)).for("update");
  if (!c) throw notFound();
  if (c.status !== "pending") throw conflict("change_not_pending");
  await tx.update(tables.scheduledChanges).set({ status: "cancelled" }).where(eq(tables.scheduledChanges.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "cancel", entity: "scheduled_change", entityId: id, after: { field: c.field, entity: c.entityName }, ip: actor.ip });
}

/** Pending and past changes, soonest first among the pending, newest first among the rest. Optionally for one record. */
export async function listScheduledChanges(tx: Tx, filter: { entity?: Entity | undefined; entityId?: string | undefined } = {}) {
  const where = filter.entityId ? eq(tables.scheduledChanges.entityId, filter.entityId) : filter.entity ? eq(tables.scheduledChanges.entity, filter.entity) : undefined;
  const rows = await tx.select().from(tables.scheduledChanges).where(where).orderBy(asc(tables.scheduledChanges.effectiveFrom), desc(tables.scheduledChanges.createdAt)).limit(500);
  return [...rows.filter((r) => r.status === "pending"), ...rows.filter((r) => r.status !== "pending").reverse()];
}

/** Applies what has come due for one business, each in its own savepoint so one bad change does not hold up the rest. */
export async function applyDueChanges(tx: Tx, today = businessDate()) {
  const due = await tx.select().from(tables.scheduledChanges).where(and(eq(tables.scheduledChanges.status, "pending"), sql`${tables.scheduledChanges.effectiveFrom} <= ${today}::date`))
    .orderBy(asc(tables.scheduledChanges.effectiveFrom), asc(tables.scheduledChanges.createdAt)).for("update");
  let applied = 0;
  for (const c of due) {
    try {
      await tx.transaction(async (sp) => {
        const target = await load(sp, c.entity as Entity, c.entityId);
        if (!target) throw new Error("record_gone");
        const value = checkValue(c.entity as Entity, c.field, c.value);
        const before = show(target.row[c.field]);
        const set = { [c.field]: value, updatedAt: new Date() };
        if (c.entity === "item") await sp.update(tables.items).set(set).where(eq(tables.items.id, c.entityId));
        else if (c.entity === "role") await sp.update(tables.roles).set({ permissions: JSON.parse(value!) as string[] }).where(eq(tables.roles.id, c.entityId));
        else if (c.entity === "number_series") await sp.update(tables.numberSeries).set({ pattern: value! }).where(eq(tables.numberSeries.id, c.entityId));
        else await sp.update(tables.accounts).set(set).where(eq(tables.accounts.id, c.entityId));
        await sp.update(tables.scheduledChanges).set({ status: "applied", appliedAt: new Date(), previous: before }).where(eq(tables.scheduledChanges.id, c.id));
        await audit(sp, { tenantId: c.tenantId, userId: null, action: "update", entity: c.entity, entityId: c.entityId, before: { [c.field]: before }, after: { [c.field]: value, scheduledChange: c.id, effectiveFrom: c.effectiveFrom }, ip: undefined });
      });
      applied += 1;
    } catch (e) {
      await tx.update(tables.scheduledChanges).set({ status: "failed", error: ((e as Error).message || "failed").slice(0, 110) }).where(eq(tables.scheduledChanges.id, c.id));
    }
  }
  return applied;
}

/** Called by the scheduler: finds the businesses with something due and applies it inside each one. */
export async function runDueScheduledChanges(db: Db, now = new Date()) {
  const today = businessDate(now);
  const due = await db.execute<{ tenant_id: string }>(sql`select tenant_id from due_scheduled_changes(${today}::date)`);
  let applied = 0;
  for (const { tenant_id } of due) applied += await withTenant(db, tenant_id, (tx) => applyDueChanges(tx, today));
  return applied;
}
