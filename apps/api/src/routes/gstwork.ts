import { slabExceptions } from "../services/slabcheck.js";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { gstr4Summary, gstr9Working, gstr9cWorking } from "../services/gstannual.js";
import { decideApproval, listApprovals, requestApproval } from "../services/filing.js";
import { compare2Ato2B, decide2B, einvoiceAlerts, filingCalendar, gstWorkSettings, import2B, list2BImports, listItcReversals, reclaimItc, reconcile2B, reverseItc, rule37, rule37A, setApprovalRequired, setQrmp } from "../services/gstwork.js";

/** The GST workspace: filing calendar, GSTR-2B reconciliation, e-invoice reporting window and Rule 37. */
export async function gstWorkRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant<T>>[2]>[0], a: { tenantId: string; userId: string; ip: string }) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }));
  };
  const Period = z.string().regex(/^\d{6}$/, "invalid_period");

  app.get("/gst/work/settings", { preHandler: can("gst.view") }, async (req) => run(req, (tx) => gstWorkSettings(tx)));
  app.put("/gst/work/settings", { preHandler: can("gst.submit") }, async (req) => {
    const body = z.object({ qrmp: z.boolean().optional(), approvalRequired: z.boolean().optional() }).parse(req.body);
    await run(req, async (tx, a) => {
      if (body.qrmp !== undefined) await setQrmp(tx, a, body.qrmp);
      if (body.approvalRequired !== undefined) await setApprovalRequired(tx, a, body.approvalRequired);
    });
    return { ok: true };
  });
  app.get("/gst/work/calendar", { preHandler: can("gst.view") }, async (req) => run(req, (tx) => filingCalendar(tx)));
  app.get("/gst/work/einvoice-alerts", { preHandler: can("gst.view") }, async (req) => run(req, (tx) => einvoiceAlerts(tx)));
  app.get("/gst/work/slab-exceptions", { preHandler: can("gst.view") }, async (req) => {
    const q = z.object({ from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }).parse(req.query);
    return run(req, (tx) => slabExceptions(tx, q.from, q.to));
  });
  app.get("/gst/work/rule37", { preHandler: can("gst.view") }, async (req) => run(req, (tx) => rule37(tx)));

  app.get("/gst/work/2b", { preHandler: can("gst.view") }, async (req) => run(req, (tx) => list2BImports(tx)));
  app.post("/gst/work/2b", { preHandler: can("gst.submit"), bodyLimit: 20 * 1024 * 1024 }, async (req, reply) => {
    const body = z.object({ json: z.unknown(), period: Period.optional() }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => import2B(tx, a, body.json, body.period)));
  });
  app.get("/gst/work/2b/:period", { preHandler: can("gst.view") }, async (req) => {
    const { period } = z.object({ period: Period }).parse(req.params);
    return run(req, (tx) => reconcile2B(tx, period));
  });
  app.post("/gst/work/2b/rows/:id/decide", { preHandler: can("gst.submit") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = z.object({ decision: z.enum(["accepted", "queried"]), note: z.string().trim().min(3).max(200) }).parse(req.body);
    await run(req, (tx, a) => decide2B(tx, a, id, body.decision, body.note));
    return { ok: true };
  });

  // GSTR-2A: the live view, with whether each supplier has filed
  app.get("/gst/work/2a", { preHandler: can("gst.view") }, async (req) => run(req, (tx) => list2BImports(tx, "2a")));
  app.post("/gst/work/2a", { preHandler: can("gst.submit"), bodyLimit: 20 * 1024 * 1024 }, async (req, reply) => {
    const body = z.object({ json: z.unknown(), period: Period.optional() }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => import2B(tx, a, body.json, body.period, "2a")));
  });
  app.get("/gst/work/2a/:period", { preHandler: can("gst.view") }, async (req) => {
    const { period } = z.object({ period: Period }).parse(req.params);
    return run(req, (tx) => reconcile2B(tx, period, "2a"));
  });
  app.get("/gst/work/2a/:period/vs-2b", { preHandler: can("gst.view") }, async (req) => {
    const { period } = z.object({ period: Period }).parse(req.params);
    return run(req, (tx) => compare2Ato2B(tx, period));
  });

  // Rule 37A and the reversals of input credit
  const Day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
  app.get("/gst/work/rule37a", { preHandler: can("gst.view") }, async (req) => {
    const q = z.object({ fy: z.coerce.number().int().min(2017).max(2100) }).parse(req.query);
    return run(req, (tx) => rule37A(tx, q.fy));
  });
  app.get("/gst/work/itc-reversals", { preHandler: can("gst.view") }, async (req) => run(req, (tx) => listItcReversals(tx)));
  app.post("/gst/work/itc-reversals", { preHandler: can("gst.submit") }, async (req, reply) => {
    const body = z.object({ rule: z.enum(["37", "37A"]), billId: z.uuid(), date: Day, counterAccountId: z.uuid(), note: z.string().trim().max(200).nullish() }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => reverseItc(tx, a, body)));
  });
  app.post("/gst/work/itc-reversals/:id/reclaim", { preHandler: can("gst.submit") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = z.object({ date: Day, counterAccountId: z.uuid() }).parse(req.body);
    await run(req, (tx, a) => reclaimItc(tx, a, id, body));
    return { ok: true };
  });

  // Annual working and the composition summary
  app.get("/gst/work/gstr9c", { preHandler: can("gst.view") }, async (req) => {
    const q = z.object({ fy: z.coerce.number().int().min(2017).max(2100) }).parse(req.query);
    return run(req, (tx) => gstr9cWorking(tx, q.fy));
  });
  app.get("/gst/work/gstr9", { preHandler: can("gst.view") }, async (req) => {
    const q = z.object({ fy: z.coerce.number().int().min(2017).max(2100), basis: z.enum(["2b", "books"]).default("2b") }).parse(req.query);
    return run(req, (tx) => gstr9Working(tx, q.fy, q.basis));
  });
  app.get("/gst/work/gstr4", { preHandler: can("gst.view") }, async (req) => {
    const q = z.object({ fy: z.coerce.number().int().min(2017).max(2100), rate: z.string().regex(/^\d(\.\d{1,2})?$/).default("1") }).parse(req.query);
    return run(req, (tx) => gstr4Summary(tx, q.fy, q.rate));
  });

  // Sign-off before a return is uploaded
  app.get("/gst/work/approvals", { preHandler: can("gst.view") }, async (req) => run(req, (tx) => listApprovals(tx)));
  app.post("/gst/work/approvals", { preHandler: can("gst.submit") }, async (req, reply) => {
    const body = z.object({ returnType: z.enum(["GSTR1", "GSTR3B"]), period: Period }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => requestApproval(tx, a, body.returnType, body.period)));
  });
  app.post("/gst/work/approvals/:id/decide", { preHandler: can("gst.approve") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = z.object({ decision: z.enum(["approve", "reject"]), note: z.string().trim().max(200).default("") }).parse(req.body);
    await run(req, (tx, a) => decideApproval(tx, a, id, body.decision, body.note));
    return { ok: true };
  });
}
