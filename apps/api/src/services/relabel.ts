import { desc, eq, inArray } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec, money } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";
import { documentNumber } from "./inventory.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

const SERIES = { docType: "relabel", name: "Re-labelling", pattern: "RL/{FY}/{SEQ:5}" };

/** What re-labelling may change on an item. The barcode stays as it is, which is the point: the labels already on the goods keep scanning. */
export const RELABEL_FIELDS = ["name", "color", "size", "fit", "mrp", "saleRate"] as const;
export type RelabelField = (typeof RELABEL_FIELDS)[number];
export interface RelabelChange { itemId: string; name?: string | undefined; color?: string | null | undefined; size?: string | null | undefined; fit?: string | null | undefined; mrp?: string | null | undefined; saleRate?: string | undefined }

/**
 * Changes what existing items are called or priced, on one numbered voucher that keeps every old value beside the new one. Documents already made
 * are never rewritten; labels are printed afresh from the new values.
 */
export async function relabel(tx: Tx, actor: Actor, input: { date: string; reason: string; changes: RelabelChange[] }) {
  const company = await resolveCompany(tx);
  if (!input.changes.length) throw badRequest("no_lines");
  if (new Set(input.changes.map((c) => c.itemId)).size !== input.changes.length) throw badRequest("item_twice");
  const items = await tx.select().from(tables.items).where(inArray(tables.items.id, input.changes.map((c) => c.itemId)));
  const rows: { itemId: string; before: Record<string, unknown>; after: Record<string, unknown> }[] = [];
  for (const c of input.changes) {
    const it = items.find((x) => x.id === c.itemId);
    if (!it || it.companyId !== company.id) throw badRequest("unknown_item");
    const before: Record<string, unknown> = {};
    const after: Record<string, unknown> = {};
    const set: Partial<typeof tables.items.$inferInsert> = {};
    const note = (k: RelabelField, was: unknown, now: unknown) => { if (was !== now) { before[k] = was; after[k] = now; } };
    if (c.name !== undefined) { const v = c.name.trim(); if (!v) throw badRequest("name_required"); note("name", it.name, v); set.name = v; }
    if (c.color !== undefined) { const v = c.color?.trim() || null; note("color", it.color, v); set.color = v; }
    if (c.size !== undefined) { const v = c.size?.trim() || null; note("size", it.size, v); set.size = v; }
    if (c.fit !== undefined) { const v = c.fit?.trim() || null; note("fit", it.fit, v); set.fit = v; }
    if (c.mrp !== undefined) { const v = c.mrp === null ? null : money(c.mrp); if (v !== null && dec(v).lte(0)) throw badRequest("invalid_amount"); note("mrp", it.mrp, v); set.mrp = v; }
    if (c.saleRate !== undefined) { const v = money(c.saleRate); note("saleRate", money(it.saleRate), v); set.saleRate = v; }
    if (!Object.keys(after).length) continue;
    try { await tx.update(tables.items).set({ ...set, updatedAt: new Date() }).where(eq(tables.items.id, it.id)); } catch (e) {
      if ((e as { cause?: { code?: string } })?.cause?.code === "23505") throw conflict("item_name_taken");
      throw e;
    }
    rows.push({ itemId: it.id, before, after });
  }
  if (!rows.length) throw badRequest("nothing_changed");
  const number = await documentNumber(tx, actor, company, input.date, SERIES);
  const [r] = await tx.insert(tables.relabels).values({ tenantId: actor.tenantId, companyId: company.id, number, date: input.date, reason: input.reason.trim(), changes: rows, createdBy: actor.userId }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "relabel", entityId: r!.id, after: { number, items: rows.length, reason: input.reason }, ip: actor.ip });
  return r!;
}

export async function listRelabels(tx: Tx) {
  const company = await resolveCompany(tx);
  return tx.select().from(tables.relabels).where(eq(tables.relabels.companyId, company.id)).orderBy(desc(tables.relabels.date), desc(tables.relabels.number)).limit(200);
}

export async function getRelabel(tx: Tx, id: string) {
  const [r] = await tx.select().from(tables.relabels).where(eq(tables.relabels.id, id));
  if (!r) throw notFound();
  const ids = r.changes.map((c) => c.itemId);
  const names = ids.length ? await tx.select({ id: tables.items.id, name: tables.items.name, barcode: tables.items.barcode }).from(tables.items).where(inArray(tables.items.id, ids)) : [];
  return { ...r, changes: r.changes.map((c) => ({ ...c, barcode: names.find((n) => n.id === c.itemId)?.barcode ?? null, current: names.find((n) => n.id === c.itemId)?.name ?? "" })) };
}
