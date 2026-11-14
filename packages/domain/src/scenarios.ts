import { D, dec, type Dec } from "./money.js";

/**
 * What-if modelling over the next twelve months. A baseline taken from the books (a year's sales, cost of goods, running costs, the days money
 * is tied up) and a list of changes, each with a worst, an expected and a best value for what the owner is unsure of. Each case is worked out
 * separately, so the answer is a range with its assumptions in plain sight, not a single forecast.
 */
export interface Baseline {
  /** Twelve months of net sales and cost of goods, running costs, and cash now. */
  sales: string; costOfGoods: string; operatingCost: string; cash: string;
  receivableDays: number; payableDays: number; stockDays: number;
}

/** A value for each case: worst, expected, best. A plain number means the same in all three. */
export type Ranged = number | [number, number, number];

export type Adjustment =
  | { kind: "hire"; name?: string; count: Ranged; monthlyCost: Ranged; startMonth: Ranged; yearlySalesPerHire: Ranged }
  | { kind: "store"; name?: string; capex: Ranged; monthlyRent: Ranged; monthlyStaff: Ranged; monthlySales: Ranged; rampMonths: Ranged; startMonth: Ranged }
  | { kind: "price"; name?: string; changePct: Ranged; volumeChangePct: Ranged }
  | { kind: "discount"; name?: string; extraDiscountPct: Ranged; volumeUpliftPct: Ranged }
  | { kind: "supplier"; name?: string; costChangePct: Ranged }
  | { kind: "credit"; name?: string; receivableDaysChange: Ranged; payableDaysChange: Ranged }
  | { kind: "loan"; name?: string; amount: Ranged; ratePct: Ranged; tenureMonths: Ranged; startMonth: Ranged; capexSpend: Ranged }
  | { kind: "demand"; name?: string; salesChangePct: Ranged }
  | { kind: "stock"; name?: string; stockDaysChange: Ranged };

export const SCENARIO_KINDS = ["hire", "store", "price", "discount", "supplier", "credit", "loan", "demand", "stock"] as const;
export const CASES = ["worst", "expected", "best"] as const;

const pick = (v: Ranged, c: 0 | 1 | 2): number => (Array.isArray(v) ? v[c] : v);
const months = (start: number) => Math.max(0, Math.min(12, 13 - Math.max(1, Math.round(start)))); // months left in the year from month `start`

export interface CaseResult {
  sales: string; costOfGoods: string; grossMargin: string; operatingCost: string; interest: string; profit: string;
  capex: string; loanProceeds: string; principalRepaid: string; workingCapital: string; cashChange: string; closingCash: string;
}

export function runCase(base: Baseline, adjustments: Adjustment[], c: 0 | 1 | 2): CaseResult {
  const baseSales = dec(base.sales);
  const cogsPct = baseSales.gt(0) ? dec(base.costOfGoods).div(baseSales) : dec(0);
  let sales = baseSales;
  let priceFactor = dec(1);
  let costFactor = dec(1);
  let extraSales = dec(0);
  let opex = dec(base.operatingCost);
  let interest = dec(0);
  let capex = dec(0);
  let loan = dec(0);
  let principal = dec(0);
  let recvDays = base.receivableDays;
  let payDays = base.payableDays;
  let stockDays = base.stockDays;
  const pct = (v: Ranged) => dec(pick(v, c)).div(100);

  for (const a of adjustments) {
    switch (a.kind) {
      case "demand": sales = sales.times(dec(1).plus(pct(a.salesChangePct))); break;
      case "price": {
        const p = pct(a.changePct);
        priceFactor = priceFactor.times(dec(1).plus(p));
        sales = sales.times(dec(1).plus(pct(a.volumeChangePct)));
        break;
      }
      case "discount": {
        priceFactor = priceFactor.times(dec(1).minus(pct(a.extraDiscountPct)));
        sales = sales.times(dec(1).plus(pct(a.volumeUpliftPct)));
        break;
      }
      case "supplier": costFactor = costFactor.times(dec(1).plus(pct(a.costChangePct))); break;
      case "hire": {
        const m = months(pick(a.startMonth, c));
        opex = opex.plus(dec(pick(a.count, c)).times(pick(a.monthlyCost, c)).times(m));
        extraSales = extraSales.plus(dec(pick(a.count, c)).times(pick(a.yearlySalesPerHire, c)).times(m).div(12));
        break;
      }
      case "store": {
        const start = pick(a.startMonth, c);
        const m = months(start);
        const ramp = Math.max(1, Math.round(pick(a.rampMonths, c)));
        let s = dec(0);
        for (let i = 0; i < m; i++) s = s.plus(dec(pick(a.monthlySales, c)).times(Math.min(1, (i + 1) / ramp)));
        extraSales = extraSales.plus(s);
        opex = opex.plus(dec(pick(a.monthlyRent, c)).plus(pick(a.monthlyStaff, c)).times(m));
        capex = capex.plus(pick(a.capex, c));
        break;
      }
      case "loan": {
        const amount = dec(pick(a.amount, c));
        const n = Math.max(1, Math.round(pick(a.tenureMonths, c)));
        const m = months(pick(a.startMonth, c));
        const monthlyRate = dec(pick(a.ratePct, c)).div(1200);
        // Equal monthly instalments over the tenure; the year sees only the months from the start.
        const emi = monthlyRate.isZero() ? amount.div(n) : amount.times(monthlyRate).div(dec(1).minus(dec(1).plus(monthlyRate).pow(-n)));
        let bal = amount;
        for (let i = 0; i < Math.min(m, n); i++) {
          const int = bal.times(monthlyRate);
          interest = interest.plus(int);
          principal = principal.plus(emi.minus(int));
          bal = bal.minus(emi.minus(int));
        }
        if (m > 0) loan = loan.plus(amount);
        capex = capex.plus(pick(a.capexSpend, c));
        break;
      }
      case "credit": recvDays += pick(a.receivableDaysChange, c); payDays += pick(a.payableDaysChange, c); break;
      case "stock": stockDays += pick(a.stockDaysChange, c); break;
    }
  }
  // Extra sales (new hires, new stores) come in at the new price level, with the new cost level on top of the baseline cost ratio.
  const totalSales = sales.plus(extraSales).times(priceFactor);
  const volumeSales = sales.plus(extraSales);
  const cogs = volumeSales.times(cogsPct).times(costFactor);
  const margin = totalSales.minus(cogs);
  const profit = margin.minus(opex).minus(interest);
  // Money tied up: receivables on sales, stock on cost, payables on cost; the change from today's levels.
  const base0 = { recv: baseSales.times(base.receivableDays).div(365), stock: dec(base.costOfGoods).times(base.stockDays).div(365), pay: dec(base.costOfGoods).times(base.payableDays).div(365) };
  const now = { recv: totalSales.times(recvDays).div(365), stock: cogs.times(stockDays).div(365), pay: cogs.times(payDays).div(365) };
  const wc = now.recv.minus(base0.recv).plus(now.stock.minus(base0.stock)).minus(now.pay.minus(base0.pay));
  const cashChange = profit.minus(capex).plus(loan).minus(principal).minus(wc);
  const r = (v: Dec) => v.toDecimalPlaces(2, D.ROUND_HALF_UP).toFixed(2);
  return {
    sales: r(totalSales), costOfGoods: r(cogs), grossMargin: r(margin), operatingCost: r(opex), interest: r(interest), profit: r(profit), capex: r(capex), loanProceeds: r(loan), principalRepaid: r(principal),
    workingCapital: r(wc), cashChange: r(cashChange), closingCash: r(dec(base.cash).plus(cashChange)),
  };
}

/** All three cases for a list of changes, plus the baseline for comparison. */
export function runScenario(base: Baseline, adjustments: Adjustment[]) {
  const baseline = runCase(base, [], 1);
  return { baseline, cases: { worst: runCase(base, adjustments, 0), expected: runCase(base, adjustments, 1), best: runCase(base, adjustments, 2) } };
}
