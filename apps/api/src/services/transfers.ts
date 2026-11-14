import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { assertPeriodOpen, fiscalYearForDate, resolveCompany } from "./accounting.js";
import { currentRate, documentNumber, postMoves, reverseMoves, type Move } from "./inventory.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

const SERIES = { docType: "stock_transfer", name: "Stock transfers", pattern: "TR/{FY}/{SEQ:5}" };
const q4 = (v: string | number | { toString(): string }) => dec(v.toString()).toDecimalPlaces(4).toFixed(4);

/** The company's "In transit" warehouse, made on first use. */
export async function transitWarehouse(tx: Tx, tenantId: string, companyId: string) {
  const [w] = await tx.select().from(tables.warehouses).where(and(eq(tables.warehouses.companyId, companyId), eq(tables.warehouses.inTransit, true), eq(tables.warehouses.name, "In transit")));
  if (w) return w;
  const [made] = await tx.insert(tables.warehouses).values({ tenantId, companyId, name: "In transit", inTransit: true }).returning();
  return made!;
}

export interface TransferInput {
  fromWarehouseId: string; toWarehouseId: string; date: string; transporter?: string | undefined; vehicleNo?: string | undefined; narration?: string | undefined;
  lines: { itemId: string; qty: string }[];
}

/** Sends stock to another warehouse: it leaves the source now and sits in transit until the other side receives it. */
export async function dispatchTransfer(tx: Tx, actor: Actor, input: TransferInput) {
  const company = await resolveCompany(tx);
  if (input.fromWarehouseId === input.toWarehouseId) throw badRequest("transfer_needs_two_warehouses");
  if (!input.lines.length) throw badRequest("no_lines");
  const whs = await tx.select().from(tables.warehouses).where(inArray(tables.warehouses.id, [input.fromWarehouseId, input.toWarehouseId]));
  if (whs.length !== 2 || whs.some((w) => w.companyId !== company.id || w.inTransit)) throw badRequest("unknown_warehouse");
  if (new Set(input.lines.map((l) => l.itemId)).size !== input.lines.length) throw badRequest("item_twice");
  for (const l of input.lines) if (!dec(l.qty).gt(0)) throw badRequest("qty_must_be_positive");
  const transit = await transitWarehouse(tx, actor.tenantId, company.id);
  const number = await documentNumber(tx, actor, company, input.date, SERIES);
  const [t] = await tx.insert(tables.stockTransfers).values({
    tenantId: actor.tenantId, companyId: company.id, number, date: input.date, fromWarehouseId: input.fromWarehouseId, toWarehouseId: input.toWarehouseId,
    transporter: input.transporter ?? null, vehicleNo: input.vehicleNo ?? null, narration: input.narration ?? null, createdBy: actor.userId,
  }).returning();
  await tx.insert(tables.stockTransferLines).values(input.lines.map((l, i) => ({ tenantId: actor.tenantId, transferId: t!.id, lineNo: i + 1, itemId: l.itemId, qty: q4(l.qty) })));
  const moves: Move[] = [];
  for (const l of input.lines) {
    const cost = await currentRate(tx, company, l.itemId, input.fromWarehouseId, input.date);
    moves.push({ itemId: l.itemId, warehouseId: input.fromWarehouseId, date: input.date, qtyOut: l.qty }, { itemId: l.itemId, warehouseId: transit.id, date: input.date, qtyIn: l.qty, rate: cost });
  }
  const { warnings } = await postMoves(tx, company, "stock_transfer", t!.id, moves);
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "stock_transfer", entityId: t!.id, after: { number, lines: input.lines.length }, ip: actor.ip });
  return { transfer: t!, warnings };
}

export interface ReceiveInput { date: string; lines: { lineId: string; received: string }[] }

/** The other side counts what arrived: it enters the destination, and any shortage leaves transit as a recorded loss. */
export async function receiveTransfer(tx: Tx, actor: Actor, id: string, input: ReceiveInput) {
  const [t] = await tx.select().from(tables.stockTransfers).where(eq(tables.stockTransfers.id, id)).for("update");
  if (!t) throw notFound();
  if (t.status !== "in_transit") throw conflict("transfer_not_in_transit");
  if (input.date < t.date) throw badRequest("received_before_sent");
  const company = await resolveCompany(tx, t.companyId);
  assertPeriodOpen(await fiscalYearForDate(tx, actor.tenantId, company, input.date), input.date);
  const lines = await tx.select().from(tables.stockTransferLines).where(eq(tables.stockTransferLines.transferId, id)).orderBy(asc(tables.stockTransferLines.lineNo));
  const transit = await transitWarehouse(tx, actor.tenantId, company.id);
  const sent = await tx.select().from(tables.stockLedger).where(and(eq(tables.stockLedger.sourceType, "stock_transfer"), eq(tables.stockLedger.sourceId, id), eq(tables.stockLedger.warehouseId, transit.id)));
  const moves: Move[] = [];
  let short = dec(0);
  for (const l of lines) {
    const got = input.lines.find((x) => x.lineId === l.id);
    const received = dec(got?.received ?? "0");
    if (!got || received.lt(0)) throw badRequest("receipt_line_missing");
    if (received.gt(l.qty)) throw badRequest("received_more_than_sent");
    const lost = dec(l.qty).minus(received);
    short = short.plus(lost);
    const rate = sent.find((s) => s.itemId === l.itemId)?.rate ?? "0";
    moves.push({ itemId: l.itemId, warehouseId: transit.id, date: input.date, qtyOut: l.qty });
    if (received.gt(0)) moves.push({ itemId: l.itemId, warehouseId: t.toWarehouseId, date: input.date, qtyIn: q4(received), rate });
    await tx.update(tables.stockTransferLines).set({ receivedQty: q4(received), shortQty: q4(lost) }).where(eq(tables.stockTransferLines.id, l.id));
  }
  await postMoves(tx, company, "transfer_receipt", id, moves);
  await tx.update(tables.stockTransfers).set({ status: "received", receivedOn: input.date }).where(eq(tables.stockTransfers.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "stock_transfer", entityId: id, after: { status: "received", short: q4(short) }, ip: actor.ip });
  return { short: q4(short) };
}

/** A transfer nothing has received can be called back: the stock returns to the source. */
export async function cancelTransfer(tx: Tx, actor: Actor, id: string, reason: string) {
  const [t] = await tx.select().from(tables.stockTransfers).where(eq(tables.stockTransfers.id, id)).for("update");
  if (!t) throw notFound();
  if (t.status === "cancelled") throw conflict("already_cancelled");
  if (t.status !== "in_transit") throw conflict("transfer_already_received");
  const company = await resolveCompany(tx, t.companyId);
  assertPeriodOpen(await fiscalYearForDate(tx, actor.tenantId, company, t.date), t.date);
  await reverseMoves(tx, "stock_transfer", id);
  await tx.update(tables.stockTransfers).set({ status: "cancelled" }).where(eq(tables.stockTransfers.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "cancel", entity: "stock_transfer", entityId: id, after: { reason }, ip: actor.ip });
}

export async function listTransfers(tx: Tx, q: { status?: string | undefined }) {
  const company = await resolveCompany(tx);
  const rows = await tx.select().from(tables.stockTransfers)
    .where(and(eq(tables.stockTransfers.companyId, company.id), q.status ? eq(tables.stockTransfers.status, q.status) : undefined))
    .orderBy(desc(tables.stockTransfers.date), desc(tables.stockTransfers.createdAt)).limit(300);
  if (!rows.length) return [];
  const whs = await tx.select({ id: tables.warehouses.id, name: tables.warehouses.name }).from(tables.warehouses).where(eq(tables.warehouses.companyId, company.id));
  const lines = await tx.select().from(tables.stockTransferLines).where(inArray(tables.stockTransferLines.transferId, rows.map((r) => r.id)));
  const name = (wid: string) => whs.find((w) => w.id === wid)?.name ?? "";
  return rows.map((r) => {
    const mine = lines.filter((l) => l.transferId === r.id);
    const pieces = (f: (l: (typeof mine)[number]) => string) => q4(mine.reduce((s, l) => s.plus(f(l)), dec(0)));
    return { ...r, from: name(r.fromWarehouseId), to: name(r.toWarehouseId), pieces: pieces((l) => l.qty), received: pieces((l) => l.receivedQty), short: pieces((l) => l.shortQty) };
  });
}

export async function getTransfer(tx: Tx, id: string) {
  const [t] = await tx.select().from(tables.stockTransfers).where(eq(tables.stockTransfers.id, id));
  if (!t) throw notFound();
  const lines = await tx.select({ line: tables.stockTransferLines, name: tables.items.name }).from(tables.stockTransferLines)
    .innerJoin(tables.items, eq(tables.items.id, tables.stockTransferLines.itemId)).where(eq(tables.stockTransferLines.transferId, id)).orderBy(asc(tables.stockTransferLines.lineNo));
  const whs = await tx.select({ id: tables.warehouses.id, name: tables.warehouses.name }).from(tables.warehouses).where(inArray(tables.warehouses.id, [t.fromWarehouseId, t.toWarehouseId]));
  return { ...t, from: whs.find((w) => w.id === t.fromWarehouseId)?.name ?? "", to: whs.find((w) => w.id === t.toWarehouseId)?.name ?? "", lines: lines.map((l) => ({ ...l.line, name: l.name })) };
}

/** Stock sitting in transit right now, by item, with the transfer it belongs to. */
export async function inTransitStock(tx: Tx) {
  const company = await resolveCompany(tx);
  const rows = await tx.select({ t: tables.stockTransfers, l: tables.stockTransferLines, name: tables.items.name }).from(tables.stockTransferLines)
    .innerJoin(tables.stockTransfers, eq(tables.stockTransfers.id, tables.stockTransferLines.transferId))
    .innerJoin(tables.items, eq(tables.items.id, tables.stockTransferLines.itemId))
    .where(and(eq(tables.stockTransfers.companyId, company.id), eq(tables.stockTransfers.status, "in_transit")));
  return rows.map((r) => ({ transferId: r.t.id, number: r.t.number, date: r.t.date, itemId: r.l.itemId, name: r.name, qty: r.l.qty }));
}
