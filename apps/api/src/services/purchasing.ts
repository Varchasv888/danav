import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { computeInvoiceTax, dec, lineGstRate, money, type InvoiceTax, type TaxContext } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { assertPeriodOpen, cancelVoucher, fiscalYearForDate, postVoucher, resolveCompany } from "./accounting.js";
import { resolvePostingAccountIds } from "./ledgerparameters.js";
import { documentNumber, ensureInventory, postMoves, reverseMoves, type Move } from "./inventory.js";
import { normalizeSerials, registerSerials, removeReceiptSerials } from "./serials.js";

export const PURCHASE_SERIES = {
  order: { docType: "purchase_order", name: "Purchase orders", pattern: "PO/{FY}/{SEQ:5}" },
  receipt: { docType: "goods_receipt", name: "Goods receipts", pattern: "GRN/{FY}/{SEQ:5}" },
  bill: { docType: "purchase_bill", name: "Purchase bills", pattern: "PB/{FY}/{SEQ:5}" },
  debitNote: { docType: "debit_note", name: "Debit notes", pattern: "DN/{FY}/{SEQ:5}" },
};

interface Actor { tenantId: string; userId: string; ip?: string | undefined }
type Company = Awaited<ReturnType<typeof resolveCompany>>;

export interface PriceLine {
  itemId: string;
  qty: string;
  rate: string;
  discount?: string | undefined;
  gstRate?: string | undefined;
  cessRate?: string | undefined;
  description?: string | undefined;
}

const q4 = (v: string | number | ReturnType<typeof dec>) => dec(v).toDecimalPlaces(4).toFixed(4);

// ---- shared helpers -----------------------------------------------------------------------------

/** The supplier must be a ledger under Sundry Creditors (or a sub-group of it). */
async function loadSupplier(tx: Tx, companyId: string, supplierId: string) {
  const [row] = await tx
    .select({ account: tables.accounts, groupKey: tables.accountGroups.key, parentKey: sql<string | null>`(select g2.key from account_groups g2 where g2.id = ${tables.accountGroups.parentId})` })
    .from(tables.accounts)
    .innerJoin(tables.accountGroups, eq(tables.accountGroups.id, tables.accounts.groupId))
    .where(eq(tables.accounts.id, supplierId));
  if (!row || row.account.companyId !== companyId) throw badRequest("unknown_supplier");
  if (row.groupKey !== "sundry_creditors" && row.parentKey !== "sundry_creditors") throw badRequest("not_a_supplier");
  if (row.account.archived) throw badRequest("account_archived");
  return row.account;
}

async function loadBranch(tx: Tx, companyId: string, branchId?: string) {
  const rows = await tx.select().from(tables.branches)
    .where(and(eq(tables.branches.companyId, companyId), branchId ? eq(tables.branches.id, branchId) : eq(tables.branches.isHeadOffice, true)))
    .limit(1);
  if (!rows[0]) throw badRequest("unknown_branch");
  return rows[0];
}

/** Purchases: the supplier's state against our branch's state decides CGST+SGST or IGST. */
function purchaseContext(supplier: { stateCode: string | null }, branch: { stateCode: string }, reverseCharge = false): TaxContext {
  return { supplierState: supplier.stateCode ?? branch.stateCode, placeOfSupply: branch.stateCode, reverseCharge };
}

/** Lines with their item; the GST rate is the line's own, or the item's (by price per piece for apparel and footwear). */
async function priceLines<L extends PriceLine>(tx: Tx, companyId: string, lines: L[], date: string) {
  if (!lines.length) throw badRequest("no_lines");
  const ids = [...new Set(lines.map((l) => l.itemId))];
  const its = await tx.select().from(tables.items).where(inArray(tables.items.id, ids));
  return lines.map((l) => {
    const it = its.find((i) => i.id === l.itemId);
    if (!it || it.companyId !== companyId) throw badRequest("unknown_item");
    if (it.archived) throw badRequest("item_archived");
    if (!dec(l.qty).gt(0)) throw badRequest("qty_must_be_positive");
    return { ...l, item: it, gstRate: l.gstRate ?? lineGstRate(it, l, date), cessRate: l.cessRate ?? it.cessRate, discount: l.discount ?? "0" };
  });
}

const taxFields = (t: { taxableValue: string; cgst: string; sgst: string; utgst: string; igst: string; cess: string; total?: string }) => ({
  taxable: t.taxableValue, cgst: t.cgst, sgst: t.sgst, utgst: t.utgst, igst: t.igst, cess: t.cess,
});

const TAX_KEYS = ["cgst", "sgst", "utgst", "igst", "cess"] as const;

/**
 * GL lines for a purchase (direction "in") or a purchase return (direction "out").
 * Purchase: Dr Purchases + Dr input GST, Cr supplier. Under reverse charge the tax is also
 * credited to output GST (we owe it to the government, not the supplier).
 */
async function purchaseGlLines(tx: Tx, companyId: string, supplierId: string, tax: InvoiceTax, reverseCharge: boolean, direction: "in" | "out") {
  const dr = direction === "in" ? "debit" : "credit";
  const cr = direction === "in" ? "credit" : "debit";
  const purchaseKey = direction === "in" ? "purchases" : "purchase_returns";
  const postingKeys = [purchaseKey];
  for (const key of TAX_KEYS) {
    if (dec(tax[key]).isZero()) continue;
    postingKeys.push(`input_${key}`);
    if (reverseCharge) postingKeys.push(`output_${key}`);
  }
  const ro = dec(tax.roundOff);
  if (!ro.isZero()) postingKeys.push("round_off");
  const accounts = await resolvePostingAccountIds(tx, companyId, postingKeys);
  const lines: { accountId: string; debit?: string; credit?: string }[] = [];
  lines.push({ accountId: accounts[purchaseKey]!, [dr]: tax.taxableValue });
  for (const k of TAX_KEYS) {
    if (dec(tax[k]).isZero()) continue;
    lines.push({ accountId: accounts[`input_${k}`]!, [dr]: tax[k] });
    if (reverseCharge) lines.push({ accountId: accounts[`output_${k}`]!, [cr]: tax[k] });
  }
  if (!ro.isZero()) {
    const roundOff = accounts.round_off!;
    lines.push(ro.gt(0) === (direction === "in") ? { accountId: roundOff, debit: money(ro.abs()) } : { accountId: roundOff, credit: money(ro.abs()) });
  }
  lines.push({ accountId: supplierId, [cr]: tax.grandTotal });
  return lines;
}

async function defaultWarehouse(tx: Tx, company: Company) {
  await ensureInventory(tx, company.tenantId, company.id);
  const [w] = await tx.select().from(tables.warehouses)
    .where(and(eq(tables.warehouses.companyId, company.id), eq(tables.warehouses.archived, false), eq(tables.warehouses.qualityHold, false)))
    .orderBy(sql`${tables.warehouses.isDefault} desc`, asc(tables.warehouses.createdAt))
    .limit(1);
  return w!.id;
}

async function refreshOrderStatus(tx: Tx, orderId: string) {
  const [o] = await tx.select().from(tables.purchaseOrders).where(eq(tables.purchaseOrders.id, orderId));
  if (!o || o.status === "cancelled" || o.status === "closed") return;
  const lines = await tx.select().from(tables.purchaseOrderLines).where(eq(tables.purchaseOrderLines.orderId, orderId));
  const all = lines.every((l) => dec(l.receivedQty).gte(l.qty));
  const some = lines.some((l) => dec(l.receivedQty).gt(0));
  await tx.update(tables.purchaseOrders).set({ status: all ? "received" : some ? "partial" : "open" }).where(eq(tables.purchaseOrders.id, orderId));
}

// ---- purchase orders ----------------------------------------------------------------------------

export interface OrderInput { companyId?: string | undefined; branchId?: string | undefined; supplierId: string; date: string; expectedOn?: string | undefined; narration?: string | undefined; lines: PriceLine[] }

export async function createPurchaseOrder(tx: Tx, actor: Actor, input: OrderInput, canApprove = true) {
  const company = await resolveCompany(tx, input.companyId);
  const supplier = await loadSupplier(tx, company.id, input.supplierId);
  const branch = await loadBranch(tx, company.id, input.branchId);
  const lines = await priceLines(tx, company.id, input.lines, input.date);
  const tax = computeInvoiceTax(lines, purchaseContext(supplier, branch));
  const number = await documentNumber(tx, actor, company, input.date, PURCHASE_SERIES.order);
  // An order above the company's limit waits for someone with the purchase approve right, unless that is who raised it.
  const pending = !canApprove && company.purchaseApprovalLimit !== null && dec(tax.grandTotal).gt(company.purchaseApprovalLimit);
  const [order] = await tx.insert(tables.purchaseOrders).values({
    approvalStatus: pending ? "pending" : "approved", approvedBy: pending ? null : actor.userId, approvedAt: pending ? null : new Date(),
    tenantId: actor.tenantId, companyId: company.id, branchId: branch.id, supplierId: supplier.id, number, date: input.date,
    expectedOn: input.expectedOn ?? null, supplyKind: tax.supplyKind, narration: input.narration ?? null, ...taxFields(tax), total: tax.grandTotal, createdBy: actor.userId,
  }).returning();
  await tx.insert(tables.purchaseOrderLines).values(lines.map((l, i) => ({
    tenantId: actor.tenantId, orderId: order!.id, lineNo: i + 1, itemId: l.itemId, description: l.description ?? null,
    qty: q4(l.qty), rate: l.rate, discount: money(l.discount), gstRate: l.gstRate, cessRate: l.cessRate, ...taxFields(tax.lines[i]!), total: tax.lines[i]!.total,
  })));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "purchase_order", entityId: order!.id, after: { number, supplier: supplier.name, total: tax.grandTotal, approval: pending ? "pending" : "approved" }, ip: actor.ip });
  return order!;
}

/** Approves or rejects an order that is waiting. A rejected order is cancelled; nothing could have been received on it. */
export async function decidePurchaseOrder(tx: Tx, actor: Actor, orderId: string, decision: "approve" | "reject", note?: string) {
  const [o] = await tx.select().from(tables.purchaseOrders).where(eq(tables.purchaseOrders.id, orderId)).for("update");
  if (!o) throw notFound();
  if (o.approvalStatus !== "pending") throw conflict("order_not_waiting");
  if (decision === "reject" && !note?.trim()) throw badRequest("reason_required");
  await tx.update(tables.purchaseOrders).set({
    approvalStatus: decision === "approve" ? "approved" : "rejected", approvedBy: actor.userId, approvedAt: new Date(), approvalNote: note?.trim().slice(0, 200) || null,
    ...(decision === "reject" ? { status: "cancelled" } : {}),
  }).where(eq(tables.purchaseOrders.id, orderId));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: decision === "approve" ? "update" : "cancel", entity: "purchase_order", entityId: orderId, after: { approval: decision, note: note?.trim() }, ip: actor.ip });
}

/** Goods cannot be received or billed on an order that is waiting for approval or was rejected. */
export function assertOrderApproved(o: { approvalStatus: string }) {
  if (o.approvalStatus !== "approved") throw conflict("order_not_approved");
}

export async function purchaseApprovalLimit(tx: Tx, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  return { limit: company.purchaseApprovalLimit };
}

/** Sets the value above which a purchase order needs approval; null removes the limit. */
export async function setPurchaseApprovalLimit(tx: Tx, actor: Actor, limit: string | null) {
  const company = await resolveCompany(tx);
  await tx.update(tables.companies).set({ purchaseApprovalLimit: limit === null ? null : money(limit) }).where(eq(tables.companies.id, company.id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "purchase_approval_limit", entityId: company.id, before: { limit: company.purchaseApprovalLimit }, after: { limit }, ip: actor.ip });
  return { limit: limit === null ? null : money(limit) };
}

export async function setOrderStatus(tx: Tx, actor: Actor, orderId: string, status: "closed" | "cancelled") {
  const [o] = await tx.select().from(tables.purchaseOrders).where(eq(tables.purchaseOrders.id, orderId)).for("update");
  if (!o) throw notFound();
  if (o.status === "cancelled" || o.status === "closed") throw conflict("order_not_open");
  if (status === "cancelled") {
    const [received] = await tx.select({ id: tables.purchaseOrderLines.id }).from(tables.purchaseOrderLines)
      .where(and(eq(tables.purchaseOrderLines.orderId, orderId), sql`${tables.purchaseOrderLines.receivedQty} > 0 or ${tables.purchaseOrderLines.billedQty} > 0`)).limit(1);
    if (received) throw conflict("order_has_receipts");
  }
  await tx.update(tables.purchaseOrders).set({ status }).where(eq(tables.purchaseOrders.id, orderId));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: status === "cancelled" ? "cancel" : "update", entity: "purchase_order", entityId: orderId, after: { status }, ip: actor.ip });
}

// ---- goods receipts -----------------------------------------------------------------------------

export interface ReceiptInput {
  companyId?: string | undefined; supplierId: string; orderId?: string | undefined; warehouseId?: string | undefined;
  date: string; supplierChallan?: string | undefined; narration?: string | undefined;
  transporter?: string | undefined; lrNumber?: string | undefined; lrDate?: string | undefined;
  landedCharges?: { description: string; sourceDocument: string; grossAmount: string; recoverableGst?: string | undefined; allocationBasis: "direct" | "weight" | "volume" | "net_value" | "units"; allocations: { lineIndex: number; amount: string }[] }[] | undefined;
  /** mrp: the printed price for the piece; the item's MRP is set to it (labels print it). qty is what is accepted into stock; challanQty what the challan said; short, damaged and hold what did not go into stock (hold waits in the Quality hold warehouse for inspection). */
  lines: { itemId: string; qty: string; rate?: string | undefined; landedCostPerUnit?: string | undefined; landedCostNote?: string | undefined; mrp?: string | undefined; orderLineId?: string | undefined; batchNo?: string | undefined; expiry?: string | undefined; saleRate?: string | undefined; challanQty?: string | undefined; short?: string | undefined; damaged?: string | undefined; defectCode?: string | undefined; hold?: string | undefined; serials?: string[] | undefined }[];
}

export async function createGoodsReceipt(tx: Tx, actor: Actor, input: ReceiptInput) {
  const company = await resolveCompany(tx, input.companyId);
  const supplier = await loadSupplier(tx, company.id, input.supplierId);
  const warehouseId = input.warehouseId ?? (await defaultWarehouse(tx, company));
  if (!input.lines.length) throw badRequest("no_lines");

  let orderLines: (typeof tables.purchaseOrderLines.$inferSelect)[] = [];
  if (input.orderId) {
    const [o] = await tx.select().from(tables.purchaseOrders).where(eq(tables.purchaseOrders.id, input.orderId)).for("update");
    if (!o || o.companyId !== company.id) throw badRequest("unknown_order");
    if (o.supplierId !== supplier.id) throw badRequest("order_supplier_mismatch");
    if (o.status === "cancelled" || o.status === "closed") throw conflict("order_not_open");
    assertOrderApproved(o);
    orderLines = await tx.select().from(tables.purchaseOrderLines).where(eq(tables.purchaseOrderLines.orderId, o.id)).for("update");
  }

  const prepared = input.lines.map((l) => {
    const hold = dec(l.hold ?? 0), short = dec(l.short ?? 0), damaged = dec(l.damaged ?? 0);
    if (l.defectCode && !damaged.gt(0)) throw badRequest("defect_code_without_damage");
    if (dec(l.qty).lt(0) || hold.lt(0) || short.lt(0) || damaged.lt(0)) throw badRequest("qty_must_be_positive");
    if (!dec(l.qty).plus(hold).gt(0)) throw badRequest("qty_must_be_positive");
    const challan = l.challanQty ? dec(l.challanQty) : dec(l.qty).plus(hold).plus(short).plus(damaged);
    if (!challan.eq(dec(l.qty).plus(hold).plus(short).plus(damaged))) throw badRequest("challan_mismatch");
    const ol = l.orderLineId ? orderLines.find((x) => x.id === l.orderLineId) : undefined;
    if (l.orderLineId && !ol) throw badRequest("unknown_order_line");
    if (ol && ol.itemId !== l.itemId) throw badRequest("order_line_item_mismatch");
    if (ol && dec(l.qty).plus(hold).gt(dec(ol.qty).minus(ol.receivedQty))) throw badRequest("over_receipt");
    // Cost per unit net of discount (GST is claimed as input credit, so it isn't part of cost).
    const rate = l.rate ?? (ol ? dec(ol.taxable).div(ol.qty).toDecimalPlaces(4).toFixed(4) : undefined);
    if (rate === undefined) throw badRequest("rate_required");
    const landedCostPerUnit = l.landedCostPerUnit ?? "0";
    if (dec(landedCostPerUnit).gt(0) && !l.landedCostNote?.trim()) throw badRequest("landed_cost_source_required");
    return { ...l, rate, landedCostPerUnit, ol, holdQty: hold, shortQty: short, damagedQty: damaged, challan };
  });
  const chargeAllocations: { chargeIndex: number; lineIndex: number; amount: string }[] = [];
  const landedCostByLine = prepared.map(() => dec(0));
  for (const [chargeIndex, charge] of (input.landedCharges ?? []).entries()) {
    if (charge.allocations.length === 0) throw badRequest("landed_cost_allocation_required");
    const gross = dec(charge.grossAmount);
    const recoverableGst = dec(charge.recoverableGst ?? "0");
    const net = gross.minus(recoverableGst);
    if (!gross.gt(0) || recoverableGst.lt(0) || recoverableGst.gt(gross) || !net.gt(0)) throw badRequest("landed_cost_amount_invalid");
    if (charge.allocationBasis === "direct" && charge.allocations.length !== 1) throw badRequest("landed_cost_direct_single_line");
    const seen = new Set<number>();
    let allocated = dec(0);
    for (const allocation of charge.allocations) {
      const line = prepared[allocation.lineIndex];
      if (!line || seen.has(allocation.lineIndex) || !dec(allocation.amount).gt(0) || !dec(line.qty).plus(line.holdQty).gt(0)) throw badRequest("landed_cost_allocation_invalid");
      seen.add(allocation.lineIndex);
      allocated = allocated.plus(allocation.amount);
      landedCostByLine[allocation.lineIndex] = landedCostByLine[allocation.lineIndex]!.plus(allocation.amount);
      chargeAllocations.push({ chargeIndex, lineIndex: allocation.lineIndex, amount: allocation.amount });
    }
    if (!allocated.eq(net)) throw badRequest("landed_cost_allocation_mismatch");
  }
  if (input.landedCharges?.length && prepared.some((line) => dec(line.landedCostPerUnit).gt(0))) throw badRequest("landed_cost_method_conflict");
  if (input.landedCharges?.length) {
    for (const [lineIndex, line] of prepared.entries()) {
      const qty = dec(line.qty).plus(line.holdQty);
      if (qty.gt(0)) line.landedCostPerUnit = landedCostByLine[lineIndex]!.div(qty).toDecimalPlaces(4).toFixed(4);
      if (dec(line.landedCostPerUnit).gt(0)) line.landedCostNote = "Landed cost allocation worksheet";
    }
  }
  const holdWarehouse = prepared.some((l) => l.holdQty.gt(0)) ? await qualityHoldWarehouse(tx, company) : null;
  // Items tracked by serial: the accepted pieces come in by name, one serial for each.
  const trackedIds = new Set((await tx.select({ id: tables.items.id }).from(tables.items).where(and(inArray(tables.items.id, prepared.map((l) => l.itemId)), eq(tables.items.trackSerials, true)))).map((x) => x.id));
  const serialLines = prepared.filter((l) => trackedIds.has(l.itemId) && dec(l.qty).gt(0)).map((l) => {
    const serials = normalizeSerials(l.serials);
    if (!serials.length) throw badRequest("serials_required");
    if (!dec(l.qty).isInteger() || serials.length !== dec(l.qty).toNumber()) throw badRequest("serials_count_mismatch");
    return { itemId: l.itemId, serials };
  });

  const number = await documentNumber(tx, actor, company, input.date, PURCHASE_SERIES.receipt);
  const [receipt] = await tx.insert(tables.goodsReceipts).values({
    tenantId: actor.tenantId, companyId: company.id, supplierId: supplier.id, orderId: input.orderId ?? null, warehouseId, number, date: input.date,
    supplierChallan: input.supplierChallan ?? null, narration: input.narration ?? null,
    transporter: input.transporter?.trim() || null, lrNumber: input.lrNumber?.trim() || null, lrDate: input.lrDate ?? null, createdBy: actor.userId,
  }).returning();
  const savedLines = await tx.insert(tables.goodsReceiptLines).values(prepared.map((l, i) => ({
    tenantId: actor.tenantId, receiptId: receipt!.id, lineNo: i + 1, itemId: l.itemId, orderLineId: l.orderLineId ?? null,
    qty: q4(l.qty), rate: l.rate, landedCostPerUnit: l.landedCostPerUnit, landedCostNote: l.landedCostNote?.trim() || null,
    mrp: l.mrp ? money(l.mrp) : null, batchNo: l.batchNo ?? null, expiry: l.expiry ?? null,
    challanQty: q4(l.challan), shortQty: q4(l.shortQty), damagedQty: q4(l.damagedQty), defectCode: l.defectCode ?? null, holdQty: q4(l.holdQty),
  }))).returning();
  if (input.landedCharges?.length) {
    const savedCharges = await tx.insert(tables.goodsReceiptLandedCharges).values(input.landedCharges.map((charge) => {
      const recoverableGst = dec(charge.recoverableGst ?? "0");
      return {
        tenantId: actor.tenantId, companyId: company.id, receiptId: receipt!.id,
        description: charge.description.trim(), sourceDocument: charge.sourceDocument.trim(),
        grossAmount: money(charge.grossAmount), recoverableGst: money(recoverableGst.toFixed(2)),
        netAmount: money(dec(charge.grossAmount).minus(recoverableGst).toFixed(2)), allocationBasis: charge.allocationBasis,
      };
    })).returning();
    const allocations = chargeAllocations.map((allocation) => ({
      tenantId: actor.tenantId, chargeId: savedCharges[allocation.chargeIndex]!.id,
      receiptLineId: savedLines[allocation.lineIndex]!.id, allocatedAmount: money(allocation.amount),
    }));
    await tx.insert(tables.goodsReceiptLandedAllocations).values(allocations);
  }
  // New MRPs go onto the items (old documents keep what they printed); each change is in the audit log.
  const mrps = new Map(prepared.filter((l) => l.mrp).map((l) => [l.itemId, money(l.mrp!)]));
  if (mrps.size) {
    const current = await tx.select({ id: tables.items.id, mrp: tables.items.mrp, companyId: tables.items.companyId }).from(tables.items).where(inArray(tables.items.id, [...mrps.keys()]));
    for (const it of current) {
      const mrp = mrps.get(it.id)!;
      if (it.companyId !== company.id || (it.mrp !== null && dec(it.mrp).eq(mrp))) continue;
      await tx.update(tables.items).set({ mrp }).where(eq(tables.items.id, it.id));
      await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "item", entityId: it.id, before: { mrp: it.mrp }, after: { mrp, receipt: number }, ip: actor.ip });
    }
  }
  // A sale rate on the line (from the margin bands, or typed) goes onto the item the same way; each change is in the audit log.
  const rates = new Map(prepared.filter((l) => l.saleRate).map((l) => [l.itemId, money(l.saleRate!)]));
  if (rates.size) {
    const current = await tx.select({ id: tables.items.id, saleRate: tables.items.saleRate, companyId: tables.items.companyId }).from(tables.items).where(inArray(tables.items.id, [...rates.keys()]));
    for (const it of current) {
      const saleRate = rates.get(it.id)!;
      if (it.companyId !== company.id || dec(it.saleRate).eq(saleRate)) continue;
      await tx.update(tables.items).set({ saleRate }).where(eq(tables.items.id, it.id));
      await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "item", entityId: it.id, before: { saleRate: it.saleRate }, after: { saleRate, receipt: number }, ip: actor.ip });
    }
  }
  const { warnings } = await postMoves(tx, company, "grn", receipt!.id, prepared.filter((l) => dec(l.qty).gt(0)).map((l) => ({
    itemId: l.itemId, warehouseId, date: input.date, qtyIn: q4(l.qty), rate: dec(l.rate).plus(l.landedCostPerUnit).toFixed(4), batchNo: l.batchNo, expiry: l.expiry,
  })));
  for (const sl of serialLines) await registerSerials(tx, actor, { itemId: sl.itemId, warehouseId, serials: sl.serials, date: input.date, source: { kind: "receipt", id: receipt!.id } });
  if (holdWarehouse) {
    await postMoves(tx, company, "grn_hold", receipt!.id, prepared.filter((l) => l.holdQty.gt(0)).map((l) => ({
      itemId: l.itemId, warehouseId: holdWarehouse, date: input.date, qtyIn: q4(l.holdQty), rate: dec(l.rate).plus(l.landedCostPerUnit).toFixed(4), batchNo: l.batchNo, expiry: l.expiry,
    })));
  }
  // Goods on hold are in the building, so they count against the order; short and damaged goods do not.
  for (const l of prepared) {
    if (l.ol) await tx.update(tables.purchaseOrderLines).set({ receivedQty: sql`${tables.purchaseOrderLines.receivedQty} + ${q4(dec(l.qty).plus(l.holdQty))}` }).where(eq(tables.purchaseOrderLines.id, l.ol.id));
  }
  if (input.orderId) await refreshOrderStatus(tx, input.orderId);
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "goods_receipt", entityId: receipt!.id, after: {
    number, supplier: supplier.name, lines: prepared.length,
    landedCharges: (input.landedCharges ?? []).map((charge, chargeIndex) => ({
      description: charge.description.trim(), sourceDocument: charge.sourceDocument.trim(), grossAmount: money(charge.grossAmount),
      recoverableGst: money(charge.recoverableGst ?? "0"), netAmount: money(dec(charge.grossAmount).minus(charge.recoverableGst ?? "0").toFixed(2)),
      allocationBasis: charge.allocationBasis,
      allocations: chargeAllocations.filter((allocation) => allocation.chargeIndex === chargeIndex).map((allocation) => ({ lineNo: allocation.lineIndex + 1, amount: money(allocation.amount) })),
    })),
  }, ip: actor.ip });
  return { receipt: receipt!, warnings };
}

/**
 * The last few times an item was bought: date, supplier, document, net cost per piece and the MRP set
 * then. Inward challans show it beside the line being entered.
 */
export async function purchaseHistory(tx: Tx, itemId: string, limit = 5) {
  const rows = await tx.execute<{ date: string; supplier: string; number: string; qty: string; rate: string; mrp: string | null }>(sql`
    select * from (
      select r.date::text as date, a.name as supplier, r.number, l.qty::text as qty, (l.rate + l.landed_cost_per_unit)::text as rate, l.mrp::text as mrp, r.created_at
      from goods_receipt_lines l join goods_receipts r on r.id = l.receipt_id join accounts a on a.id = r.supplier_id
      where l.item_id = ${itemId} and r.status <> 'cancelled'
      union all
      select b.date::text, a.name, b.number, l.qty::text, round(l.taxable / nullif(l.qty, 0), 4)::text, null, b.created_at
      from purchase_bill_lines l join purchase_bills b on b.id = l.bill_id join accounts a on a.id = b.supplier_id
      where l.item_id = ${itemId} and l.receipt_line_id is null and b.status <> 'cancelled'
    ) x order by date desc, created_at desc limit ${limit}`);
  return [...rows].map(({ date, supplier, number, qty, rate, mrp }) => ({ date, supplier, number, qty, rate: dec(rate).toFixed(2), mrp }));
}

export async function cancelGoodsReceipt(tx: Tx, actor: Actor, id: string, reason: string) {
  const [r] = await tx.select().from(tables.goodsReceipts).where(eq(tables.goodsReceipts.id, id)).for("update");
  if (!r) throw notFound();
  if (r.status === "cancelled") throw conflict("already_cancelled");
  const lines = await tx.select().from(tables.goodsReceiptLines).where(eq(tables.goodsReceiptLines.receiptId, id));
  if (lines.some((l) => dec(l.billedQty).gt(0))) throw conflict("receipt_is_billed");
  if (lines.some((l) => dec(l.returnedQty).gt(0))) throw conflict("receipt_has_returns");
  const company = await resolveCompany(tx, r.companyId);
  assertPeriodOpen(await fiscalYearForDate(tx, actor.tenantId, company, r.date), r.date);
  await reverseMoves(tx, "grn", id);
  await reverseMoves(tx, "grn_hold", id);
  await removeReceiptSerials(tx, id);
  for (const l of lines) {
    if (l.orderLineId) await tx.update(tables.purchaseOrderLines).set({ receivedQty: sql`${tables.purchaseOrderLines.receivedQty} - ${l.qty} - ${l.holdQty}` }).where(eq(tables.purchaseOrderLines.id, l.orderLineId));
  }
  await tx.update(tables.goodsReceipts).set({ status: "cancelled" }).where(eq(tables.goodsReceipts.id, id));
  if (r.orderId) await refreshOrderStatus(tx, r.orderId);
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "cancel", entity: "goods_receipt", entityId: id, after: { reason }, ip: actor.ip });
}


// ---- purchase bills -----------------------------------------------------------------------------

export interface BillInput {
  companyId?: string | undefined; branchId?: string | undefined; supplierId: string; orderId?: string | undefined;
  date: string; supplierInvoiceNo: string; supplierInvoiceDate: string; dueOn?: string | undefined;
  reverseCharge?: boolean | undefined; narration?: string | undefined; projectId?: string | undefined;
  lines: (PriceLine & { receiptLineId?: string | undefined; orderLineId?: string | undefined; warehouseId?: string | undefined; batchNo?: string | undefined; expiry?: string | undefined })[];
}

export async function createPurchaseBill(tx: Tx, actor: Actor, input: BillInput) {
  const company = await resolveCompany(tx, input.companyId);
  if (input.projectId) {
    const [p] = await tx.select({ companyId: tables.projects.companyId }).from(tables.projects).where(eq(tables.projects.id, input.projectId));
    if (!p || p.companyId !== company.id) throw badRequest("unknown_project");
  }
  const supplier = await loadSupplier(tx, company.id, input.supplierId);
  const branch = await loadBranch(tx, company.id, input.branchId);
  if (input.supplierInvoiceDate > input.date) throw badRequest("invoice_after_posting_date");
  if (input.orderId) {
    const [o] = await tx.select({ approvalStatus: tables.purchaseOrders.approvalStatus }).from(tables.purchaseOrders).where(eq(tables.purchaseOrders.id, input.orderId));
    if (o) assertOrderApproved(o);
  }
  const lines = await priceLines(tx, company.id, input.lines, input.date);
  const tax = computeInvoiceTax(lines, purchaseContext(supplier, branch, input.reverseCharge));

  // Link checks: a received line can be billed once, up to the quantity received.
  const receiptLineIds = lines.flatMap((l) => (l.receiptLineId ? [l.receiptLineId] : []));
  const receiptLines = receiptLineIds.length
    ? await tx.select({ line: tables.goodsReceiptLines, receipt: tables.goodsReceipts }).from(tables.goodsReceiptLines)
      .innerJoin(tables.goodsReceipts, eq(tables.goodsReceipts.id, tables.goodsReceiptLines.receiptId))
      .where(inArray(tables.goodsReceiptLines.id, receiptLineIds)).for("update")
    : [];
  const warnings: { code: string; lineNo: number }[] = [];
  const whDefault = await defaultWarehouse(tx, company);
  const stockMoves: Move[] = [];
  lines.forEach((l, i) => {
    const t = tax.lines[i]!;
    const cost = dec(t.taxableValue).div(l.qty).toDecimalPlaces(4);
    if (l.receiptLineId) {
      const rl = receiptLines.find((r) => r.line.id === l.receiptLineId);
      if (!rl || rl.receipt.companyId !== company.id) throw badRequest("unknown_receipt_line");
      if (rl.receipt.status === "cancelled") throw conflict("receipt_cancelled");
      if (rl.receipt.supplierId !== supplier.id) throw badRequest("receipt_supplier_mismatch");
      if (rl.line.itemId !== l.itemId) throw badRequest("receipt_line_item_mismatch");
      // A supplier bills what its challan said, so goods that were short on arrival can still be billed (and then debited as a shortage).
      if (dec(l.qty).gt(dec(rl.line.qty).plus(rl.line.shortQty).minus(rl.line.billedQty))) throw badRequest("over_billing");
      // Stock was valued at the receipt rate; a different bill rate is flagged for the accountant.
      if (!cost.equals(dec(rl.line.rate))) warnings.push({ code: "rate_differs_from_receipt", lineNo: i + 1 });
    } else if (l.item.kind === "goods") {
      stockMoves.push({ itemId: l.itemId, warehouseId: l.warehouseId ?? whDefault, date: input.date, qtyIn: q4(l.qty), rate: cost.toFixed(4), batchNo: l.batchNo, expiry: l.expiry });
    }
  });

  const number = await documentNumber(tx, actor, company, input.date, PURCHASE_SERIES.bill);
  const { voucher } = await postVoucher(tx, actor, {
    companyId: company.id, type: "purchase", documentNumber: number, date: input.date,
    narration: input.narration ?? `${supplier.name} — invoice ${input.supplierInvoiceNo}`, reference: input.supplierInvoiceNo,
    lines: await purchaseGlLines(tx, company.id, supplier.id, tax, !!input.reverseCharge, "in"),
  });
  const [bill] = await tx.insert(tables.purchaseBills).values({
    tenantId: actor.tenantId, companyId: company.id, branchId: branch.id, supplierId: supplier.id, orderId: input.orderId ?? null, projectId: input.projectId ?? null, voucherId: voucher.id,
    number, date: input.date, supplierInvoiceNo: input.supplierInvoiceNo, supplierInvoiceDate: input.supplierInvoiceDate, dueOn: input.dueOn ?? null,
    supplyKind: tax.supplyKind, reverseCharge: !!input.reverseCharge, ...taxFields(tax), roundOff: tax.roundOff, total: tax.grandTotal,
    narration: input.narration ?? null, createdBy: actor.userId,
  }).returning().catch((e) => {
    if (e?.cause?.code === "23505" && String(e?.cause?.constraint_name ?? e?.cause?.message).includes("supplier_invoice")) throw conflict("duplicate_supplier_invoice");
    throw e;
  });
  const lineRows = await tx.insert(tables.purchaseBillLines).values(lines.map((l, i) => ({
    tenantId: actor.tenantId, billId: bill!.id, lineNo: i + 1, itemId: l.itemId, description: l.description ?? null,
    qty: q4(l.qty), rate: l.rate, discount: money(l.discount), gstRate: l.gstRate, cessRate: l.cessRate, ...taxFields(tax.lines[i]!), total: tax.lines[i]!.total,
    orderLineId: l.orderLineId ?? receiptLines.find((r) => r.line.id === l.receiptLineId)?.line.orderLineId ?? null,
    receiptLineId: l.receiptLineId ?? null,
    warehouseId: l.receiptLineId ? receiptLines.find((r) => r.line.id === l.receiptLineId)!.receipt.warehouseId : l.item.kind === "goods" ? (l.warehouseId ?? whDefault) : null,
    batchNo: l.batchNo ?? null, expiry: l.expiry ?? null,
  }))).returning();
  const { warnings: stockWarnings } = await postMoves(tx, company, "purchase_bill", bill!.id, stockMoves);

  // Keep receipt and order quantities in step.
  for (const row of lineRows) {
    if (row.receiptLineId) await tx.update(tables.goodsReceiptLines).set({ billedQty: sql`${tables.goodsReceiptLines.billedQty} + ${row.qty}` }).where(eq(tables.goodsReceiptLines.id, row.receiptLineId));
    if (row.orderLineId) {
      await tx.update(tables.purchaseOrderLines).set({
        billedQty: sql`${tables.purchaseOrderLines.billedQty} + ${row.qty}`,
        // A bill for ordered goods that skipped a GRN also counts as received.
        ...(row.receiptLineId ? {} : { receivedQty: sql`${tables.purchaseOrderLines.receivedQty} + ${row.qty}` }),
      }).where(eq(tables.purchaseOrderLines.id, row.orderLineId));
    }
  }
  const receiptIds = [...new Set(receiptLines.map((r) => r.receipt.id))];
  for (const rid of receiptIds) {
    const ls = await tx.select().from(tables.goodsReceiptLines).where(eq(tables.goodsReceiptLines.receiptId, rid));
    if (ls.every((l) => dec(l.billedQty).gte(l.qty))) await tx.update(tables.goodsReceipts).set({ status: "billed" }).where(eq(tables.goodsReceipts.id, rid));
  }
  const orderIds = new Set([input.orderId, ...receiptLines.map((r) => r.receipt.orderId)].filter((x): x is string => !!x));
  for (const oid of orderIds) await refreshOrderStatus(tx, oid);

  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "purchase_bill", entityId: bill!.id, after: { number, supplier: supplier.name, invoice: input.supplierInvoiceNo, total: tax.grandTotal }, ip: actor.ip });
  return { bill: bill!, warnings: [...warnings, ...stockWarnings.map((w) => ({ code: "negative_stock", ...w }))] };
}

export async function cancelPurchaseBill(tx: Tx, actor: Actor, id: string, reason: string) {
  const [b] = await tx.select().from(tables.purchaseBills).where(eq(tables.purchaseBills.id, id)).for("update");
  if (!b) throw notFound();
  if (b.status === "cancelled") throw conflict("already_cancelled");
  const [ret] = await tx.select({ id: tables.purchaseReturns.id }).from(tables.purchaseReturns)
    .where(and(eq(tables.purchaseReturns.billId, id), eq(tables.purchaseReturns.status, "posted"))).limit(1);
  if (ret) throw conflict("bill_has_returns");
  await cancelVoucher(tx, actor, b.voucherId!, reason);
  await reverseMoves(tx, "purchase_bill", id);
  const lines = await tx.select().from(tables.purchaseBillLines).where(eq(tables.purchaseBillLines.billId, id));
  for (const l of lines) {
    if (l.receiptLineId) {
      await tx.update(tables.goodsReceiptLines).set({ billedQty: sql`${tables.goodsReceiptLines.billedQty} - ${l.qty}` }).where(eq(tables.goodsReceiptLines.id, l.receiptLineId));
      await tx.update(tables.goodsReceipts).set({ status: "posted" })
        .where(and(eq(tables.goodsReceipts.status, "billed"), sql`${tables.goodsReceipts.id} = (select receipt_id from goods_receipt_lines where id = ${l.receiptLineId})`));
    }
    if (l.orderLineId) {
      await tx.update(tables.purchaseOrderLines).set({
        billedQty: sql`${tables.purchaseOrderLines.billedQty} - ${l.qty}`,
        ...(l.receiptLineId ? {} : { receivedQty: sql`${tables.purchaseOrderLines.receivedQty} - ${l.qty}` }),
      }).where(eq(tables.purchaseOrderLines.id, l.orderLineId));
    }
  }
  await tx.update(tables.purchaseBills).set({ status: "cancelled" }).where(eq(tables.purchaseBills.id, id));
  const orderIds = new Set(lines.flatMap((l) => (l.orderLineId ? [l.orderLineId] : [])));
  if (orderIds.size) {
    const os = await tx.select({ orderId: tables.purchaseOrderLines.orderId }).from(tables.purchaseOrderLines).where(inArray(tables.purchaseOrderLines.id, [...orderIds]));
    for (const oid of new Set(os.map((o) => o.orderId))) await refreshOrderStatus(tx, oid);
  }
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "cancel", entity: "purchase_bill", entityId: id, after: { reason }, ip: actor.ip });
}

// ---- purchase returns (debit notes) --------------------------------------------------------------

export interface ReturnInput {
  billId: string; date: string; reason: string; warehouseId?: string | undefined;
  /** A debit note for goods billed but never received: no stock moves, and each line is capped by the shortage recorded on its receipt. */
  shortage?: boolean | undefined;
  lines: { billLineId: string; qty: string }[];
}

export async function createPurchaseReturn(tx: Tx, actor: Actor, input: ReturnInput) {
  const [bill] = await tx.select().from(tables.purchaseBills).where(eq(tables.purchaseBills.id, input.billId)).for("update");
  if (!bill) throw notFound("unknown_bill");
  if (bill.status !== "posted") throw conflict("bill_not_posted");
  if (input.date < bill.date) throw badRequest("return_before_bill");
  const company = await resolveCompany(tx, bill.companyId);
  const supplier = await loadSupplier(tx, company.id, bill.supplierId);
  const branch = await loadBranch(tx, company.id, bill.branchId);
  const billLines = await tx.select({ line: tables.purchaseBillLines, kind: tables.items.kind }).from(tables.purchaseBillLines)
    .innerJoin(tables.items, eq(tables.items.id, tables.purchaseBillLines.itemId))
    .where(eq(tables.purchaseBillLines.billId, bill.id)).for("update", { of: tables.purchaseBillLines });
  if (!input.lines.length) throw badRequest("no_lines");

  // Shortage debit notes: what each bill line can still be debited is the shortage recorded on its receipt line, less earlier shortage notes.
  const shortCap = new Map<string, ReturnType<typeof dec>>();
  if (input.shortage) {
    const rlIds = billLines.flatMap((b) => (b.line.receiptLineId ? [b.line.receiptLineId] : []));
    const rls = rlIds.length ? await tx.select({ id: tables.goodsReceiptLines.id, shortQty: tables.goodsReceiptLines.shortQty }).from(tables.goodsReceiptLines).where(inArray(tables.goodsReceiptLines.id, rlIds)) : [];
    const prior = await tx.execute<{ bill_line_id: string; qty: string }>(sql`
      select l.bill_line_id, sum(l.qty)::text as qty from purchase_return_lines l join purchase_returns r on r.id = l.return_id
      where r.bill_id = ${bill.id} and r.kind = 'shortage' and r.status = 'posted' group by 1`);
    for (const b of billLines) {
      const rl = rls.find((x) => x.id === b.line.receiptLineId);
      if (rl) shortCap.set(b.line.id, dec(rl.shortQty).minus([...prior].find((p) => p.bill_line_id === b.line.id)?.qty ?? 0));
    }
  }

  const prepared = input.lines.map((l) => {
    const bl = billLines.find((b) => b.line.id === l.billLineId);
    if (!bl) throw badRequest("unknown_bill_line");
    if (!dec(l.qty).gt(0)) throw badRequest("qty_must_be_positive");
    if (dec(l.qty).gt(dec(bl.line.qty).minus(bl.line.returnedQty))) throw badRequest("over_return");
    if (input.shortage && dec(l.qty).gt(shortCap.get(bl.line.id) ?? 0)) throw badRequest("over_shortage");
    // Same price and tax rate as billed; the discount is returned in proportion.
    const discount = money(dec(bl.line.discount).times(l.qty).div(bl.line.qty));
    return { ...l, bl, price: { itemId: bl.line.itemId, qty: l.qty, rate: bl.line.rate, discount, gstRate: bl.line.gstRate, cessRate: bl.line.cessRate } };
  });
  const tax = computeInvoiceTax(prepared.map((p) => p.price), purchaseContext(supplier, branch, bill.reverseCharge));
  const number = await documentNumber(tx, actor, company, input.date, PURCHASE_SERIES.debitNote);
  const { voucher } = await postVoucher(tx, actor, {
    companyId: company.id, type: "debit_note", documentNumber: number, date: input.date, narration: `Return to ${supplier.name}: ${input.reason}`,
    reference: bill.supplierInvoiceNo, lines: await purchaseGlLines(tx, company.id, supplier.id, tax, bill.reverseCharge, "out"),
  });
  const whDefault = await defaultWarehouse(tx, company);
  const warehouseId = input.warehouseId ?? whDefault;
  const [ret] = await tx.insert(tables.purchaseReturns).values({
    tenantId: actor.tenantId, companyId: company.id, billId: bill.id, supplierId: supplier.id, voucherId: voucher.id, warehouseId,
    number, date: input.date, reason: input.reason, kind: input.shortage ? "shortage" : "goods", supplyKind: tax.supplyKind, ...taxFields(tax), roundOff: tax.roundOff, total: tax.grandTotal, createdBy: actor.userId,
  }).returning();
  await tx.insert(tables.purchaseReturnLines).values(prepared.map((p, i) => ({
    tenantId: actor.tenantId, returnId: ret!.id, billLineId: p.billLineId, lineNo: i + 1, itemId: p.bl.line.itemId,
    qty: q4(p.qty), rate: p.bl.line.rate, discount: p.price.discount, gstRate: p.bl.line.gstRate, cessRate: p.bl.line.cessRate,
    ...taxFields(tax.lines[i]!), total: tax.lines[i]!.total,
  })));
  const { warnings } = await postMoves(tx, company, "purchase_return", ret!.id, prepared.filter((p) => p.bl.kind === "goods" && !input.shortage).map((p) => ({
    itemId: p.bl.line.itemId, warehouseId: input.warehouseId ?? p.bl.line.warehouseId ?? whDefault, date: input.date, qtyOut: q4(p.qty), batchNo: p.bl.line.batchNo,
  })));
  for (const p of prepared) {
    await tx.update(tables.purchaseBillLines).set({ returnedQty: sql`${tables.purchaseBillLines.returnedQty} + ${q4(p.qty)}` }).where(eq(tables.purchaseBillLines.id, p.billLineId));
  }
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "purchase_return", entityId: ret!.id, after: { number, bill: bill.number, total: tax.grandTotal }, ip: actor.ip });
  return { purchaseReturn: ret!, warnings };
}

export async function cancelPurchaseReturn(tx: Tx, actor: Actor, id: string, reason: string) {
  const [r] = await tx.select().from(tables.purchaseReturns).where(eq(tables.purchaseReturns.id, id)).for("update");
  if (!r) throw notFound();
  if (r.status === "cancelled") throw conflict("already_cancelled");
  await cancelVoucher(tx, actor, r.voucherId!, reason);
  await reverseMoves(tx, "purchase_return", id);
  const lines = await tx.select().from(tables.purchaseReturnLines).where(eq(tables.purchaseReturnLines.returnId, id));
  for (const l of lines) {
    await tx.update(tables.purchaseBillLines).set({ returnedQty: sql`${tables.purchaseBillLines.returnedQty} - ${l.qty}` }).where(eq(tables.purchaseBillLines.id, l.billLineId));
  }
  await tx.update(tables.purchaseReturns).set({ status: "cancelled" }).where(eq(tables.purchaseReturns.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "cancel", entity: "purchase_return", entityId: id, after: { reason }, ip: actor.ip });
}


// ---- receiving exceptions: quality hold, inward return, supplier claims ------------------------------------------

/** The company's one "Quality hold" warehouse: goods received but not yet passed for sale. Made the first time something is held. */
export async function qualityHoldWarehouse(tx: Tx, company: Company) {
  const [w] = await tx.select({ id: tables.warehouses.id }).from(tables.warehouses).where(and(eq(tables.warehouses.companyId, company.id), eq(tables.warehouses.qualityHold, true)));
  if (w) return w.id;
  const [made] = await tx.insert(tables.warehouses).values({ tenantId: company.tenantId, companyId: company.id, name: "Quality hold", qualityHold: true }).returning({ id: tables.warehouses.id });
  return made!.id;
}

/**
 * Inspection of goods on hold: each line is passed (into stock at the receipt's warehouse, where it becomes billable) or rejected (goes back to the
 * supplier, so the order is open for it again). What is neither stays on hold.
 */
export async function releaseHold(tx: Tx, actor: Actor, receiptId: string, input: { date: string; lines: { lineId: string; accept: string; reject: string }[] }) {
  const [r] = await tx.select().from(tables.goodsReceipts).where(eq(tables.goodsReceipts.id, receiptId)).for("update");
  if (!r) throw notFound();
  if (r.status === "cancelled") throw conflict("already_cancelled");
  const company = await resolveCompany(tx, r.companyId);
  assertPeriodOpen(await fiscalYearForDate(tx, actor.tenantId, company, input.date), input.date);
  const lines = await tx.select().from(tables.goodsReceiptLines).where(eq(tables.goodsReceiptLines.receiptId, receiptId)).for("update");
  const holdWh = await qualityHoldWarehouse(tx, company);
  const moves: Move[] = [];
  for (const x of input.lines) {
    const l = lines.find((y) => y.id === x.lineId);
    if (!l) throw badRequest("unknown_receipt_line");
    const accept = dec(x.accept), reject = dec(x.reject);
    if (accept.lt(0) || reject.lt(0) || !accept.plus(reject).gt(0)) throw badRequest("qty_must_be_positive");
    if (accept.plus(reject).gt(l.holdQty)) throw badRequest("more_than_on_hold");
    const landedRate = dec(l.rate).plus(l.landedCostPerUnit).toFixed(4);
    moves.push({ itemId: l.itemId, warehouseId: holdWh, date: input.date, qtyOut: q4(accept.plus(reject)), rate: landedRate, batchNo: l.batchNo, expiry: l.expiry });
    if (accept.gt(0)) moves.push({ itemId: l.itemId, warehouseId: r.warehouseId, date: input.date, qtyIn: q4(accept), rate: landedRate, batchNo: l.batchNo, expiry: l.expiry });
    await tx.update(tables.goodsReceiptLines).set({ holdQty: q4(dec(l.holdQty).minus(accept).minus(reject)), qty: q4(dec(l.qty).plus(accept)), returnedQty: q4(dec(l.returnedQty).plus(reject)) }).where(eq(tables.goodsReceiptLines.id, l.id));
    if (reject.gt(0) && l.orderLineId) await tx.update(tables.purchaseOrderLines).set({ receivedQty: sql`${tables.purchaseOrderLines.receivedQty} - ${q4(reject)}` }).where(eq(tables.purchaseOrderLines.id, l.orderLineId));
  }
  const { warnings } = await postMoves(tx, company, "grn_hold", receiptId, moves);
  if (r.orderId) await refreshOrderStatus(tx, r.orderId);
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "goods_receipt", entityId: receiptId, after: { released: input.lines }, ip: actor.ip });
  return { warnings };
}

/** Accepted goods sent back to the supplier before they are billed (damage found later, wrong goods): stock leaves, the order is open for them again. */
export async function returnToSupplier(tx: Tx, actor: Actor, receiptId: string, input: { date: string; reason: string; lines: { lineId: string; qty: string }[] }) {
  const [r] = await tx.select().from(tables.goodsReceipts).where(eq(tables.goodsReceipts.id, receiptId)).for("update");
  if (!r) throw notFound();
  if (r.status === "cancelled") throw conflict("already_cancelled");
  const company = await resolveCompany(tx, r.companyId);
  assertPeriodOpen(await fiscalYearForDate(tx, actor.tenantId, company, input.date), input.date);
  const lines = await tx.select().from(tables.goodsReceiptLines).where(eq(tables.goodsReceiptLines.receiptId, receiptId)).for("update");
  const moves: Move[] = [];
  for (const x of input.lines) {
    const l = lines.find((y) => y.id === x.lineId);
    if (!l) throw badRequest("unknown_receipt_line");
    const qty = dec(x.qty);
    if (!qty.gt(0)) throw badRequest("qty_must_be_positive");
    if (qty.gt(dec(l.qty).minus(l.billedQty))) throw badRequest("more_than_unbilled");
    moves.push({ itemId: l.itemId, warehouseId: r.warehouseId, date: input.date, qtyOut: q4(qty), rate: dec(l.rate).plus(l.landedCostPerUnit).toFixed(4), batchNo: l.batchNo, expiry: l.expiry });
    await tx.update(tables.goodsReceiptLines).set({ qty: q4(dec(l.qty).minus(qty)), returnedQty: q4(dec(l.returnedQty).plus(qty)) }).where(eq(tables.goodsReceiptLines.id, l.id));
    if (l.orderLineId) await tx.update(tables.purchaseOrderLines).set({ receivedQty: sql`${tables.purchaseOrderLines.receivedQty} - ${q4(qty)}` }).where(eq(tables.purchaseOrderLines.id, l.orderLineId));
  }
  const { warnings } = await postMoves(tx, company, "grn_return", receiptId, moves);
  if (r.orderId) await refreshOrderStatus(tx, r.orderId);
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "goods_receipt", entityId: receiptId, after: { returned: input.lines, reason: input.reason }, ip: actor.ip });
  return { warnings };
}

/** Goods on hold waiting for inspection, oldest first. */
export async function holdList(tx: Tx) {
  const company = await resolveCompany(tx);
  return [...await tx.execute<{ receipt_id: string; number: string; date: string; supplier: string; line_id: string; item: string; hold: string; rate: string }>(sql`
    select r.id as receipt_id, r.number, r.date::text, a.name as supplier, l.id as line_id, i.name as item, l.hold_qty::text as hold, (l.rate + l.landed_cost_per_unit)::text as rate
    from goods_receipt_lines l join goods_receipts r on r.id = l.receipt_id join accounts a on a.id = r.supplier_id join items i on i.id = l.item_id
    where r.company_id = ${company.id} and r.status <> 'cancelled' and l.hold_qty > 0 order by r.date, r.number`)];
}

/** What suppliers owe us a credit or replacement for: goods that came short, came damaged or went back, by supplier, valued at the receipt rate. */
export async function supplierClaims(tx: Tx, from: string, to: string) {
  if (to < from) throw badRequest("invalid_dates");
  const company = await resolveCompany(tx);
  const rows = [...await tx.execute<{ id: string; name: string; number: string; date: string; item: string; short: string; damaged: string; defect_code: string | null; returned: string; value: string }>(sql`
    select a.id, a.name, r.number, r.date::text, i.name as item, l.short_qty::text as short, l.damaged_qty::text as damaged, l.defect_code as defect_code, l.returned_qty::text as returned,
      ((l.short_qty + l.damaged_qty + l.returned_qty) * l.rate)::text as value
    from goods_receipt_lines l join goods_receipts r on r.id = l.receipt_id join accounts a on a.id = r.supplier_id join items i on i.id = l.item_id
    where r.company_id = ${company.id} and r.status <> 'cancelled' and r.date between ${from}::date and ${to}::date and (l.short_qty + l.damaged_qty + l.returned_qty) > 0
    order by a.name, r.date, r.number`)];
  const by = new Map<string, { supplierId: string; supplier: string; value: ReturnType<typeof dec>; lines: typeof rows }>();
  for (const r of rows) {
    const e = by.get(r.id) ?? { supplierId: r.id, supplier: r.name, value: dec(0), lines: [] };
    e.value = e.value.plus(r.value);
    e.lines.push(r);
    by.set(r.id, e);
  }
  return {
    from, to, total: money([...by.values()].reduce((t, e) => t.plus(e.value), dec(0))),
    suppliers: [...by.values()].map((e) => ({ supplierId: e.supplierId, supplier: e.supplier, value: money(e.value), lines: e.lines.map((l) => ({ receipt: l.number, date: l.date, item: l.item, short: dec(l.short).toFixed(0), damaged: dec(l.damaged).toFixed(0), defectCode: l.defect_code, returned: dec(l.returned).toFixed(0), value: money(l.value) })) })),
  };
}
