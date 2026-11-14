import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { mergeItems, mergeParties } from "../services/merge.js";

const Body = z.object({ intoId: z.uuid() });

/** Merging a duplicate customer, supplier or item into the one to keep. */
export async function mergeRoutes(app: FastifyInstance, { db }: { db: Db }) {
  app.post("/accounts/:id/merge", { preHandler: can("accounts.edit") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = Body.parse(req.body);
    return withTenant(db, auth.tenantId, (tx) => mergeParties(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }, id, body.intoId));
  });
  app.post("/items/:id/merge", { preHandler: can("inventory.edit") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = Body.parse(req.body);
    return withTenant(db, auth.tenantId, (tx) => mergeItems(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }, id, body.intoId));
  });
}
