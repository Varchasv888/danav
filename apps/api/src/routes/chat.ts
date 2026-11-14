import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { requireTenant } from "../plugins/auth.js";
import { chatPeople, sendMessage, thread, unreadCount } from "../services/chat.js";

const UserParam = z.object({ userId: z.uuid() });

/** Direct messages between people in one business. Every member can chat; a message is seen only by its two people. */
export async function chatRoutes(app: FastifyInstance, { db }: { db: Db }) {
  app.get("/chat/people", async (req) => { const a = requireTenant(req); return withTenant(db, a.tenantId, (tx) => chatPeople(tx, a.user.id)); });
  app.get("/chat/unread", async (req) => { const a = requireTenant(req); return withTenant(db, a.tenantId, (tx) => unreadCount(tx, a.user.id)); });
  app.get("/chat/:userId", async (req) => {
    const a = requireTenant(req);
    const { userId } = UserParam.parse(req.params);
    const q = z.object({ after: z.string().datetime().optional() }).parse(req.query);
    return withTenant(db, a.tenantId, (tx) => thread(tx, a.user.id, userId, q.after));
  });
  app.post("/chat/:userId", async (req, reply) => {
    const a = requireTenant(req);
    const { userId } = UserParam.parse(req.params);
    const { body } = z.object({ body: z.string().max(1000) }).parse(req.body);
    return reply.code(201).send(await withTenant(db, a.tenantId, (tx) => sendMessage(tx, a.tenantId, a.user.id, userId, body)));
  });
}
