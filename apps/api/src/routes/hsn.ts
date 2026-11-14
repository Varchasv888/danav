import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { listHsn, saveHsn, seedStandardHsn } from "../services/hsn.js";

const Body = z.object({
  code: z.string().trim().min(2).max(8), description: z.string().trim().min(1).max(200), kind: z.enum(["goods", "service"]).optional(),
  gstRate: z.union([z.string().regex(/^\d{1,2}(\.\d{1,2})?$/, "invalid_percent"), z.number().min(0).max(99.99)]).transform(String).nullish(), archived: z.boolean().optional(),
});

/** The business's HSN and SAC codes: a short list the item and style forms suggest from. */
export async function hsnRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const ctx = (req: Parameters<typeof requireTenant>[0]) => {
    const a = requireTenant(req);
    return { a, actor: { tenantId: a.tenantId, userId: a.user.id, ip: req.ip } };
  };
  app.get("/hsn", { preHandler: can("inventory.view") }, async (req) => {
    const q = z.object({ search: z.string().max(60).optional(), all: z.enum(["1", "0"]).optional() }).parse(req.query);
    const { a } = ctx(req);
    return withTenant(db, a.tenantId, (tx) => listHsn(tx, { search: q.search, all: q.all === "1" }));
  });
  app.post("/hsn", { preHandler: can("inventory.create") }, async (req, reply) => {
    const body = Body.parse(req.body);
    const { a, actor } = ctx(req);
    return reply.code(201).send(await withTenant(db, a.tenantId, (tx) => saveHsn(tx, actor, body)));
  });
  app.patch("/hsn/:id", { preHandler: can("inventory.edit") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = Body.parse(req.body);
    const { a, actor } = ctx(req);
    return withTenant(db, a.tenantId, (tx) => saveHsn(tx, actor, body, id));
  });
  app.post("/hsn/seed-standard", { preHandler: can("inventory.create") }, async (req) => {
    const { a, actor } = ctx(req);
    return withTenant(db, a.tenantId, (tx) => seedStandardHsn(tx, actor));
  });
}
