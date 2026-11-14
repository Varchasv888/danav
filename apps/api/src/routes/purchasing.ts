import { assertDateRight } from "../lib/rights.js";
import { and, asc, desc, eq, gte, inArray, lte } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { DEFECT_CODES } from "@varchasv/domain";
import { tables, withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { badRequest, notFound } from "../lib/errors.js";
import { addQuote, archiveQuote, billShortages, purchaseMatch, quoteComparison, receivingAgainstOrder, supplierScorecard } from "../services/purchasereports.js";
import { resolveCompany } from "../services/accounting.js";
import { purchaseFlow } from "../services/purchaseflow.js";
import {
  cancelGoodsReceipt, holdList, releaseHold, returnToSupplier, supplierClaims, cancelPurchaseBill, cancelPurchaseReturn, createGoodsReceipt, createPurchaseBill, createPurchaseOrder, purchaseHistory,
  createPurchaseReturn, decidePurchaseOrder, purchaseApprovalLimit, setOrderStatus, setPurchaseApprovalLimit,
} from "../services/purchasing.js";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Qty = z.union([z.string().regex(/^\d+(\.\d{1,4})?$/, "invalid_qty"), z.number().positive()]).transform(String);
const Rate = z.union([z.string().regex(/^\d+(\.\d{1,4})?$/, "invalid_rate"), z.number().nonnegative()]).transform(String);
const Money = z.union([z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_amount"), z.number().nonnegative()]).transform(String);
const Pct = z.union([z.string(), z.number()]).transform(String);
const Reason = z.object({ reason: z.string().trim().min(3).max(300) });
const IdParam = z.object({ id: z.uuid() });

const PriceLine = z.object({
  itemId: z.uuid(), qty: Qty, rate: Rate, discount: Money.optional(), gstRate: Pct.optional(), cessRate: Pct.optional(), description: z.string().max(200).optional(),
});

export async function purchasingRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const actor = (auth: { tenantId: string; user: { id: string } }, ip: string) => ({ tenantId: auth.tenantId, userId: auth.user.id, ip });

  /** Header rows with the supplier's name, for list screens. */
  const list = <T extends typeof tables.purchaseOrders | typeof tables.goodsReceipts | typeof tables.purchaseBills | typeof tables.purchaseReturns>(path: string, table: T) =>
    app.get(path, { preHandler: can("purchase.view") }, async (req) => {
      const auth = requireTenant(req);
      const q = z.object({ companyId: z.uuid().optional(), status: z.string().max(12).optional(), supplierId: z.uuid().optional(), from: IsoDate.optional(), to: IsoDate.optional() }).parse(req.query);
      return withTenant(db, auth.tenantId, async (tx) => {
        const company = await resolveCompany(tx, q.companyId);
        const t = table as typeof tables.purchaseBills;
        const rows = await tx.select({ doc: t, supplierName: tables.accounts.name }).from(t)
          .innerJoin(tables.accounts, eq(tables.accounts.id, t.supplierId))
          .where(and(
            eq(t.companyId, company.id), q.status ? eq(t.status, q.status) : undefined, q.supplierId ? eq(t.supplierId, q.supplierId) : undefined,
            q.from ? gte(t.date, q.from) : undefined, q.to ? lte(t.date, q.to) : undefined,
          ))
          .orderBy(desc(t.date), desc(t.createdAt)).limit(500);
        return rows.map((r) => ({ ...r.doc, supplierName: r.supplierName }));
      });
    });
  list("/purchase-orders", tables.purchaseOrders);
  list("/goods-receipts", tables.goodsReceipts);
  list("/purchase-bills", tables.purchaseBills);
  list("/purchase-returns", tables.purchaseReturns);

  const withLines = async (tenantId: string, header: typeof tables.purchaseBills, id: string, lineTable: typeof tables.purchaseBillLines, fk: "billId" | "orderId" | "receiptId" | "returnId") =>
    withTenant(db, tenantId, async (tx) => {
      const [doc] = await tx.select({ doc: header, supplierName: tables.accounts.name, supplierGstin: tables.accounts.gstin })
        .from(header).innerJoin(tables.accounts, eq(tables.accounts.id, header.supplierId)).where(eq(header.id, id));
      if (!doc) throw notFound();
      const lt = lineTable as unknown as typeof tables.purchaseBillLines & Record<string, typeof tables.purchaseBillLines.billId>;
      const lines = await tx.select({ line: lt, itemName: tables.items.name, itemNameHi: tables.items.nameHi, hsn: tables.items.hsn })
        .from(lt).innerJoin(tables.items, eq(tables.items.id, lt.itemId))
        .where(eq(lt[fk]!, id)).orderBy(asc(lt.lineNo));
      return { ...doc.doc, supplierName: doc.supplierName, supplierGstin: doc.supplierGstin, lines: lines.map((l) => ({ ...l.line, itemName: l.itemName, itemNameHi: l.itemNameHi, hsn: l.hsn })) };
    });

  app.get("/purchase-orders/:id", { preHandler: can("purchase.view") }, async (req) =>
    withLines(requireTenant(req).tenantId, tables.purchaseOrders as never, IdParam.parse(req.params).id, tables.purchaseOrderLines as never, "orderId"));
  app.get("/goods-receipts/:id", { preHandler: can("purchase.view") }, async (req) => {
    const tenantId = requireTenant(req).tenantId;
    const id = IdParam.parse(req.params).id;
    const receipt = await withLines(tenantId, tables.goodsReceipts as never, id, tables.goodsReceiptLines as never, "receiptId");
    const landedCharges = await withTenant(db, tenantId, async (tx) => {
      const charges = await tx.select().from(tables.goodsReceiptLandedCharges).where(eq(tables.goodsReceiptLandedCharges.receiptId, id)).orderBy(asc(tables.goodsReceiptLandedCharges.createdAt));
      if (!charges.length) return [];
      const allocations = await tx.select({ allocation: tables.goodsReceiptLandedAllocations, lineNo: tables.goodsReceiptLines.lineNo, itemId: tables.goodsReceiptLines.itemId })
        .from(tables.goodsReceiptLandedAllocations).innerJoin(tables.goodsReceiptLines, eq(tables.goodsReceiptLines.id, tables.goodsReceiptLandedAllocations.receiptLineId))
        .where(inArray(tables.goodsReceiptLandedAllocations.chargeId, charges.map((charge) => charge.id)));
      return charges.map((charge) => ({ ...charge, allocations: allocations.filter((row) => row.allocation.chargeId === charge.id).map((row) => ({ ...row.allocation, lineNo: row.lineNo, itemId: row.itemId })) }));
    });
    return { ...receipt, landedCharges };
  });
  app.get("/items/:id/purchase-history", { preHandler: can("purchase.view") }, async (req) => {
    const { limit } = z.object({ limit: z.coerce.number().int().min(1).max(20).default(5) }).parse(req.query);
    return withTenant(db, requireTenant(req).tenantId, (tx) => purchaseHistory(tx, IdParam.parse(req.params).id, limit));
  });
  app.get("/purchase-bills/:id", { preHandler: can("purchase.view") }, async (req) =>
    withLines(requireTenant(req).tenantId, tables.purchaseBills, IdParam.parse(req.params).id, tables.purchaseBillLines, "billId"));
  /** The trail one document belongs to: purchase order, goods receipt, bill, payments and returns to the supplier. */
  app.get("/purchase/flow", { preHandler: can("purchase.view") }, async (req) => {
    const q = z.object({ kind: z.enum(["order", "receipt", "bill", "return"]), id: z.uuid() }).parse(req.query);
    return withTenant(db, requireTenant(req).tenantId, (tx) => purchaseFlow(tx, q.kind, q.id));
  });
  /** Ordered, received and billed for one order, line by line, with what to look at. */
  app.get("/purchase/match", { preHandler: can("purchase.view") }, async (req) => {
    const q = z.object({ orderId: z.uuid() }).parse(req.query);
    return withTenant(db, requireTenant(req).tenantId, (tx) => purchaseMatch(tx, q.orderId));
  });
  /** Goods counted at the gate against an order: what is short, over, not on the order, or a code nobody knows. Saves nothing. */
  app.post("/purchase-orders/:id/receiving-check", { preHandler: can("purchase.view") }, async (req) => {
    const id = IdParam.parse(req.params).id;
    const body = z.object({ scans: z.array(z.object({ code: z.string().trim().min(1).max(60), qty: Qty })).max(2000) }).parse(req.body);
    return withTenant(db, requireTenant(req).tenantId, (tx) => receivingAgainstOrder(tx, id, body.scans));
  });
  /** Supplier measures over a date range: on time, in full, short and damaged, lead time, billed rate against ordered rate. */
  app.get("/purchase/supplier-scorecard", { preHandler: can("purchase.view") }, async (req) => {
    const q = z.object({ from: IsoDate, to: IsoDate, companyId: z.uuid().optional() }).parse(req.query);
    if (q.to < q.from) throw badRequest("invalid_dates");
    return withTenant(db, requireTenant(req).tenantId, (tx) => supplierScorecard(tx, q.from, q.to, q.companyId));
  });
  /** Quotes for one item side by side, cheapest landed cost first. */
  app.get("/purchase/quotes", { preHandler: can("purchase.view") }, async (req) => {
    const q = z.object({ itemId: z.uuid(), companyId: z.uuid().optional() }).parse(req.query);
    return withTenant(db, requireTenant(req).tenantId, (tx) => quoteComparison(tx, q.itemId, q.companyId));
  });
  app.post("/purchase/quotes", { preHandler: can("purchase.create") }, async (req, reply) => {
    const auth = requireTenant(req);
    const b = z.object({
      supplierId: z.uuid(), itemId: z.uuid(), rate: Rate, extraCost: Rate.optional(), minQty: Qty.optional(), leadDays: z.number().int().min(0).max(365).optional(),
      quotedOn: IsoDate, validUntil: IsoDate.optional(), note: z.string().max(200).optional(), companyId: z.uuid().optional(),
    }).parse(req.body);
    return reply.code(201).send(await withTenant(db, auth.tenantId, (tx) => addQuote(tx, actor(auth, req.ip), b)));
  });
  app.post("/purchase/quotes/:id/archive", { preHandler: can("purchase.edit") }, async (req) => {
    const auth = requireTenant(req);
    await withTenant(db, auth.tenantId, (tx) => archiveQuote(tx, actor(auth, req.ip), IdParam.parse(req.params).id));
    return { ok: true };
  });
  app.get("/purchase-bills/:id/shortages", { preHandler: can("purchase.view") }, async (req) =>
    withTenant(db, requireTenant(req).tenantId, (tx) => billShortages(tx, IdParam.parse(req.params).id)));
  app.get("/purchase-returns/:id", { preHandler: can("purchase.view") }, async (req) =>
    withLines(requireTenant(req).tenantId, tables.purchaseReturns as never, IdParam.parse(req.params).id, tables.purchaseReturnLines as never, "returnId"));

  // ---- create -------------------------------------------------------------------------------

  app.post("/purchase-orders", { preHandler: can("purchase.create") }, async (req, reply) => {
    const auth = requireTenant(req);
    const body = z.object({
      companyId: z.uuid().optional(), branchId: z.uuid().optional(), supplierId: z.uuid(), date: IsoDate, expectedOn: IsoDate.optional(),
      narration: z.string().max(300).optional(), lines: z.array(PriceLine).min(1).max(300),
    }).parse(req.body);
    // Above the company's limit an order waits for someone with the purchase approve right, unless that is who raised it.
    return reply.code(201).send(await withTenant(db, auth.tenantId, (tx) => createPurchaseOrder(tx, actor(auth, req.ip), body, auth.permissions.has("purchase.approve"))));
  });
  app.post("/purchase-orders/:id/decide", { preHandler: can("purchase.approve") }, async (req) => {
    const auth = requireTenant(req);
    const b = z.object({ decision: z.enum(["approve", "reject"]), note: z.string().trim().max(200).optional() }).parse(req.body);
    await withTenant(db, auth.tenantId, (tx) => decidePurchaseOrder(tx, actor(auth, req.ip), IdParam.parse(req.params).id, b.decision, b.note));
    return { ok: true };
  });
  app.get("/settings/purchase-approval", { preHandler: can("settings.view") }, async (req) => withTenant(db, requireTenant(req).tenantId, (tx) => purchaseApprovalLimit(tx)));
  app.put("/settings/purchase-approval", { preHandler: can("settings.edit") }, async (req) => {
    const auth = requireTenant(req);
    const b = z.object({ limit: Money.nullable() }).parse(req.body);
    return withTenant(db, auth.tenantId, (tx) => setPurchaseApprovalLimit(tx, actor(auth, req.ip), b.limit));
  });

  app.post("/purchase-orders/:id/close", { preHandler: can("purchase.edit") }, async (req) => {
    const auth = requireTenant(req);
    await withTenant(db, auth.tenantId, (tx) => setOrderStatus(tx, actor(auth, req.ip), IdParam.parse(req.params).id, "closed"));
    return { ok: true };
  });

  app.post("/purchase-orders/:id/cancel", { preHandler: can("purchase.cancel") }, async (req) => {
    const auth = requireTenant(req);
    await withTenant(db, auth.tenantId, (tx) => setOrderStatus(tx, actor(auth, req.ip), IdParam.parse(req.params).id, "cancelled"));
    return { ok: true };
  });

  app.post("/goods-receipts", { preHandler: can("purchase.create") }, async (req, reply) => {
    const auth = requireTenant(req);
    const body = z.object({
      companyId: z.uuid().optional(), supplierId: z.uuid(), orderId: z.uuid().optional(), warehouseId: z.uuid().optional(), date: IsoDate,
      supplierChallan: z.string().max(40).optional(), narration: z.string().max(300).optional(),
      transporter: z.string().max(80).optional(), lrNumber: z.string().max(30).optional(), lrDate: IsoDate.optional(),
      landedCharges: z.array(z.object({
        description: z.string().trim().min(3).max(120), sourceDocument: z.string().trim().min(1).max(120),
        grossAmount: Money, recoverableGst: Money.optional(), allocationBasis: z.enum(["direct", "weight", "volume", "net_value", "units"]),
        allocations: z.array(z.object({ lineIndex: z.number().int().min(0).max(299), amount: Money })).min(1).max(300),
      })).max(100).optional(),
      lines: z.array(z.object({
        itemId: z.uuid(), qty: Qty, rate: Rate.optional(), landedCostPerUnit: Rate.optional(), landedCostNote: z.string().trim().min(3).max(160).optional(), mrp: z.union([z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_amount"), z.number().positive()]).transform(String).optional(),
        orderLineId: z.uuid().optional(), batchNo: z.string().max(40).optional(), expiry: IsoDate.optional(),
        saleRate: z.union([z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_amount"), z.number().positive()]).transform(String).optional(),
        challanQty: Qty.optional(), short: z.union([Qty, z.literal("0")]).optional(), damaged: z.union([Qty, z.literal("0")]).optional(), defectCode: z.enum(DEFECT_CODES).optional(), hold: z.union([Qty, z.literal("0")]).optional(), serials: z.array(z.string().trim().min(1).max(40)).max(5000).optional(),
      })).min(1).max(300),
    }).parse(req.body);
    assertDateRight(auth, body.date);
    const r = await withTenant(db, auth.tenantId, (tx) => createGoodsReceipt(tx, actor(auth, req.ip), body));
    return reply.code(201).send({ ...r.receipt, warnings: r.warnings });
  });

  app.get("/goods-receipts/holds", { preHandler: can("purchase.view") }, async (req) => withTenant(db, requireTenant(req).tenantId, (tx) => holdList(tx)));
  app.get("/reports/supplier-claims", { preHandler: can("purchase.view") }, async (req) => {
    const q = z.object({ from: IsoDate, to: IsoDate }).parse(req.query);
    return withTenant(db, requireTenant(req).tenantId, (tx) => supplierClaims(tx, q.from, q.to));
  });
  app.post("/goods-receipts/:id/release-hold", { preHandler: can("purchase.approve") }, async (req) => {
    const auth = requireTenant(req);
    const body = z.object({ date: IsoDate, lines: z.array(z.object({ lineId: z.uuid(), accept: z.string().regex(/^\d+(\.\d{1,4})?$/).default("0"), reject: z.string().regex(/^\d+(\.\d{1,4})?$/).default("0") })).min(1).max(300) }).parse(req.body);
    assertDateRight(auth, body.date);
    return withTenant(db, auth.tenantId, (tx) => releaseHold(tx, actor(auth, req.ip), IdParam.parse(req.params).id, body));
  });
  app.post("/goods-receipts/:id/return", { preHandler: can("purchase.create") }, async (req) => {
    const auth = requireTenant(req);
    const body = z.object({ date: IsoDate, reason: z.string().trim().min(3).max(200), lines: z.array(z.object({ lineId: z.uuid(), qty: Qty })).min(1).max(300) }).parse(req.body);
    assertDateRight(auth, body.date);
    return withTenant(db, auth.tenantId, (tx) => returnToSupplier(tx, actor(auth, req.ip), IdParam.parse(req.params).id, body));
  });
  app.post("/goods-receipts/:id/cancel", { preHandler: can("purchase.cancel") }, async (req) => {
    const auth = requireTenant(req);
    const { reason } = Reason.parse(req.body);
    await withTenant(db, auth.tenantId, (tx) => cancelGoodsReceipt(tx, actor(auth, req.ip), IdParam.parse(req.params).id, reason));
    return { ok: true };
  });

  app.post("/purchase-bills", { preHandler: can("purchase.create") }, async (req, reply) => {
    const auth = requireTenant(req);
    const body = z.object({
      companyId: z.uuid().optional(), branchId: z.uuid().optional(), supplierId: z.uuid(), orderId: z.uuid().optional(), date: IsoDate,
      // GST: a supplier invoice number is at most 16 characters.
      supplierInvoiceNo: z.string().trim().min(1).max(16), supplierInvoiceDate: IsoDate, dueOn: IsoDate.optional(),
      reverseCharge: z.boolean().optional(), narration: z.string().max(300).optional(), projectId: z.uuid().optional(),
      lines: z.array(PriceLine.extend({
        receiptLineId: z.uuid().optional(), orderLineId: z.uuid().optional(), warehouseId: z.uuid().optional(),
        batchNo: z.string().max(40).optional(), expiry: IsoDate.optional(),
      })).min(1).max(300),
    }).parse(req.body);
    assertDateRight(auth, body.date);
    const r = await withTenant(db, auth.tenantId, (tx) => createPurchaseBill(tx, actor(auth, req.ip), body));
    return reply.code(201).send({ ...r.bill, warnings: r.warnings });
  });

  app.post("/purchase-bills/:id/cancel", { preHandler: can("purchase.cancel") }, async (req) => {
    const auth = requireTenant(req);
    const { reason } = Reason.parse(req.body);
    await withTenant(db, auth.tenantId, (tx) => cancelPurchaseBill(tx, actor(auth, req.ip), IdParam.parse(req.params).id, reason));
    return { ok: true };
  });

  app.post("/purchase-returns", { preHandler: can("purchase.create") }, async (req, reply) => {
    const auth = requireTenant(req);
    const body = z.object({
      billId: z.uuid(), date: IsoDate, reason: z.string().trim().min(3).max(300), warehouseId: z.uuid().optional(), shortage: z.boolean().optional(),
      lines: z.array(z.object({ billLineId: z.uuid(), qty: Qty })).min(1).max(300),
    }).parse(req.body);
    const r = await withTenant(db, auth.tenantId, (tx) => createPurchaseReturn(tx, actor(auth, req.ip), body));
    return reply.code(201).send({ ...r.purchaseReturn, warnings: r.warnings });
  });

  app.post("/purchase-returns/:id/cancel", { preHandler: can("purchase.cancel") }, async (req) => {
    const auth = requireTenant(req);
    const { reason } = Reason.parse(req.body);
    await withTenant(db, auth.tenantId, (tx) => cancelPurchaseReturn(tx, actor(auth, req.ip), IdParam.parse(req.params).id, reason));
    return { ok: true };
  });
}
