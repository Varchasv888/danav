import { eq } from "drizzle-orm";
import type { FastifyRequest } from "fastify";
import { tables, type Db } from "@varchasv/db";
import { forbidden, unauthorized } from "./errors.js";

/** How long a typed password keeps high-risk actions open. */
export const STEP_UP_MINUTES = 5;

/** Marks this session as freshly confirmed with the person's password. */
export async function grantStepUp(db: Db, sessionHash: string) {
  const until = new Date(Date.now() + STEP_UP_MINUTES * 60_000);
  await db.update(tables.sessions).set({ stepUpUntil: until }).where(eq(tables.sessions.tokenHash, sessionHash));
  return until;
}

/** Throws unless the person confirmed their password in the last few minutes. Used on actions that move money, open the books again or cut access. */
export async function requireStepUp(db: Db, req: FastifyRequest) {
  if (!req.auth) throw unauthorized();
  const [s] = await db.select({ until: tables.sessions.stepUpUntil }).from(tables.sessions).where(eq(tables.sessions.tokenHash, req.auth.sessionHash));
  if (!s?.until || s.until.getTime() < Date.now()) throw forbidden("step_up_required");
}
