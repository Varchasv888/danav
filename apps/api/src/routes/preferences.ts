import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { withTenant, type Db } from "@varchasv/db";
import { can, requireTenant } from "../plugins/auth.js";
import { requireStepUp } from "../lib/stepup.js";
import { hasPasscode, setPasscode } from "../services/passcode.js";
import { resolveCompany } from "../services/accounting.js";
import { getPreferences, savePreferences } from "../services/preferences.js";
import { billBytes, invoiceBytes, testBytes } from "../services/printbytes.js";
const IdParam = z.object({ id: z.string().uuid() });

/** The preferences on the Settings screen: print options and the like. Anyone signed in to the business can read them (printing an invoice needs them); changing them needs the right to edit settings. */
export async function preferenceRoutes(app: FastifyInstance, { db }: { db: Db }) {
  app.get("/settings/preferences", async (req) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => getPreferences(tx));
  });
  app.put("/settings/preferences", { preHandler: can("settings.edit") }, async (req) => {
    const auth = requireTenant(req);
    const body = z.record(z.string(), z.union([z.boolean(), z.string()])).parse(req.body);
    return withTenant(db, auth.tenantId, (tx) => savePreferences(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }, body));
  });
  /** The counter receipt, the tax invoice or a test page as ESC/POS bytes for the print agent, laid out by the Thermal printer settings. */
  app.get("/pos/bills/:id/escpos", { preHandler: can("sales.view") }, async (req) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => billBytes(tx, IdParam.parse(req.params).id));
  });
  app.get("/sales-invoices/:id/escpos", { preHandler: can("sales.view") }, async (req) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => invoiceBytes(tx, IdParam.parse(req.params).id));
  });
  app.get("/settings/print-test", { preHandler: can("settings.view") }, async (req) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, (tx) => testBytes(tx));
  });
  /** Whether a passcode has been set (never the passcode itself). */
  app.get("/settings/passcode", { preHandler: can("settings.view") }, async (req) => {
    const auth = requireTenant(req);
    return withTenant(db, auth.tenantId, async (tx) => ({ set: await hasPasscode(tx, (await resolveCompany(tx)).id) }));
  });
  /** Sets or changes the passcode that guards cancelling documents; the person confirms their password first, and changing it needs the current passcode. */
  app.put("/settings/passcode", { preHandler: can("settings.edit") }, async (req) => {
    const auth = requireTenant(req);
    await requireStepUp(db, req);
    const body = z.object({ passcode: z.string().regex(/^\d{4,8}$/, "invalid_passcode"), current: z.string().max(12).optional() }).parse(req.body);
    await withTenant(db, auth.tenantId, (tx) => setPasscode(tx, { tenantId: auth.tenantId, userId: auth.user.id, ip: req.ip }, body.passcode, body.current));
    return { set: true };
  });
}
