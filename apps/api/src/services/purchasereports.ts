import { and, eq, inArray, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { businessDate, dec, matchLine, matchOrder, money, rankQuotes, receivingCheck } from "@varchasv/domain";
import { itemByCode } from "./barcodes.js";
import { audit } from "../lib/audit.js";
import { badRequest, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";

/**
 * Reads for the purchase screens: the ordered, received and billed check of one order, and the supplier scorecard.
 * Nothing here changes data.
 */

type MatchRow = {
  id: string; line_no: number; item_id: string; item: string; qty: string; rate: string; received_qty: string; billed_qty: string;
  short: string; damaged: string; hold: string; billed_rate: string | null;
};

export async function purchaseMatch(tx: Tx, orderId: string) {
  const [order] = await tx.execute<{ id: string; number: string; status: string; supplier: string }>(sql`
    select o.id, o.number, o.status, a.name as supplier from purchase_orders o join accounts a on a.id = o.supplier_id where o.id = ${orderId}`);
  if (!order) throw notFound();
  const rows = [...await tx.execute<MatchRow>(sql`
    select pol.id, pol.line_no, pol.item_id, i.name as item, pol.qty::text, pol.rate::text, pol.received_qty::text, pol.billed_qty::text,
      coalesce((select sum(l.short_qty) from goods_receipt_lines l join goods_receipts r on r.id = l.receipt_id where l.order_line_id = pol.id and r.status <> 'cancelled'), 0)::text as short,
      coalesce((select sum(l.damaged_qty) from goods_receipt_lines l join goods_receipts r on r.id = l.receipt_id where l.order_line_id = pol.id and r.status <> 'cancelled'), 0)::text as damaged,
      coalesce((select sum(l.hold_qty) from goods_receipt_lines l join goods_receipts r on r.id = l.receipt_id where l.order_line_id = pol.id and r.status <> 'cancelled'), 0)::text as hold,
      (select (sum(bl.qty * bl.rate) / nullif(sum(bl.qty), 0))::text from purchase_bill_lines bl join purchase_bills b on b.id = bl.bill_id where bl.order_line_id = pol.id and b.status = 'posted') as billed_rate
    from purchase_order_lines pol join items i on i.id = pol.item_id where pol.order_id = ${orderId} order by pol.line_no`)];
  const orderDone = order.status === "received" || order.status === "closed";
  const lines = rows.map((r) => {
    const result = matchLine({ ordered: r.qty, received: r.received_qty, billed: r.billed_qty, orderRate: r.rate, billedRate: r.billed_rate, short: r.short, damaged: r.damaged, hold: r.hold, orderDone });
    return {
      lineId: r.id, lineNo: r.line_no, itemId: r.item_id, item: r.item, ordered: r.qty, received: r.received_qty, billed: r.billed_qty, orderRate: r.rate,
      billedRate: r.billed_rate === null ? null : dec(r.billed_rate).toFixed(4), short: r.short, damaged: r.damaged, hold: r.hold, ...result,
    };
  });
  const rateCost = lines.reduce((s, l) => s.plus(l.rateCost), dec(0));
  return { orderId, number: order.number, supplier: order.supplier, orderStatus: order.status, status: matchOrder(lines), rateCost: money(rateCost), lines };
}

type ScoreRow = {
  supplier_id: string; supplier: string; orders: number; receipts: number; on_time: number; with_date: number; ordered: string; received: string; accepted: string;
  short: string; damaged: string; returned: string; claim_value: string; lead_avg: string | null; lead_max: number | null; rate_gap_pct: string | null;
};

/**
 * One row per supplier for orders dated in the range: how many receipts came by the expected date, how much of the ordered
 * quantity arrived, how much of what arrived was short or damaged, what that is worth, the days from order to receipt, and how
 * far billed rates sat from ordered rates. These are the measures; no single score is made up from them.
 */
export async function supplierScorecard(tx: Tx, from: string, to: string, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const rows = [...await tx.execute<ScoreRow>(sql`
    with po as (
      select o.id, o.supplier_id, o.date, o.expected_on from purchase_orders o where o.company_id = ${company.id} and o.status <> 'cancelled' and o.date between ${from}::date and ${to}::date
    ), ordered as (
      select po.supplier_id, count(distinct po.id)::int as orders, coalesce(sum(pol.qty), 0) as ordered
      from po join purchase_order_lines pol on pol.order_id = po.id group by po.supplier_id
    ), rec as (
      select po.supplier_id, count(distinct r.id)::int as receipts,
        count(distinct r.id) filter (where po.expected_on is not null and r.date <= po.expected_on)::int as on_time,
        count(distinct r.id) filter (where po.expected_on is not null)::int as with_date,
        coalesce(sum(l.qty), 0) as received, coalesce(sum(coalesce(l.challan_qty, l.qty)), 0) as accepted_base,
        coalesce(sum(l.short_qty), 0) as short, coalesce(sum(l.damaged_qty), 0) as damaged, coalesce(sum(l.returned_qty), 0) as returned,
        coalesce(sum((l.short_qty + l.damaged_qty + l.returned_qty) * l.rate), 0) as claim_value,
        avg((r.date - po.date))::numeric(10,1) as lead_avg, max(r.date - po.date) as lead_max
      from po join goods_receipts r on r.order_id = po.id and r.status <> 'cancelled' join goods_receipt_lines l on l.receipt_id = r.id group by po.supplier_id
    ), price as (
      select po.supplier_id, (sum(bl.qty * (bl.rate - pol.rate)) / nullif(sum(bl.qty * pol.rate), 0) * 100)::numeric(10,2) as rate_gap_pct
      from po join purchase_order_lines pol on pol.order_id = po.id join purchase_bill_lines bl on bl.order_line_id = pol.id join purchase_bills b on b.id = bl.bill_id and b.status = 'posted'
      group by po.supplier_id
    )
    select a.id as supplier_id, a.name as supplier, ordered.orders, coalesce(rec.receipts, 0) as receipts, coalesce(rec.on_time, 0) as on_time, coalesce(rec.with_date, 0) as with_date,
      ordered.ordered::text, coalesce(rec.received, 0)::text as received, coalesce(rec.accepted_base, 0)::text as accepted,
      coalesce(rec.short, 0)::text as short, coalesce(rec.damaged, 0)::text as damaged, coalesce(rec.returned, 0)::text as returned, coalesce(rec.claim_value, 0)::text as claim_value,
      rec.lead_avg::text as lead_avg, rec.lead_max, price.rate_gap_pct::text as rate_gap_pct
    from ordered join accounts a on a.id = ordered.supplier_id left join rec on rec.supplier_id = ordered.supplier_id left join price on price.supplier_id = ordered.supplier_id
    order by a.name`)];
  const pct = (num: string, den: string) => (dec(den).gt(0) ? dec(num).div(den).times(100).toDecimalPlaces(1).toFixed(1) : null);
  return {
    from, to,
    suppliers: rows.map((r) => ({
      supplierId: r.supplier_id, supplier: r.supplier, orders: r.orders, receipts: r.receipts,
      onTimePct: r.with_date ? dec(r.on_time).div(r.with_date).times(100).toDecimalPlaces(1).toFixed(1) : null,
      inFullPct: pct(r.received, r.ordered),
      problemPct: pct(dec(r.short).plus(r.damaged).plus(r.returned).toString(), dec(r.received).plus(r.short).toString()),
      claimValue: money(r.claim_value), leadDaysAvg: r.lead_avg, leadDaysMax: r.lead_max, billedRateGapPct: r.rate_gap_pct,
    })),
  };
}

/** Bill lines whose receipt recorded a shortage that has not yet been debited, with the quantity still open. */
export async function billShortages(tx: Tx, billId: string) {
  const rows = [...await tx.execute<{ bill_line_id: string; item: string; item_hi: string | null; available: string }>(sql`
    select bl.id as bill_line_id, i.name as item, i.name_hi as item_hi,
      (rl.short_qty - coalesce((select sum(l.qty) from purchase_return_lines l join purchase_returns r on r.id = l.return_id
        where l.bill_line_id = bl.id and r.kind = 'shortage' and r.status = 'posted'), 0))::text as available
    from purchase_bill_lines bl join goods_receipt_lines rl on rl.id = bl.receipt_line_id join items i on i.id = bl.item_id
    where bl.bill_id = ${billId} and rl.short_qty > 0 order by bl.line_no`)];
  return rows.filter((r) => dec(r.available).gt(0)).map((r) => ({ billLineId: r.bill_line_id, itemName: r.item, itemNameHi: r.item_hi, available: r.available }));
}

// ---- supplier quotes -----------------------------------------------------------------------------

interface Actor { tenantId: string; userId: string; ip?: string | undefined }
export interface QuoteInput {
  supplierId: string; itemId: string; rate: string; extraCost?: string | undefined; minQty?: string | undefined; leadDays?: number | undefined;
  quotedOn: string; validUntil?: string | undefined; note?: string | undefined; companyId?: string | undefined;
}

export async function addQuote(tx: Tx, actor: Actor, b: QuoteInput) {
  const company = await resolveCompany(tx, b.companyId);
  if (b.validUntil && b.validUntil < b.quotedOn) throw badRequest("valid_before_quoted");
  const [sup] = await tx.select({ id: tables.accounts.id }).from(tables.accounts).where(and(eq(tables.accounts.id, b.supplierId), eq(tables.accounts.companyId, company.id)));
  const [item] = await tx.select({ id: tables.items.id }).from(tables.items).where(and(eq(tables.items.id, b.itemId), eq(tables.items.companyId, company.id)));
  if (!sup) throw badRequest("unknown_supplier");
  if (!item) throw badRequest("unknown_item");
  const [row] = await tx.insert(tables.supplierQuotes).values({
    tenantId: actor.tenantId, companyId: company.id, supplierId: b.supplierId, itemId: b.itemId, rate: b.rate, extraCost: b.extraCost ?? "0",
    minQty: b.minQty ?? null, leadDays: b.leadDays ?? null, quotedOn: b.quotedOn, validUntil: b.validUntil ?? null, note: b.note?.trim() || null, createdBy: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "supplier_quote", entityId: row!.id, after: { supplierId: b.supplierId, itemId: b.itemId, rate: b.rate }, ip: actor.ip });
  return row!;
}

export async function archiveQuote(tx: Tx, actor: Actor, id: string) {
  const [row] = await tx.update(tables.supplierQuotes).set({ archived: true }).where(eq(tables.supplierQuotes.id, id)).returning({ id: tables.supplierQuotes.id });
  if (!row) throw notFound();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "supplier_quote", entityId: id, after: { archived: true }, ip: actor.ip });
}

/** The live quotes for one item ranked by estimated landed cost, with the last price actually paid for it. */
export async function quoteComparison(tx: Tx, itemId: string, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const quotes = [...await tx.execute<{ id: string; supplier_id: string; supplier: string; rate: string; extra_cost: string; min_qty: string | null; lead_days: number | null; valid_until: string | null; quoted_on: string; note: string | null }>(sql`
    select q.id, q.supplier_id, a.name as supplier, q.rate::text, q.extra_cost::text, q.min_qty::text, q.lead_days, q.valid_until::text, q.quoted_on::text, q.note
    from supplier_quotes q join accounts a on a.id = q.supplier_id where q.company_id = ${company.id} and q.item_id = ${itemId} and not q.archived`)];
  const [last] = [...await tx.execute<{ rate: string; supplier: string; date: string }>(sql`
    select bl.rate::text, a.name as supplier, b.date::text from purchase_bill_lines bl join purchase_bills b on b.id = bl.bill_id join accounts a on a.id = b.supplier_id
    where b.company_id = ${company.id} and b.status = 'posted' and bl.item_id = ${itemId} order by b.date desc, b.created_at desc limit 1`)];
  const ranked = rankQuotes(quotes.map((r) => ({ id: r.id, supplier: r.supplier, rate: r.rate, extraCost: r.extra_cost, minQty: r.min_qty, leadDays: r.lead_days, validUntil: r.valid_until, quotedOn: r.quoted_on })), businessDate(), last?.rate ?? null);
  const note = new Map(quotes.map((r) => [r.id, r.note]));
  return {
    itemId, lastPaid: last ? { rate: money(last.rate), supplier: last.supplier, date: last.date } : null,
    quotes: ranked.map((r) => ({ ...r, supplierId: quotes.find((x) => x.id === r.id)!.supplier_id, note: note.get(r.id) ?? null })),
  };
}

// ---- receiving scanned against the order ---------------------------------------------------------

/**
 * What has been counted at the gate against an order: each code is resolved to an item, and the counts are set against what is still to come on
 * every order line. Nothing is saved; the receipt is made from the counts afterwards.
 */
export async function receivingAgainstOrder(tx: Tx, orderId: string, scans: { code: string; qty: string }[]) {
  const [order] = await tx.select().from(tables.purchaseOrders).where(eq(tables.purchaseOrders.id, orderId));
  if (!order) throw notFound();
  if (order.status === "cancelled" || order.status === "closed") throw badRequest("order_not_open");
  const lines = await tx.select({ id: tables.purchaseOrderLines.id, itemId: tables.purchaseOrderLines.itemId, qty: tables.purchaseOrderLines.qty, rate: tables.purchaseOrderLines.rate, received: tables.purchaseOrderLines.receivedQty, name: tables.items.name, size: tables.items.size, color: tables.items.color })
    .from(tables.purchaseOrderLines).innerJoin(tables.items, eq(tables.items.id, tables.purchaseOrderLines.itemId)).where(eq(tables.purchaseOrderLines.orderId, orderId)).orderBy(tables.purchaseOrderLines.lineNo);
  const resolved = new Map<string, string | null>();
  for (const code of new Set(scans.map((x) => x.code.trim()))) resolved.set(code, await itemByCode(tx, order.companyId, code));
  const check = receivingCheck(lines.map((l) => ({ lineId: l.id, itemId: l.itemId, ordered: l.qty, received: l.received })), scans.map((x) => ({ itemId: resolved.get(x.code.trim()) ?? null, code: x.code.trim(), qty: x.qty })));
  const extraIds = check.notOnOrder.map((x) => x.itemId);
  const extra = extraIds.length ? await tx.select({ id: tables.items.id, name: tables.items.name }).from(tables.items).where(inArray(tables.items.id, extraIds)) : [];
  const label = new Map(lines.map((l) => [l.id, { item: [l.name, l.color, l.size].filter(Boolean).join(" "), rate: l.rate }]));
  return {
    order: { id: order.id, number: order.number, supplierId: order.supplierId, status: order.status },
    rows: check.rows.map((r) => ({ ...r, item: label.get(r.lineId)!.item, rate: label.get(r.lineId)!.rate })),
    notOnOrder: check.notOnOrder.map((x) => ({ ...x, item: extra.find((e) => e.id === x.itemId)?.name ?? "" })),
    unknown: check.unknown, problems: check.problems, allIn: check.allIn,
  };
}
