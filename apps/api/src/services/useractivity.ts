import { sql } from "drizzle-orm";
import type { Tx } from "@varchasv/db";

/**
 * Who did what in a period, from the audit trail: for each person the sign-ins, the documents they made, changed and cancelled,
 * and when they were last seen; and the business-wide totals as tiles. Only people who did something in the period are listed.
 */
export async function userActivity(tx: Tx, from: string, to: string) {
  const rows = await tx.execute<{ user_id: string; name: string; logins: number; created: number; changed: number; cancelled: number; vouchers_created: number; vouchers_cancelled: number; days_active: number; last_at: string }>(sql`
    select a.user_id::text, u.name,
      count(*) filter (where a.action = 'login')::int as logins,
      count(*) filter (where a.action = 'create')::int as created,
      count(*) filter (where a.action in ('update', 'delete'))::int as changed,
      count(*) filter (where a.action = 'cancel')::int as cancelled,
      count(*) filter (where a.action = 'create' and a.entity = 'voucher')::int as vouchers_created,
      count(*) filter (where a.action = 'cancel' and a.entity = 'voucher')::int as vouchers_cancelled,
      count(distinct (a.at at time zone 'Asia/Kolkata')::date)::int as days_active,
      max(a.at)::text as last_at
    from audit_log a join users u on u.id = a.user_id
    where a.user_id is not null and (a.at at time zone 'Asia/Kolkata')::date between ${from}::date and ${to}::date
    group by a.user_id, u.name order by count(*) desc, u.name`);
  const people = [...rows].map((r) => ({
    userId: r.user_id, name: r.name, logins: r.logins, created: r.created, changed: r.changed, cancelled: r.cancelled,
    vouchersCreated: r.vouchers_created, vouchersCancelled: r.vouchers_cancelled, daysActive: r.days_active, lastAt: r.last_at,
  }));
  const sum = (f: (p: (typeof people)[number]) => number) => people.reduce((s, p) => s + f(p), 0);
  return {
    from, to, people,
    tiles: { activeUsers: people.length, signIns: sum((p) => p.logins), documentsCreated: sum((p) => p.created), changes: sum((p) => p.changed), cancellations: sum((p) => p.cancelled), vouchersCreated: sum((p) => p.vouchersCreated) },
  };
}
