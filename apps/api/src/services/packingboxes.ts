import { and, asc, desc, eq, inArray, isNull } from "drizzle-orm";
import { tables, type PackingBoxContents, type Tx } from "@varchasv/db";
import { businessDate, comparePacking, dec } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";
import { documentNumber } from "./inventory.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }
export interface PackingBoxLineInput { itemId: string; qty: string }

const SERIES = { docType: "packing_box", name: "Packing boxes", pattern: "BOX/{FY}/{SEQ:4}" };
const today = () => businessDate();

async function currentContents(tx: Tx, boxId: string): Promise<PackingBoxContents[]> {
  const [latest] = await tx.select({ contents: tables.packingBoxEvents.afterContents })
    .from(tables.packingBoxEvents).where(eq(tables.packingBoxEvents.boxId, boxId))
    .orderBy(desc(tables.packingBoxEvents.sequence)).limit(1);
  return latest?.contents ?? [];
}

/** Mutations hold the parent box row lock, so this sequence advances in commit-safe operation order. */
async function nextEventSequence(tx: Tx, boxId: string): Promise<number> {
  const [latest] = await tx.select({ sequence: tables.packingBoxEvents.sequence })
    .from(tables.packingBoxEvents).where(eq(tables.packingBoxEvents.boxId, boxId))
    .orderBy(desc(tables.packingBoxEvents.sequence)).limit(1);
  return (latest?.sequence ?? 0) + 1;
}

/** Company context intentionally exposes only fields needed by inventory workflows and box labels. */
export async function listPackingBoxCompanies(tx: Tx) {
  return tx.select({ id: tables.companies.id, name: tables.companies.name, legalName: tables.companies.legalName })
    .from(tables.companies).orderBy(asc(tables.companies.createdAt));
}

async function loadBox(tx: Tx, id: string, companyId?: string, lock = false) {
  const company = await resolveCompany(tx, companyId);
  const query = tx.select().from(tables.packingBoxes)
    .where(and(eq(tables.packingBoxes.id, id), eq(tables.packingBoxes.companyId, company.id)));
  const [box] = lock ? await query.for("update") : await query;
  if (!box) throw notFound("packing_box_not_found");
  return box;
}

/** Creates a numbered open box and its initial event in one tenant transaction. */
export async function createPackingBox(tx: Tx, actor: Actor, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const code = await documentNumber(tx, actor, company, today(), SERIES);
  const [box] = await tx.insert(tables.packingBoxes).values({
    tenantId: actor.tenantId, companyId: company.id, code, createdBy: actor.userId,
  }).returning();
  await tx.insert(tables.packingBoxEvents).values({
    tenantId: actor.tenantId, boxId: box!.id, actorId: actor.userId, operation: "create", sequence: 1, beforeContents: [], afterContents: [],
  });
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "packing_box", entityId: box!.id, after: { code, status: "open" }, ip: actor.ip });
  return getPackingBox(tx, box!.id, company.id);
}

/** Lists company boxes with their current contents; this is packaging metadata only. */
export async function listPackingBoxes(tx: Tx, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const boxes = await tx.select().from(tables.packingBoxes).where(eq(tables.packingBoxes.companyId, company.id))
    .orderBy(desc(tables.packingBoxes.createdAt), desc(tables.packingBoxes.code)).limit(200);
  if (!boxes.length) return [];
  const lines = await tx.select({
    boxId: tables.packingBoxLines.boxId, itemId: tables.packingBoxLines.itemId, itemName: tables.items.name,
    sku: tables.items.sku, barcode: tables.items.barcode, color: tables.items.color, size: tables.items.size, fit: tables.items.fit, qty: tables.packingBoxLines.qty,
  }).from(tables.packingBoxLines).innerJoin(tables.items, eq(tables.items.id, tables.packingBoxLines.itemId))
    .where(inArray(tables.packingBoxLines.boxId, boxes.map((box) => box.id)))
    .orderBy(asc(tables.items.name));
  return boxes.map((box) => ({ ...box, lines: lines.filter((line) => line.boxId === box.id).map(({ boxId: _boxId, ...line }) => line) }));
}

/** Reads one company-scoped box and its append-only snapshots. */
export async function getPackingBox(tx: Tx, id: string, companyId?: string) {
  const box = await loadBox(tx, id, companyId);
  const [company, lines, events] = await Promise.all([
    tx.select({ id: tables.companies.id, name: tables.companies.name, legalName: tables.companies.legalName })
      .from(tables.companies).where(eq(tables.companies.id, box.companyId)).then((rows) => rows[0]),
    tx.select({ itemId: tables.packingBoxLines.itemId, itemName: tables.items.name, sku: tables.items.sku, barcode: tables.items.barcode, color: tables.items.color, size: tables.items.size, fit: tables.items.fit, qty: tables.packingBoxLines.qty })
      .from(tables.packingBoxLines).innerJoin(tables.items, eq(tables.items.id, tables.packingBoxLines.itemId))
      .where(eq(tables.packingBoxLines.boxId, id)).orderBy(asc(tables.items.name)),
    tx.select().from(tables.packingBoxEvents).where(eq(tables.packingBoxEvents.boxId, id)).orderBy(asc(tables.packingBoxEvents.sequence)),
  ]);
  return { ...box, company, lines, events };
}

/** Replaces an open box's contents, packs it, and records the before/after snapshot atomically. */
export async function repackBox(tx: Tx, actor: Actor, id: string, input: { companyId?: string | undefined; lines: PackingBoxLineInput[]; reason?: string | undefined }) {
  const box = await loadBox(tx, id, input.companyId, true);
  if (box.status !== "open") throw conflict("packing_box_not_open");
  if (!input.lines.length) throw badRequest("packing_box_empty");
  if (new Set(input.lines.map((line) => line.itemId)).size !== input.lines.length) throw badRequest("packing_box_duplicate_item");

  for (const line of input.lines) {
    if (!dec(line.qty).gt(0)) throw badRequest("qty_must_be_positive");
  }
  const items = await tx.select({
    id: tables.items.id, companyId: tables.items.companyId, kind: tables.items.kind, archived: tables.items.archived,
    name: tables.items.name, sku: tables.items.sku, barcode: tables.items.barcode, color: tables.items.color, size: tables.items.size, fit: tables.items.fit,
  })
    .from(tables.items).where(inArray(tables.items.id, input.lines.map((line) => line.itemId)));
  const valid = new Set(items.filter((item) => item.companyId === box.companyId && item.kind === "goods" && !item.archived).map((item) => item.id));
  if (valid.size !== input.lines.length || input.lines.some((line) => !valid.has(line.itemId))) throw badRequest("packing_box_invalid_item");

  const beforeContents = await currentContents(tx, id);
  const sequence = await nextEventSequence(tx, id);
  const itemById = new Map(items.map((item) => [item.id, item]));
  const afterContents = input.lines.map((line) => {
    const item = itemById.get(line.itemId)!;
    return { itemId: line.itemId, name: item.name, sku: item.sku, barcode: item.barcode, color: item.color, size: item.size, fit: item.fit, qty: dec(line.qty).toFixed(4) };
  });
  await tx.delete(tables.packingBoxLines).where(eq(tables.packingBoxLines.boxId, id));
  await tx.insert(tables.packingBoxLines).values(afterContents.map((line) => ({ tenantId: actor.tenantId, boxId: id, ...line })));
  await tx.update(tables.packingBoxes).set({ status: "packed", updatedAt: new Date() }).where(eq(tables.packingBoxes.id, id));
  await tx.insert(tables.packingBoxEvents).values({
    tenantId: actor.tenantId, boxId: id, actorId: actor.userId, operation: "repack", sequence, reason: input.reason?.trim() || null, beforeContents, afterContents,
  });
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "packing_box", entityId: id, before: { status: "open", contents: beforeContents }, after: { status: "packed", contents: afterContents }, ip: actor.ip });
  return getPackingBox(tx, id, box.companyId);
}

/** Reopens a packed box without changing its contents or affecting stock. */
export async function reopenBox(tx: Tx, actor: Actor, id: string, input: { companyId?: string | undefined; reason: string }) {
  const reason = input.reason.trim();
  if (reason.length < 3) throw badRequest("reason_required");
  const box = await loadBox(tx, id, input.companyId, true);
  if (box.status !== "packed") throw conflict("packing_box_not_packed");
  if (box.deliveryNoteId) throw conflict("packing_box_on_challan"); // take it off the packing list first
  const contents = await currentContents(tx, id);
  const sequence = await nextEventSequence(tx, id);
  await tx.update(tables.packingBoxes).set({ status: "open", updatedAt: new Date() }).where(eq(tables.packingBoxes.id, id));
  await tx.insert(tables.packingBoxEvents).values({
    tenantId: actor.tenantId, boxId: id, actorId: actor.userId, operation: "reopen", sequence, reason, beforeContents: contents, afterContents: contents,
  });
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "packing_box", entityId: id, before: { status: "packed" }, after: { status: "open", reason }, ip: actor.ip });
  return getPackingBox(tx, id, box.companyId);
}

// ---- packing list of a challan ------------------------------------------------------------------------

async function loadNote(tx: Tx, noteId: string) {
  const [note] = await tx.select().from(tables.deliveryNotes).where(eq(tables.deliveryNotes.id, noteId));
  if (!note) throw notFound();
  return note;
}

/** Puts packed cartons on a challan's packing list. A carton can travel with one challan, and only a packed one can be listed. */
export async function attachBoxes(tx: Tx, actor: Actor, noteId: string, boxIds: string[]) {
  const note = await loadNote(tx, noteId);
  if (note.status === "cancelled") throw conflict("challan_cancelled");
  const boxes = await tx.select().from(tables.packingBoxes).where(inArray(tables.packingBoxes.id, boxIds)).for("update");
  if (boxes.length !== new Set(boxIds).size || boxes.some((b) => b.companyId !== note.companyId)) throw badRequest("unknown_box");
  for (const b of boxes) {
    if (b.status !== "packed") throw conflict("packing_box_not_packed");
    if (b.deliveryNoteId && b.deliveryNoteId !== noteId) throw conflict("packing_box_on_other_challan");
  }
  await tx.update(tables.packingBoxes).set({ deliveryNoteId: noteId, updatedAt: new Date() }).where(inArray(tables.packingBoxes.id, boxes.map((b) => b.id)));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "delivery_note", entityId: noteId, after: { packingList: boxes.map((b) => b.code) }, ip: actor.ip });
  return packingList(tx, noteId);
}

export async function detachBox(tx: Tx, actor: Actor, noteId: string, boxId: string) {
  const [box] = await tx.update(tables.packingBoxes).set({ deliveryNoteId: null, updatedAt: new Date() })
    .where(and(eq(tables.packingBoxes.id, boxId), eq(tables.packingBoxes.deliveryNoteId, noteId))).returning({ code: tables.packingBoxes.code });
  if (!box) throw notFound();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "delivery_note", entityId: noteId, after: { packingListRemoved: box.code }, ip: actor.ip });
  return packingList(tx, noteId);
}

/** The challan, its cartons with contents, and whether the cartons add up to the challan item by item. Also lists packed cartons free to add. */
export async function packingList(tx: Tx, noteId: string) {
  const note = await loadNote(tx, noteId);
  const [customer] = await tx.select({ name: tables.accounts.name }).from(tables.accounts).where(eq(tables.accounts.id, note.customerId));
  const lines = await tx.select({ itemId: tables.deliveryNoteLines.itemId, qty: tables.deliveryNoteLines.qty, name: tables.items.name, size: tables.items.size, color: tables.items.color })
    .from(tables.deliveryNoteLines).innerJoin(tables.items, eq(tables.items.id, tables.deliveryNoteLines.itemId)).where(eq(tables.deliveryNoteLines.noteId, noteId));
  const boxes = await tx.select().from(tables.packingBoxes).where(eq(tables.packingBoxes.deliveryNoteId, noteId)).orderBy(asc(tables.packingBoxes.code));
  const boxLines = boxes.length ? await tx.select({ boxId: tables.packingBoxLines.boxId, itemId: tables.packingBoxLines.itemId, qty: tables.packingBoxLines.qty, name: tables.items.name, size: tables.items.size, color: tables.items.color })
    .from(tables.packingBoxLines).innerJoin(tables.items, eq(tables.items.id, tables.packingBoxLines.itemId)).where(inArray(tables.packingBoxLines.boxId, boxes.map((b) => b.id))).orderBy(asc(tables.items.name)) : [];
  const free = await tx.select({ id: tables.packingBoxes.id, code: tables.packingBoxes.code }).from(tables.packingBoxes)
    .where(and(eq(tables.packingBoxes.companyId, note.companyId), eq(tables.packingBoxes.status, "packed"), isNull(tables.packingBoxes.deliveryNoteId))).orderBy(desc(tables.packingBoxes.createdAt)).limit(100);
  const names = new Map([...lines, ...boxLines].map((l) => [l.itemId, [l.name, l.color, l.size].filter(Boolean).join(" ")]));
  const cmp = comparePacking(lines.map((l) => ({ itemId: l.itemId, qty: l.qty })), boxes.map((b) => ({ id: b.id, code: b.code, lines: boxLines.filter((l) => l.boxId === b.id).map((l) => ({ itemId: l.itemId, qty: l.qty })) })));
  return {
    note: { id: note.id, number: note.number, date: note.date, status: note.status, customer: customer?.name ?? null },
    boxes: boxes.map((b) => ({ id: b.id, code: b.code, lines: boxLines.filter((l) => l.boxId === b.id).map((l) => ({ itemId: l.itemId, item: names.get(l.itemId) ?? "", qty: l.qty })) })),
    comparison: { ...cmp, rows: cmp.rows.map((r) => ({ ...r, item: names.get(r.itemId) ?? "" })) },
    availableBoxes: free,
  };
}
