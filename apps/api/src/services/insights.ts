import { sql, type SQL } from "drizzle-orm";
import type { Tx } from "@varchasv/db";
import { dec, money } from "@varchasv/domain";
import { resolveCompany } from "./accounting.js";
import { stockSummary } from "./inventory.js";
import { outstanding } from "./returns.js";

/** Sales ageing: how old a design was (days since its first inward) when it sold. */
export const AGE_BUCKETS = [
  { key: "d0_30", upTo: 30 }, { key: "d31_60", upTo: 60 }, { key: "d61_90", upTo: 90 }, { key: "d91_180", upTo: 180 },
  { key: "d181_365", upTo: 365 }, { key: "y1_2", upTo: 730 }, { key: "y2plus", upTo: null },
] as const;

const shiftYear = (iso: string, by: number) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCFullYear(d.getUTCFullYear() + by);
  return d.toISOString().slice(0, 10);
};
/** The same ageing carried on to over five years, for the daily sales view. */
export const LONG_AGE_BUCKETS = [
  { key: "d0_30", upTo: 30 }, { key: "d31_60", upTo: 60 }, { key: "d61_90", upTo: 90 }, { key: "d91_180", upTo: 180 }, { key: "d181_365", upTo: 365 },
  { key: "y1_2", upTo: 730 }, { key: "y2_3", upTo: 1095 }, { key: "y3_4", upTo: 1460 }, { key: "y4_5", upTo: 1825 }, { key: "y5plus", upTo: null },
] as const;

const days = (from: string, to: string) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000) + 1;

/**
 * Every sale line in the period, net of returns: invoice lines less credit-note lines, and counter lines
 * less what came back on them. Taxable value; quantity only for goods.
 */
export function saleLines(companyId: string, from: string, to: string): SQL {
  return sql`
    select s.date, l.item_id, l.qty, l.taxable as amount, l.taxable as comm_amount, s.salesman_id, s.helper_id, s.customer_id, s.customer_name as party, 'invoice' as channel
    from sales_invoice_lines l join sales_invoices s on s.id = l.invoice_id
    where s.company_id = ${companyId} and s.status <> 'cancelled' and s.date between ${from}::date and ${to}::date
    union all
    select n.date, l.item_id, -l.qty, -l.taxable, -l.taxable, s.salesman_id, s.helper_id, n.customer_id, s.customer_name, 'invoice'
    from credit_note_lines l join credit_notes n on n.id = l.note_id left join sales_invoices s on s.id = n.invoice_id
    where n.company_id = ${companyId} and n.status <> 'cancelled' and n.date between ${from}::date and ${to}::date
    union all
    select b.date, l.item_id, l.qty - l.returned_qty, case when l.qty > 0 then l.taxable * (l.qty - l.returned_qty) / l.qty else 0 end,
      case when l.qty > 0 then (l.taxable + l.commission_adj) * (l.qty - l.returned_qty) / l.qty else 0 end, l.salesman_id, l.helper_id, null, null, 'counter'
    from pos_bill_lines l join pos_bills b on b.id = l.bill_id
    where b.company_id = ${companyId} and b.status = 'paid' and b.date between ${from}::date and ${to}::date`;
}

async function headline(tx: Tx, companyId: string, from: string, to: string) {
  // Margin is on each item's standard cost (its purchase or making rate), the figure a shop owner quotes;
  // the books' trading account stays the place for profit after stock valuation.
  const [s] = await tx.execute<{ sales: string; pieces: string; cost: string; bills: number }>(sql`
    with x as (${saleLines(companyId, from, to)})
    select coalesce(sum(x.amount), 0)::text as sales, coalesce(sum(case when i.kind = 'goods' then x.qty else 0 end), 0)::text as pieces,
      coalesce(sum(case when i.kind = 'goods' then x.qty * i.purchase_rate else 0 end), 0)::text as cost,
      ((select count(*) from sales_invoices where company_id = ${companyId} and status <> 'cancelled' and date between ${from}::date and ${to}::date)
       + (select count(*) from pos_bills where company_id = ${companyId} and status = 'paid' and date between ${from}::date and ${to}::date))::int as bills
    from x join items i on i.id = x.item_id`);
  const [p] = await tx.execute<{ amount: string; pieces: string }>(sql`
    select coalesce(sum(l.taxable), 0)::text as amount, coalesce(sum(case when i.kind = 'goods' then l.qty else 0 end), 0)::text as pieces
    from purchase_bill_lines l join purchase_bills b on b.id = l.bill_id join items i on i.id = l.item_id
    where b.company_id = ${companyId} and b.status <> 'cancelled' and b.date between ${from}::date and ${to}::date`);
  const sales = dec(s!.sales);
  const pieces = dec(s!.pieces);
  const margin = sales.minus(s!.cost);
  return {
    sales: money(sales), pieces: pieces.toFixed(0), bills: s!.bills,
    avgBill: s!.bills ? money(sales.div(s!.bills)) : "0.00", avgRate: pieces.gt(0) ? money(sales.div(pieces)) : "0.00",
    grossProfit: money(margin), profitPct: sales.gt(0) ? margin.div(sales).times(100).toFixed(1) : null,
    purchases: money(p!.amount), purchasedPieces: dec(p!.pieces).toFixed(0),
  };
}

const ranked = (rows: { name: string | null; amount: string; qty: string }[]) =>
  rows.filter((r) => r.name && dec(r.amount).gt(0)).map((r) => ({ name: r.name!, amount: money(r.amount), qty: dec(r.qty).toFixed(0) }));

/**
 * The owner's business intelligence page for a period: headline figures against the same period a year
 * earlier, the sales trend, what sells on which weekday, the best salesmen, designs, customers and
 * brands, how customers pay, and how old the goods were when they sold.
 */
export async function insights(tx: Tx, from: string, to: string) {
  const company = await resolveCompany(tx);
  const id = company.id;
  const lyFrom = shiftYear(from, -1);
  const lyTo = shiftYear(to, -1);
  const [now, lastYear] = [await headline(tx, id, from, to), await headline(tx, id, lyFrom, lyTo)];
  const stock = await stockSummary(tx, company, to);
  // Pieces means garments (items made as colour-size variants), not fabric metres or trims.
  const garments = new Set([...await tx.execute<{ id: string }>(sql`select id from items where company_id = ${id} and style_id is not null`)].map((r) => r.id));
  const goodsQty = stock.rows.reduce((t, r) => t.plus(garments.has(r.itemId) && dec(r.qty).gt(0) ? r.qty : 0), dec(0));
  const owed = (rows: { balance: string }[]) => money(rows.reduce((t, r) => (dec(r.balance).gt(0) ? t.plus(r.balance) : t), dec(0)));
  const receivable = owed((await outstanding(tx, id, "receivable", to)).rows);
  const payable = owed((await outstanding(tx, id, "payable", to)).rows);

  // Daily for up to two months, else monthly.
  const monthly = days(from, to) > 62;
  const trend = await tx.execute<{ period: string; amount: string }>(sql`
    with x as (${saleLines(id, from, to)})
    select ${monthly ? sql`to_char(date, 'YYYY-MM')` : sql`to_char(date, 'YYYY-MM-DD')`} as period, sum(amount)::text as amount
    from x group by 1 order by 1`);
  const weekday = await tx.execute<{ dow: number; amount: string; qty: string }>(sql`
    with x as (${saleLines(id, from, to)})
    select extract(isodow from date)::int as dow, sum(amount)::text as amount, sum(qty)::text as qty from x group by 1 order by 1`);
  // Counter bills by the hour of the day they were rung up (India time), for staffing and opening hours.
  const hourly = await tx.execute<{ hour: number; amount: string; bills: number }>(sql`
    select extract(hour from (coalesce(billed_at, created_at) at time zone 'Asia/Kolkata'))::int as hour, sum(total)::text as amount, count(*)::int as bills
    from pos_bills where company_id = ${id} and status = 'paid' and date between ${from}::date and ${to}::date group by 1 order by 1`);
  const salesmen = await tx.execute<{ name: string | null; amount: string; qty: string }>(sql`
    with x as (${saleLines(id, from, to)})
    select e.name, sum(x.amount)::text as amount, sum(x.qty)::text as qty from x join employees e on e.id = x.salesman_id
    group by e.name order by sum(x.amount) desc limit 10`);
  const designs = await tx.execute<{ name: string | null; amount: string; qty: string }>(sql`
    with x as (${saleLines(id, from, to)})
    select coalesce(st.code || ' ' || st.name, i.name) as name, sum(x.amount)::text as amount, sum(x.qty)::text as qty
    from x join items i on i.id = x.item_id left join styles st on st.id = i.style_id where i.kind = 'goods'
    group by 1 order by sum(x.amount) desc limit 10`);
  const brands = await tx.execute<{ name: string | null; amount: string; qty: string }>(sql`
    with x as (${saleLines(id, from, to)})
    select st.brand as name, sum(x.amount)::text as amount, sum(x.qty)::text as qty
    from x join items i on i.id = x.item_id join styles st on st.id = i.style_id where st.brand is not null
    group by 1 order by sum(x.amount) desc limit 10`);
  const customers = await tx.execute<{ name: string | null; amount: string; qty: string }>(sql`
    with x as (${saleLines(id, from, to)})
    select max(x.party) as name, sum(x.amount)::text as amount, sum(x.qty)::text as qty from x where x.customer_id is not null
    group by x.customer_id order by sum(x.amount) desc limit 10`);
  // How the money came in (with tax): counter tenders less change given, and invoices on account.
  const tenders = await tx.execute<{ mode: string; amount: string }>(sql`
    select mode, sum(amount)::text as amount from (
      select p->>'mode' as mode, (p->>'amount')::numeric - case when p->>'mode' = 'cash' then b.change else 0 end as amount
      from pos_bills b cross join lateral jsonb_array_elements(b.payments) p
      where b.company_id = ${id} and b.status = 'paid' and b.date between ${from}::date and ${to}::date
      union all select 'invoice', total from sales_invoices where company_id = ${id} and status <> 'cancelled' and date between ${from}::date and ${to}::date
    ) t group by mode order by sum(amount) desc`);
  const buckets = await salesAgeing(tx, id, from, to);

  return {
    from, to, lastYear: { from: lyFrom, to: lyTo },
    kpis: { ...now, stockValue: stock.totalValue, stockPieces: goodsQty.toFixed(0), receivable, payable },
    previous: lastYear,
    trend: { by: monthly ? "month" : "day", points: [...trend].map((r) => ({ period: r.period, amount: money(r.amount) })) },
    weekday: [1, 2, 3, 4, 5, 6, 7].map((d) => {
      const r = [...weekday].find((w) => w.dow === d);
      return { day: d, amount: money(r?.amount ?? 0), qty: dec(r?.qty ?? 0).toFixed(0) };
    }),
    hourly: Array.from({ length: 24 }, (_, h) => {
      const r = [...hourly].find((x) => x.hour === h);
      return { hour: h, amount: money(r?.amount ?? 0), bills: r?.bills ?? 0 };
    }),
    salesmen: ranked([...salesmen]), designs: ranked([...designs]), brands: ranked([...brands]), customers: ranked([...customers]),
    tenders: [...tenders].filter((t) => dec(t.amount).gt(0)).map((t) => ({ mode: t.mode, amount: money(t.amount) })),
    ageing: buckets.map((b) => ({ key: b.key, amount: money(b.amount), qty: b.qty.toFixed(0) })),
  };
}

/**
 * How old the pieces were when they sold, first in first out: every document's net movement of an item
 * (transfers between stores cancel out) adds a lot or takes from the oldest lots; a sale in the period
 * records the age of the lots it took. Value is the item's average sale rate in the period.
 */
export async function salesAgeing(tx: Tx, companyId: string, from: string, to: string, buckets: readonly { key: string; upTo: number | null }[] = AGE_BUCKETS) {
  const moves = await tx.execute<{ item_id: string; date: string; source_type: string; net: string }>(sql`
    select l.item_id, l.date::text as date, l.source_type, sum(l.qty_in - l.qty_out)::text as net
    from stock_ledger l join items i on i.id = l.item_id
    where l.company_id = ${companyId} and l.date <= ${to}::date and i.kind = 'goods'
    group by l.item_id, l.date, l.source_type, l.source_id
    having sum(l.qty_in - l.qty_out) <> 0
    order by l.item_id, l.date, sum(l.qty_in - l.qty_out) desc`);
  const rates = await tx.execute<{ item_id: string; rate: string }>(sql`
    with x as (${saleLines(companyId, from, to)})
    select item_id, (sum(amount) / nullif(sum(qty), 0))::text as rate from x group by item_id`);
  const rateOf = new Map([...rates].map((r) => [r.item_id, Number(r.rate ?? 0)]));
  const out = buckets.map((b) => ({ key: b.key, qty: 0, amount: 0 }));
  const dayNo = (iso: string) => Date.parse(`${iso}T00:00:00Z`) / 86_400_000;
  let item = "";
  let lots: { day: number; qty: number }[] = [];
  for (const m of moves) {
    if (m.item_id !== item) { item = m.item_id; lots = []; }
    const net = Number(m.net);
    if (net > 0) { lots.push({ day: dayNo(m.date), qty: net }); continue; }
    let need = -net;
    const sale = (m.source_type === "sales_invoice" || m.source_type === "pos_bill") && m.date >= from;
    while (need > 1e-9 && lots.length) {
      const lot = lots[0]!;
      const take = Math.min(lot.qty, need);
      if (sale) {
        const age = dayNo(m.date) - lot.day;
        const b = out[buckets.findIndex((x) => x.upTo === null || age <= x.upTo)]!;
        b.qty += take;
        b.amount += take * (rateOf.get(item) ?? 0);
      }
      lot.qty -= take;
      need -= take;
      if (lot.qty <= 1e-9) lots.shift();
    }
  }
  return out.map((b) => ({ key: b.key, qty: dec(b.qty), amount: dec(b.amount) }));
}
