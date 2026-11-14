import { sql } from "drizzle-orm";
import { type Tx } from "@varchasv/db";
import { classifyAbc, dec, money } from "@varchasv/domain";
import { accountBalances, resolveCompany } from "./accounting.js";
import { stockPositions } from "./inventory.js";

/** More lists in the reports layout: parties, items, stock, expenses, orders and loans. Each returns its rows and the totals for the foot of the page. */

const sumOf = <T>(rows: T[], pick: (r: T) => string | number) => rows.reduce((t, r) => t.plus(pick(r)), dec(0));

/** Customers and suppliers with what they owe and what is owed to them, their contact details and credit limit. */
export async function allParties(tx: Tx, asOf: string, kind: "all" | "customers" | "suppliers") {
  const company = await resolveCompany(tx);
  const balances = await accountBalances(tx, company.id, null, asOf);
  const info = new Map([...await tx.execute<{ id: string; phone: string | null; email: string | null; credit_limit: string | null }>(sql`
    select id, phone, email, credit_limit::text from accounts where company_id = ${company.id}`)].map((r) => [r.id, r]));
  const rows = balances.filter((b) => (kind !== "suppliers" && b.groupKey === "sundry_debtors") || (kind !== "customers" && b.groupKey === "sundry_creditors"))
    .map((b) => {
      const i = info.get(b.accountId);
      const bal = dec(b.closing);
      return { id: b.accountId, name: b.name, email: i?.email ?? null, phone: i?.phone ?? null, receivable: money(bal.gt(0) ? bal : 0), payable: money(bal.lt(0) ? bal.neg() : 0),
        creditLimit: i?.credit_limit && dec(i.credit_limit).gt(0) ? money(i.credit_limit) : null, kind: b.groupKey === "sundry_debtors" ? "customer" : "supplier" };
    }).sort((a, b) => a.name.localeCompare(b.name));
  return { asOf, rows, totals: { receivable: money(sumOf(rows, (r) => r.receivable)), payable: money(sumOf(rows, (r) => r.payable)) } };
}

/** For each party, the quantity and amount of an item bought from them and sold to them in the period; narrow by one item or by a category. */
export async function partyByItem(tx: Tx, from: string, to: string, itemId?: string, category?: string) {
  const company = await resolveCompany(tx);
  const id = company.id;
  const filter = sql`${itemId ? sql`and l.item_id = ${itemId}` : sql``} ${category ? sql`and st.category = ${category}` : sql``}`;
  const rows = [...await tx.execute<{ party: string; sale_qty: string; sale_amount: string; purchase_qty: string; purchase_amount: string }>(sql`
    with s as (
      select h.customer_name as party, sum(l.qty) as qty, sum(l.taxable) as amount
      from sales_invoice_lines l join sales_invoices h on h.id = l.invoice_id join items i on i.id = l.item_id left join styles st on st.id = i.style_id
      where h.company_id = ${id} and h.status <> 'cancelled' and h.date between ${from}::date and ${to}::date ${filter} group by 1
    ), p as (
      select a.name as party, sum(l.qty) as qty, sum(l.taxable) as amount
      from purchase_bill_lines l join purchase_bills h on h.id = l.bill_id join accounts a on a.id = h.supplier_id join items i on i.id = l.item_id left join styles st on st.id = i.style_id
      where h.company_id = ${id} and h.status <> 'cancelled' and h.date between ${from}::date and ${to}::date ${filter} group by 1
    ), names as (select party from s union select party from p)
    select n.party, coalesce(s.qty, 0)::text as sale_qty, coalesce(s.amount, 0)::text as sale_amount, coalesce(p.qty, 0)::text as purchase_qty, coalesce(p.amount, 0)::text as purchase_amount
    from names n left join s on s.party = n.party left join p on p.party = n.party where n.party is not null order by n.party`)];
  const out = rows.map((r) => ({ party: r.party, saleQty: dec(r.sale_qty).toString(), saleAmount: money(r.sale_amount), purchaseQty: dec(r.purchase_qty).toString(), purchaseAmount: money(r.purchase_amount) }));
  return { from, to, rows: out, totals: { saleQty: sumOf(out, (r) => r.saleQty).toString(), saleAmount: money(sumOf(out, (r) => r.saleAmount)), purchaseQty: sumOf(out, (r) => r.purchaseQty).toString(), purchaseAmount: money(sumOf(out, (r) => r.purchaseAmount)) } };
}

/** What was sold to and bought from each party in the period (net of credit notes and purchase returns), or from each group of parties. */
export async function saleByParty(tx: Tx, from: string, to: string, by: "party" | "group") {
  const company = await resolveCompany(tx);
  const id = company.id;
  const key = by === "party" ? sql`a.name` : sql`g.name`;
  const rows = [...await tx.execute<{ name: string; sale: string; purchase: string }>(sql`
    with x as (
      select a.id as account_id, h.total as sale, 0::numeric as purchase from sales_invoices h join accounts a on a.id = h.customer_id where h.company_id = ${id} and h.status <> 'cancelled' and h.date between ${from}::date and ${to}::date
      union all select a.id, -n.total, 0 from credit_notes n join accounts a on a.id = n.customer_id where n.company_id = ${id} and n.status <> 'cancelled' and n.date between ${from}::date and ${to}::date
      union all select a.id, 0, b.total from purchase_bills b join accounts a on a.id = b.supplier_id where b.company_id = ${id} and b.status <> 'cancelled' and b.date between ${from}::date and ${to}::date
      union all select a.id, 0, -r.total from purchase_returns r join accounts a on a.id = r.supplier_id where r.company_id = ${id} and r.status <> 'cancelled' and r.date between ${from}::date and ${to}::date
    )
    select ${key} as name, sum(x.sale)::text as sale, sum(x.purchase)::text as purchase
    from x join accounts a on a.id = x.account_id join account_groups g on g.id = a.group_id group by 1 order by 1`)];
  const out = rows.map((r) => ({ name: r.name, sale: money(r.sale), purchase: money(r.purchase) }));
  return { from, to, by, rows: out, totals: { sale: money(sumOf(out, (r) => r.sale)), purchase: money(sumOf(out, (r) => r.purchase)) } };
}

/** Sales by HSN (goods) or by SAC (services): value, taxable value and each tax, from the sale invoices of the period. */
export async function hsnSummary(tx: Tx, from: string, to: string, kind: "hsn" | "sac") {
  const company = await resolveCompany(tx);
  const rows = [...await tx.execute<{ code: string | null; total: string; taxable: string; igst: string; cgst: string; sgst: string; cess: string }>(sql`
    select i.hsn as code, sum(l.total)::text as total, sum(l.taxable)::text as taxable, sum(l.igst)::text as igst, sum(l.cgst)::text as cgst,
      sum(l.sgst + l.utgst)::text as sgst, sum(l.cess)::text as cess
    from sales_invoice_lines l join sales_invoices h on h.id = l.invoice_id join items i on i.id = l.item_id
    where h.company_id = ${company.id} and h.status <> 'cancelled' and h.date between ${from}::date and ${to}::date and ${kind === "sac" ? sql`i.kind = 'service'` : sql`i.kind <> 'service'`}
    group by 1 order by 1`)];
  const out = rows.map((r) => ({ code: r.code ?? "-", total: money(r.total), taxable: money(r.taxable), igst: money(r.igst), cgst: money(r.cgst), sgst: money(r.sgst), cess: money(r.cess) }));
  return { from, to, kind, rows: out, totals: { total: money(sumOf(out, (r) => r.total)), items: out.length } };
}

/** Items whose stock has fallen to or below the minimum set for them. */
export async function lowStock(tx: Tx, asOf: string, category?: string, onlyInStock = false) {
  const company = await resolveCompany(tx);
  const items = [...await tx.execute<{ id: string; name: string; reorder_level: string }>(sql`
    select i.id, i.name, i.reorder_level::text from items i left join styles st on st.id = i.style_id
    where i.company_id = ${company.id} and i.kind = 'goods' and not i.archived and i.reorder_level > 0 ${category ? sql`and st.category = ${category}` : sql``}`)];
  const positions = await stockPositions(tx, company, asOf);
  const qty = new Map<string, ReturnType<typeof dec>>(), value = new Map<string, ReturnType<typeof dec>>();
  for (const p of positions) { qty.set(p.itemId, (qty.get(p.itemId) ?? dec(0)).plus(p.qty)); value.set(p.itemId, (value.get(p.itemId) ?? dec(0)).plus(p.value)); }
  const rows = items.map((i) => ({ id: i.id, name: i.name, minimum: dec(i.reorder_level).toString(), stock: (qty.get(i.id) ?? dec(0)).toString(), value: money(value.get(i.id) ?? 0) }))
    .filter((r) => dec(r.stock).lte(r.minimum) && (!onlyInStock || dec(r.stock).gt(0))).sort((a, b) => a.name.localeCompare(b.name));
  return { asOf, rows, totals: { items: rows.length } };
}

const SALE = ["sales_invoice", "pos_bill", "delivery_note"], PURCHASE = ["purchase_bill", "grn", "goods_receipt"];

/** For each item: what was in stock at the start, what came in and went out, and what is left, over the period. */
export async function stockDetail(tx: Tx, from: string, to: string, category?: string) {
  const company = await resolveCompany(tx);
  const rows = [...await tx.execute<{ name: string; opening: string; qty_in: string; in_value: string; qty_out: string; closing: string }>(sql`
    select i.name,
      coalesce(sum(l.qty_in - l.qty_out) filter (where l.date < ${from}::date), 0)::text as opening,
      coalesce(sum(l.qty_in) filter (where l.date between ${from}::date and ${to}::date), 0)::text as qty_in,
      coalesce(sum(l.qty_in * l.rate) filter (where l.date between ${from}::date and ${to}::date), 0)::text as in_value,
      coalesce(sum(l.qty_out) filter (where l.date between ${from}::date and ${to}::date), 0)::text as qty_out,
      coalesce(sum(l.qty_in - l.qty_out) filter (where l.date <= ${to}::date), 0)::text as closing
    from items i left join styles st on st.id = i.style_id left join stock_ledger l on l.item_id = i.id and not l.is_reversal
    where i.company_id = ${company.id} and i.kind = 'goods' and not i.archived ${category ? sql`and st.category = ${category}` : sql``}
    group by i.id, i.name having count(l.id) > 0 order by i.name`)];
  const out = rows.map((r) => ({ name: r.name, opening: dec(r.opening).toString(), qtyIn: dec(r.qty_in).toString(), inValue: money(r.in_value), qtyOut: dec(r.qty_out).toString(), closing: dec(r.closing).toString() }));
  return { from, to, rows: out, totals: { opening: sumOf(out, (r) => r.opening).toString(), qtyIn: sumOf(out, (r) => r.qtyIn).toString(), qtyOut: sumOf(out, (r) => r.qtyOut).toString(), closing: sumOf(out, (r) => r.closing).toString() } };
}

/** One item day by day: sold, bought, adjusted and the quantity left at the end of each day. */
export async function itemDetail(tx: Tx, itemId: string, from: string, to: string, hideInactive: boolean) {
  const company = await resolveCompany(tx);
  const [opening] = [...await tx.execute<{ q: string }>(sql`
    select coalesce(sum(qty_in - qty_out), 0)::text as q from stock_ledger where company_id = ${company.id} and item_id = ${itemId} and not is_reversal and date < ${from}::date`)];
  const days = [...await tx.execute<{ date: string; sale: string; purchase: string; adjust: string }>(sql`
    select date::text as date,
      coalesce(sum(qty_out - qty_in) filter (where source_type = any(${`{${SALE.join(",")}}`}::text[])), 0)::text as sale,
      coalesce(sum(qty_in - qty_out) filter (where source_type = any(${`{${PURCHASE.join(",")}}`}::text[])), 0)::text as purchase,
      coalesce(sum(qty_in - qty_out) filter (where not (source_type = any(${`{${[...SALE, ...PURCHASE].join(",")}}`}::text[]))), 0)::text as adjust
    from stock_ledger where company_id = ${company.id} and item_id = ${itemId} and not is_reversal and date between ${from}::date and ${to}::date group by 1 order by 1`)];
  let run = dec(opening?.q ?? 0);
  const rows = days.map((d) => { run = run.plus(d.purchase).plus(d.adjust).minus(d.sale); return { date: d.date, sale: dec(d.sale).toString(), purchase: dec(d.purchase).toString(), adjustment: dec(d.adjust).toString(), closing: run.toString() }; });
  const shown = hideInactive ? rows : rows;
  return { from, to, itemId, opening: dec(opening?.q ?? 0).toString(), rows: shown };
}

/** For each item sold: pieces, sale amount, discount given and the average discount percentage. */
export async function itemDiscount(tx: Tx, from: string, to: string, query?: string, category?: string) {
  const company = await resolveCompany(tx);
  const rows = [...await tx.execute<{ name: string; qty: string; sale: string; discount: string }>(sql`
    select i.name, sum(l.qty)::text as qty, sum(l.taxable)::text as sale, sum(l.discount)::text as discount
    from sales_invoice_lines l join sales_invoices h on h.id = l.invoice_id join items i on i.id = l.item_id left join styles st on st.id = i.style_id
    where h.company_id = ${company.id} and h.status <> 'cancelled' and h.date between ${from}::date and ${to}::date
      ${query ? sql`and lower(i.name) like ${`%${query.toLowerCase()}%`}` : sql``} ${category ? sql`and st.category = ${category}` : sql``}
    group by i.id, i.name having sum(l.discount) > 0 order by sum(l.discount) desc`)];
  const out = rows.map((r) => {
    const gross = dec(r.sale).plus(r.discount);
    return { name: r.name, qty: dec(r.qty).toString(), sale: money(r.sale), discount: money(r.discount), avgPct: gross.gt(0) ? dec(r.discount).div(gross).times(100).toDecimalPlaces(2).toString() : "0" };
  });
  return { from, to, rows: out, totals: { sale: money(sumOf(out, (r) => r.sale)), discount: money(sumOf(out, (r) => r.discount)) } };
}

/** Expenses of the period by category (the expense groups of the books) or by item (each expense ledger). */
export async function expenseReport(tx: Tx, from: string, to: string, by: "category" | "item") {
  const company = await resolveCompany(tx);
  const rows = (await accountBalances(tx, company.id, from, to)).filter((b) => b.nature === "expense" && b.groupKey !== "purchase_accounts");
  const amount = (b: (typeof rows)[number]) => dec(b.debit).minus(b.credit);
  let out: { name: string; kind: string; amount: string }[];
  if (by === "item") out = rows.map((b) => ({ name: b.name, kind: b.groupName, amount: money(amount(b)) })).filter((r) => !dec(r.amount).isZero());
  else {
    const g = new Map<string, ReturnType<typeof dec>>();
    for (const b of rows) g.set(b.groupName, (g.get(b.groupName) ?? dec(0)).plus(amount(b)));
    out = [...g.entries()].map(([name, a]) => ({ name, kind: name, amount: money(a) })).filter((r) => !dec(r.amount).isZero());
  }
  out.sort((a, b) => dec(b.amount).comparedTo(a.amount));
  return { from, to, by, rows: out, totals: { amount: money(sumOf(out, (r) => r.amount)) } };
}

/** What each item has been ordered in, by status of the orders: pieces and value. */
export async function saleOrderItems(tx: Tx, from: string, to: string, status?: string) {
  const company = await resolveCompany(tx);
  const rows = [...await tx.execute<{ name: string; qty: string; amount: string }>(sql`
    select i.name, sum(l.qty)::text as qty, sum(l.qty * l.rate)::text as amount
    from sales_order_lines l join sales_orders o on o.id = l.order_id join items i on i.id = l.item_id
    where o.company_id = ${company.id} and o.status <> 'cancelled' and o.date between ${from}::date and ${to}::date ${status ? sql`and o.status = ${status}` : sql``}
    group by i.id, i.name order by i.name`)];
  const out = rows.map((r) => ({ name: r.name, qty: dec(r.qty).toString(), amount: money(r.amount) }));
  return { from, to, rows: out, totals: { qty: sumOf(out, (r) => r.qty).toString(), amount: money(sumOf(out, (r) => r.amount)) } };
}

/** Each loan account (secured, unsecured and bank overdraft ledgers): what stood at the start, what was drawn, what was repaid and what is owed at the end. */
export async function loanStatement(tx: Tx, from: string, to: string) {
  const company = await resolveCompany(tx);
  const rows = (await accountBalances(tx, company.id, from, to)).filter((b) => ["secured_loans", "unsecured_loans", "bank_od", "loans_liability"].includes(b.groupKey))
    .map((b) => ({ id: b.accountId, name: b.name, group: b.groupName, opening: money(dec(b.opening).neg()), drawn: money(b.credit), repaid: money(b.debit), balance: money(dec(b.closing).neg()) }))
    .filter((r) => !dec(r.opening).isZero() || !dec(r.drawn).isZero() || !dec(r.repaid).isZero() || !dec(r.balance).isZero());
  return { from, to, rows, totals: { opening: money(sumOf(rows, (r) => r.opening)), drawn: money(sumOf(rows, (r) => r.drawn)), repaid: money(sumOf(rows, (r) => r.repaid)), balance: money(sumOf(rows, (r) => r.balance)) } };
}

/** Stock classed A, B or C by what each item sold for in the year to a date, with how often each class should be counted. */
export async function abcClassification(tx: Tx, asOf: string) {
  const company = await resolveCompany(tx);
  const from = new Date(Date.parse(`${asOf}T00:00:00Z`) - 364 * 86_400_000).toISOString().slice(0, 10);
  const rows = [...await tx.execute<{ id: string; name: string; value: string }>(sql`
    select i.id, i.name, sum(x.value)::text as value from (
      select l.item_id, l.taxable as value from sales_invoice_lines l join sales_invoices h on h.id = l.invoice_id
        where h.company_id = ${company.id} and h.status <> 'cancelled' and h.date between ${from}::date and ${asOf}::date
      union all
      select l.item_id, l.taxable from pos_bill_lines l join pos_bills b on b.id = l.bill_id
        where b.company_id = ${company.id} and b.status = 'paid' and b.date between ${from}::date and ${asOf}::date
    ) x join items i on i.id = x.item_id where i.kind = 'goods' group by i.id, i.name`)];
  const names = new Map(rows.map((r) => [r.id, r.name]));
  const classed = classifyAbc(rows.map((r) => ({ id: r.id, value: r.value }))).map((r) => ({ name: names.get(r.id)!, class: r.class, value: r.value, sharePct: r.sharePct, cumulativePct: r.cumulativePct, countEveryDays: r.countEveryDays }));
  const count = (k: string) => classed.filter((r) => r.class === k).length;
  return { asOf, from, rows: classed, totals: { a: count("A"), b: count("B"), c: count("C"), value: money(sumOf(classed, (r) => r.value)) } };
}

/**
 * Customers who are due to order again: for each customer with at least three invoices in the last eighteen months, the usual number of days between
 * their orders, the days since the last one, and how far past the usual gap they are.
 */
export async function likelyDue(tx: Tx, asOf: string) {
  const company = await resolveCompany(tx);
  const rows = [...await tx.execute<{ party: string; invoices: number; gap: string; last: string; avg_value: string }>(sql`
    with inv as (
      select customer_id, customer_name, date, total, lag(date) over (partition by customer_id order by date) as prev
      from sales_invoices where company_id = ${company.id} and status <> 'cancelled' and customer_id is not null
        and date <= ${asOf}::date and date >= (${asOf}::date - 548)
    )
    select max(customer_name) as party, count(*)::int as invoices, avg(date - prev) filter (where prev is not null)::text as gap, max(date)::text as last, avg(total)::text as avg_value
    from inv group by customer_id having count(*) >= 3`)];
  const out = rows.map((r) => {
    const gap = Math.round(Number(r.gap)), since = Math.round((Date.parse(`${asOf}T00:00:00Z`) - Date.parse(`${r.last}T00:00:00Z`)) / 86_400_000);
    return { party: r.party, invoices: r.invoices, usualGapDays: gap, lastOrder: r.last, daysSince: since, daysPast: since - gap, averageOrder: money(r.avg_value) };
  }).filter((r) => r.daysPast >= 0).sort((a, b) => b.daysPast - a.daysPast);
  return { asOf, rows: out, totals: { customers: out.length } };
}

/** Sales and purchases of the period by item category (the category of each item's style). */
export async function saleByCategory(tx: Tx, from: string, to: string, party?: string) {
  const company = await resolveCompany(tx);
  const id = company.id;
  const like = party ? sql`and lower(h.customer_name) like ${`%${party.toLowerCase()}%`}` : sql``;
  const rows = [...await tx.execute<{ category: string; sale_qty: string; sale_amount: string; purchase_qty: string; purchase_amount: string }>(sql`
    with s as (
      select coalesce(st.category, '-') as category, sum(l.qty) as qty, sum(l.taxable) as amount
      from sales_invoice_lines l join sales_invoices h on h.id = l.invoice_id join items i on i.id = l.item_id left join styles st on st.id = i.style_id
      where h.company_id = ${id} and h.status <> 'cancelled' and h.date between ${from}::date and ${to}::date ${like} group by 1
    ), p as (
      select coalesce(st.category, '-') as category, sum(l.qty) as qty, sum(l.taxable) as amount
      from purchase_bill_lines l join purchase_bills h on h.id = l.bill_id join items i on i.id = l.item_id left join styles st on st.id = i.style_id
      where h.company_id = ${id} and h.status <> 'cancelled' and h.date between ${from}::date and ${to}::date group by 1
    ), c as (select category from s union select category from p)
    select c.category, coalesce(s.qty, 0)::text as sale_qty, coalesce(s.amount, 0)::text as sale_amount, coalesce(p.qty, 0)::text as purchase_qty, coalesce(p.amount, 0)::text as purchase_amount
    from c left join s on s.category = c.category left join p on p.category = c.category order by c.category`)];
  const out = rows.map((r) => ({ category: r.category, saleQty: dec(r.sale_qty).toString(), saleAmount: money(r.sale_amount), purchaseQty: dec(r.purchase_qty).toString(), purchaseAmount: money(r.purchase_amount) }));
  return { from, to, rows: out, totals: { saleAmount: money(sumOf(out, (r) => r.saleAmount)), purchaseAmount: money(sumOf(out, (r) => r.purchaseAmount)) } };
}

/** Stock and its value as of a date, added up by item category. */
export async function stockByCategory(tx: Tx, asOf: string) {
  const company = await resolveCompany(tx);
  const cat = new Map([...await tx.execute<{ id: string; category: string }>(sql`
    select i.id, coalesce(st.category, '-') as category from items i left join styles st on st.id = i.style_id where i.company_id = ${company.id}`)].map((r) => [r.id, r.category]));
  const by = new Map<string, { qty: ReturnType<typeof dec>; value: ReturnType<typeof dec> }>();
  for (const p of await stockPositions(tx, company, asOf)) {
    const k = cat.get(p.itemId) ?? "-";
    const cur = by.get(k) ?? { qty: dec(0), value: dec(0) };
    by.set(k, { qty: cur.qty.plus(p.qty), value: cur.value.plus(p.value) });
  }
  const rows = [...by.entries()].map(([category, v]) => ({ category, qty: v.qty.toString(), value: money(v.value) })).filter((r) => !dec(r.qty).isZero() || !dec(r.value).isZero()).sort((a, b) => a.category.localeCompare(b.category));
  return { asOf, rows, totals: { qty: sumOf(rows, (r) => r.qty).toString(), value: money(sumOf(rows, (r) => r.value)) } };
}

/** Discount given to each customer on sales and taken from each supplier on purchases, from the line discounts of the period. */
export async function discountReport(tx: Tx, from: string, to: string) {
  const company = await resolveCompany(tx);
  const id = company.id;
  const rows = [...await tx.execute<{ party: string; sale: string; purchase: string }>(sql`
    with x as (
      select h.customer_name as party, sum(l.discount) as sale, 0::numeric as purchase
      from sales_invoice_lines l join sales_invoices h on h.id = l.invoice_id where h.company_id = ${id} and h.status <> 'cancelled' and h.date between ${from}::date and ${to}::date group by 1
      union all
      select a.name, 0, sum(l.discount)
      from purchase_bill_lines l join purchase_bills h on h.id = l.bill_id join accounts a on a.id = h.supplier_id where h.company_id = ${id} and h.status <> 'cancelled' and h.date between ${from}::date and ${to}::date group by 1
    )
    select party, sum(sale)::text as sale, sum(purchase)::text as purchase from x where party is not null group by party having sum(sale) + sum(purchase) > 0 order by party`)];
  const out = rows.map((r) => ({ party: r.party, sale: money(r.sale), purchase: money(r.purchase) }));
  return { from, to, rows: out, totals: { sale: money(sumOf(out, (r) => r.sale)), purchase: money(sumOf(out, (r) => r.purchase)) } };
}

/** The lines of a bank account as loaded from its statements, for the period, with what each was matched to. */
export async function bankStatementReport(tx: Tx, accountId: string, from: string, to: string) {
  const company = await resolveCompany(tx);
  const rows = [...await tx.execute<{ id: string; date: string; description: string; reference: string | null; debit: string; credit: string; balance: string | null; status: string }>(sql`
    select id, date::text as date, description, reference, debit::text, credit::text, balance::text, status
    from bank_lines where company_id = ${company.id} and account_id = ${accountId} and date between ${from}::date and ${to}::date order by date, seq`)];
  const out = rows.map((r) => ({ id: r.id, date: r.date, description: r.description, reference: r.reference, withdrawal: money(r.debit), deposit: money(r.credit), balance: r.balance === null ? null : money(r.balance), status: r.status }));
  const last = [...out].reverse().find((r) => r.balance !== null);
  return { from, to, rows: out, totals: { withdrawal: money(sumOf(out, (r) => r.withdrawal)), deposit: money(sumOf(out, (r) => r.deposit)), balance: last?.balance ?? null } };
}

