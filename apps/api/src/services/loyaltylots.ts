import { and, asc, eq, gt, lt, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";

const addDays = (iso: string, n: number) => new Date(Date.parse(`${iso}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

/**
 * Points are kept as lots, one per bill that earned them, each lapsing on its own date when the shop sets a validity.
 * A member's `points` stays the single balance everything else reads; lots decide which part of it has lapsed and
 * which points are spent first (those closest to lapsing). Points from before lots existed never lapse.
 */

/** Points that will lapse by a date, for the member list and the report. */
export async function expiringBy(tx: Tx, memberId: string | null, onOrBefore: string, today: string): Promise<number> {
  const [r] = await tx.select({ n: sql<number>`coalesce(sum(${tables.loyaltyLots.left}), 0)::int` }).from(tables.loyaltyLots)
    .where(and(memberId ? eq(tables.loyaltyLots.memberId, memberId) : undefined, gt(tables.loyaltyLots.left, 0), sql`${tables.loyaltyLots.expiresOn} >= ${today}::date`, sql`${tables.loyaltyLots.expiresOn} <= ${onOrBefore}::date`));
  return r?.n ?? 0;
}

/** What a member can actually spend: the balance less lots that have already lapsed but not yet been taken off. */
export async function lapsedNotRemoved(tx: Tx, memberId: string, today: string): Promise<number> {
  const [r] = await tx.select({ n: sql<number>`coalesce(sum(${tables.loyaltyLots.left}), 0)::int` }).from(tables.loyaltyLots)
    .where(and(eq(tables.loyaltyLots.memberId, memberId), gt(tables.loyaltyLots.left, 0), lt(tables.loyaltyLots.expiresOn, today)));
  return r?.n ?? 0;
}

/** Removes lapsed lots from the balance for good (called when the balance is about to change). Returns the points removed. */
export async function settleLapsed(tx: Tx, memberId: string, today: string): Promise<number> {
  const n = await lapsedNotRemoved(tx, memberId, today);
  if (n <= 0) return 0;
  await tx.update(tables.loyaltyLots).set({ left: 0 }).where(and(eq(tables.loyaltyLots.memberId, memberId), gt(tables.loyaltyLots.left, 0), lt(tables.loyaltyLots.expiresOn, today)));
  await tx.update(tables.loyaltyMembers).set({ points: sql`greatest(${tables.loyaltyMembers.points} - ${n}, 0)` }).where(eq(tables.loyaltyMembers.id, memberId));
  return n;
}

export async function addLot(tx: Tx, input: { tenantId: string; memberId: string; billId: string | null; points: number; on: string; validityDays: number | null }) {
  if (input.points <= 0) return;
  await tx.insert(tables.loyaltyLots).values({
    tenantId: input.tenantId, memberId: input.memberId, billId: input.billId, earned: input.points, left: input.points, earnedOn: input.on,
    expiresOn: input.validityDays ? addDays(input.on, input.validityDays) : null,
  });
}

/** Spends points from the lots that lapse soonest. Points held outside any lot (from before lots) are spent last, and need no lot. */
export async function spendPoints(tx: Tx, memberId: string, points: number) {
  let todo = points;
  const lots = await tx.select().from(tables.loyaltyLots)
    .where(and(eq(tables.loyaltyLots.memberId, memberId), gt(tables.loyaltyLots.left, 0)))
    .orderBy(sql`${tables.loyaltyLots.expiresOn} asc nulls last`, asc(tables.loyaltyLots.earnedOn), asc(tables.loyaltyLots.createdAt));
  for (const lot of lots) {
    if (todo <= 0) break;
    const take = Math.min(lot.left, todo);
    await tx.update(tables.loyaltyLots).set({ left: lot.left - take }).where(eq(tables.loyaltyLots.id, lot.id));
    todo -= take;
  }
}

/** A voided bill gives back what it took and takes back what it gave. */
export async function reverseBill(tx: Tx, input: { tenantId: string; memberId: string; billId: string; earned: number; redeemed: number; on: string; validityDays: number | null }) {
  if (input.earned > 0) await tx.update(tables.loyaltyLots).set({ left: sql`greatest(${tables.loyaltyLots.left} - ${input.earned}, 0)` }).where(and(eq(tables.loyaltyLots.memberId, input.memberId), eq(tables.loyaltyLots.billId, input.billId)));
  if (input.redeemed > 0) await addLot(tx, { tenantId: input.tenantId, memberId: input.memberId, billId: null, points: input.redeemed, on: input.on, validityDays: input.validityDays });
}
