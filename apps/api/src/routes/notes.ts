import { and, desc, eq, isNull, sql } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { tables, withTenant, type Db } from "@varchasv/db";
import { notFound } from "../lib/errors.js";
import { requireTenant } from "../plugins/auth.js";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date");
const Body = z.object({ body: z.string().trim().min(1).max(500), dueOn: IsoDate.nullish(), done: z.boolean().optional() });

/**
 * A person's own notes and reminders for the home screen. Private to the signed-in user: every query is
 * restricted to their own id, and signing in is all it needs (no module right, as they hold nothing but their own words).
 */
export async function noteRoutes(app: FastifyInstance, { db }: { db: Db }) {
  const n = tables.userNotes;
  const own = (userId: string) => eq(n.userId, userId);

  app.get("/notes", async (req) => {
    const a = requireTenant(req);
    const { done } = z.object({ done: z.enum(["1", "0"]).optional() }).parse(req.query);
    return withTenant(db, a.tenantId, (tx) => tx.select().from(n)
      .where(and(own(a.user.id), done === "1" ? undefined : isNull(n.doneAt)))
      // Dated ones first, soonest first, then the undated, newest first.
      .orderBy(sql`${n.dueOn} asc nulls last`, desc(n.createdAt)).limit(200));
  });
  app.post("/notes", async (req, reply) => {
    const a = requireTenant(req);
    const body = Body.parse(req.body);
    const [row] = await withTenant(db, a.tenantId, (tx) => tx.insert(n).values({ tenantId: a.tenantId, userId: a.user.id, body: body.body, dueOn: body.dueOn ?? null }).returning());
    return reply.code(201).send(row);
  });
  app.patch("/notes/:id", async (req) => {
    const a = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = Body.partial().parse(req.body);
    const [row] = await withTenant(db, a.tenantId, (tx) => tx.update(n).set({
      ...(body.body !== undefined ? { body: body.body } : {}), ...(body.dueOn !== undefined ? { dueOn: body.dueOn } : {}),
      ...(body.done !== undefined ? { doneAt: body.done ? new Date() : null } : {}),
    }).where(and(eq(n.id, id), own(a.user.id))).returning());
    if (!row) throw notFound();
    return row;
  });
  app.delete("/notes/:id", async (req) => {
    const a = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const rows = await withTenant(db, a.tenantId, (tx) => tx.delete(n).where(and(eq(n.id, id), own(a.user.id))).returning({ id: n.id }));
    if (!rows.length) throw notFound();
    return { ok: true };
  });
}
