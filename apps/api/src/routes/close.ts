import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { requireStepUp } from "../lib/stepup.js";
import { closeChecklist, closeMonth, dayClose, getSnapshot, removeSignOff, reopenMonth, signOff, signVariance, snapshotsFor } from "../services/close.js";

const Period = z.string().regex(/^\d{4}-\d{2}$/, "invalid_period");
const Note = z.string().trim().min(3).max(200);

/** Closing the books: the daily point-of-sale close, the month-end checklist, and the saved reports. */
export async function closeRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant<T>>[2]>[0], a: { tenantId: string; userId: string; ip: string }) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }));
  };

  app.get("/close/checklist", { preHandler: can("reports.view") }, async (req) => {
    const q = z.object({ period: Period }).parse(req.query);
    return run(req, (tx) => closeChecklist(tx, q.period));
  });
  app.post("/close/signoff", { preHandler: can("accounts.approve") }, async (req) => {
    const body = z.object({ period: Period, key: z.string().max(30), note: Note }).parse(req.body);
    await run(req, (tx, a) => signOff(tx, a, body.period, body.key, body.note));
    return { ok: true };
  });
  app.delete("/close/signoff", { preHandler: can("accounts.approve") }, async (req) => {
    const q = z.object({ period: Period, key: z.string().max(30) }).parse(req.query);
    await run(req, (tx, a) => removeSignOff(tx, a, q.period, q.key));
    return { ok: true };
  });
  app.post("/close/month", { preHandler: can("accounts.approve") }, async (req) => {
    const body = z.object({ period: Period }).parse(req.body);
    return run(req, (tx, a) => closeMonth(tx, a, body.period));
  });
  app.post("/close/reopen", { preHandler: can("accounts.approve") }, async (req) => {
    const body = z.object({ period: Period, reason: Note }).parse(req.body);
    await requireStepUp(db, req);
    await run(req, (tx, a) => reopenMonth(tx, a, body.period, body.reason));
    return { ok: true };
  });
  app.get("/close/snapshots", { preHandler: can("reports.view") }, async (req) => {
    const q = z.object({ period: Period }).parse(req.query);
    return run(req, (tx) => snapshotsFor(tx, q.period));
  });
  app.get("/close/snapshots/:id", { preHandler: can("reports.view") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    return run(req, (tx) => getSnapshot(tx, id));
  });

  app.get("/pos/day-close", { preHandler: can("sales.view") }, async (req) => {
    const q = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date") }).parse(req.query);
    return run(req, (tx) => dayClose(tx, q.date));
  });
  app.post("/pos/sessions/:id/sign-variance", { preHandler: can("sales.approve") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = z.object({ note: Note }).parse(req.body);
    await run(req, (tx, a) => signVariance(tx, a, id, body.note));
    return { ok: true };
  });
}
