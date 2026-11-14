import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { businessDate } from "@varchasv/domain";
import { withTenant, type Db } from "@varchasv/db";
import { assertDateRight } from "../lib/rights.js";
import { can, requireTenant } from "../plugins/auth.js";
import { INQUIRY_KINDS, actOnRepair, addInquiry, closeInquiry, createRepair, findSaleForRepair, getRepair, listInquiries, listRepairs, openRepairs, serviceCustomers } from "../services/repairs.js";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Money = z.union([z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_amount"), z.number().nonnegative()]).transform(String);
const IdParam = z.object({ id: z.uuid() });
const Text = (n: number) => z.string().trim().max(n);

const Action = z.discriminatedUnion("action", [
  z.object({ action: z.literal("estimate"), estimate: Money, diagnosis: Text(500).optional() }),
  z.object({ action: z.literal("approve") }),
  z.object({ action: z.literal("decline"), reason: Text(200).min(2) }),
  z.object({ action: z.literal("start"), diagnosis: Text(500).optional() }),
  z.object({ action: z.literal("ready"), finalCharge: Money.optional(), spares: z.array(z.object({ name: Text(80).min(1), qty: Money, cost: Money })).max(50).optional() }),
  z.object({ action: z.literal("deliver"), date: IsoDate, paidInto: z.uuid().optional(), gstRate: z.string().regex(/^\d{1,2}(\.\d{1,2})?$/).optional() }),
  z.object({ action: z.literal("cancel"), reason: Text(200).min(2) }),
]);

/** The service desk: repairs from intake to delivery. */
export async function repairRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const who = (req: Parameters<typeof requireTenant>[0]) => { const auth = requireTenant(req); return { auth, actor: { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip } }; };

  app.get("/repairs", { preHandler: can("sales.view") }, async (req) => {
    const q = z.object({ sourceId: z.uuid().optional(), status: z.enum(["received", "estimated", "approved", "in_repair", "ready", "delivered", "declined", "cancelled"]).optional(), search: Text(40).optional() }).parse(req.query);
    const { auth } = who(req);
    return withTenant(db, auth.tenantId, (tx) => listRepairs(tx, q));
  });
  app.get("/repairs/from-sale", { preHandler: can("sales.view") }, async (req) => {
    const q = z.object({ number: Text(30).min(1) }).parse(req.query);
    const { auth } = who(req);
    return withTenant(db, auth.tenantId, (tx) => findSaleForRepair(tx, q.number));
  });
  app.get("/repairs/open", { preHandler: can("sales.view") }, async (req) => { const { auth } = who(req); return withTenant(db, auth.tenantId, (tx) => openRepairs(tx, businessDate())); });
  app.get("/repairs/:id", { preHandler: can("sales.view") }, async (req) => { const { auth } = who(req); return withTenant(db, auth.tenantId, (tx) => getRepair(tx, IdParam.parse(req.params).id)); });
  app.post("/repairs", { preHandler: can("sales.create") }, async (req, reply) => {
    const body = z.object({
      receivedOn: IsoDate, customerName: Text(80).min(1), customerPhone: z.string().regex(/^[6-9]\d{9}$/, "invalid_phone").optional(), itemDescription: Text(300).min(1),
      complaint: Text(500).optional(), warranty: z.boolean().optional(), deposit: Money.optional(), promisedOn: IsoDate.optional(), paidInto: z.uuid().optional(),
      source: z.object({ kind: z.enum(["order", "invoice", "bill"]), id: z.uuid() }).optional(),
    }).parse(req.body);
    const { auth, actor } = who(req);
    assertDateRight(auth, body.receivedOn);
    return reply.code(201).send(await withTenant(db, auth.tenantId, (tx) => createRepair(tx, actor, body)));
  });
  app.post("/repairs/:id/act", { preHandler: can("sales.edit") }, async (req) => {
    const body = Action.parse(req.body);
    const { auth, actor } = who(req);
    return withTenant(db, auth.tenantId, (tx) => actOnRepair(tx, actor, IdParam.parse(req.params).id, body));
  });

  const Inquiry = z.object({ date: IsoDate, customerName: Text(80).min(1), customerPhone: z.string().regex(/^[6-9]\d{9}$/).nullish(), kind: z.enum(INQUIRY_KINDS), note: Text(500).min(2), followUpOn: IsoDate.nullish() });
  app.get("/inquiries", { preHandler: can("sales.view") }, async (req) => {
    const { auth } = who(req);
    const q = z.object({ status: z.enum(["open", "converted", "closed"]).optional() }).parse(req.query);
    return withTenant(db, auth.tenantId, (tx) => listInquiries(tx, businessDate(), q.status));
  });
  app.post("/inquiries", { preHandler: can("sales.create") }, async (req, reply) => {
    const body = Inquiry.parse(req.body);
    const { auth, actor } = who(req);
    return reply.code(201).send(await withTenant(db, auth.tenantId, (tx) => addInquiry(tx, actor, body)));
  });
  app.post("/inquiries/:id/close", { preHandler: can("sales.edit") }, async (req) => {
    const body = z.object({ status: z.enum(["closed", "converted"]), outcome: Text(300).optional(), repairId: z.uuid().optional() }).parse(req.body);
    const { auth, actor } = who(req);
    return withTenant(db, auth.tenantId, (tx) => closeInquiry(tx, actor, IdParam.parse(req.params).id, body));
  });
  app.get("/reports/service-customers", { preHandler: can("sales.view") }, async (req) => {
    const { auth } = who(req);
    return withTenant(db, auth.tenantId, (tx) => serviceCustomers(tx));
  });
}
