import { sql } from "drizzle-orm";
import { type Tx } from "@varchasv/db";
import { dec, money } from "@varchasv/domain";
import { badRequest } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";
import { saleLines } from "./insights.js";

const dayNo = (iso: string) => Math.floor(Date.parse(`${iso}T00:00:00Z`) / 86_400_000);
const shiftYear = (iso: string, by: number) => { const d = new Date(`${iso}T00:00:00Z`); d.setUTCFullYear(d.getUTCFullYear() + by); return d.toISOString().slice(0, 10); };
const pct = (a: ReturnType<typeof dec>, b: ReturnType<typeof dec>) => (b.gt(0) ? a.div(b).times(100).toFixed(1) : null);

export const GRAINS = ["day", "month"] as const;
export type Grain = (typeof GRAINS)[number];
export const REGISTERS = ["sales", "purchases", "stock"] as const;
export type RegisterKind = (typeof REGISTERS)[number];

// ---- daily and monthly registers --------------------------------------------------------------------------------

/**
 * Sales, purchases or stock by day or by month. Sales are net of returns (invoices and counter bills); purchases are net of
 * returns to suppliers; stock shows pieces in, pieces out and the running balance of goods.
 */
export async function register(tx: Tx, kind: RegisterKind, grain: Grain, from: string, to: string) {
  if (to < from) throw badRequest("invalid_dates");
  if (dayNo(to) - dayNo(from) > 800) throw badRequest("range_too_long");
  const company = await resolveCompany(tx);
  const trunc = grain === "day" ? sql`d.date` : sql`date_trunc('month', d.date)::date`;
  if (kind === "sales") {
    const rows = [...await tx.execute<{ period: string; pieces: string; amount: string }>(sql`
      with d as (${saleLines(company.id, from, to)})
      select ${trunc}::text as period, coalesce(sum(case when i.kind = 'goods' then d.qty else 0 end), 0)::text as pieces, coalesce(sum(d.amount), 0)::text as amount
      from d join items i on i.id = d.item_id group by 1 order by 1`)];
    const total = rows.reduce((t, r) => t.plus(r.amount), dec(0));
    return { kind, grain, from, to, rows: rows.map((r) => ({ period: r.period, pieces: dec(r.pieces).toFixed(0), amount: money(r.amount) })), total: money(total), totalPieces: rows.reduce((t, r) => t.plus(r.pieces), dec(0)).toFixed(0) };
  }
  if (kind === "purchases") {
    const rows = [...await tx.execute<{ period: string; pieces: string; amount: string }>(sql`
      with d as (
        select b.date, l.qty, l.taxable as amount, l.item_id from purchase_bill_lines l join purchase_bills b on b.id = l.bill_id
        where b.company_id = ${company.id} and b.status <> 'cancelled' and b.date between ${from}::date and ${to}::date
        union all
        select r.date, -l.qty, -l.taxable, l.item_id from purchase_return_lines l join purchase_returns r on r.id = l.return_id
        where r.company_id = ${company.id} and r.status <> 'cancelled' and r.date between ${from}::date and ${to}::date)
      select ${trunc}::text as period, coalesce(sum(case when i.kind = 'goods' then d.qty else 0 end), 0)::text as pieces, coalesce(sum(d.amount), 0)::text as amount
      from d join items i on i.id = d.item_id group by 1 order by 1`)];
    const total = rows.reduce((t, r) => t.plus(r.amount), dec(0));
    return { kind, grain, from, to, rows: rows.map((r) => ({ period: r.period, pieces: dec(r.pieces).toFixed(0), amount: money(r.amount) })), total: money(total), totalPieces: rows.reduce((t, r) => t.plus(r.pieces), dec(0)).toFixed(0) };
  }
  const [open] = [...await tx.execute<{ qty: string }>(sql`
    select coalesce(sum(l.qty_in - l.qty_out), 0)::text as qty from stock_ledger l join items i on i.id = l.item_id
    where l.company_id = ${company.id} and i.kind = 'goods' and l.date < ${from}::date`)] as [{ qty: string }];
  const rows = [...await tx.execute<{ period: string; qin: string; qout: string }>(sql`
    with d as (select l.date, l.qty_in, l.qty_out from stock_ledger l join items i on i.id = l.item_id where l.company_id = ${company.id} and i.kind = 'goods' and l.date between ${from}::date and ${to}::date)
    select ${trunc}::text as period, coalesce(sum(d.qty_in), 0)::text as qin, coalesce(sum(d.qty_out), 0)::text as qout from d group by 1 order by 1`)];
  let balance = dec(open.qty);
  const out = rows.map((r) => { balance = balance.plus(r.qin).minus(r.qout); return { period: r.period, pieceIn: dec(r.qin).toFixed(0), pieceOut: dec(r.qout).toFixed(0), balance: balance.toFixed(0) }; });
  return { kind, grain, from, to, opening: dec(open.qty).toFixed(0), rows: out, closing: balance.toFixed(0) };
}

// ---- month and year comparisons, sales against purchases -------------------------------------------------------

async function monthly(tx: Tx, companyId: string, from: string, to: string) {
  const sales = new Map([...await tx.execute<{ m: string; amount: string }>(sql`
    with d as (${saleLines(companyId, from, to)}) select to_char(d.date, 'YYYY-MM') as m, coalesce(sum(d.amount), 0)::text as amount from d group by 1`)].map((r) => [r.m, dec(r.amount)]));
  const purchases = new Map([...await tx.execute<{ m: string; amount: string }>(sql`
    with d as (
      select b.date, l.taxable as amount from purchase_bill_lines l join purchase_bills b on b.id = l.bill_id where b.company_id = ${companyId} and b.status <> 'cancelled' and b.date between ${from}::date and ${to}::date
      union all
      select r.date, -l.taxable from purchase_return_lines l join purchase_returns r on r.id = l.return_id where r.company_id = ${companyId} and r.status <> 'cancelled' and r.date between ${from}::date and ${to}::date)
    select to_char(d.date, 'YYYY-MM') as m, coalesce(sum(d.amount), 0)::text as amount from d group by 1`)].map((r) => [r.m, dec(r.amount)]));
  return { sales, purchases };
}

/** The twelve months of a calendar year against the year before, for sales and purchases. */
export async function yearComparison(tx: Tx, year: number) {
  if (!(year >= 2000 && year <= 2100)) throw badRequest("invalid_year");
  const company = await resolveCompany(tx);
  const cur = await monthly(tx, company.id, `${year}-01-01`, `${year}-12-31`);
  const prev = await monthly(tx, company.id, `${year - 1}-01-01`, `${year - 1}-12-31`);
  const rows = Array.from({ length: 12 }, (_, i) => {
    const mm = String(i + 1).padStart(2, "0");
    const s = cur.sales.get(`${year}-${mm}`) ?? dec(0), ps = prev.sales.get(`${year - 1}-${mm}`) ?? dec(0);
    const p = cur.purchases.get(`${year}-${mm}`) ?? dec(0), pp = prev.purchases.get(`${year - 1}-${mm}`) ?? dec(0);
    return { month: i + 1, sales: money(s), salesLastYear: money(ps), salesGrowthPct: ps.gt(0) ? s.minus(ps).div(ps).times(100).toFixed(1) : null, purchases: money(p), purchasesLastYear: money(pp), purchasesGrowthPct: pp.gt(0) ? p.minus(pp).div(pp).times(100).toFixed(1) : null };
  });
  const sum = (k: "sales" | "salesLastYear" | "purchases" | "purchasesLastYear") => money(rows.reduce((t, r) => t.plus(r[k]), dec(0)));
  return { year, rows, totals: { sales: sum("sales"), salesLastYear: sum("salesLastYear"), purchases: sum("purchases"), purchasesLastYear: sum("purchasesLastYear") } };
}

/** Month by month, what was sold against what was bought, and the share of sales that purchases made up. */
export async function salesVsPurchases(tx: Tx, from: string, to: string) {
  if (to < from) throw badRequest("invalid_dates");
  const company = await resolveCompany(tx);
  const { sales, purchases } = await monthly(tx, company.id, from, to);
  const months = [...new Set([...sales.keys(), ...purchases.keys()])].sort();
  const rows = months.map((m) => { const s = sales.get(m) ?? dec(0), p = purchases.get(m) ?? dec(0); return { month: m, sales: money(s), purchases: money(p), difference: money(s.minus(p)), purchasePctOfSales: pct(p, s) }; });
  const ts = rows.reduce((t, r) => t.plus(r.sales), dec(0)), tp = rows.reduce((t, r) => t.plus(r.purchases), dec(0));
  return { from, to, rows, totals: { sales: money(ts), purchases: money(tp), difference: money(ts.minus(tp)), purchasePctOfSales: pct(tp, ts) } };
}

// ---- profit by item, design, brand, category or party ----------------------------------------------------------

export const PROFIT_DIMS = ["item", "design", "brand", "category", "party"] as const;
export type ProfitDim = (typeof PROFIT_DIMS)[number];

/** Sales, cost at each piece's standard cost, and margin, grouped as asked. Services have no standard cost, so they are left to the books. */
export async function profitBy(tx: Tx, dim: ProfitDim, from: string, to: string) {
  if (to < from) throw badRequest("invalid_dates");
  const company = await resolveCompany(tx);
  const key = dim === "item" ? sql`i.name` : dim === "design" ? sql`coalesce(st.name, i.name)` : dim === "brand" ? sql`coalesce(st.brand, 'No brand')` : dim === "category" ? sql`coalesce(st.category, 'No category')` : sql`coalesce(d.party, 'Counter customers')`;
  const rows = [...await tx.execute<{ name: string; pieces: string; sales: string; cost: string }>(sql`
    with d as (${saleLines(company.id, from, to)})
    select ${key} as name, coalesce(sum(d.qty), 0)::text as pieces, coalesce(sum(d.amount), 0)::text as sales, coalesce(sum(d.qty * i.purchase_rate), 0)::text as cost
    from d join items i on i.id = d.item_id left join styles st on st.id = i.style_id where i.kind = 'goods' group by 1 order by sum(d.amount) desc limit 500`)];
  const out = rows.map((r) => { const m = dec(r.sales).minus(r.cost); return { name: r.name, pieces: dec(r.pieces).toFixed(0), sales: money(r.sales), cost: money(r.cost), margin: money(m), marginPct: pct(m, dec(r.sales)) }; });
  const ts = out.reduce((t, r) => t.plus(r.sales), dec(0)), tc = out.reduce((t, r) => t.plus(r.cost), dec(0));
  return { dim, from, to, rows: out, totals: { sales: money(ts), cost: money(tc), margin: money(ts.minus(tc)), marginPct: pct(ts.minus(tc), ts) } };
}

// ---- stock ratios by design ------------------------------------------------------------------------------------

/**
 * For each design: pieces in stock, pieces sold in the last `days`, how many days the stock would last at that pace (cover), the share of what
 * was available that has sold (sell-through), and how many of its sizes are in stock. A design with no sizes in stock is a lost sale waiting.
 */
export async function stockRatios(tx: Tx, asOf: string, days: number) {
  if (!(days >= 7 && days <= 365)) throw badRequest("invalid_days");
  const company = await resolveCompany(tx);
  const from = new Date((dayNo(asOf) - days + 1) * 86_400_000).toISOString().slice(0, 10);
  const rows = [...await tx.execute<{ id: string; name: string; brand: string | null; sizes: number; sizes_in_stock: number; stock: string; sold: string }>(sql`
    with st_stock as (
      select i.id as item_id, i.style_id, i.size, coalesce(sum(l.qty_in - l.qty_out), 0) as qty from items i
      left join stock_ledger l on l.item_id = i.id and l.date <= ${asOf}::date
      where i.company_id = ${company.id} and i.style_id is not null and i.kind = 'goods' and not i.is_pack and not i.archived group by i.id),
    sold as (select item_id, coalesce(sum(qty), 0) as qty from (${saleLines(company.id, from, asOf)}) x group by item_id)
    select s.id, s.name, s.brand, count(distinct a.size)::int as sizes, count(distinct case when a.qty > 0 then a.size end)::int as sizes_in_stock,
      coalesce(sum(greatest(a.qty, 0)), 0)::text as stock, coalesce(sum(so.qty), 0)::text as sold
    from styles s join st_stock a on a.style_id = s.id left join sold so on so.item_id = a.item_id
    where s.company_id = ${company.id} group by s.id order by sum(greatest(a.qty, 0)) desc limit 500`)];
  const out = rows.map((r) => {
    const stock = dec(r.stock), sold = dec(r.sold), perDay = sold.div(days);
    return {
      styleId: r.id, design: r.name, brand: r.brand, stock: stock.toFixed(0), sold: sold.toFixed(0),
      coverDays: perDay.gt(0) ? stock.div(perDay).toFixed(0) : null, sellThroughPct: pct(sold, stock.plus(sold)),
      sizes: r.sizes, sizesInStock: r.sizes_in_stock, sizeAvailabilityPct: r.sizes ? ((r.sizes_in_stock / r.sizes) * 100).toFixed(0) : null,
      flag: stock.gt(0) && sold.isZero() ? "not_selling" : r.sizes_in_stock < r.sizes && sold.gt(0) ? "broken_sizes" : stock.isZero() && sold.gt(0) ? "sold_out" : "ok",
    };
  });
  return { asOf, days, rows: out, brokenSizes: out.filter((r) => r.flag === "broken_sizes").length, notSelling: out.filter((r) => r.flag === "not_selling").length };
}

// ---- vendor analysis ------------------------------------------------------------------------------------------

/** For each supplier: what was bought, the rate per piece, promised and actual lead time, how much of each order came, how much was on time, and what went back. */
export async function vendorAnalysis(tx: Tx, from: string, to: string) {
  if (to < from) throw badRequest("invalid_dates");
  const company = await resolveCompany(tx);
  const bought = [...await tx.execute<{ id: string; name: string; amount: string; pieces: string }>(sql`
    select a.id, a.name, coalesce(sum(l.taxable), 0)::text as amount, coalesce(sum(case when i.kind = 'goods' then l.qty else 0 end), 0)::text as pieces
    from purchase_bills b join purchase_bill_lines l on l.bill_id = b.id join items i on i.id = l.item_id join accounts a on a.id = b.supplier_id
    where b.company_id = ${company.id} and b.status <> 'cancelled' and b.date between ${from}::date and ${to}::date group by a.id, a.name`)];
  const orders = [...await tx.execute<{ id: string; ordered: string; received: string; promised: number | null; actual: number | null; late: number; orders: number }>(sql`
    with po as (select o.id, o.supplier_id, o.date, o.expected_on, (select coalesce(sum(qty), 0) from purchase_order_lines where order_id = o.id) as ordered,
        (select coalesce(sum(received_qty), 0) from purchase_order_lines where order_id = o.id) as received,
        (select min(g.date) from goods_receipts g where g.order_id = o.id and g.status <> 'cancelled') as first_in
      from purchase_orders o where o.company_id = ${company.id} and o.status <> 'cancelled' and o.date between ${from}::date and ${to}::date)
    select supplier_id as id, sum(ordered)::text as ordered, sum(received)::text as received,
      round(avg(expected_on - date))::int as promised, round(avg(first_in - date))::int as actual,
      count(*) filter (where first_in is not null and expected_on is not null and first_in > expected_on)::int as late, count(*)::int as orders
    from po group by supplier_id`)];
  const returned = new Map([...await tx.execute<{ id: string; amount: string }>(sql`
    select r.supplier_id as id, coalesce(sum(l.taxable), 0)::text as amount from purchase_return_lines l join purchase_returns r on r.id = l.return_id
    where r.company_id = ${company.id} and r.status <> 'cancelled' and r.date between ${from}::date and ${to}::date group by r.supplier_id`)].map((r) => [r.id, dec(r.amount)]));
  const byOrder = new Map(orders.map((o) => [o.id, o]));
  const rows = bought.map((b) => {
    const o = byOrder.get(b.id);
    const ret = returned.get(b.id) ?? dec(0);
    const pieces = dec(b.pieces);
    return {
      supplierId: b.id, supplier: b.name, bought: money(b.amount), pieces: pieces.toFixed(0), ratePerPiece: pieces.gt(0) ? money(dec(b.amount).div(pieces)) : null,
      orders: o?.orders ?? 0, promisedDays: o?.promised ?? null, actualDays: o?.actual ?? null, fillRatePct: o && dec(o.ordered).gt(0) ? pct(dec(o.received), dec(o.ordered)) : null,
      lateOrders: o?.late ?? 0, returned: money(ret), returnedPct: pct(ret, dec(b.amount)),
    };
  }).sort((a, b) => Number(b.bought) - Number(a.bought));
  return { from, to, rows };
}

// ---- purchase order backlog ----------------------------------------------------------------------------------

/** Orders placed with suppliers and not yet fully received: what is pending by supplier, and what is late. */
export async function purchaseBacklog(tx: Tx, asOf: string) {
  const company = await resolveCompany(tx);
  const rows = [...await tx.execute<{ id: string; number: string; date: string; expected_on: string | null; supplier: string; pending_qty: string; pending_value: string }>(sql`
    select o.id, o.number, o.date::text, o.expected_on::text, a.name as supplier, sum(greatest(l.qty - l.received_qty, 0))::text as pending_qty,
      sum(greatest(l.qty - l.received_qty, 0) * l.rate)::text as pending_value
    from purchase_orders o join purchase_order_lines l on l.order_id = o.id join accounts a on a.id = o.supplier_id
    where o.company_id = ${company.id} and o.status in ('open', 'partial') and o.date <= ${asOf}::date group by o.id, a.name
    having sum(greatest(l.qty - l.received_qty, 0)) > 0 order by o.expected_on nulls last, o.date`)];
  const out = rows.map((r) => ({ orderId: r.id, number: r.number, date: r.date, expectedOn: r.expected_on, supplier: r.supplier, pendingQty: dec(r.pending_qty).toFixed(0), pendingValue: money(r.pending_value), daysLate: r.expected_on && r.expected_on < asOf ? dayNo(asOf) - dayNo(r.expected_on) : 0 }));
  return { asOf, orders: out.length, late: out.filter((r) => r.daysLate > 0).length, pendingValue: money(out.reduce((t, r) => t.plus(r.pendingValue), dec(0))), rows: out };
}

export { shiftYear };
