import { sql } from "drizzle-orm";
import type { Tx } from "@varchasv/db";
import { dec, money } from "@varchasv/domain";
import { resolveCompany } from "./accounting.js";
import { LONG_AGE_BUCKETS, saleLines, salesAgeing } from "./insights.js";

/**
 * One day of selling: sales net of returns (invoices and counter bills), the number of bills, what moved through cash and
 * through the bank that day, and the best sellers (the top N by value, N chosen by the reader).
 */
export async function dailySales(tx: Tx, date: string, topN: number) {
  const company = await resolveCompany(tx);
  const cid = company.id;
  const [s] = await tx.execute<{ sales: string; pieces: string }>(sql`
    with x as (${saleLines(cid, date, date)})
    select coalesce(sum(x.amount), 0)::text as sales, coalesce(sum(case when i.kind = 'goods' then x.qty else 0 end), 0)::text as pieces
    from x join items i on i.id = x.item_id`);
  const [b] = await tx.execute<{ bills: number }>(sql`
    select ((select count(*) from sales_invoices where company_id = ${cid} and status <> 'cancelled' and date = ${date}::date)
          + (select count(*) from pos_bills where company_id = ${cid} and status = 'paid' and date = ${date}::date))::int as bills`);
  // What came in and went out of each kind of money account that day, from the books (cancelled vouchers net out).
  const money_ = await tx.execute<{ kind: string; received: string; paid: string }>(sql`
    select case when g.key = 'cash_in_hand' or p.key = 'cash_in_hand' then 'cash' else 'bank' end as kind,
      coalesce(sum(e.debit), 0)::text as received, coalesce(sum(e.credit), 0)::text as paid
    from gl_entries e join accounts a on a.id = e.account_id join account_groups g on g.id = a.group_id left join account_groups p on p.id = g.parent_id
    join vouchers v on v.id = e.voucher_id
    where e.company_id = ${cid} and v.date = ${date}::date and (g.key in ('cash_in_hand', 'bank_accounts') or p.key in ('cash_in_hand', 'bank_accounts'))
    group by 1`);
  const flow = (kind: string) => { const r = [...money_].find((m) => m.kind === kind); return { received: money(r?.received ?? 0), paid: money(r?.paid ?? 0), net: money(dec(r?.received ?? 0).minus(r?.paid ?? 0)) }; };
  const top = await tx.execute<{ item_id: string; name: string; qty: string; amount: string }>(sql`
    with x as (${saleLines(cid, date, date)})
    select x.item_id::text, i.name, sum(x.qty)::text as qty, sum(x.amount)::text as amount
    from x join items i on i.id = x.item_id group by x.item_id, i.name having sum(x.amount) <> 0 order by sum(x.amount) desc limit ${topN}`);
  const ageing = (await salesAgeing(tx, cid, date, date, LONG_AGE_BUCKETS)).map((a) => ({ key: a.key, qty: a.qty.toFixed(0), amount: money(a.amount) }));
  const sales = dec(s!.sales);
  return {
    date, topN, sales: money(sales), pieces: dec(s!.pieces).toFixed(0), bills: b!.bills, averageBill: b!.bills ? money(sales.div(b!.bills)) : "0.00",
    cash: flow("cash"), bank: flow("bank"), ageing,
    top: [...top].map((r) => ({ itemId: r.item_id, name: r.name, qty: dec(r.qty).toFixed(0), amount: money(r.amount) })),
  };
}
