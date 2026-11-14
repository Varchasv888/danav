import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { KINDS, REASON_CODES, annotate, closeRun, decideWriteOff, getRun, listRuns, manualMatch, requestWriteOff, startRun, unmatch } from "../services/recon.js";

const Day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Money = z.union([z.string().regex(/^-?\d+(\.\d{1,2})?$/, "invalid_amount"), z.number()]).transform(String);

/** The reconciliation workbench: statements against the ledger, matched by rules, with an exception queue, evidence, owners and approved write-offs. */
export async function reconRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant<T>>[2]>[0], a: { tenantId: string; userId: string; ip: string }) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }));
  };

  app.get("/recon/runs", { preHandler: can("accounts.view") }, async (req) => run(req, (tx) => listRuns(tx)));
  app.get("/recon/runs/:id", { preHandler: can("accounts.view") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    return run(req, (tx) => getRun(tx, id));
  });
  app.post("/recon/runs", { preHandler: can("accounts.create"), bodyLimit: 5 * 1024 * 1024 }, async (req, reply) => {
    const body = z.object({
      kind: z.enum(KINDS), partyId: z.uuid(), from: Day, to: Day, theirClosing: Money.nullish(),
      theirs: z.array(z.object({ ref: z.string().max(60).optional(), date: Day, amount: Money, description: z.string().max(160).optional() })).max(5000),
      rules: z.object({ tolerance: z.string().regex(/^\d+(\.\d{1,2})?$/), dateWindowDays: z.number().int().min(0).max(60), maxGroup: z.number().int().min(2).max(6) }).partial().optional(),
    }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => startRun(tx, a, body)));
  });
  app.post("/recon/runs/:id/match", { preHandler: can("accounts.create") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = z.object({ itemIds: z.array(z.uuid()).min(2).max(50) }).parse(req.body);
    return run(req, (tx, a) => manualMatch(tx, a, id, body.itemIds));
  });
  app.post("/recon/runs/:id/unmatch", { preHandler: can("accounts.create") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = z.object({ groupId: z.uuid() }).parse(req.body);
    await run(req, (tx, a) => unmatch(tx, a, id, body.groupId));
    return { ok: true };
  });
  app.patch("/recon/items/:id", { preHandler: can("accounts.create") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = z.object({ reasonCode: z.enum(REASON_CODES).nullable().optional(), ownerId: z.uuid().nullable().optional(), note: z.string().max(200).nullable().optional(), evidenceFileId: z.uuid().nullable().optional() }).parse(req.body);
    await run(req, (tx, a) => annotate(tx, a, id, body));
    return { ok: true };
  });
  app.post("/recon/runs/:id/writeoffs", { preHandler: can("accounts.create") }, async (req, reply) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = z.object({ itemIds: z.array(z.uuid()).min(1).max(200), reasonCode: z.enum(REASON_CODES), note: z.string().trim().min(3).max(200) }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => requestWriteOff(tx, a, id, body)));
  });
  app.post("/recon/writeoffs/:id/decide", { preHandler: can("accounts.approve") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = z.object({ decision: z.enum(["approve", "reject"]) }).parse(req.body);
    await run(req, (tx, a) => decideWriteOff(tx, a, id, body.decision));
    return { ok: true };
  });
  app.post("/recon/runs/:id/close", { preHandler: can("accounts.approve") }, async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    await run(req, (tx, a) => closeRun(tx, a, id));
    return { ok: true };
  });
}
