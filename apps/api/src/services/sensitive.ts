import { sql } from "drizzle-orm";
import type { Tx } from "@varchasv/db";

export const SENSITIVE_KINDS = ["bank", "credit", "tax", "permissions", "period", "payroll", "override", "device"] as const;
export type SensitiveKind = (typeof SENSITIVE_KINDS)[number];

/**
 * Which audit entries are changes that can move money or open a door: bank details, credit terms, tax
 * identity and settings, who may do what, period locks and numbering, payroll settings, credit overrides
 * and device changes. One place decides, so the feed and the home-page alert always agree.
 */
const KIND = sql`case
  when a.entity = 'account' and a.action = 'update' and a.after ?| array['bank'] then 'bank'
  when a.entity = 'employee' and a.action = 'update' and a.after::text ~* 'bank|ifsc' then 'bank'
  when a.entity = 'account' and a.action = 'update' and a.after ?| array['creditLimit', 'creditDays', 'creditControl', 'blockOverdueDays', 'interestRate'] then 'credit'
  when a.entity = 'account' and a.action = 'update' and a.after ?| array['gstin', 'pan', 'stateCode'] then 'tax'
  when a.entity in ('gst_settings', 'gst_session') then 'tax'
  when a.entity = 'company' and a.action = 'update' then 'tax'
  when a.entity in ('role', 'membership') then 'permissions'
  when a.entity in ('fiscal_year', 'number_series') then 'period'
  when a.entity = 'payroll_settings' then 'payroll'
  when a.entity = 'credit_override' then 'override'
  when a.entity = 'device' and a.action = 'update' then 'device'
end`;

/** Shows the last four characters of anything that looks like an account number, never the rest. */
function mask(v: unknown, key = ""): unknown {
  if (typeof v === "string" && /account|acc_?no|accountnumber/i.test(key)) return v.length > 4 ? `${"*".repeat(v.length - 4)}${v.slice(-4)}` : v;
  if (Array.isArray(v)) return v.map((x) => mask(x, key));
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, mask(x, k)]));
  return v;
}

export interface SensitiveRow {
  id: string; at: string; user: string | null; entity: string; action: string; entityId: string | null; kind: SensitiveKind; before: unknown; after: unknown;
}

export async function sensitiveChanges(tx: Tx, from: string, to: string, kind?: SensitiveKind): Promise<{ from: string; to: string; rows: SensitiveRow[] }> {
  const rows = await tx.execute<{ id: string; at: string; user_name: string | null; entity: string; action: string; entity_id: string | null; kind: SensitiveKind; before: unknown; after: unknown }>(sql`
    select * from (
      select a.id::text, to_char(a.at at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as at, u.name as user_name, a.entity, a.action, a.entity_id, a.before, a.after, ${KIND} as kind
      from audit_log a left join users u on u.id = a.user_id
      where a.at >= ${from}::date and a.at < (${to}::date + 1)
    ) s where s.kind is not null${kind ? sql` and s.kind = ${kind}` : sql``}
    order by s.id::bigint desc limit 300`);
  return { from, to, rows: [...rows].map((r) => ({ id: r.id, at: r.at, user: r.user_name, entity: r.entity, action: r.action, entityId: r.entity_id, kind: r.kind, before: mask(r.before), after: mask(r.after) })) };
}

/** How many sensitive changes were made in the last days, for the home-page alert. */
export async function recentSensitiveCount(tx: Tx, days = 7): Promise<number> {
  const [r] = await tx.execute<{ n: number }>(sql`
    select count(*)::int as n from (select ${KIND} as kind from audit_log a where a.at >= now() - (${days}::int * interval '1 day')) s where s.kind is not null`);
  return r?.n ?? 0;
}
