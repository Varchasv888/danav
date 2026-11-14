import type { FastifyRequest } from "fastify";
import { inArray } from "drizzle-orm";
import { tables, withTenant, type Db } from "@varchasv/db";
import { forbidden } from "../lib/errors.js";

const STORE_KEYS = new Set(["warehouseId", "fromWarehouseId", "toWarehouseId"]);

/**
 * People limited to some stores can only name those stores. Every request is checked for a store anywhere in its body or query (and the store behind
 * a terminal), so the check lives in one place instead of in each screen. Lists the person reads are cut down to their stores where they are built.
 */
export function storeScopeGuard(db: Db) {
  return async (req: FastifyRequest) => {
    const a = req.auth;
    if (!a?.tenantId || !a.warehouseScope) return;
    const allowed = new Set(a.warehouseScope);
    const stores = new Set<string>();
    const terminals = new Set<string>();
    const visit = (o: unknown, depth: number) => {
      if (!o || typeof o !== "object" || depth > 5) return;
      if (Array.isArray(o)) { for (const x of o) visit(x, depth + 1); return; }
      for (const [k, v] of Object.entries(o as Record<string, unknown>)) {
        if (typeof v === "string") {
          if (STORE_KEYS.has(k)) stores.add(v);
          else if (k === "terminalId") terminals.add(v);
        } else visit(v, depth + 1);
      }
    };
    visit(req.body, 0);
    visit(req.query, 0);
    if (terminals.size) {
      const rows = await withTenant(db, a.tenantId, (tx) => tx.select({ w: tables.posTerminals.warehouseId }).from(tables.posTerminals).where(inArray(tables.posTerminals.id, [...terminals].filter((x) => /^[0-9a-f-]{36}$/i.test(x)))));
      for (const r of rows) stores.add(r.w);
    }
    for (const s of stores) if (!allowed.has(s)) throw forbidden("outside_store_scope");
  };
}

/** Keeps only what a store-limited person may see (everything for everyone else). */
export function inScope<T>(req: FastifyRequest, rows: T[], storeOf: (row: T) => string | null): T[] {
  const scope = req.auth?.warehouseScope;
  if (!scope) return rows;
  const allowed = new Set(scope);
  return rows.filter((r) => { const s = storeOf(r); return s !== null && allowed.has(s); });
}

