import { sql } from "drizzle-orm";
import { type Tx } from "@varchasv/db";
import { dec, money } from "@varchasv/domain";
import { resolveCompany } from "./accounting.js";
import { actualUnitCosts } from "./profitability.js";

/**
 * Lists in the layout the reports screens share: one row per document, each with the link to open it, and totals for the foot of the page.
 * These read the documents as they stand; cancelled ones are left out.
 */

export const TXN_TYPES = ["sale", "purchase", "saleReturn", "purchaseReturn", "counterSale", "paymentIn", "paymentOut"] as const;
export type TxnType = (typeof TXN_TYPES)[number];

const HREF: Record<TxnType, string> = {
  sale: "/sales/invoices/", purchase: "/purchase/bills/", saleReturn: "/sales/credit-notes/", purchaseReturn: "/purchase/returns/",
  counterSale: "/pos/bills/", paymentIn: "/accounts/vouchers/", paymentOut: "/accounts/vouchers/",
};

export interface TxnRow { id: string; date: string; number: string; party: string | null; type: TxnType; total: string; moneyIn: string; moneyOut: string; href: string }

/** Every document of the period in one list, oldest first, with what came in and went out. `type` narrows it to one kind. */
export async function transactionsList(tx: Tx, from: string, to: string, type?: TxnType) {
  const company = await resolveCompany(tx);
  const id = company.id;
  const rows = [...await tx.execute<{ id: string; date: string; number: string; party: string | null; type: TxnType; total: string; money_in: string; money_out: string }>(sql`
    select * from (
      select s.id, s.date::text as date, s.number, s.customer_name as party, 'sale'::text as type, s.total::text as total, '0' as money_in, '0' as money_out
      from sales_invoices s where s.company_id = ${id} and s.status <> 'cancelled' and s.date between ${from}::date and ${to}::date
      union all
      select b.id, b.date::text, b.number, a.name, 'purchase', b.total::text, '0', '0'
      from purchase_bills b join accounts a on a.id = b.supplier_id where b.company_id = ${id} and b.status <> 'cancelled' and b.date between ${from}::date and ${to}::date
      union all
      select n.id, n.date::text, n.number, s.customer_name, 'saleReturn', n.total::text, '0', '0'
      from credit_notes n left join sales_invoices s on s.id = n.invoice_id where n.company_id = ${id} and n.status <> 'cancelled' and n.date between ${from}::date and ${to}::date
      union all
      select r.id, r.date::text, r.number, a.name, 'purchaseReturn', r.total::text, '0', '0'
      from purchase_returns r join accounts a on a.id = r.supplier_id where r.company_id = ${id} and r.status <> 'cancelled' and r.date between ${from}::date and ${to}::date
      union all
      select p.id, p.date::text, p.number, coalesce(p.customer_name, p.customer_phone), 'counterSale', p.total::text,
        (coalesce((select sum((x->>'amount')::numeric) from jsonb_array_elements(p.payments) x where x->>'mode' <> 'credit'), 0) - p.change)::text, '0'
      from pos_bills p where p.company_id = ${id} and p.status = 'paid' and p.date between ${from}::date and ${to}::date
      union all
      select v.id, v.date::text, v.number, (select a.name from voucher_lines vl join accounts a on a.id = vl.account_id where vl.voucher_id = v.id
          and a.key is null order by greatest(vl.debit, vl.credit) desc limit 1), 'paymentIn', v.total::text, v.total::text, '0'
      from vouchers v where v.company_id = ${id} and v.type = 'receipt' and v.status = 'posted' and v.date between ${from}::date and ${to}::date
      union all
      select v.id, v.date::text, v.number, (select a.name from voucher_lines vl join accounts a on a.id = vl.account_id where vl.voucher_id = v.id
          and a.key is null order by greatest(vl.debit, vl.credit) desc limit 1), 'paymentOut', v.total::text, '0', v.total::text
      from vouchers v where v.company_id = ${id} and v.type = 'payment' and v.status = 'posted' and v.date between ${from}::date and ${to}::date
    ) x order by date, number`)];
  const kept: TxnRow[] = rows.filter((r) => !type || r.type === type).map((r) => ({
    id: r.id, date: r.date, number: r.number, party: r.party, type: r.type, total: money(r.total), moneyIn: money(r.money_in), moneyOut: money(r.money_out), href: `${HREF[r.type]}${r.id}`,
  }));
  const sum = (k: "total" | "moneyIn" | "moneyOut") => money(kept.reduce((t, r) => t.plus(r[k]), dec(0)));
  return { from, to, type: type ?? null, rows: kept, totals: { total: sum("total"), moneyIn: sum("moneyIn"), moneyOut: sum("moneyOut") } };
}

/** What each sale invoice made: its taxable value less what the goods cost, by the real cost from the stock ledger where it is known and the standard cost of the item where it is not. */
export async function billWiseProfit(tx: Tx, from: string, to: string, party?: string) {
  const company = await resolveCompany(tx);
  const id = company.id;
  const lines = [...await tx.execute<{ invoice_id: string; number: string; date: string; party: string | null; item_id: string; qty: string; taxable: string; delivery_line_id: string | null; note_id: string | null; standard: string; goods: boolean }>(sql`
    select s.id as invoice_id, s.number, s.date::text as date, s.customer_name as party, l.item_id, l.qty::text, l.taxable::text, l.delivery_line_id, dl.note_id,
      i.purchase_rate::text as standard, (i.kind = 'goods') as goods
    from sales_invoices s join sales_invoice_lines l on l.invoice_id = s.id join items i on i.id = l.item_id
    left join delivery_note_lines dl on dl.id = l.delivery_line_id
    where s.company_id = ${id} and s.status <> 'cancelled' and s.date between ${from}::date and ${to}::date
      ${party ? sql`and lower(coalesce(s.customer_name, '')) like ${`%${party.toLowerCase()}%`}` : sql``}
    order by s.date, s.number`)];
  const unit = new Map((await actualUnitCosts(tx, company)).map((c) => [`${c.source_type}|${c.source_id}|${c.item_id}`, dec(c.unit)]));
  const by = new Map<string, { id: string; number: string; date: string; party: string | null; sale: ReturnType<typeof dec>; cost: ReturnType<typeof dec>; estimated: boolean }>();
  for (const l of lines) {
    const cur = by.get(l.invoice_id) ?? { id: l.invoice_id, number: l.number, date: l.date, party: l.party, sale: dec(0), cost: dec(0), estimated: false };
    cur.sale = cur.sale.plus(l.taxable);
    if (l.goods) {
      const real = unit.get(l.note_id ? `delivery_note|${l.note_id}|${l.item_id}` : `sales_invoice|${l.invoice_id}|${l.item_id}`);
      cur.cost = cur.cost.plus(dec(l.qty).times(real ?? dec(l.standard)));
      if (!real) cur.estimated = true;
    }
    by.set(l.invoice_id, cur);
  }
  const rows = [...by.values()].map((r) => ({ id: r.id, number: r.number, date: r.date, party: r.party, sale: money(r.sale), cost: money(r.cost), profit: money(r.sale.minus(r.cost)), costEstimated: r.estimated, href: `/sales/invoices/${r.id}` }));
  const sale = rows.reduce((t, r) => t.plus(r.sale), dec(0)), profit = rows.reduce((t, r) => t.plus(r.profit), dec(0));
  return { from, to, rows, totals: { sale: money(sale), profit: money(profit) } };
}

/** Tax by rate: the taxable value and tax on sales (tax out) and on purchases (tax in) for each GST rate, net of returns. */
export async function gstRateReport(tx: Tx, from: string, to: string) {
  const company = await resolveCompany(tx);
  const id = company.id;
  const rows = [...await tx.execute<{ rate: string; sale_taxable: string; tax_out: string; purchase_taxable: string; tax_in: string }>(sql`
    with s as (
      select l.gst_rate as rate, sum(l.taxable) as taxable, sum(l.cgst + l.sgst + l.utgst + l.igst + l.cess) as tax
      from sales_invoice_lines l join sales_invoices h on h.id = l.invoice_id where h.company_id = ${id} and h.status <> 'cancelled' and h.date between ${from}::date and ${to}::date group by 1
      union all
      select l.gst_rate, -sum(l.taxable), -sum(l.cgst + l.sgst + l.utgst + l.igst + l.cess)
      from credit_note_lines l join credit_notes h on h.id = l.note_id where h.company_id = ${id} and h.status <> 'cancelled' and h.date between ${from}::date and ${to}::date group by 1
    ), p as (
      select l.gst_rate as rate, sum(l.taxable) as taxable, sum(l.cgst + l.sgst + l.utgst + l.igst + l.cess) as tax
      from purchase_bill_lines l join purchase_bills h on h.id = l.bill_id where h.company_id = ${id} and h.status <> 'cancelled' and h.date between ${from}::date and ${to}::date group by 1
    ), r as (select rate from s union select rate from p)
    select r.rate::text as rate, coalesce((select sum(taxable) from s where s.rate = r.rate), 0)::text as sale_taxable, coalesce((select sum(tax) from s where s.rate = r.rate), 0)::text as tax_out,
      coalesce((select sum(taxable) from p where p.rate = r.rate), 0)::text as purchase_taxable, coalesce((select sum(tax) from p where p.rate = r.rate), 0)::text as tax_in
    from r order by r.rate`)];
  const out = rows.map((r) => ({ rate: dec(r.rate).toString(), saleTaxable: money(r.sale_taxable), taxOut: money(r.tax_out), purchaseTaxable: money(r.purchase_taxable), taxIn: money(r.tax_in) }));
  const sum = (k: "taxOut" | "taxIn") => money(out.reduce((t, r) => t.plus(r[k]), dec(0)));
  return { from, to, rows: out, totals: { taxIn: sum("taxIn"), taxOut: sum("taxOut") } };
}
