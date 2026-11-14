import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { businessDate } from "@varchasv/domain";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { listStockLimits, saveStockLimits } from "../services/stocklimits.js";

const Qty = z.union([z.string().regex(/^\d+(\.\d{1,4})?$/, "invalid_qty"), z.number().nonnegative()]).transform(String);
const Body = z.object({ rows: z.array(z.object({ itemId: z.uuid(), minQty: Qty, maxQty: Qty })).min(1).max(500) });

/** Minimum and maximum stock per item and warehouse (the "branch" shelf), edited as a grid. */
export async function stockLimitRoutes(app: FastifyInstance, { db }: { db: Db }) {
  app.get("/stock-limits", { preHandler: can("inventory.view") }, async (req) => {
    const { warehouseId } = z.object({ warehouseId: z.uuid() }).parse(req.query);
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => listStockLimits(tx, warehouseId, businessDate()));
  });
  app.put("/stock-limits/:warehouseId", { preHandler: can("inventory.edit") }, async (req) => {
    const { warehouseId } = z.object({ warehouseId: z.uuid() }).parse(req.params);
    const body = Body.parse(req.body);
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => saveStockLimits(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }, warehouseId, body.rows));
  });
}
