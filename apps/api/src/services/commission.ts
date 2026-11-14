import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { D, dec, fiscalYearOf, money, type Dec } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { cancelVoucher, postVoucher, resolveCompany } from "./accounting.js";
import { resolvePostingAccountIds } from "./ledgerparameters.js";
import { documentNumber } from "./inventory.js";
import { saleLines } from "./insights.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

export const BROKERAGE_SERIES = { docType: "brokerage_bill", name: "Brokerage bills", pattern: "BB/{FY}/{SEQ:5}" };

/** 194H: TDS on commission once a payee's commission in the year passes ₹20,000; 2% from 1 Oct 2024. */
export const TDS_194H = { threshold: "20000", rate: "2" };

/**
 * How much of each invoice the customer has paid by a date. Credit notes come off their own
 * invoice (goods back are not money received); every other credit to the customer (receipts,
 * journals) pays the oldest open bill first, as the receivables ageing does.
 */
export async function invoiceCollections(tx: Tx, companyId: string, customerIds: string[], asOf: string) {
  const out = new Map<string, { total: Dec; returned: Dec; returnedTaxable: Dec; paid: Dec }>();
  if (!customerIds.length) return out;
  const ids = sql.join(customerIds.map((id) => sql`${id}::uuid`), sql`, `);
  const openings = await tx.execute<{ id: string; opening: string }>(sql`select id, opening_balance as opening from accounts where id in (${ids})`);
  const entries = await tx.execute<{ account_id: string; amount: string; invoice_id: string | null; cn_invoice_id: string | null; cn_taxable: string | null }>(sql`
    select e.account_id, (e.debit - e.credit) as amount, si.id as invoice_id, cn.invoice_id as cn_invoice_id, cn.taxable as cn_taxable
    from gl_entries e
    join vouchers v on v.id = e.voucher_id and v.status = 'posted'
    left join sales_invoices si on si.voucher_id = v.id
    left join credit_notes cn on cn.voucher_id = v.id
    where e.company_id = ${companyId} and e.account_id in (${ids}) and not e.is_reversal and e.date <= ${asOf}::date
    order by e.date, e.id`);
  for (const p of openings) {
    // Open items in date order: the opening balance, then each invoice or other debit.
    const open: { invoiceId: string | null; left: Dec }[] = [];
    let unapplied = dec(0);
    const opening = dec(p.opening);
    if (opening.gt(0)) open.push({ invoiceId: null, left: opening });
    else unapplied = opening.neg();
    const pay = (amt: Dec) => {
      let credit = amt;
      for (const o of open) {
        if (!credit.gt(0)) break;
        if (!o.left.gt(0)) continue;
        const used = o.left.lt(credit) ? o.left : credit;
        o.left = o.left.minus(used);
        credit = credit.minus(used);
        if (o.invoiceId) out.get(o.invoiceId)!.paid = out.get(o.invoiceId)!.paid.plus(used);
      }
      unapplied = unapplied.plus(credit);
    };
    for (const e of entries) {
      if (e.account_id !== p.id) continue;
      const amt = dec(e.amount);
      if (e.invoice_id && amt.gt(0)) {
        out.set(e.invoice_id, { total: amt, returned: dec(0), returnedTaxable: dec(0), paid: dec(0) });
        open.push({ invoiceId: e.invoice_id, left: amt });
        if (unapplied.gt(0)) { const adv = unapplied; unapplied = dec(0); pay(adv); }
      } else if (e.cn_invoice_id && amt.lt(0) && out.has(e.cn_invoice_id)) {
        const inv = out.get(e.cn_invoice_id)!;
        inv.returned = inv.returned.plus(amt.neg());
        inv.returnedTaxable = inv.returnedTaxable.plus(dec(e.cn_taxable ?? 0));
        const item = open.find((o) => o.invoiceId === e.cn_invoice_id)!;
        const used = item.left.lt(amt.neg()) ? item.left : amt.neg();
        item.left = item.left.minus(used);
        // Goods back on a bill already paid: the customer now has credit for other bills.
        const excess = amt.neg().minus(used);
        if (excess.gt(0)) { inv.paid = inv.paid.minus(excess); pay(excess); }
      } else if (amt.gt(0)) {
        open.push({ invoiceId: null, left: amt });
        if (unapplied.gt(0)) { const adv = unapplied; unapplied = dec(0); pay(adv); }
      } else if (amt.lt(0)) {
        pay(amt.neg());
      }
    }
  }
  return out;
}

/**
 * Commission each agent has earned on money received up to a date: per invoice, the taxable value
 * (less goods returned) times the share of the bill paid, at the invoice's rate. What earlier
 * brokerage bills already paid comes off; goods returned after a bill make the line negative.
 */
export async function agentCommission(tx: Tx, companyId: string | undefined, asOf: string, agentId?: string) {
  const company = await resolveCompany(tx, companyId);
  const invoices = await tx.select({
    id: tables.salesInvoices.id, number: tables.salesInvoices.number, date: tables.salesInvoices.date, customerId: tables.salesInvoices.customerId,
    customerName: tables.salesInvoices.customerName, taxable: tables.salesInvoices.taxable, total: tables.salesInvoices.total,
    agentId: tables.salesInvoices.agentId, agentPct: tables.salesInvoices.agentPct,
  }).from(tables.salesInvoices).where(and(
    eq(tables.salesInvoices.companyId, company.id), eq(tables.salesInvoices.status, "posted"), sql`${tables.salesInvoices.date} <= ${asOf}::date`,
    agentId ? eq(tables.salesInvoices.agentId, agentId) : sql`${tables.salesInvoices.agentId} is not null`,
  )).orderBy(asc(tables.salesInvoices.date), asc(tables.salesInvoices.number));
  const agents = await tx.select({ id: tables.accounts.id, name: tables.accounts.name, pct: tables.accounts.commissionPct })
    .from(tables.accounts).where(and(eq(tables.accounts.companyId, company.id), agentId ? eq(tables.accounts.id, agentId) : eq(tables.accounts.isAgent, true)));
  const collections = await invoiceCollections(tx, company.id, [...new Set(invoices.map((i) => i.customerId))], asOf);
  const billed = new Map<string, Dec>();
  const bills = await tx.select({ lines: tables.brokerageBills.lines }).from(tables.brokerageBills)
    .where(and(eq(tables.brokerageBills.companyId, company.id), eq(tables.brokerageBills.status, "posted"), ...(agentId ? [eq(tables.brokerageBills.agentId, agentId)] : [])));
  for (const b of bills) for (const l of b.lines) billed.set(l.invoiceId, (billed.get(l.invoiceId) ?? dec(0)).plus(l.amount));

  const rows = agents.map((a) => {
    const lines = invoices.filter((i) => i.agentId === a.id).map((i) => {
      const c = collections.get(i.id) ?? { total: dec(i.total), returned: dec(0), returnedTaxable: dec(0), paid: dec(0) };
      const net = c.total.minus(c.returned);
      const base = dec(i.taxable).minus(c.returnedTaxable);
      const share = net.gt(0) ? D.min(dec(1), D.max(dec(0), c.paid.div(net))) : dec(0);
      const earned = base.gt(0) ? base.times(share).times(i.agentPct ?? 0).div(100) : dec(0);
      const done = billed.get(i.id) ?? dec(0);
      return {
        invoiceId: i.id, number: i.number, date: i.date, customer: i.customerName, pct: dec(i.agentPct ?? 0).toFixed(2),
        base: money(base), total: money(net), received: money(D.min(c.paid, D.max(net, dec(0)))),
        earned: money(earned), billed: money(done), due: money(earned.minus(done)),
      };
    });
    const sum = (k: "earned" | "billed" | "due") => money(lines.reduce((s, l) => s.plus(l[k]), dec(0)));
    return { agentId: a.id, name: a.name, pct: a.pct, invoices: lines, earned: sum("earned"), billed: sum("billed"), due: sum("due") };
  });
  return { asOf, rows };
}

export interface BrokerageBillInput { companyId?: string | undefined; agentId: string; date: string; tdsRate?: string | undefined; narration?: string | undefined }

/** Bills everything an agent has earned and not yet been billed for, as of the bill date. */
export async function createBrokerageBill(tx: Tx, actor: Actor, input: BrokerageBillInput) {
  const company = await resolveCompany(tx, input.companyId);
  const [agent] = await tx.select().from(tables.accounts).where(eq(tables.accounts.id, input.agentId));
  if (!agent || agent.companyId !== company.id || !agent.isAgent) throw badRequest("not_an_agent");
  if (agent.archived) throw badRequest("account_archived");
  // One bill at a time per agent, so two people billing at once can't pay the same commission twice.
  await tx.execute(sql`select id from accounts where id = ${agent.id} for update`);
  const { rows } = await agentCommission(tx, company.id, input.date, agent.id);
  const lines = (rows[0]?.invoices ?? []).filter((l) => !dec(l.due).isZero())
    .map((l) => ({ invoiceId: l.invoiceId, number: l.number, base: l.base, received: l.received, amount: l.due }));
  const amount = lines.reduce((s, l) => s.plus(l.amount), dec(0));
  if (!amount.gt(0)) throw badRequest("nothing_to_bill");

  // TDS once the year's commission to this agent passes the 194H threshold, unless a rate is given.
  const fy = fiscalYearOf(input.date);
  const [prior] = await tx.execute<{ sum: string }>(sql`
    select coalesce(sum(amount), 0) as sum from brokerage_bills
    where agent_id = ${agent.id} and status = 'posted' and date between ${fy.start}::date and ${fy.end}::date`);
  const yearTotal = dec(prior?.sum ?? 0).plus(amount);
  const tdsRate = input.tdsRate ?? (yearTotal.gt(TDS_194H.threshold) ? TDS_194H.rate : "0");
  const tds = amount.times(tdsRate).div(100).toDecimalPlaces(0);
  const net = amount.minus(tds);

  const keyed = await resolvePostingAccountIds(tx, company.id, ["brokerage", "tds_payable"]);
  const acct = (k: string) => keyed[k]!;
  const number = await documentNumber(tx, actor, company, input.date, BROKERAGE_SERIES);
  const { voucher } = await postVoucher(tx, actor, {
    companyId: company.id, type: "brokerage", documentNumber: number, date: input.date,
    narration: input.narration ?? `Commission to ${agent.name}`,
    lines: [
      { accountId: acct("brokerage"), debit: money(amount) },
      { accountId: agent.id, credit: money(net) },
      ...(tds.gt(0) ? [{ accountId: acct("tds_payable"), credit: money(tds), narration: `194H ${agent.name}` }] : []),
    ],
  });
  const [bill] = await tx.insert(tables.brokerageBills).values({
    tenantId: actor.tenantId, companyId: company.id, agentId: agent.id, voucherId: voucher.id, number, date: input.date,
    amount: money(amount), tdsRate: dec(tdsRate).toFixed(2), tds: money(tds), net: money(net), lines, narration: input.narration ?? null, createdBy: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "brokerage_bill", entityId: bill!.id, after: { number, agent: agent.name, amount: bill!.amount, tds: bill!.tds }, ip: actor.ip });
  return bill!;
}

export async function cancelBrokerageBill(tx: Tx, actor: Actor, id: string, reason: string) {
  const [bill] = await tx.select().from(tables.brokerageBills).where(eq(tables.brokerageBills.id, id)).for("update");
  if (!bill) throw notFound();
  if (bill.status === "cancelled") throw conflict("already_cancelled");
  await cancelVoucher(tx, actor, bill.voucherId!, reason);
  await tx.update(tables.brokerageBills).set({ status: "cancelled" }).where(eq(tables.brokerageBills.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "cancel", entity: "brokerage_bill", entityId: id, after: { number: bill.number, reason }, ip: actor.ip });
}

export async function listBrokerageBills(tx: Tx, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  return tx.select({ bill: tables.brokerageBills, agent: tables.accounts.name }).from(tables.brokerageBills)
    .innerJoin(tables.accounts, eq(tables.accounts.id, tables.brokerageBills.agentId))
    .where(eq(tables.brokerageBills.companyId, company.id)).orderBy(desc(tables.brokerageBills.date), desc(tables.brokerageBills.number))
    .then((rows) => rows.map((r) => ({ ...r.bill, agent: r.agent })));
}

// ---- Salesman targets ---------------------------------------------------------------------------

export type Slab = { from: string; rate: string };

/** The rate of the highest slab reached; achievement is a percentage of the target. */
export function slabRate(achievedPct: Dec, slabs: Slab[]) {
  let rate = dec(0);
  for (const s of [...slabs].sort((a, b) => Number(a.from) - Number(b.from))) if (achievedPct.gte(s.from)) rate = dec(s.rate);
  return rate;
}

const monthRange = (month: string) => {
  const [y, m] = month.split("-").map(Number) as [number, number];
  const end = new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10);
  return { start: `${month}-01`, end };
};

/**
 * A month's sales per salesman against target: taxable value of their invoices, less credit notes
 * issued that month on their invoices; commission at the slab their achievement reached.
 */
export async function salesmanReport(tx: Tx, companyId: string | undefined, month: string) {
  const company = await resolveCompany(tx, companyId);
  const { start, end } = monthRange(month);
  const targets = await tx.select().from(tables.salesTargets).where(and(eq(tables.salesTargets.companyId, company.id), eq(tables.salesTargets.month, month)));
  // Invoices and counter bills together, less credit notes and goods returned at the counter.
  const sales = await tx.execute<{ salesman_id: string; sales: string; returns: string; invoices: number }>(sql`
    with x as (${saleLines(company.id, start, end)})
    select x.salesman_id, coalesce(sum(case when x.amount > 0 then x.amount else 0 end), 0) as sales, coalesce(-sum(case when x.amount < 0 then x.amount else 0 end), 0) as returns,
      ((select count(*) from sales_invoices where company_id = ${company.id} and status = 'posted' and salesman_id = x.salesman_id and date between ${start}::date and ${end}::date)
       + (select count(distinct l.bill_id) from pos_bill_lines l join pos_bills b on b.id = l.bill_id where b.company_id = ${company.id} and b.status = 'paid' and l.salesman_id = x.salesman_id and b.date between ${start}::date and ${end}::date))::int as invoices
    from x where x.salesman_id is not null group by x.salesman_id`);
  const ids = [...new Set([...targets.map((t) => t.employeeId), ...sales.map((s) => s.salesman_id)])];
  const people = ids.length ? await tx.select({ id: tables.employees.id, name: tables.employees.name, code: tables.employees.code })
    .from(tables.employees).where(inArray(tables.employees.id, ids)) : [];
  const rows = ids.map((id) => {
    const t = targets.find((x) => x.employeeId === id);
    const s = sales.find((x) => x.salesman_id === id);
    const achieved = dec(s?.sales ?? 0).minus(s?.returns ?? 0);
    const pct = t && dec(t.target).gt(0) ? achieved.div(t.target).times(100) : null;
    const rate = pct ? slabRate(pct, t!.slabs) : dec(0);
    const p = people.find((x) => x.id === id);
    return {
      employeeId: id, name: p?.name ?? "", code: p?.code ?? "", target: t ? t.target : null, slabs: t?.slabs ?? [],
      invoices: s?.invoices ?? 0, sales: money(s?.sales ?? 0), returns: money(s?.returns ?? 0), achieved: money(achieved),
      achievedPct: pct ? pct.toFixed(1) : null, rate: rate.toFixed(2), commission: money(achieved.gt(0) ? achieved.times(rate).div(100) : 0),
    };
  }).sort((a, b) => a.name.localeCompare(b.name));
  return { month, rows, commission: money(rows.reduce((s, r) => s.plus(r.commission), dec(0))) };
}

/**
 * A year of monthly targets against what was achieved, per salesman: the twelve months for a chart, and the year's totals.
 * The yearly target is the sum of the monthly ones, so changing a month changes the year.
 */
export async function salesmanYear(tx: Tx, companyId: string | undefined, year: number) {
  const company = await resolveCompany(tx, companyId);
  const months = Array.from({ length: 12 }, (_, i) => `${year}-${String(i + 1).padStart(2, "0")}`);
  const reports = [];
  for (const m of months) reports.push(await salesmanReport(tx, company.id, m));
  const people = new Map<string, { employeeId: string; name: string; code: string; months: { month: string; target: string; achieved: string }[]; target: ReturnType<typeof dec>; achieved: ReturnType<typeof dec>; commission: ReturnType<typeof dec> }>();
  reports.forEach((rep, i) => {
    for (const r of rep.rows) {
      const p = people.get(r.employeeId) ?? { employeeId: r.employeeId, name: r.name, code: r.code, months: months.map((month) => ({ month, target: "0.00", achieved: "0.00" })), target: dec(0), achieved: dec(0), commission: dec(0) };
      p.months[i] = { month: months[i]!, target: money(r.target ?? 0), achieved: r.achieved };
      p.target = p.target.plus(r.target ?? 0);
      p.achieved = p.achieved.plus(r.achieved);
      p.commission = p.commission.plus(r.commission);
      people.set(r.employeeId, p);
    }
  });
  const rows = [...people.values()].sort((a, b) => a.name.localeCompare(b.name)).map((p) => ({
    employeeId: p.employeeId, name: p.name, code: p.code, months: p.months, target: money(p.target), achieved: money(p.achieved),
    achievedPct: p.target.gt(0) ? p.achieved.div(p.target).times(100).toFixed(1) : null, commission: money(p.commission),
  }));
  return { year, rows, target: money(rows.reduce((t, r) => t.plus(r.target), dec(0))), achieved: money(rows.reduce((t, r) => t.plus(r.achieved), dec(0))) };
}

export interface TargetInput { employeeId: string; target: string; slabs: Slab[] }

/** Replaces a month's targets. */
export async function setSalesTargets(tx: Tx, actor: Actor, companyId: string | undefined, month: string, rows: TargetInput[]) {
  const company = await resolveCompany(tx, companyId);
  const ids = rows.map((r) => r.employeeId);
  if (new Set(ids).size !== ids.length) throw badRequest("duplicate_salesman");
  if (ids.length) {
    const found = await tx.select({ id: tables.employees.id }).from(tables.employees).where(and(inArray(tables.employees.id, ids), eq(tables.employees.companyId, company.id)));
    if (found.length !== ids.length) throw badRequest("unknown_employee");
  }
  for (const r of rows) {
    const froms = r.slabs.map((s) => s.from);
    if (new Set(froms).size !== froms.length) throw badRequest("duplicate_slab");
  }
  await tx.delete(tables.salesTargets).where(and(eq(tables.salesTargets.companyId, company.id), eq(tables.salesTargets.month, month)));
  if (rows.length) {
    await tx.insert(tables.salesTargets).values(rows.map((r) => ({
      tenantId: actor.tenantId, companyId: company.id, employeeId: r.employeeId, month, target: money(r.target),
      slabs: [...r.slabs].sort((a, b) => Number(a.from) - Number(b.from)).map((s) => ({ from: dec(s.from).toFixed(2), rate: dec(s.rate).toFixed(2) })),
    })));
  }
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "sales_targets", entityId: company.id, after: { month, salesmen: rows.length }, ip: actor.ip });
  return salesmanReport(tx, company.id, month);
}
