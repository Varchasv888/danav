import { and, asc, eq, inArray } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";
import { stockPositions } from "./inventory.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

/** Every sellable item with its stock in one warehouse and the limits set for it there. */
export async function listStockLimits(tx: Tx, warehouseId: string, asOf: string) {
  const company = await resolveCompany(tx);
  const [wh] = await tx.select({ id: tables.warehouses.id }).from(tables.warehouses)
    .where(and(eq(tables.warehouses.id, warehouseId), eq(tables.warehouses.companyId, company.id)));
  if (!wh) throw notFound();
  const it = tables.items;
  const [items, limits, positions] = await Promise.all([
    tx.select({ id: it.id, name: it.name, sku: it.sku, size: it.size, color: it.color }).from(it)
      .where(and(eq(it.companyId, company.id), eq(it.archived, false), eq(it.kind, "goods"), eq(it.isPack, false))).orderBy(asc(it.name)),
    tx.select().from(tables.stockLimits).where(and(eq(tables.stockLimits.companyId, company.id), eq(tables.stockLimits.warehouseId, warehouseId))),
    stockPositions(tx, company, asOf, { warehouseId }),
  ]);
  const limitOf = new Map(limits.map((l) => [l.itemId, l]));
  const qtyOf = new Map(positions.map((p) => [p.itemId, p.qty]));
  return items.map((i) => {
    const l = limitOf.get(i.id);
    const qty = qtyOf.get(i.id) ?? "0";
    const min = l?.minQty ?? "0";
    const max = l?.maxQty ?? "0";
    return { ...i, qty, minQty: min, maxQty: max, below: dec(min).gt(0) && dec(qty).lt(min) };
  });
}

export interface LimitInput { itemId: string; minQty: string; maxQty: string }

/** Save the limits that changed. A row with both at zero is removed, so the table only holds real limits. */
export async function saveStockLimits(tx: Tx, actor: Actor, warehouseId: string, rows: LimitInput[]) {
  const company = await resolveCompany(tx);
  const [wh] = await tx.select({ id: tables.warehouses.id }).from(tables.warehouses)
    .where(and(eq(tables.warehouses.id, warehouseId), eq(tables.warehouses.companyId, company.id)));
  if (!wh) throw notFound();
  for (const r of rows) {
    if (dec(r.maxQty).gt(0) && dec(r.maxQty).lt(r.minQty)) throw badRequest("max_below_min");
  }
  const owned = rows.length
    ? await tx.select({ id: tables.items.id }).from(tables.items).where(and(eq(tables.items.companyId, company.id), inArray(tables.items.id, rows.map((r) => r.itemId))))
    : [];
  if (owned.length !== new Set(rows.map((r) => r.itemId)).size) throw notFound();
  const l = tables.stockLimits;
  let saved = 0;
  for (const r of rows) {
    if (dec(r.minQty).isZero() && dec(r.maxQty).isZero()) {
      await tx.delete(l).where(and(eq(l.itemId, r.itemId), eq(l.warehouseId, warehouseId)));
    } else {
      await tx.insert(l).values({ tenantId: actor.tenantId, companyId: company.id, itemId: r.itemId, warehouseId, minQty: r.minQty, maxQty: r.maxQty })
        .onConflictDoUpdate({ target: [l.itemId, l.warehouseId], set: { minQty: r.minQty, maxQty: r.maxQty, updatedAt: new Date() } });
    }
    saved++;
  }
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "stock_limits", entityId: warehouseId, after: { rows: saved }, ip: actor.ip ?? null });
  return { saved };
}
