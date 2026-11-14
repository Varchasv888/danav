import { createHmac, timingSafeEqual } from "node:crypto";
import { sql } from "drizzle-orm";
import { withTenant, type Db } from "@varchasv/db";
import { contactKey, recordOptOut, recordReceipt, type Channel } from "./comms.js";

/** A signature the provider put on the exact bytes it sent: HMAC-SHA256 with the shared secret, as hex (with or without a "sha256=" prefix). */
export function signatureOk(secret: string | undefined, raw: string, header: string | undefined): boolean {
  if (!secret || !header) return false;
  const given = header.replace(/^sha256=/i, "").trim().toLowerCase();
  const want = createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(given, "utf8"), b = Buffer.from(want, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

const STOP_WORDS = /^\s*(stop|unsubscribe|cancel|end|quit)\s*$/i;

interface Outcome { delivered: number; failed: number; optedOut: number; ignored: number }
const fresh = (): Outcome => ({ delivered: 0, failed: 0, optedOut: 0, ignored: 0 });

async function applyReceipt(db: Db, out: Outcome, providerId: string, status: "delivered" | "failed", error?: string) {
  const [row] = [...await db.execute<{ t: string | null }>(sql`select comm_tenant_by_provider_id(${providerId}) as t`)];
  if (!row?.t) { out.ignored += 1; return; }
  try {
    await withTenant(db, row.t, (tx) => recordReceipt(tx, providerId, status, error));
    out[status] += 1;
  } catch { out.ignored += 1; }
}

/** A person replied STOP: opt the number out in every business that has messaged it. */
async function applyStop(db: Db, out: Outcome, from: string, channel: Channel) {
  const key = contactKey(channel, from);
  if (!key) { out.ignored += 1; return; }
  const tenants = [...await db.execute<{ t: string }>(sql`select comm_tenants_by_contact(${key}) as t`)];
  if (!tenants.length) { out.ignored += 1; return; }
  for (const { t } of tenants) {
    await withTenant(db, t, (tx) => recordOptOut(tx, { tenantId: t, userId: null, ip: undefined }, key));
    out.optedOut += 1;
  }
}

/**
 * The WhatsApp Cloud API's callback: status updates for messages sent (delivered, read, failed) and the messages people send back. Delivery
 * moves a message to delivered, failure records why, and a STOP reply opts the number out.
 */
export async function handleWhatsApp(db: Db, payload: unknown): Promise<Outcome> {
  const out = fresh();
  const entries = ((payload as { entry?: unknown[] })?.entry ?? []) as { changes?: { value?: { statuses?: { id?: string; status?: string; errors?: { title?: string; message?: string }[] }[]; messages?: { from?: string; type?: string; text?: { body?: string } }[] } }[] }[];
  for (const e of entries) for (const c of e.changes ?? []) {
    for (const s of c.value?.statuses ?? []) {
      if (!s.id) continue;
      if (s.status === "delivered" || s.status === "read") await applyReceipt(db, out, s.id, "delivered");
      else if (s.status === "failed") await applyReceipt(db, out, s.id, "failed", s.errors?.[0]?.title ?? s.errors?.[0]?.message ?? "whatsapp_failed");
    }
    for (const m of c.value?.messages ?? []) if (m.from && m.type === "text" && STOP_WORDS.test(m.text?.body ?? "")) await applyStop(db, out, m.from, "whatsapp");
  }
  return out;
}

/**
 * A text-message gateway's callback in a plain shape: `{ id, status: "delivered" | "failed", error? }` for a receipt and `{ from, text }` for a reply
 * (one object or a list). Gateways differ in wording, so a small adapter in front of this maps theirs to it.
 */
export async function handleSms(db: Db, payload: unknown): Promise<Outcome> {
  const out = fresh();
  const items = Array.isArray(payload) ? payload : [payload];
  for (const it of items as { id?: string; status?: string; error?: string; from?: string; text?: string }[]) {
    if (it?.id && (it.status === "delivered" || it.status === "failed")) await applyReceipt(db, out, it.id, it.status, it.error);
    else if (it?.from && STOP_WORDS.test(it.text ?? "")) await applyStop(db, out, it.from, "sms");
    else out.ignored += 1;
  }
  return out;
}
