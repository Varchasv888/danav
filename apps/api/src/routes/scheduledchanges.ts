import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { ALL_PERMISSIONS } from "@varchasv/domain";
import { can, requireTenant } from "../plugins/auth.js";
import { SCHEDULABLE, cancelScheduledChange, listScheduledChanges, scheduleChange } from "../services/scheduledchanges.js";

const Entity = z.enum(["item", "account", "role", "number_series"]);

/** Changes dated ahead: a GST rate, a price or credit terms that start on a chosen day, and the history of those that did. */
export async function scheduledChangeRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const gate = (entity: z.infer<typeof Entity>) => (entity === "item" ? "inventory.edit" : entity === "role" ? "users.edit" : entity === "number_series" ? "settings.edit" : "accounts.edit");
  app.get("/config/fields", { preHandler: can("settings.view") }, async () => SCHEDULABLE);
  app.get("/config/changes", { preHandler: can("settings.view") }, async (req) => {
    const auth = requireTenant(req);
    const q = z.object({ entity: Entity.optional(), entityId: z.uuid().optional() }).parse(req.query);
    return withTenant(db, auth.tenantId, (tx) => listScheduledChanges(tx, q));
  });
  app.post("/config/changes", { preHandler: can("settings.view") }, async (req, reply) => {
    const auth = requireTenant(req);
    const body = z.object({
      entity: Entity, entityId: z.uuid(), field: z.string().max(20), value: z.string().max(4000).nullable(),
      effectiveFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date"), note: z.string().trim().max(200).nullish(),
    }).parse(req.body);
    if (!auth.permissions.has(gate(body.entity))) return reply.code(403).send({ error: "forbidden" });
    // Nobody can hand out, even for a later day, permissions they do not hold themselves.
    if (body.entity === "role" && body.value) {
      let list: unknown = null;
      try { list = JSON.parse(body.value); } catch { /* the service reports a bad value */ }
      if (Array.isArray(list) && list.some((p) => typeof p === "string" && (ALL_PERMISSIONS as string[]).includes(p) && !auth.permissions.has(p))) return reply.code(403).send({ error: "permission_escalation" });
    }
    const row = await withTenant(db, auth.tenantId, (tx) => scheduleChange(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }, body));
    return reply.code(201).send(row);
  });
  app.post("/config/changes/:id/cancel", { preHandler: can("settings.view") }, async (req, reply) => {
    const auth = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    if (!["inventory.edit", "accounts.edit", "users.edit", "settings.edit"].some((p) => auth.permissions.has(p))) return reply.code(403).send({ error: "forbidden" });
    await withTenant(db, auth.tenantId, (tx) => cancelScheduledChange(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }, id));
    return { ok: true };
  });
}
