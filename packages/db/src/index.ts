import { sql } from "drizzle-orm";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

export * as schema from "./schema.js";
export { ledgerPostingDefaults, packingBoxes, packingBoxLines, packingBoxEvents, tcsSectionSettings } from "./schema.js";
export { schema as tables };
export type { PackingBoxContents, ReportConfig, SalaryComponent } from "./schema.js";

export type Db = PostgresJsDatabase<typeof schema>;
export type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];

export function createDb(url: string, opts: { max?: number } = {}) {
  // Behind a transaction-mode pooler (Neon's "-pooler" host, PgBouncer) server-side prepared
  // statements don't survive between transactions, so they're turned off there.
  const pooled = /-pooler\.|pgbouncer=true/.test(url);
  const client = postgres(url, { max: opts.max ?? 10, onnotice: () => {}, ...(pooled ? { prepare: false } : {}) });
  const db = drizzle(client, { schema });
  return { db, client, close: () => client.end({ timeout: 5 }) };
}

/**
 * Run `fn` in a transaction scoped to one tenant. Row-level security policies read
 * `app.tenant_id`, so every query inside sees and writes only that tenant's rows.
 * `set_config(..., true)` is transaction-local, so pooled connections never leak a tenant.
 */
export async function withTenant<T>(db: Db, tenantId: string, fn: (tx: Tx) => Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`select set_config('app.tenant_id', ${tenantId}, true)`);
    return fn(tx);
  });
}

/** Tenants a user belongs to. Uses a SECURITY DEFINER function because it runs before a tenant is chosen. */
export async function tenantsForUser(db: Db, userId: string) {
  const rows = await db.execute<{ tenant_id: string; tenant_name: string; role_key: string }>(
    sql`select tenant_id, tenant_name, role_key from user_tenants(${userId})`,
  );
  return rows.map((r) => ({ tenantId: r.tenant_id, name: r.tenant_name, role: r.role_key }));
}
