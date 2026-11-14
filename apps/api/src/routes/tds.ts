import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { TCS_SECTIONS, TDS_SECTIONS } from "@varchasv/domain";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { cancelCollection, form27eq, form27eqCsv, listCollections, previewCollection, recordCollection } from "../services/tcs.js";
import { cancelChallan, cancelDeduction, certificate, clearSectionMap, parseSectionMap, sectionMap, setSectionMap, form26q, form26qCsv, listChallans, listDeductions, previewDeduction, recordChallan, recordDeduction, tracker194Q } from "../services/tds.js";
import { listEnabledTcsSections, listTcsSectionSettings, saveTcsSectionSettings } from "../services/tcssections.js";

const Money = z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_amount");
const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Fy = z.string().regex(/^\d{4}-\d{2}$/, "invalid_fy");
const Rate = z.string().regex(/^\d{1,2}(\.\d{1,2})?$/, "invalid_rate");
const Reason = z.object({ reason: z.string().trim().min(3).max(200) });
const CompanyQuery = z.object({ companyId: z.uuid().optional() });

/** Tax deducted at source on payments other than salary: the section master, deductions, challans and the quarterly return (Form 26Q). */
export async function tdsRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant<T>>[2]>[0], a: { tenantId: string; userId: string; ip: string }) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }));
  };

  app.get("/tds/section-map", { preHandler: can("accounts.view") }, async (req) => run(req, (tx) => sectionMap(tx)));
  app.put("/tds/section-map", { preHandler: can("accounts.create") }, async (req) => {
    const body = z.object({ text: z.string().max(20000).optional(), entries: z.array(z.object({ legacySection: z.string().trim().min(2).max(12), newRef: z.string().trim().min(1).max(40), paymentCode: z.string().trim().max(8).nullish(), note: z.string().trim().max(200).nullish() })).max(50).optional() })
      .refine((b) => b.text || b.entries?.length, "empty_map").parse(req.body);
    const entries = body.text ? parseSectionMap(body.text) : body.entries!;
    await run(req, (tx, a) => setSectionMap(tx, a, entries));
    return { ok: true, saved: entries.length };
  });
  app.delete("/tds/section-map/:section", { preHandler: can("accounts.create") }, async (req) => {
    const { section } = z.object({ section: z.string().min(2).max(12) }).parse(req.params);
    await run(req, (tx, a) => clearSectionMap(tx, a, section));
    return { ok: true };
  });
  app.get("/tds/sections", { preHandler: can("accounts.view") }, async () => TDS_SECTIONS);

  app.get("/tds/preview", { preHandler: can("accounts.view") }, async (req) => {
    const q = z.object({ deducteeId: z.uuid(), section: z.string().max(10), date: IsoDate, base: Money, rate: Rate.optional() }).parse(req.query);
    return run(req, (tx) => previewDeduction(tx, q));
  });
  app.get("/tds/deductions", { preHandler: can("accounts.view") }, async (req) => {
    const q = z.object({ fy: Fy.optional(), quarter: z.coerce.number().int().min(1).max(4).optional() }).parse(req.query);
    return run(req, (tx) => listDeductions(tx, q));
  });
  app.post("/tds/deductions", { preHandler: can("accounts.create") }, async (req, reply) => {
    const body = z.object({ deducteeId: z.uuid(), section: z.string().max(10), date: IsoDate, base: Money, rate: Rate.nullish(), note: z.string().trim().max(200).nullish() }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => recordDeduction(tx, a, body)));
  });
  app.post("/tds/deductions/:id/cancel", { preHandler: can("accounts.edit") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const { reason } = Reason.parse(req.body);
    await run(req, (tx, a) => cancelDeduction(tx, a, id, reason));
    return { ok: true };
  });

  app.get("/tds/challans", { preHandler: can("accounts.view") }, async (req) => {
    const q = z.object({ fy: Fy.optional(), kind: z.enum(["tds", "tcs"]).default("tds"), companyId: z.uuid().optional() }).parse(req.query);
    return run(req, (tx) => listChallans(tx, q.fy, q.kind, q.companyId));
  });
  app.post("/tds/challans", { preHandler: can("accounts.create") }, async (req, reply) => {
    const body = z.object({ paidOn: IsoDate, amount: Money, accountId: z.uuid(), bsrCode: z.string().regex(/^\d{7}$/, "challan_details_required"), challanSerial: z.string().regex(/^\d{1,8}$/, "challan_details_required"), deductionIds: z.array(z.uuid()).max(500).optional(), kind: z.enum(["tds", "tcs"]).optional(), companyId: z.uuid().optional() }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => recordChallan(tx, a, body)));
  });
  app.post("/tds/challans/:id/cancel", { preHandler: can("accounts.edit") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const { reason } = Reason.parse(req.body);
    await run(req, (tx, a) => cancelChallan(tx, a, id, reason));
    return { ok: true };
  });

  app.get("/tds/26q", { preHandler: can("reports.view") }, async (req) => {
    const q = z.object({ fy: Fy, quarter: z.coerce.number().int().min(1).max(4) }).parse(req.query);
    return run(req, async (tx) => {
      const r = await form26q(tx, q.fy, q.quarter as 1 | 2 | 3 | 4);
      return { ...r, files: form26qCsv(r) };
    });
  });

  // ---- certificate and the 194Q tracker -----------------------------------------------------------
  app.get("/tds/certificate", { preHandler: can("reports.view") }, async (req) => {
    const q = z.object({ deducteeId: z.uuid(), fy: Fy, quarter: z.coerce.number().int().min(1).max(4) }).parse(req.query);
    return run(req, (tx) => certificate(tx, q.deducteeId, q.fy, q.quarter as 1 | 2 | 3 | 4));
  });
  app.get("/tds/194q", { preHandler: can("reports.view") }, async (req) => {
    const q = z.object({ fy: Fy }).parse(req.query);
    return run(req, (tx) => tracker194Q(tx, q.fy));
  });

  // ---- tax collected at source (Form 27EQ) --------------------------------------------------------
  app.get("/tcs/section-settings", { preHandler: can("accounts.view") }, async (req) => {
    const auth = requireTenant(req);
    const { companyId } = CompanyQuery.parse(req.query);
    return withTenant(db, auth.tenantId, (tx) => listTcsSectionSettings(tx, companyId));
  });
  app.put("/tcs/section-settings", { preHandler: can("accounts.edit") }, async (req) => {
    const auth = requireTenant(req);
    const { companyId } = CompanyQuery.parse(req.query);
    const body = z.object({ enabledSections: z.array(z.string().trim().min(1).max(20)).max(TCS_SECTIONS.length) }).strict().parse(req.body);
    return withTenant(db, auth.tenantId, (tx) => saveTcsSectionSettings(
      tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }, companyId, body.enabledSections,
    ));
  });
  app.get("/tcs/sections", { preHandler: can("accounts.view") }, async (req) => {
    const auth = requireTenant(req);
    const { companyId } = CompanyQuery.parse(req.query);
    return withTenant(db, auth.tenantId, (tx) => listEnabledTcsSections(tx, companyId));
  });
  app.get("/tcs/preview", { preHandler: can("accounts.view") }, async (req) => {
    const q = z.object({ customerId: z.uuid(), section: z.string().max(20), base: Money, rate: Rate.optional(), companyId: z.uuid().optional() }).parse(req.query);
    return run(req, (tx) => previewCollection(tx, q, q.companyId));
  });
  app.get("/tcs/collections", { preHandler: can("accounts.view") }, async (req) => {
    const q = z.object({ fy: Fy.optional(), companyId: z.uuid().optional() }).parse(req.query);
    return run(req, (tx) => listCollections(tx, q.fy, q.companyId));
  });
  app.post("/tcs/collections", { preHandler: can("accounts.create") }, async (req, reply) => {
    const { companyId } = CompanyQuery.parse(req.query);
    const body = z.object({ customerId: z.uuid(), section: z.string().max(20), date: IsoDate, base: Money, rate: Rate.nullish(), note: z.string().trim().max(200).nullish() }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => recordCollection(tx, a, body, companyId)));
  });
  app.post("/tcs/collections/:id/cancel", { preHandler: can("accounts.edit") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const { companyId } = CompanyQuery.parse(req.query);
    const { reason } = Reason.parse(req.body);
    await run(req, (tx, a) => cancelCollection(tx, a, id, reason, companyId));
    return { ok: true };
  });
  app.get("/tcs/27eq", { preHandler: can("reports.view") }, async (req) => {
    const q = z.object({ fy: Fy, quarter: z.coerce.number().int().min(1).max(4), companyId: z.uuid().optional() }).parse(req.query);
    return run(req, async (tx) => {
      const r = await form27eq(tx, q.fy, q.quarter as 1 | 2 | 3 | 4, q.companyId);
      return { ...r, files: form27eqCsv(r) };
    });
  });
}
