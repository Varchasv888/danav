import { tables, type Tx } from "@varchasv/db";
import { requestContext } from "./requestcontext.js";

export interface AuditEntry {
  tenantId: string;
  userId: string | null;
  action: string; // "create" | "update" | "login" | ...
  entity: string; // "company" | "branch" | ...
  entityId?: string | null;
  before?: unknown;
  after?: unknown;
  ip?: string | null;
}

/** Write one audit row inside the caller's tenant transaction, so it commits or rolls back with the change. */
export async function audit(tx: Tx, e: AuditEntry) {
  await tx.insert(tables.auditLog).values({
    tenantId: e.tenantId,
    userId: e.userId,
    action: e.action,
    entity: e.entity,
    entityId: e.entityId ?? null,
    before: e.before ?? null,
    after: e.after ?? null,
    ip: e.ip ?? null,
    requestId: requestContext.getStore()?.requestId ?? null,
  });
}

/** Only the fields that changed, for compact before/after records. */
export function diff<T extends Record<string, unknown>>(before: T, patch: Partial<T>) {
  const b: Record<string, unknown> = {};
  const a: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(patch)) {
    if (v !== undefined && JSON.stringify(before[k]) !== JSON.stringify(v)) {
      b[k] = before[k];
      a[k] = v;
    }
  }
  return { before: b, after: a, changed: Object.keys(a).length > 0 };
}
