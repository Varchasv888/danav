import { createHash } from "node:crypto";
import { sql } from "drizzle-orm";
import type { Tx } from "@varchasv/db";
import { businessDate, dec, toCsv } from "@varchasv/domain";
import { unzip, zip, type ZipFile } from "../lib/zip.js";

/** Tables that only hold login or integration secrets, and columns that are secrets wherever they appear. */
const SKIP_TABLES = new Set(["gst_sessions", "invitations", "sessions", "password_resets"]);
const SECRET_COLUMN = /password|secret|token|credential|_enc$|api_key/i;

const q = (name: string) => `"${name.replace(/"/g, '""')}"`;
const sha = (b: Buffer | string) => createHash("sha256").update(b).digest("hex");
const cell = (v: unknown): string | number | null => {
  if (v === null || v === undefined) return null;
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "object") return JSON.stringify(v);
  if (typeof v === "boolean") return v ? "true" : "false";
  return typeof v === "number" ? v : String(v);
};
const safeName = (s: string) => s.replace(/[^\w.\- ]+/g, "_").slice(0, 80) || "file";

export interface ExportResult { filename: string; data: Buffer; tables: number; rows: number }

/**
 * Everything the business owns, in open formats: each table as CSV and JSON, uploaded files as they were,
 * a README that says what is in the box and a manifest with a checksum of every file. Row-level security
 * keeps it to this business; passwords, tokens and integration sessions are left out.
 */
export async function businessExport(tx: Tx, businessName: string, now = new Date()): Promise<ExportResult> {
  const cols = await tx.execute<{ table_name: string; column_name: string; data_type: string }>(sql`
    select table_name, column_name, data_type from information_schema.columns
    where table_schema = 'public' and table_name in (select table_name from information_schema.columns where table_schema = 'public' and column_name = 'tenant_id')
    order by table_name, ordinal_position`);
  const byTable = new Map<string, string[]>();
  for (const c of cols) {
    if (SKIP_TABLES.has(c.table_name) || SECRET_COLUMN.test(c.column_name) || c.data_type === "bytea") continue;
    const list = byTable.get(c.table_name);
    if (list) list.push(c.column_name);
    else byTable.set(c.table_name, [c.column_name]);
  }

  const files: ZipFile[] = [];
  const summary: { table: string; rows: number; columns: string[] }[] = [];
  for (const [table, columns] of byTable) {
    const rows = [...(await tx.execute<Record<string, unknown>>(sql.raw(`select ${columns.map(q).join(", ")} from ${q(table)}`)))];
    summary.push({ table, rows: rows.length, columns });
    files.push({ name: `csv/${table}.csv`, data: Buffer.from("﻿" + toCsv([columns, ...rows.map((r) => columns.map((c) => cell(r[c])))]), "utf8") });
    files.push({ name: `json/${table}.json`, data: Buffer.from(JSON.stringify(rows, null, 1), "utf8") });
  }

  const uploads = await tx.execute<{ id: string; name: string; data: Buffer }>(sql`select id::text, name, data from files order by created_at`);
  for (const u of uploads) files.push({ name: `files/${u.id}-${safeName(u.name)}`, data: Buffer.from(u.data) });

  const total = summary.reduce((s, t) => s + t.rows, 0);
  const readme = [
    `${businessName}: full data export`,
    `Made on ${businessDate(now)} from Varchasv ERP Systems.`,
    "",
    "What is inside",
    "  csv/    one file per table, opens in Excel (UTF-8). A text value that starts with = + - or @ has an apostrophe added in front so it cannot run as a formula; use the JSON copy when you need the exact value.",
    "  json/   the same tables, exact values, one array of rows per file.",
    "  files/  every document you uploaded, as it was, named <id>-<name>.",
    "  manifest.json  the SHA-256 checksum of every file, so you can tell later whether anything changed.",
    "",
    "Formats",
    "  Dates are YYYY-MM-DD, times are ISO 8601 in UTC. Money and quantities are decimal numbers written as text, in rupees and the item's own unit.",
    "  Columns ending in _id point to the id column of another table (company_id to companies, and so on).",
    "",
    "Left out on purpose: passwords, login and share tokens, and tax-portal sessions.",
    "",
    `Tables (${summary.length}) and rows (${total})`,
    ...summary.map((t) => `  ${t.table}: ${t.rows} rows; columns: ${t.columns.join(", ")}`),
    "",
  ].join("\r\n");
  files.unshift({ name: "README.txt", data: Buffer.from(readme, "utf8") });
  files.push({
    name: "manifest.json",
    data: Buffer.from(JSON.stringify({ business: businessName, madeOn: businessDate(now), tables: summary.map(({ table, rows }) => ({ table, rows })), files: files.map((f) => ({ name: f.name, bytes: f.data.length, sha256: sha(f.data) })) }, null, 1), "utf8"),
  });

  return { filename: `varchasv-export-${businessDate(now)}.zip`, data: zip(files, now), tables: summary.length, rows: total };
}

export interface BackupCheck {
  ok: boolean; business: string; madeOn: string; tables: number; rows: number; files: number; problems: string[];
  /** Ledger totals found in the copy; null when the copy holds no ledger table. */
  books: { entries: number; debit: string; credit: string; balanced: boolean } | null;
}

/**
 * The restore drill: open a backup with its passphrase and check it is whole, without touching the database. Every file the
 * manifest lists must be present with the checksum it was written with, and nothing may be in the archive that is not listed.
 */
export function verifyBackup(archive: Buffer): BackupCheck {
  const files = unzip(archive);
  const byName = new Map(files.map((f) => [f.name, f.data]));
  const manifestFile = byName.get("manifest.json");
  if (!manifestFile) return { ok: false, business: "", madeOn: "", tables: 0, rows: 0, files: files.length, problems: ["manifest.json is missing"], books: null };
  const m = JSON.parse(manifestFile.toString("utf8")) as { business: string; madeOn: string; tables: { table: string; rows: number }[]; files: { name: string; bytes: number; sha256: string }[] };
  const problems: string[] = [];
  for (const f of m.files) {
    const data = byName.get(f.name);
    if (!data) problems.push(`${f.name} is missing`);
    else if (data.length !== f.bytes || sha(data) !== f.sha256) problems.push(`${f.name} does not match its checksum`);
  }
  const listed = new Set(m.files.map((f) => f.name));
  for (const f of files) if (f.name !== "manifest.json" && !listed.has(f.name)) problems.push(`${f.name} is not in the manifest`);
  for (const t of m.tables) {
    const json = byName.get(`json/${t.table}.json`);
    if (json && (JSON.parse(json.toString("utf8")) as unknown[]).length !== t.rows) problems.push(`json/${t.table}.json has a different number of rows than the manifest`);
  }
  // The books in the copy must balance: total debits equal total credits across every ledger entry, the test a restored business has to pass.
  let books: BackupCheck["books"] = null;
  const gl = byName.get("json/gl_entries.json");
  if (gl) {
    const entries = JSON.parse(gl.toString("utf8")) as { debit: string; credit: string }[];
    const debit = entries.reduce((t, e) => t.plus(e.debit), dec(0));
    const credit = entries.reduce((t, e) => t.plus(e.credit), dec(0));
    books = { entries: entries.length, debit: debit.toFixed(2), credit: credit.toFixed(2), balanced: debit.eq(credit) };
    if (!books.balanced) problems.push("the ledger entries do not balance (debits and credits differ)");
  }
  return { ok: problems.length === 0, business: m.business, madeOn: m.madeOn, tables: m.tables.length, rows: m.tables.reduce((s, t) => s + t.rows, 0), files: m.files.length, problems: problems.slice(0, 20), books };
}
