import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { businessDate } from "@varchasv/domain";
import { requireStepUp } from "../lib/stepup.js";
import { can, requireTenant } from "../plugins/auth.js";
import { removeAllocationRule, setAllocationRule, storeResults } from "../services/expensealloc.js";
import { DEFAULT_BANDS, costCentres, decideWritedown, listWritedowns, proposeWritedown, reviewStock } from "../services/stockfinance.js";

const Day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Bands = z.record(z.string(), z.number().min(0).max(100)).optional();

/** Stock finance: slow-stock write-down proposals that need a second person, and the store, GSTIN and channel cost centres. */
export async function stockFinanceRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant<T>>[2]>[0], a: { tenantId: string; userId: string; ip: string }) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }));
  };

  app.get("/finance/stock-review", { preHandler: can("inventory.view") }, async (req) => {
    const q = z.object({ asOf: Day.default(businessDate()), sellingCostPct: z.string().regex(/^\d{1,2}(\.\d{1,2})?$/).default("10"), bands: z.string().optional() }).parse(req.query);
    const bands = q.bands ? Bands.parse(JSON.parse(q.bands)) : undefined;
    return { defaults: DEFAULT_BANDS, ...(await run(req, (tx) => reviewStock(tx, q.asOf, { ...DEFAULT_BANDS, ...(bands ?? {}) }, q.sellingCostPct))) };
  });
  app.get("/finance/writedowns", { preHandler: can("inventory.view") }, async (req) => run(req, (tx) => listWritedowns(tx)));
  app.post("/finance/writedowns", { preHandler: can("inventory.edit") }, async (req, reply) => {
    const body = z.object({ asOf: Day, bands: Bands, sellingCostPct: z.string().regex(/^\d{1,2}(\.\d{1,2})?$/).optional(), note: z.string().trim().max(200).nullish() }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => proposeWritedown(tx, a, body)));
  });
  app.post("/finance/writedowns/:id/decide", { preHandler: can("inventory.approve") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = z.object({ decision: z.enum(["approve", "reject"]), date: Day.optional() }).parse(req.body);
    if (body.decision === "approve") await requireStepUp(db, req);
    return run(req, (tx, a) => decideWritedown(tx, a, id, body));
  });
  app.get("/finance/cost-centres", { preHandler: can("reports.view") }, async (req) => {
    const q = z.object({ asOf: Day.default(businessDate()), from: Day, to: Day }).parse(req.query);
    return run(req, (tx) => costCentres(tx, q.asOf, q.from, q.to));
  });
  app.get("/finance/store-results", { preHandler: can("reports.view") }, async (req) => {
    const q = z.object({ from: Day, to: Day }).parse(req.query);
    return run(req, (tx) => storeResults(tx, q.from, q.to));
  });
  app.put("/finance/allocation-rules/:accountId", { preHandler: can("accounts.create") }, async (req) => {
    const { accountId } = z.object({ accountId: z.uuid() }).parse(req.params);
    const body = z.object({ basis: z.enum(["sales", "stock", "equal", "fixed"]), shares: z.record(z.uuid(), z.string().regex(/^\d{1,3}(\.\d{1,2})?$/)).optional() }).parse(req.body);
    await run(req, (tx, a) => setAllocationRule(tx, a, { accountId, ...body }));
    return { ok: true };
  });
  app.delete("/finance/allocation-rules/:accountId", { preHandler: can("accounts.create") }, async (req) => {
    const { accountId } = z.object({ accountId: z.uuid() }).parse(req.params);
    await run(req, (tx, a) => removeAllocationRule(tx, a, accountId));
    return { ok: true };
  });
}
