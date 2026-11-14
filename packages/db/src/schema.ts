import { sql } from "drizzle-orm";
import {
  type AnyPgColumn, bigint, bigserial, boolean, char, customType, date, index, inet, integer, jsonb, numeric, pgTable, text, timestamp, uniqueIndex, uuid, varchar,
} from "drizzle-orm/pg-core";

const bytea = customType<{ data: Buffer; driverData: Buffer }>({ dataType: () => "bytea" });

/**
 * Tenancy: a tenant is one subscription. It owns companies (legal entities with a PAN), which own
 * branches (one per GSTIN/location). Every tenant-owned table carries tenant_id and is protected by
 * row-level security (migrations/0001_rls.sql): the app sets `app.tenant_id` per transaction.
 *
 * users and sessions are global: one login can belong to several tenants (e.g. a CA firm).
 */

const id = () => uuid("id").primaryKey().default(sql`gen_random_uuid()`);
const tenantId = () => uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" });
const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updatedAt = () => timestamp("updated_at", { withTimezone: true }).notNull().defaultNow();

export const tenants = pgTable("tenants", {
  id: id(),
  name: text("name").notNull(),
  plan: varchar("plan", { length: 20 }).notNull().default("free"),
  industry: varchar("industry", { length: 30 }).notNull().default("tiles"),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  createdAt: createdAt(),
});

export const users = pgTable("users", {
  id: id(),
  email: text("email").notNull(),
  phone: varchar("phone", { length: 15 }),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  locale: varchar("locale", { length: 5 }).notNull().default("en"),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("users_email_key").on(sql`lower(${t.email})`)]);

export const sessions = pgTable("sessions", {
  /** SHA-256 of the session token; the raw token only ever lives in the cookie. */
  tokenHash: char("token_hash", { length: 64 }).primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  userAgent: text("user_agent"),
  ip: inet("ip"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  /** Set for a few minutes after the person re-typed their password; high-risk actions need it. */
  stepUpUntil: timestamp("step_up_until", { withTimezone: true }),
  createdAt: createdAt(),
}, (t) => [index("sessions_user_idx").on(t.userId)]);

/** One-time links for a forgotten password; only the SHA-256 of the token is stored. */
export const passwordResets = pgTable("password_resets", {
  tokenHash: char("token_hash", { length: 64 }).primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: createdAt(),
}, (t) => [index("password_resets_user_idx").on(t.userId)]);

export const roles = pgTable("roles", {
  id: id(),
  tenantId: tenantId(),
  key: varchar("key", { length: 40 }).notNull(),
  name: text("name").notNull(),
  permissions: text("permissions").array().notNull().default(sql`'{}'::text[]`),
  system: boolean("system").notNull().default(false),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("roles_tenant_key").on(t.tenantId, t.key)]);

export const memberships = pgTable("memberships", {
  id: id(),
  tenantId: tenantId(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  roleId: uuid("role_id").notNull().references(() => roles.id),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  /** The user's "My Menu" in this business: screen links in the order they chose (null: the default set). */
  menu: jsonb("menu").$type<string[]>(),
  /** The stores (warehouses) this person may work in; null means all of them. Requests naming another store are refused. */
  warehouseScope: jsonb("warehouse_scope").$type<string[]>(),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("memberships_tenant_user").on(t.tenantId, t.userId)]);

export const companies = pgTable("companies", {
  id: id(),
  tenantId: tenantId(),
  name: text("name").notNull(),
  legalName: text("legal_name"),
  pan: char("pan", { length: 10 }),
  baseCurrency: char("base_currency", { length: 3 }).notNull().default("INR"),
  booksBeginOn: date("books_begin_on").notNull(),
  /** Stock valuation method: moving average (Tally's default) or FIFO. */
  valuationMethod: varchar("valuation_method", { length: 8 }).notNull().default("average"),
  /** When on, a change to a party's bank details waits for someone with the approve-bank-change right who is not the one who asked. */
  bankChangeApproval: boolean("bank_change_approval").notNull().default(false),
  /** A stock loss or damage above this value (at cost) waits for someone with the inventory approve right. */
  lossApprovalLimit: numeric("loss_approval_limit", { precision: 18, scale: 2 }).notNull().default("2000"),
  /** A purchase order above this value waits for someone with the purchase approve right. Null means no limit. */
  purchaseApprovalLimit: numeric("purchase_approval_limit", { precision: 18, scale: 2 }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (t) => [index("companies_tenant_idx").on(t.tenantId)]);

export const branches = pgTable("branches", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  gstin: char("gstin", { length: 15 }),
  stateCode: char("state_code", { length: 2 }).notNull(),
  address: jsonb("address").$type<{ line1?: string; line2?: string; city?: string; pincode?: string }>().notNull().default({}),
  isHeadOffice: boolean("is_head_office").notNull().default(false),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (t) => [
  index("branches_company_idx").on(t.companyId),
  uniqueIndex("branches_tenant_gstin").on(t.tenantId, t.gstin),
]);

export const fiscalYears = pgTable("fiscal_years", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 7 }).notNull(), // "2025-26"
  startsOn: date("starts_on").notNull(),
  endsOn: date("ends_on").notNull(),
  /** Entries dated on or before this date are locked (period lock). */
  lockedUpTo: date("locked_up_to"),
  closed: boolean("closed").notNull().default(false),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("fiscal_years_company_label").on(t.companyId, t.label)]);

/** Offline installations of the Flutter app. Each gets a short code used in its own number series. */
export const devices = pgTable("devices", {
  id: id(),
  tenantId: tenantId(),
  name: text("name").notNull(),
  code: varchar("code", { length: 3 }).notNull(),
  platform: varchar("platform", { length: 20 }).notNull(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("devices_tenant_code").on(t.tenantId, t.code)]);

export const numberSeries = pgTable("number_series", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  branchId: uuid("branch_id").references(() => branches.id, { onDelete: "cascade" }),
  fiscalYearId: uuid("fiscal_year_id").notNull().references(() => fiscalYears.id, { onDelete: "cascade" }),
  deviceId: uuid("device_id").references(() => devices.id),
  docType: varchar("doc_type", { length: 30 }).notNull(),
  name: text("name").notNull(),
  pattern: varchar("pattern", { length: 40 }).notNull(),
  nextSeq: integer("next_seq").notNull().default(1),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: createdAt(),
}, (t) => [index("number_series_lookup").on(t.companyId, t.docType, t.fiscalYearId)]);

/** Append-only. The app role has INSERT/SELECT only (see RLS migration); a trigger blocks changes. */
export const auditLog = pgTable("audit_log", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  tenantId: tenantId(),
  userId: uuid("user_id"),
  action: varchar("action", { length: 40 }).notNull(),
  entity: varchar("entity", { length: 40 }).notNull(),
  entityId: text("entity_id"),
  before: jsonb("before"),
  after: jsonb("after"),
  ip: inet("ip"),
  /** The request that made the change (also sent back as the x-request-id header and written in the server log). */
  requestId: varchar("request_id", { length: 64 }),
  at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
  /** Tamper evidence: sealing chains each entry to the one before it (see services/auditchain.ts). */
  chainSeq: bigint("chain_seq", { mode: "number" }),
  prevHash: char("prev_hash", { length: 64 }),
  hash: char("hash", { length: 64 }),
}, (t) => [index("audit_log_tenant_at").on(t.tenantId, t.at), index("audit_log_tenant_chain").on(t.tenantId, t.chainSeq)]);

/**
 * Invitations to join a tenant. The raw token is only in the invite link; we store its hash.
 * Accepting happens before the invitee has a tenant context, via the SECURITY DEFINER
 * function invitation_by_token() (migrations/0003_invitations_rls.sql).
 */
export const invitations = pgTable("invitations", {
  id: id(),
  tenantId: tenantId(),
  email: text("email").notNull(),
  roleId: uuid("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
  tokenHash: char("token_hash", { length: 64 }).notNull(),
  invitedBy: uuid("invited_by").references(() => users.id, { onDelete: "set null" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("invitations_token_key").on(t.tokenHash), index("invitations_tenant_idx").on(t.tenantId)]);

// ---- Accounting ---------------------------------------------------------------------------------

/** Account groups form a tree (Tally-style). `key` is set for template groups so code can find them. */
export const accountGroups = pgTable("account_groups", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  parentId: uuid("parent_id"),
  key: varchar("key", { length: 40 }),
  name: text("name").notNull(),
  nameHi: text("name_hi"),
  nature: varchar("nature", { length: 10 }).notNull(), // asset | liability | equity | income | expense
  pl: varchar("pl", { length: 10 }), // trading | operating (income/expense only)
  system: boolean("system").notNull().default(false),
  createdAt: createdAt(),
}, (t) => [
  uniqueIndex("account_groups_company_key").on(t.companyId, t.key),
  uniqueIndex("account_groups_company_name").on(t.companyId, sql`lower(${t.name})`),
]);

/** Ledger accounts. Customers and suppliers are accounts under Sundry Debtors/Creditors with party details. */
export const accounts = pgTable("accounts", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  groupId: uuid("group_id").notNull().references(() => accountGroups.id),
  key: varchar("key", { length: 40 }),
  name: text("name").notNull(),
  nameHi: text("name_hi"),
  code: varchar("code", { length: 20 }),
  /** Opening balance at books-begin date: positive = debit, negative = credit. */
  openingBalance: numeric("opening_balance", { precision: 18, scale: 2 }).notNull().default("0"),
  gstin: char("gstin", { length: 15 }),
  stateCode: char("state_code", { length: 2 }),
  pan: char("pan", { length: 10 }),
  /** A supplier registered as a micro, small or medium enterprise: the Udyam number and class (payment within 45 days, s. 43B(h)). */
  udyamNumber: varchar("udyam_number", { length: 19 }),
  msmeClass: varchar("msme_class", { length: 6 }),
  phone: varchar("phone", { length: 15 }),
  email: text("email"),
  bank: jsonb("bank").$type<{ accountNumber?: string; ifsc?: string; branch?: string }>(),
  /** Parties: billing address (needed on invoices, e-invoices and e-way bills) and credit terms. */
  address: jsonb("address").$type<{ line1?: string; line2?: string; city?: string; pincode?: string }>(),
  creditLimit: numeric("credit_limit", { precision: 18, scale: 2 }),
  creditDays: integer("credit_days"),
  /** Over the limit or with bills overdue too long: "warn" lets the sale through with a warning, "block" needs an owner's override. */
  creditControl: varchar("credit_control", { length: 8 }).notNull().default("warn"),
  blockOverdueDays: integer("block_overdue_days"),
  /** Interest on overdue bills, % a year, for the interest statement. */
  interestRate: numeric("interest_rate", { precision: 5, scale: 2 }),
  priceListId: uuid("price_list_id").references(() => priceLists.id, { onDelete: "set null" }),
  /** Brokers and agents: a ledger that earns commission on the sales it brings in (on money received). */
  isAgent: boolean("is_agent").notNull().default(false),
  commissionPct: numeric("commission_pct", { precision: 5, scale: 2 }),
  /** Customers: the agent and salesman filled in on their orders and invoices. */
  agentId: uuid("agent_id").references((): AnyPgColumn => accounts.id, { onDelete: "set null" }),
  salesmanId: uuid("salesman_id").references((): AnyPgColumn => employees.id, { onDelete: "set null" }),
  archived: boolean("archived").notNull().default(false),
  /** A related party (a director, a relative, a group company): its dealings are listed together for review. */
  relatedParty: boolean("related_party").notNull().default(false),
  /** Set when this duplicate was merged into another account: kept so old documents still read, closed to new ones. */
  mergedIntoId: uuid("merged_into_id").references((): AnyPgColumn => accounts.id, { onDelete: "set null" }),
  system: boolean("system").notNull().default(false),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (t) => [
  uniqueIndex("accounts_company_key").on(t.companyId, t.key),
  uniqueIndex("accounts_company_name").on(t.companyId, sql`lower(${t.name})`),
  index("accounts_group_idx").on(t.groupId),
]);

/** Company-specific automatic-posting ledger choices; old vouchers retain their original lines. */
export const ledgerPostingDefaults = pgTable("ledger_posting_defaults", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  roleKey: varchar("role_key", { length: 40 }).notNull(),
  accountId: uuid("account_id").notNull().references(() => accounts.id, { onDelete: "restrict" }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (t) => [
  uniqueIndex("ledger_posting_defaults_company_role").on(t.companyId, t.roleKey),
  index("ledger_posting_defaults_tenant_idx").on(t.tenantId),
]);

/**
 * Vouchers: journal, payment, receipt, contra now; sales/purchase documents post through the same
 * table later. `clientId` makes creation idempotent, so an offline device can safely retry a sync.
 */
export const vouchers = pgTable("vouchers", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  branchId: uuid("branch_id").references(() => branches.id),
  fiscalYearId: uuid("fiscal_year_id").notNull().references(() => fiscalYears.id),
  type: varchar("type", { length: 20 }).notNull(),
  number: varchar("number", { length: 16 }).notNull(),
  date: date("date").notNull(),
  narration: text("narration"),
  reference: varchar("reference", { length: 60 }),
  status: varchar("status", { length: 12 }).notNull().default("posted"), // posted | cancelled
  total: numeric("total", { precision: 18, scale: 2 }).notNull(),
  clientId: uuid("client_id"),
  deviceId: uuid("device_id").references(() => devices.id),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  cancelledBy: uuid("cancelled_by").references(() => users.id, { onDelete: "set null" }),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  cancelReason: text("cancel_reason"),
  createdAt: createdAt(),
}, (t) => [
  uniqueIndex("vouchers_number_key").on(t.companyId, t.fiscalYearId, t.type, t.number),
  uniqueIndex("vouchers_client_key").on(t.tenantId, t.clientId),
  index("vouchers_company_date").on(t.companyId, t.date),
]);

export const voucherLines = pgTable("voucher_lines", {
  id: id(),
  tenantId: tenantId(),
  voucherId: uuid("voucher_id").notNull().references(() => vouchers.id, { onDelete: "cascade" }),
  lineNo: integer("line_no").notNull(),
  accountId: uuid("account_id").notNull().references(() => accounts.id),
  debit: numeric("debit", { precision: 18, scale: 2 }).notNull().default("0"),
  credit: numeric("credit", { precision: 18, scale: 2 }).notNull().default("0"),
  narration: text("narration"),
}, (t) => [index("voucher_lines_voucher_idx").on(t.voucherId)]);

/**
 * Bill-wise settlement: a receipt (or payment) voucher says which bills of the party it pays and how much of
 * each. Whatever part of a voucher is not allocated here still settles the oldest bills first.
 */
export const billAllocations = pgTable("bill_allocations", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  voucherId: uuid("voucher_id").notNull().references(() => vouchers.id, { onDelete: "cascade" }),
  billVoucherId: uuid("bill_voucher_id").notNull().references(() => vouchers.id),
  amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),
}, (t) => [index("bill_allocations_voucher").on(t.voucherId), index("bill_allocations_bill").on(t.billVoucherId)]);

/**
 * The general ledger. Append-only: posting inserts rows, cancelling inserts reversing rows.
 * Reports read only this table (plus opening balances), never voucher lines.
 */
export const glEntries = pgTable("gl_entries", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  voucherId: uuid("voucher_id").notNull().references(() => vouchers.id),
  accountId: uuid("account_id").notNull().references(() => accounts.id),
  date: date("date").notNull(),
  debit: numeric("debit", { precision: 18, scale: 2 }).notNull().default("0"),
  credit: numeric("credit", { precision: 18, scale: 2 }).notNull().default("0"),
  isReversal: boolean("is_reversal").notNull().default(false),
  postedAt: timestamp("posted_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index("gl_entries_account_date").on(t.accountId, t.date),
  index("gl_entries_company_date").on(t.companyId, t.date),
  index("gl_entries_voucher_idx").on(t.voucherId),
]);

// ---- Inventory ----------------------------------------------------------------------------------

const qtyCol = (name: string) => numeric(name, { precision: 18, scale: 4 });
const moneyCol = (name: string) => numeric(name, { precision: 18, scale: 2 });

export const uoms = pgTable("uoms", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 10 }).notNull(), // GST UQC
  name: text("name").notNull(),
  nameHi: text("name_hi"),
  decimals: integer("decimals").notNull().default(0),
}, (t) => [uniqueIndex("uoms_company_code").on(t.companyId, t.code)]);

export const warehouses = pgTable("warehouses", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  branchId: uuid("branch_id").references(() => branches.id),
  name: text("name").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  archived: boolean("archived").notNull().default(false),
  /** Stock lying with a job worker (still ours) sits in a warehouse of its own. */
  jobWorkerId: uuid("job_worker_id"),
  /** Stock on consignment with a customer (sale or return, or our counter in their store): still ours. */
  consigneeId: uuid("consignee_id"),
  /** The company's one "In transit" warehouse: stock sent between stores and not yet received. */
  inTransit: boolean("in_transit").notNull().default(false),
  /** The company's "Quality hold" warehouse: received goods waiting to be inspected, not yet available to sell. */
  qualityHold: boolean("quality_hold").notNull().default(false),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("warehouses_company_name").on(t.companyId, sql`lower(${t.name})`)]);

// ---- Apparel: styles with colour and size variants ---------------------------------------------

/** An ordered list of sizes (XS to 3XL, waist 28 to 40, kids' ages, UK shoe sizes). */
export const sizeScales = pgTable("size_scales", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  sizes: text("sizes").array().notNull(),
  archived: boolean("archived").notNull().default(false),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("size_scales_company_name").on(t.companyId, sql`lower(${t.name})`)]);

export const colors = pgTable("colors", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  /** Short code used in SKUs (BLK, NVY). */
  code: varchar("code", { length: 8 }).notNull(),
  hex: varchar("hex", { length: 7 }),
  archived: boolean("archived").notNull().default(false),
}, (t) => [uniqueIndex("colors_company_name").on(t.companyId, sql`lower(${t.name})`), uniqueIndex("colors_company_code").on(t.companyId, t.code)]);

/**
 * Small named lists a business keeps for itself: brand, fabric, region, return reasons and the rest of
 * LOOKUP_KINDS in the domain package. One table, one row per entry, the kind says which list.
 */
export const lookups = pgTable("lookups", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  kind: varchar("kind", { length: 24 }).notNull(),
  name: text("name").notNull(),
  /** Optional short code (printed on labels, used in SKUs). */
  code: varchar("code", { length: 12 }),
  note: text("note"),
  /** Dated kinds only (a season runs from and to). */
  startsOn: date("starts_on"),
  endsOn: date("ends_on"),
  archived: boolean("archived").notNull().default(false),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("lookups_company_kind_name").on(t.companyId, t.kind, sql`lower(${t.name})`), index("lookups_company_kind").on(t.companyId, t.kind)]);

/**
 * A design (style) sold in colours and sizes. Each colour-size (and fit) combination is an ordinary item
 * with its own SKU and barcode, so stock, documents, POS and sync work on it unchanged; the style groups
 * them for grid entry, catalogues and reports, and carries the shared master data.
 */
export const styles = pgTable("styles", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 30 }).notNull(),
  name: text("name").notNull(),
  nameHi: text("name_hi"),
  brand: text("brand"),
  category: text("category"),
  season: text("season"),
  collection: text("collection"),
  hsn: varchar("hsn", { length: 8 }),
  gstRate: numeric("gst_rate", { precision: 5, scale: 2 }).notNull().default("5"),
  gstSlab: varchar("gst_slab", { length: 12 }),
  uomId: uuid("uom_id").notNull().references(() => uoms.id),
  purchaseRate: numeric("purchase_rate", { precision: 18, scale: 4 }).notNull().default("0"),
  saleRate: numeric("sale_rate", { precision: 18, scale: 4 }).notNull().default("0"),
  mrp: numeric("mrp", { precision: 18, scale: 2 }),
  sizeScaleId: uuid("size_scale_id").references(() => sizeScales.id),
  /** Optional third dimension (slim, regular; short, long). */
  fits: text("fits").array(),
  /** Up to ten descriptive values (fabric, sleeves, neck, fit, style, gender, type, material...), by list name. */
  attributes: jsonb("attributes").$type<Record<string, string>>().notNull().default(sql`'{}'::jsonb`),
  imageFileId: uuid("image_file_id"),
  archived: boolean("archived").notNull().default(false),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (t) => [uniqueIndex("styles_company_code").on(t.companyId, sql`lower(${t.code})`), index("styles_company_name").on(t.companyId, t.name)]);

export const items = pgTable("items", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  nameHi: text("name_hi"),
  tileBrand: text("tile_brand"),
  tileFinish: text("tile_finish"),
  sku: varchar("sku", { length: 40 }),
  barcode: varchar("barcode", { length: 40 }),
  kind: varchar("kind", { length: 10 }).notNull().default("goods"), // goods | service
  hsn: varchar("hsn", { length: 8 }),
  gstRate: numeric("gst_rate", { precision: 5, scale: 2 }).notNull().default("18"),
  /** GST by price per piece (apparel, footwear): when set, gstRate is only the fallback. */
  gstSlab: varchar("gst_slab", { length: 12 }),
  /** Pieces in one unit for the price test (a set of four sold as one is 4). */
  slabPieces: integer("slab_pieces").notNull().default(1),
  cessRate: numeric("cess_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  uomId: uuid("uom_id").notNull().references(() => uoms.id),
  purchaseRate: numeric("purchase_rate", { precision: 18, scale: 4 }).notNull().default("0"),
  saleRate: numeric("sale_rate", { precision: 18, scale: 4 }).notNull().default("0"),
  mrp: moneyCol("mrp"),
  reorderLevel: qtyCol("reorder_level"),
  reorderQty: qtyCol("reorder_qty"),
  /** Pieces one scan or tap adds on the counter (a pack of six sold as six); empty means one. */
  defaultQty: qtyCol("default_qty"),
  /** A short code typed or scanned in place of the full barcode. */
  shortCode: varchar("short_code", { length: 12 }),
  trackBatches: boolean("track_batches").notNull().default(false),
  /** Every piece has its own serial number: they are entered when the goods come in and named when the piece is sold. */
  trackSerials: boolean("track_serials").notNull().default(false),
  leadTimeDays: integer("lead_time_days").notNull().default(0),
  /** Apparel variant: the style it belongs to and its colour, size and fit. */
  styleId: uuid("style_id").references(() => styles.id),
  color: text("color"),
  size: text("size"),
  fit: text("fit"),
  /** Position in the size scale, for grids and reports. */
  sizeOrder: integer("size_order").notNull().default(0),
  /** A set (ratio pack) billed as one unit; stock moves as its pieces (item_pack_lines). */
  isPack: boolean("is_pack").notNull().default(false),
  archived: boolean("archived").notNull().default(false),
  /** Set when this duplicate was merged into another item. */
  mergedIntoId: uuid("merged_into_id").references((): AnyPgColumn => items.id, { onDelete: "set null" }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (t) => [
  index("items_style").on(t.styleId),
  uniqueIndex("items_company_name").on(t.companyId, sql`lower(${t.name})`),
  uniqueIndex("items_company_sku").on(t.companyId, t.sku),
  uniqueIndex("items_company_short_code").on(t.companyId, sql`upper(${t.shortCode})`).where(sql`${t.shortCode} is not null`),
  index("items_company_barcode").on(t.companyId, t.barcode),
]);

/** A lock on one kind of document: nothing of that kind can be made or changed on or before this date, whatever the period lock says. */
export const processLocks = pgTable("process_locks", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  docType: varchar("doc_type", { length: 30 }).notNull(),
  lockedUpTo: date("locked_up_to").notNull(),
  updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
  updatedAt: updatedAt(),
}, (t) => [uniqueIndex("process_locks_doc").on(t.companyId, t.docType)]);

/** A bulk rate change asked for by one person and applied only when a second person with the right approves it. */
export const rateUpdateRequests = pgTable("rate_update_requests", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  input: jsonb("input").$type<Record<string, unknown>>().notNull(),
  summary: jsonb("summary").$type<Record<string, unknown>>().notNull(),
  status: varchar("status", { length: 10 }).notNull().default("pending"), // pending | approved | rejected
  requestedBy: uuid("requested_by").references(() => users.id, { onDelete: "set null" }),
  decidedBy: uuid("decided_by").references(() => users.id, { onDelete: "set null" }),
  decisionNote: text("decision_note"),
  createdAt: createdAt(),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
}, (t) => [index("rate_update_requests_status").on(t.companyId, t.status)]);

/** How many times a document has been printed and who printed it last; the first print and each reprint need different rights. */
export const docPrints = pgTable("doc_prints", {
  id: id(),
  tenantId: tenantId(),
  docType: varchar("doc_type", { length: 20 }).notNull(),
  docId: uuid("doc_id").notNull(),
  count: integer("count").notNull().default(0),
  lastAt: timestamp("last_at", { withTimezone: true }).notNull().defaultNow(),
  lastBy: uuid("last_by").references(() => users.id, { onDelete: "set null" }),
}, (t) => [uniqueIndex("doc_prints_doc").on(t.tenantId, t.docType, t.docId)]);

/** One re-labelling voucher: what existing items were called or priced before and after. The barcodes do not change, so labels already on the goods still scan. */
export const relabels = pgTable("relabels", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  number: varchar("number", { length: 20 }).notNull(),
  date: date("date").notNull(),
  reason: text("reason").notNull(),
  changes: jsonb("changes").$type<{ itemId: string; before: Record<string, unknown>; after: Record<string, unknown> }[]>().notNull(),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("relabels_number").on(t.companyId, t.number)]);

/**
 * Mark-up by purchase rate: from this cost upward, the MRP is cost plus the mark-up, and the sale rate is that MRP less the first mark-down
 * (a second mark-down gives the lower rate for sales and clearance). Filled in on receipt so a challan prices itself.
 */
export const marginBands = pgTable("margin_bands", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  fromRate: numeric("from_rate", { precision: 12, scale: 2 }).notNull(),
  markupPct: numeric("markup_pct", { precision: 7, scale: 2 }).notNull(),
  markdown1Pct: numeric("markdown1_pct", { precision: 5, scale: 2 }).notNull().default("0"),
  markdown2Pct: numeric("markdown2_pct", { precision: 5, scale: 2 }).notNull().default("0"),
}, (t) => [uniqueIndex("margin_bands_from").on(t.companyId, t.fromRate)]);

/** Minimum and maximum stock an item should hold in one warehouse (a branch's shelf), for the reorder view. */
export const stockLimits = pgTable("stock_limits", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  itemId: uuid("item_id").notNull().references(() => items.id, { onDelete: "cascade" }),
  warehouseId: uuid("warehouse_id").notNull().references(() => warehouses.id, { onDelete: "cascade" }),
  minQty: qtyCol("min_qty").notNull().default("0"),
  maxQty: qtyCol("max_qty").notNull().default("0"),
  updatedAt: updatedAt(),
}, (t) => [uniqueIndex("stock_limits_item_warehouse").on(t.itemId, t.warehouseId), index("stock_limits_warehouse").on(t.warehouseId)]);

/** Other units an item is bought or sold in (a dozen = 12 pieces); stock is always kept in the item's own unit. */
export const itemUnits = pgTable("item_units", {
  id: id(),
  tenantId: tenantId(),
  itemId: uuid("item_id").notNull().references(() => items.id, { onDelete: "cascade" }),
  uomId: uuid("uom_id").notNull().references(() => uoms.id),
  factor: numeric("factor", { precision: 18, scale: 4 }).notNull(),
}, (t) => [uniqueIndex("item_units_item_uom").on(t.itemId, t.uomId)]);

/**
 * Party price lists (wholesale, distributor, retailer): a discount off the item's sale rate, with
 * fixed rates for chosen items. A customer on a list gets its rates on new sales documents.
 */
export const priceLists = pgTable("price_lists", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 60 }).notNull(),
  discountPct: numeric("discount_pct", { precision: 5, scale: 2 }).notNull().default("0"),
  archived: boolean("archived").notNull().default(false),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("price_lists_name").on(t.companyId, sql`lower(${t.name})`)]);

export const priceListItems = pgTable("price_list_items", {
  id: id(),
  tenantId: tenantId(),
  priceListId: uuid("price_list_id").notNull().references(() => priceLists.id, { onDelete: "cascade" }),
  itemId: uuid("item_id").notNull().references(() => items.id, { onDelete: "cascade" }),
  rate: numeric("rate", { precision: 18, scale: 4 }).notNull(),
}, (t) => [uniqueIndex("price_list_items_item").on(t.priceListId, t.itemId)]);

/** The pieces in a set: selling or buying one set moves these quantities of each piece. */
export const itemPackLines = pgTable("item_pack_lines", {
  id: id(),
  tenantId: tenantId(),
  packItemId: uuid("pack_item_id").notNull().references(() => items.id, { onDelete: "cascade" }),
  itemId: uuid("item_id").notNull().references(() => items.id),
  qty: numeric("qty", { precision: 18, scale: 4 }).notNull(),
}, (t) => [index("item_pack_lines_pack").on(t.packItemId)]);

/** A box changes packing records only; stock and accounting remain untouched. */
export const packingBoxes = pgTable("packing_boxes", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 40 }).notNull(),
  status: varchar("status", { length: 8 }).notNull().default("open"), // open | packed
  /** The delivery challan this carton travels with, once it is on a packing list. */
  deliveryNoteId: uuid("delivery_note_id").references(() => deliveryNotes.id, { onDelete: "set null" }),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (t) => [
  uniqueIndex("packing_boxes_company_code").on(t.companyId, t.code),
  index("packing_boxes_note").on(t.deliveryNoteId),
  index("packing_boxes_company_status").on(t.companyId, t.status, t.createdAt),
  index("packing_boxes_tenant_idx").on(t.tenantId),
]);

export const packingBoxLines = pgTable("packing_box_lines", {
  id: id(),
  tenantId: tenantId(),
  boxId: uuid("box_id").notNull().references(() => packingBoxes.id, { onDelete: "cascade" }),
  itemId: uuid("item_id").notNull().references(() => items.id, { onDelete: "restrict" }),
  qty: numeric("qty", { precision: 18, scale: 4 }).notNull(),
  createdAt: createdAt(),
}, (t) => [
  uniqueIndex("packing_box_lines_box_item").on(t.boxId, t.itemId),
  index("packing_box_lines_tenant_idx").on(t.tenantId),
]);

export interface PackingBoxContents {
  itemId: string;
  name: string;
  sku: string | null;
  barcode: string | null;
  color: string | null;
  size: string | null;
  fit: string | null;
  qty: string;
}

/** Operation snapshots are append-only so every repack/reopen remains auditable. */
export const packingBoxEvents = pgTable("packing_box_events", {
  id: id(),
  tenantId: tenantId(),
  boxId: uuid("box_id").notNull().references(() => packingBoxes.id, { onDelete: "cascade" }),
  actorId: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
  operation: varchar("operation", { length: 12 }).notNull(), // create | repack | reopen
  sequence: integer("sequence").notNull(),
  reason: text("reason"),
  beforeContents: jsonb("before_contents").$type<PackingBoxContents[]>().notNull().default([]),
  afterContents: jsonb("after_contents").$type<PackingBoxContents[]>().notNull().default([]),
  createdAt: createdAt(),
}, (t) => [
  uniqueIndex("packing_box_events_box_sequence").on(t.boxId, t.sequence),
  index("packing_box_events_tenant_idx").on(t.tenantId),
]);

/**
 * Stock ledger: every movement of every item in every warehouse. Append-only; cancelling a document
 * posts reversing rows. Values are not stored — they are computed by replaying the ledger with the
 * company's valuation method (packages/domain valueStock), so a back-dated entry never needs reposting.
 */
export const stockLedger = pgTable("stock_ledger", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  itemId: uuid("item_id").notNull().references(() => items.id),
  warehouseId: uuid("warehouse_id").notNull().references(() => warehouses.id),
  date: date("date").notNull(),
  qtyIn: qtyCol("qty_in").notNull().default("0"),
  qtyOut: qtyCol("qty_out").notNull().default("0"),
  /** Cost per unit for incoming rows. */
  rate: numeric("rate", { precision: 18, scale: 4 }).notNull().default("0"),
  batchNo: varchar("batch_no", { length: 40 }),
  expiry: date("expiry"),
  sourceType: varchar("source_type", { length: 20 }).notNull(), // stock_journal | grn | purchase_bill | purchase_return
  sourceId: uuid("source_id").notNull(),
  isReversal: boolean("is_reversal").notNull().default(false),
  postedAt: timestamp("posted_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index("stock_ledger_item_wh_date").on(t.itemId, t.warehouseId, t.date, t.id),
  index("stock_ledger_company_date").on(t.companyId, t.date),
  index("stock_ledger_source").on(t.sourceType, t.sourceId),
]);

/** Opening stock, adjustments (physical count), transfers between warehouses and issues (consumption). */
export const stockJournals = pgTable("stock_journals", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  number: varchar("number", { length: 16 }).notNull(),
  date: date("date").notNull(),
  kind: varchar("kind", { length: 12 }).notNull(), // opening | adjustment | transfer | issue
  narration: text("narration"),
  status: varchar("status", { length: 12 }).notNull().default("posted"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("stock_journals_number").on(t.companyId, t.number)]);

export const stockJournalLines = pgTable("stock_journal_lines", {
  id: id(),
  tenantId: tenantId(),
  journalId: uuid("journal_id").notNull().references(() => stockJournals.id, { onDelete: "cascade" }),
  lineNo: integer("line_no").notNull(),
  itemId: uuid("item_id").notNull().references(() => items.id),
  warehouseId: uuid("warehouse_id").notNull().references(() => warehouses.id),
  toWarehouseId: uuid("to_warehouse_id").references(() => warehouses.id),
  qtyIn: qtyCol("qty_in").notNull().default("0"),
  qtyOut: qtyCol("qty_out").notNull().default("0"),
  rate: numeric("rate", { precision: 18, scale: 4 }).notNull().default("0"),
  batchNo: varchar("batch_no", { length: 40 }),
  expiry: date("expiry"),
});

/**
 * A physical stock count of one store: what the books expected when counting started, what was counted
 * (by scanning or typing), and, once approved, the stock journal that put the books right.
 */
export const stockCounts = pgTable("stock_counts", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  warehouseId: uuid("warehouse_id").notNull().references(() => warehouses.id),
  number: varchar("number", { length: 16 }).notNull(),
  name: varchar("name", { length: 80 }).notNull(),
  /** Which goods: a brand, a category or a design (all goods in the store when empty). */
  scope: jsonb("scope").$type<{ brand?: string; category?: string; styleId?: string; season?: string; itemIds?: string[] }>().notNull().default({}),
  /** A spot check: the difference is recorded and reported but stock is not adjusted. */
  verifyOnly: boolean("verify_only").notNull().default(false),
  /** Counters do not see what the books expect. */
  blind: boolean("blind").notNull().default(true),
  status: varchar("status", { length: 10 }).notNull().default("counting"), // counting | submitted | approved | cancelled
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  submittedBy: uuid("submitted_by").references(() => users.id, { onDelete: "set null" }),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  approvedBy: uuid("approved_by").references(() => users.id, { onDelete: "set null" }),
  reason: text("reason"),
  journalId: uuid("journal_id").references(() => stockJournals.id),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("stock_counts_number").on(t.companyId, t.number)]);

export const stockCountLines = pgTable("stock_count_lines", {
  id: id(),
  tenantId: tenantId(),
  countId: uuid("count_id").notNull().references(() => stockCounts.id, { onDelete: "cascade" }),
  itemId: uuid("item_id").notNull().references(() => items.id),
  expected: qtyCol("expected").notNull().default("0"),
  counted: qtyCol("counted").notNull().default("0"),
  /** Cost per piece when counting started, to value the difference. */
  rate: numeric("rate", { precision: 18, scale: 4 }).notNull().default("0"),
}, (t) => [uniqueIndex("stock_count_lines_item").on(t.countId, t.itemId)]);

// ---- Purchasing ---------------------------------------------------------------------------------

/** Tax columns shared by purchase documents and their lines. */
const taxCols = () => ({
  taxable: moneyCol("taxable").notNull().default("0"),
  cgst: moneyCol("cgst").notNull().default("0"),
  sgst: moneyCol("sgst").notNull().default("0"),
  utgst: moneyCol("utgst").notNull().default("0"),
  igst: moneyCol("igst").notNull().default("0"),
  cess: moneyCol("cess").notNull().default("0"),
  total: moneyCol("total").notNull().default("0"),
});

const purchaseLineCols = () => ({
  id: id(),
  tenantId: tenantId(),
  lineNo: integer("line_no").notNull(),
  itemId: uuid("item_id").notNull().references(() => items.id),
  description: text("description"),
  qty: qtyCol("qty").notNull(),
  rate: numeric("rate", { precision: 18, scale: 4 }).notNull(),
  discount: moneyCol("discount").notNull().default("0"),
  gstRate: numeric("gst_rate", { precision: 5, scale: 2 }).notNull(),
  cessRate: numeric("cess_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  ...taxCols(),
});

export const purchaseOrders = pgTable("purchase_orders", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  branchId: uuid("branch_id").notNull().references(() => branches.id),
  supplierId: uuid("supplier_id").notNull().references(() => accounts.id),
  number: varchar("number", { length: 16 }).notNull(),
  date: date("date").notNull(),
  expectedOn: date("expected_on"),
  status: varchar("status", { length: 12 }).notNull().default("open"), // open | partial | received | closed | cancelled
  /** approved (within the limit, or approved by someone with the right) | pending | rejected. Goods cannot be received or billed on an order that is not approved. */
  approvalStatus: varchar("approval_status", { length: 10 }).notNull().default("approved"),
  approvedBy: uuid("approved_by").references(() => users.id, { onDelete: "set null" }),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  approvalNote: varchar("approval_note", { length: 200 }),
  supplyKind: varchar("supply_kind", { length: 8 }).notNull(),
  narration: text("narration"),
  ...taxCols(),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("purchase_orders_number").on(t.companyId, t.number)]);

export const purchaseOrderLines = pgTable("purchase_order_lines", {
  ...purchaseLineCols(),
  orderId: uuid("order_id").notNull().references(() => purchaseOrders.id, { onDelete: "cascade" }),
  receivedQty: qtyCol("received_qty").notNull().default("0"),
  billedQty: qtyCol("billed_qty").notNull().default("0"),
});

export const goodsReceipts = pgTable("goods_receipts", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  supplierId: uuid("supplier_id").notNull().references(() => accounts.id),
  orderId: uuid("order_id").references(() => purchaseOrders.id),
  warehouseId: uuid("warehouse_id").notNull().references(() => warehouses.id),
  number: varchar("number", { length: 16 }).notNull(),
  date: date("date").notNull(),
  supplierChallan: varchar("supplier_challan", { length: 40 }),
  /** How the goods came: the transporter and their lorry receipt. */
  transporter: varchar("transporter", { length: 80 }),
  lrNumber: varchar("lr_number", { length: 30 }),
  lrDate: date("lr_date"),
  status: varchar("status", { length: 12 }).notNull().default("posted"), // posted | billed | cancelled
  narration: text("narration"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("goods_receipts_number").on(t.companyId, t.number)]);

export const goodsReceiptLines = pgTable("goods_receipt_lines", {
  id: id(),
  tenantId: tenantId(),
  receiptId: uuid("receipt_id").notNull().references(() => goodsReceipts.id, { onDelete: "cascade" }),
  lineNo: integer("line_no").notNull(),
  itemId: uuid("item_id").notNull().references(() => items.id),
  orderLineId: uuid("order_line_id").references(() => purchaseOrderLines.id),
  qty: qtyCol("qty").notNull(),
  rate: numeric("rate", { precision: 18, scale: 4 }).notNull(),
  /** Separately documented inward acquisition cost per piece, excluding recoverable GST. */
  landedCostPerUnit: numeric("landed_cost_per_unit", { precision: 18, scale: 4 }).notNull().default("0"),
  landedCostNote: varchar("landed_cost_note", { length: 160 }),
  /** The MRP set for the item on this receipt (the item's MRP is updated to it). */
  mrp: moneyCol("mrp"),
  batchNo: varchar("batch_no", { length: 40 }),
  expiry: date("expiry"),
  billedQty: qtyCol("billed_qty").notNull().default("0"),
  /** What the supplier's challan said, and what did not make it into stock: short (not sent), damaged (sent broken), on quality hold, or sent back. `qty` is what was accepted into stock. */
  challanQty: qtyCol("challan_qty"),
  shortQty: qtyCol("short_qty").notNull().default("0"),
  damagedQty: qtyCol("damaged_qty").notNull().default("0"),
  /** Why the damaged pieces are damaged (stitching, fabric, colour, size, print, packing, other). */
  defectCode: varchar("defect_code", { length: 20 }),
  holdQty: qtyCol("hold_qty").notNull().default("0"),
  returnedQty: qtyCol("returned_qty").notNull().default("0"),
});

export const goodsReceiptLandedCharges = pgTable("goods_receipt_landed_charges", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  receiptId: uuid("receipt_id").notNull().references(() => goodsReceipts.id, { onDelete: "cascade" }),
  description: varchar("description", { length: 120 }).notNull(),
  sourceDocument: varchar("source_document", { length: 120 }).notNull(),
  grossAmount: moneyCol("gross_amount").notNull(),
  recoverableGst: moneyCol("recoverable_gst").notNull().default("0"),
  netAmount: moneyCol("net_amount").notNull(),
  allocationBasis: varchar("allocation_basis", { length: 16 }).notNull(), // direct | weight | volume | net_value | units
  createdAt: createdAt(),
}, (t) => [index("goods_receipt_landed_charges_receipt_idx").on(t.receiptId), index("goods_receipt_landed_charges_tenant_idx").on(t.tenantId)]);

export const goodsReceiptLandedAllocations = pgTable("goods_receipt_landed_allocations", {
  id: id(),
  tenantId: tenantId(),
  chargeId: uuid("charge_id").notNull().references(() => goodsReceiptLandedCharges.id, { onDelete: "cascade" }),
  receiptLineId: uuid("receipt_line_id").notNull().references(() => goodsReceiptLines.id, { onDelete: "cascade" }),
  allocatedAmount: moneyCol("allocated_amount").notNull(),
}, (t) => [uniqueIndex("goods_receipt_landed_allocations_charge_line").on(t.chargeId, t.receiptLineId), index("goods_receipt_landed_allocations_tenant_idx").on(t.tenantId)]);

/** Supplier invoices. Posting creates a GL voucher (type "purchase"); lines not received on a GRN also move stock. */
export const purchaseBills = pgTable("purchase_bills", {
  id: id(),
  tenantId: tenantId(),
  projectId: uuid("project_id"),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  branchId: uuid("branch_id").notNull().references(() => branches.id),
  supplierId: uuid("supplier_id").notNull().references(() => accounts.id),
  orderId: uuid("order_id").references(() => purchaseOrders.id),
  voucherId: uuid("voucher_id").references(() => vouchers.id),
  number: varchar("number", { length: 16 }).notNull(),
  date: date("date").notNull(),
  supplierInvoiceNo: varchar("supplier_invoice_no", { length: 16 }).notNull(),
  supplierInvoiceDate: date("supplier_invoice_date").notNull(),
  dueOn: date("due_on"),
  supplyKind: varchar("supply_kind", { length: 8 }).notNull(),
  reverseCharge: boolean("reverse_charge").notNull().default(false),
  ...taxCols(),
  roundOff: moneyCol("round_off").notNull().default("0"),
  status: varchar("status", { length: 12 }).notNull().default("posted"), // posted | cancelled
  narration: text("narration"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [
  uniqueIndex("purchase_bills_number").on(t.companyId, t.number),
  // The same supplier invoice can't be booked twice (a common and costly mistake).
  uniqueIndex("purchase_bills_supplier_invoice").on(t.companyId, t.supplierId, t.supplierInvoiceNo, t.supplierInvoiceDate),
]);

export const purchaseBillLines = pgTable("purchase_bill_lines", {
  ...purchaseLineCols(),
  billId: uuid("bill_id").notNull().references(() => purchaseBills.id, { onDelete: "cascade" }),
  orderLineId: uuid("order_line_id").references(() => purchaseOrderLines.id),
  receiptLineId: uuid("receipt_line_id").references(() => goodsReceiptLines.id),
  warehouseId: uuid("warehouse_id").references(() => warehouses.id),
  batchNo: varchar("batch_no", { length: 40 }),
  expiry: date("expiry"),
  returnedQty: qtyCol("returned_qty").notNull().default("0"),
});

/** Purchase returns (debit notes against a bill): stock goes out, the supplier owes us. */
export const purchaseReturns = pgTable("purchase_returns", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  billId: uuid("bill_id").notNull().references(() => purchaseBills.id),
  supplierId: uuid("supplier_id").notNull().references(() => accounts.id),
  voucherId: uuid("voucher_id").references(() => vouchers.id),
  warehouseId: uuid("warehouse_id").notNull().references(() => warehouses.id),
  number: varchar("number", { length: 16 }).notNull(),
  date: date("date").notNull(),
  reason: text("reason").notNull(),
  /** goods: stock goes back to the supplier. shortage: the goods never arrived, so only the amount owed changes and no stock moves. */
  kind: varchar("kind", { length: 8 }).notNull().default("goods"),
  supplyKind: varchar("supply_kind", { length: 8 }).notNull(),
  ...taxCols(),
  roundOff: moneyCol("round_off").notNull().default("0"),
  status: varchar("status", { length: 12 }).notNull().default("posted"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("purchase_returns_number").on(t.companyId, t.number)]);

export const purchaseReturnLines = pgTable("purchase_return_lines", {
  ...purchaseLineCols(),
  returnId: uuid("return_id").notNull().references(() => purchaseReturns.id, { onDelete: "cascade" }),
  billLineId: uuid("bill_line_id").notNull().references(() => purchaseBillLines.id),
});

/** A price a supplier has quoted for an item, kept so quotes can be compared side by side before an order is placed. */
export const supplierQuotes = pgTable("supplier_quotes", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  supplierId: uuid("supplier_id").notNull().references(() => accounts.id),
  itemId: uuid("item_id").notNull().references(() => items.id),
  /** Quoted price per piece before GST. */
  rate: numeric("rate", { precision: 18, scale: 4 }).notNull(),
  /** Freight and other costs the buyer expects per piece on top of the rate, before GST. */
  extraCost: numeric("extra_cost", { precision: 18, scale: 4 }).notNull().default("0"),
  minQty: qtyCol("min_qty"),
  leadDays: integer("lead_days"),
  quotedOn: date("quoted_on", { mode: "string" }).notNull(),
  validUntil: date("valid_until", { mode: "string" }),
  note: varchar("note", { length: 200 }),
  archived: boolean("archived").notNull().default(false),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [index("supplier_quotes_item").on(t.companyId, t.itemId), index("supplier_quotes_tenant_idx").on(t.tenantId)]);

// ---- Sales --------------------------------------------------------------------------------------

type Address = { line1?: string; line2?: string; city?: string; pincode?: string; stateCode?: string };

const salesLineCols = () => ({
  ...purchaseLineCols(),
  warehouseId: uuid("warehouse_id").references(() => warehouses.id),
  batchNo: varchar("batch_no", { length: 40 }),
});

/**
 * Quotations (estimates) and proforma invoices: no stock or accounts effect; converted into an order
 * or an invoice. A proforma asks for payment (often an advance) before the goods go; it is not a tax invoice.
 */
export const quotations = pgTable("quotations", {
  id: id(),
  tenantId: tenantId(),
  kind: varchar("kind", { length: 10 }).notNull().default("quotation"), // quotation | proforma
  advanceDue: moneyCol("advance_due"),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  branchId: uuid("branch_id").notNull().references(() => branches.id),
  customerId: uuid("customer_id").notNull().references(() => accounts.id),
  number: varchar("number", { length: 16 }).notNull(),
  date: date("date").notNull(),
  validUntil: date("valid_until").notNull(),
  placeOfSupply: char("place_of_supply", { length: 2 }).notNull(),
  supplyKind: varchar("supply_kind", { length: 8 }).notNull(),
  lut: boolean("lut").notNull().default(false),
  status: varchar("status", { length: 12 }).notNull().default("open"), // open | accepted | declined | converted | cancelled
  customerReference: varchar("customer_reference", { length: 40 }),
  narration: text("narration"),
  terms: text("terms"),
  ...taxCols(),
  convertedKind: varchar("converted_kind", { length: 8 }), // order | invoice
  convertedId: uuid("converted_id"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("quotations_number").on(t.companyId, t.number)]);

export const quotationLines = pgTable("quotation_lines", {
  ...purchaseLineCols(),
  quotationId: uuid("quotation_id").notNull().references(() => quotations.id, { onDelete: "cascade" }),
});

export const salesOrders = pgTable("sales_orders", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  branchId: uuid("branch_id").notNull().references(() => branches.id),
  customerId: uuid("customer_id").notNull().references(() => accounts.id),
  quotationId: uuid("quotation_id").references(() => quotations.id),
  number: varchar("number", { length: 16 }).notNull(),
  date: date("date").notNull(),
  deliverBy: date("deliver_by"),
  placeOfSupply: char("place_of_supply", { length: 2 }).notNull(),
  supplyKind: varchar("supply_kind", { length: 8 }).notNull(),
  status: varchar("status", { length: 12 }).notNull().default("open"), // open | partial | delivered | closed | cancelled
  customerReference: varchar("customer_reference", { length: 40 }),
  narration: text("narration"),
  ...taxCols(),
  agentId: uuid("agent_id").references(() => accounts.id),
  agentPct: numeric("agent_pct", { precision: 5, scale: 2 }),
  salesmanId: uuid("salesman_id").references(() => employees.id),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("sales_orders_number").on(t.companyId, t.number)]);

export const salesOrderLines = pgTable("sales_order_lines", {
  ...purchaseLineCols(),
  orderId: uuid("order_id").notNull().references(() => salesOrders.id, { onDelete: "cascade" }),
  deliveredQty: qtyCol("delivered_qty").notNull().default("0"),
  invoicedQty: qtyCol("invoiced_qty").notNull().default("0"),
});

/**
 * Stock set aside for one line of a sales order. What it still holds is worked out, never stored: the lesser of `qty` and what
 * the line has yet to deliver, and nothing once the order is closed or cancelled or the reservation is released.
 */
export const stockReservations = pgTable("stock_reservations", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  orderLineId: uuid("order_line_id").notNull().references(() => salesOrderLines.id, { onDelete: "cascade" }),
  itemId: uuid("item_id").notNull().references(() => items.id),
  qty: qtyCol("qty").notNull(),
  released: boolean("released").notNull().default(false),
  reservedBy: uuid("reserved_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("stock_reservations_line").on(t.orderLineId), index("stock_reservations_item").on(t.companyId, t.itemId), index("stock_reservations_tenant_idx").on(t.tenantId)]);

/** A shelf, rack or bay inside a godown, named by its own short code ("A-03-2"). Bins say where pieces sit; they are not a second stock ledger. */
export const warehouseBins = pgTable("warehouse_bins", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  warehouseId: uuid("warehouse_id").notNull().references(() => warehouses.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 20 }).notNull(),
  note: varchar("note", { length: 80 }),
  archived: boolean("archived").notNull().default(false),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("warehouse_bins_code").on(t.warehouseId, t.code), index("warehouse_bins_tenant_idx").on(t.tenantId)]);

/** How many pieces of an item have been put away in a bin. The sum over a godown's bins should not exceed what the godown holds. */
export const binStock = pgTable("bin_stock", {
  id: id(),
  tenantId: tenantId(),
  binId: uuid("bin_id").notNull().references(() => warehouseBins.id, { onDelete: "cascade" }),
  itemId: uuid("item_id").notNull().references(() => items.id),
  qty: qtyCol("qty").notNull(),
}, (t) => [uniqueIndex("bin_stock_bin_item").on(t.binId, t.itemId), index("bin_stock_item").on(t.itemId), index("bin_stock_tenant_idx").on(t.tenantId)]);

/** What to take from the godown for one order: the lines with stock set aside, each with the bin to take it from. */
export const pickLists = pgTable("pick_lists", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  orderId: uuid("order_id").notNull().references(() => salesOrders.id),
  warehouseId: uuid("warehouse_id").notNull().references(() => warehouses.id),
  number: varchar("number", { length: 16 }).notNull(),
  status: varchar("status", { length: 10 }).notNull().default("open"), // open | done | cancelled
  /** Scans that did not belong: { kind: wrong | extra, code, at }. */
  exceptions: jsonb("exceptions").$type<{ kind: string; code: string; at: string }[]>().notNull().default([]),
  /** Lines the picker accepted as short when finishing. */
  acceptedShort: boolean("accepted_short").notNull().default(false),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
}, (t) => [uniqueIndex("pick_lists_number").on(t.companyId, t.number), index("pick_lists_order").on(t.orderId)]);

export const pickListLines = pgTable("pick_list_lines", {
  id: id(),
  tenantId: tenantId(),
  listId: uuid("list_id").notNull().references(() => pickLists.id, { onDelete: "cascade" }),
  lineNo: integer("line_no").notNull(),
  orderLineId: uuid("order_line_id").notNull().references(() => salesOrderLines.id),
  itemId: uuid("item_id").notNull().references(() => items.id),
  /** The bin to take it from; null when no bin holds it (the picker has to find it). */
  binId: uuid("bin_id").references(() => warehouseBins.id),
  toPick: qtyCol("to_pick").notNull(),
  picked: qtyCol("picked").notNull().default("0"),
}, (t) => [index("pick_list_lines_list").on(t.listId), index("pick_list_lines_tenant_idx").on(t.tenantId)]);

/**
 * A delivery order: the instruction to dispatch, between the sales order and the challan. It moves no stock
 * and posts nothing; challans are made against its lines, and the bill is compared with what was ordered to go.
 */
export const deliveryOrders = pgTable("delivery_orders", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").notNull().references(() => accounts.id),
  orderId: uuid("order_id").references(() => salesOrders.id),
  number: varchar("number", { length: 16 }).notNull(),
  date: date("date").notNull(),
  deliverBy: date("deliver_by"),
  transporter: varchar("transporter", { length: 80 }),
  status: varchar("status", { length: 10 }).notNull().default("open"), // open | closed | cancelled
  narration: text("narration"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("delivery_orders_number").on(t.companyId, t.number)]);

export const deliveryOrderLines = pgTable("delivery_order_lines", {
  id: id(),
  tenantId: tenantId(),
  deliveryOrderId: uuid("delivery_order_id").notNull().references(() => deliveryOrders.id, { onDelete: "cascade" }),
  lineNo: integer("line_no").notNull(),
  itemId: uuid("item_id").notNull().references(() => items.id),
  orderLineId: uuid("order_line_id").references(() => salesOrderLines.id),
  qty: qtyCol("qty").notNull(),
});

/**
 * Delivery challans (Rule 55): goods move without a tax invoice. The reason says why: a supply whose
 * invoice follows, sale on approval (invoice within six months, s. 31(7), or the goods come back),
 * job work, a movement that is not a supply, a supply in lots, an exhibition, or another reason.
 * Values and tax are printed on the challan as the rule requires.
 */
export const deliveryNotes = pgTable("delivery_notes", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").notNull().references(() => accounts.id),
  orderId: uuid("order_id").references(() => salesOrders.id),
  warehouseId: uuid("warehouse_id").notNull().references(() => warehouses.id),
  number: varchar("number", { length: 16 }).notNull(),
  date: date("date").notNull(),
  status: varchar("status", { length: 12 }).notNull().default("posted"), // posted | invoiced | closed | cancelled
  reason: varchar("reason", { length: 12 }).notNull().default("supply"), // supply | approval | job_work | not_supply | lots | exhibition | other
  placeOfSupply: char("place_of_supply", { length: 2 }),
  supplyKind: varchar("supply_kind", { length: 8 }),
  transporter: varchar("transporter", { length: 80 }),
  vehicleNo: varchar("vehicle_no", { length: 16 }),
  ...taxCols(),
  narration: text("narration"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("delivery_notes_number").on(t.companyId, t.number)]);

export const deliveryNoteLines = pgTable("delivery_note_lines", {
  id: id(),
  tenantId: tenantId(),
  noteId: uuid("note_id").notNull().references(() => deliveryNotes.id, { onDelete: "cascade" }),
  lineNo: integer("line_no").notNull(),
  itemId: uuid("item_id").notNull().references(() => items.id),
  orderLineId: uuid("order_line_id").references(() => salesOrderLines.id),
  /** The delivery order line this challan line dispatches. */
  deliveryOrderLineId: uuid("delivery_order_line_id").references(() => deliveryOrderLines.id),
  qty: qtyCol("qty").notNull(),
  batchNo: varchar("batch_no", { length: 40 }),
  invoicedQty: qtyCol("invoiced_qty").notNull().default("0"),
  /** Came back unsold (sale on approval) or after the exhibition or repair. */
  returnedQty: qtyCol("returned_qty").notNull().default("0"),
  rate: numeric("rate", { precision: 18, scale: 4 }),
  gstRate: numeric("gst_rate", { precision: 5, scale: 2 }),
  taxable: moneyCol("taxable").notNull().default("0"),
});

/**
 * Goods a customer sent back that were received into the Quality hold godown and wait to be looked at. Each line is restocked,
 * written off, or left on hold until decided.
 */
export const returnInspections = pgTable("return_inspections", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  sourceType: varchar("source_type", { length: 16 }).notNull(), // credit_note | delivery_return
  sourceId: uuid("source_id").notNull(),
  sourceNumber: varchar("source_number", { length: 20 }).notNull(),
  customerId: uuid("customer_id").references(() => accounts.id),
  itemId: uuid("item_id").notNull().references(() => items.id),
  warehouseId: uuid("warehouse_id").notNull().references(() => warehouses.id),
  qty: qtyCol("qty").notNull(),
  restockedQty: qtyCol("restocked_qty").notNull().default("0"),
  writtenOffQty: qtyCol("written_off_qty").notNull().default("0"),
  status: varchar("status", { length: 8 }).notNull().default("pending"), // pending | done
  note: varchar("note", { length: 300 }),
  decidedBy: uuid("decided_by").references(() => users.id, { onDelete: "set null" }),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
  createdAt: createdAt(),
}, (t) => [index("return_inspections_open").on(t.companyId, t.status), index("return_inspections_source").on(t.sourceId), index("return_inspections_tenant_idx").on(t.tenantId)]);

/**
 * Proof of delivery for one challan: who received the goods and when, a photo or signed copy, and what came short or damaged.
 * A shortage or damage opens a claim with an owner and a deadline.
 */
export const deliveryProofs = pgTable("delivery_proofs", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  noteId: uuid("note_id").notNull().references(() => deliveryNotes.id),
  receivedOn: date("received_on", { mode: "string" }).notNull(),
  receivedBy: varchar("received_by", { length: 80 }).notNull(),
  fileId: uuid("file_id").references(() => files.id, { onDelete: "set null" }),
  note: varchar("note", { length: 300 }),
  discrepancy: boolean("discrepancy").notNull().default(false),
  /** Who follows the claim up, and the last day to raise it. Only set when something was short or damaged. */
  claimOwnerId: uuid("claim_owner_id").references(() => users.id, { onDelete: "set null" }),
  claimDeadline: date("claim_deadline", { mode: "string" }),
  claimStatus: varchar("claim_status", { length: 8 }).notNull().default("open"), // open | settled | waived
  claimNote: varchar("claim_note", { length: 300 }),
  claimClosedAt: timestamp("claim_closed_at", { withTimezone: true }),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("delivery_proofs_note").on(t.noteId), index("delivery_proofs_claim").on(t.companyId, t.claimStatus, t.claimDeadline)]);

export const deliveryProofLines = pgTable("delivery_proof_lines", {
  id: id(),
  tenantId: tenantId(),
  proofId: uuid("proof_id").notNull().references(() => deliveryProofs.id, { onDelete: "cascade" }),
  noteLineId: uuid("note_line_id").notNull().references(() => deliveryNoteLines.id),
  shortQty: qtyCol("short_qty").notNull().default("0"),
  damagedQty: qtyCol("damaged_qty").notNull().default("0"),
}, (t) => [index("delivery_proof_lines_proof").on(t.proofId), index("delivery_proof_lines_tenant_idx").on(t.tenantId)]);

/** Goods coming back on a challan: stock returns to the warehouse; the rest stays out or is invoiced. */
export const deliveryReturns = pgTable("delivery_returns", {
  id: id(),
  tenantId: tenantId(),
  noteId: uuid("note_id").notNull().references(() => deliveryNotes.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  lines: jsonb("lines").$type<{ lineId: string; qty: string }[]>().notNull(),
  narration: text("narration"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
});

/**
 * Tax invoices. The customer's name, GSTIN and address are copied onto the invoice when it's issued,
 * because an invoice must show what was true that day even if the customer record changes later.
 */
export const salesInvoices = pgTable("sales_invoices", {
  id: id(),
  tenantId: tenantId(),
  projectId: uuid("project_id"),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  branchId: uuid("branch_id").notNull().references(() => branches.id),
  customerId: uuid("customer_id").notNull().references(() => accounts.id),
  orderId: uuid("order_id").references(() => salesOrders.id),
  quotationId: uuid("quotation_id").references(() => quotations.id),
  voucherId: uuid("voucher_id").references(() => vouchers.id),
  number: varchar("number", { length: 16 }).notNull(),
  date: date("date").notNull(),
  dueOn: date("due_on"),
  customerName: text("customer_name").notNull(),
  customerGstin: char("customer_gstin", { length: 15 }),
  billingAddress: jsonb("billing_address").$type<Address>().notNull().default({}),
  shippingAddress: jsonb("shipping_address").$type<Address>(),
  placeOfSupply: char("place_of_supply", { length: 2 }).notNull(),
  supplyKind: varchar("supply_kind", { length: 8 }).notNull(),
  lut: boolean("lut").notNull().default(false),
  reverseCharge: boolean("reverse_charge").notNull().default(false),
  ...taxCols(),
  roundOff: moneyCol("round_off").notNull().default("0"),
  status: varchar("status", { length: 12 }).notNull().default("posted"), // posted | cancelled
  narration: text("narration"),
  // e-invoice (IRP)
  einvoiceStatus: varchar("einvoice_status", { length: 16 }).notNull().default("not_required"), // not_required | pending | generated | cancelled | failed
  irn: char("irn", { length: 64 }),
  ackNo: varchar("ack_no", { length: 20 }),
  ackDate: timestamp("ack_date", { withTimezone: true }),
  signedQr: text("signed_qr"),
  einvoiceError: text("einvoice_error"),
  // e-way bill
  ewbStatus: varchar("ewb_status", { length: 10 }).notNull().default("none"), // none | active | cancelled
  ewbNo: varchar("ewb_no", { length: 12 }),
  ewbDate: timestamp("ewb_date", { withTimezone: true }),
  ewbValidUpto: timestamp("ewb_valid_upto", { withTimezone: true }),
  vehicleNo: varchar("vehicle_no", { length: 15 }),
  transportDistanceKm: integer("transport_distance_km"),
  /** Cartons or bales the goods went in, printed on the invoice and its packing slip. */
  /** Discounts given on the whole bill, shown as their own lines: [{ kind: "special" | "cash", pct, amount }]. They are already inside each line's discount for the tax. */
  headerDiscounts: jsonb("header_discounts").$type<{ kind: "special" | "cash"; pct: string; amount: string }[]>().notNull().default(sql`'[]'::jsonb`),
  /** Discount for paying early, kept as terms on the bill: it comes off at payment (by credit note), not off the taxable value. */
  earlyPayPct: numeric("early_pay_pct", { precision: 5, scale: 2 }),
  earlyPayDays: integer("early_pay_days"),
  cartons: integer("cartons"),
  /** Who carried the goods and their lorry receipt, typed on the invoice. */
  transporter: varchar("transporter", { length: 80 }),
  lrNumber: varchar("lr_number", { length: 30 }),
  lrDate: date("lr_date"),
  agentId: uuid("agent_id").references(() => accounts.id),
  agentPct: numeric("agent_pct", { precision: 5, scale: 2 }),
  salesmanId: uuid("salesman_id").references(() => employees.id),
  helperId: uuid("helper_id").references(() => employees.id),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [
  uniqueIndex("sales_invoices_number").on(t.companyId, t.number),
  index("sales_invoices_agent").on(t.agentId),
  index("sales_invoices_company_date").on(t.companyId, t.date),
  index("sales_invoices_customer").on(t.customerId),
]);

export const salesInvoiceLines = pgTable("sales_invoice_lines", {
  ...salesLineCols(),
  invoiceId: uuid("invoice_id").notNull().references(() => salesInvoices.id, { onDelete: "cascade" }),
  orderLineId: uuid("order_line_id").references(() => salesOrderLines.id),
  deliveryLineId: uuid("delivery_line_id").references(() => deliveryNoteLines.id),
  returnedQty: qtyCol("returned_qty").notNull().default("0"),
  /** The part of this line's discount that came from the bill-wide discounts (the line discount includes it). */
  headerDiscount: moneyCol("header_discount").notNull().default("0"),
});

/**
 * A broker's or agent's bill for commission earned on money received from the customers they brought.
 * Each line is what one invoice earned since the last bill (negative when goods came back after it).
 * Posting: commission expense debited, the agent credited net of TDS (194H), TDS payable credited.
 */
export const brokerageBills = pgTable("brokerage_bills", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  agentId: uuid("agent_id").notNull().references(() => accounts.id),
  voucherId: uuid("voucher_id").references(() => vouchers.id),
  number: varchar("number", { length: 16 }).notNull(),
  date: date("date").notNull(),
  amount: moneyCol("amount").notNull(),
  tdsRate: numeric("tds_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  tds: moneyCol("tds").notNull().default("0"),
  net: moneyCol("net").notNull(),
  lines: jsonb("lines").$type<{ invoiceId: string; number: string; base: string; received: string; amount: string }[]>().notNull(),
  status: varchar("status", { length: 12 }).notNull().default("posted"), // posted | cancelled
  narration: text("narration"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("brokerage_bills_number").on(t.companyId, t.number), index("brokerage_bills_agent").on(t.agentId)]);

/** Monthly sales target per salesman, with commission slabs: reach `from`% of the target, earn `rate`% of sales. */
export const salesTargets = pgTable("sales_targets", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  employeeId: uuid("employee_id").notNull().references(() => employees.id, { onDelete: "cascade" }),
  month: char("month", { length: 7 }).notNull(), // 2026-10
  target: moneyCol("target").notNull(),
  slabs: jsonb("slabs").$type<{ from: string; rate: string }[]>().notNull().default([]),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("sales_targets_key").on(t.companyId, t.employeeId, t.month)]);

/** Credit notes against an invoice: returns (stock comes back) or a price reduction (no stock). */
export const creditNotes = pgTable("credit_notes", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  invoiceId: uuid("invoice_id").notNull().references(() => salesInvoices.id),
  customerId: uuid("customer_id").notNull().references(() => accounts.id),
  voucherId: uuid("voucher_id").references(() => vouchers.id),
  warehouseId: uuid("warehouse_id").references(() => warehouses.id),
  number: varchar("number", { length: 16 }).notNull(),
  date: date("date").notNull(),
  reason: text("reason").notNull(),
  goodsReturned: boolean("goods_returned").notNull().default(true),
  supplyKind: varchar("supply_kind", { length: 8 }).notNull(),
  placeOfSupply: char("place_of_supply", { length: 2 }).notNull(),
  ...taxCols(),
  roundOff: moneyCol("round_off").notNull().default("0"),
  status: varchar("status", { length: 12 }).notNull().default("posted"),
  einvoiceStatus: varchar("einvoice_status", { length: 16 }).notNull().default("not_required"),
  irn: char("irn", { length: 64 }),
  ackNo: varchar("ack_no", { length: 20 }),
  ackDate: timestamp("ack_date", { withTimezone: true }),
  signedQr: text("signed_qr"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("credit_notes_number").on(t.companyId, t.number)]);

export const creditNoteLines = pgTable("credit_note_lines", {
  ...purchaseLineCols(),
  noteId: uuid("note_id").notNull().references(() => creditNotes.id, { onDelete: "cascade" }),
  invoiceLineId: uuid("invoice_line_id").notNull().references(() => salesInvoiceLines.id),
});

/** GST settings per company: e-invoicing is compulsory above ₹5 crore turnover. */
export const gstSettings = pgTable("gst_settings", {
  companyId: uuid("company_id").primaryKey().references(() => companies.id, { onDelete: "cascade" }),
  tenantId: tenantId(),
  /** Companies filing through their accountant use the manual workpaper path by default. */
  filingMethod: varchar("filing_method", { length: 12 }).notNull().default("manual"),
  einvoiceEnabled: boolean("einvoice_enabled").notNull().default(false),
  /** Files GSTR-1 quarterly (the quarterly return scheme): the calendar then shows the 13th after each quarter. */
  qrmp: boolean("qrmp").notNull().default(false),
  ewayBillThreshold: moneyCol("eway_bill_threshold").notNull().default("50000"),
  bilingualPrint: boolean("bilingual_print").notNull().default(true),
  /** The language printed beside English on invoices, payslips and Form 16 (a shipped locale other than "en"). */
  printLanguage: varchar("print_language", { length: 5 }).notNull().default("hi"),
  invoiceTerms: text("invoice_terms"),
  bankDetails: text("bank_details"),
  /** A return is prepared by one person and must be approved by another with the approve right before it can be uploaded. */
  approvalRequired: boolean("approval_required").notNull().default(false),
});

/**
 * GST returns sent through the GST provider, one row per GSTIN, return and period. `payloadHash` is
 * the SHA-256 of what was uploaded, so filing refuses if the books changed after the upload.
 * Once GSTR-1 is filed, invoices and credit notes in that period can no longer be added or cancelled.
 */
export const gstFilings = pgTable("gst_filings", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  gstin: char("gstin", { length: 15 }).notNull(),
  returnType: varchar("return_type", { length: 8 }).notNull(), // GSTR1 | GSTR3B
  period: char("period", { length: 6 }).notNull(), // MMYYYY
  status: varchar("status", { length: 10 }).notNull(), // uploaded | filed
  payloadHash: char("payload_hash", { length: 64 }).notNull(),
  summary: jsonb("summary").$type<Record<string, unknown>>().notNull().default({}),
  referenceId: varchar("reference_id", { length: 40 }),
  arn: varchar("arn", { length: 20 }),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull().defaultNow(),
  filedAt: timestamp("filed_at", { withTimezone: true }),
  filedBy: uuid("filed_by").references(() => users.id, { onDelete: "set null" }),
  provider: varchar("provider", { length: 20 }).notNull(),
}, (t) => [uniqueIndex("gst_filings_period").on(t.companyId, t.gstin, t.returnType, t.period)]);

/**
 * The GST portal session for API access (taxpayer username + OTP, valid about 6 hours). The token
 * is encrypted with the server's secrets key.
 */
export const gstSessions = pgTable("gst_sessions", {
  companyId: uuid("company_id").primaryKey().references(() => companies.id, { onDelete: "cascade" }),
  tenantId: tenantId(),
  gstin: char("gstin", { length: 15 }).notNull(),
  username: varchar("username", { length: 60 }).notNull(),
  tokenEnc: text("token_enc").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
});

// ---- HR and payroll ------------------------------------------------------------------------------

/** A salary component as stored on a structure: monthly amount and how the statutes treat it. */
export type SalaryComponent = { code: string; name: string; monthly: string; pfWage?: boolean; esiExcluded?: boolean; hra?: boolean };

/**
 * Employees. Bank account numbers are stored encrypted (only the last four digits in clear), and
 * only the last four digits of Aadhaar are kept at all.
 */
export const employees = pgTable("employees", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  branchId: uuid("branch_id").references(() => branches.id),
  code: varchar("code", { length: 20 }).notNull(),
  name: text("name").notNull(),
  nameHi: text("name_hi"),
  gender: varchar("gender", { length: 6 }).notNull(), // male | female | other
  dob: date("dob"),
  /** The number this person is enrolled under on the attendance machine. Blank: the machine's number is matched to the employee code instead. */
  punchPin: varchar("punch_pin", { length: 24 }),
  /** This person's own weekly off days (0 = Sunday); null follows the business setting. */
  weeklyOffs: jsonb("weekly_offs").$type<number[] | null>(),
  joinedOn: date("joined_on").notNull(),
  leftOn: date("left_on"),
  status: varchar("status", { length: 8 }).notNull().default("active"), // active | left
  fixedTerm: boolean("fixed_term").notNull().default(false),
  department: varchar("department", { length: 60 }),
  designation: varchar("designation", { length: 60 }),
  workState: char("work_state", { length: 2 }).notNull(),
  phone: varchar("phone", { length: 15 }),
  email: varchar("email", { length: 120 }),
  address: jsonb("address").$type<{ line1?: string; city?: string; pincode?: string }>(),
  pan: char("pan", { length: 10 }),
  aadhaarLast4: char("aadhaar_last4", { length: 4 }),
  uan: varchar("uan", { length: 12 }),
  esiNumber: varchar("esi_number", { length: 17 }),
  pfMember: boolean("pf_member").notNull().default(true),
  /** Cost of an hour of this employee's time for project costing (else worked out from salary). */
  costPerHour: numeric("cost_per_hour", { precision: 10, scale: 2 }),
  epsEligible: boolean("eps_eligible").notNull().default(true),
  pfOnActualWages: boolean("pf_on_actual_wages").notNull().default(false),
  disabled: boolean("disabled").notNull().default(false), // ESI ceiling is ₹25,000 for persons with disability
  taxRegime: varchar("tax_regime", { length: 3 }).notNull().default("new"),
  metro: boolean("metro").notNull().default(false),
  paymentMode: varchar("payment_mode", { length: 6 }).notNull().default("bank"), // bank | cash | cheque
  bankName: varchar("bank_name", { length: 80 }),
  bankIfsc: char("bank_ifsc", { length: 11 }),
  bankAccountEnc: text("bank_account_enc"),
  bankAccountLast4: char("bank_account_last4", { length: 4 }),
  shiftId: uuid("shift_id"),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("employees_code").on(t.companyId, t.code)]);

/** Working hours used to read punches: late after start + grace; worked minutes decide full or half day. */
export const shifts = pgTable("shifts", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 40 }).notNull(),
  startTime: char("start_time", { length: 5 }).notNull(), // HH:MM
  endTime: char("end_time", { length: 5 }).notNull(),
  graceMinutes: integer("grace_minutes").notNull().default(10),
  fullDayMinutes: integer("full_day_minutes").notNull().default(480),
  halfDayMinutes: integer("half_day_minutes").notNull().default(240),
  isDefault: boolean("is_default").notNull().default(false),
}, (t) => [uniqueIndex("shifts_name").on(t.companyId, t.name)]);

/** Salary advances and loans to employees, recovered in instalments through payroll. */
export const employeeLoans = pgTable("employee_loans", {
  id: id(),
  tenantId: tenantId(),
  employeeId: uuid("employee_id").notNull().references(() => employees.id),
  kind: varchar("kind", { length: 8 }).notNull(), // advance | loan
  date: date("date").notNull(),
  amount: moneyCol("amount").notNull(),
  instalment: moneyCol("instalment").notNull(),
  recovered: moneyCol("recovered").notNull().default("0"),
  startPeriod: char("start_period", { length: 7 }).notNull(), // first month of recovery
  status: varchar("status", { length: 10 }).notNull().default("active"), // active | closed | cancelled
  paidFromAccountId: uuid("paid_from_account_id").references(() => accounts.id),
  voucherId: uuid("voucher_id").references(() => vouchers.id),
  remarks: text("remarks"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
});

/** A stipend paid to a trainee or apprentice for a month: a plain payment with no PF, ESI or payslip. */
export const stipendPayments = pgTable("stipend_payments", {
  id: id(),
  tenantId: tenantId(),
  employeeId: uuid("employee_id").notNull().references(() => employees.id),
  period: char("period", { length: 7 }).notNull(), // the month it is for, YYYY-MM
  amount: moneyCol("amount").notNull(),
  date: date("date").notNull(),
  paidFromAccountId: uuid("paid_from_account_id").notNull().references(() => accounts.id),
  voucherId: uuid("voucher_id").references(() => vouchers.id),
  status: varchar("status", { length: 10 }).notNull().default("posted"), // posted | cancelled
  remarks: text("remarks"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [index("stipend_payments_period").on(t.tenantId, t.period)]);

/**
 * A request for an advance or loan, waiting for someone with the approve right. Approving pays it out through the
 * ordinary loan (so the voucher and recovery schedule are the same); rejecting only records why.
 */
export const loanRequests = pgTable("loan_requests", {
  id: id(),
  tenantId: tenantId(),
  employeeId: uuid("employee_id").notNull().references(() => employees.id),
  kind: varchar("kind", { length: 8 }).notNull(), // advance | loan
  amount: moneyCol("amount").notNull(),
  instalment: moneyCol("instalment").notNull(),
  reason: text("reason"),
  status: varchar("status", { length: 10 }).notNull().default("pending"), // pending | approved | rejected
  requestedBy: uuid("requested_by").references(() => users.id, { onDelete: "set null" }),
  decidedBy: uuid("decided_by").references(() => users.id, { onDelete: "set null" }),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
  decisionNote: text("decision_note"),
  loanId: uuid("loan_id").references(() => employeeLoans.id),
  createdAt: createdAt(),
}, (t) => [index("loan_requests_status").on(t.tenantId, t.status, t.createdAt)]);

/**
 * Stock sent from one warehouse to another that is not there yet. Dispatch moves it into the In transit warehouse;
 * receiving moves what arrived into the destination and writes off any shortage, so nothing goes missing silently.
 */
export const stockTransfers = pgTable("stock_transfers", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  number: varchar("number", { length: 16 }).notNull(),
  date: date("date").notNull(),
  fromWarehouseId: uuid("from_warehouse_id").notNull().references(() => warehouses.id),
  toWarehouseId: uuid("to_warehouse_id").notNull().references(() => warehouses.id),
  transporter: varchar("transporter", { length: 80 }),
  vehicleNo: varchar("vehicle_no", { length: 16 }),
  status: varchar("status", { length: 12 }).notNull().default("in_transit"), // in_transit | received | cancelled
  receivedOn: date("received_on"),
  narration: text("narration"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("stock_transfers_number").on(t.companyId, t.number)]);

export const stockTransferLines = pgTable("stock_transfer_lines", {
  id: id(),
  tenantId: tenantId(),
  transferId: uuid("transfer_id").notNull().references(() => stockTransfers.id, { onDelete: "cascade" }),
  lineNo: integer("line_no").notNull(),
  itemId: uuid("item_id").notNull().references(() => items.id),
  qty: qtyCol("qty").notNull(),
  receivedQty: qtyCol("received_qty").notNull().default("0"),
  shortQty: qtyCol("short_qty").notNull().default("0"),
});

/**
 * Commission a salesman earns on what they sell, by what it is: one item, a brand, a category, an MRP range or
 * everything. For each sale line the most specific rule that matches decides the percentage.
 */
export const salesmanCommissionRules = pgTable("salesman_commission_rules", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 60 }).notNull(),
  kind: varchar("kind", { length: 12 }).notNull(), // all | brand | category | item | mrp_range | margin | age
  match: text("match"), // the brand or category name
  itemId: uuid("item_id").references(() => items.id),
  mrpFrom: numeric("mrp_from", { precision: 12, scale: 2 }),
  mrpTo: numeric("mrp_to", { precision: 12, scale: 2 }),
  /** For a margin rule, the margin % the item earned on standard cost; for an age rule, the days since its first stock in. */
  bandFrom: numeric("band_from", { precision: 8, scale: 2 }),
  bandTo: numeric("band_to", { precision: 8, scale: 2 }),
  ratePct: numeric("rate_pct", { precision: 5, scale: 2 }).notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: createdAt(),
});

/** A performance review of an employee for a period: a rating from 1 to 5 with what went well and what to improve. */
export const employeeReviews = pgTable("employee_reviews", {
  id: id(),
  tenantId: tenantId(),
  employeeId: uuid("employee_id").notNull().references(() => employees.id, { onDelete: "cascade" }),
  period: varchar("period", { length: 20 }).notNull(), // free text such as 2026-H1 or FY 2026-27
  reviewedOn: date("reviewed_on").notNull(),
  rating: integer("rating").notNull(),
  strengths: text("strengths"),
  improvements: text("improvements"),
  reviewerId: uuid("reviewer_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [index("employee_reviews_employee").on(t.tenantId, t.employeeId, t.reviewedOn)]);

/** A message between two people in the same business. Only the two of them can read it. */
export const chatMessages = pgTable("chat_messages", {
  id: id(),
  tenantId: tenantId(),
  fromUserId: uuid("from_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  toUserId: uuid("to_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  createdAt: createdAt(),
  readAt: timestamp("read_at", { withTimezone: true }),
}, (t) => [index("chat_messages_pair").on(t.tenantId, t.fromUserId, t.toUserId, t.createdAt), index("chat_messages_unread").on(t.tenantId, t.toUserId, t.readAt)]);

/** A change waiting for a second person to approve (today: a party's bank details). Applied only on approval. */
export const changeRequests = pgTable("change_requests", {
  id: id(),
  tenantId: tenantId(),
  kind: varchar("kind", { length: 20 }).notNull(), // account_bank
  entityId: uuid("entity_id").notNull(),
  entityName: text("entity_name").notNull(),
  before: jsonb("before"),
  after: jsonb("after"),
  status: varchar("status", { length: 10 }).notNull().default("pending"), // pending | approved | rejected
  requestedBy: uuid("requested_by").references(() => users.id, { onDelete: "set null" }),
  decidedBy: uuid("decided_by").references(() => users.id, { onDelete: "set null" }),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
  decisionNote: text("decision_note"),
  createdAt: createdAt(),
}, (t) => [index("change_requests_status").on(t.tenantId, t.status, t.createdAt)]);

/**
 * A repair taken in at the service desk: what is wrong, what it will cost, whether the customer agreed, the spares used and
 * whether it is under warranty. The deposit and charge are tracked here; they are not posted to the books by this record.
 */
export const repairJobs = pgTable("repair_jobs", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  number: varchar("number", { length: 16 }).notNull(),
  receivedOn: date("received_on").notNull(),
  customerName: varchar("customer_name", { length: 80 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 10 }),
  itemDescription: text("item_description").notNull(),
  complaint: text("complaint"),
  diagnosis: text("diagnosis"),
  warranty: boolean("warranty").notNull().default(false),
  estimate: moneyCol("estimate"),
  deposit: moneyCol("deposit").notNull().default("0"),
  /** The vouchers that book the deposit taken at intake, and the delivery (charge, deposit used, balance collected or refunded). */
  depositVoucherId: uuid("deposit_voucher_id").references(() => vouchers.id),
  settleVoucherId: uuid("settle_voucher_id").references(() => vouchers.id),
  spares: jsonb("spares").$type<{ name: string; qty: string; cost: string }[]>().notNull().default(sql`'[]'::jsonb`),
  finalCharge: moneyCol("final_charge"),
  /** GST on the charge (the charge is what the customer pays, tax included): the rate and the tax inside it, fixed when it is delivered. */
  gstRate: numeric("gst_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  gstAmount: moneyCol("gst_amount").notNull().default("0"),
  status: varchar("status", { length: 12 }).notNull().default("received"), // received | estimated | approved | in_repair | ready | delivered | declined | cancelled
  promisedOn: date("promised_on"),
  deliveredOn: date("delivered_on"),
  reason: text("reason"), // why declined or cancelled
  /** The sale this repair comes from, when it does: a sales order, a sales invoice or a counter bill, with its number as it was then. */
  sourceKind: varchar("source_kind", { length: 8 }), // order | invoice | bill
  sourceId: uuid("source_id"),
  sourceNumber: varchar("source_number", { length: 30 }),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("repair_jobs_number").on(t.companyId, t.number), index("repair_jobs_status").on(t.companyId, t.status)]);

/** Walk-in questions that may become work: a price asked, an alteration enquired about, a product looked for. Each has a day to follow up. */
export const inquiries = pgTable("inquiries", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  customerName: varchar("customer_name", { length: 80 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 10 }),
  kind: varchar("kind", { length: 10 }).notNull().default("other"), // repair | tailoring | product | order | other
  note: text("note").notNull(),
  followUpOn: date("follow_up_on"),
  status: varchar("status", { length: 10 }).notNull().default("open"), // open | converted | closed
  outcome: text("outcome"),
  repairId: uuid("repair_id").references(() => repairJobs.id, { onDelete: "set null" }),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [index("inquiries_company_status").on(t.companyId, t.status, t.followUpOn)]);


/** How a consignee (a shop-in-shop counter or outside store) is settled: how many days after goods go out we expect settlement, and who follows up differences. */
export const consigneeTerms = pgTable("consignee_terms", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").notNull().references(() => accounts.id),
  settlementDays: integer("settlement_days").notNull().default(30),
  discrepancyOwner: varchar("discrepancy_owner", { length: 80 }),
  /** A stock and sales statement emailed to the consignee on a schedule. */
  statementFrequency: varchar("statement_frequency", { length: 8 }), // weekly | monthly
  statementEmail: varchar("statement_email", { length: 120 }),
  statementLastSent: date("statement_last_sent"),
  updatedAt: updatedAt(),
}, (t) => [uniqueIndex("consignee_terms_customer").on(t.companyId, t.customerId)]);

/**
 * A fingerprint, face or card attendance machine that pushes its punches to this server (ZKTeco ADMS "cloud server" protocol, also
 * used by eSSL, BioMax, Realtime and others). The machine is known by its serial number, which is how an unsigned request is
 * tied to the business that registered it.
 */
export const attendanceDevices = pgTable("attendance_devices", {
  id: id(),
  tenantId: tenantId(),
  name: varchar("name", { length: 60 }).notNull(),
  serial: varchar("serial", { length: 40 }).notNull(),
  active: boolean("active").notNull().default(true),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
  lastIp: varchar("last_ip", { length: 45 }),
  /** The machine's own record counter, handed back at its next connection so it sends only what is new. */
  lastStamp: varchar("last_stamp", { length: 20 }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("attendance_devices_serial").on(sql`upper(${t.serial})`)]);

/** Every punch a machine sent, exactly as it said it, so nothing is lost if a person is matched later. */
export const attendancePunches = pgTable("attendance_punches", {
  id: id(),
  tenantId: tenantId(),
  deviceId: uuid("device_id").notNull().references(() => attendanceDevices.id, { onDelete: "cascade" }),
  pin: varchar("pin", { length: 24 }).notNull(),
  punchDate: date("punch_date").notNull(),
  punchTime: char("punch_time", { length: 8 }).notNull(), // HH:MM:SS, the machine's local time
  status: varchar("status", { length: 4 }),
  verify: varchar("verify", { length: 4 }),
  /** The employee it was applied to, once matched. */
  employeeId: uuid("employee_id").references(() => employees.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("attendance_punches_once").on(t.deviceId, t.pin, t.punchDate, t.punchTime), index("attendance_punches_day").on(t.tenantId, t.punchDate)]);

/** One day on which a person's usual week off is changed: "worked" cancels an off day, "off" gives a day off in place of a working day. */
export const weekOffChanges = pgTable("week_off_changes", {
  id: id(),
  tenantId: tenantId(),
  employeeId: uuid("employee_id").notNull().references(() => employees.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  kind: varchar("kind", { length: 8 }).notNull(), // worked | off
  note: varchar("note", { length: 200 }),
  createdBy: uuid("created_by"),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("week_off_changes_once").on(t.employeeId, t.date)]);

/** Tax deducted at source on a payment other than salary (Form 26Q): to whom, under which section, on how much. */
export const tdsDeductions = pgTable("tds_deductions", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  deducteeId: uuid("deductee_id").notNull().references(() => accounts.id),
  section: varchar("section", { length: 10 }).notNull(),
  date: date("date").notNull(),
  /** The payment the tax is worked on, and the part of it that was taxable. */
  base: moneyCol("base").notNull(),
  taxableBase: moneyCol("taxable_base").notNull(),
  rate: numeric("rate", { precision: 5, scale: 2 }).notNull(),
  tds: moneyCol("tds").notNull(),
  noPan: boolean("no_pan").notNull().default(false),
  voucherId: uuid("voucher_id").references(() => vouchers.id),
  challanId: uuid("challan_id"),
  note: varchar("note", { length: 200 }),
  status: varchar("status", { length: 12 }).notNull().default("posted"), // posted | cancelled
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [index("tds_deductions_date").on(t.companyId, t.date), index("tds_deductions_payee").on(t.deducteeId, t.section)]);

/** Tax collected at source from a customer on a sale (Form 27EQ): to whom, under which section, on how much. */
export const tcsCollections = pgTable("tcs_collections", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").notNull().references(() => accounts.id),
  section: varchar("section", { length: 20 }).notNull(),
  date: date("date").notNull(),
  base: moneyCol("base").notNull(),
  rate: numeric("rate", { precision: 5, scale: 2 }).notNull(),
  tcs: moneyCol("tcs").notNull(),
  noPan: boolean("no_pan").notNull().default(false),
  voucherId: uuid("voucher_id").references(() => vouchers.id),
  challanId: uuid("challan_id"),
  note: varchar("note", { length: 200 }),
  status: varchar("status", { length: 12 }).notNull().default("posted"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [index("tcs_collections_date").on(t.companyId, t.date)]);

/** Company applicability for statutory TCS sections. Statutory rates remain in the domain package. */
export const tcsSectionSettings = pgTable("tcs_section_settings", {
  id: id(),
  tenantId: tenantId().references(() => tenants.id, { onDelete: "cascade" }),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  section: varchar("section", { length: 20 }).notNull(),
  enabled: boolean("enabled").notNull(),
  updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex("tcs_section_settings_company_section").on(t.companyId, t.section),
  index("tcs_section_settings_tenant_idx").on(t.tenantId),
]);

/** Non-salary TDS deposited with the government: the challan the deductions are filed under. */
export const tdsChallans = pgTable("tds_challans", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  paidOn: date("paid_on").notNull(),
  amount: moneyCol("amount").notNull(),
  accountId: uuid("account_id").notNull().references(() => accounts.id),
  bsrCode: char("bsr_code", { length: 7 }).notNull(),
  challanSerial: varchar("challan_serial", { length: 8 }).notNull(),
  /** tds (Form 26Q) or tcs (Form 27EQ). */
  kind: varchar("kind", { length: 3 }).notNull().default("tds"),
  voucherId: uuid("voucher_id").references(() => vouchers.id),
  status: varchar("status", { length: 12 }).notNull().default("posted"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [index("tds_challans_date").on(t.companyId, t.paidOn)]);

/** The business's own backup schedule: an encrypted copy of everything, emailed to the people named. One row per business. */
export const backupSettings = pgTable("backup_settings", {
  tenantId: uuid("tenant_id").primaryKey().references(() => tenants.id, { onDelete: "cascade" }),
  enabled: boolean("enabled").notNull().default(false),
  frequency: varchar("frequency", { length: 8 }).notNull().default("weekly"), // daily | weekly
  /** Hour of the day, Indian time. */
  hour: integer("hour").notNull().default(2),
  /** Day of the week for weekly backups (0 = Sunday). */
  weekday: integer("weekday").notNull().default(0),
  recipients: jsonb("recipients").$type<string[]>().notNull().default([]),
  /** The passphrase the copy is locked with, sealed with the server key so the schedule can run unattended. */
  passphraseEnc: text("passphrase_enc"),
  nextRunAt: timestamp("next_run_at", { withTimezone: true }),
  lastRunAt: timestamp("last_run_at", { withTimezone: true }),
  lastOkAt: timestamp("last_ok_at", { withTimezone: true }),
  lastError: varchar("last_error", { length: 200 }),
  updatedAt: updatedAt(),
});

/** Each backup attempt and how it went. */
export const backupRuns = pgTable("backup_runs", {
  id: id(),
  tenantId: tenantId(),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  trigger: varchar("trigger", { length: 8 }).notNull(), // schedule | manual
  status: varchar("status", { length: 8 }).notNull(), // ok | failed
  filename: varchar("filename", { length: 80 }),
  bytes: integer("bytes"),
  tableCount: integer("table_count"),
  rowCount: integer("row_count"),
  sha256: char("sha256", { length: 64 }),
  sentTo: jsonb("sent_to").$type<string[]>().notNull().default([]),
  error: varchar("error", { length: 200 }),
}, (t) => [index("backup_runs_when").on(t.tenantId, t.startedAt)]);

/** A change to one field of an item or party that takes effect on a set date (a GST rate change, a price revision, new credit terms). */
export const scheduledChanges = pgTable("scheduled_changes", {
  id: id(),
  tenantId: tenantId(),
  entity: varchar("entity", { length: 16 }).notNull(), // item | account | role | number_series
  entityId: uuid("entity_id").notNull(),
  entityName: text("entity_name").notNull(),
  field: varchar("field", { length: 20 }).notNull(),
  value: text("value"),
  /** What the field held when the change was applied, kept as the history. */
  previous: text("previous"),
  effectiveFrom: date("effective_from").notNull(),
  status: varchar("status", { length: 10 }).notNull().default("pending"), // pending | applied | cancelled | failed
  appliedAt: timestamp("applied_at", { withTimezone: true }),
  error: varchar("error", { length: 120 }),
  note: varchar("note", { length: 200 }),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [index("scheduled_changes_due").on(t.status, t.effectiveFrom), index("scheduled_changes_entity").on(t.tenantId, t.entity, t.entityId)]);

/** An operation a device sent that the server refused, kept so someone can see what was lost and settle it. */
export const syncRejections = pgTable("sync_rejections", {
  id: id(),
  tenantId: tenantId(),
  deviceId: uuid("device_id").notNull().references(() => devices.id, { onDelete: "cascade" }),
  opId: varchar("op_id", { length: 64 }).notNull(),
  kind: varchar("kind", { length: 40 }),
  error: varchar("error", { length: 60 }).notNull(),
  payload: jsonb("payload"),
  status: varchar("status", { length: 10 }).notNull().default("open"), // open | resolved
  note: varchar("note", { length: 200 }),
  resolvedBy: uuid("resolved_by").references(() => users.id, { onDelete: "set null" }),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("sync_rejections_once").on(t.deviceId, t.opId), index("sync_rejections_open").on(t.tenantId, t.status)]);

/** Another code an item answers to (a supplier's barcode, an old label, a merged duplicate's code). Old documents are never rewritten. */
export const itemBarcodes = pgTable("item_barcodes", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  itemId: uuid("item_id").notNull().references(() => items.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 40 }).notNull(),
  kind: varchar("kind", { length: 10 }).notNull().default("alternate"), // supplier | alternate | merged
  supplierId: uuid("supplier_id").references(() => accounts.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("item_barcodes_code").on(t.companyId, t.code), index("item_barcodes_item").on(t.itemId)]);

/** Stock written off as damaged, lost, stolen or expired: what, how much, why, the photo or paper that shows it, and who approved it. */
export const stockLosses = pgTable("stock_losses", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  number: varchar("number", { length: 24 }).notNull(),
  date: date("date").notNull(),
  itemId: uuid("item_id").notNull().references(() => items.id),
  warehouseId: uuid("warehouse_id").notNull().references(() => warehouses.id),
  qty: numeric("qty", { precision: 18, scale: 4 }).notNull(),
  /** Value at cost when it was recorded. */
  value: moneyCol("value").notNull(),
  reason: varchar("reason", { length: 12 }).notNull(), // damaged | lost | theft | expired | sample | other
  note: varchar("note", { length: 300 }),
  fileId: uuid("file_id"),
  status: varchar("status", { length: 10 }).notNull().default("pending"), // pending | approved | rejected
  journalId: uuid("journal_id").references(() => stockJournals.id),
  requestedBy: uuid("requested_by").references(() => users.id, { onDelete: "set null" }),
  decidedBy: uuid("decided_by").references(() => users.id, { onDelete: "set null" }),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
  decisionNote: varchar("decision_note", { length: 200 }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("stock_losses_number").on(t.companyId, t.number), index("stock_losses_status").on(t.tenantId, t.status)]);

/** One line of a month-end checklist that a person has looked at and signed off, with a note. */
export const closeSignoffs = pgTable("close_signoffs", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  period: char("period", { length: 7 }).notNull(), // YYYY-MM
  key: varchar("key", { length: 30 }).notNull(),
  note: varchar("note", { length: 200 }),
  signedBy: uuid("signed_by").references(() => users.id, { onDelete: "set null" }),
  signedAt: timestamp("signed_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("close_signoffs_once").on(t.companyId, t.period, t.key)]);

/** A month marked closed: who, when, and whether it was reopened. The books stay editable by the usual period locks; this is the record of the close. */
export const monthCloses = pgTable("month_closes", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  period: char("period", { length: 7 }).notNull(),
  closedBy: uuid("closed_by").references(() => users.id, { onDelete: "set null" }),
  closedAt: timestamp("closed_at", { withTimezone: true }).notNull().defaultNow(),
  reopenedAt: timestamp("reopened_at", { withTimezone: true }),
  reopenReason: varchar("reopen_reason", { length: 200 }),
}, (t) => [uniqueIndex("month_closes_once").on(t.companyId, t.period)]);

/** A report as it stood at a moment: the filters, a version number and the figures. A later one for the same month is a restatement. */
export const reportSnapshots = pgTable("report_snapshots", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  period: char("period", { length: 7 }).notNull(),
  kind: varchar("kind", { length: 20 }).notNull(), // trial_balance | profit_loss | balance_sheet
  version: integer("version").notNull(),
  filters: jsonb("filters").$type<Record<string, string>>().notNull(),
  data: jsonb("data").notNull(),
  takenBy: uuid("taken_by").references(() => users.id, { onDelete: "set null" }),
  takenAt: timestamp("taken_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("report_snapshots_version").on(t.companyId, t.period, t.kind, t.version)]);

/** A GSTR-2B statement the business downloaded from the portal and loaded, one per return period. */
export const gstr2bImports = pgTable("gstr2b_imports", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  period: char("period", { length: 6 }).notNull(), // MMYYYY
  gstin: char("gstin", { length: 15 }),
  rows: integer("rows").notNull(),
  importedBy: uuid("imported_by").references(() => users.id, { onDelete: "set null" }),
  importedAt: timestamp("imported_at", { withTimezone: true }).notNull().defaultNow(),
  /** 2b (the fixed monthly statement) or 2a (the live view, which also says whether each supplier has filed). */
  source: varchar("source", { length: 2 }).notNull().default("2b"),
}, (t) => [uniqueIndex("gstr2b_imports_period").on(t.companyId, t.period, t.source)]);

/** One supplier document from the statement, and what it matched in the purchase bills. */
export const gstr2bRows = pgTable("gstr2b_rows", {
  id: id(),
  tenantId: tenantId(),
  importId: uuid("import_id").notNull().references(() => gstr2bImports.id, { onDelete: "cascade" }),
  ctin: char("ctin", { length: 15 }).notNull(),
  supplierName: varchar("supplier_name", { length: 120 }),
  kind: varchar("kind", { length: 8 }).notNull().default("invoice"), // invoice | note
  docNo: varchar("doc_no", { length: 40 }).notNull(),
  docDate: date("doc_date").notNull(),
  taxable: moneyCol("taxable").notNull(),
  igst: moneyCol("igst").notNull().default("0"),
  cgst: moneyCol("cgst").notNull().default("0"),
  sgst: moneyCol("sgst").notNull().default("0"),
  cess: moneyCol("cess").notNull().default("0"),
  itcAvailable: boolean("itc_available").notNull().default(true),
  reason: varchar("reason", { length: 120 }),
  billId: uuid("bill_id").references(() => purchaseBills.id, { onDelete: "set null" }),
  match: varchar("match", { length: 12 }).notNull().default("unmatched"), // matched | amount_diff | unmatched
  diff: jsonb("diff").$type<Record<string, string>>(),
  /** What the accounts team decided about an exception: accepted as it is, or queried with the supplier. */
  decision: varchar("decision", { length: 10 }),
  decisionNote: varchar("decision_note", { length: 200 }),
  decidedBy: uuid("decided_by").references(() => users.id, { onDelete: "set null" }),
  /** From a 2A statement: whether the supplier has filed their GSTR-1 and GSTR-3B for the period (null when the statement does not say). */
  supplierFiled1: boolean("supplier_filed_1"),
  supplierFiled3b: boolean("supplier_filed_3b"),
}, (t) => [index("gstr2b_rows_import").on(t.importId), index("gstr2b_rows_doc").on(t.ctin, t.docNo)]);

/** Input credit given back (Rule 37 for a bill unpaid 180 days, Rule 37A for a supplier who did not pay the tax) and later claimed again. */
export const itcReversals = pgTable("itc_reversals", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  rule: varchar("rule", { length: 4 }).notNull(), // 37 | 37A
  billId: uuid("bill_id").notNull().references(() => purchaseBills.id, { onDelete: "cascade" }),
  igst: moneyCol("igst").notNull().default("0"),
  cgst: moneyCol("cgst").notNull().default("0"),
  sgst: moneyCol("sgst").notNull().default("0"),
  cess: moneyCol("cess").notNull().default("0"),
  reversedOn: date("reversed_on").notNull(),
  voucherId: uuid("voucher_id").references(() => vouchers.id),
  reclaimedOn: date("reclaimed_on"),
  reclaimVoucherId: uuid("reclaim_voucher_id").references(() => vouchers.id),
  note: varchar("note", { length: 200 }),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("itc_reversals_bill_rule").on(t.billId, t.rule), index("itc_reversals_company").on(t.companyId, t.reversedOn)]);

/** The sign-off on a return before it goes to the portal: who asked, who approved, and the hash of the figures that were approved. */
export const gstReturnApprovals = pgTable("gst_return_approvals", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  returnType: varchar("return_type", { length: 8 }).notNull(),
  period: char("period", { length: 6 }).notNull(),
  status: varchar("status", { length: 10 }).notNull().default("requested"), // requested | approved | rejected
  payloadHash: char("payload_hash", { length: 64 }).notNull(),
  summary: jsonb("summary").$type<Record<string, unknown>>().notNull().default({}),
  requestedBy: uuid("requested_by").references(() => users.id, { onDelete: "set null" }),
  requestedAt: timestamp("requested_at", { withTimezone: true }).notNull().defaultNow(),
  decidedBy: uuid("decided_by").references(() => users.id, { onDelete: "set null" }),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
  note: varchar("note", { length: 200 }),
}, (t) => [uniqueIndex("gst_return_approvals_period").on(t.companyId, t.returnType, t.period)]);

/**
 * The accountant's working record for one return and period when the return is filed by hand on the GST portal: figures the books cannot
 * know (imports, ISD credit, interest and late fee, nil and non-GST inward supplies), notes, and the filing itself (who reviewed, the
 * ARN, the date, the evidence files). "Filed" here means a person says it was filed and has attached the proof; nothing is sent to the portal.
 */
export const gstWorkpapers = pgTable("gst_workpapers", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  returnType: varchar("return_type", { length: 8 }).notNull(), // GSTR1 | GSTR3B
  period: char("period", { length: 6 }).notNull(), // MMYYYY
  status: varchar("status", { length: 10 }).notNull().default("prepared"), // prepared | reviewed | filed
  manual: jsonb("manual").$type<Record<string, unknown>>().notNull().default({}),
  notes: text("notes"),
  reviewedBy: uuid("reviewed_by").references(() => users.id, { onDelete: "set null" }),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  /** Hash of the return's figures when it was reviewed or filed, so a later change in the books is visible. */
  figuresHash: char("figures_hash", { length: 64 }),
  arn: varchar("arn", { length: 20 }),
  filedOn: date("filed_on", { mode: "string" }),
  filedBy: uuid("filed_by").references(() => users.id, { onDelete: "set null" }),
  evidenceFileIds: jsonb("evidence_file_ids").$type<string[]>().notNull().default([]),
  updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("gst_workpapers_period").on(t.companyId, t.returnType, t.period)]);

/**
 * GSTR-3B side by side: what the portal pre-filled and what the accountant finally filed, typed in per line and tax head,
 * kept apart from the workpaper so recording them never reopens a review. The ERP's own figures are computed, not stored.
 */
export const gstCompareFigures = pgTable("gst_compare_figures", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  period: char("period", { length: 6 }).notNull(), // MMYYYY
  /** { line: { igst, cgst, sgst, cess } } as typed from the portal's pre-filled GSTR-3B. */
  portal: jsonb("portal").$type<Record<string, Record<string, string>>>().notNull().default({}),
  /** The same lines as the accountant filed them. */
  final: jsonb("final").$type<Record<string, Record<string, string>>>().notNull().default({}),
  updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("gst_compare_figures_period").on(t.companyId, t.period)]);

/**
 * Corrections to supplies already reported in an earlier GSTR-1 (invoices, credit or debit notes, B2C summaries). Each row is
 * reported in `period`, in the amendment tables of that return (B2BA, CDNRA, B2CSA), pointing at the original it replaces.
 */
export const gstr1Amendments = pgTable("gstr1_amendments", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  /** The return period the amendment is reported in (MMYYYY). */
  period: char("period", { length: 6 }).notNull(),
  kind: varchar("kind", { length: 4 }).notNull(), // b2b | cdn | b2cs
  ctin: char("ctin", { length: 15 }),
  /** The document as first reported (b2b, cdn). */
  originalNumber: varchar("original_number", { length: 40 }),
  originalDate: date("original_date", { mode: "string" }),
  /** The month first reported (b2cs). */
  originalPeriod: char("original_period", { length: 6 }),
  /** The corrected document. */
  number: varchar("number", { length: 40 }),
  docDate: date("doc_date", { mode: "string" }),
  noteType: char("note_type", { length: 1 }), // C | D (cdn)
  pos: char("pos", { length: 2 }).notNull(),
  intra: boolean("intra").notNull(),
  reverseCharge: boolean("reverse_charge").notNull().default(false),
  invoiceType: varchar("invoice_type", { length: 5 }), // R | SEWP | SEWOP
  value: moneyCol("value").notNull().default("0"),
  /** Corrected values by tax rate. */
  lines: jsonb("lines").$type<{ rate: string; taxable: string; igst: string; cgst: string; sgst: string; cess: string }[]>().notNull(),
  reason: varchar("reason", { length: 200 }).notNull(),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [index("gstr1_amendments_period").on(t.companyId, t.period)]);

/** A voucher that repeats: rent, a loan instalment, a subscription. Each due date posts one ordinary voucher from the template. */
export const recurringVouchers = pgTable("recurring_vouchers", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 80 }).notNull(),
  type: varchar("type", { length: 8 }).notNull(), // journal | payment | receipt | contra
  narration: varchar("narration", { length: 200 }),
  lines: jsonb("lines").$type<{ accountId: string; debit?: string; credit?: string }[]>().notNull(),
  frequency: varchar("frequency", { length: 10 }).notNull(), // monthly | quarterly | yearly
  dayOfMonth: integer("day_of_month").notNull(),
  nextOn: date("next_on", { mode: "string" }).notNull(),
  endsOn: date("ends_on", { mode: "string" }),
  lastRunOn: date("last_run_on", { mode: "string" }),
  active: boolean("active").notNull().default(true),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [index("recurring_vouchers_due").on(t.companyId, t.active, t.nextOn), index("recurring_vouchers_tenant_idx").on(t.tenantId)]);

/** A post-dated cheque received from a customer or issued to a supplier, until it is cleared, bounced or cancelled. */
export const postDatedCheques = pgTable("post_dated_cheques", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  direction: varchar("direction", { length: 8 }).notNull(), // received | issued
  partyId: uuid("party_id").notNull().references(() => accounts.id),
  bankAccountId: uuid("bank_account_id").notNull().references(() => accounts.id),
  chequeNo: varchar("cheque_no", { length: 12 }).notNull(),
  drawnOn: varchar("drawn_on", { length: 60 }),
  chequeDate: date("cheque_date").notNull(),
  amount: moneyCol("amount").notNull(),
  status: varchar("status", { length: 10 }).notNull().default("pending"), // pending | cleared | bounced | cancelled
  voucherId: uuid("voucher_id").references(() => vouchers.id),
  note: varchar("note", { length: 200 }),
  settledOn: date("settled_on"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [index("pdc_status_date").on(t.companyId, t.status, t.chequeDate)]);

/** A known future outflow or inflow outside the bills: a loan instalment, a capital purchase, a drawdown. The cash forecast counts these on their dates. */
export const cashCommitments = pgTable("cash_commitments", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  kind: varchar("kind", { length: 8 }).notNull(), // loan | capex | other
  direction: varchar("direction", { length: 3 }).notNull().default("out"), // out | in
  name: varchar("name", { length: 80 }).notNull(),
  amount: moneyCol("amount").notNull(),
  firstDate: date("first_date").notNull(),
  repeat: varchar("repeat", { length: 8 }).notNull().default("once"), // once | monthly
  until: date("until"),
  note: varchar("note", { length: 200 }),
  active: boolean("active").notNull().default(true),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [index("cash_commitments_company").on(t.companyId, t.active)]);

/** How an expense account is spread over the stores: by sales, by stock, equally, or by percentages typed in. */
export const expenseAllocationRules = pgTable("expense_allocation_rules", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  accountId: uuid("account_id").notNull().references(() => accounts.id, { onDelete: "cascade" }),
  basis: varchar("basis", { length: 8 }).notNull(), // sales | stock | equal | fixed
  /** For a fixed basis: { warehouseId: percent }. */
  shares: jsonb("shares").$type<Record<string, string>>(),
  updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
  updatedAt: updatedAt(),
}, (t) => [uniqueIndex("expense_alloc_account").on(t.companyId, t.accountId)]);

/** What each legacy TDS section is called under section 393 of the Income-tax Act, 2025, typed or imported by the business from the official table. */
export const tdsSectionMap = pgTable("tds_section_map", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  legacySection: varchar("legacy_section", { length: 12 }).notNull(),
  newRef: varchar("new_ref", { length: 40 }).notNull(),
  paymentCode: varchar("payment_code", { length: 8 }),
  note: varchar("note", { length: 200 }),
  updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
  updatedAt: updatedAt(),
}, (t) => [uniqueIndex("tds_section_map_legacy").on(t.companyId, t.legacySection)]);

/** A store's own selling rate for an item, optionally for a spell of dates, days of the week and hours. The latest entry that applies wins; no entry means the item's usual rate. */
export const branchPrices = pgTable("branch_prices", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  warehouseId: uuid("warehouse_id").notNull().references(() => warehouses.id, { onDelete: "cascade" }),
  itemId: uuid("item_id").notNull().references(() => items.id, { onDelete: "cascade" }),
  saleRate: moneyCol("sale_rate").notNull(),
  startsOn: date("starts_on"),
  endsOn: date("ends_on"),
  weekdays: jsonb("weekdays").$type<number[]>(),
  fromTime: varchar("from_time", { length: 5 }),
  toTime: varchar("to_time", { length: 5 }),
  note: varchar("note", { length: 120 }),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [index("branch_prices_store_item").on(t.warehouseId, t.itemId)]);

/** One piece with its own serial number: where it is, and the bill it left on. */
export const itemSerials = pgTable("item_serials", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  itemId: uuid("item_id").notNull().references(() => items.id, { onDelete: "cascade" }),
  serial: varchar("serial", { length: 40 }).notNull(),
  status: varchar("status", { length: 10 }).notNull().default("in_stock"), // in_stock | sold | removed
  warehouseId: uuid("warehouse_id").references(() => warehouses.id),
  receivedOn: date("received_on"),
  /** Where it came in: a goods receipt or typed in by hand. */
  sourceKind: varchar("source_kind", { length: 8 }),
  sourceId: uuid("source_id"),
  soldBillId: uuid("sold_bill_id").references(() => posBills.id, { onDelete: "set null" }),
  soldOn: date("sold_on"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("item_serials_unique").on(t.companyId, t.itemId, sql`upper(${t.serial})`), index("item_serials_status").on(t.companyId, t.itemId, t.status)]);

/** Goods handed to a customer to try at home or show others. They leave the store's stock for an "On approval" holding place and come back as sales or returns. */
export const approvalMemos = pgTable("approval_memos", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  number: varchar("number", { length: 20 }).notNull(),
  date: date("date").notNull(),
  warehouseId: uuid("warehouse_id").notNull().references(() => warehouses.id),
  customerName: varchar("customer_name", { length: 80 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 10 }),
  dueBack: date("due_back"),
  note: varchar("note", { length: 200 }),
  status: varchar("status", { length: 8 }).notNull().default("open"), // open | closed
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("approval_memos_number").on(t.companyId, t.number), index("approval_memos_status").on(t.companyId, t.status)]);

export const approvalMemoLines = pgTable("approval_memo_lines", {
  id: id(),
  tenantId: tenantId(),
  memoId: uuid("memo_id").notNull().references(() => approvalMemos.id, { onDelete: "cascade" }),
  lineNo: integer("line_no").notNull(),
  itemId: uuid("item_id").notNull().references(() => items.id),
  qty: qtyCol("qty").notNull(),
  rate: moneyCol("rate").notNull(),
  returnedQty: qtyCol("returned_qty").notNull().default("0"),
  billedQty: qtyCol("billed_qty").notNull().default("0"),
}, (t) => [index("approval_memo_lines_memo").on(t.memoId)]);

/** A proposed provision against slow or overvalued stock: how it was worked out, per item, and who agreed it. Approving posts the change in the provision. */
export const stockWritedowns = pgTable("stock_writedowns", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  number: varchar("number", { length: 24 }).notNull(),
  asOf: date("as_of").notNull(),
  basis: jsonb("basis").$type<{ bands: Record<string, number>; sellingCostPct: string }>().notNull(),
  lines: jsonb("lines").$type<{ itemId: string; name: string; qty: string; cost: string; nrv: string; ageProvision: string; nrvShortfall: string; writedown: string }[]>().notNull(),
  /** The provision the stock needs in total, the provision already held, and the entry that closes the gap (negative releases some). */
  required: moneyCol("required").notNull(),
  held: moneyCol("held").notNull(),
  change: moneyCol("change").notNull(),
  status: varchar("status", { length: 10 }).notNull().default("pending"), // pending | approved | rejected
  note: varchar("note", { length: 200 }),
  voucherId: uuid("voucher_id").references(() => vouchers.id),
  requestedBy: uuid("requested_by").references(() => users.id, { onDelete: "set null" }),
  decidedBy: uuid("decided_by").references(() => users.id, { onDelete: "set null" }),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("stock_writedowns_number").on(t.companyId, t.number)]);

/** A periodic look at who has access: a snapshot of the members and their roles, and a decision on each. */
export const accessReviews = pgTable("access_reviews", {
  id: id(),
  tenantId: tenantId(),
  startedBy: uuid("started_by").references(() => users.id, { onDelete: "set null" }),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  /** One entry per member when the review began: who, which role, and what was decided (keep, change, remove). */
  members: jsonb("members").$type<{ userId: string; name: string; email: string; role: string; decision: "keep" | "change" | "remove" | null; note: string | null }[]>().notNull(),
});

/** A reconciliation of our records against someone else's (a customer's or supplier's statement), over a period. */
export const reconRuns = pgTable("recon_runs", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  kind: varchar("kind", { length: 20 }).notNull(), // customer_statement | supplier_statement
  partyId: uuid("party_id").references(() => accounts.id),
  fromDate: date("from_date").notNull(),
  toDate: date("to_date").notNull(),
  rules: jsonb("rules").$type<{ tolerance: string; dateWindowDays: number; maxGroup: number }>().notNull(),
  /** The closing balance on their statement, when they gave one, to compare with ours. */
  theirClosing: moneyCol("their_closing"),
  status: varchar("status", { length: 8 }).notNull().default("open"), // open | closed
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
  closedAt: timestamp("closed_at", { withTimezone: true }),
}, (t) => [index("recon_runs_company").on(t.companyId, t.status)]);

/** One record on either side. Amounts are signed the same way on both sides: positive adds to what is owed. */
export const reconItems = pgTable("recon_items", {
  id: id(),
  tenantId: tenantId(),
  runId: uuid("run_id").notNull().references(() => reconRuns.id, { onDelete: "cascade" }),
  side: varchar("side", { length: 6 }).notNull(), // ours | theirs
  ref: varchar("ref", { length: 60 }).notNull().default(""),
  date: date("date").notNull(),
  amount: moneyCol("amount").notNull(),
  description: varchar("description", { length: 160 }),
  sourceVoucherId: uuid("source_voucher_id"),
  status: varchar("status", { length: 12 }).notNull().default("unmatched"), // unmatched | matched | written_off
  groupId: uuid("group_id"),
  rule: varchar("rule", { length: 14 }),
  matchedBy: varchar("matched_by", { length: 6 }), // auto | manual
  reasonCode: varchar("reason_code", { length: 20 }),
  ownerId: uuid("owner_id").references(() => users.id, { onDelete: "set null" }),
  note: varchar("note", { length: 200 }),
  evidenceFileId: uuid("evidence_file_id"),
  createdAt: createdAt(),
}, (t) => [index("recon_items_run").on(t.runId, t.status)]);

/** Everything that happened to a reconciliation, in order. Nothing here is edited or deleted: a mismatch keeps its whole history. */
export const reconEvents = pgTable("recon_events", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  tenantId: tenantId(),
  runId: uuid("run_id").notNull().references(() => reconRuns.id, { onDelete: "cascade" }),
  itemId: uuid("item_id"),
  action: varchar("action", { length: 20 }).notNull(),
  detail: jsonb("detail").$type<Record<string, unknown>>().notNull().default({}),
  by: uuid("by").references(() => users.id, { onDelete: "set null" }),
  at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("recon_events_run").on(t.runId, t.id)]);

/** A request to write off what could not be matched, approved by a second person; approving books the difference. */
export const reconWriteoffs = pgTable("recon_writeoffs", {
  id: id(),
  tenantId: tenantId(),
  runId: uuid("run_id").notNull().references(() => reconRuns.id, { onDelete: "cascade" }),
  itemIds: jsonb("item_ids").$type<string[]>().notNull(),
  /** Ours less theirs across the items; the entry moves our ledger by this much toward theirs. */
  amount: moneyCol("amount").notNull(),
  reasonCode: varchar("reason_code", { length: 20 }).notNull(),
  note: varchar("note", { length: 200 }),
  status: varchar("status", { length: 10 }).notNull().default("pending"), // pending | approved | rejected
  requestedBy: uuid("requested_by").references(() => users.id, { onDelete: "set null" }),
  decidedBy: uuid("decided_by").references(() => users.id, { onDelete: "set null" }),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
  voucherId: uuid("voucher_id").references(() => vouchers.id),
  createdAt: createdAt(),
});

/** A what-if the owner saved: the changes with their worst, expected and best values, and the baseline they were worked on. */
export const scenarios = pgTable("scenarios", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 80 }).notNull(),
  adjustments: jsonb("adjustments").notNull(),
  baseline: jsonb("baseline").notNull(),
  note: varchar("note", { length: 300 }),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("scenarios_name").on(t.companyId, sql`lower(${t.name})`)]);

/** A shipment sent abroad: its shipping bill, and whether the money has come back (a bank realisation certificate). */
export const exportShipments = pgTable("export_shipments", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  invoiceId: uuid("invoice_id").notNull().references(() => salesInvoices.id),
  shippingBillNo: varchar("shipping_bill_no", { length: 20 }),
  shippingBillDate: date("shipping_bill_date"),
  portCode: varchar("port_code", { length: 8 }),
  fobValue: moneyCol("fob_value"),
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  brcNo: varchar("brc_no", { length: 30 }),
  brcDate: date("brc_date"),
  realisedAmount: moneyCol("realised_amount").notNull().default("0"),
  note: varchar("note", { length: 200 }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("export_shipments_invoice").on(t.invoiceId)]);

/** A duty-credit scrip issued against exports (RoDTEP or RoSCTL), with its value and validity. */
export const dutyScrips = pgTable("duty_scrips", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  scheme: varchar("scheme", { length: 8 }).notNull(), // rodtep | rosctl
  number: varchar("number", { length: 30 }).notNull(),
  issuedOn: date("issued_on").notNull(),
  validUntil: date("valid_until"),
  amount: moneyCol("amount").notNull(),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("duty_scrips_number").on(t.companyId, t.scheme, t.number)]);

/** What was used from a scrip, and for what. */
export const scripUses = pgTable("scrip_uses", {
  id: id(),
  tenantId: tenantId(),
  scripId: uuid("scrip_id").notNull().references(() => dutyScrips.id, { onDelete: "cascade" }),
  usedOn: date("used_on").notNull(),
  amount: moneyCol("amount").notNull(),
  purpose: varchar("purpose", { length: 120 }),
  createdAt: createdAt(),
});

/** An incentive rate by tariff heading and dates: the rate on a shipment is the one in force on its shipping bill date. */
export const incentiveRates = pgTable("incentive_rates", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  scheme: varchar("scheme", { length: 8 }).notNull(),
  hsnPrefix: varchar("hsn_prefix", { length: 8 }).notNull(),
  ratePct: numeric("rate_pct", { precision: 6, scale: 3 }).notNull(),
  effectiveFrom: date("effective_from").notNull(),
  effectiveTo: date("effective_to"),
  createdAt: createdAt(),
}, (t) => [index("incentive_rates_lookup").on(t.companyId, t.scheme, t.hsnPrefix)]);

/** A user's own note or reminder, shown on their home screen. Private: only its owner sees it. */
export const userNotes = pgTable("user_notes", {
  id: id(),
  tenantId: tenantId(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  dueOn: date("due_on"),
  doneAt: timestamp("done_at", { withTimezone: true }),
  createdAt: createdAt(),
}, (t) => [index("user_notes_user").on(t.tenantId, t.userId, t.doneAt)]);

/** HSN and SAC codes the business uses, with a plain description and, if it wants one, a default tax rate. */
export const hsnCodes = pgTable("hsn_codes", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 8 }).notNull(),
  description: text("description").notNull(),
  kind: varchar("kind", { length: 7 }).notNull().default("goods"), // goods | service
  /** Optional: apparel and footwear are taxed by price slab, so this is only a convenience. */
  gstRate: numeric("gst_rate", { precision: 5, scale: 2 }),
  archived: boolean("archived").notNull().default(false),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("hsn_codes_company_code").on(t.companyId, t.code)]);

/** An identity or compliance document kept for an employee (KYC): what it is, its number, and when it lapses. */
export const employeeDocuments = pgTable("employee_documents", {
  id: id(),
  tenantId: tenantId(),
  employeeId: uuid("employee_id").notNull().references(() => employees.id, { onDelete: "cascade" }),
  kind: varchar("kind", { length: 20 }).notNull(),
  number: text("number"),
  issuedOn: date("issued_on"),
  expiresOn: date("expires_on"),
  fileId: uuid("file_id").references(() => files.id, { onDelete: "set null" }),
  note: text("note"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [index("employee_documents_employee").on(t.employeeId), index("employee_documents_expiry").on(t.tenantId, t.expiresOn)]);

/** An employee paying back part of a loan or advance in cash or by bank, outside payroll recovery. */
export const loanReceipts = pgTable("loan_receipts", {
  id: id(),
  tenantId: tenantId(),
  loanId: uuid("loan_id").notNull().references(() => employeeLoans.id),
  date: date("date").notNull(),
  amount: moneyCol("amount").notNull(),
  accountId: uuid("account_id").notNull().references(() => accounts.id),
  voucherId: uuid("voucher_id").references(() => vouchers.id),
  status: varchar("status", { length: 10 }).notNull().default("posted"), // posted | cancelled
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [index("loan_receipts_loan").on(t.loanId)]);

/** PF, ESI, PT, LWF and TDS paid to the government (challans), cleared against the month's dues. */
export const statutoryPayments = pgTable("statutory_payments", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  kind: varchar("kind", { length: 4 }).notNull(), // pf | esi | pt | lwf | tds
  period: char("period", { length: 7 }).notNull(), // wage month the payment is for
  amount: moneyCol("amount").notNull(),
  paidOn: date("paid_on").notNull(),
  accountId: uuid("account_id").notNull().references(() => accounts.id),
  reference: varchar("reference", { length: 40 }), // TRRN, challan number or CIN
  bsrCode: char("bsr_code", { length: 7 }), // TDS challans (ITNS 281)
  challanSerial: varchar("challan_serial", { length: 5 }),
  voucherId: uuid("voucher_id").references(() => vouchers.id),
  status: varchar("status", { length: 10 }).notNull().default("posted"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [index("statutory_payments_period").on(t.companyId, t.kind, t.period)]);

/** Salary structures with the date they take effect; the latest one on or before a date applies. */
export const salaryStructures = pgTable("salary_structures", {
  id: id(),
  tenantId: tenantId(),
  employeeId: uuid("employee_id").notNull().references(() => employees.id, { onDelete: "cascade" }),
  effectiveFrom: date("effective_from").notNull(),
  components: jsonb("components").$type<SalaryComponent[]>().notNull(),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("salary_structures_from").on(t.employeeId, t.effectiveFrom)]);

/** What the employee declares for TDS in a financial year (old regime deductions, other income, previous employer). */
export const taxDeclarations = pgTable("tax_declarations", {
  id: id(),
  tenantId: tenantId(),
  employeeId: uuid("employee_id").notNull().references(() => employees.id, { onDelete: "cascade" }),
  fy: varchar("fy", { length: 7 }).notNull(),
  rentPaid: moneyCol("rent_paid").notNull().default("0"),
  c80: moneyCol("c80").notNull().default("0"),
  ccd1b: moneyCol("ccd1b").notNull().default("0"),
  d80: moneyCol("d80").notNull().default("0"),
  homeLoanInterest: moneyCol("home_loan_interest").notNull().default("0"),
  otherDeductions: moneyCol("other_deductions").notNull().default("0"),
  otherIncome: moneyCol("other_income").notNull().default("0"),
  previousEmployerSalary: moneyCol("previous_employer_salary").notNull().default("0"),
  previousEmployerTds: moneyCol("previous_employer_tds").notNull().default("0"),
  updatedAt: updatedAt(),
}, (t) => [uniqueIndex("tax_declarations_fy").on(t.employeeId, t.fy)]);

export const holidays = pgTable("holidays", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  name: varchar("name", { length: 80 }).notNull(),
}, (t) => [uniqueIndex("holidays_date").on(t.companyId, t.date)]);

export const leaveTypes = pgTable("leave_types", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 8 }).notNull(),
  name: varchar("name", { length: 60 }).notNull(),
  nameHi: varchar("name_hi", { length: 60 }),
  annualQuota: numeric("annual_quota", { precision: 6, scale: 1 }).notNull().default("0"),
  paid: boolean("paid").notNull().default(true),
  encashable: boolean("encashable").notNull().default(false),
  archived: boolean("archived").notNull().default(false),
}, (t) => [uniqueIndex("leave_types_code").on(t.companyId, t.code)]);

/** Leave carried into a financial year (e.g. earned leave brought forward). */
export const leaveOpenings = pgTable("leave_openings", {
  id: id(),
  tenantId: tenantId(),
  employeeId: uuid("employee_id").notNull().references(() => employees.id, { onDelete: "cascade" }),
  leaveTypeId: uuid("leave_type_id").notNull().references(() => leaveTypes.id),
  fy: varchar("fy", { length: 7 }).notNull(),
  days: numeric("days", { precision: 6, scale: 1 }).notNull(),
}, (t) => [uniqueIndex("leave_openings_fy").on(t.employeeId, t.leaveTypeId, t.fy)]);

export const leaveRequests = pgTable("leave_requests", {
  id: id(),
  tenantId: tenantId(),
  employeeId: uuid("employee_id").notNull().references(() => employees.id, { onDelete: "cascade" }),
  leaveTypeId: uuid("leave_type_id").notNull().references(() => leaveTypes.id),
  fromDate: date("from_date").notNull(),
  toDate: date("to_date").notNull(),
  halfDay: boolean("half_day").notNull().default(false),
  days: numeric("days", { precision: 6, scale: 1 }).notNull(),
  reason: text("reason"),
  status: varchar("status", { length: 10 }).notNull().default("pending"), // pending | approved | rejected | cancelled
  decidedBy: uuid("decided_by").references(() => users.id, { onDelete: "set null" }),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [index("leave_requests_employee").on(t.employeeId, t.fromDate)]);

/** One row per employee per day that isn't a plain working day's presence; no row means present. */
export const attendance = pgTable("attendance", {
  id: id(),
  tenantId: tenantId(),
  employeeId: uuid("employee_id").notNull().references(() => employees.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  status: varchar("status", { length: 8 }).notNull(), // present | absent | half_day | leave
  leaveRequestId: uuid("leave_request_id").references(() => leaveRequests.id, { onDelete: "cascade" }),
  note: varchar("note", { length: 120 }),
  inTime: char("in_time", { length: 5 }),
  outTime: char("out_time", { length: 5 }),
  workedMinutes: integer("worked_minutes"),
  late: boolean("late").notNull().default(false),
  source: varchar("source", { length: 8 }).notNull().default("manual"), // manual | import | device
}, (t) => [uniqueIndex("attendance_day").on(t.employeeId, t.date)]);

export const payrollSettings = pgTable("payroll_settings", {
  companyId: uuid("company_id").primaryKey().references(() => companies.id, { onDelete: "cascade" }),
  tenantId: tenantId(),
  tan: char("tan", { length: 10 }), // tax deduction account number, for TDS returns and Form 16
  pfEstablishmentCode: varchar("pf_establishment_code", { length: 22 }),
  esiEmployerCode: varchar("esi_employer_code", { length: 17 }),
  labourCodeWages: boolean("labour_code_wages").notNull().default(true),
  weeklyOffs: jsonb("weekly_offs").$type<number[]>().notNull().default([0]), // 0 = Sunday
  lwfEmployee: moneyCol("lwf_employee").notNull().default("0"),
  lwfEmployer: moneyCol("lwf_employer").notNull().default("0"),
  lwfMonths: jsonb("lwf_months").$type<number[]>().notNull().default([]),
  encashmentDivisor: integer("encashment_divisor").notNull().default(30),
});

export const payrollRuns = pgTable("payroll_runs", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  period: char("period", { length: 7 }).notNull(), // YYYY-MM
  status: varchar("status", { length: 10 }).notNull().default("draft"), // draft | finalized | paid | cancelled
  gross: moneyCol("gross").notNull().default("0"),
  deductions: moneyCol("deductions").notNull().default("0"),
  netPay: moneyCol("net_pay").notNull().default("0"),
  employerContributions: moneyCol("employer_contributions").notNull().default("0"),
  voucherId: uuid("voucher_id").references(() => vouchers.id),
  paymentVoucherId: uuid("payment_voucher_id").references(() => vouchers.id),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
  finalizedAt: timestamp("finalized_at", { withTimezone: true }),
  paidAt: timestamp("paid_at", { withTimezone: true }),
});

export const payslips = pgTable("payslips", {
  id: id(),
  tenantId: tenantId(),
  runId: uuid("run_id").notNull().references(() => payrollRuns.id, { onDelete: "cascade" }),
  employeeId: uuid("employee_id").notNull().references(() => employees.id),
  lopDays: numeric("lop_days", { precision: 5, scale: 1 }).notNull().default("0"),
  /** Loss-of-pay days typed in by hand; otherwise they come from attendance each time the draft is refreshed. */
  lopOverride: numeric("lop_override", { precision: 5, scale: 1 }),
  paidDays: numeric("paid_days", { precision: 5, scale: 1 }).notNull(),
  gross: moneyCol("gross").notNull(),
  pfWages: moneyCol("pf_wages").notNull().default("0"),
  pfEmployee: moneyCol("pf_employee").notNull().default("0"),
  esiEmployee: moneyCol("esi_employee").notNull().default("0"),
  pt: moneyCol("pt").notNull().default("0"),
  lwfEmployee: moneyCol("lwf_employee").notNull().default("0"),
  tds: moneyCol("tds").notNull().default("0"),
  otherDeductions: jsonb("other_deductions").$type<{ name: string; amount: string }[]>().notNull().default([]),
  /** Overtime, incentive, bonus… typed in for the month (arrears are worked out and kept in detail). */
  extraEarnings: jsonb("extra_earnings").$type<{ code: string; name: string; amount: string; esiExcluded?: boolean }[]>().notNull().default([]),
  /** Loan and advance instalments: worked out from open loans unless an amount was typed in (0 skips a month). */
  loanRecoveries: jsonb("loan_recoveries").$type<{ loanId: string; name: string; amount: string; overridden?: boolean }[]>().notNull().default([]),
  totalDeductions: moneyCol("total_deductions").notNull(),
  netPay: moneyCol("net_pay").notNull(),
  employerContributions: moneyCol("employer_contributions").notNull().default("0"),
  /** The full computation (earnings, PF/ESI detail, tax working) as shown on the payslip. */
  detail: jsonb("detail").$type<Record<string, unknown>>().notNull(),
}, (t) => [uniqueIndex("payslips_employee").on(t.runId, t.employeeId)]);

/** Full and final settlement when someone leaves: gratuity and leave encashment (the last month's pay runs through payroll). */
export const settlements = pgTable("settlements", {
  id: id(),
  tenantId: tenantId(),
  employeeId: uuid("employee_id").notNull().references(() => employees.id),
  leftOn: date("left_on").notNull(),
  serviceYears: integer("service_years").notNull(),
  gratuity: moneyCol("gratuity").notNull().default("0"),
  leaveDays: numeric("leave_days", { precision: 6, scale: 1 }).notNull().default("0"),
  leaveEncashment: moneyCol("leave_encashment").notNull().default("0"),
  otherEarnings: moneyCol("other_earnings").notNull().default("0"),
  recoveries: moneyCol("recoveries").notNull().default("0"),
  total: moneyCol("total").notNull(),
  remarks: text("remarks"),
  voucherId: uuid("voucher_id").references(() => vouchers.id),
  status: varchar("status", { length: 10 }).notNull().default("posted"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
});

// ---- Manufacturing --------------------------------------------------------------------------------

export const workCentres = pgTable("work_centres", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 60 }).notNull(),
  costPerHour: moneyCol("cost_per_hour").notNull().default("0"),
  archived: boolean("archived").notNull().default(false),
}, (t) => [uniqueIndex("work_centres_name").on(t.companyId, t.name)]);

/** Bills of materials, versioned per item; one version is the default. */
export const boms = pgTable("boms", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  itemId: uuid("item_id").notNull().references(() => items.id),
  version: integer("version").notNull(),
  outputQty: qtyCol("output_qty").notNull(),
  /** Fixed labour/overheads per batch, on top of work-centre time. */
  overhead: moneyCol("overhead").notNull().default("0"),
  isDefault: boolean("is_default").notNull().default(true),
  status: varchar("status", { length: 10 }).notNull().default("active"), // active | archived
  notes: text("notes"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("boms_version").on(t.companyId, t.itemId, t.version)]);

export const bomLines = pgTable("bom_lines", {
  id: id(),
  tenantId: tenantId(),
  bomId: uuid("bom_id").notNull().references(() => boms.id, { onDelete: "cascade" }),
  lineNo: integer("line_no").notNull(),
  itemId: uuid("item_id").notNull().references(() => items.id),
  qty: qtyCol("qty").notNull(),
  wastagePct: numeric("wastage_pct", { precision: 5, scale: 2 }).notNull().default("0"),
});

export const bomOperations = pgTable("bom_operations", {
  id: id(),
  tenantId: tenantId(),
  bomId: uuid("bom_id").notNull().references(() => boms.id, { onDelete: "cascade" }),
  lineNo: integer("line_no").notNull(),
  name: varchar("name", { length: 60 }).notNull(),
  workCentreId: uuid("work_centre_id").notNull().references(() => workCentres.id),
  minutes: numeric("minutes", { precision: 10, scale: 2 }).notNull(),
});

/**
 * Production orders: planned → released → completed (or cancelled). Each completion takes the BOM's
 * materials out of stock (backflush) and puts the good output in at cost; rejected output is scrapped
 * and its cost carried by the good units. Extra issues (more material than the BOM) are added to cost.
 */
export const productionOrders = pgTable("production_orders", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  number: varchar("number", { length: 16 }).notNull(),
  date: date("date").notNull(),
  itemId: uuid("item_id").notNull().references(() => items.id),
  bomId: uuid("bom_id").notNull().references(() => boms.id),
  qty: qtyCol("qty").notNull(),
  sourceWarehouseId: uuid("source_warehouse_id").notNull().references(() => warehouses.id),
  targetWarehouseId: uuid("target_warehouse_id").notNull().references(() => warehouses.id),
  status: varchar("status", { length: 10 }).notNull().default("planned"), // planned | released | completed | cancelled
  producedQty: qtyCol("produced_qty").notNull().default("0"),
  rejectedQty: qtyCol("rejected_qty").notNull().default("0"),
  materialCost: moneyCol("material_cost").notNull().default("0"),
  overheadCost: moneyCol("overhead_cost").notNull().default("0"),
  /** Cost of extra issues not yet carried into a completion. */
  pendingCost: moneyCol("pending_cost").notNull().default("0"),
  salesOrderId: uuid("sales_order_id"),
  notes: text("notes"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
}, (t) => [uniqueIndex("production_orders_number").on(t.companyId, t.number)]);

export const productionEntries = pgTable("production_entries", {
  id: id(),
  tenantId: tenantId(),
  orderId: uuid("order_id").notNull().references(() => productionOrders.id, { onDelete: "cascade" }),
  kind: varchar("kind", { length: 10 }).notNull(), // issue | complete
  date: date("date").notNull(),
  goodQty: qtyCol("good_qty").notNull().default("0"),
  rejectedQty: qtyCol("rejected_qty").notNull().default("0"),
  materialCost: moneyCol("material_cost").notNull().default("0"),
  overheadCost: moneyCol("overhead_cost").notNull().default("0"),
  unitCost: numeric("unit_cost", { precision: 18, scale: 4 }).notNull().default("0"),
  lines: jsonb("lines").$type<{ itemId: string; qty: string; rate: string }[]>().notNull().default([]),
  notes: text("notes"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
});

/**
 * Job work (section 143): inputs sent to a job worker on a challan without tax, and processed goods
 * received back. Inputs must come back within a year (capital goods three), reported half-yearly on ITC-04.
 */
export const jobWorkChallans = pgTable("job_work_challans", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  number: varchar("number", { length: 16 }).notNull(),
  date: date("date").notNull(),
  direction: varchar("direction", { length: 3 }).notNull(), // out | in
  jobWorkerId: uuid("job_worker_id").notNull().references(() => accounts.id),
  process: varchar("process", { length: 80 }),
  sentChallanId: uuid("sent_challan_id"),
  /** out: inputs sent; in: goods received back. */
  lines: jsonb("lines").$type<{ itemId: string; qty: string; rate: string; capitalGoods?: boolean }[]>().notNull(),
  /** in: inputs used up for what came back (including process waste), by line of the out challan. */
  consumed: jsonb("consumed").$type<{ itemId: string; qty: string }[]>().notNull().default([]),
  charges: moneyCol("charges").notNull().default("0"),
  status: varchar("status", { length: 10 }).notNull().default("posted"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("job_work_number").on(t.companyId, t.number)]);

// ---- POS ----------------------------------------------------------------------------------------------

export const posSettings = pgTable("pos_settings", {
  companyId: uuid("company_id").primaryKey().references(() => companies.id, { onDelete: "cascade" }),
  tenantId: tenantId(),
  pricesIncludeTax: boolean("prices_include_tax").notNull().default(true),
  loyaltyEnabled: boolean("loyalty_enabled").notNull().default(false),
  loyaltyPointsPer100: integer("loyalty_points_per_100").notNull().default(1),
  /** Points per 100 rupees by bill amount (richer bills earn more), and the fewest points that can be redeemed at once. */
  loyaltySlabs: jsonb("loyalty_slabs").$type<{ from: string; per100: number }[]>(),
  loyaltyMinRedeem: integer("loyalty_min_redeem").notNull().default(0),
  /** Points lapse this many days after they were earned; empty means they never do. */
  loyaltyValidityDays: integer("loyalty_validity_days"),
  /** The share of a line's commission that goes to the helper when a line names one. */
  helperSharePct: numeric("helper_share_pct", { precision: 5, scale: 2 }).notNull().default("30"),
  /** Earning rules: no points on a bill that carried any discount, none on lines sold under an offer or discount, none on listed brands or categories. */
  loyaltyExcludeDiscountedBills: boolean("loyalty_exclude_discounted_bills").notNull().default(false),
  loyaltyExcludeDiscountedItems: boolean("loyalty_exclude_discounted_items").notNull().default(false),
  loyaltyExcludeBrands: text("loyalty_exclude_brands").array(),
  loyaltyExcludeCategories: text("loyalty_exclude_categories").array(),
  loyaltyPointValue: numeric("loyalty_point_value", { precision: 10, scale: 2 }).notNull().default("1"),
  loyaltyMaxRedeemPct: numeric("loyalty_max_redeem_pct", { precision: 5, scale: 2 }).notNull().default("20"),
  /** Points for a member whose referral joins and buys. */
  referralPoints: integer("referral_points").notNull().default(0),
  receiptFooter: text("receipt_footer"),
  /** Counter controls: whether the cashier may change a rate (on unless locked), and the largest discounts without an approver. */
  allowRateChange: boolean("allow_rate_change").notNull().default(true),
  maxLineDiscountPct: numeric("max_line_discount_pct", { precision: 5, scale: 2 }),
  maxBillDiscountPct: numeric("max_bill_discount_pct", { precision: 5, scale: 2 }),
  /** Every line must name the salesman who sold it (for commission and targets). */
  requireSalesman: boolean("require_salesman").notNull().default(false),
  /** Send the bill on WhatsApp by itself when the customer's mobile is on it. */
  autoSendBill: boolean("auto_send_bill").notNull().default(false),
});

/** A billing counter. A terminal bound to a device numbers its own bills (it may be offline). */
export const posTerminals = pgTable("pos_terminals", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 4 }).notNull(),
  name: varchar("name", { length: 60 }).notNull(),
  warehouseId: uuid("warehouse_id").notNull().references(() => warehouses.id),
  deviceId: uuid("device_id").references(() => devices.id),
  archived: boolean("archived").notNull().default(false),
}, (t) => [uniqueIndex("pos_terminals_code").on(t.companyId, t.code)]);

/** A cashier's shift at a terminal: opening float, and at close the cash counted against expected. */
export const posSessions = pgTable("pos_sessions", {
  id: id(),
  tenantId: tenantId(),
  terminalId: uuid("terminal_id").notNull().references(() => posTerminals.id),
  openedBy: uuid("opened_by").references(() => users.id, { onDelete: "set null" }),
  openedAt: timestamp("opened_at", { withTimezone: true }).notNull().defaultNow(),
  openingCash: moneyCol("opening_cash").notNull().default("0"),
  status: varchar("status", { length: 8 }).notNull().default("open"),
  closedBy: uuid("closed_by").references(() => users.id, { onDelete: "set null" }),
  closedAt: timestamp("closed_at", { withTimezone: true }),
  expectedCash: moneyCol("expected_cash"),
  countedCash: moneyCol("counted_cash"),
  difference: moneyCol("difference"),
  /** A closed shift with a cash difference is signed off by someone with the approve right, with a note. */
  varianceSignedBy: uuid("variance_signed_by").references(() => users.id, { onDelete: "set null" }),
  varianceSignedAt: timestamp("variance_signed_at", { withTimezone: true }),
  varianceNote: varchar("variance_note", { length: 200 }),
  totals: jsonb("totals").$type<Record<string, string>>(),
  voucherId: uuid("voucher_id").references(() => vouchers.id),
});

/** Tailors (karigars) who do alterations: in-house staff, or outside karigars paid per piece through their own ledger. */
export const karigars = pgTable("karigars", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 80 }).notNull(),
  phone: varchar("phone", { length: 10 }),
  /** Outside karigars: labour is credited to this ledger when the work comes back. */
  accountId: uuid("account_id").references(() => accounts.id),
  employeeId: uuid("employee_id").references(() => employees.id),
  active: boolean("active").notNull().default(true),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("karigars_name").on(t.companyId, sql`lower(${t.name})`)]);

/** What can be done to a garment, with the customer's charge and the karigar's labour. */
export const alterationTypes = pgTable("alteration_types", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 60 }).notNull(),
  kind: varchar("kind", { length: 10 }).notNull().default("alteration"), // alteration | repair
  charge: moneyCol("charge").notNull().default("0"),
  labour: moneyCol("labour").notNull().default("0"),
  active: boolean("active").notNull().default(true),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("alteration_types_name").on(t.companyId, sql`lower(${t.name})`)]);

/**
 * An alteration or repair slip: garments taken in (against a counter bill or on their own), given to a
 * karigar, back for trial and delivery. Charges are collected as a counter bill at delivery.
 */
export const alterations = pgTable("alterations", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  number: varchar("number", { length: 16 }).notNull(),
  date: date("date").notNull(),
  billId: uuid("bill_id").references(() => posBills.id),
  customerName: varchar("customer_name", { length: 80 }),
  customerPhone: varchar("customer_phone", { length: 10 }),
  lines: jsonb("lines").$type<{ typeId: string; name: string; garment: string; qty: number; charge: string; labour: string; notes?: string }[]>().notNull(),
  charge: moneyCol("charge").notNull(),
  labour: moneyCol("labour").notNull(),
  /** Free with the purchase: nothing to collect at delivery. */
  complimentary: boolean("complimentary").notNull().default(false),
  trialOn: date("trial_on"),
  deliveryOn: date("delivery_on").notNull(),
  status: varchar("status", { length: 12 }).notNull().default("received"), // received | with_karigar | ready | delivered | cancelled
  karigarId: uuid("karigar_id").references(() => karigars.id),
  issuedOn: date("issued_on"),
  readyOn: date("ready_on"),
  deliveredOn: date("delivered_on"),
  labourVoucherId: uuid("labour_voucher_id").references(() => vouchers.id),
  deliveryBillId: uuid("delivery_bill_id").references(() => posBills.id),
  notes: text("notes"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("alterations_number").on(t.companyId, t.number), index("alterations_status").on(t.companyId, t.status)]);

/** A customer's measurements for one kind of garment (shirt, trouser, kurta, blouse...), with an optional photo. */
export const measurements = pgTable("measurements", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  customerPhone: varchar("customer_phone", { length: 10 }).notNull(),
  customerName: varchar("customer_name", { length: 80 }),
  garment: varchar("garment", { length: 40 }).notNull(),
  /** Name to value in inches (chest, waist, length, sleeve...). */
  values: jsonb("values").$type<Record<string, string>>().notNull(),
  photoFileId: uuid("photo_file_id").references(() => files.id, { onDelete: "set null" }),
  notes: text("notes"),
  takenOn: date("taken_on").notNull(),
  createdAt: createdAt(),
}, (t) => [index("measurements_phone").on(t.companyId, t.customerPhone)]);

/** Karigar labour per piece for each process of a garment (cutting, stitching, embroidery, finishing). */
export const tailoringRates = pgTable("tailoring_rates", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  garment: varchar("garment", { length: 40 }).notNull(),
  process: varchar("process", { length: 40 }).notNull(),
  rate: moneyCol("rate").notNull(),
  position: integer("position").notNull().default(0),
}, (t) => [uniqueIndex("tailoring_rates_key").on(t.companyId, sql`lower(${t.garment})`, sql`lower(${t.process})`)]);

/**
 * A made-to-order tailoring order. Each line is a garment with its measurements, fabric (the customer's
 * own, or from stock) and price, and its processes, each given to a karigar and marked done. The advance
 * is held as store credit for the order and pays part of the tailoring bill at delivery.
 */
export const tailoringOrders = pgTable("tailoring_orders", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  number: varchar("number", { length: 16 }).notNull(),
  date: date("date").notNull(),
  customerName: varchar("customer_name", { length: 80 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 10 }).notNull(),
  lines: jsonb("lines").$type<{
    garment: string; qty: number; price: string; measurementId: string | null; notes?: string;
    fabricItemId: string | null; fabricQty: string | null;
    processes: { process: string; rate: string; karigarId: string | null; doneOn: string | null; voucherId: string | null }[];
  }[]>().notNull(),
  total: moneyCol("total").notNull(),
  advance: moneyCol("advance").notNull().default("0"),
  advanceVoucherId: uuid("advance_voucher_id").references(() => giftVouchers.id),
  trialOn: date("trial_on"),
  deliveryOn: date("delivery_on").notNull(),
  status: varchar("status", { length: 12 }).notNull().default("booked"), // booked | in_work | ready | delivered | cancelled
  deliveredOn: date("delivered_on"),
  deliveryBillId: uuid("delivery_bill_id").references(() => posBills.id),
  notes: text("notes"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("tailoring_orders_number").on(t.companyId, t.number), index("tailoring_orders_status").on(t.companyId, t.status)]);

/**
 * Consignment register: goods sent to a consignee's location on a Rule 55 challan, goods taken back, and
 * what the consignee reports sold (billed on a tax invoice from their location).
 */
export const consignmentMoves = pgTable("consignment_moves", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").notNull().references(() => accounts.id),
  kind: varchar("kind", { length: 8 }).notNull(), // send | return | sale
  number: varchar("number", { length: 16 }).notNull(),
  date: date("date").notNull(),
  lines: jsonb("lines").$type<{ itemId: string; name: string; qty: string; rate: string }[]>().notNull(),
  value: moneyCol("value").notNull(),
  stockJournalId: uuid("stock_journal_id").references(() => stockJournals.id),
  invoiceId: uuid("invoice_id").references(() => salesInvoices.id),
  narration: text("narration"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [index("consignment_moves_customer").on(t.companyId, t.customerId, t.date)]);

/**
 * Photos of a style, per colour (null colour: every colour). The browser shrinks each photo to a full
 * view and a thumbnail before upload, so the files stay small. Archived photos stay for history.
 */
export const styleImages = pgTable("style_images", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  styleId: uuid("style_id").notNull().references(() => styles.id, { onDelete: "cascade" }),
  color: text("color"),
  view: varchar("view", { length: 10 }).notNull().default("front"), // front | back | detail | model | other
  fileId: uuid("file_id").notNull().references(() => files.id),
  thumbFileId: uuid("thumb_file_id").notNull().references(() => files.id),
  sortOrder: integer("sort_order").notNull().default(0),
  archived: boolean("archived").notNull().default(false),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [index("style_images_style").on(t.styleId, t.color)]);

/**
 * A document opened from a link without signing in (a counter bill, an invoice or a customer's statement
 * sent on WhatsApp). Only the token's hash is kept; the link stops working when it expires.
 */
export const sharedDocuments = pgTable("shared_documents", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  kind: varchar("kind", { length: 12 }).notNull(), // pos_bill | invoice | statement
  docId: uuid("doc_id").notNull(),
  tokenHash: char("token_hash", { length: 64 }).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("shared_documents_token").on(t.tokenHash), index("shared_documents_doc").on(t.docId)]);

/**
 * A pick of styles and colours for a party (or anyone), to send as a catalogue: printed, exported, or
 * shared by a link that works without signing in until it expires. Only the token's hash is stored.
 */
export const catalogueSelections = pgTable("catalogue_selections", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  partyId: uuid("party_id").references(() => accounts.id),
  lines: jsonb("lines").$type<{ styleId: string; color: string | null }[]>().notNull(),
  showPrices: boolean("show_prices").notNull().default(true),
  showStock: boolean("show_stock").notNull().default(false),
  shareTokenHash: char("share_token_hash", { length: 64 }),
  shareExpiresAt: timestamp("share_expires_at", { withTimezone: true }),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (t) => [uniqueIndex("catalogue_selections_token").on(t.shareTokenHash), index("catalogue_selections_company").on(t.companyId)]);

export const loyaltyMembers = pgTable("loyalty_members", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  phone: varchar("phone", { length: 10 }).notNull(),
  name: varchar("name", { length: 80 }),
  points: integer("points").notNull().default(0),
  lifetimePoints: integer("lifetime_points").notNull().default(0),
  referredBy: varchar("referred_by", { length: 10 }),
  birthday: date("birthday"),
  anniversary: date("anniversary"),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("loyalty_members_phone").on(t.companyId, t.phone)]);

/** Points earned on one bill, kept as a lot so they can lapse on their own date and be spent oldest-expiring first. */
export const loyaltyLots = pgTable("loyalty_lots", {
  id: id(),
  tenantId: tenantId(),
  memberId: uuid("member_id").notNull().references(() => loyaltyMembers.id, { onDelete: "cascade" }),
  billId: uuid("bill_id"),
  earned: integer("earned").notNull(),
  left: integer("left").notNull(),
  earnedOn: date("earned_on").notNull(),
  expiresOn: date("expires_on"),
  createdAt: createdAt(),
}, (t) => [index("loyalty_lots_member").on(t.memberId, t.expiresOn)]);

/**
 * Gift vouchers sold at the counter: the money is a liability until the voucher pays for goods (GST is
 * charged then, on the goods), and what is left at expiry is written back as income.
 */
export const giftVouchers = pgTable("gift_vouchers", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 16 }).notNull(),
  value: moneyCol("value").notNull(),
  balance: moneyCol("balance").notNull(),
  issuedOn: date("issued_on").notNull(),
  expiresOn: date("expires_on").notNull(),
  status: varchar("status", { length: 10 }).notNull().default("active"), // active | used | expired
  customerPhone: varchar("customer_phone", { length: 10 }),
  customerName: varchar("customer_name", { length: 80 }),
  paidBy: varchar("paid_by", { length: 6 }).notNull(), // cash | upi | card
  voucherId: uuid("voucher_id").references(() => vouchers.id),
  expiryVoucherId: uuid("expiry_voucher_id").references(() => vouchers.id),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("gift_vouchers_code").on(t.companyId, t.code)]);

export const giftVoucherRedemptions = pgTable("gift_voucher_redemptions", {
  id: id(),
  tenantId: tenantId(),
  giftVoucherId: uuid("gift_voucher_id").notNull().references(() => giftVouchers.id, { onDelete: "cascade" }),
  billId: uuid("bill_id").notNull(),
  date: date("date").notNull(),
  amount: moneyCol("amount").notNull(),
  reversed: boolean("reversed").notNull().default(false),
  createdAt: createdAt(),
}, (t) => [index("gift_voucher_redemptions_voucher").on(t.giftVoucherId)]);

/** Coupon codes: percent (with a cap) or an amount off the bill, above a minimum, for a period and a number of uses. */
export const coupons = pgTable("coupons", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 20 }).notNull(),
  kind: varchar("kind", { length: 8 }).notNull(), // percent | amount
  value: numeric("value", { precision: 18, scale: 2 }).notNull(),
  maxDiscount: moneyCol("max_discount"),
  minBill: moneyCol("min_bill"),
  startsOn: date("starts_on"),
  endsOn: date("ends_on"),
  maxUses: integer("max_uses"),
  used: integer("used").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("coupons_code").on(t.companyId, sql`upper(${t.code})`)]);

/** Discount cards (staff, members, privilege): a percent off every bill while the card is valid. */
export const discountCards = pgTable("discount_cards", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  number: varchar("number", { length: 20 }).notNull(),
  holder: varchar("holder", { length: 80 }).notNull(),
  phone: varchar("phone", { length: 10 }),
  pct: numeric("pct", { precision: 5, scale: 2 }).notNull(),
  validUntil: date("valid_until"),
  active: boolean("active").notNull().default(true),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("discount_cards_number").on(t.companyId, sql`upper(${t.number})`)]);

/** Lucky draws among the bills of a period: winners picked at random, one per customer. */
export const luckyDraws = pgTable("lucky_draws", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 80 }).notNull(),
  fromDate: date("from_date").notNull(),
  toDate: date("to_date").notNull(),
  minBill: moneyCol("min_bill"),
  entries: integer("entries").notNull(),
  winners: jsonb("winners").$type<{ billId: string; number: string; date: string; phone: string; name: string | null; total: string }[]>().notNull(),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
});

/** Retail bills (B2C tax invoices / cash memos) from POS terminals. */
/**
 * Store schemes (offers) applied at the counter: see packages/domain/src/schemes.ts for the rules.
 * Scope picks items by id, style, brand or category (any of them; all empty means every item).
 */
type SchemeScopeJson = {
  itemIds?: string[]; styleIds?: string[]; brands?: string[]; categories?: string[];
  /** Style attributes by name (fabric, sleeves and so on): the offer covers styles with any of the values listed. */
  attrs?: Record<string, string[]>;
  exclude?: { itemIds?: string[]; styleIds?: string[]; brands?: string[]; categories?: string[]; attrs?: Record<string, string[]> };
};

export const schemes = pgTable("schemes", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 60 }).notNull(),
  kind: varchar("kind", { length: 12 }).notNull(), // percent | amount_off | qty_slab | value_slab | buy_get | combo
  startsOn: date("starts_on"),
  endsOn: date("ends_on"),
  /** Days of the week it runs on (0 Sunday to 6 Saturday) and the hours it runs between; empty or null: every day, all day. */
  weekdays: jsonb("weekdays").$type<number[]>(),
  /** Manual order when several offers could apply: lowest first; null leaves it to whichever saves the customer most. */
  priority: integer("priority"),
  fromTime: char("from_time", { length: 5 }),
  toTime: char("to_time", { length: 5 }),
  /** Branches it runs at (by the counter's warehouse); empty or null: every branch. */
  branchIds: jsonb("branch_ids").$type<string[]>(),
  active: boolean("active").notNull().default(true),
  /** What it covers (by item, style, brand, category or a style attribute such as fabric) and what is left out of that. */
  scope: jsonb("scope").$type<SchemeScopeJson>().notNull().default({}),
  /** Counter flags: ask the cashier first; whether it may run with gift vouchers, with a discount card or coupon, and whether goods bought on it may be returned. */
  confirmBeforeApply: boolean("confirm_before_apply").notNull().default(false),
  allowWithGiftVouchers: boolean("allow_with_gift_vouchers").notNull().default(true),
  allowWithCustomerDiscount: boolean("allow_with_customer_discount").notNull().default(true),
  allowReturns: boolean("allow_returns").notNull().default(true),
  /** Also applies to lines that already carry a discount of their own; thresholds and amounts stated with tax in them; and what commission is worked on for lines it touched (net | list | none). */
  applyOnDiscounted: boolean("apply_on_discounted").notNull().default(false),
  inclusiveOfTax: boolean("inclusive_of_tax").notNull().default(false),
  commissionBasis: varchar("commission_basis", { length: 4 }).notNull().default("net"),
  pct: numeric("pct", { precision: 5, scale: 2 }),
  amount: moneyCol("amount"),
  minValue: moneyCol("min_value"),
  buy: integer("buy"),
  get: integer("get"),
  slabs: jsonb("slabs").$type<{ from: string; pct: string }[]>(),
  comboPrice: moneyCol("combo_price"),
  comboItems: jsonb("combo_items").$type<{ itemId: string; qty: number }[]>(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (t) => [uniqueIndex("schemes_name").on(t.companyId, sql`lower(${t.name})`)]);

export const posBills = pgTable("pos_bills", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  terminalId: uuid("terminal_id").notNull().references(() => posTerminals.id),
  sessionId: uuid("session_id").references(() => posSessions.id),
  number: varchar("number", { length: 16 }).notNull(),
  date: date("date").notNull(),
  customerPhone: varchar("customer_phone", { length: 10 }),
  customerName: varchar("customer_name", { length: 80 }),
  customerAccountId: uuid("customer_account_id").references(() => accounts.id),
  pricesIncludeTax: boolean("prices_include_tax").notNull(),
  taxable: moneyCol("taxable").notNull(),
  cgst: moneyCol("cgst").notNull().default("0"),
  sgst: moneyCol("sgst").notNull().default("0"),
  cess: moneyCol("cess").notNull().default("0"),
  discount: moneyCol("discount").notNull().default("0"),
  roundOff: moneyCol("round_off").notNull().default("0"),
  total: moneyCol("total").notNull(),
  payments: jsonb("payments").$type<{ mode: string; amount: string; reference?: string }[]>().notNull(),
  change: moneyCol("change").notNull().default("0"),
  taxByRate: jsonb("tax_by_rate").$type<{ rate: string; taxable: string; cgst: string; sgst: string; cess: string }[]>().notNull().default([]),
  loyaltyEarned: integer("loyalty_earned").notNull().default(0),
  loyaltyRedeemed: integer("loyalty_redeemed").notNull().default(0),
  status: varchar("status", { length: 8 }).notNull().default("paid"), // paid | void
  voidReason: text("void_reason"),
  voucherId: uuid("voucher_id").references(() => vouchers.id),
  source: varchar("source", { length: 8 }).notNull().default("web"), // web | device
  /** Coupon, discount card and gift vouchers used on the bill. */
  promos: jsonb("promos").$type<{
    coupon?: { id: string; code: string; discount: string }; card?: { id: string; number: string; discount: string };
    vouchers?: { id: string; code: string; amount: string }[];
  }>().notNull().default({}),
  /** Store schemes the bill got, with what each took off. */
  schemes: jsonb("schemes").$type<{ schemeId: string; name: string; discount: string; noReturns?: boolean }[]>().notNull().default([]),
  /** A device bill whose totals the server worked out differently (kept as charged, flagged). */
  mismatch: jsonb("mismatch").$type<Record<string, unknown>>(),
  /** Rate changes and discounts over the counter limits, with who allowed them and why. */
  overrides: jsonb("overrides").$type<{ kind: "rate" | "line_discount" | "bill_discount"; lineNo?: number; reason: string }[]>().notNull().default([]),
  /** An exchange: the return (pos_returns) taken on this same bill, whose credit paid for it. */
  returnId: uuid("return_id"),
  /** When the customer was billed. A device bill reaches the server later, so this is the time on the device. */
  billedAt: timestamp("billed_at", { withTimezone: true }),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("pos_bills_number").on(t.companyId, t.number), index("pos_bills_date").on(t.companyId, t.date)]);

export const posBillLines = pgTable("pos_bill_lines", {
  id: id(),
  tenantId: tenantId(),
  billId: uuid("bill_id").notNull().references(() => posBills.id, { onDelete: "cascade" }),
  lineNo: integer("line_no").notNull(),
  itemId: uuid("item_id").notNull().references(() => items.id),
  name: text("name").notNull(),
  hsn: varchar("hsn", { length: 8 }),
  qty: qtyCol("qty").notNull(),
  price: numeric("price", { precision: 18, scale: 2 }).notNull(),
  gstRate: numeric("gst_rate", { precision: 5, scale: 2 }).notNull(),
  cessRate: numeric("cess_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  discount: moneyCol("discount").notNull().default("0"),
  taxable: moneyCol("taxable").notNull(),
  cgst: moneyCol("cgst").notNull().default("0"),
  sgst: moneyCol("sgst").notNull().default("0"),
  cess: moneyCol("cess").notNull().default("0"),
  total: moneyCol("total").notNull(),
  returnedQty: qtyCol("returned_qty").notNull().default("0"),
  /** Who sold this line (commission, targets, salesman reports). */
  salesmanId: uuid("salesman_id").references(() => employees.id),
  /** Who helped, sharing the commission with the salesman. */
  /** The serial numbers of the pieces sold on this line, when the item is tracked by serial. */
  serials: jsonb("serials").$type<string[]>(),
  /** Added to (or taken from) the line's taxable value to get what commission is worked on, when an offer says commission is on the price before it, or on nothing. */
  commissionAdj: moneyCol("commission_adj").notNull().default("0"),
  helperId: uuid("helper_id").references(() => employees.id),
});

/** A bill parked at the counter (customer still choosing), to finish later on any counter of the store. */
export const posHeldBills = pgTable("pos_held_bills", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  terminalId: uuid("terminal_id").notNull().references(() => posTerminals.id),
  label: varchar("label", { length: 60 }),
  customerPhone: varchar("customer_phone", { length: 10 }),
  customerName: varchar("customer_name", { length: 80 }),
  lines: jsonb("lines").$type<{ itemId: string; qty: string; price?: string; discount?: string; salesmanId?: string }[]>().notNull(),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [index("pos_held_bills_terminal").on(t.terminalId, t.createdAt)]);

/**
 * Goods brought back to the counter against a bill: each line with its reason and condition (A back on
 * the shelf, B and C to the damaged and seconds store), refunded in cash, UPI or card or as store credit
 * (a gift voucher, which is how an exchange for another size or colour is paid). A B2C credit note.
 */
export const posReturns = pgTable("pos_returns", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  terminalId: uuid("terminal_id").notNull().references(() => posTerminals.id),
  sessionId: uuid("session_id").references(() => posSessions.id),
  billId: uuid("bill_id").notNull().references(() => posBills.id),
  number: varchar("number", { length: 16 }).notNull(),
  date: date("date").notNull(),
  lines: jsonb("lines").$type<{
    billLineId: string; itemId: string; name: string; hsn: string | null; qty: string; gstRate: string; reason: string; grade: string;
    taxable: string; cgst: string; sgst: string; cess: string; total: string;
  }[]>().notNull(),
  taxable: moneyCol("taxable").notNull(),
  cgst: moneyCol("cgst").notNull().default("0"),
  sgst: moneyCol("sgst").notNull().default("0"),
  cess: moneyCol("cess").notNull().default("0"),
  roundOff: moneyCol("round_off").notNull().default("0"),
  total: moneyCol("total").notNull(),
  refundMode: varchar("refund_mode", { length: 8 }).notNull(), // cash | upi | card | voucher
  giftVoucherId: uuid("gift_voucher_id").references(() => giftVouchers.id),
  voucherId: uuid("voucher_id").references(() => vouchers.id),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("pos_returns_number").on(t.companyId, t.number), index("pos_returns_date").on(t.companyId, t.date), index("pos_returns_bill").on(t.billId)]);

/** Tables protected by row-level security on tenant_id. `tenants` itself is protected on id. */
// ---- Files (receipts and other attachments) ----------------------------------------------------------

/** Uploaded files, kept in the database (small: receipts, bills). A storage adapter can move them to S3/R2 later. */
export const files = pgTable("files", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  contentType: varchar("content_type", { length: 80 }).notNull(),
  size: integer("size").notNull(),
  sha256: char("sha256", { length: 64 }).notNull(),
  data: bytea("data").notNull(),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
});

// ---- Banking -------------------------------------------------------------------------------------------

/** Bank details and feed consent for a bank ledger. */
export const bankProfiles = pgTable("bank_profiles", {
  accountId: uuid("account_id").primaryKey().references(() => accounts.id, { onDelete: "cascade" }),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  bankName: varchar("bank_name", { length: 80 }),
  accountLast4: char("account_last4", { length: 4 }),
  ifsc: char("ifsc", { length: 11 }),
  feedProvider: varchar("feed_provider", { length: 20 }),
  feedConsentId: varchar("feed_consent_id", { length: 80 }),
  feedStatus: varchar("feed_status", { length: 12 }), // pending | active | revoked
  feedFetchedTo: date("feed_fetched_to"),
});

export const bankStatements = pgTable("bank_statements", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  accountId: uuid("account_id").notNull().references(() => accounts.id),
  source: varchar("source", { length: 8 }).notNull(), // upload | feed
  fileName: text("file_name"),
  fromDate: date("from_date").notNull(),
  toDate: date("to_date").notNull(),
  lineCount: integer("line_count").notNull(),
  duplicates: integer("duplicates").notNull().default(0),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
});

/** One row of a bank statement. Matched to one or more vouchers (bank_matches), created as a new voucher, or ignored. */
export const bankLines = pgTable("bank_lines", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  accountId: uuid("account_id").notNull().references(() => accounts.id),
  statementId: uuid("statement_id").notNull().references(() => bankStatements.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  description: text("description").notNull(),
  reference: varchar("reference", { length: 60 }),
  debit: moneyCol("debit").notNull().default("0"),
  credit: moneyCol("credit").notNull().default("0"),
  balance: moneyCol("balance"),
  fingerprint: text("fingerprint").notNull(),
  /** Position in date order within the account (statements list newest or oldest first). */
  seq: integer("seq").notNull().default(0),
  status: varchar("status", { length: 10 }).notNull().default("unmatched"), // unmatched | matched | ignored
  matchedBy: varchar("matched_by", { length: 8 }), // auto | manual | rule | created
  matchedAt: timestamp("matched_at", { withTimezone: true }),
}, (t) => [uniqueIndex("bank_lines_fingerprint").on(t.accountId, t.fingerprint), index("bank_lines_date").on(t.accountId, t.date)]);

/** A voucher cleared by a statement line (on this bank ledger). A voucher clears once per bank. */
export const bankMatches = pgTable("bank_matches", {
  id: id(),
  tenantId: tenantId(),
  bankLineId: uuid("bank_line_id").notNull().references(() => bankLines.id, { onDelete: "cascade" }),
  accountId: uuid("account_id").notNull().references(() => accounts.id),
  voucherId: uuid("voucher_id").notNull().references(() => vouchers.id),
  amount: moneyCol("amount").notNull(),
}, (t) => [uniqueIndex("bank_matches_voucher").on(t.accountId, t.voucherId)]);

/** "Lines whose description has these words go to this ledger" (bank charges, interest, standing orders). */
export const bankRules = pgTable("bank_rules", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  contains: varchar("contains", { length: 80 }).notNull(),
  direction: varchar("direction", { length: 3 }).notNull().default("any"), // in | out | any
  accountId: uuid("account_id").notNull().references(() => accounts.id),
  narration: varchar("narration", { length: 120 }),
  priority: integer("priority").notNull().default(10),
  archived: boolean("archived").notNull().default(false),
});

/** A payment-gateway payout: gross collections less refunds, fees and GST on fees, landing in the bank as one credit. */
export const gatewaySettlements = pgTable("gateway_settlements", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  provider: varchar("provider", { length: 20 }).notNull(),
  settlementId: varchar("settlement_id", { length: 60 }).notNull(),
  utr: varchar("utr", { length: 40 }),
  settledOn: date("settled_on").notNull(),
  payments: integer("payments").notNull(),
  gross: moneyCol("gross").notNull(),
  refunds: moneyCol("refunds").notNull().default("0"),
  fees: moneyCol("fees").notNull().default("0"),
  tax: moneyCol("tax").notNull().default("0"),
  adjustments: moneyCol("adjustments").notNull().default("0"),
  net: moneyCol("net").notNull(),
  bankAccountId: uuid("bank_account_id").notNull().references(() => accounts.id),
  clearingAccountId: uuid("clearing_account_id").notNull().references(() => accounts.id),
  voucherId: uuid("voucher_id").references(() => vouchers.id),
  status: varchar("status", { length: 10 }).notNull().default("posted"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("gateway_settlements_id").on(t.companyId, t.provider, t.settlementId)]);

// ---- Fixed assets ------------------------------------------------------------------------------------

export const assetClasses = pgTable("asset_classes", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 60 }).notNull(),
  nameHi: varchar("name_hi", { length: 60 }),
  method: varchar("method", { length: 3 }).notNull().default("slm"), // slm | wdv
  lifeYears: numeric("life_years", { precision: 5, scale: 2 }).notNull(),
  residualPct: numeric("residual_pct", { precision: 5, scale: 2 }).notNull().default("5"),
  itBlock: varchar("it_block", { length: 30 }).notNull(),
  itRate: numeric("it_rate", { precision: 5, scale: 2 }).notNull(),
  assetAccountId: uuid("asset_account_id").notNull().references(() => accounts.id),
  accumulatedAccountId: uuid("accumulated_account_id").notNull().references(() => accounts.id),
  archived: boolean("archived").notNull().default(false),
}, (t) => [uniqueIndex("asset_classes_name").on(t.companyId, t.name)]);

export const assets = pgTable("assets", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 16 }).notNull(),
  name: text("name").notNull(),
  classId: uuid("class_id").notNull().references(() => assetClasses.id),
  purchaseDate: date("purchase_date").notNull(),
  putToUseOn: date("put_to_use_on").notNull(),
  cost: moneyCol("cost").notNull(),
  /** Depreciation charged before this asset came into Varchasv (assets brought forward). */
  openingAccumulated: moneyCol("opening_accumulated").notNull().default("0"),
  location: varchar("location", { length: 80 }),
  serialNo: varchar("serial_no", { length: 60 }),
  custodianId: uuid("custodian_id").references(() => employees.id),
  supplierId: uuid("supplier_id").references(() => accounts.id),
  invoiceRef: varchar("invoice_ref", { length: 40 }),
  voucherId: uuid("voucher_id").references(() => vouchers.id),
  status: varchar("status", { length: 10 }).notNull().default("active"), // active | disposed
  disposedOn: date("disposed_on"),
  saleValue: moneyCol("sale_value"),
  disposalVoucherId: uuid("disposal_voucher_id").references(() => vouchers.id),
  notes: text("notes"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("assets_code").on(t.companyId, t.code)]);

export const depreciationRuns = pgTable("depreciation_runs", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  fromDate: date("from_date").notNull(),
  toDate: date("to_date").notNull(),
  total: moneyCol("total").notNull(),
  voucherId: uuid("voucher_id").references(() => vouchers.id),
  status: varchar("status", { length: 10 }).notNull().default("posted"), // posted | cancelled
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
});

export const depreciationEntries = pgTable("depreciation_entries", {
  id: id(),
  tenantId: tenantId(),
  runId: uuid("run_id").notNull().references(() => depreciationRuns.id, { onDelete: "cascade" }),
  assetId: uuid("asset_id").notNull().references(() => assets.id),
  amount: moneyCol("amount").notNull(),
  days: integer("days").notNull(),
});

/** Opening written down value of an income-tax block for a year (entered once; later years carry forward). */
export const itBlockOpenings = pgTable("it_block_openings", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  fy: varchar("fy", { length: 7 }).notNull(),
  block: varchar("block", { length: 30 }).notNull(),
  rate: numeric("rate", { precision: 5, scale: 2 }).notNull(),
  openingWdv: moneyCol("opening_wdv").notNull(),
}, (t) => [uniqueIndex("it_block_openings_key").on(t.companyId, t.fy, t.block)]);

// ---- Expenses ------------------------------------------------------------------------------------------

export const expenseCategories = pgTable("expense_categories", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 60 }).notNull(),
  nameHi: varchar("name_hi", { length: 60 }),
  accountId: uuid("account_id").notNull().references(() => accounts.id),
  /** Section 17(5): no input tax credit (e.g. food, travel for employees' personal use). */
  blockedCredit: boolean("blocked_credit").notNull().default(false),
  limitPerClaim: moneyCol("limit_per_claim"),
  receiptRequiredAbove: moneyCol("receipt_required_above"),
  /** Travel policy: what a kilometre and a day away are paid, so a travel line is worked out from the trip rather than typed. */
  perKmRate: numeric("per_km_rate", { precision: 10, scale: 2 }),
  dailyAllowance: numeric("daily_allowance", { precision: 10, scale: 2 }),
  archived: boolean("archived").notNull().default(false),
}, (t) => [uniqueIndex("expense_categories_name").on(t.companyId, t.name)]);

export const expenseClaims = pgTable("expense_claims", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  number: varchar("number", { length: 16 }).notNull(),
  employeeId: uuid("employee_id").notNull().references(() => employees.id),
  date: date("date").notNull(),
  title: varchar("title", { length: 120 }).notNull(),
  projectId: uuid("project_id"),
  status: varchar("status", { length: 10 }).notNull().default("draft"), // draft | submitted | approved | rejected | paid | cancelled
  total: moneyCol("total").notNull(),
  itc: moneyCol("itc").notNull().default("0"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  decidedBy: uuid("decided_by").references(() => users.id, { onDelete: "set null" }),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
  rejectReason: text("reject_reason"),
  voucherId: uuid("voucher_id").references(() => vouchers.id),
  paymentVoucherId: uuid("payment_voucher_id").references(() => vouchers.id),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("expense_claims_number").on(t.companyId, t.number)]);

export const expenseLines = pgTable("expense_lines", {
  id: id(),
  tenantId: tenantId(),
  claimId: uuid("claim_id").notNull().references(() => expenseClaims.id, { onDelete: "cascade" }),
  lineNo: integer("line_no").notNull(),
  date: date("date").notNull(),
  categoryId: uuid("category_id").notNull().references(() => expenseCategories.id),
  description: text("description"),
  amount: moneyCol("amount").notNull(),
  /** GST on a tax invoice in the company's name: the credit is claimed, the expense is the taxable value. */
  gstRate: numeric("gst_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  vendorName: varchar("vendor_name", { length: 100 }),
  vendorGstin: char("vendor_gstin", { length: 15 }),
  invoiceNo: varchar("invoice_no", { length: 30 }),
  taxable: moneyCol("taxable").notNull(),
  cgst: moneyCol("cgst").notNull().default("0"),
  sgst: moneyCol("sgst").notNull().default("0"),
  igst: moneyCol("igst").notNull().default("0"),
  projectId: uuid("project_id"),
  fileId: uuid("file_id").references(() => files.id),
  ocr: jsonb("ocr").$type<Record<string, unknown>>(),
  /** A trip: where from and to, kilometres and days away. */
  travel: jsonb("travel").$type<{ from: string; to: string; km?: string; days?: number }>(),
});

// ---- Projects ------------------------------------------------------------------------------------------

export const projects = pgTable("projects", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 12 }).notNull(),
  name: text("name").notNull(),
  customerId: uuid("customer_id").references(() => accounts.id),
  status: varchar("status", { length: 10 }).notNull().default("active"), // active | on_hold | completed | cancelled
  billing: varchar("billing", { length: 16 }).notNull().default("fixed"), // fixed | time_material | non_billable
  contractValue: moneyCol("contract_value"),
  budgetCost: moneyCol("budget_cost"),
  budgetHours: numeric("budget_hours", { precision: 10, scale: 2 }),
  billRate: moneyCol("bill_rate"),
  billingItemId: uuid("billing_item_id").references(() => items.id),
  startOn: date("start_on"),
  endOn: date("end_on"),
  notes: text("notes"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("projects_code").on(t.companyId, t.code)]);

export const projectTasks = pgTable("project_tasks", {
  id: id(),
  tenantId: tenantId(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 120 }).notNull(),
  status: varchar("status", { length: 8 }).notNull().default("todo"), // todo | doing | done
  assigneeId: uuid("assignee_id").references(() => employees.id),
  estimatedHours: numeric("estimated_hours", { precision: 8, scale: 2 }),
  dueOn: date("due_on"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: createdAt(),
});

/** Per-person bill rate on a project (else the project's rate). */
export const projectMembers = pgTable("project_members", {
  id: id(),
  tenantId: tenantId(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  employeeId: uuid("employee_id").notNull().references(() => employees.id),
  billRate: moneyCol("bill_rate"),
}, (t) => [uniqueIndex("project_members_key").on(t.projectId, t.employeeId)]);

export const timesheets = pgTable("timesheets", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  projectId: uuid("project_id").notNull().references(() => projects.id),
  taskId: uuid("task_id").references(() => projectTasks.id, { onDelete: "set null" }),
  employeeId: uuid("employee_id").notNull().references(() => employees.id),
  date: date("date").notNull(),
  hours: numeric("hours", { precision: 5, scale: 2 }).notNull(),
  billable: boolean("billable").notNull().default(true),
  note: varchar("note", { length: 200 }),
  /** Rates when the time was logged, so later pay changes don't rewrite past project costs. */
  costRate: moneyCol("cost_rate").notNull(),
  billRate: moneyCol("bill_rate").notNull().default("0"),
  status: varchar("status", { length: 10 }).notNull().default("submitted"), // submitted | approved | rejected | billed
  invoiceId: uuid("invoice_id"),
  approvedBy: uuid("approved_by").references(() => users.id, { onDelete: "set null" }),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [index("timesheets_project").on(t.projectId, t.date), index("timesheets_employee").on(t.employeeId, t.date)]);

export const projectMilestones = pgTable("project_milestones", {
  id: id(),
  tenantId: tenantId(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 120 }).notNull(),
  amount: moneyCol("amount").notNull(),
  dueOn: date("due_on"),
  status: varchar("status", { length: 8 }).notNull().default("pending"), // pending | billed
  invoiceId: uuid("invoice_id"),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ---- CRM ---------------------------------------------------------------------------------------------

/** A prospective customer, moving through the pipeline until won (converted to a customer ledger) or lost. */
export const crmLeads = pgTable("crm_leads", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 12 }).notNull(),
  name: text("name").notNull(),
  organisation: text("organisation"),
  phone: varchar("phone", { length: 15 }),
  email: varchar("email", { length: 120 }),
  gstin: char("gstin", { length: 15 }),
  stateCode: char("state_code", { length: 2 }),
  city: varchar("city", { length: 80 }),
  source: varchar("source", { length: 12 }).notNull().default("other"),
  stage: varchar("stage", { length: 10 }).notNull().default("new"),
  value: moneyCol("value"),
  expectedClose: date("expected_close"),
  ownerId: uuid("owner_id").references(() => users.id, { onDelete: "set null" }),
  customerId: uuid("customer_id").references(() => accounts.id),
  lostReason: text("lost_reason"),
  notes: text("notes"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (t) => [uniqueIndex("crm_leads_code").on(t.companyId, t.code), index("crm_leads_stage").on(t.companyId, t.stage)]);

/** Calls, meetings, follow-up tasks and notes, on a lead or a customer. */
export const crmActivities = pgTable("crm_activities", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  leadId: uuid("lead_id").references(() => crmLeads.id, { onDelete: "cascade" }),
  accountId: uuid("account_id").references(() => accounts.id),
  kind: varchar("kind", { length: 10 }).notNull(), // call | meeting | task | note | whatsapp | email
  subject: varchar("subject", { length: 200 }).notNull(),
  dueAt: timestamp("due_at", { withTimezone: true }),
  doneAt: timestamp("done_at", { withTimezone: true }),
  ownerId: uuid("owner_id").references(() => users.id, { onDelete: "set null" }),
  notes: text("notes"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [index("crm_activities_due").on(t.companyId, t.dueAt)]);

/** Message templates; WhatsApp ones mirror a template approved by Meta ({{1}}, {{2}} placeholders). */
export const messageTemplates = pgTable("message_templates", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 60 }).notNull(),
  channel: varchar("channel", { length: 10 }).notNull().default("whatsapp"), // whatsapp | sms
  category: varchar("category", { length: 12 }).notNull().default("utility"), // utility | marketing
  language: varchar("language", { length: 5 }).notNull().default("en"),
  body: text("body").notNull(),
  providerName: varchar("provider_name", { length: 80 }),
  archived: boolean("archived").notNull().default(false),
}, (t) => [uniqueIndex("message_templates_name").on(t.companyId, t.name)]);

export const messages = pgTable("messages", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  channel: varchar("channel", { length: 10 }).notNull(),
  to: varchar("to", { length: 15 }).notNull(),
  accountId: uuid("account_id").references(() => accounts.id),
  leadId: uuid("lead_id").references(() => crmLeads.id, { onDelete: "set null" }),
  templateId: uuid("template_id").references(() => messageTemplates.id),
  body: text("body").notNull(),
  status: varchar("status", { length: 10 }).notNull(), // sent | failed
  provider: varchar("provider", { length: 20 }).notNull(),
  providerId: varchar("provider_id", { length: 120 }),
  error: text("error"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [index("messages_account").on(t.accountId, t.createdAt)]);

// ---- Communication centre -------------------------------------------------------------------------------------

/** Wording for an event on a channel in a language ({name}-style placeholders); the English one is the fallback. */
export const commTemplates = pgTable("comm_templates", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  event: varchar("event", { length: 30 }).notNull(),
  channel: varchar("channel", { length: 10 }).notNull(), // whatsapp | sms | email | push
  language: varchar("language", { length: 5 }).notNull().default("en"),
  category: varchar("category", { length: 12 }).notNull().default("utility"), // utility | marketing | security
  subject: varchar("subject", { length: 120 }),
  body: text("body").notNull(),
  archived: boolean("archived").notNull().default(false),
}, (t) => [uniqueIndex("comm_templates_key").on(t.companyId, t.event, t.channel, t.language)]);

/** What a person (by phone or email) has agreed to or refused on a channel. Marketing needs a yes; anyone who opted out gets nothing but security codes. */
export const commConsents = pgTable("comm_consents", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  contact: varchar("contact", { length: 120 }).notNull(),
  channel: varchar("channel", { length: 10 }).notNull(),
  marketingOptIn: boolean("marketing_opt_in").notNull().default(false),
  optedOut: boolean("opted_out").notNull().default(false),
  source: varchar("source", { length: 30 }),
  updatedAt: updatedAt(),
}, (t) => [uniqueIndex("comm_consents_key").on(t.companyId, t.contact, t.channel)]);

/** Every message the business has asked to send: queued, sent, delivered or failed, with attempts and cost. One dedupe key never queues twice. */
export const commOutbox = pgTable("comm_outbox", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  event: varchar("event", { length: 30 }).notNull(),
  channel: varchar("channel", { length: 10 }).notNull(),
  category: varchar("category", { length: 12 }).notNull(),
  language: varchar("language", { length: 5 }).notNull(),
  to: varchar("to", { length: 120 }).notNull(),
  accountId: uuid("account_id").references(() => accounts.id),
  subject: varchar("subject", { length: 120 }),
  body: text("body").notNull(),
  status: varchar("status", { length: 10 }).notNull().default("queued"), // queued | sent | delivered | failed | skipped
  attempts: integer("attempts").notNull().default(0),
  nextAttemptAt: timestamp("next_attempt_at", { withTimezone: true }).notNull().defaultNow(),
  dedupeKey: varchar("dedupe_key", { length: 120 }),
  provider: varchar("provider", { length: 20 }),
  providerId: varchar("provider_id", { length: 120 }),
  cost: numeric("cost", { precision: 10, scale: 2 }).notNull().default("0"),
  error: text("error"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
}, (t) => [
  uniqueIndex("comm_outbox_dedupe").on(t.companyId, t.dedupeKey).where(sql`${t.dedupeKey} is not null`),
  index("comm_outbox_due").on(t.status, t.nextAttemptAt),
  index("comm_outbox_company").on(t.companyId, t.createdAt),
]);

/** Cost per message by channel (the business's own rates, for the cost report), the owner's contacts, and how often to retry. */
export const commSettings = pgTable("comm_settings", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  costWhatsappUtility: numeric("cost_whatsapp_utility", { precision: 8, scale: 2 }).notNull().default("0"),
  costWhatsappMarketing: numeric("cost_whatsapp_marketing", { precision: 8, scale: 2 }).notNull().default("0"),
  costSms: numeric("cost_sms", { precision: 8, scale: 2 }).notNull().default("0"),
  costEmail: numeric("cost_email", { precision: 8, scale: 2 }).notNull().default("0"),
  costPush: numeric("cost_push", { precision: 8, scale: 2 }).notNull().default("0"),
  ownerPhone: varchar("owner_phone", { length: 10 }),
  ownerEmail: varchar("owner_email", { length: 120 }),
  maxAttempts: integer("max_attempts").notNull().default(3),
  /** The flows that message the customer by themselves: invoice_issued, payment_received, order_dispatched, payroll_paid, credit_exception, payment_reminders, approval_due. */
  autoEvents: jsonb("auto_events").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
}, (t) => [uniqueIndex("comm_settings_company").on(t.companyId)]);

// ---- Saved and scheduled reports ---------------------------------------------------------------------

export interface ReportConfig {
  dataset: string;
  groupBy: string[];
  measures: string[];
  period: { preset: string; from?: string; to?: string };
  filters?: Record<string, string>;
  /** The columns shown and their order (a column chooser); empty means all of them. */
  layout?: { columns: string[] };
}

export const savedReports = pgTable("saved_reports", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 80 }).notNull(),
  config: jsonb("config").$type<ReportConfig>().notNull(),
  frequency: varchar("frequency", { length: 8 }), // daily | weekly | monthly (null = not scheduled)
  hour: integer("hour"),
  weekday: integer("weekday"),
  day: integer("day"),
  recipients: text("recipients").array().notNull().default(sql`'{}'::text[]`),
  nextRunAt: timestamp("next_run_at", { withTimezone: true }),
  lastRunAt: timestamp("last_run_at", { withTimezone: true }),
  lastError: text("last_error"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [index("saved_reports_due").on(t.nextRunAt)]);

/**
 * Goods sent through a transporter: the LR (lorry receipt) number, what was sent, freight and whether it has
 * reached the customer. One row per consignment; an invoice may be sent in several.
 */
export const lrEntries = pgTable("lr_entries", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  transporter: text("transporter").notNull(),
  lrNumber: varchar("lr_number", { length: 30 }).notNull(),
  invoiceId: uuid("invoice_id").references(() => salesInvoices.id),
  customerId: uuid("customer_id").references(() => accounts.id),
  destination: text("destination"),
  packages: integer("packages").notNull().default(1),
  weightKg: numeric("weight_kg", { precision: 12, scale: 3 }),
  freight: moneyCol("freight").notNull().default("0"),
  /** paid: we paid the freight; to_pay: the customer pays the transporter on delivery. */
  freightBy: varchar("freight_by", { length: 7 }).notNull().default("paid"),
  status: varchar("status", { length: 10 }).notNull().default("booked"), // booked | in_transit | delivered
  deliveredOn: date("delivered_on"),
  note: text("note"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("lr_entries_transporter_lr").on(t.companyId, sql`lower(${t.transporter})`, t.lrNumber), index("lr_entries_company_date").on(t.companyId, t.date)]);

export const TENANT_TABLES = [
  "roles", "memberships", "companies", "branches", "fiscal_years", "devices", "number_series", "audit_log", "invitations",
  "account_groups", "accounts", "ledger_posting_defaults", "vouchers", "voucher_lines", "gl_entries",
  "uoms", "warehouses", "items", "size_scales", "colors", "styles", "item_pack_lines", "packing_boxes", "packing_box_lines", "packing_box_events", "item_units", "price_lists", "price_list_items", "stock_ledger", "stock_journals", "stock_journal_lines",
  "purchase_orders", "purchase_order_lines", "goods_receipts", "goods_receipt_lines", "goods_receipt_landed_charges", "goods_receipt_landed_allocations",
  "purchase_bills", "purchase_bill_lines", "purchase_returns", "purchase_return_lines",
  "sales_orders", "sales_order_lines", "delivery_orders", "delivery_order_lines", "delivery_notes", "delivery_note_lines", "delivery_returns", "sales_invoices", "sales_invoice_lines",
  "credit_notes", "credit_note_lines", "brokerage_bills", "sales_targets", "gst_settings", "quotations", "quotation_lines", "gst_filings", "gst_sessions",
  "employees", "salary_structures", "tax_declarations", "holidays", "leave_types", "leave_openings", "leave_requests", "attendance",
  "payroll_settings", "payroll_runs", "payslips", "settlements", "shifts", "employee_loans", "statutory_payments",
  "work_centres", "boms", "bom_lines", "bom_operations", "production_orders", "production_entries", "job_work_challans",
  "pos_settings", "pos_terminals", "pos_sessions", "loyalty_members", "karigars", "alteration_types", "alterations", "measurements", "tailoring_rates", "tailoring_orders", "consignment_moves", "style_images", "catalogue_selections", "shared_documents", "stock_counts", "stock_count_lines", "pos_bills", "pos_bill_lines", "pos_held_bills", "pos_returns", "schemes", "gift_vouchers", "gift_voucher_redemptions", "coupons", "discount_cards", "lucky_draws",
  "files", "bank_profiles", "bank_statements", "bank_lines", "bank_matches", "bank_rules", "gateway_settlements",
  "asset_classes", "assets", "depreciation_runs", "depreciation_entries", "it_block_openings",
  "expense_categories", "expense_claims", "expense_lines", "cash_commitments", "expense_allocation_rules", "itc_reversals", "gst_return_approvals", "gst_workpapers", "tds_section_map", "branch_prices", "item_serials", "approval_memos", "approval_memo_lines",
  "tcs_section_settings", "projects", "project_tasks", "project_members", "timesheets", "project_milestones",
  "crm_leads", "crm_activities", "message_templates", "messages", "saved_reports",
] as const;

/**
 * A business's preferences from the Settings screen: print options (what the invoice shows, paper and colour) and the like, one row per company.
 * Only keys the product knows (the registry in the domain package) are kept; a missing key means its default.
 */
export const companyPreferences = pgTable("company_preferences", {
  id: id(),
  tenantId: tenantId(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  prefs: jsonb("prefs").$type<Record<string, string | boolean>>().notNull().default({}),
  /** The business passcode that guards cancelling documents (salt and hash), when one is set. */
  passcodeHash: varchar("passcode_hash", { length: 200 }),
  updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
  updatedAt: updatedAt(),
}, (t) => [uniqueIndex("company_preferences_company").on(t.companyId)]);
