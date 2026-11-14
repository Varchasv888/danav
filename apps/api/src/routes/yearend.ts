import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { carryForward, yearEndCheck } from "../services/yearend.js";

/** The year-end check: what is left to settle before a financial year is locked. */
export async function yearEndRoutes(app: FastifyInstance, { db }: { db: Db }) {
  app.get("/reports/year-end", { preHandler: can("reports.view") }, async (req) => {
    const { fy } = z.object({ fy: z.string().regex(/^\d{4}-\d{2}$/, "invalid_fy") }).parse(req.query);
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => yearEndCheck(tx, fy));
  });
  app.get("/reports/carry-forward", { preHandler: can("reports.view") }, async (req) => {
    const { fy } = z.object({ fy: z.string().regex(/^\d{4}-\d{2}$/, "invalid_fy") }).parse(req.query);
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => carryForward(tx, fy));
  });
}
