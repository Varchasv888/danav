import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";
import { documentNumber } from "./inventory.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

const q4 = (v: string | number | { toString(): string }) => dec(v.toString()).toDecimalPlaces(4).toFixed(4);

export const DELIVERY_ORDER_SERIES = { docType: "delivery_order", name: "Delivery orders", pattern: "DO/{FY}/{SEQ:5}" };

export interface DeliveryOrderInput {
  customerId: string; orderId?: string | undefined; date: string; deliverBy?: string | undefined; transporter?: string | undefined; narration?: string | undefined;
  lines: { itemId: string; qty: string; orderLineId?: string | undefined }[];
}

/**
 * A delivery order tells the warehouse what to send to a customer, ahead of the challan. It moves no stock and
 * posts nothing. It can follow a sales order (the lines then cannot exceed what is still to deliver) or stand alone.
 */
export async function createDeliveryOrder(tx: Tx, actor: Actor, input: DeliveryOrderInput) {
  const company = await resolveCompany(tx);
  const [customer] = await tx.select({ id: tables.accounts.id, companyId: tables.accounts.companyId, name: tables.accounts.name }).from(tables.accounts).where(eq(tables.accounts.id, input.customerId));
  if (!customer || customer.companyId !== company.id) throw badRequest("unknown_customer");
  if (!input.lines.length) throw badRequest("no_lines");
  let orderLines: (typeof tables.salesOrderLines.$inferSelect)[] = [];
  if (input.orderId) {
    const [o] = await tx.select().from(tables.salesOrders).where(eq(tables.salesOrders.id, input.orderId)).for("update");
    if (!o || o.companyId !== company.id) throw badRequest("unknown_order");
    if (o.customerId !== customer.id) throw badRequest("order_customer_mismatch");
    if (o.status === "cancelled" || o.status === "closed") throw conflict("order_not_open");
    orderLines = await tx.select().from(tables.salesOrderLines).where(eq(tables.salesOrderLines.orderId, o.id));
  }
  const asked = new Map<string, ReturnType<typeof dec>>();
  for (const l of input.lines) {
    if (!dec(l.qty).gt(0)) throw badRequest("qty_must_be_positive");
    const ol = l.orderLineId ? orderLines.find((x) => x.id === l.orderLineId) : undefined;
    if (l.orderLineId && !ol) throw badRequest("unknown_order_line");
    if (ol) {
      if (ol.itemId !== l.itemId) throw badRequest("order_line_item_mismatch");
      const total = (asked.get(ol.id) ?? dec(0)).plus(l.qty);
      asked.set(ol.id, total);
      if (total.gt(dec(ol.qty).minus(ol.deliveredQty))) throw badRequest("over_delivery");
    }
  }
  const number = await documentNumber(tx, actor, company, input.date, DELIVERY_ORDER_SERIES);
  const [order] = await tx.insert(tables.deliveryOrders).values({
    tenantId: actor.tenantId, companyId: company.id, customerId: customer.id, orderId: input.orderId ?? null, number, date: input.date,
    deliverBy: input.deliverBy ?? null, transporter: input.transporter ?? null, narration: input.narration ?? null, createdBy: actor.userId,
  }).returning();
  await tx.insert(tables.deliveryOrderLines).values(input.lines.map((l, i) => ({
    tenantId: actor.tenantId, deliveryOrderId: order!.id, lineNo: i + 1, itemId: l.itemId, orderLineId: l.orderLineId ?? null, qty: q4(l.qty),
  })));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "delivery_order", entityId: order!.id, after: { number, customer: customer.name }, ip: actor.ip });
  return order!;
}

/** What each delivery order line has gone out as (challans not cancelled) and been billed for. */
async function movement(tx: Tx, lineIds: string[]) {
  if (!lineIds.length) return new Map<string, { dispatched: string; billed: string; returned: string }>();
  const rows = await tx.select({
    id: tables.deliveryNoteLines.deliveryOrderLineId,
    dispatched: sql<string>`coalesce(sum(${tables.deliveryNoteLines.qty}), 0)::text`,
    billed: sql<string>`coalesce(sum(${tables.deliveryNoteLines.invoicedQty}), 0)::text`,
    returned: sql<string>`coalesce(sum(${tables.deliveryNoteLines.returnedQty}), 0)::text`,
  }).from(tables.deliveryNoteLines)
    .innerJoin(tables.deliveryNotes, eq(tables.deliveryNotes.id, tables.deliveryNoteLines.noteId))
    .where(and(inArray(tables.deliveryNoteLines.deliveryOrderLineId, lineIds), sql`${tables.deliveryNotes.status} <> 'cancelled'`))
    .groupBy(tables.deliveryNoteLines.deliveryOrderLineId);
  return new Map(rows.map((r) => [r.id!, { dispatched: r.dispatched, billed: r.billed, returned: r.returned }]));
}

/** The order's lines against what went out and what was billed; the difference is ordered minus billed. */
export async function getDeliveryOrder(tx: Tx, id: string) {
  const [order] = await tx.select().from(tables.deliveryOrders).where(eq(tables.deliveryOrders.id, id));
  if (!order) throw notFound();
  const lines = await tx.select().from(tables.deliveryOrderLines).where(eq(tables.deliveryOrderLines.deliveryOrderId, id)).orderBy(asc(tables.deliveryOrderLines.lineNo));
  const moved = await movement(tx, lines.map((l) => l.id));
  const out = lines.map((l) => {
    const m = moved.get(l.id) ?? { dispatched: "0", billed: "0", returned: "0" };
    return {
      ...l, dispatched: q4(m.dispatched), billed: q4(m.billed), returned: q4(m.returned),
      toDispatch: q4(dec(l.qty).minus(m.dispatched)), difference: q4(dec(l.qty).minus(m.billed)),
    };
  });
  const challans = await tx.select({ id: tables.deliveryNotes.id, number: tables.deliveryNotes.number, date: tables.deliveryNotes.date, status: tables.deliveryNotes.status })
    .from(tables.deliveryNotes).where(inArray(tables.deliveryNotes.id, sql`(select note_id from delivery_note_lines where delivery_order_line_id in (select id from delivery_order_lines where delivery_order_id = ${id}))`))
    .orderBy(asc(tables.deliveryNotes.date));
  return { ...order, lines: out, challans };
}

/** The list with, per order, the pieces asked for, sent and billed. */
export async function listDeliveryOrders(tx: Tx, q: { status?: string | undefined; customerId?: string | undefined }) {
  const company = await resolveCompany(tx);
  const orders = await tx.select({ o: tables.deliveryOrders, customer: tables.accounts.name }).from(tables.deliveryOrders)
    .innerJoin(tables.accounts, eq(tables.accounts.id, tables.deliveryOrders.customerId))
    .where(and(eq(tables.deliveryOrders.companyId, company.id), q.status ? eq(tables.deliveryOrders.status, q.status) : undefined, q.customerId ? eq(tables.deliveryOrders.customerId, q.customerId) : undefined))
    .orderBy(desc(tables.deliveryOrders.date), desc(tables.deliveryOrders.createdAt)).limit(300);
  if (!orders.length) return [];
  const lines = await tx.select().from(tables.deliveryOrderLines).where(inArray(tables.deliveryOrderLines.deliveryOrderId, orders.map((x) => x.o.id)));
  const moved = await movement(tx, lines.map((l) => l.id));
  return orders.map(({ o, customer }) => {
    const mine = lines.filter((l) => l.deliveryOrderId === o.id);
    const sum = (f: (l: (typeof mine)[number]) => string) => q4(mine.reduce((s, l) => s.plus(f(l)), dec(0)));
    return {
      ...o, customer, pieces: sum((l) => l.qty), dispatched: sum((l) => moved.get(l.id)?.dispatched ?? "0"), billed: sum((l) => moved.get(l.id)?.billed ?? "0"),
    };
  });
}

/** Cancels an order nothing has gone out against, or closes one that will not be sent in full. */
export async function setDeliveryOrderStatus(tx: Tx, actor: Actor, id: string, status: "closed" | "cancelled") {
  const [o] = await tx.select().from(tables.deliveryOrders).where(eq(tables.deliveryOrders.id, id)).for("update");
  if (!o) throw notFound();
  if (o.status !== "open") throw conflict("delivery_order_not_open");
  if (status === "cancelled") {
    const lines = await tx.select({ id: tables.deliveryOrderLines.id }).from(tables.deliveryOrderLines).where(eq(tables.deliveryOrderLines.deliveryOrderId, id));
    const moved = await movement(tx, lines.map((l) => l.id));
    if ([...moved.values()].some((m) => dec(m.dispatched).gt(0))) throw conflict("delivery_order_has_dispatch");
  }
  await tx.update(tables.deliveryOrders).set({ status }).where(eq(tables.deliveryOrders.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: status === "cancelled" ? "cancel" : "update", entity: "delivery_order", entityId: id, after: { status }, ip: actor.ip });
}

/**
 * Checks challan lines that name a delivery order line: the order is open, belongs to this customer, the item
 * matches, and the pieces do not go past what the order still has to dispatch.
 */
export async function checkDeliveryOrderLines(tx: Tx, customerId: string, lines: { itemId: string; qty: string; deliveryOrderLineId?: string | undefined }[]) {
  const ids = [...new Set(lines.flatMap((l) => (l.deliveryOrderLineId ? [l.deliveryOrderLineId] : [])))];
  if (!ids.length) return;
  const rows = await tx.select({ line: tables.deliveryOrderLines, order: tables.deliveryOrders }).from(tables.deliveryOrderLines)
    .innerJoin(tables.deliveryOrders, eq(tables.deliveryOrders.id, tables.deliveryOrderLines.deliveryOrderId))
    .where(inArray(tables.deliveryOrderLines.id, ids)).for("update");
  if (rows.length !== ids.length) throw badRequest("unknown_delivery_order_line");
  const moved = await movement(tx, ids);
  const asked = new Map<string, ReturnType<typeof dec>>();
  for (const l of lines) {
    if (!l.deliveryOrderLineId) continue;
    const r = rows.find((x) => x.line.id === l.deliveryOrderLineId)!;
    if (r.order.customerId !== customerId) throw badRequest("delivery_order_customer_mismatch");
    if (r.order.status !== "open") throw conflict("delivery_order_not_open");
    if (r.line.itemId !== l.itemId) throw badRequest("delivery_order_item_mismatch");
    const total = (asked.get(r.line.id) ?? dec(0)).plus(l.qty);
    asked.set(r.line.id, total);
    if (total.gt(dec(r.line.qty).minus(moved.get(r.line.id)?.dispatched ?? "0"))) throw badRequest("over_dispatch");
  }
}
