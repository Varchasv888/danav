import { and, asc, desc, eq, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec, money } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, forbidden, notFound } from "../lib/errors.js";
import { accountBalances, balanceSheet, profitAndLoss, resolveCompany, trialBalance } from "./accounting.js";
import { integrityChecks } from "./integrity.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

const PERIOD = /^\d{4}-\d{2}$/;
const bounds = (period: string) => {
  if (!PERIOD.test(period)) throw badRequest("invalid_period");
  const [y, m] = [Number(period.slice(0, 4)), Number(period.slice(5, 7))];
  return { start: `${period}-01`, end: new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10) };
};

export interface CloseItem {
  key: string;
  /** error: blocks closing until fixed or signed off with a note; warn: signed off when understood. */
  severity: "error" | "warn";
  group: "documents" | "reconcile" | "cutoff" | "books";
  count: number;
  amount: string | null;
  items: { ref: string; detail: string }[];
  signed: { by: string | null; at: string; note: string | null } | null;
  /** True when nothing is outstanding, or a person has signed it off. */
  clear: boolean;
}

const LIST = 8;

/**
 * The month-end checklist: what is still half-done, what has not reached the ledger, and what is in transit across the cut-off date.
 * Each line is worked out from the books and can be signed off with a note when the owner has looked and accepts it.
 */
export async function closeChecklist(tx: Tx, period: string) {
  const company = await resolveCompany(tx);
  const cid = company.id;
  const { start, end } = bounds(period);
  const signed = new Map((await tx.select({ s: tables.closeSignoffs, name: tables.users.name }).from(tables.closeSignoffs)
    .leftJoin(tables.users, eq(tables.users.id, tables.closeSignoffs.signedBy)).where(and(eq(tables.closeSignoffs.companyId, cid), eq(tables.closeSignoffs.period, period))))
    .map((r) => [r.s.key, { by: r.name, at: r.s.signedAt.toISOString(), note: r.s.note }]));
  const items: CloseItem[] = [];
  const add = (key: string, severity: CloseItem["severity"], group: CloseItem["group"], rows: { ref: string; detail: string }[], amount: string | null = null, count = rows.length) => {
    const s = signed.get(key) ?? null;
    items.push({ key, severity, group, count, amount, items: rows.slice(0, LIST), signed: s, clear: count === 0 || !!s });
  };
  const rowsOf = async <T extends Record<string, unknown>>(q: ReturnType<typeof sql>) => [...(await tx.execute<T>(q))];

  // Documents left half-done.
  const draftPayroll = await rowsOf<{ period: string }>(sql`select period from payroll_runs where company_id = ${cid} and status = 'draft' and period <= ${period}`);
  add("draftPayroll", "error", "documents", draftPayroll.map((r) => ({ ref: r.period, detail: "draft" })));
  const claims = await rowsOf<{ number: string; title: string }>(sql`select number, title from expense_claims where company_id = ${cid} and status in ('draft', 'submitted') and date <= ${end}::date`);
  add("openClaims", "warn", "documents", claims.map((r) => ({ ref: r.number, detail: r.title })));
  const noVoucher = await rowsOf<{ number: string }>(sql`
    select number from sales_invoices where company_id = ${cid} and status = 'posted' and voucher_id is null and date between ${start}::date and ${end}::date`);
  add("unpostedInvoices", "error", "documents", noVoucher.map((r) => ({ ref: r.number, detail: "no voucher" })));

  // Reconciliation.
  const bank = await rowsOf<{ date: string; narration: string | null; amount: string }>(sql`
    select date::text, description as narration, (credit + debit)::text as amount from bank_lines where company_id = ${cid} and status = 'unmatched' and date <= ${end}::date order by date desc limit 200`);
  add("unmatchedBank", "warn", "reconcile", bank.map((r) => ({ ref: r.date, detail: `${r.narration ?? ""} ${money(r.amount)}`.trim() })));
  const suspense = (await accountBalances(tx, cid, null, end)).filter((r) => r.groupName.toLowerCase().includes("suspense") && !dec(r.closing).isZero());
  add("suspense", "error", "reconcile", suspense.map((r) => ({ ref: r.name, detail: money(r.closing) })), suspense.length ? money(suspense.reduce((t, r) => t.plus(r.closing), dec(0))) : null);
  const sessions = await rowsOf<{ code: string; day: string; difference: string }>(sql`
    select t.code, (s.opened_at at time zone 'Asia/Kolkata')::date::text as day, s.difference::text from pos_sessions s join pos_terminals t on t.id = s.terminal_id
    where t.company_id = ${cid} and s.status = 'closed' and s.difference <> 0 and s.variance_signed_by is null and (s.opened_at at time zone 'Asia/Kolkata')::date <= ${end}::date`);
  add("cashVariance", "error", "reconcile", sessions.map((r) => ({ ref: `${r.code} ${r.day}`, detail: money(r.difference) })));
  const openShifts = await rowsOf<{ code: string; day: string }>(sql`
    select t.code, (s.opened_at at time zone 'Asia/Kolkata')::date::text as day from pos_sessions s join pos_terminals t on t.id = s.terminal_id where t.company_id = ${cid} and s.status = 'open' and (s.opened_at at time zone 'Asia/Kolkata')::date < ${end}::date`);
  add("openShifts", "warn", "reconcile", openShifts.map((r) => ({ ref: r.code, detail: `open since ${r.day}` })));

  // Cut-off: goods and bills that sit on the wrong side of the month end.
  const transit = await rowsOf<{ number: string; date: string }>(sql`select number, date::text from stock_transfers where company_id = ${cid} and status = 'in_transit' and date <= ${end}::date order by date`);
  add("goodsInTransit", "warn", "cutoff", transit.map((r) => ({ ref: r.number, detail: r.date })));
  const received = await rowsOf<{ number: string; date: string }>(sql`select number, date::text from goods_receipts where company_id = ${cid} and status = 'posted' and date <= ${end}::date order by date`);
  add("receivedNotBilled", "warn", "cutoff", received.map((r) => ({ ref: r.number, detail: r.date })));
  const dispatched = await rowsOf<{ number: string; date: string }>(sql`
    select number, date::text from delivery_notes where company_id = ${cid} and status = 'posted' and reason = 'supply' and date <= ${end}::date order by date`);
  add("dispatchedNotBilled", "warn", "cutoff", dispatched.map((r) => ({ ref: r.number, detail: r.date })));

  // Books.
  const neg = await rowsOf<{ item: string; warehouse: string; qty: string }>(sql`
    select i.name as item, w.name as warehouse, sum(s.qty_in - s.qty_out)::text as qty from stock_ledger s join items i on i.id = s.item_id join warehouses w on w.id = s.warehouse_id
    where s.company_id = ${cid} and s.date <= ${end}::date group by i.id, w.id having sum(s.qty_in - s.qty_out) < 0 limit 200`);
  add("negativeStock", "warn", "books", neg.map((r) => ({ ref: r.item, detail: `${r.warehouse}: ${Number(r.qty)}` })));
  const integrity = await integrityChecks(tx, end);
  const broken = integrity.checks.filter((c) => !c.ok && c.severity === "error");
  add("integrity", "error", "books", broken.map((c) => ({ ref: c.key, detail: c.difference ?? String(c.count) })));
  const [dep] = await rowsOf<{ n: number; due: number }>(sql`
    select (select count(*)::int from assets where company_id = ${cid} and status = 'active') as n,
           (select count(*)::int from depreciation_runs where company_id = ${cid} and status = 'posted' and to_date >= ${end}::date) as due`);
  add("depreciation", "warn", "books", dep && dep.n > 0 && dep.due === 0 ? [{ ref: period, detail: "no depreciation run reaches this month end" }] : []);

  const [closed] = await tx.select().from(tables.monthCloses).where(and(eq(tables.monthCloses.companyId, cid), eq(tables.monthCloses.period, period)));
  return {
    period, from: start, to: end, items,
    ready: items.every((i) => i.clear),
    open: items.filter((i) => !i.clear).length,
    closed: closed && !closed.reopenedAt ? { at: closed.closedAt.toISOString(), reopened: false } : closed ? { at: closed.closedAt.toISOString(), reopened: true } : null,
  };
}

export async function signOff(tx: Tx, actor: Actor, period: string, key: string, note?: string | null) {
  bounds(period);
  const company = await resolveCompany(tx);
  const list = await closeChecklist(tx, period);
  const item = list.items.find((i) => i.key === key);
  if (!item) throw badRequest("unknown_check");
  if (item.count === 0) throw badRequest("nothing_to_sign");
  if (!note?.trim()) throw badRequest("note_required");
  await tx.insert(tables.closeSignoffs).values({ tenantId: actor.tenantId, companyId: company.id, period, key, note: note.trim(), signedBy: actor.userId })
    .onConflictDoUpdate({ target: [tables.closeSignoffs.companyId, tables.closeSignoffs.period, tables.closeSignoffs.key], set: { note: note.trim(), signedBy: actor.userId, signedAt: new Date() } });
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "close_signoff", entityId: null, after: { period, key, count: item.count, note: note.trim() }, ip: actor.ip });
}

export async function removeSignOff(tx: Tx, actor: Actor, period: string, key: string) {
  bounds(period);
  const company = await resolveCompany(tx);
  const gone = await tx.delete(tables.closeSignoffs).where(and(eq(tables.closeSignoffs.companyId, company.id), eq(tables.closeSignoffs.period, period), eq(tables.closeSignoffs.key, key))).returning();
  if (!gone.length) throw notFound();
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "delete", entity: "close_signoff", entityId: null, before: { period, key }, ip: actor.ip });
}

const KINDS = ["trial_balance", "profit_loss", "balance_sheet"] as const;

/** Saves the month's main reports as they stand now. The next one for the same month is version 2: a restatement, kept beside the first. */
export async function takeSnapshots(tx: Tx, actor: Actor, period: string) {
  const company = await resolveCompany(tx);
  const { start, end } = bounds(period);
  const data = {
    trial_balance: await trialBalance(tx, company.id, end),
    profit_loss: await profitAndLoss(tx, company.id, start, end),
    balance_sheet: await balanceSheet(tx, company.id, company.booksBeginOn, end),
  };
  const made: { kind: string; version: number }[] = [];
  for (const kind of KINDS) {
    const [last] = await tx.select({ v: tables.reportSnapshots.version }).from(tables.reportSnapshots)
      .where(and(eq(tables.reportSnapshots.companyId, company.id), eq(tables.reportSnapshots.period, period), eq(tables.reportSnapshots.kind, kind))).orderBy(desc(tables.reportSnapshots.version)).limit(1);
    const version = (last?.v ?? 0) + 1;
    await tx.insert(tables.reportSnapshots).values({ tenantId: actor.tenantId, companyId: company.id, period, kind, version, filters: { from: start, to: end }, data: data[kind] as never, takenBy: actor.userId });
    made.push({ kind, version });
  }
  return made;
}

/** Closes the month: every line clear or signed off, then the reports are saved. Needs the approve right. */
export async function closeMonth(tx: Tx, actor: Actor, period: string) {
  const company = await resolveCompany(tx);
  const list = await closeChecklist(tx, period);
  if (list.closed && !list.closed.reopened) throw conflict("already_closed");
  if (!list.ready) throw conflict("checklist_open");
  const snapshots = await takeSnapshots(tx, actor, period);
  await tx.insert(tables.monthCloses).values({ tenantId: actor.tenantId, companyId: company.id, period, closedBy: actor.userId })
    .onConflictDoUpdate({ target: [tables.monthCloses.companyId, tables.monthCloses.period], set: { closedBy: actor.userId, closedAt: new Date(), reopenedAt: null, reopenReason: null } });
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "month_close", entityId: null, after: { period, snapshots }, ip: actor.ip });
  return { period, snapshots };
}

/** A closed month can be opened again, with a reason. What was saved at the close stays; saving again makes a restatement. */
export async function reopenMonth(tx: Tx, actor: Actor, period: string, reason: string) {
  const company = await resolveCompany(tx);
  if (!reason.trim()) throw badRequest("note_required");
  const [c] = await tx.update(tables.monthCloses).set({ reopenedAt: new Date(), reopenReason: reason.trim() })
    .where(and(eq(tables.monthCloses.companyId, company.id), eq(tables.monthCloses.period, period), sql`${tables.monthCloses.reopenedAt} is null`)).returning();
  if (!c) throw conflict("not_closed");
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "month_close", entityId: c.id, after: { period, reopened: reason.trim() }, ip: actor.ip });
}

/** The versions saved for a month, with what changed between the first and the latest on the headline figures. */
export async function snapshotsFor(tx: Tx, period: string) {
  const company = await resolveCompany(tx);
  bounds(period);
  const rows = await tx.select({ s: tables.reportSnapshots, by: tables.users.name }).from(tables.reportSnapshots).leftJoin(tables.users, eq(tables.users.id, tables.reportSnapshots.takenBy))
    .where(and(eq(tables.reportSnapshots.companyId, company.id), eq(tables.reportSnapshots.period, period))).orderBy(asc(tables.reportSnapshots.kind), asc(tables.reportSnapshots.version));
  const head = (kind: string, data: Record<string, unknown>) => (kind === "profit_loss" ? { netProfit: data.netProfit, grossProfit: data.grossProfit } : kind === "balance_sheet" ? { totalAssets: data.totalAssets, totalLiabilities: data.totalLiabilities } : { totalDebit: data.totalDebit, totalCredit: data.totalCredit });
  const list = rows.map((r) => ({ id: r.s.id, kind: r.s.kind, version: r.s.version, takenAt: r.s.takenAt.toISOString(), takenBy: r.by, filters: r.s.filters, headline: head(r.s.kind, r.s.data as Record<string, unknown>) }));
  const restated = KINDS.flatMap((kind) => {
    const mine = list.filter((x) => x.kind === kind);
    if (mine.length < 2) return [];
    const [first, latest] = [mine[0]!, mine[mine.length - 1]!];
    const changed = Object.entries(latest.headline).filter(([k, v]) => String(v) !== String((first.headline as Record<string, unknown>)[k]));
    return changed.length ? [{ kind, from: first.version, to: latest.version, changes: changed.map(([k, v]) => ({ field: k, was: String((first.headline as Record<string, unknown>)[k]), now: String(v) })) }] : [];
  });
  return { snapshots: list, restatements: restated };
}

export async function getSnapshot(tx: Tx, id: string) {
  const [s] = await tx.select().from(tables.reportSnapshots).where(eq(tables.reportSnapshots.id, id));
  if (!s) throw notFound();
  return s;
}

// ---- daily point-of-sale close --------------------------------------------------------------------------

/** The day's shifts with their cash difference and who signed it off. */
export async function dayClose(tx: Tx, date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw badRequest("invalid_date");
  const company = await resolveCompany(tx);
  const rows = await tx.select({ s: tables.posSessions, code: tables.posTerminals.code, name: tables.posTerminals.name, closer: tables.users.name }).from(tables.posSessions)
    .innerJoin(tables.posTerminals, eq(tables.posTerminals.id, tables.posSessions.terminalId)).leftJoin(tables.users, eq(tables.users.id, tables.posSessions.closedBy))
    .where(and(eq(tables.posTerminals.companyId, company.id), sql`(${tables.posSessions.openedAt} at time zone 'Asia/Kolkata')::date = ${date}::date`)).orderBy(asc(tables.posTerminals.code), asc(tables.posSessions.openedAt));
  const sessions = rows.map((r) => ({
    id: r.s.id, terminal: `${r.code} ${r.name}`, status: r.s.status, openedAt: r.s.openedAt.toISOString(), closedAt: r.s.closedAt?.toISOString() ?? null, closedBy: r.closer,
    expectedCash: r.s.expectedCash, countedCash: r.s.countedCash, difference: r.s.difference, totals: r.s.totals,
    needsSignOff: r.s.status === "closed" && !!r.s.difference && !dec(r.s.difference).isZero() && !r.s.varianceSignedBy, signedAt: r.s.varianceSignedAt?.toISOString() ?? null, signNote: r.s.varianceNote,
  }));
  return {
    date, sessions,
    open: sessions.filter((s) => s.status === "open").length, needSignOff: sessions.filter((s) => s.needsSignOff).length,
    totalDifference: money(sessions.reduce((t, s) => t.plus(s.difference ?? 0), dec(0))),
  };
}

/** Someone with the approve right accepts a shift's cash difference, with a note. They cannot sign off a shift they closed themselves. */
export async function signVariance(tx: Tx, actor: Actor, sessionId: string, note: string) {
  const [s] = await tx.select().from(tables.posSessions).where(eq(tables.posSessions.id, sessionId)).for("update");
  if (!s) throw notFound();
  if (s.status !== "closed") throw conflict("session_open");
  if (!s.difference || dec(s.difference).isZero()) throw badRequest("no_variance");
  if (s.varianceSignedBy) throw conflict("already_signed");
  if (s.closedBy === actor.userId) throw forbidden("cannot_sign_own_shift");
  if (!note.trim()) throw badRequest("note_required");
  await tx.update(tables.posSessions).set({ varianceSignedBy: actor.userId, varianceSignedAt: new Date(), varianceNote: note.trim() }).where(eq(tables.posSessions.id, sessionId));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "pos_session", entityId: sessionId, after: { varianceSignedOff: true, difference: s.difference, note: note.trim() }, ip: actor.ip });
}

