import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { commissionReport, deleteRule, listRules, RULE_KINDS, saveRule } from "../services/salesmancomm.js";

const Money = z.union([z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_amount"), z.number().nonnegative()]).transform(String);
const IdParam = z.object({ id: z.uuid() });
const Body = z.object({
  name: z.string().trim().min(1).max(60), kind: z.enum(RULE_KINDS), match: z.string().trim().max(80).nullish(), itemId: z.uuid().nullish(),
  mrpFrom: Money.nullish(), mrpTo: Money.nullish(), bandFrom: Money.nullish(), bandTo: Money.nullish(), ratePct: Money, active: z.boolean().optional(),
});

/** Salesman commission rules (by item, brand, category or MRP range) and the monthly commission they give. */
export async function salesmanCommissionRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const who = (req: Parameters<typeof requireTenant>[0]) => { const auth = requireTenant(req); return { auth, actor: { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip } }; };

  app.get("/salesman-commission/rules", { preHandler: can("payroll.view") }, async (req) => {
    const { auth } = who(req);
    return withTenant(db, auth.tenantId, (tx) => listRules(tx));
  });
  app.post("/salesman-commission/rules", { preHandler: can("payroll.edit") }, async (req, reply) => {
    const body = Body.parse(req.body);
    const { auth, actor } = who(req);
    return reply.code(201).send(await withTenant(db, auth.tenantId, (tx) => saveRule(tx, actor, body)));
  });
  app.put("/salesman-commission/rules/:id", { preHandler: can("payroll.edit") }, async (req) => {
    const body = Body.parse(req.body);
    const { auth, actor } = who(req);
    return withTenant(db, auth.tenantId, (tx) => saveRule(tx, actor, body, IdParam.parse(req.params).id));
  });
  app.delete("/salesman-commission/rules/:id", { preHandler: can("payroll.edit") }, async (req) => {
    const { auth, actor } = who(req);
    await withTenant(db, auth.tenantId, (tx) => deleteRule(tx, actor, IdParam.parse(req.params).id));
    return { ok: true };
  });
  app.get("/salesman-commission/report", { preHandler: can("payroll.view") }, async (req) => {
    const { month } = z.object({ month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "invalid_period") }).parse(req.query);
    const { auth } = who(req);
    return withTenant(db, auth.tenantId, (tx) => commissionReport(tx, month));
  });
}
