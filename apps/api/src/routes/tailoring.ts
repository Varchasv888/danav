import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import {
  assignProcess, cancelTailoring, completeProcess, createTailoringOrder, deliverTailoring, listRates, listTailoring, markReady, measurementsFor, saveMeasurement, setRates,
} from "../services/tailoring.js";
import { Payment } from "./pos.js";
import { businessDate } from "@varchasv/domain";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Money = z.union([z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_amount"), z.number().nonnegative()]).transform(String);
const Qty = z.union([z.string().regex(/^\d+(\.\d{1,4})?$/, "invalid_qty"), z.number().positive()]).transform(String);
const Phone = z.string().regex(/^[6-9]\d{9}$/, "invalid_phone");
const IdParam = z.object({ id: z.uuid() });
const Step = z.object({ line: z.number().int().min(0).max(30), process: z.number().int().min(0).max(20) });
const today = () => businessDate();

/** Made-to-order tailoring: measurements, process rates and orders through to the tailoring bill. */
export async function tailoringRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant>[2]>[0], a: { tenantId: string; userId: string; ip: string }) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }));
  };

  const Measurement = z.object({
    customerPhone: Phone, customerName: z.string().trim().max(80).optional(), garment: z.string().trim().min(1).max(40),
    values: z.record(z.string().max(30), z.string().max(20)), photoFileId: z.uuid().nullish(), notes: z.string().trim().max(300).nullish(), takenOn: IsoDate.optional(),
  });
  app.get("/measurements", { preHandler: can("sales.view") }, async (req) => {
    const { phone } = z.object({ phone: Phone }).parse(req.query);
    return run(req, (tx) => measurementsFor(tx, phone));
  });
  app.post("/measurements", { preHandler: can("sales.create") }, async (req, reply) => reply.code(201).send(await run(req, (tx, a) => saveMeasurement(tx, a, Measurement.parse(req.body)))));
  app.put("/measurements/:id", { preHandler: can("sales.create") }, async (req) => run(req, (tx, a) => saveMeasurement(tx, a, Measurement.parse(req.body), IdParam.parse(req.params).id)));

  app.get("/tailoring-rates", { preHandler: can("sales.view") }, async (req) => run(req, (tx) => listRates(tx)));
  app.put("/tailoring-rates", { preHandler: can("sales.edit") }, async (req) => {
    const { rates } = z.object({ rates: z.array(z.object({ garment: z.string().trim().min(1).max(40), process: z.string().trim().min(1).max(40), rate: Money })).max(300) }).parse(req.body);
    return run(req, (tx, a) => setRates(tx, a, rates));
  });

  app.get("/tailoring-orders", { preHandler: can("sales.view") }, async (req) => {
    const q = z.object({ status: z.enum(["open", "booked", "in_work", "ready", "delivered", "cancelled"]).optional() }).parse(req.query);
    return run(req, (tx) => listTailoring(tx, q));
  });
  app.post("/tailoring-orders", { preHandler: can("sales.create") }, async (req, reply) => {
    const body = z.object({
      date: IsoDate.optional(), customerName: z.string().trim().min(1).max(80), customerPhone: Phone,
      lines: z.array(z.object({
        garment: z.string().trim().min(1).max(40), qty: z.number().int().min(1).max(100), price: Money, measurementId: z.uuid().optional(), notes: z.string().trim().max(300).optional(),
        fabricItemId: z.uuid().optional(), fabricQty: Qty.optional(),
      })).min(1).max(30),
      advance: Money.optional(), advancePaidBy: z.enum(["cash", "upi", "card"]).optional(), trialOn: IsoDate.optional(), deliveryOn: IsoDate, notes: z.string().trim().max(300).optional(),
    }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => createTailoringOrder(tx, a, { ...body, date: body.date ?? today() })));
  });
  app.post("/tailoring-orders/:id/assign", { preHandler: can("sales.create") }, async (req) => {
    const body = Step.extend({ karigarId: z.uuid() }).parse(req.body);
    return run(req, (tx, a) => assignProcess(tx, a, IdParam.parse(req.params).id, body));
  });
  app.post("/tailoring-orders/:id/done", { preHandler: can("sales.create") }, async (req) => {
    const body = Step.extend({ date: IsoDate.optional() }).parse(req.body);
    return run(req, (tx, a) => completeProcess(tx, a, IdParam.parse(req.params).id, { ...body, date: body.date ?? today() }));
  });
  app.post("/tailoring-orders/:id/ready", { preHandler: can("sales.create") }, async (req) => run(req, (tx, a) => markReady(tx, a, IdParam.parse(req.params).id)));
  app.post("/tailoring-orders/:id/deliver", { preHandler: can("sales.create") }, async (req) => {
    const body = z.object({ terminalId: z.uuid(), payments: z.array(Payment).max(6) }).parse(req.body);
    return run(req, (tx, a) => deliverTailoring(tx, a, IdParam.parse(req.params).id, body));
  });
  app.post("/tailoring-orders/:id/cancel", { preHandler: can("sales.cancel") }, async (req) => {
    const { reason } = z.object({ reason: z.string().trim().min(3).max(200) }).parse(req.body);
    await run(req, (tx, a) => cancelTailoring(tx, a, IdParam.parse(req.params).id, reason));
    return { ok: true };
  });
}
