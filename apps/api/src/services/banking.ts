import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import {
  businessDate, BankError, checkStatement, CASH_BANK_GROUPS, applyRules, dec, lineFingerprint, money, parseSettlements, parseStatement, suggestMatches,
  type BankLineForMatch, type BookEntryForMatch, type StatementLine,
} from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest, conflict, notFound } from "../lib/errors.js";
import { bankFeed } from "../integrations/bankfeed.js";
import { postVoucher, resolveCompany } from "./accounting.js";
import { resolvePostingAccountIds } from "./ledgerparameters.js";
import { documentNumber } from "./inventory.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }
type Company = Awaited<ReturnType<typeof resolveCompany>>;
type Line = typeof tables.bankLines.$inferSelect;

const SETTLEMENT_SERIES = { docType: "gateway_settlement", name: "Gateway settlements", pattern: "STL/{FY}/{SEQ:5}" };
const bankErr = (e: unknown): never => { throw badRequest(e instanceof BankError ? e.code : "invalid_file"); };
const addDays = (d: string, n: number) => new Date(Date.parse(`${d}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

/** Ledgers under Bank Accounts or Bank OD (or a sub-group), optionally just one. */
async function bankLedgers(tx: Tx, companyId: string, accountId?: string) {
  const rows = await tx.execute<{ id: string; name: string; name_hi: string | null; opening_balance: string }>(sql`
    select a.id, a.name, a.name_hi, a.opening_balance from accounts a
    join account_groups g on g.id = a.group_id left join account_groups pg on pg.id = g.parent_id
    where a.company_id = ${companyId} and not a.archived and (g.key in ('bank_accounts', 'bank_od') or pg.key in ('bank_accounts', 'bank_od'))
    ${accountId ? sql`and a.id = ${accountId}` : sql``} order by a.name`);
  return [...rows];
}

async function loadBank(tx: Tx, accountId: string) {
  const company = await resolveCompany(tx);
  const [bank] = await bankLedgers(tx, company.id, accountId);
  if (!bank) throw badRequest("not_a_bank_account");
  return { company, bank };
}

const bookBalance = async (tx: Tx, accountId: string, opening: string, asOf: string) => {
  const [r] = await tx.execute<{ bal: string }>(sql`select (${opening}::numeric + coalesce(sum(debit - credit), 0))::text as bal from gl_entries where account_id = ${accountId} and date <= ${asOf}::date`);
  return money(r!.bal);
};

export async function listBankAccounts(tx: Tx) {
  const company = await resolveCompany(tx);
  const today = businessDate();
  const banks = await bankLedgers(tx, company.id);
  const out = [];
  for (const b of banks) {
    const [profile] = await tx.select().from(tables.bankProfiles).where(eq(tables.bankProfiles.accountId, b.id));
    const [last] = await tx.select().from(tables.bankLines).where(eq(tables.bankLines.accountId, b.id)).orderBy(desc(tables.bankLines.date), desc(tables.bankLines.seq)).limit(1);
    const [counts] = await tx.execute<{ unmatched: number }>(sql`select count(*)::int as unmatched from bank_lines where account_id = ${b.id} and status = 'unmatched'`);
    out.push({
      id: b.id, name: b.name, nameHi: b.name_hi, bookBalance: await bookBalance(tx, b.id, b.opening_balance, today),
      statementBalance: last?.balance ?? null, statementDate: last?.date ?? null, unmatched: counts!.unmatched, profile: profile ?? null,
    });
  }
  return out;
}

export async function saveBankProfile(tx: Tx, actor: Actor, accountId: string, input: { bankName?: string | null | undefined; accountLast4?: string | null | undefined; ifsc?: string | null | undefined }) {
  const { company } = await loadBank(tx, accountId);
  const values = { bankName: input.bankName ?? null, accountLast4: input.accountLast4 ?? null, ifsc: input.ifsc?.toUpperCase() ?? null };
  await tx.insert(tables.bankProfiles).values({ accountId, tenantId: actor.tenantId, companyId: company.id, ...values })
    .onConflictDoUpdate({ target: tables.bankProfiles.accountId, set: values });
}

// ---- statements ------------------------------------------------------------------------------------

/** Saves statement lines, skipping ones already imported (same date, narration, amounts and balance). */
async function saveLines(tx: Tx, actor: Actor, company: Company, accountId: string, source: "upload" | "feed", fileName: string | null, lines: StatementLine[]) {
  // Oldest first, keeping the bank's order within a day.
  const ordered = lines[0] && lines[lines.length - 1] && lines[0].date > lines[lines.length - 1]!.date ? [...lines].reverse() : lines;
  const dates = ordered.map((l) => l.date).sort();
  const [st] = await tx.insert(tables.bankStatements).values({
    tenantId: actor.tenantId, companyId: company.id, accountId, source, fileName, fromDate: dates[0]!, toDate: dates[dates.length - 1]!, lineCount: ordered.length, createdBy: actor.userId,
  }).returning();
  const [maxSeq] = await tx.execute<{ s: number }>(sql`select coalesce(max(seq), 0)::int as s from bank_lines where account_id = ${accountId}`);
  const seen = new Map<string, number>();
  let added = 0;
  for (const [i, l] of ordered.entries()) {
    const base = lineFingerprint(l);
    const occurrence = seen.get(base) ?? 0;
    seen.set(base, occurrence + 1);
    const row = await tx.insert(tables.bankLines).values({
      tenantId: actor.tenantId, companyId: company.id, accountId, statementId: st!.id, date: l.date, description: l.description.slice(0, 500),
      reference: l.reference?.slice(0, 60) ?? null, debit: l.debit, credit: l.credit, balance: l.balance, fingerprint: lineFingerprint(l, occurrence), seq: maxSeq!.s + i + 1,
    }).onConflictDoNothing().returning({ id: tables.bankLines.id });
    if (row.length) added++;
  }
  await tx.update(tables.bankStatements).set({ lineCount: added, duplicates: ordered.length - added }).where(eq(tables.bankStatements.id, st!.id));
  return { statementId: st!.id, added, duplicates: ordered.length - added, from: dates[0]!, to: dates[dates.length - 1]! };
}

export async function importStatement(tx: Tx, actor: Actor, input: { accountId: string; fileName?: string | undefined; csv: string }) {
  const { company } = await loadBank(tx, input.accountId);
  let parsed;
  try { parsed = parseStatement(input.csv); } catch (e) { bankErr(e); }
  const saved = await saveLines(tx, actor, company, input.accountId, "upload", input.fileName ?? null, parsed!.lines);
  const matched = await autoMatch(tx, actor, input.accountId);
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "bank_statement", entityId: saved.statementId, after: { lines: saved.added, duplicates: saved.duplicates, matched }, ip: actor.ip });
  // The statement against itself (every balance follows from the line before) and against what was loaded before it.
  const check = checkStatement(parsed!.lines);
  let continuity: { previousDate: string; previousBalance: string; opening: string; agrees: boolean } | null = null;
  if (check.checkable) {
    const [prev] = await tx.select({ date: tables.bankLines.date, balance: tables.bankLines.balance }).from(tables.bankLines)
      .where(and(eq(tables.bankLines.accountId, input.accountId), sql`${tables.bankLines.date} < ${parsed!.from}`, sql`${tables.bankLines.balance} is not null`))
      .orderBy(desc(tables.bankLines.date), desc(tables.bankLines.seq)).limit(1);
    if (prev) continuity = { previousDate: prev.date, previousBalance: money(prev.balance!), opening: check.opening!, agrees: dec(prev.balance!).minus(check.opening!).abs().lte("0.005") };
  }
  return { ...saved, skipped: parsed!.skipped, matched, check, continuity };
}

// ---- feed (Account Aggregator) ---------------------------------------------------------------------

export async function connectFeed(tx: Tx, actor: Actor, accountId: string) {
  const { company } = await loadBank(tx, accountId);
  const [profile] = await tx.select().from(tables.bankProfiles).where(eq(tables.bankProfiles.accountId, accountId));
  const consent = await bankFeed.createConsent({ bankName: profile?.bankName ?? null, accountLast4: profile?.accountLast4 ?? null });
  const values = { feedProvider: bankFeed.name, feedConsentId: consent.consentId, feedStatus: consent.status };
  await tx.insert(tables.bankProfiles).values({ accountId, tenantId: actor.tenantId, companyId: company.id, ...values })
    .onConflictDoUpdate({ target: tables.bankProfiles.accountId, set: values });
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "bank_feed", entityId: accountId, after: { provider: bankFeed.name, status: consent.status }, ip: actor.ip });
  return { provider: bankFeed.name, status: consent.status };
}

export async function disconnectFeed(tx: Tx, actor: Actor, accountId: string) {
  const [profile] = await tx.select().from(tables.bankProfiles).where(eq(tables.bankProfiles.accountId, accountId));
  if (profile?.feedConsentId) await bankFeed.revoke(profile.feedConsentId);
  await tx.update(tables.bankProfiles).set({ feedStatus: "revoked" }).where(eq(tables.bankProfiles.accountId, accountId));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "bank_feed", entityId: accountId, after: { status: "revoked" }, ip: actor.ip });
}

/** Fetches new transactions from the feed (from the day after the last fetch, or the last 90 days). */
export async function fetchFeed(tx: Tx, actor: Actor, accountId: string, to = businessDate()) {
  const { company } = await loadBank(tx, accountId);
  const [profile] = await tx.select().from(tables.bankProfiles).where(eq(tables.bankProfiles.accountId, accountId));
  if (!profile?.feedConsentId || profile.feedStatus !== "active") throw conflict("feed_not_connected");
  const from = profile.feedFetchedTo ? addDays(profile.feedFetchedTo, 1) : addDays(to, -90);
  if (from > to) return { added: 0, duplicates: 0, matched: 0 };
  const hints = (await bookEntries(tx, accountId, addDays(from, -3), to, true)).map((e) => ({ date: e.date, direction: e.direction, amount: e.amount, party: e.party, reference: e.reference, number: e.number }));
  const txns = await bankFeed.fetch(profile.feedConsentId, from, to, hints);
  let saved = { added: 0, duplicates: 0 };
  if (txns.length) saved = await saveLines(tx, actor, company, accountId, "feed", null, txns.map((t) => ({ date: t.date, description: t.description, reference: t.reference, debit: t.debit, credit: t.credit, balance: null })));
  await tx.update(tables.bankProfiles).set({ feedFetchedTo: to }).where(eq(tables.bankProfiles.accountId, accountId));
  const matched = await autoMatch(tx, actor, accountId);
  return { added: saved.added, duplicates: saved.duplicates, matched };
}

// ---- matching --------------------------------------------------------------------------------------------

/** Posted vouchers touching this bank ledger that no statement line has cleared yet. */
async function bookEntries(tx: Tx, accountId: string, from: string, to: string, includeMatched = false): Promise<BookEntryForMatch[]> {
  const rows = await tx.execute<{ id: string; date: string; number: string; reference: string | null; narration: string | null; net: string; party: string | null }>(sql`
    select v.id, v.date::text, v.number, v.reference, v.narration, sum(g.debit - g.credit)::text as net,
      (select a.name from voucher_lines vl join accounts a on a.id = vl.account_id where vl.voucher_id = v.id and vl.account_id <> ${accountId}
       order by greatest(vl.debit, vl.credit) desc limit 1) as party
    from gl_entries g join vouchers v on v.id = g.voucher_id
    where g.account_id = ${accountId} and v.status = 'posted' and not g.is_reversal and v.date between ${from}::date and ${to}::date
      ${includeMatched ? sql`` : sql`and not exists (select 1 from bank_matches m where m.account_id = ${accountId} and m.voucher_id = v.id)`}
    group by v.id having sum(g.debit - g.credit) <> 0 order by v.date, v.number`);
  return [...rows].map((r) => ({
    id: r.id, date: r.date, number: r.number, reference: r.reference, narration: r.narration, party: r.party,
    direction: dec(r.net).gt(0) ? "in" as const : "out" as const, amount: money(dec(r.net).abs()),
  }));
}

const forMatch = (l: Line): BankLineForMatch => ({ id: l.id, date: l.date, description: l.description, reference: l.reference, debit: l.debit, credit: l.credit });

async function unmatchedLines(tx: Tx, accountId: string) {
  return tx.select().from(tables.bankLines).where(and(eq(tables.bankLines.accountId, accountId), eq(tables.bankLines.status, "unmatched"))).orderBy(asc(tables.bankLines.date), asc(tables.bankLines.seq));
}

async function candidates(tx: Tx, accountId: string, lines: Line[]) {
  if (!lines.length) return [];
  const dates = lines.map((l) => l.date).sort();
  // Cheques can be presented up to three months after they are written.
  return bookEntries(tx, accountId, addDays(dates[0]!, -90), addDays(dates[dates.length - 1]!, 10));
}

async function recordMatch(tx: Tx, actor: Actor, line: Line, entries: { id: string; amount: string }[], by: "auto" | "manual" | "rule" | "created") {
  await tx.insert(tables.bankMatches).values(entries.map((e) => ({ tenantId: actor.tenantId, bankLineId: line.id, accountId: line.accountId, voucherId: e.id, amount: e.amount })));
  await tx.update(tables.bankLines).set({ status: "matched", matchedBy: by, matchedAt: new Date() }).where(eq(tables.bankLines.id, line.id));
}

/** Matches the lines whose book entry is certain (same reference, or the only same-amount entry that day). */
export async function autoMatch(tx: Tx, actor: Actor, accountId: string) {
  const lines = await unmatchedLines(tx, accountId);
  const entries = await candidates(tx, accountId, lines);
  let n = 0;
  for (const p of suggestMatches(lines.map(forMatch), entries)) {
    if (!p.sure) continue;
    await recordMatch(tx, actor, lines.find((l) => l.id === p.lineId)!, [{ id: p.entryId, amount: entries.find((e) => e.id === p.entryId)!.amount }], "auto");
    n++;
  }
  return n;
}

export async function listLines(tx: Tx, accountId: string, q: { status?: string | undefined; from?: string | undefined; to?: string | undefined }) {
  const { company } = await loadBank(tx, accountId);
  const lines = await tx.select().from(tables.bankLines).where(and(
    eq(tables.bankLines.accountId, accountId), q.status ? eq(tables.bankLines.status, q.status) : undefined,
    q.from ? sql`${tables.bankLines.date} >= ${q.from}` : undefined, q.to ? sql`${tables.bankLines.date} <= ${q.to}` : undefined,
  )).orderBy(desc(tables.bankLines.date), desc(tables.bankLines.seq)).limit(500);
  const open = lines.filter((l) => l.status === "unmatched");
  const entries = await candidates(tx, accountId, open);
  const pairs = suggestMatches(open.map(forMatch), entries);
  const rules = await tx.select().from(tables.bankRules).where(and(eq(tables.bankRules.companyId, company.id), eq(tables.bankRules.archived, false)));
  const ruleAccounts = rules.length ? await tx.select({ id: tables.accounts.id, name: tables.accounts.name }).from(tables.accounts).where(inArray(tables.accounts.id, rules.map((r) => r.accountId))) : [];
  const matches = lines.some((l) => l.status === "matched")
    ? await tx.select({ m: tables.bankMatches, number: tables.vouchers.number, date: tables.vouchers.date, type: tables.vouchers.type }).from(tables.bankMatches)
      .innerJoin(tables.vouchers, eq(tables.vouchers.id, tables.bankMatches.voucherId))
      .where(inArray(tables.bankMatches.bankLineId, lines.filter((l) => l.status === "matched").map((l) => l.id)))
    : [];
  return lines.map((l) => {
    const p = pairs.find((x) => x.lineId === l.id);
    const rule = l.status === "unmatched" ? applyRules(l, rules.map((r) => ({ ...r, direction: r.direction as "in" | "out" | "any" }))) : null;
    return {
      ...l,
      suggestion: p ? { ...entries.find((e) => e.id === p.entryId)!, score: p.score, reasons: p.reasons } : null,
      rule: rule ? { id: rule.id, accountId: rule.accountId, account: ruleAccounts.find((a) => a.id === rule.accountId)?.name ?? "" } : null,
      vouchers: matches.filter((m) => m.m.bankLineId === l.id).map((m) => ({ id: m.m.voucherId, number: m.number, date: m.date, type: m.type, amount: m.m.amount })),
    };
  });
}

/** Unmatched book entries near a line (for matching by hand). */
export async function openEntries(tx: Tx, accountId: string, from: string, to: string) {
  await loadBank(tx, accountId);
  return bookEntries(tx, accountId, from, to);
}

async function loadLine(tx: Tx, id: string) {
  const [l] = await tx.select().from(tables.bankLines).where(eq(tables.bankLines.id, id)).for("update");
  if (!l) throw notFound();
  return l;
}

/** Clears a line against one or more vouchers whose bank amounts add up to it (e.g. several receipts deposited together). */
export async function matchLine(tx: Tx, actor: Actor, lineId: string, voucherIds: string[]) {
  const line = await loadLine(tx, lineId);
  if (line.status !== "unmatched") throw conflict("line_already_matched");
  const inflow = dec(line.credit).gt(0);
  const entries = (await bookEntries(tx, line.accountId, "1900-01-01", "2999-12-31")).filter((e) => voucherIds.includes(e.id));
  if (entries.length !== new Set(voucherIds).size) throw badRequest("voucher_not_open");
  if (entries.some((e) => e.direction !== (inflow ? "in" : "out"))) throw badRequest("wrong_direction");
  const total = entries.reduce((s, e) => s.plus(e.amount), dec(0));
  if (!total.eq(inflow ? line.credit : line.debit)) throw badRequest("amounts_differ");
  await recordMatch(tx, actor, line, entries, "manual");
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "bank_line", entityId: line.id, after: { matched: entries.map((e) => e.number) }, ip: actor.ip });
}

export async function unmatchLine(tx: Tx, actor: Actor, lineId: string) {
  const line = await loadLine(tx, lineId);
  if (line.status === "unmatched") return;
  await tx.delete(tables.bankMatches).where(eq(tables.bankMatches.bankLineId, line.id));
  await tx.update(tables.bankLines).set({ status: "unmatched", matchedBy: null, matchedAt: null }).where(eq(tables.bankLines.id, line.id));
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "bank_line", entityId: line.id, after: { status: "unmatched" }, ip: actor.ip });
}

export async function ignoreLine(tx: Tx, actor: Actor, lineId: string) {
  const line = await loadLine(tx, lineId);
  if (line.status !== "unmatched") throw conflict("line_already_matched");
  await tx.update(tables.bankLines).set({ status: "ignored", matchedAt: new Date() }).where(eq(tables.bankLines.id, line.id));
}

/**
 * Posts what the bank did that the books don't have yet (bank charges, interest, a transfer) from
 * the line, and clears the line with it: money in is a receipt, money out a payment, and a transfer
 * to or from cash or another bank a contra.
 */
export async function createFromLine(tx: Tx, actor: Actor, lineId: string, input: { accountId: string; narration?: string | undefined }, by: "created" | "rule" = "created") {
  const line = await loadLine(tx, lineId);
  if (line.status !== "unmatched") throw conflict("line_already_matched");
  if (input.accountId === line.accountId) throw badRequest("same_account");
  const inflow = dec(line.credit).gt(0);
  const amount = inflow ? line.credit : line.debit;
  const [counter] = await tx.select({ key: tables.accountGroups.key, parentKey: sql<string | null>`(select g2.key from account_groups g2 where g2.id = ${tables.accountGroups.parentId})` })
    .from(tables.accounts).innerJoin(tables.accountGroups, eq(tables.accountGroups.id, tables.accounts.groupId)).where(eq(tables.accounts.id, input.accountId));
  if (!counter) throw badRequest("unknown_account");
  const isCashBank = [counter.key, counter.parentKey].some((k) => (CASH_BANK_GROUPS as readonly string[]).includes(k ?? ""));
  const { voucher } = await postVoucher(tx, actor, {
    type: isCashBank ? "contra" : inflow ? "receipt" : "payment", date: line.date, reference: line.reference ?? undefined,
    narration: input.narration ?? line.description.slice(0, 200),
    lines: inflow
      ? [{ accountId: line.accountId, debit: amount }, { accountId: input.accountId, credit: amount }]
      : [{ accountId: input.accountId, debit: amount }, { accountId: line.accountId, credit: amount }],
  });
  await recordMatch(tx, actor, line, [{ id: voucher.id, amount }], by);
  return voucher;
}

/** Posts every unmatched line that a rule covers. */
export async function applyBankRules(tx: Tx, actor: Actor, accountId: string) {
  const { company } = await loadBank(tx, accountId);
  const rules = await tx.select().from(tables.bankRules).where(and(eq(tables.bankRules.companyId, company.id), eq(tables.bankRules.archived, false)));
  let n = 0;
  for (const l of await unmatchedLines(tx, accountId)) {
    const r = applyRules(l, rules.map((x) => ({ ...x, direction: x.direction as "in" | "out" | "any" })));
    if (!r) continue;
    await createFromLine(tx, actor, l.id, { accountId: r.accountId, narration: rules.find((x) => x.id === r.id)?.narration ?? undefined }, "rule");
    n++;
  }
  return n;
}

// ---- rules ----------------------------------------------------------------------------------------------

export async function listRules(tx: Tx) {
  const company = await resolveCompany(tx);
  return tx.select({ rule: tables.bankRules, account: tables.accounts.name }).from(tables.bankRules)
    .innerJoin(tables.accounts, eq(tables.accounts.id, tables.bankRules.accountId))
    .where(eq(tables.bankRules.companyId, company.id)).orderBy(asc(tables.bankRules.priority), asc(tables.bankRules.contains));
}

export async function saveRule(tx: Tx, actor: Actor, input: { contains: string; direction: "in" | "out" | "any"; accountId: string; narration?: string | null | undefined; priority?: number | undefined; archived?: boolean | undefined }, id?: string) {
  const company = await resolveCompany(tx);
  const [acct] = await tx.select().from(tables.accounts).where(eq(tables.accounts.id, input.accountId));
  if (!acct || acct.companyId !== company.id) throw badRequest("unknown_account");
  const values = { contains: input.contains.trim(), direction: input.direction, accountId: input.accountId, narration: input.narration ?? null, priority: input.priority ?? 10, archived: input.archived ?? false };
  if (id) {
    const [row] = await tx.update(tables.bankRules).set(values).where(eq(tables.bankRules.id, id)).returning();
    if (!row) throw notFound();
    return row;
  }
  const [row] = await tx.insert(tables.bankRules).values({ tenantId: actor.tenantId, companyId: company.id, ...values }).returning();
  return row!;
}

// ---- bank reconciliation statement -----------------------------------------------------------------------

/**
 * Bank reconciliation statement as on a date: balance per books, plus cheques issued but not yet
 * presented, less deposits not yet credited, less bank debits not in the books, plus bank credits not
 * in the books, gives the balance per bank; it should equal the statement's closing balance.
 */
export async function reconciliation(tx: Tx, accountId: string, asOf: string) {
  const { bank } = await loadBank(tx, accountId);
  const books = await bookBalance(tx, accountId, bank.opening_balance, asOf);
  // Entries in the books not cleared by a statement line dated on or before the date.
  const uncleared = await tx.execute<{ id: string; date: string; number: string; narration: string | null; net: string; party: string | null }>(sql`
    select v.id, v.date::text, v.number, v.narration, sum(g.debit - g.credit)::text as net,
      (select a.name from voucher_lines vl join accounts a on a.id = vl.account_id where vl.voucher_id = v.id and vl.account_id <> ${accountId}
       order by greatest(vl.debit, vl.credit) desc limit 1) as party
    from gl_entries g join vouchers v on v.id = g.voucher_id
    where g.account_id = ${accountId} and v.status = 'posted' and not g.is_reversal and v.date <= ${asOf}::date
      and not exists (select 1 from bank_matches m join bank_lines l on l.id = m.bank_line_id where m.account_id = ${accountId} and m.voucher_id = v.id and l.date <= ${asOf}::date)
    group by v.id having sum(g.debit - g.credit) <> 0 order by v.date, v.number`);
  const rows = [...uncleared].map((r) => ({ voucherId: r.id, date: r.date, number: r.number, party: r.party, narration: r.narration, amount: money(dec(r.net).abs()), inflow: dec(r.net).gt(0) }));
  const bankOnly = await tx.select().from(tables.bankLines).where(and(eq(tables.bankLines.accountId, accountId), eq(tables.bankLines.status, "unmatched"), sql`${tables.bankLines.date} <= ${asOf}`)).orderBy(asc(tables.bankLines.date));
  const total = (xs: { amount: string }[]) => xs.reduce((s, x) => s.plus(x.amount), dec(0));
  const notPresented = rows.filter((r) => !r.inflow);
  const notCredited = rows.filter((r) => r.inflow);
  const bankDebits = bankOnly.filter((l) => dec(l.debit).gt(0)).map((l) => ({ lineId: l.id, date: l.date, description: l.description, amount: l.debit }));
  const bankCredits = bankOnly.filter((l) => dec(l.credit).gt(0)).map((l) => ({ lineId: l.id, date: l.date, description: l.description, amount: l.credit }));
  const perBank = dec(books).plus(total(notPresented)).minus(total(notCredited)).minus(total(bankDebits)).plus(total(bankCredits));
  const [last] = await tx.select().from(tables.bankLines).where(and(eq(tables.bankLines.accountId, accountId), sql`${tables.bankLines.date} <= ${asOf}`, sql`${tables.bankLines.balance} is not null`))
    .orderBy(desc(tables.bankLines.date), desc(tables.bankLines.seq)).limit(1);
  return {
    asOf, account: bank.name, balancePerBooks: books,
    notPresented: { total: money(total(notPresented)), rows: notPresented },
    notCredited: { total: money(total(notCredited)), rows: notCredited },
    bankDebits: { total: money(total(bankDebits)), rows: bankDebits },
    bankCredits: { total: money(total(bankCredits)), rows: bankCredits },
    balancePerBank: money(perBank),
    statement: last ? { date: last.date, balance: last.balance, difference: money(dec(last.balance!).minus(perBank)) } : null,
  };
}

// ---- payment gateway settlements ----------------------------------------------------------------------

/**
 * Posts each payout in a gateway settlement report once: Dr bank (net), Dr gateway charges, Dr input
 * IGST on the charges, Cr the clearing ledger the sales went to (UPI or card receipts, or a customer).
 * The bank credit carrying the payout's UTR then matches it automatically.
 */
export async function importSettlements(tx: Tx, actor: Actor, input: { provider: string; csv: string; bankAccountId: string; clearingAccountId: string }) {
  const { company } = await loadBank(tx, input.bankAccountId);
  const [clearing] = await tx.select().from(tables.accounts).where(eq(tables.accounts.id, input.clearingAccountId));
  if (!clearing || clearing.companyId !== company.id) throw badRequest("unknown_account");
  const keys = await resolvePostingAccountIds(tx, company.id, ["gateway_charges", "input_igst"]);
  let parsed;
  try { parsed = parseSettlements(input.csv); } catch (e) { bankErr(e); }
  const provider = input.provider.toLowerCase();
  const done = await tx.select({ id: tables.gatewaySettlements.settlementId }).from(tables.gatewaySettlements)
    .where(and(eq(tables.gatewaySettlements.companyId, company.id), eq(tables.gatewaySettlements.provider, provider)));
  const posted = [];
  let skipped = 0;
  for (const s of parsed!) {
    if (done.some((d) => d.id === s.settlementId) || !s.settledOn) { skipped++; continue; }
    const credit = dec(s.gross).minus(s.refunds).plus(s.adjustments);
    const lines = [
      { accountId: input.bankAccountId, debit: s.net },
      ...(dec(s.fees).gt(0) ? [{ accountId: keys.gateway_charges!, debit: s.fees }] : []),
      ...(dec(s.tax).gt(0) ? [{ accountId: keys.input_igst!, debit: s.tax }] : []),
      credit.gt(0) ? { accountId: input.clearingAccountId, credit: money(credit) } : { accountId: input.clearingAccountId, debit: money(credit.neg()) },
    ];
    const number = await documentNumber(tx, actor, company, s.settledOn, SETTLEMENT_SERIES);
    const { voucher } = await postVoucher(tx, actor, {
      companyId: company.id, type: "gateway_settlement", documentNumber: number, date: s.settledOn, reference: s.utr ?? s.settlementId,
      narration: `${input.provider} settlement ${s.settlementId}: ${s.payments} payments`, lines,
    });
    const [row] = await tx.insert(tables.gatewaySettlements).values({
      tenantId: actor.tenantId, companyId: company.id, provider, settlementId: s.settlementId, utr: s.utr, settledOn: s.settledOn, payments: s.payments,
      gross: s.gross, refunds: s.refunds, fees: s.fees, tax: s.tax, adjustments: s.adjustments, net: s.net,
      bankAccountId: input.bankAccountId, clearingAccountId: input.clearingAccountId, voucherId: voucher.id, createdBy: actor.userId,
    }).returning();
    posted.push({ ...row!, number });
  }
  const matched = posted.length ? await autoMatch(tx, actor, input.bankAccountId) : 0;
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "gateway_settlement", entityId: posted[0]?.id ?? company.id, after: { provider, posted: posted.length, skipped }, ip: actor.ip });
  return { posted, skipped, matched };
}

export async function listSettlements(tx: Tx) {
  const company = await resolveCompany(tx);
  return tx.select({ s: tables.gatewaySettlements, number: tables.vouchers.number, matched: sql<boolean>`exists (select 1 from bank_matches m where m.voucher_id = ${tables.gatewaySettlements.voucherId})` })
    .from(tables.gatewaySettlements).leftJoin(tables.vouchers, eq(tables.vouchers.id, tables.gatewaySettlements.voucherId))
    .where(eq(tables.gatewaySettlements.companyId, company.id)).orderBy(desc(tables.gatewaySettlements.settledOn)).limit(300);
}
