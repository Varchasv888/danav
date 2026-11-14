import { and, asc, eq, inArray } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec, fiscalYearOf, money, salaryTax, type Dec } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import type { Mailer } from "../lib/mailer.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { cancelVoucher, postVoucher, resolveCompany } from "./accounting.js";
import { accountIds, ensureHr, payrollSettings, periodBounds, taxDeclaration, type Actor } from "./hr.js";

export const STATUTORY_KINDS = ["pf", "esi", "pt", "lwf", "tds"] as const;
export type StatutoryKind = (typeof STATUTORY_KINDS)[number];
const PAYABLE: Record<StatutoryKind, string> = { pf: "pf_payable", esi: "esi_payable", pt: "pt_payable", lwf: "lwf_payable", tds: "tds_payable" };

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthName = (period: string) => `${MONTHS[Number(period.slice(5, 7)) - 1]} ${period.slice(0, 4)}`;
/** FY label "2026-27" → its twelve periods, April to March. */
export function fyPeriods(fy: string) {
  const y = Number(fy.slice(0, 4));
  return Array.from({ length: 12 }, (_, i) => (i < 9 ? `${y}-${String(i + 4).padStart(2, "0")}` : `${y + 1}-${String(i - 8).padStart(2, "0")}`));
}
const quarterOf = (period: string) => { const m = Number(period.slice(5, 7)); return m >= 4 && m <= 6 ? 1 : m <= 9 && m >= 7 ? 2 : m >= 10 ? 3 : 4; };

type Detail = {
  gross: string; pf: Record<string, string>; esi: { employee: string; employer: string }; pt: string; lwf: { employee: string; employer: string }; tds: string;
  earnings: { code: string; name: string; earned: string; extra?: boolean }[]; basicDa: string; hra: string;
};

/**
 * Due dates: PF and ESI by the 15th of the next month; TDS by the 7th (30 April for March).
 * PT and LWF depend on the state, so none is shown.
 */
export function dueDate(kind: StatutoryKind, period: string): string | null {
  const next = new Date(Date.UTC(Number(period.slice(0, 4)), Number(period.slice(5, 7)), 1)).toISOString().slice(0, 7);
  if (kind === "pf" || kind === "esi") return `${next}-15`;
  if (kind === "tds") return period.slice(5, 7) === "03" ? `${period.slice(0, 4)}-04-30` : `${next}-07`;
  return null;
}

async function finalSlips(tx: Tx, companyId: string, periods: string[]) {
  if (!periods.length) return [];
  return tx.select({ slip: tables.payslips, run: tables.payrollRuns, e: tables.employees }).from(tables.payslips)
    .innerJoin(tables.payrollRuns, eq(tables.payrollRuns.id, tables.payslips.runId))
    .innerJoin(tables.employees, eq(tables.employees.id, tables.payslips.employeeId))
    .where(and(eq(tables.payrollRuns.companyId, companyId), inArray(tables.payrollRuns.period, periods), inArray(tables.payrollRuns.status, ["finalized", "paid"])))
    .orderBy(asc(tables.payrollRuns.period), asc(tables.employees.code));
}

const owed: Record<StatutoryKind, (d: Detail) => Dec> = {
  pf: (d) => dec(d.pf.employee!).plus(d.pf.eps!).plus(d.pf.employerEpf!).plus(d.pf.edli!).plus(d.pf.admin!),
  esi: (d) => dec(d.esi.employee).plus(d.esi.employer),
  pt: (d) => dec(d.pt),
  lwf: (d) => dec(d.lwf.employee).plus(d.lwf.employer),
  tds: (d) => dec(d.tds),
};

/** What each final payroll month owes to PF, ESI, PT, LWF and TDS, what has been paid, and by when. */
export async function statutoryDues(tx: Tx, fy: string, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const periods = fyPeriods(fy);
  const slips = await finalSlips(tx, company.id, periods);
  const payments = await tx.select().from(tables.statutoryPayments).where(and(
    eq(tables.statutoryPayments.companyId, company.id), inArray(tables.statutoryPayments.period, periods), eq(tables.statutoryPayments.status, "posted"),
  )).orderBy(asc(tables.statutoryPayments.paidOn));
  const rows = [];
  for (const period of periods) {
    const mine = slips.filter((s) => s.run.period === period);
    if (!mine.length && !payments.some((p) => p.period === period)) continue;
    for (const kind of STATUTORY_KINDS) {
      const due = mine.reduce((t, s) => t.plus(owed[kind](s.slip.detail as Detail)), dec(0));
      const paid = payments.filter((p) => p.period === period && p.kind === kind);
      const paidTotal = paid.reduce((t, p) => t.plus(p.amount), dec(0));
      if (due.isZero() && paidTotal.isZero()) continue;
      rows.push({ period, kind, due: money(due), paid: money(paidTotal), balance: money(due.minus(paidTotal)), dueDate: dueDate(kind, period), payments: paid });
    }
  }
  return { fy, rows };
}

export interface StatutoryPaymentInput {
  kind: StatutoryKind; period: string; amount: string; paidOn: string; accountId: string;
  reference?: string | undefined; bsrCode?: string | undefined; challanSerial?: string | undefined;
}

/** A challan paid: Dr the payable (PF, ESI, PT, LWF or TDS), Cr the bank it was paid from. */
export async function recordStatutoryPayment(tx: Tx, actor: Actor, input: StatutoryPaymentInput) {
  periodBounds(input.period);
  if (!dec(input.amount).gt(0)) throw badRequest("invalid_amount");
  if (input.kind === "tds" && (!input.bsrCode || !input.challanSerial)) throw badRequest("challan_details_required");
  const company = await resolveCompany(tx);
  await ensureHr(tx, actor.tenantId, company.id);
  const acc = await accountIds(tx, company.id);
  const { voucher } = await postVoucher(tx, actor, {
    companyId: company.id, type: "payment", date: input.paidOn, reference: input.reference,
    narration: `${input.kind.toUpperCase()} for ${monthName(input.period)}${input.reference ? ` (${input.reference})` : ""}`,
    lines: [{ accountId: acc[PAYABLE[input.kind]]!, debit: money(input.amount) }, { accountId: input.accountId, credit: money(input.amount) }],
  });
  const [row] = await tx.insert(tables.statutoryPayments).values({
    tenantId: actor.tenantId, companyId: company.id, kind: input.kind, period: input.period, amount: money(input.amount), paidOn: input.paidOn,
    accountId: input.accountId, reference: input.reference ?? null, bsrCode: input.bsrCode ?? null, challanSerial: input.challanSerial ?? null,
    voucherId: voucher.id, createdBy: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "statutory_payment", entityId: row!.id, after: { kind: input.kind, period: input.period, amount: row!.amount }, ip: actor.ip });
  return row!;
}

export async function cancelStatutoryPayment(tx: Tx, actor: Actor, id: string, reason: string) {
  const [p] = await tx.select().from(tables.statutoryPayments).where(eq(tables.statutoryPayments.id, id)).for("update");
  if (!p) throw notFound();
  if (p.status === "cancelled") throw conflict("already_cancelled");
  if (p.voucherId) await cancelVoucher(tx, actor, p.voucherId, reason);
  await tx.update(tables.statutoryPayments).set({ status: "cancelled" }).where(eq(tables.statutoryPayments.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "cancel", entity: "statutory_payment", entityId: id, after: { reason }, ip: actor.ip });
}

// ---- Form 16 (Part B) -------------------------------------------------------------------------------

/**
 * Form 16 Part B for a year from the final payslips: salary by component, exemptions and deductions,
 * tax on the actual salary, and TDS by quarter with the challans it was deposited under.
 * Part A must be downloaded from TRACES; the employer signs both.
 */
export async function form16(tx: Tx, employeeId: string, fy: string) {
  const [e] = await tx.select().from(tables.employees).where(eq(tables.employees.id, employeeId));
  if (!e) throw notFound();
  const company = await resolveCompany(tx, e.companyId);
  const settings = await payrollSettings(tx, company.id);
  const periods = fyPeriods(fy);
  const slips = (await finalSlips(tx, company.id, periods)).filter((s) => s.e.id === employeeId);
  if (!slips.length) throw badRequest("no_final_payslips");
  const byCode = new Map<string, { name: string; amount: Dec }>();
  let gross = dec(0); let basicDa = dec(0); let hra = dec(0); let pt = dec(0); let pf = dec(0);
  const quarters = [1, 2, 3, 4].map((q) => ({ quarter: q, salary: dec(0), tds: dec(0) }));
  for (const { slip, run } of slips) {
    const d = slip.detail as Detail;
    for (const x of d.earnings) {
      const cur = byCode.get(x.code) ?? { name: x.name, amount: dec(0) };
      byCode.set(x.code, { name: cur.name, amount: cur.amount.plus(x.earned) });
    }
    gross = gross.plus(slip.gross); basicDa = basicDa.plus(d.basicDa ?? 0); hra = hra.plus(d.hra ?? 0); pt = pt.plus(slip.pt); pf = pf.plus(slip.pfEmployee);
    const q = quarters[quarterOf(run.period) - 1]!;
    q.salary = q.salary.plus(slip.gross); q.tds = q.tds.plus(slip.tds);
  }
  const fyInfo = fiscalYearOf(`${fy.slice(0, 4)}-04-01`);
  const decl = await taxDeclaration(tx, employeeId, fy);
  const dob = e.dob;
  const age = dob ? Number(fyInfo.end.slice(0, 4)) - Number(dob.slice(0, 4)) - (fyInfo.end.slice(5) < dob.slice(5) ? 1 : 0) : 30;
  const tax = salaryTax({
    fy, regime: e.taxRegime as "new" | "old", age, annualSalary: gross, annualBasicDa: basicDa, annualHra: hra, rentPaid: decl?.rentPaid ?? "0", metro: e.metro,
    professionalTax: pt, employeePf: pf, previousEmployerSalary: decl?.previousEmployerSalary ?? "0", otherIncome: decl?.otherIncome ?? "0",
    deductions: { c80: decl?.c80 ?? "0", ccd1b: decl?.ccd1b ?? "0", d80: decl?.d80 ?? "0", homeLoanInterest: decl?.homeLoanInterest ?? "0", other: decl?.otherDeductions ?? "0" },
  });
  const challans = await tx.select().from(tables.statutoryPayments).where(and(
    eq(tables.statutoryPayments.companyId, company.id), eq(tables.statutoryPayments.kind, "tds"), inArray(tables.statutoryPayments.period, periods), eq(tables.statutoryPayments.status, "posted"),
  )).orderBy(asc(tables.statutoryPayments.paidOn));
  const tdsTotal = quarters.reduce((t, q) => t.plus(q.tds), dec(0));
  const [branch] = await tx.select().from(tables.branches).where(and(eq(tables.branches.companyId, company.id), eq(tables.branches.isHeadOffice, true)));
  return {
    fy, assessmentYear: `${Number(fy.slice(0, 4)) + 1}-${String((Number(fy.slice(0, 4)) + 2) % 100).padStart(2, "0")}`,
    employer: { name: company.legalName ?? company.name, pan: company.pan, tan: settings.tan, address: branch?.address ?? null, stateCode: branch?.stateCode ?? null },
    employee: { code: e.code, name: e.name, pan: e.pan, designation: e.designation, regime: e.taxRegime,
      from: e.joinedOn > fyInfo.start ? e.joinedOn : fyInfo.start, to: e.leftOn && e.leftOn < fyInfo.end ? e.leftOn : fyInfo.end },
    components: [...byCode.entries()].map(([code, v]) => ({ code, name: v.name, amount: money(v.amount) })),
    gross: money(gross), previousEmployerSalary: money(decl?.previousEmployerSalary ?? 0),
    ...tax,
    quarters: quarters.map((q) => ({
      quarter: q.quarter, salary: money(q.salary), tds: money(q.tds),
      challans: challans.filter((c) => quarterOf(c.period) === q.quarter).map((c) => ({ period: c.period, bsrCode: c.bsrCode, challanSerial: c.challanSerial, paidOn: c.paidOn, amount: c.amount })),
    })),
    tdsDeducted: money(tdsTotal), taxPayableOrRefund: money(dec(tax.total).minus(tdsTotal).minus(decl?.previousEmployerTds ?? 0)),
    months: slips.length,
    // Months employed this year (up to the last payslip) with no payslip here: paid before Varchasv.
    missingMonths: periods.filter((pp) => pp <= slips.at(-1)!.run.period && periodBounds(pp).end >= e.joinedOn && !slips.some((x) => x.run.period === pp)),
  };
}

// ---- Form 24Q --------------------------------------------------------------------------------------

/**
 * Quarterly TDS return on salary: challans (Annexure-less part), deductee rows (Annexure I) and, in
 * the fourth quarter, each employee's salary for the year (Annexure II). Exported for the NSDL Return
 * Preparation Utility, which produces the file uploaded to TIN-NSDL.
 */
export async function form24q(tx: Tx, fy: string, quarter: 1 | 2 | 3 | 4, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const settings = await payrollSettings(tx, company.id);
  const periods = fyPeriods(fy).slice((quarter - 1) * 3, quarter * 3);
  const slips = await finalSlips(tx, company.id, periods);
  const challans = await tx.select().from(tables.statutoryPayments).where(and(
    eq(tables.statutoryPayments.companyId, company.id), eq(tables.statutoryPayments.kind, "tds"), inArray(tables.statutoryPayments.period, periods), eq(tables.statutoryPayments.status, "posted"),
  )).orderBy(asc(tables.statutoryPayments.paidOn));
  const warnings: { code: string; detail: string }[] = [];
  if (!settings.tan) warnings.push({ code: "tan_missing", detail: "" });
  const deductees = slips.filter((s) => dec(s.slip.tds).gt(0)).map((s) => {
    const challan = challans.find((c) => c.period === s.run.period);
    if (!s.e.pan) warnings.push({ code: "pan_missing", detail: s.e.code });
    return {
      employeeCode: s.e.code, name: s.e.name, pan: s.e.pan, section: "192", period: s.run.period,
      paidOn: s.run.paidAt ? s.run.paidAt.toISOString().slice(0, 10) : periodBounds(s.run.period).end,
      amountPaid: s.slip.gross, tds: s.slip.tds, bsrCode: challan?.bsrCode ?? null, challanSerial: challan?.challanSerial ?? null, depositedOn: challan?.paidOn ?? null,
    };
  });
  for (const period of periods) {
    const deducted = deductees.filter((d) => d.period === period).reduce((t, d) => t.plus(d.tds), dec(0));
    const deposited = challans.filter((c) => c.period === period).reduce((t, c) => t.plus(c.amount), dec(0));
    if (!deducted.eq(deposited)) warnings.push({ code: "deposit_mismatch", detail: `${period}: ${money(deducted)} / ${money(deposited)}` });
  }
  let annexureII: Awaited<ReturnType<typeof form16>>[] = [];
  if (quarter === 4) {
    const ids = [...new Set((await finalSlips(tx, company.id, fyPeriods(fy))).map((s) => s.e.id))];
    annexureII = await Promise.all(ids.map((id) => form16(tx, id, fy)));
  }
  return {
    fy, quarter, tan: settings.tan, deductor: company.legalName ?? company.name, periods,
    challans: challans.map((c) => ({ period: c.period, amount: c.amount, paidOn: c.paidOn, bsrCode: c.bsrCode, challanSerial: c.challanSerial, reference: c.reference })),
    deductees, annexureII: annexureII.map((a) => ({
      employeeCode: a.employee.code, name: a.employee.name, pan: a.employee.pan, regime: a.employee.regime, from: a.employee.from, to: a.employee.to,
      gross: a.gross, hraExempt: a.hraExempt, standardDeduction: a.standardDeduction, professionalTax: a.professionalTax, chapterVIA: a.chapterVIA,
      taxableIncome: a.taxableIncome, tax: a.total, tdsDeducted: a.tdsDeducted,
    })),
    warnings,
  };
}

const csvLine = (cells: (string | number | null | undefined)[]) => cells.map((c) => {
  const v = String(c ?? "");
  return /[",\n]/.test(v) ? `"${v.replaceAll('"', '""')}"` : v;
}).join(",");

export function form24qCsv(r: Awaited<ReturnType<typeof form24q>>) {
  const annexI = [csvLine(["Employee code", "Name", "PAN", "Section", "Month", "Date of payment", "Amount paid", "TDS", "BSR code", "Challan serial", "Date of deposit"]),
    ...r.deductees.map((d) => csvLine([d.employeeCode, d.name, d.pan, d.section, d.period, d.paidOn, d.amountPaid, d.tds, d.bsrCode, d.challanSerial, d.depositedOn]))].join("\n");
  const annexII = r.annexureII.length ? [csvLine(["Employee code", "Name", "PAN", "Regime", "From", "To", "Gross salary", "HRA exempt", "Standard deduction", "Professional tax", "Chapter VI-A", "Taxable income", "Tax", "TDS"]),
    ...r.annexureII.map((a) => csvLine([a.employeeCode, a.name, a.pan, a.regime, a.from, a.to, a.gross, a.hraExempt, a.standardDeduction, a.professionalTax, a.chapterVIA, a.taxableIncome, a.tax, a.tdsDeducted]))].join("\n") : null;
  return { annexureI: { filename: `24Q_${r.fy}_Q${r.quarter}_deductees.csv`, content: annexI }, annexureII: annexII ? { filename: `24Q_${r.fy}_annexure_II.csv`, content: annexII } : null };
}

// ---- salary register and payslip emails ------------------------------------------------------------

export async function salaryRegister(tx: Tx, runId: string) {
  const [run] = await tx.select().from(tables.payrollRuns).where(eq(tables.payrollRuns.id, runId));
  if (!run) throw notFound();
  const rows = await tx.select({ slip: tables.payslips, e: tables.employees }).from(tables.payslips)
    .innerJoin(tables.employees, eq(tables.employees.id, tables.payslips.employeeId)).where(eq(tables.payslips.runId, runId)).orderBy(asc(tables.employees.code));
  const codes: { code: string; name: string }[] = [];
  for (const { slip } of rows) for (const x of (slip.detail as Detail).earnings) if (!codes.some((c) => c.code === x.code)) codes.push({ code: x.code, name: x.name });
  const header = ["Code", "Name", "Designation", "Paid days", "LOP days", ...codes.map((c) => c.name), "Gross", "PF", "ESI", "PT", "LWF", "TDS", "Other deductions", "Net pay", "Employer PF", "Employer ESI"];
  const lines = rows.map(({ slip, e }) => {
    const d = slip.detail as Detail & { otherDeductions: { amount: string }[] };
    const earned = (code: string) => d.earnings.find((x) => x.code === code)?.earned ?? "0.00";
    return csvLine([e.code, e.name, e.designation, slip.paidDays, slip.lopDays, ...codes.map((c) => earned(c.code)), slip.gross, slip.pfEmployee, slip.esiEmployee, slip.pt, slip.lwfEmployee, slip.tds,
      money(d.otherDeductions.reduce((t, o) => t.plus(o.amount), dec(0))), slip.netPay,
      money(dec(d.pf.eps!).plus(d.pf.employerEpf!).plus(d.pf.edli!).plus(d.pf.admin!)), d.esi.employer]);
  });
  return { filename: `Salary_register_${run.period}.csv`, content: [csvLine(header), ...lines].join("\n") };
}

/** Emails each employee who has an email address a summary of their payslip. */
export async function emailPayslips(tx: Tx, actor: Actor, mailer: Mailer, runId: string) {
  const [run] = await tx.select().from(tables.payrollRuns).where(eq(tables.payrollRuns.id, runId));
  if (!run) throw notFound();
  if (run.status !== "finalized" && run.status !== "paid") throw conflict("run_not_finalized");
  const company = await resolveCompany(tx, run.companyId);
  const rows = await tx.select({ slip: tables.payslips, e: tables.employees }).from(tables.payslips)
    .innerJoin(tables.employees, eq(tables.employees.id, tables.payslips.employeeId)).where(eq(tables.payslips.runId, runId)).orderBy(asc(tables.employees.code));
  const rupees = (v: string) => `₹${Number(v).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  let sent = 0;
  const skipped: string[] = [];
  for (const { slip, e } of rows) {
    if (!e.email) { skipped.push(e.code); continue; }
    const d = slip.detail as Detail & { otherDeductions: { name: string; amount: string }[] };
    const lines = [
      `Dear ${e.name},`, "", `Your payslip for ${monthName(run.period)} from ${company.legalName ?? company.name}:`, "",
      ...d.earnings.map((x) => `  ${x.name}: ${rupees(x.earned)}`), `  Gross pay: ${rupees(slip.gross)}`, "",
      ...([["Provident fund", slip.pfEmployee], ["ESI", slip.esiEmployee], ["Professional tax", slip.pt], ["Labour welfare fund", slip.lwfEmployee], ["Income tax (TDS)", slip.tds]] as const)
        .filter(([, v]) => Number(v) > 0).map(([n, v]) => `  ${n}: ${rupees(v)}`),
      ...d.otherDeductions.map((o) => `  ${o.name}: ${rupees(o.amount)}`),
      `  Total deductions: ${rupees(slip.totalDeductions)}`, "", `Net pay: ${rupees(slip.netPay)} (${Number(slip.paidDays)} paid days)`, "",
      "This is an automated message from Varchasv ERP Systems.",
    ];
    await mailer.send({ to: e.email, subject: `Payslip for ${monthName(run.period)} — ${company.name}`, text: lines.join("\n") });
    sent += 1;
  }
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "payroll_run", entityId: runId, after: { emailed: sent }, ip: actor.ip });
  return { sent, skipped };
}

