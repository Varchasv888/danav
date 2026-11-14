import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { completeAccessReview, decideMember, journalChecks, listAccessReviews, relatedParties, setRelatedParty, sodConflicts, startAccessReview } from "../services/controls.js";

const Day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");

/** Internal controls: who holds conflicting rights, unusual journals, related-party dealings and the periodic look at who has access. */
export async function controlsRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant<T>>[2]>[0], a: { tenantId: string; userId: string; ip: string }) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }));
  };

  app.get("/controls/sod", { preHandler: can("users.view") }, async (req) => run(req, (tx) => sodConflicts(tx)));
  app.get("/controls/journals", { preHandler: can("reports.view") }, async (req) => {
    const q = z.object({ from: Day, to: Day }).parse(req.query);
    return run(req, (tx) => journalChecks(tx, q.from, q.to));
  });
  app.get("/controls/related-parties", { preHandler: can("reports.view") }, async (req) => {
    const q = z.object({ from: Day, to: Day }).parse(req.query);
    return run(req, (tx) => relatedParties(tx, q.from, q.to));
  });
  app.put("/accounts/:id/related-party", { preHandler: can("accounts.edit") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = z.object({ value: z.boolean() }).parse(req.body);
    await run(req, (tx, a) => setRelatedParty(tx, a, id, body.value));
    return { ok: true };
  });

  app.get("/controls/access-reviews", { preHandler: can("users.view") }, async (req) => run(req, (tx) => listAccessReviews(tx)));
  app.post("/controls/access-reviews", { preHandler: can("users.edit") }, async (req, reply) => reply.code(201).send(await run(req, (tx, a) => startAccessReview(tx, a))));
  app.post("/controls/access-reviews/:id/decide", { preHandler: can("users.edit") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = z.object({ userId: z.uuid(), decision: z.enum(["keep", "change", "remove"]), note: z.string().trim().max(200).nullish() }).parse(req.body);
    await run(req, (tx, a) => decideMember(tx, a, id, body.userId, body.decision, body.note));
    return { ok: true };
  });
  app.post("/controls/access-reviews/:id/complete", { preHandler: can("users.edit") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    await run(req, (tx, a) => completeAccessReview(tx, a, id));
    return { ok: true };
  });
}
