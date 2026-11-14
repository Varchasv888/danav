import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { businessDate } from "@varchasv/domain";
import { can, requireTenant } from "../plugins/auth.js";
import { GRAINS, PROFIT_DIMS, REGISTERS, profitBy, purchaseBacklog, register, salesVsPurchases, stockRatios, vendorAnalysis, yearComparison } from "../services/retailreports.js";

const Iso = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

/** The owner's registers and ratios: daily and monthly registers, year on year, sales against purchases, profit by dimension, stock ratios, vendors, backlog. */
export async function retailReportRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant<T>>[2]>[0]) => Promise<T>) =>
    withTenant(db, requireTenant(req).tenantId, fn);
  const pre = { preHandler: can("reports.view") };
  const monthStart = () => `${businessDate().slice(0, 7)}-01`;

  app.get("/reports/register", pre, async (req) => {
    const q = z.object({ kind: z.enum(REGISTERS), grain: z.enum(GRAINS).default("day"), from: Iso.default(monthStart), to: Iso.default(businessDate) }).parse(req.query);
    return run(req, (tx) => register(tx, q.kind, q.grain, q.from, q.to));
  });
  app.get("/reports/year-comparison", pre, async (req) => {
    const q = z.object({ year: z.coerce.number().int().default(() => Number(businessDate().slice(0, 4))) }).parse(req.query);
    return run(req, (tx) => yearComparison(tx, q.year));
  });
  app.get("/reports/sales-vs-purchases", pre, async (req) => {
    const q = z.object({ from: Iso.default(() => `${businessDate().slice(0, 4)}-01-01`), to: Iso.default(businessDate) }).parse(req.query);
    return run(req, (tx) => salesVsPurchases(tx, q.from, q.to));
  });
  app.get("/reports/profit-by", pre, async (req) => {
    const q = z.object({ dim: z.enum(PROFIT_DIMS).default("design"), from: Iso.default(monthStart), to: Iso.default(businessDate) }).parse(req.query);
    return run(req, (tx) => profitBy(tx, q.dim, q.from, q.to));
  });
  app.get("/reports/stock-ratios", pre, async (req) => {
    const q = z.object({ asOf: Iso.default(businessDate), days: z.coerce.number().int().default(30) }).parse(req.query);
    return run(req, (tx) => stockRatios(tx, q.asOf, q.days));
  });
  app.get("/reports/vendor-analysis", pre, async (req) => {
    const q = z.object({ from: Iso.default(() => `${businessDate().slice(0, 4)}-01-01`), to: Iso.default(businessDate) }).parse(req.query);
    return run(req, (tx) => vendorAnalysis(tx, q.from, q.to));
  });
  app.get("/reports/purchase-backlog", pre, async (req) => {
    const q = z.object({ asOf: Iso.default(businessDate) }).parse(req.query);
    return run(req, (tx) => purchaseBacklog(tx, q.asOf));
  });
}
