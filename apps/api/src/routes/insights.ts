import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { PERIOD_PRESETS, businessDate } from "@varchasv/domain";
import { badRequest } from "../lib/errors.js";
import { can, canAny, requireTenant } from "../plugins/auth.js";
import { anomalies, dashboard, fyToDate } from "../services/analytics.js";
import { ask, assistantTools } from "../services/assistant.js";
import { readPurchaseBill } from "../services/billreader.js";
import { insights } from "../services/insights.js";
import { colourSizeMatrix, salesRegister, stockAgeing } from "../services/ownerreports.js";
import type { Mailer } from "../lib/mailer.js";
import { DATASETS, deleteReport, emailReport, describeDatasets, listReports, reportCsv, runReport, saveReport } from "../services/reportbuilder.js";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const IdParam = z.object({ id: z.uuid() });
const today = () => businessDate();

const Config = z.object({
  dataset: z.enum(Object.keys(DATASETS) as [string, ...string[]]),
  groupBy: z.array(z.string().max(20)).max(3),
  measures: z.array(z.string().max(20)).min(1).max(6),
  period: z.object({ preset: z.enum([...PERIOD_PRESETS, "custom"]), from: IsoDate.optional(), to: IsoDate.optional() }),
  filters: z.record(z.string().max(20), z.uuid()).optional(),
  layout: z.object({ columns: z.array(z.string().max(20)).max(9) }).optional(),
});

export async function insightRoutes(app: FastifyInstance, { db, mailer }: { db: Db; mailer: Mailer }) {
  const actor = (auth: { tenantId: string; user: { id: string } }, ip: string) => ({ tenantId: auth.tenantId, userId: auth.user.id, ip });
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant>[2]>[0], a: ReturnType<typeof actor>, perms: Set<string>) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, actor(auth, req.ip), auth.permissions));
  };

  // Every signed-in member gets a dashboard; each block checks its own permission.
  app.get("/analytics/dashboard", async (req) => {
    const { date } = z.object({ date: IsoDate.default(today) }).parse(req.query);
    return run(req, (tx, _a, perms) => dashboard(tx, perms, date));
  });
  // Business intelligence for a period (this month by default), against the same period a year earlier.
  app.get("/analytics/insights", { preHandler: can("reports.view") }, async (req) => {
    const t = today();
    const q = z.object({ from: IsoDate.default(`${t.slice(0, 7)}-01`), to: IsoDate.default(t) }).parse(req.query);
    if (q.from > q.to) throw badRequest("invalid_period");
    return run(req, (tx) => insights(tx, q.from, q.to));
  });
  // Owner reports: the colour-size matrix, stock ageing with dead stock, and the sales register.
  app.get("/reports/colour-size", { preHandler: canAny("inventory.view", "reports.view") }, async (req) => {
    const t = today();
    const q = z.object({
      type: z.enum(["stock", "sales"]).default("stock"), asOf: IsoDate.default(t), from: IsoDate.default(`${t.slice(0, 7)}-01`), to: IsoDate.default(t),
      warehouseId: z.uuid().optional(), brand: z.string().trim().max(60).optional(), category: z.string().trim().max(60).optional(),
      season: z.string().trim().max(60).optional(), q: z.string().trim().max(60).optional(),
    }).parse(req.query);
    return run(req, (tx) => colourSizeMatrix(tx, q));
  });
  app.get("/reports/stock-ageing", { preHandler: canAny("inventory.view", "reports.view") }, async (req) => {
    const q = z.object({ asOf: IsoDate.default(today), deadDays: z.coerce.number().int().min(15).max(730).default(90), all: z.enum(["1", "0"]).optional() }).parse(req.query);
    return run(req, (tx) => stockAgeing(tx, q.asOf, q.deadDays, q.all === "1"));
  });
  app.get("/reports/sales-register", { preHandler: canAny("sales.view", "reports.view") }, async (req) => {
    const t = today();
    const q = z.object({ from: IsoDate.default(`${t.slice(0, 7)}-01`), to: IsoDate.default(t) }).parse(req.query);
    if (q.from > q.to) throw badRequest("invalid_period");
    return run(req, (tx) => salesRegister(tx, q.from, q.to));
  });
  app.get("/analytics/checks", { preHandler: can("reports.view") }, async (req) => {
    const d = fyToDate(today());
    const q = z.object({ from: IsoDate.default(d.from), to: IsoDate.default(d.to) }).parse(req.query);
    return run(req, (tx) => anomalies(tx, q.from, q.to));
  });

  // ---- report builder ------------------------------------------------------------------------------
  app.get("/reports/builder/datasets", async (req) => run(req, async (_tx, _a, perms) => describeDatasets(perms)));
  app.post("/reports/builder/run", async (req) => {
    requireTenant(req);
    const config = Config.parse(req.body);
    return run(req, (tx, _a, perms) => runReport(tx, perms, config, today()));
  });
  app.post("/reports/builder/csv", async (req, reply) => {
    requireTenant(req);
    const body = Config.extend({ name: z.string().trim().min(1).max(80).default("report") }).parse(req.body);
    const csv = await run(req, async (tx, _a, perms) => reportCsv(body.name, await runReport(tx, perms, body, today())));
    return reply.header("content-type", "text/csv; charset=utf-8").header("content-disposition", `attachment; filename="${body.name.replace(/[^\w-]+/g, "-")}.csv"`).send(`﻿${csv}`);
  });
  app.post("/reports/builder/email", { preHandler: can("reports.export") }, async (req) => {
    const body = z.object({ name: z.string().trim().min(1).max(80).default("report"), config: Config, to: z.array(z.email()).min(1).max(5) }).parse(req.body);
    return run(req, (tx, _a, perms) => emailReport(tx, perms, mailer, body, today()));
  });
  const Saved = z.object({
    name: z.string().trim().min(2).max(80), config: Config,
    schedule: z.object({
      frequency: z.enum(["daily", "weekly", "monthly"]), hour: z.number().int(), weekday: z.number().int().optional(), day: z.number().int().optional(),
      recipients: z.array(z.email()).max(10),
    }).nullish(),
  });
  app.get("/reports/saved", { preHandler: can("reports.view") }, async (req) => run(req, (tx) => listReports(tx)));
  app.post("/reports/saved", { preHandler: can("reports.export") }, async (req, reply) => reply.code(201).send(await run(req, (tx, a, perms) => saveReport(tx, a, perms, Saved.parse(req.body)))));
  app.put("/reports/saved/:id", { preHandler: can("reports.export") }, async (req) => run(req, (tx, a, perms) => saveReport(tx, a, perms, Saved.parse(req.body), IdParam.parse(req.params).id)));
  app.delete("/reports/saved/:id", { preHandler: can("reports.export") }, async (req) => { await run(req, (tx, a) => deleteReport(tx, a, IdParam.parse(req.params).id)); return { ok: true }; });

  // ---- assistant ---------------------------------------------------------------------------------------
  app.get("/assistant/tools", async (req) => run(req, async (_tx, _a, perms) => ({ mode: process.env.ANTHROPIC_API_KEY ? "claude" : "demo", tools: assistantTools(perms) })));
  app.post("/assistant/ask", { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } }, async (req) => {
    requireTenant(req);
    const body = z.object({
      messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) })).min(1).max(30),
      locale: z.string().max(5).default("en"),
    }).parse(req.body);
    return run(req, (tx, a, perms) => ask(tx, a, perms, body.messages, { today: today(), locale: body.locale }));
  });

  // ---- reading a supplier's bill into the purchase form --------------------------------------------------
  app.post("/purchase-bills/read", { preHandler: can("purchase.create") }, async (req) => {
    const { fileId } = z.object({ fileId: z.uuid() }).parse(req.body);
    return run(req, (tx) => readPurchaseBill(tx, fileId));
  });
}
