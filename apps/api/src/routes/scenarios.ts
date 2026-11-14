import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { SCENARIO_KINDS, type Adjustment } from "@varchasv/domain";
import { can, requireTenant } from "../plugins/auth.js";
import { deleteScenario, listScenarios, previewScenario, saveScenario, scenarioBaseline } from "../services/scenarios.js";

const Num = z.number().finite();
const Ranged = z.union([Num, z.tuple([Num, Num, Num])]);
const Base = z.object({ name: z.string().max(60).optional() });
const Adj = z.discriminatedUnion("kind", [
  Base.extend({ kind: z.literal("hire"), count: Ranged, monthlyCost: Ranged, startMonth: Ranged, yearlySalesPerHire: Ranged }),
  Base.extend({ kind: z.literal("store"), capex: Ranged, monthlyRent: Ranged, monthlyStaff: Ranged, monthlySales: Ranged, rampMonths: Ranged, startMonth: Ranged }),
  Base.extend({ kind: z.literal("price"), changePct: Ranged, volumeChangePct: Ranged }),
  Base.extend({ kind: z.literal("discount"), extraDiscountPct: Ranged, volumeUpliftPct: Ranged }),
  Base.extend({ kind: z.literal("supplier"), costChangePct: Ranged }),
  Base.extend({ kind: z.literal("credit"), receivableDaysChange: Ranged, payableDaysChange: Ranged }),
  Base.extend({ kind: z.literal("loan"), amount: Ranged, ratePct: Ranged, tenureMonths: Ranged, startMonth: Ranged, capexSpend: Ranged }),
  Base.extend({ kind: z.literal("demand"), salesChangePct: Ranged }),
  Base.extend({ kind: z.literal("stock"), stockDaysChange: Ranged }),
]);

/** What-if modelling: a baseline from the books, changes with worst, expected and best values, and saved scenarios. */
export async function scenarioRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant<T>>[2]>[0], a: { tenantId: string; userId: string; ip: string }) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }));
  };
  app.get("/scenarios/kinds", { preHandler: can("reports.view") }, async () => SCENARIO_KINDS);
  app.get("/scenarios/baseline", { preHandler: can("reports.view") }, async (req) => run(req, (tx) => scenarioBaseline(tx)));
  app.post("/scenarios/preview", { preHandler: can("reports.view") }, async (req) => {
    const body = z.object({ adjustments: z.array(Adj).min(1).max(20) }).parse(req.body);
    return run(req, (tx) => previewScenario(tx, body.adjustments as Adjustment[]));
  });
  app.get("/scenarios", { preHandler: can("reports.view") }, async (req) => run(req, (tx) => listScenarios(tx)));
  app.post("/scenarios", { preHandler: can("reports.view") }, async (req, reply) => {
    const body = z.object({ name: z.string().trim().min(2).max(80), adjustments: z.array(Adj).min(1).max(20), note: z.string().max(300).nullish() }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => saveScenario(tx, a, { ...body, adjustments: body.adjustments as Adjustment[] })));
  });
  app.delete("/scenarios/:id", { preHandler: can("reports.view") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    await run(req, (tx, a) => deleteScenario(tx, a, id));
    return { ok: true };
  });
}
