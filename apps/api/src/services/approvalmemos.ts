import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { businessDate, dec, money } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";
import { activeRates } from "./branchprices.js";
import { currentRate, documentNumber, postMoves, type Move } from "./inventory.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

const SERIES = { docType: "approval_memo", name: "Approval memos", pattern: "AM/{FY}/{SEQ:5}" };
const HOLDING = "On approval";
const q4 = (v: string | number | { toString(): string }) => dec(v.toString()).toDecimalPlaces(4).toFixed(4);

/** The holding place for goods out on approval: a warehouse that is not a store, made on first use. Its stock is still the business's. */
async function approvalWarehouse(tx: Tx, tenantId: string, companyId: string) {
  const [w] = await tx.select().from(tables.warehouses).where(and(eq(tables.warehouses.companyId, companyId), eq(tables.warehouses.inTransit, true), eq(tables.warehouses.name, HOLDING)));
  if (w) return w;
  const [made] = await tx.insert(tables.warehouses).values({ tenantId, companyId, name: HOLDING, inTransit: true }).returning();
  return made!;
}

export interface MemoInput {
  warehouseId: string; date: string; customerName: string; customerPhone?: string | undefined; dueBack?: string | undefined; note?: string | undefined;
  lines: { itemId: string; qty: string; rate?: string | undefined }[];
}

/** Hands goods to a customer on approval: they leave the store for the "On approval" place at cost, and the memo records who has them and the rate quoted. */
export async function issueMemo(tx: Tx, actor: Actor, input: MemoInput) {
  const company = await resolveCompany(tx);
  if (!input.lines.length) throw badRequest("no_lines");
  if (input.dueBack && input.dueBack < input.date) throw badRequest("due_before_date");
  const [store] = await tx.select().from(tables.warehouses).where(and(eq(tables.warehouses.id, input.warehouseId), eq(tables.warehouses.companyId, company.id)));
  if (!store || store.inTransit) throw badRequest("unknown_warehouse");
  if (new Set(input.lines.map((l) => l.itemId)).size !== input.lines.length) throw badRequest("item_twice");
  for (const l of input.lines) if (!dec(l.qty).gt(0)) throw badRequest("qty_must_be_positive");
  const its = await tx.select().from(tables.items).where(and(eq(tables.items.companyId, company.id), inArray(tables.items.id, input.lines.map((l) => l.itemId))));
  if (its.length !== input.lines.length || its.some((i) => i.kind !== "goods")) throw badRequest("unknown_item");
  const rates = await activeRates(tx, company.id, store.id, input.date);
  const holding = await approvalWarehouse(tx, actor.tenantId, company.id);
  const number = await documentNumber(tx, actor, company, input.date, SERIES);
  const [memo] = await tx.insert(tables.approvalMemos).values({
    tenantId: actor.tenantId, companyId: company.id, number, date: input.date, warehouseId: store.id, customerName: input.customerName.trim(), customerPhone: input.customerPhone ?? null,
    dueBack: input.dueBack ?? null, note: input.note ?? null, createdBy: actor.userId,
  }).returning();
  await tx.insert(tables.approvalMemoLines).values(input.lines.map((l, i) => ({
    tenantId: actor.tenantId, memoId: memo!.id, lineNo: i + 1, itemId: l.itemId, qty: q4(l.qty), rate: money(l.rate ?? rates.get(l.itemId) ?? its.find((x) => x.id === l.itemId)!.saleRate),
  })));
  const moves: Move[] = [];
  for (const l of input.lines) {
    const cost = await currentRate(tx, company, l.itemId, store.id, input.date);
    moves.push({ itemId: l.itemId, warehouseId: store.id, date: input.date, qtyOut: l.qty }, { itemId: l.itemId, warehouseId: holding.id, date: input.date, qtyIn: l.qty, rate: cost });
  }
  const { warnings } = await postMoves(tx, company, "approval_memo", memo!.id, moves);
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "approval_memo", entityId: memo!.id, after: { number, customer: memo!.customerName, lines: input.lines.length }, ip: actor.ip });
  return { memo: memo!, warnings };
}

/** Brings pieces back from the holding place into the store, at the cost they left at. */
async function moveBack(tx: Tx, actor: Actor, memoId: string, storeId: string, date: string, lines: { itemId: string; qty: string }[], source: "approval_return" | "approval_bill") {
  const company = await resolveCompany(tx);
  const holding = await approvalWarehouse(tx, actor.tenantId, company.id);
  const moves: Move[] = [];
  for (const l of lines) {
    const cost = await currentRate(tx, company, l.itemId, holding.id, date);
    moves.push({ itemId: l.itemId, warehouseId: holding.id, date, qtyOut: l.qty }, { itemId: l.itemId, warehouseId: storeId, date, qtyIn: l.qty, rate: cost });
  }
  await postMoves(tx, company, source, memoId, moves);
}

async function refreshStatus(tx: Tx, memoId: string) {
  const lines = await tx.select().from(tables.approvalMemoLines).where(eq(tables.approvalMemoLines.memoId, memoId));
  const open = lines.some((l) => dec(l.qty).minus(l.returnedQty).minus(l.billedQty).gt(0));
  await tx.update(tables.approvalMemos).set({ status: open ? "open" : "closed" }).where(eq(tables.approvalMemos.id, memoId));
}

/** The customer hands pieces back: they return to the store. */
export async function returnFromMemo(tx: Tx, actor: Actor, id: string, input: { date: string; lines: { lineId: string; qty: string }[] }) {
  const [memo] = await tx.select().from(tables.approvalMemos).where(eq(tables.approvalMemos.id, id)).for("update");
  if (!memo) throw notFound();
  if (memo.status !== "open") throw conflict("memo_closed");
  const lines = await tx.select().from(tables.approvalMemoLines).where(eq(tables.approvalMemoLines.memoId, id)).for("update");
  const back: { itemId: string; qty: string }[] = [];
  for (const r of input.lines) {
    const l = lines.find((x) => x.id === r.lineId);
    if (!l) throw badRequest("unknown_line");
    if (!dec(r.qty).gt(0)) throw badRequest("qty_must_be_positive");
    if (dec(r.qty).gt(dec(l.qty).minus(l.returnedQty).minus(l.billedQty))) throw badRequest("more_than_out");
    back.push({ itemId: l.itemId, qty: r.qty });
    await tx.update(tables.approvalMemoLines).set({ returnedQty: q4(dec(l.returnedQty).plus(r.qty)) }).where(eq(tables.approvalMemoLines.id, l.id));
  }
  if (!back.length) throw badRequest("no_lines");
  await moveBack(tx, actor, id, memo.warehouseId, input.date, back, "approval_return");
  await refreshStatus(tx, id);
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "approval_memo", entityId: id, after: { returned: back.length }, ip: actor.ip });
}

/**
 * The customer keeps pieces and they are billed at the counter: they come back to the store first (the counter bill then sells them from there)
 * and the memo records what was billed. Called from the counter bill, so it either all happens or none of it does.
 */
export async function billFromMemo(tx: Tx, actor: Actor, memoId: string, storeId: string, date: string, billed: { itemId: string; qty: string }[]) {
  const [memo] = await tx.select().from(tables.approvalMemos).where(eq(tables.approvalMemos.id, memoId)).for("update");
  if (!memo) throw notFound("unknown_memo");
  if (memo.status !== "open") throw conflict("memo_closed");
  if (memo.warehouseId !== storeId) throw badRequest("memo_other_store");
  const lines = await tx.select().from(tables.approvalMemoLines).where(eq(tables.approvalMemoLines.memoId, memoId)).for("update");
  const take: { itemId: string; qty: string }[] = [];
  for (const b of billed) {
    const l = lines.find((x) => x.itemId === b.itemId);
    if (!l) continue; // a piece on the bill that was not on the memo is simply sold from stock
    const left = dec(l.qty).minus(l.returnedQty).minus(l.billedQty);
    const n = dec(b.qty).lt(left) ? dec(b.qty) : left;
    if (n.lte(0)) continue;
    take.push({ itemId: b.itemId, qty: n.toFixed(4) });
    await tx.update(tables.approvalMemoLines).set({ billedQty: q4(dec(l.billedQty).plus(n)) }).where(eq(tables.approvalMemoLines.id, l.id));
  }
  if (!take.length) throw badRequest("nothing_on_memo");
  await moveBack(tx, actor, memoId, storeId, date, take, "approval_bill");
  await refreshStatus(tx, memoId);
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "approval_memo", entityId: memoId, after: { billed: take.length }, ip: actor.ip });
}

export async function listMemos(tx: Tx, status?: "open" | "closed", today = businessDate()) {
  const company = await resolveCompany(tx);
  const memos = await tx.select({ m: tables.approvalMemos, store: tables.warehouses.name }).from(tables.approvalMemos).innerJoin(tables.warehouses, eq(tables.warehouses.id, tables.approvalMemos.warehouseId))
    .where(and(eq(tables.approvalMemos.companyId, company.id), status ? eq(tables.approvalMemos.status, status) : undefined)).orderBy(desc(tables.approvalMemos.date), desc(tables.approvalMemos.number)).limit(300);
  if (!memos.length) return [];
  const lines = await tx.select().from(tables.approvalMemoLines).where(inArray(tables.approvalMemoLines.memoId, memos.map((x) => x.m.id)));
  return memos.map(({ m, store }) => {
    const mine = lines.filter((l) => l.memoId === m.id);
    const out = mine.reduce((t, l) => t.plus(dec(l.qty).minus(l.returnedQty).minus(l.billedQty)), dec(0));
    const value = mine.reduce((t, l) => t.plus(dec(l.qty).minus(l.returnedQty).minus(l.billedQty).times(l.rate)), dec(0));
    return { id: m.id, number: m.number, date: m.date, store, customerName: m.customerName, customerPhone: m.customerPhone, dueBack: m.dueBack, status: m.status, piecesOut: out.toFixed(0), valueOut: money(value), overdue: m.status === "open" && !!m.dueBack && m.dueBack < today };
  });
}

export async function getMemo(tx: Tx, id: string) {
  const [m] = await tx.select({ m: tables.approvalMemos, store: tables.warehouses.name }).from(tables.approvalMemos).innerJoin(tables.warehouses, eq(tables.warehouses.id, tables.approvalMemos.warehouseId)).where(eq(tables.approvalMemos.id, id));
  if (!m) throw notFound();
  const lines = await tx.select({ l: tables.approvalMemoLines, name: tables.items.name }).from(tables.approvalMemoLines).innerJoin(tables.items, eq(tables.items.id, tables.approvalMemoLines.itemId))
    .where(eq(tables.approvalMemoLines.memoId, id)).orderBy(asc(tables.approvalMemoLines.lineNo));
  return {
    ...m.m, store: m.store,
    lines: lines.map(({ l, name }) => ({ id: l.id, itemId: l.itemId, name, qty: l.qty, rate: l.rate, returnedQty: l.returnedQty, billedQty: l.billedQty, outQty: dec(l.qty).minus(l.returnedQty).minus(l.billedQty).toFixed(4) })),
  };
}

export async function memoByNumber(tx: Tx, number: string) {
  const company = await resolveCompany(tx);
  const [m] = await tx.select({ id: tables.approvalMemos.id }).from(tables.approvalMemos).where(and(eq(tables.approvalMemos.companyId, company.id), eq(tables.approvalMemos.number, number.trim())));
  if (!m) throw notFound("unknown_memo");
  return getMemo(tx, m.id);
}
