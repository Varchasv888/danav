import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { binDrift, businessDate, dec, missingLines, planPick, scanResult, type Dec } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";
import { itemByCode } from "./barcodes.js";
import { documentNumber, stockPositions } from "./inventory.js";
import { orderReservations } from "./reservations.js";

/**
 * Bins say where pieces sit inside a godown; they are a register of locations, not a second stock ledger. Pick lists turn the
 * stock set aside for an order into a walk through the bins, checked by scanning. Completing a list takes the picked pieces out of
 * their bins; it does not move stock (the challan does that), so a bin can only ever drift above the stock, never move it.
 */
interface Actor { tenantId: string; userId: string; ip?: string | undefined }
const SERIES = { docType: "pick_list", name: "Pick lists", pattern: "PK/{FY}/{SEQ:5}" };

async function stockInWarehouse(tx: Tx, companyId: string, warehouseId: string, itemIds?: string[]): Promise<Map<string, Dec>> {
  const company = await resolveCompany(tx, companyId);
  const rows = await stockPositions(tx, company, businessDate(), { warehouseId, ...(itemIds ? { itemIds } : {}) });
  const m = new Map<string, Dec>();
  for (const r of rows) m.set(r.itemId, (m.get(r.itemId) ?? dec(0)).plus(r.qty));
  return m;
}

async function binsOfWarehouse(tx: Tx, warehouseId: string) {
  return tx.select().from(tables.warehouseBins).where(and(eq(tables.warehouseBins.warehouseId, warehouseId), eq(tables.warehouseBins.archived, false))).orderBy(asc(tables.warehouseBins.code));
}

async function holdingsOf(tx: Tx, binIds: string[]) {
  if (!binIds.length) return [];
  return tx.select({ binId: tables.binStock.binId, itemId: tables.binStock.itemId, qty: tables.binStock.qty, code: tables.warehouseBins.code, name: tables.items.name })
    .from(tables.binStock).innerJoin(tables.warehouseBins, eq(tables.warehouseBins.id, tables.binStock.binId)).innerJoin(tables.items, eq(tables.items.id, tables.binStock.itemId))
    .where(inArray(tables.binStock.binId, binIds));
}

// ---- bins ------------------------------------------------------------------------------------------

export async function createBin(tx: Tx, actor: Actor, b: { warehouseId: string; code: string; note?: string | undefined; companyId?: string | undefined }) {
  const company = await resolveCompany(tx, b.companyId);
  const [w] = await tx.select({ id: tables.warehouses.id }).from(tables.warehouses).where(and(eq(tables.warehouses.id, b.warehouseId), eq(tables.warehouses.companyId, company.id)));
  if (!w) throw badRequest("unknown_warehouse");
  const code = b.code.trim().toUpperCase();
  const [dup] = await tx.select({ id: tables.warehouseBins.id }).from(tables.warehouseBins).where(and(eq(tables.warehouseBins.warehouseId, b.warehouseId), eq(tables.warehouseBins.code, code)));
  if (dup) throw conflict("bin_exists");
  const [row] = await tx.insert(tables.warehouseBins).values({ tenantId: actor.tenantId, companyId: company.id, warehouseId: b.warehouseId, code, note: b.note?.trim() || null }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "warehouse_bin", entityId: row!.id, after: { code }, ip: actor.ip });
  return row!;
}

export async function archiveBin(tx: Tx, actor: Actor, id: string) {
  const [bin] = await tx.select().from(tables.warehouseBins).where(eq(tables.warehouseBins.id, id));
  if (!bin) throw notFound();
  const [held] = await tx.select({ id: tables.binStock.id }).from(tables.binStock).where(eq(tables.binStock.binId, id)).limit(1);
  if (held) throw conflict("bin_not_empty");
  await tx.update(tables.warehouseBins).set({ archived: true }).where(eq(tables.warehouseBins.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "warehouse_bin", entityId: id, after: { archived: true }, ip: actor.ip });
}

/** The godown's bins with what is in each, what is in stock but not yet put in any bin, and any item shelved beyond the stock. */
export async function binOverview(tx: Tx, warehouseId: string) {
  const [w] = await tx.select().from(tables.warehouses).where(eq(tables.warehouses.id, warehouseId));
  if (!w) throw notFound();
  const bins = await binsOfWarehouse(tx, warehouseId);
  const holdings = await holdingsOf(tx, bins.map((b) => b.id));
  const stock = await stockInWarehouse(tx, w.companyId, warehouseId);
  const placed = new Map<string, Dec>();
  for (const h of holdings) placed.set(h.itemId, (placed.get(h.itemId) ?? dec(0)).plus(h.qty));
  const stockedIds = [...stock].filter(([, q]) => q.gt(0)).map(([id]) => id);
  const names = stockedIds.length ? await tx.select({ id: tables.items.id, name: tables.items.name }).from(tables.items).where(inArray(tables.items.id, stockedIds)) : [];
  const unplaced = stockedIds.flatMap((id) => {
    const left = stock.get(id)!.minus(placed.get(id) ?? 0);
    return left.gt(0) ? [{ itemId: id, item: names.find((n) => n.id === id)?.name ?? "", qty: left.toFixed(4) }] : [];
  });
  const drift = binDrift(holdings.map((h) => ({ itemId: h.itemId, qty: h.qty })), new Map([...stock].map(([k, v]) => [k, v.toFixed(4)])))
    .map((d) => ({ ...d, item: holdings.find((h) => h.itemId === d.itemId)?.name ?? "" }));
  return {
    warehouse: { id: w.id, name: w.name },
    bins: bins.map((b) => ({ id: b.id, code: b.code, note: b.note, items: holdings.filter((h) => h.binId === b.id).map((h) => ({ itemId: h.itemId, item: h.name, qty: dec(h.qty).toFixed(4) })) })),
    unplaced, drift,
  };
}

/** Puts pieces away in a bin. Only what the godown holds and no bin has yet can be put away. */
export async function putAway(tx: Tx, actor: Actor, b: { binId: string; itemId: string; qty: string }) {
  const [bin] = await tx.select().from(tables.warehouseBins).where(eq(tables.warehouseBins.id, b.binId));
  if (!bin || bin.archived) throw notFound();
  if (!dec(b.qty).gt(0)) throw badRequest("qty_must_be_positive");
  const stock = (await stockInWarehouse(tx, bin.companyId, bin.warehouseId, [b.itemId])).get(b.itemId) ?? dec(0);
  const [placed] = await tx.select({ q: sql<string>`coalesce(sum(${tables.binStock.qty}), 0)::text` }).from(tables.binStock)
    .innerJoin(tables.warehouseBins, eq(tables.warehouseBins.id, tables.binStock.binId))
    .where(and(eq(tables.warehouseBins.warehouseId, bin.warehouseId), eq(tables.binStock.itemId, b.itemId)));
  if (dec(b.qty).gt(stock.minus(placed?.q ?? 0))) throw badRequest("more_than_unplaced");
  await tx.insert(tables.binStock).values({ tenantId: actor.tenantId, binId: b.binId, itemId: b.itemId, qty: dec(b.qty).toFixed(4) })
    .onConflictDoUpdate({ target: [tables.binStock.binId, tables.binStock.itemId], set: { qty: sql`${tables.binStock.qty} + ${dec(b.qty).toFixed(4)}` } });
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "warehouse_bin", entityId: b.binId, after: { putAway: { itemId: b.itemId, qty: b.qty } }, ip: actor.ip });
}

/** Moves pieces from one bin to another in the same godown. */
export async function moveBetweenBins(tx: Tx, actor: Actor, b: { fromBinId: string; toBinId: string; itemId: string; qty: string }) {
  const bins = await tx.select().from(tables.warehouseBins).where(inArray(tables.warehouseBins.id, [b.fromBinId, b.toBinId]));
  const from = bins.find((x) => x.id === b.fromBinId), to = bins.find((x) => x.id === b.toBinId);
  if (!from || !to || from.id === to.id || to.archived) throw notFound();
  if (from.warehouseId !== to.warehouseId) throw badRequest("different_warehouse");
  const [row] = await tx.select().from(tables.binStock).where(and(eq(tables.binStock.binId, from.id), eq(tables.binStock.itemId, b.itemId))).for("update");
  if (!row || dec(b.qty).gt(row.qty) || !dec(b.qty).gt(0)) throw badRequest("more_than_in_bin");
  const left = dec(row.qty).minus(b.qty);
  if (left.gt(0)) await tx.update(tables.binStock).set({ qty: left.toFixed(4) }).where(eq(tables.binStock.id, row.id));
  else await tx.delete(tables.binStock).where(eq(tables.binStock.id, row.id));
  await tx.insert(tables.binStock).values({ tenantId: actor.tenantId, binId: to.id, itemId: b.itemId, qty: dec(b.qty).toFixed(4) })
    .onConflictDoUpdate({ target: [tables.binStock.binId, tables.binStock.itemId], set: { qty: sql`${tables.binStock.qty} + ${dec(b.qty).toFixed(4)}` } });
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "warehouse_bin", entityId: from.id, after: { moveTo: to.code, itemId: b.itemId, qty: b.qty }, ip: actor.ip });
}

// ---- pick lists --------------------------------------------------------------------------------------

/** Makes a pick list from the stock set aside for the order and not already on another list or already picked and waiting to be sent. */
export async function createPickList(tx: Tx, actor: Actor, b: { orderId: string; warehouseId: string; companyId?: string | undefined }) {
  const company = await resolveCompany(tx, b.companyId);
  const [w] = await tx.select({ id: tables.warehouses.id }).from(tables.warehouses).where(and(eq(tables.warehouses.id, b.warehouseId), eq(tables.warehouses.companyId, company.id)));
  if (!w) throw badRequest("unknown_warehouse");
  const res = await orderReservations(tx, b.orderId);
  if (res.status !== "open" && res.status !== "partial") throw conflict("order_not_open");
  const lineIds = res.lines.map((l) => l.lineId);
  // What earlier lists already cover: open lists in full, finished lists for what was picked but not yet sent.
  const prior = lineIds.length ? await tx.select({
    orderLineId: tables.pickListLines.orderLineId,
    openQty: sql<string>`coalesce(sum(case when ${tables.pickLists.status} = 'open' then ${tables.pickListLines.toPick} else 0 end), 0)::text`,
    doneQty: sql<string>`coalesce(sum(case when ${tables.pickLists.status} = 'done' then ${tables.pickListLines.picked} else 0 end), 0)::text`,
  }).from(tables.pickListLines).innerJoin(tables.pickLists, eq(tables.pickLists.id, tables.pickListLines.listId))
    .where(inArray(tables.pickListLines.orderLineId, lineIds)).groupBy(tables.pickListLines.orderLineId) : [];
  const wants = res.lines.flatMap((l) => {
    const p = prior.find((x) => x.orderLineId === l.lineId);
    const waiting = dec(p?.doneQty ?? 0).minus(l.done);
    const covered = dec(p?.openQty ?? 0).plus(waiting.gt(0) ? waiting : 0);
    const toPick = dec(l.held).minus(covered);
    return toPick.gt(0) ? [{ lineId: l.lineId, itemId: l.itemId, toPick: toPick.toFixed(4) }] : [];
  });
  if (!wants.length) throw badRequest("nothing_to_pick");
  const bins = await binsOfWarehouse(tx, b.warehouseId);
  const holdings = await holdingsOf(tx, bins.map((x) => x.id));
  const plan = planPick(wants, holdings.map((h) => ({ binId: h.binId, code: h.code, itemId: h.itemId, qty: h.qty })));
  const number = await documentNumber(tx, actor, company, businessDate(), SERIES);
  const [list] = await tx.insert(tables.pickLists).values({ tenantId: actor.tenantId, companyId: company.id, orderId: b.orderId, warehouseId: b.warehouseId, number, createdBy: actor.userId }).returning();
  const orderLineOf = new Map(wants.map((x) => [x.lineId, x]));
  await tx.insert(tables.pickListLines).values(plan.map((a, i) => ({
    tenantId: actor.tenantId, listId: list!.id, lineNo: i + 1, orderLineId: a.lineId, itemId: orderLineOf.get(a.lineId)!.itemId, binId: a.binId, toPick: a.qty,
  })));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "pick_list", entityId: list!.id, after: { number, order: b.orderId, lines: plan.length }, ip: actor.ip });
  return getPickList(tx, list!.id);
}

export async function getPickList(tx: Tx, id: string) {
  const [h] = await tx.select({ list: tables.pickLists, orderNumber: tables.salesOrders.number, customer: tables.accounts.name, warehouse: tables.warehouses.name })
    .from(tables.pickLists).innerJoin(tables.salesOrders, eq(tables.salesOrders.id, tables.pickLists.orderId))
    .innerJoin(tables.accounts, eq(tables.accounts.id, tables.salesOrders.customerId)).innerJoin(tables.warehouses, eq(tables.warehouses.id, tables.pickLists.warehouseId))
    .where(eq(tables.pickLists.id, id));
  if (!h) throw notFound();
  const rows = await tx.select({ line: tables.pickListLines, item: tables.items.name, color: tables.items.color, size: tables.items.size, bin: tables.warehouseBins.code })
    .from(tables.pickListLines).innerJoin(tables.items, eq(tables.items.id, tables.pickListLines.itemId))
    .leftJoin(tables.warehouseBins, eq(tables.warehouseBins.id, tables.pickListLines.binId))
    .where(eq(tables.pickListLines.listId, id)).orderBy(asc(tables.warehouseBins.code), asc(tables.pickListLines.lineNo));
  const lines = rows.map((r) => ({ id: r.line.id, itemId: r.line.itemId, item: r.item, color: r.color, size: r.size, bin: r.bin, toPick: dec(r.line.toPick).toFixed(4), picked: dec(r.line.picked).toFixed(4) }));
  return {
    id: h.list.id, number: h.list.number, status: h.list.status, orderId: h.list.orderId, orderNumber: h.orderNumber, customer: h.customer, warehouse: h.warehouse,
    exceptions: h.list.exceptions, acceptedShort: h.list.acceptedShort, createdAt: h.list.createdAt, completedAt: h.list.completedAt,
    lines, missing: missingLines(lines), unplaced: lines.filter((l) => l.bin === null).length,
  };
}

export async function listPickLists(tx: Tx, status?: string, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const rows = await tx.select({ list: tables.pickLists, orderNumber: tables.salesOrders.number, customer: tables.accounts.name })
    .from(tables.pickLists).innerJoin(tables.salesOrders, eq(tables.salesOrders.id, tables.pickLists.orderId)).innerJoin(tables.accounts, eq(tables.accounts.id, tables.salesOrders.customerId))
    .where(and(eq(tables.pickLists.companyId, company.id), status ? eq(tables.pickLists.status, status) : undefined)).orderBy(desc(tables.pickLists.createdAt)).limit(200);
  return rows.map((r) => ({ id: r.list.id, number: r.list.number, status: r.list.status, orderNumber: r.orderNumber, customer: r.customer, createdAt: r.list.createdAt, exceptions: r.list.exceptions.length }));
}

/** A scanned code: counts toward the first open line of that item, or is recorded as a wrong item or an extra. */
export async function scanPick(tx: Tx, actor: Actor, id: string, code: string, qty = 1) {
  const [list] = await tx.select().from(tables.pickLists).where(eq(tables.pickLists.id, id)).for("update");
  if (!list) throw notFound();
  if (list.status !== "open") throw conflict("pick_list_not_open");
  const lines = await tx.select().from(tables.pickListLines).where(eq(tables.pickListLines.listId, id)).for("update");
  const itemId = await itemByCode(tx, list.companyId, code);
  const note = (kind: "wrong" | "extra") => tx.update(tables.pickLists).set({ exceptions: [...list.exceptions, { kind, code: code.trim().slice(0, 40), at: new Date().toISOString() }] }).where(eq(tables.pickLists.id, id));
  if (!itemId) { await note("wrong"); return { result: "wrong" as const, list: await getPickList(tx, id) }; }
  let left = qty;
  let result: "ok" | "wrong" | "extra" = "ok";
  const working = lines.map((l) => ({ id: l.id, itemId: l.itemId, toPick: l.toPick, picked: dec(l.picked) as Dec }));
  while (left > 0) {
    const s = scanResult(working, itemId);
    if (s.kind === "ok") {
      const l = working.find((x) => x.id === s.lineId)!;
      const room = dec(l.toPick).minus(l.picked);
      const take = room.lt(left) ? room : dec(left);
      l.picked = l.picked.plus(take);
      left -= Number(take);
      await tx.update(tables.pickListLines).set({ picked: l.picked.toFixed(4) }).where(eq(tables.pickListLines.id, l.id));
    } else {
      result = s.kind; await note(s.kind === "extra" ? "extra" : "wrong"); break;
    }
  }
  return { result, list: await getPickList(tx, id) };
}

/** Finishes the list. Lines still short need the short accepted; picked pieces leave their bins. */
export async function completePickList(tx: Tx, actor: Actor, id: string, acceptShort: boolean) {
  const [list] = await tx.select().from(tables.pickLists).where(eq(tables.pickLists.id, id)).for("update");
  if (!list) throw notFound();
  if (list.status !== "open") throw conflict("pick_list_not_open");
  const lines = await tx.select().from(tables.pickListLines).where(eq(tables.pickListLines.listId, id)).for("update");
  const missing = missingLines(lines.map((l) => ({ id: l.id, itemId: l.itemId, toPick: l.toPick, picked: l.picked })));
  if (missing.length && !acceptShort) throw conflict("lines_missing");
  for (const l of lines) {
    if (!l.binId || !dec(l.picked).gt(0)) continue;
    const [row] = await tx.select().from(tables.binStock).where(and(eq(tables.binStock.binId, l.binId), eq(tables.binStock.itemId, l.itemId))).for("update");
    if (!row) continue;
    const left = dec(row.qty).minus(l.picked);
    if (left.gt(0)) await tx.update(tables.binStock).set({ qty: left.toFixed(4) }).where(eq(tables.binStock.id, row.id));
    else await tx.delete(tables.binStock).where(eq(tables.binStock.id, row.id));
  }
  await tx.update(tables.pickLists).set({ status: "done", acceptedShort: missing.length > 0, completedAt: new Date() }).where(eq(tables.pickLists.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "pick_list", entityId: id, after: { status: "done", missing, exceptions: list.exceptions.length }, ip: actor.ip });
  return getPickList(tx, id);
}

export async function cancelPickList(tx: Tx, actor: Actor, id: string) {
  const [list] = await tx.select().from(tables.pickLists).where(eq(tables.pickLists.id, id)).for("update");
  if (!list) throw notFound();
  if (list.status !== "open") throw conflict("pick_list_not_open");
  await tx.update(tables.pickLists).set({ status: "cancelled" }).where(eq(tables.pickLists.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "cancel", entity: "pick_list", entityId: id, ip: actor.ip });
}
