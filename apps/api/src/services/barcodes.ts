import { and, eq, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

export const ALIAS_KINDS = ["supplier", "alternate", "merged"] as const;
export type AliasKind = (typeof ALIAS_KINDS)[number];

/** The item a scanned or typed code belongs to: its own barcode, its SKU, or any code it answers to. */
export async function itemByCode(tx: Tx, companyId: string, raw: string) {
  const code = raw.trim();
  if (!code) return null;
  const [own] = await tx.select({ id: tables.items.id }).from(tables.items)
    .where(and(eq(tables.items.companyId, companyId), sql`(${tables.items.barcode} = ${code} or upper(${tables.items.sku}) = ${code.toUpperCase()} or upper(${tables.items.shortCode}) = ${code.toUpperCase()})`)).limit(1);
  if (own) return own.id;
  const [alias] = await tx.select({ id: tables.itemBarcodes.itemId }).from(tables.itemBarcodes)
    .where(and(eq(tables.itemBarcodes.companyId, companyId), eq(tables.itemBarcodes.code, code))).limit(1);
  return alias?.id ?? null;
}

export async function listAliases(tx: Tx, itemId: string) {
  const rows = await tx.select({ a: tables.itemBarcodes, supplier: tables.accounts.name }).from(tables.itemBarcodes)
    .leftJoin(tables.accounts, eq(tables.accounts.id, tables.itemBarcodes.supplierId)).where(eq(tables.itemBarcodes.itemId, itemId)).orderBy(tables.itemBarcodes.createdAt);
  return rows.map((r) => ({ id: r.a.id, code: r.a.code, kind: r.a.kind, supplierId: r.a.supplierId, supplier: r.supplier }));
}

/** Gives an item another code. A code can belong to one item only, whether it is a barcode, a SKU or an alias. */
export async function addAlias(tx: Tx, actor: Actor, itemId: string, input: { code: string; kind: AliasKind; supplierId?: string | null | undefined }) {
  const code = input.code.trim();
  if (!/^[\x21-\x7e]{1,40}$/.test(code)) throw badRequest("invalid_code");
  const [item] = await tx.select().from(tables.items).where(eq(tables.items.id, itemId));
  if (!item) throw notFound();
  const holder = await itemByCode(tx, item.companyId, code);
  if (holder) throw conflict(holder === itemId ? "code_already_on_item" : "code_in_use");
  if (input.supplierId) {
    const [s] = await tx.select({ id: tables.accounts.id }).from(tables.accounts).where(and(eq(tables.accounts.id, input.supplierId), eq(tables.accounts.companyId, item.companyId)));
    if (!s) throw badRequest("unknown_supplier");
  }
  const [row] = await tx.insert(tables.itemBarcodes).values({ tenantId: actor.tenantId, companyId: item.companyId, itemId, code, kind: input.kind, supplierId: input.supplierId ?? null }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "item_barcode", entityId: row!.id, after: { item: item.name, code, kind: input.kind }, ip: actor.ip });
  return row!;
}

export async function removeAlias(tx: Tx, actor: Actor, id: string) {
  const gone = await tx.delete(tables.itemBarcodes).where(eq(tables.itemBarcodes.id, id)).returning();
  if (!gone.length) throw notFound();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "delete", entity: "item_barcode", entityId: id, before: { code: gone[0]!.code }, ip: actor.ip });
}
