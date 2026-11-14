import { and, asc, desc, eq, inArray, isNull, or, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { badRequest, notFound } from "../lib/errors.js";

const LIMIT = 200;

/** The other active people in the business, with how many of their messages you have not read and the latest one. */
export async function chatPeople(tx: Tx, me: string) {
  const people = await tx.select({ userId: tables.users.id, name: tables.users.name, role: tables.roles.name })
    .from(tables.memberships).innerJoin(tables.users, eq(tables.users.id, tables.memberships.userId)).innerJoin(tables.roles, eq(tables.roles.id, tables.memberships.roleId))
    .where(eq(tables.memberships.status, "active")).orderBy(asc(tables.users.name));
  const unread = await tx.select({ from: tables.chatMessages.fromUserId, n: sql<number>`count(*)::int` }).from(tables.chatMessages)
    .where(and(eq(tables.chatMessages.toUserId, me), isNull(tables.chatMessages.readAt))).groupBy(tables.chatMessages.fromUserId);
  const last = await tx.select({ a: tables.chatMessages.fromUserId, b: tables.chatMessages.toUserId, at: sql<string>`max(${tables.chatMessages.createdAt})::text` }).from(tables.chatMessages)
    .where(or(eq(tables.chatMessages.fromUserId, me), eq(tables.chatMessages.toUserId, me))).groupBy(tables.chatMessages.fromUserId, tables.chatMessages.toUserId);
  return people.filter((p) => p.userId !== me).map((p) => ({
    ...p, unread: unread.find((u) => u.from === p.userId)?.n ?? 0,
    lastAt: last.filter((l) => l.a === p.userId || l.b === p.userId).map((l) => l.at).sort().pop() ?? null,
  })).sort((x, y) => (y.lastAt ?? "").localeCompare(x.lastAt ?? "") || x.name.localeCompare(y.name));
}

export async function unreadCount(tx: Tx, me: string) {
  const [r] = await tx.select({ n: sql<number>`count(*)::int` }).from(tables.chatMessages).where(and(eq(tables.chatMessages.toUserId, me), isNull(tables.chatMessages.readAt)));
  return { unread: r!.n };
}

async function assertMember(tx: Tx, userId: string) {
  const [m] = await tx.select({ id: tables.memberships.id }).from(tables.memberships).where(and(eq(tables.memberships.userId, userId), eq(tables.memberships.status, "active")));
  if (!m) throw notFound();
}

/** The conversation with one person, oldest first; what they sent you is marked read. `after` returns only newer messages. */
export async function thread(tx: Tx, me: string, other: string, after?: string) {
  await assertMember(tx, other);
  const pair = or(and(eq(tables.chatMessages.fromUserId, me), eq(tables.chatMessages.toUserId, other)), and(eq(tables.chatMessages.fromUserId, other), eq(tables.chatMessages.toUserId, me)));
  const rows = await tx.select().from(tables.chatMessages).where(and(pair, after ? sql`date_trunc('milliseconds', ${tables.chatMessages.createdAt}) > ${new Date(after).toISOString()}::timestamptz` : undefined)).orderBy(desc(tables.chatMessages.createdAt)).limit(LIMIT);
  const unread = rows.filter((r) => r.toUserId === me && !r.readAt).map((r) => r.id);
  if (unread.length) await tx.update(tables.chatMessages).set({ readAt: new Date() }).where(inArray(tables.chatMessages.id, unread));
  return rows.reverse().map((r) => ({ id: r.id, mine: r.fromUserId === me, body: r.body, at: r.createdAt }));
}

export async function sendMessage(tx: Tx, tenantId: string, me: string, other: string, body: string) {
  if (other === me) throw badRequest("cannot_message_self");
  const text = body.trim();
  if (!text) throw badRequest("empty_message");
  await assertMember(tx, other);
  const [row] = await tx.insert(tables.chatMessages).values({ tenantId, fromUserId: me, toUserId: other, body: text }).returning();
  return { id: row!.id, mine: true, body: row!.body, at: row!.createdAt };
}
