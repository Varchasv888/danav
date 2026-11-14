#!/usr/bin/env node
/**
 * One-time setup of a hosted Postgres (Neon, Supabase, RDS…) for Varchasv:
 *
 *   OWNER_URL="postgres://<owner>:<password>@<host>/<db>?sslmode=require" node scripts/hosted-db.mjs
 *
 * OWNER_URL is the database owner's *direct* (non-pooled) connection. The script
 *  1. creates the varchasv_app role (no BYPASSRLS, so row-level security always applies) with a new
 *     random password, or gives the existing role a new one;
 *  2. grants it access and enables the extensions the schema needs;
 *  3. runs every migration as the owner;
 *  4. writes APP_DATABASE_URL (the app's pooled connection) and DATABASE_OWNER_URL to
 *     .env.hosted.local, which git ignores. Nothing secret is printed.
 */
import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ownerUrl = process.env.OWNER_URL;
if (!ownerUrl) throw new Error("Set OWNER_URL to the owner's direct connection string");

const sql = postgres(ownerUrl, { max: 1, onnotice: () => {} });
const password = randomBytes(24).toString("base64url");
const [{ db }] = await sql`select current_database() as db`;
const [exists] = await sql`select 1 from pg_roles where rolname = 'varchasv_app'`;
if (exists) await sql.unsafe(`alter role varchasv_app with login password '${password}' nobypassrls`);
else await sql.unsafe(`create role varchasv_app login password '${password}' nosuperuser nobypassrls`);
await sql.unsafe(`grant connect on database "${db}" to varchasv_app`);
await sql`create extension if not exists pgcrypto`;
await sql`create extension if not exists pg_trgm`;
await sql.end();
console.log(`role varchasv_app ready on database "${db}"`);

const migrate = spawnSync("npm", ["run", "db:migrate"], {
  cwd: root, stdio: "inherit", shell: process.platform === "win32", env: { ...process.env, DATABASE_OWNER_URL: ownerUrl },
});
if (migrate.status !== 0) process.exit(migrate.status ?? 1);

// The app goes through the provider's pooler when there is one (Neon: "-pooler" in the host name).
const app = new URL(ownerUrl);
app.username = "varchasv_app";
app.password = password;
if (app.hostname.endsWith(".neon.tech") && !app.hostname.includes("-pooler")) {
  const [first, ...rest] = app.hostname.split(".");
  app.hostname = [`${first}-pooler`, ...rest].join(".");
}
writeFileSync(resolve(root, ".env.hosted.local"), `APP_DATABASE_URL=${app}\nDATABASE_OWNER_URL=${ownerUrl}\n`);
console.log("wrote .env.hosted.local (APP_DATABASE_URL, DATABASE_OWNER_URL). Keep it private.");
