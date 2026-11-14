import { randomUUID } from "node:crypto";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { DEFAULT_RULES, businessDate, dec, matchRecords, money, type ReconRules } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, forbidden, notFound } from "../lib/errors.js";
import { postVoucher, resolveCompany } from "./accounting.js";
import { resolvePostingAccountId } from "./ledgerparameters.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

export const REASON_CODES = ["timing", "missing_document", "wrong_amount", "duplicate", "disputed", "bank_charge", "other"] as const;
export const KINDS = ["customer_statement", "supplier_statement"] as const;
type Kind = (typeof KINDS)[number];

const day = (iso: string) => Date.parse(`${iso}T00:00:00Z`) / 86_400_000;

async function log(tx: Tx, actor: Actor, runId: string, action: string, detail: Record<string, unknown> = {}, itemId: string | null = null) {
  await tx.insert(tables.reconEvents).values({ tenantId: actor.tenantId, runId, itemId, action, detail, by: actor.userId });
}

/**
 * Starts a reconciliation of a customer's or supplier's statement against our ledger for a period. Our side is the party's ledger entries in the period;
 * their side is the rows of the statement they sent. Both are signed so that a positive amount adds to what the party owes us (customers) or what we owe
 * them (suppliers). The records are paired by the matching rules and the rest are left as exceptions.
 */
export async function startRun(tx: Tx, actor: Actor, input: { kind: Kind; partyId: string; from: string; to: string; theirs: { ref?: string | undefined; date: string; amount: string; description?: string | undefined }[]; theirClosing?: string | null | undefined; rules?: Partial<ReconRules> | undefined }) {
  if (!(KINDS as readonly string[]).includes(input.kind)) throw badRequest("invalid_kind");
  if (input.to < input.from) throw badRequest("invalid_period");
  const company = await resolveCompany(tx);
  const [party] = await tx.select().from(tables.accounts).where(and(eq(tables.accounts.id, input.partyId), eq(tables.accounts.companyId, company.id)));
  if (!party) throw badRequest("unknown_account");
  const rules: ReconRules = { ...DEFAULT_RULES, ...(input.rules ?? {}) };
  const [run] = await tx.insert(tables.reconRuns).values({
    tenantId: actor.tenantId, companyId: company.id, kind: input.kind, partyId: party.id, fromDate: input.from, toDate: input.to, rules, theirClosing: input.theirClosing ? money(input.theirClosing) : null, createdBy: actor.userId,
  }).returning();
  const entries = await tx.execute<{ voucher_id: string; number: string; date: string; amount: string; narration: string | null }>(sql`
    select e.voucher_id, v.number, e.date::text, ${input.kind === "customer_statement" ? sql`(e.debit - e.credit)` : sql`(e.credit - e.debit)`}::text as amount, v.narration
    from gl_entries e join vouchers v on v.id = e.voucher_id and v.status = 'posted'
    where e.account_id = ${party.id} and not e.is_reversal and e.date between ${input.from}::date and ${input.to}::date order by e.date, e.id`);
  const ours = [...entries].map((e) => ({ id: randomUUID(), ref: e.number, date: e.date, amount: money(e.amount), description: e.narration?.slice(0, 160) ?? null, sourceVoucherId: e.voucher_id }));
  const theirs = input.theirs.map((r) => ({ id: randomUUID(), ref: (r.ref ?? "").slice(0, 60), date: r.date, amount: money(r.amount), description: r.description?.slice(0, 160) ?? null }));
  const result = matchRecords(ours.map((o) => ({ id: o.id, ref: o.ref, date: o.date, amount: o.amount })), theirs.map((t) => ({ id: t.id, ref: t.ref, date: t.date, amount: t.amount })), rules);
  const group = new Map<string, { group: string; rule: string }>();
  for (const m of result.matches) {
    const g = randomUUID();
    for (const id of [...m.ours, ...m.theirs]) group.set(id, { group: g, rule: m.rule });
  }
  const rows = [
    ...ours.map((o) => ({ ...o, side: "ours" as const })),
    ...theirs.map((t) => ({ ...t, side: "theirs" as const, sourceVoucherId: null })),
  ].map((r) => ({
    id: r.id, tenantId: actor.tenantId, runId: run!.id, side: r.side, ref: r.ref, date: r.date, amount: r.amount, description: r.description, sourceVoucherId: r.sourceVoucherId,
    status: group.has(r.id) ? "matched" : "unmatched", groupId: group.get(r.id)?.group ?? null, rule: group.get(r.id)?.rule ?? null, matchedBy: group.has(r.id) ? "auto" : null,
  }));
  if (rows.length) await tx.insert(tables.reconItems).values(rows);
  await log(tx, actor, run!.id, "started", { kind: input.kind, party: party.name, ours: ours.length, theirs: theirs.length, matchedGroups: result.matches.length });
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "recon_run", entityId: run!.id, after: { kind: input.kind, party: party.name }, ip: actor.ip });
  return getRun(tx, run!.id);
}

export async function listRuns(tx: Tx) {
  const company = await resolveCompany(tx);
  const runs = await tx.select({ r: tables.reconRuns, party: tables.accounts.name }).from(tables.reconRuns).leftJoin(tables.accounts, eq(tables.accounts.id, tables.reconRuns.partyId))
    .where(eq(tables.reconRuns.companyId, company.id)).orderBy(desc(tables.reconRuns.createdAt));
  const open = await tx.select({ runId: tables.reconItems.runId, n: sql<number>`count(*)::int` }).from(tables.reconItems).where(eq(tables.reconItems.status, "unmatched")).groupBy(tables.reconItems.runId);
  return runs.map((x) => ({ id: x.r.id, kind: x.r.kind, party: x.party, from: x.r.fromDate, to: x.r.toDate, status: x.r.status, createdAt: x.r.createdAt.toISOString(), exceptions: open.find((o) => o.runId === x.r.id)?.n ?? 0 }));
}

export async function getRun(tx: Tx, id: string, today = businessDate()) {
  const [r] = await tx.select({ r: tables.reconRuns, party: tables.accounts.name }).from(tables.reconRuns).leftJoin(tables.accounts, eq(tables.accounts.id, tables.reconRuns.partyId)).where(eq(tables.reconRuns.id, id));
  if (!r) throw notFound();
  const items = await tx.select({ i: tables.reconItems, owner: tables.users.name }).from(tables.reconItems).leftJoin(tables.users, eq(tables.users.id, tables.reconItems.ownerId))
    .where(eq(tables.reconItems.runId, id)).orderBy(asc(tables.reconItems.date), asc(tables.reconItems.side));
  const events = await tx.select({ e: tables.reconEvents, by: tables.users.name }).from(tables.reconEvents).leftJoin(tables.users, eq(tables.users.id, tables.reconEvents.by)).where(eq(tables.reconEvents.runId, id)).orderBy(asc(tables.reconEvents.id));
  const writeoffs = await tx.select().from(tables.reconWriteoffs).where(eq(tables.reconWriteoffs.runId, id)).orderBy(desc(tables.reconWriteoffs.createdAt));
  const list = items.map((x) => ({
    id: x.i.id, side: x.i.side, ref: x.i.ref, date: x.i.date, amount: x.i.amount, description: x.i.description, status: x.i.status, groupId: x.i.groupId, rule: x.i.rule, matchedBy: x.i.matchedBy,
    reasonCode: x.i.reasonCode, ownerId: x.i.ownerId, owner: x.owner, note: x.i.note, evidenceFileId: x.i.evidenceFileId, ageDays: Math.max(0, day(today) - day(x.i.date)),
  }));
  const sum = (xs: typeof list) => xs.reduce((t, i) => t.plus(i.amount), dec(0));
  const open = list.filter((i) => i.status === "unmatched");
  const bucket = (lo: number, hi: number) => open.filter((i) => i.ageDays >= lo && i.ageDays <= hi).length;
  const ours = sum(list.filter((i) => i.side === "ours"));
  const theirs = sum(list.filter((i) => i.side === "theirs"));
  return {
    id: r.r.id, kind: r.r.kind, party: r.party, partyId: r.r.partyId, from: r.r.fromDate, to: r.r.toDate, status: r.r.status, rules: r.r.rules, theirClosing: r.r.theirClosing,
    totals: { ours: money(ours), theirs: money(theirs), difference: money(ours.minus(theirs)), unmatchedOurs: money(sum(open.filter((i) => i.side === "ours"))), unmatchedTheirs: money(sum(open.filter((i) => i.side === "theirs"))), exceptions: open.length },
    ageing: { d0_30: bucket(0, 30), d31_60: bucket(31, 60), d61_90: bucket(61, 90), over90: bucket(91, 99999) },
    items: list,
    events: events.map((e) => ({ id: e.e.id, action: e.e.action, detail: e.e.detail, by: e.by, at: e.e.at.toISOString(), itemId: e.e.itemId })),
    writeoffs: writeoffs.map((w) => ({ id: w.id, itemIds: w.itemIds, amount: w.amount, reasonCode: w.reasonCode, note: w.note, status: w.status, requestedBy: w.requestedBy, createdAt: w.createdAt.toISOString() })),
  };
}

async function openRun(tx: Tx, id: string) {
  const [r] = await tx.select().from(tables.reconRuns).where(eq(tables.reconRuns.id, id)).for("update");
  if (!r) throw notFound();
  if (r.status !== "open") throw conflict("run_closed");
  return r;
}

/** Pairs records by hand (one or many from either side). The difference between the sides is kept on record. */
export async function manualMatch(tx: Tx, actor: Actor, runId: string, itemIds: string[]) {
  await openRun(tx, runId);
  const items = await tx.select().from(tables.reconItems).where(and(eq(tables.reconItems.runId, runId), inArray(tables.reconItems.id, itemIds)));
  if (items.length !== itemIds.length || items.some((i) => i.status !== "unmatched")) throw badRequest("items_not_open");
  if (!items.some((i) => i.side === "ours") || !items.some((i) => i.side === "theirs")) throw badRequest("need_both_sides");
  const diff = items.reduce((t, i) => t.plus(i.side === "ours" ? i.amount : dec(i.amount).neg()), dec(0));
  const group = randomUUID();
  await tx.update(tables.reconItems).set({ status: "matched", groupId: group, rule: "manual", matchedBy: "manual" }).where(inArray(tables.reconItems.id, itemIds));
  await log(tx, actor, runId, "matched", { group, items: itemIds.length, difference: money(diff) });
  return { group, difference: money(diff) };
}

/** Breaks a pairing, automatic or manual. The pairing and who undid it stay in the history. */
export async function unmatch(tx: Tx, actor: Actor, runId: string, groupId: string) {
  await openRun(tx, runId);
  const done = await tx.update(tables.reconItems).set({ status: "unmatched", groupId: null, rule: null, matchedBy: null }).where(and(eq(tables.reconItems.runId, runId), eq(tables.reconItems.groupId, groupId))).returning({ id: tables.reconItems.id });
  if (!done.length) throw notFound();
  await log(tx, actor, runId, "unmatched", { group: groupId, items: done.length });
}

/** Gives an exception a reason, an owner who will chase it, a note and evidence. */
export async function annotate(tx: Tx, actor: Actor, itemId: string, input: { reasonCode?: string | null | undefined; ownerId?: string | null | undefined; note?: string | null | undefined; evidenceFileId?: string | null | undefined }) {
  const [item] = await tx.select().from(tables.reconItems).where(eq(tables.reconItems.id, itemId)).for("update");
  if (!item) throw notFound();
  await openRun(tx, item.runId);
  if (input.reasonCode && !(REASON_CODES as readonly string[]).includes(input.reasonCode)) throw badRequest("invalid_reason");
  const set: Partial<typeof tables.reconItems.$inferInsert> = {};
  if (input.reasonCode !== undefined) set.reasonCode = input.reasonCode;
  if (input.ownerId !== undefined) set.ownerId = input.ownerId;
  if (input.note !== undefined) set.note = input.note?.trim() || null;
  if (input.evidenceFileId !== undefined) set.evidenceFileId = input.evidenceFileId;
  await tx.update(tables.reconItems).set(set).where(eq(tables.reconItems.id, itemId));
  await log(tx, actor, item.runId, "annotated", { ...input }, itemId);
}

/** Asks for the chosen exceptions to be written off. Someone else with the approve right decides; approving books the difference. */
export async function requestWriteOff(tx: Tx, actor: Actor, runId: string, input: { itemIds: string[]; reasonCode: string; note: string }) {
  await openRun(tx, runId);
  if (!(REASON_CODES as readonly string[]).includes(input.reasonCode)) throw badRequest("invalid_reason");
  if (!input.note.trim()) throw badRequest("note_required");
  const items = await tx.select().from(tables.reconItems).where(and(eq(tables.reconItems.runId, runId), inArray(tables.reconItems.id, input.itemIds)));
  if (!items.length || items.length !== input.itemIds.length || items.some((i) => i.status !== "unmatched")) throw badRequest("items_not_open");
  const net = items.reduce((t, i) => t.plus(i.side === "ours" ? i.amount : dec(i.amount).neg()), dec(0));
  const [row] = await tx.insert(tables.reconWriteoffs).values({ tenantId: actor.tenantId, runId, itemIds: input.itemIds, amount: money(net), reasonCode: input.reasonCode, note: input.note.trim(), requestedBy: actor.userId }).returning();
  await log(tx, actor, runId, "writeoff_requested", { writeoff: row!.id, amount: money(net), reasonCode: input.reasonCode, items: items.length });
  return row!;
}

export async function decideWriteOff(tx: Tx, actor: Actor, writeoffId: string, decision: "approve" | "reject") {
  const [w] = await tx.select().from(tables.reconWriteoffs).where(eq(tables.reconWriteoffs.id, writeoffId)).for("update");
  if (!w) throw notFound();
  if (w.status !== "pending") throw conflict("writeoff_already_decided");
  if (w.requestedBy === actor.userId) throw forbidden("cannot_approve_own_writeoff");
  const run = await openRun(tx, w.runId);
  let voucherId: string | null = null;
  if (decision === "approve") {
    const items = await tx.select().from(tables.reconItems).where(inArray(tables.reconItems.id, w.itemIds));
    if (items.some((i) => i.status !== "unmatched")) throw conflict("items_changed");
    const net = dec(w.amount);
    if (!net.isZero() && run.partyId) {
      const diffAccountId = await resolvePostingAccountId(tx, run.companyId, "recon_differences");
      // Move our ledger toward theirs by the net difference. Customers: our amount is debit less credit; suppliers: credit less debit.
      const amount = money(net.abs());
      const customer = run.kind === "customer_statement";
      const reduce = net.gt(0); // we show more than they do
      const partyDebit = customer ? !reduce : reduce;
      const lines = partyDebit ? [{ accountId: run.partyId, debit: amount }, { accountId: diffAccountId, credit: amount }] : [{ accountId: diffAccountId, debit: amount }, { accountId: run.partyId, credit: amount }];
      voucherId = (await postVoucher(tx, actor, { companyId: run.companyId, type: "journal", date: businessDate(), reference: "Reconciliation", narration: `Reconciliation difference written off (${w.reasonCode}): ${w.note ?? ""}`.slice(0, 250), lines })).voucher.id;
    }
    await tx.update(tables.reconItems).set({ status: "written_off", reasonCode: w.reasonCode }).where(inArray(tables.reconItems.id, w.itemIds));
  }
  await tx.update(tables.reconWriteoffs).set({ status: decision === "approve" ? "approved" : "rejected", decidedBy: actor.userId, decidedAt: new Date(), voucherId }).where(eq(tables.reconWriteoffs.id, writeoffId));
  await log(tx, actor, w.runId, decision === "approve" ? "writeoff_approved" : "writeoff_rejected", { writeoff: writeoffId, amount: w.amount });
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "recon_writeoff", entityId: writeoffId, after: { decision, amount: w.amount }, ip: actor.ip });
}

/** Finishes the run. Every exception must have a reason and an owner, or have been written off. */
export async function closeRun(tx: Tx, actor: Actor, runId: string) {
  await openRun(tx, runId);
  const open = await tx.select().from(tables.reconItems).where(and(eq(tables.reconItems.runId, runId), eq(tables.reconItems.status, "unmatched")));
  if (open.some((i) => !i.reasonCode || !i.ownerId)) throw conflict("exceptions_need_owner");
  await tx.update(tables.reconRuns).set({ status: "closed", closedAt: new Date() }).where(eq(tables.reconRuns.id, runId));
  await log(tx, actor, runId, "closed", { exceptions: open.length });
}
