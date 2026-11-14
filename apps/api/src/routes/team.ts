import { randomBytes } from "node:crypto";
import { and, asc, desc, eq, inArray, isNull, gt, sql } from "drizzle-orm";
import type { FastifyInstance, FastifyReply } from "fastify";
import { z } from "zod";
import { tables, withTenant, type Db, type Tx } from "@varchasv/db";
import { ALL_PERMISSIONS, isValidStateCode } from "@varchasv/domain";
import { env, secureCookies } from "../env.js";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, forbidden, HttpError, notFound, unauthorized } from "../lib/errors.js";
import type { Mailer } from "../lib/mailer.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import { SESSION_COOKIE, createSession, hashToken } from "../lib/session.js";
import { can, requireTenant } from "../plugins/auth.js";
import { createBusiness } from "../services/onboarding.js";

const INVITE_TTL_DAYS = 7;
const Permissions = z.array(z.enum(ALL_PERMISSIONS as [string, ...string[]])).max(ALL_PERMISSIONS.length);

async function activeOwnerCount(tx: Tx) {
  const [row] = await tx
    .select({ n: sql<number>`count(*)::int` })
    .from(tables.memberships)
    .innerJoin(tables.roles, eq(tables.roles.id, tables.memberships.roleId))
    .where(and(eq(tables.roles.key, "owner"), eq(tables.memberships.status, "active")));
  return row?.n ?? 0;
}

export async function teamRoutes(app: FastifyInstance, { db, mailer }: { db: Db; mailer: Mailer }) {
  const setCookie = (reply: FastifyReply, token: string, expires: Date) =>
    reply.setCookie(SESSION_COOKIE, token, { path: "/", httpOnly: true, sameSite: "lax", secure: secureCookies, expires });

  // ---- members -------------------------------------------------------------------------------

  app.get("/members", { preHandler: can("users.view") }, async (req) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, async (tx) => {
      const rows = await tx
        .select({
          id: tables.memberships.id, status: tables.memberships.status, joinedAt: tables.memberships.createdAt,
          userId: tables.users.id, name: tables.users.name, email: tables.users.email,
          roleId: tables.roles.id, roleKey: tables.roles.key, roleName: tables.roles.name, warehouseScope: tables.memberships.warehouseScope,
        })
        .from(tables.memberships)
        .innerJoin(tables.users, eq(tables.users.id, tables.memberships.userId))
        .innerJoin(tables.roles, eq(tables.roles.id, tables.memberships.roleId))
        .orderBy(asc(tables.memberships.createdAt));
      return rows.map((r) => ({ ...r, isYou: r.userId === auth.user.id }));
    });
  });

  app.patch("/members/:id", { preHandler: can("users.edit") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = z.object({ roleId: z.uuid().optional(), status: z.enum(["active", "suspended"]).optional(), warehouseScope: z.array(z.uuid()).max(100).nullable().optional() }).parse(req.body);
    return withTenant(db, auth.tenantId, async (tx) => {
      const [m] = await tx
        .select({ id: tables.memberships.id, userId: tables.memberships.userId, roleId: tables.memberships.roleId, status: tables.memberships.status, roleKey: tables.roles.key })
        .from(tables.memberships)
        .innerJoin(tables.roles, eq(tables.roles.id, tables.memberships.roleId))
        .where(eq(tables.memberships.id, id))
        .for("update");
      if (!m) throw notFound();
      if (m.userId === auth.user.id) throw forbidden("cannot_change_self");
      let newRoleKey = m.roleKey;
      if (body.roleId && body.roleId !== m.roleId) {
        const [role] = await tx.select().from(tables.roles).where(eq(tables.roles.id, body.roleId));
        if (!role) throw badRequest("unknown_role");
        newRoleKey = role.key;
      }
      // Only an owner can make or unmake owners, and a business always keeps at least one active owner.
      const touchesOwner = m.roleKey === "owner" || newRoleKey === "owner";
      if (touchesOwner && auth.role !== "owner") throw forbidden("owner_only");
      const losesOwner = m.roleKey === "owner" && m.status === "active" && (newRoleKey !== "owner" || body.status === "suspended");
      if (losesOwner && (await activeOwnerCount(tx)) <= 1) throw conflict("last_owner");

      // Limiting a person to some stores: only stores of this business, none for an owner, and an empty list means all.
      if (body.warehouseScope !== undefined) {
        if (newRoleKey === "owner" && body.warehouseScope?.length) throw badRequest("owner_has_all_stores");
        if (body.warehouseScope?.length) {
          const found = await tx.select({ id: tables.warehouses.id }).from(tables.warehouses).where(inArray(tables.warehouses.id, body.warehouseScope));
          if (found.length !== new Set(body.warehouseScope).size) throw badRequest("unknown_warehouse");
        }
      }
      const patch = { ...(body.roleId ? { roleId: body.roleId } : {}), ...(body.status ? { status: body.status } : {}), ...(body.warehouseScope !== undefined ? { warehouseScope: body.warehouseScope?.length ? [...new Set(body.warehouseScope)] : null } : {}) };
      if (!Object.keys(patch).length) return { ok: true };
      await tx.update(tables.memberships).set(patch).where(eq(tables.memberships.id, id));
      if (body.status === "suspended") await tx.delete(tables.sessions).where(and(eq(tables.sessions.userId, m.userId), eq(tables.sessions.tenantId, auth.tenantId)));
      await audit(tx, {
        tenantId: auth.tenantId, userId: auth.user.id, action: "update", entity: "membership", entityId: id,
        before: { roleId: m.roleId, status: m.status }, after: patch, ip: req.ip,
      });
      return { ok: true };
    });
  });

  app.delete("/members/:id", { preHandler: can("users.delete") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    return withTenant(db, auth.tenantId, async (tx) => {
      const [m] = await tx
        .select({ userId: tables.memberships.userId, roleKey: tables.roles.key, status: tables.memberships.status })
        .from(tables.memberships)
        .innerJoin(tables.roles, eq(tables.roles.id, tables.memberships.roleId))
        .where(eq(tables.memberships.id, id))
        .for("update");
      if (!m) throw notFound();
      if (m.userId === auth.user.id) throw forbidden("cannot_change_self");
      if (m.roleKey === "owner" && auth.role !== "owner") throw forbidden("owner_only");
      if (m.roleKey === "owner" && m.status === "active" && (await activeOwnerCount(tx)) <= 1) throw conflict("last_owner");
      await tx.delete(tables.memberships).where(eq(tables.memberships.id, id));
      await tx.delete(tables.sessions).where(and(eq(tables.sessions.userId, m.userId), eq(tables.sessions.tenantId, auth.tenantId)));
      await audit(tx, { tenantId: auth.tenantId, userId: auth.user.id, action: "delete", entity: "membership", entityId: id, before: m, ip: req.ip });
      return { ok: true };
    });
  });

  // ---- invitations ---------------------------------------------------------------------------

  app.get("/invitations", { preHandler: can("users.view") }, async (req) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) =>
      tx
        .select({ id: tables.invitations.id, email: tables.invitations.email, roleName: tables.roles.name, expiresAt: tables.invitations.expiresAt, createdAt: tables.invitations.createdAt })
        .from(tables.invitations)
        .innerJoin(tables.roles, eq(tables.roles.id, tables.invitations.roleId))
        .where(and(isNull(tables.invitations.acceptedAt), isNull(tables.invitations.revokedAt), gt(tables.invitations.expiresAt, new Date())))
        .orderBy(desc(tables.invitations.createdAt)),
    );
  });

  app.post("/invitations", { preHandler: can("users.create"), config: { rateLimit: { max: 30, timeWindow: "1 hour" } } }, async (req, reply) => {
    const auth = requireTenant(req);
    const body = z.object({ email: z.email().max(200), roleId: z.uuid() }).parse(req.body);
    const token = randomBytes(24).toString("base64url");
    const email = body.email.trim().toLowerCase();
    const result = await withTenant(db, auth.tenantId, async (tx) => {
      const [role] = await tx.select().from(tables.roles).where(eq(tables.roles.id, body.roleId));
      if (!role) throw badRequest("unknown_role");
      if (role.key === "owner" && auth.role !== "owner") throw forbidden("owner_only");
      const [already] = await tx
        .select({ id: tables.memberships.id })
        .from(tables.memberships)
        .innerJoin(tables.users, eq(tables.users.id, tables.memberships.userId))
        .where(sql`lower(${tables.users.email}) = ${email}`);
      if (already) throw conflict("already_member");
      const [tenant] = await tx.select({ name: tables.tenants.name }).from(tables.tenants);
      const [inv] = await tx.insert(tables.invitations).values({
        tenantId: auth.tenantId, email, roleId: role.id, tokenHash: hashToken(token), invitedBy: auth.user.id,
        expiresAt: new Date(Date.now() + INVITE_TTL_DAYS * 86_400_000),
      }).returning({ id: tables.invitations.id });
      await audit(tx, { tenantId: auth.tenantId, userId: auth.user.id, action: "create", entity: "invitation", entityId: inv!.id, after: { email, role: role.key }, ip: req.ip });
      return { id: inv!.id, tenantName: tenant?.name ?? "", roleName: role.name };
    });
    const inviteUrl = `${env.WEB_ORIGIN}/invite/${token}`;
    await mailer.send({
      to: email,
      subject: `${auth.user.name} invited you to ${result.tenantName} on Varchasv`,
      text: `${auth.user.name} has invited you to join ${result.tenantName} as ${result.roleName}.\n\nAccept: ${inviteUrl}\n\nThis link expires in ${INVITE_TTL_DAYS} days.`,
    });
    // The link is also returned so an admin can share it on WhatsApp when email isn't set up yet.
    return reply.code(201).send({ id: result.id, inviteUrl });
  });

  app.delete("/invitations/:id", { preHandler: can("users.create") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    return withTenant(db, auth.tenantId, async (tx) => {
      const [inv] = await tx.update(tables.invitations).set({ revokedAt: new Date() })
        .where(and(eq(tables.invitations.id, id), isNull(tables.invitations.acceptedAt))).returning({ id: tables.invitations.id });
      if (!inv) throw notFound();
      await audit(tx, { tenantId: auth.tenantId, userId: auth.user.id, action: "delete", entity: "invitation", entityId: id, ip: req.ip });
      return { ok: true };
    });
  });

  async function findInvite(token: string) {
    const rows = await db.execute<{ id: string; tenant_id: string; tenant_name: string; email: string; role_id: string; role_name: string }>(
      sql`select * from invitation_by_token(${hashToken(token)})`,
    );
    return rows[0];
  }

  /** Public: what the invite page shows before the person accepts. */
  app.get("/invitations/lookup/:token", { config: { rateLimit: { max: 30, timeWindow: "5 minutes" } } }, async (req) => {
    const { token } = z.object({ token: z.string().min(10).max(100) }).parse(req.params);
    const inv = await findInvite(token);
    if (!inv) throw notFound("invite_invalid");
    const [existing] = await db.select({ id: tables.users.id }).from(tables.users).where(sql`lower(${tables.users.email}) = ${inv.email}`);
    return { tenantName: inv.tenant_name, email: inv.email, roleName: inv.role_name, hasAccount: !!existing };
  });

  app.post("/invitations/accept", { config: { rateLimit: { max: 10, timeWindow: "5 minutes" } } }, async (req, reply) => {
    const body = z.object({
      token: z.string().min(10).max(100),
      name: z.string().trim().min(2).max(100).optional(),
      password: z.string().min(8).max(200).optional(),
    }).parse(req.body);
    const inv = await findInvite(body.token);
    if (!inv) throw notFound("invite_invalid");

    const [existing] = await db.select().from(tables.users).where(sql`lower(${tables.users.email}) = ${inv.email}`);
    let userId: string;
    if (req.auth) {
      // Signed in: the invite must be for this account.
      if (req.auth.user.email.toLowerCase() !== inv.email) throw forbidden("invite_other_email");
      userId = req.auth.user.id;
    } else if (existing) {
      if (!body.password || !(await verifyPassword(body.password, existing.passwordHash))) throw new HttpError(401, "invalid_credentials");
      userId = existing.id;
    } else {
      if (!body.name || !body.password) throw badRequest("name_and_password_required");
      const [u] = await db.insert(tables.users).values({ name: body.name, email: inv.email, passwordHash: await hashPassword(body.password) }).returning({ id: tables.users.id });
      userId = u!.id;
    }

    await withTenant(db, inv.tenant_id, async (tx) => {
      // Mark accepted first, conditionally, so the same link can't be used twice concurrently.
      const [claimed] = await tx.update(tables.invitations).set({ acceptedAt: new Date() })
        .where(and(eq(tables.invitations.id, inv.id), isNull(tables.invitations.acceptedAt))).returning({ id: tables.invitations.id });
      if (!claimed) throw notFound("invite_invalid");
      await tx.insert(tables.memberships).values({ tenantId: inv.tenant_id, userId, roleId: inv.role_id })
        .onConflictDoUpdate({ target: [tables.memberships.tenantId, tables.memberships.userId], set: { roleId: inv.role_id, status: "active" } });
      await audit(tx, { tenantId: inv.tenant_id, userId, action: "create", entity: "membership", entityId: userId, after: { via: "invitation", role: inv.role_name }, ip: req.ip });
    });

    if (req.auth) {
      await db.update(tables.sessions).set({ tenantId: inv.tenant_id }).where(eq(tables.sessions.tokenHash, req.auth.sessionHash));
    } else {
      const s = await createSession(db, userId, inv.tenant_id, { userAgent: req.headers["user-agent"], ip: req.ip });
      setCookie(reply, s.token, s.expiresAt);
    }
    return { tenantId: inv.tenant_id };
  });

  // ---- roles ---------------------------------------------------------------------------------

  app.get("/roles", { preHandler: can("users.view") }, async (req) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, async (tx) => {
      const rows = await tx
        .select({ role: tables.roles, members: sql<number>`(select count(*)::int from memberships m where m.role_id = roles.id)` })
        .from(tables.roles)
        .orderBy(desc(tables.roles.system), asc(tables.roles.name));
      return rows.map((r) => ({ ...r.role, members: r.members }));
    });
  });

  app.post("/roles", { preHandler: can("users.edit") }, async (req, reply) => {
    const auth = requireTenant(req);
    const body = z.object({ name: z.string().trim().min(2).max(60), permissions: Permissions }).parse(req.body);
    const role = await withTenant(db, auth.tenantId, async (tx) => {
      // Nobody can hand out permissions they don't hold themselves.
      if (body.permissions.some((p) => !auth.permissions.has(p))) throw forbidden("permission_escalation");
      const key = `custom_${randomBytes(4).toString("hex")}`;
      const [r] = await tx.insert(tables.roles).values({ tenantId: auth.tenantId, key, name: body.name, permissions: body.permissions }).returning();
      await audit(tx, { tenantId: auth.tenantId, userId: auth.user.id, action: "create", entity: "role", entityId: r!.id, after: body, ip: req.ip });
      return r;
    });
    return reply.code(201).send(role);
  });

  app.patch("/roles/:id", { preHandler: can("users.edit") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const body = z.object({ name: z.string().trim().min(2).max(60).optional(), permissions: Permissions.optional() }).parse(req.body);
    return withTenant(db, auth.tenantId, async (tx) => {
      const [role] = await tx.select().from(tables.roles).where(eq(tables.roles.id, id)).for("update");
      if (!role) throw notFound();
      if (role.system) throw forbidden("system_role");
      if (body.permissions?.some((p) => !auth.permissions.has(p))) throw forbidden("permission_escalation");
      const [updated] = await tx.update(tables.roles).set(body).where(eq(tables.roles.id, id)).returning();
      await audit(tx, { tenantId: auth.tenantId, userId: auth.user.id, action: "update", entity: "role", entityId: id, before: { name: role.name, permissions: role.permissions }, after: body, ip: req.ip });
      return updated;
    });
  });

  app.delete("/roles/:id", { preHandler: can("users.edit") }, async (req) => {
    const auth = requireTenant(req);
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    return withTenant(db, auth.tenantId, async (tx) => {
      const [role] = await tx.select().from(tables.roles).where(eq(tables.roles.id, id));
      if (!role) throw notFound();
      if (role.system) throw forbidden("system_role");
      const [inUse] = await tx.select({ id: tables.memberships.id }).from(tables.memberships).where(eq(tables.memberships.roleId, id)).limit(1);
      if (inUse) throw conflict("role_in_use");
      await tx.delete(tables.invitations).where(eq(tables.invitations.roleId, id));
      await tx.delete(tables.roles).where(eq(tables.roles.id, id));
      await audit(tx, { tenantId: auth.tenantId, userId: auth.user.id, action: "delete", entity: "role", entityId: id, before: { name: role.name }, ip: req.ip });
      return { ok: true };
    });
  });

  // ---- more businesses for the same login ---------------------------------------------------

  app.post("/tenants", { config: { rateLimit: { max: 10, timeWindow: "1 hour" } } }, async (req, reply) => {
    if (!req.auth) throw unauthorized();
    const auth = req.auth;
    const body = z.object({
      businessName: z.string().trim().min(2).max(150),
      stateCode: z.string().refine(isValidStateCode, "invalid_state"),
      gstin: z.string().trim().max(15).optional().transform((v) => (v ? v : undefined)),
      industry: z.enum(["tiles", "general", "apparel", "trading", "manufacturing", "retail", "services"]).optional(),
      booksFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date").optional(),
    }).parse(req.body);
    const result = await db.transaction((tx) => createBusiness(tx, auth.user.id, body));
    await db.update(tables.sessions).set({ tenantId: result.tenantId }).where(eq(tables.sessions.tokenHash, auth.sessionHash));
    return reply.code(201).send({ tenantId: result.tenantId });
  });
}
