import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { UQC, dec, money, valueStock, type ValuationMethod } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { assertProcessOpen } from "./processlocks.js";
import { readPrefs } from "./prefsread.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { accountBalances, allocateNumber, assertPeriodOpen, ensureTemplateAccounts, fiscalYearForDate, postVoucher, resolveCompany } from "./accounting.js";

export const STOCK_JOURNAL_SERIES = { docType: "stock_journal", name: "Stock journals", pattern: "SJ/{FY}/{SEQ:5}" };

interface Actor { tenantId: string; userId: string; ip?: string | undefined }
type Company = Awaited<ReturnType<typeof resolveCompany>>;

/** Default units (GST UQC) and a "Main store" warehouse for a company that has none. */
export async function ensureInventory(tx: Tx, tenantId: string, companyId: string) {
  const [anyUom] = await tx.select({ id: tables.uoms.id }).from(tables.uoms).where(eq(tables.uoms.companyId, companyId)).limit(1);
  if (!anyUom) {
    // Parallel first requests may both get here; the later one skips what already exists.
    await tx.insert(tables.uoms).values(UQC.map((u) => ({ tenantId, companyId, code: u.code, name: u.name, nameHi: u.nameHi, decimals: u.decimals }))).onConflictDoNothing();
  }
  // Older businesses may have a partial unit catalog. Tile stock still needs BOX.
  const box = UQC.find((u) => u.code === "BOX");
  if (box) await tx.insert(tables.uoms).values({ tenantId, companyId, code: box.code, name: box.name, nameHi: box.nameHi, decimals: box.decimals }).onConflictDoNothing();
  const [anyWh] = await tx.select({ id: tables.warehouses.id }).from(tables.warehouses).where(eq(tables.warehouses.companyId, companyId)).limit(1);
  if (!anyWh) await tx.insert(tables.warehouses).values({ tenantId, companyId, name: "Main store", isDefault: true }).onConflictDoNothing();
}

export const dayBefore = (iso: string) => new Date(Date.parse(`${iso}T00:00:00Z`) - 86_400_000).toISOString().slice(0, 10);

export interface LedgerRow {
  id: number; itemId: string; warehouseId: string; date: string; qtyIn: string; qtyOut: string; rate: string;
  sourceType: string; sourceId: string; batchNo: string | null; expiry: string | null;
}

/**
 * Stock ledger rows that count: rows of cancelled documents and their reversals are both left out,
 * so a cancelled document is valued as if it never happened (its rows stay for the audit trail).
 */
export async function effectiveLedger(tx: Tx, companyId: string, opts: { to?: string; itemIds?: string[]; warehouseId?: string } = {}): Promise<LedgerRow[]> {
  const rows = await tx.execute<{
    id: string; item_id: string; warehouse_id: string; date: string; qty_in: string; qty_out: string; rate: string;
    source_type: string; source_id: string; batch_no: string | null; expiry: string | null;
  }>(sql`
    select l.id, l.item_id, l.warehouse_id, l.date, l.qty_in, l.qty_out, l.rate, l.source_type, l.source_id, l.batch_no, l.expiry
    from stock_ledger l
    where l.company_id = ${companyId}
      and not l.is_reversal
      and not exists (select 1 from stock_ledger r where r.is_reversal and r.source_type = l.source_type and r.source_id = l.source_id)
      ${opts.to ? sql`and l.date <= ${opts.to}::date` : sql``}
      ${opts.itemIds ? sql`and l.item_id = any(${`{${opts.itemIds.join(",")}}`}::uuid[])` : sql``}
      ${opts.warehouseId ? sql`and l.warehouse_id = ${opts.warehouseId}` : sql``}
    order by l.item_id, l.warehouse_id, l.date, l.id`);
  return rows.map((r) => ({
    id: Number(r.id), itemId: r.item_id, warehouseId: r.warehouse_id, date: String(r.date), qtyIn: r.qty_in, qtyOut: r.qty_out, rate: r.rate,
    sourceType: r.source_type, sourceId: r.source_id, batchNo: r.batch_no, expiry: r.expiry,
  }));
}

export interface Position { itemId: string; warehouseId: string; qty: string; value: string; rate: string }

/** Quantity and value of every item in every warehouse as of a date. */
export async function stockPositions(tx: Tx, company: { id: string; valuationMethod: string }, asOf: string, opts: { itemIds?: string[]; warehouseId?: string } = {}) {
  const rows = await effectiveLedger(tx, company.id, { to: asOf, ...opts });
  const groups = new Map<string, LedgerRow[]>();
  for (const r of rows) {
    const k = `${r.itemId}|${r.warehouseId}`;
    const g = groups.get(k);
    if (g) g.push(r);
    else groups.set(k, [r]);
  }
  const out: Position[] = [];
  for (const [k, g] of groups) {
    const [itemId, warehouseId] = k.split("|") as [string, string];
    const v = valueStock(g.map((r) => ({ qtyIn: r.qtyIn, qtyOut: r.qtyOut, rate: r.rate })), company.valuationMethod as ValuationMethod);
    const qty = dec(v.qty);
    out.push({ itemId, warehouseId, qty: v.qty, value: v.value, rate: qty.gt(0) ? money(dec(v.value).div(qty)) : "0.00" });
  }
  return out;
}

/** Total stock value as of a date: the closing stock figure for the P&L and balance sheet. */
export async function stockValue(tx: Tx, company: { id: string; valuationMethod: string }, asOf: string) {
  const positions = await stockPositions(tx, company, asOf);
  return money(positions.reduce((s, p) => s.plus(p.value), dec(0)));
}

/** Current cost rate of one item in one warehouse (used for transfers and adjustments). */
export async function currentRate(tx: Tx, company: Company, itemId: string, warehouseId: string, asOf: string) {
  const [p] = await stockPositions(tx, company, asOf, { itemIds: [itemId], warehouseId });
  if (p && dec(p.qty).gt(0)) return dec(p.value).div(p.qty).toDecimalPlaces(4).toFixed(4);
  const [item] = await tx.select({ rate: tables.items.purchaseRate }).from(tables.items).where(eq(tables.items.id, itemId));
  return item?.rate ?? "0";
}

export interface Move {
  itemId: string;
  warehouseId: string;
  date: string;
  qtyIn?: string;
  qtyOut?: string;
  rate?: string;
  batchNo?: string | null | undefined;
  expiry?: string | null | undefined;
}

/**
 * Posts stock movements for one source document. Checks items and warehouses belong to the company
 * and returns warnings for items that go below zero (allowed, as in Tally, but surfaced).
 */
export async function postMoves(tx: Tx, company: Company, sourceType: string, sourceId: string, input: Move[]) {
  // A set (ratio pack) moves as its pieces, whatever the document.
  const moves = await explodePacks(tx, input);
  if (!moves.length) return { warnings: [] as { itemId: string; warehouseId: string; qty: string }[] };
  const itemIds = [...new Set(moves.map((m) => m.itemId))];
  const whIds = [...new Set(moves.map((m) => m.warehouseId))];
  const itemRows = await tx.select().from(tables.items).where(inArray(tables.items.id, itemIds));
  const whRows = await tx.select().from(tables.warehouses).where(inArray(tables.warehouses.id, whIds));
  for (const id of itemIds) {
    const it = itemRows.find((i) => i.id === id);
    if (!it || it.companyId !== company.id) throw badRequest("unknown_item");
    if (it.kind === "service") throw badRequest("service_has_no_stock");
  }
  for (const id of whIds) {
    const w = whRows.find((x) => x.id === id);
    if (!w || w.companyId !== company.id) throw badRequest("unknown_warehouse");
    if (w.archived) throw badRequest("warehouse_archived");
  }
  for (const m of moves) {
    const it = itemRows.find((i) => i.id === m.itemId)!;
    if (it.trackBatches && !m.batchNo) throw badRequest("batch_required");
  }
  await tx.insert(tables.stockLedger).values(moves.map((m) => ({
    tenantId: company.tenantId, companyId: company.id, itemId: m.itemId, warehouseId: m.warehouseId, date: m.date,
    qtyIn: m.qtyIn ?? "0", qtyOut: m.qtyOut ?? "0", rate: m.rate ?? "0", batchNo: m.batchNo ?? null, expiry: m.expiry ?? null,
    sourceType, sourceId,
  })));
  // Negative-stock warnings, checked at the latest date touched.
  const outs = moves.filter((m) => m.qtyOut && dec(m.qtyOut).gt(0));
  const warnings: { itemId: string; warehouseId: string; qty: string }[] = [];
  if (outs.length) {
    const positions = await stockPositions(tx, company, "9999-12-31", { itemIds: [...new Set(outs.map((m) => m.itemId))] });
    for (const p of positions) {
      if (dec(p.qty).isNegative() && outs.some((o) => o.itemId === p.itemId && o.warehouseId === p.warehouseId)) warnings.push({ itemId: p.itemId, warehouseId: p.warehouseId, qty: p.qty });
    }
  }
  // A business can choose to refuse a sale that would take an item below zero; the whole document is then not saved.
  if (warnings.length && BLOCKS_AT_ZERO.has(sourceType) && (await readPrefs(tx, company.id))["txn.blockNegativeStock"] === true) throw badRequest("insufficient_stock");
  return { warnings };
}

/** Sales documents that the "stop sale on negative stock" setting applies to. */
const BLOCKS_AT_ZERO = new Set(["sales_invoice", "delivery_note", "pos_bill"]);

/** Cancels a source document's stock effect by posting mirror rows (see effectiveLedger). */
export async function reverseMoves(tx: Tx, sourceType: string, sourceId: string) {
  const rows = await tx.select().from(tables.stockLedger)
    .where(and(eq(tables.stockLedger.sourceType, sourceType), eq(tables.stockLedger.sourceId, sourceId), eq(tables.stockLedger.isReversal, false)));
  if (!rows.length) return;
  await tx.insert(tables.stockLedger).values(rows.map((r) => ({
    tenantId: r.tenantId, companyId: r.companyId, itemId: r.itemId, warehouseId: r.warehouseId, date: r.date,
    qtyIn: r.qtyOut, qtyOut: r.qtyIn, rate: r.rate, batchNo: r.batchNo, expiry: r.expiry, sourceType, sourceId, isReversal: true,
  })));
}

/** Number for a document dated `date`, from the company's series for that financial year. */
export async function documentNumber(tx: Tx, actor: Actor, company: Company, date: string, series: { docType: string; name: string; pattern: string }) {
  const fy = await fiscalYearForDate(tx, actor.tenantId, company, date);
  assertPeriodOpen(fy, date);
  await assertProcessOpen(tx, company.id, series.docType, date);
  return allocateNumber(tx, actor.tenantId, company.id, fy, series);
}

// ---- Stock journals ---------------------------------------------------------------------------

export interface StockJournalInput {
  companyId?: string | undefined;
  kind: "opening" | "adjustment" | "transfer" | "issue";
  date?: string | undefined;
  narration?: string | undefined;
  lines: {
    itemId: string; warehouseId: string; toWarehouseId?: string | undefined;
    qty: string; direction?: "in" | "out" | undefined; rate?: string | undefined;
    batchNo?: string | undefined; expiry?: string | undefined;
  }[];
}

export async function postStockJournal(tx: Tx, actor: Actor, input: StockJournalInput) {
  const company = await resolveCompany(tx, input.companyId);
  // Opening stock is dated the day before books begin, so "stock before the first day" includes it.
  const date = input.kind === "opening" ? dayBefore(company.booksBeginOn) : input.date;
  if (!date) throw badRequest("date_required");
  if (input.kind !== "opening" && date < company.booksBeginOn) throw badRequest("before_books_begin");

  const numberDate = input.kind === "opening" ? company.booksBeginOn : date;
  const number = await documentNumber(tx, actor, company, numberDate, STOCK_JOURNAL_SERIES);
  const [journal] = await tx.insert(tables.stockJournals).values({
    tenantId: actor.tenantId, companyId: company.id, number, date, kind: input.kind, narration: input.narration ?? null, createdBy: actor.userId,
  }).returning();

  const moves: Move[] = [];
  const lineRows = [];
  for (const [i, l] of input.lines.entries()) {
    if (!dec(l.qty).gt(0)) throw badRequest("qty_must_be_positive");
    const direction = input.kind === "opening" ? "in" : input.kind === "issue" ? "out" : input.kind === "transfer" ? "out" : l.direction;
    if (!direction) throw badRequest("direction_required");
    let rate = l.rate;
    if (input.kind === "opening" && rate === undefined) throw badRequest("rate_required");
    // An adjustment that adds stock without a rate uses the item's current cost.
    if (direction === "in" && rate === undefined) rate = await currentRate(tx, company, l.itemId, l.warehouseId, date);
    const base = { itemId: l.itemId, date, batchNo: l.batchNo, expiry: l.expiry };
    if (input.kind === "transfer") {
      if (!l.toWarehouseId || l.toWarehouseId === l.warehouseId) throw badRequest("transfer_needs_two_warehouses");
      // Goods move at their current cost, so the total stock value doesn't change.
      const cost = await currentRate(tx, company, l.itemId, l.warehouseId, date);
      moves.push({ ...base, warehouseId: l.warehouseId, qtyOut: l.qty }, { ...base, warehouseId: l.toWarehouseId, qtyIn: l.qty, rate: cost });
      rate = cost;
    } else if (direction === "in") {
      moves.push({ ...base, warehouseId: l.warehouseId, qtyIn: l.qty, rate: rate! });
    } else {
      moves.push({ ...base, warehouseId: l.warehouseId, qtyOut: l.qty });
    }
    lineRows.push({
      tenantId: actor.tenantId, journalId: journal!.id, lineNo: i + 1, itemId: l.itemId, warehouseId: l.warehouseId, toWarehouseId: l.toWarehouseId ?? null,
      qtyIn: direction === "in" ? l.qty : "0", qtyOut: direction === "out" ? l.qty : "0", rate: rate ?? "0", batchNo: l.batchNo ?? null, expiry: l.expiry ?? null,
    });
  }
  await tx.insert(tables.stockJournalLines).values(lineRows);
  const { warnings } = await postMoves(tx, company, "stock_journal", journal!.id, moves);
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "stock_journal", entityId: journal!.id, after: { kind: input.kind, number, date, lines: input.lines.length }, ip: actor.ip });
  return { journal: journal!, warnings };
}

export async function cancelStockJournal(tx: Tx, actor: Actor, id: string, reason: string) {
  const [j] = await tx.select().from(tables.stockJournals).where(eq(tables.stockJournals.id, id)).for("update");
  if (!j) throw notFound();
  if (j.status === "cancelled") throw conflict("already_cancelled");
  const company = await resolveCompany(tx, j.companyId);
  if (j.kind !== "opening") assertPeriodOpen(await fiscalYearForDate(tx, actor.tenantId, company, j.date), j.date);
  await reverseMoves(tx, "stock_journal", id);
  await tx.update(tables.stockJournals).set({ status: "cancelled" }).where(eq(tables.stockJournals.id, id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "cancel", entity: "stock_journal", entityId: id, after: { reason }, ip: actor.ip });
}

/** What live reservations still hold, per item, across all orders. */
export async function reservedByItem(tx: Tx, companyId: string): Promise<Map<string, ReturnType<typeof dec>>> {
  const rows = [...await tx.execute<{ item_id: string; held: string }>(sql`
    select r.item_id, sum(least(r.qty, greatest(l.qty - greatest(l.delivered_qty, l.invoiced_qty), 0)))::text as held
    from stock_reservations r join sales_order_lines l on l.id = r.order_line_id join sales_orders o on o.id = l.order_id
    where r.company_id = ${companyId} and not r.released and o.status in ('open', 'partial') group by 1`)];
  return new Map(rows.map((r) => [r.item_id, dec(r.held)]));
}

// ---- Reports ------------------------------------------------------------------------------------

export async function stockSummary(tx: Tx, company: Company, asOf: string, warehouseId?: string, includeCommitments = false) {
  const positions = await stockPositions(tx, company, asOf, warehouseId ? { warehouseId } : {});
  const commitments = includeCommitments
    ? await tx.select({
      itemId: tables.salesOrderLines.itemId,
      qty: sql<string>`coalesce(sum(${tables.salesOrderLines.qty} - ${tables.salesOrderLines.deliveredQty}), 0)::text`,
    }).from(tables.salesOrderLines)
      .innerJoin(tables.salesOrders, eq(tables.salesOrders.id, tables.salesOrderLines.orderId))
      .where(and(eq(tables.salesOrders.companyId, company.id), sql`${tables.salesOrders.status} in ('open', 'partial')`))
      .groupBy(tables.salesOrderLines.itemId)
    : [];
  // Goods still to arrive on open purchase orders, for the "available to promise" view.
  const incoming = includeCommitments
    ? await tx.select({
      itemId: tables.purchaseOrderLines.itemId,
      qty: sql<string>`coalesce(sum(greatest(${tables.purchaseOrderLines.qty} - ${tables.purchaseOrderLines.receivedQty}, 0)), 0)::text`,
    }).from(tables.purchaseOrderLines)
      .innerJoin(tables.purchaseOrders, eq(tables.purchaseOrders.id, tables.purchaseOrderLines.orderId))
      .where(and(eq(tables.purchaseOrders.companyId, company.id), sql`${tables.purchaseOrders.status} in ('open', 'partial')`))
      .groupBy(tables.purchaseOrderLines.itemId)
    : [];
  const reserved = includeCommitments ? await reservedByItem(tx, company.id) : new Map<string, ReturnType<typeof dec>>();
  const itemRows = await tx
    .select({ item: tables.items, uom: tables.uoms.code })
    .from(tables.items)
    .innerJoin(tables.uoms, eq(tables.uoms.id, tables.items.uomId))
    .where(and(eq(tables.items.companyId, company.id), eq(tables.items.kind, "goods")))
    .orderBy(asc(tables.items.name));
  const whs = await tx.select().from(tables.warehouses).where(eq(tables.warehouses.companyId, company.id));
  const rows = itemRows.map(({ item, uom }) => {
    const ps = positions.filter((p) => p.itemId === item.id);
    const qty = ps.reduce((s, p) => s.plus(p.qty), dec(0));
    const value = ps.reduce((s, p) => s.plus(p.value), dec(0));
    const promised = dec(commitments.find((c) => c.itemId === item.id)?.qty ?? 0);
    const held = ps.filter((p) => whs.find((w) => w.id === p.warehouseId)?.qualityHold).reduce((s, p) => s.plus(p.qty), dec(0));
    // Available to promise: what is in stock, less what is on quality hold, less what open sales orders still need.
    const available = qty.minus(held).minus(promised);
    return {
      itemId: item.id, name: item.name, nameHi: item.nameHi, sku: item.sku, uom, archived: item.archived,
      qty: qty.toFixed(4), value: money(value), rate: qty.gt(0) ? money(value.div(qty)) : "0.00",
      ...(includeCommitments ? {
        openOrderCommitmentQty: promised.toDecimalPlaces(4).toFixed(4),
        heldQty: held.toDecimalPlaces(4).toFixed(4),
        incomingQty: dec(incoming.find((c) => c.itemId === item.id)?.qty ?? 0).toDecimalPlaces(4).toFixed(4),
        availableQty: available.toDecimalPlaces(4).toFixed(4),
        reservedQty: (reserved.get(item.id) ?? dec(0)).toDecimalPlaces(4).toFixed(4),
        freeToReserveQty: (qty.minus(held).minus(reserved.get(item.id) ?? 0).gt(0) ? qty.minus(held).minus(reserved.get(item.id) ?? 0) : dec(0)).toDecimalPlaces(4).toFixed(4),
        oversold: available.lt(0),
      } : {}),
      reorderLevel: item.reorderLevel, belowReorder: item.reorderLevel !== null && qty.lte(item.reorderLevel),
      warehouses: ps.map((p) => ({ warehouseId: p.warehouseId, name: whs.find((w) => w.id === p.warehouseId)?.name ?? "", qty: p.qty, value: p.value })),
    };
  });
  return { asOf, method: company.valuationMethod, rows, totalValue: money(rows.reduce((s, r) => s.plus(r.value), dec(0))) };
}

/** Posts the reviewed periodic closing-stock delta. A repeat with no stock or ledger changes is a no-op. */
export async function postStockLedgerReconciliation(tx: Tx, actor: Actor, input: { companyId?: string; asOf: string; reason: string; landedCostsBooked: boolean }) {
  if (!input.landedCostsBooked) throw badRequest("landed_costs_not_booked");
  const company = await resolveCompany(tx, input.companyId);
  const [lockedCompany] = await tx.select({ id: tables.companies.id }).from(tables.companies).where(eq(tables.companies.id, company.id)).for("update");
  if (!lockedCompany) throw notFound("company_not_found");
  if (input.asOf < company.booksBeginOn) throw badRequest("before_books_begin");
  await ensureTemplateAccounts(tx, actor.tenantId, company.id, ["closing_stock", "stock_change"]);

  const registerValue = dec((await stockSummary(tx, company, input.asOf)).totalValue);
  const openingRegisterValue = dec((await stockSummary(tx, company, dayBefore(input.asOf))).totalValue);
  const [currentRows, openingRows] = await Promise.all([
    accountBalances(tx, company.id, null, input.asOf),
    accountBalances(tx, company.id, null, dayBefore(input.asOf)),
  ]);
  const accountTotal = (rows: Awaited<ReturnType<typeof accountBalances>>) => dec(rows.filter((r) => r.groupKey === "stock_in_hand").reduce((sum, r) => sum.plus(r.closing), dec(0)));
  const ledgerValueBefore = accountTotal(currentRows);
  const openingLedgerValue = accountTotal(openingRows);
  if (!openingLedgerValue.eq(openingRegisterValue)) throw conflict("opening_stock_balance_mismatch");

  const difference = registerValue.minus(ledgerValueBefore).toDecimalPlaces(2);
  if (difference.isZero()) return { noChange: true, voucherId: null, difference: "0.00", ledgerValueBefore: money(ledgerValueBefore), ledgerValueAfter: money(ledgerValueBefore) };

  const accounts = await tx.select({ id: tables.accounts.id, key: tables.accounts.key, archived: tables.accounts.archived })
    .from(tables.accounts).where(and(eq(tables.accounts.companyId, company.id), inArray(tables.accounts.key, ["closing_stock", "stock_change"])));
  const stockAccount = accounts.find((a) => a.key === "closing_stock");
  const changeAccount = accounts.find((a) => a.key === "stock_change");
  if (!stockAccount || !changeAccount || stockAccount.archived || changeAccount.archived) throw conflict("stock_close_accounts_unavailable");
  const amount = money(difference.abs());
  const lines = difference.gt(0)
    ? [{ accountId: stockAccount.id, debit: amount }, { accountId: changeAccount.id, credit: amount }]
    : [{ accountId: changeAccount.id, debit: amount }, { accountId: stockAccount.id, credit: amount }];
  const { voucher } = await postVoucher(tx, actor, {
    companyId: company.id, type: "journal", date: input.asOf, reference: "Stock close",
    narration: `Stock register reconciliation as of ${input.asOf}: ${input.reason.trim()}`.slice(0, 250), lines,
  });
  return {
    noChange: false, voucherId: voucher.id, voucherNumber: voucher.number, difference: money(difference),
    ledgerValueBefore: money(ledgerValueBefore), ledgerValueAfter: money(ledgerValueBefore.plus(difference)),
  };
}

/** Read-only position-level check for positive stock that has no positive carrying value. */
export async function stockCostCoverage(tx: Tx, company: Company, asOf: string, warehouseId?: string, warehouseScope?: string[] | null) {
  const positions = (await stockPositions(tx, company, asOf, warehouseId ? { warehouseId } : {}))
    .filter((p) => dec(p.qty).gt(0) && (!warehouseScope || warehouseScope.includes(p.warehouseId)));
  const itemRows = await tx.select({ id: tables.items.id, name: tables.items.name, sku: tables.items.sku, uom: tables.uoms.code })
    .from(tables.items)
    .innerJoin(tables.uoms, eq(tables.uoms.id, tables.items.uomId))
    .where(and(eq(tables.items.companyId, company.id), eq(tables.items.kind, "goods")));
  const warehouses = await tx.select({ id: tables.warehouses.id, name: tables.warehouses.name })
    .from(tables.warehouses).where(eq(tables.warehouses.companyId, company.id));
  const items = new Map(itemRows.map((item) => [item.id, item]));
  const stores = new Map(warehouses.map((warehouse) => [warehouse.id, warehouse.name]));
  const rows = positions.flatMap((position) => {
    const item = items.get(position.itemId);
    if (!item) return [];
    const value = dec(position.value);
    return [{
      itemId: position.itemId, name: item.name, sku: item.sku, uom: item.uom,
      warehouseId: position.warehouseId, warehouse: stores.get(position.warehouseId) ?? "",
      qty: position.qty, value: money(value), rate: position.rate,
      costStatus: value.gt(0) ? "valued" as const : value.eq(0) ? "zero_value" as const : "negative_value" as const,
      hasPositiveCarryingValue: value.gt(0),
    }];
  });
  const zeroValueRows = rows.filter((row) => row.costStatus === "zero_value");
  const nonPositiveRows = rows.filter((row) => row.costStatus !== "valued");
  return {
    asOf, method: company.valuationMethod,
    summary: {
      positivePositions: rows.length,
      positionsWithZeroValue: zeroValueRows.length,
      zeroValueQty: dec(zeroValueRows.reduce((sum, row) => sum.plus(row.qty), dec(0))).toFixed(4),
      positionsWithoutPositiveValue: nonPositiveRows.length,
      qtyWithoutPositiveValue: dec(nonPositiveRows.reduce((sum, row) => sum.plus(row.qty), dec(0))).toFixed(4),
      positivePositionValue: money(rows.reduce((sum, row) => sum.plus(row.value), dec(0))),
    },
    rows,
  };
}

/** Movements of one item with running quantity and value (all warehouses merged, each valued on its own). */
export async function itemLedger(tx: Tx, company: Company, itemId: string, from: string, to: string, warehouseId?: string) {
  const rows = await effectiveLedger(tx, company.id, { to, itemIds: [itemId], ...(warehouseId ? { warehouseId } : {}) });
  const byWh = new Map<string, LedgerRow[]>();
  for (const r of rows) byWh.set(r.warehouseId, [...(byWh.get(r.warehouseId) ?? []), r]);
  const valued: (LedgerRow & { valueChange: string })[] = [];
  for (const g of byWh.values()) {
    const v = valueStock(g.map((r) => ({ qtyIn: r.qtyIn, qtyOut: r.qtyOut, rate: r.rate })), company.valuationMethod as ValuationMethod);
    g.forEach((r, i) => valued.push({ ...r, valueChange: v.moves[i]!.valueChange }));
  }
  valued.sort((a, b) => (a.date === b.date ? a.id - b.id : a.date < b.date ? -1 : 1));
  let qty = dec(0);
  let value = dec(0);
  for (const r of valued.filter((x) => x.date < from)) {
    qty = qty.plus(r.qtyIn).minus(r.qtyOut);
    value = value.plus(r.valueChange);
  }
  const opening = { qty: qty.toFixed(4), value: money(value) };
  const entries = valued.filter((x) => x.date >= from).map((r) => {
    qty = qty.plus(r.qtyIn).minus(r.qtyOut);
    value = value.plus(r.valueChange);
    return { ...r, balanceQty: qty.toFixed(4), balanceValue: money(value) };
  });
  return { itemId, from, to, opening, entries, closing: { qty: qty.toFixed(4), value: money(value) } };
}

/** Replaces moves of sets with moves of their pieces (inbound value is shared equally per piece). */
export async function explodePacks<M extends { itemId: string; qtyIn?: string | undefined; qtyOut?: string | undefined; rate?: string | undefined }>(tx: Tx, moves: M[]): Promise<M[]> {
  if (!moves.length) return moves;
  const packIds = (await tx.select({ id: tables.items.id }).from(tables.items).where(and(inArray(tables.items.id, [...new Set(moves.map((m) => m.itemId))]), eq(tables.items.isPack, true)))).map((r) => r.id);
  if (!packIds.length) return moves;
  const lines = await tx.select().from(tables.itemPackLines).where(inArray(tables.itemPackLines.packItemId, packIds));
  return moves.flatMap((m) => {
    if (!packIds.includes(m.itemId)) return [m];
    const parts = lines.filter((l) => l.packItemId === m.itemId);
    const pieces = parts.reduce((s, l) => s.plus(l.qty), dec(0));
    return parts.map((l) => ({
      ...m, itemId: l.itemId,
      ...(m.qtyIn && dec(m.qtyIn).gt(0) ? { qtyIn: dec(m.qtyIn).times(l.qty).toFixed(4) } : {}),
      ...(m.qtyOut && dec(m.qtyOut).gt(0) ? { qtyOut: dec(m.qtyOut).times(l.qty).toFixed(4) } : {}),
      ...(m.rate ? { rate: dec(m.rate).div(pieces).toFixed(4) } : {}),
    }));
  });
}

// ---- alternate units ----------------------------------------------------------------------------

/** Each item's other units ({ uomId, code, factor }), for the items given. */
export async function itemUnitsFor(tx: Tx, itemIds: string[]) {
  const out = new Map<string, { uomId: string; code: string; factor: string }[]>();
  if (!itemIds.length) return out;
  const rows = await tx.select({ itemId: tables.itemUnits.itemId, uomId: tables.itemUnits.uomId, code: tables.uoms.code, factor: tables.itemUnits.factor })
    .from(tables.itemUnits).innerJoin(tables.uoms, eq(tables.uoms.id, tables.itemUnits.uomId)).where(inArray(tables.itemUnits.itemId, itemIds));
  for (const r of rows) out.set(r.itemId, [...(out.get(r.itemId) ?? []), { uomId: r.uomId, code: r.code, factor: r.factor }]);
  return out;
}

/** Replaces the other units of the items given (a dozen = 12 of the item's own unit). */
export async function setItemUnits(tx: Tx, tenantId: string, itemIds: string[], units: { uomId: string; factor: string }[]) {
  const items = await tx.select({ id: tables.items.id, uomId: tables.items.uomId, companyId: tables.items.companyId }).from(tables.items).where(inArray(tables.items.id, itemIds));
  if (items.length !== itemIds.length) throw notFound();
  const uoms = await tx.select({ id: tables.uoms.id }).from(tables.uoms).where(and(eq(tables.uoms.companyId, items[0]!.companyId), inArray(tables.uoms.id, units.map((u) => u.uomId).concat(["00000000-0000-0000-0000-000000000000"]))));
  if (uoms.length !== new Set(units.map((u) => u.uomId)).size) throw badRequest("unknown_uom");
  for (const u of units) {
    if (!dec(u.factor).gt(0)) throw badRequest("invalid_factor");
    if (items.some((i) => i.uomId === u.uomId)) throw badRequest("same_as_base_unit");
  }
  if (new Set(units.map((u) => u.uomId)).size !== units.length) throw badRequest("duplicate_unit");
  await tx.delete(tables.itemUnits).where(inArray(tables.itemUnits.itemId, itemIds));
  if (units.length) await tx.insert(tables.itemUnits).values(itemIds.flatMap((itemId) => units.map((u) => ({ tenantId, itemId, uomId: u.uomId, factor: u.factor }))));
  return (await itemUnitsFor(tx, itemIds)).get(itemIds[0]!) ?? [];
}
