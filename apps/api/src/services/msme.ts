import { eq } from "drizzle-orm";
import type { Tx } from "@varchasv/db";
import { dec, money } from "@varchasv/domain";
import { tables } from "@varchasv/db";
import { resolveCompany } from "./accounting.js";
import { outstanding } from "./returns.js";

/** The law's limit: a micro or small enterprise supplier must be paid within 45 days of acceptance, or the cost is not allowed (s. 43B(h)) and interest runs. */
export const MSME_DAYS = 45;
const day = (iso: string) => Math.round(Date.parse(`${iso}T00:00:00Z`) / 86_400_000);

/**
 * What the business owes its micro and small suppliers, bill by bill, and how much of it has gone past 45 days. Suppliers are
 * those marked with an MSME class. Medium enterprises are shown too but are not under the 45 day rule.
 */
export async function msmeReport(tx: Tx, asOf: string, bankRatePct = 6.5) {
  const company = await resolveCompany(tx);
  const suppliers = await tx.select({ id: tables.accounts.id, name: tables.accounts.name, udyam: tables.accounts.udyamNumber, cls: tables.accounts.msmeClass })
    .from(tables.accounts).where(eq(tables.accounts.companyId, company.id));
  const msme = new Map(suppliers.filter((s) => s.cls).map((s) => [s.id, s]));
  const owed = await outstanding(tx, company.id, "payable", asOf);
  const rows = owed.rows.filter((r) => msme.has(r.partyId)).map((r) => {
    const s = msme.get(r.partyId)!;
    const underRule = s.cls !== "medium";
    const bills = r.openItems.map((o) => {
      const age = Math.max(0, day(asOf) - day(o.date));
      const late = underRule && age > MSME_DAYS ? age - MSME_DAYS : 0;
      // Interest the law asks for: three times the bank rate, here counted simply for the days past the limit (the law compounds it monthly, so this is a floor).
      const interest = money(dec(o.amount).times(bankRatePct * 3).div(100).times(late).div(365));
      return { number: o.number, date: o.date, amount: o.amount, interest, ageDays: age, dueBy: new Date((day(o.date) + MSME_DAYS) * 86_400_000).toISOString().slice(0, 10), pastLimit: underRule && age > MSME_DAYS };
    });
    const past = bills.filter((b) => b.pastLimit).reduce((t, b) => t.plus(b.amount), dec(0));
    return { partyId: r.partyId, name: s.name, udyam: s.udyam, msmeClass: s.cls!, underRule, total: money(bills.reduce((t, b) => t.plus(b.amount), dec(0))), pastLimit: money(past), interest: money(bills.reduce((t, b) => t.plus(b.interest), dec(0))), bills };
  }).filter((r) => r.bills.length);
  return {
    asOf, limitDays: MSME_DAYS, bankRatePct, rows,
    totalOwed: money(rows.reduce((t, r) => t.plus(r.total), dec(0))), totalPastLimit: money(rows.reduce((t, r) => t.plus(r.pastLimit), dec(0))),
    /** What to add back to profit for tax: bills to micro and small suppliers still unpaid past 45 days (s. 43B(h)), and the interest running on them. */
    disallowance: money(rows.reduce((t, r) => t.plus(r.pastLimit), dec(0))), totalInterest: money(rows.reduce((t, r) => t.plus(r.interest), dec(0))),
  };
}
