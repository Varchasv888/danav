import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { assertDateRight } from "../lib/rights.js";
import { getRelabel, listRelabels, relabel } from "../services/relabel.js";

const Iso = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const Amount = z.string().regex(/^\d+(\.\d{1,2})?$/);

/** Re-labelling: change what existing items are called or priced, on one voucher that keeps the old values. */
export async function relabelRoutes(app: FastifyInstance, { db }: { db: Db }) {
  app.get("/relabels", { preHandler: can("inventory.view") }, async (req) => withTenant(db, requireTenant(req).tenantId, (tx) => listRelabels(tx)));
  app.get("/relabels/:id", { preHandler: can("inventory.view") }, async (req) => withTenant(db, requireTenant(req).tenantId, (tx) => getRelabel(tx, z.object({ id: z.uuid() }).parse(req.params).id)));
  app.post("/relabels", { preHandler: can("inventory.edit") }, async (req, reply) => {
    const body = z.object({
      date: Iso, reason: z.string().trim().min(3).max(200),
      changes: z.array(z.object({ itemId: z.uuid(), name: z.string().trim().max(200).optional(), color: z.string().trim().max(40).nullish(), size: z.string().trim().max(20).nullish(), fit: z.string().trim().max(30).nullish(), mrp: Amount.nullish(), saleRate: Amount.optional() })).min(1).max(500),
    }).parse(req.body);
    const auth = requireTenant(req);
    assertDateRight(auth, body.date);
    return reply.code(201).send(await withTenant(db, auth.tenantId, (tx) => relabel(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }, body)));
  });
}
