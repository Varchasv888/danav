import { createDb, type Db } from "@varchasv/db";
import type { FastifyInstance } from "fastify";
import { buildApp } from "./app.js";
import { env } from "./env.js";
import { LogMailer, SmtpMailer, type Mailer } from "./lib/mailer.js";
import { ensureLocalAuthSchema } from "./lib/local-auth.js";

/** The API as deployed: database pool, mailer and app, shared by the server and the serverless handler. */
export async function createRuntime(): Promise<{ app: FastifyInstance; db: Db; mailer: Mailer; close: () => Promise<void> }> {
  const { db, close } = createDb(env.DATABASE_URL, { max: env.DB_POOL_MAX });
  // Idempotent: adds the local_role column to sessions if it doesn't exist yet.
  await ensureLocalAuthSchema(db);
  const mailer = env.SMTP_URL ? new SmtpMailer(env.SMTP_URL, env.MAIL_FROM) : new LogMailer();
  const app = await buildApp({ db, logger: true, mailer });
  return { app, db, mailer, close };
}
