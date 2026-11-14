import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { LOOKUP_KINDS, LOOKUP_KIND_NAMES, type Permission } from "@varchasv/domain";
import { withTenant, type Db } from "@varchasv/db";
import { forbidden } from "../lib/errors.js";
import { canAny, requireTenant } from "../plugins/auth.js";
import { listLookups, lookupCounts, saveLookup } from "../services/lookups.js";

const Kind = z.object({ kind: z.enum(LOOKUP_KIND_NAMES as [string, ...string[]]) });
const KindId = Kind.extend({ id: z.uuid() });
const Day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullish();
const Body = z.object({
  name: z.string().trim().min(1).max(80), code: z.string().trim().max(12).nullish(), note: z.string().trim().max(300).nullish(),
  startsOn: Day, endsOn: Day, archived: z.boolean().optional(),
});

/** The small masters (brand, fabric, region, return reasons...): one set of routes for every list. */
export async function lookupRoutes(app: FastifyInstance, { db }: { db: Db }) {
  // Each list belongs to a module; the guard admits anyone who may see either, the handler checks the list's own.
  const need = (req: Parameters<typeof requireTenant>[0], kind: string, action: "view" | "create" | "edit") => {
    const auth = requireTenant(req);
    if (!auth.permissions.has(`${LOOKUP_KINDS[kind as keyof typeof LOOKUP_KINDS]}.${action}` as Permission)) throw forbidden("missing_permission");
    return auth;
  };

  app.get("/lookups", { preHandler: canAny("sales.view", "inventory.view", "hr.view") }, async (req) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => lookupCounts(tx));
  });
  app.get("/lookups/:kind", { preHandler: canAny("sales.view", "inventory.view", "hr.view") }, async (req) => {
    const { kind } = Kind.parse(req.params);
    const { all } = z.object({ all: z.enum(["1", "0"]).optional() }).parse(req.query);
    const auth = need(req, kind, "view");
    return withTenant(db, auth.tenantId, (tx) => listLookups(tx, kind as keyof typeof LOOKUP_KINDS, all === "1"));
  });
  app.post("/lookups/:kind", { preHandler: canAny("sales.create", "inventory.create", "hr.create") }, async (req, reply) => {
    const { kind } = Kind.parse(req.params);
    const auth = need(req, kind, "create");
    const body = Body.parse(req.body);
    const row = await withTenant(db, auth.tenantId, (tx) => saveLookup(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }, kind as keyof typeof LOOKUP_KINDS, body));
    return reply.code(201).send(row);
  });
  app.patch("/lookups/:kind/:id", { preHandler: canAny("sales.edit", "inventory.edit", "hr.edit") }, async (req) => {
    const { kind, id } = KindId.parse(req.params);
    const auth = need(req, kind, "edit");
    const body = Body.partial().extend({ name: Body.shape.name }).parse(req.body);
    return withTenant(db, auth.tenantId, (tx) => saveLookup(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }, kind as keyof typeof LOOKUP_KINDS, { ...body, id }));
  });
}
