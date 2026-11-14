import { sql } from "drizzle-orm";
import type { Tx } from "@varchasv/db";
import { businessDate, dec, money } from "@varchasv/domain";
import { resolveCompany } from "./accounting.js";
import { outstanding } from "./returns.js";

export interface IntegrityItem { ref: string; detail: string; amount?: string }
export interface IntegrityCheck {
  key: string;
  /** error: the books cannot be right; warn: worth a look, may be a real situation. */
  severity: "error" | "warn";
  ok: boolean;
  /** The size of the difference where there is one (rupees, or a count for record checks). */
  difference: string | null;
  count: number;
  items: IntegrityItem[];
}

const LIMIT = 20;

/** A check that returns the offending rows. */
function fromRows(key: string, severity: "error" | "warn", rows: IntegrityItem[], difference: string | null = null): IntegrityCheck {
  return { key, severity, ok: rows.length === 0, difference: rows.length ? difference ?? String(rows.length) : null, count: rows.length, items: rows.slice(0, LIMIT) };
}

/** A check that compares two totals. */
function compare(key: string, a: string, b: string, items: IntegrityItem[] = []): IntegrityCheck {
  const diff = dec(a).minus(b);
  return { key, severity: "error", ok: diff.isZero(), difference: diff.isZero() ? null : money(diff), count: diff.isZero() ? 0 : 1, items: diff.isZero() ? [] : items };
}

/**
 * Do the books agree with themselves? Every voucher balances, the trial balance balances, each posted
 * invoice and bill matches what it put in the party's account, cancelled vouchers net to nothing, customers'
 * and suppliers' balances match the ledger, and the gift voucher liability matches the vouchers still unspent.
 * Nothing here changes data: it only lists differences with the records behind them.
 */
export async function integrityChecks(tx: Tx, asOf = businessDate()): Promise<{ asOf: string; ok: boolean; checks: IntegrityCheck[] }> {
  const company = await resolveCompany(tx);
  const cid = company.id;
  const checks: IntegrityCheck[] = [];

  const unbalanced = await tx.execute<{ number: string; type: string; diff: string }>(sql`
    select v.number, v.type, sum(e.debit) - sum(e.credit) as diff
    from vouchers v join gl_entries e on e.voucher_id = v.id and not e.is_reversal
    where v.company_id = ${cid} and v.status = 'posted'
    group by v.id having sum(e.debit) <> sum(e.credit) order by v.date desc limit 200`);
  checks.push(fromRows("vouchersBalance", "error", [...unbalanced].map((r) => ({ ref: r.number, detail: r.type, amount: money(r.diff) })), null));

  const [tb] = await tx.execute<{ diff: string }>(sql`
    select (select coalesce(sum(opening_balance), 0) from accounts where company_id = ${cid})
         + (select coalesce(sum(e.debit - e.credit), 0) from gl_entries e join vouchers v on v.id = e.voucher_id where e.company_id = ${cid} and v.status = 'posted' and not e.is_reversal) as diff`);
  checks.push(compare("trialBalance", tb?.diff ?? "0", "0"));

  const sales = await tx.execute<{ number: string; total: string; ledger: string }>(sql`
    select si.number, si.total, coalesce(sum(e.debit - e.credit), 0) as ledger
    from sales_invoices si left join gl_entries e on e.voucher_id = si.voucher_id and e.account_id = si.customer_id and not e.is_reversal
    where si.company_id = ${cid} and si.status = 'posted' and si.voucher_id is not null
    group by si.id having si.total <> coalesce(sum(e.debit - e.credit), 0) order by si.date desc limit 200`);
  checks.push(fromRows("invoicesMatchLedger", "error", [...sales].map((r) => ({ ref: r.number, detail: `${money(r.total)} / ${money(r.ledger)}`, amount: money(dec(r.total).minus(r.ledger)) }))));

  const bills = await tx.execute<{ number: string; total: string; ledger: string }>(sql`
    select pb.number, pb.total, coalesce(sum(e.credit - e.debit), 0) as ledger
    from purchase_bills pb left join gl_entries e on e.voucher_id = pb.voucher_id and e.account_id = pb.supplier_id and not e.is_reversal
    where pb.company_id = ${cid} and pb.status = 'posted' and pb.voucher_id is not null and not pb.reverse_charge
    group by pb.id having pb.total <> coalesce(sum(e.credit - e.debit), 0) order by pb.date desc limit 200`);
  checks.push(fromRows("billsMatchLedger", "error", [...bills].map((r) => ({ ref: r.number, detail: `${money(r.total)} / ${money(r.ledger)}`, amount: money(dec(r.total).minus(r.ledger)) }))));

  const loose = await tx.execute<{ number: string; kind: string }>(sql`
    select number, 'sales' as kind from sales_invoices where company_id = ${cid} and status = 'posted' and voucher_id is null
    union all select number, 'purchase' from purchase_bills where company_id = ${cid} and status = 'posted' and voucher_id is null
    limit 200`);
  checks.push(fromRows("documentsPosted", "error", [...loose].map((r) => ({ ref: r.number, detail: r.kind }))));

  const cancelled = await tx.execute<{ number: string; account: string; diff: string }>(sql`
    select v.number, a.name as account, sum(e.debit - e.credit) as diff
    from vouchers v join gl_entries e on e.voucher_id = v.id join accounts a on a.id = e.account_id
    where v.company_id = ${cid} and v.status = 'cancelled'
    group by v.id, a.id having sum(e.debit - e.credit) <> 0 order by v.date desc limit 200`);
  checks.push(fromRows("cancelledReversed", "error", [...cancelled].map((r) => ({ ref: r.number, detail: r.account, amount: money(r.diff) }))));

  const [debtorsLedger] = await tx.execute<{ balance: string }>(sql`
    select coalesce(sum(a.opening_balance), 0) + coalesce((select sum(e.debit - e.credit) from gl_entries e join vouchers v on v.id = e.voucher_id
      where e.account_id in (select a2.id from accounts a2 join account_groups g2 on g2.id = a2.group_id left join account_groups p2 on p2.id = g2.parent_id where a2.company_id = ${cid} and (g2.key = 'sundry_debtors' or p2.key = 'sundry_debtors'))
        and v.status = 'posted' and not e.is_reversal and e.date <= ${asOf}::date), 0) as balance
    from accounts a join account_groups g on g.id = a.group_id left join account_groups p on p.id = g.parent_id
    where a.company_id = ${cid} and (g.key = 'sundry_debtors' or p.key = 'sundry_debtors')`);
  const rec = await outstanding(tx, cid, "receivable", asOf);
  checks.push(compare("receivablesMatch", rec.total, debtorsLedger?.balance ?? "0"));

  const [creditorsLedger] = await tx.execute<{ balance: string }>(sql`
    select -(coalesce(sum(a.opening_balance), 0) + coalesce((select sum(e.debit - e.credit) from gl_entries e join vouchers v on v.id = e.voucher_id
      where e.account_id in (select a2.id from accounts a2 join account_groups g2 on g2.id = a2.group_id left join account_groups p2 on p2.id = g2.parent_id where a2.company_id = ${cid} and (g2.key = 'sundry_creditors' or p2.key = 'sundry_creditors'))
        and v.status = 'posted' and not e.is_reversal and e.date <= ${asOf}::date), 0)) as balance
    from accounts a join account_groups g on g.id = a.group_id left join account_groups p on p.id = g.parent_id
    where a.company_id = ${cid} and (g.key = 'sundry_creditors' or p.key = 'sundry_creditors')`);
  const pay = await outstanding(tx, cid, "payable", asOf);
  checks.push(compare("payablesMatch", pay.total, creditorsLedger?.balance ?? "0"));

  const [gv] = await tx.execute<{ unspent: string; ledger: string }>(sql`
    select coalesce((select sum(balance) from gift_vouchers where company_id = ${cid} and status = 'active'), 0) as unspent,
           coalesce((select sum(e.credit - e.debit) from gl_entries e join vouchers v on v.id = e.voucher_id join accounts a on a.id = e.account_id
             where e.company_id = ${cid} and a.key = 'gift_vouchers' and v.status = 'posted' and not e.is_reversal), 0)
           + coalesce((select -opening_balance from accounts where company_id = ${cid} and key = 'gift_vouchers'), 0) as ledger`);
  checks.push(compare("giftVoucherLiability", gv?.ledger ?? "0", gv?.unspent ?? "0"));

  // GST: the tax on each posted invoice is what the output tax accounts were credited in its voucher.
  const gst = await tx.execute<{ number: string; tax: string; ledger: string }>(sql`
    select si.number, (si.cgst + si.sgst + si.utgst + si.igst + si.cess) as tax,
           coalesce(sum(e.credit - e.debit) filter (where a.key like 'output\_%'), 0) as ledger
    from sales_invoices si
    left join gl_entries e on e.voucher_id = si.voucher_id and not e.is_reversal
    left join accounts a on a.id = e.account_id
    where si.company_id = ${cid} and si.status = 'posted' and si.voucher_id is not null
    group by si.id having (si.cgst + si.sgst + si.utgst + si.igst + si.cess) <> coalesce(sum(e.credit - e.debit) filter (where a.key like 'output\_%'), 0)
    order by si.date desc limit 200`);
  checks.push(fromRows("gstMatchesInvoices", "error", [...gst].map((r) => ({ ref: r.number, detail: `${money(r.tax)} / ${money(r.ledger)}`, amount: money(dec(r.tax).minus(r.ledger)) }))));

  // Payroll: a finalised run credited Salary payable with its net pay, and a paid run debited it by the same amount.
  const payroll = await tx.execute<{ period: string; stage: string; net: string; ledger: string }>(sql`
    select r.period, 'finalised' as stage, r.net_pay as net,
           coalesce((select sum(e.credit - e.debit) from gl_entries e join accounts a on a.id = e.account_id where e.voucher_id = r.voucher_id and a.key = 'salary_payable' and not e.is_reversal), 0) as ledger
    from payroll_runs r where r.company_id = ${cid} and r.status in ('finalized', 'paid') and r.voucher_id is not null
    union all
    select r.period, 'paid', r.net_pay,
           coalesce((select sum(e.debit - e.credit) from gl_entries e join accounts a on a.id = e.account_id where e.voucher_id = r.payment_voucher_id and a.key = 'salary_payable' and not e.is_reversal), 0)
    from payroll_runs r where r.company_id = ${cid} and r.status = 'paid' and r.payment_voucher_id is not null`);
  checks.push(fromRows("payrollMatchesLedger", "error", [...payroll].filter((r) => !dec(r.net).eq(r.ledger)).map((r) => ({ ref: r.period, detail: `${r.stage}: ${money(r.net)} / ${money(r.ledger)}`, amount: money(dec(r.net).minus(r.ledger)) }))));

  const negative = await tx.execute<{ item: string; warehouse: string; qty: string }>(sql`
    select i.name as item, w.name as warehouse, sum(s.qty_in - s.qty_out) as qty
    from stock_ledger s join items i on i.id = s.item_id join warehouses w on w.id = s.warehouse_id
    where s.company_id = ${cid} group by i.id, w.id having sum(s.qty_in - s.qty_out) < 0 order by sum(s.qty_in - s.qty_out) limit 200`);
  checks.push(fromRows("negativeStock", "warn", [...negative].map((r) => ({ ref: r.item, detail: r.warehouse, amount: String(Number(r.qty)) }))));

  return { asOf, ok: checks.every((c) => c.ok || c.severity === "warn"), checks };
}
