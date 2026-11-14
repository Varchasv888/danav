import { and, asc, desc, eq, gte, inArray, lte, ne, or, sql } from "drizzle-orm";
import { tables, type SalaryComponent, type Tx } from "@varchasv/db";
import { dec, fiscalYearOf, gratuity, isValidStateCode, leaveEncashment, money, serviceYears, businessDate } from "@varchasv/domain";
import { audit, diff } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { encryptSecret } from "../lib/secrets.js";
import { holdsEmployeeBankChange, requestEmployeeBankChange } from "./changes.js";
import { postVoucher, resolveCompany } from "./accounting.js";
import { resolvePostingAccountIds } from "./ledgerparameters.js";

export interface Actor { tenantId: string; userId: string; ip?: string | undefined }
type Company = Awaited<ReturnType<typeof resolveCompany>>;

export const PAYROLL_ACCOUNTS = [
  "salaries", "employer_contributions", "gratuity_leave", "salary_payable", "pf_payable", "esi_payable", "lwf_payable", "pt_payable", "tds_payable", "salary_advances", "stipend",
];

const DEFAULT_LEAVE_TYPES = [
  { code: "CL", name: "Casual leave", nameHi: "आकस्मिक अवकाश", annualQuota: "12", paid: true, encashable: false },
  { code: "SL", name: "Sick leave", nameHi: "बीमारी अवकाश", annualQuota: "12", paid: true, encashable: false },
  { code: "EL", name: "Earned leave", nameHi: "अर्जित अवकाश", annualQuota: "15", paid: true, encashable: true },
  { code: "LOP", name: "Leave without pay", nameHi: "अवैतनिक अवकाश", annualQuota: "0", paid: false, encashable: false },
];

/** First use of HR in a company: standard leave types and the payroll ledgers. */
export async function ensureHr(tx: Tx, tenantId: string, companyId: string) {
  const [any] = await tx.select({ id: tables.leaveTypes.id }).from(tables.leaveTypes).where(eq(tables.leaveTypes.companyId, companyId)).limit(1);
  if (!any) await tx.insert(tables.leaveTypes).values(DEFAULT_LEAVE_TYPES.map((l) => ({ tenantId, companyId, ...l }))).onConflictDoNothing();
  await resolvePostingAccountIds(tx, companyId, PAYROLL_ACCOUNTS);
}

// ---- dates -------------------------------------------------------------------------------------------

export function periodBounds(period: string) {
  const m = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(period);
  if (!m) throw badRequest("invalid_period");
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const days = new Date(Date.UTC(y, mo, 0)).getUTCDate();
  return { start: `${period}-01`, end: `${period}-${String(days).padStart(2, "0")}`, days, year: y, month: mo };
}
const addDays = (iso: string, n: number) => new Date(Date.parse(`${iso}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);
export const weekday = (iso: string) => new Date(`${iso}T00:00:00Z`).getUTCDay();
export function datesBetween(from: string, to: string) {
  const out: string[] = [];
  for (let d = from; d <= to; d = addDays(d, 1)) out.push(d);
  return out;
}

export async function payrollSettings(tx: Tx, companyId: string) {
  const [s] = await tx.select().from(tables.payrollSettings).where(eq(tables.payrollSettings.companyId, companyId));
  return s ?? {
    companyId, tan: null, pfEstablishmentCode: null, esiEmployerCode: null, labourCodeWages: true, weeklyOffs: [0],
    lwfEmployee: "0.00", lwfEmployer: "0.00", lwfMonths: [] as number[], encashmentDivisor: 30,
  };
}

async function holidaySet(tx: Tx, companyId: string, from: string, to: string) {
  const rows = await tx.select({ date: tables.holidays.date }).from(tables.holidays)
    .where(and(eq(tables.holidays.companyId, companyId), gte(tables.holidays.date, from), lte(tables.holidays.date, to)));
  return new Set(rows.map((r) => r.date));
}

type DayOffs = { weeklyOffs: number[]; changes: Map<string, string> };

/** A person's off days: their own weekdays if set, else the business's, with the one-day changes laid over. */
export async function dayOffsFor(tx: Tx, companyId: string, employeeId: string | null, from: string, to: string): Promise<DayOffs> {
  const s = await payrollSettings(tx, companyId);
  if (!employeeId) return { weeklyOffs: s.weeklyOffs, changes: new Map() };
  const [e] = await tx.select({ weeklyOffs: tables.employees.weeklyOffs }).from(tables.employees).where(eq(tables.employees.id, employeeId));
  const rows = await tx.select({ date: tables.weekOffChanges.date, kind: tables.weekOffChanges.kind }).from(tables.weekOffChanges)
    .where(and(eq(tables.weekOffChanges.employeeId, employeeId), gte(tables.weekOffChanges.date, from), lte(tables.weekOffChanges.date, to)));
  return { weeklyOffs: e?.weeklyOffs ?? s.weeklyOffs, changes: new Map(rows.map((r) => [r.date, r.kind])) };
}

/** Whether a date is a week off for someone: a one-day change beats the weekday. Holidays are separate. */
export const isWeekOff = (o: DayOffs, date: string) => {
  const c = o.changes.get(date);
  return c === "worked" ? false : c === "off" ? true : o.weeklyOffs.includes(weekday(date));
};

/** Days that count against leave: not a week off (that person's own, if they have one), not a holiday. */
export async function workingDates(tx: Tx, companyId: string, from: string, to: string, employeeId: string | null = null) {
  const offs = await dayOffsFor(tx, companyId, employeeId, from, to);
  const hol = await holidaySet(tx, companyId, from, to);
  return datesBetween(from, to).filter((d) => !isWeekOff(offs, d) && !hol.has(d));
}

/** Attendance and leave can't change in a month whose payroll is final. */
async function assertPayrollOpen(tx: Tx, companyId: string, dates: string[]) {
  const periods = [...new Set(dates.map((d) => d.slice(0, 7)))];
  if (!periods.length) return;
  const [run] = await tx.select({ id: tables.payrollRuns.id }).from(tables.payrollRuns).where(and(
    eq(tables.payrollRuns.companyId, companyId), inArray(tables.payrollRuns.period, periods), inArray(tables.payrollRuns.status, ["finalized", "paid"]),
  )).limit(1);
  if (run) throw conflict("payroll_finalized");
}

// ---- employees -----------------------------------------------------------------------------------------

const PAN = /^[A-Z]{5}\d{4}[A-Z]$/;
const IFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/;

export interface EmployeeInput {
  companyId?: string | undefined; branchId?: string | undefined; code?: string | undefined; name: string; nameHi?: string | undefined; gender: "male" | "female" | "other";
  dob?: string | undefined; joinedOn: string; fixedTerm?: boolean | undefined; department?: string | undefined; designation?: string | undefined; workState: string;
  phone?: string | undefined; email?: string | undefined; address?: { line1?: string | undefined; city?: string | undefined; pincode?: string | undefined } | undefined;
  pan?: string | undefined; aadhaarLast4?: string | undefined; uan?: string | undefined; esiNumber?: string | undefined;
  pfMember?: boolean | undefined; epsEligible?: boolean | undefined; pfOnActualWages?: boolean | undefined; disabled?: boolean | undefined;
  /** Project costing: cost of an hour of this person (else monthly gross ÷ 208). */
  costPerHour?: string | null | undefined;
  taxRegime?: "new" | "old" | undefined; metro?: boolean | undefined; paymentMode?: "bank" | "cash" | "cheque" | undefined;
  bankName?: string | undefined; bankIfsc?: string | undefined; bankAccount?: string | undefined;
  components?: SalaryComponent[] | undefined;
  /** The number on the attendance machine, when it differs from the employee code. */
  punchPin?: string | null | undefined;
  /** Own weekly off days (0 = Sunday); null follows the business setting. */
  weeklyOffs?: number[] | null | undefined;
  shiftId?: string | null | undefined;
}

function checkEmployee(i: Partial<EmployeeInput>) {
  if (i.weeklyOffs && (i.weeklyOffs.length > 3 || i.weeklyOffs.some((d) => !Number.isInteger(d) || d < 0 || d > 6))) throw badRequest("invalid_settings");
  if (i.workState !== undefined && !isValidStateCode(i.workState)) throw badRequest("invalid_state");
  if (i.pan && !PAN.test(i.pan)) throw badRequest("invalid_pan");
  if (i.bankIfsc && !IFSC.test(i.bankIfsc)) throw badRequest("invalid_ifsc");
  if (i.bankAccount && !/^\d{6,18}$/.test(i.bankAccount)) throw badRequest("invalid_bank_account");
  if (i.dob && i.joinedOn && i.dob >= i.joinedOn) throw badRequest("dob_after_joining");
}

function checkComponents(cs: SalaryComponent[]) {
  if (!cs.length) throw badRequest("no_components");
  const codes = new Set<string>();
  for (const c of cs) {
    if (codes.has(c.code)) throw badRequest("duplicate_component");
    codes.add(c.code);
    if (!dec(c.monthly).gte(0)) throw badRequest("invalid_amount");
  }
  if (!cs.some((c) => c.pfWage)) throw badRequest("basic_required");
}

const bankFields = (account?: string) => (account ? { bankAccountEnc: encryptSecret(account), bankAccountLast4: account.slice(-4) } : {});

async function nextCode(tx: Tx, companyId: string) {
  const [r] = await tx.execute<{ n: number | null }>(sql`
    select max((substring(code from '^E(\\d+)$'))::int) as n from employees where company_id = ${companyId}`);
  return `E${String((r?.n ?? 0) + 1).padStart(4, "0")}`;
}

export async function createEmployee(tx: Tx, actor: Actor, input: EmployeeInput) {
  const company = await resolveCompany(tx, input.companyId);
  await ensureHr(tx, actor.tenantId, company.id);
  checkEmployee(input);
  if (input.components) checkComponents(input.components);
  const code = input.code?.trim().toUpperCase() || (await nextCode(tx, company.id));
  const [dup] = await tx.select({ id: tables.employees.id }).from(tables.employees).where(and(eq(tables.employees.companyId, company.id), eq(tables.employees.code, code)));
  if (dup) throw conflict("employee_code_taken");
  const { components, bankAccount, companyId: _c, code: _code, ...rest } = input;
  const [e] = await tx.insert(tables.employees).values({
    ...rest, tenantId: actor.tenantId, companyId: company.id, code, ...bankFields(bankAccount),
    address: rest.address ?? null, pfMember: rest.pfMember ?? true, epsEligible: rest.epsEligible ?? true,
  }).returning();
  if (components) {
    await tx.insert(tables.salaryStructures).values({ tenantId: actor.tenantId, employeeId: e!.id, effectiveFrom: input.joinedOn, components, createdBy: actor.userId });
  }
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "employee", entityId: e!.id, after: { code, name: e!.name }, ip: actor.ip });
  return e!;
}

export async function updateEmployee(tx: Tx, actor: Actor, id: string, patch: Partial<EmployeeInput>, opts: { canApproveBank?: boolean } = {}) {
  const [e] = await tx.select().from(tables.employees).where(eq(tables.employees.id, id)).for("update");
  if (!e) throw notFound();
  checkEmployee({ ...patch, joinedOn: patch.joinedOn ?? e.joinedOn, dob: patch.dob ?? e.dob ?? undefined });
  const { components: _c, bankAccount, companyId: _co, code, ...rest0 } = patch;
  // With approval switched on, a change to where the salary goes waits for a second person (unless the editor may approve it).
  let rest = rest0;
  let heldBank: { id: string } | null = null;
  const touchesBank = rest0.bankName !== undefined || rest0.bankIfsc !== undefined || bankAccount !== undefined;
  if (touchesBank && !opts.canApproveBank && (await holdsEmployeeBankChange(tx, e, { bankName: rest0.bankName, bankIfsc: rest0.bankIfsc, bankAccount }))) {
    const { bankName, bankIfsc, ...others } = rest0;
    heldBank = await requestEmployeeBankChange(tx, actor, e, { bankName, bankIfsc, ...bankFields(bankAccount) });
    rest = others;
  }
  if (code && code !== e.code) {
    const [dup] = await tx.select({ id: tables.employees.id }).from(tables.employees).where(and(eq(tables.employees.companyId, e.companyId), eq(tables.employees.code, code.toUpperCase())));
    if (dup) throw conflict("employee_code_taken");
  }
  const values = { ...rest, ...(code ? { code: code.toUpperCase() } : {}), ...(heldBank ? {} : bankFields(bankAccount)) };
  const [row] = await tx.update(tables.employees).set(values).where(eq(tables.employees.id, id)).returning();
  const { bankAccountEnc: _b, ...visible } = values as Record<string, unknown>;
  const d = diff(e as Record<string, unknown>, visible);
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "employee", entityId: id, before: d.before, after: d.after, ip: actor.ip });
  return heldBank ? { ...row!, pendingApproval: heldBank.id } : row!;
}

export async function setSalaryStructure(tx: Tx, actor: Actor, employeeId: string, effectiveFrom: string, components: SalaryComponent[]) {
  const [e] = await tx.select().from(tables.employees).where(eq(tables.employees.id, employeeId));
  if (!e) throw notFound();
  if (effectiveFrom < e.joinedOn) throw badRequest("before_joining");
  checkComponents(components);
  const [row] = await tx.insert(tables.salaryStructures).values({ tenantId: actor.tenantId, employeeId, effectiveFrom, components, createdBy: actor.userId })
    .onConflictDoUpdate({ target: [tables.salaryStructures.employeeId, tables.salaryStructures.effectiveFrom], set: { components, createdBy: actor.userId } }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "salary_structure", entityId: employeeId, after: { effectiveFrom, components }, ip: actor.ip });
  return row!;
}

/** The structure in force on a date: the latest one taking effect on or before it. */
export async function structureOn(tx: Tx, employeeId: string, date: string) {
  const [s] = await tx.select().from(tables.salaryStructures)
    .where(and(eq(tables.salaryStructures.employeeId, employeeId), lte(tables.salaryStructures.effectiveFrom, date)))
    .orderBy(desc(tables.salaryStructures.effectiveFrom)).limit(1);
  return s;
}

export const monthlyGross = (cs: SalaryComponent[]) => money(cs.reduce((s, c) => s.plus(c.monthly), dec(0)));

export async function listEmployees(tx: Tx, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const rows = await tx.select().from(tables.employees).where(eq(tables.employees.companyId, company.id)).orderBy(asc(tables.employees.code));
  const today = businessDate();
  return Promise.all(rows.map(async ({ bankAccountEnc: _b, ...e }) => {
    const s = await structureOn(tx, e.id, today > e.joinedOn ? today : e.joinedOn);
    return { ...e, monthlyGross: s ? monthlyGross(s.components) : null };
  }));
}

export async function getEmployee(tx: Tx, id: string) {
  const [row] = await tx.select().from(tables.employees).where(eq(tables.employees.id, id));
  if (!row) throw notFound();
  const { bankAccountEnc: _b, ...e } = row;
  const structures = await tx.select().from(tables.salaryStructures).where(eq(tables.salaryStructures.employeeId, id)).orderBy(desc(tables.salaryStructures.effectiveFrom));
  const [settlement] = await tx.select().from(tables.settlements).where(and(eq(tables.settlements.employeeId, id), eq(tables.settlements.status, "posted")));
  return { ...e, structures, settlement: settlement ?? null };
}

export interface DeclarationInput {
  rentPaid?: string; c80?: string; ccd1b?: string; d80?: string; homeLoanInterest?: string; otherDeductions?: string;
  otherIncome?: string; previousEmployerSalary?: string; previousEmployerTds?: string;
}

export async function setTaxDeclaration(tx: Tx, actor: Actor, employeeId: string, fy: string, input: DeclarationInput) {
  const [e] = await tx.select({ id: tables.employees.id }).from(tables.employees).where(eq(tables.employees.id, employeeId));
  if (!e) throw notFound();
  const values = { ...input, updatedAt: new Date() };
  const [row] = await tx.insert(tables.taxDeclarations).values({ tenantId: actor.tenantId, employeeId, fy, ...values })
    .onConflictDoUpdate({ target: [tables.taxDeclarations.employeeId, tables.taxDeclarations.fy], set: values }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "tax_declaration", entityId: employeeId, after: { fy, ...input }, ip: actor.ip });
  return row!;
}

export async function taxDeclaration(tx: Tx, employeeId: string, fy: string) {
  const [d] = await tx.select().from(tables.taxDeclarations).where(and(eq(tables.taxDeclarations.employeeId, employeeId), eq(tables.taxDeclarations.fy, fy)));
  return d ?? null;
}

// ---- holidays ------------------------------------------------------------------------------------------

export async function listHolidays(tx: Tx, year: number, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  return tx.select().from(tables.holidays)
    .where(and(eq(tables.holidays.companyId, company.id), gte(tables.holidays.date, `${year}-01-01`), lte(tables.holidays.date, `${year}-12-31`)))
    .orderBy(asc(tables.holidays.date));
}

export async function addHoliday(tx: Tx, actor: Actor, date: string, name: string) {
  const company = await resolveCompany(tx);
  await assertPayrollOpen(tx, company.id, [date]);
  const [row] = await tx.insert(tables.holidays).values({ tenantId: actor.tenantId, companyId: company.id, date, name })
    .onConflictDoUpdate({ target: [tables.holidays.companyId, tables.holidays.date], set: { name } }).returning();
  return row!;
}

export async function removeHoliday(tx: Tx, id: string) {
  const [h] = await tx.select().from(tables.holidays).where(eq(tables.holidays.id, id));
  if (!h) throw notFound();
  await assertPayrollOpen(tx, h.companyId, [h.date]);
  await tx.delete(tables.holidays).where(eq(tables.holidays.id, id));
}

// ---- attendance ----------------------------------------------------------------------------------------

type Employee = typeof tables.employees.$inferSelect;
const employedOn = (e: Pick<Employee, "joinedOn" | "leftOn">, d: string) => d >= e.joinedOn && (!e.leftOn || d <= e.leftOn);

/**
 * Loss-of-pay days in a month: absences, half of each half day, unpaid leave, and the days before
 * joining or after leaving. Weekly offs and holidays inside employment are paid.
 */
export function lossOfPay(e: Pick<Employee, "joinedOn" | "leftOn">, period: string, rows: { date: string; status: string; paid: boolean; half: boolean }[]) {
  const { start, end } = periodBounds(period);
  let lop = datesBetween(start, end).filter((d) => !employedOn(e, d)).length;
  for (const r of rows) {
    if (!employedOn(e, r.date)) continue;
    if (r.status === "absent") lop += 1;
    else if (r.status === "half_day") lop += 0.5;
    else if (r.status === "leave" && !r.paid) lop += r.half ? 0.5 : 1;
  }
  return lop;
}

async function attendanceRows(tx: Tx, employeeIds: string[], from: string, to: string) {
  if (!employeeIds.length) return [];
  return tx.select({
    employeeId: tables.attendance.employeeId, date: tables.attendance.date, status: tables.attendance.status, note: tables.attendance.note,
    inTime: tables.attendance.inTime, outTime: tables.attendance.outTime, late: tables.attendance.late,
    paid: sql<boolean>`coalesce(${tables.leaveTypes.paid}, true)`, half: sql<boolean>`coalesce(${tables.leaveRequests.halfDay}, false)`, leaveCode: tables.leaveTypes.code,
  }).from(tables.attendance)
    .leftJoin(tables.leaveRequests, eq(tables.leaveRequests.id, tables.attendance.leaveRequestId))
    .leftJoin(tables.leaveTypes, eq(tables.leaveTypes.id, tables.leaveRequests.leaveTypeId))
    .where(and(inArray(tables.attendance.employeeId, employeeIds), gte(tables.attendance.date, from), lte(tables.attendance.date, to)));
}

export async function employeesInPeriod(tx: Tx, companyId: string, period: string) {
  const { start, end } = periodBounds(period);
  return tx.select().from(tables.employees).where(and(
    eq(tables.employees.companyId, companyId), lte(tables.employees.joinedOn, end),
    or(sql`${tables.employees.leftOn} is null`, gte(tables.employees.leftOn, start)),
  )).orderBy(asc(tables.employees.code));
}

export async function lopForEmployees(tx: Tx, employees: Employee[], period: string) {
  const { start, end } = periodBounds(period);
  const rows = await attendanceRows(tx, employees.map((e) => e.id), start, end);
  return new Map(employees.map((e) => [e.id, lossOfPay(e, period, rows.filter((r) => r.employeeId === e.id))]));
}

/** A month's attendance grid: who, which days are off, and each marked day. */
export async function monthAttendance(tx: Tx, period: string, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const { start, end } = periodBounds(period);
  const settings = await payrollSettings(tx, company.id);
  const hol = await tx.select().from(tables.holidays).where(and(eq(tables.holidays.companyId, company.id), gte(tables.holidays.date, start), lte(tables.holidays.date, end)));
  const emps = await employeesInPeriod(tx, company.id, period);
  const rows = await attendanceRows(tx, emps.map((e) => e.id), start, end);
  const changeRows = emps.length ? await tx.select().from(tables.weekOffChanges).where(and(inArray(tables.weekOffChanges.employeeId, emps.map((e) => e.id)), gte(tables.weekOffChanges.date, start), lte(tables.weekOffChanges.date, end))) : [];
  const [run] = await tx.select({ status: tables.payrollRuns.status }).from(tables.payrollRuns)
    .where(and(eq(tables.payrollRuns.companyId, company.id), eq(tables.payrollRuns.period, period), ne(tables.payrollRuns.status, "cancelled")));
  return {
    period, start, end, weeklyOffs: settings.weeklyOffs, holidays: hol.map((h) => ({ date: h.date, name: h.name })),
    locked: run?.status === "finalized" || run?.status === "paid",
    employees: emps.map((e) => {
      const mine = rows.filter((r) => r.employeeId === e.id);
      return {
        id: e.id, code: e.code, name: e.name, nameHi: e.nameHi, joinedOn: e.joinedOn, leftOn: e.leftOn,
        weeklyOffs: e.weeklyOffs ?? settings.weeklyOffs,
        offChanges: Object.fromEntries(changeRows.filter((c) => c.employeeId === e.id).map((c) => [c.date, c.kind])),
        days: Object.fromEntries(mine.map((r) => [r.date, { status: r.status, leave: r.leaveCode, half: r.half, in: r.inTime, out: r.outTime, late: r.late }])),
        lateDays: mine.filter((r) => r.late).length,
        lopDays: lossOfPay(e, period, mine),
      };
    }),
  };
}

export async function markAttendance(tx: Tx, actor: Actor, entries: { employeeId: string; date: string; status: "present" | "absent" | "half_day"; note?: string | undefined }[]) {
  if (!entries.length) return;
  const ids = [...new Set(entries.map((e) => e.employeeId))];
  const emps = await tx.select().from(tables.employees).where(inArray(tables.employees.id, ids));
  if (emps.length !== ids.length) throw badRequest("unknown_employee");
  const companyId = emps[0]!.companyId;
  if (emps.some((e) => e.companyId !== companyId)) throw badRequest("unknown_employee");
  await assertPayrollOpen(tx, companyId, entries.map((e) => e.date));
  for (const en of entries) {
    const e = emps.find((x) => x.id === en.employeeId)!;
    if (!employedOn(e, en.date)) throw badRequest("not_employed_on_date");
    const [existing] = await tx.select().from(tables.attendance).where(and(eq(tables.attendance.employeeId, en.employeeId), eq(tables.attendance.date, en.date)));
    if (existing?.leaveRequestId) throw conflict("day_on_leave");
    if (en.status === "present") {
      if (existing) await tx.delete(tables.attendance).where(eq(tables.attendance.id, existing.id));
    } else if (existing) {
      await tx.update(tables.attendance).set({ status: en.status, note: en.note ?? null }).where(eq(tables.attendance.id, existing.id));
    } else {
      await tx.insert(tables.attendance).values({ tenantId: actor.tenantId, employeeId: en.employeeId, date: en.date, status: en.status, note: en.note ?? null });
    }
  }
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "attendance", entityId: null, after: { entries: entries.length }, ip: actor.ip });
}

// ---- leave ---------------------------------------------------------------------------------------------

export async function listLeaveTypes(tx: Tx, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  await ensureHr(tx, company.tenantId, company.id);
  return tx.select().from(tables.leaveTypes).where(eq(tables.leaveTypes.companyId, company.id)).orderBy(asc(tables.leaveTypes.code));
}

/** Quota for the year, prorated by whole months for someone who joined during it (to the nearest half day). */
function proratedQuota(quota: string, joinedOn: string, fy: { start: string; end: string }) {
  if (joinedOn <= fy.start) return dec(quota);
  if (joinedOn > fy.end) return dec(0);
  const m = Number(joinedOn.slice(5, 7));
  const monthsLeft = m >= 4 ? 16 - m : 4 - m;
  return dec(quota).times(monthsLeft).div(12).times(2).toDecimalPlaces(0).div(2);
}

export async function leaveBalances(tx: Tx, employeeId: string, fyLabel?: string) {
  const [e] = await tx.select().from(tables.employees).where(eq(tables.employees.id, employeeId));
  if (!e) throw notFound();
  const fy = fiscalYearOf(fyLabel ? `${fyLabel.slice(0, 4)}-04-01` : businessDate());
  const types = await tx.select().from(tables.leaveTypes).where(and(eq(tables.leaveTypes.companyId, e.companyId), eq(tables.leaveTypes.archived, false))).orderBy(asc(tables.leaveTypes.code));
  const openings = await tx.select().from(tables.leaveOpenings).where(and(eq(tables.leaveOpenings.employeeId, employeeId), eq(tables.leaveOpenings.fy, fy.label)));
  const reqs = await tx.select().from(tables.leaveRequests).where(and(
    eq(tables.leaveRequests.employeeId, employeeId), gte(tables.leaveRequests.fromDate, fy.start), lte(tables.leaveRequests.fromDate, fy.end),
    inArray(tables.leaveRequests.status, ["pending", "approved"]),
  ));
  return {
    fy: fy.label,
    types: types.map((t) => {
      const opening = dec(openings.find((o) => o.leaveTypeId === t.id)?.days ?? 0);
      const quota = t.paid ? proratedQuota(t.annualQuota, e.joinedOn, fy) : dec(0);
      const taken = reqs.filter((r) => r.leaveTypeId === t.id && r.status === "approved").reduce((s, r) => s.plus(r.days), dec(0));
      const pending = reqs.filter((r) => r.leaveTypeId === t.id && r.status === "pending").reduce((s, r) => s.plus(r.days), dec(0));
      return {
        leaveTypeId: t.id, code: t.code, name: t.name, nameHi: t.nameHi, paid: t.paid, encashable: t.encashable,
        opening: opening.toString(), quota: quota.toString(), taken: taken.toString(), pending: pending.toString(),
        balance: t.paid ? opening.plus(quota).minus(taken).toString() : null,
      };
    }),
  };
}

export async function setLeaveOpening(tx: Tx, actor: Actor, employeeId: string, leaveTypeId: string, fy: string, days: string) {
  const [row] = await tx.insert(tables.leaveOpenings).values({ tenantId: actor.tenantId, employeeId, leaveTypeId, fy, days })
    .onConflictDoUpdate({ target: [tables.leaveOpenings.employeeId, tables.leaveOpenings.leaveTypeId, tables.leaveOpenings.fy], set: { days } }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "leave_opening", entityId: employeeId, after: { leaveTypeId, fy, days }, ip: actor.ip });
  return row!;
}

export interface LeaveInput { id?: string | undefined; employeeId: string; leaveTypeId: string; fromDate: string; toDate: string; halfDay?: boolean | undefined; reason?: string | undefined }

export async function requestLeave(tx: Tx, actor: Actor, input: LeaveInput) {
  if (input.id) {
    // An offline device sending the same request again gets the one already made.
    const [again] = await tx.select().from(tables.leaveRequests).where(eq(tables.leaveRequests.id, input.id));
    if (again) return again;
  }
  const [e] = await tx.select().from(tables.employees).where(eq(tables.employees.id, input.employeeId));
  if (!e) throw badRequest("unknown_employee");
  const [type] = await tx.select().from(tables.leaveTypes).where(eq(tables.leaveTypes.id, input.leaveTypeId));
  if (!type || type.companyId !== e.companyId || type.archived) throw badRequest("unknown_leave_type");
  if (input.toDate < input.fromDate) throw badRequest("to_before_from");
  if (input.halfDay && input.toDate !== input.fromDate) throw badRequest("half_day_single_date");
  if (fiscalYearOf(input.fromDate).label !== fiscalYearOf(input.toDate).label) throw badRequest("leave_crosses_year");
  if (!employedOn(e, input.fromDate) || !employedOn(e, input.toDate)) throw badRequest("not_employed_on_date");
  const dates = await workingDates(tx, e.companyId, input.fromDate, input.toDate, e.id);
  if (!dates.length) throw badRequest("no_working_days");
  const days = input.halfDay ? "0.5" : String(dates.length);
  const [overlap] = await tx.select({ id: tables.leaveRequests.id }).from(tables.leaveRequests).where(and(
    eq(tables.leaveRequests.employeeId, e.id), inArray(tables.leaveRequests.status, ["pending", "approved"]),
    lte(tables.leaveRequests.fromDate, input.toDate), gte(tables.leaveRequests.toDate, input.fromDate),
  )).limit(1);
  if (overlap) throw conflict("leave_overlap");
  if (type.paid) {
    const b = (await leaveBalances(tx, e.id, fiscalYearOf(input.fromDate).label)).types.find((t) => t.leaveTypeId === type.id)!;
    if (dec(b.balance!).minus(b.pending).lt(days)) throw badRequest("insufficient_leave_balance");
  }
  const [row] = await tx.insert(tables.leaveRequests).values({
    ...(input.id ? { id: input.id } : {}), tenantId: actor.tenantId, employeeId: e.id, leaveTypeId: type.id, fromDate: input.fromDate, toDate: input.toDate, halfDay: !!input.halfDay,
    days, reason: input.reason ?? null, createdBy: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "leave_request", entityId: row!.id, after: { employee: e.code, type: type.code, days }, ip: actor.ip });
  return row!;
}

/** Approving marks each working day as leave in attendance; rejecting just closes the request. */
export async function decideLeave(tx: Tx, actor: Actor, id: string, decision: "approved" | "rejected") {
  const [r] = await tx.select().from(tables.leaveRequests).where(eq(tables.leaveRequests.id, id)).for("update");
  if (!r) throw notFound();
  if (r.status !== "pending") throw conflict("leave_not_pending");
  const [e] = await tx.select().from(tables.employees).where(eq(tables.employees.id, r.employeeId));
  if (decision === "approved") {
    const dates = await workingDates(tx, e!.companyId, r.fromDate, r.toDate, r.employeeId);
    await assertPayrollOpen(tx, e!.companyId, dates);
    for (const d of dates) {
      await tx.insert(tables.attendance).values({ tenantId: actor.tenantId, employeeId: r.employeeId, date: d, status: "leave", leaveRequestId: r.id })
        .onConflictDoUpdate({ target: [tables.attendance.employeeId, tables.attendance.date], set: { status: "leave", leaveRequestId: r.id, note: null } });
    }
  }
  await tx.update(tables.leaveRequests).set({ status: decision, decidedBy: actor.userId, decidedAt: new Date() }).where(eq(tables.leaveRequests.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "leave_request", entityId: id, after: { status: decision }, ip: actor.ip });
}

export async function cancelLeave(tx: Tx, actor: Actor, id: string) {
  const [r] = await tx.select().from(tables.leaveRequests).where(eq(tables.leaveRequests.id, id)).for("update");
  if (!r) throw notFound();
  if (r.status !== "pending" && r.status !== "approved") throw conflict("leave_not_open");
  if (r.status === "approved") {
    const [e] = await tx.select().from(tables.employees).where(eq(tables.employees.id, r.employeeId));
    await assertPayrollOpen(tx, e!.companyId, datesBetween(r.fromDate, r.toDate));
    await tx.delete(tables.attendance).where(eq(tables.attendance.leaveRequestId, id));
  }
  await tx.update(tables.leaveRequests).set({ status: "cancelled", decidedBy: actor.userId, decidedAt: new Date() }).where(eq(tables.leaveRequests.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "cancel", entity: "leave_request", entityId: id, ip: actor.ip });
}

export async function listLeaveRequests(tx: Tx, q: { status?: string | undefined; employeeId?: string | undefined }, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  return tx.select({
    request: tables.leaveRequests, employeeName: tables.employees.name, employeeCode: tables.employees.code, typeCode: tables.leaveTypes.code, typeName: tables.leaveTypes.name, typeNameHi: tables.leaveTypes.nameHi,
  }).from(tables.leaveRequests)
    .innerJoin(tables.employees, eq(tables.employees.id, tables.leaveRequests.employeeId))
    .innerJoin(tables.leaveTypes, eq(tables.leaveTypes.id, tables.leaveRequests.leaveTypeId))
    .where(and(eq(tables.employees.companyId, company.id), q.status ? eq(tables.leaveRequests.status, q.status) : undefined, q.employeeId ? eq(tables.leaveRequests.employeeId, q.employeeId) : undefined))
    .orderBy(desc(tables.leaveRequests.fromDate)).limit(300);
}

// ---- full and final settlement ---------------------------------------------------------------------

/** Wages for gratuity and encashment: the basic + DA components (those that count for PF). */
const basicDa = (cs: SalaryComponent[]) => cs.filter((c) => c.pfWage).reduce((s, c) => s.plus(c.monthly), dec(0));

export async function settlementPreview(tx: Tx, employeeId: string, leftOn: string, leaveDays?: string) {
  const [e] = await tx.select().from(tables.employees).where(eq(tables.employees.id, employeeId));
  if (!e) throw notFound();
  if (leftOn < e.joinedOn) throw badRequest("left_before_joining");
  const s = await structureOn(tx, employeeId, leftOn);
  if (!s) throw badRequest("no_salary_structure");
  const settings = await payrollSettings(tx, e.companyId);
  const wages = basicDa(s.components);
  const g = gratuity(wages, e.joinedOn, leftOn, e.fixedTerm);
  const balances = await leaveBalances(tx, employeeId, fiscalYearOf(leftOn).label);
  const encashableBalance = balances.types.filter((t) => t.encashable).reduce((sum, t) => sum.plus(t.balance ?? 0), dec(0));
  const days = leaveDays ?? (encashableBalance.gt(0) ? encashableBalance.toString() : "0");
  return {
    employeeId, leftOn, wages: money(wages), serviceYears: serviceYears(e.joinedOn, leftOn), gratuity: g,
    leaveDays: days, leaveEncashment: leaveEncashment(days, wages, settings.encashmentDivisor === 26 ? 26 : 30),
  };
}

export async function settleEmployee(tx: Tx, actor: Actor, employeeId: string, input: { leftOn: string; leaveDays?: string | undefined; otherEarnings?: string | undefined; recoveries?: string | undefined; remarks?: string | undefined }) {
  const [e] = await tx.select().from(tables.employees).where(eq(tables.employees.id, employeeId)).for("update");
  if (!e) throw notFound();
  if (e.status === "left") throw conflict("already_left");
  const p = await settlementPreview(tx, employeeId, input.leftOn, input.leaveDays);
  const earnings = dec(p.gratuity.amount).plus(p.leaveEncashment).plus(input.otherEarnings ?? 0);
  const recoveries = dec(input.recoveries ?? 0);
  if (recoveries.gt(earnings)) throw badRequest("recoveries_exceed_dues");
  const company = await resolveCompany(tx, e.companyId);
  await ensureHr(tx, actor.tenantId, company.id);
  let voucherId: string | null = null;
  if (earnings.gt(0)) {
    const acc = await accountIds(tx, company.id);
    const lines = [{ accountId: acc.gratuity_leave!, debit: money(earnings) }, { accountId: acc.salary_payable!, credit: money(earnings.minus(recoveries)) }];
    if (recoveries.gt(0)) lines.push({ accountId: acc.salary_advances!, credit: money(recoveries) });
    const { voucher } = await postVoucher(tx, actor, { companyId: company.id, type: "journal", date: input.leftOn, narration: `Full and final settlement: ${e.name} (${e.code})`, lines });
    voucherId = voucher.id;
  }
  const [row] = await tx.insert(tables.settlements).values({
    tenantId: actor.tenantId, employeeId, leftOn: input.leftOn, serviceYears: p.serviceYears, gratuity: p.gratuity.amount, leaveDays: p.leaveDays,
    leaveEncashment: p.leaveEncashment, otherEarnings: money(input.otherEarnings ?? 0), recoveries: money(recoveries), total: money(earnings.minus(recoveries)),
    remarks: input.remarks ?? null, voucherId, createdBy: actor.userId,
  }).returning();
  await tx.update(tables.employees).set({ leftOn: input.leftOn, status: "left" }).where(eq(tables.employees.id, employeeId));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "employee", entityId: employeeId, after: { leftOn: input.leftOn, settlement: row!.total }, ip: actor.ip });
  return row!;
}

export async function accountIds(tx: Tx, companyId: string) {
  return resolvePostingAccountIds(tx, companyId, PAYROLL_ACCOUNTS);
}

export type { Company };

// ---- week-off changes ---------------------------------------------------------------------------------

export async function listWeekOffChanges(tx: Tx, period?: string) {
  const rows = await tx.select({ c: tables.weekOffChanges, code: tables.employees.code, name: tables.employees.name }).from(tables.weekOffChanges)
    .innerJoin(tables.employees, eq(tables.employees.id, tables.weekOffChanges.employeeId))
    .where(period ? sql`to_char(${tables.weekOffChanges.date}, 'YYYY-MM') = ${period}` : undefined)
    .orderBy(desc(tables.weekOffChanges.date), asc(tables.employees.code));
  return rows.map((r) => ({ id: r.c.id, employeeId: r.c.employeeId, code: r.code, name: r.name, date: r.c.date, kind: r.c.kind, note: r.c.note }));
}

/**
 * Changes one person's week off on one date. "worked" cancels an off day (they came in); "off" gives a day off on what would
 * have been a working day. Setting the same date again replaces the earlier change.
 */
export async function setWeekOffChange(tx: Tx, actor: Actor, input: { employeeId: string; date: string; kind: "worked" | "off"; note?: string | null | undefined }) {
  const [e] = await tx.select().from(tables.employees).where(eq(tables.employees.id, input.employeeId));
  if (!e) throw badRequest("unknown_employee");
  if (!employedOn(e, input.date)) throw badRequest("not_employed_on_date");
  await assertPayrollOpen(tx, e.companyId, [input.date]);
  const base = await dayOffsFor(tx, e.companyId, null, input.date, input.date);
  const usuallyOff = (e.weeklyOffs ?? base.weeklyOffs).includes(weekday(input.date));
  if (input.kind === "worked" && !usuallyOff) throw badRequest("not_a_week_off");
  if (input.kind === "off" && usuallyOff) throw badRequest("already_a_week_off");
  const [row] = await tx.insert(tables.weekOffChanges).values({ tenantId: actor.tenantId, employeeId: e.id, date: input.date, kind: input.kind, note: input.note ?? null, createdBy: actor.userId })
    .onConflictDoUpdate({ target: [tables.weekOffChanges.employeeId, tables.weekOffChanges.date], set: { kind: input.kind, note: input.note ?? null } }).returning();
  // A day given off is not a day to be marked absent.
  if (input.kind === "off") await tx.delete(tables.attendance).where(and(eq(tables.attendance.employeeId, e.id), eq(tables.attendance.date, input.date), eq(tables.attendance.status, "absent")));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "week_off_change", entityId: row!.id, after: { employee: e.code, date: input.date, kind: input.kind }, ip: actor.ip });
  return row!;
}

export async function deleteWeekOffChange(tx: Tx, actor: Actor, id: string) {
  const [row] = await tx.select().from(tables.weekOffChanges).where(eq(tables.weekOffChanges.id, id));
  if (!row) throw notFound();
  const [e] = await tx.select({ companyId: tables.employees.companyId }).from(tables.employees).where(eq(tables.employees.id, row.employeeId));
  await assertPayrollOpen(tx, e!.companyId, [row.date]);
  await tx.delete(tables.weekOffChanges).where(eq(tables.weekOffChanges.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "delete", entity: "week_off_change", entityId: id, before: { date: row.date, kind: row.kind }, ip: actor.ip });
}
