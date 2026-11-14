import { createHash } from "node:crypto";
import { desc, eq, sql } from "drizzle-orm";
import { tables, withTenant, type Db, type Tx } from "@varchasv/db";
import { nextRun } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { encryptBackup } from "../lib/backupcrypt.js";
import { badRequest } from "../lib/errors.js";
import type { Mailer } from "../lib/mailer.js";
import { decryptSecret, encryptSecret } from "../lib/secrets.js";
import { businessExport, verifyBackup } from "./export.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

/** Larger than this and email providers refuse the message: the run is recorded as failed so it is not mistaken for a safe copy. */
export const MAX_EMAIL_BYTES = 15 * 1024 * 1024;
const FREQUENCIES = ["daily", "weekly"] as const;
type Frequency = (typeof FREQUENCIES)[number];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const schedule = (s: { frequency: string; hour: number; weekday: number }) => ({ frequency: s.frequency as Frequency, hour: s.hour, weekday: s.weekday });

export interface BackupSettingsInput { enabled: boolean; frequency: Frequency; hour: number; weekday: number; recipients: string[]; passphrase?: string | undefined }

export async function getBackupSettings(tx: Tx, now = new Date()) {
  const [s] = await tx.select().from(tables.backupSettings);
  const runs = await tx.select().from(tables.backupRuns).orderBy(desc(tables.backupRuns.startedAt)).limit(10);
  const base = s ?? { enabled: false, frequency: "weekly", hour: 2, weekday: 0, recipients: [] as string[], passphraseEnc: null, nextRunAt: null, lastRunAt: null, lastOkAt: null, lastError: null };
  // Overdue: switched on, and no good copy for two cycles.
  const cycle = base.frequency === "daily" ? 86_400_000 : 7 * 86_400_000;
  const since = base.lastOkAt ?? (base.nextRunAt ? new Date(base.nextRunAt.getTime() - cycle) : null);
  const overdue = base.enabled && !!since && now.getTime() - since.getTime() > 2 * cycle;
  return {
    enabled: base.enabled, frequency: base.frequency as Frequency, hour: base.hour, weekday: base.weekday, recipients: base.recipients, hasPassphrase: !!base.passphraseEnc,
    nextRunAt: base.nextRunAt, lastRunAt: base.lastRunAt, lastOkAt: base.lastOkAt, lastError: base.lastError, overdue,
    runs: runs.map((r) => ({ id: r.id, startedAt: r.startedAt, trigger: r.trigger, status: r.status, filename: r.filename, bytes: r.bytes, tables: r.tableCount, rows: r.rowCount, sha256: r.sha256, sentTo: r.sentTo, error: r.error })),
  };
}

export async function saveBackupSettings(tx: Tx, actor: Actor, input: BackupSettingsInput, now = new Date()) {
  if (!(FREQUENCIES as readonly string[]).includes(input.frequency)) throw badRequest("invalid_frequency");
  if (!Number.isInteger(input.hour) || input.hour < 0 || input.hour > 23 || !Number.isInteger(input.weekday) || input.weekday < 0 || input.weekday > 6) throw badRequest("invalid_schedule");
  const recipients = [...new Set(input.recipients.map((r) => r.trim().toLowerCase()).filter(Boolean))];
  if (recipients.length > 5 || recipients.some((r) => !EMAIL.test(r))) throw badRequest("invalid_recipients");
  const [existing] = await tx.select().from(tables.backupSettings);
  if (input.enabled) {
    if (!recipients.length) throw badRequest("recipients_required");
    if (!input.passphrase && !existing?.passphraseEnc) throw badRequest("passphrase_required");
  }
  if (input.passphrase !== undefined && input.passphrase.length < 12) throw badRequest("passphrase_short");
  const values = {
    enabled: input.enabled, frequency: input.frequency, hour: input.hour, weekday: input.weekday, recipients,
    ...(input.passphrase ? { passphraseEnc: encryptSecret(input.passphrase) } : {}),
    nextRunAt: input.enabled ? nextRun(schedule(input), now) : null,
  };
  if (existing) await tx.update(tables.backupSettings).set(values).where(eq(tables.backupSettings.tenantId, actor.tenantId));
  else await tx.insert(tables.backupSettings).values({ tenantId: actor.tenantId, ...values });
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "backup_settings", after: { enabled: input.enabled, frequency: input.frequency, recipients: recipients.length, passphraseChanged: !!input.passphrase }, ip: actor.ip });
}

/**
 * Makes the encrypted copy, checks it opens and balances, and emails it. A copy that cannot be emailed, or does not check out, is
 * recorded as failed and the people named are told, so a silent gap in backups cannot build up.
 */
export async function runBackup(db: Db, tenantId: string, trigger: "schedule" | "manual", mailer: Mailer, now = new Date()) {
  return withTenant(db, tenantId, async (tx) => {
    const [s] = await tx.select().from(tables.backupSettings).for("update");
    if (!s?.passphraseEnc || !s.recipients.length) throw badRequest("backup_not_set_up");
    const [tenant] = await tx.select({ name: tables.tenants.name }).from(tables.tenants).where(eq(tables.tenants.id, tenantId));
    const business = tenant?.name ?? "Business";
    let outcome: { filename: string; bytes: number; tableCount: number; rowCount: number; sha256: string } | null = null;
    let error: string | null = null;
    try {
      const made = await businessExport(tx, business, now);
      const check = verifyBackup(made.data);
      if (!check.ok) throw new Error(`copy_not_whole: ${check.problems[0] ?? ""}`);
      const sealed = encryptBackup(made.data, decryptSecret(s.passphraseEnc));
      const filename = made.filename.replace(/\.zip$/, ".vbk");
      if (sealed.length > MAX_EMAIL_BYTES) throw new Error("too_large_to_email");
      const attachment = { filename, contentType: "application/octet-stream", content: sealed.toString("base64"), encoding: "base64" as const };
      for (const to of s.recipients) {
        await mailer.send({
          to, subject: `${business}: backup of ${filename.slice(16, 26)}`,
          text: [`The scheduled backup of ${business} is attached (${(sealed.length / 1024).toFixed(0)} KB, ${made.tables} tables, ${made.rows} rows).`, "",
            "It is locked with the backup passphrase set in Varchasv. Keep this email, or save the file somewhere safe. You will need the passphrase to open it.", "", "Varchasv ERP Systems"].join("\n"),
          attachments: [attachment],
        });
      }
      outcome = { filename, bytes: sealed.length, tableCount: made.tables, rowCount: made.rows, sha256: createHash("sha256").update(sealed).digest("hex") };
    } catch (e) {
      error = ((e as Error).message || "backup_failed").slice(0, 190);
    }
    await tx.insert(tables.backupRuns).values({
      tenantId, startedAt: now, trigger, status: outcome ? "ok" : "failed", filename: outcome?.filename ?? null, bytes: outcome?.bytes ?? null, tableCount: outcome?.tableCount ?? null,
      rowCount: outcome?.rowCount ?? null, sha256: outcome?.sha256 ?? null, sentTo: outcome ? s.recipients : [], error,
    });
    await tx.update(tables.backupSettings).set({
      lastRunAt: now, ...(outcome ? { lastOkAt: now, lastError: null } : { lastError: error }),
      nextRunAt: s.enabled ? nextRun(schedule(s), now) : null,
    }).where(eq(tables.backupSettings.tenantId, tenantId));
    if (error) {
      for (const to of s.recipients) {
        try {
          await mailer.send({ to, subject: `${business}: backup failed`, text: `The ${trigger === "schedule" ? "scheduled " : ""}backup of ${business} did not complete (${error}).\n\nOpen Settings, Backup in Varchasv to see the details and download a copy by hand.\n\nVarchasv ERP Systems` });
        } catch { /* the failure is already on record; a second failure to send changes nothing */ }
      }
    }
    await audit(tx, { tenantId, userId: null, action: "export", entity: "business_backup", after: { trigger, ok: !error, bytes: outcome?.bytes ?? null, error }, ip: undefined });
    return { ok: !error, error, filename: outcome?.filename ?? null, bytes: outcome?.bytes ?? null };
  });
}

/** Runs every backup that has come due; one business failing does not stop the others. */
export async function runDueBackups(db: Db, mailer: Mailer, now = new Date()) {
  const due = await db.execute<{ tenant_id: string }>(sql`select tenant_id from due_backups(${now.toISOString()}::timestamptz)`);
  let done = 0;
  for (const { tenant_id } of due) {
    try { await runBackup(db, tenant_id, "schedule", mailer, now); done += 1; } catch { /* set up wrongly: left for the owner to see on the backup page */ }
  }
  return done;
}
