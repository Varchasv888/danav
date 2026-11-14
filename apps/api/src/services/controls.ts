import { desc, eq, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { businessDate, dec, money } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

/** Pairs of rights that, held by one person, let them do a thing and approve it themselves. */
export const SOD_PAIRS: { a: string; b: string; key: string }[] = [
  { a: "accounts.create", b: "accounts.approve", key: "books" },
  { a: "sales.create", b: "sales.approve", key: "sales" },
  { a: "inventory.edit", b: "inventory.approve", key: "stock" },
  { a: "payroll.edit", b: "payroll.approve", key: "payroll" },
  { a: "expenses.create", b: "expenses.approve", key: "expenses" },
  { a: "purchase.create", b: "special.approveBankChange", key: "supplierBank" },
  { a: "accounts.edit", b: "special.approveBankChange", key: "partyBank" },
  { a: "banking.edit", b: "accounts.create", key: "bank" },
  { a: "users.edit", b: "accounts.approve", key: "access" },
];

/** Who holds both halves of a pair. Owners and admins hold nearly everything by design; the list shows it anyway so it is a choice, not an accident. */
export async function sodConflicts(tx: Tx) {
  const rows = await tx.select({ userId: tables.users.id, name: tables.users.name, email: tables.users.email, role: tables.roles.key, roleName: tables.roles.name, permissions: tables.roles.permissions })
    .from(tables.memberships).innerJoin(tables.users, eq(tables.users.id, tables.memberships.userId)).innerJoin(tables.roles, eq(tables.roles.id, tables.memberships.roleId))
    .where(eq(tables.memberships.status, "active"));
  const people = rows.map((r) => ({ userId: r.userId, name: r.name, email: r.email, role: r.role, roleName: r.roleName, conflicts: SOD_PAIRS.filter((p) => r.permissions.includes(p.a) && r.permissions.includes(p.b)).map((p) => p.key) }));
  return { pairs: SOD_PAIRS.map((p) => p.key), people: people.filter((p) => p.conflicts.length), checked: people.length };
}

const FLAGS = ["round", "weekend", "backdated", "afterHours", "cashOrBank", "duplicate"] as const;

/** Manual journals that look unusual: round sums, Sundays, entered long after their date, entered at night, touching cash or bank, or repeated. */
export async function journalChecks(tx: Tx, from: string, to: string) {
  const company = await resolveCompany(tx);
  const rows = await tx.execute<{ id: string; number: string; date: string; total: string; narration: string | null; by: string | null; created: string; flags: string[] }>(sql`
    select v.id, v.number, v.date::text, v.total::text, v.narration, u.name as by, (v.created_at at time zone 'Asia/Kolkata')::text as created,
      array_remove(array[
        case when v.total >= 10000 and v.total % 10000 = 0 then 'round' end,
        case when extract(dow from v.date) = 0 then 'weekend' end,
        case when (v.created_at at time zone 'Asia/Kolkata')::date - v.date > 30 then 'backdated' end,
        case when extract(hour from (v.created_at at time zone 'Asia/Kolkata')) >= 22 or extract(hour from (v.created_at at time zone 'Asia/Kolkata')) < 6 then 'afterHours' end,
        case when exists (select 1 from gl_entries e join accounts a on a.id = e.account_id join account_groups g on g.id = a.group_id where e.voucher_id = v.id and g.key in ('cash_in_hand', 'bank_accounts')) then 'cashOrBank' end,
        case when exists (select 1 from vouchers w where w.company_id = v.company_id and w.id <> v.id and w.type = 'journal' and w.status = 'posted' and w.total = v.total and abs(w.date - v.date) <= 7) then 'duplicate' end
      ], null) as flags
    from vouchers v left join users u on u.id = v.created_by
    where v.company_id = ${company.id} and v.type = 'journal' and v.status = 'posted' and v.date between ${from}::date and ${to}::date
    order by v.date desc, v.number desc limit 1000`);
  const flagged = [...rows].filter((r) => r.flags.length);
  const counts = Object.fromEntries(FLAGS.map((f) => [f, flagged.filter((r) => r.flags.includes(f)).length]));
  return {
    from, to, checked: [...rows].length, flagged: flagged.length, counts,
    items: flagged.sort((a, b) => b.flags.length - a.flags.length).slice(0, 200).map((r) => ({ id: r.id, number: r.number, date: r.date, total: money(r.total), narration: r.narration, by: r.by, enteredAt: r.created, flags: r.flags })),
  };
}

/** Everything booked against accounts marked as related parties in a period: what they were charged and what they were paid. */
export async function relatedParties(tx: Tx, from: string, to: string) {
  const company = await resolveCompany(tx);
  const rows = await tx.execute<{ id: string; name: string; debit: string; credit: string; vouchers: number }>(sql`
    select a.id, a.name, coalesce(sum(e.debit), 0)::text as debit, coalesce(sum(e.credit), 0)::text as credit, count(distinct e.voucher_id)::int as vouchers
    from accounts a left join gl_entries e on e.account_id = a.id and not e.is_reversal and e.date between ${from}::date and ${to}::date
    where a.company_id = ${company.id} and a.related_party group by a.id, a.name order by a.name`);
  const list = [...rows].map((r) => ({ id: r.id, name: r.name, debit: money(r.debit), credit: money(r.credit), vouchers: r.vouchers }));
  return { from, to, parties: list, totalDebit: money(list.reduce((t, r) => t.plus(r.debit), dec(0))), totalCredit: money(list.reduce((t, r) => t.plus(r.credit), dec(0))) };
}

export async function setRelatedParty(tx: Tx, actor: Actor, accountId: string, value: boolean) {
  const [a] = await tx.update(tables.accounts).set({ relatedParty: value }).where(eq(tables.accounts.id, accountId)).returning();
  if (!a) throw notFound();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "account", entityId: accountId, after: { relatedParty: value, name: a.name }, ip: actor.ip });
}

// ---- access reviews -------------------------------------------------------------------------------------------

export async function listAccessReviews(tx: Tx, today = businessDate()) {
  const rows = await tx.select({ r: tables.accessReviews, by: tables.users.name }).from(tables.accessReviews).leftJoin(tables.users, eq(tables.users.id, tables.accessReviews.startedBy)).orderBy(desc(tables.accessReviews.startedAt));
  const last = rows.find((x) => x.r.completedAt);
  const age = last?.r.completedAt ? Math.round((Date.parse(`${today}T00:00:00Z`) - last.r.completedAt.getTime()) / 86_400_000) : null;
  return {
    lastCompletedAt: last?.r.completedAt?.toISOString() ?? null, daysSince: age, overdue: age === null || age > 90,
    reviews: rows.map((x) => ({ id: x.r.id, startedAt: x.r.startedAt.toISOString(), startedBy: x.by, completedAt: x.r.completedAt?.toISOString() ?? null, members: x.r.members })),
  };
}

/** Starts a review with the members and roles as they are now. Only one can be open at a time. */
export async function startAccessReview(tx: Tx, actor: Actor) {
  const [open] = await tx.select({ id: tables.accessReviews.id }).from(tables.accessReviews).where(sql`${tables.accessReviews.completedAt} is null`).limit(1);
  if (open) throw conflict("review_open");
  const members = (await tx.select({ userId: tables.users.id, name: tables.users.name, email: tables.users.email, role: tables.roles.name }).from(tables.memberships)
    .innerJoin(tables.users, eq(tables.users.id, tables.memberships.userId)).innerJoin(tables.roles, eq(tables.roles.id, tables.memberships.roleId)).where(eq(tables.memberships.status, "active")))
    .map((m) => ({ ...m, decision: null, note: null }));
  const [row] = await tx.insert(tables.accessReviews).values({ tenantId: actor.tenantId, startedBy: actor.userId, members }).returning();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "access_review", entityId: row!.id, after: { members: members.length }, ip: actor.ip });
  return row!;
}

export async function decideMember(tx: Tx, actor: Actor, reviewId: string, userId: string, decision: "keep" | "change" | "remove", note?: string | null) {
  const [r] = await tx.select().from(tables.accessReviews).where(eq(tables.accessReviews.id, reviewId)).for("update");
  if (!r) throw notFound();
  if (r.completedAt) throw conflict("review_closed");
  if (decision !== "keep" && !note?.trim()) throw badRequest("note_required");
  const members = r.members.map((m) => (m.userId === userId ? { ...m, decision, note: note?.trim() || null } : m));
  if (!members.some((m) => m.userId === userId)) throw notFound();
  await tx.update(tables.accessReviews).set({ members }).where(eq(tables.accessReviews.id, reviewId));
}

/** Closes the review once every member has a decision. What was decided is acted on in the team screen; this is the record that it was looked at. */
export async function completeAccessReview(tx: Tx, actor: Actor, reviewId: string) {
  const [r] = await tx.select().from(tables.accessReviews).where(eq(tables.accessReviews.id, reviewId)).for("update");
  if (!r) throw notFound();
  if (r.completedAt) throw conflict("review_closed");
  if (r.members.some((m) => !m.decision)) throw conflict("review_incomplete");
  await tx.update(tables.accessReviews).set({ completedAt: new Date() }).where(eq(tables.accessReviews.id, reviewId));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "access_review", entityId: reviewId, after: { completed: true, changes: r.members.filter((m) => m.decision && m.decision !== "keep").length }, ip: actor.ip });
}

