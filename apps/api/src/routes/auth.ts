import { randomBytes } from "node:crypto";
import { and, eq, gt, isNull, ne, sql } from "drizzle-orm";
import type { FastifyInstance, FastifyReply } from "fastify";
import { z } from "zod";
import { tables, tenantsForUser, withTenant, type Db } from "@varchasv/db";
import { isValidStateCode } from "@varchasv/domain";
import { READY_LOCALES } from "@varchasv/i18n/locales";
import { env, secureCookies } from "../env.js";
import { audit } from "../lib/audit.js";
import { grantStepUp } from "../lib/stepup.js";
import { conflict, forbidden, HttpError, unauthorized } from "../lib/errors.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import type { Mailer } from "../lib/mailer.js";
import { SESSION_COOKIE, createSession, hashToken } from "../lib/session.js";
import { requireTenant } from "../plugins/auth.js";
import { signup } from "../services/onboarding.js";
import { matchLocalCredentials, isMasterOnline, setSessionLocalRole } from "../lib/local-auth.js";

const Locale = z.string().refine((l) => READY_LOCALES.includes(l), "unsupported_locale");

const SignupBody = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(200),
  password: z.string().min(8).max(200),
  businessName: z.string().trim().min(2).max(150),
  stateCode: z.string().refine(isValidStateCode, "invalid_state"),
  gstin: z.string().trim().max(15).optional().transform((v) => (v ? v : undefined)),
  industry: z.enum(["tiles", "general", "apparel", "trading", "manufacturing", "retail", "services"]).optional(),
  locale: Locale.optional(),
  booksFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date").optional(),
});

const LoginBody = z.object({
  email: z.email(),
  password: z.string().min(1).max(200),
  /** The offline app has no cookie jar; it asks for the session token in the response body. */
  client: z.enum(["web", "app"]).default("web"),
});

// Checked against when the email is unknown, so a login costs the same time either way.
const dummyHashPromise = hashPassword("timing-equaliser");

const RESET_TTL_MINUTES = 60;
const NewPassword = z.string().min(8).max(200);

export async function authRoutes(app: FastifyInstance, { db, mailer }: { db: Db; mailer: Mailer }) {
  const setCookie = (reply: FastifyReply, token: string, expires: Date) =>
    reply.setCookie(SESSION_COOKIE, token, { path: "/", httpOnly: true, sameSite: "lax", secure: secureCookies, expires });

  app.post("/auth/signup", { config: { rateLimit: { max: 10, timeWindow: "1 hour" } } }, async (req, reply) => {
    const body = SignupBody.parse(req.body);
    let result;
    try {
      result = await signup(db, body);
    } catch (e) {
      if (e instanceof HttpError) throw e;
      if ((e as { cause?: { code?: string } }).cause?.code === "23505" || (e as { code?: string }).code === "23505") throw conflict("email_taken");
      throw e;
    }
    const s = await createSession(db, result.userId, result.tenantId, { userAgent: req.headers["user-agent"], ip: req.ip });
    setCookie(reply, s.token, s.expiresAt);
    return reply.code(201).send({ tenantId: result.tenantId, companyId: result.companyId });
  });

  app.post("/auth/login", { config: { rateLimit: { max: 10, timeWindow: "5 minutes" } } }, async (req, reply) => {
    const body = LoginBody.parse(req.body);
    const [user] = await db
      .select()
      .from(tables.users)
      .where(sql`lower(${tables.users.email}) = lower(${body.email.trim()})`)
      .limit(1);
    const ok = await verifyPassword(body.password, user?.passwordHash ?? (await dummyHashPromise));
    if (!user || !ok) throw new HttpError(401, "invalid_credentials");

    const memberships = await tenantsForUser(db, user.id);
    const tenantId = memberships[0]?.tenantId ?? null;
    const s = await createSession(db, user.id, tenantId, { userAgent: req.headers["user-agent"], ip: req.ip });
    if (tenantId) {
      await withTenant(db, tenantId, (tx) => audit(tx, { tenantId, userId: user.id, action: "login", entity: "user", entityId: user.id, ip: req.ip }));
    }
    if (body.client === "app") return { tenants: memberships, tenantId, token: s.token, expiresAt: s.expiresAt, user: { id: user.id, name: user.name, email: user.email } };
    setCookie(reply, s.token, s.expiresAt);
    return { tenants: memberships, tenantId };
  });

  app.post("/auth/logout", async (req, reply) => {
    if (req.auth) {
      // If the master is logging out, revoke their session from the in-memory set so staff are blocked.
      await db.delete(tables.sessions).where(eq(tables.sessions.tokenHash, req.auth.sessionHash));
    }
    reply.clearCookie(SESSION_COOKIE, { path: "/" });
    return { ok: true };
  });

  /**
   * Local two-user login (master / staff).
   * Staff can only sign in while at least one master session is active in the database.
   * Credentials are checked in lib/local-auth.ts; a matching users row is created on first login
   * because sessions.user_id has a foreign key to users.id.
   */
  app.post("/auth/local-login", { config: { rateLimit: { max: 10, timeWindow: "5 minutes" } } }, async (req, reply) => {
    const { email, password } = z.object({ email: z.string(), password: z.string() }).parse(req.body);
    const user = matchLocalCredentials(email, password);
    if (!user) throw new HttpError(401, "invalid_credentials");

    // Staff can only sign in while at least one master session is active in the DB.
    if (user.role === "staff" && !(await isMasterOnline(db))) {
      throw new HttpError(401, "staff_requires_master_online");
    }

    // sessions.user_id is a uuid with a foreign key to users.id, so a session needs a real users row.
    // Find the row for this local account, or create it on first use.
    const findLocalUser = async () => {
      const [row] = await db
        .select()
        .from(tables.users)
        .where(sql`lower(${tables.users.email}) = lower(${user.email})`)
        .limit(1);
      return row;
    };

    let dbUser = await findLocalUser();
    if (!dbUser) {
      // The password hash is random and unusable: local accounts never authenticate through /auth/login.
      await db
        .insert(tables.users)
        .values({
          email: user.email,
          name: user.name,
          passwordHash: `!${randomBytes(32).toString("hex")}`,
        })
        .onConflictDoNothing();
      // Re-select instead of trusting RETURNING, so a concurrent first login still resolves to one row.
      dbUser = await findLocalUser();
    }
    if (!dbUser) throw new HttpError(500, "local_user_unavailable");

    const userId = dbUser.id;
    const memberships = await tenantsForUser(db, userId);
    const tenantId: string | null = memberships[0]?.tenantId ?? null;

    const s = await createSession(db, userId, tenantId, { userAgent: req.headers["user-agent"], ip: req.ip });

    // Record the local role onto the session row in the DB.
    const tokenHash = hashToken(s.token);
    await setSessionLocalRole(db, tokenHash, user.role);

    setCookie(reply, s.token, s.expiresAt);
    return {
      tenantId,
      localRole: user.role,
      user: { id: userId, name: user.name, email: user.email },
    };
  });

  app.get("/auth/me", async (req) => {
    if (!req.auth) throw unauthorized();
    const tenants = await tenantsForUser(db, req.auth.user.id);
    return {
      user: req.auth.user,
      tenantId: req.auth.tenantId,
      role: req.auth.role,
      permissions: [...req.auth.permissions].sort(),
      tenants,
      /** "master" or "staff" for local-login users; null for regular DB users. */
      localRole: req.auth.localRole ?? null,
    };
  });

  // "My Menu": the screens this user pinned in this business, in their order (null: the app's default set).
  app.get("/me/menu", async (req) => {
    const auth = requireTenant(req);
    const [m] = await withTenant(db, auth.tenantId, (tx) => tx.select({ menu: tables.memberships.menu }).from(tables.memberships).where(eq(tables.memberships.userId, auth.user.id)));
    return { items: m?.menu ?? null };
  });
  app.put("/me/menu", async (req) => {
    const auth = requireTenant(req);
    const { items } = z.object({ items: z.array(z.string().regex(/^\/[a-z0-9/?=&_-]{1,119}$/, "invalid_link")).max(48).nullable() }).parse(req.body);
    const menu = items ? [...new Set(items)] : null;
    await withTenant(db, auth.tenantId, (tx) => tx.update(tables.memberships).set({ menu }).where(eq(tables.memberships.userId, auth.user.id)));
    return { items: menu };
  });

  app.post("/auth/switch", async (req) => {
    if (!req.auth) throw unauthorized();
    const { tenantId } = z.object({ tenantId: z.uuid() }).parse(req.body);
    const tenants = await tenantsForUser(db, req.auth.user.id);
    if (!tenants.some((t) => t.tenantId === tenantId)) throw forbidden("not_a_member");
    await db.update(tables.sessions).set({ tenantId }).where(eq(tables.sessions.tokenHash, req.auth.sessionHash));
    return { tenantId };
  });

  app.patch("/auth/me", async (req) => {
    if (!req.auth) throw unauthorized();
    const body = z.object({ name: z.string().trim().min(2).max(100).optional(), locale: Locale.optional() }).parse(req.body);
    await db.update(tables.users).set(body).where(eq(tables.users.id, req.auth.user.id));
    return { ok: true };
  });

  /** Lock screen: checks the signed-in user's password without changing anything. Rate limited like a login. */
  app.post("/auth/unlock", { config: { rateLimit: { max: 10, timeWindow: "5 minutes" } } }, async (req) => {
    if (!req.auth) throw unauthorized();
    const { password } = z.object({ password: z.string().min(1).max(200) }).parse(req.body);
    const [user] = await db.select({ hash: tables.users.passwordHash }).from(tables.users).where(eq(tables.users.id, req.auth.user.id));
    if (!user || !(await verifyPassword(password, user.hash))) throw new HttpError(400, "wrong_password");
    return { ok: true };
  });

  /** Confirms the password for a few minutes so high-risk actions (reopening a month, approving a write-down, revoking a device) will go through. */
  app.post("/auth/step-up", { config: { rateLimit: { max: 10, timeWindow: "5 minutes" } } }, async (req) => {
    if (!req.auth) throw unauthorized();
    const { password } = z.object({ password: z.string().min(1).max(200) }).parse(req.body);
    const [user] = await db.select({ hash: tables.users.passwordHash }).from(tables.users).where(eq(tables.users.id, req.auth.user.id));
    if (!user || !(await verifyPassword(password, user.hash))) throw new HttpError(400, "wrong_password");
    const until = await grantStepUp(db, req.auth.sessionHash);
    return { ok: true, until: until.toISOString() };
  });

  /** Change password while signed in; every other session of this user is signed out. */
  app.post("/auth/password", { config: { rateLimit: { max: 10, timeWindow: "5 minutes" } } }, async (req) => {
    if (!req.auth) throw unauthorized();
    const body = z.object({ current: z.string().min(1).max(200), next: NewPassword }).parse(req.body);
    const [user] = await db.select({ hash: tables.users.passwordHash }).from(tables.users).where(eq(tables.users.id, req.auth.user.id));
    if (!user || !(await verifyPassword(body.current, user.hash))) throw new HttpError(400, "wrong_password");
    await db.update(tables.users).set({ passwordHash: await hashPassword(body.next) }).where(eq(tables.users.id, req.auth.user.id));
    await db.delete(tables.sessions).where(and(eq(tables.sessions.userId, req.auth.user.id), ne(tables.sessions.tokenHash, req.auth.sessionHash)));
    return { ok: true };
  });

  /** Emails a one-time reset link. Answers the same whether or not the address has an account. */
  app.post("/auth/password/forgot", { config: { rateLimit: { max: 5, timeWindow: "15 minutes" } } }, async (req) => {
    const { email } = z.object({ email: z.email().max(200) }).parse(req.body);
    const [user] = await db.select().from(tables.users).where(sql`lower(${tables.users.email}) = lower(${email.trim()})`).limit(1);
    if (user) {
      const token = randomBytes(32).toString("base64url");
      await db.insert(tables.passwordResets).values({ tokenHash: hashToken(token), userId: user.id, expiresAt: new Date(Date.now() + RESET_TTL_MINUTES * 60_000) });
      const link = `${env.WEB_ORIGIN}/reset-password/${token}`;
      await mailer.send({
        to: user.email,
        subject: "Reset your Varchasv password",
        text: `Hello ${user.name},

Someone asked to reset the password for this email address. To choose a new password, open:
${link}

The link works once and expires in ${RESET_TTL_MINUTES} minutes. If you didn't ask for this, ignore this email; your password stays the same.`,
      });
    }
    return { ok: true };
  });

  /** Sets a new password from a reset link, then signs the user out everywhere. */
  app.post("/auth/password/reset", { config: { rateLimit: { max: 10, timeWindow: "5 minutes" } } }, async (req) => {
    const body = z.object({ token: z.string().min(20).max(100), password: NewPassword }).parse(req.body);
    const tokenHash = hashToken(body.token);
    const [reset] = await db.select().from(tables.passwordResets)
      .where(and(eq(tables.passwordResets.tokenHash, tokenHash), isNull(tables.passwordResets.usedAt), gt(tables.passwordResets.expiresAt, new Date())));
    if (!reset) throw new HttpError(400, "invalid_or_expired_link");
    await db.transaction(async (tx) => {
      await tx.update(tables.users).set({ passwordHash: await hashPassword(body.password) }).where(eq(tables.users.id, reset.userId));
      // Using one link spends every outstanding link for this user.
      await tx.update(tables.passwordResets).set({ usedAt: new Date() }).where(and(eq(tables.passwordResets.userId, reset.userId), isNull(tables.passwordResets.usedAt)));
      await tx.delete(tables.sessions).where(eq(tables.sessions.userId, reset.userId));
    });
    return { ok: true };
  });
}
