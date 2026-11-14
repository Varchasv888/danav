import { and, asc, eq } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { businessDate, dec, inspectionProblems, inspectionState, remainingToInspect } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";
import { postStockJournal } from "./inventory.js";
import { recordLoss, type LossReason } from "./losses.js";

/**
 * Goods a customer sent back and ticked "inspect first" wait in the Quality hold godown. Restocking moves them to a godown that
 * sells; writing off goes through the stock loss rules, so a large write-off still needs an approver. Whatever is not decided
 * stays on hold.
 */
interface Actor { tenantId: string; userId: string; ip?: string | undefined }

export async function listInspections(tx: Tx, status?: "pending" | "done", companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const rows = await tx.select({ r: tables.returnInspections, item: tables.items.name, color: tables.items.color, size: tables.items.size, customer: tables.accounts.name, godown: tables.warehouses.name })
    .from(tables.returnInspections).innerJoin(tables.items, eq(tables.items.id, tables.returnInspections.itemId)).innerJoin(tables.warehouses, eq(tables.warehouses.id, tables.returnInspections.warehouseId))
    .leftJoin(tables.accounts, eq(tables.accounts.id, tables.returnInspections.customerId))
    .where(and(eq(tables.returnInspections.companyId, company.id), status ? eq(tables.returnInspections.status, status) : undefined)).orderBy(asc(tables.returnInspections.createdAt)).limit(400);
  return rows.map((x) => ({
    id: x.r.id, sourceType: x.r.sourceType, sourceNumber: x.r.sourceNumber, customer: x.customer, itemId: x.r.itemId, item: x.item, color: x.color, size: x.size, godown: x.godown,
    qty: dec(x.r.qty).toFixed(4), restocked: dec(x.r.restockedQty).toFixed(4), writtenOff: dec(x.r.writtenOffQty).toFixed(4),
    remaining: remainingToInspect({ qty: x.r.qty, restocked: x.r.restockedQty, writtenOff: x.r.writtenOffQty }).toFixed(4), status: x.r.status, createdAt: x.r.createdAt, note: x.r.note,
  }));
}

export async function decideInspection(tx: Tx, actor: Actor, canApprove: boolean, id: string, d: { restock?: string | undefined; writeOff?: string | undefined; restockTo?: string | undefined; reason?: LossReason | undefined; note?: string | undefined }) {
  const [row] = await tx.select().from(tables.returnInspections).where(eq(tables.returnInspections.id, id)).for("update");
  if (!row) throw notFound();
  if (row.status === "done") throw conflict("inspection_done");
  const restock = dec(d.restock ?? 0), writeOff = dec(d.writeOff ?? 0);
  const problems = inspectionProblems({ qty: row.qty, restocked: row.restockedQty, writtenOff: row.writtenOffQty }, { restock, writeOff });
  if (problems.length) throw badRequest(problems[0]!);
  const company = await resolveCompany(tx, row.companyId);
  if (restock.gt(0)) {
    let dest = d.restockTo;
    if (!dest) {
      const [w] = await tx.select({ id: tables.warehouses.id }).from(tables.warehouses)
        .where(and(eq(tables.warehouses.companyId, company.id), eq(tables.warehouses.isDefault, true), eq(tables.warehouses.qualityHold, false)));
      dest = w?.id;
    }
    if (!dest) throw badRequest("restock_godown_required");
    const [target] = await tx.select({ id: tables.warehouses.id, hold: tables.warehouses.qualityHold }).from(tables.warehouses).where(and(eq(tables.warehouses.id, dest), eq(tables.warehouses.companyId, company.id)));
    if (!target || target.hold || target.id === row.warehouseId) throw badRequest("unknown_warehouse");
    await postStockJournal(tx, actor, { companyId: company.id, kind: "transfer", date: businessDate(), narration: `Return inspection: ${row.sourceNumber} restocked`,
      lines: [{ itemId: row.itemId, warehouseId: row.warehouseId, toWarehouseId: dest, qty: restock.toFixed(4) }] });
  }
  if (writeOff.gt(0)) {
    await recordLoss(tx, actor, canApprove, { itemId: row.itemId, warehouseId: row.warehouseId, qty: writeOff.toFixed(4), reason: d.reason ?? "damaged", note: d.note ?? `Return inspection: ${row.sourceNumber}` });
  }
  const restocked = dec(row.restockedQty).plus(restock), writtenOff = dec(row.writtenOffQty).plus(writeOff);
  await tx.update(tables.returnInspections).set({
    restockedQty: restocked.toFixed(4), writtenOffQty: writtenOff.toFixed(4), status: inspectionState({ qty: row.qty, restocked, writtenOff }),
    note: d.note?.trim().slice(0, 300) || row.note, decidedBy: actor.userId, decidedAt: new Date(),
  }).where(eq(tables.returnInspections.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "return_inspection", entityId: id, after: { restock: restock.toFixed(4), writeOff: writeOff.toFixed(4), source: row.sourceNumber }, ip: actor.ip });
  return (await listInspections(tx, undefined, company.id)).find((x) => x.id === id)!;
}
