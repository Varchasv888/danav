import { and, eq, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { audit } from "../lib/audit.js";
import { badRequest, conflict } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

/** The kinds of document the business has numbered so far, each with the date it is locked up to (if any). */
export async function listLocks(tx: Tx) {
  const company = await resolveCompany(tx);
  const kinds = [...await tx.execute<{ doc_type: string; name: string }>(sql`select distinct on (doc_type) doc_type, name from number_series where company_id = ${company.id} order by doc_type, created_at`)];
  const locks = await tx.select().from(tables.processLocks).where(eq(tables.processLocks.companyId, company.id));
  const by = new Map(locks.map((l) => [l.docType, l.lockedUpTo]));
  const known = new Set(kinds.map((k) => k.doc_type));
  return [...kinds.map((k) => ({ docType: k.doc_type, name: k.name, lockedUpTo: by.get(k.doc_type) ?? null })), ...locks.filter((l) => !known.has(l.docType)).map((l) => ({ docType: l.docType, name: l.docType, lockedUpTo: l.lockedUpTo }))]
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Locks one kind of document up to a date, or opens it again (null). */
export async function setLock(tx: Tx, actor: Actor, docType: string, lockedUpTo: string | null) {
  const company = await resolveCompany(tx);
  if (!/^[a-z_]{2,30}$/.test(docType)) throw badRequest("invalid_doc_type");
  if (lockedUpTo === null) await tx.delete(tables.processLocks).where(and(eq(tables.processLocks.companyId, company.id), eq(tables.processLocks.docType, docType)));
  else await tx.insert(tables.processLocks).values({ tenantId: actor.tenantId, companyId: company.id, docType, lockedUpTo, updatedBy: actor.userId })
    .onConflictDoUpdate({ target: [tables.processLocks.companyId, tables.processLocks.docType], set: { lockedUpTo, updatedBy: actor.userId, updatedAt: new Date() } });
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "process_lock", entityId: company.id, after: { docType, lockedUpTo }, ip: actor.ip });
  return listLocks(tx);
}

/** Refuses a document of a locked kind dated on or before its lock date. */
export async function assertProcessOpen(tx: Tx, companyId: string, docType: string, date: string) {
  const [l] = await tx.select({ until: tables.processLocks.lockedUpTo }).from(tables.processLocks).where(and(eq(tables.processLocks.companyId, companyId), eq(tables.processLocks.docType, docType)));
  if (l && date <= l.until) throw conflict("process_locked");
}
