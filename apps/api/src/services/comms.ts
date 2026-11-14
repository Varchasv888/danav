import { and, asc, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { withTenant, tables, type Db, type Tx } from "@varchasv/db";
import { dec, money, normalizeIndianMobile } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, notFound } from "../lib/errors.js";
import type { ChannelSender } from "../integrations/channels.js";
import type { Messenger } from "../integrations/messaging.js";
import type { Mailer } from "../lib/mailer.js";
import { resolveCompany } from "./accounting.js";

interface Actor { tenantId: string; userId: string | null; ip?: string | undefined }

export const CHANNELS = ["whatsapp", "sms", "email", "push"] as const;
export type Channel = (typeof CHANNELS)[number];
export const CATEGORIES = ["utility", "marketing", "security"] as const;
type Category = (typeof CATEGORIES)[number];

/** The events the business can send for, and who they usually go to. */
export const EVENTS = [
  "bill_sent", "payment_reminder", "appointment", "token", "trial_ready", "delivery", "repair_status", "order_update",
  "daily_sales_owner", "scheduled_summary", "backup_status", "credit_exception", "absent_employee", "payroll_paid", "otp_login", "promo",
  "payment_received", "approval_due",
] as const;
export type CommEvent = (typeof EVENTS)[number];
const OWNER_EVENTS = new Set<string>(["daily_sales_owner", "scheduled_summary", "backup_status", "credit_exception", "absent_employee"]);

interface DefaultTemplate { event: CommEvent; channel: Channel; category?: Category; subject?: string; body: string }
const DEFAULTS: DefaultTemplate[] = [
  { event: "bill_sent", channel: "whatsapp", body: "Hi {name}, thank you for shopping at {shop}. Your bill {number} for Rs {amount} is here: {link}" },
  { event: "bill_sent", channel: "sms", body: "{shop}: bill {number} Rs {amount}. {link}" },
  { event: "payment_reminder", channel: "whatsapp", body: "Dear {name}, Rs {amount} is pending with {shop}. Please pay when you can. Thank you." },
  { event: "payment_reminder", channel: "sms", body: "{shop}: Rs {amount} is pending from you. Please pay soon." },
  { event: "payment_reminder", channel: "email", subject: "Payment reminder from {shop}", body: "Dear {name},\n\nRs {amount} is pending with {shop}. Please pay when you can.\n\nThank you." },
  { event: "appointment", channel: "whatsapp", body: "Hi {name}, your appointment at {shop} is on {when}." },
  { event: "appointment", channel: "sms", body: "{shop}: your appointment is on {when}." },
  { event: "token", channel: "sms", body: "{shop}: your token number is {token}." },
  { event: "trial_ready", channel: "whatsapp", body: "Hi {name}, your trial for {item} is ready at {shop}." },
  { event: "delivery", channel: "whatsapp", body: "Hi {name}, your order {number} from {shop} has been dispatched. {tracking}" },
  { event: "delivery", channel: "sms", body: "{shop}: order {number} dispatched. {tracking}" },
  { event: "repair_status", channel: "whatsapp", body: "Hi {name}, your repair {number} at {shop} is now: {status}." },
  { event: "repair_status", channel: "sms", body: "{shop}: repair {number} is {status}." },
  { event: "order_update", channel: "whatsapp", body: "Hi {name}, order {number} at {shop}: {status}." },
  { event: "daily_sales_owner", channel: "whatsapp", body: "{shop} on {date}: sales Rs {sales} across {bills} bills." },
  { event: "daily_sales_owner", channel: "email", subject: "Sales on {date}: {shop}", body: "{shop} on {date}: sales Rs {sales} across {bills} bills." },
  { event: "scheduled_summary", channel: "email", subject: "{title}", body: "{summary}" },
  { event: "backup_status", channel: "email", subject: "Backup {status}: {shop}", body: "The backup of {shop} on {date} {status}." },
  { event: "credit_exception", channel: "whatsapp", body: "{shop}: {name} is over the credit limit by Rs {amount} ({number})." },
  { event: "absent_employee", channel: "whatsapp", body: "{shop}: {name} is absent today ({date})." },
  { event: "payroll_paid", channel: "sms", body: "{shop}: your salary for {period}, Rs {amount}, has been paid." },
  { event: "otp_login", channel: "sms", category: "security", body: "{code} is your sign-in code for {shop}. Do not share it." },
  { event: "payment_received", channel: "whatsapp", body: "Hi {name}, we received Rs {amount} on {date}. Thank you. {shop}" },
  { event: "payment_received", channel: "sms", body: "{shop}: received Rs {amount} on {date}. Thank you." },
  { event: "approval_due", channel: "whatsapp", body: "Hi {name}, the goods you took on approval from {shop} (memo {number}) were due back on {date}. Please return them or tell us what you are keeping." },
  { event: "approval_due", channel: "sms", body: "{shop}: goods on approval (memo {number}) were due back on {date}. Please return or confirm." },
  { event: "promo", channel: "whatsapp", category: "marketing", body: "Hi {name}, {offer} at {shop}. Reply STOP to opt out." },
  { event: "promo", channel: "sms", category: "marketing", body: "{shop}: {offer}. Reply STOP to opt out." },
];

/** Fills {placeholders}; a placeholder with no value is an error, so a message never goes out with a hole in it. */
export function renderComm(text: string, params: Record<string, string>): string {
  return text.replace(/\{([a-zA-Z_]+)\}/g, (_m, k: string) => {
    const v = params[k];
    if (v === undefined) throw badRequest("missing_param");
    return v;
  });
}

/** A phone as 10 digits with country code, or a lower-case email, so consent and dedupe match however it was typed. */
export function contactKey(channel: Channel, raw: string): string | null {
  if (channel === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.trim()) ? raw.trim().toLowerCase() : null;
  if (channel === "push") return raw.trim() ? raw.trim() : null;
  return normalizeIndianMobile(raw);
}

async function ensureTemplates(tx: Tx, tenantId: string, companyId: string) {
  const have = await tx.select({ e: tables.commTemplates.event, c: tables.commTemplates.channel }).from(tables.commTemplates).where(and(eq(tables.commTemplates.companyId, companyId), eq(tables.commTemplates.language, "en")));
  const seen = new Set(have.map((h) => `${h.e}/${h.c}`));
  const add = DEFAULTS.filter((d) => !seen.has(`${d.event}/${d.channel}`));
  if (add.length) await tx.insert(tables.commTemplates).values(add.map((d) => ({ tenantId, companyId, event: d.event, channel: d.channel, language: "en", category: d.category ?? "utility", subject: d.subject ?? null, body: d.body }))).onConflictDoNothing();
}

export async function listTemplates(tx: Tx) {
  const company = await resolveCompany(tx);
  await ensureTemplates(tx, company.tenantId, company.id);
  return tx.select().from(tables.commTemplates).where(eq(tables.commTemplates.companyId, company.id)).orderBy(asc(tables.commTemplates.event), asc(tables.commTemplates.channel), asc(tables.commTemplates.language));
}

export async function saveTemplate(tx: Tx, actor: Actor, input: { event: string; channel: Channel; language: string; subject?: string | null | undefined; body: string; archived?: boolean | undefined }) {
  if (!(EVENTS as readonly string[]).includes(input.event)) throw badRequest("unknown_event");
  if (input.channel === "sms" && input.body.length > 480) throw badRequest("template_too_long");
  const company = await resolveCompany(tx);
  const category = DEFAULTS.find((d) => d.event === input.event)?.category ?? "utility";
  const values = { category, subject: input.subject ?? null, body: input.body, archived: input.archived ?? false };
  const [row] = await tx.insert(tables.commTemplates).values({ tenantId: actor.tenantId, companyId: company.id, event: input.event, channel: input.channel, language: input.language, ...values })
    .onConflictDoUpdate({ target: [tables.commTemplates.companyId, tables.commTemplates.event, tables.commTemplates.channel, tables.commTemplates.language], set: values }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "comm_template", entityId: row!.id, after: { event: input.event, channel: input.channel, language: input.language }, ip: actor.ip });
  return row!;
}

// ---- settings ----------------------------------------------------------------------------------------------

export async function commSettings(tx: Tx) {
  const company = await resolveCompany(tx);
  const [row] = await tx.select().from(tables.commSettings).where(eq(tables.commSettings.companyId, company.id));
  return row ?? { companyId: company.id, costWhatsappUtility: "0.00", costWhatsappMarketing: "0.00", costSms: "0.00", costEmail: "0.00", costPush: "0.00", ownerPhone: null, ownerEmail: null, autoEvents: [] as string[], maxAttempts: 3 };
}

export type SettingsInput = Partial<Omit<typeof tables.commSettings.$inferInsert, "id" | "tenantId" | "companyId">>;
export async function saveCommSettings(tx: Tx, actor: Actor, input: SettingsInput) {
  const company = await resolveCompany(tx);
  const current = await commSettings(tx);
  const { companyId: _c, ...rest } = current as typeof tables.commSettings.$inferSelect;
  const values = { ...rest, ...input, tenantId: actor.tenantId };
  delete (values as { id?: string }).id;
  const [row] = await tx.insert(tables.commSettings).values({ companyId: company.id, ...values }).onConflictDoUpdate({ target: tables.commSettings.companyId, set: values }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "comm_settings", entityId: company.id, after: input, ip: actor.ip });
  return row!;
}

// ---- consent ---------------------------------------------------------------------------------------------

export async function setConsent(tx: Tx, actor: Actor, input: { contact: string; channel: Channel; marketingOptIn?: boolean | undefined; optedOut?: boolean | undefined; source?: string | undefined }) {
  const company = await resolveCompany(tx);
  const contact = contactKey(input.channel, input.contact);
  if (!contact) throw badRequest("invalid_contact");
  const set: Record<string, unknown> = { source: input.source ?? "staff", updatedAt: new Date() };
  if (input.marketingOptIn !== undefined) set.marketingOptIn = input.marketingOptIn;
  if (input.optedOut !== undefined) { set.optedOut = input.optedOut; if (input.optedOut) set.marketingOptIn = false; }
  const [row] = await tx.insert(tables.commConsents).values({ tenantId: actor.tenantId, companyId: company.id, contact, channel: input.channel, marketingOptIn: !!set.marketingOptIn, optedOut: !!set.optedOut, source: String(set.source) })
    .onConflictDoUpdate({ target: [tables.commConsents.companyId, tables.commConsents.contact, tables.commConsents.channel], set }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "comm_consent", entityId: row!.id, after: { channel: input.channel, marketingOptIn: row!.marketingOptIn, optedOut: row!.optedOut }, ip: actor.ip });
  return row!;
}

export async function listConsents(tx: Tx) {
  const company = await resolveCompany(tx);
  return tx.select().from(tables.commConsents).where(eq(tables.commConsents.companyId, company.id)).orderBy(desc(tables.commConsents.updatedAt)).limit(500);
}

/** Why a message may not go to this contact, or null when it may. Security codes ignore opt-out; marketing needs a yes. */
async function blockedBy(tx: Tx, companyId: string, channel: Channel, contact: string, category: Category): Promise<string | null> {
  if (category === "security") return null;
  const [c] = await tx.select().from(tables.commConsents).where(and(eq(tables.commConsents.companyId, companyId), eq(tables.commConsents.contact, contact), eq(tables.commConsents.channel, channel)));
  if (c?.optedOut) return "opted_out";
  if (category === "marketing" && !c?.marketingOptIn) return "no_marketing_consent";
  return null;
}

// ---- queueing ---------------------------------------------------------------------------------------------

export interface QueueInput {
  event: CommEvent; channel: Channel; to: string; params: Record<string, string>; language?: string | undefined; accountId?: string | null | undefined; dedupeKey?: string | undefined;
}

/**
 * Puts one message in the outbox: wording in the requested language (English if there is none), consent checked, and a dedupe key so the same
 * event for the same person never queues twice. A message that may not go is kept as "skipped" with the reason, so the log shows why.
 */
export async function queueMessage(tx: Tx, actor: Actor, input: QueueInput) {
  const company = await resolveCompany(tx);
  await ensureTemplates(tx, company.tenantId, company.id);
  const lang = input.language ?? "en";
  const candidates = await tx.select().from(tables.commTemplates).where(and(eq(tables.commTemplates.companyId, company.id), eq(tables.commTemplates.event, input.event), eq(tables.commTemplates.channel, input.channel), eq(tables.commTemplates.archived, false), inArray(tables.commTemplates.language, [lang, "en"])));
  const tpl = candidates.find((t) => t.language === lang) ?? candidates.find((t) => t.language === "en");
  if (!tpl) throw badRequest("no_template");
  const to = contactKey(input.channel, input.to);
  if (!to) throw badRequest("invalid_contact");
  const params = { shop: company.legalName ?? company.name, ...input.params };
  const body = renderComm(tpl.body, params);
  const subject = tpl.subject ? renderComm(tpl.subject, params) : null;
  const category = tpl.category as Category;
  if (input.dedupeKey) {
    const [dup] = await tx.select().from(tables.commOutbox).where(and(eq(tables.commOutbox.companyId, company.id), eq(tables.commOutbox.dedupeKey, input.dedupeKey)));
    if (dup) return { ...dup, duplicate: true };
  }
  const blocked = await blockedBy(tx, company.id, input.channel, to, category);
  const [row] = await tx.insert(tables.commOutbox).values({
    tenantId: actor.tenantId, companyId: company.id, event: input.event, channel: input.channel, category, language: tpl.language, to, accountId: input.accountId ?? null, subject, body,
    status: blocked ? "skipped" : "queued", error: blocked, dedupeKey: input.dedupeKey ?? null, createdBy: actor.userId,
  }).returning();
  return { ...row!, duplicate: false };
}

/**
 * Raises an event: queues the message on each channel that has wording for it, to the customer (their phone and email) or, for owner events,
 * to the owner's contacts in the settings. Channels with nothing to send to are passed over.
 */
export async function emitEvent(tx: Tx, actor: Actor, input: { event: CommEvent; accountId?: string | undefined; phone?: string | undefined; email?: string | undefined; params: Record<string, string>; channels?: Channel[] | undefined; language?: string | undefined; dedupeKey?: string | undefined }) {
  const company = await resolveCompany(tx);
  const settings = await commSettings(tx);
  let phone = input.phone ?? null;
  let email = input.email ?? null;
  if (OWNER_EVENTS.has(input.event)) { phone = settings.ownerPhone; email = settings.ownerEmail; }
  else if (input.accountId) {
    const [a] = await tx.select({ phone: tables.accounts.phone, email: tables.accounts.email, companyId: tables.accounts.companyId }).from(tables.accounts).where(eq(tables.accounts.id, input.accountId));
    if (!a || a.companyId !== company.id) throw badRequest("unknown_account");
    phone ??= a.phone; email ??= a.email;
  }
  await ensureTemplates(tx, company.tenantId, company.id);
  const wanted = await tx.select({ channel: tables.commTemplates.channel }).from(tables.commTemplates).where(and(eq(tables.commTemplates.companyId, company.id), eq(tables.commTemplates.event, input.event), eq(tables.commTemplates.archived, false)));
  const channels = [...new Set(wanted.map((w) => w.channel as Channel))].filter((c) => !input.channels || input.channels.includes(c));
  const out = [];
  for (const channel of channels) {
    const to = channel === "email" ? email : phone;
    if (!to || !contactKey(channel, to)) continue;
    out.push(await queueMessage(tx, actor, { event: input.event, channel, to, params: input.params, language: input.language, accountId: input.accountId, ...(input.dedupeKey ? { dedupeKey: `${input.dedupeKey}:${channel}` } : {}) }));
  }
  return out;
}

/** A campaign: the promo wording to every customer who said yes to marketing on the channel; the rest are counted and left alone. */
export async function broadcast(tx: Tx, actor: Actor, input: { channel: Channel; params: Record<string, string>; accountIds: string[]; campaign: string; language?: string | undefined }) {
  const company = await resolveCompany(tx);
  const accounts = await tx.select({ id: tables.accounts.id, name: tables.accounts.name, phone: tables.accounts.phone, email: tables.accounts.email }).from(tables.accounts).where(and(eq(tables.accounts.companyId, company.id), inArray(tables.accounts.id, input.accountIds)));
  let queued = 0, skipped = 0, noContact = 0;
  for (const a of accounts) {
    const to = input.channel === "email" ? a.email : a.phone;
    if (!to || !contactKey(input.channel, to)) { noContact++; continue; }
    const r = await queueMessage(tx, actor, { event: "promo", channel: input.channel, to, params: { name: a.name, ...input.params }, language: input.language, accountId: a.id, dedupeKey: `campaign:${input.campaign}:${a.id}:${input.channel}` });
    if (r.status === "skipped") skipped++; else if (!r.duplicate) queued++;
  }
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "comm_campaign", entityId: company.id, after: { campaign: input.campaign, channel: input.channel, queued, skipped, noContact }, ip: actor.ip });
  return { queued, skippedNoConsent: skipped, noContact };
}

// ---- sending, retries and delivery -------------------------------------------------------------------------

export interface Senders { whatsapp: Messenger; sms: ChannelSender; push: ChannelSender; email: Mailer }
const BACKOFF_MINUTES = [5, 30, 120];

/**
 * Sends what is due. Each message is tried at most `maxAttempts` times with a growing wait between tries; because every message is one row that is
 * only marked sent once the provider accepted it, a retry never sends a second copy. Consent is checked again at send time.
 */
export async function processOutbox(tx: Tx, senders: Senders, now = new Date(), limit = 50) {
  const company = await resolveCompany(tx);
  const settings = await commSettings(tx);
  const due = await tx.select().from(tables.commOutbox)
    .where(and(eq(tables.commOutbox.companyId, company.id), eq(tables.commOutbox.status, "queued"), lte(tables.commOutbox.nextAttemptAt, now)))
    .orderBy(asc(tables.commOutbox.createdAt)).limit(limit).for("update", { skipLocked: true });
  const result = { sent: 0, retried: 0, failed: 0, skipped: 0 };
  for (const m of due) {
    const channel = m.channel as Channel;
    const blocked = await blockedBy(tx, company.id, channel, m.to, m.category as Category);
    if (blocked) { await tx.update(tables.commOutbox).set({ status: "skipped", error: blocked }).where(eq(tables.commOutbox.id, m.id)); result.skipped++; continue; }
    try {
      let provider: string; let providerId: string;
      if (channel === "whatsapp") { provider = senders.whatsapp.name; providerId = (await senders.whatsapp.send({ to: m.to, body: m.body })).id; }
      else if (channel === "sms") { provider = senders.sms.name; providerId = (await senders.sms.send({ to: m.to, body: m.body })).id; }
      else if (channel === "push") { provider = senders.push.name; providerId = (await senders.push.send({ to: m.to, body: m.body, subject: m.subject ?? undefined })).id; }
      else { await senders.email.send({ to: m.to, subject: m.subject ?? "Message", text: m.body }); provider = "email"; providerId = `mail-${m.id}`; }
      const cost = channel === "whatsapp" ? (m.category === "marketing" ? settings.costWhatsappMarketing : settings.costWhatsappUtility) : channel === "sms" ? settings.costSms : channel === "email" ? settings.costEmail : settings.costPush;
      await tx.update(tables.commOutbox).set({ status: "sent", attempts: m.attempts + 1, provider, providerId, cost, sentAt: now, error: null }).where(eq(tables.commOutbox.id, m.id));
      result.sent++;
    } catch (e) {
      const attempts = m.attempts + 1;
      const err = e instanceof Error ? e.message.slice(0, 200) : "send_failed";
      if (attempts >= settings.maxAttempts) { await tx.update(tables.commOutbox).set({ status: "failed", attempts, error: err }).where(eq(tables.commOutbox.id, m.id)); result.failed++; }
      else {
        const wait = BACKOFF_MINUTES[Math.min(attempts - 1, BACKOFF_MINUTES.length - 1)]!;
        await tx.update(tables.commOutbox).set({ attempts, error: err, nextAttemptAt: new Date(now.getTime() + wait * 60_000) }).where(eq(tables.commOutbox.id, m.id));
        result.retried++;
      }
    }
  }
  return result;
}

/** The scheduler: every business with something due gets its outbox worked through. */
export async function runDueComms(db: Db, senders: Senders, now = new Date()) {
  const due = await db.execute<{ tenant_id: string }>(sql`select tenant_id from due_comm_tenants(${now.toISOString()}::timestamptz)`);
  let sent = 0;
  for (const { tenant_id } of due) sent += (await withTenant(db, tenant_id, (tx) => processOutbox(tx, senders, now))).sent;
  return sent;
}

/** A delivery receipt from the provider: marks the message delivered (or failed) by its provider id. */
export async function recordReceipt(tx: Tx, providerId: string, status: "delivered" | "failed", error?: string) {
  const [row] = await tx.update(tables.commOutbox).set(status === "delivered" ? { status: "delivered", deliveredAt: new Date() } : { status: "failed", error: error ?? "provider_failed" })
    .where(and(eq(tables.commOutbox.providerId, providerId), inArray(tables.commOutbox.status, ["sent", "delivered"]))).returning({ id: tables.commOutbox.id });
  if (!row) throw notFound();
  return row;
}

/** A person replied STOP: nothing but security codes goes to them again, on any channel. */
export async function recordOptOut(tx: Tx, actor: Actor, contact: string) {
  const out = [];
  for (const channel of CHANNELS) if (contactKey(channel, contact)) out.push(await setConsent(tx, actor, { contact, channel, optedOut: true, source: "reply_stop" }));
  return out;
}

export async function listOutbox(tx: Tx, q: { status?: string | undefined; channel?: string | undefined; limit?: number | undefined }) {
  const company = await resolveCompany(tx);
  return tx.select().from(tables.commOutbox)
    .where(and(eq(tables.commOutbox.companyId, company.id), q.status ? eq(tables.commOutbox.status, q.status) : undefined, q.channel ? eq(tables.commOutbox.channel, q.channel) : undefined))
    .orderBy(desc(tables.commOutbox.createdAt)).limit(Math.min(q.limit ?? 100, 500));
}

/** What went out in a period by channel: counts by status, how many reached the person, and what it cost. */
export async function commReport(tx: Tx, from: string, to: string) {
  if (to < from) throw badRequest("invalid_dates");
  const company = await resolveCompany(tx);
  const rows = await tx.select({ channel: tables.commOutbox.channel, status: tables.commOutbox.status, n: sql<number>`count(*)::int`, cost: sql<string>`coalesce(sum(${tables.commOutbox.cost}), 0)::text` })
    .from(tables.commOutbox)
    .where(and(eq(tables.commOutbox.companyId, company.id), gte(tables.commOutbox.createdAt, new Date(`${from}T00:00:00+05:30`)), lte(tables.commOutbox.createdAt, new Date(`${to}T23:59:59+05:30`))))
    .groupBy(tables.commOutbox.channel, tables.commOutbox.status);
  const by = new Map<string, { channel: string; queued: number; sent: number; delivered: number; failed: number; skipped: number; cost: ReturnType<typeof dec> }>();
  for (const r of rows) {
    const e = by.get(r.channel) ?? { channel: r.channel, queued: 0, sent: 0, delivered: 0, failed: 0, skipped: 0, cost: dec(0) };
    (e as unknown as Record<string, number>)[r.status] = r.n;
    e.cost = e.cost.plus(r.cost);
    by.set(r.channel, e);
  }
  const channels = [...by.values()].map((e) => ({ ...e, cost: money(e.cost), deliveredPct: e.sent + e.delivered ? ((e.delivered / (e.sent + e.delivered)) * 100).toFixed(1) : null }));
  return { from, to, channels, totalCost: money(channels.reduce((t, c) => t.plus(c.cost), dec(0))) };
}

// ---- flows that message by themselves ---------------------------------------------------------------------

export const AUTO_EVENTS = ["invoice_issued", "payment_received", "order_dispatched", "payroll_paid", "credit_exception", "payment_reminders", "approval_due"] as const;
export type AutoEvent = (typeof AUTO_EVENTS)[number];

/**
 * Queues a message for a flow the business has switched on (settings.autoEvents). It runs in its own savepoint and never fails the document
 * that caused it: a missing template or number just means no message.
 */
export async function autoEmit(tx: Tx, actor: Actor, key: AutoEvent, input: Parameters<typeof emitEvent>[2]) {
  const settings = await commSettings(tx);
  if (!((settings as { autoEvents?: string[] }).autoEvents ?? []).includes(key)) return;
  await tx.transaction(async (sp) => { await emitEvent(sp, actor, input); }).catch(() => undefined);
}

/** Which flows message by themselves; the rest stay manual. */
export async function setAutoEvents(tx: Tx, actor: Actor, events: string[]) {
  const unknown = events.filter((e) => !(AUTO_EVENTS as readonly string[]).includes(e));
  if (unknown.length) throw badRequest("unknown_event");
  return saveCommSettings(tx, actor, { autoEvents: [...new Set(events)] });
}
