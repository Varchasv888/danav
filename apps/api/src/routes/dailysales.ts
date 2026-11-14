import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { businessDate } from "@varchasv/domain";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { dailySales } from "../services/dailysales.js";

/** A day's selling: sales, bills, cash and bank movement, and the top sellers. */
export async function dailySalesRoutes(app: FastifyInstance, { db }: { db: Db }) {
  app.get("/reports/daily-sales", { preHandler: can("reports.view") }, async (req) => {
    const q = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date").optional(), top: z.coerce.number().int().min(1).max(100).default(10) }).parse(req.query);
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => dailySales(tx, q.date ?? businessDate(), q.top));
  });
}
