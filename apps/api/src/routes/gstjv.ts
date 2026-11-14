import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { GST_HEADS, GST_JV_KINDS } from "@varchasv/domain";
import { withTenant, type Db } from "@varchasv/db";
import { assertDateRight } from "../lib/rights.js";
import { can, requireTenant } from "../plugins/auth.js";
import { gstPosition, postGstJv } from "../services/gstjv.js";

const Money = z.union([z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_amount"), z.number().nonnegative()]).transform(String);
const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Head = z.enum(GST_HEADS);

const Body = z.object({
  kind: z.enum(GST_JV_KINDS), date: IsoDate,
  amounts: z.partialRecord(Head, Money).optional(),
  pairs: z.array(z.object({ liability: Head, credit: Head, amount: Money })).max(20).optional(),
  counterAccountId: z.uuid().optional(), narration: z.string().trim().max(300).optional(), clientId: z.uuid().optional(),
});

/** GST journal vouchers: tax-only adjustments built from the tax heads. */
export async function gstJvRoutes(app: FastifyInstance, { db }: { db: Db }) {
  app.get("/gst-jv/position", { preHandler: can("accounts.view") }, async (req) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => gstPosition(tx));
  });
  app.post("/gst-jv", { preHandler: can("accounts.create") }, async (req, reply) => {
    const body = Body.parse(req.body);
    const auth = requireTenant(req);
    assertDateRight(auth, body.date);
    const out = await withTenant(db, auth.tenantId, (tx) => postGstJv(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }, body));
    return reply.code(out.replayed ? 200 : 201).send(out.voucher);
  });
}
