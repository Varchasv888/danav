import { eq } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { cleanPreferences, resolvePreferences } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";
import { hasPasscode } from "./passcode.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

/** Every preference of the business with its saved value, or its default where none is saved. */
export async function getPreferences(tx: Tx, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const [row] = await tx.select().from(tables.companyPreferences).where(eq(tables.companyPreferences.companyId, company.id));
  return resolvePreferences(row?.prefs);
}

/** Saves the preferences named in the request and leaves the others as they were. Unknown keys and invalid values are refused, not stored. */
export async function savePreferences(tx: Tx, actor: Actor, patch: unknown, companyId?: string) {
  const clean = cleanPreferences(patch);
  const asked = patch && typeof patch === "object" ? Object.keys(patch as object).length : 0;
  if (!asked || Object.keys(clean).length !== asked) throw badRequest("invalid_preferences");
  const company = await resolveCompany(tx, companyId);
  // The passcode setting needs a passcode to exist; otherwise nobody could cancel anything.
  if (clean["security.passcodeOnCancel"] === true && !(await hasPasscode(tx, company.id))) throw badRequest("set_passcode_first");
  const [row] = await tx.select().from(tables.companyPreferences).where(eq(tables.companyPreferences.companyId, company.id));
  const before = cleanPreferences(row?.prefs);
  const after = { ...before, ...clean };
  if (row) await tx.update(tables.companyPreferences).set({ prefs: after, updatedBy: actor.userId, updatedAt: new Date() }).where(eq(tables.companyPreferences.id, row.id));
  else await tx.insert(tables.companyPreferences).values({ tenantId: actor.tenantId, companyId: company.id, prefs: after, updatedBy: actor.userId });
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "company_preferences", entityId: company.id, before, after, ip: actor.ip });
  return resolvePreferences(after);
}
