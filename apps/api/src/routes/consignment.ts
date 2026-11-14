import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { businessDate } from "@varchasv/domain";
import { can, requireTenant } from "../plugins/auth.js";
import { CONSIGNMENT_DIMS, billConsignmentSales, consignmentSales, getTerms, listConsignees, reconcile, returnConsignment, saveTerms, sendConsignment } from "../services/consignment.js";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Qty = z.union([z.string().regex(/^\d+(\.\d{1,4})?$/, "invalid_qty"), z.number().positive()]).transform(String);
const Rate = z.union([z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_rate"), z.number().nonnegative()]).transform(String);
const Move = z.object({
  customerId: z.uuid(), date: IsoDate.optional(), warehouseId: z.uuid().optional(), narration: z.string().trim().max(300).optional(),
  lines: z.array(z.object({ itemId: z.uuid(), qty: Qty, rate: Rate.optional() })).min(1).max(500),
});

/** Consignment and shop-in-shop: goods out to a consignee, back, and billed when they sell. */
export async function consignmentRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant>[2]>[0], a: { tenantId: string; userId: string; ip: string }) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }));
  };
  app.get("/consignees", { preHandler: can("sales.view") }, async (req) => {
    const q = z.object({ asOf: IsoDate.optional() }).parse(req.query);
    return run(req, (tx) => listConsignees(tx, q.asOf ?? businessDate()));
  });
  app.get("/consignees/:customerId", { preHandler: can("sales.view") }, async (req) => {
    const { customerId } = z.object({ customerId: z.uuid() }).parse(req.params);
    const q = z.object({ asOf: IsoDate.optional() }).parse(req.query);
    return run(req, (tx) => reconcile(tx, customerId, q.asOf ?? businessDate()));
  });
  app.get("/consignees/:customerId/terms", { preHandler: can("sales.view") }, async (req) => {
    const { customerId } = z.object({ customerId: z.uuid() }).parse(req.params);
    return run(req, (tx) => getTerms(tx, customerId));
  });
  app.put("/consignees/:customerId/terms", { preHandler: can("sales.edit") }, async (req) => {
    const { customerId } = z.object({ customerId: z.uuid() }).parse(req.params);
    const body = z.object({ settlementDays: z.number().int().min(1).max(365), discrepancyOwner: z.string().trim().max(80).nullish(), statementFrequency: z.enum(["weekly", "monthly"]).nullish(), statementEmail: z.email().nullish() }).parse(req.body);
    return run(req, (tx, a) => saveTerms(tx, a, customerId, body));
  });
  app.get("/reports/consignment-sales", { preHandler: can("sales.view") }, async (req) => {
    const q = z.object({ from: IsoDate, to: IsoDate, by: z.enum(CONSIGNMENT_DIMS).default("month") }).parse(req.query);
    return run(req, (tx) => consignmentSales(tx, q.from, q.to, q.by));
  });
  app.post("/consignment/send", { preHandler: can("sales.create") }, async (req, reply) => {
    const b = Move.parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => sendConsignment(tx, a, { ...b, date: b.date ?? businessDate() })));
  });
  app.post("/consignment/return", { preHandler: can("sales.create") }, async (req, reply) => {
    const b = Move.parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => returnConsignment(tx, a, { ...b, date: b.date ?? businessDate() })));
  });
  app.post("/consignment/sales", { preHandler: can("sales.create") }, async (req, reply) => {
    const b = Move.parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => billConsignmentSales(tx, a, { ...b, date: b.date ?? businessDate() })));
  });
}
