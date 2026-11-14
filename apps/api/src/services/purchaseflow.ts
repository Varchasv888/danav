import { and, eq, inArray } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec, money } from "@varchasv/domain";
import { notFound } from "../lib/errors.js";

/**
 * The trail of one purchase: purchase order, goods receipt (inward challan), supplier bill, payment, and any returns to the
 * supplier. Starting from any one document it finds the others it is linked to, so every purchase screen can show where the
 * document came from and what is still open. Nothing here changes data.
 */
export type PurchaseKind = "order" | "receipt" | "bill" | "return";
export type PurchaseStep = "order" | "receipt" | "bill" | "payment";
export interface PurchaseDoc { id: string; number: string; date: string; status: string; href: string; amount?: string }
export interface PurchaseFlowResult {
  current: PurchaseStep | "return";
  steps: Record<PurchaseStep, PurchaseDoc[]>;
  returns: PurchaseDoc[];
  /** Money on the posted bills of this trail: billed, paid through payments, returned to the supplier, and what is still owed. */
  money: { billed: string; paid: string; returned: string; outstanding: string; status: "none" | "unpaid" | "part" | "paid" };
  supplierId: string | null;
}

const doc = (id: string, number: string, date: string, status: string, href: string, amount?: string): PurchaseDoc => ({ id, number, date, status, href, ...(amount ? { amount } : {}) });
const NONE = "00000000-0000-0000-0000-000000000000";

export async function purchaseFlow(tx: Tx, kind: PurchaseKind, id: string): Promise<PurchaseFlowResult> {
  let orderId: string | null = null;
  let supplierId: string | null = null;
  const receiptIds = new Set<string>();
  const billIds = new Set<string>();
  let current: PurchaseFlowResult["current"] = kind === "return" ? "return" : kind;

  if (kind === "order") {
    const [o] = await tx.select({ id: tables.purchaseOrders.id, supplierId: tables.purchaseOrders.supplierId }).from(tables.purchaseOrders).where(eq(tables.purchaseOrders.id, id));
    if (!o) throw notFound();
    orderId = o.id; supplierId = o.supplierId;
  } else if (kind === "receipt") {
    const [r] = await tx.select({ id: tables.goodsReceipts.id, orderId: tables.goodsReceipts.orderId, supplierId: tables.goodsReceipts.supplierId }).from(tables.goodsReceipts).where(eq(tables.goodsReceipts.id, id));
    if (!r) throw notFound();
    receiptIds.add(r.id); orderId = r.orderId; supplierId = r.supplierId;
  } else {
    let billId = id;
    if (kind === "return") {
      const [r] = await tx.select({ billId: tables.purchaseReturns.billId }).from(tables.purchaseReturns).where(eq(tables.purchaseReturns.id, id));
      if (!r) throw notFound();
      billId = r.billId;
    }
    const [b] = await tx.select({ id: tables.purchaseBills.id, orderId: tables.purchaseBills.orderId, supplierId: tables.purchaseBills.supplierId }).from(tables.purchaseBills).where(eq(tables.purchaseBills.id, billId));
    if (!b) throw notFound();
    billIds.add(b.id); orderId = b.orderId; supplierId = b.supplierId;
    current = kind === "return" ? "return" : "bill";
  }

  // From the order: its receipts and bills.
  if (orderId) {
    for (const r of await tx.select({ id: tables.goodsReceipts.id }).from(tables.goodsReceipts).where(eq(tables.goodsReceipts.orderId, orderId))) receiptIds.add(r.id);
    for (const b of await tx.select({ id: tables.purchaseBills.id }).from(tables.purchaseBills).where(eq(tables.purchaseBills.orderId, orderId))) billIds.add(b.id);
  }
  // Receipts and bills are joined by the bill lines that bill a receipt line.
  if (receiptIds.size) {
    const rows = await tx.select({ billId: tables.purchaseBillLines.billId }).from(tables.purchaseBillLines)
      .innerJoin(tables.goodsReceiptLines, eq(tables.goodsReceiptLines.id, tables.purchaseBillLines.receiptLineId))
      .where(inArray(tables.goodsReceiptLines.receiptId, [...receiptIds]));
    for (const r of rows) billIds.add(r.billId);
  }
  if (billIds.size) {
    const rows = await tx.select({ receiptId: tables.goodsReceiptLines.receiptId }).from(tables.goodsReceiptLines)
      .innerJoin(tables.purchaseBillLines, eq(tables.purchaseBillLines.receiptLineId, tables.goodsReceiptLines.id))
      .where(inArray(tables.purchaseBillLines.billId, [...billIds]));
    for (const r of rows) receiptIds.add(r.receiptId);
  }
  // A receipt or bill found only through its lines may carry the order the others missed.
  if (!orderId && receiptIds.size) {
    const [r] = await tx.select({ orderId: tables.goodsReceipts.orderId }).from(tables.goodsReceipts).where(inArray(tables.goodsReceipts.id, [...receiptIds]));
    orderId = r?.orderId ?? null;
  }

  const steps: PurchaseFlowResult["steps"] = { order: [], receipt: [], bill: [], payment: [] };
  if (orderId) {
    const [o] = await tx.select().from(tables.purchaseOrders).where(eq(tables.purchaseOrders.id, orderId));
    if (o) steps.order.push(doc(o.id, o.number, o.date, o.status, `/purchase/orders/${o.id}`, o.total));
  }
  if (receiptIds.size) {
    for (const r of await tx.select().from(tables.goodsReceipts).where(inArray(tables.goodsReceipts.id, [...receiptIds]))) steps.receipt.push(doc(r.id, r.number, r.date, r.status, `/purchase/receipts/${r.id}`));
  }
  const bills = billIds.size ? await tx.select().from(tables.purchaseBills).where(inArray(tables.purchaseBills.id, [...billIds])) : [];
  for (const b of bills) steps.bill.push(doc(b.id, b.number, b.date, b.status, `/purchase/bills/${b.id}`, b.total));

  const back = bills.length ? await tx.select().from(tables.purchaseReturns).where(and(inArray(tables.purchaseReturns.billId, bills.map((b) => b.id)), eq(tables.purchaseReturns.status, "posted"))) : [];
  const returns = back.map((r) => doc(r.id, r.number, r.date, r.status, `/purchase/returns/${r.id}`, r.total));

  // Payments: money allocated to the vouchers of the posted bills.
  const live = bills.filter((b) => b.status === "posted" && b.voucherId);
  let paid = dec(0);
  if (live.length) {
    const alloc = await tx.select({ voucherId: tables.billAllocations.voucherId, amount: tables.billAllocations.amount }).from(tables.billAllocations)
      .where(inArray(tables.billAllocations.billVoucherId, live.map((b) => b.voucherId!)));
    paid = alloc.reduce((s, a) => s.plus(a.amount), dec(0));
    const paymentIds = [...new Set(alloc.map((a) => a.voucherId))];
    if (paymentIds.length) {
      for (const v of await tx.select().from(tables.vouchers).where(inArray(tables.vouchers.id, paymentIds.length ? paymentIds : [NONE]))) {
        if (v.status === "posted") steps.payment.push(doc(v.id, v.number, v.date, v.status, `/accounts/vouchers/${v.id}`, alloc.filter((a) => a.voucherId === v.id).reduce((s, a) => s.plus(a.amount), dec(0)).toFixed(2)));
      }
    }
  }
  const billed = live.reduce((s, b) => s.plus(b.total), dec(0));
  const returned = back.reduce((s, r) => s.plus(r.total), dec(0));
  const outstanding = billed.minus(paid).minus(returned);
  const status = !live.length ? "none" : outstanding.lte(0) ? "paid" : paid.gt(0) || returned.gt(0) ? "part" : "unpaid";
  const byDate = (a: PurchaseDoc, b: PurchaseDoc) => a.date.localeCompare(b.date) || a.number.localeCompare(b.number);
  for (const k of Object.keys(steps) as PurchaseStep[]) steps[k].sort(byDate);
  returns.sort(byDate);
  return { current, steps, returns, supplierId, money: { billed: money(billed), paid: money(paid), returned: money(returned), outstanding: money(outstanding.lt(0) ? 0 : outstanding), status } };
}
