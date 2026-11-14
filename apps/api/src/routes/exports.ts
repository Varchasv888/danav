import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { addRate, addScrip, deleteRate, incentiveWorking, invertedDutyRefund, listRates, listScrips, saveShipment, shipments, useScrip } from "../services/exports.js";

const Iso = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const Amount = z.string().regex(/^\d+(\.\d{1,2})?$/);
const Scheme = z.enum(["rodtep", "rosctl"]);

/** Export follow-up: shipping bills and bank realisation, scrip ledger with dated rates, and the inverted duty refund working. */
export async function exportRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant<T>>[2]>[0], a: { tenantId: string; userId: string; ip: string }) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }));
  };

  app.get("/exports/shipments", { preHandler: can("gst.view") }, async (req) => run(req, (tx) => shipments(tx)));
  app.put("/exports/shipments/:invoiceId", { preHandler: can("gst.submit") }, async (req) => {
    const { invoiceId } = z.object({ invoiceId: z.uuid() }).parse(req.params);
    const body = z.object({
      shippingBillNo: z.string().trim().max(20).nullish(), shippingBillDate: Iso.nullish(), portCode: z.string().trim().max(8).nullish(), fobValue: Amount.nullish(),
      currency: z.string().length(3).optional(), brcNo: z.string().trim().max(30).nullish(), brcDate: Iso.nullish(), realisedAmount: Amount.optional(), note: z.string().max(200).nullish(),
    }).parse(req.body);
    return run(req, (tx, a) => saveShipment(tx, a, invoiceId, body));
  });

  app.get("/exports/rates", { preHandler: can("gst.view") }, async (req) => run(req, (tx) => listRates(tx)));
  app.post("/exports/rates", { preHandler: can("gst.submit") }, async (req, reply) => {
    const body = z.object({ scheme: Scheme, hsnPrefix: z.string().regex(/^\d{2,8}$/), ratePct: z.string().regex(/^\d{1,3}(\.\d{1,3})?$/), effectiveFrom: Iso, effectiveTo: Iso.nullish() }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => addRate(tx, a, body)));
  });
  app.delete("/exports/rates/:id", { preHandler: can("gst.submit") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    await run(req, (tx, a) => deleteRate(tx, a, id));
    return { ok: true };
  });
  app.get("/exports/incentive", { preHandler: can("gst.view") }, async (req) => {
    const q = z.object({ scheme: Scheme, from: Iso.optional(), to: Iso.optional() }).parse(req.query);
    return run(req, (tx) => incentiveWorking(tx, q.scheme, q.from, q.to));
  });

  app.get("/exports/scrips", { preHandler: can("gst.view") }, async (req) => run(req, (tx) => listScrips(tx)));
  app.post("/exports/scrips", { preHandler: can("gst.submit") }, async (req, reply) => {
    const body = z.object({ scheme: Scheme, number: z.string().trim().min(1).max(30), issuedOn: Iso, validUntil: Iso.nullish(), amount: Amount }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => addScrip(tx, a, body)));
  });
  app.post("/exports/scrips/:id/use", { preHandler: can("gst.submit") }, async (req, reply) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = z.object({ usedOn: Iso, amount: Amount, purpose: z.string().max(120).nullish() }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => useScrip(tx, a, id, body)));
  });

  app.get("/exports/inverted-duty", { preHandler: can("gst.view") }, async (req) => {
    const q = z.object({ from: Iso, to: Iso, outputRate: z.coerce.number() }).parse(req.query);
    return run(req, (tx) => invertedDutyRefund(tx, q));
  });
}
