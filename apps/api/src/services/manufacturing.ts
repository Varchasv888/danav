import { and, asc, desc, eq, inArray, ne, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { BomError, dec, explodeBom, money, planMrp, rollupCost, type Bom, type MrpItem, businessDate } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";
import { currentRate, documentNumber, ensureInventory, postMoves, reverseMoves, stockPositions, type Move } from "./inventory.js";
import { createPurchaseOrder } from "./purchasing.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }
type Company = Awaited<ReturnType<typeof resolveCompany>>;

export const PRODUCTION_SERIES = { docType: "production_order", name: "Production orders", pattern: "PRD/{FY}/{SEQ:5}" };
const q4 = (v: string | number | ReturnType<typeof dec>) => dec(v).toDecimalPlaces(4).toFixed(4);
const bomErr = (e: unknown) => { if (e instanceof BomError) throw badRequest(e.code); throw e; };

// ---- work centres ----------------------------------------------------------------------------------

export async function listWorkCentres(tx: Tx, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  return tx.select().from(tables.workCentres).where(eq(tables.workCentres.companyId, company.id)).orderBy(asc(tables.workCentres.name));
}

export async function saveWorkCentre(tx: Tx, actor: Actor, input: { name: string; costPerHour: string; archived?: boolean | undefined }, id?: string) {
  const company = await resolveCompany(tx);
  const values = { name: input.name, costPerHour: money(input.costPerHour), archived: !!input.archived };
  const [row] = id
    ? await tx.update(tables.workCentres).set(values).where(and(eq(tables.workCentres.id, id), eq(tables.workCentres.companyId, company.id))).returning()
    : await tx.insert(tables.workCentres).values({ tenantId: actor.tenantId, companyId: company.id, ...values }).returning();
  if (!row) throw notFound();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: id ? "update" : "create", entity: "work_centre", entityId: row.id, after: values, ip: actor.ip });
  return row;
}

// ---- BOMs ------------------------------------------------------------------------------------------

/** The default active BOM of every item, in the shape the domain rules use (overhead includes work-centre time). */
export async function defaultBoms(tx: Tx, companyId: string, opts: { exceptBomId?: string } = {}): Promise<Record<string, Bom & { bomId: string }>> {
  const heads = await tx.select().from(tables.boms).where(and(
    eq(tables.boms.companyId, companyId), eq(tables.boms.isDefault, true), eq(tables.boms.status, "active"),
    opts.exceptBomId ? ne(tables.boms.id, opts.exceptBomId) : undefined,
  ));
  if (!heads.length) return {};
  const lines = await tx.select().from(tables.bomLines).where(inArray(tables.bomLines.bomId, heads.map((h) => h.id))).orderBy(asc(tables.bomLines.lineNo));
  const ops = await tx.select({ op: tables.bomOperations, rate: tables.workCentres.costPerHour }).from(tables.bomOperations)
    .innerJoin(tables.workCentres, eq(tables.workCentres.id, tables.bomOperations.workCentreId)).where(inArray(tables.bomOperations.bomId, heads.map((h) => h.id)));
  return Object.fromEntries(heads.map((h) => [h.itemId, {
    bomId: h.id, itemId: h.itemId, outputQty: h.outputQty,
    overhead: ops.filter((o) => o.op.bomId === h.id).reduce((s, o) => s.plus(dec(o.op.minutes).div(60).times(o.rate)), dec(h.overhead)).toFixed(2),
    lines: lines.filter((l) => l.bomId === h.id).map((l) => ({ itemId: l.itemId, qty: l.qty, wastagePct: l.wastagePct })),
  }]));
}

async function bomShape(tx: Tx, bomId: string): Promise<Bom & { bomId: string }> {
  const [h] = await tx.select().from(tables.boms).where(eq(tables.boms.id, bomId));
  if (!h) throw notFound();
  const lines = await tx.select().from(tables.bomLines).where(eq(tables.bomLines.bomId, bomId)).orderBy(asc(tables.bomLines.lineNo));
  const ops = await tx.select({ op: tables.bomOperations, rate: tables.workCentres.costPerHour }).from(tables.bomOperations)
    .innerJoin(tables.workCentres, eq(tables.workCentres.id, tables.bomOperations.workCentreId)).where(eq(tables.bomOperations.bomId, bomId));
  return {
    bomId, itemId: h.itemId, outputQty: h.outputQty,
    overhead: ops.reduce((s, o) => s.plus(dec(o.op.minutes).div(60).times(o.rate)), dec(h.overhead)).toFixed(2),
    lines: lines.map((l) => ({ itemId: l.itemId, qty: l.qty, wastagePct: l.wastagePct })),
  };
}

export interface BomInput {
  itemId: string; outputQty: string; overhead?: string | undefined; notes?: string | undefined; makeDefault?: boolean | undefined;
  lines: { itemId: string; qty: string; wastagePct?: string | undefined }[];
  operations?: { name: string; workCentreId: string; minutes: string }[] | undefined;
}

/** Saves a new version of an item's BOM. It becomes the default unless told otherwise (the first one always does). */
export async function createBom(tx: Tx, actor: Actor, input: BomInput) {
  const company = await resolveCompany(tx);
  await ensureInventory(tx, actor.tenantId, company.id);
  if (!dec(input.outputQty).gt(0)) throw badRequest("invalid_output_qty");
  if (!input.lines.length) throw badRequest("bom_empty");
  const ids = [...new Set([input.itemId, ...input.lines.map((l) => l.itemId)])];
  const its = await tx.select().from(tables.items).where(inArray(tables.items.id, ids));
  if (its.length !== ids.length || its.some((i) => i.companyId !== company.id)) throw badRequest("unknown_item");
  if (input.lines.some((l) => l.itemId === input.itemId)) throw badRequest("bom_cycle");
  if (input.lines.some((l) => !dec(l.qty).gt(0))) throw badRequest("qty_must_be_positive");
  if (new Set(input.lines.map((l) => l.itemId)).size !== input.lines.length) throw badRequest("duplicate_component");
  for (const o of input.operations ?? []) {
    const [wc] = await tx.select().from(tables.workCentres).where(eq(tables.workCentres.id, o.workCentreId));
    if (!wc || wc.companyId !== company.id) throw badRequest("unknown_work_centre");
  }
  const [{ v }] = (await tx.execute<{ v: number }>(sql`select coalesce(max(version), 0)::int as v from boms where company_id = ${company.id} and item_id = ${input.itemId}`)) as unknown as [{ v: number }];
  const [{ n }] = (await tx.execute<{ n: number }>(sql`select count(*)::int as n from boms where company_id = ${company.id} and item_id = ${input.itemId} and is_default and status = 'active'`)) as unknown as [{ n: number }];
  const makeDefault = input.makeDefault ?? true;
  const isDefault = makeDefault || n === 0;
  // A new default must not make a loop with the other items' default BOMs.
  if (isDefault) {
    const others = await defaultBoms(tx, company.id);
    const candidate: Bom = { itemId: input.itemId, outputQty: input.outputQty, lines: input.lines };
    try { explodeBom({ ...others, [input.itemId]: candidate }, input.itemId, "1", true); } catch (e) { bomErr(e); }
    await tx.update(tables.boms).set({ isDefault: false }).where(and(eq(tables.boms.companyId, company.id), eq(tables.boms.itemId, input.itemId)));
  }
  const [bom] = await tx.insert(tables.boms).values({
    tenantId: actor.tenantId, companyId: company.id, itemId: input.itemId, version: v + 1, outputQty: q4(input.outputQty),
    overhead: money(input.overhead ?? 0), isDefault, notes: input.notes ?? null, createdBy: actor.userId,
  }).returning();
  await tx.insert(tables.bomLines).values(input.lines.map((l, i) => ({ tenantId: actor.tenantId, bomId: bom!.id, lineNo: i + 1, itemId: l.itemId, qty: q4(l.qty), wastagePct: l.wastagePct ?? "0" })));
  if (input.operations?.length) {
    await tx.insert(tables.bomOperations).values(input.operations.map((o, i) => ({ tenantId: actor.tenantId, bomId: bom!.id, lineNo: i + 1, name: o.name, workCentreId: o.workCentreId, minutes: o.minutes })));
  }
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "bom", entityId: bom!.id, after: { itemId: input.itemId, version: bom!.version, lines: input.lines.length }, ip: actor.ip });
  return bom!;
}

export async function setBomStatus(tx: Tx, actor: Actor, id: string, change: "default" | "archive") {
  const [b] = await tx.select().from(tables.boms).where(eq(tables.boms.id, id)).for("update");
  if (!b) throw notFound();
  if (change === "default") {
    if (b.status !== "active") throw conflict("bom_archived");
    const others = await defaultBoms(tx, b.companyId);
    const mine = await bomShape(tx, id);
    try { explodeBom({ ...others, [b.itemId]: mine }, b.itemId, "1", true); } catch (e) { bomErr(e); }
    await tx.update(tables.boms).set({ isDefault: false }).where(and(eq(tables.boms.companyId, b.companyId), eq(tables.boms.itemId, b.itemId)));
    await tx.update(tables.boms).set({ isDefault: true }).where(eq(tables.boms.id, id));
  } else {
    await tx.update(tables.boms).set({ status: "archived", isDefault: false }).where(eq(tables.boms.id, id));
  }
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "bom", entityId: id, after: { change }, ip: actor.ip });
}

/** Rates for costing: current stock cost where there's stock, otherwise the item's purchase rate. */
async function costRates(tx: Tx, company: Company, itemIds: string[], asOf: string) {
  const positions = await stockPositions(tx, company, asOf, { itemIds });
  const its = itemIds.length ? await tx.select({ id: tables.items.id, rate: tables.items.purchaseRate }).from(tables.items).where(inArray(tables.items.id, itemIds)) : [];
  return Object.fromEntries(itemIds.map((id) => {
    const ps = positions.filter((p) => p.itemId === id);
    const qty = ps.reduce((s, p) => s.plus(p.qty), dec(0));
    const value = ps.reduce((s, p) => s.plus(p.value), dec(0));
    return [id, qty.gt(0) ? value.div(qty).toFixed(4) : (its.find((i) => i.id === id)?.rate ?? "0")];
  }));
}

export async function listBoms(tx: Tx, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  return tx.select({ bom: tables.boms, itemName: tables.items.name, itemNameHi: tables.items.nameHi, lines: sql<number>`(select count(*)::int from bom_lines l where l.bom_id = ${tables.boms.id})` })
    .from(tables.boms).innerJoin(tables.items, eq(tables.items.id, tables.boms.itemId))
    .where(eq(tables.boms.companyId, company.id)).orderBy(asc(tables.items.name), desc(tables.boms.version));
}

export async function getBom(tx: Tx, id: string) {
  const [b] = await tx.select().from(tables.boms).where(eq(tables.boms.id, id));
  if (!b) throw notFound();
  const company = await resolveCompany(tx, b.companyId);
  const lines = await tx.select({ line: tables.bomLines, name: tables.items.name, nameHi: tables.items.nameHi, uom: tables.uoms.code }).from(tables.bomLines)
    .innerJoin(tables.items, eq(tables.items.id, tables.bomLines.itemId)).innerJoin(tables.uoms, eq(tables.uoms.id, tables.items.uomId))
    .where(eq(tables.bomLines.bomId, id)).orderBy(asc(tables.bomLines.lineNo));
  const operations = await tx.select({ op: tables.bomOperations, workCentre: tables.workCentres.name, rate: tables.workCentres.costPerHour }).from(tables.bomOperations)
    .innerJoin(tables.workCentres, eq(tables.workCentres.id, tables.bomOperations.workCentreId)).where(eq(tables.bomOperations.bomId, id)).orderBy(asc(tables.bomOperations.lineNo));
  const [item] = await tx.select().from(tables.items).where(eq(tables.items.id, b.itemId));
  const shape = await bomShape(tx, id);
  const others = await defaultBoms(tx, b.companyId, { exceptBomId: id });
  const all = { ...others, [b.itemId]: shape };
  const componentIds = new Set<string>();
  const collect = (itemId: string, seen: string[]) => { for (const l of all[itemId]?.lines ?? []) { componentIds.add(l.itemId); if (all[l.itemId] && !seen.includes(l.itemId)) collect(l.itemId, [...seen, l.itemId]); } };
  collect(b.itemId, [b.itemId]);
  let cost: ReturnType<typeof rollupCost> | null = null;
  try { cost = rollupCost(all, b.itemId, await costRates(tx, company, [...componentIds], businessDate())); } catch (e) { bomErr(e); }
  return {
    ...b, itemName: item!.name, itemNameHi: item!.nameHi, overheadPerBatch: shape.overhead,
    lines: lines.map((l) => ({ ...l.line, name: l.name, nameHi: l.nameHi, uom: l.uom })),
    operations: operations.map((o) => ({ ...o.op, workCentre: o.workCentre, cost: money(dec(o.op.minutes).div(60).times(o.rate)) })),
    cost,
  };
}

// ---- goods sold ---------------------------------------------------------------------------------------

/** Stock movements for goods sold: each goods line leaves its warehouse (services move nothing). */
export async function saleMoves(tx: Tx, companyId: string, lines: { itemId: string; qty: string; warehouseId: string; batchNo?: string | undefined }[], date: string): Promise<Move[]> {
  if (!lines.length) return [];
  const its = await tx.select({ id: tables.items.id, kind: tables.items.kind }).from(tables.items)
    .where(and(eq(tables.items.companyId, companyId), inArray(tables.items.id, [...new Set(lines.map((l) => l.itemId))])));
  const goods = new Set(its.filter((i) => i.kind === "goods").map((i) => i.id));
  return lines.filter((l) => goods.has(l.itemId)).map((l) => ({ itemId: l.itemId, warehouseId: l.warehouseId, date, qtyOut: q4(l.qty), batchNo: l.batchNo }));
}

// ---- production orders ---------------------------------------------------------------------------------

async function defaultWarehouseId(tx: Tx, company: Company) {
  await ensureInventory(tx, company.tenantId, company.id);
  const [w] = await tx.select().from(tables.warehouses).where(and(eq(tables.warehouses.companyId, company.id), eq(tables.warehouses.archived, false), sql`${tables.warehouses.jobWorkerId} is null`))
    .orderBy(sql`${tables.warehouses.isDefault} desc`, asc(tables.warehouses.createdAt)).limit(1);
  return w!.id;
}

export interface ProductionInput {
  itemId: string; bomId?: string | undefined; qty: string; date: string; sourceWarehouseId?: string | undefined; targetWarehouseId?: string | undefined;
  salesOrderId?: string | undefined; notes?: string | undefined; release?: boolean | undefined;
}

export async function createProductionOrder(tx: Tx, actor: Actor, input: ProductionInput) {
  const company = await resolveCompany(tx);
  if (!dec(input.qty).gt(0)) throw badRequest("qty_must_be_positive");
  const [bom] = input.bomId
    ? await tx.select().from(tables.boms).where(eq(tables.boms.id, input.bomId))
    : await tx.select().from(tables.boms).where(and(eq(tables.boms.companyId, company.id), eq(tables.boms.itemId, input.itemId), eq(tables.boms.isDefault, true), eq(tables.boms.status, "active")));
  if (!bom || bom.companyId !== company.id || bom.itemId !== input.itemId) throw badRequest("no_bom");
  if (bom.status !== "active") throw conflict("bom_archived");
  const wh = await defaultWarehouseId(tx, company);
  const number = await documentNumber(tx, actor, company, input.date, PRODUCTION_SERIES);
  const [order] = await tx.insert(tables.productionOrders).values({
    tenantId: actor.tenantId, companyId: company.id, number, date: input.date, itemId: input.itemId, bomId: bom.id, qty: q4(input.qty),
    sourceWarehouseId: input.sourceWarehouseId ?? wh, targetWarehouseId: input.targetWarehouseId ?? wh, status: input.release ? "released" : "planned",
    salesOrderId: input.salesOrderId ?? null, notes: input.notes ?? null, createdBy: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "production_order", entityId: order!.id, after: { number, qty: order!.qty }, ip: actor.ip });
  return order!;
}

async function loadOrder(tx: Tx, id: string) {
  const [o] = await tx.select().from(tables.productionOrders).where(eq(tables.productionOrders.id, id)).for("update");
  if (!o) throw notFound();
  return o;
}

export async function releaseProductionOrder(tx: Tx, actor: Actor, id: string) {
  const o = await loadOrder(tx, id);
  if (o.status !== "planned") throw conflict("order_not_planned");
  await tx.update(tables.productionOrders).set({ status: "released" }).where(eq(tables.productionOrders.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "production_order", entityId: id, after: { status: "released" }, ip: actor.ip });
}

/** Extra material issued to the order (beyond the BOM): leaves stock now, its cost goes into the next completion. */
export async function issueMaterials(tx: Tx, actor: Actor, id: string, input: { date: string; lines: { itemId: string; qty: string }[]; notes?: string | undefined }) {
  const o = await loadOrder(tx, id);
  if (o.status !== "released") throw conflict("order_not_released");
  if (!input.lines.length) throw badRequest("no_lines");
  const company = await resolveCompany(tx, o.companyId);
  const lines = [];
  let cost = dec(0);
  for (const l of input.lines) {
    if (!dec(l.qty).gt(0)) throw badRequest("qty_must_be_positive");
    const rate = await currentRate(tx, company, l.itemId, o.sourceWarehouseId, input.date);
    lines.push({ itemId: l.itemId, qty: q4(l.qty), rate });
    cost = cost.plus(dec(l.qty).times(rate));
  }
  const [entry] = await tx.insert(tables.productionEntries).values({
    tenantId: actor.tenantId, orderId: id, kind: "issue", date: input.date, materialCost: money(cost), lines, notes: input.notes ?? null, createdBy: actor.userId,
  }).returning();
  const { warnings } = await postMoves(tx, company, "production_entry", entry!.id, lines.map((l) => ({ itemId: l.itemId, warehouseId: o.sourceWarehouseId, date: input.date, qtyOut: l.qty })));
  await tx.update(tables.productionOrders).set({ pendingCost: money(dec(o.pendingCost).plus(cost)), materialCost: money(dec(o.materialCost).plus(cost)) }).where(eq(tables.productionOrders.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "production_order", entityId: id, after: { issued: lines.length, cost: money(cost) }, ip: actor.ip });
  return { entry: entry!, warnings };
}

/**
 * Finished output: the BOM's materials for everything made (good and rejected) leave stock at their
 * current cost; the good units come in at (materials + work-centre and fixed overheads + extra issues)
 * ÷ good units. Rejects are scrapped. The order completes when the planned quantity is reached (or
 * when `close` is set).
 */
export async function completeProduction(tx: Tx, actor: Actor, id: string, input: { date: string; goodQty: string; rejectedQty?: string | undefined; close?: boolean | undefined; notes?: string | undefined }) {
  const o = await loadOrder(tx, id);
  if (o.status !== "released") throw conflict("order_not_released");
  const good = dec(input.goodQty);
  const rejected = dec(input.rejectedQty ?? 0);
  if (good.lt(0) || rejected.lt(0) || !good.plus(rejected).gt(0)) throw badRequest("qty_must_be_positive");
  const company = await resolveCompany(tx, o.companyId);
  const bom = await bomShape(tx, o.bomId);
  const made = good.plus(rejected);
  let materials = dec(0);
  const lines = [];
  for (const c of explodeBom({ [o.itemId]: bom }, o.itemId, made)) {
    const rate = await currentRate(tx, company, c.itemId, o.sourceWarehouseId, input.date);
    lines.push({ itemId: c.itemId, qty: c.qty, rate });
    materials = materials.plus(dec(c.qty).times(rate));
  }
  const overhead = dec(bom.overhead ?? 0).times(made).div(bom.outputQty);
  const total = materials.plus(overhead).plus(o.pendingCost);
  const unitCost = good.gt(0) ? total.div(good).toDecimalPlaces(4) : dec(0);
  const [entry] = await tx.insert(tables.productionEntries).values({
    tenantId: actor.tenantId, orderId: id, kind: "complete", date: input.date, goodQty: q4(good), rejectedQty: q4(rejected),
    materialCost: money(materials), overheadCost: money(overhead), unitCost: unitCost.toFixed(4), lines, notes: input.notes ?? null, createdBy: actor.userId,
  }).returning();
  const moves: Move[] = lines.map((l) => ({ itemId: l.itemId, warehouseId: o.sourceWarehouseId, date: input.date, qtyOut: l.qty }));
  if (good.gt(0)) moves.push({ itemId: o.itemId, warehouseId: o.targetWarehouseId, date: input.date, qtyIn: q4(good), rate: unitCost.toFixed(4) });
  const { warnings } = await postMoves(tx, company, "production_entry", entry!.id, moves);
  const produced = dec(o.producedQty).plus(good);
  const rejectedTotal = dec(o.rejectedQty).plus(rejected);
  const done = input.close || produced.plus(rejectedTotal).gte(o.qty);
  await tx.update(tables.productionOrders).set({
    producedQty: q4(produced), rejectedQty: q4(rejectedTotal), materialCost: money(dec(o.materialCost).plus(materials)), overheadCost: money(dec(o.overheadCost).plus(overhead)),
    pendingCost: "0", ...(done ? { status: "completed", completedAt: new Date() } : {}),
  }).where(eq(tables.productionOrders.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "production_order", entityId: id, after: { good: q4(good), rejected: q4(rejected), unitCost: unitCost.toFixed(4) }, ip: actor.ip });
  return { entry: entry!, unitCost: unitCost.toFixed(4), warnings };
}

/** Cancelling reverses every issue and completion on the order. */
export async function cancelProductionOrder(tx: Tx, actor: Actor, id: string, reason: string) {
  const o = await loadOrder(tx, id);
  if (o.status === "cancelled") throw conflict("already_cancelled");
  const entries = await tx.select({ id: tables.productionEntries.id }).from(tables.productionEntries).where(eq(tables.productionEntries.orderId, id));
  for (const e of entries) await reverseMoves(tx, "production_entry", e.id);
  await tx.update(tables.productionOrders).set({ status: "cancelled" }).where(eq(tables.productionOrders.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "cancel", entity: "production_order", entityId: id, after: { reason, entries: entries.length }, ip: actor.ip });
}

export async function listProductionOrders(tx: Tx, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  return tx.select({ order: tables.productionOrders, itemName: tables.items.name, itemNameHi: tables.items.nameHi }).from(tables.productionOrders)
    .innerJoin(tables.items, eq(tables.items.id, tables.productionOrders.itemId))
    .where(eq(tables.productionOrders.companyId, company.id)).orderBy(desc(tables.productionOrders.date), desc(tables.productionOrders.number)).limit(300);
}

export async function getProductionOrder(tx: Tx, id: string) {
  const [row] = await tx.select({ order: tables.productionOrders, itemName: tables.items.name, itemNameHi: tables.items.nameHi }).from(tables.productionOrders)
    .innerJoin(tables.items, eq(tables.items.id, tables.productionOrders.itemId)).where(eq(tables.productionOrders.id, id));
  if (!row) throw notFound();
  const bom = await bomShape(tx, row.order.bomId);
  const remaining = dec(row.order.qty).minus(row.order.producedQty).minus(row.order.rejectedQty);
  const required = explodeBom({ [row.order.itemId]: bom }, row.order.itemId, remaining.gt(0) ? remaining : 0);
  const names = await tx.select({ id: tables.items.id, name: tables.items.name, nameHi: tables.items.nameHi }).from(tables.items)
    .where(inArray(tables.items.id, [...new Set([...required.map((r) => r.itemId), ...bom.lines.map((l) => l.itemId)])]));
  const entries = await tx.select().from(tables.productionEntries).where(eq(tables.productionEntries.orderId, id)).orderBy(asc(tables.productionEntries.createdAt));
  const name = (itemId: string) => names.find((n) => n.id === itemId);
  return {
    ...row.order, itemName: row.itemName, itemNameHi: row.itemNameHi,
    remaining: q4(remaining), materialsForRemaining: required.map((r) => ({ ...r, name: name(r.itemId)?.name, nameHi: name(r.itemId)?.nameHi })),
    entries: entries.map((e) => ({ ...e, lines: e.lines.map((l) => ({ ...l, name: name(l.itemId)?.name ?? null })) })),
  };
}

// ---- MRP -------------------------------------------------------------------------------------------------

/**
 * Plans what to make and buy: demand is open sales order quantities (by their delivery date) and the
 * reorder level of every item that has one; supply is stock on hand plus open purchase orders and
 * open production orders.
 */
export async function runMrp(tx: Tx, today: string, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const boms = await defaultBoms(tx, company.id);
  const [items, positions, soLines, poLines, prod, lastSuppliers] = await Promise.all([
    tx.select().from(tables.items).where(and(eq(tables.items.companyId, company.id), eq(tables.items.kind, "goods"), eq(tables.items.archived, false))),
    stockPositions(tx, company, today),
    tx.execute<{ item_id: string; open: string; due: string }>(sql`
      select l.item_id, (l.qty - greatest(l.delivered_qty, l.invoiced_qty))::text as open, coalesce(o.deliver_by, o.date)::text as due
      from sales_order_lines l join sales_orders o on o.id = l.order_id
      where o.company_id = ${company.id} and o.status in ('open', 'partial') and l.qty > greatest(l.delivered_qty, l.invoiced_qty)`),
    tx.execute<{ item_id: string; open: string }>(sql`
      select l.item_id, sum(l.qty - l.received_qty)::text as open from purchase_order_lines l join purchase_orders o on o.id = l.order_id
      where o.company_id = ${company.id} and o.status in ('open', 'partial') and l.qty > l.received_qty group by l.item_id`),
    tx.select().from(tables.productionOrders).where(and(eq(tables.productionOrders.companyId, company.id), inArray(tables.productionOrders.status, ["planned", "released"]))),
    tx.execute<{ item_id: string; supplier_id: string; name: string }>(sql`
      select distinct on (l.item_id) l.item_id, b.supplier_id, a.name from purchase_bill_lines l join purchase_bills b on b.id = l.bill_id
      join accounts a on a.id = b.supplier_id where b.company_id = ${company.id} and b.status = 'posted' order by l.item_id, b.date desc`),
  ]);
  // Stock lying with job workers isn't available to use.
  const away = new Set((await tx.select({ id: tables.warehouses.id }).from(tables.warehouses).where(and(eq(tables.warehouses.companyId, company.id), sql`${tables.warehouses.jobWorkerId} is not null`))).map((w) => w.id));
  const onHand = (id: string) => positions.filter((p) => p.itemId === id && !away.has(p.warehouseId)).reduce((s, p) => s.plus(p.qty), dec(0));
  const mrpItems: Record<string, MrpItem> = {};
  for (const it of items) {
    const onOrderPo = dec(poLines.find((p) => p.item_id === it.id)?.open ?? 0);
    const onOrderProd = prod.filter((p) => p.itemId === it.id).reduce((s, p) => s.plus(dec(p.qty).minus(p.producedQty).minus(p.rejectedQty)), dec(0));
    mrpItems[it.id] = {
      itemId: it.id, onHand: onHand(it.id).toFixed(4), onOrder: onOrderPo.plus(onOrderProd).toFixed(4),
      ...(it.reorderLevel ? { safetyStock: it.reorderLevel } : {}), ...(it.reorderQty ? { minOrderQty: it.reorderQty } : {}), leadTimeDays: it.leadTimeDays,
    };
  }
  const demands = soLines.map((l) => ({ itemId: l.item_id, qty: l.open, dueDate: l.due < today ? today : l.due }));
  let planned;
  try { planned = planMrp(mrpItems, boms, demands, today); } catch (e) { bomErr(e); }
  return planned!.map((p) => {
    const it = items.find((i) => i.id === p.itemId);
    const sup = lastSuppliers.find((s) => s.item_id === p.itemId);
    return { ...p, name: it?.name ?? "", nameHi: it?.nameHi ?? null, onHand: mrpItems[p.itemId]?.onHand ?? "0", onOrder: mrpItems[p.itemId]?.onOrder ?? "0",
      rate: it?.purchaseRate ?? "0", supplierId: sup?.supplier_id ?? null, supplierName: sup?.name ?? null };
  });
}

/** Turns chosen MRP lines into planned production orders and purchase orders (one per supplier). */
export async function convertMrp(tx: Tx, actor: Actor, date: string, lines: { itemId: string; qty: string; action: "make" | "buy"; supplierId?: string | undefined; needBy?: string | undefined }[]) {
  const created = { productionOrders: [] as string[], purchaseOrders: [] as string[] };
  for (const l of lines.filter((x) => x.action === "make")) {
    created.productionOrders.push((await createProductionOrder(tx, actor, { itemId: l.itemId, qty: l.qty, date, notes: "From MRP" })).number);
  }
  const buys = lines.filter((x) => x.action === "buy");
  if (buys.some((b) => !b.supplierId)) throw badRequest("supplier_required");
  const rates = buys.length ? await tx.select({ id: tables.items.id, rate: tables.items.purchaseRate }).from(tables.items).where(inArray(tables.items.id, buys.map((b) => b.itemId))) : [];
  for (const supplierId of [...new Set(buys.map((b) => b.supplierId!))]) {
    const mine = buys.filter((b) => b.supplierId === supplierId);
    const po = await createPurchaseOrder(tx, actor, {
      supplierId, date, expectedOn: mine.map((m) => m.needBy).filter(Boolean).sort()[0], narration: "From MRP",
      lines: mine.map((m) => ({ itemId: m.itemId, qty: m.qty, rate: rates.find((r) => r.id === m.itemId)?.rate ?? "0" })),
    });
    created.purchaseOrders.push(po.number);
  }
  return created;
}


