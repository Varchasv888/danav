import type { FastifyInstance } from "fastify";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { businessDate } from "@varchasv/domain";
import { env } from "../env.js";
import { notFound } from "../lib/errors.js";
import { hashToken } from "../lib/session.js";
import { can, requireTenant } from "../plugins/auth.js";
import { listMessages, messageCounts, publicDocument, remindCustomers, sendInvoice } from "../services/sharing.js";

const IdParam = z.object({ id: z.uuid() });
const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Token = z.object({ token: z.string().min(20).max(64).regex(/^[A-Za-z0-9_-]+$/) });

/** Bills, invoices and statements sent on WhatsApp, the links they carry, and the message log. */
export async function sharingRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const run = <T>(req: Parameters<typeof requireTenant>[0], fn: (tx: Parameters<Parameters<typeof withTenant>[2]>[0], a: { tenantId: string; userId: string; ip: string }) => Promise<T>) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => fn(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }));
  };

  app.post("/sales-invoices/:id/send", { preHandler: can("sales.create") }, async (req, reply) => {
    const { phone } = z.object({ phone: z.string().regex(/^[6-9]\d{9}$/, "invalid_phone").optional() }).parse(req.body ?? {});
    return reply.code(201).send(await run(req, (tx, a) => sendInvoice(tx, a, IdParam.parse(req.params).id, env.WEB_ORIGIN, phone)));
  });
  app.post("/reminders/payments", { preHandler: can("crm.create") }, async (req, reply) => {
    const body = z.object({ accountIds: z.array(z.uuid()).min(1).max(500).optional(), overdueOnly: z.boolean().optional(), date: IsoDate.optional() }).parse(req.body ?? {});
    return reply.code(201).send(await run(req, (tx, a) => remindCustomers(tx, a, body, body.date ?? businessDate(), env.WEB_ORIGIN)));
  });
  app.get("/messages", { preHandler: can("crm.view") }, async (req) => {
    const q = z.object({ accountId: z.uuid().optional(), status: z.enum(["sent", "failed"]).optional(), limit: z.coerce.number().int().min(1).max(500).optional() }).parse(req.query);
    return run(req, async (tx) => {
      const today = businessDate();
      return { counts: await messageCounts(tx, `${today.slice(0, 7)}-01`), messages: await listMessages(tx, q) };
    });
  });

  // ---- public: a link sent on WhatsApp opens its document without signing in until it expires ----------
  const limit = { config: { rateLimit: { max: 120, timeWindow: "1 minute" } } };
  app.get("/public/documents/:token", limit, async (req) => {
    const { token } = Token.parse(req.params);
    const rows = await db.execute<{ tenant_id: string; kind: string; doc_id: string }>(sql`select * from shared_document_by_token(${hashToken(token)})`);
    const s = rows[0];
    if (!s) throw notFound("link_expired");
    return withTenant(db, s.tenant_id, (tx) => publicDocument(tx, s.kind, s.doc_id, businessDate()));
  });
}
