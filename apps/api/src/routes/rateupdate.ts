import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { forbidden } from "../lib/errors.js";
import { can, requireTenant } from "../plugins/auth.js";
import { RATE_FIELDS, RATE_MODES, RATE_ROUNDS, decideRateRequest, listRateRequests, requestRateUpdate, updateRates } from "../services/rateupdate.js";

const Signed = z.union([z.string().regex(/^-?\d+(\.\d{1,2})?$/, "invalid_value"), z.number()]).transform(String);

const Body = z.object({
  scope: z.object({
    brand: z.string().trim().min(1).max(80).optional(), category: z.string().trim().min(1).max(80).optional(), season: z.string().trim().min(1).max(80).optional(),
    styleId: z.uuid().optional(), all: z.boolean().optional(),
  }),
  field: z.enum(RATE_FIELDS), mode: z.enum(RATE_MODES), value: Signed, round: z.enum(RATE_ROUNDS).default("none"), preview: z.boolean().default(true),
});

/** Rate updation: change sale rate, MRP or purchase rate for a group of items in one go. */
export async function rateUpdateRoutes(app: FastifyInstance, { db }: { db: Db }) {
  app.post("/inventory/rate-update", { preHandler: can("inventory.edit") }, async (req) => {
    const body = Body.parse(req.body);
    const auth = requireTenant(req);
    // A change that is applied (not just previewed) needs the approve right; everyone else asks for it to be approved.
    if (!body.preview && !auth.permissions.has("inventory.approve")) throw forbidden("needs_approval");
    return withTenant(db, auth.tenantId, (tx) => updateRates(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }, body));
  });
  app.post("/inventory/rate-update/request", { preHandler: can("inventory.edit") }, async (req, reply) => {
    const { preview: _p, ...body } = Body.parse(req.body);
    const auth = requireTenant(req);
    return reply.code(201).send(await withTenant(db, auth.tenantId, (tx) => requestRateUpdate(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }, body)));
  });
  app.get("/inventory/rate-update/requests", { preHandler: can("inventory.view") }, async (req) => withTenant(db, requireTenant(req).tenantId, (tx) => listRateRequests(tx)));
  app.post("/inventory/rate-update/requests/:id/decide", { preHandler: can("inventory.approve") }, async (req) => {
    const body = z.object({ decision: z.enum(["approve", "reject"]), note: z.string().trim().max(200).optional() }).parse(req.body);
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => decideRateRequest(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }, z.object({ id: z.uuid() }).parse(req.params).id, body.decision, body.note));
  });
}
