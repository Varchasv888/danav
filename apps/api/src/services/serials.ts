import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";
import { stockPositions } from "./inventory.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

const clean = (s: string) => s.trim().toUpperCase();

/** Serial numbers as typed or scanned: trimmed, upper case, no blanks, none twice. */
export function normalizeSerials(list: readonly string[] | undefined | null): string[] {
  const out = (list ?? []).map(clean).filter(Boolean);
  if (new Set(out).size !== out.length) throw badRequest("duplicate_serial");
  if (out.some((s) => s.length > 40)) throw badRequest("serial_too_long");
  return out;
}

async function trackedItem(tx: Tx, companyId: string, itemId: string) {
  const [it] = await tx.select({ id: tables.items.id, name: tables.items.name, track: tables.items.trackSerials, companyId: tables.items.companyId }).from(tables.items).where(eq(tables.items.id, itemId));
  if (!it || it.companyId !== companyId) throw badRequest("unknown_item");
  return it;
}

/** Turns serial tracking on for an item, or off once none of its pieces are held by serial. */
export async function setTrackSerials(tx: Tx, actor: Actor, itemId: string, on: boolean) {
  const company = await resolveCompany(tx);
  const it = await trackedItem(tx, company.id, itemId);
  if (!on) {
    const [held] = await tx.select({ id: tables.itemSerials.id }).from(tables.itemSerials).where(and(eq(tables.itemSerials.itemId, itemId), eq(tables.itemSerials.status, "in_stock"))).limit(1);
    if (held) throw conflict("serials_in_stock");
  }
  await tx.update(tables.items).set({ trackSerials: on }).where(eq(tables.items.id, itemId));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "item", entityId: itemId, before: { trackSerials: it.track }, after: { trackSerials: on }, ip: actor.ip });
}

/** Records pieces coming into a store with their serial numbers. A serial can belong to an item only once. */
export async function registerSerials(tx: Tx, actor: Actor, input: { itemId: string; warehouseId: string; serials: string[]; date: string; source?: { kind: "receipt" | "manual"; id?: string | undefined } | undefined }) {
  const company = await resolveCompany(tx);
  const it = await trackedItem(tx, company.id, input.itemId);
  if (!it.track) throw badRequest("serials_not_tracked");
  const serials = normalizeSerials(input.serials);
  if (!serials.length) throw badRequest("no_serials");
  if (serials.length > 5000) throw badRequest("too_many_serials");
  const [w] = await tx.select({ id: tables.warehouses.id }).from(tables.warehouses).where(and(eq(tables.warehouses.id, input.warehouseId), eq(tables.warehouses.companyId, company.id)));
  if (!w) throw badRequest("unknown_warehouse");
  const clash = await tx.select({ serial: tables.itemSerials.serial }).from(tables.itemSerials).where(and(eq(tables.itemSerials.itemId, input.itemId), sql`upper(${tables.itemSerials.serial}) in (${sql.join(serials.map((s) => sql`${s}`), sql`, `)})`));
  if (clash.length) throw conflict("serial_exists");
  await tx.insert(tables.itemSerials).values(serials.map((serial) => ({
    tenantId: actor.tenantId, companyId: company.id, itemId: input.itemId, serial, status: "in_stock", warehouseId: input.warehouseId, receivedOn: input.date,
    sourceKind: input.source?.kind ?? "manual", sourceId: input.source?.id ?? null, createdBy: actor.userId,
  })));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "item_serials", entityId: input.itemId, after: { count: serials.length, source: input.source?.kind ?? "manual" }, ip: actor.ip });
  return { added: serials.length };
}

/** Marks pieces sold on a bill: each must be in stock in the counter's store, and the count must match the quantity. */
export async function sellSerials(tx: Tx, input: { itemId: string; warehouseId: string; qty: string; serials: string[] | undefined; billId: string; date: string }) {
  const serials = normalizeSerials(input.serials);
  if (!dec(input.qty).isInteger()) throw badRequest("serial_qty_must_be_whole");
  if (serials.length !== dec(input.qty).toNumber()) throw badRequest("serials_count_mismatch");
  const rows = await tx.select().from(tables.itemSerials).where(and(eq(tables.itemSerials.itemId, input.itemId), sql`upper(${tables.itemSerials.serial}) in (${sql.join(serials.map((s) => sql`${s}`), sql`, `)})`)).for("update");
  if (rows.length !== serials.length) throw badRequest("serial_unknown");
  for (const r of rows) {
    if (r.status !== "in_stock") throw conflict("serial_not_in_stock");
    if (r.warehouseId !== input.warehouseId) throw conflict("serial_in_other_store");
  }
  await tx.update(tables.itemSerials).set({ status: "sold", soldBillId: input.billId, soldOn: input.date }).where(inArray(tables.itemSerials.id, rows.map((r) => r.id)));
  return serials;
}

/** Puts every piece sold on a voided bill back in stock. */
export async function restoreBillSerials(tx: Tx, billId: string) {
  await tx.update(tables.itemSerials).set({ status: "in_stock", soldBillId: null, soldOn: null }).where(eq(tables.itemSerials.soldBillId, billId));
}

/** Pieces coming back on a return: the ones named, or if none are named, the line's own pieces that have not come back. */
export async function returnSerials(tx: Tx, input: { billId: string; itemId: string; qty: string; named?: string[] | undefined; warehouseId: string }) {
  const rows = await tx.select().from(tables.itemSerials).where(and(eq(tables.itemSerials.soldBillId, input.billId), eq(tables.itemSerials.itemId, input.itemId), eq(tables.itemSerials.status, "sold"))).orderBy(asc(tables.itemSerials.serial));
  const want = dec(input.qty).toNumber();
  const named = normalizeSerials(input.named);
  const chosen = named.length ? rows.filter((r) => named.includes(clean(r.serial))) : rows.slice(0, want);
  if (named.length && chosen.length !== named.length) throw badRequest("serial_not_on_bill");
  if (chosen.length !== want) throw badRequest("serials_count_mismatch");
  await tx.update(tables.itemSerials).set({ status: "in_stock", soldBillId: null, soldOn: null, warehouseId: input.warehouseId }).where(inArray(tables.itemSerials.id, chosen.map((r) => r.id)));
}

/** The life of one serial number: the item, where it is now, where it came in and the bill it left on. */
export async function lookupSerial(tx: Tx, serial: string) {
  const company = await resolveCompany(tx);
  const s = clean(serial);
  if (!s) throw badRequest("no_serials");
  const rows = await tx.select({ r: tables.itemSerials, item: tables.items.name, store: tables.warehouses.name, bill: tables.posBills.number }).from(tables.itemSerials)
    .innerJoin(tables.items, eq(tables.items.id, tables.itemSerials.itemId)).leftJoin(tables.warehouses, eq(tables.warehouses.id, tables.itemSerials.warehouseId)).leftJoin(tables.posBills, eq(tables.posBills.id, tables.itemSerials.soldBillId))
    .where(and(eq(tables.itemSerials.companyId, company.id), sql`upper(${tables.itemSerials.serial}) = ${s}`));
  if (!rows.length) throw notFound("serial_unknown");
  return rows.map(({ r, item, store, bill }) => ({ id: r.id, itemId: r.itemId, item, serial: r.serial, status: r.status, store, receivedOn: r.receivedOn, source: r.sourceKind, soldOn: r.soldOn, soldBill: bill }));
}

export async function listSerials(tx: Tx, itemId: string, status?: string) {
  const company = await resolveCompany(tx);
  const rows = await tx.select({ r: tables.itemSerials, store: tables.warehouses.name, bill: tables.posBills.number }).from(tables.itemSerials)
    .leftJoin(tables.warehouses, eq(tables.warehouses.id, tables.itemSerials.warehouseId)).leftJoin(tables.posBills, eq(tables.posBills.id, tables.itemSerials.soldBillId))
    .where(and(eq(tables.itemSerials.companyId, company.id), eq(tables.itemSerials.itemId, itemId), status ? eq(tables.itemSerials.status, status) : undefined)).orderBy(asc(tables.itemSerials.serial)).limit(2000);
  return rows.map(({ r, store, bill }) => ({ id: r.id, serial: r.serial, status: r.status, store, receivedOn: r.receivedOn, soldOn: r.soldOn, soldBill: bill }));
}

/** For each tracked item, the pieces in stock against the serials held: a gap means pieces came in without being named, or went out unnamed. */
export async function serialCheck(tx: Tx) {
  const company = await resolveCompany(tx);
  const items = await tx.select({ id: tables.items.id, name: tables.items.name }).from(tables.items).where(and(eq(tables.items.companyId, company.id), eq(tables.items.trackSerials, true)));
  if (!items.length) return { items: [], gaps: 0 };
  const positions = await stockPositions(tx, company, "9999-12-31", { itemIds: items.map((i) => i.id) });
  const held = await tx.select({ itemId: tables.itemSerials.itemId, n: sql<number>`count(*)::int` }).from(tables.itemSerials).where(and(eq(tables.itemSerials.companyId, company.id), eq(tables.itemSerials.status, "in_stock"))).groupBy(tables.itemSerials.itemId);
  const rows = items.map((i) => {
    const stock = positions.filter((p) => p.itemId === i.id).reduce((t, p) => t.plus(p.qty), dec(0));
    const serials = held.find((h) => h.itemId === i.id)?.n ?? 0;
    return { itemId: i.id, item: i.name, stock: stock.toFixed(0), serials, gap: stock.minus(serials).toFixed(0) };
  });
  return { items: rows, gaps: rows.filter((r) => r.gap !== "0").length };
}

/** A cancelled receipt takes its serials out again, unless one of the pieces has already been sold. */
export async function removeReceiptSerials(tx: Tx, receiptId: string) {
  const rows = await tx.select().from(tables.itemSerials).where(and(eq(tables.itemSerials.sourceKind, "receipt"), eq(tables.itemSerials.sourceId, receiptId)));
  if (rows.some((r) => r.status !== "in_stock")) throw conflict("serials_sold");
  if (rows.length) await tx.delete(tables.itemSerials).where(inArray(tables.itemSerials.id, rows.map((r) => r.id)));
}
