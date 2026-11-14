import type { FastifyInstance } from "fastify";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { badRequest } from "../lib/errors.js";
import { DIMENSIONS, profitability } from "../services/profitability.js";
import { abcClassification, allParties, bankStatementReport, discountReport, saleByCategory, stockByCategory, expenseReport, hsnSummary, itemDetail, itemDiscount, likelyDue, loanStatement, lowStock, partyByItem, saleByParty, saleOrderItems, stockDetail } from "../services/reportlists2.js";
import { billWiseProfit, gstRateReport, transactionsList, TXN_TYPES } from "../services/reportlists.js";

const Day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");

/** The profitability waterfall: gross sales down to operating profit, by style, brand, item, size, customer, store or channel. */
export async function profitabilityRoutes(app: FastifyInstance, { db }: { db: Db }) {
  app.get("/reports/profitability", { preHandler: can("reports.view") }, async (req) => {
    const auth = requireTenant(req);
    const q = z.object({ from: Day, to: Day, by: z.enum(DIMENSIONS).default("style"), costing: z.enum(["standard", "actual"]).default("standard") }).parse(req.query);
    // costing=actual reads what the goods really cost from the stock ledger; the default keeps each item's standard cost.
    return withTenant(db, auth.tenantId, (tx) => profitability(tx, q.from, q.to, q.by, q.costing));
  });

  // Lists in the reports layout: every document of the period, profit on each sale invoice, and tax by rate.
  app.get("/reports/transactions", { preHandler: can("reports.view") }, async (req) => {
    const auth = requireTenant(req);
    const q = z.object({ from: Day, to: Day, type: z.enum(TXN_TYPES).optional() }).parse(req.query);
    if (q.from > q.to) throw badRequest("invalid_range");
    return withTenant(db, auth.tenantId, (tx) => transactionsList(tx, q.from, q.to, q.type));
  });
  app.get("/reports/bill-profit", { preHandler: can("reports.view") }, async (req) => {
    const auth = requireTenant(req);
    const q = z.object({ from: Day, to: Day, party: z.string().trim().max(80).optional() }).parse(req.query);
    if (q.from > q.to) throw badRequest("invalid_range");
    return withTenant(db, auth.tenantId, (tx) => billWiseProfit(tx, q.from, q.to, q.party));
  });
  app.get("/reports/gst-rate", { preHandler: can("reports.view") }, async (req) => {
    const auth = requireTenant(req);
    const q = z.object({ from: Day, to: Day }).parse(req.query);
    if (q.from > q.to) throw badRequest("invalid_range");
    return withTenant(db, auth.tenantId, (tx) => gstRateReport(tx, q.from, q.to));
  });

  // More lists: parties, items, stock, expenses, orders and loans.
  const Range = z.object({ from: Day, to: Day });
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant>[2]>[0]) => Promise<T>) => withTenant(db, requireTenant(req).tenantId, fn);
  const ordered = (q: { from: string; to: string }) => { if (q.from > q.to) throw badRequest("invalid_range"); };
  app.get("/reports/all-parties", { preHandler: can("reports.view") }, async (req) => {
    const q = z.object({ asOf: Day, kind: z.enum(["all", "customers", "suppliers"]).default("all") }).parse(req.query);
    return run(req, (tx) => allParties(tx, q.asOf, q.kind));
  });
  app.get("/reports/party-by-item", { preHandler: can("reports.view") }, async (req) => {
    const q = Range.extend({ itemId: z.uuid().optional(), category: z.string().trim().max(60).optional() }).parse(req.query);
    ordered(q);
    return run(req, (tx) => partyByItem(tx, q.from, q.to, q.itemId, q.category));
  });
  app.get("/reports/sale-by-party", { preHandler: can("reports.view") }, async (req) => {
    const q = Range.extend({ by: z.enum(["party", "group"]).default("party") }).parse(req.query);
    ordered(q);
    return run(req, (tx) => saleByParty(tx, q.from, q.to, q.by));
  });
  app.get("/reports/hsn-summary", { preHandler: can("reports.view") }, async (req) => {
    const q = Range.extend({ kind: z.enum(["hsn", "sac"]).default("hsn") }).parse(req.query);
    ordered(q);
    return run(req, (tx) => hsnSummary(tx, q.from, q.to, q.kind));
  });
  app.get("/reports/low-stock", { preHandler: can("reports.view") }, async (req) => {
    const q = z.object({ asOf: Day, category: z.string().trim().max(60).optional(), onlyInStock: z.enum(["true", "false"]).default("false") }).parse(req.query);
    return run(req, (tx) => lowStock(tx, q.asOf, q.category, q.onlyInStock === "true"));
  });
  app.get("/reports/stock-detail", { preHandler: can("reports.view") }, async (req) => {
    const q = Range.extend({ category: z.string().trim().max(60).optional() }).parse(req.query);
    ordered(q);
    return run(req, (tx) => stockDetail(tx, q.from, q.to, q.category));
  });
  app.get("/reports/item-detail", { preHandler: can("reports.view") }, async (req) => {
    const q = Range.extend({ itemId: z.uuid(), hideInactive: z.enum(["true", "false"]).default("false") }).parse(req.query);
    ordered(q);
    return run(req, (tx) => itemDetail(tx, q.itemId, q.from, q.to, q.hideInactive === "true"));
  });
  app.get("/reports/item-discount", { preHandler: can("reports.view") }, async (req) => {
    const q = Range.extend({ q: z.string().trim().max(60).optional(), category: z.string().trim().max(60).optional() }).parse(req.query);
    ordered(q);
    return run(req, (tx) => itemDiscount(tx, q.from, q.to, q.q, q.category));
  });
  app.get("/reports/expense-report", { preHandler: can("reports.view") }, async (req) => {
    const q = Range.extend({ by: z.enum(["category", "item"]).default("category") }).parse(req.query);
    ordered(q);
    return run(req, (tx) => expenseReport(tx, q.from, q.to, q.by));
  });
  app.get("/reports/sale-order-items", { preHandler: can("reports.view") }, async (req) => {
    const q = Range.extend({ status: z.enum(["open", "partial", "received", "closed", "delivered", "invoiced"]).optional() }).parse(req.query);
    ordered(q);
    return run(req, (tx) => saleOrderItems(tx, q.from, q.to, q.status));
  });
  app.get("/reports/loan-statement", { preHandler: can("reports.view") }, async (req) => {
    const q = Range.parse(req.query);
    ordered(q);
    return run(req, (tx) => loanStatement(tx, q.from, q.to));
  });
  app.get("/reports/abc", { preHandler: can("reports.view") }, async (req) => run(req, (tx) => abcClassification(tx, z.object({ asOf: Day }).parse(req.query).asOf)));
  app.get("/reports/likely-due", { preHandler: can("reports.view") }, async (req) => run(req, (tx) => likelyDue(tx, z.object({ asOf: Day }).parse(req.query).asOf)));
  app.get("/reports/sale-by-category", { preHandler: can("reports.view") }, async (req) => {
    const q = Range.extend({ party: z.string().trim().max(80).optional() }).parse(req.query);
    ordered(q);
    return run(req, (tx) => saleByCategory(tx, q.from, q.to, q.party));
  });
  app.get("/reports/stock-by-category", { preHandler: can("reports.view") }, async (req) => run(req, (tx) => stockByCategory(tx, z.object({ asOf: Day }).parse(req.query).asOf)));
  app.get("/reports/discount-report", { preHandler: can("reports.view") }, async (req) => {
    const q = Range.parse(req.query);
    ordered(q);
    return run(req, (tx) => discountReport(tx, q.from, q.to));
  });
  app.get("/reports/bank-statement", { preHandler: can("reports.view") }, async (req) => {
    const q = Range.extend({ accountId: z.uuid() }).parse(req.query);
    ordered(q);
    return run(req, (tx) => bankStatementReport(tx, q.accountId, q.from, q.to));
  });
  app.get("/reports/categories", { preHandler: can("reports.view") }, async (req) =>
    run(req, async (tx) => [...await tx.execute<{ category: string }>(sql`select distinct category from styles where category is not null and category <> '' order by 1`)].map((r) => r.category)));
}
