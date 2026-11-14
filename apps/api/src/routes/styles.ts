import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { GST_SLABS, STYLE_ATTRIBUTES, checkHsn } from "@varchasv/domain";
import { withTenant, type Db } from "@varchasv/db";
import { badRequest } from "../lib/errors.js";
import { parsePatch } from "../lib/patch.js";
import { can, requireTenant } from "../plugins/auth.js";
import { setItemUnits } from "../services/inventory.js";
import { addVariants, createPack, createStyle, getStyle, listColors, listScales, listStyles, saveColor, saveScale, updateStyle } from "../services/styles.js";

const Rate = z.union([z.string().regex(/^\d+(\.\d{1,4})?$/, "invalid_rate"), z.number().nonnegative()]).transform(String);
const Opt = (n: number) => z.string().trim().max(n).nullish().transform((v) => (v ? v : null));
const IdParam = z.object({ id: z.uuid() });

const StyleBody = z.object({
  code: z.string().trim().min(1).max(30), name: z.string().trim().min(1).max(120), nameHi: Opt(120),
  brand: Opt(60), category: Opt(60), season: Opt(40), collection: Opt(60), hsn: Opt(8),
  gstRate: z.union([z.string(), z.number()]).transform(String).optional(), gstSlab: z.enum(GST_SLABS).nullish(),
  uomId: z.uuid(), purchaseRate: Rate.optional(), saleRate: Rate.optional(), mrp: Rate.nullish(),
  sizeScaleId: z.uuid().nullish(), fits: z.array(z.string().trim().min(1).max(20)).max(10).nullish(), imageFileId: z.uuid().nullish(),
  // Descriptive values from the attribute lists; an empty value clears one.
  attributes: z.partialRecord(z.enum(STYLE_ATTRIBUTES), z.string().trim().max(60)).optional().transform((a) => a && Object.fromEntries(Object.entries(a).filter(([, v]) => v))),
});
const Variants = z.object({
  colorIds: z.array(z.uuid()).min(1).max(60), sizes: z.array(z.string().trim().min(1).max(20)).min(1).max(40),
  fits: z.array(z.string().trim().min(1).max(20)).max(10).nullish().transform((v) => v ?? undefined),
  sizePrices: z.record(z.string(), z.object({ saleRate: Rate.optional(), purchaseRate: Rate.optional(), mrp: Rate.optional() })).optional(),
});

export async function styleRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const actor = (auth: { tenantId: string; user: { id: string } }, ip: string) => ({ tenantId: auth.tenantId, userId: auth.user.id, ip });
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant>[2]>[0], a: ReturnType<typeof actor>) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, actor(auth, req.ip)));
  };

  // ---- size scales and colours ----------------------------------------------------------------------
  app.get("/size-scales", { preHandler: can("inventory.view") }, async (req) => run(req, (tx) => listScales(tx)));
  const Scale = z.object({ name: z.string().trim().min(1).max(60), sizes: z.array(z.string().trim().min(1).max(20)).min(1).max(60), archived: z.boolean().optional() });
  app.post("/size-scales", { preHandler: can("inventory.create") }, async (req, reply) => reply.code(201).send(await run(req, (tx, a) => saveScale(tx, a, Scale.parse(req.body)))));
  app.patch("/size-scales/:id", { preHandler: can("inventory.edit") }, async (req) => run(req, (tx, a) => saveScale(tx, a, { ...Scale.parse(req.body), id: IdParam.parse(req.params).id })));

  app.get("/colors", { preHandler: can("inventory.view") }, async (req) => run(req, (tx) => listColors(tx)));
  const Color = z.object({ name: z.string().trim().min(1).max(40), code: z.string().trim().max(8).optional(), hex: z.string().regex(/^#[0-9a-fA-F]{6}$/).nullish(), archived: z.boolean().optional() });
  app.post("/colors", { preHandler: can("inventory.create") }, async (req, reply) => reply.code(201).send(await run(req, (tx, a) => saveColor(tx, a, Color.parse(req.body)))));
  app.patch("/colors/:id", { preHandler: can("inventory.edit") }, async (req) => run(req, (tx, a) => saveColor(tx, a, { ...Color.parse(req.body), id: IdParam.parse(req.params).id })));

  // ---- styles ---------------------------------------------------------------------------------------
  app.get("/styles", { preHandler: can("inventory.view") }, async (req) => {
    const q = z.object({
      search: z.string().max(60).optional(), season: z.string().max(40).optional(), brand: z.string().max(60).optional(), category: z.string().max(60).optional(),
      // "fabric:Cotton": styles whose attribute has that value.
      attr: z.string().max(80).regex(/^[A-Za-z0-9]+:.+$/).refine((v) => (STYLE_ATTRIBUTES as readonly string[]).includes(v.split(":")[0]!), "invalid_attribute").optional(),
    }).parse(req.query);
    return run(req, (tx) => listStyles(tx, q));
  });
  app.get("/styles/:id", { preHandler: can("inventory.view") }, async (req) => {
    const { warehouseId } = z.object({ warehouseId: z.uuid().optional() }).parse(req.query);
    return run(req, (tx) => getStyle(tx, IdParam.parse(req.params).id, warehouseId));
  });
  app.post("/styles", { preHandler: can("inventory.create") }, async (req, reply) => {
    const body = StyleBody.extend(Variants.shape).parse(req.body);
    if (body.hsn && checkHsn(body.hsn, "goods")) throw badRequest("invalid_hsn");
    return reply.code(201).send(await run(req, (tx, a) => createStyle(tx, a, body)));
  });
  app.patch("/styles/:id", { preHandler: can("inventory.edit") }, async (req) => {
    const body = parsePatch(StyleBody.partial().extend({ archived: z.boolean().optional(), applyPrices: z.boolean().optional() }), req.body);
    if (body.hsn && checkHsn(body.hsn, "goods")) throw badRequest("invalid_hsn");
    return run(req, (tx, a) => updateStyle(tx, a, IdParam.parse(req.params).id, body));
  });
  app.post("/styles/:id/variants", { preHandler: can("inventory.create") }, async (req, reply) =>
    reply.code(201).send(await run(req, (tx, a) => addVariants(tx, a, IdParam.parse(req.params).id, Variants.parse(req.body)))));
  /** Other units for every single-piece variant of a style (buy in dozens, sell in pieces). */
  app.put("/styles/:id/units", { preHandler: can("inventory.edit") }, async (req) => {
    const body = z.object({ units: z.array(z.object({ uomId: z.uuid(), factor: Rate })).max(10) }).parse(req.body);
    return run(req, async (tx, a) => {
      const style = await getStyle(tx, IdParam.parse(req.params).id);
      if (!style.variants.length) return [];
      return setItemUnits(tx, a.tenantId, style.variants.map((v) => v.id), body.units);
    });
  });
  app.post("/styles/:id/packs", { preHandler: can("inventory.create") }, async (req, reply) => {
    const body = z.object({
      colorId: z.uuid(), ratio: z.record(z.string(), z.number().int().min(0).max(100)), fit: z.string().max(20).nullish(),
      asOnePiece: z.boolean().optional(), saleRate: Rate.optional(),
    }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => createPack(tx, a, IdParam.parse(req.params).id, body)));
  });
}
