import { sql } from "drizzle-orm";
import type { Tx } from "@varchasv/db";
import { dec, money } from "@varchasv/domain";
import { badRequest } from "../lib/errors.js";
import { balanceSheet, profitAndLoss, resolveCompany } from "./accounting.js";
import { outstanding } from "./returns.js";
import { integrityChecks } from "./integrity.js";

export interface YearEndItem { key: string; count: number; detail?: string }

/**
 * What to settle before a financial year is closed and locked: the profit, the books' own integrity checks, and every
 * document still half done inside the year (counts not approved, payroll not final, challans not billed, orders and transfers open).
 * Nothing here changes data; it is the list to clear, with how many of each.
 */
export async function yearEndCheck(tx: Tx, fy: string) {
  const m = /^(\d{4})-(\d{2})$/.exec(fy);
  if (!m || (Number(m[1]) + 1) % 100 !== Number(m[2])) throw badRequest("invalid_fy");
  const from = `${m[1]}-04-01`;
  const to = `${Number(m[1]) + 1}-03-31`;
  const company = await resolveCompany(tx);
  const cid = company.id;
  const pl = await profitAndLoss(tx, cid, from, to);
  const integrity = await integrityChecks(tx, to);
  const count = async (query: ReturnType<typeof sql>) => Number(([...(await tx.execute<{ n: number }>(query))][0] as { n: number }).n);
  const pending: YearEndItem[] = [
    { key: "stockCounts", count: await count(sql`select count(*)::int as n from stock_counts where company_id = ${cid} and status in ('counting', 'submitted') and (created_at at time zone 'Asia/Kolkata')::date between ${from}::date and ${to}::date`) },
    { key: "payrollRuns", count: await count(sql`select count(*)::int as n from payroll_runs where company_id = ${cid} and status = 'draft' and period between ${from.slice(0, 7)} and ${to.slice(0, 7)}`) },
    { key: "challansNotBilled", count: await count(sql`select count(*)::int as n from delivery_notes where company_id = ${cid} and status = 'posted' and reason in ('supply', 'lots') and date between ${from}::date and ${to}::date`) },
    { key: "salesOrdersOpen", count: await count(sql`select count(*)::int as n from sales_orders where company_id = ${cid} and status in ('open', 'partial') and date between ${from}::date and ${to}::date`) },
    { key: "deliveryOrdersOpen", count: await count(sql`select count(*)::int as n from delivery_orders where company_id = ${cid} and status = 'open' and date between ${from}::date and ${to}::date`) },
    { key: "transfersInTransit", count: await count(sql`select count(*)::int as n from stock_transfers where company_id = ${cid} and status = 'in_transit' and date between ${from}::date and ${to}::date`) },
    { key: "purchaseOrdersOpen", count: await count(sql`select count(*)::int as n from purchase_orders where company_id = ${cid} and status in ('open', 'partial') and date between ${from}::date and ${to}::date`) },
  ];
  const failing = integrity.checks.filter((c) => !c.ok);
  return {
    fy, from, to, netProfit: money(dec(pl.netProfit)),
    integrityOk: integrity.ok, integrityFailing: failing.map((c) => ({ key: c.key, severity: c.severity, difference: c.difference, count: c.count })),
    pending, ready: integrity.ok && pending.every((p) => p.count === 0),
  };
}


/**
 * The position that carries into the next financial year, as a check before the year is locked. The books carry balances forward on their own (a new
 * year's opening is the last year's closing, and profit since the books began sits in one line), so nothing is posted here: this lists the balances
 * that become openings, the year's profit and what it adds to the profit carried, the stock carried at its valuation, and the bills still open by
 * party, and says whether assets and liabilities agree.
 */
export async function carryForward(tx: Tx, fy: string) {
  const m = /^(\d{4})-(\d{2})$/.exec(fy);
  if (!m || (Number(m[1]) + 1) % 100 !== Number(m[2])) throw badRequest("invalid_fy");
  const from = `${m[1]}-04-01`;
  const to = `${Number(m[1]) + 1}-03-31`;
  const company = await resolveCompany(tx);
  const bs = await balanceSheet(tx, company.id, company.booksBeginOn, to);
  const pl = await profitAndLoss(tx, company.id, from, to);
  const before = await profitAndLoss(tx, company.id, company.booksBeginOn, `${m[1]}-03-31`);
  const rec = await outstanding(tx, company.id, "receivable", to);
  const pay = await outstanding(tx, company.id, "payable", to);
  const group = (lines: { groupName: string; name: string; amount: string }[]) => {
    const by = new Map<string, { group: string; total: ReturnType<typeof dec>; accounts: { name: string; amount: string }[] }>();
    for (const l of lines) {
      const g = by.get(l.groupName) ?? { group: l.groupName, total: dec(0), accounts: [] };
      g.total = g.total.plus(l.amount);
      g.accounts.push({ name: l.name, amount: l.amount });
      by.set(l.groupName, g);
    }
    return [...by.values()].map((g) => ({ group: g.group, total: money(g.total), accounts: g.accounts }));
  };
  const debtors = rec.rows.filter((r) => dec(r.balance).gt(0));
  const creditors = pay.rows.filter((r) => dec(r.balance).gt(0));
  return {
    fy, from, to,
    assets: group(bs.assets), liabilities: group(bs.liabilities), closingStock: bs.closingStock,
    profitThisYear: pl.netProfit, profitCarriedFromEarlier: before.netProfit, profitCarriedForward: bs.profitAndLoss,
    totalAssets: bs.totalAssets, totalLiabilities: bs.totalLiabilities, difference: bs.difference, balanced: dec(bs.difference).abs().lt(0.01),
    openBills: {
      receivable: { parties: debtors.length, total: rec.total }, payable: { parties: creditors.length, total: pay.total },
    },
  };
}
