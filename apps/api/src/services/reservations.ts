import { and, eq, inArray, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { businessDate, dec, heldQty, planReservation, suggestSubstitutes, type Dec, type Substitute } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { conflict, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";
import { reservedByItem, stockSummary } from "./inventory.js";

/**
 * Stock set aside for sales orders. A reservation belongs to one order line and stops other orders from reserving the same
 * pieces. It does not stop a challan or invoice being made for someone else: it is a promise the screens keep, not a lock on
 * the godown. What a reservation still holds is worked out each time (see `heldQty`), so delivering a line releases it.
 */
interface Actor { tenantId: string; userId: string; ip?: string | undefined }

/** What each item has in stock outside quality hold. */
async function usableStock(tx: Tx, company: Awaited<ReturnType<typeof resolveCompany>>): Promise<Map<string, Dec>> {
  const summary = await stockSummary(tx, company, businessDate());
  const hold = new Set((await tx.select({ id: tables.warehouses.id }).from(tables.warehouses).where(and(eq(tables.warehouses.companyId, company.id), eq(tables.warehouses.qualityHold, true)))).map((w) => w.id));
  return new Map(summary.rows.map((r) => [r.itemId, r.warehouses.filter((w) => !hold.has(w.warehouseId)).reduce((s, w) => s.plus(w.qty), dec(0))]));
}

/** Free to reserve per item: in stock, not on hold, not already set aside for another order. Never below zero. */
async function freeToReserve(tx: Tx, company: Awaited<ReturnType<typeof resolveCompany>>) {
  const [stock, held] = await Promise.all([usableStock(tx, company), reservedByItem(tx, company.id)]);
  const free = new Map<string, Dec>();
  for (const [item, qty] of stock) { const f = qty.minus(held.get(item) ?? 0); free.set(item, f.gt(0) ? f : dec(0)); }
  return free;
}

async function loadOrder(tx: Tx, orderId: string) {
  const [o] = await tx.select().from(tables.salesOrders).where(eq(tables.salesOrders.id, orderId)).for("update");
  if (!o) throw notFound();
  return o;
}

async function orderLines(tx: Tx, orderId: string) {
  return tx.select({
    line: tables.salesOrderLines, name: tables.items.name, styleId: tables.items.styleId, color: tables.items.color, size: tables.items.size,
    resId: tables.stockReservations.id, resQty: tables.stockReservations.qty, resReleased: tables.stockReservations.released,
  }).from(tables.salesOrderLines)
    .innerJoin(tables.items, eq(tables.items.id, tables.salesOrderLines.itemId))
    .leftJoin(tables.stockReservations, eq(tables.stockReservations.orderLineId, tables.salesOrderLines.id))
    .where(eq(tables.salesOrderLines.orderId, orderId)).orderBy(tables.salesOrderLines.lineNo);
}

const live = (status: string) => status === "open" || status === "partial";

/** Same-style items with free stock, to offer when a line cannot be filled. */
async function substitutesFor(tx: Tx, companyId: string, line: { itemId: string; styleId: string | null }, short: Dec, free: Map<string, Dec>): Promise<Substitute[]> {
  if (!line.styleId) return [];
  const mates = await tx.select({ id: tables.items.id, name: tables.items.name, color: tables.items.color, size: tables.items.size }).from(tables.items)
    .where(and(eq(tables.items.companyId, companyId), eq(tables.items.styleId, line.styleId), eq(tables.items.archived, false)));
  return suggestSubstitutes(short, mates.filter((m) => m.id !== line.itemId).map((m) => ({ itemId: m.id, name: m.name, colour: m.color, size: m.size, free: (free.get(m.id) ?? dec(0)).toFixed(4) })));
}

/** The order's lines with what is ordered, delivered, set aside and still to get, and substitutes for the lines that fall short. */
export async function orderReservations(tx: Tx, orderId: string) {
  const o = await loadOrder(tx, orderId);
  const company = await resolveCompany(tx, o.companyId);
  const rows = await orderLines(tx, orderId);
  const free = await freeToReserve(tx, company);
  const lines = [];
  for (const r of rows) {
    const done = dec(r.line.deliveredQty).gt(r.line.invoicedQty) ? dec(r.line.deliveredQty) : dec(r.line.invoicedQty);
    const held = heldQty({ reserved: r.resQty ?? 0, ordered: r.line.qty, done, orderLive: live(o.status), released: r.resReleased ?? false });
    const remaining = dec(r.line.qty).minus(done);
    const toGet = remaining.gt(0) ? remaining.minus(held) : dec(0);
    lines.push({
      lineId: r.line.id, itemId: r.line.itemId, item: r.name, color: r.color, size: r.size, ordered: dec(r.line.qty).toFixed(4), done: done.toFixed(4),
      held: held.toFixed(4), toGet: toGet.toFixed(4), freeNow: (free.get(r.line.itemId) ?? dec(0)).toFixed(4),
      substitutes: live(o.status) && toGet.gt(0) ? await substitutesFor(tx, company.id, { itemId: r.line.itemId, styleId: r.styleId }, toGet, free) : [],
    });
  }
  return { orderId, number: o.number, status: o.status, deliverBy: o.deliverBy, lines };
}

/** Sets aside what is free for each line of the order, in line order, and returns the lines with what is still short. */
export async function reserveOrder(tx: Tx, actor: Actor, orderId: string) {
  const o = await loadOrder(tx, orderId);
  if (!live(o.status)) throw conflict("order_not_open");
  const company = await resolveCompany(tx, o.companyId);
  const rows = await orderLines(tx, orderId);
  const free = await freeToReserve(tx, company);
  const plan = planReservation(rows.map((r) => ({
    lineId: r.line.id, itemId: r.line.itemId, ordered: r.line.qty,
    done: dec(r.line.deliveredQty).gt(r.line.invoicedQty) ? r.line.deliveredQty : r.line.invoicedQty,
    alreadyHeld: heldQty({ reserved: r.resQty ?? 0, ordered: r.line.qty, done: dec(r.line.deliveredQty).gt(r.line.invoicedQty) ? r.line.deliveredQty : r.line.invoicedQty, orderLive: true, released: r.resReleased ?? false }),
  })), free);
  let reserved = 0;
  for (const a of plan) {
    if (!dec(a.give).gt(0)) continue;
    const r = rows.find((x) => x.line.id === a.lineId)!;
    const base = r.resReleased ? dec(0) : dec(r.resQty ?? 0);
    const qty = base.plus(a.give).toFixed(4);
    if (r.resId) await tx.update(tables.stockReservations).set({ qty, released: false, reservedBy: actor.userId, updatedAt: new Date() }).where(eq(tables.stockReservations.id, r.resId));
    else await tx.insert(tables.stockReservations).values({ tenantId: actor.tenantId, companyId: company.id, orderLineId: a.lineId, itemId: a.itemId, qty, reservedBy: actor.userId });
    reserved++;
  }
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "sales_order", entityId: orderId, after: { reserved: plan.map((a) => ({ line: a.lineId, give: a.give, short: a.short })) }, ip: actor.ip });
  return { reservedLines: reserved, ...(await orderReservations(tx, orderId)) };
}

/** Lets go of the stock held for one line, or for the whole order. The quantity stays on record as released. */
export async function releaseOrder(tx: Tx, actor: Actor, orderId: string, lineId?: string) {
  const o = await loadOrder(tx, orderId);
  const lineIds = (await tx.select({ id: tables.salesOrderLines.id }).from(tables.salesOrderLines).where(eq(tables.salesOrderLines.orderId, orderId))).map((l) => l.id);
  const target = lineId ? lineIds.filter((id) => id === lineId) : lineIds;
  if (lineId && !target.length) throw notFound();
  if (target.length) await tx.update(tables.stockReservations).set({ released: true, updatedAt: new Date() }).where(inArray(tables.stockReservations.orderLineId, target));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "sales_order", entityId: orderId, after: { released: lineId ?? "all" }, ip: actor.ip });
  return orderReservations(tx, o.id);
}

/**
 * Items that open orders want and nothing has been set aside for, with what is free, what is on order from suppliers and the
 * earliest date anyone needs it. Most urgent first.
 */
export async function backorders(tx: Tx, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const rows = [...await tx.execute<{ item_id: string; name: string; color: string | null; size: string | null; wanted: string; customers: number; earliest: string | null }>(sql`
    select l.item_id, i.name, i.color, i.size,
      sum(greatest(l.qty - greatest(l.delivered_qty, l.invoiced_qty), 0)
        - case when r.id is null or r.released then 0 else least(r.qty, greatest(l.qty - greatest(l.delivered_qty, l.invoiced_qty), 0)) end)::text as wanted,
      count(distinct o.customer_id)::int as customers, min(o.deliver_by)::text as earliest
    from sales_order_lines l join sales_orders o on o.id = l.order_id join items i on i.id = l.item_id
    left join stock_reservations r on r.order_line_id = l.id
    where o.company_id = ${company.id} and o.status in ('open', 'partial') and i.kind = 'goods'
    group by l.item_id, i.name, i.color, i.size`)];
  const open = rows.filter((r) => dec(r.wanted).gt(0));
  if (!open.length) return { items: [] };
  const free = await freeToReserve(tx, company);
  const incoming = [...await tx.execute<{ item_id: string; qty: string; first: string | null }>(sql`
    select pol.item_id, sum(greatest(pol.qty - pol.received_qty, 0))::text as qty, min(po.expected_on)::text as first
    from purchase_order_lines pol join purchase_orders po on po.id = pol.order_id
    where po.company_id = ${company.id} and po.status in ('open', 'partial') and po.approval_status = 'approved' group by 1`)];
  return {
    items: open.map((r) => {
      const f = free.get(r.item_id) ?? dec(0);
      const inc = incoming.find((x) => x.item_id === r.item_id);
      const wanted = dec(r.wanted);
      return {
        itemId: r.item_id, item: r.name, color: r.color, size: r.size, wanted: wanted.toFixed(4), customers: r.customers, neededBy: r.earliest,
        freeNow: f.toFixed(4), incoming: dec(inc?.qty ?? 0).toFixed(4), incomingFrom: inc?.first ?? null,
        // Free stock should have been reserved already; what is wanted beyond it can only be met by what is on order.
        shortAfterFree: wanted.minus(f).gt(0) ? wanted.minus(f).toFixed(4) : "0.0000",
        coveredByIncoming: wanted.minus(f).lte(dec(inc?.qty ?? 0)),
      };
    }).sort((a, b) => (a.neededBy ?? "9999").localeCompare(b.neededBy ?? "9999") || a.item.localeCompare(b.item)),
  };
}
