import { expiringDocuments } from "./hr-ops.js";
import { recentSensitiveCount } from "./sensitive.js";
import { sql } from "drizzle-orm";
import type { Tx } from "@varchasv/db";
import { STAGE_PROBABILITY, dec, fiscalYearOf, money, type LeadStage } from "@varchasv/domain";
import { profitAndLoss, resolveCompany } from "./accounting.js";
import { attendanceAlerts } from "./attendancealerts.js";
import { getBackupSettings } from "./backups.js";
import { stockSummary } from "./inventory.js";
import { outstanding } from "./returns.js";

type Company = Awaited<ReturnType<typeof resolveCompany>>;
const addDays = (d: string, n: number) => new Date(Date.parse(`${d}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);
const monthStart = (d: string) => `${d.slice(0, 7)}-01`;

export interface Alert { key: string; level: "info" | "warning" | "danger"; params: Record<string, string | number>; href: string }

/** Sales net of credit notes, by day: invoices and POS bills (taxable value). */
async function salesByDay(tx: Tx, companyId: string, from: string, to: string) {
  const rows = await tx.execute<{ date: string; amount: string }>(sql`
    select d::date::text as date, coalesce(sum(amount), 0)::text as amount from (
      select date as d, taxable as amount from sales_invoices where company_id = ${companyId} and status <> 'cancelled' and date between ${from}::date and ${to}::date
      union all select date, -taxable from credit_notes where company_id = ${companyId} and status <> 'cancelled' and date between ${from}::date and ${to}::date
      union all select date, taxable from pos_bills where company_id = ${companyId} and status = 'paid' and date between ${from}::date and ${to}::date
    ) x group by d order by d`);
  const map = new Map([...rows].map((r) => [r.date, r.amount]));
  const out: { date: string; amount: string }[] = [];
  for (let d = from; d <= to; d = addDays(d, 1)) out.push({ date: d, amount: money(map.get(d) ?? 0) });
  return out;
}

async function topCustomers(tx: Tx, companyId: string, from: string, to: string) {
  const rows = await tx.execute<{ id: string; name: string; amount: string }>(sql`
    select customer_id as id, max(customer_name) as name, sum(taxable)::text as amount from sales_invoices
    where company_id = ${companyId} and status <> 'cancelled' and date between ${from}::date and ${to}::date
    group by customer_id order by sum(taxable) desc limit 5`);
  return [...rows].map((r) => ({ id: r.id, name: r.name, amount: money(r.amount) }));
}

async function topItems(tx: Tx, companyId: string, from: string, to: string) {
  const rows = await tx.execute<{ id: string; name: string; qty: string; amount: string }>(sql`
    select item_id as id, max(name) as name, sum(qty)::text as qty, sum(amount)::text as amount from (
      select l.item_id, i.name, l.qty, l.taxable as amount from sales_invoice_lines l join sales_invoices s on s.id = l.invoice_id join items i on i.id = l.item_id
      where s.company_id = ${companyId} and s.status <> 'cancelled' and s.date between ${from}::date and ${to}::date
      union all select l.item_id, l.name, l.qty, l.taxable from pos_bill_lines l join pos_bills b on b.id = l.bill_id
      where b.company_id = ${companyId} and b.status = 'paid' and b.date between ${from}::date and ${to}::date
    ) x group by item_id order by sum(amount) desc limit 5`);
  return [...rows].map((r) => ({ id: r.id, name: r.name, qty: dec(r.qty).toString(), amount: money(r.amount) }));
}

async function cashBank(tx: Tx, companyId: string, asOf: string) {
  const rows = await tx.execute<{ id: string; name: string; name_hi: string | null; kind: string; balance: string }>(sql`
    select a.id, a.name, a.name_hi, case when g.key in ('cash_in_hand', 'bank_accounts', 'bank_od') then g.key else pg.key end as kind,
      (a.opening_balance + coalesce((select sum(e.debit - e.credit) from gl_entries e where e.account_id = a.id and e.date <= ${asOf}::date), 0))::text as balance
    from accounts a join account_groups g on g.id = a.group_id left join account_groups pg on pg.id = g.parent_id
    where a.company_id = ${companyId} and not a.archived and (g.key in ('cash_in_hand', 'bank_accounts', 'bank_od') or pg.key in ('cash_in_hand', 'bank_accounts', 'bank_od'))
    order by a.name`);
  return [...rows].map((r) => ({ id: r.id, name: r.name, nameHi: r.name_hi, kind: r.kind, balance: money(r.balance) }));
}

/**
 * The owner's dashboard: each block only for someone allowed to see it. Sales are taxable value (net of
 * credit notes, including POS); money is cash/bank, receivables and payables; profit is this month's.
 */
export async function dashboard(tx: Tx, perms: Set<string>, today: string) {
  const company = await resolveCompany(tx);
  const can = (p: string) => perms.has(p);
  const out: Record<string, unknown> = { asOf: today };
  const known: Known = {};
  if (can("sales.view")) {
    const days = await salesByDay(tx, company.id, addDays(today, -29), today);
    const mtdFrom = monthStart(today);
    const lastMonthFrom = monthStart(addDays(mtdFrom, -1));
    const sameDayLastMonth = addDays(lastMonthFrom, Number(today.slice(8)) - 1);
    const lastMonth = await salesByDay(tx, company.id, lastMonthFrom, sameDayLastMonth < mtdFrom ? sameDayLastMonth : addDays(mtdFrom, -1));
    const sum = (xs: { amount: string }[]) => money(xs.reduce((s, x) => s.plus(x.amount), dec(0)));
    out.sales = {
      today: days[days.length - 1]!.amount, yesterday: days[days.length - 2]!.amount,
      mtd: sum((await salesByDay(tx, company.id, mtdFrom, today))), lastMonthToDate: sum(lastMonth), daily: days,
      topCustomers: await topCustomers(tx, company.id, mtdFrom, today), topItems: await topItems(tx, company.id, mtdFrom, today),
    };
  }
  if (can("reports.view") || can("accounts.view")) {
    const rec = (known.receivables = await outstanding(tx, company.id, "receivable", today));
    const pay = await outstanding(tx, company.id, "payable", today);
    const overdue = rec.rows.reduce((s, r) => s.plus(r.buckets.d0_30 ?? 0).plus(r.buckets.d31_60 ?? 0).plus(r.buckets.d61_90 ?? 0).plus(r.buckets.d91_180 ?? 0).plus(r.buckets.d180plus ?? 0), dec(0));
    const dueSoon = pay.rows.flatMap((r) => r.openItems).filter((i) => i.dueOn <= addDays(today, 7)).reduce((s, i) => s.plus(i.amount), dec(0));
    // What is owed either way; advances paid to suppliers (or received from customers) don't reduce it.
    const owed = (rows: { balance: string }[]) => money(rows.reduce((s, r) => (dec(r.balance).gt(0) ? s.plus(r.balance) : s), dec(0)));
    out.money = {
      cashBank: await cashBank(tx, company.id, today), receivables: { total: owed(rec.rows), overdue: money(overdue) }, payables: { total: owed(pay.rows), dueIn7Days: money(dueSoon) },
      topDebtors: rec.rows.filter((r) => dec(r.balance).gt(0)).sort((a, b) => Number(b.balance) - Number(a.balance)).slice(0, 5).map((r) => ({ id: r.partyId, name: r.name, balance: r.balance, phone: r.phone })),
    };
  }
  if (can("reports.view")) {
    const pl = await profitAndLoss(tx, company.id, monthStart(today), today);
    const total = (xs: { amount: string }[]) => xs.reduce((s, x) => s.plus(x.amount), dec(0));
    out.profit = {
      income: money(total(pl.tradingIncome).plus(total(pl.otherIncome))), expenses: money(total(pl.tradingExpense).plus(total(pl.otherExpense))),
      grossProfit: pl.grossProfit, netProfit: pl.netProfit,
    };
  }
  if (can("inventory.view")) {
    const s = (known.stock = await stockSummary(tx, company, today));
    const low = s.rows.filter((r) => r.belowReorder && !r.archived);
    out.stock = { value: s.totalValue, belowReorder: low.length, lowItems: low.slice(0, 5).map((r) => ({ id: r.itemId, name: r.name, qty: r.qty, uom: r.uom, reorderLevel: r.reorderLevel })) };
  }
  const [counts] = await tx.execute<{ claims: number; timesheets: number; leave: number; follow_ups: number; open_leads: number }>(sql`
    select (select count(*)::int from expense_claims where company_id = ${company.id} and status = 'submitted') as claims,
      (select count(*)::int from timesheets where company_id = ${company.id} and status = 'submitted') as timesheets,
      (select count(*)::int from leave_requests l join employees e on e.id = l.employee_id where e.company_id = ${company.id} and l.status = 'pending') as leave,
      (select count(*)::int from crm_activities where company_id = ${company.id} and done_at is null and due_at <= now() + interval '1 day') as follow_ups,
      (select count(*)::int from crm_leads where company_id = ${company.id} and stage not in ('won', 'lost')) as open_leads`);
  out.approvals = {
    ...(can("expenses.approve") ? { claims: counts!.claims } : {}), ...(can("projects.approve") ? { timesheets: counts!.timesheets } : {}),
    ...(can("hr.approve") ? { leave: counts!.leave } : {}),
  };
  if (can("crm.view")) {
    const leads = await tx.execute<{ stage: LeadStage; n: number; value: string }>(sql`
      select stage, count(*)::int as n, coalesce(sum(value), 0)::text as value from crm_leads where company_id = ${company.id} and stage not in ('won', 'lost') group by stage`);
    out.crm = {
      openLeads: counts!.open_leads, followUpsDue: counts!.follow_ups,
      pipeline: money([...leads].reduce((s, l) => s.plus(l.value), dec(0))),
      weighted: money([...leads].reduce((s, l) => s.plus(dec(l.value).times(STAGE_PROBABILITY[l.stage] ?? 0).div(100)), dec(0))),
    };
  }
  out.alerts = await alerts(tx, company, perms, today, known);
  return out;
}

/** Reports the dashboard has already worked out, so the alerts don't compute them again. */
interface Known {
  receivables?: Awaited<ReturnType<typeof outstanding>>;
  stock?: Awaited<ReturnType<typeof stockSummary>>;
}

/** Things to act on now: overdue money, low stock, returns falling due, work waiting for approval. */
export async function alerts(tx: Tx, company: Company, perms: Set<string>, today: string, known: Known = {}): Promise<Alert[]> {
  const out: Alert[] = [];
  const can = (p: string) => perms.has(p);
  if (can("reports.view")) {
    const rec = known.receivables ?? (await outstanding(tx, company.id, "receivable", today));
    const late = rec.rows.map((r) => ({ name: r.name, amount: dec(r.buckets.d61_90 ?? 0).plus(r.buckets.d91_180 ?? 0).plus(r.buckets.d180plus ?? 0) })).filter((r) => r.amount.gt(0));
    if (late.length) out.push({ key: "overdue60", level: "danger", params: { count: late.length, amount: money(late.reduce((s, r) => s.plus(r.amount), dec(0))) }, href: "/reports/receivables" });
  }
  if (can("gst.view")) {
    const [branch] = await tx.execute<{ gstin: string | null }>(sql`select gstin from branches where company_id = ${company.id} and gstin is not null limit 1`);
    if (branch?.gstin) {
      const prev = addDays(monthStart(today), -1);
      const period = `${prev.slice(5, 7)}${prev.slice(0, 4)}`;
      const filed = await tx.execute<{ return_type: string }>(sql`select return_type from gst_filings where company_id = ${company.id} and period = ${period} and status = 'filed'`);
      for (const [type, day] of [["GSTR1", 11], ["GSTR3B", 20]] as const) {
        if (filed.some((f) => f.return_type === type)) continue;
        const due = `${today.slice(0, 8)}${String(day).padStart(2, "0")}`;
        const daysLeft = Math.round((Date.parse(due) - Date.parse(today)) / 86_400_000);
        if (daysLeft <= 7) out.push({ key: daysLeft < 0 ? "gstOverdue" : "gstDue", level: daysLeft < 0 ? "danger" : "warning", params: { form: type, period: `${prev.slice(5, 7)}/${prev.slice(0, 4)}`, days: Math.abs(daysLeft) }, href: "/gst/returns" });
      }
    }
  }
  if (can("inventory.view")) {
    const [low] = await tx.execute<{ n: number }>(sql`select count(*)::int as n from items where company_id = ${company.id} and not archived and kind = 'goods' and reorder_level is not null`);
    if (low!.n) {
      const s = known.stock ?? (await stockSummary(tx, company, today));
      const below = s.rows.filter((r) => r.belowReorder && !r.archived).length;
      if (below) out.push({ key: "lowStock", level: "warning", params: { count: below }, href: "/inventory/stock#reorder" });
    }
  }
  if (can("sales.view")) {
    // Sale on approval: chase goods out over 30 days; the invoice is due by law six months after they left.
    const [ap] = await tx.execute<{ n: number; due: number }>(sql`
      select count(*)::int as n, count(*) filter (where n.date <= (${today}::date - interval '5 months'))::int as due
      from delivery_notes n where n.company_id = ${company.id} and n.reason = 'approval' and n.status = 'posted' and n.date < ${addDays(today, -30)}::date`);
    if (ap!.due) out.push({ key: "approvalInvoiceDue", level: "danger", params: { count: ap!.due }, href: "/sales/approvals" });
    else if (ap!.n) out.push({ key: "approvalsOut", level: "warning", params: { count: ap!.n }, href: "/sales/approvals" });
  }
  if (can("hr.view")) {
    const lapsing = await expiringDocuments(tx, today, 30);
    if (lapsing.length) out.push({ key: "kycExpiring", level: lapsing.some((d) => d.daysLeft < 0) ? "danger" : "warning", params: { count: lapsing.length }, href: "/hr/documents" });
  }
  if (can("hr.view")) {
    const att = await attendanceAlerts(tx, today);
    const n = att.absent + att.late;
    if (n) out.push({ key: "attendanceToday", level: att.absent ? "warning" : "info", params: { absent: att.absent, late: att.late }, href: "/hr/attendance-alerts" });
  }
  if (can("company.export")) {
    const b = await getBackupSettings(tx);
    if (b.overdue || (b.enabled && b.lastError)) out.push({ key: "backupProblem", level: b.overdue ? "danger" : "warning", params: {}, href: "/settings/backup" });
  }
  if (can("settings.view")) {
    const n = await recentSensitiveCount(tx);
    if (n) out.push({ key: "sensitiveChanges", level: "info", params: { count: n }, href: "/settings/sensitive-changes" });
  }
  if (can("banking.view")) {
    const [b] = await tx.execute<{ n: number }>(sql`select count(*)::int as n from bank_lines where company_id = ${company.id} and status = 'unmatched' and date < ${addDays(today, -7)}::date`);
    if (b!.n) out.push({ key: "unmatchedBank", level: "info", params: { count: b!.n }, href: "/banking" });
  }
  if (can("expenses.approve")) {
    const [c] = await tx.execute<{ n: number }>(sql`select count(*)::int as n from expense_claims where company_id = ${company.id} and status = 'submitted' and submitted_at < now() - interval '3 days'`);
    if (c!.n) out.push({ key: "claimsWaiting", level: "info", params: { count: c!.n }, href: "/expenses?status=submitted" });
  }
  if (can("crm.view")) {
    const [f] = await tx.execute<{ n: number }>(sql`select count(*)::int as n from crm_activities where company_id = ${company.id} and done_at is null and due_at < now()`);
    if (f!.n) out.push({ key: "followUpsLate", level: "warning", params: { count: f!.n }, href: "/crm/activities" });
  }
  if (can("accounts.view")) {
    for (const c of (await cashBank(tx, company.id, today)).filter((x) => x.kind === "cash_in_hand" && dec(x.balance).lt(0))) {
      out.push({ key: "negativeCash", level: "danger", params: { name: c.name, amount: c.balance }, href: `/reports/ledger/${c.id}` });
    }
  }
  return out;
}

export interface Anomaly { key: string; date: string; params: Record<string, string | number>; href: string | null }

/**
 * Checks worth a second look, for the owner and the CA:
 * - cash paid to one party over ₹10,000 in a day (not allowed as a business expense, Income-tax s. 40A(3));
 * - cash received from one party of ₹2 lakh or more in a day (not allowed, s. 269ST; penalty equal to the amount);
 * - the same supplier billing the same amount twice within a week (a possible duplicate);
 * - items sold below their purchase rate; items whose stock went below zero.
 */
export async function anomalies(tx: Tx, from: string, to: string) {
  const company = await resolveCompany(tx);
  const out: Anomaly[] = [];
  const cashPays = await tx.execute<{ date: string; name: string; amount: string }>(sql`
    with cash as (select a.id from accounts a join account_groups g on g.id = a.group_id left join account_groups pg on pg.id = g.parent_id
                  where a.company_id = ${company.id} and (g.key = 'cash_in_hand' or pg.key = 'cash_in_hand')),
    cb as (select a.id from accounts a join account_groups g on g.id = a.group_id left join account_groups pg on pg.id = g.parent_id
                  where a.company_id = ${company.id} and (g.key in ('cash_in_hand', 'bank_accounts', 'bank_od') or pg.key in ('cash_in_hand', 'bank_accounts', 'bank_od')))
    select v.date::text as date, pa.name, sum(l.debit)::text as amount from vouchers v
    join voucher_lines l on l.voucher_id = v.id join accounts pa on pa.id = l.account_id
    where v.company_id = ${company.id} and v.status = 'posted' and v.date between ${from}::date and ${to}::date and l.debit > 0
      and l.account_id not in (select id from cb)
      and exists (select 1 from voucher_lines c where c.voucher_id = v.id and c.credit > 0 and c.account_id in (select id from cash))
    group by v.date, pa.id, pa.name having sum(l.debit) > 10000 order by v.date`);
  for (const r of cashPays) out.push({ key: "cash40A3", date: r.date, params: { party: r.name, amount: money(r.amount) }, href: null });
  const cashReceipts = await tx.execute<{ date: string; name: string; amount: string }>(sql`
    with cash as (select a.id from accounts a join account_groups g on g.id = a.group_id left join account_groups pg on pg.id = g.parent_id
                  where a.company_id = ${company.id} and (g.key = 'cash_in_hand' or pg.key = 'cash_in_hand')),
    cb as (select a.id from accounts a join account_groups g on g.id = a.group_id left join account_groups pg on pg.id = g.parent_id
                  where a.company_id = ${company.id} and (g.key in ('cash_in_hand', 'bank_accounts', 'bank_od') or pg.key in ('cash_in_hand', 'bank_accounts', 'bank_od')))
    select v.date::text as date, pa.name, sum(l.credit)::text as amount from vouchers v
    join voucher_lines l on l.voucher_id = v.id join accounts pa on pa.id = l.account_id
    where v.company_id = ${company.id} and v.status = 'posted' and v.date between ${from}::date and ${to}::date and l.credit > 0
      and l.account_id not in (select id from cb)
      and exists (select 1 from voucher_lines c where c.voucher_id = v.id and c.debit > 0 and c.account_id in (select id from cash))
    group by v.date, pa.id, pa.name having sum(l.credit) >= 200000 order by v.date`);
  for (const r of cashReceipts) out.push({ key: "cash269ST", date: r.date, params: { party: r.name, amount: money(r.amount) }, href: null });
  const dupes = await tx.execute<{ date: string; name: string; amount: string; a: string; b: string; id: string }>(sql`
    select b2.date::text as date, s.name, b2.total::text as amount, b1.supplier_invoice_no as a, b2.supplier_invoice_no as b, b2.id
    from purchase_bills b1 join purchase_bills b2 on b2.supplier_id = b1.supplier_id and b2.total = b1.total and b2.id <> b1.id
      and b2.date between b1.date and b1.date + 7 and (b2.date > b1.date or b2.id > b1.id)
    join accounts s on s.id = b1.supplier_id
    where b1.company_id = ${company.id} and b1.status <> 'cancelled' and b2.status <> 'cancelled' and b2.date between ${from}::date and ${to}::date`);
  for (const r of dupes) out.push({ key: "duplicateBill", date: r.date, params: { supplier: r.name, amount: money(r.amount), first: r.a, second: r.b }, href: `/purchase/bills/${r.id}` });
  const below = await tx.execute<{ date: string; number: string; name: string; rate: string; cost: string; id: string }>(sql`
    select s.date::text as date, s.number, i.name, (l.taxable / nullif(l.qty, 0))::text as rate, i.purchase_rate::text as cost, s.id
    from sales_invoice_lines l join sales_invoices s on s.id = l.invoice_id join items i on i.id = l.item_id
    where s.company_id = ${company.id} and s.status <> 'cancelled' and s.date between ${from}::date and ${to}::date
      and i.kind = 'goods' and i.purchase_rate > 0 and l.qty > 0 and l.taxable / l.qty < i.purchase_rate order by s.date`);
  for (const r of below) out.push({ key: "belowCost", date: r.date, params: { number: r.number, item: r.name, rate: money(r.rate), cost: money(r.cost) }, href: `/sales/invoices/${r.id}` });
  const stock = await stockSummary(tx, company, to);
  for (const r of stock.rows.filter((x) => dec(x.qty).lt(0))) out.push({ key: "negativeStock", date: to, params: { item: r.name, qty: dec(r.qty).toString(), uom: r.uom }, href: `/inventory/items/${r.itemId}` });
  return { from, to, rows: out.sort((a, b) => a.date.localeCompare(b.date)) };
}

export const fyToDate = (today: string) => ({ from: fiscalYearOf(today).start, to: today });
