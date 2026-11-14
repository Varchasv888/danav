/**
 * Two-user local login system: master and staff.
 *
 * Master login:  ID: master@store.local  /  Password: Master@2024
 * Staff  login:  ID: staff@store.local   /  Password: Staff@2024
 *
 * Rules:
 *  - Master can log in any time.
 *  - Staff can ONLY log in while an active master session exists in the database.
 *  - Staff date range is restricted to today only (enforced via the localRole returned
 *    by /auth/me and respected by the working-date logic in the web app).
 *  - Master sees full year-round data.
 *
 * The master-online check is DB-backed so it works correctly on serverless hosts (Vercel)
 * where multiple function instances run independently.
 */

import type { Db } from "@varchasv/db";
import { sql } from "drizzle-orm";

export type LocalRole = "master" | "staff";

export interface LocalUser {
  id: string;
  name: string;
  email: string;
  role: LocalRole;
}

/** Hardcoded credentials. Change these strings to rotate passwords. */
const USERS: Array<LocalUser & { password: string }> = [
  { id: "local-master", name: "Master", email: "master@store.local", password: "Master@2024", role: "master" },
  { id: "local-staff",  name: "Staff",  email: "staff@store.local",  password: "Staff@2024",  role: "staff"  },
];

/** Returns the matching LocalUser, or an error code. Does NOT check the master-online gate yet. */
export function matchLocalCredentials(email: string, password: string): LocalUser | null {
  const found = USERS.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
  );
  if (!found) return null;
  const { password: _pw, ...user } = found;
  return user;
}

/**
 * Checks whether at least one master local-session is currently active in the DB.
 * Uses the `local_role` column added by ensureLocalAuthSchema().
 */
export async function isMasterOnline(db: Db): Promise<boolean> {
  try {
    const rows = await db.execute(sql`
      SELECT 1 FROM sessions
      WHERE local_role = 'master'
        AND expires_at > now()
      LIMIT 1
    `);
    return (rows as unknown[]).length > 0;
  } catch {
    // Column may not exist yet during first boot; treat as no master online.
    return false;
  }
}

/**
 * Adds the `local_role` column to the sessions table if it isn't there yet.
 * Safe to call on every server start.
 *
 * The API connects as the restricted app role, which does not own the sessions table,
 * so Postgres rejects ALTER TABLE for it even when the column already exists. The column
 * is therefore created once by the database owner (see setup notes), and a failure here
 * is logged and ignored instead of crashing the server on startup.
 */
export async function ensureLocalAuthSchema(db: Db): Promise<void> {
  try {
    await db.execute(sql`
      ALTER TABLE sessions
      ADD COLUMN IF NOT EXISTS local_role varchar(10) DEFAULT NULL
    `);
  } catch (e) {
    console.warn("local_role column check skipped:", (e as Error).message);
  }
}

/**
 * Writes the local role onto an already-created session row.
 * Called right after createSession() during local-login.
 */
export async function setSessionLocalRole(db: Db, tokenHash: string, role: LocalRole): Promise<void> {
  await db.execute(sql`
    UPDATE sessions SET local_role = ${role} WHERE token_hash = ${tokenHash}
  `);
}

/**
 * Reads the local role for a session directly from the DB.
 * Called by loadSession() to populate AuthContext.localRole.
 */
export async function getSessionLocalRole(db: Db, tokenHash: string): Promise<LocalRole | null> {
  try {
    const rows = await db.execute(sql`
      SELECT local_role FROM sessions WHERE token_hash = ${tokenHash} LIMIT 1
    `) as { local_role: string | null }[];
    const role = rows[0]?.local_role ?? null;
    if (role === "master" || role === "staff") return role;
    return null;
  } catch {
    return null;
  }
}
