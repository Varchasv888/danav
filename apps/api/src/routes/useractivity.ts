import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { businessDate } from "@varchasv/domain";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { userActivity } from "../services/useractivity.js";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");

/** User activity report: who signed in and what they made, changed and cancelled. */
export async function userActivityRoutes(app: FastifyInstance, { db }: { db: Db }) {
  app.get("/reports/user-activity", { preHandler: can("settings.view") }, async (req) => {
    const q = z.object({ from: IsoDate.optional(), to: IsoDate.optional() }).parse(req.query);
    const to = q.to ?? businessDate();
    const from = q.from ?? new Date(Date.parse(`${to}T00:00:00Z`) - 29 * 86_400_000).toISOString().slice(0, 10);
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => userActivity(tx, from, to));
  });
}
