import { createHash } from "node:crypto";
import { and, asc, eq, lte } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { businessDate, dec, dueRecurringDates, firstRecurringDate, nextRecurringDate, money, type RecurringFrequency } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, notFound } from "../lib/errors.js";
import { postVoucher, resolveCompany } from "./accounting.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

export interface RecurringBody {
  name: string; type: "journal" | "payment" | "receipt" | "contra"; narration?: string | undefined; frequency: RecurringFrequency; dayOfMonth: number;
  startOn: string; endsOn?: string | undefined; lines: { accountId: string; debit?: string | undefined; credit?: string | undefined }[]; companyId?: string | undefined;
}

/** A voucher posted from a template is posted once per due date: the same template and date always give the same id. */
const runId = (templateId: string, date: string) => {
  const h = createHash("sha256").update(`recurring|${templateId}|${date}`).digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-5${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`;
};

export async function listRecurring(tx: Tx, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  return tx.select().from(tables.recurringVouchers).where(eq(tables.recurringVouchers.companyId, company.id)).orderBy(asc(tables.recurringVouchers.nextOn));
}

export async function createRecurring(tx: Tx, actor: Actor, b: RecurringBody) {
  const company = await resolveCompany(tx, b.companyId);
  if (b.lines.length < 2) throw badRequest("at_least_two_lines");
  const dr = b.lines.reduce((s, l) => s.plus(l.debit ?? 0), dec(0)), cr = b.lines.reduce((s, l) => s.plus(l.credit ?? 0), dec(0));
  if (!dr.gt(0) || !dr.eq(cr)) throw badRequest("voucher_not_balanced");
  if (b.endsOn && b.endsOn < b.startOn) throw badRequest("ends_before_start");
  const [row] = await tx.insert(tables.recurringVouchers).values({
    tenantId: actor.tenantId, companyId: company.id, name: b.name.trim(), type: b.type, narration: b.narration?.trim() || null,
    lines: b.lines.map((l) => ({ accountId: l.accountId, ...(l.debit && dec(l.debit).gt(0) ? { debit: money(l.debit) } : {}), ...(l.credit && dec(l.credit).gt(0) ? { credit: money(l.credit) } : {}) })),
    frequency: b.frequency, dayOfMonth: b.dayOfMonth, nextOn: firstRecurringDate(b.startOn, b.dayOfMonth), endsOn: b.endsOn ?? null, createdBy: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "recurring_voucher", entityId: row!.id, after: { name: b.name, frequency: b.frequency, day: b.dayOfMonth }, ip: actor.ip });
  return row!;
}

export async function setRecurringActive(tx: Tx, actor: Actor, id: string, active: boolean) {
  const [row] = await tx.update(tables.recurringVouchers).set({ active }).where(eq(tables.recurringVouchers.id, id)).returning({ id: tables.recurringVouchers.id });
  if (!row) throw notFound();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "recurring_voucher", entityId: id, after: { active }, ip: actor.ip });
}

/**
 * Posts every voucher that has fallen due on or before `today`, from each active template, oldest first. A date that cannot be
 * posted (the period is locked, an account was archived) is reported and left due; the others still go through.
 */
export async function runDueRecurring(tx: Tx, actor: Actor, today = businessDate(), companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const templates = await tx.select().from(tables.recurringVouchers)
    .where(and(eq(tables.recurringVouchers.companyId, company.id), eq(tables.recurringVouchers.active, true), lte(tables.recurringVouchers.nextOn, today))).for("update");
  const posted: { name: string; date: string; voucherId: string }[] = [];
  const failed: { name: string; date: string; error: string }[] = [];
  for (const t of templates) {
    let next = t.nextOn;
    let last = t.lastRunOn;
    for (const date of dueRecurringDates(t.nextOn, t.endsOn, today, t.frequency as RecurringFrequency, t.dayOfMonth)) {
      try {
        const v = await tx.transaction(async (sp) => postVoucher(sp, actor, {
          companyId: company.id, type: t.type as "journal", date, narration: t.narration ?? t.name, reference: `Recurring: ${t.name}`, clientId: runId(t.id, date), lines: t.lines,
        }));
        posted.push({ name: t.name, date, voucherId: v.voucher.id });
        last = date; next = nextRecurringDate(date, t.frequency as RecurringFrequency, t.dayOfMonth);
      } catch (e) {
        failed.push({ name: t.name, date, error: e instanceof Error ? e.message : "failed" });
        break;
      }
    }
    // A template whose end date has passed switches itself off.
    const finished = t.endsOn !== null && next > t.endsOn;
    await tx.update(tables.recurringVouchers).set({ nextOn: next, lastRunOn: last, ...(finished ? { active: false } : {}) }).where(eq(tables.recurringVouchers.id, t.id));
  }
  if (posted.length) await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "recurring_run", entityId: company.id, after: { posted: posted.length, failed: failed.length, today }, ip: actor.ip });
  return { posted, failed };
}
