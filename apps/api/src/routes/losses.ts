import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { LOSS_REASONS, decideLoss, listLosses, lossReport, lossSettings, recordLoss, setLossSettings } from "../services/losses.js";

const Day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");

/** Stock written off as damaged, lost, stolen or expired, with the reason, the evidence and a second person's approval above a limit. */
export async function lossRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant<T>>[2]>[0], a: { tenantId: string; userId: string; ip: string }) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }));
  };

  app.get("/stock-losses", { preHandler: can("inventory.view") }, async (req) => {
    const q = z.object({ status: z.enum(["pending", "approved", "rejected"]).optional() }).parse(req.query);
    return run(req, (tx) => listLosses(tx, q.status));
  });
  app.post("/stock-losses", { preHandler: can("inventory.create") }, async (req, reply) => {
    const body = z.object({
      itemId: z.uuid(), warehouseId: z.uuid(), qty: z.string().regex(/^\d+(\.\d{1,4})?$/, "invalid_qty"), reason: z.enum(LOSS_REASONS),
      note: z.string().trim().max(300).nullish(), fileId: z.uuid().nullish(), date: Day.optional(),
    }).parse(req.body);
    const canApprove = requireTenant(req).permissions.has("inventory.approve");
    return reply.code(201).send(await run(req, (tx, a) => recordLoss(tx, a, canApprove, body)));
  });
  app.post("/stock-losses/:id/decide", { preHandler: can("inventory.approve") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = z.object({ decision: z.enum(["approve", "reject"]), note: z.string().trim().max(200).optional() }).parse(req.body);
    return run(req, (tx, a) => decideLoss(tx, a, id, body));
  });
  app.get("/stock-losses/settings", { preHandler: can("inventory.view") }, async (req) => run(req, (tx) => lossSettings(tx)));
  app.put("/stock-losses/settings", { preHandler: can("inventory.approve") }, async (req) => {
    const body = z.object({ approvalLimit: z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_amount") }).parse(req.body);
    return run(req, (tx, a) => setLossSettings(tx, a, body));
  });
  app.get("/reports/stock-losses", { preHandler: can("inventory.view") }, async (req) => {
    const q = z.object({ from: Day, to: Day }).parse(req.query);
    return run(req, (tx) => lossReport(tx, q.from, q.to));
  });
}
