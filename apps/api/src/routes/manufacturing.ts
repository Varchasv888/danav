import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { cancelJobWork, itc04, listJobWork, receiveFromJobWork, sendForJobWork } from "../services/jobwork.js";
import {
  cancelProductionOrder, completeProduction, convertMrp, createBom, createProductionOrder, getBom, getProductionOrder, issueMaterials, listBoms,
  listProductionOrders, listWorkCentres, releaseProductionOrder, runMrp, saveWorkCentre, setBomStatus,
} from "../services/manufacturing.js";
import { businessDate } from "@varchasv/domain";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Qty = z.union([z.string().regex(/^\d+(\.\d{1,4})?$/, "invalid_qty"), z.number().nonnegative()]).transform(String);
const Money = z.union([z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_amount"), z.number().nonnegative()]).transform(String);
const Pct = z.union([z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_pct"), z.number().min(0).max(100)]).transform(String);
const IdParam = z.object({ id: z.uuid() });
const Reason = z.object({ reason: z.string().trim().min(3).max(300) });
const today = () => businessDate();

export async function manufacturingRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const actor = (auth: { tenantId: string; user: { id: string } }, ip: string) => ({ tenantId: auth.tenantId, userId: auth.user.id, ip });
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant>[2]>[0], a: ReturnType<typeof actor>) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, actor(auth, req.ip)));
  };

  // ---- work centres and BOMs ---------------------------------------------------------------------
  const WorkCentre = z.object({ name: z.string().trim().min(2).max(60), costPerHour: Money, archived: z.boolean().optional() });
  app.get("/work-centres", { preHandler: can("inventory.view") }, async (req) => run(req, (tx) => listWorkCentres(tx)));
  app.post("/work-centres", { preHandler: can("inventory.edit") }, async (req, reply) => reply.code(201).send(await run(req, (tx, a) => saveWorkCentre(tx, a, WorkCentre.parse(req.body)))));
  app.put("/work-centres/:id", { preHandler: can("inventory.edit") }, async (req) => run(req, (tx, a) => saveWorkCentre(tx, a, WorkCentre.parse(req.body), IdParam.parse(req.params).id)));

  app.get("/boms", { preHandler: can("inventory.view") }, async (req) => run(req, async (tx) => (await listBoms(tx)).map((b) => ({ ...b.bom, itemName: b.itemName, itemNameHi: b.itemNameHi, lines: b.lines }))));
  app.get("/boms/:id", { preHandler: can("inventory.view") }, async (req) => run(req, (tx) => getBom(tx, IdParam.parse(req.params).id)));
  app.post("/boms", { preHandler: can("inventory.create") }, async (req, reply) => {
    const body = z.object({
      itemId: z.uuid(), outputQty: Qty, overhead: Money.optional(), notes: z.string().max(500).optional(), makeDefault: z.boolean().optional(),
      lines: z.array(z.object({ itemId: z.uuid(), qty: Qty, wastagePct: Pct.optional() })).min(1).max(200),
      operations: z.array(z.object({ name: z.string().trim().min(2).max(60), workCentreId: z.uuid(), minutes: Qty })).max(50).optional(),
    }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => createBom(tx, a, body)));
  });
  app.post("/boms/:id/default", { preHandler: can("inventory.edit") }, async (req) => { await run(req, (tx, a) => setBomStatus(tx, a, IdParam.parse(req.params).id, "default")); return { ok: true }; });
  app.post("/boms/:id/archive", { preHandler: can("inventory.edit") }, async (req) => { await run(req, (tx, a) => setBomStatus(tx, a, IdParam.parse(req.params).id, "archive")); return { ok: true }; });

  // ---- production orders ---------------------------------------------------------------------------
  app.get("/production-orders", { preHandler: can("inventory.view") }, async (req) => run(req, async (tx) => (await listProductionOrders(tx)).map((r) => ({ ...r.order, itemName: r.itemName, itemNameHi: r.itemNameHi }))));
  app.get("/production-orders/:id", { preHandler: can("inventory.view") }, async (req) => run(req, (tx) => getProductionOrder(tx, IdParam.parse(req.params).id)));
  app.post("/production-orders", { preHandler: can("inventory.create") }, async (req, reply) => {
    const body = z.object({
      itemId: z.uuid(), bomId: z.uuid().optional(), qty: Qty, date: IsoDate.default(today), sourceWarehouseId: z.uuid().optional(), targetWarehouseId: z.uuid().optional(),
      salesOrderId: z.uuid().optional(), notes: z.string().max(300).optional(), release: z.boolean().optional(),
    }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => createProductionOrder(tx, a, body)));
  });
  app.post("/production-orders/:id/release", { preHandler: can("inventory.edit") }, async (req) => { await run(req, (tx, a) => releaseProductionOrder(tx, a, IdParam.parse(req.params).id)); return { ok: true }; });
  app.post("/production-orders/:id/issue", { preHandler: can("inventory.create") }, async (req) => {
    const body = z.object({ date: IsoDate.default(today), notes: z.string().max(300).optional(), lines: z.array(z.object({ itemId: z.uuid(), qty: Qty })).min(1).max(100) }).parse(req.body);
    return run(req, (tx, a) => issueMaterials(tx, a, IdParam.parse(req.params).id, body));
  });
  app.post("/production-orders/:id/complete", { preHandler: can("inventory.create") }, async (req) => {
    const body = z.object({ date: IsoDate.default(today), goodQty: Qty, rejectedQty: Qty.optional(), close: z.boolean().optional(), notes: z.string().max(300).optional() }).parse(req.body);
    return run(req, (tx, a) => completeProduction(tx, a, IdParam.parse(req.params).id, body));
  });
  app.post("/production-orders/:id/cancel", { preHandler: can("inventory.cancel") }, async (req) => {
    const { reason } = Reason.parse(req.body);
    await run(req, (tx, a) => cancelProductionOrder(tx, a, IdParam.parse(req.params).id, reason));
    return { ok: true };
  });

  // ---- MRP --------------------------------------------------------------------------------------------
  app.get("/mrp", { preHandler: can("inventory.view") }, async (req) => {
    const q = z.object({ date: IsoDate.default(today) }).parse(req.query);
    return run(req, (tx) => runMrp(tx, q.date));
  });
  app.post("/mrp/convert", { preHandler: can("purchase.create") }, async (req) => {
    const body = z.object({
      date: IsoDate.default(today),
      lines: z.array(z.object({ itemId: z.uuid(), qty: Qty, action: z.enum(["make", "buy"]), supplierId: z.uuid().optional(), needBy: IsoDate.optional() })).min(1).max(200),
    }).parse(req.body);
    return run(req, (tx, a) => convertMrp(tx, a, body.date, body.lines));
  });

  // ---- job work ---------------------------------------------------------------------------------------
  app.get("/job-work", { preHandler: can("inventory.view") }, async (req) => run(req, (tx) => listJobWork(tx)));
  app.post("/job-work/send", { preHandler: can("inventory.create") }, async (req, reply) => {
    const body = z.object({
      date: IsoDate, jobWorkerId: z.uuid(), process: z.string().trim().max(80).optional(), fromWarehouseId: z.uuid().optional(),
      lines: z.array(z.object({ itemId: z.uuid(), qty: Qty, capitalGoods: z.boolean().optional() })).min(1).max(100),
    }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => sendForJobWork(tx, a, body)));
  });
  app.post("/job-work/receive", { preHandler: can("inventory.create") }, async (req, reply) => {
    const body = z.object({
      date: IsoDate, sentChallanId: z.uuid(), toWarehouseId: z.uuid().optional(), charges: Money.optional(),
      received: z.array(z.object({ itemId: z.uuid(), qty: Qty })).min(1).max(100), consumed: z.array(z.object({ itemId: z.uuid(), qty: Qty })).min(1).max(100),
    }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => receiveFromJobWork(tx, a, body)));
  });
  app.post("/job-work/:id/cancel", { preHandler: can("inventory.cancel") }, async (req) => {
    const { reason } = Reason.parse(req.body);
    await run(req, (tx, a) => cancelJobWork(tx, a, IdParam.parse(req.params).id, reason));
    return { ok: true };
  });
  app.get("/job-work/itc04", { preHandler: can("gst.view") }, async (req) => {
    const q = z.object({ from: IsoDate, to: IsoDate }).parse(req.query);
    return run(req, (tx) => itc04(tx, q.from, q.to));
  });
}
