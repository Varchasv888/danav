import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { businessDate } from "@varchasv/domain";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { discountRegister } from "../services/discounts.js";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");

/** The discount register: every discounted line on invoices and counter bills. */
export async function discountRoutes(app: FastifyInstance, { db }: { db: Db }) {
  app.get("/reports/discounts", { preHandler: can("reports.view") }, async (req) => {
    const q = z.object({ from: IsoDate.optional(), to: IsoDate.optional() }).parse(req.query);
    const to = q.to ?? businessDate();
    const from = q.from ?? `${to.slice(0, 7)}-01`;
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => discountRegister(tx, from, to));
  });
}
