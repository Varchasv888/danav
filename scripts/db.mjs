#!/usr/bin/env node
/**
 * Database backup, restore and a restore drill, for the Postgres in docker-compose.
 *
 *   npm run db:backup                       # backups/varchasv-<timestamp>.dump (pg_dump custom format)
 *   npm run db:restore -- backups/x.dump    # replaces the varchasv database with the backup (asks first)
 *   npm run db:drill                        # backup → restore into a scratch database → compare → drop
 *
 * The tools run inside the postgres container, so nothing needs installing on the host. For a managed
 * database in production, run the same pg_dump / pg_restore commands against DATABASE_OWNER_URL, and
 * keep the provider's point-in-time recovery switched on as well.
 */
import { spawn } from "node:child_process";
import { createReadStream, createWriteStream, mkdirSync, statSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DB = "varchasv";
const USER = "varchasv_owner";

/** Runs a command in the postgres container; stdin/stdout can be streamed for dumps. */
function pg(args, { input, output } = {}) {
  return new Promise((ok, fail) => {
    const p = spawn("docker", ["compose", "exec", "-T", "postgres", ...args], { cwd: root, stdio: [input ? "pipe" : "ignore", output ? "pipe" : "pipe", "pipe"] });
    let out = "";
    let err = "";
    if (output) p.stdout.pipe(output);
    else p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (err += d));
    if (input) input.pipe(p.stdin);
    p.on("error", fail);
    p.on("close", (code) => (code === 0 ? ok(out) : fail(new Error(`${args.join(" ")} failed (${code}): ${err.trim()}`))));
  });
}
const psql = (db, query) => pg(["psql", "-U", USER, "-d", db, "-At", "-v", "ON_ERROR_STOP=1", "-c", query]);

async function backup() {
  mkdirSync(resolve(root, "backups"), { recursive: true });
  const file = resolve(root, "backups", `varchasv-${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}.dump`);
  const out = createWriteStream(file);
  await pg(["pg_dump", "-U", USER, "-d", DB, "-Fc", "--no-password"], { output: out });
  await new Promise((r) => out.end(r));
  console.log(`backup written: ${file} (${(statSync(file).size / 1024 / 1024).toFixed(1)} MB)`);
  return file;
}

async function restoreInto(file, db) {
  await psql("postgres", `drop database if exists ${db} with (force)`);
  await psql("postgres", `create database ${db} owner ${USER}`);
  await psql("postgres", `grant connect on database ${db} to varchasv_app`);
  await pg(["pg_restore", "-U", USER, "-d", db, "--no-owner", "--role", USER, "--exit-on-error"], { input: createReadStream(file) });
}

/** Facts that must survive a backup: row counts, balanced books, the append-only audit trail's guard. */
async function facts(db) {
  const tables = ["tenants", "users", "accounts", "vouchers", "gl_entries", "sales_invoices", "purchase_bills", "stock_ledger", "employees", "payslips", "audit_log"];
  const counts = await psql(db, tables.map((t) => `select '${t}', count(*) from ${t}`).join(" union all "));
  const books = await psql(db, "select coalesce(sum(debit),0) = coalesce(sum(credit),0) from gl_entries");
  const rls = await psql(db, "select count(*) from pg_tables where schemaname = 'public' and rowsecurity");
  const guard = await psql(db, "select count(*) from pg_trigger where not tgisinternal and tgrelid = 'audit_log'::regclass");
  return { counts: counts.trim(), balanced: books.trim(), rlsTables: rls.trim(), auditTriggers: guard.trim() };
}

const [cmd, arg] = process.argv.slice(2);
if (cmd === "backup") {
  await backup();
} else if (cmd === "restore") {
  if (!arg) throw new Error("usage: npm run db:restore -- backups/<file>.dump");
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(`This replaces the "${DB}" database with ${arg}. Type the word restore to continue: `);
  rl.close();
  if (answer.trim() !== "restore") process.exit(1);
  await restoreInto(resolve(arg), DB);
  console.log("restored. Restart the API so it reconnects.");
} else if (cmd === "drill") {
  const started = Date.now();
  const file = await backup();
  await restoreInto(file, "varchasv_drill");
  const [live, restored] = [await facts(DB), await facts("varchasv_drill")];
  await psql("postgres", "drop database varchasv_drill with (force)");
  const same = JSON.stringify(live) === JSON.stringify(restored);
  console.log(restored.counts.split("\n").map((l) => `  ${l.replace("|", ": ")}`).join("\n"));
  console.log(`  books balanced: ${restored.balanced === "t" ? "yes" : "NO"} · tables with row-level security: ${restored.rlsTables} · audit-log guards: ${restored.auditTriggers}`);
  console.log(same ? `drill passed in ${((Date.now() - started) / 1000).toFixed(1)}s: the restored copy matches the live database.` : "DRILL FAILED: the restored copy differs from the live database.");
  if (!same) {
    console.log({ live, restored });
    process.exit(1);
  }
} else {
  console.log("usage: node scripts/db.mjs backup | restore <file> | drill");
  process.exit(1);
}
