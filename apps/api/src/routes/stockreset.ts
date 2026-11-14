import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { requireStepUp } from "../lib/stepup.js";
import { can, requireTenant } from "../plugins/auth.js";
import { resetPhysicalStock, stockPostingCheck } from "../services/stockreset.js";

/** Resetting a store's stock to zero, and a check that every sale took its stock out. */
export async function stockResetRoutes(app: FastifyInstance, { db }: { db: Db }) {
  app.post("/inventory/reset-stock", { preHandler: can("inventory.approve") }, async (req) => {
    const body = z.object({
      warehouseId: z.uuid(), reason: z.string().trim().min(5).max(200),
      scope: z.object({ brand: z.string().trim().min(1).max(80).optional(), category: z.string().trim().min(1).max(80).optional(), styleId: z.uuid().optional(), all: z.boolean().optional() }),
    }).parse(req.body);
    const auth = requireTenant(req);
    await requireStepUp(db, req);
    return withTenant(db, auth.tenantId, (tx) => resetPhysicalStock(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }, body));
  });
  app.get("/reports/stock-posting-check", { preHandler: can("reports.view") }, async (req) => withTenant(db, requireTenant(req).tenantId, (tx) => stockPostingCheck(tx)));
}
