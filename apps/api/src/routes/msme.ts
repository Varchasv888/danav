import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { businessDate } from "@varchasv/domain";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { msmeReport } from "../services/msme.js";

/** What is owed to micro and small suppliers, and how much is past the 45 day limit. */
export async function msmeRoutes(app: FastifyInstance, { db }: { db: Db }) {
  app.get("/reports/msme", { preHandler: can("accounts.view") }, async (req) => {
    const q = z.object({ asOf: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date").optional(), bankRate: z.coerce.number().min(0).max(20).optional() }).parse(req.query);
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => msmeReport(tx, q.asOf ?? businessDate(), q.bankRate));
  });
}
