import { randomBytes } from "node:crypto";
import { and, asc, desc, eq, inArray, isNotNull, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec, formatIndian, money, normalizeIndianMobile } from "@varchasv/domain";
import { hashToken } from "../lib/session.js";
import { badRequest, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";
import { listTemplates, sendMessage } from "./crm.js";
import { getBill, posSettings } from "./pos.js";
import { outstanding } from "./returns.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }
export type SharedKind = "pos_bill" | "invoice" | "statement";

/** How long a link sent on WhatsApp keeps working. */
export const SHARE_DAYS = 90;

const defaultSettings = { bilingualPrint: true, printLanguage: "hi", invoiceTerms: null, bankDetails: null };

/** Everything the printed invoice needs: company, branch, GST settings, invoice and lines. */
export async function invoicePrintData(tx: Tx, id: string) {
  const [doc] = await tx.select({ doc: tables.salesInvoices, customerName: tables.accounts.name, customerGstin: tables.accounts.gstin }).from(tables.salesInvoices)
    .innerJoin(tables.accounts, eq(tables.accounts.id, tables.salesInvoices.customerId)).where(eq(tables.salesInvoices.id, id));
  if (!doc) throw notFound();
  const lt = tables.salesInvoiceLines;
  const lines = await tx.select({ line: lt, itemName: tables.items.name, itemNameHi: tables.items.nameHi, hsn: tables.items.hsn, uom: tables.uoms.code, kind: tables.items.kind, mrp: tables.items.mrp, size: tables.items.size, colour: tables.items.color, model: tables.styles.code })
    .from(lt).innerJoin(tables.items, eq(tables.items.id, lt.itemId)).innerJoin(tables.uoms, eq(tables.uoms.id, tables.items.uomId)).leftJoin(tables.styles, eq(tables.styles.id, tables.items.styleId))
    .where(eq(lt.invoiceId, id)).orderBy(asc(lt.lineNo));
  const i = doc.doc;
  // The expiry of each batch sold, from the stock book.
  const batched = lines.filter((l) => l.line.batchNo);
  const expiries = new Map<string, string>();
  if (batched.length) {
    const rows = await tx.select({ itemId: tables.stockLedger.itemId, batchNo: tables.stockLedger.batchNo, expiry: tables.stockLedger.expiry }).from(tables.stockLedger)
      .where(and(inArray(tables.stockLedger.itemId, batched.map((l) => l.line.itemId)), isNotNull(tables.stockLedger.expiry)));
    for (const r of rows) if (r.expiry) expiries.set(`${r.itemId}|${r.batchNo}`, String(r.expiry));
  }
  const invoice = {
    ...i, customerName: (i as { customerName?: string }).customerName ?? doc.customerName, supplierGstin: doc.customerGstin,
    lines: lines.map((l) => ({ ...l.line, itemName: l.itemName, itemNameHi: l.itemNameHi, hsn: l.hsn, uom: l.uom, kind: l.kind, mrp: l.mrp, size: l.size, colour: l.colour, model: l.model, expiry: expiries.get(`${l.line.itemId}|${l.line.batchNo}`) ?? null })),
  };
  const company = await resolveCompany(tx, i.companyId);
  const [branch] = await tx.select().from(tables.branches).where(eq(tables.branches.id, i.branchId));
  const [settings] = await tx.select().from(tables.gstSettings).where(eq(tables.gstSettings.companyId, company.id));
  // What the customer has paid of this bill and what they owe in all, for the lines at the foot of the invoice.
  const today = new Date().toISOString().slice(0, 10);
  const owed = await outstanding(tx, company.id, "receivable", today, i.customerId);
  const row = owed.rows[0];
  const open = row?.openItems.find((o) => o.voucherId === i.voucherId);
  const balance = i.status === "cancelled" ? "0.00" : open?.amount ?? "0.00";
  const account = { received: money(dec(i.total).minus(balance)), balance, partyBalance: row?.balance ?? "0.00" };
  return { invoice: { ...invoice, ...account }, company: { name: company.name, legalName: company.legalName, pan: company.pan }, branch, settings: settings ?? defaultSettings };
}

/** A new link that opens one document without signing in. Only the token's hash is kept. */
export async function shareLink(tx: Tx, actor: Actor, kind: SharedKind, docId: string, webOrigin: string, days = SHARE_DAYS) {
  const company = await resolveCompany(tx);
  const token = randomBytes(24).toString("base64url");
  const expiresAt = new Date(Date.now() + days * 86_400_000);
  await tx.insert(tables.sharedDocuments).values({ tenantId: actor.tenantId, companyId: company.id, kind, docId, tokenHash: hashToken(token), expiresAt, createdBy: actor.userId });
  return { url: `${webOrigin.replace(/\/$/, "")}/b/${token}`, expiresAt: expiresAt.toISOString() };
}

/** A customer's statement: what is open, oldest first, and how to pay. */
async function statement(tx: Tx, accountId: string, asOf: string) {
  const company = await resolveCompany(tx);
  const [a] = await tx.select().from(tables.accounts).where(eq(tables.accounts.id, accountId));
  if (!a || a.companyId !== company.id) throw notFound();
  const rec = await outstanding(tx, company.id, "receivable", asOf, accountId);
  const row = rec.rows[0];
  const [settings] = await tx.select({ bankDetails: tables.gstSettings.bankDetails }).from(tables.gstSettings).where(eq(tables.gstSettings.companyId, company.id));
  const [branch] = await tx.select().from(tables.branches).where(and(eq(tables.branches.companyId, company.id), eq(tables.branches.isHeadOffice, true)));
  const openItems = row?.openItems ?? [];
  return {
    asOf, company: { name: company.legalName ?? company.name, gstin: branch?.gstin ?? null, address: branch?.address ?? null }, bankDetails: settings?.bankDetails ?? null,
    customer: { name: a.name, gstin: a.gstin }, balance: row?.balance ?? "0.00", advance: row?.advance ?? "0.00",
    overdue: money(openItems.filter((o) => o.daysOverdue > 0).reduce((s, o) => s.plus(o.amount), dec(0))), openItems,
  };
}

/** The document behind a shared link, as the customer may see it (nothing about who billed or approved). */
export async function publicDocument(tx: Tx, kind: string, docId: string, today: string) {
  if (kind === "pos_bill") {
    const { overrides: _o, createdBy: _c, sessionId: _s, ...bill } = await getBill(tx, docId);
    return { kind, bill: { ...bill, lines: bill.lines.map(({ salesmanId: _m, ...l }) => l) } };
  }
  if (kind === "invoice") return { kind, ...(await invoicePrintData(tx, docId)) };
  if (kind === "statement") return { kind, statement: await statement(tx, docId, today) };
  throw notFound();
}

async function template(tx: Tx, name: string) {
  const tpl = (await listTemplates(tx)).find((t) => t.name === name && !t.archived);
  if (!tpl) throw badRequest("unknown_template");
  return tpl;
}

/** Sends a counter bill to the customer's mobile (or the number given) with a link to the bill. */
export async function sendBill(tx: Tx, actor: Actor, billId: string, webOrigin: string, phone?: string) {
  const [b] = await tx.select().from(tables.posBills).where(eq(tables.posBills.id, billId));
  if (!b) throw notFound();
  if (b.status === "void") throw badRequest("bill_void");
  const to = phone ?? b.customerPhone;
  if (!to || !normalizeIndianMobile(to)) throw badRequest("invalid_phone");
  const company = await resolveCompany(tx, b.companyId);
  const tpl = await template(tx, "bill_share");
  const link = await shareLink(tx, actor, "pos_bill", b.id, webOrigin);
  return sendMessage(tx, actor, {
    templateId: tpl.id, phone: to, ...(b.customerAccountId ? { accountId: b.customerAccountId } : {}),
    params: [b.customerName?.trim() || "Customer", company.legalName ?? company.name, b.number, formatIndian(b.total), link.url],
  });
}

/** Whether a new counter bill goes out on WhatsApp by itself: switched on, and the customer gave a mobile. */
export async function autoSendsBill(tx: Tx, billId: string) {
  const [b] = await tx.select({ companyId: tables.posBills.companyId, phone: tables.posBills.customerPhone }).from(tables.posBills).where(eq(tables.posBills.id, billId));
  if (!b?.phone) return false;
  return (await posSettings(tx, b.companyId)).autoSendBill;
}

/** Sends a tax invoice to the customer's mobile (or the number given) with a link to view and print it. */
export async function sendInvoice(tx: Tx, actor: Actor, invoiceId: string, webOrigin: string, phone?: string) {
  const [i] = await tx.select({ i: tables.salesInvoices, name: tables.accounts.name, phone: tables.accounts.phone }).from(tables.salesInvoices)
    .innerJoin(tables.accounts, eq(tables.accounts.id, tables.salesInvoices.customerId)).where(eq(tables.salesInvoices.id, invoiceId));
  if (!i) throw notFound();
  if (i.i.status === "cancelled") throw badRequest("invoice_cancelled");
  const to = phone ?? i.phone;
  if (!to || !normalizeIndianMobile(to)) throw badRequest("invalid_phone");
  const company = await resolveCompany(tx, i.i.companyId);
  const tpl = await template(tx, "invoice_share");
  const link = await shareLink(tx, actor, "invoice", invoiceId, webOrigin);
  return sendMessage(tx, actor, {
    templateId: tpl.id, phone: to, accountId: i.i.customerId,
    params: [i.name, i.i.number, i.i.date, formatIndian(i.i.total), company.legalName ?? company.name, link.url],
  });
}

/**
 * Payment reminders with a link to each customer's statement: to the customers asked for, or to every
 * customer with something outstanding (only those with overdue bills when `overdueOnly`). Customers
 * without a mobile number are skipped and listed so someone can call them.
 */
export async function remindCustomers(tx: Tx, actor: Actor, input: { accountIds?: string[] | undefined; overdueOnly?: boolean | undefined }, asOf: string, webOrigin: string) {
  const company = await resolveCompany(tx);
  const tpl = await template(tx, "payment_reminder_link");
  const rec = await outstanding(tx, company.id, "receivable", asOf);
  const wanted = input.accountIds ? new Set(input.accountIds) : null;
  const sent: { partyId: string; name: string; messageId: string; status: string }[] = [];
  const skipped: { partyId: string; name: string; reason: string }[] = [];
  for (const r of rec.rows) {
    if (wanted && !wanted.has(r.partyId)) continue;
    if (!dec(r.balance).gt(0)) { if (wanted) skipped.push({ partyId: r.partyId, name: r.name, reason: "nothing_outstanding" }); continue; }
    const overdue = r.openItems.filter((o) => o.daysOverdue > 0).reduce((s, o) => s.plus(o.amount), dec(0));
    if (input.overdueOnly && !overdue.gt(0)) continue;
    if (!r.phone || !normalizeIndianMobile(r.phone)) { skipped.push({ partyId: r.partyId, name: r.name, reason: "no_phone" }); continue; }
    if (sent.length >= 200) { skipped.push({ partyId: r.partyId, name: r.name, reason: "limit" }); continue; }
    const link = await shareLink(tx, actor, "statement", r.partyId, webOrigin);
    const m = await sendMessage(tx, actor, {
      templateId: tpl.id, accountId: r.partyId,
      params: [r.name, formatIndian(r.balance), company.legalName ?? company.name, formatIndian(money(overdue)), link.url],
    });
    sent.push({ partyId: r.partyId, name: r.name, messageId: m.id, status: m.status });
  }
  if (wanted) {
    for (const id of wanted) if (!rec.rows.some((r) => r.partyId === id)) skipped.push({ partyId: id, name: "", reason: "nothing_outstanding" });
  }
  return { sent, skipped };
}

/** The message log: what went out, to whom, and whether it was delivered to the provider. */
export async function listMessages(tx: Tx, q: { accountId?: string | undefined; status?: string | undefined; limit?: number | undefined }) {
  const company = await resolveCompany(tx);
  return tx.select({
    id: tables.messages.id, to: tables.messages.to, body: tables.messages.body, status: tables.messages.status, error: tables.messages.error, provider: tables.messages.provider,
    createdAt: tables.messages.createdAt, accountId: tables.messages.accountId, account: tables.accounts.name, template: tables.messageTemplates.name, sentBy: tables.users.name,
  }).from(tables.messages)
    .leftJoin(tables.accounts, eq(tables.accounts.id, tables.messages.accountId))
    .leftJoin(tables.messageTemplates, eq(tables.messageTemplates.id, tables.messages.templateId))
    .leftJoin(tables.users, eq(tables.users.id, tables.messages.createdBy))
    .where(and(
      eq(tables.messages.companyId, company.id), q.accountId ? eq(tables.messages.accountId, q.accountId) : undefined,
      q.status ? eq(tables.messages.status, q.status) : undefined,
    )).orderBy(desc(tables.messages.createdAt)).limit(q.limit ?? 200);
}

/** Counts for the log's header: sent and failed this month. */
export async function messageCounts(tx: Tx, monthStart: string) {
  const company = await resolveCompany(tx);
  const [r] = await tx.execute<{ sent: number; failed: number }>(sql`
    select count(*) filter (where status = 'sent')::int as sent, count(*) filter (where status = 'failed')::int as failed
    from messages where company_id = ${company.id} and created_at >= ${monthStart}::date`);
  return { sent: r?.sent ?? 0, failed: r?.failed ?? 0 };
}
