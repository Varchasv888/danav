import { and, asc, eq, ilike, or } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { HSN_STANDARD, checkHsn } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

export interface HsnInput { code: string; description: string; kind?: "goods" | "service" | undefined; gstRate?: string | null | undefined; archived?: boolean | undefined }

/** The business's codes, by number; archived ones only when asked for. A search matches the number or the words. */
export async function listHsn(tx: Tx, q: { search?: string | undefined; all?: boolean | undefined }) {
  const company = await resolveCompany(tx);
  const h = tables.hsnCodes;
  const like = q.search ? `%${q.search.trim()}%` : null;
  return tx.select().from(h).where(and(
    eq(h.companyId, company.id), q.all ? undefined : eq(h.archived, false),
    like ? or(ilike(h.code, like), ilike(h.description, like)) : undefined,
  )).orderBy(asc(h.code)).limit(1000);
}

export async function saveHsn(tx: Tx, actor: Actor, input: HsnInput, id?: string) {
  const company = await resolveCompany(tx);
  const h = tables.hsnCodes;
  const code = input.code.trim();
  if (checkHsn(code, input.kind ?? "goods")) throw badRequest("invalid_hsn");
  const values = {
    code, description: input.description.trim(), ...(input.kind ? { kind: input.kind } : {}),
    ...(input.gstRate !== undefined ? { gstRate: input.gstRate } : {}), ...(input.archived !== undefined ? { archived: input.archived } : {}),
  };
  const taken = (e: { cause?: { code?: string } }): never => { if (e?.cause?.code === "23505") throw badRequest("hsn_taken"); throw e; };
  const [row] = id
    ? await tx.update(h).set(values).where(and(eq(h.id, id), eq(h.companyId, company.id))).returning().catch(taken)
    : await tx.insert(h).values({ ...values, tenantId: actor.tenantId, companyId: company.id }).returning().catch(taken);
  if (!row) throw notFound();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: id ? "update" : "create", entity: "hsn_code", entityId: row.id, after: values, ip: actor.ip ?? null });
  return row;
}

/** Adds the standard apparel, fabric, footwear and service codes the business does not have yet; never touches existing ones. */
export async function seedStandardHsn(tx: Tx, actor: Actor) {
  const company = await resolveCompany(tx);
  const added = await tx.insert(tables.hsnCodes)
    .values(HSN_STANDARD.map((e) => ({ tenantId: actor.tenantId, companyId: company.id, code: e.code, description: e.description, kind: e.kind })))
    .onConflictDoNothing().returning({ id: tables.hsnCodes.id });
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "hsn_code", after: { standard: added.length }, ip: actor.ip ?? null });
  return { added: added.length, total: HSN_STANDARD.length };
}
