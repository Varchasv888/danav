import { sql } from "drizzle-orm";
import { tables, type Db, type Tx } from "@varchasv/db";
import { SYSTEM_ROLES, fiscalYearOf, validateGstin, businessDate } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest } from "../lib/errors.js";
import { hashPassword } from "../lib/password.js";
import { ensureChart } from "./accounting.js";

export const DEFAULT_SERIES: { docType: string; name: string; pattern: string }[] = [
  { docType: "sales_invoice", name: "Sales invoices", pattern: "INV/{FY}/{SEQ:5}" },
  { docType: "credit_note", name: "Credit notes", pattern: "CN/{FY}/{SEQ:5}" },
  { docType: "debit_note", name: "Debit notes", pattern: "DN/{FY}/{SEQ:5}" },
  { docType: "purchase_bill", name: "Purchase bills", pattern: "PB/{FY}/{SEQ:5}" },
  { docType: "receipt", name: "Receipts", pattern: "RCT/{FY}/{SEQ:5}" },
  { docType: "payment", name: "Payments", pattern: "PAY/{FY}/{SEQ:5}" },
  { docType: "journal", name: "Journal vouchers", pattern: "JV/{FY}/{SEQ:5}" },
];

const ROLE_NAMES: Record<keyof typeof SYSTEM_ROLES, string> = {
  owner: "Owner", admin: "Administrator", accountant: "Accountant", sales: "Sales", purchase: "Purchase",
  storekeeper: "Storekeeper", hr: "HR", viewer: "Viewer",
};

export interface BusinessInput {
  businessName: string;
  stateCode: string;
  gstin?: string | undefined;
  industry?: string | undefined;
  today?: string | undefined; // for tests
  /** When the books begin, for a business bringing in earlier years (like Tally's "books beginning from"). */
  booksFrom?: string | undefined;
}

export interface SignupInput extends BusinessInput {
  name: string;
  email: string;
  password: string;
  locale?: string | undefined;
}

function checkGstin(input: BusinessInput) {
  if (!input.gstin) return { gstin: null, pan: null };
  const g = validateGstin(input.gstin);
  if (!g.valid) throw badRequest(`gstin_${g.error}`);
  if (g.stateCode !== input.stateCode) throw badRequest("gstin_state_mismatch");
  return { gstin: g.gstin, pan: g.pan };
}

/**
 * A ready-to-use business for an existing user, inside the caller's transaction: tenant, system roles,
 * owner membership, company, head-office branch, current financial year and default number series.
 * Leaves `app.tenant_id` set to the new tenant for the rest of the transaction.
 */
export async function createBusiness(tx: Tx, userId: string, input: BusinessInput) {
  const { gstin, pan } = checkGstin(input);
  const today = input.today ?? businessDate();
  // Books start no earlier than FY 2024-25 (the oldest year the payroll tax tables cover), and never in the future.
  if (input.booksFrom && (input.booksFrom > today || input.booksFrom < "2024-04-01")) throw badRequest("invalid_books_from");
  const booksBeginOn = input.booksFrom ?? fiscalYearOf(today).start;
  const fy = fiscalYearOf(booksBeginOn);

  const tenantId = crypto.randomUUID();
  await tx.execute(sql`select set_config('app.tenant_id', ${tenantId}, true)`);
  await tx.insert(tables.tenants).values({ id: tenantId, name: input.businessName, industry: input.industry ?? "general" });

  const roleRows = await tx
    .insert(tables.roles)
    .values(Object.entries(SYSTEM_ROLES).map(([key, permissions]) => ({
      tenantId, key, name: ROLE_NAMES[key as keyof typeof SYSTEM_ROLES], permissions, system: true,
    })))
    .returning({ id: tables.roles.id, key: tables.roles.key });
  const ownerRole = roleRows.find((r) => r.key === "owner")!;
  await tx.insert(tables.memberships).values({ tenantId, userId, roleId: ownerRole.id });

  const [company] = await tx
    .insert(tables.companies)
    .values({ tenantId, name: input.businessName, pan, booksBeginOn })
    .returning();
  await tx.insert(tables.branches).values({
    tenantId, companyId: company!.id, name: "Head office", gstin, stateCode: input.stateCode, isHeadOffice: true,
  });
  const [fiscalYear] = await tx
    .insert(tables.fiscalYears)
    .values({ tenantId, companyId: company!.id, label: fy.label, startsOn: fy.start, endsOn: fy.end })
    .returning({ id: tables.fiscalYears.id });
  await tx.insert(tables.numberSeries).values(DEFAULT_SERIES.map((s) => ({
    tenantId, companyId: company!.id, fiscalYearId: fiscalYear!.id, isDefault: true, ...s,
  })));
  await tx.insert(tables.numberSeries).values({ tenantId, companyId: company!.id, fiscalYearId: fiscalYear!.id, isDefault: true, docType: "contra", name: "Contra vouchers", pattern: "CV/{FY}/{SEQ:5}" });
  await ensureChart(tx, tenantId, company!.id);
  await audit(tx, { tenantId, userId, action: "create", entity: "tenant", entityId: tenantId, after: { name: input.businessName } });

  return { tenantId, companyId: company!.id, fiscalYearId: fiscalYear!.id };
}

/** New user + their first business, in one transaction. */
export async function signup(db: Db, input: SignupInput) {
  checkGstin(input); // fail fast, before hashing the password
  const passwordHash = await hashPassword(input.password);
  return db.transaction(async (tx) => {
    const [user] = await tx
      .insert(tables.users)
      .values({ name: input.name, email: input.email.trim(), passwordHash, locale: input.locale ?? "en" })
      .returning({ id: tables.users.id });
    const business = await createBusiness(tx, user!.id, input);
    return { userId: user!.id, ...business };
  });
}
