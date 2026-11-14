import { and, asc, desc, eq, gte, inArray, isNull, sql } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { tables, withTenant, type Db, type Tx } from "@varchasv/db";
import { VOUCHER_TYPES, fiscalYearOf, isValidStateCode, money, validateGstin, businessDate } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { requireStepUp } from "../lib/stepup.js";
import { badRequest, forbidden, HttpError, notFound } from "../lib/errors.js";
import { can, requireTenant, type TenantAuth } from "../plugins/auth.js";
import { DEVICE_SERIES, cancelVoucher, ensureChart, postVoucher, resolveCompany } from "../services/accounting.js";
import { markAttendance, requestLeave } from "../services/hr.js";
import { createBill, posSettings } from "../services/pos.js";
import { activeRates } from "../services/branchprices.js";
import { branchOfWarehouse, resolvedSchemes } from "../services/schemes.js";
import { createClaim, listCategories } from "../services/expenses.js";
import { createSalesOrder } from "../services/sales.js";
import { setCounted, startCount, submitCount } from "../services/stockcount.js";

const CODE_LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // no I or O, which read like 1 and 0 on printed bills
const Amount = z.union([z.string().regex(/^-?\d+(\.\d{1,2})?$/), z.number()]).transform((v) => money(v));
const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const AccountUpsert = z.object({
  id: z.uuid(),
  companyId: z.uuid(),
  groupId: z.uuid(),
  name: z.string().trim().min(1).max(120),
  nameHi: z.string().trim().max(120).nullish(),
  openingBalance: Amount.optional(),
  gstin: z.string().trim().max(15).nullish(),
  stateCode: z.string().refine(isValidStateCode).nullish(),
  phone: z.string().trim().max(15).nullish(),
  archived: z.boolean().optional(),
});
const VoucherCreate = z.object({
  id: z.uuid(),
  companyId: z.uuid(),
  type: z.enum(VOUCHER_TYPES),
  date: IsoDate,
  number: z.string().min(1).max(16),
  seq: z.number().int().positive(),
  narration: z.string().max(500).nullish(),
  reference: z.string().max(60).nullish(),
  lines: z.array(z.object({ accountId: z.uuid(), debit: Amount.optional(), credit: Amount.optional() })).min(2).max(200),
});
const VoucherCancel = z.object({ id: z.uuid(), reason: z.string().trim().min(3).max(300) });
const AttendanceMark = z.object({ employeeId: z.uuid(), date: IsoDate, status: z.enum(["present", "absent", "half_day"]) });
const Qty = z.string().regex(/^\d+(\.\d{1,4})?$/);
const ExpenseClaim = z.object({
  id: z.uuid(), employeeId: z.uuid(), date: IsoDate, title: z.string().trim().min(3).max(120), projectId: z.uuid().nullish(),
  lines: z.array(z.object({
    date: IsoDate, categoryId: z.uuid(), description: z.string().trim().max(300).nullish(), amount: Amount, gstRate: z.string().regex(/^\d+(\.\d{1,2})?$/).nullish(),
    vendorName: z.string().trim().max(100).nullish(), vendorGstin: z.string().trim().length(15).nullish(), invoiceNo: z.string().trim().max(30).nullish(),
    fileId: z.uuid().nullish(),
  })).min(1).max(50),
});
const SalesOrder = z.object({
  id: z.uuid(), customerId: z.uuid(), date: IsoDate, deliverBy: IsoDate.nullish(), customerReference: z.string().trim().max(40).nullish(), narration: z.string().max(300).nullish(),
  lines: z.array(z.object({ itemId: z.uuid(), qty: Qty, rate: Amount, discount: Amount.optional() })).min(1).max(200),
});
const LeaveRequest = z.object({
  id: z.uuid(), employeeId: z.uuid(), leaveTypeId: z.uuid(), fromDate: IsoDate, toDate: IsoDate, halfDay: z.boolean().optional(), reason: z.string().trim().max(300).nullish(),
});

const PosBill = z.object({
  id: z.uuid(), terminalId: z.uuid(), number: z.string().min(3).max(16), date: IsoDate, total: Amount,
  lines: z.array(z.object({ itemId: z.uuid(), qty: z.string().regex(/^\d+(\.\d{1,4})?$/), price: Amount, discount: Amount.optional() })).min(1).max(300),
  billDiscount: Amount.optional(), customerPhone: z.string().regex(/^[6-9]\d{9}$/).nullish(), customerName: z.string().trim().max(80).nullish(),
  payments: z.array(z.object({ mode: z.enum(["cash", "upi", "card"]), amount: Amount, reference: z.string().max(40).nullish() })).min(1).max(6),
  schemes: z.array(z.object({ schemeId: z.uuid(), name: z.string().max(60), discount: Amount })).max(20).optional(),
  billedAt: z.string().datetime().optional(),
});

/** A spot check counted on a device by scanning: the pieces counted for each item scanned, in one store. Only those items are compared; nothing is adjusted. */
const StockCount = z.object({
  id: z.uuid(), warehouseId: z.uuid(), name: z.string().trim().min(1).max(80),
  lines: z.array(z.object({ itemId: z.uuid(), counted: z.string().regex(/^\d+(\.\d{1,4})?$/) })).min(1).max(2000),
});

const Op = z.discriminatedUnion("kind", [
  z.object({ opId: z.uuid(), kind: z.literal("account.upsert"), payload: AccountUpsert }),
  z.object({ opId: z.uuid(), kind: z.literal("voucher.create"), payload: VoucherCreate }),
  z.object({ opId: z.uuid(), kind: z.literal("voucher.cancel"), payload: VoucherCancel }),
  z.object({ opId: z.uuid(), kind: z.literal("attendance.mark"), payload: AttendanceMark }),
  z.object({ opId: z.uuid(), kind: z.literal("leave.request"), payload: LeaveRequest }),
  z.object({ opId: z.uuid(), kind: z.literal("pos.bill"), payload: PosBill }),
  z.object({ opId: z.uuid(), kind: z.literal("expense.claim"), payload: ExpenseClaim }),
  z.object({ opId: z.uuid(), kind: z.literal("sales.order"), payload: SalesOrder }),
  z.object({ opId: z.uuid(), kind: z.literal("stock.count"), payload: StockCount }),
]);
type Op = z.infer<typeof Op>;

async function activeDevice(tx: Tx, deviceId: string) {
  const [d] = await tx.select().from(tables.devices).where(eq(tables.devices.id, deviceId));
  if (!d) throw notFound("unknown_device");
  if (d.revokedAt) throw forbidden("device_revoked");
  return d;
}

async function applyOp(tx: Tx, auth: TenantAuth, deviceId: string, ip: string, op: Op) {
  const actor = { tenantId: auth.tenantId, userId: auth.user.id, ip };
  const need = (p: string) => { if (!auth.permissions.has(p)) throw forbidden("missing_permission"); };
  switch (op.kind) {
    case "account.upsert": {
      const p = op.payload;
      const [existing] = await tx.select().from(tables.accounts).where(eq(tables.accounts.id, p.id));
      need(existing ? "accounts.edit" : "accounts.create");
      const [group] = await tx.select().from(tables.accountGroups).where(and(eq(tables.accountGroups.id, p.groupId), eq(tables.accountGroups.companyId, p.companyId)));
      if (!group) throw badRequest("unknown_group");
      let party = {};
      if (p.gstin) {
        const g = validateGstin(p.gstin);
        if (!g.valid) throw badRequest(`gstin_${g.error}`);
        party = { gstin: g.gstin, stateCode: g.stateCode, pan: g.pan };
      }
      const fields = {
        name: p.name, nameHi: p.nameHi ?? null, phone: p.phone ?? null, stateCode: p.stateCode ?? null,
        ...(p.openingBalance !== undefined ? { openingBalance: p.openingBalance } : {}),
        ...(p.archived !== undefined ? { archived: p.archived } : {}),
        ...party,
      };
      const nameTaken = (e: { cause?: { code?: string } }) => { if (e?.cause?.code === "23505") throw badRequest("account_name_taken"); throw e; };
      if (existing) {
        // Last write wins; built-in accounts keep their group.
        await tx.update(tables.accounts).set({ ...fields, ...(existing.system ? {} : { groupId: p.groupId }), updatedAt: new Date() }).where(eq(tables.accounts.id, p.id)).catch(nameTaken);
        await audit(tx, { tenantId: auth.tenantId, userId: auth.user.id, action: "update", entity: "account", entityId: p.id, after: { ...fields, via: "device" }, ip });
      } else {
        await tx.insert(tables.accounts).values({ id: p.id, tenantId: auth.tenantId, companyId: p.companyId, groupId: p.groupId, ...fields }).catch(nameTaken);
        await audit(tx, { tenantId: auth.tenantId, userId: auth.user.id, action: "create", entity: "account", entityId: p.id, after: { name: p.name, via: "device" }, ip });
      }
      return { id: p.id };
    }
    case "voucher.create": {
      need("accounts.create");
      const p = op.payload;
      const r = await postVoucher(tx, actor, {
        id: p.id, companyId: p.companyId, type: p.type, date: p.date, narration: p.narration ?? undefined, reference: p.reference ?? undefined,
        lines: p.lines, device: { id: deviceId, number: p.number, seq: p.seq },
      });
      return { id: r.voucher.id, number: r.voucher.number, replayed: r.replayed };
    }
    case "voucher.cancel": {
      need("accounts.cancel");
      const [v] = await tx.select({ status: tables.vouchers.status }).from(tables.vouchers).where(eq(tables.vouchers.id, op.payload.id));
      if (v?.status === "cancelled") return { id: op.payload.id, replayed: true };
      await cancelVoucher(tx, actor, op.payload.id, op.payload.reason);
      return { id: op.payload.id };
    }
    case "attendance.mark": {
      need("hr.edit");
      await markAttendance(tx, actor, [op.payload]);
      return { employeeId: op.payload.employeeId, date: op.payload.date };
    }
    case "pos.bill": {
      need("sales.create");
      const p = op.payload;
      const r = await createBill(tx, actor, {
        id: p.id, terminalId: p.terminalId, number: p.number, date: p.date, deviceId, deviceTotal: p.total, lines: p.lines, billDiscount: p.billDiscount,
        customerPhone: p.customerPhone ?? undefined, customerName: p.customerName ?? undefined,
        payments: p.payments.map((x) => ({ mode: x.mode, amount: x.amount, ...(x.reference ? { reference: x.reference } : {}) })), schemes: p.schemes, billedAt: p.billedAt,
      });
      return { id: r.bill.id, number: r.bill.number, total: r.bill.total, mismatch: r.bill.mismatch ?? null, replayed: r.replayed };
    }
    case "stock.count": {
      need("inventory.create");
      const p = op.payload;
      const [done] = await tx.select({ id: tables.stockCounts.id, number: tables.stockCounts.number, status: tables.stockCounts.status }).from(tables.stockCounts).where(eq(tables.stockCounts.id, p.id));
      if (done) return { ...done, replayed: true };
      // Only what was scanned is compared, and a spot check never adjusts the books.
      const c = await startCount(tx, actor, { id: p.id, warehouseId: p.warehouseId, name: p.name, scope: { itemIds: p.lines.map((l) => l.itemId) }, blind: true, verifyOnly: true });
      await setCounted(tx, c.id, p.lines);
      await submitCount(tx, actor, c.id);
      return { id: c.id, number: c.number, status: "submitted" };
    }
    case "expense.claim": {
      need("expenses.create");
      const p = op.payload;
      const [done] = await tx.select({ id: tables.expenseClaims.id, number: tables.expenseClaims.number, status: tables.expenseClaims.status }).from(tables.expenseClaims).where(eq(tables.expenseClaims.id, p.id));
      if (done) return { ...done, replayed: true };
      const clean = <T extends object>(o: T) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null && v !== undefined)) as { [K in keyof T]: Exclude<T[K], null> };
      const c = await createClaim(tx, actor, { ...clean(p), submit: true, lines: p.lines.map(clean) });
      return { id: c.id, number: c.number, status: c.status, total: c.total };
    }
    case "sales.order": {
      need("sales.create");
      const p = op.payload;
      const [done] = await tx.select({ id: tables.salesOrders.id, number: tables.salesOrders.number, total: tables.salesOrders.total }).from(tables.salesOrders).where(eq(tables.salesOrders.id, p.id));
      if (done) return { ...done, replayed: true };
      const o = await createSalesOrder(tx, actor, {
        id: p.id, customerId: p.customerId, date: p.date, deliverBy: p.deliverBy ?? undefined, customerReference: p.customerReference ?? undefined,
        narration: p.narration ?? "Field order (mobile)", overrideCredit: "warn", lines: p.lines.map((l) => ({ itemId: l.itemId, qty: l.qty, rate: l.rate, ...(l.discount ? { discount: l.discount } : {}) })),
      });
      return { id: o.id, number: o.number, total: o.total };
    }
    case "leave.request": {
      need("hr.create");
      const p = op.payload;
      const r = await requestLeave(tx, actor, { ...p, reason: p.reason ?? undefined });
      return { id: r.id, days: r.days };
    }
  }
}

/** Attendance the device keeps: from the first day of last month. */
const attendanceFrom = () => {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - 1, 1)).toISOString().slice(0, 10);
};

/**
 * HR data for devices whose user may see it: employees (no bank details), leave types and requests,
 * recent attendance by employee, and payslips of final payroll runs (a cancelled run is removed).
 */
async function loadHr(tx: Tx, ids: Map<string, string[]> | null, perms: Set<string>) {
  if (!perms.has("hr.view")) return {};
  const pick = (entity: string) => (ids ? ids.get(entity) ?? [] : null);
  const some = <T>(entity: string, all: () => Promise<T[]>, byIds: (xs: string[]) => Promise<T[]>) => {
    const xs = pick(entity);
    return xs === null ? all() : xs.length ? byIds(xs) : Promise.resolve([] as T[]);
  };
  const empCols = {
    id: tables.employees.id, companyId: tables.employees.companyId, code: tables.employees.code, name: tables.employees.name, nameHi: tables.employees.nameHi,
    designation: tables.employees.designation, department: tables.employees.department, joinedOn: tables.employees.joinedOn, leftOn: tables.employees.leftOn,
    status: tables.employees.status, phone: tables.employees.phone,
  };
  const employees = await some("employee", () => tx.select(empCols).from(tables.employees), (xs) => tx.select(empCols).from(tables.employees).where(inArray(tables.employees.id, xs)));
  const leaveTypes = await some("leave_type", () => tx.select().from(tables.leaveTypes), (xs) => tx.select().from(tables.leaveTypes).where(inArray(tables.leaveTypes.id, xs)));
  const leaveRequests = await some("leave_request", () => tx.select().from(tables.leaveRequests).where(gte(tables.leaveRequests.toDate, attendanceFrom())),
    (xs) => tx.select().from(tables.leaveRequests).where(inArray(tables.leaveRequests.id, xs)));
  const from = attendanceFrom();
  const attendanceFor = pick("attendance");
  const attendanceEmployees = attendanceFor ?? (await tx.select({ id: tables.employees.id }).from(tables.employees)).map((e) => e.id);
  const attendance = attendanceEmployees.length ? await tx.select({
    employeeId: tables.attendance.employeeId, date: tables.attendance.date, status: tables.attendance.status, inTime: tables.attendance.inTime,
    outTime: tables.attendance.outTime, late: tables.attendance.late, leaveCode: tables.leaveTypes.code,
  }).from(tables.attendance)
    .leftJoin(tables.leaveRequests, eq(tables.leaveRequests.id, tables.attendance.leaveRequestId))
    .leftJoin(tables.leaveTypes, eq(tables.leaveTypes.id, tables.leaveRequests.leaveTypeId))
    .where(and(inArray(tables.attendance.employeeId, attendanceEmployees), gte(tables.attendance.date, from))) : [];
  let payslips: unknown[] = [];
  let removedRuns: string[] = [];
  if (perms.has("payroll.view")) {
    const yearAgo = new Date(Date.now() - 400 * 86_400_000).toISOString().slice(0, 7);
    const runs = await some("payroll_run", () => tx.select().from(tables.payrollRuns).where(gte(tables.payrollRuns.period, yearAgo)),
      (xs) => tx.select().from(tables.payrollRuns).where(inArray(tables.payrollRuns.id, xs)));
    const final = runs.filter((r) => r.status === "finalized" || r.status === "paid");
    removedRuns = runs.filter((r) => !final.includes(r)).map((r) => r.id);
    payslips = final.length ? (await tx.select().from(tables.payslips).where(inArray(tables.payslips.runId, final.map((r) => r.id))))
      .map((p) => ({ id: p.id, runId: p.runId, period: final.find((r) => r.id === p.runId)!.period, employeeId: p.employeeId, paidDays: p.paidDays, gross: p.gross,
        totalDeductions: p.totalDeductions, netPay: p.netPay, tds: p.tds, detail: p.detail })) : [];
  }
  return { employees, leaveTypes, leaveRequests, attendance, attendanceWindow: { from, employeeIds: attendanceEmployees }, payslips, removedRuns };
}

/** Current rows for the given ids (or all rows when ids is null), in the shape the device stores. */
/**
 * What a POS device needs: sellable items, the terminal bound to it (with the last bill number it
 * used, so a reinstalled device carries on) and the POS settings.
 */
async function loadPos(tx: Tx, ids: Map<string, string[]> | null, deviceId: string, perms: Set<string>) {
  if (!perms.has("sales.view")) return {};
  const itemIds = ids ? ids.get("item") ?? [] : null;
  const itemCols = {
    tileBrand: tables.items.tileBrand, tileFinish: tables.items.tileFinish, size: tables.items.size,
    id: tables.items.id, companyId: tables.items.companyId, name: tables.items.name, nameHi: tables.items.nameHi, sku: tables.items.sku, barcode: tables.items.barcode,
    kind: tables.items.kind, hsn: tables.items.hsn, gstRate: tables.items.gstRate, gstSlab: tables.items.gstSlab, slabPieces: tables.items.slabPieces, cessRate: tables.items.cessRate, saleRate: tables.items.saleRate, mrp: tables.items.mrp,
    uom: tables.uoms.code, archived: tables.items.archived,
  };
  const items = itemIds === null ? await tx.select(itemCols).from(tables.items).innerJoin(tables.uoms, eq(tables.uoms.id, tables.items.uomId))
    : itemIds.length ? await tx.select(itemCols).from(tables.items).innerJoin(tables.uoms, eq(tables.uoms.id, tables.items.uomId)).where(inArray(tables.items.id, itemIds)) : [];
  const terminals = await tx.select().from(tables.posTerminals).where(eq(tables.posTerminals.deviceId, deviceId));
  // The store's own rates over the usual ones, as they stand now (dates and days, not hours: a device cannot know the hour).
  if (terminals.length) {
    const rates = await activeRates(tx, terminals[0]!.companyId, terminals[0]!.warehouseId, businessDate());
    if (rates.size) for (const it of items) { const r = rates.get(it.id); if (r) it.saleRate = r; }
  }
  const lastNumbers = terminals.length ? await tx.execute<{ terminal_id: string; number: string }>(sql`
    select distinct on (terminal_id) terminal_id, number from pos_bills where terminal_id in (${sql.join(terminals.map((t) => sql`${t.id}::uuid`), sql`, `)})
    order by terminal_id, number desc`) : [];
  const settings = terminals.length ? await posSettings(tx, terminals[0]!.companyId) : null;
  // Schemes go out whole on every pull (a handful of rows), already turned into item ids.
  // Offers that need the cashier's yes, or that forbid returns, are counter-only: a device cannot ask or remember either.
  const posSchemes = terminals.length ? (await resolvedSchemes(tx, terminals[0]!.companyId, await branchOfWarehouse(tx, terminals[0]!.warehouseId))).filter((x) => !x.confirmBeforeApply && x.allowReturns !== false) : null;
  // The store this device sells from, so it can count its stock.
  const [store] = terminals.length ? await tx.select({ id: tables.warehouses.id, name: tables.warehouses.name }).from(tables.warehouses).where(eq(tables.warehouses.id, terminals[0]!.warehouseId)) : [];
  return { items, posTerminals: terminals.map((t) => ({ ...t, lastNumber: lastNumbers.find((l) => l.terminal_id === t.id)?.number ?? null })), posSettings: settings, posSchemes, posStore: store ?? null };
}

/**
 * For claims made on the device: expense categories and, for users without HR access, who can claim.
 * Both are small, so they come in full with every pull.
 */
async function loadExpenses(tx: Tx, perms: Set<string>) {
  if (!perms.has("expenses.create")) return {};
  const categories = (await listCategories(tx)).map((r) => ({ id: r.c.id, name: r.c.name, nameHi: r.c.nameHi, blockedCredit: r.c.blockedCredit, archived: r.c.archived }));
  const claimants = perms.has("hr.view") ? undefined : await tx.select({
    id: tables.employees.id, companyId: tables.employees.companyId, code: tables.employees.code, name: tables.employees.name, nameHi: tables.employees.nameHi,
    designation: tables.employees.designation, department: tables.employees.department, joinedOn: tables.employees.joinedOn, leftOn: tables.employees.leftOn,
    status: tables.employees.status, phone: tables.employees.phone,
  }).from(tables.employees);
  return { expenseCategories: categories, ...(claimants ? { employees: claimants } : {}) };
}

async function loadEntities(tx: Tx, ids: Map<string, string[]> | null, deviceId: string, perms: Set<string>) {
  const pick = (entity: string) => (ids ? ids.get(entity) ?? [] : null);
  const q = async <T>(entity: string, all: () => Promise<T[]>, some: (xs: string[]) => Promise<T[]>) => {
    const xs = pick(entity);
    if (xs === null) return all();
    return xs.length ? some(xs) : [];
  };
  const companies = await q("company", () => tx.select().from(tables.companies), (xs) => tx.select().from(tables.companies).where(inArray(tables.companies.id, xs)));
  const branches = await q("branch", () => tx.select().from(tables.branches), (xs) => tx.select().from(tables.branches).where(inArray(tables.branches.id, xs)));
  const fiscalYears = await q("fiscal_year", () => tx.select().from(tables.fiscalYears), (xs) => tx.select().from(tables.fiscalYears).where(inArray(tables.fiscalYears.id, xs)));
  const accountGroups = await q("account_group", () => tx.select().from(tables.accountGroups), (xs) => tx.select().from(tables.accountGroups).where(inArray(tables.accountGroups.id, xs)));
  const accounts = await q("account", () => tx.select().from(tables.accounts), (xs) => tx.select().from(tables.accounts).where(inArray(tables.accounts.id, xs)));
  const vouchers = await q("voucher", () => tx.select().from(tables.vouchers), (xs) => tx.select().from(tables.vouchers).where(inArray(tables.vouchers.id, xs)));
  const lines = vouchers.length
    ? await tx.select().from(tables.voucherLines).where(inArray(tables.voucherLines.voucherId, vouchers.map((v) => v.id))).orderBy(asc(tables.voucherLines.lineNo))
    : [];
  const byVoucher = new Map<string, typeof lines>();
  for (const l of lines) byVoucher.set(l.voucherId, [...(byVoucher.get(l.voucherId) ?? []), l]);
  const numberSeries = await tx.select().from(tables.numberSeries).where(eq(tables.numberSeries.deviceId, deviceId));
  return {
    ...(await loadHr(tx, ids, perms)),
    ...(await loadPos(tx, ids, deviceId, perms)),
    ...(await loadExpenses(tx, perms)),
    companies, branches, fiscalYears, accountGroups, accounts, numberSeries,
    vouchers: vouchers.map((v) => ({ ...v, lines: (byVoucher.get(v.id) ?? []).map((l) => ({ accountId: l.accountId, debit: l.debit, credit: l.credit, lineNo: l.lineNo })) })),
  };
}

export async function syncRoutes(app: FastifyInstance, { db }: { db: Db }) {
  /** A refused operation is written down (once per device and operation) so someone can see what the device could not do. */
  const keepRejection = async (tenantId: string, deviceId: string, opId: string, kind: string | null, error: string, payload: unknown) => {
    try {
      await withTenant(db, tenantId, (tx) => tx.insert(tables.syncRejections).values({ tenantId, deviceId, opId: opId.slice(0, 64), kind: kind?.slice(0, 40) ?? null, error: error.slice(0, 60), payload: payload as never }).onConflictDoNothing());
    } catch { /* the device still gets its answer; losing the note only loses the queue entry */ }
  };

  // ---- sync status and the queue of refused operations ---------------------------------------

  app.get("/sync/status", { preHandler: can("users.view") }, async (req) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, async (tx) => {
      const devices = await tx.select().from(tables.devices).orderBy(asc(tables.devices.code));
      const open = await tx.select({ deviceId: tables.syncRejections.deviceId, n: sql<number>`count(*)::int` }).from(tables.syncRejections).where(eq(tables.syncRejections.status, "open")).groupBy(tables.syncRejections.deviceId);
      return devices.map((d) => ({ id: d.id, name: d.name, code: d.code, platform: d.platform, lastSeenAt: d.lastSeenAt, revokedAt: d.revokedAt, createdAt: d.createdAt, openRejections: open.find((o) => o.deviceId === d.id)?.n ?? 0 }));
    });
  });

  app.get("/sync/rejections", { preHandler: can("users.view") }, async (req) => {
    const auth = requireTenant(req);
    const q = z.object({ status: z.enum(["open", "resolved"]).optional(), deviceId: z.uuid().optional() }).parse(req.query);
    return withTenant(db, auth.tenantId, async (tx) => {
      const where = [q.status ? eq(tables.syncRejections.status, q.status) : undefined, q.deviceId ? eq(tables.syncRejections.deviceId, q.deviceId) : undefined].filter((x) => x !== undefined);
      const rows = await tx.select({ r: tables.syncRejections, device: tables.devices.name, code: tables.devices.code }).from(tables.syncRejections)
        .innerJoin(tables.devices, eq(tables.devices.id, tables.syncRejections.deviceId))
        .where(where.length ? and(...where) : undefined).orderBy(desc(tables.syncRejections.createdAt)).limit(200);
      return rows.map((x) => ({ id: x.r.id, deviceId: x.r.deviceId, device: x.device, deviceCode: x.code, opId: x.r.opId, kind: x.r.kind, error: x.r.error, payload: x.r.payload, status: x.r.status, note: x.r.note, createdAt: x.r.createdAt, resolvedAt: x.r.resolvedAt }));
    });
  });

  app.post("/sync/rejections/:id/resolve", { preHandler: can("users.edit") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = z.object({ note: z.string().trim().max(200).optional() }).parse(req.body ?? {});
    return withTenant(db, auth.tenantId, async (tx) => {
      const [r] = await tx.update(tables.syncRejections).set({ status: "resolved", note: body.note ?? null, resolvedBy: auth.user.id, resolvedAt: new Date() })
        .where(and(eq(tables.syncRejections.id, id), eq(tables.syncRejections.status, "open"))).returning();
      if (!r) throw notFound();
      await audit(tx, { tenantId: auth.tenantId, userId: auth.user.id, action: "update", entity: "sync_rejection", entityId: id, after: { kind: r.kind, error: r.error, note: body.note ?? null }, ip: req.ip });
      return { ok: true };
    });
  });

  // ---- devices -------------------------------------------------------------------------------

  app.post("/devices", { preHandler: can("accounts.view") }, async (req, reply) => {
    const auth = requireTenant(req);
    const body = z.object({ name: z.string().trim().min(1).max(80), platform: z.enum(["windows", "macos", "linux", "android", "ios"]) }).parse(req.body);
    const device = await withTenant(db, auth.tenantId, async (tx) => {
      // Serialise registrations per tenant so two devices never get the same code.
      await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${auth.tenantId}))`);
      const used = new Set((await tx.select({ code: tables.devices.code }).from(tables.devices)).map((d) => d.code));
      let code: string | undefined;
      outer: for (const digit of "123456789") for (const letter of CODE_LETTERS) if (!used.has(`${letter}${digit}`)) { code = `${letter}${digit}`; break outer; }
      if (!code) throw badRequest("device_limit");
      const [d] = await tx.insert(tables.devices).values({ tenantId: auth.tenantId, name: body.name, code, platform: body.platform, lastSeenAt: new Date() }).returning();
      // A number series per voucher type for this device, in the current year of every company.
      const company = await resolveCompany(tx);
      await ensureChart(tx, auth.tenantId, company.id);
      const fy = fiscalYearOf(businessDate());
      const [fyRow] = await tx.select().from(tables.fiscalYears).where(and(eq(tables.fiscalYears.companyId, company.id), eq(tables.fiscalYears.label, fy.label)));
      if (fyRow) {
        await tx.insert(tables.numberSeries).values(Object.values(DEVICE_SERIES).map((s) => ({
          tenantId: auth.tenantId, companyId: company.id, fiscalYearId: fyRow.id, deviceId: d!.id, docType: s.docType, name: s.name, pattern: s.pattern,
        })));
      }
      await audit(tx, { tenantId: auth.tenantId, userId: auth.user.id, action: "create", entity: "device", entityId: d!.id, after: { name: body.name, code, platform: body.platform }, ip: req.ip });
      return d!;
    });
    return reply.code(201).send(device);
  });

  app.get("/devices", { preHandler: can("users.view") }, async (req) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => tx.select().from(tables.devices).orderBy(asc(tables.devices.code)));
  });

  app.post("/devices/:id/revoke", { preHandler: can("users.edit") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    await requireStepUp(db, req);
    return withTenant(db, auth.tenantId, async (tx) => {
      const [d] = await tx.update(tables.devices).set({ revokedAt: new Date() }).where(and(eq(tables.devices.id, id), isNull(tables.devices.revokedAt))).returning();
      if (!d) throw notFound();
      await audit(tx, { tenantId: auth.tenantId, userId: auth.user.id, action: "update", entity: "device", entityId: id, after: { revoked: true }, ip: req.ip });
      return { ok: true };
    });
  });

  // ---- pull ----------------------------------------------------------------------------------

  /**
   * First pull (no cursor): a full snapshot. Later pulls: rows changed by transactions with
   * cursor <= txid < horizon. The new cursor is the horizon, so a transaction that was still running
   * is picked up next time instead of being skipped.
   */
  app.get("/sync/pull", { preHandler: can("accounts.view") }, async (req) => {
    const auth = requireTenant(req);
    const q = z.object({ deviceId: z.uuid(), cursor: z.string().regex(/^\d+$/).optional() }).parse(req.query);
    return withTenant(db, auth.tenantId, async (tx) => {
      await activeDevice(tx, q.deviceId);
      await tx.update(tables.devices).set({ lastSeenAt: new Date() }).where(eq(tables.devices.id, q.deviceId));
      const [{ horizon }] = (await tx.execute<{ horizon: string }>(sql`select sync_horizon()::text as horizon`)) as unknown as [{ horizon: string }];
      if (!q.cursor) return { cursor: horizon, full: true, ...(await loadEntities(tx, null, q.deviceId, auth.permissions)) };

      const changes = await tx.execute<{ entity: string; entity_id: string }>(sql`
        select distinct entity, entity_id from sync_changes
        where txid >= ${q.cursor}::xid8 and txid < ${horizon}::xid8`);
      const ids = new Map<string, string[]>();
      for (const c of changes) ids.set(c.entity, [...(ids.get(c.entity) ?? []), c.entity_id]);
      return { cursor: horizon, full: false, ...(await loadEntities(tx, ids, q.deviceId, auth.permissions)) };
    });
  });

  // ---- push ----------------------------------------------------------------------------------

  /** Applies queued offline operations in order, each in its own transaction, and reports each result. */
  app.post("/sync/push", { preHandler: can("accounts.view"), bodyLimit: 5 * 1024 * 1024 }, async (req) => {
    const auth = requireTenant(req);
    const body = z.object({ deviceId: z.uuid(), ops: z.array(z.unknown()).max(500) }).parse(req.body);
    await withTenant(db, auth.tenantId, (tx) => activeDevice(tx, body.deviceId));
    const results: { opId: string | null; ok: boolean; error?: string; result?: unknown }[] = [];
    for (const raw of body.ops) {
      const parsed = Op.safeParse(raw);
      if (!parsed.success) {
        const bad = raw as { opId?: unknown; kind?: unknown } | null;
        results.push({ opId: (bad?.opId as string | undefined) ?? null, ok: false, error: "validation" });
        if (typeof bad?.opId === "string") await keepRejection(auth.tenantId, body.deviceId, bad.opId, typeof bad.kind === "string" ? bad.kind : null, "validation", raw);
        continue;
      }
      try {
        const result = await withTenant(db, auth.tenantId, (tx) => applyOp(tx, auth, body.deviceId, req.ip, parsed.data));
        results.push({ opId: parsed.data.opId, ok: true, result });
      } catch (e) {
        if (e instanceof HttpError) {
          results.push({ opId: parsed.data.opId, ok: false, error: e.code });
          await keepRejection(auth.tenantId, body.deviceId, parsed.data.opId, parsed.data.kind, e.code, parsed.data);
        } else {
          req.log.error(e);
          results.push({ opId: parsed.data.opId, ok: false, error: "internal" });
        }
      }
    }
    return { results };
  });
}
