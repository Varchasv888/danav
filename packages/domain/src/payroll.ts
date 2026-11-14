import { D, dec, money, type Dec, type DecimalInput } from "./money.js";

/**
 * Indian payroll rules: PF, ESI, professional tax, labour welfare fund, income tax on salary (TDS),
 * gratuity and leave encashment, and the monthly payslip that puts them together.
 * Statutory amounts are in whole rupees, as on real payslips and challans.
 *
 * Rates and limits live in tables below so a budget or notification changes data, not code.
 * They were checked for FY 2026-27; check them again before each financial year.
 */

const rupee = (v: DecimalInput) => dec(v).toDecimalPlaces(0, D.ROUND_HALF_UP);
const rupeeUp = (v: DecimalInput) => dec(v).toDecimalPlaces(0, D.ROUND_UP);
const min = (a: Dec, b: DecimalInput) => (a.lt(b) ? a : dec(b));
const max0 = (a: Dec) => (a.gt(0) ? a : dec(0));
const r = (v: DecimalInput) => money(rupee(v));

// ---- statutory limits ------------------------------------------------------------------------------

export const PF = {
  wageCeiling: "15000", // EPF & MP Act: contributions are compulsory up to this wage
  employeeRate: "12",
  employerRate: "12", // of which EPS takes 8.33% of wages up to the ceiling
  epsRate: "8.33",
  edliRate: "0.5",
  adminRate: "0.5",
} as const;

export const ESI = {
  wageCeiling: "21000", // coverage limit (₹25,000 for persons with disability)
  employeeRate: "0.75",
  employerRate: "3.25",
  lowWageDaily: "176", // at or below this average daily wage, no employee share
} as const;

// ---- PF ----------------------------------------------------------------------------------------------

export interface PfSetup { member: boolean; epsEligible: boolean; onActualWages: boolean }

/**
 * Wages for PF under the Code on Social Security, 2020 (in force from 21 Nov 2025): basic, DA and
 * retaining allowance, but if the excluded allowances are more than half of total pay, the excess
 * counts as wages too. In effect PF wages are at least half of gross.
 */
export function pfWages(wageComponents: DecimalInput, gross: DecimalInput, labourCode: boolean): string {
  const w = dec(wageComponents);
  const half = dec(gross).div(2);
  return money(rupee(labourCode && w.lt(half) ? half : w));
}

export function pfContribution(wages: DecimalInput, setup: PfSetup) {
  const zero = { epfWages: "0.00", epsWages: "0.00", edliWages: "0.00", employee: "0.00", eps: "0.00", employerEpf: "0.00", edli: "0.00", admin: "0.00" };
  if (!setup.member) return zero;
  const w = dec(wages);
  const capped = min(w, PF.wageCeiling);
  const base = setup.onActualWages ? w : capped;
  const employee = rupee(base.times(PF.employeeRate).div(100));
  const employerTotal = rupee(base.times(PF.employerRate).div(100));
  const eps = setup.epsEligible ? rupee(capped.times(PF.epsRate).div(100)) : dec(0);
  return {
    epfWages: money(base), epsWages: money(setup.epsEligible ? capped : 0), edliWages: money(capped),
    employee: money(employee), eps: money(eps), employerEpf: money(employerTotal.minus(eps)),
    edli: r(capped.times(PF.edliRate).div(100)), admin: r(base.times(PF.adminRate).div(100)),
  };
}

// ---- ESI ---------------------------------------------------------------------------------------------

/** Contribution periods run April–September and October–March. */
export function esiPeriodStart(isoDate: string): string {
  const y = Number(isoDate.slice(0, 4));
  const m = Number(isoDate.slice(5, 7));
  if (m >= 4 && m <= 9) return `${y}-04-01`;
  return m >= 10 ? `${y}-10-01` : `${y - 1}-10-01`;
}

/** Covered when the monthly gross at the start of the contribution period (or on joining) is within the ceiling. */
export const esiCovered = (monthlyGrossAtPeriodStart: DecimalInput, disabled = false) =>
  dec(monthlyGrossAtPeriodStart).lte(disabled ? "25000" : ESI.wageCeiling);

/** Both shares round up to the next rupee. Low earners pay no employee share. */
export function esiContribution(wages: DecimalInput, paidDays: number, covered: boolean) {
  if (!covered || dec(wages).lte(0)) return { wages: "0.00", employee: "0.00", employer: "0.00" };
  const w = dec(wages);
  const lowWage = paidDays > 0 && w.div(paidDays).lte(ESI.lowWageDaily);
  return {
    wages: money(w),
    employee: money(lowWage ? 0 : rupeeUp(w.times(ESI.employeeRate).div(100))),
    employer: money(rupeeUp(w.times(ESI.employerRate).div(100))),
  };
}

// ---- professional tax ----------------------------------------------------------------------------

type Slab = [upTo: number | null, amount: number];
interface PtRule { slabs: Slab[]; femaleSlabs?: Slab[]; february?: number }

/**
 * Monthly professional tax by state (GST state code). February carries the extra amount that makes
 * the annual total ₹2,500 where the state law says so. States not listed levy none on salary.
 */
export const PT_RULES: Record<string, PtRule> = {
  "27": { slabs: [[7500, 0], [10000, 175], [null, 200]], femaleSlabs: [[25000, 0], [null, 200]], february: 300 }, // Maharashtra
  "29": { slabs: [[24999, 0], [null, 200]], february: 300 }, // Karnataka (from 1 Apr 2025)
  "19": { slabs: [[10000, 0], [15000, 110], [25000, 130], [40000, 150], [null, 200]] }, // West Bengal
  "24": { slabs: [[11999, 0], [null, 200]] }, // Gujarat
  "36": { slabs: [[15000, 0], [20000, 150], [null, 200]] }, // Telangana
  "37": { slabs: [[15000, 0], [20000, 150], [null, 200]] }, // Andhra Pradesh
};

export function professionalTax(stateCode: string, gender: "male" | "female" | "other", monthlyGross: DecimalInput, month: number): string {
  const rule = PT_RULES[stateCode];
  if (!rule) return "0.00";
  const slabs = gender === "female" && rule.femaleSlabs ? rule.femaleSlabs : rule.slabs;
  const g = dec(monthlyGross);
  const amount = slabs.find(([upTo]) => upTo === null || g.lte(upTo))![1];
  return money(amount > 0 && month === 2 && rule.february ? rule.february : amount);
}

// ---- labour welfare fund -------------------------------------------------------------------------

export interface LwfSetup { employee: string; employer: string; months: number[] }

/** LWF is a fixed amount in the months the state collects it (set per company). */
export const lwfFor = (setup: LwfSetup | null, month: number) =>
  setup && setup.months.includes(month) ? { employee: money(setup.employee), employer: money(setup.employer) } : { employee: "0.00", employer: "0.00" };

// ---- income tax on salary ----------------------------------------------------------------------------

export type TaxRegime = "new" | "old";
interface RegimeTable { slabs: Slab[]; standardDeduction: number; rebateUpTo: number; rebateMax: number; marginalRebate: boolean; surcharge: [over: number, rate: number][] }

const NEW_REGIME: RegimeTable = {
  slabs: [[400000, 0], [800000, 5], [1200000, 10], [1600000, 15], [2000000, 20], [2400000, 25], [null, 30]],
  standardDeduction: 75000, rebateUpTo: 1200000, rebateMax: 60000, marginalRebate: true,
  surcharge: [[5000000, 10], [10000000, 15], [20000000, 25]],
};
const OLD_REGIME: RegimeTable = {
  slabs: [[250000, 0], [500000, 5], [1000000, 20], [null, 30]],
  standardDeduction: 50000, rebateUpTo: 500000, rebateMax: 12500, marginalRebate: false,
  surcharge: [[5000000, 10], [10000000, 15], [20000000, 25], [50000000, 37]],
};

/** FY 2024-25 (Finance (No. 2) Act 2024): the ₹7 lakh rebate, and the ₹75,000 standard deduction for the whole year. */
const NEW_REGIME_2024: RegimeTable = {
  slabs: [[300000, 0], [700000, 5], [1000000, 10], [1200000, 15], [1500000, 20], [null, 30]],
  standardDeduction: 75000, rebateUpTo: 700000, rebateMax: 25000, marginalRebate: true,
  surcharge: [[5000000, 10], [10000000, 15], [20000000, 25]],
};

/** Slabs by financial year. FY 2026-27 keeps the FY 2025-26 rates. */
export const TAX_TABLES: Record<string, Record<TaxRegime, RegimeTable>> = {
  "2024-25": { new: NEW_REGIME_2024, old: OLD_REGIME },
  "2025-26": { new: NEW_REGIME, old: OLD_REGIME },
  "2026-27": { new: NEW_REGIME, old: OLD_REGIME },
};

function table(fy: string): Record<TaxRegime, RegimeTable> {
  const t = TAX_TABLES[fy];
  if (!t) throw new Error(`no tax table for FY ${fy}`);
  return t;
}

/** Rounded to the nearest ₹10, as sections 288A/288B require. */
const nearest10 = (v: Dec) => v.div(10).toDecimalPlaces(0, D.ROUND_HALF_UP).times(10);

function slabTax(income: Dec, slabs: Slab[]): Dec {
  let tax = dec(0);
  let lower = 0;
  for (const [upTo, rate] of slabs) {
    const top = upTo === null ? income : min(income, upTo);
    if (top.gt(lower)) tax = tax.plus(top.minus(lower).times(rate).div(100));
    if (upTo === null || income.lte(upTo)) break;
    lower = upTo;
  }
  return tax;
}

/** Old regime: higher basic exemption for senior (60+) and very senior (80+) citizens. */
function slabsFor(regime: TaxRegime, t: RegimeTable, age: number): Slab[] {
  if (regime !== "old" || age < 60) return t.slabs;
  const basic = age >= 80 ? 500000 : 300000;
  return [[basic, 0], ...t.slabs.slice(1).filter(([upTo]) => upTo === null || upTo > basic)];
}

/** Tax on total income: slabs, the 87A rebate (with marginal relief in the new regime), surcharge with marginal relief, 4% cess. */
export function incomeTax(fy: string, regime: TaxRegime, taxableIncome: DecimalInput, age = 30) {
  const t = table(fy)[regime];
  const income = nearest10(max0(dec(taxableIncome)));
  const slabs = slabsFor(regime, t, age);
  const base = slabTax(income, slabs);
  let tax = base;
  let rebate = dec(0);
  if (income.lte(t.rebateUpTo)) rebate = min(base, t.rebateMax);
  else if (t.marginalRebate && base.gt(income.minus(t.rebateUpTo))) rebate = base.minus(income.minus(t.rebateUpTo));
  tax = base.minus(rebate);

  let surcharge = dec(0);
  const band = [...t.surcharge].reverse().find(([over]) => income.gt(over));
  if (band) {
    const [over, rate] = band;
    surcharge = tax.times(rate).div(100);
    // Marginal relief: tax + surcharge may not exceed the tax at the threshold plus the income above it.
    const prevRate = t.surcharge.filter(([o]) => o < over).at(-1)?.[1] ?? 0;
    const atThreshold = slabTax(dec(over), slabs).times(100 + prevRate).div(100);
    const cap = atThreshold.plus(income.minus(over));
    if (tax.plus(surcharge).gt(cap)) surcharge = max0(cap.minus(tax));
  }
  const cess = tax.plus(surcharge).times(4).div(100);
  return {
    taxableIncome: money(income), tax: money(base), rebate: money(rebate), surcharge: money(surcharge), cess: money(cess),
    total: money(nearest10(tax.plus(surcharge).plus(cess))),
  };
}

export interface SalaryTaxInput {
  fy: string; regime: TaxRegime; age: number;
  /** This employer's salary for the year (actual so far + projected), before exemptions. */
  annualSalary: DecimalInput;
  annualBasicDa: DecimalInput; annualHra: DecimalInput; rentPaid: DecimalInput; metro: boolean;
  professionalTax: DecimalInput; employeePf: DecimalInput;
  previousEmployerSalary?: DecimalInput; otherIncome?: DecimalInput;
  deductions?: { c80?: DecimalInput; ccd1b?: DecimalInput; d80?: DecimalInput; homeLoanInterest?: DecimalInput; other?: DecimalInput };
}

/** Taxable income from salary as the employer computes it for TDS (section 192). */
export function salaryTax(i: SalaryTaxInput) {
  const t = table(i.fy)[i.regime];
  const old = i.regime === "old";
  const d = i.deductions ?? {};
  const salary = dec(i.annualSalary).plus(i.previousEmployerSalary ?? 0);
  const basicDa = dec(i.annualBasicDa);
  const hraExempt = old ? max0(min(min(dec(i.annualHra), max0(dec(i.rentPaid).minus(basicDa.times(10).div(100)))), basicDa.times(i.metro ? 50 : 40).div(100))) : dec(0);
  const standard = min(salary, t.standardDeduction);
  const pt = old ? min(dec(i.professionalTax), 2500) : dec(0);
  const netSalary = max0(salary.minus(hraExempt).minus(standard).minus(pt));
  const homeLoan = old ? min(dec(d.homeLoanInterest ?? 0), 200000) : dec(0);
  const grossTotal = max0(netSalary.plus(i.otherIncome ?? 0).minus(homeLoan));
  const chapterVIA = old
    ? min(dec(d.c80 ?? 0).plus(i.employeePf), 150000).plus(min(dec(d.ccd1b ?? 0), 50000)).plus(min(dec(d.d80 ?? 0), 100000)).plus(d.other ?? 0)
    : dec(0);
  const taxable = max0(grossTotal.minus(chapterVIA));
  return {
    salary: money(salary), hraExempt: money(hraExempt), standardDeduction: money(standard), professionalTax: money(pt),
    houseProperty: money(homeLoan.neg()), chapterVIA: money(chapterVIA), taxableIncome: money(taxable),
    ...(({ taxableIncome: _t, ...rest }) => rest)(incomeTax(i.fy, i.regime, taxable, i.age)),
  };
}

/** This month's TDS: the year's tax not yet deducted, spread over the months left (this one included). */
export function monthlyTds(annualTax: DecimalInput, deductedSoFar: DecimalInput, monthsLeft: number): string {
  if (monthsLeft < 1) throw new Error("monthsLeft must be at least 1");
  return r(max0(dec(annualTax).minus(deductedSoFar)).div(monthsLeft));
}

/** Months from the given month to March, both included (April → 12, March → 1). */
export const monthsLeftInFy = (month: number) => (month >= 4 ? 16 - month : 4 - month);

// ---- payslip -------------------------------------------------------------------------------------------

export interface PayComponent {
  code: string; name: string; monthly: DecimalInput;
  /** Counts as wages for PF and gratuity (basic, DA, retaining allowance). */
  pfWage?: boolean;
  /** Left out of ESI wages (e.g. annual bonus). */
  esiExcluded?: boolean;
  /** HRA, for the old-regime exemption. */
  hra?: boolean;
}

export interface PayslipInput {
  month: number; daysInMonth: number; lopDays: DecimalInput;
  components: PayComponent[];
  pf: PfSetup; esiCovered: boolean; labourCodeWages: boolean;
  pt: { stateCode: string; gender: "male" | "female" | "other" };
  lwf: LwfSetup | null;
  tds: DecimalInput;
  otherDeductions?: { name: string; amount: DecimalInput }[];
  /** One-off earnings for the month, not prorated: overtime, incentive, bonus, arrears. */
  extraEarnings?: ExtraEarning[];
}

export interface ExtraEarning { code: string; name: string; amount: DecimalInput; pfWage?: boolean; esiExcluded?: boolean }

/**
 * One month's pay: earnings prorated for loss-of-pay days plus one-off extras, then PF, ESI, PT, LWF
 * and TDS. Every amount is in whole rupees.
 */
export function computePayslip(p: PayslipInput) {
  const lop = dec(p.lopDays);
  if (lop.lt(0) || lop.gt(p.daysInMonth)) throw new Error("lopDays out of range");
  const paidDays = dec(p.daysInMonth).minus(lop);
  const earnings = p.components.map((c) => ({
    code: c.code, name: c.name, monthly: money(c.monthly), earned: r(dec(c.monthly).times(paidDays).div(p.daysInMonth)),
    pfWage: !!c.pfWage, esiExcluded: !!c.esiExcluded, hra: !!c.hra, extra: false,
  }));
  for (const x of p.extraEarnings ?? []) {
    earnings.push({ code: x.code, name: x.name, monthly: "0.00", earned: r(x.amount), pfWage: !!x.pfWage, esiExcluded: !!x.esiExcluded, hra: false, extra: true });
  }
  const total = (f: (e: (typeof earnings)[number]) => boolean) => earnings.filter(f).reduce((s, e) => s.plus(e.earned), dec(0));
  const gross = total(() => true);
  const pfW = pfWages(total((e) => e.pfWage), gross, p.labourCodeWages);
  const pf = pfContribution(pfW, p.pf);
  const esi = esiContribution(total((e) => !e.esiExcluded), paidDays.toNumber(), p.esiCovered);
  const pt = professionalTax(p.pt.stateCode, p.pt.gender, gross, p.month);
  const lwf = lwfFor(p.lwf, p.month);
  const tds = r(p.tds);
  const others = (p.otherDeductions ?? []).map((o) => ({ name: o.name, amount: r(o.amount) }));
  const deductions = [pf.employee, esi.employee, pt, lwf.employee, tds, ...others.map((o) => o.amount)].reduce((s, v) => s.plus(v), dec(0));
  const employer = dec(pf.eps).plus(pf.employerEpf).plus(pf.edli).plus(pf.admin).plus(esi.employer).plus(lwf.employer);
  return {
    paidDays: paidDays.toString(), earnings, gross: money(gross), pfWages: pfW, pf, esi, pt, lwf, tds, otherDeductions: others,
    totalDeductions: money(deductions), netPay: money(gross.minus(deductions)),
    employerContributions: money(employer), costToCompany: money(gross.plus(employer)),
  };
}

// ---- leaving: gratuity and leave encashment ---------------------------------------------------------

/** Completed years of service; a final part-year of more than six months counts as a year. */
export function serviceYears(joined: string, left: string): number {
  const [y1, m1, d1] = joined.split("-").map(Number) as [number, number, number];
  const [y2, m2, d2] = left.split("-").map(Number) as [number, number, number];
  let months = (y2 - y1) * 12 + (m2 - m1) - (d2 < d1 ? 1 : 0);
  if (months < 0) months = 0;
  const years = Math.floor(months / 12);
  return months % 12 > 6 || (months % 12 === 6 && d2 >= d1 && d2 - d1 > 0) ? years + 1 : years;
}

export const GRATUITY_CAP = "2000000";

/**
 * Gratuity: 15 days' wages (monthly wages ÷ 26 × 15) per year of service, from five years of service
 * (one year for fixed-term employees under the Code on Social Security), capped at ₹20 lakh.
 */
export function gratuity(monthlyWages: DecimalInput, joined: string, left: string, fixedTerm = false) {
  const years = serviceYears(joined, left);
  const eligible = fixedTerm ? years >= 1 : years >= 5;
  const amount = eligible ? min(rupee(dec(monthlyWages).times(15).div(26).times(years)), GRATUITY_CAP) : dec(0);
  return { years, eligible, amount: money(amount) };
}

/** Unused earned leave paid out at monthly wages ÷ divisor (26 or 30) per day. */
export const leaveEncashment = (days: DecimalInput, monthlyWages: DecimalInput, divisor: 26 | 30 = 30) =>
  r(dec(monthlyWages).div(divisor).times(days));

// ---- arrears ------------------------------------------------------------------------------------------

/**
 * Arrears for a month already paid when a salary revision takes effect back to it: the difference
 * between the new and the old monthly amounts, prorated by that month's paid days, split into the
 * part that counts for PF (basic/DA) and the rest. A cut (negative total) isn't recovered automatically.
 */
export function arrearsFor(
  paid: { code: string; monthly: DecimalInput; pfWage?: boolean }[], revised: { code: string; monthly: DecimalInput; pfWage?: boolean }[],
  paidDays: DecimalInput, daysInMonth: number,
) {
  const codes = new Set([...paid.map((c) => c.code), ...revised.map((c) => c.code)]);
  let pfPart = dec(0);
  let other = dec(0);
  for (const code of codes) {
    const o = paid.find((c) => c.code === code);
    const n = revised.find((c) => c.code === code);
    const diff = dec(n?.monthly ?? 0).minus(o?.monthly ?? 0).times(paidDays).div(daysInMonth);
    if ((n ?? o)!.pfWage) pfPart = pfPart.plus(diff);
    else other = other.plus(diff);
  }
  const total = rupee(pfPart.plus(other));
  if (total.lte(0)) return { pfWage: "0.00", other: "0.00", total: "0.00" };
  const pf = rupee(pfPart.gt(0) ? pfPart : 0);
  return { pfWage: money(pf), other: money(total.minus(pf)), total: money(total) };
}
