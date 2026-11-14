import { and, asc, desc, eq, inArray, or } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec, money, schemeActive } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

export interface BranchPriceInput {
  itemId: string; saleRate: string; startsOn?: string | null | undefined; endsOn?: string | null | undefined;
  weekdays?: number[] | null | undefined; fromTime?: string | null | undefined; toTime?: string | null | undefined; note?: string | null | undefined;
}

/**
 * The rate each item sells at in one store right now: the latest entry whose dates, weekdays and hours all allow it. An entry with hours needs the time;
 * with none given (a device bill, which cannot know it) hour-limited entries are left out rather than guessed at. Items with no entry are not in the map.
 */
export async function activeRates(tx: Tx, companyId: string, warehouseId: string, date: string, time?: string | undefined) {
  const rows = await tx.select().from(tables.branchPrices)
    .where(and(eq(tables.branchPrices.companyId, companyId), eq(tables.branchPrices.warehouseId, warehouseId))).orderBy(asc(tables.branchPrices.createdAt));
  const out = new Map<string, string>();
  for (const r of rows) {
    if (!schemeActive({ startsOn: r.startsOn, endsOn: r.endsOn, weekdays: r.weekdays, fromTime: r.fromTime, toTime: r.toTime }, date, time)) continue;
    out.set(r.itemId, r.saleRate);
  }
  return out;
}

async function ownStore(tx: Tx, companyId: string, warehouseId: string) {
  const [w] = await tx.select({ id: tables.warehouses.id, name: tables.warehouses.name }).from(tables.warehouses).where(and(eq(tables.warehouses.id, warehouseId), eq(tables.warehouses.companyId, companyId)));
  if (!w) throw badRequest("unknown_warehouse");
  return w;
}

export async function listBranchPrices(tx: Tx, warehouseId: string) {
  const company = await resolveCompany(tx);
  await ownStore(tx, company.id, warehouseId);
  const rows = await tx.select({ p: tables.branchPrices, name: tables.items.name, sku: tables.items.sku, usual: tables.items.saleRate }).from(tables.branchPrices)
    .innerJoin(tables.items, eq(tables.items.id, tables.branchPrices.itemId))
    .where(and(eq(tables.branchPrices.companyId, company.id), eq(tables.branchPrices.warehouseId, warehouseId))).orderBy(asc(tables.items.name), desc(tables.branchPrices.createdAt));
  return rows.map((r) => ({ id: r.p.id, itemId: r.p.itemId, item: r.name, sku: r.sku, usualRate: money(r.usual), saleRate: r.p.saleRate, startsOn: r.p.startsOn, endsOn: r.p.endsOn, weekdays: r.p.weekdays, fromTime: r.p.fromTime, toTime: r.p.toTime, note: r.p.note }));
}

export async function addBranchPrices(tx: Tx, actor: Actor, warehouseId: string, entries: BranchPriceInput[]) {
  const company = await resolveCompany(tx);
  await ownStore(tx, company.id, warehouseId);
  if (!entries.length) throw badRequest("nothing_to_add");
  const ids = [...new Set(entries.map((e) => e.itemId))];
  const found = await tx.select({ id: tables.items.id }).from(tables.items).where(and(eq(tables.items.companyId, company.id), inArray(tables.items.id, ids)));
  if (found.length !== ids.length) throw badRequest("unknown_item");
  for (const e of entries) {
    if (!dec(e.saleRate).gte(0)) throw badRequest("invalid_amount");
    if (e.startsOn && e.endsOn && e.endsOn < e.startsOn) throw badRequest("range_reversed");
    if (!!e.fromTime !== !!e.toTime) throw badRequest("both_times_needed");
  }
  await tx.insert(tables.branchPrices).values(entries.map((e) => ({
    tenantId: actor.tenantId, companyId: company.id, warehouseId, itemId: e.itemId, saleRate: money(e.saleRate), startsOn: e.startsOn ?? null, endsOn: e.endsOn ?? null,
    weekdays: e.weekdays?.length && new Set(e.weekdays).size < 7 ? [...new Set(e.weekdays)].sort() : null, fromTime: e.fromTime ?? null, toTime: e.toTime ?? null, note: e.note ?? null, createdBy: actor.userId,
  })));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "branch_prices", entityId: warehouseId, after: { entries: entries.length }, ip: actor.ip });
  return { added: entries.length };
}

export async function removeBranchPrice(tx: Tx, actor: Actor, id: string) {
  const [r] = await tx.delete(tables.branchPrices).where(eq(tables.branchPrices.id, id)).returning({ warehouseId: tables.branchPrices.warehouseId, itemId: tables.branchPrices.itemId });
  if (!r) throw notFound();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "delete", entity: "branch_prices", entityId: id, ip: actor.ip });
}

/** Copies one store's rates to another, replacing what the other store had for those items. */
export async function copyBranchPrices(tx: Tx, actor: Actor, fromWarehouseId: string, toWarehouseId: string) {
  const company = await resolveCompany(tx);
  if (fromWarehouseId === toWarehouseId) throw badRequest("same_store");
  await ownStore(tx, company.id, fromWarehouseId);
  await ownStore(tx, company.id, toWarehouseId);
  const rows = await tx.select().from(tables.branchPrices).where(eq(tables.branchPrices.warehouseId, fromWarehouseId));
  if (!rows.length) throw badRequest("nothing_to_copy");
  await tx.delete(tables.branchPrices).where(and(eq(tables.branchPrices.warehouseId, toWarehouseId), inArray(tables.branchPrices.itemId, [...new Set(rows.map((r) => r.itemId))])));
  await tx.insert(tables.branchPrices).values(rows.map((r) => ({
    tenantId: actor.tenantId, companyId: company.id, warehouseId: toWarehouseId, itemId: r.itemId, saleRate: r.saleRate, startsOn: r.startsOn, endsOn: r.endsOn, weekdays: r.weekdays, fromTime: r.fromTime, toTime: r.toTime, note: r.note, createdBy: actor.userId,
  })));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "branch_prices", entityId: toWarehouseId, after: { copiedFrom: fromWarehouseId, rows: rows.length }, ip: actor.ip });
  return { copied: rows.length };
}

/** Reads pasted lines of "code, rate" (SKU, barcode or short code, then the store's rate), separated by tabs, commas or semicolons, and adds them. */
export async function importBranchPrices(tx: Tx, actor: Actor, warehouseId: string, text: string, spell: { startsOn?: string | null | undefined; endsOn?: string | null | undefined } = {}) {
  const company = await resolveCompany(tx);
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!lines.length) throw badRequest("nothing_to_add");
  const parsed = lines.map((l) => { const [code, rate] = l.split(/\t|;|,/).map((c) => c.trim()); return { code: code ?? "", rate: rate ?? "" }; });
  const codes = [...new Set(parsed.map((p) => p.code).filter(Boolean))];
  const items = codes.length ? await tx.select({ id: tables.items.id, sku: tables.items.sku, barcode: tables.items.barcode, shortCode: tables.items.shortCode }).from(tables.items)
    .where(and(eq(tables.items.companyId, company.id), or(inArray(tables.items.sku, codes), inArray(tables.items.barcode, codes), inArray(tables.items.shortCode, codes)))) : [];
  const byCode = new Map<string, string>();
  for (const i of items) for (const c of [i.sku, i.barcode, i.shortCode]) if (c) byCode.set(c, i.id);
  const unknown = parsed.filter((p) => !byCode.has(p.code)).map((p) => p.code);
  if (unknown.length) throw badRequest("unknown_codes");
  const bad = parsed.find((p) => !/^\d+(\.\d{1,2})?$/.test(p.rate));
  if (bad) throw badRequest("invalid_amount");
  return addBranchPrices(tx, actor, warehouseId, parsed.map((p) => ({ itemId: byCode.get(p.code)!, saleRate: p.rate, startsOn: spell.startsOn ?? null, endsOn: spell.endsOn ?? null })));
}

/** The rates a till shows for a store right now. */
export async function ratesForTill(tx: Tx, warehouseId: string, date: string, time: string) {
  const company = await resolveCompany(tx);
  await ownStore(tx, company.id, warehouseId);
  return Object.fromEntries(await activeRates(tx, company.id, warehouseId, date, time));
}
