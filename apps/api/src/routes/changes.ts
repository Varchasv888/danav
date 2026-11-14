import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { approvalSettings, decideChange, listChangeRequests, setApprovalSettings } from "../services/changes.js";

/** Changes that wait for a second person: the switch, the queue, and the decision. */
export async function changeRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const who = (req: Parameters<typeof requireTenant>[0]) => { const auth = requireTenant(req); return { auth, actor: { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip } }; };

  app.get("/settings/approvals", { preHandler: can("settings.view") }, async (req) => { const { auth } = who(req); return withTenant(db, auth.tenantId, (tx) => approvalSettings(tx)); });
  app.put("/settings/approvals", { preHandler: can("settings.edit") }, async (req) => {
    const body = z.object({ bankChange: z.boolean() }).parse(req.body);
    const { auth, actor } = who(req);
    return withTenant(db, auth.tenantId, (tx) => setApprovalSettings(tx, actor, body));
  });
  app.get("/change-requests", { preHandler: can("settings.view") }, async (req) => {
    const q = z.object({ status: z.enum(["pending", "approved", "rejected"]).optional() }).parse(req.query);
    const { auth } = who(req);
    return withTenant(db, auth.tenantId, (tx) => listChangeRequests(tx, q.status));
  });
  app.post("/change-requests/:id/decide", { preHandler: can("special.approveBankChange") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = z.object({ decision: z.enum(["approve", "reject"]), note: z.string().trim().max(200).optional() }).parse(req.body);
    const { auth, actor } = who(req);
    return withTenant(db, auth.tenantId, (tx) => decideChange(tx, actor, id, body));
  });
}
