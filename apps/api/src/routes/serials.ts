import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { businessDate } from "@varchasv/domain";
import { can, requireTenant } from "../plugins/auth.js";
import { listSerials, lookupSerial, registerSerials, serialCheck, setTrackSerials } from "../services/serials.js";

/** Pieces tracked by serial number: switching an item over, entering serials by hand, looking one up, and checking them against stock. */
export async function serialRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant<T>>[2]>[0], a: { tenantId: string; userId: string; ip: string }) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }));
  };

  app.put("/items/:id/track-serials", { preHandler: can("inventory.edit") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = z.object({ value: z.boolean() }).parse(req.body);
    await run(req, (tx, a) => setTrackSerials(tx, a, id, body.value));
    return { ok: true };
  });
  app.get("/serials", { preHandler: can("inventory.view") }, async (req) => {
    const q = z.object({ itemId: z.uuid(), status: z.enum(["in_stock", "sold", "removed"]).optional() }).parse(req.query);
    return run(req, (tx) => listSerials(tx, q.itemId, q.status));
  });
  app.post("/serials", { preHandler: can("inventory.create") }, async (req, reply) => {
    const body = z.object({ itemId: z.uuid(), warehouseId: z.uuid(), serials: z.array(z.string().trim().min(1).max(40)).min(1).max(5000), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).default(businessDate()) }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => registerSerials(tx, a, { ...body, source: { kind: "manual" } })));
  });
  app.get("/serials/lookup", { preHandler: can("inventory.view") }, async (req) => {
    const q = z.object({ serial: z.string().trim().min(1).max(40) }).parse(req.query);
    return run(req, (tx) => lookupSerial(tx, q.serial));
  });
  app.get("/serials/check", { preHandler: can("inventory.view") }, async (req) => run(req, (tx) => serialCheck(tx)));
}
