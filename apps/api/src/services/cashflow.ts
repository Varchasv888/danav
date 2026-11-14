import { sql } from "drizzle-orm";
import type { Tx } from "@varchasv/db";
import { dec, money } from "@varchasv/domain";
import { accountBalances, profitAndLoss, resolveCompany } from "./accounting.js";

export interface CashFlowLine { name: string; amount: string }
export interface CashFlowSection { lines: CashFlowLine[]; total: string }

const CASH = new Set(["cash_in_hand", "bank_accounts"]);
const INVESTING = new Set(["fixed_assets", "investments"]);
const FINANCING = new Set(["capital", "reserves", "loans_liability", "secured_loans", "unsecured_loans", "bank_od", "suspense"]);

const dayBefore = (iso: string) => new Date(Date.parse(`${iso}T00:00:00Z`) - 86_400_000).toISOString().slice(0, 10);

/**
 * Where the cash came from and went, by the indirect method. Operating: profit, plus depreciation, less the stock built up, plus the
 * movement in debtors, creditors, taxes and other current items. Investing: fixed assets and investments bought or sold. Financing:
 * capital put in or drawn, and loans taken or repaid. The three add up to the change in cash and bank; any gap is reported, not hidden.
 */
export async function cashFlow(tx: Tx, from: string, to: string, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const keys = await tx.execute<{ id: string; key: string | null; parent: string | null }>(sql`
    select a.id, g.key, pg.key as parent from accounts a join account_groups g on g.id = a.group_id left join account_groups pg on pg.id = g.parent_id
    where a.company_id = ${company.id}`);
  const keyOf = new Map([...keys].map((k) => [k.id, k]));
  const rows = await accountBalances(tx, company.id, from, to);
  const pl = await profitAndLoss(tx, company.id, from, to);

  const operating: CashFlowLine[] = [];
  const investing: CashFlowLine[] = [];
  const financing: CashFlowLine[] = [];
  let openingCash = dec(0);
  let closingCash = dec(0);
  let depreciation = dec(0);
  for (const r of rows) {
    const k = keyOf.get(r.accountId);
    const group = k?.key ?? "";
    const parent = k?.parent ?? "";
    if (r.nature === "income" || r.nature === "expense") {
      if (r.name.toLowerCase() === "depreciation") depreciation = depreciation.plus(dec(r.debit).minus(r.credit));
      continue;
    }
    if (CASH.has(group)) { openingCash = openingCash.plus(r.opening); closingCash = closingCash.plus(r.closing); continue; }
    // A rise in a debit balance used cash; a rise in a credit balance brought it in.
    const effect = dec(r.opening).minus(r.closing);
    if (effect.isZero()) continue;
    const line = { name: r.name, amount: money(effect) };
    if (INVESTING.has(group) || INVESTING.has(parent)) investing.push(line);
    else if (FINANCING.has(group) || FINANCING.has(parent)) financing.push(line);
    else operating.push(line);
  }
  // Fixed assets are shown at cost bought: the fall from depreciation is not cash going out.
  const totalOf = (l: CashFlowLine[]) => l.reduce((t, x) => t.plus(x.amount), dec(0));
  if (!depreciation.isZero()) investing.push({ name: "Depreciation (not a cash cost)", amount: money(depreciation.neg()) });

  const stockChange = dec(pl.closingStock).minus(pl.openingStock);
  const head: CashFlowLine[] = [{ name: "Net profit", amount: money(pl.netProfit) }];
  if (!depreciation.isZero()) head.push({ name: "Add back depreciation", amount: money(depreciation) });
  if (!stockChange.isZero()) head.push({ name: "Stock built up", amount: money(stockChange.neg()) });
  const op: CashFlowSection = { lines: [...head, ...operating], total: money(totalOf(head).plus(totalOf(operating))) };
  const inv: CashFlowSection = { lines: investing, total: money(totalOf(investing)) };
  const fin: CashFlowSection = { lines: financing, total: money(totalOf(financing)) };
  const net = dec(op.total).plus(inv.total).plus(fin.total);
  const change = closingCash.minus(openingCash);
  return {
    from, to, openingCash: money(openingCash), closingCash: money(closingCash), change: money(change),
    operating: op, investing: inv, financing: fin, net: money(net), difference: money(change.minus(net)),
    openingStockDate: dayBefore(from),
  };
}
