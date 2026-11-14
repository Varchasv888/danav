import { assertNotBelowCost } from "../lib/rights.js";
import { assertDateRight, recordPrint } from "../lib/rights.js";
import { and, asc, desc, eq, gte, lte } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { outstanding } from "../services/returns.js";
import { tables, withTenant, type Db } from "@varchasv/db";
import { isValidStateCode, businessDate } from "@varchasv/domain";
import { forbidden, notFound } from "../lib/errors.js";
import { can, requireTenant } from "../plugins/auth.js";
import { fiscalYearForDate, peekNumber, resolveCompany } from "../services/accounting.js";
import { salesFlow } from "../services/salesflow.js";
import { backorders, orderReservations, releaseOrder, reserveOrder } from "../services/reservations.js";
import { closeClaim, deliveryExceptions, getProof, recordProof } from "../services/deliveryproof.js";
import { decideInspection, listInspections } from "../services/returninspection.js";
import { invoicePrintData } from "../services/sharing.js";
import {
  CHALLAN_REASONS, SALES_SERIES, approvalInvoiceBy, pendingSamples, cancelCreditNote, cancelDeliveryNote, cancelEinvoice, cancelEwayBill, cancelSalesInvoice, createCreditNote, createDeliveryNote,
  createQuotation, createSalesInvoice, createSalesOrder, extendEwayBill, generateEinvoice, generateEwayBill, pendingApprovals, returnDeliveryGoods, setQuotationStatus,
  setSalesOrderStatus, updateEwayBillVehicle,
  earlyDiscount,
} from "../services/sales.js";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Qty = z.union([z.string().regex(/^\d+(\.\d{1,4})?$/, "invalid_qty"), z.number().positive()]).transform(String);
const Rate = z.union([z.string().regex(/^\d+(\.\d{1,4})?$/, "invalid_rate"), z.number().nonnegative()]).transform(String);
const Money = z.union([z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_amount"), z.number().nonnegative()]).transform(String);
const Pct = z.union([z.string(), z.number()]).transform(String);
const Reason = z.object({ reason: z.string().trim().min(3).max(300) });
const IdParam = z.object({ id: z.uuid() });
const State = z.string().refine(isValidStateCode, "invalid_state");
const Supply = z.object({ placeOfSupply: State.optional(), export: z.boolean().optional(), sez: z.boolean().optional(), lut: z.boolean().optional() }).optional();
/** Letting a sale through a credit block is for owners and admins (sales.approve). */
const Override = { overrideCredit: z.boolean().optional(), overrideReason: z.string().trim().min(3).max(200).optional() };
/** Agent (with a commission rate for this document) and salesman; null clears the customer's default. */
const People = {
  agentId: z.uuid().nullish(), salesmanId: z.uuid().nullish(), helperId: z.uuid().nullish(),
  agentPct: z.union([z.string().regex(/^\d{1,2}(\.\d{1,2})?$/, "invalid_percent"), z.number().min(0).max(99.99)]).transform(String).optional(),
};
const mayOverride = (auth: ReturnType<typeof requireTenant>, body: { overrideCredit?: boolean | undefined }) => {
  if (body.overrideCredit && !auth.permissions.has("sales.approve")) throw forbidden("override_not_allowed");
};
const PriceLine = z.object({ itemId: z.uuid(), qty: Qty, rate: Rate, discount: Money.optional(), gstRate: Pct.optional(), cessRate: Pct.optional(), description: z.string().max(200).optional() });

export async function salesRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const actor = (auth: { tenantId: string; user: { id: string } }, ip: string) => ({ tenantId: auth.tenantId, userId: auth.user.id, ip });

  // ---- lists and detail ----------------------------------------------------------------------

  type Header = typeof tables.salesInvoices;
  const list = (path: string, table: unknown) =>
    app.get(path, { preHandler: can("sales.view") }, async (req) => {
      const auth = requireTenant(req);
      const q = z.object({
        companyId: z.uuid().optional(), status: z.string().max(16).optional(), customerId: z.uuid().optional(), from: IsoDate.optional(), to: IsoDate.optional(),
        kind: z.enum(["quotation", "proforma"]).optional(), reason: z.enum(CHALLAN_REASONS).optional(),
      }).parse(req.query);
      return withTenant(db, auth.tenantId, async (tx) => {
        const company = await resolveCompany(tx, q.companyId);
        const t = table as Header;
        const rows = await tx.select({ doc: t, customerName: tables.accounts.name }).from(t).innerJoin(tables.accounts, eq(tables.accounts.id, t.customerId))
          .where(and(
            eq(t.companyId, company.id), q.status ? eq(t.status, q.status) : undefined, q.customerId ? eq(t.customerId, q.customerId) : undefined,
            q.from ? gte(t.date, q.from) : undefined, q.to ? lte(t.date, q.to) : undefined,
            // Quotations and proformas share a table; so do challans of every reason.
            t === (tables.quotations as unknown) ? eq(tables.quotations.kind, q.kind ?? "quotation") : undefined,
            q.reason && t === (tables.deliveryNotes as unknown) ? eq(tables.deliveryNotes.reason, q.reason) : undefined,
          ))
          .orderBy(desc(t.date), desc(t.createdAt)).limit(500);
        return rows.map((r) => ({ ...r.doc, customerName: r.customerName, signedQr: undefined }));
      });
    });
  list("/quotations", tables.quotations);
  list("/sales-orders", tables.salesOrders);
  list("/delivery-notes", tables.deliveryNotes);
  list("/sales-invoices", tables.salesInvoices);
  list("/credit-notes", tables.creditNotes);

  const withLines = (tenantId: string, header: unknown, id: string, lineTable: unknown, fk: string) =>
    withTenant(db, tenantId, async (tx) => {
      const h = header as Header;
      const [doc] = await tx.select({ doc: h, customerName: tables.accounts.name, customerGstin: tables.accounts.gstin, customerPhone: tables.accounts.phone }).from(h)
        .innerJoin(tables.accounts, eq(tables.accounts.id, h.customerId)).where(eq(h.id, id));
      if (!doc) throw notFound();
      const lt = lineTable as typeof tables.salesInvoiceLines & Record<string, typeof tables.salesInvoiceLines.invoiceId>;
      const lines = await tx.select({ line: lt, itemName: tables.items.name, itemNameHi: tables.items.nameHi, hsn: tables.items.hsn, uom: tables.uoms.code, kind: tables.items.kind })
        .from(lt).innerJoin(tables.items, eq(tables.items.id, lt.itemId)).innerJoin(tables.uoms, eq(tables.uoms.id, tables.items.uomId))
        .where(eq(lt[fk]!, id)).orderBy(asc(lt.lineNo));
      return { ...doc.doc, customerName: (doc.doc as { customerName?: string }).customerName ?? doc.customerName, supplierGstin: doc.customerGstin, customerPhone: doc.customerPhone, lines: lines.map((l) => ({ ...l.line, itemName: l.itemName, itemNameHi: l.itemNameHi, hsn: l.hsn, uom: l.uom, kind: l.kind })) };
    });
  app.get("/quotations/:id", { preHandler: can("sales.view") }, async (req) => withLines(requireTenant(req).tenantId, tables.quotations, IdParam.parse(req.params).id, tables.quotationLines, "quotationId"));
  app.get("/sales-orders/:id", { preHandler: can("sales.view") }, async (req) => withLines(requireTenant(req).tenantId, tables.salesOrders, IdParam.parse(req.params).id, tables.salesOrderLines, "orderId"));
  app.get("/delivery-notes/:id", { preHandler: can("sales.view") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = IdParam.parse(req.params);
    const note = await withLines(auth.tenantId, tables.deliveryNotes, id, tables.deliveryNoteLines, "noteId") as unknown as { date: string; reason: string };
    const returns = await withTenant(db, auth.tenantId, (tx) => tx.select().from(tables.deliveryReturns).where(eq(tables.deliveryReturns.noteId, id)).orderBy(asc(tables.deliveryReturns.date)));
    return { ...note, returns, ...(note.reason === "approval" ? { invoiceBy: approvalInvoiceBy(note.date) } : {}) };
  });
  /** Approval memos with goods still out, oldest first, with the date each must be invoiced by. */
  app.get("/approvals/pending", { preHandler: can("sales.view") }, async (req) => {
    const auth = requireTenant(req);
    const q = z.object({ companyId: z.uuid().optional(), today: IsoDate.optional() }).parse(req.query);
    return withTenant(db, auth.tenantId, async (tx) => pendingApprovals(tx, (await resolveCompany(tx, q.companyId)).id, q.today ?? businessDate()));
  });
  /** Samples sent out and not yet back, oldest first. */
  app.get("/samples/pending", { preHandler: can("sales.view") }, async (req) => {
    const auth = requireTenant(req);
    const q = z.object({ companyId: z.uuid().optional(), today: IsoDate.optional() }).parse(req.query);
    return withTenant(db, auth.tenantId, async (tx) => pendingSamples(tx, (await resolveCompany(tx, q.companyId)).id, q.today ?? businessDate()));
  });
  /** A challan for printing in triplicate: company, branch and the consignee's current details. */
  app.get("/delivery-notes/:id/print", { preHandler: can("sales.view") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = IdParam.parse(req.params);
    if (z.object({ count: z.literal("1").optional() }).parse(req.query).count) await withTenant(db, auth.tenantId, (tx) => recordPrint(tx, auth, "sales", "delivery_note", id));
    const n = await withLines(auth.tenantId, tables.deliveryNotes, id, tables.deliveryNoteLines, "noteId") as unknown as typeof tables.deliveryNotes.$inferSelect & { lines: unknown[] };
    return withTenant(db, auth.tenantId, async (tx) => {
      const company = await resolveCompany(tx, n.companyId);
      const [customer] = await tx.select().from(tables.accounts).where(eq(tables.accounts.id, n.customerId));
      const [branch] = await tx.select().from(tables.branches).where(and(eq(tables.branches.companyId, company.id), eq(tables.branches.isHeadOffice, true)));
      const [settings] = await tx.select().from(tables.gstSettings).where(eq(tables.gstSettings.companyId, company.id));
      return {
        invoice: {
          ...n, placeOfSupply: n.placeOfSupply ?? customer!.stateCode ?? branch!.stateCode, supplyKind: n.supplyKind ?? "intra", lut: false,
          customerName: customer!.name, customerGstin: customer!.gstin, billingAddress: { ...(customer!.address ?? {}), stateCode: customer!.stateCode ?? undefined },
          ...(n.reason === "approval" ? { validUntil: approvalInvoiceBy(n.date) } : {}),
        },
        company: { name: company.name, legalName: company.legalName, pan: company.pan }, branch,
        settings: settings ?? { bilingualPrint: true, printLanguage: "hi", invoiceTerms: null, bankDetails: null },
      };
    });
  });
  app.get("/sales-invoices/:id/early-discount", { preHandler: can("sales.view") }, async (req) => {
    const { id } = IdParam.parse(req.params);
    const q = z.object({ date: IsoDate.default(businessDate()) }).parse(req.query);
    return withTenant(db, requireTenant(req).tenantId, (tx) => earlyDiscount(tx, id, q.date));
  });
  app.get("/sales-invoices/:id", { preHandler: can("sales.view") }, async (req) => withLines(requireTenant(req).tenantId, tables.salesInvoices, IdParam.parse(req.params).id, tables.salesInvoiceLines, "invoiceId"));
  // ---- return inspection ------------------------------------------------------------------------
  app.get("/return-inspections", { preHandler: can("sales.view") }, async (req) => {
    const q = z.object({ status: z.enum(["pending", "done"]).optional() }).parse(req.query);
    return withTenant(db, requireTenant(req).tenantId, (tx) => listInspections(tx, q.status));
  });
  app.post("/return-inspections/:id/decide", { preHandler: can("inventory.edit") }, async (req) => {
    const auth = requireTenant(req);
    const b = z.object({ restock: Qty.optional(), writeOff: Qty.optional(), restockTo: z.uuid().optional(), reason: z.enum(["damaged", "lost", "theft", "expired", "sample", "other"]).optional(), note: z.string().trim().max(300).optional() }).parse(req.body);
    return withTenant(db, auth.tenantId, (tx) => decideInspection(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }, auth.permissions.has("inventory.approve"), IdParam.parse(req.params).id, b));
  });

  // ---- proof of delivery -------------------------------------------------------------------------
  app.get("/delivery-notes/:id/proof", { preHandler: can("sales.view") }, async (req) =>
    withTenant(db, requireTenant(req).tenantId, async (tx) => ({ proof: await getProof(tx, IdParam.parse(req.params).id) })));
  app.post("/delivery-notes/:id/proof", { preHandler: can("sales.create") }, async (req, reply) => {
    const auth = requireTenant(req);
    const b = z.object({
      receivedOn: IsoDate, receivedBy: z.string().trim().min(2).max(80), fileId: z.uuid().optional(), note: z.string().trim().max(300).optional(),
      claimOwnerId: z.uuid().optional(), claimDays: z.number().int().min(1).max(60).optional(),
      lines: z.array(z.object({ noteLineId: z.uuid(), short: Qty.optional(), damaged: Qty.optional() })).max(300).default([]),
    }).parse(req.body);
    return reply.code(201).send(await withTenant(db, auth.tenantId, (tx) => recordProof(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }, IdParam.parse(req.params).id, b)));
  });
  app.post("/delivery-proofs/:id/close", { preHandler: can("sales.edit") }, async (req) => {
    const auth = requireTenant(req);
    const b = z.object({ status: z.enum(["settled", "waived"]), note: z.string().trim().min(1).max(300) }).parse(req.body);
    await withTenant(db, auth.tenantId, (tx) => closeClaim(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }, IdParam.parse(req.params).id, b.status, b.note));
    return { ok: true };
  });
  /** Open claims for short or damaged goods, and challans sent a few days ago with no proof recorded. */
  app.get("/reports/delivery-proofs", { preHandler: can("sales.view") }, async (req) =>
    withTenant(db, requireTenant(req).tenantId, (tx) => deliveryExceptions(tx)));

  // ---- stock set aside for orders ---------------------------------------------------------------
  app.get("/sales-orders/:id/reservations", { preHandler: can("sales.view") }, async (req) =>
    withTenant(db, requireTenant(req).tenantId, (tx) => orderReservations(tx, IdParam.parse(req.params).id)));
  app.post("/sales-orders/:id/reserve", { preHandler: can("sales.create") }, async (req) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => reserveOrder(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }, IdParam.parse(req.params).id));
  });
  app.post("/sales-orders/:id/release", { preHandler: can("sales.edit") }, async (req) => {
    const auth = requireTenant(req);
    const b = z.object({ lineId: z.uuid().optional() }).parse(req.body ?? {});
    return withTenant(db, auth.tenantId, (tx) => releaseOrder(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }, IdParam.parse(req.params).id, b.lineId));
  });
  /** What open orders want that nothing has been set aside for, with free stock and what is on order from suppliers. */
  app.get("/reports/backorders", { preHandler: can("sales.view") }, async (req) =>
    withTenant(db, requireTenant(req).tenantId, (tx) => backorders(tx)));

  /** The trail one document belongs to: quotation, order, delivery order, challan, invoice, receipts and credit notes. */
  app.get("/sales/flow", { preHandler: can("sales.view") }, async (req) => {
    const q = z.object({ kind: z.enum(["quotation", "order", "deliveryOrder", "challan", "invoice", "creditNote"]), id: z.uuid() }).parse(req.query);
    return withTenant(db, requireTenant(req).tenantId, (tx) => salesFlow(tx, q.kind, q.id));
  });
  app.get("/credit-notes/:id", { preHandler: can("sales.view") }, async (req) => withLines(requireTenant(req).tenantId, tables.creditNotes, IdParam.parse(req.params).id, tables.creditNoteLines, "noteId"));

  /** Everything the printed invoice needs: company, branch, GST settings, invoice and lines. */
  app.get("/sales-invoices/:id/print", { preHandler: can("sales.view") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = IdParam.parse(req.params);
    if (z.object({ count: z.literal("1").optional() }).parse(req.query).count) await withTenant(db, auth.tenantId, (tx) => recordPrint(tx, auth, "sales", "sales_invoice", id));
    return withTenant(db, auth.tenantId, (tx) => invoicePrintData(tx, id));
  });

  /** A quotation for printing: the customer's current name, GSTIN and address stand in for an invoice's copies. */
  app.get("/quotations/:id/print", { preHandler: can("sales.view") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = IdParam.parse(req.params);
    if (z.object({ count: z.literal("1").optional() }).parse(req.query).count) await withTenant(db, auth.tenantId, (tx) => recordPrint(tx, auth, "sales", "quotation", id));
    const q = await withLines(auth.tenantId, tables.quotations, id, tables.quotationLines, "quotationId") as unknown as typeof tables.quotations.$inferSelect & { lines: unknown[] };
    return withTenant(db, auth.tenantId, async (tx) => {
      const company = await resolveCompany(tx, q.companyId);
      const [customer] = await tx.select().from(tables.accounts).where(eq(tables.accounts.id, q.customerId));
      const [branch] = await tx.select().from(tables.branches).where(eq(tables.branches.id, q.branchId));
      const [settings] = await tx.select().from(tables.gstSettings).where(eq(tables.gstSettings.companyId, company.id));
      return {
        invoice: { ...q, customerName: customer!.name, customerGstin: customer!.gstin, billingAddress: { ...(customer!.address ?? {}), stateCode: customer!.stateCode ?? undefined } },
        company: { name: company.name, legalName: company.legalName, pan: company.pan }, branch,
        settings: settings ?? { bilingualPrint: true, printLanguage: "hi", invoiceTerms: null, bankDetails: null },
      };
    });
  });

  // ---- create -------------------------------------------------------------------------------

  app.post("/quotations", { preHandler: can("sales.create") }, async (req, reply) => {
    const auth = requireTenant(req);
    const body = z.object({
      companyId: z.uuid().optional(), branchId: z.uuid().optional(), customerId: z.uuid(), date: IsoDate, validUntil: IsoDate.optional(),
      customerReference: z.string().max(40).optional(), narration: z.string().max(300).optional(), terms: z.string().max(1000).optional(),
      supply: Supply, lines: z.array(PriceLine).min(1).max(300), kind: z.enum(["quotation", "proforma"]).optional(), advanceDue: Money.optional(),
    }).parse(req.body);
    return reply.code(201).send(await withTenant(db, auth.tenantId, (tx) => createQuotation(tx, actor(auth, req.ip), body)));
  });
  for (const [action, status, perm] of [["accept", "accepted", "sales.edit"], ["decline", "declined", "sales.edit"], ["cancel", "cancelled", "sales.cancel"]] as const) {
    app.post(`/quotations/:id/${action}`, { preHandler: can(perm) }, async (req) => {
      const auth = requireTenant(req);
      await withTenant(db, auth.tenantId, (tx) => setQuotationStatus(tx, actor(auth, req.ip), IdParam.parse(req.params).id, status));
      return { ok: true };
    });
  }

  app.post("/sales-orders", { preHandler: can("sales.create") }, async (req, reply) => {
    const auth = requireTenant(req);
    const body = z.object({
      companyId: z.uuid().optional(), branchId: z.uuid().optional(), customerId: z.uuid(), quotationId: z.uuid().optional(), date: IsoDate, deliverBy: IsoDate.optional(),
      customerReference: z.string().max(40).optional(), narration: z.string().max(300).optional(), supply: Supply, lines: z.array(PriceLine).min(1).max(300), ...Override, ...People,
    }).parse(req.body);
    mayOverride(auth, body);
    return reply.code(201).send(await withTenant(db, auth.tenantId, (tx) => createSalesOrder(tx, actor(auth, req.ip), body)));
  });
  app.post("/sales-orders/:id/close", { preHandler: can("sales.edit") }, async (req) => {
    const auth = requireTenant(req);
    await withTenant(db, auth.tenantId, (tx) => setSalesOrderStatus(tx, actor(auth, req.ip), IdParam.parse(req.params).id, "closed"));
    return { ok: true };
  });
  app.post("/sales-orders/:id/cancel", { preHandler: can("sales.cancel") }, async (req) => {
    const auth = requireTenant(req);
    await withTenant(db, auth.tenantId, (tx) => setSalesOrderStatus(tx, actor(auth, req.ip), IdParam.parse(req.params).id, "cancelled"));
    return { ok: true };
  });

  app.post("/delivery-notes", { preHandler: can("sales.create") }, async (req, reply) => {
    const auth = requireTenant(req);
    const body = z.object({
      companyId: z.uuid().optional(), customerId: z.uuid(), orderId: z.uuid().optional(), warehouseId: z.uuid().optional(), date: IsoDate, narration: z.string().max(300).optional(),
      reason: z.enum(CHALLAN_REASONS).optional(), transporter: z.string().trim().max(80).optional(), vehicleNo: z.string().trim().toUpperCase().max(16).optional(),
      lines: z.array(z.object({ itemId: z.uuid(), qty: Qty, orderLineId: z.uuid().optional(), deliveryOrderLineId: z.uuid().optional(), batchNo: z.string().max(40).optional(), rate: Rate.optional() })).min(1).max(300), ...Override,
    }).parse(req.body);
    mayOverride(auth, body);
    const r = await withTenant(db, auth.tenantId, (tx) => createDeliveryNote(tx, actor(auth, req.ip), body));
    return reply.code(201).send({ ...r.note, warnings: r.warnings });
  });
  app.post("/delivery-notes/:id/returns", { preHandler: can("sales.create") }, async (req, reply) => {
    const auth = requireTenant(req);
    const body = z.object({ date: IsoDate, narration: z.string().max(300).optional(), inspect: z.boolean().optional(), lines: z.array(z.object({ lineId: z.uuid(), qty: Qty })).min(1).max(300) }).parse(req.body);
    return reply.code(201).send(await withTenant(db, auth.tenantId, (tx) => returnDeliveryGoods(tx, actor(auth, req.ip), IdParam.parse(req.params).id, body)));
  });
  app.post("/delivery-notes/:id/cancel", { preHandler: can("sales.cancel") }, async (req) => {
    const auth = requireTenant(req);
    const { reason } = Reason.parse(req.body);
    await withTenant(db, auth.tenantId, (tx) => cancelDeliveryNote(tx, actor(auth, req.ip), IdParam.parse(req.params).id, reason));
    return { ok: true };
  });

  /** What the invoice form shows before saving: the number the invoice will get (if nobody else saves first) and the bank details and terms printed on it. */
  app.get("/sales-invoices/form-info", { preHandler: can("sales.view") }, async (req) => {
    const auth = requireTenant(req);
    const { date } = z.object({ date: IsoDate.default(() => new Date().toISOString().slice(0, 10)) }).parse(req.query);
    return withTenant(db, auth.tenantId, async (tx) => {
      const company = await resolveCompany(tx);
      const fy = await fiscalYearForDate(tx, auth.tenantId, company, date);
      const [settings] = await tx.select({ bankDetails: tables.gstSettings.bankDetails, invoiceTerms: tables.gstSettings.invoiceTerms }).from(tables.gstSettings).where(eq(tables.gstSettings.companyId, company.id));
      return { number: await peekNumber(tx, company.id, fy, SALES_SERIES.invoice), bankDetails: settings?.bankDetails ?? null, terms: settings?.invoiceTerms ?? null };
    });
  });
  /** What a customer owes now and how much of it is overdue: the chip beside the customer on a sales document. */
  app.get("/customers/:id/balance", { preHandler: can("sales.view") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = IdParam.parse(req.params);
    return withTenant(db, auth.tenantId, async (tx) => {
      const row = (await outstanding(tx, undefined, "receivable", new Date().toISOString().slice(0, 10), id)).rows[0];
      const overdue = (row?.openItems ?? []).filter((o) => o.daysOverdue > 0).reduce((n, o) => n + Number(o.amount), 0);
      return { balance: row?.balance ?? "0.00", advance: row?.advance ?? "0.00", overdue: overdue.toFixed(2) };
    });
  });
  app.post("/sales-invoices", { preHandler: can("sales.create") }, async (req, reply) => {
    const auth = requireTenant(req);
    const body = z.object({
      companyId: z.uuid().optional(), branchId: z.uuid().optional(), customerId: z.uuid(), orderId: z.uuid().optional(), quotationId: z.uuid().optional(), projectId: z.uuid().optional(),
      date: IsoDate, dueOn: IsoDate.optional(),
      supply: Supply, narration: z.string().max(300).optional(), cartons: z.number().int().min(1).max(100000).optional(),
      transporter: z.string().trim().max(80).optional(), vehicleNo: z.string().trim().toUpperCase().regex(/^[A-Z0-9 -]{4,15}$/, "invalid_vehicle").optional(),
      lrNumber: z.string().trim().max(30).optional(), lrDate: IsoDate.optional(), ewbNo: z.string().regex(/^\d{12}$/, "invalid_ewb").optional(),
      discounts: z.object({ special: z.string().regex(/^\d{1,2}(\.\d{1,2})?$/, "invalid_percent").optional(), cash: z.string().regex(/^\d{1,2}(\.\d{1,2})?$/, "invalid_percent").optional() }).optional(),
      earlyPay: z.object({ pct: z.string().regex(/^\d{1,2}(\.\d{1,2})?$/, "invalid_percent"), days: z.number().int().min(1).max(365) }).optional(),
      shippingAddress: z.object({ line1: z.string().max(200).optional(), city: z.string().max(100).optional(), pincode: z.string().regex(/^[1-9]\d{5}$/).optional(), stateCode: State.optional() }).optional(),
      lines: z.array(PriceLine.extend({
        deliveryLineId: z.uuid().optional(), orderLineId: z.uuid().optional(), warehouseId: z.uuid().optional(), batchNo: z.string().max(40).optional(),
      })).min(1).max(300),
      ...Override, ...People,
    }).parse(req.body);
    assertDateRight(auth, body.date);
    mayOverride(auth, body);
    const r = await withTenant(db, auth.tenantId, async (tx) => { await assertNotBelowCost(tx, auth, body.lines); return createSalesInvoice(tx, actor(auth, req.ip), body); });
    return reply.code(201).send({ ...r.invoice, warnings: r.warnings });
  });
  app.post("/sales-invoices/:id/cancel", { preHandler: can("sales.cancel") }, async (req) => {
    const auth = requireTenant(req);
    const { reason } = Reason.parse(req.body);
    await withTenant(db, auth.tenantId, (tx) => cancelSalesInvoice(tx, actor(auth, req.ip), IdParam.parse(req.params).id, reason));
    return { ok: true };
  });

  app.post("/credit-notes", { preHandler: can("sales.create") }, async (req, reply) => {
    const auth = requireTenant(req);
    const body = z.object({
      invoiceId: z.uuid(), date: IsoDate, reason: z.string().trim().min(3).max(300), goodsReturned: z.boolean().default(true), warehouseId: z.uuid().optional(), inspect: z.boolean().optional(),
      lines: z.array(z.object({ invoiceLineId: z.uuid(), qty: Qty, rate: Rate.optional() })).min(1).max(300),
    }).parse(req.body);
    assertDateRight(auth, body.date);
    const r = await withTenant(db, auth.tenantId, (tx) => createCreditNote(tx, actor(auth, req.ip), body));
    return reply.code(201).send({ ...r.creditNote, warnings: r.warnings });
  });
  app.post("/credit-notes/:id/cancel", { preHandler: can("sales.cancel") }, async (req) => {
    const auth = requireTenant(req);
    const { reason } = Reason.parse(req.body);
    await withTenant(db, auth.tenantId, (tx) => cancelCreditNote(tx, actor(auth, req.ip), IdParam.parse(req.params).id, reason));
    return { ok: true };
  });

  // ---- e-invoice and e-way bill ---------------------------------------------------------------

  for (const [path, kind] of [["sales-invoices", "invoice"], ["credit-notes", "credit_note"]] as const) {
    app.post(`/${path}/:id/einvoice`, { preHandler: can("gst.submit") }, async (req) => {
      const auth = requireTenant(req);
      return withTenant(db, auth.tenantId, (tx) => generateEinvoice(tx, actor(auth, req.ip), kind, IdParam.parse(req.params).id));
    });
    app.post(`/${path}/:id/einvoice/cancel`, { preHandler: can("gst.cancel") }, async (req) => {
      const auth = requireTenant(req);
      // IRP cancel reasons: 1 duplicate, 2 data entry mistake, 3 order cancelled, 4 other.
      const body = z.object({ reason: z.enum(["1", "2", "3", "4"]), remark: z.string().trim().min(3).max(100) }).parse(req.body);
      await withTenant(db, auth.tenantId, (tx) => cancelEinvoice(tx, actor(auth, req.ip), kind, IdParam.parse(req.params).id, body.reason, body.remark));
      return { ok: true };
    });
  }
  app.post("/sales-invoices/:id/eway-bill", { preHandler: can("gst.submit") }, async (req) => {
    const auth = requireTenant(req);
    const body = z.object({ vehicleNo: z.string().trim().min(6).max(15), distanceKm: z.number().int().min(1).max(4000) }).parse(req.body);
    return withTenant(db, auth.tenantId, (tx) => generateEwayBill(tx, actor(auth, req.ip), IdParam.parse(req.params).id, body));
  });
  const Vehicle = z.string().trim().min(6).max(15);
  const Remark = z.string().trim().min(3).max(100);
  const Place = z.string().trim().min(2).max(50);
  app.post("/sales-invoices/:id/eway-bill/vehicle", { preHandler: can("gst.submit") }, async (req) => {
    const auth = requireTenant(req);
    const body = z.object({ vehicleNo: Vehicle, fromPlace: Place, fromState: State.optional(), reason: z.enum(["1", "2", "3", "4"]), remark: Remark }).parse(req.body);
    await withTenant(db, auth.tenantId, (tx) => updateEwayBillVehicle(tx, actor(auth, req.ip), IdParam.parse(req.params).id, body));
    return { ok: true };
  });
  app.post("/sales-invoices/:id/eway-bill/extend", { preHandler: can("gst.submit") }, async (req) => {
    const auth = requireTenant(req);
    const body = z.object({
      vehicleNo: Vehicle.optional(), fromPlace: Place, fromState: State.optional(), fromPincode: z.string().regex(/^[1-9]\d{5}$/, "invalid_pincode"),
      remainingKm: z.number().int().min(1).max(4000), reason: z.enum(["1", "2", "4", "5", "99"]), remark: Remark,
    }).parse(req.body);
    return withTenant(db, auth.tenantId, (tx) => extendEwayBill(tx, actor(auth, req.ip), IdParam.parse(req.params).id, body));
  });
  app.post("/sales-invoices/:id/eway-bill/cancel", { preHandler: can("gst.cancel") }, async (req) => {
    const auth = requireTenant(req);
    const body = z.object({ reason: z.enum(["1", "2", "3", "4"]), remark: Remark }).parse(req.body);
    await withTenant(db, auth.tenantId, (tx) => cancelEwayBill(tx, actor(auth, req.ip), IdParam.parse(req.params).id, body));
    return { ok: true };
  });
}
