import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { EMPLOYEE_DOCUMENT_KINDS, businessDate, isValidStateCode } from "@varchasv/domain";
import { can, requireTenant } from "../plugins/auth.js";
import {
  addHoliday, cancelLeave, createEmployee, decideLeave, getEmployee, leaveBalances, listEmployees, listHolidays, listLeaveRequests, listLeaveTypes,
  deleteWeekOffChange, listWeekOffChanges, markAttendance, monthAttendance, setWeekOffChange, payrollSettings, removeHoliday, requestLeave, setLeaveOpening, setSalaryStructure, setTaxDeclaration, settleEmployee,
  settlementPreview, taxDeclaration, updateEmployee,
} from "../services/hr.js";
import {
  adjustPayslip, bankFile, cancelRun, createRun, ecrFile, employeePayslips, esiFile, finalizeRun, getPayslip, getRun, listRuns, payRun, refreshRun,
  updatePayrollSettings,
} from "../services/payroll.js";
import { resolveCompany } from "../services/accounting.js";
import { attendanceAlerts } from "../services/attendancealerts.js";
import { addReview, cancelLoan, cancelLoanReceipt, cancelStipend, createLoan, decideLoanRequest, deleteEmployeeDocument, deleteReview, expiringDocuments, listEmployeeDocuments, saveEmployeeDocument, importPunches, listLoanReceipts, listLoanRequests, listLoans, listReviews, listShifts, listStipends, payStipend, receiveLoan, requestLoan, saveShift } from "../services/hr-ops.js";
import {
  STATUTORY_KINDS, cancelStatutoryPayment, emailPayslips, form16, form24q, form24qCsv, recordStatutoryPayment, salaryRegister, statutoryDues,
} from "../services/statutory.js";
import type { Mailer } from "../lib/mailer.js";
import { parsePatch } from "../lib/patch.js";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Period = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "invalid_period");
const Fy = z.string().regex(/^\d{4}-\d{2}$/, "invalid_fy");
const Money = z.union([z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_amount"), z.number().nonnegative()]).transform(String);
const Days = z.union([z.string().regex(/^\d+(\.5|\.0)?$/, "invalid_days"), z.number().nonnegative()]).transform(String);
const IdParam = z.object({ id: z.uuid() });
const State = z.string().refine(isValidStateCode, "invalid_state");
const Opt = (max: number) => z.string().trim().max(max).optional();

const Component = z.object({
  code: z.string().trim().min(1).max(12).transform((s) => s.toUpperCase()), name: z.string().trim().min(1).max(40), monthly: Money,
  pfWage: z.boolean().optional(), esiExcluded: z.boolean().optional(), hra: z.boolean().optional(),
});
const EmployeeBody = z.object({
  companyId: z.uuid().optional(), branchId: z.uuid().optional(), code: Opt(20), name: z.string().trim().min(2).max(100), nameHi: Opt(100),
  gender: z.enum(["male", "female", "other"]), dob: IsoDate.optional(), joinedOn: IsoDate, fixedTerm: z.boolean().optional(),
  department: Opt(60), designation: Opt(60), workState: State, phone: z.string().regex(/^[6-9]\d{9}$/, "invalid_phone").optional(), email: z.email().optional(),
  address: z.object({ line1: Opt(200), city: Opt(80), pincode: z.string().regex(/^[1-9]\d{5}$/, "invalid_pincode").optional() }).optional(),
  pan: z.string().trim().toUpperCase().optional(), aadhaarLast4: z.string().regex(/^\d{4}$/, "invalid_aadhaar_last4").optional(),
  uan: z.string().regex(/^\d{12}$/, "invalid_uan").optional(), esiNumber: z.string().regex(/^\d{10,17}$/, "invalid_esi_number").optional(),
  pfMember: z.boolean().optional(), epsEligible: z.boolean().optional(), pfOnActualWages: z.boolean().optional(), disabled: z.boolean().optional(),
  taxRegime: z.enum(["new", "old"]).optional(), metro: z.boolean().optional(), paymentMode: z.enum(["bank", "cash", "cheque"]).optional(),
  bankName: Opt(80), bankIfsc: z.string().trim().toUpperCase().optional(), bankAccount: z.string().trim().optional(),
  components: z.array(Component).min(1).max(20).optional(), shiftId: z.uuid().nullable().optional(), weeklyOffs: z.array(z.number().int().min(0).max(6)).max(3).nullable().optional(), punchPin: z.string().trim().regex(/^[A-Za-z0-9]{1,24}$/, "invalid_punch_pin").nullable().optional(),
  costPerHour: z.string().regex(/^\d{1,8}(\.\d{1,2})?$/, "invalid_amount").nullable().optional(),
});

export async function hrRoutes(app: FastifyInstance, { db, mailer }: { db: Db; mailer: Mailer }) {
  const actor = (auth: { tenantId: string; user: { id: string } }, ip: string) => ({ tenantId: auth.tenantId, userId: auth.user.id, ip });
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant>[2]>[0], a: ReturnType<typeof actor>) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, actor(auth, req.ip)));
  };

  // ---- employees -------------------------------------------------------------------------------
  app.get("/employees", { preHandler: can("hr.view") }, async (req) => run(req, (tx) => listEmployees(tx)));
  app.get("/employees/:id", { preHandler: can("hr.view") }, async (req) => run(req, (tx) => getEmployee(tx, IdParam.parse(req.params).id)));
  app.post("/employees", { preHandler: can("hr.create") }, async (req, reply) => {
    const body = EmployeeBody.parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => createEmployee(tx, a, body)));
  });
  app.patch("/employees/:id", { preHandler: can("hr.edit") }, async (req) => {
    const body = parsePatch(EmployeeBody.omit({ components: true, companyId: true, joinedOn: true }).partial().extend({ joinedOn: IsoDate.optional() }), req.body);
    const canApproveBank = requireTenant(req).permissions.has("special.approveBankChange");
    return run(req, (tx, a) => updateEmployee(tx, a, IdParam.parse(req.params).id, body, { canApproveBank }));
  });
  app.post("/employees/:id/salary", { preHandler: can("payroll.edit") }, async (req) => {
    const body = z.object({ effectiveFrom: IsoDate, components: z.array(Component).min(1).max(20) }).parse(req.body);
    return run(req, (tx, a) => setSalaryStructure(tx, a, IdParam.parse(req.params).id, body.effectiveFrom, body.components));
  });
  app.get("/employees/:id/tax-declaration", { preHandler: can("payroll.view") }, async (req) => {
    const { fy } = z.object({ fy: Fy }).parse(req.query);
    return run(req, async (tx) => (await taxDeclaration(tx, IdParam.parse(req.params).id, fy)) ?? {});
  });
  app.put("/employees/:id/tax-declaration", { preHandler: can("payroll.edit") }, async (req) => {
    const body = z.object({
      fy: Fy, rentPaid: Money.optional(), c80: Money.optional(), ccd1b: Money.optional(), d80: Money.optional(), homeLoanInterest: Money.optional(),
      otherDeductions: Money.optional(), otherIncome: Money.optional(), previousEmployerSalary: Money.optional(), previousEmployerTds: Money.optional(),
    }).parse(req.body);
    const { fy, ...values } = body;
    return run(req, (tx, a) => setTaxDeclaration(tx, a, IdParam.parse(req.params).id, fy, values));
  });
  app.get("/employees/:id/payslips", { preHandler: can("payroll.view") }, async (req) => run(req, (tx) => employeePayslips(tx, IdParam.parse(req.params).id)));
  app.get("/employees/:id/leave-balances", { preHandler: can("hr.view") }, async (req) => {
    const { fy } = z.object({ fy: Fy.optional() }).parse(req.query);
    return run(req, (tx) => leaveBalances(tx, IdParam.parse(req.params).id, fy));
  });
  app.put("/employees/:id/leave-openings", { preHandler: can("hr.edit") }, async (req) => {
    const body = z.object({ leaveTypeId: z.uuid(), fy: Fy, days: Days }).parse(req.body);
    return run(req, (tx, a) => setLeaveOpening(tx, a, IdParam.parse(req.params).id, body.leaveTypeId, body.fy, body.days));
  });
  app.get("/employees/:id/settlement", { preHandler: can("payroll.view") }, async (req) => {
    const q = z.object({ leftOn: IsoDate, leaveDays: Days.optional() }).parse(req.query);
    return run(req, (tx) => settlementPreview(tx, IdParam.parse(req.params).id, q.leftOn, q.leaveDays));
  });
  app.post("/employees/:id/settle", { preHandler: can("payroll.approve") }, async (req) => {
    const body = z.object({ leftOn: IsoDate, leaveDays: Days.optional(), otherEarnings: Money.optional(), recoveries: Money.optional(), remarks: Opt(300) }).parse(req.body);
    return run(req, (tx, a) => settleEmployee(tx, a, IdParam.parse(req.params).id, body));
  });

  // ---- holidays, attendance, leave --------------------------------------------------------------
  app.get("/holidays", { preHandler: can("hr.view") }, async (req) => {
    const { year } = z.object({ year: z.coerce.number().int().min(2000).max(2100) }).parse(req.query);
    return run(req, (tx) => listHolidays(tx, year));
  });
  app.post("/holidays", { preHandler: can("hr.edit") }, async (req, reply) => {
    const body = z.object({ date: IsoDate, name: z.string().trim().min(2).max(80) }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => addHoliday(tx, a, body.date, body.name)));
  });
  app.delete("/holidays/:id", { preHandler: can("hr.edit") }, async (req) => {
    await run(req, (tx) => removeHoliday(tx, IdParam.parse(req.params).id));
    return { ok: true };
  });

  app.get("/attendance", { preHandler: can("hr.view") }, async (req) => {
    const { period } = z.object({ period: Period }).parse(req.query);
    return run(req, (tx) => monthAttendance(tx, period));
  });
  app.put("/attendance", { preHandler: can("hr.edit") }, async (req) => {
    const body = z.object({ entries: z.array(z.object({ employeeId: z.uuid(), date: IsoDate, status: z.enum(["present", "absent", "half_day"]), note: Opt(120) })).min(1).max(2000) }).parse(req.body);
    await run(req, (tx, a) => markAttendance(tx, a, body.entries));
    return { ok: true };
  });

  app.get("/hr/week-off-changes", { preHandler: can("hr.view") }, async (req) => {
    const q = z.object({ period: Period.optional() }).parse(req.query);
    return run(req, (tx) => listWeekOffChanges(tx, q.period));
  });
  app.post("/hr/week-off-changes", { preHandler: can("hr.edit") }, async (req, reply) => {
    const body = z.object({ employeeId: z.uuid(), date: IsoDate, kind: z.enum(["worked", "off"]), note: Opt(200) }).parse(req.body);
    const row = await run(req, (tx, a) => setWeekOffChange(tx, a, body));
    return reply.code(201).send(row);
  });
  app.delete("/hr/week-off-changes/:id", { preHandler: can("hr.edit") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    await run(req, (tx, a) => deleteWeekOffChange(tx, a, id));
    return { ok: true };
  });

  app.get("/leave-types", { preHandler: can("hr.view") }, async (req) => run(req, (tx) => listLeaveTypes(tx)));
  app.get("/leave-requests", { preHandler: can("hr.view") }, async (req) => {
    const q = z.object({ status: z.enum(["pending", "approved", "rejected", "cancelled"]).optional(), employeeId: z.uuid().optional() }).parse(req.query);
    return run(req, async (tx) => (await listLeaveRequests(tx, q)).map((r) => ({ ...r.request, employeeName: r.employeeName, employeeCode: r.employeeCode, typeCode: r.typeCode, typeName: r.typeName, typeNameHi: r.typeNameHi })));
  });
  app.post("/leave-requests", { preHandler: can("hr.create") }, async (req, reply) => {
    const body = z.object({ employeeId: z.uuid(), leaveTypeId: z.uuid(), fromDate: IsoDate, toDate: IsoDate, halfDay: z.boolean().optional(), reason: Opt(300) }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => requestLeave(tx, a, body)));
  });
  for (const [action, decision] of [["approve", "approved"], ["reject", "rejected"]] as const) {
    app.post(`/leave-requests/:id/${action}`, { preHandler: can("hr.approve") }, async (req) => {
      await run(req, (tx, a) => decideLeave(tx, a, IdParam.parse(req.params).id, decision));
      return { ok: true };
    });
  }
  app.post("/leave-requests/:id/cancel", { preHandler: can("hr.edit") }, async (req) => {
    await run(req, (tx, a) => cancelLeave(tx, a, IdParam.parse(req.params).id));
    return { ok: true };
  });

  // ---- payroll ----------------------------------------------------------------------------------
  app.get("/payroll/settings", { preHandler: can("payroll.view") }, async (req) => run(req, async (tx) => payrollSettings(tx, (await resolveCompany(tx)).id)));
  app.put("/payroll/settings", { preHandler: can("payroll.edit") }, async (req) => {
    const body = z.object({
      tan: z.string().trim().toUpperCase().regex(/^[A-Z]{4}\d{5}[A-Z]$/, "invalid_tan").nullable().optional(),
      pfEstablishmentCode: z.string().trim().max(22).nullable().optional(), esiEmployerCode: z.string().trim().max(17).nullable().optional(),
      labourCodeWages: z.boolean().optional(), weeklyOffs: z.array(z.number().int().min(0).max(6)).max(3).optional(),
      lwfEmployee: Money.optional(), lwfEmployer: Money.optional(), lwfMonths: z.array(z.number().int().min(1).max(12)).max(12).optional(),
      encashmentDivisor: z.union([z.literal(26), z.literal(30)]).optional(),
    }).parse(req.body);
    return run(req, (tx, a) => updatePayrollSettings(tx, a, body));
  });

  app.get("/payroll-runs", { preHandler: can("payroll.view") }, async (req) => run(req, (tx) => listRuns(tx)));
  app.get("/payroll-runs/:id", { preHandler: can("payroll.view") }, async (req) => run(req, (tx) => getRun(tx, IdParam.parse(req.params).id)));
  app.post("/payroll-runs", { preHandler: can("payroll.create") }, async (req, reply) => {
    const { period } = z.object({ period: Period }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => createRun(tx, a, period)));
  });
  app.post("/payroll-runs/:id/refresh", { preHandler: can("payroll.edit") }, async (req) => run(req, (tx, a) => refreshRun(tx, a, IdParam.parse(req.params).id)));
  app.patch("/payroll-runs/:id/payslips/:payslipId", { preHandler: can("payroll.edit") }, async (req) => {
    const { id, payslipId } = z.object({ id: z.uuid(), payslipId: z.uuid() }).parse(req.params);
    const body = z.object({
      lopDays: Days.nullable().optional(), otherDeductions: z.array(z.object({ name: z.string().trim().min(2).max(40), amount: Money })).max(10).optional(),
      extraEarnings: z.array(z.object({ code: z.string().trim().min(1).max(12).transform((c) => c.toUpperCase()), name: z.string().trim().min(2).max(40), amount: Money, esiExcluded: z.boolean().optional() })).max(10).optional(),
      loanRecoveries: z.array(z.object({ loanId: z.uuid(), amount: Money.nullable() })).max(10).optional(),
    }).parse(req.body);
    await run(req, (tx, a) => adjustPayslip(tx, a, id, payslipId, body));
    return { ok: true };
  });
  app.post("/payroll-runs/:id/finalize", { preHandler: can("payroll.approve") }, async (req) => run(req, (tx, a) => finalizeRun(tx, a, IdParam.parse(req.params).id)));
  app.post("/payroll-runs/:id/pay", { preHandler: can("payroll.submit") }, async (req) => {
    const body = z.object({ accountId: z.uuid(), date: IsoDate, reference: Opt(40) }).parse(req.body);
    return run(req, (tx, a) => payRun(tx, a, IdParam.parse(req.params).id, body));
  });
  app.post("/payroll-runs/:id/cancel", { preHandler: can("payroll.cancel") }, async (req) => {
    const { reason } = z.object({ reason: z.string().trim().min(3).max(300) }).parse(req.body);
    await run(req, (tx, a) => cancelRun(tx, a, IdParam.parse(req.params).id, reason));
    return { ok: true };
  });
  for (const [name, fn] of [["ecr", ecrFile], ["esi", esiFile], ["bank", bankFile]] as const) {
    app.get(`/payroll-runs/:id/${name}`, { preHandler: can("payroll.export") }, async (req) => run(req, (tx) => fn(tx, IdParam.parse(req.params).id)));
  }
  app.get("/payslips/:id", { preHandler: can("payroll.view") }, async (req) => run(req, (tx) => getPayslip(tx, IdParam.parse(req.params).id)));
  app.get("/payroll-runs/:id/register", { preHandler: can("payroll.export") }, async (req) => run(req, (tx) => salaryRegister(tx, IdParam.parse(req.params).id)));
  app.post("/payroll-runs/:id/email", { preHandler: can("payroll.submit") }, async (req) => run(req, (tx, a) => emailPayslips(tx, a, mailer, IdParam.parse(req.params).id)));

  // ---- loans and advances ------------------------------------------------------------------------
  app.get("/employees/:id/loans", { preHandler: can("payroll.view") }, async (req) => run(req, (tx) => listLoans(tx, IdParam.parse(req.params).id)));
  app.post("/employees/:id/loans", { preHandler: can("payroll.create") }, async (req, reply) => {
    const body = z.object({
      kind: z.enum(["advance", "loan"]), date: IsoDate, amount: Money, instalment: Money, startPeriod: Period.optional(), accountId: z.uuid(), remarks: Opt(200),
    }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => createLoan(tx, a, IdParam.parse(req.params).id, body)));
  });
  // ---- performance reviews -------------------------------------------------------------------
  app.get("/employees/:id/reviews", { preHandler: can("hr.view") }, async (req) => run(req, (tx) => listReviews(tx, IdParam.parse(req.params).id)));
  app.post("/employees/:id/reviews", { preHandler: can("hr.edit") }, async (req, reply) => {
    const body = z.object({ period: z.string().trim().min(1).max(20), reviewedOn: IsoDate, rating: z.number().int().min(1).max(5), strengths: Opt(500), improvements: Opt(500) }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => addReview(tx, a, IdParam.parse(req.params).id, body)));
  });
  app.delete("/employees/:id/reviews/:reviewId", { preHandler: can("hr.edit") }, async (req) => {
    const { id, reviewId } = z.object({ id: z.uuid(), reviewId: z.uuid() }).parse(req.params);
    await run(req, (tx, a) => deleteReview(tx, a, id, reviewId));
    return { ok: true };
  });
  // ---- attendance alerts -------------------------------------------------------------------
  app.get("/hr/attendance-alerts", { preHandler: can("hr.view") }, async (req) => {
    const q = z.object({ date: IsoDate.optional() }).parse(req.query);
    return run(req, (tx) => attendanceAlerts(tx, q.date ?? businessDate()));
  });
  // ---- stipend ---------------------------------------------------------------------------------
  app.get("/stipends", { preHandler: can("payroll.view") }, async (req) => {
    const q = z.object({ period: Period.optional(), employeeId: z.uuid().optional() }).parse(req.query);
    return run(req, (tx) => listStipends(tx, q));
  });
  app.post("/employees/:id/stipends", { preHandler: can("payroll.create") }, async (req, reply) => {
    const body = z.object({ period: Period, amount: Money, date: IsoDate, accountId: z.uuid(), remarks: Opt(200) }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => payStipend(tx, a, IdParam.parse(req.params).id, body)));
  });
  app.post("/stipends/:id/cancel", { preHandler: can("payroll.cancel") }, async (req) => {
    const { reason } = z.object({ reason: z.string().trim().min(3).max(200) }).parse(req.body);
    await run(req, (tx, a) => cancelStipend(tx, a, IdParam.parse(req.params).id, reason));
    return { ok: true };
  });
  // ---- advance and loan requests -----------------------------------------------------------------
  app.get("/loan-requests", { preHandler: can("payroll.view") }, async (req) => {
    const q = z.object({ status: z.enum(["pending", "approved", "rejected"]).optional(), employeeId: z.uuid().optional() }).parse(req.query);
    return run(req, (tx) => listLoanRequests(tx, q));
  });
  app.post("/employees/:id/loan-requests", { preHandler: can("payroll.create") }, async (req, reply) => {
    const body = z.object({ kind: z.enum(["advance", "loan"]), amount: Money, instalment: Money, reason: Opt(200) }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => requestLoan(tx, a, IdParam.parse(req.params).id, body)));
  });
  app.post("/loan-requests/:id/decide", { preHandler: can("payroll.approve") }, async (req) => {
    const body = z.object({
      decision: z.enum(["approve", "reject"]), note: Opt(200), date: IsoDate.optional(), accountId: z.uuid().optional(), amount: Money.optional(), instalment: Money.optional(), startPeriod: Period.optional(),
    }).parse(req.body);
    return run(req, (tx, a) => decideLoanRequest(tx, a, IdParam.parse(req.params).id, body));
  });
  // ---- employee documents (KYC) ------------------------------------------------------------------
  const DocBody = z.object({ kind: z.enum(EMPLOYEE_DOCUMENT_KINDS), number: z.string().trim().max(40).nullish(), issuedOn: IsoDate.nullish(), expiresOn: IsoDate.nullish(), note: z.string().trim().max(200).nullish() });
  app.get("/employees/:id/documents", { preHandler: can("hr.view") }, async (req) => run(req, (tx) => listEmployeeDocuments(tx, IdParam.parse(req.params).id)));
  app.post("/employees/:id/documents", { preHandler: can("hr.edit") }, async (req, reply) => {
    const body = DocBody.parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => saveEmployeeDocument(tx, a, IdParam.parse(req.params).id, body)));
  });
  app.patch("/employees/:id/documents/:docId", { preHandler: can("hr.edit") }, async (req) => {
    const { id, docId } = z.object({ id: z.uuid(), docId: z.uuid() }).parse(req.params);
    return run(req, (tx, a) => saveEmployeeDocument(tx, a, id, DocBody.parse(req.body), docId));
  });
  app.delete("/employees/:id/documents/:docId", { preHandler: can("hr.edit") }, async (req) => {
    const { id, docId } = z.object({ id: z.uuid(), docId: z.uuid() }).parse(req.params);
    await run(req, (tx, a) => deleteEmployeeDocument(tx, a, id, docId));
    return { ok: true };
  });
  app.get("/hr/documents/expiring", { preHandler: can("hr.view") }, async (req) => {
    const { days } = z.object({ days: z.coerce.number().int().min(0).max(730).default(60) }).parse(req.query);
    return run(req, (tx) => expiringDocuments(tx, businessDate(), days));
  });
  // Money an employee pays back by cash or bank, instead of through salary.
  app.get("/loans/:id/receipts", { preHandler: can("payroll.view") }, async (req) => run(req, (tx) => listLoanReceipts(tx, IdParam.parse(req.params).id)));
  app.post("/loans/:id/receipts", { preHandler: can("payroll.create") }, async (req, reply) => {
    const body = z.object({ date: IsoDate, amount: Money, accountId: z.uuid() }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => receiveLoan(tx, a, IdParam.parse(req.params).id, body)));
  });
  app.post("/loan-receipts/:id/cancel", { preHandler: can("payroll.cancel") }, async (req) => {
    const { reason } = z.object({ reason: z.string().trim().min(3).max(300) }).parse(req.body);
    await run(req, (tx, a) => cancelLoanReceipt(tx, a, IdParam.parse(req.params).id, reason));
    return { ok: true };
  });
  app.post("/loans/:id/cancel", { preHandler: can("payroll.cancel") }, async (req) => {
    const { reason } = z.object({ reason: z.string().trim().min(3).max(300) }).parse(req.body);
    await run(req, (tx, a) => cancelLoan(tx, a, IdParam.parse(req.params).id, reason));
    return { ok: true };
  });

  // ---- shifts and punches ------------------------------------------------------------------------
  const Time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "invalid_time");
  const ShiftBody = z.object({
    name: z.string().trim().min(2).max(40), startTime: Time, endTime: Time, graceMinutes: z.number().int().min(0).max(120),
    fullDayMinutes: z.number().int().min(60).max(960), halfDayMinutes: z.number().int().min(30).max(720), isDefault: z.boolean().optional(),
  });
  app.get("/shifts", { preHandler: can("hr.view") }, async (req) => run(req, (tx) => listShifts(tx)));
  app.post("/shifts", { preHandler: can("hr.edit") }, async (req, reply) => {
    const body = ShiftBody.parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => saveShift(tx, a, body)));
  });
  app.put("/shifts/:id", { preHandler: can("hr.edit") }, async (req) => {
    const body = ShiftBody.parse(req.body);
    return run(req, (tx, a) => saveShift(tx, a, body, IdParam.parse(req.params).id));
  });
  app.post("/attendance/import", { preHandler: can("hr.edit") }, async (req) => {
    const body = z.object({
      dryRun: z.boolean().default(true),
      rows: z.array(z.object({ code: z.string().trim().min(1).max(20), date: z.string().trim(), in: z.string().trim(), out: z.string().trim() })).min(1).max(20000),
    }).parse(req.body);
    return run(req, (tx, a) => importPunches(tx, a, body.rows, body.dryRun));
  });

  // ---- statutory dues, challans, returns ---------------------------------------------------------
  app.get("/statutory/dues", { preHandler: can("payroll.view") }, async (req) => {
    const { fy } = z.object({ fy: Fy }).parse(req.query);
    return run(req, (tx) => statutoryDues(tx, fy));
  });
  app.post("/statutory/payments", { preHandler: can("payroll.submit") }, async (req, reply) => {
    const body = z.object({
      kind: z.enum(STATUTORY_KINDS), period: Period, amount: Money, paidOn: IsoDate, accountId: z.uuid(), reference: Opt(40),
      bsrCode: z.string().regex(/^\d{7}$/, "invalid_bsr_code").optional(), challanSerial: z.string().regex(/^\d{1,5}$/, "invalid_challan_serial").optional(),
    }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => recordStatutoryPayment(tx, a, body)));
  });
  app.post("/statutory/payments/:id/cancel", { preHandler: can("payroll.cancel") }, async (req) => {
    const { reason } = z.object({ reason: z.string().trim().min(3).max(300) }).parse(req.body);
    await run(req, (tx, a) => cancelStatutoryPayment(tx, a, IdParam.parse(req.params).id, reason));
    return { ok: true };
  });
  app.get("/tds/24q", { preHandler: can("payroll.view") }, async (req) => {
    const q = z.object({ fy: Fy, quarter: z.coerce.number().int().min(1).max(4) }).parse(req.query);
    return run(req, async (tx) => {
      const r = await form24q(tx, q.fy, q.quarter as 1 | 2 | 3 | 4);
      return { ...r, files: form24qCsv(r) };
    });
  });
  app.get("/employees/:id/form16", { preHandler: can("payroll.view") }, async (req) => {
    const { fy } = z.object({ fy: Fy }).parse(req.query);
    return run(req, (tx) => form16(tx, IdParam.parse(req.params).id, fy));
  });
}
