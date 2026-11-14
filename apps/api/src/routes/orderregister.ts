import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { businessDate } from "@varchasv/domain";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { salesOrderRegister } from "../services/orderregister.js";

/** Sales orders still to be fulfilled. */
export async function orderRegisterRoutes(app: FastifyInstance, { db }: { db: Db }) {
  app.get("/reports/sales-order-register", { preHandler: can("sales.view") }, async (req) => {
    const q = z.object({ asOf: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date").optional() }).parse(req.query);
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => salesOrderRegister(tx, q.asOf ?? businessDate()));
  });
}
