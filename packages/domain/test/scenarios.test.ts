import { describe, expect, it } from "vitest";
import { runCase, runScenario, type Baseline } from "../src/scenarios.js";

const base: Baseline = { sales: "10000000", costOfGoods: "6000000", operatingCost: "2500000", cash: "1000000", receivableDays: 30, payableDays: 45, stockDays: 60 };

describe("scenario modelling", () => {
  it("with no changes the year is the baseline", () => {
    const r = runCase(base, [], 1);
    expect(r).toMatchObject({ sales: "10000000.00", costOfGoods: "6000000.00", profit: "1500000.00", workingCapital: "0.00", cashChange: "1500000.00", closingCash: "2500000.00" });
  });

  it("a price rise that loses some volume, and a dearer supplier", () => {
    const price = runCase(base, [{ kind: "price", changePct: 10, volumeChangePct: -5 }], 1);
    expect(price).toMatchObject({ sales: "10450000.00", costOfGoods: "5700000.00", profit: "2250000.00" });
    expect(runCase(base, [{ kind: "supplier", costChangePct: 5 }], 1).profit).toBe("1200000.00");
  });

  it("gives a range from the worst to the best value of what is uncertain", () => {
    const out = runScenario(base, [{ kind: "demand", salesChangePct: [-10, 5, 15] }]);
    expect(out.cases.worst.sales).toBe("9000000.00");
    expect(out.cases.expected.sales).toBe("10500000.00");
    expect(out.cases.best.sales).toBe("11500000.00");
    expect(Number(out.cases.worst.profit)).toBeLessThan(Number(out.baseline.profit));
    expect(Number(out.cases.best.profit)).toBeGreaterThan(Number(out.cases.expected.profit));
  });

  it("a new store adds sales that ramp up, rent and staff, and a one-off spend", () => {
    const r = runCase(base, [{ kind: "store", capex: 2000000, monthlyRent: 100000, monthlyStaff: 150000, monthlySales: 600000, rampMonths: 4, startMonth: 7 }], 1);
    // Six months open: sales 150k + 300k + 450k + 600k + 600k + 600k = 2.7M.
    expect(r.sales).toBe("12700000.00");
    expect(r.operatingCost).toBe("4000000.00");
    expect(r.capex).toBe("2000000.00");
  });

  it("a loan brings cash in, charges interest and returns principal", () => {
    const r = runCase(base, [{ kind: "loan", amount: 1000000, ratePct: 12, tenureMonths: 12, startMonth: 1, capexSpend: 0 }], 1);
    expect(Number(r.interest)).toBeGreaterThan(60000);
    expect(Number(r.interest)).toBeLessThan(70000);
    expect(r.loanProceeds).toBe("1000000.00");
    expect(Number(r.principalRepaid)).toBeCloseTo(1000000, -1);
  });

  it("slower collections and bigger stock tie up cash", () => {
    const r = runCase(base, [{ kind: "credit", receivableDaysChange: 15, payableDaysChange: 0 }, { kind: "stock", stockDaysChange: 30 }], 1);
    // Receivables 15 days of 10M = 410,959; stock 30 days of 6M = 493,151.
    expect(Number(r.workingCapital)).toBeCloseTo(904110, -1);
    expect(Number(r.cashChange)).toBeCloseTo(1500000 - 904110, -1);
  });
});
