import { and, desc, eq, inArray } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { businessDate, dec, money } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { stockPositions } from "./inventory.js";
import { resolveCompany } from "./accounting.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

export const RATE_FIELDS = ["saleRate", "mrp", "purchaseRate"] as const;
export const RATE_MODES = ["percent", "amount", "set"] as const;
export const RATE_ROUNDS = ["none", "1", "5", "10", "ends9"] as const;
type Field = (typeof RATE_FIELDS)[number];
type Mode = (typeof RATE_MODES)[number];
type Round = (typeof RATE_ROUNDS)[number];

export interface RateUpdateInput {
  scope: { brand?: string | undefined; category?: string | undefined; season?: string | undefined; styleId?: string | undefined; all?: boolean | undefined };
  field: Field;
  mode: Mode;
  /** Percent or amount may be negative (a markdown); a set value is the new rate itself. */
  value: string;
  round: Round;
  /** Show what would change without changing it. */
  preview: boolean;
}

const MAX_ITEMS = 5000;

/** The new rate: the change applied, then rounded. Rates never go below zero. */
export function repriced(old: string, mode: Mode, value: string, round: Round) {
  let next = mode === "percent" ? dec(old).times(dec(100).plus(value)).div(100) : mode === "amount" ? dec(old).plus(value) : dec(value);
  if (next.lt(0)) next = dec(0);
  if (round === "1") next = next.toDecimalPlaces(0, 4);
  else if (round === "5") next = next.div(5).toDecimalPlaces(0, 4).times(5);
  else if (round === "10") next = next.div(10).toDecimalPlaces(0, 4).times(10);
  else if (round === "ends9") next = next.div(10).ceil().times(10).minus(1);
  if (next.lt(0)) next = dec(0);
  return money(next);
}

/**
 * Changes sale rate, MRP or purchase rate for a group of items at once (a brand, category, season, one style, or
 * everything), by a percentage, an amount or a fixed rate, with rounding. A sale rate may not go above the MRP.
 * Each style's own rate moves the same way so new colours and sizes start from the new rate.
 */
export async function updateRates(tx: Tx, actor: Actor, input: RateUpdateInput) {
  const company = await resolveCompany(tx);
  const s = input.scope;
  if (!s.all && !s.brand && !s.category && !s.season && !s.styleId) throw badRequest("scope_required");
  if (input.mode === "set" ? !dec(input.value).gt(0) : !dec(input.value).isFinite() || dec(input.value).isZero()) throw badRequest("invalid_value");
  if (input.mode === "percent" && dec(input.value).lt(-100)) throw badRequest("invalid_value");

  const where = and(
    eq(tables.items.companyId, company.id), eq(tables.items.archived, false), eq(tables.items.kind, "goods"),
    s.brand ? eq(tables.styles.brand, s.brand) : undefined, s.category ? eq(tables.styles.category, s.category) : undefined,
    s.season ? eq(tables.styles.season, s.season) : undefined, s.styleId ? eq(tables.items.styleId, s.styleId) : undefined,
  );
  const rows = await tx.select({
    id: tables.items.id, name: tables.items.name, styleId: tables.items.styleId, mrp: tables.items.mrp,
    saleRate: tables.items.saleRate, purchaseRate: tables.items.purchaseRate, rate: tables.items[input.field],
  }).from(tables.items).leftJoin(tables.styles, eq(tables.styles.id, tables.items.styleId)).where(where).limit(MAX_ITEMS + 1);
  if (rows.length > MAX_ITEMS) throw badRequest("too_many_items");

  const changes = rows.map((r) => {
    const old = r.rate === null ? "0.00" : money(r.rate);
    const next = repriced(old, input.mode, input.value, input.round);
    // A sale rate above the printed MRP cannot be billed.
    const aboveMrp = input.field === "saleRate" && r.mrp !== null && dec(next).gt(r.mrp);
    return { itemId: r.id, name: r.name, styleId: r.styleId, old, new: next, aboveMrp };
  }).filter((c) => c.old !== c.new || c.aboveMrp);
  const blocked = changes.filter((c) => c.aboveMrp);
  if (!input.preview) {
    if (blocked.length) throw badRequest("above_mrp");
    for (const c of changes) await tx.update(tables.items).set({ [input.field]: c.new }).where(eq(tables.items.id, c.itemId));
    const styleIds = [...new Set(changes.flatMap((c) => (c.styleId ? [c.styleId] : [])))];
    if (styleIds.length) {
      const styleRows = await tx.select({ id: tables.styles.id, rate: tables.styles[input.field] }).from(tables.styles).where(inArray(tables.styles.id, styleIds));
      for (const st of styleRows) await tx.update(tables.styles).set({ [input.field]: repriced(st.rate === null ? "0" : st.rate, input.mode, input.value, input.round) }).where(eq(tables.styles.id, st.id));
    }
    await audit(tx, {
      tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "rate_update", entityId: company.id,
      after: { field: input.field, mode: input.mode, value: input.value, round: input.round, scope: s, items: changes.length }, ip: actor.ip,
    });
  }
  // What the change does to the value of the stock in hand: each item's pieces at its old rate and at its new one.
  const positions = changes.length ? await stockPositions(tx, company, businessDate(), { itemIds: changes.map((c) => c.itemId) }) : [];
  const qty = new Map<string, ReturnType<typeof dec>>();
  for (const p of positions) qty.set(p.itemId, (qty.get(p.itemId) ?? dec(0)).plus(p.qty));
  const rowsOut = changes.map(({ styleId: _s, ...r }) => { const q = qty.get(r.itemId) ?? dec(0); return { ...r, stockQty: q.toFixed(0), valueBefore: money(q.times(r.old)), valueAfter: money(q.times(r.new)) }; });
  const sum = (k: "valueBefore" | "valueAfter") => money(rowsOut.reduce((t, r) => t.plus(r[k]), dec(0)));
  return {
    field: input.field, matched: rows.length, changed: changes.length, aboveMrp: blocked.length, applied: !input.preview,
    valuation: { before: sum("valueBefore"), after: sum("valueAfter"), change: money(dec(sum("valueAfter")).minus(sum("valueBefore"))) }, rows: rowsOut.slice(0, 200),
  };
}


// ---- approval ---------------------------------------------------------------------------------------------------

/** Saves a bulk change for someone else to approve, with what it would do (items changed, stock value before and after). */
export async function requestRateUpdate(tx: Tx, actor: Actor, input: Omit<RateUpdateInput, "preview">) {
  const company = await resolveCompany(tx);
  const preview = await updateRates(tx, actor, { ...input, preview: true });
  if (preview.aboveMrp) throw badRequest("above_mrp");
  if (!preview.changed) throw badRequest("nothing_changed");
  const [row] = await tx.insert(tables.rateUpdateRequests).values({
    tenantId: actor.tenantId, companyId: company.id, input: { ...input }, summary: { field: preview.field, changed: preview.changed, valuation: preview.valuation }, requestedBy: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "rate_update_request", entityId: row!.id, after: row!.summary, ip: actor.ip });
  return row!;
}

export async function listRateRequests(tx: Tx) {
  const company = await resolveCompany(tx);
  return tx.select().from(tables.rateUpdateRequests).where(eq(tables.rateUpdateRequests.companyId, company.id)).orderBy(desc(tables.rateUpdateRequests.createdAt)).limit(100);
}

/** Someone other than the person who asked approves (the change is applied now, on today's stock) or rejects it. */
export async function decideRateRequest(tx: Tx, actor: Actor, id: string, decision: "approve" | "reject", note?: string) {
  const [r] = await tx.select().from(tables.rateUpdateRequests).where(eq(tables.rateUpdateRequests.id, id)).for("update");
  if (!r) throw notFound();
  if (r.status !== "pending") throw conflict("already_decided");
  if (r.requestedBy === actor.userId) throw badRequest("cannot_approve_own");
  if (decision === "reject" && !note?.trim()) throw badRequest("note_required");
  if (decision === "approve") await updateRates(tx, actor, { ...(r.input as Omit<RateUpdateInput, "preview">), preview: false });
  const [row] = await tx.update(tables.rateUpdateRequests).set({ status: decision === "approve" ? "approved" : "rejected", decidedBy: actor.userId, decisionNote: note?.trim() || null, decidedAt: new Date() }).where(eq(tables.rateUpdateRequests.id, id)).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: decision === "approve" ? "approve" : "reject", entity: "rate_update_request", entityId: id, after: { note }, ip: actor.ip });
  return row!;
}
