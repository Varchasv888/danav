import type { Tx } from "@varchasv/db";
import { dec, money } from "@varchasv/domain";
import { resolveCompany, profitAndLoss } from "./accounting.js";
import { sql } from "drizzle-orm";

type Dec = ReturnType<typeof dec>;
type Pl = Awaited<ReturnType<typeof profitAndLoss>>;

export interface CfoMetrics {
  revenue: string; costOfGoods: string; grossProfit: string; grossMarginPct: string | null;
  operatingExpenses: string; otherIncome: string; depreciation: string; ebitda: string; netProfit: string;
}

const total = (xs: { amount: string }[]): Dec => xs.reduce((s, x) => s.plus(x.amount), dec(0));
const pct = (n: Dec, d: Dec) => (d.isZero() ? null : n.div(d).times(100).toFixed(1));

function metrics(pl: Pl, depreciationId: string | undefined): CfoMetrics {
  const revenue = total(pl.tradingIncome);
  const costOfGoods = total(pl.tradingExpense).plus(pl.openingStock).minus(pl.closingStock);
  const gross = dec(pl.grossProfit);
  const opex = total(pl.otherExpense);
  const dep = pl.otherExpense.filter((r) => r.accountId === depreciationId).reduce((s, r) => s.plus(r.amount), dec(0));
  const net = dec(pl.netProfit);
  return {
    revenue: money(revenue), costOfGoods: money(costOfGoods), grossProfit: money(gross), grossMarginPct: pct(gross, revenue),
    operatingExpenses: money(opex), otherIncome: money(total(pl.otherIncome)), depreciation: money(dep),
    // Earnings before interest, tax, depreciation and amortisation: profit with depreciation added back. No interest or tax
    // accounts exist in the standard chart, so a business that books them should read this as profit before those.
    ebitda: money(net.plus(dep)), netProfit: money(net),
  };
}

const yearBack = (iso: string) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCFullYear(d.getUTCFullYear() - 1);
  return d.toISOString().slice(0, 10);
};
const monthEnd = (ym: string) => new Date(Date.UTC(Number(ym.slice(0, 4)), Number(ym.slice(5, 7)), 0)).toISOString().slice(0, 10);

/** Growth against last year, in percent: null when there is nothing to compare with. */
export const growth = (now: string, before: string) => (dec(before).isZero() ? null : dec(now).minus(before).div(dec(before).abs()).times(100).toFixed(1));

/**
 * The owner's view: revenue, cost of goods, gross profit and margin, expenses, EBITDA and net profit for the
 * period against the same period a year earlier with growth, and the gross margin month by month.
 */
export async function cfoView(tx: Tx, from: string, to: string) {
  const company = await resolveCompany(tx);
  const [dep] = await tx.execute<{ id: string }>(sql`select id from accounts where company_id = ${company.id} and key = 'depreciation'`);
  const [cur, prev] = await Promise.all([
    profitAndLoss(tx, company.id, from, to).then((p) => metrics(p, dep?.id)),
    profitAndLoss(tx, company.id, yearBack(from), yearBack(to)).then((p) => metrics(p, dep?.id)),
  ]);
  const keys = ["revenue", "costOfGoods", "grossProfit", "operatingExpenses", "otherIncome", "depreciation", "ebitda", "netProfit"] as const;
  const growthBy = Object.fromEntries(keys.map((k) => [k, growth(cur[k], prev[k])]));

  const months: { month: string; revenue: string; grossProfit: string; grossMarginPct: string | null }[] = [];
  const first = from.slice(0, 7);
  for (let d = new Date(`${first}-01T00:00:00Z`); d.toISOString().slice(0, 7) <= to.slice(0, 7) && months.length < 24; d.setUTCMonth(d.getUTCMonth() + 1)) {
    const ym = d.toISOString().slice(0, 7);
    const mFrom = ym === first ? from : `${ym}-01`;
    const mTo = ym === to.slice(0, 7) ? to : monthEnd(ym);
    const m = metrics(await profitAndLoss(tx, company.id, mFrom, mTo), dep?.id);
    months.push({ month: ym, revenue: m.revenue, grossProfit: m.grossProfit, grossMarginPct: m.grossMarginPct });
  }
  return { from, to, previous: { from: yearBack(from), to: yearBack(to) }, current: cur, last: prev, growth: growthBy, months };
}
