import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { addCheque, addCommitment, cashForecast, listCommitments, stopCommitment, creditExposure, drawingPower, listCheques, settleCheque, supplierDueCalendar } from "../services/workingcap.js";

const Day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Money = z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_amount");

/** Working capital: credit exposure, supplier due dates, post-dated cheques, the cash forecast and the bank stock statement. */
export async function workingCapRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant<T>>[2]>[0], a: { tenantId: string; userId: string; ip: string }) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }));
  };

  app.get("/finance/credit-exposure", { preHandler: can("reports.view") }, async (req) => run(req, (tx) => creditExposure(tx)));
  app.get("/finance/supplier-calendar", { preHandler: can("reports.view") }, async (req) => run(req, (tx) => supplierDueCalendar(tx)));
  app.get("/finance/cash-forecast", { preHandler: can("reports.view") }, async (req) => {
    const q = z.object({ weeks: z.coerce.number().int().min(2).max(26).default(8), overduePct: z.coerce.number().min(0).max(100).default(50) }).parse(req.query);
    return run(req, (tx) => cashForecast(tx, undefined, q.weeks, q.overduePct));
  });
  app.get("/finance/commitments", { preHandler: can("reports.view") }, async (req) => run(req, (tx) => listCommitments(tx)));
  app.post("/finance/commitments", { preHandler: can("accounts.create") }, async (req, reply) => {
    const body = z.object({
      kind: z.enum(["loan", "capex", "other"]), direction: z.enum(["out", "in"]).default("out"), name: z.string().trim().min(2).max(80), amount: Money,
      firstDate: Day, repeat: z.enum(["once", "monthly"]).default("once"), until: Day.nullish(), note: z.string().trim().max(200).nullish(),
    }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => addCommitment(tx, a, body)));
  });
  app.post("/finance/commitments/:id/stop", { preHandler: can("accounts.create") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    await run(req, (tx, a) => stopCommitment(tx, a, id));
    return { ok: true };
  });
  app.get("/finance/drawing-power", { preHandler: can("reports.view") }, async (req) => {
    const q = z.object({ margin: z.string().regex(/^\d{1,2}(\.\d{1,2})?$/).default("25"), sanctioned: Money.default("0") }).parse(req.query);
    return run(req, (tx) => drawingPower(tx, undefined, q.margin, q.sanctioned));
  });

  app.get("/finance/cheques", { preHandler: can("accounts.view") }, async (req) => {
    const q = z.object({ status: z.enum(["pending", "cleared", "bounced", "cancelled"]).optional() }).parse(req.query);
    return run(req, (tx) => listCheques(tx, q.status));
  });
  app.post("/finance/cheques", { preHandler: can("accounts.create") }, async (req, reply) => {
    const body = z.object({
      direction: z.enum(["received", "issued"]), partyId: z.uuid(), bankAccountId: z.uuid(), chequeNo: z.string().trim().min(1).max(12), drawnOn: z.string().trim().max(60).nullish(),
      chequeDate: Day, amount: Money, note: z.string().trim().max(200).nullish(),
    }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => addCheque(tx, a, body)));
  });
  app.post("/finance/cheques/:id/settle", { preHandler: can("accounts.create") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = z.object({ outcome: z.enum(["cleared", "bounced", "cancelled"]), date: Day }).parse(req.body);
    await run(req, (tx, a) => settleCheque(tx, a, id, body.outcome, body.date));
    return { ok: true };
  });
}
