import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { businessDate, businessTime } from "@varchasv/domain";
import { can, requireTenant } from "../plugins/auth.js";
import { addBranchPrices, copyBranchPrices, importBranchPrices, listBranchPrices, ratesForTill, removeBranchPrice } from "../services/branchprices.js";

const Day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "invalid_time");
const Rate = z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_amount");

/** Each store's own selling rates, over the item's usual rate. */
export async function branchPriceRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant<T>>[2]>[0], a: { tenantId: string; userId: string; ip: string }) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }));
  };

  app.get("/branch-prices", { preHandler: can("sales.view") }, async (req) => {
    const q = z.object({ warehouseId: z.uuid() }).parse(req.query);
    return run(req, (tx) => listBranchPrices(tx, q.warehouseId));
  });
  app.post("/branch-prices", { preHandler: can("sales.edit") }, async (req, reply) => {
    const body = z.object({
      warehouseId: z.uuid(),
      entries: z.array(z.object({ itemId: z.uuid(), saleRate: Rate, startsOn: Day.nullish(), endsOn: Day.nullish(), weekdays: z.array(z.number().int().min(0).max(6)).max(7).nullish(), fromTime: Time.nullish(), toTime: Time.nullish(), note: z.string().trim().max(120).nullish() })).min(1).max(500),
    }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => addBranchPrices(tx, a, body.warehouseId, body.entries)));
  });
  app.post("/branch-prices/import", { preHandler: can("sales.edit") }, async (req, reply) => {
    const body = z.object({ warehouseId: z.uuid(), text: z.string().max(100_000), startsOn: Day.nullish(), endsOn: Day.nullish() }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => importBranchPrices(tx, a, body.warehouseId, body.text, body)));
  });
  app.post("/branch-prices/copy", { preHandler: can("sales.edit") }, async (req) => {
    const body = z.object({ fromWarehouseId: z.uuid(), toWarehouseId: z.uuid() }).parse(req.body);
    return run(req, (tx, a) => copyBranchPrices(tx, a, body.fromWarehouseId, body.toWarehouseId));
  });
  app.delete("/branch-prices/:id", { preHandler: can("sales.edit") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    await run(req, (tx, a) => removeBranchPrice(tx, a, id));
    return { ok: true };
  });
  /** What a till should charge in a store right now, by item. */
  app.get("/pos/branch-prices", { preHandler: can("sales.view") }, async (req) => {
    const q = z.object({ warehouseId: z.uuid() }).parse(req.query);
    return run(req, async (tx) => ({ rates: await ratesForTill(tx, q.warehouseId, businessDate(), businessTime()) }));
  });
}
