import { and, asc, desc, eq, ilike, isNull, lte, or, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import {
  LEAD_STAGES, MessageError, STAGE_PROBABILITY, dec, fiscalYearOf, formatIndian, money, normalizeIndianMobile, renderTemplate, templateParams, validateGstin,
  type LeadStage,
} from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { MessagingError, messenger } from "../integrations/messaging.js";
import { ensureChart, resolveCompany } from "./accounting.js";
import { outstanding } from "./returns.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }
type Lead = typeof tables.crmLeads.$inferSelect;

// ---- leads ------------------------------------------------------------------------------------------

export interface LeadInput {
  name: string; organisation?: string | null | undefined; phone?: string | null | undefined; email?: string | null | undefined;
  gstin?: string | null | undefined; stateCode?: string | null | undefined; city?: string | null | undefined; source?: string | undefined;
  stage?: LeadStage | undefined; value?: string | null | undefined; expectedClose?: string | null | undefined; ownerId?: string | null | undefined;
  notes?: string | null | undefined;
}

function leadValues(input: LeadInput) {
  const gstin = input.gstin?.trim().toUpperCase() || null;
  if (gstin && !validateGstin(gstin).valid) throw badRequest("invalid_gstin");
  if (input.phone && !normalizeIndianMobile(input.phone)) throw badRequest("invalid_phone");
  return {
    name: input.name.trim(), organisation: input.organisation ?? null, phone: input.phone ?? null, email: input.email ?? null, gstin,
    stateCode: input.stateCode ?? gstin?.slice(0, 2) ?? null, city: input.city ?? null, ...(input.source ? { source: input.source } : {}),
    value: input.value ?? null, expectedClose: input.expectedClose ?? null, ownerId: input.ownerId ?? null, notes: input.notes ?? null, updatedAt: new Date(),
  };
}

export async function createLead(tx: Tx, actor: Actor, input: LeadInput) {
  const company = await resolveCompany(tx);
  if (input.stage === "won") throw badRequest("convert_to_win");
  const [r] = await tx.execute<{ n: number }>(sql`select coalesce(max(nullif(regexp_replace(code, '\\D', '', 'g'), '')::int), 0)::int + 1 as n from crm_leads where company_id = ${company.id}`);
  const [row] = await tx.insert(tables.crmLeads).values({
    tenantId: actor.tenantId, companyId: company.id, code: `LD-${String(r!.n).padStart(4, "0")}`, ...leadValues(input),
    stage: input.stage ?? "new", ownerId: input.ownerId ?? actor.userId, createdBy: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "lead", entityId: row!.id, after: { code: row!.code, name: row!.name }, ip: actor.ip });
  return row!;
}

async function loadLead(tx: Tx, id: string) {
  const [l] = await tx.select().from(tables.crmLeads).where(eq(tables.crmLeads.id, id)).for("update");
  if (!l) throw notFound();
  return l;
}

export async function updateLead(tx: Tx, actor: Actor, id: string, input: LeadInput) {
  const l = await loadLead(tx, id);
  const [row] = await tx.update(tables.crmLeads).set(leadValues(input)).where(eq(tables.crmLeads.id, id)).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "lead", entityId: id, before: { name: l.name }, after: { name: row!.name }, ip: actor.ip });
  return row!;
}

/** Moves a lead along the pipeline. Won goes through conversion; lost needs a reason. */
export async function setStage(tx: Tx, actor: Actor, id: string, stage: LeadStage, lostReason?: string) {
  const l = await loadLead(tx, id);
  if (!(LEAD_STAGES as readonly string[]).includes(stage)) throw badRequest("invalid_stage");
  if (stage === "won" && !l.customerId) throw badRequest("convert_to_win");
  if (stage === "lost" && !lostReason?.trim()) throw badRequest("lost_reason_required");
  await tx.update(tables.crmLeads).set({ stage, lostReason: stage === "lost" ? lostReason!.trim() : null, updatedAt: new Date() }).where(eq(tables.crmLeads.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "lead", entityId: id, before: { stage: l.stage }, after: { stage }, ip: actor.ip });
}

/**
 * Winning a lead makes it a customer: a ledger under Sundry Debtors (or an existing customer with the
 * same GSTIN is used), and the lead is marked won.
 */
export async function convertLead(tx: Tx, actor: Actor, id: string, input: { accountId?: string | undefined } = {}) {
  const company = await resolveCompany(tx);
  await ensureChart(tx, actor.tenantId, company.id);
  const l = await loadLead(tx, id);
  if (l.customerId) throw conflict("already_converted");
  let customerId = input.accountId ?? null;
  if (customerId) {
    const [a] = await tx.select().from(tables.accounts).where(eq(tables.accounts.id, customerId));
    if (!a || a.companyId !== company.id) throw badRequest("unknown_account");
  } else if (l.gstin) {
    const [same] = await tx.select().from(tables.accounts).where(and(eq(tables.accounts.companyId, company.id), eq(tables.accounts.gstin, l.gstin)));
    customerId = same?.id ?? null;
  }
  if (!customerId) {
    const [group] = await tx.select().from(tables.accountGroups).where(and(eq(tables.accountGroups.companyId, company.id), eq(tables.accountGroups.key, "sundry_debtors")));
    const name = (l.organisation || l.name).trim();
    const [taken] = await tx.select({ id: tables.accounts.id }).from(tables.accounts).where(and(eq(tables.accounts.companyId, company.id), eq(tables.accounts.name, name)));
    const [a] = await tx.insert(tables.accounts).values({
      tenantId: actor.tenantId, companyId: company.id, groupId: group!.id, name: taken ? `${name} (${l.code})` : name,
      gstin: l.gstin, stateCode: l.stateCode, phone: l.phone, email: l.email, address: l.city ? { city: l.city } : null,
    }).returning();
    customerId = a!.id;
  }
  await tx.update(tables.crmLeads).set({ customerId, stage: "won", lostReason: null, updatedAt: new Date() }).where(eq(tables.crmLeads.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "lead", entityId: id, after: { stage: "won", customerId }, ip: actor.ip });
  return { customerId };
}

export async function listLeads(tx: Tx, q: { stage?: string | undefined; ownerId?: string | undefined; q?: string | undefined }) {
  const company = await resolveCompany(tx);
  const like = q.q ? `%${q.q.replace(/[%_\\]/g, "\\$&")}%` : null;
  return tx.select({ l: tables.crmLeads, owner: tables.users.name, nextFollowUp: sql<string | null>`(select min(due_at)::text from crm_activities a where a.lead_id = ${tables.crmLeads.id} and a.done_at is null)` })
    .from(tables.crmLeads).leftJoin(tables.users, eq(tables.users.id, tables.crmLeads.ownerId))
    .where(and(
      eq(tables.crmLeads.companyId, company.id), q.stage ? eq(tables.crmLeads.stage, q.stage) : undefined, q.ownerId ? eq(tables.crmLeads.ownerId, q.ownerId) : undefined,
      like ? or(ilike(tables.crmLeads.name, like), ilike(tables.crmLeads.organisation, like), ilike(tables.crmLeads.phone, like), ilike(tables.crmLeads.city, like)) : undefined,
    )).orderBy(desc(tables.crmLeads.updatedAt)).limit(500);
}

export async function pipeline(tx: Tx) {
  const company = await resolveCompany(tx);
  const rows = await tx.execute<{ stage: LeadStage; n: number; value: string }>(sql`select stage, count(*)::int as n, coalesce(sum(value), 0)::text as value from crm_leads where company_id = ${company.id} group by stage`);
  return LEAD_STAGES.map((s) => {
    const r = [...rows].find((x) => x.stage === s);
    return { stage: s, count: r?.n ?? 0, value: money(r?.value ?? 0), weighted: money(dec(r?.value ?? 0).times(STAGE_PROBABILITY[s]).div(100)) };
  });
}

export async function getLead(tx: Tx, id: string) {
  const [l] = await tx.select({ l: tables.crmLeads, owner: tables.users.name }).from(tables.crmLeads).leftJoin(tables.users, eq(tables.users.id, tables.crmLeads.ownerId)).where(eq(tables.crmLeads.id, id));
  if (!l) throw notFound();
  const [activities, msgs] = await Promise.all([
    listActivities(tx, { leadId: id }),
    tx.select().from(tables.messages).where(eq(tables.messages.leadId, id)).orderBy(desc(tables.messages.createdAt)).limit(50),
  ]);
  return { ...l.l, owner: l.owner, activities: activities.map(flatActivity), messages: msgs };
}

// ---- activities --------------------------------------------------------------------------------------

export interface ActivityInput {
  leadId?: string | undefined; accountId?: string | undefined; kind: "call" | "meeting" | "task" | "note" | "whatsapp" | "email";
  subject: string; dueAt?: string | null | undefined; done?: boolean | undefined; ownerId?: string | null | undefined; notes?: string | null | undefined;
}

export async function addActivity(tx: Tx, actor: Actor, input: ActivityInput) {
  const company = await resolveCompany(tx);
  if (!input.leadId && !input.accountId) throw badRequest("lead_or_customer_required");
  if (input.leadId) await loadLead(tx, input.leadId);
  if (input.accountId) {
    const [a] = await tx.select({ companyId: tables.accounts.companyId }).from(tables.accounts).where(eq(tables.accounts.id, input.accountId));
    if (!a || a.companyId !== company.id) throw badRequest("unknown_account");
  }
  const [row] = await tx.insert(tables.crmActivities).values({
    tenantId: actor.tenantId, companyId: company.id, leadId: input.leadId ?? null, accountId: input.accountId ?? null, kind: input.kind, subject: input.subject.trim(),
    dueAt: input.dueAt ? new Date(input.dueAt) : null, doneAt: input.done || input.kind === "note" ? new Date() : null,
    ownerId: input.ownerId ?? actor.userId, notes: input.notes ?? null, createdBy: actor.userId,
  }).returning();
  if (input.leadId) await tx.update(tables.crmLeads).set({ updatedAt: new Date() }).where(eq(tables.crmLeads.id, input.leadId));
  return row!;
}

export async function completeActivity(tx: Tx, id: string, done: boolean) {
  const [row] = await tx.update(tables.crmActivities).set({ doneAt: done ? new Date() : null }).where(eq(tables.crmActivities.id, id)).returning();
  if (!row) throw notFound();
  return row;
}

export const flatActivity = (r: Awaited<ReturnType<typeof listActivities>>[number]) => ({ ...r.a, owner: r.owner, lead: r.lead, leadCode: r.leadCode, account: r.account });

export async function listActivities(tx: Tx, q: { leadId?: string | undefined; accountId?: string | undefined; ownerId?: string | undefined; open?: boolean | undefined; dueBy?: string | undefined }) {
  const company = await resolveCompany(tx);
  return tx.select({ a: tables.crmActivities, owner: tables.users.name, lead: tables.crmLeads.name, leadCode: tables.crmLeads.code, account: tables.accounts.name })
    .from(tables.crmActivities).leftJoin(tables.users, eq(tables.users.id, tables.crmActivities.ownerId))
    .leftJoin(tables.crmLeads, eq(tables.crmLeads.id, tables.crmActivities.leadId)).leftJoin(tables.accounts, eq(tables.accounts.id, tables.crmActivities.accountId))
    .where(and(
      eq(tables.crmActivities.companyId, company.id), q.leadId ? eq(tables.crmActivities.leadId, q.leadId) : undefined, q.accountId ? eq(tables.crmActivities.accountId, q.accountId) : undefined,
      q.ownerId ? eq(tables.crmActivities.ownerId, q.ownerId) : undefined, q.open ? isNull(tables.crmActivities.doneAt) : undefined,
      q.dueBy ? lte(tables.crmActivities.dueAt, new Date(q.dueBy)) : undefined,
    )).orderBy(q.open ? asc(tables.crmActivities.dueAt) : desc(tables.crmActivities.createdAt)).limit(500);
}

// ---- templates and messages -----------------------------------------------------------------------------

const DEFAULT_TEMPLATES = [
  { name: "payment_reminder", body: "Dear {{1}}, ₹{{2}} is outstanding on your account with {{3}}. Please arrange payment at the earliest. Thank you." },
  { name: "order_confirmation", body: "Dear {{1}}, thank you for your order {{2}}. We will deliver it by {{3}}. {{4}}" },
  { name: "follow_up", body: "Hello {{1}}, thank you for your interest in {{2}}. May we call you to discuss your requirement?" },
  { name: "bill_share", body: "Dear {{1}}, thank you for shopping at {{2}}. Your bill {{3}} for ₹{{4}} is here: {{5}}" },
  { name: "invoice_share", body: "Dear {{1}}, invoice {{2}} dated {{3}} for ₹{{4}} from {{5}}. View or download it here: {{6}}" },
  { name: "payment_reminder_link", body: "Dear {{1}}, ₹{{2}} is outstanding on your account with {{3}}, of which ₹{{4}} is overdue. Thank you. Your statement: {{5}}" },
];

/** Adds any default template the business does not have yet (one it edited is left as it is). */
async function ensureTemplates(tx: Tx, tenantId: string, companyId: string) {
  const have = new Set((await tx.select({ name: tables.messageTemplates.name }).from(tables.messageTemplates).where(eq(tables.messageTemplates.companyId, companyId))).map((r) => r.name));
  const missing = DEFAULT_TEMPLATES.filter((t) => !have.has(t.name));
  if (missing.length) await tx.insert(tables.messageTemplates).values(missing.map((t) => ({ tenantId, companyId, ...t }))).onConflictDoNothing();
}

export async function listTemplates(tx: Tx) {
  const company = await resolveCompany(tx);
  await ensureTemplates(tx, company.tenantId, company.id);
  const rows = await tx.select().from(tables.messageTemplates).where(eq(tables.messageTemplates.companyId, company.id)).orderBy(asc(tables.messageTemplates.name));
  return rows.map((r) => ({ ...r, params: templateParams(r.body) }));
}

export async function saveTemplate(tx: Tx, actor: Actor, input: { name: string; body: string; category?: "utility" | "marketing" | undefined; language?: string | undefined; providerName?: string | null | undefined; archived?: boolean | undefined }, id?: string) {
  const company = await resolveCompany(tx);
  if (input.body.length > 1024) throw badRequest("template_too_long");
  const values = { name: input.name.trim(), body: input.body, category: input.category ?? "utility", language: input.language ?? "en", providerName: input.providerName ?? null, archived: input.archived ?? false };
  try {
    if (id) {
      const [row] = await tx.update(tables.messageTemplates).set(values).where(eq(tables.messageTemplates.id, id)).returning();
      if (!row) throw notFound();
      return row;
    }
    const [row] = await tx.insert(tables.messageTemplates).values({ tenantId: actor.tenantId, companyId: company.id, ...values }).returning();
    return row!;
  } catch (e) {
    if ((e as { cause?: { code?: string } })?.cause?.code === "23505") throw conflict("template_exists");
    throw e;
  }
}

/** Sends a template to a lead or customer (or a number), logs it, and notes it on their timeline. */
export async function sendMessage(tx: Tx, actor: Actor, input: { templateId: string; params: string[]; leadId?: string | undefined; accountId?: string | undefined; phone?: string | undefined }) {
  const company = await resolveCompany(tx);
  const [tpl] = await tx.select().from(tables.messageTemplates).where(eq(tables.messageTemplates.id, input.templateId));
  if (!tpl || tpl.companyId !== company.id || tpl.archived) throw badRequest("unknown_template");
  let phone = input.phone ?? null;
  let lead: Lead | undefined;
  if (input.leadId) { lead = await loadLead(tx, input.leadId); phone ??= lead.phone; }
  if (input.accountId) {
    const [a] = await tx.select().from(tables.accounts).where(eq(tables.accounts.id, input.accountId));
    if (!a || a.companyId !== company.id) throw badRequest("unknown_account");
    phone ??= a.phone;
  }
  const to = phone ? normalizeIndianMobile(phone) : null;
  if (!to) throw badRequest("invalid_phone");
  let body: string;
  try { body = renderTemplate(tpl.body, input.params); } catch (e) { throw badRequest(e instanceof MessageError ? e.code : "invalid_template"); }
  let status: "sent" | "failed" = "sent";
  let providerId: string | null = null;
  let error: string | null = null;
  try {
    providerId = (await messenger.send({ to, body, ...(tpl.providerName ? { template: { name: tpl.providerName, language: tpl.language, params: input.params } } : {}) })).id;
  } catch (e) {
    status = "failed";
    error = e instanceof MessagingError ? e.code : "send_failed";
  }
  const [msg] = await tx.insert(tables.messages).values({
    tenantId: actor.tenantId, companyId: company.id, channel: tpl.channel, to, accountId: input.accountId ?? null, leadId: input.leadId ?? null,
    templateId: tpl.id, body, status, provider: messenger.name, providerId, error, createdBy: actor.userId,
  }).returning();
  if (status === "sent") {
    await tx.insert(tables.crmActivities).values({
      tenantId: actor.tenantId, companyId: company.id, leadId: input.leadId ?? null, accountId: input.accountId ?? null, kind: "whatsapp",
      subject: tpl.name.replace(/_/g, " "), notes: body, doneAt: new Date(), ownerId: actor.userId, createdBy: actor.userId,
    });
  }
  return msg!;
}

/** A payment reminder with the customer's outstanding amount filled in. */
export async function remindOutstanding(tx: Tx, actor: Actor, accountId: string, today: string) {
  const company = await resolveCompany(tx);
  const templates = await listTemplates(tx);
  const tpl = templates.find((t) => t.name === "payment_reminder" && !t.archived);
  if (!tpl) throw badRequest("unknown_template");
  const rec = await outstanding(tx, company.id, "receivable", today);
  const row = rec.rows.find((r) => r.partyId === accountId);
  if (!row || !dec(row.balance).gt(0)) throw badRequest("nothing_outstanding");
  return sendMessage(tx, actor, { templateId: tpl.id, accountId, params: [row.name, formatIndian(row.balance), company.legalName ?? company.name] });
}

// ---- customer 360 --------------------------------------------------------------------------------------

/** Everything about one customer: balance and ageing, recent documents and payments, open orders, activities and messages. */
export async function customer360(tx: Tx, accountId: string, today: string) {
  const company = await resolveCompany(tx);
  const [a] = await tx.select({ a: tables.accounts, groupKey: tables.accountGroups.key }).from(tables.accounts)
    .innerJoin(tables.accountGroups, eq(tables.accountGroups.id, tables.accounts.groupId)).where(eq(tables.accounts.id, accountId));
  if (!a || a.a.companyId !== company.id) throw notFound();
  const fy = fiscalYearOf(today);
  const rec = await outstanding(tx, company.id, "receivable", today);
  const [invoices, receipts, orders, quotations, activities, msgs, lead, [sales]] = await Promise.all([
    tx.select({ id: tables.salesInvoices.id, number: tables.salesInvoices.number, date: tables.salesInvoices.date, total: tables.salesInvoices.total, status: tables.salesInvoices.status, dueOn: tables.salesInvoices.dueOn })
      .from(tables.salesInvoices).where(eq(tables.salesInvoices.customerId, accountId)).orderBy(desc(tables.salesInvoices.date)).limit(10),
    tx.execute<{ id: string; number: string; date: string; amount: string }>(sql`
      select v.id, v.number, v.date::text as date, l.credit::text as amount from vouchers v join voucher_lines l on l.voucher_id = v.id
      where l.account_id = ${accountId} and v.type = 'receipt' and v.status = 'posted' and l.credit > 0 order by v.date desc limit 10`),
    tx.select({ id: tables.salesOrders.id, number: tables.salesOrders.number, date: tables.salesOrders.date, status: tables.salesOrders.status })
      .from(tables.salesOrders).where(and(eq(tables.salesOrders.customerId, accountId), or(eq(tables.salesOrders.status, "open"), eq(tables.salesOrders.status, "partial")))).orderBy(desc(tables.salesOrders.date)),
    tx.select({ id: tables.quotations.id, number: tables.quotations.number, date: tables.quotations.date, status: tables.quotations.status, total: tables.quotations.total })
      .from(tables.quotations).where(and(eq(tables.quotations.customerId, accountId), or(eq(tables.quotations.status, "open"), eq(tables.quotations.status, "accepted")))).orderBy(desc(tables.quotations.date)),
    listActivities(tx, { accountId }),
    tx.select().from(tables.messages).where(eq(tables.messages.accountId, accountId)).orderBy(desc(tables.messages.createdAt)).limit(20),
    tx.select({ id: tables.crmLeads.id, code: tables.crmLeads.code, source: tables.crmLeads.source, createdAt: tables.crmLeads.createdAt }).from(tables.crmLeads).where(eq(tables.crmLeads.customerId, accountId)),
    tx.execute<{ fy: string; last: string }>(sql`
      select coalesce(sum(taxable) filter (where date >= ${fy.start}::date), 0)::text as fy, coalesce(sum(taxable) filter (where date >= ${`${fy.startYear - 1}-04-01`}::date and date < ${fy.start}::date), 0)::text as last
      from sales_invoices where customer_id = ${accountId} and status <> 'cancelled'`),
  ]);
  const o = rec.rows.find((r) => r.partyId === accountId);
  return {
    account: { ...a.a, isCustomer: a.groupKey === "sundry_debtors" }, lead: lead[0] ?? null,
    salesThisYear: money(sales?.fy ?? 0), salesLastYear: money(sales?.last ?? 0),
    balance: o?.balance ?? "0.00", buckets: o?.buckets ?? null, openItems: o?.openItems ?? [],
    invoices, receipts: [...receipts].map((r) => ({ ...r, amount: money(r.amount) })), orders, quotations,
    activities: activities.map(flatActivity), messages: msgs,
  };
}
