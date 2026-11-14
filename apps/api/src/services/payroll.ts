import { and, asc, desc, eq, gte, inArray, lt, lte, ne, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import {
  arrearsFor, computePayslip, dec, esiCovered, esiPeriodStart, fiscalYearOf, money, monthlyTds, monthsLeftInFy, salaryTax, type Dec, type PayslipInput,
} from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { decryptSecret } from "../lib/secrets.js";
import { autoEmit } from "./comms.js";
import { cancelVoucher, postVoucher, resolveCompany } from "./accounting.js";
import {
  accountIds, ensureHr, employeesInPeriod, lopForEmployees, monthlyGross, payrollSettings, periodBounds, structureOn, taxDeclaration, type Actor,
} from "./hr.js";

type Employee = typeof tables.employees.$inferSelect;
type Run = typeof tables.payrollRuns.$inferSelect;
type Settings = Awaited<ReturnType<typeof payrollSettings>>;
type Extra = { code: string; name: string; amount: string; esiExcluded?: boolean; pfWage?: boolean };
type LoanRecovery = { loanId: string; name: string; amount: string; overridden?: boolean };
type Basis = { code: string; monthly: string; pfWage?: boolean }[];
type ArrearsItem = { period: string; components: Basis; pfWage: string; other: string };

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const periodLabel = (period: string) => `${MONTHS[Number(period.slice(5, 7)) - 1]} ${period.slice(0, 4)}`;

/** Age on the last day of the financial year (decides senior-citizen slabs in the old regime). */
function ageAt(dob: string | null, onDate: string) {
  if (!dob) return 30;
  const age = Number(onDate.slice(0, 4)) - Number(dob.slice(0, 4));
  return onDate.slice(5) < dob.slice(5) ? age - 1 : age;
}

/** Salary, tax and statutory amounts already paid this financial year, from final payslips of earlier months. */
async function yearToDate(tx: Tx, employeeId: string, fyStart: string, periodStart: string) {
  const [r] = await tx.execute<{ gross: string; tds: string; pf: string; pt: string; basic_da: string; hra: string }>(sql`
    select coalesce(sum(p.gross), 0) as gross, coalesce(sum(p.tds), 0) as tds, coalesce(sum(p.pf_employee), 0) as pf, coalesce(sum(p.pt), 0) as pt,
           coalesce(sum((p.detail->>'basicDa')::numeric), 0) as basic_da, coalesce(sum((p.detail->>'hra')::numeric), 0) as hra
    from payslips p join payroll_runs r on r.id = p.run_id
    where p.employee_id = ${employeeId} and r.status in ('finalized', 'paid')
      and (r.period || '-01')::date >= ${fyStart}::date and (r.period || '-01')::date < ${periodStart}::date`);
  const done = await tx.execute<{ period: string }>(sql`
    select r.period from payslips p join payroll_runs r on r.id = p.run_id
    where p.employee_id = ${employeeId} and r.status in ('finalized', 'paid')
      and (r.period || '-01')::date >= ${fyStart}::date and (r.period || '-01')::date < ${periodStart}::date`);
  return { ...r!, periods: new Set(done.map((d) => d.period)) };
}

/**
 * Earlier months of the year that were paid before payroll moved to Varchasv (employed, but no final
 * payslip here): their salary is estimated from the structure then in force, prorated for a joining
 * month, so the year's tax isn't understated.
 */
async function estimatedEarlierMonths(tx: Tx, e: Employee, fyStart: string, periodStart: string, have: Set<string>) {
  const est = { gross: dec(0), basicDa: dec(0), hra: dec(0), months: 0 };
  for (let d = fyStart; d < periodStart; d = nextMonth(d)) {
    const p = periodBounds(d.slice(0, 7));
    if (have.has(d.slice(0, 7)) || e.joinedOn > p.end) continue;
    const s = await structureOn(tx, e.id, p.end);
    if (!s) continue;
    const from = e.joinedOn > p.start ? Number(e.joinedOn.slice(8)) : 1;
    const share = dec(p.days - from + 1).div(p.days);
    const cs = s.components;
    const part = (f: (c: (typeof cs)[number]) => boolean) => cs.filter(f).reduce((sum, c) => sum.plus(c.monthly), dec(0)).times(share);
    est.gross = est.gross.plus(part(() => true));
    est.basicDa = est.basicDa.plus(part((c) => !!c.pfWage));
    est.hra = est.hra.plus(part((c) => !!c.hra));
    est.months += 1;
  }
  return est;
}
const nextMonth = (iso: string) => {
  const y = Number(iso.slice(0, 4));
  const m = Number(iso.slice(5, 7));
  return m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, "0")}-01`;
};

interface Overrides {
  lopOverride?: string | null; otherDeductions?: { name: string; amount: string }[]; extraEarnings?: Extra[]; loanRecoveries?: LoanRecovery[];
}

const signature = (b: Basis) => JSON.stringify([...b].map((c) => [c.code, money(c.monthly)]).sort());
const shiftPeriod = (period: string, months: number) => {
  const d = new Date(Date.UTC(Number(period.slice(0, 4)), Number(period.slice(5, 7)) - 1 + months, 1));
  return d.toISOString().slice(0, 7);
};

/**
 * Arrears owed for final months of the last year whose salary structure has since been revised back
 * to them. What was paid for a month is its payslip's structure, or the structure used by arrears
 * already paid for it, so a second revision pays only the further difference.
 */
async function arrearsDue(tx: Tx, e: Employee, period: string) {
  const earlier = await tx.select({ slip: tables.payslips, period: tables.payrollRuns.period }).from(tables.payslips)
    .innerJoin(tables.payrollRuns, eq(tables.payrollRuns.id, tables.payslips.runId))
    .where(and(eq(tables.payslips.employeeId, e.id), inArray(tables.payrollRuns.status, ["finalized", "paid"]),
      lt(tables.payrollRuns.period, period), gte(tables.payrollRuns.period, shiftPeriod(period, -12))))
    .orderBy(asc(tables.payrollRuns.period));
  const settled = new Map<string, Basis>();
  for (const x of earlier) for (const a of ((x.slip.detail as { arrears?: ArrearsItem[] }).arrears ?? [])) settled.set(a.period, a.components);
  const items: ArrearsItem[] = [];
  for (const x of earlier) {
    const b = periodBounds(x.period);
    const s = await structureOn(tx, e.id, e.leftOn && e.leftOn < b.end ? e.leftOn : b.end);
    if (!s) continue;
    const paid: Basis = settled.get(x.period) ?? ((x.slip.detail as { earnings: { code: string; monthly: string; pfWage: boolean; extra?: boolean }[] }).earnings
      .filter((c) => !c.extra).map((c) => ({ code: c.code, monthly: c.monthly, pfWage: c.pfWage })));
    const revised: Basis = s.components.map((c) => ({ code: c.code, monthly: c.monthly, pfWage: !!c.pfWage }));
    if (signature(paid) === signature(revised)) continue;
    const a = arrearsFor(paid, revised, x.slip.paidDays, b.days);
    items.push({ period: x.period, components: revised, pfWage: a.pfWage, other: a.other });
  }
  const sum = (k: "pfWage" | "other") => items.reduce((t, i) => t.plus(i[k]), dec(0));
  return { items, pfWage: sum("pfWage"), other: sum("other") };
}

/** This month's instalment on each open loan: the set instalment (or a typed-in amount, 0 to skip), never more than is left. */
async function loanInstalments(tx: Tx, employeeId: string, period: string, prev: LoanRecovery[]) {
  const loans = await tx.select().from(tables.employeeLoans).where(and(
    eq(tables.employeeLoans.employeeId, employeeId), eq(tables.employeeLoans.status, "active"), lte(tables.employeeLoans.startPeriod, period),
  )).orderBy(asc(tables.employeeLoans.date));
  return loans.map((l): LoanRecovery => {
    const typed = prev.find((x) => x.loanId === l.id && x.overridden);
    const left = dec(l.amount).minus(l.recovered);
    const want = dec(typed ? typed.amount : l.instalment);
    return { loanId: l.id, name: l.kind === "loan" ? "Loan recovery" : "Advance recovery", amount: money(want.gt(left) ? left : want), ...(typed ? { overridden: true } : {}) };
  }).filter((x) => x.overridden || dec(x.amount).gt(0));
}

/**
 * One employee's payslip for the month. Loss-of-pay days come from attendance unless typed in.
 * TDS: the year's salary is projected (actual so far + this month + the current structure for the
 * months left), taxed under the employee's regime, and what's still due is spread over the months left.
 */
async function computeFor(tx: Tx, settings: Settings, e: Employee, period: string, lopFromAttendance: number, o: Overrides) {
  const { start, end, days, month } = periodBounds(period);
  const onDate = e.leftOn && e.leftOn < end ? e.leftOn : end;
  const struct = await structureOn(tx, e.id, onDate);
  if (!struct) return null;
  const lopDays = o.lopOverride ?? String(lopFromAttendance);
  if (dec(lopDays).gt(days)) throw badRequest("lop_exceeds_days");

  // ESI: coverage is decided by the wages at the start of the contribution period (or on joining).
  const esiFrom = esiPeriodStart(start) > e.joinedOn ? esiPeriodStart(start) : e.joinedOn;
  const esiStruct = (await structureOn(tx, e.id, esiFrom)) ?? struct;
  const arrears = await arrearsDue(tx, e, period);
  const loans = await loanInstalments(tx, e.id, period, o.loanRecoveries ?? []);
  const extras: Extra[] = [
    ...(o.extraEarnings ?? []),
    ...(arrears.pfWage.gt(0) ? [{ code: "ARREARS_PF", name: "Arrears (basic/DA)", amount: money(arrears.pfWage), pfWage: true }] : []),
    ...(arrears.other.gt(0) ? [{ code: "ARREARS", name: "Arrears (allowances)", amount: money(arrears.other) }] : []),
  ];
  const base: Omit<PayslipInput, "tds"> = {
    month, daysInMonth: days, lopDays, components: struct.components,
    pf: { member: e.pfMember, epsEligible: e.epsEligible, onActualWages: e.pfOnActualWages },
    esiCovered: esiCovered(monthlyGross(esiStruct.components), e.disabled), labourCodeWages: settings.labourCodeWages,
    pt: { stateCode: e.workState, gender: e.gender as "male" | "female" | "other" },
    lwf: settings.lwfMonths.length ? { employee: settings.lwfEmployee, employer: settings.lwfEmployer, months: settings.lwfMonths } : null,
    otherDeductions: [...(o.otherDeductions ?? []), ...loans.filter((l) => dec(l.amount).gt(0)).map((l) => ({ name: l.name, amount: l.amount }))],
    extraEarnings: extras,
  };
  const pre = computePayslip({ ...base, tds: "0" });

  const fy = fiscalYearOf(start);
  const leaving = !!e.leftOn && e.leftOn <= end;
  const monthsLeft = leaving ? 1 : monthsLeftInFy(month);
  const after = monthsLeft - 1;
  const y = await yearToDate(tx, e.id, fy.start, start);
  const sumOf = (f: (c: (typeof pre.earnings)[number]) => boolean) => pre.earnings.filter(f).reduce((s, c) => s.plus(c.earned), dec(0));
  const comps = struct.components;
  const monthly = (f: (c: (typeof comps)[number]) => boolean) => comps.filter(f).reduce((s, c) => s.plus(c.monthly), dec(0));
  const basicDa = sumOf((c) => c.pfWage);
  const hra = sumOf((c) => c.hra);
  const decl = await taxDeclaration(tx, e.id, fy.label);
  const est = await estimatedEarlierMonths(tx, e, fy.start, start, y.periods);
  const annual = {
    salary: dec(y.gross).plus(est.gross).plus(pre.gross).plus(dec(monthlyGross(comps)).times(after)),
    basicDa: dec(y.basic_da).plus(est.basicDa).plus(basicDa).plus(monthly((c) => !!c.pfWage).times(after)),
    hra: dec(y.hra).plus(est.hra).plus(hra).plus(monthly((c) => !!c.hra).times(after)),
    pt: dec(y.pt).plus(dec(pre.pt).times(1 + after + est.months)),
    pf: dec(y.pf).plus(dec(pre.pf.employee).times(1 + after + est.months)),
  };
  const tax = salaryTax({
    fy: fy.label, regime: e.taxRegime as "new" | "old", age: ageAt(e.dob, fy.end),
    annualSalary: annual.salary, annualBasicDa: annual.basicDa, annualHra: annual.hra, rentPaid: decl?.rentPaid ?? "0", metro: e.metro,
    professionalTax: annual.pt, employeePf: annual.pf,
    previousEmployerSalary: decl?.previousEmployerSalary ?? "0", otherIncome: decl?.otherIncome ?? "0",
    deductions: { c80: decl?.c80 ?? "0", ccd1b: decl?.ccd1b ?? "0", d80: decl?.d80 ?? "0", homeLoanInterest: decl?.homeLoanInterest ?? "0", other: decl?.otherDeductions ?? "0" },
  });
  const deductedSoFar = dec(y.tds).plus(decl?.previousEmployerTds ?? 0);
  let tds = dec(pre.gross).isZero() ? dec(0) : dec(monthlyTds(tax.total, deductedSoFar, monthsLeft));
  // Tax can't take pay below zero; what isn't deducted now is picked up in later months.
  const room = dec(pre.netPay);
  if (tds.gt(room)) tds = room.gt(0) ? room : dec(0);
  const slip = computePayslip({ ...base, tds: money(tds) });
  if (dec(slip.netPay).lt(0)) throw badRequest("deductions_exceed_pay");
  return {
    lopDays, slip, manualDeductions: o.otherDeductions ?? [], extraEarnings: o.extraEarnings ?? [], loanRecoveries: loans,
    detail: {
      ...slip, period, basicDa: money(basicDa), hra: money(hra), structureFrom: struct.effectiveFrom, arrears: arrears.items, loanRecoveries: loans,
      tax: {
        regime: e.taxRegime, annualSalary: money(annual.salary), taxableIncome: tax.taxableIncome, annualTax: tax.total, hraExempt: tax.hraExempt,
        standardDeduction: tax.standardDeduction, chapterVIA: tax.chapterVIA, deductedSoFar: money(deductedSoFar), monthsLeft, estimatedMonths: est.months,
      },
      employee: {
        code: e.code, name: e.name, nameHi: e.nameHi, designation: e.designation, department: e.department, joinedOn: e.joinedOn, pan: e.pan,
        uan: e.uan, esiNumber: e.esiNumber, bankName: e.bankName, bankAccountLast4: e.bankAccountLast4, paymentMode: e.paymentMode,
      },
    },
  };
}

const slipValues = (r: NonNullable<Awaited<ReturnType<typeof computeFor>>>) => ({
  lopDays: r.lopDays, paidDays: r.slip.paidDays, gross: r.slip.gross, pfWages: r.slip.pfWages, pfEmployee: r.slip.pf.employee, esiEmployee: r.slip.esi.employee,
  pt: r.slip.pt, lwfEmployee: r.slip.lwf.employee, tds: r.slip.tds, otherDeductions: r.manualDeductions, extraEarnings: r.extraEarnings, loanRecoveries: r.loanRecoveries,
  totalDeductions: r.slip.totalDeductions,
  netPay: r.slip.netPay, employerContributions: r.slip.employerContributions, detail: r.detail,
});

async function refreshTotals(tx: Tx, runId: string) {
  await tx.execute(sql`
    update payroll_runs r set gross = t.gross, deductions = t.deductions, net_pay = t.net, employer_contributions = t.employer
    from (select coalesce(sum(gross), 0) gross, coalesce(sum(total_deductions), 0) deductions, coalesce(sum(net_pay), 0) net, coalesce(sum(employer_contributions), 0) employer
          from payslips where run_id = ${runId}) t
    where r.id = ${runId}`);
}

/** (Re)builds a draft run's payslips from employees, structures and attendance, keeping typed-in overrides. */
async function build(tx: Tx, run: Run) {
  const settings = await payrollSettings(tx, run.companyId);
  const emps = await employeesInPeriod(tx, run.companyId, run.period);
  const lop = await lopForEmployees(tx, emps, run.period);
  const existing = await tx.select().from(tables.payslips).where(eq(tables.payslips.runId, run.id));
  const kept = new Set<string>();
  const skipped: { code: string; reason: string }[] = [];
  for (const e of emps) {
    const prev = existing.find((p) => p.employeeId === e.id);
    const r = await computeFor(tx, settings, e, run.period, lop.get(e.id)!, {
      lopOverride: prev?.lopOverride ?? null, otherDeductions: prev?.otherDeductions ?? [], extraEarnings: prev?.extraEarnings ?? [], loanRecoveries: prev?.loanRecoveries ?? [],
    });
    if (!r) { skipped.push({ code: e.code, reason: "no_salary_structure" }); continue; }
    kept.add(e.id);
    if (prev) await tx.update(tables.payslips).set(slipValues(r)).where(eq(tables.payslips.id, prev.id));
    else await tx.insert(tables.payslips).values({ tenantId: run.tenantId, runId: run.id, employeeId: e.id, ...slipValues(r) });
  }
  const gone = existing.filter((p) => !kept.has(p.employeeId)).map((p) => p.id);
  if (gone.length) await tx.delete(tables.payslips).where(inArray(tables.payslips.id, gone));
  await refreshTotals(tx, run.id);
  return skipped;
}

async function loadRun(tx: Tx, id: string, lock = true) {
  const q = tx.select().from(tables.payrollRuns).where(eq(tables.payrollRuns.id, id));
  const [run] = lock ? await q.for("update") : await q;
  if (!run) throw notFound();
  return run;
}
const assertDraft = (run: Run) => { if (run.status !== "draft") throw conflict("run_not_draft"); };

export async function createRun(tx: Tx, actor: Actor, period: string, companyId?: string) {
  periodBounds(period);
  const company = await resolveCompany(tx, companyId);
  await ensureHr(tx, actor.tenantId, company.id);
  const [live] = await tx.select({ id: tables.payrollRuns.id }).from(tables.payrollRuns)
    .where(and(eq(tables.payrollRuns.companyId, company.id), eq(tables.payrollRuns.period, period), ne(tables.payrollRuns.status, "cancelled")));
  if (live) throw conflict("run_exists");
  // Months are run in order, so TDS always builds on final figures for the months before.
  const [openEarlier] = await tx.select({ period: tables.payrollRuns.period }).from(tables.payrollRuns)
    .where(and(eq(tables.payrollRuns.companyId, company.id), lt(tables.payrollRuns.period, period), eq(tables.payrollRuns.status, "draft"))).limit(1);
  if (openEarlier) throw conflict("earlier_run_open");
  const [run] = await tx.insert(tables.payrollRuns).values({ tenantId: actor.tenantId, companyId: company.id, period, createdBy: actor.userId }).returning();
  const skipped = await build(tx, run!);
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "payroll_run", entityId: run!.id, after: { period }, ip: actor.ip });
  return { ...(await loadRun(tx, run!.id, false)), skipped };
}

export async function refreshRun(tx: Tx, actor: Actor, id: string) {
  const run = await loadRun(tx, id);
  assertDraft(run);
  const skipped = await build(tx, run);
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "payroll_run", entityId: id, after: { refreshed: true }, ip: actor.ip });
  return { ...(await loadRun(tx, id, false)), skipped };
}

/** Change one payslip in a draft: loss-of-pay days (null goes back to attendance) and other deductions. */
export async function adjustPayslip(tx: Tx, actor: Actor, runId: string, payslipId: string, input: {
  lopDays?: string | null | undefined; otherDeductions?: { name: string; amount: string }[] | undefined;
  extraEarnings?: Extra[] | undefined; loanRecoveries?: { loanId: string; amount: string | null }[] | undefined;
}) {
  const run = await loadRun(tx, runId);
  assertDraft(run);
  const [p] = await tx.select().from(tables.payslips).where(and(eq(tables.payslips.id, payslipId), eq(tables.payslips.runId, runId)));
  if (!p) throw notFound();
  const [e] = await tx.select().from(tables.employees).where(eq(tables.employees.id, p.employeeId));
  const lopOverride = input.lopDays === undefined ? p.lopOverride : input.lopDays;
  const otherDeductions = input.otherDeductions ?? p.otherDeductions;
  const extraEarnings = input.extraEarnings ?? p.extraEarnings;
  if (extraEarnings.some((x) => x.code.startsWith("ARREARS"))) throw badRequest("reserved_code");
  // A typed amount replaces the instalment for this month; null goes back to the loan's instalment.
  let loanRecoveries = p.loanRecoveries;
  for (const l of input.loanRecoveries ?? []) {
    loanRecoveries = loanRecoveries.filter((x) => x.loanId !== l.loanId);
    if (l.amount !== null) loanRecoveries.push({ loanId: l.loanId, name: "", amount: l.amount, overridden: true });
  }
  const lop = (await lopForEmployees(tx, [e!], run.period)).get(e!.id)!;
  const r = await computeFor(tx, await payrollSettings(tx, run.companyId), e!, run.period, lop, { lopOverride, otherDeductions, extraEarnings, loanRecoveries });
  if (!r) throw badRequest("no_salary_structure");
  await tx.update(tables.payslips).set({ ...slipValues(r), lopOverride }).where(eq(tables.payslips.id, payslipId));
  await refreshTotals(tx, runId);
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "payslip", entityId: payslipId, after: { lopDays: lopOverride, otherDeductions, extraEarnings, loanRecoveries: input.loanRecoveries }, ip: actor.ip });
}

/**
 * Finalizing posts the month's salary: Dr Salaries and Employer contributions; Cr Salary payable
 * (net pay), PF, ESI, PT, LWF and TDS payable, and Salary advances for amounts recovered.
 */
export async function finalizeRun(tx: Tx, actor: Actor, id: string) {
  const run = await loadRun(tx, id);
  assertDraft(run);
  const slips = await tx.select().from(tables.payslips).where(eq(tables.payslips.runId, id));
  if (!slips.length) throw badRequest("run_empty");
  const [earlier] = await tx.select({ id: tables.payrollRuns.id }).from(tables.payrollRuns)
    .where(and(eq(tables.payrollRuns.companyId, run.companyId), lt(tables.payrollRuns.period, run.period), eq(tables.payrollRuns.status, "draft"))).limit(1);
  if (earlier) throw conflict("earlier_run_open");
  const total = (f: (d: Record<string, any>) => Dec) => slips.reduce((s, p) => s.plus(f(p.detail as Record<string, any>)), dec(0)); // eslint-disable-line @typescript-eslint/no-explicit-any
  const sums = {
    gross: total((d) => dec(d.gross)),
    employer: total((d) => dec(d.employerContributions)),
    net: total((d) => dec(d.netPay)),
    pf: total((d) => dec(d.pf.employee).plus(d.pf.eps).plus(d.pf.employerEpf).plus(d.pf.edli).plus(d.pf.admin)),
    esi: total((d) => dec(d.esi.employee).plus(d.esi.employer)),
    pt: total((d) => dec(d.pt)),
    lwf: total((d) => dec(d.lwf.employee).plus(d.lwf.employer)),
    tds: total((d) => dec(d.tds)),
    advances: total((d) => (d.otherDeductions as { amount: string }[]).reduce((s, o) => s.plus(o.amount), dec(0))),
  };
  const acc = await accountIds(tx, run.companyId);
  const lines: { accountId: string; debit?: string; credit?: string }[] = [
    { accountId: acc.salaries!, debit: money(sums.gross) },
    { accountId: acc.employer_contributions!, debit: money(sums.employer) },
    { accountId: acc.salary_payable!, credit: money(sums.net) },
    { accountId: acc.pf_payable!, credit: money(sums.pf) },
    { accountId: acc.esi_payable!, credit: money(sums.esi) },
    { accountId: acc.pt_payable!, credit: money(sums.pt) },
    { accountId: acc.lwf_payable!, credit: money(sums.lwf) },
    { accountId: acc.tds_payable!, credit: money(sums.tds) },
    { accountId: acc.salary_advances!, credit: money(sums.advances) },
  ].filter((l) => dec(l.debit ?? l.credit ?? 0).gt(0));
  const { end } = periodBounds(run.period);
  const { voucher } = await postVoucher(tx, actor, { companyId: run.companyId, type: "journal", date: end, narration: `Salary for ${periodLabel(run.period)}`, lines });
  await tx.update(tables.payrollRuns).set({ status: "finalized", voucherId: voucher.id, finalizedAt: new Date() }).where(eq(tables.payrollRuns.id, id));
  await applyLoanRecoveries(tx, slips, 1);
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "payroll_run", entityId: id, after: { status: "finalized", net: money(sums.net) }, ip: actor.ip });
  return loadRun(tx, id, false);
}

/** Net pay leaves the bank (or cash): Dr Salary payable, Cr the bank or cash account. */
export async function payRun(tx: Tx, actor: Actor, id: string, input: { accountId: string; date: string; reference?: string | undefined }) {
  const run = await loadRun(tx, id);
  if (run.status !== "finalized") throw conflict("run_not_finalized");
  const acc = await accountIds(tx, run.companyId);
  const { voucher } = await postVoucher(tx, actor, {
    companyId: run.companyId, type: "payment", date: input.date, narration: `Salary paid for ${periodLabel(run.period)}`, reference: input.reference,
    lines: [{ accountId: acc.salary_payable!, debit: run.netPay }, { accountId: input.accountId, credit: run.netPay }],
  });
  await tx.update(tables.payrollRuns).set({ status: "paid", paymentVoucherId: voucher.id, paidAt: new Date() }).where(eq(tables.payrollRuns.id, id));
  // Each person is told their pay has gone out (if the business has switched that on and they have a mobile number on file).
  const paid = await tx.select({ phone: tables.employees.phone, net: tables.payslips.netPay, slip: tables.payslips.id }).from(tables.payslips).innerJoin(tables.employees, eq(tables.employees.id, tables.payslips.employeeId)).where(eq(tables.payslips.runId, id));
  for (const p of paid) if (p.phone) await autoEmit(tx, actor, "payroll_paid", { event: "payroll_paid", phone: p.phone.replace(/\D/g, "").slice(-10), params: { shop: (await resolveCompany(tx, run.companyId)).name, period: periodLabel(run.period), amount: money(p.net) }, dedupeKey: `payslip:${p.slip}`, channels: ["sms"] });
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "payroll_run", entityId: id, after: { status: "paid" }, ip: actor.ip });
  return loadRun(tx, id, false);
}

export async function cancelRun(tx: Tx, actor: Actor, id: string, reason: string) {
  const run = await loadRun(tx, id);
  if (run.status === "paid") throw conflict("run_paid");
  if (run.status === "cancelled") throw conflict("already_cancelled");
  const [later] = await tx.select({ id: tables.payrollRuns.id }).from(tables.payrollRuns)
    .where(and(eq(tables.payrollRuns.companyId, run.companyId), gte(tables.payrollRuns.period, run.period), ne(tables.payrollRuns.id, id), inArray(tables.payrollRuns.status, ["finalized", "paid"]))).limit(1);
  if (run.status === "finalized" && later) throw conflict("later_run_final");
  if (run.voucherId) await cancelVoucher(tx, actor, run.voucherId, reason);
  if (run.status === "finalized") await applyLoanRecoveries(tx, await tx.select().from(tables.payslips).where(eq(tables.payslips.runId, id)), -1);
  await tx.update(tables.payrollRuns).set({ status: "cancelled" }).where(eq(tables.payrollRuns.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "cancel", entity: "payroll_run", entityId: id, after: { reason }, ip: actor.ip });
}

/** Finalizing adds each instalment to its loan (closing it when fully recovered); cancelling takes it back. */
async function applyLoanRecoveries(tx: Tx, slips: { loanRecoveries: LoanRecovery[] }[], sign: 1 | -1) {
  for (const s of slips) {
    for (const l of s.loanRecoveries) {
      if (!dec(l.amount).gt(0)) continue;
      const [loan] = await tx.select().from(tables.employeeLoans).where(eq(tables.employeeLoans.id, l.loanId)).for("update");
      if (!loan) continue;
      const recovered = dec(loan.recovered).plus(dec(l.amount).times(sign));
      await tx.update(tables.employeeLoans).set({ recovered: money(recovered), status: recovered.gte(loan.amount) ? "closed" : "active" }).where(eq(tables.employeeLoans.id, loan.id));
    }
  }
}

// ---- reading -------------------------------------------------------------------------------------------

export async function listRuns(tx: Tx, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const runs = await tx.select().from(tables.payrollRuns).where(eq(tables.payrollRuns.companyId, company.id)).orderBy(desc(tables.payrollRuns.period), desc(tables.payrollRuns.createdAt));
  const counts = runs.length ? await tx.select({ runId: tables.payslips.runId, n: sql<number>`count(*)::int` }).from(tables.payslips)
    .where(inArray(tables.payslips.runId, runs.map((r) => r.id))).groupBy(tables.payslips.runId) : [];
  return runs.map((r) => ({ ...r, employees: counts.find((c) => c.runId === r.id)?.n ?? 0 }));
}

export async function getRun(tx: Tx, id: string) {
  const run = await loadRun(tx, id, false);
  const slips = await tx.select({ slip: tables.payslips, code: tables.employees.code, name: tables.employees.name, nameHi: tables.employees.nameHi })
    .from(tables.payslips).innerJoin(tables.employees, eq(tables.employees.id, tables.payslips.employeeId))
    .where(eq(tables.payslips.runId, id)).orderBy(asc(tables.employees.code));
  return { ...run, payslips: slips.map((s) => ({ ...s.slip, detail: undefined, code: s.code, name: s.name, nameHi: s.nameHi })) };
}

export async function getPayslip(tx: Tx, id: string) {
  const [row] = await tx.select({ slip: tables.payslips, run: tables.payrollRuns }).from(tables.payslips)
    .innerJoin(tables.payrollRuns, eq(tables.payrollRuns.id, tables.payslips.runId)).where(eq(tables.payslips.id, id));
  if (!row) throw notFound();
  const company = await resolveCompany(tx, row.run.companyId);
  const [branch] = await tx.select().from(tables.branches).where(and(eq(tables.branches.companyId, company.id), eq(tables.branches.isHeadOffice, true)));
  return { ...row.slip, run: { id: row.run.id, period: row.run.period, status: row.run.status }, company: { name: company.name, legalName: company.legalName }, branch: branch ? { address: branch.address, stateCode: branch.stateCode } : null };
}

/** Payslips of one employee (newest first), final runs only. */
export async function employeePayslips(tx: Tx, employeeId: string) {
  return tx.select({ id: tables.payslips.id, period: tables.payrollRuns.period, gross: tables.payslips.gross, netPay: tables.payslips.netPay, tds: tables.payslips.tds, status: tables.payrollRuns.status })
    .from(tables.payslips).innerJoin(tables.payrollRuns, eq(tables.payrollRuns.id, tables.payslips.runId))
    .where(and(eq(tables.payslips.employeeId, employeeId), inArray(tables.payrollRuns.status, ["draft", "finalized", "paid"])))
    .orderBy(desc(tables.payrollRuns.period));
}

// ---- statutory and bank files ------------------------------------------------------------------------

async function finalSlips(tx: Tx, runId: string) {
  const run = await loadRun(tx, runId, false);
  if (run.status !== "finalized" && run.status !== "paid") throw conflict("run_not_finalized");
  const rows = await tx.select({ slip: tables.payslips, e: tables.employees }).from(tables.payslips)
    .innerJoin(tables.employees, eq(tables.employees.id, tables.payslips.employeeId)).where(eq(tables.payslips.runId, runId)).orderBy(asc(tables.employees.code));
  return { run, rows };
}
const whole = (v: string | number) => String(Math.round(Number(v)));
const csv = (cells: (string | number | null | undefined)[]) => cells.map((c) => {
  const s = String(c ?? "");
  return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}).join(",");

/** EPFO ECR 2.0 text file: one line per member, fields separated by #~#. */
export async function ecrFile(tx: Tx, runId: string) {
  const { run, rows } = await finalSlips(tx, runId);
  const missing: string[] = [];
  const lines: string[] = [];
  for (const { slip, e } of rows) {
    const pf = (slip.detail as { pf: Record<string, string> }).pf;
    if (!e.pfMember) continue;
    if (!e.uan) { missing.push(e.code); continue; }
    lines.push([e.uan, e.name.toUpperCase(), whole(slip.gross), whole(pf.epfWages!), whole(pf.epsWages!), whole(pf.edliWages!),
      whole(pf.employee!), whole(pf.eps!), whole(pf.employerEpf!), whole(slip.lopDays), "0"].join("#~#"));
  }
  return { filename: `ECR_${run.period}.txt`, content: lines.join("\n"), missing };
}

/** ESIC monthly contribution upload: IP number, name, days paid, wages. */
export async function esiFile(tx: Tx, runId: string) {
  const { run, rows } = await finalSlips(tx, runId);
  const missing: string[] = [];
  const out = [csv(["IP Number", "IP Name", "No. of days wages paid", "Total monthly wages", "Reason code for zero days", "Last working day"])];
  for (const { slip, e } of rows) {
    const esi = (slip.detail as { esi: { wages: string } }).esi;
    if (dec(esi.wages).isZero() && !dec(slip.esiEmployee).gt(0)) continue;
    if (!e.esiNumber) { missing.push(e.code); continue; }
    const paid = Math.floor(Number(slip.paidDays));
    const left = e.leftOn && e.leftOn.slice(0, 7) === run.period ? `${e.leftOn.slice(8, 10)}/${e.leftOn.slice(5, 7)}/${e.leftOn.slice(0, 4)}` : "";
    out.push(csv([e.esiNumber, e.name, paid, whole(esi.wages), paid === 0 ? (left ? 2 : 1) : 0, left]));
  }
  return { filename: `ESI_${run.period}.csv`, content: out.join("\n"), missing };
}

/** Bank transfer list for employees paid by bank; account numbers are decrypted only here. */
export async function bankFile(tx: Tx, runId: string) {
  const { run, rows } = await finalSlips(tx, runId);
  const missing: string[] = [];
  const out = [csv(["Employee code", "Beneficiary name", "Account number", "IFSC", "Bank", "Amount", "Narration"])];
  for (const { slip, e } of rows) {
    if (e.paymentMode !== "bank" || !dec(slip.netPay).gt(0)) continue;
    if (!e.bankAccountEnc || !e.bankIfsc) { missing.push(e.code); continue; }
    out.push(csv([e.code, e.name, decryptSecret(e.bankAccountEnc), e.bankIfsc, e.bankName, money(slip.netPay), `Salary ${periodLabel(run.period)}`]));
  }
  return { filename: `Salary_bank_${run.period}.csv`, content: out.join("\n"), missing };
}

export async function updatePayrollSettings(tx: Tx, actor: Actor, input: Partial<Omit<Settings, "companyId">>) {
  const company = await resolveCompany(tx);
  const current = await payrollSettings(tx, company.id);
  const { companyId: _c, ...cur } = current as Settings & { tenantId?: string };
  const values = { ...cur, ...input, tenantId: actor.tenantId };
  if (values.lwfMonths.some((m) => m < 1 || m > 12) || values.weeklyOffs.some((d) => d < 0 || d > 6)) throw badRequest("invalid_settings");
  const [row] = await tx.insert(tables.payrollSettings).values({ companyId: company.id, ...values })
    .onConflictDoUpdate({ target: tables.payrollSettings.companyId, set: values }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "payroll_settings", entityId: company.id, after: input, ip: actor.ip });
  return row!;
}
