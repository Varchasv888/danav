import { sql } from "drizzle-orm";
import type { Tx } from "@varchasv/db";
import { dec, money } from "@varchasv/domain";
import { badRequest, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";

/** Group keys whose accounts are "cash" and "bank" for the books below (sub-groups included). */
const KEYS = { cash: ["cash_in_hand"], bank: ["bank_accounts", "bank_od"] } as const;
export type BookKind = keyof typeof KEYS;

const groupFilter = (keys: readonly string[]) => sql`(g.key in (${sql.join(keys.map((k) => sql`${k}`), sql`, `)}) or p.key in (${sql.join(keys.map((k) => sql`${k}`), sql`, `)}))`;

/** Posted, non-reversal entries only: a cancelled voucher and its reversal drop out together. */
const LIVE = sql`v.status = 'posted' and not e.is_reversal`;

/**
 * Cash book or bank book: for every cash (or bank) account, opening, receipts, payments and closing for
 * the period, and the same by day with a running balance.
 */
export async function cashBook(tx: Tx, kind: BookKind, from: string, to: string) {
  const company = await resolveCompany(tx);
  const accts = await tx.execute<{ id: string; name: string; opening: string }>(sql`
    select a.id, a.name, a.opening_balance as opening from accounts a
    join account_groups g on g.id = a.group_id left join account_groups p on p.id = g.parent_id
    where a.company_id = ${company.id} and ${groupFilter(KEYS[kind])} order by a.name`);
  if (!accts.length) return { kind, from, to, accounts: [], days: [], opening: "0.00", receipts: "0.00", payments: "0.00", closing: "0.00" };
  const ids = sql.join([...accts].map((a) => sql`${a.id}::uuid`), sql`, `);
  const rows = await tx.execute<{ account_id: string; date: string; debit: string; credit: string }>(sql`
    select e.account_id, e.date, e.debit, e.credit from gl_entries e join vouchers v on v.id = e.voucher_id
    where e.account_id in (${ids}) and ${LIVE} and e.date <= ${to}::date`);
  const byAcct = new Map([...accts].map((a) => [a.id, { id: a.id, name: a.name, opening: dec(a.opening), receipts: dec(0), payments: dec(0) }]));
  const daily = new Map<string, { receipts: ReturnType<typeof dec>; payments: ReturnType<typeof dec> }>();
  for (const r of rows) {
    const a = byAcct.get(r.account_id)!;
    const d = String(r.date);
    if (d < from) { a.opening = a.opening.plus(r.debit).minus(r.credit); continue; }
    a.receipts = a.receipts.plus(r.debit);
    a.payments = a.payments.plus(r.credit);
    const day = daily.get(d) ?? { receipts: dec(0), payments: dec(0) };
    day.receipts = day.receipts.plus(r.debit);
    day.payments = day.payments.plus(r.credit);
    daily.set(d, day);
  }
  const accounts = [...byAcct.values()].map((a) => ({ id: a.id, name: a.name, opening: money(a.opening), receipts: money(a.receipts), payments: money(a.payments), closing: money(a.opening.plus(a.receipts).minus(a.payments)) }));
  const opening = [...byAcct.values()].reduce((s, a) => s.plus(a.opening), dec(0));
  let run = opening;
  const days = [...daily.entries()].sort(([x], [y]) => (x < y ? -1 : 1)).map(([date, v]) => {
    run = run.plus(v.receipts).minus(v.payments);
    return { date, receipts: money(v.receipts), payments: money(v.payments), closing: money(run) };
  });
  const receipts = [...daily.values()].reduce((s, d) => s.plus(d.receipts), dec(0));
  const payments = [...daily.values()].reduce((s, d) => s.plus(d.payments), dec(0));
  return { kind, from, to, accounts, days, opening: money(opening), receipts: money(receipts), payments: money(payments), closing: money(run) };
}

/** Month by month debit, credit and closing for every account of one group (and its sub-groups). */
export async function groupMonthSummary(tx: Tx, groupId: string, from: string, to: string) {
  const company = await resolveCompany(tx);
  const [group] = await tx.execute<{ id: string; name: string }>(sql`select id, name from account_groups where id = ${groupId} and company_id = ${company.id}`);
  if (!group) throw notFound();
  const accts = await tx.execute<{ id: string; name: string; opening: string }>(sql`
    select a.id, a.name, a.opening_balance as opening from accounts a
    join account_groups g on g.id = a.group_id left join account_groups p on p.id = g.parent_id
    where a.company_id = ${company.id} and (g.id = ${groupId} or p.id = ${groupId}) order by a.name`);
  const months: string[] = [];
  for (let d = new Date(`${from.slice(0, 7)}-01T00:00:00Z`); d.toISOString().slice(0, 10) <= to; d.setUTCMonth(d.getUTCMonth() + 1)) months.push(d.toISOString().slice(0, 7));
  if (months.length > 36) throw badRequest("range_too_long");
  let opening = accts.reduce((s, a) => s.plus(a.opening), dec(0));
  const rows: Record<string, { debit: ReturnType<typeof dec>; credit: ReturnType<typeof dec> }> = {};
  if (accts.length) {
    const ids = sql.join([...accts].map((a) => sql`${a.id}::uuid`), sql`, `);
    const entries = await tx.execute<{ month: string; debit: string; credit: string }>(sql`
      select to_char(e.date, 'YYYY-MM') as month, sum(e.debit) as debit, sum(e.credit) as credit from gl_entries e join vouchers v on v.id = e.voucher_id
      where e.account_id in (${ids}) and ${LIVE} and e.date <= ${to}::date group by 1`);
    for (const e of entries) {
      if (e.month < from.slice(0, 7)) opening = opening.plus(e.debit).minus(e.credit);
      else rows[e.month] = { debit: dec(e.debit), credit: dec(e.credit) };
    }
  }
  let run = opening;
  const out = months.map((m) => {
    const r = rows[m] ?? { debit: dec(0), credit: dec(0) };
    run = run.plus(r.debit).minus(r.credit);
    return { month: m, debit: money(r.debit), credit: money(r.credit), closing: money(run) };
  });
  return { group: group.name, from, to, opening: money(opening), months: out, accounts: accts.length };
}

/** What was paid out of cash and bank on expense accounts in the period, by expense account. */
export async function cashBankExpense(tx: Tx, from: string, to: string) {
  const company = await resolveCompany(tx);
  const keys = [...KEYS.cash, ...KEYS.bank];
  const rows = await tx.execute<{ account_id: string; name: string; group_name: string; amount: string; vouchers: string }>(sql`
    select x.account_id, a.name, ag.name as group_name, sum(x.debit) as amount, count(distinct x.voucher_id) as vouchers
    from gl_entries x
    join vouchers v on v.id = x.voucher_id
    join accounts a on a.id = x.account_id
    join account_groups ag on ag.id = a.group_id
    where x.company_id = ${company.id} and ${sql`v.status = 'posted' and not x.is_reversal`} and x.date between ${from}::date and ${to}::date
      and ag.nature = 'expense' and x.debit > 0
      and exists (
        select 1 from gl_entries c join accounts ca on ca.id = c.account_id
        join account_groups cg on cg.id = ca.group_id left join account_groups cp on cp.id = cg.parent_id
        where c.voucher_id = x.voucher_id and not c.is_reversal and c.credit > 0
          and (cg.key in (${sql.join(keys.map((k) => sql`${k}`), sql`, `)}) or cp.key in (${sql.join(keys.map((k) => sql`${k}`), sql`, `)})))
    group by x.account_id, a.name, ag.name order by sum(x.debit) desc`);
  const list = [...rows].map((r) => ({ accountId: r.account_id, name: r.name, group: r.group_name, amount: money(r.amount), vouchers: Number(r.vouchers) }));
  return { from, to, rows: list, total: money(list.reduce((s, r) => s.plus(r.amount), dec(0))) };
}

/**
 * Cash flow, direct method: every voucher that moved cash or bank, with the other side grouped by its
 * account group. Money in and money out per group, and the net.
 */
export async function cashFlow(tx: Tx, from: string, to: string) {
  const company = await resolveCompany(tx);
  const keys = [...KEYS.cash, ...KEYS.bank];
  const inList = sql.join(keys.map((k) => sql`${k}`), sql`, `);
  const rows = await tx.execute<{ group_name: string; nature: string; money_in: string; money_out: string }>(sql`
    select ag.name as group_name, ag.nature, sum(o.credit) as money_in, sum(o.debit) as money_out
    from gl_entries o
    join vouchers v on v.id = o.voucher_id
    join accounts oa on oa.id = o.account_id
    join account_groups ag on ag.id = oa.group_id left join account_groups ap on ap.id = ag.parent_id
    where o.company_id = ${company.id} and v.status = 'posted' and not o.is_reversal and o.date between ${from}::date and ${to}::date
      and not (coalesce(ag.key, '') in (${inList}) or coalesce(ap.key, '') in (${inList}))
      and exists (
        select 1 from gl_entries c join accounts ca on ca.id = c.account_id
        join account_groups cg on cg.id = ca.group_id left join account_groups cp on cp.id = cg.parent_id
        where c.voucher_id = o.voucher_id and not c.is_reversal and (cg.key in (${inList}) or cp.key in (${inList})))
    group by ag.name, ag.nature order by ag.nature, ag.name`);
  const list = [...rows].map((r) => ({ group: r.group_name, nature: r.nature, moneyIn: money(r.money_in), moneyOut: money(r.money_out), net: money(dec(r.money_in).minus(r.money_out)) }));
  const sum = (k: "moneyIn" | "moneyOut") => money(list.reduce((s, r) => s.plus(r[k]), dec(0)));
  return { from, to, rows: list, moneyIn: sum("moneyIn"), moneyOut: sum("moneyOut"), net: money(list.reduce((s, r) => s.plus(r.net), dec(0))) };
}

/** Purchases on which GST is paid by us (reverse charge): the register that feeds the GSTR-3B RCM section. */
export async function rcmRegister(tx: Tx, from: string, to: string) {
  const company = await resolveCompany(tx);
  const rows = await tx.execute<{ id: string; number: string; date: string; supplier: string; gstin: string | null; invoice_no: string; invoice_date: string; taxable: string; cgst: string; sgst: string; utgst: string; igst: string; cess: string; total: string }>(sql`
    select b.id, b.number, b.date, a.name as supplier, a.gstin, b.supplier_invoice_no as invoice_no, b.supplier_invoice_date as invoice_date,
           b.taxable, b.cgst, b.sgst, b.utgst, b.igst, b.cess, b.total
    from purchase_bills b join accounts a on a.id = b.supplier_id
    where b.company_id = ${company.id} and b.reverse_charge and b.status = 'posted' and b.date between ${from}::date and ${to}::date
    order by b.date, b.number`);
  const list = [...rows].map((r) => ({
    id: r.id, number: r.number, date: String(r.date), supplier: r.supplier, gstin: r.gstin, invoiceNo: r.invoice_no, invoiceDate: String(r.invoice_date),
    taxable: money(r.taxable), cgst: money(r.cgst), sgst: money(dec(r.sgst).plus(r.utgst)), igst: money(r.igst), cess: money(r.cess), total: money(r.total),
  }));
  const sum = (k: "taxable" | "cgst" | "sgst" | "igst" | "cess") => money(list.reduce((s, r) => s.plus(r[k]), dec(0)));
  return { from, to, rows: list, totals: { taxable: sum("taxable"), cgst: sum("cgst"), sgst: sum("sgst"), igst: sum("igst"), cess: sum("cess") } };
}

/** Which bills each bill-wise receipt or payment settled, newest first. */
export async function billAdjustments(tx: Tx, from: string, to: string) {
  const company = await resolveCompany(tx);
  const rows = await tx.execute<{ id: string; rv_number: string; rv_date: string; rv_type: string; bill_number: string; bill_date: string; party: string; amount: string }>(sql`
    select al.id, rv.number as rv_number, rv.date as rv_date, rv.type as rv_type, bv.number as bill_number, bv.date as bill_date,
           a.name as party, al.amount
    from bill_allocations al
    join vouchers rv on rv.id = al.voucher_id and rv.status = 'posted'
    join vouchers bv on bv.id = al.bill_voucher_id
    left join sales_invoices si on si.voucher_id = bv.id
    left join purchase_bills pb on pb.voucher_id = bv.id
    left join accounts a on a.id = coalesce(si.customer_id, pb.supplier_id)
    where al.company_id = ${company.id} and rv.date between ${from}::date and ${to}::date
    order by rv.date desc, rv.number desc, bv.date`);
  const list = [...rows].map((r) => ({ id: r.id, voucher: r.rv_number, date: String(r.rv_date), kind: r.rv_type, bill: r.bill_number, billDate: String(r.bill_date), party: r.party, amount: money(r.amount) }));
  return { from, to, rows: list, total: money(list.reduce((s, r) => s.plus(r.amount), dec(0))) };
}
