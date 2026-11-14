import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { assertDateRight } from "../lib/rights.js";
import { can, requireTenant } from "../plugins/auth.js";
import { cancelTransfer, dispatchTransfer, getTransfer, inTransitStock, listTransfers, receiveTransfer } from "../services/transfers.js";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Qty = z.union([z.string().regex(/^\d+(\.\d{1,4})?$/, "invalid_qty"), z.number().nonnegative()]).transform(String);
const IdParam = z.object({ id: z.uuid() });

/** Stock transfers between warehouses with an in-transit stage and receipt reconciliation. */
export async function transferRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const who = (req: Parameters<typeof requireTenant>[0]) => { const auth = requireTenant(req); return { auth, actor: { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip } }; };

  app.get("/stock-transfers", { preHandler: can("inventory.view") }, async (req) => {
    const q = z.object({ status: z.enum(["in_transit", "received", "cancelled"]).optional() }).parse(req.query);
    const { auth } = who(req);
    return withTenant(db, auth.tenantId, (tx) => listTransfers(tx, q));
  });
  app.get("/stock-transfers/in-transit", { preHandler: can("inventory.view") }, async (req) => {
    const { auth } = who(req);
    return withTenant(db, auth.tenantId, (tx) => inTransitStock(tx));
  });
  app.get("/stock-transfers/:id", { preHandler: can("inventory.view") }, async (req) => {
    const { auth } = who(req);
    return withTenant(db, auth.tenantId, (tx) => getTransfer(tx, IdParam.parse(req.params).id));
  });
  app.post("/stock-transfers", { preHandler: can("inventory.create") }, async (req, reply) => {
    const body = z.object({
      fromWarehouseId: z.uuid(), toWarehouseId: z.uuid(), date: IsoDate, transporter: z.string().trim().max(80).optional(), vehicleNo: z.string().trim().toUpperCase().max(16).optional(),
      narration: z.string().trim().max(300).optional(), lines: z.array(z.object({ itemId: z.uuid(), qty: Qty })).min(1).max(300),
    }).parse(req.body);
    const { auth, actor } = who(req);
    assertDateRight(auth, body.date);
    const r = await withTenant(db, auth.tenantId, (tx) => dispatchTransfer(tx, actor, body));
    return reply.code(201).send({ ...r.transfer, warnings: r.warnings });
  });
  app.post("/stock-transfers/:id/receive", { preHandler: can("inventory.create") }, async (req) => {
    const body = z.object({ date: IsoDate, lines: z.array(z.object({ lineId: z.uuid(), received: Qty })).min(1).max(300) }).parse(req.body);
    const { auth, actor } = who(req);
    return withTenant(db, auth.tenantId, (tx) => receiveTransfer(tx, actor, IdParam.parse(req.params).id, body));
  });
  app.post("/stock-transfers/:id/cancel", { preHandler: can("inventory.cancel") }, async (req) => {
    const { reason } = z.object({ reason: z.string().trim().min(3).max(200) }).parse(req.body);
    const { auth, actor } = who(req);
    await withTenant(db, auth.tenantId, (tx) => cancelTransfer(tx, actor, IdParam.parse(req.params).id, reason));
    return { ok: true };
  });
}
