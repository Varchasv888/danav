import type { FastifyInstance } from "fastify";
import type { Db } from "@varchasv/db";
import { env } from "../env.js";
import { unauthorized } from "../lib/errors.js";
import type { Mailer } from "../lib/mailer.js";
import { sealAllTenants } from "../services/auditchain.js";
import { runDueScheduledChanges } from "../services/scheduledchanges.js";
import { runDueBackups } from "../services/backups.js";
import { runDueReports } from "../services/reportbuilder.js";
import { demoPush, demoSms } from "../integrations/channels.js";
import { messenger } from "../integrations/messaging.js";
import { runDueComms } from "../services/comms.js";
import { runDueReminders } from "../services/commreminders.js";
import { runDueConsigneeStatements } from "../services/consignment.js";

/**
 * Work a scheduler triggers, for hosts without a long-running process (Vercel Cron sends
 * "Authorization: Bearer $CRON_SECRET"). The long-running server does the same on a timer.
 */
export async function cronRoutes(app: FastifyInstance, { db, mailer }: { db: Db; mailer: Mailer }) {
  app.get("/cron/reports", async (req) => {
    if (!env.CRON_SECRET || req.headers.authorization !== `Bearer ${env.CRON_SECRET}`) throw unauthorized();
    return { sent: await runDueReports(db, mailer) };
  });
  app.get("/cron/backups", async (req) => {
    if (!env.CRON_SECRET || req.headers.authorization !== `Bearer ${env.CRON_SECRET}`) throw unauthorized();
    return { done: await runDueBackups(db, mailer) };
  });
  app.get("/cron/comms", async (req) => {
    if (!env.CRON_SECRET || req.headers.authorization !== `Bearer ${env.CRON_SECRET}`) throw unauthorized();
    return { sent: await runDueComms(db, { whatsapp: messenger, sms: demoSms, push: demoPush, email: mailer }) };
  });
  app.get("/cron/reminders", async (req) => {
    if (!env.CRON_SECRET || req.headers.authorization !== `Bearer ${env.CRON_SECRET}`) throw unauthorized();
    return { sent: await runDueReminders(db) };
  });
  app.get("/cron/statements", async (req) => {
    if (!env.CRON_SECRET || req.headers.authorization !== `Bearer ${env.CRON_SECRET}`) throw unauthorized();
    return { sent: await runDueConsigneeStatements(db, mailer) };
  });
  app.get("/cron/changes", async (req) => {
    if (!env.CRON_SECRET || req.headers.authorization !== `Bearer ${env.CRON_SECRET}`) throw unauthorized();
    return { applied: await runDueScheduledChanges(db) };
  });
  app.get("/cron/audit-seal", async (req) => {
    if (!env.CRON_SECRET || req.headers.authorization !== `Bearer ${env.CRON_SECRET}`) throw unauthorized();
    return { sealed: await sealAllTenants(db) };
  });
}
