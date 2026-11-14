import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { businessDate } from "@varchasv/domain";
import { can, requireTenant } from "../plugins/auth.js";
import { branchComparison, dispatchAllocation, proposeAllocation, type AllocationInput } from "../services/distribution.js";

const Iso = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const Qty = z.string().regex(/^\d+$/);

/** Head office against branches, and sharing new stock between stores by demand, ratio or fixed numbers. */
export async function distributionRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant<T>>[2]>[0], a: { tenantId: string; userId: string; ip: string }) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }));
  };
  const Body = z.object({
    fromWarehouseId: z.uuid(), mode: z.enum(["demand", "ratio", "fixed"]), items: z.array(z.object({ itemId: z.uuid(), qty: Qty })).min(1).max(300), days: z.number().int().min(7).max(365).optional(),
    weights: z.array(z.object({ warehouseId: z.uuid(), weight: z.string().regex(/^\d+(\.\d+)?$/) })).max(100).optional(),
    fixed: z.array(z.object({ warehouseId: z.uuid(), qty: Qty })).max(100).optional(), exclude: z.array(z.uuid()).max(100).optional(),
  });
  app.get("/reports/branch-comparison", { preHandler: can("reports.view") }, async (req) => {
    const q = z.object({ from: Iso.default(() => `${businessDate().slice(0, 7)}-01`), to: Iso.default(businessDate) }).parse(req.query);
    return run(req, (tx) => branchComparison(tx, q.from, q.to));
  });
  app.post("/allocations/propose", { preHandler: can("inventory.view") }, async (req) => {
    const b = Body.parse(req.body) as AllocationInput;
    return run(req, (tx) => proposeAllocation(tx, b));
  });
  app.post("/allocations/dispatch", { preHandler: can("inventory.create") }, async (req, reply) => {
    const b = Body.extend({ date: Iso }).parse(req.body) as AllocationInput & { date: string };
    return reply.code(201).send(await run(req, (tx, a) => dispatchAllocation(tx, a, b)));
  });
}
