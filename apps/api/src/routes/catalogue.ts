import { sql } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { env } from "../env.js";
import { notFound } from "../lib/errors.js";
import { hashToken } from "../lib/session.js";
import { can, canAny, requireTenant } from "../plugins/auth.js";
import {
  IMAGE_VIEWS, addStyleImage, catalogue, deleteSelection, getSelection, listSelections, listStyleImages, publicImage, publicSelection,
  saveSelection, sendSelection, shareSelection, stopSharing, updateStyleImage,
} from "../services/catalogue.js";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Rate = z.string().regex(/^\d+(\.\d{1,2})?$/, "invalid_rate");
const IdParam = z.object({ id: z.uuid() });
/** A query value given once (?brand=A) or many times (?brand=A&brand=B). */
const Many = z.union([z.string(), z.array(z.string())]).transform((v) => (Array.isArray(v) ? v : [v]).map((x) => x.trim()).filter(Boolean)).optional();
const Flag = z.enum(["true", "false"]).transform((v) => v === "true").optional();
const Selection = z.object({
  name: z.string().trim().min(1).max(80), partyId: z.uuid().nullish(),
  lines: z.array(z.object({ styleId: z.uuid(), color: z.string().trim().max(40).nullish() })).min(1).max(300),
  showPrices: z.boolean().optional(), showStock: z.boolean().optional(),
});
const Token = z.object({ token: z.string().min(20).max(64).regex(/^[A-Za-z0-9_-]+$/) });

/** Style photos, the image catalogue, saved selections and the links that share them. */
export async function catalogueRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant>[2]>[0], a: { tenantId: string; userId: string; ip: string }) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }));
  };

  app.get("/styles/:id/images", { preHandler: canAny("inventory.view", "sales.view") }, async (req) => run(req, (tx) => listStyleImages(tx, IdParam.parse(req.params).id)));
  app.post("/styles/:id/images", { preHandler: can("inventory.edit") }, async (req, reply) => {
    const body = z.object({ fileId: z.uuid(), thumbFileId: z.uuid(), color: z.string().trim().max(40).nullish(), view: z.enum(IMAGE_VIEWS).optional() }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => addStyleImage(tx, a, IdParam.parse(req.params).id, body)));
  });
  app.patch("/style-images/:id", { preHandler: can("inventory.edit") }, async (req) => {
    const body = z.object({ view: z.enum(IMAGE_VIEWS).optional(), first: z.boolean().optional(), archived: z.boolean().optional() }).parse(req.body);
    return run(req, (tx, a) => updateStyleImage(tx, a, IdParam.parse(req.params).id, body));
  });

  app.get("/catalogue", { preHandler: canAny("inventory.view", "sales.view") }, async (req) => {
    const q = z.object({
      q: z.string().trim().max(60).optional(), brand: Many, category: Many, season: Many, color: Many,
      minRate: Rate.optional(), maxRate: Rate.optional(), inStock: Flag, withImage: Flag,
      receivedFrom: IsoDate.optional(), receivedTo: IsoDate.optional(), soldFrom: IsoDate.optional(), soldTo: IsoDate.optional(),
      partyId: z.uuid().optional(), sort: z.enum(["newest", "best", "price_low", "price_high", "stock", "code"]).optional(),
      limit: z.coerce.number().int().min(1).max(200).optional(), offset: z.coerce.number().int().min(0).optional(),
    }).parse(req.query);
    return run(req, (tx) => catalogue(tx, { ...q, brands: q.brand, categories: q.category, seasons: q.season, colors: q.color }));
  });

  app.get("/catalogue/selections", { preHandler: canAny("inventory.view", "sales.view") }, async (req) => run(req, (tx) => listSelections(tx)));
  app.get("/catalogue/selections/:id", { preHandler: canAny("inventory.view", "sales.view") }, async (req) => run(req, (tx) => getSelection(tx, IdParam.parse(req.params).id)));
  app.post("/catalogue/selections", { preHandler: can("sales.create") }, async (req, reply) => reply.code(201).send(await run(req, (tx, a) => saveSelection(tx, a, Selection.parse(req.body)))));
  app.put("/catalogue/selections/:id", { preHandler: can("sales.create") }, async (req) => run(req, (tx, a) => saveSelection(tx, a, Selection.parse(req.body), IdParam.parse(req.params).id)));
  app.delete("/catalogue/selections/:id", { preHandler: can("sales.create") }, async (req) => {
    await run(req, (tx, a) => deleteSelection(tx, a, IdParam.parse(req.params).id));
    return { ok: true };
  });
  app.post("/catalogue/selections/:id/share", { preHandler: can("sales.create") }, async (req) => {
    const { days } = z.object({ days: z.number().int().min(1).max(90).default(30) }).parse(req.body ?? {});
    return run(req, (tx, a) => shareSelection(tx, a, IdParam.parse(req.params).id, days, env.WEB_ORIGIN));
  });
  app.delete("/catalogue/selections/:id/share", { preHandler: can("sales.create") }, async (req) => {
    await run(req, (tx, a) => stopSharing(tx, a, IdParam.parse(req.params).id));
    return { ok: true };
  });
  app.post("/catalogue/selections/:id/send", { preHandler: can("sales.create") }, async (req) => {
    const body = z.object({ url: z.string().url().max(300), phone: z.string().trim().max(20).optional() }).parse(req.body);
    return run(req, (tx, a) => sendSelection(tx, a, IdParam.parse(req.params).id, body));
  });

  // ---- public: a shared link works without signing in until it expires ---------------------------------
  const shared = async (token: string) => {
    const rows = await db.execute<{ tenant_id: string; selection_id: string }>(sql`select * from catalogue_share_by_token(${hashToken(token)})`);
    if (!rows[0]) throw notFound("link_expired");
    return rows[0];
  };
  const limit = { config: { rateLimit: { max: 120, timeWindow: "1 minute" } } };
  app.get("/public/catalogue/:token", limit, async (req) => {
    const s = await shared(Token.parse(req.params).token);
    return withTenant(db, s.tenant_id, (tx) => publicSelection(tx, s.selection_id));
  });
  app.get("/public/catalogue/:token/files/:fileId", limit, async (req, reply) => {
    const p = Token.extend({ fileId: z.uuid() }).parse(req.params);
    const s = await shared(p.token);
    const f = await withTenant(db, s.tenant_id, (tx) => publicImage(tx, s.selection_id, p.fileId));
    return reply.header("content-type", f.contentType).header("cache-control", "public, max-age=86400").send(f.data);
  });
}
