import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { listBands, priceByBands, replaceBands } from "../services/marginbands.js";

const Pct = z.string().regex(/^\d{1,4}(\.\d{1,2})?$/, "invalid_band");

/** Mark-up by purchase rate: the table, and the prices a cost gets from it. */
export async function marginBandRoutes(app: FastifyInstance, { db }: { db: Db }) {
  app.get("/margin-bands", { preHandler: can("inventory.view") }, async (req) => withTenant(db, requireTenant(req).tenantId, (tx) => listBands(tx)));
  app.put("/margin-bands", { preHandler: can("inventory.approve") }, async (req) => {
    const body = z.object({ bands: z.array(z.object({ fromRate: Pct, markupPct: Pct, markdown1Pct: Pct, markdown2Pct: Pct })).max(20) }).parse(req.body);
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => replaceBands(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }, body.bands));
  });
  app.get("/margin-bands/price", { preHandler: can("inventory.view") }, async (req) => {
    const q = z.object({ cost: z.string().regex(/^\d+(\.\d{1,4})?$/) }).parse(req.query);
    return withTenant(db, requireTenant(req).tenantId, (tx) => priceByBands(tx, q.cost));
  });
}
