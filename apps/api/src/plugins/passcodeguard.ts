import type { FastifyRequest } from "fastify";
import { tables, withTenant, type Db } from "@varchasv/db";
import { forbidden } from "../lib/errors.js";
import { checkPasscode, passcodeRequired } from "../services/passcode.js";

/** The documents whose cancellation the business passcode guards: sales, purchase, stock and accounts documents. */
const GUARDED = /^\/(sales-orders|delivery-notes|delivery-orders|sales-invoices|credit-notes|purchase-orders|goods-receipts|purchase-bills|purchase-returns|vouchers|stock-journals)\/[0-9a-f-]{36}\/cancel$/;

const failures = new Map<string, { n: number; until: number }>();

/**
 * When the business turned on "passcode to cancel", cancelling a document needs the passcode in the x-passcode header. One place covers every document;
 * five wrong tries in five minutes lock the person out for that time.
 */
export function passcodeGuard(db: Db) {
  return async (req: FastifyRequest) => {
    if (req.method !== "POST" || !req.auth?.tenantId || !GUARDED.test(req.url.split("?")[0]!)) return;
    const tenantId = req.auth.tenantId, who = `${tenantId}:${req.auth.user.id}`;
    await withTenant(db, tenantId, async (tx) => {
      const [company] = await tx.select({ id: tables.companies.id }).from(tables.companies).limit(1);
      if (!company || !(await passcodeRequired(tx, company.id))) return;
      const f = failures.get(who);
      if (f && f.n >= 5 && f.until > Date.now()) throw forbidden("passcode_locked");
      const given = req.headers["x-passcode"];
      try { await checkPasscode(tx, company.id, typeof given === "string" ? given : undefined); failures.delete(who); }
      catch (err) {
        if (given) failures.set(who, { n: (f && f.until > Date.now() ? f.n : 0) + 1, until: Date.now() + 5 * 60_000 });
        throw err;
      }
    });
  };
}
