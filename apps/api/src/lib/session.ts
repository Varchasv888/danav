import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import { tables, withTenant, type Db } from "@varchasv/db";
import { env } from "../env.js";

export const SESSION_COOKIE = "vsid";

export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function createSession(db: Db, userId: string, tenantId: string | null, meta: { userAgent?: string; ip?: string }) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + env.SESSION_TTL_DAYS * 86_400_000);
  await db.insert(tables.sessions).values({
    tokenHash: hashToken(token),
    userId,
    tenantId,
    userAgent: meta.userAgent?.slice(0, 300) ?? null,
    ip: meta.ip ?? null,
    expiresAt,
  });
  return { token, expiresAt };
}

export interface AuthContext {
  sessionHash: string;
  user: { id: string; email: string; name: string; locale: string };
  tenantId: string | null;
  role: string | null;
  permissions: Set<string>;
  /** The stores this person is limited to (warehouse ids), or null for all. */
  warehouseScope: string[] | null;
  /**
   * "master" or "staff" for local-login users; null for regular DB users.
   * Populated from the sessions.local_role column via getSessionLocalRole().
   */
  localRole: "master" | "staff" | null;
}

/** Resolve a session cookie to the user, their current tenant, and that tenant role's permissions. */
export async function loadSession(db: Db, token: string): Promise<AuthContext | null> {
  const sessionHash = hashToken(token);
  const [row] = await db
    .select({
      tenantId: tables.sessions.tenantId,
      id: tables.users.id,
      email: tables.users.email,
      name: tables.users.name,
      locale: tables.users.locale,
    })
    .from(tables.sessions)
    .innerJoin(tables.users, eq(tables.users.id, tables.sessions.userId))
    .where(and(eq(tables.sessions.tokenHash, sessionHash), gt(tables.sessions.expiresAt, new Date())))
    .limit(1);
  if (!row) return null;

  const { tenantId, ...user } = row;
  if (!tenantId) return { sessionHash, user, tenantId: null, role: null, permissions: new Set(), warehouseScope: null, localRole: null };

  const membership = await withTenant(db, tenantId, (tx) =>
    tx
      .select({ key: tables.roles.key, permissions: tables.roles.permissions, scope: tables.memberships.warehouseScope })
      .from(tables.memberships)
      .innerJoin(tables.roles, eq(tables.roles.id, tables.memberships.roleId))
      .where(and(eq(tables.memberships.userId, user.id), eq(tables.memberships.status, "active")))
      .limit(1),
  );
  const m = membership[0];
  // Membership removed since login: keep the user signed in, but with no tenant access.
  if (!m) return { sessionHash, user, tenantId: null, role: null, permissions: new Set(), warehouseScope: null, localRole: null };
  return { sessionHash, user, tenantId, role: m.key, permissions: new Set(m.permissions), warehouseScope: m.key === "owner" ? null : m.scope && m.scope.length ? m.scope : null, localRole: null };
}
