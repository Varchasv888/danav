import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec, money, validateGstin } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { receiptReader } from "../integrations/receipts.js";
import { cancelVoucher, ensureTemplateAccounts, postVoucher, resolveCompany } from "./accounting.js";
import { resolvePostingAccountIds } from "./ledgerparameters.js";
import { documentNumber } from "./inventory.js";
import { getFile } from "./files.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }
type Company = Awaited<ReturnType<typeof resolveCompany>>;

const CLAIM_SERIES = { docType: "expense_claim", name: "Expense claims", pattern: "EXP/{FY}/{SEQ:5}" };
const EXPENSE_ACCOUNTS = ["reimbursements_payable", "input_cgst", "input_sgst", "input_igst"];
const EXPENSE_CATEGORY_ACCOUNTS = ["travel", "lodging", "staff_welfare", "stationery", "telephone", "courier"];

/** Starting categories. Blocked credit follows section 17(5): food and hiring of vehicles don't give input tax credit. */
const DEFAULT_CATEGORIES = [
  { name: "Local conveyance", nameHi: "स्थानीय वाहन", account: "travel", blockedCredit: true },
  { name: "Travel tickets", nameHi: "यात्रा टिकट", account: "travel", blockedCredit: false },
  { name: "Hotel stay", nameHi: "होटल में ठहरना", account: "lodging", blockedCredit: false },
  { name: "Meals & refreshments", nameHi: "भोजन और जलपान", account: "staff_welfare", blockedCredit: true },
  { name: "Fuel", nameHi: "ईंधन", account: "travel", blockedCredit: true },
  { name: "Office supplies", nameHi: "कार्यालय सामग्री", account: "stationery", blockedCredit: false },
  { name: "Phone & internet", nameHi: "फ़ोन और इंटरनेट", account: "telephone", blockedCredit: false },
  { name: "Courier", nameHi: "कूरियर", account: "courier", blockedCredit: false },
];

async function setup(tx: Tx, company: Company) {
  const keys = await resolvePostingAccountIds(tx, company.id, EXPENSE_ACCOUNTS);
  await ensureTemplateAccounts(tx, company.tenantId, company.id, EXPENSE_CATEGORY_ACCOUNTS);
  const categoryRows = await tx.select({ id: tables.accounts.id, key: tables.accounts.key }).from(tables.accounts)
    .where(and(eq(tables.accounts.companyId, company.id), inArray(tables.accounts.key, EXPENSE_CATEGORY_ACCOUNTS)));
  const categoryAccounts = Object.fromEntries(categoryRows.map((account) => [account.key!, account.id]));
  const [any] = await tx.select({ id: tables.expenseCategories.id }).from(tables.expenseCategories).where(eq(tables.expenseCategories.companyId, company.id)).limit(1);
  if (!any) {
    await tx.insert(tables.expenseCategories).values(DEFAULT_CATEGORIES.map((c) => ({
      tenantId: company.tenantId, companyId: company.id, name: c.name, nameHi: c.nameHi, accountId: categoryAccounts[c.account]!, blockedCredit: c.blockedCredit,
    })));
  }
  return keys;
}

async function homeState(tx: Tx, companyId: string) {
  const [b] = await tx.select({ stateCode: tables.branches.stateCode }).from(tables.branches).where(and(eq(tables.branches.companyId, companyId), eq(tables.branches.isHeadOffice, true)));
  return b?.stateCode ?? null;
}

// ---- categories -------------------------------------------------------------------------------------

export async function listCategories(tx: Tx) {
  const company = await resolveCompany(tx);
  await setup(tx, company);
  return tx.select({ c: tables.expenseCategories, account: tables.accounts.name }).from(tables.expenseCategories)
    .innerJoin(tables.accounts, eq(tables.accounts.id, tables.expenseCategories.accountId))
    .where(eq(tables.expenseCategories.companyId, company.id)).orderBy(asc(tables.expenseCategories.name));
}

export interface CategoryInput {
  name: string; nameHi?: string | null | undefined; accountId: string; blockedCredit?: boolean | undefined;
  limitPerClaim?: string | null | undefined; receiptRequiredAbove?: string | null | undefined; archived?: boolean | undefined;
  perKmRate?: string | null | undefined; dailyAllowance?: string | null | undefined;
}

export async function saveCategory(tx: Tx, actor: Actor, input: CategoryInput, id?: string) {
  const company = await resolveCompany(tx);
  const [acct] = await tx.select({ a: tables.accounts, nature: tables.accountGroups.nature }).from(tables.accounts).innerJoin(tables.accountGroups, eq(tables.accountGroups.id, tables.accounts.groupId)).where(eq(tables.accounts.id, input.accountId));
  if (!acct || acct.a.companyId !== company.id) throw badRequest("unknown_account");
  if (acct.nature !== "expense" && acct.nature !== "asset") throw badRequest("not_an_expense_account");
  const values = {
    name: input.name.trim(), nameHi: input.nameHi ?? null, accountId: input.accountId, blockedCredit: input.blockedCredit ?? false,
    limitPerClaim: input.limitPerClaim ?? null, receiptRequiredAbove: input.receiptRequiredAbove ?? null, archived: input.archived ?? false,
    perKmRate: input.perKmRate ?? null, dailyAllowance: input.dailyAllowance ?? null,
  };
  try {
    if (id) {
      const [row] = await tx.update(tables.expenseCategories).set(values).where(eq(tables.expenseCategories.id, id)).returning();
      if (!row) throw notFound();
      return row;
    }
    const [row] = await tx.insert(tables.expenseCategories).values({ tenantId: actor.tenantId, companyId: company.id, ...values }).returning();
    return row!;
  } catch (e) {
    if ((e as { cause?: { code?: string } })?.cause?.code === "23505") throw conflict("category_exists");
    throw e;
  }
}

// ---- claims -----------------------------------------------------------------------------------------

export interface ClaimLineInput {
  date: string; categoryId: string; description?: string | undefined; amount?: string | undefined;
  /** A trip: kilometres and days are paid at the category's rates, so the amount can be left out. */
  travel?: { from: string; to: string; km?: string | undefined; days?: number | undefined } | undefined; gstRate?: string | undefined;
  vendorName?: string | undefined; vendorGstin?: string | undefined; invoiceNo?: string | undefined; projectId?: string | undefined; fileId?: string | undefined;
}
export interface ClaimInput {
  employeeId: string; date: string; title: string; projectId?: string | undefined; lines: ClaimLineInput[]; submit?: boolean | undefined;
  /** Set by an offline device, so a claim sent twice is created once. */
  id?: string | undefined;
}

/**
 * Works out each line: with a tax invoice in the company's name (the vendor's GSTIN and invoice
 * number) and a category that allows it, the GST is claimed as input credit and only the taxable
 * value is the expense; otherwise the whole amount is.
 */
async function priceLines(tx: Tx, company: Company, lines: ClaimLineInput[], claimProject: string | null) {
  if (!lines.length) throw badRequest("no_lines");
  const cats = await tx.select().from(tables.expenseCategories).where(and(eq(tables.expenseCategories.companyId, company.id), inArray(tables.expenseCategories.id, [...new Set(lines.map((l) => l.categoryId))])));
  const home = await homeState(tx, company.id);
  const projectIds = [...new Set([claimProject, ...lines.map((l) => l.projectId)].filter((x): x is string => !!x))];
  if (projectIds.length) {
    const ps = await tx.select({ id: tables.projects.id }).from(tables.projects).where(and(eq(tables.projects.companyId, company.id), inArray(tables.projects.id, projectIds)));
    if (ps.length !== projectIds.length) throw badRequest("unknown_project");
  }
  const byCategory = new Map<string, ReturnType<typeof dec>>();
  const out = lines.map((l, i) => {
    const cat = cats.find((c) => c.id === l.categoryId);
    if (!cat) throw badRequest("unknown_category");
    if (cat.archived) throw badRequest("category_archived");
    // A trip on a category with a travel policy is paid by the policy: kilometres at the per-km rate and days away at the daily allowance.
    let policy: ReturnType<typeof dec> | null = null;
    if (l.travel && (cat.perKmRate || cat.dailyAllowance)) {
      const km = dec(l.travel.km ?? 0), days = dec(l.travel.days ?? 0);
      if (km.lt(0) || days.lt(0)) throw badRequest("invalid_amount");
      if (cat.perKmRate && !km.gt(0) && !cat.dailyAllowance) throw badRequest("km_required");
      policy = km.times(cat.perKmRate ?? 0).plus(days.times(cat.dailyAllowance ?? 0));
    }
    if (l.travel && !l.travel.from?.trim()) throw badRequest("trip_needs_places");
    if (policy && l.amount !== undefined && !dec(l.amount).eq(policy)) throw badRequest("travel_amount_mismatch");
    if (!policy && l.amount === undefined) throw badRequest("invalid_amount");
    const amount = policy ?? dec(l.amount!);
    if (!amount.gt(0)) throw badRequest("invalid_amount");
    if (cat.receiptRequiredAbove && amount.gt(cat.receiptRequiredAbove) && !l.fileId) throw badRequest("receipt_required");
    byCategory.set(cat.id, (byCategory.get(cat.id) ?? dec(0)).plus(amount));
    if (cat.limitPerClaim && byCategory.get(cat.id)!.gt(cat.limitPerClaim)) throw badRequest("over_limit");
    const rate = dec(l.gstRate ?? 0);
    const gstin = l.vendorGstin?.trim().toUpperCase() || null;
    if (gstin && !validateGstin(gstin).valid) throw badRequest("invalid_gstin");
    const eligible = rate.gt(0) && !!gstin && !!l.invoiceNo?.trim() && !cat.blockedCredit;
    const taxable = eligible ? dec(money(amount.times(100).div(dec(100).plus(rate)))) : amount;
    const tax = amount.minus(taxable);
    const intra = eligible && gstin!.slice(0, 2) === home;
    const half = dec(money(tax.div(2)));
    return {
      lineNo: i + 1, date: l.date, categoryId: cat.id, accountId: cat.accountId, description: l.description ?? null, amount: money(amount), gstRate: money(rate),
      vendorName: l.vendorName ?? null, vendorGstin: gstin, invoiceNo: l.invoiceNo?.trim() || null, taxable: money(taxable),
      cgst: intra ? money(half) : "0.00", sgst: intra ? money(tax.minus(half)) : "0.00", igst: eligible && !intra ? money(tax) : "0.00",
      projectId: l.projectId ?? null, fileId: l.fileId ?? null, travel: l.travel ? { from: l.travel.from.trim(), to: l.travel.to.trim(), ...(l.travel.km ? { km: dec(l.travel.km).toFixed(1) } : {}), ...(l.travel.days ? { days: l.travel.days } : {}) } : null,
    };
  });
  return out;
}

async function loadEmployee(tx: Tx, companyId: string, id: string) {
  const [e] = await tx.select().from(tables.employees).where(eq(tables.employees.id, id));
  if (!e || e.companyId !== companyId) throw badRequest("unknown_employee");
  return e;
}

export async function createClaim(tx: Tx, actor: Actor, input: ClaimInput) {
  const company = await resolveCompany(tx);
  await setup(tx, company);
  await loadEmployee(tx, company.id, input.employeeId);
  const lines = await priceLines(tx, company, input.lines, input.projectId ?? null);
  const number = await documentNumber(tx, actor, company, input.date, CLAIM_SERIES);
  const total = lines.reduce((s, l) => s.plus(l.amount), dec(0));
  const itc = lines.reduce((s, l) => s.plus(l.cgst).plus(l.sgst).plus(l.igst), dec(0));
  const [claim] = await tx.insert(tables.expenseClaims).values({
    ...(input.id ? { id: input.id } : {}),
    tenantId: actor.tenantId, companyId: company.id, number, employeeId: input.employeeId, date: input.date, title: input.title.trim(), projectId: input.projectId ?? null,
    status: input.submit ? "submitted" : "draft", submittedAt: input.submit ? new Date() : null, total: money(total), itc: money(itc), createdBy: actor.userId,
  }).returning();
  await tx.insert(tables.expenseLines).values(lines.map(({ accountId: _a, ...l }) => ({ tenantId: actor.tenantId, claimId: claim!.id, ...l })));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "expense_claim", entityId: claim!.id, after: { number, total: claim!.total }, ip: actor.ip });
  return claim!;
}

async function loadClaim(tx: Tx, id: string) {
  const [c] = await tx.select().from(tables.expenseClaims).where(eq(tables.expenseClaims.id, id)).for("update");
  if (!c) throw notFound();
  return c;
}

/** A draft or rejected claim can be changed (it goes back to draft, or straight to submitted). */
export async function updateClaim(tx: Tx, actor: Actor, id: string, input: ClaimInput) {
  const company = await resolveCompany(tx);
  const c = await loadClaim(tx, id);
  if (c.status !== "draft" && c.status !== "rejected") throw conflict("claim_locked");
  await loadEmployee(tx, company.id, input.employeeId);
  const lines = await priceLines(tx, company, input.lines, input.projectId ?? null);
  await tx.delete(tables.expenseLines).where(eq(tables.expenseLines.claimId, id));
  await tx.insert(tables.expenseLines).values(lines.map(({ accountId: _a, ...l }) => ({ tenantId: actor.tenantId, claimId: id, ...l })));
  const [row] = await tx.update(tables.expenseClaims).set({
    employeeId: input.employeeId, date: input.date, title: input.title.trim(), projectId: input.projectId ?? null,
    total: money(lines.reduce((s, l) => s.plus(l.amount), dec(0))), itc: money(lines.reduce((s, l) => s.plus(l.cgst).plus(l.sgst).plus(l.igst), dec(0))),
    status: input.submit ? "submitted" : "draft", submittedAt: input.submit ? new Date() : null, rejectReason: null,
  }).where(eq(tables.expenseClaims.id, id)).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "expense_claim", entityId: id, after: { total: row!.total, status: row!.status }, ip: actor.ip });
  return row!;
}

export async function submitClaim(tx: Tx, actor: Actor, id: string) {
  const c = await loadClaim(tx, id);
  if (c.status !== "draft" && c.status !== "rejected") throw conflict("claim_locked");
  await tx.update(tables.expenseClaims).set({ status: "submitted", submittedAt: new Date(), rejectReason: null }).where(eq(tables.expenseClaims.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "expense_claim", entityId: id, after: { status: "submitted" }, ip: actor.ip });
}

/** Approving books the expense: Dr each category's ledger (and input GST), Cr Expense Reimbursements Payable. */
export async function approveClaim(tx: Tx, actor: Actor, id: string) {
  const company = await resolveCompany(tx);
  const keys = await setup(tx, company);
  const c = await loadClaim(tx, id);
  if (c.status !== "submitted") throw conflict("claim_not_submitted");
  const lines = await tx.select({ l: tables.expenseLines, accountId: tables.expenseCategories.accountId }).from(tables.expenseLines)
    .innerJoin(tables.expenseCategories, eq(tables.expenseCategories.id, tables.expenseLines.categoryId)).where(eq(tables.expenseLines.claimId, id));
  const byAccount = new Map<string, ReturnType<typeof dec>>();
  for (const { l, accountId } of lines) byAccount.set(accountId, (byAccount.get(accountId) ?? dec(0)).plus(l.taxable));
  const tax = (k: "cgst" | "sgst" | "igst") => lines.reduce((s, x) => s.plus(x.l[k]), dec(0));
  const [emp] = await tx.select({ name: tables.employees.name }).from(tables.employees).where(eq(tables.employees.id, c.employeeId));
  const { voucher } = await postVoucher(tx, actor, {
    companyId: company.id, type: "expense_claim", documentNumber: c.number, date: c.date, narration: `${c.title} (${emp?.name ?? ""})`,
    lines: [
      ...[...byAccount.entries()].map(([accountId, v]) => ({ accountId, debit: money(v) })),
      ...(tax("cgst").gt(0) ? [{ accountId: keys.input_cgst!, debit: money(tax("cgst")) }, { accountId: keys.input_sgst!, debit: money(tax("sgst")) }] : []),
      ...(tax("igst").gt(0) ? [{ accountId: keys.input_igst!, debit: money(tax("igst")) }] : []),
      { accountId: keys.reimbursements_payable!, credit: c.total },
    ],
  });
  await tx.update(tables.expenseClaims).set({ status: "approved", decidedBy: actor.userId, decidedAt: new Date(), voucherId: voucher.id }).where(eq(tables.expenseClaims.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "approve", entity: "expense_claim", entityId: id, after: { status: "approved", total: c.total }, ip: actor.ip });
}

export async function rejectClaim(tx: Tx, actor: Actor, id: string, reason: string) {
  const c = await loadClaim(tx, id);
  if (c.status !== "submitted") throw conflict("claim_not_submitted");
  await tx.update(tables.expenseClaims).set({ status: "rejected", decidedBy: actor.userId, decidedAt: new Date(), rejectReason: reason }).where(eq(tables.expenseClaims.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "expense_claim", entityId: id, after: { status: "rejected", reason }, ip: actor.ip });
}

/** Paying the employee back: Dr Expense Reimbursements Payable, Cr cash or bank. */
export async function payClaim(tx: Tx, actor: Actor, id: string, input: { date: string; accountId: string }) {
  const company = await resolveCompany(tx);
  const keys = await setup(tx, company);
  const c = await loadClaim(tx, id);
  if (c.status !== "approved") throw conflict("claim_not_approved");
  if (input.date < c.date) throw badRequest("paid_before_claim");
  const [emp] = await tx.select({ name: tables.employees.name }).from(tables.employees).where(eq(tables.employees.id, c.employeeId));
  const { voucher } = await postVoucher(tx, actor, {
    companyId: company.id, type: "payment", date: input.date, reference: c.number, narration: `Reimbursement ${c.number} to ${emp?.name ?? ""}`,
    lines: [{ accountId: keys.reimbursements_payable!, debit: c.total }, { accountId: input.accountId, credit: c.total }],
  });
  await tx.update(tables.expenseClaims).set({ status: "paid", paymentVoucherId: voucher.id }).where(eq(tables.expenseClaims.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "expense_claim", entityId: id, after: { status: "paid", voucher: voucher.number }, ip: actor.ip });
  return voucher;
}

/** Cancels a claim not yet paid; an approved one has its expense entry reversed. */
export async function cancelClaim(tx: Tx, actor: Actor, id: string, reason: string) {
  const c = await loadClaim(tx, id);
  if (c.status === "paid") throw conflict("claim_paid");
  if (c.status === "cancelled") throw conflict("already_cancelled");
  if (c.voucherId) await cancelVoucher(tx, actor, c.voucherId, reason);
  await tx.update(tables.expenseClaims).set({ status: "cancelled", rejectReason: reason }).where(eq(tables.expenseClaims.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "cancel", entity: "expense_claim", entityId: id, after: { reason }, ip: actor.ip });
}

export async function listClaims(tx: Tx, q: { status?: string | undefined; employeeId?: string | undefined }) {
  const company = await resolveCompany(tx);
  return tx.select({ c: tables.expenseClaims, employee: tables.employees.name, employeeCode: tables.employees.code }).from(tables.expenseClaims)
    .innerJoin(tables.employees, eq(tables.employees.id, tables.expenseClaims.employeeId))
    .where(and(eq(tables.expenseClaims.companyId, company.id), q.status ? eq(tables.expenseClaims.status, q.status) : undefined, q.employeeId ? eq(tables.expenseClaims.employeeId, q.employeeId) : undefined))
    .orderBy(desc(tables.expenseClaims.date), desc(tables.expenseClaims.number)).limit(300);
}

export async function getClaim(tx: Tx, id: string) {
  const [row] = await tx.select({ c: tables.expenseClaims, employee: tables.employees.name, employeeCode: tables.employees.code, project: tables.projects.name })
    .from(tables.expenseClaims).innerJoin(tables.employees, eq(tables.employees.id, tables.expenseClaims.employeeId))
    .leftJoin(tables.projects, eq(tables.projects.id, tables.expenseClaims.projectId)).where(eq(tables.expenseClaims.id, id));
  if (!row) throw notFound();
  const lines = await tx.select({ l: tables.expenseLines, category: tables.expenseCategories.name, categoryHi: tables.expenseCategories.nameHi, file: tables.files.name })
    .from(tables.expenseLines).innerJoin(tables.expenseCategories, eq(tables.expenseCategories.id, tables.expenseLines.categoryId))
    .leftJoin(tables.files, eq(tables.files.id, tables.expenseLines.fileId)).where(eq(tables.expenseLines.claimId, id)).orderBy(asc(tables.expenseLines.lineNo));
  const vouchers = await tx.select({ id: tables.vouchers.id, number: tables.vouchers.number }).from(tables.vouchers)
    .where(inArray(tables.vouchers.id, [row.c.voucherId, row.c.paymentVoucherId, "00000000-0000-0000-0000-000000000000"].filter((x): x is string => !!x)));
  return {
    ...row.c, employee: row.employee, employeeCode: row.employeeCode, project: row.project,
    lines: lines.map((x) => ({ ...x.l, category: x.category, categoryHi: x.categoryHi, fileName: x.file })),
    voucher: vouchers.find((v) => v.id === row.c.voucherId)?.number ?? null, paymentVoucher: vouchers.find((v) => v.id === row.c.paymentVoucherId)?.number ?? null,
  };
}

/** Suggests the expense details on a receipt (when a reader is set up). */
export async function readReceipt(tx: Tx, fileId: string) {
  const company = await resolveCompany(tx);
  const f = await getFile(tx, fileId);
  const cats = await tx.select().from(tables.expenseCategories).where(and(eq(tables.expenseCategories.companyId, company.id), eq(tables.expenseCategories.archived, false)));
  let fields = null;
  try { fields = await receiptReader.read({ data: f.data, contentType: f.contentType }, cats.map((c) => c.name)); } catch { fields = null; }
  return { reader: receiptReader.name, fields, categoryId: fields?.category ? cats.find((c) => c.name === fields.category)?.id ?? null : null };
}

/** Totals for the expenses page: waiting for approval, approved but not paid. */
export async function claimTotals(tx: Tx) {
  const company = await resolveCompany(tx);
  const rows = await tx.execute<{ status: string; n: number; total: string }>(sql`select status, count(*)::int as n, sum(total)::text as total from expense_claims where company_id = ${company.id} group by status`);
  return Object.fromEntries([...rows].map((r) => [r.status, { count: r.n, total: money(r.total) }]));
}


/**
 * Trips claimed in a period, by person: how many, how far and what was paid for them, with the claims they sit on. Travel claims are ordinary
 * expense claims whose lines carry a trip, so approval, receipts and payment work as for any other claim.
 */
export async function travelRegister(tx: Tx, from: string, to: string) {
  if (to < from) throw badRequest("invalid_dates");
  const company = await resolveCompany(tx);
  const rows = [...await tx.execute<{ employee_id: string; name: string; claim: string; status: string; date: string; trip_from: string; trip_to: string; km: string | null; days: number | null; amount: string }>(sql`
    select e.id as employee_id, e.name, c.number as claim, c.status, l.date::text, l.travel->>'from' as trip_from, l.travel->>'to' as trip_to,
      l.travel->>'km' as km, (l.travel->>'days')::int as days, l.amount::text
    from expense_lines l join expense_claims c on c.id = l.claim_id join employees e on e.id = c.employee_id
    where c.company_id = ${company.id} and c.status <> 'cancelled' and c.status <> 'rejected' and l.travel is not null and l.date between ${from}::date and ${to}::date
    order by e.name, l.date`)];
  const by = new Map<string, { employeeId: string; name: string; trips: number; km: ReturnType<typeof dec>; amount: ReturnType<typeof dec>; lines: typeof rows }>();
  for (const r of rows) {
    const e = by.get(r.employee_id) ?? { employeeId: r.employee_id, name: r.name, trips: 0, km: dec(0), amount: dec(0), lines: [] };
    e.trips++; e.km = e.km.plus(r.km ?? 0); e.amount = e.amount.plus(r.amount); e.lines.push(r);
    by.set(r.employee_id, e);
  }
  return {
    from, to, total: money([...by.values()].reduce((t, e) => t.plus(e.amount), dec(0))),
    people: [...by.values()].map((e) => ({ employeeId: e.employeeId, name: e.name, trips: e.trips, km: e.km.toFixed(1), amount: money(e.amount), lines: e.lines.map((l) => ({ claim: l.claim, status: l.status, date: l.date, from: l.trip_from, to: l.trip_to, km: l.km, days: l.days, amount: l.amount })) })),
  };
}
