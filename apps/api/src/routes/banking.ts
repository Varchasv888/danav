import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import {
  applyBankRules, connectFeed, createFromLine, disconnectFeed, fetchFeed, ignoreLine, importSettlements, importStatement, listBankAccounts, listLines,
  listRules, listSettlements, matchLine, openEntries, reconciliation, saveBankProfile, saveRule, unmatchLine,
} from "../services/banking.js";
import { businessDate } from "@varchasv/domain";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const IdParam = z.object({ id: z.uuid() });
const today = () => businessDate();

export async function bankingRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const actor = (auth: { tenantId: string; user: { id: string } }, ip: string) => ({ tenantId: auth.tenantId, userId: auth.user.id, ip });
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant>[2]>[0], a: ReturnType<typeof actor>) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, actor(auth, req.ip)));
  };
  const ok = { ok: true };

  app.get("/banking/accounts", { preHandler: can("banking.view") }, async (req) => run(req, (tx) => listBankAccounts(tx)));
  app.put("/banking/accounts/:id/profile", { preHandler: can("banking.edit") }, async (req) => {
    const body = z.object({ bankName: z.string().trim().max(80).nullish(), accountLast4: z.string().regex(/^\d{4}$/).nullish(), ifsc: z.string().regex(/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/, "invalid_ifsc").nullish() }).parse(req.body);
    await run(req, (tx, a) => saveBankProfile(tx, a, IdParam.parse(req.params).id, body));
    return ok;
  });
  app.post("/banking/accounts/:id/statements", { preHandler: can("banking.create"), bodyLimit: 10 * 1024 * 1024 }, async (req, reply) => {
    const body = z.object({ fileName: z.string().max(200).optional(), csv: z.string().min(10).max(8_000_000) }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => importStatement(tx, a, { accountId: IdParam.parse(req.params).id, ...body })));
  });
  app.post("/banking/accounts/:id/feed/connect", { preHandler: can("banking.edit") }, async (req) => run(req, (tx, a) => connectFeed(tx, a, IdParam.parse(req.params).id)));
  app.post("/banking/accounts/:id/feed/disconnect", { preHandler: can("banking.edit") }, async (req) => { await run(req, (tx, a) => disconnectFeed(tx, a, IdParam.parse(req.params).id)); return ok; });
  app.post("/banking/accounts/:id/feed/fetch", { preHandler: can("banking.create") }, async (req) => {
    const { to } = z.object({ to: IsoDate.optional() }).parse(req.body ?? {});
    return run(req, (tx, a) => fetchFeed(tx, a, IdParam.parse(req.params).id, to));
  });
  app.get("/banking/accounts/:id/lines", { preHandler: can("banking.view") }, async (req) => {
    const q = z.object({ status: z.enum(["unmatched", "matched", "ignored"]).optional(), from: IsoDate.optional(), to: IsoDate.optional() }).parse(req.query);
    return run(req, (tx) => listLines(tx, IdParam.parse(req.params).id, q));
  });
  app.get("/banking/accounts/:id/open-entries", { preHandler: can("banking.view") }, async (req) => {
    const q = z.object({ from: IsoDate, to: IsoDate }).parse(req.query);
    return run(req, (tx) => openEntries(tx, IdParam.parse(req.params).id, q.from, q.to));
  });
  app.post("/banking/accounts/:id/apply-rules", { preHandler: can("banking.create") }, async (req) => ({ posted: await run(req, (tx, a) => applyBankRules(tx, a, IdParam.parse(req.params).id)) }));
  app.get("/banking/accounts/:id/reconciliation", { preHandler: can("banking.view") }, async (req) => {
    const { asOf } = z.object({ asOf: IsoDate.default(today) }).parse(req.query);
    return run(req, (tx) => reconciliation(tx, IdParam.parse(req.params).id, asOf));
  });

  app.post("/banking/lines/:id/match", { preHandler: can("banking.edit") }, async (req) => {
    const { voucherIds } = z.object({ voucherIds: z.array(z.uuid()).min(1).max(50) }).parse(req.body);
    await run(req, (tx, a) => matchLine(tx, a, IdParam.parse(req.params).id, voucherIds));
    return ok;
  });
  app.post("/banking/lines/:id/unmatch", { preHandler: can("banking.edit") }, async (req) => { await run(req, (tx, a) => unmatchLine(tx, a, IdParam.parse(req.params).id)); return ok; });
  app.post("/banking/lines/:id/ignore", { preHandler: can("banking.edit") }, async (req) => { await run(req, (tx, a) => ignoreLine(tx, a, IdParam.parse(req.params).id)); return ok; });
  app.post("/banking/lines/:id/create", { preHandler: can("banking.create") }, async (req, reply) => {
    const body = z.object({ accountId: z.uuid(), narration: z.string().trim().max(200).optional() }).parse(req.body);
    const v = await run(req, (tx, a) => createFromLine(tx, a, IdParam.parse(req.params).id, body));
    return reply.code(201).send({ id: v.id, number: v.number });
  });

  const Rule = z.object({
    contains: z.string().trim().min(2).max(80), direction: z.enum(["in", "out", "any"]).default("any"), accountId: z.uuid(),
    narration: z.string().trim().max(120).nullish(), priority: z.number().int().min(0).max(1000).optional(), archived: z.boolean().optional(),
  });
  app.get("/banking/rules", { preHandler: can("banking.view") }, async (req) => run(req, async (tx) => (await listRules(tx)).map((r) => ({ ...r.rule, account: r.account }))));
  app.post("/banking/rules", { preHandler: can("banking.edit") }, async (req, reply) => reply.code(201).send(await run(req, (tx, a) => saveRule(tx, a, Rule.parse(req.body)))));
  app.put("/banking/rules/:id", { preHandler: can("banking.edit") }, async (req) => run(req, (tx, a) => saveRule(tx, a, Rule.parse(req.body), IdParam.parse(req.params).id)));

  app.get("/banking/settlements", { preHandler: can("banking.view") }, async (req) => run(req, async (tx) => (await listSettlements(tx)).map((r) => ({ ...r.s, number: r.number, matched: r.matched }))));
  app.post("/banking/settlements", { preHandler: can("banking.create"), bodyLimit: 10 * 1024 * 1024 }, async (req, reply) => {
    const body = z.object({ provider: z.string().trim().min(2).max(20), csv: z.string().min(10).max(8_000_000), bankAccountId: z.uuid(), clearingAccountId: z.uuid() }).parse(req.body);
    return reply.code(201).send(await run(req, (tx, a) => importSettlements(tx, a, body)));
  });
}
