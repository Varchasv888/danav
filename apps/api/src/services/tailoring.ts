import { and, desc, eq, inArray } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec, money, type PosPayment, businessDate } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";
import { documentNumber } from "./inventory.js";
import { ensureServiceItem, postKarigarLabour } from "./alterations.js";
import { createBill } from "./pos.js";
import { issueGiftVouchers } from "./vouchers.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }
type Order = typeof tables.tailoringOrders.$inferSelect;

const SERIES = { docType: "tailoring_order", name: "Tailoring orders", pattern: "TLR/{FY}/{SEQ:5}" };
const STITCHING_ITEM = { name: "Tailoring charges", hsn: "998821", gstRate: "5" };
const today = () => businessDate();
const plusYear = (iso: string) => `${Number(iso.slice(0, 4)) + 1}${iso.slice(4)}`;

// ---- measurements and rates -------------------------------------------------------------------------

export interface MeasurementInput {
  customerPhone: string; customerName?: string | undefined; garment: string; values: Record<string, string>;
  photoFileId?: string | null | undefined; notes?: string | null | undefined; takenOn?: string | undefined;
}

export async function saveMeasurement(tx: Tx, actor: Actor, input: MeasurementInput, id?: string) {
  const company = await resolveCompany(tx);
  if (input.photoFileId) {
    const [f] = await tx.select({ companyId: tables.files.companyId, contentType: tables.files.contentType }).from(tables.files).where(eq(tables.files.id, input.photoFileId));
    if (!f || f.companyId !== company.id || !f.contentType.startsWith("image/")) throw badRequest("unknown_photo");
  }
  const values = Object.fromEntries(Object.entries(input.values).map(([k, v]) => [k.trim(), v.trim()]).filter(([k, v]) => k && v));
  if (!Object.keys(values).length) throw badRequest("no_measurements");
  const row = {
    customerPhone: input.customerPhone, customerName: input.customerName ?? null, garment: input.garment.trim(), values,
    photoFileId: input.photoFileId ?? null, notes: input.notes ?? null, takenOn: input.takenOn ?? today(),
  };
  const [m] = await (id
    ? tx.update(tables.measurements).set(row).where(and(eq(tables.measurements.id, id), eq(tables.measurements.companyId, company.id))).returning()
    : tx.insert(tables.measurements).values({ tenantId: actor.tenantId, companyId: company.id, ...row }).returning());
  if (!m) throw notFound();
  return m;
}

export async function measurementsFor(tx: Tx, phone: string) {
  const company = await resolveCompany(tx);
  return tx.select().from(tables.measurements).where(and(eq(tables.measurements.companyId, company.id), eq(tables.measurements.customerPhone, phone))).orderBy(desc(tables.measurements.takenOn));
}

/** Replaces the process rates (the order given is the order processes run in). */
export async function setRates(tx: Tx, actor: Actor, rows: { garment: string; process: string; rate: string }[]) {
  const company = await resolveCompany(tx);
  const keys = rows.map((r) => `${r.garment.trim().toLowerCase()}|${r.process.trim().toLowerCase()}`);
  if (new Set(keys).size !== keys.length) throw badRequest("duplicate_rate");
  await tx.delete(tables.tailoringRates).where(eq(tables.tailoringRates.companyId, company.id));
  if (rows.length) {
    await tx.insert(tables.tailoringRates).values(rows.map((r, i) => ({
      tenantId: actor.tenantId, companyId: company.id, garment: r.garment.trim(), process: r.process.trim(), rate: money(r.rate), position: i,
    })));
  }
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "tailoring_rates", entityId: company.id, after: { rows: rows.length }, ip: actor.ip });
  return listRates(tx);
}

export async function listRates(tx: Tx) {
  const company = await resolveCompany(tx);
  return tx.select().from(tables.tailoringRates).where(eq(tables.tailoringRates.companyId, company.id)).orderBy(tables.tailoringRates.position);
}

// ---- orders -------------------------------------------------------------------------------------------

export interface TailoringInput {
  date: string; customerName: string; customerPhone: string;
  lines: { garment: string; qty: number; price: string; measurementId?: string | undefined; notes?: string | undefined; fabricItemId?: string | undefined; fabricQty?: string | undefined }[];
  advance?: string | undefined; advancePaidBy?: "cash" | "upi" | "card" | undefined; trialOn?: string | undefined; deliveryOn: string; notes?: string | undefined;
}

export async function createTailoringOrder(tx: Tx, actor: Actor, input: TailoringInput) {
  const company = await resolveCompany(tx);
  if (input.deliveryOn < input.date) throw badRequest("delivery_before_date");
  if (input.trialOn && (input.trialOn < input.date || input.trialOn > input.deliveryOn)) throw badRequest("trial_out_of_range");
  const rates = await listRates(tx);
  const mIds = input.lines.flatMap((l) => (l.measurementId ? [l.measurementId] : []));
  const ms = mIds.length ? await tx.select({ id: tables.measurements.id, companyId: tables.measurements.companyId }).from(tables.measurements).where(inArray(tables.measurements.id, mIds)) : [];
  const fIds = input.lines.flatMap((l) => (l.fabricItemId ? [l.fabricItemId] : []));
  const fabrics = fIds.length ? await tx.select().from(tables.items).where(inArray(tables.items.id, fIds)) : [];
  let fabricValue = dec(0);
  const lines = input.lines.map((l) => {
    if (l.measurementId && !ms.some((m) => m.id === l.measurementId && m.companyId === company.id)) throw badRequest("unknown_measurement");
    if (l.fabricItemId) {
      const f = fabrics.find((x) => x.id === l.fabricItemId);
      if (!f || f.companyId !== company.id || f.kind !== "goods") throw badRequest("unknown_fabric");
      if (!l.fabricQty || !dec(l.fabricQty).gt(0)) throw badRequest("fabric_qty_required");
      fabricValue = fabricValue.plus(dec(f.saleRate).times(l.fabricQty));
    }
    const processes = rates.filter((r) => r.garment.toLowerCase() === l.garment.trim().toLowerCase())
      .map((r) => ({ process: r.process, rate: r.rate, karigarId: null, doneOn: null, voucherId: null }));
    return {
      garment: l.garment.trim(), qty: l.qty, price: money(l.price), measurementId: l.measurementId ?? null, ...(l.notes ? { notes: l.notes } : {}),
      fabricItemId: l.fabricItemId ?? null, fabricQty: l.fabricItemId ? dec(l.fabricQty!).toFixed(4) : null, processes,
    };
  });
  const stitching = lines.reduce((s, l) => s.plus(dec(l.price).times(l.qty)), dec(0));
  const total = stitching.plus(fabricValue);
  const advance = dec(input.advance ?? 0);
  if (advance.gt(total)) throw badRequest("advance_more_than_total");
  const number = await documentNumber(tx, actor, company, input.date, SERIES);
  // The advance is store credit kept for this order: it pays part of the tailoring bill at delivery.
  let advanceVoucherId: string | null = null;
  if (advance.gt(0)) {
    const [gv] = await issueGiftVouchers(tx, actor, {
      value: money(advance), count: 1, expiresOn: plusYear(input.deliveryOn), paidBy: input.advancePaidBy ?? "cash", date: input.date,
      customerPhone: input.customerPhone, customerName: input.customerName,
    });
    advanceVoucherId = gv!.id;
  }
  const [row] = await tx.insert(tables.tailoringOrders).values({
    tenantId: actor.tenantId, companyId: company.id, number, date: input.date, customerName: input.customerName.trim(), customerPhone: input.customerPhone,
    lines, total: money(total), advance: money(advance), advanceVoucherId, trialOn: input.trialOn ?? null, deliveryOn: input.deliveryOn, notes: input.notes ?? null, createdBy: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "tailoring_order", entityId: row!.id, after: { number, total: row!.total, advance: row!.advance }, ip: actor.ip });
  return row!;
}

async function load(tx: Tx, id: string) {
  const [o] = await tx.select().from(tables.tailoringOrders).where(eq(tables.tailoringOrders.id, id)).for("update");
  if (!o) throw notFound();
  if (o.status === "delivered" || o.status === "cancelled") throw conflict("order_closed");
  return o;
}

const step = (o: Order, line: number, proc: number) => {
  const p = o.lines[line]?.processes[proc];
  if (!p) throw badRequest("unknown_process");
  return p;
};

/** A process of a garment given to a karigar. */
export async function assignProcess(tx: Tx, actor: Actor, id: string, input: { line: number; process: number; karigarId: string }) {
  const o = await load(tx, id);
  const p = step(o, input.line, input.process);
  if (p.doneOn) throw conflict("process_done");
  const [k] = await tx.select().from(tables.karigars).where(eq(tables.karigars.id, input.karigarId));
  if (!k || k.companyId !== o.companyId || !k.active) throw badRequest("unknown_karigar");
  p.karigarId = k.id;
  const [row] = await tx.update(tables.tailoringOrders).set({ lines: o.lines, status: o.status === "booked" ? "in_work" : o.status }).where(eq(tables.tailoringOrders.id, id)).returning();
  return row!;
}

/** A process finished: an outside karigar is credited the labour; when every process is done the order is ready. */
export async function completeProcess(tx: Tx, actor: Actor, id: string, input: { line: number; process: number; date: string }) {
  const o = await load(tx, id);
  const p = step(o, input.line, input.process);
  if (p.doneOn) throw conflict("process_done");
  if (!p.karigarId) throw badRequest("assign_first");
  if (input.date < o.date) throw badRequest("date_before_order");
  const [k] = await tx.select().from(tables.karigars).where(eq(tables.karigars.id, p.karigarId));
  const labour = dec(p.rate).times(o.lines[input.line]!.qty);
  if (k?.accountId && labour.gt(0)) {
    p.voucherId = await postKarigarLabour(tx, actor, o.companyId, k.accountId, money(labour), input.date, `Tailoring ${o.number}: ${p.process}, ${o.lines[input.line]!.garment} (${k.name})`);
  }
  p.doneOn = input.date;
  const allDone = o.lines.every((l) => l.processes.every((x) => x.doneOn));
  const [row] = await tx.update(tables.tailoringOrders).set({ lines: o.lines, status: allDone ? "ready" : "in_work" }).where(eq(tables.tailoringOrders.id, id)).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "tailoring_order", entityId: id, after: { process: p.process, done: input.date }, ip: actor.ip });
  return row!;
}

/** Order without processes (nothing set up for the garment) can be marked ready by hand. */
export async function markReady(tx: Tx, actor: Actor, id: string) {
  const o = await load(tx, id);
  if (o.lines.some((l) => l.processes.some((p) => !p.doneOn))) throw conflict("processes_pending");
  const [row] = await tx.update(tables.tailoringOrders).set({ status: "ready" }).where(eq(tables.tailoringOrders.id, id)).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "tailoring_order", entityId: id, after: { status: "ready" }, ip: actor.ip });
  return row!;
}

/** The tailoring bill: stitching plus any fabric from stock, on a counter bill, with the advance taken off. */
export async function deliverTailoring(tx: Tx, actor: Actor, id: string, input: { terminalId: string; payments: PosPayment[] }) {
  const o = await load(tx, id);
  if (o.status !== "ready") throw conflict("not_ready");
  const company = await resolveCompany(tx, o.companyId);
  const stitchingItem = await ensureServiceItem(tx, company, STITCHING_ITEM);
  const stitching = o.lines.reduce((s, l) => s.plus(dec(l.price).times(l.qty)), dec(0));
  const lines = [
    ...(stitching.gt(0) ? [{ itemId: stitchingItem, qty: "1", price: money(stitching) }] : []),
    ...o.lines.filter((l) => l.fabricItemId).map((l) => ({ itemId: l.fabricItemId!, qty: l.fabricQty! })),
  ];
  let giftVouchers: { code: string; amount: string }[] = [];
  if (o.advanceVoucherId) {
    const [gv] = await tx.select().from(tables.giftVouchers).where(eq(tables.giftVouchers.id, o.advanceVoucherId));
    if (gv && gv.status === "active" && dec(gv.balance).gt(0)) giftVouchers = [{ code: gv.code, amount: money(dec(gv.balance).lt(o.total) ? gv.balance : o.total) }];
  }
  const r = await createBill(tx, actor, { terminalId: input.terminalId, lines, payments: input.payments, giftVouchers, customerPhone: o.customerPhone, customerName: o.customerName });
  const [row] = await tx.update(tables.tailoringOrders).set({ status: "delivered", deliveredOn: today(), deliveryBillId: r.bill.id }).where(eq(tables.tailoringOrders.id, id)).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "tailoring_order", entityId: id, after: { status: "delivered", bill: r.bill.number }, ip: actor.ip });
  return { ...row!, billNumber: r.bill.number, billTotal: r.bill.total };
}

/** Cancelled before delivery: the advance stays as store credit with the customer's code. */
export async function cancelTailoring(tx: Tx, actor: Actor, id: string, reason: string) {
  const o = await load(tx, id);
  await tx.update(tables.tailoringOrders).set({ status: "cancelled", notes: [o.notes, `Cancelled: ${reason}`].filter(Boolean).join("\n") }).where(eq(tables.tailoringOrders.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "cancel", entity: "tailoring_order", entityId: id, after: { reason }, ip: actor.ip });
}

/** Orders with their alerts: trial due (today or past, not ready), delivery today, overdue. */
export async function listTailoring(tx: Tx, q: { status?: string | undefined }) {
  const company = await resolveCompany(tx);
  const day = today();
  const rows = await tx.select({ o: tables.tailoringOrders, code: tables.giftVouchers.code, credit: tables.giftVouchers.balance }).from(tables.tailoringOrders)
    .leftJoin(tables.giftVouchers, eq(tables.giftVouchers.id, tables.tailoringOrders.advanceVoucherId))
    .where(and(
      eq(tables.tailoringOrders.companyId, company.id),
      q.status === "open" ? inArray(tables.tailoringOrders.status, ["booked", "in_work", "ready"]) : q.status ? eq(tables.tailoringOrders.status, q.status) : undefined,
    )).orderBy(tables.tailoringOrders.deliveryOn).limit(500);
  const karigars = await tx.select({ id: tables.karigars.id, name: tables.karigars.name }).from(tables.karigars).where(eq(tables.karigars.companyId, company.id));
  const open = (s: string) => s === "booked" || s === "in_work" || s === "ready";
  return rows.map(({ o, code, credit }) => ({
    ...o, advanceCode: code, advanceLeft: credit,
    lines: o.lines.map((l) => ({ ...l, processes: l.processes.map((p) => ({ ...p, karigar: karigars.find((k) => k.id === p.karigarId)?.name ?? null })) })),
    trialDue: open(o.status) && o.status !== "ready" && !!o.trialOn && o.trialOn <= day,
    dueToday: open(o.status) && o.deliveryOn === day,
    overdue: open(o.status) && o.deliveryOn < day,
  }));
}

