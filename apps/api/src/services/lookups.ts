import { and, asc, eq } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { DATED_LOOKUPS, type LookupKind } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

export interface LookupInput {
  name: string;
  code?: string | null | undefined;
  note?: string | null | undefined;
  startsOn?: string | null | undefined;
  endsOn?: string | null | undefined;
  archived?: boolean | undefined;
}

/** One list (brands, fabrics, regions...), archived entries last. */
export async function listLookups(tx: Tx, kind: LookupKind, withArchived: boolean) {
  const company = await resolveCompany(tx);
  const l = tables.lookups;
  const rows = await tx.select().from(l).where(and(eq(l.companyId, company.id), eq(l.kind, kind))).orderBy(asc(l.archived), asc(l.name));
  return withArchived ? rows : rows.filter((r) => !r.archived);
}

/** Entry counts per kind, for the masters overview. */
export async function lookupCounts(tx: Tx) {
  const company = await resolveCompany(tx);
  const rows = await tx.select({ kind: tables.lookups.kind }).from(tables.lookups)
    .where(and(eq(tables.lookups.companyId, company.id), eq(tables.lookups.archived, false)));
  const counts: Record<string, number> = {};
  for (const r of rows) counts[r.kind] = (counts[r.kind] ?? 0) + 1;
  return counts;
}

export async function saveLookup(tx: Tx, actor: Actor, kind: LookupKind, input: LookupInput & { id?: string | undefined }) {
  const company = await resolveCompany(tx);
  const dated = DATED_LOOKUPS.includes(kind);
  if (dated && input.startsOn && input.endsOn && input.endsOn < input.startsOn) throw badRequest("end_before_start");
  const values = {
    name: input.name.trim(),
    ...(input.code !== undefined ? { code: input.code ? input.code.trim().toUpperCase() : null } : {}),
    ...(input.note !== undefined ? { note: input.note || null } : {}),
    ...(dated && input.startsOn !== undefined ? { startsOn: input.startsOn || null } : {}),
    ...(dated && input.endsOn !== undefined ? { endsOn: input.endsOn || null } : {}),
    ...(input.archived !== undefined ? { archived: input.archived } : {}),
  };
  const l = tables.lookups;
  const taken = (e: { cause?: { code?: string } }) => { if (e?.cause?.code === "23505") throw badRequest("lookup_taken"); throw e; };
  const [row] = input.id
    ? await tx.update(l).set(values).where(and(eq(l.id, input.id), eq(l.companyId, company.id), eq(l.kind, kind))).returning().catch(taken)
    : await tx.insert(l).values({ tenantId: actor.tenantId, companyId: company.id, kind, ...values }).returning().catch(taken);
  if (!row) throw notFound();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: input.id ? "update" : "create", entity: `lookup.${kind}`, entityId: row.id, after: values, ip: actor.ip ?? null });
  return row;
}
