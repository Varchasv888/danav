import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import {
  checkEinvoice, computeInvoiceTax, dec, lineGstRate, einvoicePayload, fiscalYearOf, money, type EinvoiceDoc, type InvoiceTax, type TaxContext,
} from "@varchasv/domain";
import { GspError, gsp, type EwbCancelReason, type EwbExtendReason, type EwbVehicleReason } from "../integrations/gsp.js";
import { readPrefs } from "./prefsread.js";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { assertPeriodOpen, cancelVoucher, fiscalYearForDate, postVoucher, resolveCompany } from "./accounting.js";
import { qualityHoldWarehouse } from "./purchasing.js";
import { resolvePostingAccountIds } from "./ledgerparameters.js";
import { checkDeliveryOrderLines } from "./deliveryorders.js";
import { autoEmit } from "./comms.js";
import { assertGstr1Open } from "./filing.js";
import { saleMoves } from "./manufacturing.js";
import { outstanding } from "./returns.js";
import { currentRate, documentNumber, ensureInventory, postMoves, reverseMoves, type Move } from "./inventory.js";
import type { PriceLine } from "./purchasing.js";

export const SALES_SERIES = {
  quotation: { docType: "quotation", name: "Quotations", pattern: "QT/{FY}/{SEQ:5}" },
  proforma: { docType: "proforma", name: "Proforma invoices", pattern: "PI/{FY}/{SEQ:5}" },
  order: { docType: "sales_order", name: "Sales orders", pattern: "SO/{FY}/{SEQ:5}" },
  delivery: { docType: "delivery_note", name: "Delivery challans", pattern: "DC/{FY}/{SEQ:5}" },
  invoice: { docType: "sales_invoice", name: "Sales invoices", pattern: "INV/{FY}/{SEQ:5}" },
  creditNote: { docType: "credit_note", name: "Credit notes", pattern: "CN/{FY}/{SEQ:5}" },
};

interface Actor { tenantId: string; userId: string; ip?: string | undefined }
type Company = Awaited<ReturnType<typeof resolveCompany>>;
const q4 = (v: string | number) => dec(v).toDecimalPlaces(4).toFixed(4);
const TAX_KEYS = ["cgst", "sgst", "utgst", "igst", "cess"] as const;

const taxFields = (t: { taxableValue: string; cgst: string; sgst: string; utgst: string; igst: string; cess: string }) => ({
  taxable: t.taxableValue, cgst: t.cgst, sgst: t.sgst, utgst: t.utgst, igst: t.igst, cess: t.cess,
});

/** The customer must be a ledger under Sundry Debtors (or a sub-group of it). */
async function loadCustomer(tx: Tx, companyId: string, customerId: string) {
  const [row] = await tx
    .select({ account: tables.accounts, groupKey: tables.accountGroups.key, parentKey: sql<string | null>`(select g2.key from account_groups g2 where g2.id = ${tables.accountGroups.parentId})` })
    .from(tables.accounts)
    .innerJoin(tables.accountGroups, eq(tables.accountGroups.id, tables.accounts.groupId))
    .where(eq(tables.accounts.id, customerId));
  if (!row || row.account.companyId !== companyId) throw badRequest("unknown_customer");
  if (row.groupKey !== "sundry_debtors" && row.parentKey !== "sundry_debtors") throw badRequest("not_a_customer");
  if (row.account.archived) throw badRequest("account_archived");
  return row.account;
}

async function loadBranch(tx: Tx, companyId: string, branchId?: string) {
  const rows = await tx.select().from(tables.branches)
    .where(and(eq(tables.branches.companyId, companyId), branchId ? eq(tables.branches.id, branchId) : eq(tables.branches.isHeadOffice, true))).limit(1);
  if (!rows[0]) throw badRequest("unknown_branch");
  return rows[0];
}

/** Who brought the sale: an agent (paid commission on money received) and our salesman. */
export interface SalesPeople { agentId?: string | null | undefined; agentPct?: string | undefined; salesmanId?: string | null | undefined; helperId?: string | null | undefined }

/**
 * Agent and salesman for a document: as given, else the order's, else the customer's defaults.
 * The commission rate is the agent's own unless the document sets one.
 */
async function salesPeople(tx: Tx, companyId: string, customer: { agentId: string | null; salesmanId: string | null }, input: SalesPeople, from?: { agentId: string | null; agentPct: string | null; salesmanId: string | null } | null) {
  const agentId = input.agentId !== undefined ? input.agentId : from ? from.agentId : customer.agentId;
  let agentPct: string | null = null;
  if (agentId) {
    const [agent] = await tx.select().from(tables.accounts).where(eq(tables.accounts.id, agentId));
    if (!agent || agent.companyId !== companyId || !agent.isAgent) throw badRequest("not_an_agent");
    agentPct = dec(input.agentPct ?? (from?.agentId === agentId ? from.agentPct : null) ?? agent.commissionPct ?? 0).toFixed(2);
  }
  const salesmanId = input.salesmanId !== undefined ? input.salesmanId : from ? from.salesmanId : customer.salesmanId;
  if (salesmanId) {
    const [e] = await tx.select({ companyId: tables.employees.companyId }).from(tables.employees).where(eq(tables.employees.id, salesmanId));
    if (!e || e.companyId !== companyId) throw badRequest("unknown_salesman");
  }
  const helperId = input.helperId ?? null;
  if (helperId) {
    const [e] = await tx.select({ companyId: tables.employees.companyId }).from(tables.employees).where(eq(tables.employees.id, helperId));
    if (!e || e.companyId !== companyId) throw badRequest("unknown_salesman");
    if (helperId === salesmanId) throw badRequest("helper_is_salesman");
  }
  return { agentId: agentId ?? null, agentPct, salesmanId: salesmanId ?? null, helperId };
}

export interface SupplyOptions { placeOfSupply?: string | undefined; export?: boolean | undefined; sez?: boolean | undefined; lut?: boolean | undefined }

/**
 * Sales: our branch's state against the place of supply (the customer's state unless given) decides
 * CGST+SGST or IGST. Exports have place of supply 96.
 */
export function salesContext(customer: { stateCode: string | null }, branch: { stateCode: string }, o: SupplyOptions = {}): TaxContext {
  const placeOfSupply = o.export ? "96" : o.placeOfSupply ?? customer.stateCode ?? branch.stateCode;
  return { supplierState: branch.stateCode, placeOfSupply, sez: !!o.sez, lut: !!o.lut };
}

/** Lines with their item; the GST rate is the line's own, or the item's (by price per piece for apparel and footwear). */
async function priceLines<L extends PriceLine>(tx: Tx, companyId: string, lines: L[], date: string) {
  if (!lines.length) throw badRequest("no_lines");
  const ids = [...new Set(lines.map((l) => l.itemId))];
  const its = await tx.select({ item: tables.items, uom: tables.uoms.code }).from(tables.items).innerJoin(tables.uoms, eq(tables.uoms.id, tables.items.uomId)).where(inArray(tables.items.id, ids));
  return lines.map((l) => {
    const row = its.find((i) => i.item.id === l.itemId);
    if (!row || row.item.companyId !== companyId) throw badRequest("unknown_item");
    if (row.item.archived) throw badRequest("item_archived");
    if (!dec(l.qty).gt(0)) throw badRequest("qty_must_be_positive");
    return { ...l, item: row.item, uom: row.uom, gstRate: l.gstRate ?? lineGstRate(row.item, l, date), cessRate: l.cessRate ?? row.item.cessRate, discount: l.discount ?? "0" };
  });
}

/** Sale: Dr customer, Cr Sales, Cr output GST. A credit note is the mirror image (Sales Returns). */
async function salesGlLines(tx: Tx, companyId: string, customerId: string, tax: InvoiceTax, direction: "sale" | "return") {
  const cr = direction === "sale" ? "credit" : "debit";
  const dr = direction === "sale" ? "debit" : "credit";
  const salesKey = direction === "sale" ? "sales" : "sales_returns";
  const postingKeys = [salesKey];
  for (const key of TAX_KEYS) if (!dec(tax[key]).isZero() && !dec(tax.taxCharged).isZero()) postingKeys.push(`output_${key}`);
  const ro = dec(tax.roundOff);
  if (!ro.isZero()) postingKeys.push("round_off");
  const accounts = await resolvePostingAccountIds(tx, companyId, postingKeys);
  const lines: { accountId: string; debit?: string; credit?: string }[] = [
    { accountId: customerId, [dr]: tax.grandTotal },
    { accountId: accounts[salesKey]!, [cr]: tax.taxableValue },
  ];
  for (const k of TAX_KEYS) if (!dec(tax[k]).isZero() && !dec(tax.taxCharged).isZero()) lines.push({ accountId: accounts[`output_${k}`]!, [cr]: tax[k] });
  if (!ro.isZero()) {
    const id = accounts.round_off!;
    // A positive round-off adds to what the customer pays: income on a sale, reversed on a return.
    lines.push(ro.gt(0) === (direction === "sale") ? { accountId: id, credit: money(ro.abs()) } : { accountId: id, debit: money(ro.abs()) });
  }
  return lines;
}

async function defaultWarehouse(tx: Tx, company: Company) {
  await ensureInventory(tx, company.tenantId, company.id);
  const [w] = await tx.select().from(tables.warehouses).where(and(eq(tables.warehouses.companyId, company.id), eq(tables.warehouses.archived, false)))
    .orderBy(sql`${tables.warehouses.isDefault} desc`, asc(tables.warehouses.createdAt)).limit(1);
  return w!.id;
}

async function refreshOrderStatus(tx: Tx, orderId: string) {
  const [o] = await tx.select().from(tables.salesOrders).where(eq(tables.salesOrders.id, orderId));
  if (!o || o.status === "cancelled" || o.status === "closed") return;
  const lines = await tx.select().from(tables.salesOrderLines).where(eq(tables.salesOrderLines.orderId, orderId));
  const done = (l: typeof lines[number]) => dec(l.deliveredQty).gte(l.qty) || dec(l.invoicedQty).gte(l.qty);
  const all = lines.every(done);
  const some = lines.some((l) => dec(l.deliveredQty).gt(0) || dec(l.invoicedQty).gt(0));
  await tx.update(tables.salesOrders).set({ status: all ? "delivered" : some ? "partial" : "open" }).where(eq(tables.salesOrders.id, orderId));
}

async function gstSettings(tx: Tx, company: Company) {
  const [s] = await tx.select().from(tables.gstSettings).where(eq(tables.gstSettings.companyId, company.id));
  return s ?? { einvoiceEnabled: false, ewayBillThreshold: "50000", bilingualPrint: true, printLanguage: "hi", invoiceTerms: null, bankDetails: null };
}

/** Customer's outstanding balance (positive = they owe us), for the credit-limit check. */
async function partyBalance(tx: Tx, accountId: string) {
  const [r] = await tx.execute<{ bal: string }>(sql`
    select a.opening_balance + coalesce((select sum(debit - credit) from gl_entries where account_id = a.id), 0) as bal
    from accounts a where a.id = ${accountId}`);
  return dec(r?.bal ?? 0);
}

type Customer = Awaited<ReturnType<typeof loadCustomer>>;
export type Warning = { code: string; lineNo?: number; detail?: string };

/**
 * Wholesale credit control: a sale that takes the customer over the credit limit, or to a customer with
 * a bill overdue longer than allowed, is a warning, or with "block" is refused unless an owner or admin
 * overrides it (the override is recorded in the audit log).
 */
async function checkCredit(tx: Tx, actor: Actor, customer: Customer, amount: string, date: string, override: boolean | "warn" | undefined, doc: string, reason?: string | undefined) {
  const warnings: Warning[] = [];
  const reasons: string[] = [];
  if (customer.creditLimit !== null) {
    const after = (await partyBalance(tx, customer.id)).plus(amount);
    if (after.gt(customer.creditLimit)) {
      warnings.push({ code: "credit_limit_exceeded", detail: money(after) });
      reasons.push(`limit ${customer.creditLimit}, after ${money(after)}`);
    }
  }
  if (customer.blockOverdueDays !== null) {
    const [row] = (await outstanding(tx, customer.companyId, "receivable", date, customer.id)).rows;
    const oldest = Math.max(0, ...(row?.openItems ?? []).map((o) => o.daysOverdue));
    if (oldest > customer.blockOverdueDays) {
      warnings.push({ code: "overdue_bills", detail: String(oldest) });
      reasons.push(`bill overdue ${oldest} days`);
    }
  }
  if (reasons.length && customer.creditControl === "block" && override !== "warn") {
    if (!override) throw conflict(warnings[0]!.code === "credit_limit_exceeded" ? "credit_blocked" : "overdue_blocked");
    if (!reason?.trim()) throw badRequest("override_reason_required");
    await autoEmit(tx, actor, "credit_exception", { event: "credit_exception", params: { name: customer.name, shop: (await resolveCompany(tx, customer.companyId)).name, amount: money(amount), number: doc }, dedupeKey: `credit:${customer.id}:${doc}:${date}:${money(amount)}` });
    await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "credit_override", entityId: customer.id, after: { customer: customer.name, doc, amount, reasons, overrideReason: reason!.trim() }, ip: actor.ip });
  }
  return warnings;
}

const addDays = (iso: string, days: number) => new Date(Date.parse(`${iso}T00:00:00Z`) + days * 86_400_000).toISOString().slice(0, 10);

// ---- quotations -------------------------------------------------------------------------------------

export interface QuotationInput {
  companyId?: string | undefined; branchId?: string | undefined; customerId: string; date: string; validUntil?: string | undefined;
  customerReference?: string | undefined; narration?: string | undefined; terms?: string | undefined; supply?: SupplyOptions | undefined; lines: PriceLine[];
  /** A proforma invoice asks for payment before supply, often an advance; it has its own number series. */
  kind?: "quotation" | "proforma" | undefined; advanceDue?: string | undefined;
}

/** A quotation or proforma has no stock or accounts effect. It stays valid for 15 days unless told otherwise. */
export async function createQuotation(tx: Tx, actor: Actor, input: QuotationInput) {
  const company = await resolveCompany(tx, input.companyId);
  const customer = await loadCustomer(tx, company.id, input.customerId);
  const branch = await loadBranch(tx, company.id, input.branchId);
  const lines = await priceLines(tx, company.id, input.lines, input.date);
  const validUntil = input.validUntil ?? addDays(input.date, 15);
  if (validUntil < input.date) throw badRequest("valid_until_before_date");
  const ctx = salesContext(customer, branch, input.supply);
  const tax = computeInvoiceTax(lines, ctx);
  const kind = input.kind ?? "quotation";
  if (input.advanceDue && (kind !== "proforma" || dec(input.advanceDue).gt(tax.grandTotal))) throw badRequest("advance_more_than_total");
  const number = await documentNumber(tx, actor, company, input.date, SALES_SERIES[kind]);
  const [q] = await tx.insert(tables.quotations).values({
    tenantId: actor.tenantId, kind, advanceDue: input.advanceDue ? money(input.advanceDue) : null, companyId: company.id, branchId: branch.id, customerId: customer.id, number, date: input.date, validUntil,
    placeOfSupply: ctx.placeOfSupply, supplyKind: tax.supplyKind, lut: !!ctx.lut, customerReference: input.customerReference ?? null,
    narration: input.narration ?? null, terms: input.terms ?? null, ...taxFields(tax), total: tax.grandTotal, createdBy: actor.userId,
  }).returning();
  await tx.insert(tables.quotationLines).values(lines.map((l, i) => ({
    tenantId: actor.tenantId, quotationId: q!.id, lineNo: i + 1, itemId: l.itemId, description: l.description ?? null,
    qty: q4(l.qty), rate: l.rate, discount: money(l.discount), gstRate: l.gstRate, cessRate: l.cessRate, ...taxFields(tax.lines[i]!), total: tax.lines[i]!.total,
  })));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: kind, entityId: q!.id, after: { number, customer: customer.name, total: tax.grandTotal }, ip: actor.ip });
  return q!;
}

export async function setQuotationStatus(tx: Tx, actor: Actor, id: string, status: "accepted" | "declined" | "cancelled") {
  const [q] = await tx.select().from(tables.quotations).where(eq(tables.quotations.id, id)).for("update");
  if (!q) throw notFound();
  if (q.status === "converted") throw conflict("quotation_converted");
  if (q.status === "cancelled") throw conflict("already_cancelled");
  await tx.update(tables.quotations).set({ status }).where(eq(tables.quotations.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: status === "cancelled" ? "cancel" : "update", entity: "quotation", entityId: id, after: { status }, ip: actor.ip });
}

/** Marks a quotation as turned into an order or invoice. It must be open (or accepted) and for the same customer. */
async function convertQuotation(tx: Tx, companyId: string, quotationId: string, customerId: string, kind: "order" | "invoice", docId: string) {
  const [q] = await tx.select().from(tables.quotations).where(eq(tables.quotations.id, quotationId)).for("update");
  if (!q || q.companyId !== companyId) throw badRequest("unknown_quotation");
  if (q.customerId !== customerId) throw badRequest("quotation_customer_mismatch");
  if (q.status !== "open" && q.status !== "accepted") throw conflict("quotation_not_open");
  await tx.update(tables.quotations).set({ status: "converted", convertedKind: kind, convertedId: docId }).where(eq(tables.quotations.id, quotationId));
}

/** When the order or invoice made from a quotation is cancelled, the quotation can be converted again. */
async function releaseQuotation(tx: Tx, quotationId: string | null) {
  if (!quotationId) return;
  await tx.update(tables.quotations).set({ status: "accepted", convertedKind: null, convertedId: null })
    .where(and(eq(tables.quotations.id, quotationId), eq(tables.quotations.status, "converted")));
}

// ---- sales orders -----------------------------------------------------------------------------------

export interface OrderInput extends SalesPeople {
  companyId?: string | undefined; branchId?: string | undefined; customerId: string; quotationId?: string | undefined; date: string; deliverBy?: string | undefined;
  customerReference?: string | undefined; narration?: string | undefined; supply?: SupplyOptions | undefined; lines: PriceLine[];
  /** Set by an offline device, so an order sent twice is created once. */
  id?: string | undefined;
  /** An owner or admin letting a sale through a credit block; "warn" for orders taken offline, which already happened. */
  overrideCredit?: boolean | "warn" | undefined;
  overrideReason?: string | undefined;
}

export async function createSalesOrder(tx: Tx, actor: Actor, input: OrderInput) {
  const company = await resolveCompany(tx, input.companyId);
  const customer = await loadCustomer(tx, company.id, input.customerId);
  const branch = await loadBranch(tx, company.id, input.branchId);
  const lines = await priceLines(tx, company.id, input.lines, input.date);
  const ctx = salesContext(customer, branch, input.supply);
  const tax = computeInvoiceTax(lines, ctx);
  const warnings = await checkCredit(tx, actor, customer, tax.grandTotal, input.date, input.overrideCredit, "sales_order", input.overrideReason);
  const people = await salesPeople(tx, company.id, customer, input);
  const number = await documentNumber(tx, actor, company, input.date, SALES_SERIES.order);
  const [order] = await tx.insert(tables.salesOrders).values({
    ...(input.id ? { id: input.id } : {}),
    tenantId: actor.tenantId, companyId: company.id, branchId: branch.id, customerId: customer.id, quotationId: input.quotationId ?? null, number, date: input.date, deliverBy: input.deliverBy ?? null,
    placeOfSupply: ctx.placeOfSupply, supplyKind: tax.supplyKind, customerReference: input.customerReference ?? null, narration: input.narration ?? null,
    ...taxFields(tax), total: tax.grandTotal, ...people, createdBy: actor.userId,
  }).returning();
  await tx.insert(tables.salesOrderLines).values(lines.map((l, i) => ({
    tenantId: actor.tenantId, orderId: order!.id, lineNo: i + 1, itemId: l.itemId, description: l.description ?? null,
    qty: q4(l.qty), rate: l.rate, discount: money(l.discount), gstRate: l.gstRate, cessRate: l.cessRate, ...taxFields(tax.lines[i]!), total: tax.lines[i]!.total,
  })));
  if (input.quotationId) await convertQuotation(tx, company.id, input.quotationId, customer.id, "order", order!.id);
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "sales_order", entityId: order!.id, after: { number, customer: customer.name, total: tax.grandTotal }, ip: actor.ip });
  return Object.assign(order!, { warnings });
}

export async function setSalesOrderStatus(tx: Tx, actor: Actor, id: string, status: "closed" | "cancelled") {
  const [o] = await tx.select().from(tables.salesOrders).where(eq(tables.salesOrders.id, id)).for("update");
  if (!o) throw notFound();
  if (o.status === "cancelled" || o.status === "closed") throw conflict("order_not_open");
  if (status === "cancelled") {
    const lines = await tx.select().from(tables.salesOrderLines).where(eq(tables.salesOrderLines.orderId, id));
    if (lines.some((l) => dec(l.deliveredQty).gt(0) || dec(l.invoicedQty).gt(0))) throw conflict("order_has_deliveries");
  }
  await tx.update(tables.salesOrders).set({ status }).where(eq(tables.salesOrders.id, id));
  if (status === "cancelled") await releaseQuotation(tx, o.quotationId);
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: status === "cancelled" ? "cancel" : "update", entity: "sales_order", entityId: id, after: { status }, ip: actor.ip });
}

// ---- delivery challans ------------------------------------------------------------------------------

export const CHALLAN_REASONS = ["supply", "approval", "job_work", "not_supply", "lots", "exhibition", "sample", "other"] as const;
export type ChallanReason = (typeof CHALLAN_REASONS)[number];
/** Reasons where the goods go to the consignee as a supply, so the challan shows the tax as well as the value. */
const TAXED_REASONS: readonly ChallanReason[] = ["supply", "approval", "lots"];

export interface DeliveryInput {
  companyId?: string | undefined; customerId: string; orderId?: string | undefined; warehouseId?: string | undefined; date: string; narration?: string | undefined;
  reason?: ChallanReason | undefined; transporter?: string | undefined; vehicleNo?: string | undefined; overrideCredit?: boolean | undefined; overrideReason?: string | undefined;
  lines: { itemId: string; qty: string; orderLineId?: string | undefined; deliveryOrderLineId?: string | undefined; batchNo?: string | undefined; rate?: string | undefined }[];
}

/** A challan is done when every line is invoiced or back: "invoiced" if anything was billed, else "closed". */
async function refreshNoteStatus(tx: Tx, noteId: string) {
  const ls = await tx.select().from(tables.deliveryNoteLines).where(eq(tables.deliveryNoteLines.noteId, noteId));
  const done = ls.every((l) => dec(l.invoicedQty).plus(l.returnedQty).gte(l.qty));
  const status = done ? (ls.some((l) => dec(l.invoicedQty).gt(0)) ? "invoiced" : "closed") : "posted";
  await tx.update(tables.deliveryNotes).set({ status }).where(and(eq(tables.deliveryNotes.id, noteId), sql`${tables.deliveryNotes.status} <> 'cancelled'`));
}

export async function createDeliveryNote(tx: Tx, actor: Actor, input: DeliveryInput) {
  const company = await resolveCompany(tx, input.companyId);
  const customer = await loadCustomer(tx, company.id, input.customerId);
  const warehouseId = input.warehouseId ?? (await defaultWarehouse(tx, company));
  if (!input.lines.length) throw badRequest("no_lines");
  let orderLines: (typeof tables.salesOrderLines.$inferSelect)[] = [];
  if (input.orderId) {
    const [o] = await tx.select().from(tables.salesOrders).where(eq(tables.salesOrders.id, input.orderId)).for("update");
    if (!o || o.companyId !== company.id) throw badRequest("unknown_order");
    if (o.customerId !== customer.id) throw badRequest("order_customer_mismatch");
    if (o.status === "cancelled" || o.status === "closed") throw conflict("order_not_open");
    orderLines = await tx.select().from(tables.salesOrderLines).where(eq(tables.salesOrderLines.orderId, o.id)).for("update");
  }
  for (const l of input.lines) {
    if (!dec(l.qty).gt(0)) throw badRequest("qty_must_be_positive");
    const ol = l.orderLineId ? orderLines.find((x) => x.id === l.orderLineId) : undefined;
    if (l.orderLineId && !ol) throw badRequest("unknown_order_line");
    if (ol && ol.itemId !== l.itemId) throw badRequest("order_line_item_mismatch");
    if (ol && dec(l.qty).gt(dec(ol.qty).minus(ol.deliveredQty))) throw badRequest("over_delivery");
  }
  await checkDeliveryOrderLines(tx, customer.id, input.lines);
  // Rule 55: the challan carries the value (the order's rate, else the item's sale rate) and, for a supply, the tax.
  const reason = input.reason ?? "supply";
  const taxed = TAXED_REASONS.includes(reason);
  const ctx = salesContext(customer, await loadBranch(tx, company.id));
  const saleRates = await tx.select({ id: tables.items.id, saleRate: tables.items.saleRate }).from(tables.items).where(inArray(tables.items.id, input.lines.map((l) => l.itemId)));
  const priced = await priceLines(tx, company.id, input.lines.map((l) => {
    const ol = l.orderLineId ? orderLines.find((x) => x.id === l.orderLineId) : undefined;
    const rate = l.rate ?? ol?.rate ?? saleRates.find((r) => r.id === l.itemId)?.saleRate ?? "0";
    return { itemId: l.itemId, qty: l.qty, rate, ...(ol ? { gstRate: ol.gstRate, cessRate: ol.cessRate } : {}) };
  }), input.date);
  const tax = computeInvoiceTax(taxed ? priced : priced.map((l) => ({ ...l, gstRate: "0", cessRate: "0" })), ctx);
  // Goods sent ahead of the invoice are credit given; challans against an order were checked with the order.
  const creditWarnings = taxed && !input.orderId ? await checkCredit(tx, actor, customer, tax.grandTotal, input.date, input.overrideCredit, "delivery_note", input.overrideReason) : [];
  const number = await documentNumber(tx, actor, company, input.date, SALES_SERIES.delivery);
  const [note] = await tx.insert(tables.deliveryNotes).values({
    tenantId: actor.tenantId, companyId: company.id, customerId: customer.id, orderId: input.orderId ?? null, warehouseId, number, date: input.date,
    reason, placeOfSupply: ctx.placeOfSupply, supplyKind: tax.supplyKind, transporter: input.transporter ?? null, vehicleNo: input.vehicleNo ?? null,
    ...taxFields(tax), total: tax.grandTotal, narration: input.narration ?? null, createdBy: actor.userId,
  }).returning();
  await tx.insert(tables.deliveryNoteLines).values(input.lines.map((l, i) => ({
    tenantId: actor.tenantId, noteId: note!.id, lineNo: i + 1, itemId: l.itemId, orderLineId: l.orderLineId ?? null, deliveryOrderLineId: l.deliveryOrderLineId ?? null, qty: q4(l.qty), batchNo: l.batchNo ?? null,
    rate: q4(priced[i]!.rate), gstRate: taxed ? priced[i]!.gstRate : null, taxable: tax.lines[i]!.taxableValue,
  })));
  const { warnings } = await postMoves(tx, company, "delivery_note", note!.id, input.lines.map((l) => ({ itemId: l.itemId, warehouseId, date: input.date, qtyOut: q4(l.qty), batchNo: l.batchNo })));
  for (const l of input.lines) {
    if (l.orderLineId) await tx.update(tables.salesOrderLines).set({ deliveredQty: sql`${tables.salesOrderLines.deliveredQty} + ${q4(l.qty)}` }).where(eq(tables.salesOrderLines.id, l.orderLineId));
  }
  if (input.orderId) await refreshOrderStatus(tx, input.orderId);
  await autoEmit(tx, actor, "order_dispatched", { event: "delivery", accountId: customer.id, params: { name: customer.name, shop: company.name, number, tracking: input.vehicleNo ? `Vehicle ${input.vehicleNo}.` : "" }, dedupeKey: `delivery:${note!.id}`, channels: ["whatsapp", "sms"] });
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "delivery_note", entityId: note!.id, after: { number, customer: customer.name }, ip: actor.ip });
  return { note: note!, warnings: [...creditWarnings, ...warnings.map((w) => ({ code: "negative_stock", detail: w.itemId }))] };
}

export async function cancelDeliveryNote(tx: Tx, actor: Actor, id: string, reason: string) {
  const [n] = await tx.select().from(tables.deliveryNotes).where(eq(tables.deliveryNotes.id, id)).for("update");
  if (!n) throw notFound();
  if (n.status === "cancelled") throw conflict("already_cancelled");
  const lines = await tx.select().from(tables.deliveryNoteLines).where(eq(tables.deliveryNoteLines.noteId, id));
  if (lines.some((l) => dec(l.invoicedQty).gt(0))) throw conflict("delivery_is_invoiced");
  if (lines.some((l) => dec(l.returnedQty).gt(0))) throw conflict("delivery_has_returns");
  const company = await resolveCompany(tx, n.companyId);
  assertPeriodOpen(await fiscalYearForDate(tx, actor.tenantId, company, n.date), n.date);
  await reverseMoves(tx, "delivery_note", id);
  for (const l of lines) {
    if (l.orderLineId) await tx.update(tables.salesOrderLines).set({ deliveredQty: sql`${tables.salesOrderLines.deliveredQty} - ${l.qty}` }).where(eq(tables.salesOrderLines.id, l.orderLineId));
  }
  await tx.update(tables.deliveryNotes).set({ status: "cancelled" }).where(eq(tables.deliveryNotes.id, id));
  if (n.orderId) await refreshOrderStatus(tx, n.orderId);
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "cancel", entity: "delivery_note", entityId: id, after: { reason }, ip: actor.ip });
}

export interface DeliveryReturnInput { date: string; narration?: string | undefined; /** Receive into the Quality hold godown to be inspected before it is sold again. */ inspect?: boolean | undefined; lines: { lineId: string; qty: string }[] }

/**
 * Goods coming back on a challan: unsold pieces from a sale on approval, or goods back from an
 * exhibition or repair. Stock returns to the challan's warehouse at the cost it went out at.
 */
export async function returnDeliveryGoods(tx: Tx, actor: Actor, noteId: string, input: DeliveryReturnInput) {
  const [n] = await tx.select().from(tables.deliveryNotes).where(eq(tables.deliveryNotes.id, noteId)).for("update");
  if (!n) throw notFound();
  if (n.status === "cancelled") throw conflict("delivery_cancelled");
  if (input.date < n.date) throw badRequest("return_before_challan");
  const company = await resolveCompany(tx, n.companyId);
  assertPeriodOpen(await fiscalYearForDate(tx, actor.tenantId, company, input.date), input.date);
  const lines = await tx.select().from(tables.deliveryNoteLines).where(eq(tables.deliveryNoteLines.noteId, noteId)).for("update");
  const back = input.lines.filter((l) => dec(l.qty).gt(0));
  if (!back.length) throw badRequest("no_lines");
  for (const r of back) {
    const l = lines.find((x) => x.id === r.lineId);
    if (!l) throw badRequest("unknown_delivery_line");
    if (dec(r.qty).gt(dec(l.qty).minus(l.invoicedQty).minus(l.returnedQty))) throw badRequest("over_return");
  }
  const [ret] = await tx.insert(tables.deliveryReturns).values({
    tenantId: actor.tenantId, noteId, date: input.date, lines: back.map((r) => ({ lineId: r.lineId, qty: q4(r.qty) })), narration: input.narration ?? null, createdBy: actor.userId,
  }).returning();
  const inspectWh = input.inspect ? await qualityHoldWarehouse(tx, company) : null;
  const moves: Move[] = [];
  for (const r of back) {
    const l = lines.find((x) => x.id === r.lineId)!;
    const [out] = await tx.select({ rate: tables.stockLedger.rate }).from(tables.stockLedger)
      .where(and(eq(tables.stockLedger.sourceType, "delivery_note"), eq(tables.stockLedger.sourceId, noteId), eq(tables.stockLedger.itemId, l.itemId))).limit(1);
    const rate = out?.rate ?? (await currentRate(tx, company, l.itemId, n.warehouseId, input.date));
    moves.push({ itemId: l.itemId, warehouseId: inspectWh ?? n.warehouseId, date: input.date, qtyIn: q4(r.qty), rate, batchNo: l.batchNo ?? undefined });
    await tx.update(tables.deliveryNoteLines).set({ returnedQty: sql`${tables.deliveryNoteLines.returnedQty} + ${q4(r.qty)}` }).where(eq(tables.deliveryNoteLines.id, l.id));
    // What came back was never delivered against the order, so the order can deliver it again.
    if (l.orderLineId) await tx.update(tables.salesOrderLines).set({ deliveredQty: sql`${tables.salesOrderLines.deliveredQty} - ${q4(r.qty)}` }).where(eq(tables.salesOrderLines.id, l.orderLineId));
  }
  await postMoves(tx, company, "delivery_return", ret!.id, moves);
  if (inspectWh) {
    await tx.insert(tables.returnInspections).values(back.map((r) => ({
      tenantId: actor.tenantId, companyId: company.id, sourceType: "delivery_return", sourceId: ret!.id, sourceNumber: n.number, customerId: n.customerId,
      itemId: lines.find((x) => x.id === r.lineId)!.itemId, warehouseId: inspectWh, qty: q4(r.qty),
    })));
  }
  await refreshNoteStatus(tx, noteId);
  if (n.orderId) await refreshOrderStatus(tx, n.orderId);
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "delivery_return", entityId: ret!.id, after: { challan: n.number, lines: back.length }, ip: actor.ip });
  return ret!;
}

/** Sale on approval must be invoiced within six months of the goods leaving (CGST Act s. 31(7)). */
export const APPROVAL_INVOICE_MONTHS = 6;
export const approvalInvoiceBy = (date: string) => {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + APPROVAL_INVOICE_MONTHS);
  return d.toISOString().slice(0, 10);
};

/** Approval memos with goods still out: pieces out, value out, days out and the date the invoice is due by. */
export async function pendingApprovals(tx: Tx, companyId: string, today: string) {
  const rows = await tx.execute<{ id: string; number: string; date: string; customer_id: string; customer_name: string; pieces: string; value: string }>(sql`
    select n.id, n.number, n.date::text as date, n.customer_id, a.name as customer_name,
      sum(l.qty - l.invoiced_qty - l.returned_qty)::text as pieces,
      sum((l.qty - l.invoiced_qty - l.returned_qty) * coalesce(l.rate, 0))::numeric(18,2)::text as value
    from delivery_notes n join delivery_note_lines l on l.note_id = n.id join accounts a on a.id = n.customer_id
    where n.company_id = ${companyId} and n.reason = 'approval' and n.status = 'posted'
    group by n.id, a.name having sum(l.qty - l.invoiced_qty - l.returned_qty) > 0
    order by n.date`);
  return [...rows].map((r) => {
    const invoiceBy = approvalInvoiceBy(r.date);
    return {
      id: r.id, number: r.number, date: r.date, customerId: r.customer_id, customerName: r.customer_name, pieces: r.pieces, value: r.value,
      daysOut: Math.round((Date.parse(today) - Date.parse(r.date)) / 86_400_000), invoiceBy, daysLeft: Math.round((Date.parse(invoiceBy) - Date.parse(today)) / 86_400_000),
    };
  });
}

/**
 * Samples sent to a party that have not come back: pieces still out, their value at the rate shown on the
 * challan, and how long they have been out. Samples are not a sale, so there is no invoice date to chase.
 */
export async function pendingSamples(tx: Tx, companyId: string, today: string) {
  const rows = await tx.execute<{ id: string; number: string; date: string; customer_id: string; customer_name: string; pieces: string; value: string }>(sql`
    select n.id, n.number, n.date::text as date, n.customer_id, a.name as customer_name,
      sum(l.qty - l.invoiced_qty - l.returned_qty)::text as pieces,
      sum((l.qty - l.invoiced_qty - l.returned_qty) * coalesce(l.rate, 0))::numeric(18,2)::text as value
    from delivery_notes n join delivery_note_lines l on l.note_id = n.id join accounts a on a.id = n.customer_id
    where n.company_id = ${companyId} and n.reason = 'sample' and n.status = 'posted'
    group by n.id, a.name having sum(l.qty - l.invoiced_qty - l.returned_qty) > 0
    order by n.date`);
  return [...rows].map((r) => ({
    id: r.id, number: r.number, date: r.date, customerId: r.customer_id, customerName: r.customer_name, pieces: r.pieces, value: r.value,
    daysOut: Math.round((Date.parse(today) - Date.parse(r.date)) / 86_400_000),
  }));
}

// ---- invoices ---------------------------------------------------------------------------------------

export interface InvoiceInput extends SalesPeople {
  companyId?: string | undefined; branchId?: string | undefined; customerId: string; orderId?: string | undefined; quotationId?: string | undefined; projectId?: string | undefined;
  date: string; dueOn?: string | undefined; supply?: SupplyOptions | undefined; shippingAddress?: { line1?: string | undefined; city?: string | undefined; pincode?: string | undefined; stateCode?: string | undefined } | undefined;
  narration?: string | undefined;
  /** Cartons or bales sent, printed on the invoice. */
  cartons?: number | undefined;
  /** Dispatch details typed on the invoice: the carrier, the vehicle, the lorry receipt and an e-way bill already made on the portal. */
  transporter?: string | undefined; vehicleNo?: string | undefined; lrNumber?: string | undefined; lrDate?: string | undefined; ewbNo?: string | undefined;
  /** Discounts on the whole bill, shown as their own lines (percent of the value after line discounts, special first, then cash). They reduce the taxable value. */
  discounts?: { special?: string | undefined; cash?: string | undefined } | undefined;
  /** Discount for paying early: printed as terms; it is allowed at payment by credit note and does not change the tax on the bill. */
  earlyPay?: { pct: string; days: number } | undefined;
  /** An owner or admin letting a sale through a credit block; "warn" for goods already with the customer (consignment sold). */
  overrideCredit?: boolean | "warn" | undefined;
  overrideReason?: string | undefined;
  lines: (PriceLine & { deliveryLineId?: string | undefined; orderLineId?: string | undefined; warehouseId?: string | undefined; batchNo?: string | undefined })[];
}

/**
 * Takes bill-wide discounts off every line in proportion to its value (the special discount first, then the cash discount on what is left), so the tax is
 * worked on the reduced value. Each line's discount grows by its share; the shares and the totals are returned so the bill can show them as separate lines.
 */
export function applyHeaderDiscounts(lines: { rate: string; qty: string; discount: string }[], d: { special?: string | undefined; cash?: string | undefined } | undefined) {
  const shares = lines.map(() => dec(0));
  const summary: { kind: "special" | "cash"; pct: string; amount: string }[] = [];
  for (const kind of ["special", "cash"] as const) {
    const pct = dec(d?.[kind] ?? 0);
    if (pct.lt(0) || pct.gt(100)) throw badRequest("invalid_percent");
    if (pct.isZero()) continue;
    let total = dec(0);
    lines.forEach((l, i) => {
      const base = dec(l.rate).times(l.qty).minus(l.discount);
      if (!base.gt(0)) return;
      const cut = base.times(pct).div(100).toDecimalPlaces(2);
      l.discount = money(dec(l.discount).plus(cut));
      shares[i] = shares[i]!.plus(cut);
      total = total.plus(cut);
    });
    summary.push({ kind, pct: pct.toFixed(2), amount: money(total) });
  }
  return { shares: shares.map((x) => money(x)), summary };
}

export async function createSalesInvoice(tx: Tx, actor: Actor, input: InvoiceInput) {
  const company = await resolveCompany(tx, input.companyId);
  if (input.projectId) {
    const [p] = await tx.select({ companyId: tables.projects.companyId }).from(tables.projects).where(eq(tables.projects.id, input.projectId));
    if (!p || p.companyId !== company.id) throw badRequest("unknown_project");
  }
  const customer = await loadCustomer(tx, company.id, input.customerId);
  const branch = await loadBranch(tx, company.id, input.branchId);
  const lines = await priceLines(tx, company.id, input.lines, input.date);
  const header = applyHeaderDiscounts(lines, input.discounts);
  if (input.earlyPay && (!dec(input.earlyPay.pct).gt(0) || dec(input.earlyPay.pct).gt(100) || input.earlyPay.days < 1)) throw badRequest("invalid_early_pay");
  const ctx = { ...salesContext(customer, branch, input.supply), roundOff: (await readPrefs(tx, company.id))["txn.roundOff"] !== false };
  const tax = computeInvoiceTax(lines, ctx);
  const settings = await gstSettings(tx, company);
  await assertGstr1Open(tx, company.id, input.date);
  const warnings: Warning[] = [];

  // Links: a delivered line is invoiced once, up to what was delivered.
  const deliveryLineIds = lines.flatMap((l) => (l.deliveryLineId ? [l.deliveryLineId] : []));
  const deliveryLines = deliveryLineIds.length
    ? await tx.select({ line: tables.deliveryNoteLines, note: tables.deliveryNotes }).from(tables.deliveryNoteLines)
      .innerJoin(tables.deliveryNotes, eq(tables.deliveryNotes.id, tables.deliveryNoteLines.noteId))
      .where(inArray(tables.deliveryNoteLines.id, deliveryLineIds)).for("update")
    : [];
  const whDefault = await defaultWarehouse(tx, company);
  const toShip: { itemId: string; qty: string; warehouseId: string; batchNo?: string | undefined }[] = [];
  lines.forEach((l, i) => {
    if (l.deliveryLineId) {
      const dl = deliveryLines.find((d) => d.line.id === l.deliveryLineId);
      if (!dl || dl.note.companyId !== company.id) throw badRequest("unknown_delivery_line");
      if (dl.note.status === "cancelled") throw conflict("delivery_cancelled");
      if (dl.note.customerId !== customer.id) throw badRequest("delivery_customer_mismatch");
      if (dl.line.itemId !== l.itemId) throw badRequest("delivery_line_item_mismatch");
      if (dec(l.qty).gt(dec(dl.line.qty).minus(dl.line.invoicedQty).minus(dl.line.returnedQty))) throw badRequest("over_invoicing");
    } else if (l.item.kind === "goods") {
      toShip.push({ itemId: l.itemId, warehouseId: l.warehouseId ?? whDefault, qty: q4(l.qty), batchNo: l.batchNo });
    }
    if (l.item.kind === "goods" && !l.item.hsn) warnings.push({ code: "missing_hsn", lineNo: i + 1 });
  });
  // Recipe items (made to order) take their ingredients out of stock instead of themselves.
  const stockMoves: Move[] = await saleMoves(tx, company.id, toShip, input.date);

  // Goods already out on a challan were credit-checked then; the rest of the bill is checked now.
  const fresh = tax.lines.reduce((s, lt, i) => (lines[i]!.deliveryLineId ? s : s.plus(lt.total)), dec(0));
  if (fresh.gt(0) || !deliveryLineIds.length) warnings.push(...(await checkCredit(tx, actor, customer, tax.grandTotal, input.date, input.overrideCredit, "sales_invoice", input.overrideReason)));
  const goodsValue = tax.lines.reduce((s, lt, i) => (lines[i]!.item.kind === "goods" ? s.plus(lt.total) : s), dec(0));
  if (goodsValue.gt(settings.ewayBillThreshold)) warnings.push({ code: "eway_bill_required", detail: money(goodsValue) });

  const [order] = input.orderId ? await tx.select().from(tables.salesOrders).where(eq(tables.salesOrders.id, input.orderId)) : [];
  if (input.orderId && (!order || order.companyId !== company.id)) throw badRequest("unknown_order");
  const people = await salesPeople(tx, company.id, customer, input, order);
  const number = await documentNumber(tx, actor, company, input.date, SALES_SERIES.invoice);
  const { voucher } = await postVoucher(tx, actor, {
    companyId: company.id, type: "sales", documentNumber: number, date: input.date,
    narration: input.narration ?? `Sale to ${customer.name}`, lines: await salesGlLines(tx, company.id, customer.id, tax, "sale"),
  });
  const needsIrn = settings.einvoiceEnabled && (!!customer.gstin || tax.supplyKind === "export");
  const [invoice] = await tx.insert(tables.salesInvoices).values({
    tenantId: actor.tenantId, companyId: company.id, branchId: branch.id, customerId: customer.id, orderId: input.orderId ?? null, quotationId: input.quotationId ?? null, projectId: input.projectId ?? null, voucherId: voucher.id,
    number, date: input.date, dueOn: input.dueOn ?? (customer.creditDays ? addDays(input.date, customer.creditDays) : null),
    customerName: customer.name, customerGstin: customer.gstin, billingAddress: { ...(customer.address ?? {}), stateCode: customer.stateCode ?? undefined },
    shippingAddress: input.shippingAddress ?? null, placeOfSupply: ctx.placeOfSupply, supplyKind: tax.supplyKind, lut: !!ctx.lut,
    ...taxFields(tax), roundOff: tax.roundOff, total: tax.grandTotal, narration: input.narration ?? null, cartons: input.cartons ?? null,
    transporter: input.transporter || null, vehicleNo: input.vehicleNo || null, lrNumber: input.lrNumber || null, lrDate: input.lrDate || null,
    ...(input.ewbNo ? { ewbNo: input.ewbNo, ewbStatus: "active" } : {}),
    headerDiscounts: header.summary, earlyPayPct: input.earlyPay ? dec(input.earlyPay.pct).toFixed(2) : null, earlyPayDays: input.earlyPay?.days ?? null,
    einvoiceStatus: needsIrn ? "pending" : "not_required", ...people, createdBy: actor.userId,
  }).returning();
  const lineRows = await tx.insert(tables.salesInvoiceLines).values(lines.map((l, i) => ({
    tenantId: actor.tenantId, invoiceId: invoice!.id, lineNo: i + 1, itemId: l.itemId, description: l.description ?? null,
    qty: q4(l.qty), rate: l.rate, headerDiscount: header.shares[i]!, discount: money(l.discount), gstRate: l.gstRate, cessRate: l.cessRate, ...taxFields(tax.lines[i]!), total: tax.lines[i]!.total,
    orderLineId: l.orderLineId ?? deliveryLines.find((d) => d.line.id === l.deliveryLineId)?.line.orderLineId ?? null,
    deliveryLineId: l.deliveryLineId ?? null,
    warehouseId: l.deliveryLineId ? deliveryLines.find((d) => d.line.id === l.deliveryLineId)!.note.warehouseId : l.item.kind === "goods" ? (l.warehouseId ?? whDefault) : null,
    batchNo: l.batchNo ?? null,
  }))).returning();
  const { warnings: stockWarnings } = await postMoves(tx, company, "sales_invoice", invoice!.id, stockMoves);

  for (const row of lineRows) {
    if (row.deliveryLineId) await tx.update(tables.deliveryNoteLines).set({ invoicedQty: sql`${tables.deliveryNoteLines.invoicedQty} + ${row.qty}` }).where(eq(tables.deliveryNoteLines.id, row.deliveryLineId));
    if (row.orderLineId) {
      await tx.update(tables.salesOrderLines).set({
        invoicedQty: sql`${tables.salesOrderLines.invoicedQty} + ${row.qty}`,
        ...(row.deliveryLineId ? {} : { deliveredQty: sql`${tables.salesOrderLines.deliveredQty} + ${row.qty}` }),
      }).where(eq(tables.salesOrderLines.id, row.orderLineId));
    }
  }
  for (const nid of new Set(deliveryLines.map((d) => d.note.id))) await refreshNoteStatus(tx, nid);
  for (const oid of new Set([input.orderId, ...deliveryLines.map((d) => d.note.orderId)].filter((x): x is string => !!x))) await refreshOrderStatus(tx, oid);

  if (input.quotationId) await convertQuotation(tx, company.id, input.quotationId, customer.id, "invoice", invoice!.id);
  await autoEmit(tx, actor, "invoice_issued", { event: "bill_sent", accountId: customer.id, params: { name: customer.name, shop: company.name, number, amount: money(tax.grandTotal), link: "" }, dedupeKey: `invoice:${invoice!.id}`, channels: ["whatsapp", "sms"] });
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "sales_invoice", entityId: invoice!.id, after: { number, customer: customer.name, total: tax.grandTotal }, ip: actor.ip });
  return { invoice: invoice!, warnings: [...warnings, ...stockWarnings.map((w) => ({ code: "negative_stock", detail: w.itemId }))] };
}

export async function cancelSalesInvoice(tx: Tx, actor: Actor, id: string, reason: string) {
  const [inv] = await tx.select().from(tables.salesInvoices).where(eq(tables.salesInvoices.id, id)).for("update");
  if (!inv) throw notFound();
  if (inv.status === "cancelled") throw conflict("already_cancelled");
  if (inv.ewbStatus === "active") throw conflict("cancel_ewb_first");
  if (inv.einvoiceStatus === "generated") throw conflict("cancel_irn_first");
  await assertGstr1Open(tx, inv.companyId, inv.date);
  const [cn] = await tx.select({ id: tables.creditNotes.id }).from(tables.creditNotes).where(and(eq(tables.creditNotes.invoiceId, id), eq(tables.creditNotes.status, "posted"))).limit(1);
  if (cn) throw conflict("invoice_has_credit_notes");
  await cancelVoucher(tx, actor, inv.voucherId!, reason);
  await reverseMoves(tx, "sales_invoice", id);
  // A project's milestones and hours billed on this invoice can be billed again.
  await tx.update(tables.projectMilestones).set({ status: "pending", invoiceId: null }).where(eq(tables.projectMilestones.invoiceId, id));
  await tx.update(tables.timesheets).set({ status: "approved", invoiceId: null }).where(eq(tables.timesheets.invoiceId, id));
  const lines = await tx.select().from(tables.salesInvoiceLines).where(eq(tables.salesInvoiceLines.invoiceId, id));
  for (const l of lines) {
    if (l.deliveryLineId) {
      const [dl] = await tx.update(tables.deliveryNoteLines).set({ invoicedQty: sql`${tables.deliveryNoteLines.invoicedQty} - ${l.qty}` }).where(eq(tables.deliveryNoteLines.id, l.deliveryLineId)).returning();
      await refreshNoteStatus(tx, dl!.noteId);
    }
    if (l.orderLineId) {
      await tx.update(tables.salesOrderLines).set({
        invoicedQty: sql`${tables.salesOrderLines.invoicedQty} - ${l.qty}`,
        ...(l.deliveryLineId ? {} : { deliveredQty: sql`${tables.salesOrderLines.deliveredQty} - ${l.qty}` }),
      }).where(eq(tables.salesOrderLines.id, l.orderLineId));
    }
  }
  await tx.update(tables.salesInvoices).set({ status: "cancelled" }).where(eq(tables.salesInvoices.id, id));
  await releaseQuotation(tx, inv.quotationId);
  const orderLineIds = lines.flatMap((l) => (l.orderLineId ? [l.orderLineId] : []));
  if (orderLineIds.length) {
    const os = await tx.select({ orderId: tables.salesOrderLines.orderId }).from(tables.salesOrderLines).where(inArray(tables.salesOrderLines.id, orderLineIds));
    for (const oid of new Set(os.map((o) => o.orderId))) await refreshOrderStatus(tx, oid);
  }
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "cancel", entity: "sales_invoice", entityId: id, after: { reason }, ip: actor.ip });
}

// ---- credit notes -----------------------------------------------------------------------------------

export interface CreditNoteInput {
  invoiceId: string; date: string; reason: string; goodsReturned: boolean; warehouseId?: string | undefined;
  /** Receive the goods into the Quality hold godown to be inspected before they are sold again. */
  inspect?: boolean | undefined;
  lines: { invoiceLineId: string; qty: string; rate?: string | undefined }[];
}

/**
 * A credit note against an invoice. With goods returned: same price, stock comes back at current cost.
 * Without (a price reduction or discount after sale): the given rate difference, no stock movement.
 */
export async function createCreditNote(tx: Tx, actor: Actor, input: CreditNoteInput) {
  const [inv] = await tx.select().from(tables.salesInvoices).where(eq(tables.salesInvoices.id, input.invoiceId)).for("update");
  if (!inv) throw notFound("unknown_invoice");
  if (inv.status !== "posted") throw conflict("invoice_not_posted");
  if (input.date < inv.date) throw badRequest("credit_note_before_invoice");
  const company = await resolveCompany(tx, inv.companyId);
  await assertGstr1Open(tx, company.id, input.date);
  const invLines = await tx.select({ line: tables.salesInvoiceLines, kind: tables.items.kind }).from(tables.salesInvoiceLines)
    .innerJoin(tables.items, eq(tables.items.id, tables.salesInvoiceLines.itemId))
    .where(eq(tables.salesInvoiceLines.invoiceId, inv.id)).for("update", { of: tables.salesInvoiceLines });
  if (!input.lines.length) throw badRequest("no_lines");
  const prepared = input.lines.map((l) => {
    const il = invLines.find((x) => x.line.id === l.invoiceLineId);
    if (!il) throw badRequest("unknown_invoice_line");
    if (!dec(l.qty).gt(0)) throw badRequest("qty_must_be_positive");
    if (input.goodsReturned && dec(l.qty).gt(dec(il.line.qty).minus(il.line.returnedQty))) throw badRequest("over_return");
    const rate = input.goodsReturned ? il.line.rate : l.rate;
    if (!rate || !dec(rate).gt(0)) throw badRequest("rate_required");
    if (!input.goodsReturned && dec(rate).gt(il.line.rate)) throw badRequest("credit_above_invoice_rate");
    const discount = input.goodsReturned ? money(dec(il.line.discount).times(l.qty).div(il.line.qty)) : "0";
    return { ...l, il, price: { itemId: il.line.itemId, qty: l.qty, rate, discount, gstRate: il.line.gstRate, cessRate: il.line.cessRate } };
  });
  // Same place of supply and tax type as the invoice.
  const tax = computeInvoiceTax(prepared.map((p) => p.price), { supplierState: (await loadBranch(tx, company.id, inv.branchId)).stateCode, placeOfSupply: inv.placeOfSupply, sez: inv.supplyKind === "sez", lut: inv.lut });
  const number = await documentNumber(tx, actor, company, input.date, SALES_SERIES.creditNote);
  const { voucher } = await postVoucher(tx, actor, {
    companyId: company.id, type: "credit_note", documentNumber: number, date: input.date, narration: `${inv.customerName}: ${input.reason}`, reference: inv.number,
    lines: await salesGlLines(tx, company.id, inv.customerId, tax, "return"),
  });
  const whDefault = await defaultWarehouse(tx, company);
  const settings = await gstSettings(tx, company);
  const [note] = await tx.insert(tables.creditNotes).values({
    tenantId: actor.tenantId, companyId: company.id, invoiceId: inv.id, customerId: inv.customerId, voucherId: voucher.id,
    warehouseId: input.goodsReturned ? (input.warehouseId ?? whDefault) : null, number, date: input.date, reason: input.reason, goodsReturned: input.goodsReturned,
    supplyKind: tax.supplyKind, placeOfSupply: inv.placeOfSupply, ...taxFields(tax), roundOff: tax.roundOff, total: tax.grandTotal,
    einvoiceStatus: settings.einvoiceEnabled && inv.customerGstin ? "pending" : "not_required", createdBy: actor.userId,
  }).returning();
  await tx.insert(tables.creditNoteLines).values(prepared.map((p, i) => ({
    tenantId: actor.tenantId, noteId: note!.id, invoiceLineId: p.invoiceLineId, lineNo: i + 1, itemId: p.il.line.itemId,
    qty: q4(p.qty), rate: p.price.rate, discount: p.price.discount, gstRate: p.il.line.gstRate, cessRate: p.il.line.cessRate,
    ...taxFields(tax.lines[i]!), total: tax.lines[i]!.total,
  })));
  let warnings: unknown[] = [];
  if (input.goodsReturned) {
    const moves: Move[] = [];
    const inspectWh = input.inspect ? await qualityHoldWarehouse(tx, company) : null;
    for (const p of prepared.filter((x) => x.il.kind === "goods")) {
      const warehouseId = inspectWh ?? input.warehouseId ?? p.il.line.warehouseId ?? whDefault;
      // Returned goods come back at the item's current cost, so stock value stays consistent.
      moves.push({ itemId: p.il.line.itemId, warehouseId, date: input.date, qtyIn: q4(p.qty), rate: await currentRate(tx, company, p.il.line.itemId, warehouseId, input.date), batchNo: p.il.line.batchNo });
    }
    warnings = (await postMoves(tx, company, "credit_note", note!.id, moves)).warnings;
    if (inspectWh) {
      await tx.insert(tables.returnInspections).values(prepared.filter((x) => x.il.kind === "goods").map((p) => ({
        tenantId: actor.tenantId, companyId: company.id, sourceType: "credit_note", sourceId: note!.id, sourceNumber: number, customerId: inv.customerId,
        itemId: p.il.line.itemId, warehouseId: inspectWh, qty: q4(p.qty),
      })));
    }
    for (const p of prepared) {
      await tx.update(tables.salesInvoiceLines).set({ returnedQty: sql`${tables.salesInvoiceLines.returnedQty} + ${q4(p.qty)}` }).where(eq(tables.salesInvoiceLines.id, p.invoiceLineId));
    }
  }
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "credit_note", entityId: note!.id, after: { number, invoice: inv.number, total: tax.grandTotal }, ip: actor.ip });
  return { creditNote: note!, warnings };
}

export async function cancelCreditNote(tx: Tx, actor: Actor, id: string, reason: string) {
  const [n] = await tx.select().from(tables.creditNotes).where(eq(tables.creditNotes.id, id)).for("update");
  if (!n) throw notFound();
  if (n.status === "cancelled") throw conflict("already_cancelled");
  if (n.einvoiceStatus === "generated") throw conflict("cancel_irn_first");
  await assertGstr1Open(tx, n.companyId, n.date);
  await cancelVoucher(tx, actor, n.voucherId!, reason);
  await reverseMoves(tx, "credit_note", id);
  if (n.goodsReturned) {
    const lines = await tx.select().from(tables.creditNoteLines).where(eq(tables.creditNoteLines.noteId, id));
    for (const l of lines) await tx.update(tables.salesInvoiceLines).set({ returnedQty: sql`${tables.salesInvoiceLines.returnedQty} - ${l.qty}` }).where(eq(tables.salesInvoiceLines.id, l.invoiceLineId));
  }
  await tx.update(tables.creditNotes).set({ status: "cancelled" }).where(eq(tables.creditNotes.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "cancel", entity: "credit_note", entityId: id, after: { reason }, ip: actor.ip });
}

// ---- e-invoice and e-way bill -----------------------------------------------------------------------

/** Builds the IRP document for an invoice (or credit note) from what was issued. */
async function einvoiceDoc(tx: Tx, kind: "invoice" | "credit_note", id: string) {
  const header = kind === "invoice"
    ? (await tx.select().from(tables.salesInvoices).where(eq(tables.salesInvoices.id, id)).for("update"))[0]
    : undefined;
  const note = kind === "credit_note" ? (await tx.select().from(tables.creditNotes).where(eq(tables.creditNotes.id, id)).for("update"))[0] : undefined;
  const inv = header ?? (note ? (await tx.select().from(tables.salesInvoices).where(eq(tables.salesInvoices.id, note.invoiceId)))[0] : undefined);
  const doc = header ?? note;
  if (!doc || !inv) throw notFound();
  const company = await resolveCompany(tx, doc.companyId);
  const branch = await loadBranch(tx, company.id, inv.branchId);
  const lineTable = kind === "invoice" ? tables.salesInvoiceLines : tables.creditNoteLines;
  const fk = kind === "invoice" ? tables.salesInvoiceLines.invoiceId : tables.creditNoteLines.noteId;
  const lines = await tx.select({ line: lineTable, hsn: tables.items.hsn, kind: tables.items.kind, uom: tables.uoms.code })
    .from(lineTable).innerJoin(tables.items, eq(tables.items.id, lineTable.itemId)).innerJoin(tables.uoms, eq(tables.uoms.id, tables.items.uomId))
    .where(eq(fk, id)).orderBy(asc(lineTable.lineNo));
  if (!branch.gstin) throw badRequest("branch_gstin_required");
  const addr = branch.address ?? {};
  const bill = inv.billingAddress ?? {};
  const d: EinvoiceDoc = {
    docType: kind === "invoice" ? "INV" : "CRN",
    number: doc.number, date: doc.date, supplyKind: inv.supplyKind as EinvoiceDoc["supplyKind"], lut: inv.lut, reverseCharge: inv.reverseCharge,
    placeOfSupply: inv.placeOfSupply,
    seller: { gstin: branch.gstin, legalName: company.legalName ?? company.name, address1: addr.line1 ?? "", location: addr.city ?? "", pincode: addr.pincode ?? "", stateCode: branch.stateCode },
    buyer: { gstin: inv.customerGstin ?? "URP", legalName: inv.customerName, address1: bill.line1 ?? "", location: bill.city ?? "", pincode: bill.pincode ?? "", stateCode: bill.stateCode ?? inv.placeOfSupply },
    lines: lines.map(({ line: l, hsn, kind: k, uom }) => ({
      isService: k === "service", hsn: hsn ?? "", qty: l.qty, unit: uom, unitPrice: l.rate, discount: l.discount, taxable: l.taxable, gstRate: l.gstRate,
      igst: l.igst, cgst: l.cgst, sgst: l.sgst, utgst: l.utgst, cessRate: l.cessRate, cess: l.cess, total: l.total,
    })),
    totals: { taxable: doc.taxable, cgst: doc.cgst, sgst: doc.sgst, utgst: doc.utgst, igst: doc.igst, cess: doc.cess, roundOff: doc.roundOff, total: doc.total },
  };
  return { d, doc, company, branch };
}

export async function generateEinvoice(tx: Tx, actor: Actor, kind: "invoice" | "credit_note", id: string) {
  const { d, doc } = await einvoiceDoc(tx, kind, id);
  if (doc.status !== "posted") throw conflict("document_not_posted");
  if (doc.einvoiceStatus === "generated") throw conflict("irn_already_generated");
  const problems = checkEinvoice(d);
  if (problems.length) throw badRequest(`einvoice_${problems[0]}`);
  const payload = einvoicePayload(d);
  const table = kind === "invoice" ? tables.salesInvoices : tables.creditNotes;
  let r;
  try {
    r = await gsp().generateIrn({ sellerGstin: d.seller.gstin, fyLabel: fiscalYearOf(d.date).label, docType: d.docType, docNumber: d.number, payload });
  } catch (e) {
    // Only a rejection by the IRP is recorded on the invoice; anything else is a plain error.
    if (e instanceof GspError && kind === "invoice") {
      await tx.update(tables.salesInvoices).set({ einvoiceStatus: "failed", einvoiceError: e.message }).where(eq(tables.salesInvoices.id, id));
    }
    throw e;
  }
  await tx.update(table).set({ einvoiceStatus: "generated", irn: r.irn, ackNo: r.ackNo, ackDate: r.ackDate, signedQr: r.signedQrCode, ...(kind === "invoice" ? { einvoiceError: null } : {}) }).where(eq(table.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: kind === "invoice" ? "sales_invoice" : "credit_note", entityId: id, after: { irn: r.irn, ackNo: r.ackNo, provider: gsp().name }, ip: actor.ip });
  return { irn: r.irn, ackNo: r.ackNo, ackDate: r.ackDate, payload };
}

export async function cancelEinvoice(tx: Tx, actor: Actor, kind: "invoice" | "credit_note", id: string, reason: "1" | "2" | "3" | "4", remark: string) {
  const { doc, d } = await einvoiceDoc(tx, kind, id);
  if (doc.einvoiceStatus !== "generated" || !doc.irn || !doc.ackDate) throw conflict("no_irn");
  if (kind === "invoice" && (doc as typeof tables.salesInvoices.$inferSelect).ewbStatus === "active") throw conflict("cancel_ewb_first");
  await gsp().cancelIrn({ sellerGstin: d.seller.gstin, irn: doc.irn, ackDate: doc.ackDate, reason, remark });
  const table = kind === "invoice" ? tables.salesInvoices : tables.creditNotes;
  await tx.update(table).set({ einvoiceStatus: "cancelled" }).where(eq(table.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: kind === "invoice" ? "sales_invoice" : "credit_note", entityId: id, after: { irnCancelled: doc.irn, reason, remark }, ip: actor.ip });
}

export async function generateEwayBill(tx: Tx, actor: Actor, id: string, input: { vehicleNo: string; distanceKm: number }) {
  const { doc, d } = await einvoiceDoc(tx, "invoice", id);
  if (doc.status !== "posted") throw conflict("document_not_posted");
  const inv = doc as typeof tables.salesInvoices.$inferSelect;
  if (inv.ewbStatus === "active") throw conflict("ewb_already_generated");
  const r = await gsp().generateEwb({
    sellerGstin: d.seller.gstin, docNumber: d.number, docDate: d.date, value: d.totals.total as string, distanceKm: input.distanceKm,
    vehicleNo: input.vehicleNo, fromPincode: d.seller.pincode, toPincode: (inv.shippingAddress?.pincode ?? d.buyer.pincode),
  });
  await tx.update(tables.salesInvoices).set({ ewbStatus: "active", ewbNo: r.ewbNo, ewbDate: r.ewbDate, ewbValidUpto: r.validUpto, vehicleNo: input.vehicleNo.toUpperCase(), transportDistanceKm: input.distanceKm }).where(eq(tables.salesInvoices.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "sales_invoice", entityId: id, after: { ewbNo: r.ewbNo, vehicleNo: input.vehicleNo }, ip: actor.ip });
  return r;
}

/** The live e-way bill on an invoice, with the seller GSTIN the NIC needs. */
async function activeEwb(tx: Tx, id: string) {
  const { doc, d, branch } = await einvoiceDoc(tx, "invoice", id);
  const inv = doc as typeof tables.salesInvoices.$inferSelect;
  if (inv.ewbStatus !== "active" || !inv.ewbNo || !inv.ewbDate || !inv.ewbValidUpto) throw conflict("no_active_ewb");
  return { inv, branch, ref: { sellerGstin: d.seller.gstin, ewbNo: inv.ewbNo, ewbDate: inv.ewbDate, validUpto: inv.ewbValidUpto } };
}

export interface EwbVehicleInput { vehicleNo: string; fromPlace: string; fromState?: string | undefined; reason: EwbVehicleReason; remark: string }

/** Part-B update: the goods move to another vehicle (breakdown, transshipment). Validity doesn't change. */
export async function updateEwayBillVehicle(tx: Tx, actor: Actor, id: string, input: EwbVehicleInput) {
  const { inv, branch, ref } = await activeEwb(tx, id);
  await gsp().updateEwbVehicle({ ...ref, vehicleNo: input.vehicleNo, fromPlace: input.fromPlace, fromState: input.fromState ?? branch.stateCode, reason: input.reason, remark: input.remark });
  await tx.update(tables.salesInvoices).set({ vehicleNo: input.vehicleNo.toUpperCase() }).where(eq(tables.salesInvoices.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "sales_invoice", entityId: id, before: { vehicleNo: inv.vehicleNo }, after: { vehicleNo: input.vehicleNo, reason: input.reason, remark: input.remark }, ip: actor.ip });
}

export interface EwbExtendInput {
  vehicleNo?: string | undefined; fromPlace: string; fromState?: string | undefined; fromPincode: string; remainingKm: number; reason: EwbExtendReason; remark: string;
}

/** Extension: only near expiry; validity restarts from now for the distance still to go. */
export async function extendEwayBill(tx: Tx, actor: Actor, id: string, input: EwbExtendInput) {
  const { inv, branch, ref } = await activeEwb(tx, id);
  const vehicleNo = input.vehicleNo ?? inv.vehicleNo;
  if (!vehicleNo) throw badRequest("invalid_vehicle_no");
  const r = await gsp().extendEwb({
    ...ref, vehicleNo, fromPlace: input.fromPlace, fromState: input.fromState ?? branch.stateCode, fromPincode: input.fromPincode,
    remainingKm: input.remainingKm, reason: input.reason, remark: input.remark,
  });
  await tx.update(tables.salesInvoices).set({ ewbValidUpto: r.validUpto, vehicleNo: vehicleNo.toUpperCase() }).where(eq(tables.salesInvoices.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "sales_invoice", entityId: id, before: { ewbValidUpto: inv.ewbValidUpto }, after: { ewbValidUpto: r.validUpto, reason: input.reason, remark: input.remark }, ip: actor.ip });
  return r;
}

/** Cancel within 24 hours of generation (e.g. the goods never left). */
export async function cancelEwayBill(tx: Tx, actor: Actor, id: string, input: { reason: EwbCancelReason; remark: string }) {
  const { inv, ref } = await activeEwb(tx, id);
  await gsp().cancelEwb({ ...ref, reason: input.reason, remark: input.remark });
  await tx.update(tables.salesInvoices).set({ ewbStatus: "cancelled" }).where(eq(tables.salesInvoices.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "sales_invoice", entityId: id, after: { ewbCancelled: inv.ewbNo, reason: input.reason, remark: input.remark }, ip: actor.ip });
}

/** Whether an invoice still earns its early-payment discount on a date, and how much it is (on the taxable value; it is given at payment by credit note). */
export async function earlyDiscount(tx: Tx, invoiceId: string, on: string) {
  const [inv] = await tx.select().from(tables.salesInvoices).where(eq(tables.salesInvoices.id, invoiceId));
  if (!inv) throw notFound();
  if (!inv.earlyPayPct || !inv.earlyPayDays) return { eligible: false as const, pct: null, until: null, amount: "0.00" };
  const until = addDays(inv.date, inv.earlyPayDays);
  const eligible = inv.status === "posted" && on <= until;
  return { eligible, pct: inv.earlyPayPct, until, amount: eligible ? money(dec(inv.taxable).times(inv.earlyPayPct).div(100)) : "0.00" };
}
