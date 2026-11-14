import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { cashFlow } from "../services/cashflow.js";

export async function cashFlowRoutes(app: FastifyInstance, { db }: { db: Db }) {
  app.get("/reports/cash-flow-statement", { preHandler: can("reports.view") }, async (req) => {
    const auth = requireTenant(req);
    const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
    const q = z.object({ from: day, to: day }).parse(req.query);
    return withTenant(db, auth.tenantId, (tx) => cashFlow(tx, q.from, q.to));
  });
}
