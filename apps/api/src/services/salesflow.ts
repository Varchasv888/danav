import { and, eq, inArray } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec, money } from "@varchasv/domain";
import { notFound } from "../lib/errors.js";

/**
 * The trail of one sale: quotation, sales order, delivery order, delivery challan, invoice, receipt, and any credit notes.
 * Starting from any one document it finds the others it is linked to, so every screen in the chain can show where the
 * document came from and what is still open. Nothing here changes data.
 */
export type FlowKind = "quotation" | "order" | "deliveryOrder" | "challan" | "invoice" | "creditNote";
export type FlowStep = "quotation" | "order" | "deliveryOrder" | "challan" | "invoice" | "receipt";
export interface FlowDoc { id: string; number: string; date: string; status: string; href: string; amount?: string }
export interface FlowResult {
  current: FlowStep | "creditNote";
  steps: Record<FlowStep, FlowDoc[]>;
  creditNotes: FlowDoc[];
  /** Money on the invoices of this trail: billed, received through receipts, credited, and what is still owed. */
  money: { billed: string; received: string; credited: string; outstanding: string; status: "none" | "unpaid" | "part" | "paid" };
  customerId: string | null;
}

const doc = (id: string, number: string, date: string, status: string, href: string, amount?: string): FlowDoc => ({ id, number, date, status, href, ...(amount ? { amount } : {}) });

export async function salesFlow(tx: Tx, kind: FlowKind, id: string): Promise<FlowResult> {
  let quotationId: string | null = null;
  let orderId: string | null = null;
  const noteIds = new Set<string>();
  const deliveryOrderIds = new Set<string>();
  const invoiceIds = new Set<string>();
  let customerId: string | null = null;
  let current: FlowResult["current"] = kind === "creditNote" ? "creditNote" : kind === "deliveryOrder" ? "deliveryOrder" : kind === "challan" ? "challan" : kind;

  if (kind === "quotation") {
    const [q] = await tx.select({ id: tables.quotations.id, customerId: tables.quotations.customerId }).from(tables.quotations).where(eq(tables.quotations.id, id));
    if (!q) throw notFound();
    quotationId = q.id; customerId = q.customerId;
    const [o] = await tx.select({ id: tables.salesOrders.id }).from(tables.salesOrders).where(eq(tables.salesOrders.quotationId, q.id)).limit(1);
    orderId = o?.id ?? null;
    for (const inv of await tx.select({ id: tables.salesInvoices.id }).from(tables.salesInvoices).where(eq(tables.salesInvoices.quotationId, q.id))) invoiceIds.add(inv.id);
  } else if (kind === "order") {
    const [o] = await tx.select({ id: tables.salesOrders.id, quotationId: tables.salesOrders.quotationId, customerId: tables.salesOrders.customerId }).from(tables.salesOrders).where(eq(tables.salesOrders.id, id));
    if (!o) throw notFound();
    orderId = o.id; quotationId = o.quotationId; customerId = o.customerId;
  } else if (kind === "deliveryOrder") {
    const [d] = await tx.select({ id: tables.deliveryOrders.id, orderId: tables.deliveryOrders.orderId, customerId: tables.deliveryOrders.customerId }).from(tables.deliveryOrders).where(eq(tables.deliveryOrders.id, id));
    if (!d) throw notFound();
    deliveryOrderIds.add(d.id); orderId = d.orderId; customerId = d.customerId;
  } else if (kind === "challan") {
    const [n] = await tx.select({ id: tables.deliveryNotes.id, orderId: tables.deliveryNotes.orderId, customerId: tables.deliveryNotes.customerId }).from(tables.deliveryNotes).where(eq(tables.deliveryNotes.id, id));
    if (!n) throw notFound();
    noteIds.add(n.id); orderId = n.orderId; customerId = n.customerId;
  } else {
    let invoiceId = id;
    if (kind === "creditNote") {
      const [c] = await tx.select({ invoiceId: tables.creditNotes.invoiceId }).from(tables.creditNotes).where(eq(tables.creditNotes.id, id));
      if (!c) throw notFound();
      invoiceId = c.invoiceId;
    }
    const [i] = await tx.select({ id: tables.salesInvoices.id, orderId: tables.salesInvoices.orderId, quotationId: tables.salesInvoices.quotationId, customerId: tables.salesInvoices.customerId }).from(tables.salesInvoices).where(eq(tables.salesInvoices.id, invoiceId));
    if (!i) throw notFound();
    invoiceIds.add(i.id); orderId = i.orderId; quotationId = i.quotationId; customerId = i.customerId;
    current = kind === "creditNote" ? "creditNote" : "invoice";
  }

  // From the order: its quotation, delivery orders, challans and invoices.
  const expandOrder = async () => {
    if (!orderId) return;
    const [o] = await tx.select({ quotationId: tables.salesOrders.quotationId, customerId: tables.salesOrders.customerId }).from(tables.salesOrders).where(eq(tables.salesOrders.id, orderId));
    if (o) { quotationId ||= o.quotationId; customerId ||= o.customerId; }
    for (const d of await tx.select({ id: tables.deliveryOrders.id }).from(tables.deliveryOrders).where(eq(tables.deliveryOrders.orderId, orderId))) deliveryOrderIds.add(d.id);
    for (const n of await tx.select({ id: tables.deliveryNotes.id }).from(tables.deliveryNotes).where(eq(tables.deliveryNotes.orderId, orderId))) noteIds.add(n.id);
    for (const i of await tx.select({ id: tables.salesInvoices.id }).from(tables.salesInvoices).where(eq(tables.salesInvoices.orderId, orderId))) invoiceIds.add(i.id);
  };
  await expandOrder();
  // Challans of a delivery order are the ones whose lines point at its lines.
  if (deliveryOrderIds.size) {
    const rows = await tx.select({ noteId: tables.deliveryNoteLines.noteId }).from(tables.deliveryNoteLines)
      .innerJoin(tables.deliveryOrderLines, eq(tables.deliveryOrderLines.id, tables.deliveryNoteLines.deliveryOrderLineId))
      .where(inArray(tables.deliveryOrderLines.deliveryOrderId, [...deliveryOrderIds]));
    for (const r of rows) noteIds.add(r.noteId);
  }
  // Challans and invoices are joined by the invoice lines that bill a challan line.
  if (noteIds.size) {
    const rows = await tx.select({ invoiceId: tables.salesInvoiceLines.invoiceId }).from(tables.salesInvoiceLines)
      .innerJoin(tables.deliveryNoteLines, eq(tables.deliveryNoteLines.id, tables.salesInvoiceLines.deliveryLineId))
      .where(inArray(tables.deliveryNoteLines.noteId, [...noteIds]));
    for (const r of rows) invoiceIds.add(r.invoiceId);
  }
  if (invoiceIds.size) {
    const rows = await tx.select({ noteId: tables.deliveryNoteLines.noteId }).from(tables.deliveryNoteLines)
      .innerJoin(tables.salesInvoiceLines, eq(tables.salesInvoiceLines.deliveryLineId, tables.deliveryNoteLines.id))
      .where(inArray(tables.salesInvoiceLines.invoiceId, [...invoiceIds]));
    for (const r of rows) noteIds.add(r.noteId);
    for (const n of await tx.select({ orderId: tables.deliveryNotes.orderId }).from(tables.deliveryNotes).where(inArray(tables.deliveryNotes.id, [...noteIds].length ? [...noteIds] : ["00000000-0000-0000-0000-000000000000"]))) orderId ||= n.orderId;
  }

  // A challan may be made from a delivery order without naming the sales order: the order is then found through the delivery order.
  if (noteIds.size) {
    const rows = await tx.select({ deliveryOrderId: tables.deliveryOrderLines.deliveryOrderId, orderId: tables.deliveryOrders.orderId }).from(tables.deliveryNoteLines)
      .innerJoin(tables.deliveryOrderLines, eq(tables.deliveryOrderLines.id, tables.deliveryNoteLines.deliveryOrderLineId))
      .innerJoin(tables.deliveryOrders, eq(tables.deliveryOrders.id, tables.deliveryOrderLines.deliveryOrderId))
      .where(inArray(tables.deliveryNoteLines.noteId, [...noteIds]));
    for (const r of rows) { deliveryOrderIds.add(r.deliveryOrderId); orderId ||= r.orderId; }
    await expandOrder();
  }

  const steps: FlowResult["steps"] = { quotation: [], order: [], deliveryOrder: [], challan: [], invoice: [], receipt: [] };
  if (quotationId) {
    const [q] = await tx.select().from(tables.quotations).where(eq(tables.quotations.id, quotationId));
    if (q) steps.quotation.push(doc(q.id, q.number, q.date, q.status, `/sales/quotations/${q.id}`, q.total));
  }
  if (orderId) {
    const [o] = await tx.select().from(tables.salesOrders).where(eq(tables.salesOrders.id, orderId));
    if (o) steps.order.push(doc(o.id, o.number, o.date, o.status, `/sales/orders/${o.id}`, o.total));
  }
  if (deliveryOrderIds.size) {
    for (const d of await tx.select().from(tables.deliveryOrders).where(inArray(tables.deliveryOrders.id, [...deliveryOrderIds]))) steps.deliveryOrder.push(doc(d.id, d.number, d.date, d.status, `/sales/delivery-orders/${d.id}`));
  }
  if (noteIds.size) {
    for (const n of await tx.select().from(tables.deliveryNotes).where(inArray(tables.deliveryNotes.id, [...noteIds]))) steps.challan.push(doc(n.id, n.number, n.date, n.status, `/sales/deliveries/${n.id}`, n.total));
  }
  const invoices = invoiceIds.size ? await tx.select().from(tables.salesInvoices).where(inArray(tables.salesInvoices.id, [...invoiceIds])) : [];
  for (const i of invoices) steps.invoice.push(doc(i.id, i.number, i.date, i.status, `/sales/invoices/${i.id}`, i.total));

  const credit = invoices.length ? await tx.select().from(tables.creditNotes).where(and(inArray(tables.creditNotes.invoiceId, invoices.map((i) => i.id)), eq(tables.creditNotes.status, "posted"))) : [];
  const creditNotes = credit.map((c) => doc(c.id, c.number, c.date, c.status, `/sales/credit-notes/${c.id}`, c.total));

  // Receipts: money allocated to the vouchers of the posted invoices.
  const live = invoices.filter((i) => i.status === "posted" && i.voucherId);
  let received = dec(0);
  if (live.length) {
    const alloc = await tx.select({ voucherId: tables.billAllocations.voucherId, amount: tables.billAllocations.amount }).from(tables.billAllocations)
      .where(inArray(tables.billAllocations.billVoucherId, live.map((i) => i.voucherId!)));
    received = alloc.reduce((s, a) => s.plus(a.amount), dec(0));
    const receiptIds = [...new Set(alloc.map((a) => a.voucherId))];
    if (receiptIds.length) {
      for (const v of await tx.select().from(tables.vouchers).where(inArray(tables.vouchers.id, receiptIds))) {
        if (v.status === "posted") steps.receipt.push(doc(v.id, v.number, v.date, v.status, `/accounts/vouchers/${v.id}`, alloc.filter((a) => a.voucherId === v.id).reduce((s, a) => s.plus(a.amount), dec(0)).toFixed(2)));
      }
    }
  }
  const billed = live.reduce((s, i) => s.plus(i.total), dec(0));
  const credited = credit.reduce((s, c) => s.plus(c.total), dec(0));
  const outstanding = billed.minus(received).minus(credited);
  const status = !live.length ? "none" : outstanding.lte(0) ? "paid" : received.gt(0) || credited.gt(0) ? "part" : "unpaid";
  const byDate = (a: FlowDoc, b: FlowDoc) => a.date.localeCompare(b.date) || a.number.localeCompare(b.number);
  for (const k of Object.keys(steps) as FlowStep[]) steps[k].sort(byDate);
  creditNotes.sort(byDate);
  return { current, steps, creditNotes, customerId, money: { billed: money(billed), received: money(received), credited: money(credited), outstanding: money(outstanding.lt(0) ? 0 : outstanding), status } };
}
