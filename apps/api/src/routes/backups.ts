import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import type { Mailer } from "../lib/mailer.js";
import { can, requireTenant } from "../plugins/auth.js";
import { getBackupSettings, runBackup, saveBackupSettings } from "../services/backups.js";

/** The business's scheduled, emailed, encrypted backups. */
export async function backupRoutes(app: FastifyInstance, { db, mailer }: { db: Db; mailer: Mailer }) {
  app.get("/backups", { preHandler: can("company.export") }, async (req) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => getBackupSettings(tx));
  });
  app.put("/backups", { preHandler: can("company.export") }, async (req) => {
    const auth = requireTenant(req);
    const body = z.object({
      enabled: z.boolean(), frequency: z.enum(["daily", "weekly"]), hour: z.number().int().min(0).max(23), weekday: z.number().int().min(0).max(6),
      recipients: z.array(z.string().max(120)).max(5), passphrase: z.string().max(200).optional(),
    }).parse(req.body);
    await withTenant(db, auth.tenantId, (tx) => saveBackupSettings(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }, body));
    return { ok: true };
  });
  app.post("/backups/run", { preHandler: can("company.export"), config: { rateLimit: { max: 5, timeWindow: "1 hour" } } }, async (req) => {
    const auth = requireTenant(req);
    return runBackup(db, auth.tenantId, "manual", mailer);
  });
}
