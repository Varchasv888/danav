import { eq } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { resolvePreferences } from "@varchasv/domain";

/** The preferences of a company, with defaults filled in. Kept apart from the preferences service so stock and sales code can read it without a circular import. */
export async function readPrefs(tx: Tx, companyId: string) {
  const [row] = await tx.select({ prefs: tables.companyPreferences.prefs }).from(tables.companyPreferences).where(eq(tables.companyPreferences.companyId, companyId));
  return resolvePreferences(row?.prefs);
}
