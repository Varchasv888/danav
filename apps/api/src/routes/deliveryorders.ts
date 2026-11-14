import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { assertDateRight } from "../lib/rights.js";
import { can, requireTenant } from "../plugins/auth.js";
import { createDeliveryOrder, getDeliveryOrder, listDeliveryOrders, setDeliveryOrderStatus } from "../services/deliveryorders.js";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Qty = z.union([z.string().regex(/^\d+(\.\d{1,4})?$/, "invalid_qty"), z.number().positive()]).transform(String);
const IdParam = z.object({ id: z.uuid() });

const Body = z.object({
  customerId: z.uuid(), orderId: z.uuid().optional(), date: IsoDate, deliverBy: IsoDate.optional(),
  transporter: z.string().trim().max(80).optional(), narration: z.string().trim().max(300).optional(),
  lines: z.array(z.object({ itemId: z.uuid(), qty: Qty, orderLineId: z.uuid().optional() })).min(1).max(300),
});

/** Delivery orders: the dispatch instruction between a sales order and its challans. */
export async function deliveryOrderRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const actor = (req: Parameters<typeof requireTenant>[0]) => { const a = requireTenant(req); return { auth: a, who: { tenantId: a.tenantId, userId: a.user.id, ip: req.ip } }; };

  app.get("/delivery-orders", { preHandler: can("sales.view") }, async (req) => {
    const q = z.object({ status: z.enum(["open", "closed", "cancelled"]).optional(), customerId: z.uuid().optional() }).parse(req.query);
    const { auth } = actor(req);
    return withTenant(db, auth.tenantId, (tx) => listDeliveryOrders(tx, q));
  });
  app.get("/delivery-orders/:id", { preHandler: can("sales.view") }, async (req) => {
    const { auth } = actor(req);
    return withTenant(db, auth.tenantId, (tx) => getDeliveryOrder(tx, IdParam.parse(req.params).id));
  });
  app.post("/delivery-orders", { preHandler: can("sales.create") }, async (req, reply) => {
    const body = Body.parse(req.body);
    const { auth, who } = actor(req);
    assertDateRight(auth, body.date);
    return reply.code(201).send(await withTenant(db, auth.tenantId, (tx) => createDeliveryOrder(tx, who, body)));
  });
  app.post("/delivery-orders/:id/close", { preHandler: can("sales.create") }, async (req) => {
    const { auth, who } = actor(req);
    await withTenant(db, auth.tenantId, (tx) => setDeliveryOrderStatus(tx, who, IdParam.parse(req.params).id, "closed"));
    return { ok: true };
  });
  app.post("/delivery-orders/:id/cancel", { preHandler: can("sales.cancel") }, async (req) => {
    const { auth, who } = actor(req);
    await withTenant(db, auth.tenantId, (tx) => setDeliveryOrderStatus(tx, who, IdParam.parse(req.params).id, "cancelled"));
    return { ok: true };
  });
}
