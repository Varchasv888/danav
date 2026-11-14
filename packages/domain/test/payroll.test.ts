import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  arrearsFor, computePayslip, esiContribution, esiCovered, esiPeriodStart, gratuity, incomeTax, leaveEncashment, monthlyTds, monthsLeftInFy, pfContribution, pfWages,
  professionalTax, salaryTax, type PayslipInput, type PfSetup, type SalaryTaxInput, type TaxRegime,
} from "../src/index.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const f: any = JSON.parse(readFileSync(fileURLToPath(new URL("../../../spec/fixtures/payroll.json", import.meta.url)), "utf8"));
const named = <T extends { name?: string }>(cases: T[]) => cases.map((c, i) => [c.name ?? String(i), c] as const);

describe("payroll fixtures", () => {
  it.each(named(f.pfWages))("PF wages: %s", (_n, c: { wageComponents: string; gross: string; labourCode: boolean; expect: string }) => {
    expect(pfWages(c.wageComponents, c.gross, c.labourCode)).toBe(c.expect);
  });
  it.each(named(f.pf))("PF: %s", (_n, c: { wages: string; setup: PfSetup; expect: object }) => {
    expect(pfContribution(c.wages, c.setup)).toEqual(c.expect);
  });
  it.each(named(f.esi))("ESI: %s", (_n, c: { wages: string; paidDays: number; covered: boolean; expect: object }) => {
    expect(esiContribution(c.wages, c.paidDays, c.covered)).toEqual(c.expect);
  });
  it("ESI contribution periods and coverage", () => {
    for (const c of f.esiPeriods) expect(esiPeriodStart(c.date)).toBe(c.expect);
    for (const c of f.esiCoverage) expect(esiCovered(c.gross, c.disabled)).toBe(c.expect);
  });
  it.each(f.pt.map((c: { state: string; gender: string; gross: string; month: number }) => [`${c.state} ${c.gender} ${c.gross} m${c.month}`, c]))(
    "PT: %s", (_n, c: { state: string; gender: "male" | "female"; gross: string; month: number; expect: string }) => {
      expect(professionalTax(c.state, c.gender, c.gross, c.month)).toBe(c.expect);
    });
  it.each(named(f.incomeTax))("income tax: %s", (_n, c: { fy: string; regime: TaxRegime; income: string; age: number; expect: object }) => {
    expect(incomeTax(c.fy, c.regime, c.income, c.age)).toEqual(c.expect);
  });
  it.each(named(f.salaryTax))("salary tax: %s", (_n, c: { input: SalaryTaxInput; expect: object }) => {
    expect(salaryTax(c.input)).toMatchObject(c.expect);
  });
  it("monthly TDS spreads the balance over the months left", () => {
    for (const c of f.monthlyTds) expect(monthlyTds(c.annualTax, c.deductedSoFar, monthsLeftInFy(c.month))).toBe(c.expect);
    expect([4, 9, 12, 1, 3].map(monthsLeftInFy)).toEqual([12, 7, 4, 3, 1]);
  });
  it.each(named(f.payslips))("payslip: %s", (_n, c: { input: PayslipInput; expect: Record<string, unknown> }) => {
    const p = computePayslip(c.input);
    expect({
      paidDays: p.paidDays, earned: p.earnings.map((e) => e.earned), gross: p.gross, pfWages: p.pfWages, pfEmployee: p.pf.employee, eps: p.pf.eps, employerEpf: p.pf.employerEpf,
      esiEmployee: p.esi.employee, pt: p.pt, lwfEmployee: p.lwf.employee, totalDeductions: p.totalDeductions, netPay: p.netPay,
      employerContributions: p.employerContributions, costToCompany: p.costToCompany,
    }).toEqual(c.expect);
  });
  it.each(named(f.gratuity))("gratuity: %s", (_n, c: { wages: string; joined: string; left: string; fixedTerm: boolean; expect: object }) => {
    expect(gratuity(c.wages, c.joined, c.left, c.fixedTerm)).toEqual(c.expect);
  });
  it.each(named(f.arrears))("arrears: %s", (_n, c: { paid: []; revised: []; paidDays: string; daysInMonth: number; expect: object }) => {
    expect(arrearsFor(c.paid, c.revised, c.paidDays, c.daysInMonth)).toEqual(c.expect);
  });
  it("leave encashment", () => {
    for (const c of f.leaveEncashment) expect(leaveEncashment(c.days, c.wages, c.divisor)).toBe(c.expect);
  });
});
