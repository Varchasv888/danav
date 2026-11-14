import { and, asc, eq, lte } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec, money } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";
import { currentRate, documentNumber, ensureInventory, postMoves, reverseMoves } from "./inventory.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }
type Company = Awaited<ReturnType<typeof resolveCompany>>;

export const JOB_WORK_SERIES = {
  out: { docType: "job_work_out", name: "Job work challans (sent)", pattern: "JWO/{FY}/{SEQ:5}" },
  in: { docType: "job_work_in", name: "Job work receipts", pattern: "JWI/{FY}/{SEQ:5}" },
};
const q4 = (v: string | ReturnType<typeof dec>) => dec(v).toDecimalPlaces(4).toFixed(4);
const addYears = (iso: string, n: number) => `${Number(iso.slice(0, 4)) + n}${iso.slice(4)}`;

/** Goods at a job worker stay ours, in a warehouse of their own. */
async function jobWorkerWarehouse(tx: Tx, company: Company, jobWorker: { id: string; name: string }) {
  const [w] = await tx.select().from(tables.warehouses).where(and(eq(tables.warehouses.companyId, company.id), eq(tables.warehouses.jobWorkerId, jobWorker.id)));
  if (w) return w.id;
  const [created] = await tx.insert(tables.warehouses).values({ tenantId: company.tenantId, companyId: company.id, name: `Job work · ${jobWorker.name}`, jobWorkerId: jobWorker.id }).returning();
  return created!.id;
}

async function loadJobWorker(tx: Tx, companyId: string, id: string) {
  const [row] = await tx.select({ a: tables.accounts, groupKey: tables.accountGroups.key }).from(tables.accounts)
    .innerJoin(tables.accountGroups, eq(tables.accountGroups.id, tables.accounts.groupId)).where(eq(tables.accounts.id, id));
  if (!row || row.a.companyId !== companyId) throw badRequest("unknown_job_worker");
  if (row.groupKey !== "sundry_creditors" && row.groupKey !== "sundry_debtors") throw badRequest("unknown_job_worker");
  return row.a;
}

export interface SendInput {
  date: string; jobWorkerId: string; process?: string | undefined; fromWarehouseId?: string | undefined;
  lines: { itemId: string; qty: string; capitalGoods?: boolean | undefined }[];
}

/** Inputs sent for job work on a delivery challan (no tax): they move to the job worker's warehouse at cost. */
export async function sendForJobWork(tx: Tx, actor: Actor, input: SendInput) {
  const company = await resolveCompany(tx);
  await ensureInventory(tx, actor.tenantId, company.id);
  const worker = await loadJobWorker(tx, company.id, input.jobWorkerId);
  if (!input.lines.length) throw badRequest("no_lines");
  const [main] = await tx.select().from(tables.warehouses).where(and(eq(tables.warehouses.companyId, company.id), eq(tables.warehouses.isDefault, true)));
  const from = input.fromWarehouseId ?? main!.id;
  const to = await jobWorkerWarehouse(tx, company, worker);
  const lines = [];
  for (const l of input.lines) {
    if (!dec(l.qty).gt(0)) throw badRequest("qty_must_be_positive");
    lines.push({ itemId: l.itemId, qty: q4(l.qty), rate: await currentRate(tx, company, l.itemId, from, input.date), ...(l.capitalGoods ? { capitalGoods: true } : {}) });
  }
  const number = await documentNumber(tx, actor, company, input.date, JOB_WORK_SERIES.out);
  const [ch] = await tx.insert(tables.jobWorkChallans).values({
    tenantId: actor.tenantId, companyId: company.id, number, date: input.date, direction: "out", jobWorkerId: worker.id, process: input.process ?? null, lines, createdBy: actor.userId,
  }).returning();
  const { warnings } = await postMoves(tx, company, "job_work", ch!.id, lines.flatMap((l) => [
    { itemId: l.itemId, warehouseId: from, date: input.date, qtyOut: l.qty },
    { itemId: l.itemId, warehouseId: to, date: input.date, qtyIn: l.qty, rate: l.rate },
  ]));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "job_work", entityId: ch!.id, after: { number, jobWorker: worker.name, lines: lines.length }, ip: actor.ip });
  return { challan: ch!, warnings };
}

/** What of a sent challan is still with the job worker, per item. */
async function outstanding(tx: Tx, sent: typeof tables.jobWorkChallans.$inferSelect) {
  const back = await tx.select().from(tables.jobWorkChallans).where(and(eq(tables.jobWorkChallans.sentChallanId, sent.id), eq(tables.jobWorkChallans.status, "posted")));
  return sent.lines.map((l) => {
    const used = back.reduce((s, b) => s.plus(b.consumed.filter((c) => c.itemId === l.itemId).reduce((t, c) => t.plus(c.qty), dec(0))), dec(0));
    return { ...l, pending: q4(dec(l.qty).minus(used)) };
  });
}

export interface ReceiveInput {
  date: string; sentChallanId: string; toWarehouseId?: string | undefined; charges?: string | undefined;
  received: { itemId: string; qty: string }[];
  /** Inputs used up for what came back (including process waste). */
  consumed: { itemId: string; qty: string }[];
}

/**
 * Goods back from the job worker: the inputs used leave their warehouse; what came back (processed or
 * the same inputs) comes into stock at the inputs' cost plus the job charges, shared by quantity.
 * The job worker's bill for the charges is entered as a purchase bill.
 */
export async function receiveFromJobWork(tx: Tx, actor: Actor, input: ReceiveInput) {
  const [sent] = await tx.select().from(tables.jobWorkChallans).where(eq(tables.jobWorkChallans.id, input.sentChallanId)).for("update");
  if (!sent || sent.direction !== "out") throw badRequest("unknown_challan");
  if (sent.status !== "posted") throw conflict("challan_cancelled");
  if (!input.received.length || !input.consumed.length) throw badRequest("no_lines");
  const company = await resolveCompany(tx, sent.companyId);
  const pending = await outstanding(tx, sent);
  let inputCost = dec(0);
  for (const c of input.consumed) {
    const p = pending.find((x) => x.itemId === c.itemId);
    if (!p) throw badRequest("item_not_sent");
    if (!dec(c.qty).gt(0) || dec(c.qty).gt(p.pending)) throw badRequest("more_than_sent");
    inputCost = inputCost.plus(dec(c.qty).times(p.rate));
  }
  const totalQty = input.received.reduce((s, r) => s.plus(r.qty), dec(0));
  if (!totalQty.gt(0)) throw badRequest("qty_must_be_positive");
  const rate = inputCost.plus(input.charges ?? 0).div(totalQty).toDecimalPlaces(4).toFixed(4);
  const worker = await loadJobWorker(tx, company.id, sent.jobWorkerId);
  const jwWarehouse = await jobWorkerWarehouse(tx, company, worker);
  const [main] = await tx.select().from(tables.warehouses).where(and(eq(tables.warehouses.companyId, company.id), eq(tables.warehouses.isDefault, true)));
  const to = input.toWarehouseId ?? main!.id;
  const number = await documentNumber(tx, actor, company, input.date, JOB_WORK_SERIES.in);
  const [ch] = await tx.insert(tables.jobWorkChallans).values({
    tenantId: actor.tenantId, companyId: company.id, number, date: input.date, direction: "in", jobWorkerId: worker.id, process: sent.process, sentChallanId: sent.id,
    lines: input.received.map((r) => ({ itemId: r.itemId, qty: q4(r.qty), rate })), consumed: input.consumed.map((c) => ({ itemId: c.itemId, qty: q4(c.qty) })),
    charges: money(input.charges ?? 0), createdBy: actor.userId,
  }).returning();
  const { warnings } = await postMoves(tx, company, "job_work", ch!.id, [
    ...input.consumed.map((c) => ({ itemId: c.itemId, warehouseId: jwWarehouse, date: input.date, qtyOut: q4(c.qty) })),
    ...input.received.map((r) => ({ itemId: r.itemId, warehouseId: to, date: input.date, qtyIn: q4(r.qty), rate })),
  ]);
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "job_work", entityId: ch!.id, after: { number, from: sent.number, rate }, ip: actor.ip });
  return { challan: ch!, rate, warnings };
}

export async function cancelJobWork(tx: Tx, actor: Actor, id: string, reason: string) {
  const [ch] = await tx.select().from(tables.jobWorkChallans).where(eq(tables.jobWorkChallans.id, id)).for("update");
  if (!ch) throw notFound();
  if (ch.status !== "posted") throw conflict("already_cancelled");
  if (ch.direction === "out") {
    const [back] = await tx.select({ id: tables.jobWorkChallans.id }).from(tables.jobWorkChallans).where(and(eq(tables.jobWorkChallans.sentChallanId, id), eq(tables.jobWorkChallans.status, "posted"))).limit(1);
    if (back) throw conflict("challan_has_receipts");
  }
  await reverseMoves(tx, "job_work", id);
  await tx.update(tables.jobWorkChallans).set({ status: "cancelled" }).where(eq(tables.jobWorkChallans.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "cancel", entity: "job_work", entityId: id, after: { reason }, ip: actor.ip });
}

export async function listJobWork(tx: Tx, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const rows = await tx.select({ ch: tables.jobWorkChallans, worker: tables.accounts.name }).from(tables.jobWorkChallans)
    .innerJoin(tables.accounts, eq(tables.accounts.id, tables.jobWorkChallans.jobWorkerId))
    .where(eq(tables.jobWorkChallans.companyId, company.id)).orderBy(asc(tables.jobWorkChallans.date), asc(tables.jobWorkChallans.number));
  const out = [];
  for (const r of rows) out.push({ ...r.ch, jobWorker: r.worker, pending: r.ch.direction === "out" && r.ch.status === "posted" ? await outstanding(tx, r.ch) : null });
  return out.reverse();
}

/**
 * ITC-04 for a half-year (April–September or October–March): inputs and capital goods sent, what came
 * back, and what is still with job workers with its return deadline — one year for inputs, three for
 * capital goods, after which the goods count as supplied (and tax is due).
 */
export async function itc04(tx: Tx, from: string, to: string, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const rows = await tx.select({ ch: tables.jobWorkChallans, worker: tables.accounts }).from(tables.jobWorkChallans)
    .innerJoin(tables.accounts, eq(tables.accounts.id, tables.jobWorkChallans.jobWorkerId))
    .where(and(eq(tables.jobWorkChallans.companyId, company.id), eq(tables.jobWorkChallans.status, "posted"), lte(tables.jobWorkChallans.date, to)))
    .orderBy(asc(tables.jobWorkChallans.date));
  const itemIds = [...new Set(rows.flatMap((r) => [...r.ch.lines.map((l) => l.itemId), ...r.ch.consumed.map((c) => c.itemId)]))];
  const its = itemIds.length ? await tx.select({ item: tables.items, uom: tables.uoms.code }).from(tables.items).innerJoin(tables.uoms, eq(tables.uoms.id, tables.items.uomId)).where(eq(tables.items.companyId, company.id)) : [];
  const info = (id: string) => its.find((i) => i.item.id === id);
  const inRange = (d: string) => d >= from && d <= to;
  const sent = rows.filter((r) => r.ch.direction === "out" && inRange(r.ch.date)).flatMap((r) => r.ch.lines.map((l) => ({
    challan: r.ch.number, date: r.ch.date, jobWorker: r.worker.name, gstin: r.worker.gstin, stateCode: r.worker.stateCode, itemId: l.itemId,
    item: info(l.itemId)?.item.name, hsn: info(l.itemId)?.item.hsn, uqc: info(l.itemId)?.uom, qty: l.qty, value: money(dec(l.qty).times(l.rate)), type: l.capitalGoods ? "capital_goods" : "inputs",
  })));
  const received = rows.filter((r) => r.ch.direction === "in" && inRange(r.ch.date)).flatMap((r) => {
    const original = rows.find((x) => x.ch.id === r.ch.sentChallanId)!;
    return r.ch.lines.map((l) => ({
      challan: r.ch.number, date: r.ch.date, originalChallan: original.ch.number, originalDate: original.ch.date, jobWorker: r.worker.name, gstin: r.worker.gstin,
      item: info(l.itemId)?.item.name, hsn: info(l.itemId)?.item.hsn, uqc: info(l.itemId)?.uom, qty: l.qty,
    }));
  });
  const pending = [];
  for (const r of rows.filter((x) => x.ch.direction === "out")) {
    for (const p of await outstanding(tx, r.ch)) {
      if (!dec(p.pending).gt(0)) continue;
      const due = addYears(r.ch.date, p.capitalGoods ? 3 : 1);
      pending.push({ challan: r.ch.number, date: r.ch.date, jobWorker: r.worker.name, item: info(p.itemId)?.item.name, qty: p.pending, value: money(dec(p.pending).times(p.rate)), returnBy: due, overdue: due < to });
    }
  }
  return { from, to, sent, received, pending };
}


