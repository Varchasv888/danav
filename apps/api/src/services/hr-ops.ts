import { and, asc, desc, eq, inArray, lte } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec, money } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { cancelVoucher, postVoucher, resolveCompany } from "./accounting.js";
import { accountIds, ensureHr, periodBounds, type Actor } from "./hr.js";

// ---- loans and advances --------------------------------------------------------------------------

export interface LoanInput {
  kind: "advance" | "loan"; date: string; amount: string; instalment: string; startPeriod?: string | undefined; accountId: string; remarks?: string | undefined;
}

/** Paying out an advance or loan: Dr Salary advances, Cr the bank or cash it was paid from. */
export async function createLoan(tx: Tx, actor: Actor, employeeId: string, input: LoanInput) {
  const [e] = await tx.select().from(tables.employees).where(eq(tables.employees.id, employeeId));
  if (!e) throw notFound();
  if (e.status !== "active") throw conflict("employee_not_active");
  const amount = dec(input.amount);
  if (!amount.gt(0)) throw badRequest("invalid_amount");
  if (!dec(input.instalment).gt(0) || dec(input.instalment).gt(amount)) throw badRequest("invalid_instalment");
  const startPeriod = input.startPeriod ?? input.date.slice(0, 7);
  periodBounds(startPeriod);
  if (startPeriod < input.date.slice(0, 7)) throw badRequest("recovery_before_loan");
  await ensureHr(tx, actor.tenantId, e.companyId);
  const acc = await accountIds(tx, e.companyId);
  const { voucher } = await postVoucher(tx, actor, {
    companyId: e.companyId, type: "payment", date: input.date, narration: `${input.kind === "loan" ? "Loan" : "Salary advance"} to ${e.name} (${e.code})`,
    lines: [{ accountId: acc.salary_advances!, debit: money(amount) }, { accountId: input.accountId, credit: money(amount) }],
  });
  const [row] = await tx.insert(tables.employeeLoans).values({
    tenantId: actor.tenantId, employeeId, kind: input.kind, date: input.date, amount: money(amount), instalment: money(input.instalment), startPeriod,
    paidFromAccountId: input.accountId, voucherId: voucher.id, remarks: input.remarks ?? null, createdBy: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "employee_loan", entityId: row!.id, after: { employee: e.code, amount: row!.amount, instalment: row!.instalment }, ip: actor.ip });
  return row!;
}

/** Only a loan nothing has been recovered on can be cancelled (its payment is reversed). */
export async function cancelLoan(tx: Tx, actor: Actor, id: string, reason: string) {
  const [l] = await tx.select().from(tables.employeeLoans).where(eq(tables.employeeLoans.id, id)).for("update");
  if (!l) throw notFound();
  if (l.status === "cancelled") throw conflict("already_cancelled");
  if (dec(l.recovered).gt(0)) throw conflict("loan_partly_recovered");
  if (l.voucherId) await cancelVoucher(tx, actor, l.voucherId, reason);
  await tx.update(tables.employeeLoans).set({ status: "cancelled" }).where(eq(tables.employeeLoans.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "cancel", entity: "employee_loan", entityId: id, after: { reason }, ip: actor.ip });
}

export async function listLoans(tx: Tx, employeeId: string) {
  return tx.select().from(tables.employeeLoans).where(eq(tables.employeeLoans.employeeId, employeeId)).orderBy(desc(tables.employeeLoans.date));
}

// ---- shifts and punch import -----------------------------------------------------------------------

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const minutes = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
const DEFAULT_SHIFT = { name: "General", startTime: "09:30", endTime: "18:30", graceMinutes: 10, fullDayMinutes: 480, halfDayMinutes: 240 };

export interface ShiftInput { name: string; startTime: string; endTime: string; graceMinutes: number; fullDayMinutes: number; halfDayMinutes: number; isDefault?: boolean | undefined }

export async function listShifts(tx: Tx, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  return tx.select().from(tables.shifts).where(eq(tables.shifts.companyId, company.id)).orderBy(asc(tables.shifts.name));
}

export async function saveShift(tx: Tx, actor: Actor, input: ShiftInput, id?: string) {
  if (!TIME.test(input.startTime) || !TIME.test(input.endTime)) throw badRequest("invalid_time");
  if (input.halfDayMinutes > input.fullDayMinutes) throw badRequest("half_day_longer_than_full");
  const company = await resolveCompany(tx);
  if (input.isDefault) await tx.update(tables.shifts).set({ isDefault: false }).where(eq(tables.shifts.companyId, company.id));
  const values = { ...input, isDefault: !!input.isDefault };
  const [row] = id
    ? await tx.update(tables.shifts).set(values).where(and(eq(tables.shifts.id, id), eq(tables.shifts.companyId, company.id))).returning()
    : await tx.insert(tables.shifts).values({ tenantId: actor.tenantId, companyId: company.id, ...values }).returning();
  if (!row) throw notFound();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: id ? "update" : "create", entity: "shift", entityId: row.id, after: values, ip: actor.ip });
  return row;
}

/**
 * How a day's punches read against a shift: late after start + grace; worked minutes of at least the
 * full-day length make a present day, at least the half-day length a half day, less than that absent.
 * A night shift that ends after midnight is handled (out earlier than in means the next day).
 */
export function readPunches(shift: { startTime: string; graceMinutes: number; fullDayMinutes: number; halfDayMinutes: number }, inTime: string, outTime: string) {
  let worked = minutes(outTime) - minutes(inTime);
  if (worked < 0) worked += 24 * 60;
  const status = worked >= shift.fullDayMinutes ? "present" : worked >= shift.halfDayMinutes ? "half_day" : "absent";
  const late = minutes(inTime) > minutes(shift.startTime) + shift.graceMinutes;
  return { worked, status: status as "present" | "half_day" | "absent", late };
}

export interface PunchRow { code: string; date: string; in: string; out: string }

/** Imports a biometric export (employee code, date, first in, last out): dry run first, then for real. */
export async function importPunches(tx: Tx, actor: Actor, rows: PunchRow[], dryRun: boolean) {
  const company = await resolveCompany(tx);
  const emps = await tx.select().from(tables.employees).where(eq(tables.employees.companyId, company.id));
  const shifts = await tx.select().from(tables.shifts).where(eq(tables.shifts.companyId, company.id));
  const fallback = shifts.find((s) => s.isDefault) ?? DEFAULT_SHIFT;
  const periods = [...new Set(rows.map((r) => r.date.slice(0, 7)))];
  const final = periods.length ? await tx.select({ period: tables.payrollRuns.period }).from(tables.payrollRuns).where(and(
    eq(tables.payrollRuns.companyId, company.id), inArray(tables.payrollRuns.period, periods), inArray(tables.payrollRuns.status, ["finalized", "paid"]),
  )) : [];
  const locked = new Set(final.map((f) => f.period));
  const results: { row: number; code: string; date: string; status?: string; worked?: number; late?: boolean; error?: string }[] = [];
  let imported = 0;
  for (const [i, r] of rows.entries()) {
    const row = i + 2; // header is row 1
    const e = emps.find((x) => x.code === r.code.trim().toUpperCase());
    const fail = (error: string) => results.push({ row, code: r.code, date: r.date, error });
    if (!e) { fail("unknown_employee"); continue; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(r.date)) { fail("invalid_date"); continue; }
    if (!TIME.test(r.in) || !TIME.test(r.out)) { fail("invalid_time"); continue; }
    if (r.date < e.joinedOn || (e.leftOn && r.date > e.leftOn)) { fail("not_employed_on_date"); continue; }
    if (locked.has(r.date.slice(0, 7))) { fail("payroll_finalized"); continue; }
    const shift = shifts.find((s) => s.id === e.shiftId) ?? fallback;
    const read = readPunches(shift, r.in, r.out);
    const [existing] = await tx.select().from(tables.attendance).where(and(eq(tables.attendance.employeeId, e.id), eq(tables.attendance.date, r.date)));
    if (existing?.leaveRequestId) { fail("day_on_leave"); continue; }
    results.push({ row, code: e.code, date: r.date, status: read.status, worked: read.worked, late: read.late });
    if (dryRun) continue;
    const values = { status: read.status, inTime: r.in, outTime: r.out, workedMinutes: read.worked, late: read.late, source: "import" as const, note: null };
    if (existing) await tx.update(tables.attendance).set(values).where(eq(tables.attendance.id, existing.id));
    else await tx.insert(tables.attendance).values({ tenantId: actor.tenantId, employeeId: e.id, date: r.date, ...values });
    imported += 1;
  }
  if (!dryRun && imported) await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "import", entity: "attendance", entityId: null, after: { rows: imported }, ip: actor.ip });
  return { results, imported };
}

export interface LoanReceiptInput { date: string; amount: string; accountId: string }

/**
 * An employee pays back part of a loan or advance by cash or bank, instead of through salary. The ledger takes the
 * money into the cash or bank account and clears the same amount from salary advances; the loan's recovered figure
 * goes up and the loan closes when nothing is left.
 */
export async function receiveLoan(tx: Tx, actor: Actor, loanId: string, input: LoanReceiptInput) {
  const [l] = await tx.select().from(tables.employeeLoans).where(eq(tables.employeeLoans.id, loanId)).for("update");
  if (!l) throw notFound();
  if (l.status !== "active") throw conflict("loan_not_active");
  const amount = dec(input.amount);
  if (!amount.gt(0)) throw badRequest("invalid_amount");
  const left = dec(l.amount).minus(l.recovered);
  if (amount.gt(left)) throw badRequest("over_recovery");
  if (input.date < l.date) throw badRequest("receipt_before_loan");
  const [e] = await tx.select().from(tables.employees).where(eq(tables.employees.id, l.employeeId));
  const acc = await accountIds(tx, e!.companyId);
  const { voucher } = await postVoucher(tx, actor, {
    companyId: e!.companyId, type: "receipt", date: input.date, narration: `${l.kind === "loan" ? "Loan" : "Salary advance"} repaid by ${e!.name} (${e!.code})`,
    lines: [{ accountId: input.accountId, debit: money(amount) }, { accountId: acc.salary_advances!, credit: money(amount) }],
  });
  const [row] = await tx.insert(tables.loanReceipts).values({
    tenantId: actor.tenantId, loanId, date: input.date, amount: money(amount), accountId: input.accountId, voucherId: voucher.id, createdBy: actor.userId,
  }).returning();
  const recovered = dec(l.recovered).plus(amount);
  await tx.update(tables.employeeLoans).set({ recovered: money(recovered), status: recovered.gte(l.amount) ? "closed" : "active" }).where(eq(tables.employeeLoans.id, loanId));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "loan_receipt", entityId: row!.id, after: { employee: e!.code, amount: money(amount) }, ip: actor.ip });
  return { receipt: row!, voucher, recovered: money(recovered), left: money(left.minus(amount)) };
}

/** Takes a loan receipt back: the voucher is cancelled and the loan owes the money again. */
export async function cancelLoanReceipt(tx: Tx, actor: Actor, receiptId: string, reason: string) {
  const [r] = await tx.select().from(tables.loanReceipts).where(eq(tables.loanReceipts.id, receiptId)).for("update");
  if (!r) throw notFound();
  if (r.status === "cancelled") throw conflict("already_cancelled");
  const [l] = await tx.select().from(tables.employeeLoans).where(eq(tables.employeeLoans.id, r.loanId)).for("update");
  if (r.voucherId) await cancelVoucher(tx, actor, r.voucherId, reason);
  const recovered = dec(l!.recovered).minus(r.amount);
  await tx.update(tables.employeeLoans).set({ recovered: money(recovered), status: l!.status === "closed" ? "active" : l!.status }).where(eq(tables.employeeLoans.id, l!.id));
  await tx.update(tables.loanReceipts).set({ status: "cancelled" }).where(eq(tables.loanReceipts.id, receiptId));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "cancel", entity: "loan_receipt", entityId: receiptId, after: { reason }, ip: actor.ip });
}

export async function listLoanReceipts(tx: Tx, loanId: string) {
  return tx.select().from(tables.loanReceipts).where(eq(tables.loanReceipts.loanId, loanId)).orderBy(desc(tables.loanReceipts.date), desc(tables.loanReceipts.createdAt));
}

// ---- employee documents (KYC) ------------------------------------------------------------------------------

export interface EmployeeDocumentInput {
  kind: string; number?: string | null | undefined; issuedOn?: string | null | undefined; expiresOn?: string | null | undefined; note?: string | null | undefined;
}

/** Shows only the last four characters of a document number: enough to recognise it, not to misuse it. */
const maskNumber = (n: string | null) => (n ? (n.length > 4 ? `${"*".repeat(Math.min(n.length - 4, 8))}${n.slice(-4)}` : n) : null);
const present = (d: typeof tables.employeeDocuments.$inferSelect) => ({ ...d, number: maskNumber(d.number) });

export async function listEmployeeDocuments(tx: Tx, employeeId: string) {
  const rows = await tx.select().from(tables.employeeDocuments).where(eq(tables.employeeDocuments.employeeId, employeeId)).orderBy(asc(tables.employeeDocuments.kind), asc(tables.employeeDocuments.expiresOn));
  return rows.map(present);
}

export async function saveEmployeeDocument(tx: Tx, actor: Actor, employeeId: string, input: EmployeeDocumentInput, id?: string) {
  const [e] = await tx.select({ id: tables.employees.id }).from(tables.employees).where(eq(tables.employees.id, employeeId));
  if (!e) throw notFound();
  if (input.issuedOn && input.expiresOn && input.expiresOn < input.issuedOn) throw badRequest("expiry_before_issue");
  const values = {
    kind: input.kind,
    // A number left blank on an edit keeps the one on file.
    ...(input.number ? { number: input.number.trim() } : id ? {} : { number: null }),
    ...(input.issuedOn !== undefined ? { issuedOn: input.issuedOn || null } : {}),
    ...(input.expiresOn !== undefined ? { expiresOn: input.expiresOn || null } : {}),
    ...(input.note !== undefined ? { note: input.note || null } : {}),
  };
  const d = tables.employeeDocuments;
  const [row] = id
    ? await tx.update(d).set(values).where(and(eq(d.id, id), eq(d.employeeId, employeeId))).returning()
    : await tx.insert(d).values({ ...values, tenantId: actor.tenantId, employeeId, createdBy: actor.userId }).returning();
  if (!row) throw notFound();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: id ? "update" : "create", entity: "employee_document", entityId: row.id, after: { kind: row.kind, expiresOn: row.expiresOn }, ip: actor.ip });
  return present(row);
}

export async function deleteEmployeeDocument(tx: Tx, actor: Actor, employeeId: string, id: string) {
  const d = tables.employeeDocuments;
  const [row] = await tx.delete(d).where(and(eq(d.id, id), eq(d.employeeId, employeeId))).returning();
  if (!row) throw notFound();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "delete", entity: "employee_document", entityId: id, before: { kind: row.kind }, ip: actor.ip });
}

/** Documents of working employees that have lapsed or lapse within the days given, soonest first. */
export async function expiringDocuments(tx: Tx, today: string, withinDays: number) {
  const until = new Date(Date.parse(`${today}T00:00:00Z`) + withinDays * 86_400_000).toISOString().slice(0, 10);
  const d = tables.employeeDocuments;
  const rows = await tx.select({ doc: d, name: tables.employees.name, code: tables.employees.code, employeeId: tables.employees.id })
    .from(d).innerJoin(tables.employees, eq(tables.employees.id, d.employeeId))
    .where(and(eq(tables.employees.status, "active"), lte(d.expiresOn, until))).orderBy(asc(d.expiresOn));
  return rows.map((r) => ({ ...present(r.doc), employeeId: r.employeeId, employee: r.name, code: r.code, daysLeft: Math.round((Date.parse(`${r.doc.expiresOn}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000) }));
}

// ---- advance and loan requests --------------------------------------------------------------------

export interface LoanRequestInput { kind: "advance" | "loan"; amount: string; instalment: string; reason?: string | undefined }

/** An employee asks for an advance or loan; nothing is paid until someone approves it. */
export async function requestLoan(tx: Tx, actor: Actor, employeeId: string, input: LoanRequestInput) {
  const [e] = await tx.select().from(tables.employees).where(eq(tables.employees.id, employeeId));
  if (!e) throw notFound();
  if (e.status !== "active") throw conflict("employee_not_active");
  if (!dec(input.amount).gt(0)) throw badRequest("invalid_amount");
  if (!dec(input.instalment).gt(0) || dec(input.instalment).gt(input.amount)) throw badRequest("invalid_instalment");
  const [row] = await tx.insert(tables.loanRequests).values({
    tenantId: actor.tenantId, employeeId, kind: input.kind, amount: money(input.amount), instalment: money(input.instalment), reason: input.reason ?? null, requestedBy: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "loan_request", entityId: row!.id, after: { employee: e.code, kind: input.kind, amount: row!.amount }, ip: actor.ip });
  return row!;
}

export async function listLoanRequests(tx: Tx, q: { status?: string | undefined; employeeId?: string | undefined }) {
  return tx.select({
    request: tables.loanRequests, employeeName: tables.employees.name, employeeCode: tables.employees.code,
  }).from(tables.loanRequests).innerJoin(tables.employees, eq(tables.employees.id, tables.loanRequests.employeeId))
    .where(and(q.status ? eq(tables.loanRequests.status, q.status) : undefined, q.employeeId ? eq(tables.loanRequests.employeeId, q.employeeId) : undefined))
    .orderBy(asc(tables.loanRequests.status), desc(tables.loanRequests.createdAt)).limit(300)
    .then((rows) => rows.map((r) => ({ ...r.request, employeeName: r.employeeName, employeeCode: r.employeeCode })));
}

export interface LoanDecisionInput {
  decision: "approve" | "reject"; note?: string | undefined;
  /** To approve: when and from which account it is paid, and optionally a different amount or instalment than asked. */
  date?: string | undefined; accountId?: string | undefined; amount?: string | undefined; instalment?: string | undefined; startPeriod?: string | undefined;
}

/** Approve (paying it out as an ordinary loan) or reject a pending request. */
export async function decideLoanRequest(tx: Tx, actor: Actor, id: string, input: LoanDecisionInput) {
  const [r] = await tx.select().from(tables.loanRequests).where(eq(tables.loanRequests.id, id)).for("update");
  if (!r) throw notFound();
  if (r.status !== "pending") throw conflict("request_already_decided");
  let loanId: string | null = null;
  if (input.decision === "approve") {
    if (!input.date || !input.accountId) throw badRequest("payment_details_required");
    const loan = await createLoan(tx, actor, r.employeeId, {
      kind: r.kind as "advance" | "loan", date: input.date, amount: input.amount ?? r.amount, instalment: input.instalment ?? r.instalment,
      startPeriod: input.startPeriod, accountId: input.accountId, remarks: r.reason ?? undefined,
    });
    loanId = loan.id;
  }
  const [row] = await tx.update(tables.loanRequests).set({
    status: input.decision === "approve" ? "approved" : "rejected", decidedBy: actor.userId, decidedAt: new Date(), decisionNote: input.note ?? null, loanId,
  }).where(eq(tables.loanRequests.id, id)).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "loan_request", entityId: id, after: { decision: input.decision, loanId }, ip: actor.ip });
  return row!;
}

// ---- stipend --------------------------------------------------------------------------------------

export interface StipendInput { period: string; amount: string; date: string; accountId: string; remarks?: string | undefined }

/** Pays a trainee's stipend for a month: Dr Stipend, Cr the bank or cash. One payment per employee per month. */
export async function payStipend(tx: Tx, actor: Actor, employeeId: string, input: StipendInput) {
  const [e] = await tx.select().from(tables.employees).where(eq(tables.employees.id, employeeId));
  if (!e) throw notFound();
  if (e.status !== "active") throw conflict("employee_not_active");
  if (!dec(input.amount).gt(0)) throw badRequest("invalid_amount");
  periodBounds(input.period);
  const [dup] = await tx.select({ id: tables.stipendPayments.id }).from(tables.stipendPayments)
    .where(and(eq(tables.stipendPayments.employeeId, employeeId), eq(tables.stipendPayments.period, input.period), eq(tables.stipendPayments.status, "posted")));
  if (dup) throw conflict("stipend_already_paid");
  await ensureHr(tx, actor.tenantId, e.companyId);
  const acc = await accountIds(tx, e.companyId);
  const { voucher } = await postVoucher(tx, actor, {
    companyId: e.companyId, type: "payment", date: input.date, narration: `Stipend for ${input.period} to ${e.name} (${e.code})`,
    lines: [{ accountId: acc.stipend!, debit: money(input.amount) }, { accountId: input.accountId, credit: money(input.amount) }],
  });
  const [row] = await tx.insert(tables.stipendPayments).values({
    tenantId: actor.tenantId, employeeId, period: input.period, amount: money(input.amount), date: input.date, paidFromAccountId: input.accountId,
    voucherId: voucher.id, remarks: input.remarks ?? null, createdBy: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "stipend_payment", entityId: row!.id, after: { employee: e.code, period: input.period, amount: row!.amount }, ip: actor.ip });
  return row!;
}

export async function cancelStipend(tx: Tx, actor: Actor, id: string, reason: string) {
  const [s] = await tx.select().from(tables.stipendPayments).where(eq(tables.stipendPayments.id, id)).for("update");
  if (!s) throw notFound();
  if (s.status === "cancelled") throw conflict("already_cancelled");
  if (s.voucherId) await cancelVoucher(tx, actor, s.voucherId, reason);
  await tx.update(tables.stipendPayments).set({ status: "cancelled" }).where(eq(tables.stipendPayments.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "cancel", entity: "stipend_payment", entityId: id, after: { reason }, ip: actor.ip });
}

export async function listStipends(tx: Tx, q: { period?: string | undefined; employeeId?: string | undefined }) {
  const rows = await tx.select({ s: tables.stipendPayments, employeeName: tables.employees.name, employeeCode: tables.employees.code })
    .from(tables.stipendPayments).innerJoin(tables.employees, eq(tables.employees.id, tables.stipendPayments.employeeId))
    .where(and(q.period ? eq(tables.stipendPayments.period, q.period) : undefined, q.employeeId ? eq(tables.stipendPayments.employeeId, q.employeeId) : undefined))
    .orderBy(desc(tables.stipendPayments.period), desc(tables.stipendPayments.createdAt)).limit(300);
  return rows.map((r) => ({ ...r.s, employeeName: r.employeeName, employeeCode: r.employeeCode }));
}

// ---- performance reviews --------------------------------------------------------------------------

export interface ReviewInput { period: string; reviewedOn: string; rating: number; strengths?: string | undefined; improvements?: string | undefined }

export async function addReview(tx: Tx, actor: Actor, employeeId: string, input: ReviewInput) {
  const [e] = await tx.select({ code: tables.employees.code }).from(tables.employees).where(eq(tables.employees.id, employeeId));
  if (!e) throw notFound();
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) throw badRequest("invalid_rating");
  const [row] = await tx.insert(tables.employeeReviews).values({
    tenantId: actor.tenantId, employeeId, period: input.period, reviewedOn: input.reviewedOn, rating: input.rating,
    strengths: input.strengths ?? null, improvements: input.improvements ?? null, reviewerId: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "employee_review", entityId: row!.id, after: { employee: e.code, period: input.period, rating: input.rating }, ip: actor.ip });
  return row!;
}

/** Newest first, with the average rating across all of them. */
export async function listReviews(tx: Tx, employeeId: string) {
  const rows = await tx.select().from(tables.employeeReviews).where(eq(tables.employeeReviews.employeeId, employeeId)).orderBy(desc(tables.employeeReviews.reviewedOn), desc(tables.employeeReviews.createdAt));
  const average = rows.length ? (rows.reduce((s, r) => s + r.rating, 0) / rows.length).toFixed(1) : null;
  return { average, reviews: rows };
}

export async function deleteReview(tx: Tx, actor: Actor, employeeId: string, id: string) {
  const gone = await tx.delete(tables.employeeReviews).where(and(eq(tables.employeeReviews.id, id), eq(tables.employeeReviews.employeeId, employeeId))).returning({ id: tables.employeeReviews.id });
  if (!gone.length) throw notFound();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "delete", entity: "employee_review", entityId: id, ip: actor.ip });
}
