import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { attachBoxes, createPackingBox, detachBox, packingList, getPackingBox, listPackingBoxes, listPackingBoxCompanies, reopenBox, repackBox } from "../services/packingboxes.js";

const IdParam = z.object({ id: z.uuid() });
const Company = z.object({ companyId: z.uuid().optional() });
const Qty = z.union([
  z.string().regex(/^\d+(\.\d{1,4})?$/, "invalid_qty"),
  z.number().nonnegative(),
]).transform(String);

/** Numbered box records for packing and unpacking. These routes never post stock or accounting rows. */
export async function packingBoxRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant>[2]>[0], actor: { tenantId: string; userId: string; ip: string }) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }));
  };

  app.get("/packing-boxes", { preHandler: can("inventory.view") }, async (req) => {
    const { companyId } = Company.parse(req.query);
    return run(req, (tx) => listPackingBoxes(tx, companyId));
  });

  app.get("/packing-boxes/companies", { preHandler: can("inventory.view") }, async (req) =>
    run(req, (tx) => listPackingBoxCompanies(tx)));

  app.get("/packing-boxes/:id", { preHandler: can("inventory.view") }, async (req) => {
    const { companyId } = Company.parse(req.query);
    return run(req, (tx) => getPackingBox(tx, IdParam.parse(req.params).id, companyId));
  });

  app.post("/packing-boxes", { preHandler: can("inventory.create") }, async (req, reply) => {
    const { companyId } = Company.parse(req.body ?? {});
    return reply.code(201).send(await run(req, (tx, actor) => createPackingBox(tx, actor, companyId)));
  });

  app.post("/packing-boxes/:id/repack", { preHandler: can("inventory.edit") }, async (req) => {
    const body = Company.extend({
      lines: z.array(z.object({ itemId: z.uuid(), qty: Qty })).min(1).max(500),
      reason: z.string().trim().max(300).optional(),
    }).parse(req.body);
    return run(req, (tx, actor) => repackBox(tx, actor, IdParam.parse(req.params).id, body));
  });

  app.post("/packing-boxes/:id/reopen", { preHandler: can("inventory.edit") }, async (req) => {
    const body = Company.extend({ reason: z.string().trim().min(3).max(300) }).parse(req.body);
    return run(req, (tx, actor) => reopenBox(tx, actor, IdParam.parse(req.params).id, body));
  });

  // The packing list of a delivery challan: cartons travelling with it, checked item by item against the challan.
  app.get("/delivery-notes/:id/packing-list", { preHandler: can("inventory.view") }, async (req) => run(req, (tx) => packingList(tx, IdParam.parse(req.params).id)));
  app.post("/delivery-notes/:id/packing-list", { preHandler: can("inventory.edit") }, async (req) => {
    const body = z.object({ boxIds: z.array(z.uuid()).min(1).max(100) }).parse(req.body);
    return run(req, (tx, actor) => attachBoxes(tx, actor, IdParam.parse(req.params).id, body.boxIds));
  });
  app.post("/delivery-notes/:id/packing-list/:boxId/remove", { preHandler: can("inventory.edit") }, async (req) => {
    const p = z.object({ id: z.uuid(), boxId: z.uuid() }).parse(req.params);
    return run(req, (tx, actor) => detachBox(tx, actor, p.id, p.boxId));
  });
}
