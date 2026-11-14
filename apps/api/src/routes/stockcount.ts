import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { approveCount, cancelCount, countScopes, getCount, listCounts, reopenCount, resetCount, scan, importScanFile, setCounted, startCount, stockAudit, submitCount } from "../services/stockcount.js";

const IdParam = z.object({ id: z.uuid() });
const Qty = z.union([z.string().regex(/^\d+(\.\d{1,4})?$/, "invalid_qty"), z.number().nonnegative()]).transform(String);

/** Physical stock counts: start, scan, submit, approve (which adjusts the books). */
export async function stockCountRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant>[2]>[0], a: { tenantId: string; userId: string; ip: string }) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }));
  };

  app.get("/stock-counts", { preHandler: can("inventory.view") }, async (req) => run(req, async (tx) => (await listCounts(tx)).map((r) => ({ ...r.c, store: r.store, items: r.items, pieces: r.pieces }))));
  app.get("/reports/stock-audit", { preHandler: can("inventory.view") }, async (req) => {
    const q = z.object({ from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }).parse(req.query);
    return run(req, (tx) => stockAudit(tx, q.from, q.to));
  });
  app.get("/stock-counts/scopes", { preHandler: can("inventory.view") }, async (req) => run(req, (tx) => countScopes(tx)));
  app.post("/stock-counts", { preHandler: can("inventory.create") }, async (req, reply) => {
    const body = z.object({
      warehouseId: z.uuid(), name: z.string().trim().min(1).max(80), blind: z.boolean().optional(), verifyOnly: z.boolean().optional(),
      scope: z.object({ brand: z.string().trim().max(80).optional(), category: z.string().trim().max(80).optional(), styleId: z.uuid().optional(), season: z.string().trim().max(80).optional(), itemIds: z.array(z.uuid()).max(500).optional() }).optional(),
    }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => startCount(tx, a, body)));
  });
  app.get("/stock-counts/:id", { preHandler: can("inventory.view") }, async (req) =>
    run(req, (tx) => getCount(tx, IdParam.parse(req.params).id, requireTenant(req).permissions.has("inventory.approve"))));
  app.post("/stock-counts/:id/scan", { preHandler: can("inventory.create") }, async (req) => {
    const body = z.object({ code: z.string().trim().min(1).max(40), qty: Qty.optional(), set: z.boolean().optional() }).parse(req.body);
    return run(req, (tx) => scan(tx, IdParam.parse(req.params).id, body));
  });
  // A handheld scanner's text file, one scan or "code,qty" per line.
  app.post("/stock-counts/:id/import-scans", { preHandler: can("inventory.create"), bodyLimit: 3 * 1024 * 1024 }, async (req) => {
    const body = z.object({ text: z.string().max(2_000_000), mode: z.enum(["add", "replace"]).default("add") }).parse(req.body);
    return run(req, (tx) => importScanFile(tx, IdParam.parse(req.params).id, body.text, body.mode));
  });
  app.put("/stock-counts/:id/lines", { preHandler: can("inventory.create") }, async (req) => {
    const { lines } = z.object({ lines: z.array(z.object({ itemId: z.uuid(), counted: Qty })).min(1).max(2000) }).parse(req.body);
    await run(req, (tx) => setCounted(tx, IdParam.parse(req.params).id, lines));
    return { ok: true };
  });
  app.post("/stock-counts/:id/reset", { preHandler: can("inventory.create") }, async (req) => run(req, (tx, a) => resetCount(tx, a, IdParam.parse(req.params).id)));
  app.post("/stock-counts/:id/submit", { preHandler: can("inventory.create") }, async (req) => {
    await run(req, (tx, a) => submitCount(tx, a, IdParam.parse(req.params).id));
    return { ok: true };
  });
  app.post("/stock-counts/:id/reopen", { preHandler: can("inventory.edit") }, async (req) => {
    await run(req, (tx, a) => reopenCount(tx, a, IdParam.parse(req.params).id));
    return { ok: true };
  });
  app.post("/stock-counts/:id/approve", { preHandler: can("inventory.approve") }, async (req) => {
    const { reason } = z.object({ reason: z.string().trim().max(300).optional() }).parse(req.body ?? {});
    return run(req, (tx, a) => approveCount(tx, a, IdParam.parse(req.params).id, reason));
  });
  app.post("/stock-counts/:id/cancel", { preHandler: can("inventory.cancel") }, async (req) => {
    await run(req, (tx, a) => cancelCount(tx, a, IdParam.parse(req.params).id));
    return { ok: true };
  });
}
