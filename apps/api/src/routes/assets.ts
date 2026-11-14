import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { ASSET_CLASS_PRESETS } from "@varchasv/domain";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import {
  addAsset, cancelRun, createClass, disposeAsset, getAsset, itSchedule, listAssets, listClasses, listRuns, postDepreciation, previewDepreciation,
  saveBlockOpening, updateClass,
} from "../services/assets.js";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Money = z.union([z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_amount"), z.number().nonnegative()]).transform(String);
const Pct = z.union([z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_pct"), z.number().min(0).max(100)]).transform(String);
const Years = z.union([z.string().regex(/^\d{1,3}(\.\d{1,2})?$/, "invalid_life"), z.number().positive()]).transform(String);
const IdParam = z.object({ id: z.uuid() });
const Fy = z.string().regex(/^\d{4}-\d{2}$/, "invalid_fy");

export async function assetRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const actor = (auth: { tenantId: string; user: { id: string } }, ip: string) => ({ tenantId: auth.tenantId, userId: auth.user.id, ip });
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant>[2]>[0], a: ReturnType<typeof actor>) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, actor(auth, req.ip)));
  };

  app.get("/assets/presets", { preHandler: can("assets.view") }, async () => ASSET_CLASS_PRESETS);
  app.get("/assets/classes", { preHandler: can("assets.view") }, async (req) => run(req, (tx) => listClasses(tx)));
  app.post("/assets/classes", { preHandler: can("assets.edit") }, async (req, reply) => {
    const body = z.object({
      preset: z.string().max(40).optional(), name: z.string().trim().min(2).max(60).optional(), nameHi: z.string().trim().max(60).nullish(),
      method: z.enum(["slm", "wdv"]).optional(), lifeYears: Years.optional(), residualPct: Pct.optional(), itBlock: z.string().trim().min(2).max(30).optional(), itRate: Pct.optional(),
    }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => createClass(tx, a, body)));
  });
  app.patch("/assets/classes/:id", { preHandler: can("assets.edit") }, async (req) => {
    const body = z.object({ method: z.enum(["slm", "wdv"]).optional(), lifeYears: Years.optional(), residualPct: Pct.optional(), itRate: Pct.optional(), archived: z.boolean().optional() }).parse(req.body);
    return run(req, (tx, a) => updateClass(tx, a, IdParam.parse(req.params).id, body));
  });

  app.get("/assets", { preHandler: can("assets.view") }, async (req) => run(req, (tx) => listAssets(tx)));
  app.get("/assets/:id", { preHandler: can("assets.view") }, async (req) => run(req, (tx) => getAsset(tx, IdParam.parse(req.params).id)));
  app.post("/assets", { preHandler: can("assets.create") }, async (req, reply) => {
    const body = z.object({
      classId: z.uuid(), name: z.string().trim().min(2).max(120), purchaseDate: IsoDate, putToUseOn: IsoDate.optional(), cost: Money,
      acquisition: z.enum(["supplier", "paid", "opening"]), accountId: z.uuid().optional(), gstRate: Pct.optional(), supplierGstin: z.string().length(15).optional(),
      openingAccumulated: Money.optional(), location: z.string().max(80).optional(), serialNo: z.string().max(60).optional(), custodianId: z.uuid().optional(),
      invoiceRef: z.string().max(40).optional(), notes: z.string().max(500).optional(),
    }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => addAsset(tx, a, body)));
  });
  app.post("/assets/:id/dispose", { preHandler: can("assets.submit") }, async (req) => {
    const body = z.object({
      date: IsoDate, saleValue: Money, accountId: z.uuid().optional(), gstRate: Pct.optional(), buyerStateCode: z.string().regex(/^\d{2}$/).optional(), notes: z.string().max(300).optional(),
    }).parse(req.body);
    return run(req, (tx, a) => disposeAsset(tx, a, IdParam.parse(req.params).id, body));
  });

  app.get("/assets/depreciation/runs", { preHandler: can("assets.view") }, async (req) => run(req, async (tx) => (await listRuns(tx)).map((r) => ({ ...r.r, number: r.number, assets: r.assets }))));
  app.get("/assets/depreciation/preview", { preHandler: can("assets.view") }, async (req) => {
    const q = z.object({ from: IsoDate, to: IsoDate }).parse(req.query);
    return run(req, (tx) => previewDepreciation(tx, q.from, q.to));
  });
  app.post("/assets/depreciation", { preHandler: can("assets.submit") }, async (req, reply) => {
    const body = z.object({ from: IsoDate, to: IsoDate }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => postDepreciation(tx, a, body.from, body.to)));
  });
  app.post("/assets/depreciation/runs/:id/cancel", { preHandler: can("assets.cancel") }, async (req) => {
    const { reason } = z.object({ reason: z.string().trim().min(3).max(300) }).parse(req.body);
    await run(req, (tx, a) => cancelRun(tx, a, IdParam.parse(req.params).id, reason));
    return { ok: true };
  });

  app.get("/assets/income-tax", { preHandler: can("assets.view") }, async (req) => {
    const { fy } = z.object({ fy: Fy }).parse(req.query);
    return run(req, (tx) => itSchedule(tx, fy));
  });
  app.put("/assets/income-tax/openings", { preHandler: can("assets.edit") }, async (req) => {
    const body = z.object({ fy: Fy, block: z.string().trim().min(2).max(30), rate: Pct, openingWdv: Money }).parse(req.body);
    await run(req, (tx, a) => saveBlockOpening(tx, a, body));
    return { ok: true };
  });
}
