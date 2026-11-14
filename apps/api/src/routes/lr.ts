import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { LR_STATUS, listLr, saveLr } from "../services/lr.js";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Money = z.union([z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_amount"), z.number().nonnegative()]).transform(String);
const Body = z.object({
  date: IsoDate, transporter: z.string().trim().min(1).max(80), lrNumber: z.string().trim().min(1).max(30),
  invoiceId: z.uuid().nullish(), customerId: z.uuid().nullish(), destination: z.string().trim().max(120).nullish(),
  packages: z.number().int().min(1).max(100000).optional(), weightKg: z.union([z.string().regex(/^\d+(\.\d{1,3})?$/), z.number().nonnegative()]).transform(String).nullish(),
  freight: Money.optional(), freightBy: z.enum(["paid", "to_pay"]).optional(),
  status: z.enum(LR_STATUS).optional(), deliveredOn: IsoDate.nullish(), note: z.string().trim().max(300).nullish(),
});

/** LR and transport entries: what went out through which transporter, and whether it has arrived. */
export async function lrRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const ctx = (req: Parameters<typeof requireTenant>[0]) => {
    const a = requireTenant(req);
    return { a, actor: { tenantId: a.tenantId, userId: a.user.id, ip: req.ip } };
  };

  app.get("/lr-entries", { preHandler: can("sales.view") }, async (req) => {
    const q = z.object({ from: IsoDate.optional(), to: IsoDate.optional(), status: z.enum(LR_STATUS).optional(), search: z.string().max(60).optional() }).parse(req.query);
    const { a } = ctx(req);
    return withTenant(db, a.tenantId, (tx) => listLr(tx, q));
  });
  app.post("/lr-entries", { preHandler: can("sales.create") }, async (req, reply) => {
    const body = Body.parse(req.body);
    const { a, actor } = ctx(req);
    return reply.code(201).send(await withTenant(db, a.tenantId, (tx) => saveLr(tx, actor, body)));
  });
  app.patch("/lr-entries/:id", { preHandler: can("sales.edit") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = Body.partial().parse(req.body);
    const { a, actor } = ctx(req);
    return withTenant(db, a.tenantId, (tx) => saveLr(tx, actor, body, id));
  });
}
