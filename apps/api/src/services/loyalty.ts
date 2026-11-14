import { and, desc, eq, gte, ilike, lte, or, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec, money } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";
import { expiringBy } from "./loyaltylots.js";
import { posSettings } from "./pos.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

export async function listMembers(tx: Tx, q: { search?: string | undefined }) {
  const company = await resolveCompany(tx);
  const term = q.search?.trim();
  return tx.select().from(tables.loyaltyMembers)
    .where(and(eq(tables.loyaltyMembers.companyId, company.id), term ? or(ilike(tables.loyaltyMembers.phone, `%${term}%`), ilike(tables.loyaltyMembers.name, `%${term}%`)) : undefined))
    .orderBy(desc(tables.loyaltyMembers.lifetimePoints)).limit(300);
}

export interface MemberPatch { name?: string | null | undefined; birthday?: string | null | undefined; anniversary?: string | null | undefined }

/** Name and the two dates the shop wishes the member on. */
export async function updateMember(tx: Tx, actor: Actor, phone: string, patch: MemberPatch) {
  const company = await resolveCompany(tx);
  const set: Record<string, unknown> = {};
  if (patch.name !== undefined) set.name = patch.name || null;
  if (patch.birthday !== undefined) set.birthday = patch.birthday || null;
  if (patch.anniversary !== undefined) set.anniversary = patch.anniversary || null;
  const [row] = Object.keys(set).length
    ? await tx.update(tables.loyaltyMembers).set(set).where(and(eq(tables.loyaltyMembers.companyId, company.id), eq(tables.loyaltyMembers.phone, phone))).returning()
    : await tx.select().from(tables.loyaltyMembers).where(and(eq(tables.loyaltyMembers.companyId, company.id), eq(tables.loyaltyMembers.phone, phone)));
  if (!row) throw notFound();
  if (Object.keys(set).length) await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "loyalty_member", entityId: row.id, after: { phone, ...set }, ip: actor.ip });
  return row;
}

/** Birthdays and anniversaries in the next `days` days (this year's date, so the year they were born does not matter). */
export async function upcomingCelebrations(tx: Tx, today: string, days: number) {
  const company = await resolveCompany(tx);
  const members = await tx.select().from(tables.loyaltyMembers).where(and(eq(tables.loyaltyMembers.companyId, company.id), or(sql`${tables.loyaltyMembers.birthday} is not null`, sql`${tables.loyaltyMembers.anniversary} is not null`)));
  const start = Date.parse(`${today}T00:00:00Z`);
  const year = new Date(start).getUTCFullYear();
  const out: { phone: string; name: string | null; kind: "birthday" | "anniversary"; on: string; inDays: number }[] = [];
  for (const m of members) {
    for (const [kind, d] of [["birthday", m.birthday], ["anniversary", m.anniversary]] as const) {
      if (!d) continue;
      // The next occurrence on or after today; 29 February falls on 1 March in a common year.
      for (const y of [year, year + 1]) {
        const at = new Date(Date.UTC(y, Number(d.slice(5, 7)) - 1, Number(d.slice(8, 10))));
        const inDays = Math.round((at.getTime() - start) / 86_400_000);
        if (inDays >= 0) { if (inDays <= days) out.push({ phone: m.phone, name: m.name, kind, on: at.toISOString().slice(0, 10), inDays }); break; }
      }
    }
  }
  return out.sort((a, b) => a.inDays - b.inDays);
}

/** Members, the points they hold (what the shop owes them) and what was earned and redeemed in a period. */
export async function loyaltyReport(tx: Tx, from: string, to: string) {
  const company = await resolveCompany(tx);
  const settings = await posSettings(tx, company.id);
  const [tot] = await tx.select({ members: sql<number>`count(*)::int`, points: sql<number>`coalesce(sum(${tables.loyaltyMembers.points}), 0)::int` }).from(tables.loyaltyMembers).where(eq(tables.loyaltyMembers.companyId, company.id));
  const [flow] = await tx.select({
    earned: sql<number>`coalesce(sum(${tables.posBills.loyaltyEarned}), 0)::int`, redeemed: sql<number>`coalesce(sum(${tables.posBills.loyaltyRedeemed}), 0)::int`,
    bills: sql<number>`count(*) filter (where ${tables.posBills.customerPhone} is not null)::int`,
  }).from(tables.posBills).where(and(eq(tables.posBills.companyId, company.id), eq(tables.posBills.status, "paid"), gte(tables.posBills.date, from), lte(tables.posBills.date, to)));
  const asOf = to > from ? to : from;
  const soon = await expiringBy(tx, null, new Date(Date.parse(`${asOf}T00:00:00Z`) + 30 * 86_400_000).toISOString().slice(0, 10), asOf);
  const top = await tx.select().from(tables.loyaltyMembers).where(eq(tables.loyaltyMembers.companyId, company.id)).orderBy(desc(tables.loyaltyMembers.lifetimePoints)).limit(10);
  return {
    from, to, enabled: settings.loyaltyEnabled, members: tot!.members, pointsHeld: tot!.points, pointValue: settings.loyaltyPointValue,
    liability: money(dec(tot!.points).times(settings.loyaltyPointValue)), validityDays: settings.loyaltyValidityDays, expiringSoon: soon, earned: flow!.earned, redeemed: flow!.redeemed, memberBills: flow!.bills,
    top: top.map((m) => ({ phone: m.phone, name: m.name, points: m.points, lifetimePoints: m.lifetimePoints })),
  };
}
