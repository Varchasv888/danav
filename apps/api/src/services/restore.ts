import { randomUUID } from "node:crypto";
import { sql } from "drizzle-orm";
import { tables, type Db } from "@varchasv/db";
import { businessDate } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest } from "../lib/errors.js";
import { unzip } from "../lib/zip.js";
import { verifyBackup } from "./export.js";

/**
 * Tables a test restore leaves out. Some tie to hardware or to the audit chain of the original (devices, punches, the audit log); some could
 * act on their own in the copy and must not: queued messages, scheduled reports and changes, scheduled backups. Access is made fresh.
 */
const SKIP = new Set([
  "memberships", "audit_log", "devices", "attendance_devices", "attendance_punches", "sync_rejections", "comm_outbox", "scheduled_changes", "saved_reports",
  "backup_settings", "backup_runs", "sync_changes", "gst_sessions", "invitations", "sessions", "password_resets",
]);

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const q = (name: string) => `"${name.replace(/"/g, '""')}"`;

export interface RestoreReport {
  tenantId: string; name: string; tables: number; rows: number; skipped: string[];
  /** Per table: rows in the backup and rows now in the copy. */
  counts: { table: string; backup: number; restored: number }[];
  books: { backupDebit: string; restoredDebit: string; backupCredit: string; restoredCredit: string; matches: boolean };
  problems: string[];
}

function remap(value: unknown, ids: Map<string, string>): unknown {
  if (typeof value === "string") return UUID.test(value) ? (ids.get(value.toLowerCase()) ?? value) : value;
  if (Array.isArray(value)) return value.map((v) => remap(v, ids));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, remap(v, ids)]));
  return value;
}

/**
 * Restores a backup as a new, separate business, to prove it can be done and to look at the data as it was: every id is made new (and every
 * reference to it changed to match), the tables go in the order their references allow, and the copy is checked against the backup row by row
 * and by the totals of its ledger. The original is never touched. The person who asks becomes the owner of the copy.
 */
export async function restoreAsTestBusiness(db: Db, userId: string, archive: Buffer): Promise<RestoreReport> {
  const check = verifyBackup(archive);
  if (!check.ok) throw badRequest("backup_damaged");
  const files = unzip(archive);
  const byName = new Map(files.map((f) => [f.name, f.data]));
  const data = new Map<string, Record<string, unknown>[]>();
  for (const f of files) {
    const m = /^json\/(.+)\.json$/.exec(f.name);
    if (m) data.set(m[1]!, JSON.parse(f.data.toString("utf8")) as Record<string, unknown>[]);
  }
  const tenantId = randomUUID();
  const name = `${check.business} (restore test ${businessDate()})`;

  return db.transaction(async (tx) => {
    await tx.execute(sql`select set_config('app.tenant_id', ${tenantId}, true)`);
    await tx.insert(tables.tenants).values({ id: tenantId, name });

    // Every id in the backup gets a new one; the old tenant becomes the new one.
    const ids = new Map<string, string>();
    for (const [table, rows] of data) {
      if (SKIP.has(table)) continue;
      for (const r of rows) if (typeof r.id === "string" && UUID.test(r.id)) ids.set(r.id.toLowerCase(), randomUUID());
      void table;
    }
    const oldTenants = new Set<string>();
    for (const rows of data.values()) for (const r of rows) if (typeof r.tenant_id === "string") oldTenants.add(r.tenant_id.toLowerCase());
    for (const o of oldTenants) ids.set(o, tenantId);

    // Columns of each table, which ones fill themselves (serial ids), and which tables refer to which.
    const names = [...data.keys()].filter((t) => !SKIP.has(t));
    const cols = await tx.execute<{ table_name: string; column_name: string; column_default: string | null; is_identity: string }>(sql`
      select table_name, column_name, column_default, is_identity from information_schema.columns where table_schema = 'public'`);
    const auto = new Map<string, Set<string>>();
    for (const c of cols) if ((c.column_default ?? "").startsWith("nextval(") || c.is_identity === "YES") auto.set(c.table_name, (auto.get(c.table_name) ?? new Set()).add(c.column_name));
    const edges = await tx.execute<{ child: string; parent: string }>(sql`
      select cl.relname as child, pl.relname as parent from pg_constraint k join pg_class cl on cl.oid = k.conrelid join pg_class pl on pl.oid = k.confrelid
      where k.contype = 'f' and cl.relnamespace = 'public'::regnamespace`);

    const restored: RestoreReport["counts"] = [];
    const problems: string[] = [];
    const lastError = new Map<string, string>();
    let pending = [...names];
    // Parents before children; a table whose parents are not all in yet waits for another round.
    for (let round = 0; round < names.length + 2 && pending.length; round++) {
      const waiting = new Set(pending);
      const ready = pending.filter((t) => !edges.some((e) => e.child === t && e.parent !== t && waiting.has(e.parent)));
      const batch = ready.length ? ready : pending; // a cycle: try them in turn
      for (const table of batch) {
        const rows = data.get(table)!;
        if (!rows.length) { restored.push({ table, backup: 0, restored: 0 }); pending = pending.filter((t) => t !== table); continue; }
        await tx.execute(sql.raw(`savepoint "sp_${table}"`));
        try {
          const keep = Object.keys(rows[0]!).filter((c) => !auto.get(table)?.has(c));
          const made = rows.map((r) => {
            const out: Record<string, unknown> = {};
            for (const c of keep) out[c] = c === "tenant_id" ? tenantId : remap(r[c] === undefined ? null : r[c], ids);
            return out;
          });
          if (table === "files") {
            for (let i = 0; i < rows.length; i++) {
              const old = String(rows[i]!.id);
              const file = [...byName.entries()].find(([n]) => n.startsWith(`files/${old}-`));
              const row = made[i]!;
              const list = Object.keys(row).map(q).join(", ");
              await tx.execute(sql`${sql.raw(`insert into "files" (${list}, "data") select ${list}, `)}${String.fromCharCode(92) + "x" + (file?.[1] ?? Buffer.alloc(0)).toString("hex")}::bytea from jsonb_populate_record(null::"files", ${JSON.stringify(row)}::jsonb)`);
            }
          } else {
            // One statement for the whole table so rows that refer to each other (a merged duplicate, a parent group) check together.
            const list = keep.map(q).join(", ");
            await tx.execute(sql`${sql.raw(`insert into ${q(table)} (${list}) select ${list} from jsonb_populate_recordset(null::${q(table)}, `)}${JSON.stringify(made)}::jsonb)`);
          }
          await tx.execute(sql.raw(`release savepoint "sp_${table}"`));
          restored.push({ table, backup: rows.length, restored: rows.length });
          pending = pending.filter((t) => t !== table);
        } catch (e) {
          await tx.execute(sql.raw(`rollback to savepoint "sp_${table}"`));
          const code = (e as { cause?: { code?: string; message?: string } })?.cause?.code;
          lastError.set(table, ((e as { cause?: { message?: string } }).cause?.message ?? (e as Error).message).slice(0, 200));
          // A reference to a table not in yet: try again after the others. Anything else is a real problem.
          if (code !== "23503" || round >= names.length) { problems.push(`${table}: ${((e as { cause?: { message?: string } }).cause?.message ?? (e as Error).message).slice(0, 160)}`); pending = pending.filter((t) => t !== table); }
        }
      }
    }
    for (const t of pending) problems.push(`${t}: ${lastError.get(t) ?? "could not be restored"}`);

    // The copy's owner: the person who asked, with the owner role that came with the backup.
    const [owner] = await tx.execute<{ id: string }>(sql`select id from roles where key = 'owner' limit 1`);
    if (owner) await tx.insert(tables.memberships).values({ tenantId, userId, roleId: owner.id });
    else problems.push("the backup has no owner role");

    // Check: every table has as many rows as the backup, and the ledger's totals are the same.
    for (const r of restored) {
      const [n] = await tx.execute<{ n: number }>(sql.raw(`select count(*)::int as n from ${q(r.table)}`));
      r.restored = n!.n;
      if (r.restored !== r.backup) problems.push(`${r.table}: ${r.backup} rows in the backup, ${r.restored} in the copy`);
    }
    const gl = data.get("gl_entries") ?? [];
    const sum = (k: "debit" | "credit") => gl.reduce((t, e) => t + Number(e[k] ?? 0), 0);
    const [now] = await tx.execute<{ dr: string; cr: string }>(sql`select coalesce(sum(debit), 0)::text as dr, coalesce(sum(credit), 0)::text as cr from gl_entries`);
    const books = {
      backupDebit: sum("debit").toFixed(2), restoredDebit: Number(now!.dr).toFixed(2), backupCredit: sum("credit").toFixed(2), restoredCredit: Number(now!.cr).toFixed(2), matches: false,
    };
    books.matches = books.backupDebit === books.restoredDebit && books.backupCredit === books.restoredCredit && books.restoredDebit === books.restoredCredit;
    if (!books.matches) problems.push("the ledger totals of the copy differ from the backup");
    await audit(tx, { tenantId, userId, action: "create", entity: "restore_test", entityId: tenantId, after: { from: check.business, tables: restored.length, problems: problems.length } });
    return {
      tenantId, name, tables: restored.length, rows: restored.reduce((s, r) => s + r.restored, 0), skipped: [...SKIP].filter((t) => data.has(t)), counts: restored.sort((a, b) => a.table.localeCompare(b.table)), books, problems,
    };
  });
}
