import { and, asc, desc, eq, sql } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { tables, withTenant, type Db } from "@varchasv/db";
import { GST_RATES, GST_SLABS, checkHsn, businessDate, dec, money } from "@varchasv/domain";
import { audit, diff } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { inScope } from "../plugins/storescope.js";
import { can, requireTenant } from "../plugins/auth.js";
import { assertDateRight } from "../lib/rights.js";
import { accountBalances, resolveCompany } from "../services/accounting.js";
import { ALIAS_KINDS, addAlias, itemByCode, listAliases, removeAlias } from "../services/barcodes.js";
import { cancelStockJournal, ensureInventory, itemUnitsFor, setItemUnits, itemLedger, postStockJournal, postStockLedgerReconciliation, stockCostCoverage, stockPositions, stockSummary } from "../services/inventory.js";
import { parsePatch } from "../lib/patch.js";
import { generateBarcodes } from "../services/styles.js";
import { archiveBin, binOverview, cancelPickList, completePickList, createBin, createPickList, getPickList, listPickLists, moveBetweenBins, putAway, scanPick } from "../services/picking.js";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Qty = z.union([z.string().regex(/^\d+(\.\d{1,4})?$/, "invalid_qty"), z.number().positive()]).transform(String);
const Rate = z.union([z.string().regex(/^\d+(\.\d{1,4})?$/, "invalid_rate"), z.number().nonnegative()]).transform(String);
const GstRate = z.union([z.string(), z.number()]).transform(String).refine((v) => (GST_RATES as readonly string[]).includes(String(Number(v))), "invalid_gst_rate").transform((v) => String(Number(v)));
const CompanyQuery = z.object({ companyId: z.uuid().optional() });
const today = () => businessDate();

const ItemBody = z.object({
  name: z.string().trim().min(1).max(150),
  nameHi: z.string().trim().max(150).nullish(),
  sku: z.string().trim().max(40).nullish(),
  barcode: z.string().trim().max(40).nullish(),
  kind: z.enum(["goods", "service"]).default("goods"),
  hsn: z.string().trim().max(8).nullish(),
  gstRate: GstRate.default("18"),
  /** GST by price per piece (apparel, footwear); gstRate is then only the fallback. */
  gstSlab: z.enum(GST_SLABS).nullish(),
  slabPieces: z.number().int().min(1).max(100).default(1),
  cessRate: Rate.default("0"),
  uomId: z.uuid(),
  purchaseRate: Rate.default("0"),
  saleRate: Rate.default("0"),
  mrp: Rate.nullish(),
  reorderLevel: Qty.nullish(),
  reorderQty: Qty.nullish(),
  defaultQty: Qty.nullish(),
  shortCode: z.string().trim().min(1).max(12).regex(/^[A-Za-z0-9]+$/, "invalid_short_code").nullish(),
  trackBatches: z.boolean().default(false),
  leadTimeDays: z.number().int().min(0).max(365).default(0),
});

const UnitsBody = z.object({ units: z.array(z.object({ uomId: z.uuid(), factor: z.union([z.string().regex(/^\d+(\.\d{1,4})?$/), z.number().positive()]).transform(String) })).max(10) });

/**
 * Posting a closing-stock journal changes how the profit and loss, balance sheet and trial balance read stock, and those statements
 * are only correct on the dates a journal is posted. It stays off until the business's accountant has approved the stock policy.
 * Set ENABLE_STOCK_CLOSE_JOURNAL=true to turn it on.
 */
const stockCloseJournalEnabled = () => process.env.ENABLE_STOCK_CLOSE_JOURNAL === "true";

export async function inventoryRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const actor = (auth: { tenantId: string; user: { id: string } }, ip: string) => ({ tenantId: auth.tenantId, userId: auth.user.id, ip });

  app.get("/inventory/setup", { preHandler: can("inventory.view") }, async (req) => {
    const auth = requireTenant(req);
    const { companyId } = CompanyQuery.parse(req.query);
    return withTenant(db, auth.tenantId, async (tx) => {
      const company = await resolveCompany(tx, companyId);
      await ensureInventory(tx, auth.tenantId, company.id);
      const [uoms, warehouses, stockHistory] = await Promise.all([
        tx.select().from(tables.uoms).where(eq(tables.uoms.companyId, company.id)).orderBy(asc(tables.uoms.code)),
        tx.select().from(tables.warehouses).where(eq(tables.warehouses.companyId, company.id)).orderBy(desc(tables.warehouses.isDefault), asc(tables.warehouses.name)),
        tx.select({ id: tables.stockLedger.id }).from(tables.stockLedger).where(eq(tables.stockLedger.companyId, company.id)).limit(1),
      ]);
      return { uoms, warehouses: inScope(req, warehouses, (w) => w.id), valuationMethod: company.valuationMethod, valuationMethodLocked: stockHistory.length > 0 };
    });
  });

  app.patch("/inventory/valuation-method", { preHandler: can("inventory.approve") }, async (req) => {
    const auth = requireTenant(req);
    const body = CompanyQuery.extend({ method: z.enum(["average", "fifo"]) }).parse(req.body);
    return withTenant(db, auth.tenantId, async (tx) => {
      const company = await resolveCompany(tx, body.companyId);
      if (body.method !== company.valuationMethod) {
        const [history] = await tx.select({ id: tables.stockLedger.id }).from(tables.stockLedger).where(eq(tables.stockLedger.companyId, company.id)).limit(1);
        if (history) throw conflict("valuation_method_locked");
      }
      await tx.update(tables.companies).set({ valuationMethod: body.method }).where(eq(tables.companies.id, company.id));
      await audit(tx, { tenantId: auth.tenantId, userId: auth.user.id, action: "update", entity: "company", entityId: company.id, before: { valuationMethod: company.valuationMethod }, after: { valuationMethod: body.method }, ip: req.ip });
      return { method: body.method };
    });
  });

  app.post("/warehouses", { preHandler: can("inventory.create") }, async (req, reply) => {
    const auth = requireTenant(req);
    const body = CompanyQuery.extend({ name: z.string().trim().min(1).max(80), branchId: z.uuid().nullish() }).parse(req.body);
    const w = await withTenant(db, auth.tenantId, async (tx) => {
      const company = await resolveCompany(tx, body.companyId);
      await ensureInventory(tx, auth.tenantId, company.id);
      const [row] = await tx.insert(tables.warehouses).values({ tenantId: auth.tenantId, companyId: company.id, name: body.name, branchId: body.branchId ?? null }).returning()
        .catch((e) => { if (e?.cause?.code === "23505") throw badRequest("warehouse_name_taken"); throw e; });
      await audit(tx, { tenantId: auth.tenantId, userId: auth.user.id, action: "create", entity: "warehouse", entityId: row!.id, after: { name: body.name }, ip: req.ip });
      return row;
    });
    return reply.code(201).send(w);
  });

  // ---- items ---------------------------------------------------------------------------------

  app.get("/items", { preHandler: can("inventory.view") }, async (req) => {
    const auth = requireTenant(req);
    const q = CompanyQuery.parse(req.query);
    return withTenant(db, auth.tenantId, async (tx) => {
      const company = await resolveCompany(tx, q.companyId);
      await ensureInventory(tx, auth.tenantId, company.id);
      const rows = await tx.select({ item: tables.items, uom: tables.uoms.code }).from(tables.items)
        .innerJoin(tables.uoms, eq(tables.uoms.id, tables.items.uomId))
        .where(eq(tables.items.companyId, company.id)).orderBy(asc(tables.items.name));
      const positions = await stockPositions(tx, company, "9999-12-31");
      const units = await itemUnitsFor(tx, rows.map((r) => r.item.id));
      const stock = new Map<string, number>();
      for (const p of positions) stock.set(p.itemId, (stock.get(p.itemId) ?? 0) + Number(p.qty));
      const aliasRows = await tx.select({ itemId: tables.itemBarcodes.itemId, code: tables.itemBarcodes.code }).from(tables.itemBarcodes).where(eq(tables.itemBarcodes.companyId, company.id));
      const aliases = new Map<string, string[]>();
      for (const a of aliasRows) aliases.set(a.itemId, [...(aliases.get(a.itemId) ?? []), a.code]);
      return rows.map(({ item, uom }) => ({ ...item, uom, units: units.get(item.id) ?? [], aliases: aliases.get(item.id) ?? [], stockQty: (stock.get(item.id) ?? 0).toFixed(4) }));
    });
  });

  /** Other codes an item answers to: a supplier's barcode, an old label, a merged duplicate's code. */
  app.post("/items/barcodes/generate", { preHandler: can("inventory.edit") }, async (req) => {
    const body = z.object({ itemIds: z.array(z.uuid()).max(5000).optional() }).parse(req.body ?? {});
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => generateBarcodes(tx, actor(auth, req.ip), body.itemIds));
  });
  app.get("/items/:id/barcodes", { preHandler: can("inventory.view") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    return withTenant(db, auth.tenantId, (tx) => listAliases(tx, id));
  });
  app.post("/items/:id/barcodes", { preHandler: can("inventory.edit") }, async (req, reply) => {
    const auth = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = z.object({ code: z.string().trim().min(1).max(40), kind: z.enum(ALIAS_KINDS).default("alternate"), supplierId: z.uuid().nullish() }).parse(req.body);
    return reply.code(201).send(await withTenant(db, auth.tenantId, (tx) => addAlias(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }, id, body)));
  });
  app.delete("/items/barcodes/:id", { preHandler: can("inventory.edit") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    await withTenant(db, auth.tenantId, (tx) => removeAlias(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }, id));
    return { ok: true };
  });
  /** Which item a scanned code belongs to, counting its own barcode, SKU and every alias. */
  app.get("/items/by-code", { preHandler: can("inventory.view") }, async (req) => {
    const auth = requireTenant(req);
    const q = CompanyQuery.extend({ code: z.string().trim().min(1).max(40) }).parse(req.query);
    return withTenant(db, auth.tenantId, async (tx) => {
      const itemId = await itemByCode(tx, (await resolveCompany(tx, q.companyId)).id, q.code);
      if (!itemId) throw notFound("unknown_barcode");
      return { itemId };
    });
  });

  /** Other units an item is bought or sold in; replaces the whole list. */
  app.put("/items/:id/units", { preHandler: can("inventory.edit") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const { units } = UnitsBody.parse(req.body);
    return withTenant(db, auth.tenantId, (tx) => setItemUnits(tx, auth.tenantId, [id], units));
  });

  app.get("/items/:id", { preHandler: can("inventory.view") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    return withTenant(db, auth.tenantId, async (tx) => {
      const [row] = await tx.select({ item: tables.items, uom: tables.uoms.code }).from(tables.items).innerJoin(tables.uoms, eq(tables.uoms.id, tables.items.uomId)).where(eq(tables.items.id, id));
      if (!row) throw notFound();
      const company = await resolveCompany(tx, row.item.companyId);
      const positions = await stockPositions(tx, company, "9999-12-31", { itemIds: [id] });
      const whs = await tx.select().from(tables.warehouses).where(eq(tables.warehouses.companyId, company.id));
      return { ...row.item, uom: row.uom, stock: positions.map((p) => ({ ...p, warehouse: whs.find((w) => w.id === p.warehouseId)?.name })) };
    });
  });

  app.post("/items", { preHandler: can("inventory.create") }, async (req, reply) => {
    const auth = requireTenant(req);
    const { companyId } = CompanyQuery.parse(req.query);
    const body = ItemBody.parse(req.body);
    if (body.hsn && checkHsn(body.hsn, body.kind)) throw badRequest(body.kind === "service" ? "invalid_sac" : "invalid_hsn");
    const item = await withTenant(db, auth.tenantId, async (tx) => {
      const company = await resolveCompany(tx, companyId);
      await ensureInventory(tx, auth.tenantId, company.id);
      const [uom] = await tx.select().from(tables.uoms).where(and(eq(tables.uoms.id, body.uomId), eq(tables.uoms.companyId, company.id)));
      if (!uom) throw badRequest("unknown_uom");
      const [row] = await tx.insert(tables.items).values({ ...body, tenantId: auth.tenantId, companyId: company.id, sku: body.sku || null, barcode: body.barcode || null }).returning()
        .catch((e) => { if (e?.cause?.code === "23505") throw badRequest(String(e?.cause?.constraint_name).includes("sku") ? "sku_taken" : String(e?.cause?.constraint_name).includes("short_code") ? "short_code_taken" : "item_name_taken"); throw e; });
      await audit(tx, { tenantId: auth.tenantId, userId: auth.user.id, action: "create", entity: "item", entityId: row!.id, after: { name: row!.name, hsn: row!.hsn, gstRate: row!.gstRate }, ip: req.ip });
      return row;
    });
    return reply.code(201).send(item);
  });

  app.patch("/items/:id", { preHandler: can("inventory.edit") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = parsePatch(ItemBody.omit({ kind: true }).partial().extend({ archived: z.boolean().optional() }), req.body);
    return withTenant(db, auth.tenantId, async (tx) => {
      const [current] = await tx.select().from(tables.items).where(eq(tables.items.id, id)).for("update");
      if (!current) throw notFound();
      if (body.hsn && checkHsn(body.hsn, current.kind as "goods" | "service")) throw badRequest(current.kind === "service" ? "invalid_sac" : "invalid_hsn");
      const d = diff(current as Record<string, unknown>, body);
      if (!d.changed) return current;
      const [row] = await tx.update(tables.items).set({ ...body, updatedAt: new Date() }).where(eq(tables.items.id, id)).returning()
        .catch((e) => { if (e?.cause?.code === "23505") throw badRequest(String(e?.cause?.constraint_name).includes("short_code") ? "short_code_taken" : "item_name_taken"); throw e; });
      await audit(tx, { tenantId: auth.tenantId, userId: auth.user.id, action: "update", entity: "item", entityId: id, ...d, ip: req.ip });
      return row;
    });
  });

  // ---- stock journals -------------------------------------------------------------------------

  app.get("/stock-journals", { preHandler: can("inventory.view") }, async (req) => {
    const auth = requireTenant(req);
    const q = CompanyQuery.parse(req.query);
    return withTenant(db, auth.tenantId, async (tx) => {
      const company = await resolveCompany(tx, q.companyId);
      return tx.select({
        journal: tables.stockJournals,
        lines: sql<number>`(select count(*)::int from stock_journal_lines l where l.journal_id = stock_journals.id)`,
      }).from(tables.stockJournals).where(eq(tables.stockJournals.companyId, company.id)).orderBy(desc(tables.stockJournals.date), desc(tables.stockJournals.createdAt)).limit(200)
        .then((rows) => rows.map((r) => ({ ...r.journal, lineCount: r.lines })));
    });
  });

  app.get("/stock-journals/:id", { preHandler: can("inventory.view") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    return withTenant(db, auth.tenantId, async (tx) => {
      const [j] = await tx.select().from(tables.stockJournals).where(eq(tables.stockJournals.id, id));
      if (!j) throw notFound();
      const lines = await tx.select({ line: tables.stockJournalLines, item: tables.items.name, itemHi: tables.items.nameHi })
        .from(tables.stockJournalLines).innerJoin(tables.items, eq(tables.items.id, tables.stockJournalLines.itemId))
        .where(eq(tables.stockJournalLines.journalId, id)).orderBy(asc(tables.stockJournalLines.lineNo));
      return { ...j, lines: lines.map((l) => ({ ...l.line, itemName: l.item, itemNameHi: l.itemHi })) };
    });
  });

  app.post("/stock-journals", { preHandler: can("inventory.create") }, async (req, reply) => {
    const auth = requireTenant(req);
    const body = z.object({
      companyId: z.uuid().optional(),
      kind: z.enum(["opening", "adjustment", "transfer", "issue"]),
      date: IsoDate.optional(),
      narration: z.string().trim().max(300).optional(),
      lines: z.array(z.object({
        itemId: z.uuid(), warehouseId: z.uuid(), toWarehouseId: z.uuid().optional(), qty: Qty,
        direction: z.enum(["in", "out"]).optional(), rate: Rate.optional(), batchNo: z.string().trim().max(40).optional(), expiry: IsoDate.optional(),
      })).min(1).max(500),
    }).parse(req.body);
    const r = await withTenant(db, auth.tenantId, (tx) => postStockJournal(tx, actor(auth, req.ip), body));
    return reply.code(201).send({ ...r.journal, warnings: r.warnings });
  });

  app.post("/stock-journals/:id/cancel", { preHandler: can("inventory.cancel") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const { reason } = z.object({ reason: z.string().trim().min(3).max(300) }).parse(req.body);
    await withTenant(db, auth.tenantId, (tx) => cancelStockJournal(tx, actor(auth, req.ip), id, reason));
    return { ok: true };
  });

  // ---- reports -------------------------------------------------------------------------------

  app.get("/reports/stock-summary", { preHandler: can("inventory.view") }, async (req) => {
    const auth = requireTenant(req);
    const q = CompanyQuery.extend({ asOf: IsoDate.default(today), warehouseId: z.uuid().optional(), includeCommitments: z.enum(["true", "false"]).default("false").transform((value) => value === "true") }).parse(req.query);
    // Someone limited to stores sees one store at a time: the whole-business total would show stock they may not see.
    if (auth.warehouseScope && !q.warehouseId) throw badRequest("choose_store");
    if (q.includeCommitments && (auth.warehouseScope || q.warehouseId)) throw badRequest("full_company_access_required");
    if (q.includeCommitments && q.asOf !== today()) throw badRequest("commitments_current_only");
    return withTenant(db, auth.tenantId, async (tx) => stockSummary(tx, await resolveCompany(tx, q.companyId), q.asOf, q.warehouseId, q.includeCommitments));
  });

  app.get("/reports/stock-cost-coverage", { preHandler: can("inventory.view") }, async (req) => {
    const auth = requireTenant(req);
    const q = CompanyQuery.extend({ asOf: IsoDate.default(today), warehouseId: z.uuid().optional() }).parse(req.query);
    // When no store is selected, a store-limited user sees the combined report for only their allowed stores.
    return withTenant(db, auth.tenantId, async (tx) => stockCostCoverage(tx, await resolveCompany(tx, q.companyId), q.asOf, q.warehouseId, auth.warehouseScope));
  });

  app.get("/reports/stock-ledger-reconciliation", { preHandler: can("inventory.view") }, async (req) => {
    const auth = requireTenant(req);
    if (auth.warehouseScope) throw badRequest("full_company_access_required");
    const q = CompanyQuery.extend({ asOf: IsoDate.default(today) }).parse(req.query);
    return withTenant(db, auth.tenantId, async (tx) => {
      const company = await resolveCompany(tx, q.companyId);
      const [stock, balances] = await Promise.all([
        stockSummary(tx, company, q.asOf),
        accountBalances(tx, company.id, null, q.asOf),
      ]);
      const stockAccounts = balances.filter((row) => row.groupKey === "stock_in_hand");
      const ledgerValue = dec(stockAccounts.reduce((sum, row) => sum.plus(row.closing), dec(0)));
      const stockValue = dec(stock.totalValue);
      const difference = stockValue.minus(ledgerValue);
      const history = await tx.select({ id: tables.vouchers.id, number: tables.vouchers.number, date: tables.vouchers.date, narration: tables.vouchers.narration, status: tables.vouchers.status, total: tables.vouchers.total })
        .from(tables.vouchers)
        .where(and(eq(tables.vouchers.companyId, company.id), eq(tables.vouchers.type, "journal"), sql`${tables.vouchers.narration} like 'Stock register reconciliation as of %'`))
        .orderBy(desc(tables.vouchers.date), desc(tables.vouchers.createdAt)).limit(50);
      return {
        asOf: q.asOf, accountingMethod: "periodic", valuationMethod: stock.method,
        stockSubledgerValue: money(stockValue), stockInHandLedgerValue: money(ledgerValue), difference: money(difference),
        status: difference.isZero() ? "reconciled" : "review_required",
        postingEnabled: stockCloseJournalEnabled(),
        stockInHandAccounts: stockAccounts.map(({ accountId, name, closing }) => ({ accountId, name, balance: closing })),
        recentReconciliations: history,
        note: "Periodic inventory is valued from the stock register. Review the difference before close. The separate posting action creates an audited journal only when an approver supplies a review reason; the report itself never forces a balancing entry.",
      };
    });
  });

  app.post("/inventory/stock-ledger-reconciliations", { preHandler: can("inventory.approve") }, async (req) => {
    const auth = requireTenant(req);
    if (auth.warehouseScope) throw badRequest("full_company_access_required");
    if (!stockCloseJournalEnabled()) throw conflict("stock_close_disabled");
    const body = CompanyQuery.extend({ asOf: IsoDate, reason: z.string().trim().min(3).max(250), landedCostsBooked: z.boolean().default(false) }).parse(req.body);
    assertDateRight(auth, body.asOf);
    return withTenant(db, auth.tenantId, (tx) => postStockLedgerReconciliation(tx, actor(auth, req.ip), body));
  });

  app.get("/reports/item-ledger/:itemId", { preHandler: can("inventory.view") }, async (req) => {
    const auth = requireTenant(req);
    const { itemId } = z.object({ itemId: z.uuid() }).parse(req.params);
    const q = z.object({ from: IsoDate, to: IsoDate, warehouseId: z.uuid().optional() }).parse(req.query);
    return withTenant(db, auth.tenantId, async (tx) => {
      const [it] = await tx.select().from(tables.items).where(eq(tables.items.id, itemId));
      if (!it) throw notFound();
      return itemLedger(tx, await resolveCompany(tx, it.companyId), itemId, q.from, q.to, q.warehouseId);
    });
  });

  app.get("/reports/reorder", { preHandler: can("inventory.view") }, async (req) => {
    const auth = requireTenant(req);
    const q = CompanyQuery.parse(req.query);
    return withTenant(db, auth.tenantId, async (tx) => {
      const s = await stockSummary(tx, await resolveCompany(tx, q.companyId), "9999-12-31");
      const items = await tx.select().from(tables.items).where(eq(tables.items.archived, false));
      return s.rows.filter((r) => r.belowReorder && !r.archived).map((r) => {
        const it = items.find((i) => i.id === r.itemId)!;
        // Suggest the reorder quantity if set, else enough to get back to twice the reorder level.
        const suggested = it.reorderQty ?? (Number(it.reorderLevel) * 2 - Number(r.qty)).toFixed(4);
        return { ...r, reorderQty: it.reorderQty, suggestedQty: suggested, purchaseRate: it.purchaseRate };
      });
    });
  });

  // ---- bins and pick lists -------------------------------------------------------------------------

  const who = (req: Parameters<typeof requireTenant>[0]) => { const auth = requireTenant(req); return { auth, a: { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip } }; };
  app.get("/warehouses/:id/bins", { preHandler: can("inventory.view") }, async (req) => {
    const { auth } = who(req);
    return withTenant(db, auth.tenantId, (tx) => binOverview(tx, z.object({ id: z.uuid() }).parse(req.params).id));
  });
  app.post("/bins", { preHandler: can("inventory.create") }, async (req, reply) => {
    const { auth, a } = who(req);
    const b = z.object({ warehouseId: z.uuid(), code: z.string().trim().min(1).max(20), note: z.string().trim().max(80).optional(), companyId: z.uuid().optional() }).parse(req.body);
    return reply.code(201).send(await withTenant(db, auth.tenantId, (tx) => createBin(tx, a, b)));
  });
  app.post("/bins/:id/archive", { preHandler: can("inventory.edit") }, async (req) => {
    const { auth, a } = who(req);
    await withTenant(db, auth.tenantId, (tx) => archiveBin(tx, a, z.object({ id: z.uuid() }).parse(req.params).id));
    return { ok: true };
  });
  app.post("/bins/put-away", { preHandler: can("inventory.edit") }, async (req) => {
    const { auth, a } = who(req);
    const b = z.object({ binId: z.uuid(), itemId: z.uuid(), qty: Qty }).parse(req.body);
    await withTenant(db, auth.tenantId, (tx) => putAway(tx, a, b));
    return { ok: true };
  });
  app.post("/bins/move", { preHandler: can("inventory.edit") }, async (req) => {
    const { auth, a } = who(req);
    const b = z.object({ fromBinId: z.uuid(), toBinId: z.uuid(), itemId: z.uuid(), qty: Qty }).parse(req.body);
    await withTenant(db, auth.tenantId, (tx) => moveBetweenBins(tx, a, b));
    return { ok: true };
  });

  app.get("/pick-lists", { preHandler: can("inventory.view") }, async (req) => {
    const { auth } = who(req);
    const q = z.object({ status: z.enum(["open", "done", "cancelled"]).optional(), companyId: z.uuid().optional() }).parse(req.query);
    return withTenant(db, auth.tenantId, (tx) => listPickLists(tx, q.status, q.companyId));
  });
  app.get("/pick-lists/:id", { preHandler: can("inventory.view") }, async (req) => {
    const { auth } = who(req);
    return withTenant(db, auth.tenantId, (tx) => getPickList(tx, z.object({ id: z.uuid() }).parse(req.params).id));
  });
  app.post("/pick-lists", { preHandler: can("inventory.create") }, async (req, reply) => {
    const { auth, a } = who(req);
    const b = z.object({ orderId: z.uuid(), warehouseId: z.uuid(), companyId: z.uuid().optional() }).parse(req.body);
    return reply.code(201).send(await withTenant(db, auth.tenantId, (tx) => createPickList(tx, a, b)));
  });
  app.post("/pick-lists/:id/scan", { preHandler: can("inventory.edit") }, async (req) => {
    const { auth, a } = who(req);
    const b = z.object({ code: z.string().trim().min(1).max(60), qty: z.number().int().min(1).max(1000).default(1) }).parse(req.body);
    return withTenant(db, auth.tenantId, (tx) => scanPick(tx, a, z.object({ id: z.uuid() }).parse(req.params).id, b.code, b.qty));
  });
  app.post("/pick-lists/:id/complete", { preHandler: can("inventory.edit") }, async (req) => {
    const { auth, a } = who(req);
    const b = z.object({ acceptShort: z.boolean().default(false) }).parse(req.body ?? {});
    return withTenant(db, auth.tenantId, (tx) => completePickList(tx, a, z.object({ id: z.uuid() }).parse(req.params).id, b.acceptShort));
  });
  app.post("/pick-lists/:id/cancel", { preHandler: can("inventory.edit") }, async (req) => {
    const { auth, a } = who(req);
    await withTenant(db, auth.tenantId, (tx) => cancelPickList(tx, a, z.object({ id: z.uuid() }).parse(req.params).id));
    return { ok: true };
  });
}
