import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { listLocks, setLock } from "../services/processlocks.js";

/** Lock one kind of document (sales invoices, purchase bills, vouchers...) up to a date, apart from the whole-period lock. */
export async function processLockRoutes(app: FastifyInstance, { db }: { db: Db }) {
  app.get("/settings/process-locks", { preHandler: can("settings.view") }, async (req) => withTenant(db, requireTenant(req).tenantId, (tx) => listLocks(tx)));
  app.put("/settings/process-locks", { preHandler: can("settings.edit") }, async (req) => {
    const body = z.object({ docType: z.string().regex(/^[a-z_]{2,30}$/), lockedUpTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable() }).parse(req.body);
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => setLock(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }, body.docType, body.lockedUpTo));
  });
}
