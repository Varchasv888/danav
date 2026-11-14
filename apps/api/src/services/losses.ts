import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { businessDate, dec, money } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, forbidden, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";
import { currentRate, documentNumber, postStockJournal } from "./inventory.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

export const LOSS_REASONS = ["damaged", "lost", "theft", "expired", "sample", "other"] as const;
export type LossReason = (typeof LOSS_REASONS)[number];
const LOSS_SERIES = { docType: "stock_loss", name: "Stock losses", pattern: "SL/{FY}/{SEQ:5}" };

export async function lossSettings(tx: Tx) {
  const company = await resolveCompany(tx);
  return { approvalLimit: company.lossApprovalLimit };
}

export async function setLossSettings(tx: Tx, actor: Actor, input: { approvalLimit: string }) {
  const company = await resolveCompany(tx);
  await tx.update(tables.companies).set({ lossApprovalLimit: money(input.approvalLimit) }).where(eq(tables.companies.id, company.id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "loss_settings", entityId: company.id, before: { approvalLimit: company.lossApprovalLimit }, after: { approvalLimit: money(input.approvalLimit) }, ip: actor.ip });
  return { approvalLimit: money(input.approvalLimit) };
}

/** Takes the pieces out of stock with a stock journal and marks the loss approved. */
async function writeOff(tx: Tx, actor: Actor, loss: typeof tables.stockLosses.$inferSelect, decidedBy: string) {
  const { journal } = await postStockJournal(tx, actor, {
    companyId: loss.companyId, kind: "issue", date: loss.date, narration: `Stock loss ${loss.number} (${loss.reason})`,
    lines: [{ itemId: loss.itemId, warehouseId: loss.warehouseId, qty: loss.qty }],
  });
  await tx.update(tables.stockLosses).set({ status: "approved", journalId: journal.id, decidedBy, decidedAt: new Date() }).where(eq(tables.stockLosses.id, loss.id));
}

/**
 * Records stock lost or damaged. Someone who may approve inventory, or a loss within the business's limit (valued at cost), goes straight
 * out of stock. A bigger one waits for a second person with the right; nothing leaves stock until then.
 */
export async function recordLoss(tx: Tx, actor: Actor, canApprove: boolean, input: { itemId: string; warehouseId: string; qty: string; reason: LossReason; note?: string | null | undefined; fileId?: string | null | undefined; date?: string | undefined }) {
  if (!(LOSS_REASONS as readonly string[]).includes(input.reason)) throw badRequest("invalid_reason");
  if (!dec(input.qty).gt(0)) throw badRequest("qty_must_be_positive");
  const company = await resolveCompany(tx);
  const date = input.date ?? businessDate();
  const [item] = await tx.select().from(tables.items).where(and(eq(tables.items.id, input.itemId), eq(tables.items.companyId, company.id)));
  if (!item || item.kind !== "goods") throw badRequest("unknown_item");
  const [wh] = await tx.select({ id: tables.warehouses.id }).from(tables.warehouses).where(and(eq(tables.warehouses.id, input.warehouseId), eq(tables.warehouses.companyId, company.id)));
  if (!wh) throw badRequest("unknown_warehouse");
  if (input.fileId) {
    const [f] = await tx.select({ id: tables.files.id }).from(tables.files).where(eq(tables.files.id, input.fileId));
    if (!f) throw badRequest("unknown_file");
  }
  const rate = await currentRate(tx, company, item.id, input.warehouseId, date);
  const value = dec(rate).times(input.qty);
  const number = await documentNumber(tx, actor, company, date, LOSS_SERIES);
  const [loss] = await tx.insert(tables.stockLosses).values({
    tenantId: actor.tenantId, companyId: company.id, number, date, itemId: item.id, warehouseId: input.warehouseId, qty: input.qty, value: money(value),
    reason: input.reason, note: input.note ?? null, fileId: input.fileId ?? null, requestedBy: actor.userId,
  }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "stock_loss", entityId: loss!.id, after: { number, item: item.name, qty: input.qty, value: money(value), reason: input.reason }, ip: actor.ip });
  if (canApprove || value.lte(company.lossApprovalLimit)) {
    await writeOff(tx, actor, loss!, actor.userId);
    return { ...loss!, status: "approved" as const };
  }
  return loss!;
}

/** A second person approves (stock goes out) or rejects (nothing changes). Nobody decides their own request. */
export async function decideLoss(tx: Tx, actor: Actor, id: string, input: { decision: "approve" | "reject"; note?: string | undefined }) {
  const [loss] = await tx.select().from(tables.stockLosses).where(eq(tables.stockLosses.id, id)).for("update");
  if (!loss) throw notFound();
  if (loss.status !== "pending") throw conflict("loss_already_decided");
  if (loss.requestedBy === actor.userId) throw forbidden("cannot_approve_own_loss");
  if (input.decision === "approve") await writeOff(tx, actor, loss, actor.userId);
  else await tx.update(tables.stockLosses).set({ status: "rejected", decidedBy: actor.userId, decidedAt: new Date() }).where(eq(tables.stockLosses.id, id));
  if (input.note) await tx.update(tables.stockLosses).set({ decisionNote: input.note }).where(eq(tables.stockLosses.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "stock_loss", entityId: id, after: { decision: input.decision, number: loss.number }, ip: actor.ip });
  const [row] = await tx.select().from(tables.stockLosses).where(eq(tables.stockLosses.id, id));
  return row!;
}

export async function listLosses(tx: Tx, status?: string) {
  const rows = await tx.select({ l: tables.stockLosses, item: tables.items.name, warehouse: tables.warehouses.name, by: tables.users.name }).from(tables.stockLosses)
    .innerJoin(tables.items, eq(tables.items.id, tables.stockLosses.itemId))
    .innerJoin(tables.warehouses, eq(tables.warehouses.id, tables.stockLosses.warehouseId))
    .leftJoin(tables.users, eq(tables.users.id, tables.stockLosses.requestedBy))
    .where(status ? eq(tables.stockLosses.status, status) : undefined).orderBy(desc(tables.stockLosses.date), desc(tables.stockLosses.number)).limit(300);
  return rows.map((r) => ({ ...r.l, item: r.item, warehouse: r.warehouse, requestedByName: r.by }));
}

/** What was written off in a period, by reason and by month: the stock audit view of losses. */
export async function lossReport(tx: Tx, from: string, to: string) {
  const company = await resolveCompany(tx);
  const rows = await tx.select({
    reason: tables.stockLosses.reason, n: sql<number>`count(*)::int`, qty: sql<string>`sum(${tables.stockLosses.qty})`, value: sql<string>`sum(${tables.stockLosses.value})`,
  }).from(tables.stockLosses).where(and(eq(tables.stockLosses.companyId, company.id), eq(tables.stockLosses.status, "approved"), gte(tables.stockLosses.date, from), lte(tables.stockLosses.date, to)))
    .groupBy(tables.stockLosses.reason);
  const months = await tx.select({ month: sql<string>`to_char(${tables.stockLosses.date}, 'YYYY-MM')`, value: sql<string>`sum(${tables.stockLosses.value})` }).from(tables.stockLosses)
    .where(and(eq(tables.stockLosses.companyId, company.id), eq(tables.stockLosses.status, "approved"), gte(tables.stockLosses.date, from), lte(tables.stockLosses.date, to)))
    .groupBy(sql`to_char(${tables.stockLosses.date}, 'YYYY-MM')`).orderBy(sql`to_char(${tables.stockLosses.date}, 'YYYY-MM')`);
  const total = rows.reduce((t, r) => t.plus(r.value), dec(0));
  const [pending] = await tx.select({ n: sql<number>`count(*)::int`, value: sql<string>`coalesce(sum(${tables.stockLosses.value}), 0)` }).from(tables.stockLosses)
    .where(and(eq(tables.stockLosses.companyId, company.id), eq(tables.stockLosses.status, "pending")));
  return {
    from, to, total: money(total),
    byReason: rows.map((r) => ({ reason: r.reason, count: r.n, qty: r.qty, value: money(r.value) })).sort((a, b) => Number(b.value) - Number(a.value)),
    byMonth: months.map((m) => ({ month: m.month, value: money(m.value) })),
    pending: { count: pending!.n, value: money(pending!.value) },
  };
}
