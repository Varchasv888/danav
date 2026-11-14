import { dec, money, type Dec } from "./money.js";

/**
 * Bank statements and reconciliation: reading banks' CSV exports (the header row and columns are
 * found by name, since every bank lays them out differently), matching statement lines with the
 * books, and reading payment-gateway settlement reports.
 */

export class BankError extends Error {
  constructor(public code: "no_header" | "no_rows" | "bad_amount" | "unknown_format") {
    super(code);
  }
}

// ---- CSV -------------------------------------------------------------------------------------------

/** RFC 4180 CSV (quotes, doubled quotes, commas and newlines inside quotes); also reads tab- or semicolon-separated files. */
export function parseCsv(text: string): string[][] {
  const src = text.replace(/^﻿/, "");
  const firstLine = src.slice(0, src.indexOf("\n") >= 0 ? src.indexOf("\n") : src.length);
  const sep = [",", "\t", ";"].map((s) => [s, firstLine.split(s).length] as const).sort((a, b) => b[1] - a[1])[0]![0];
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i]!;
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') quoted = false; else cell += c;
    } else if (c === '"' && cell.trim() === "") { quoted = true; cell = ""; }
    else if (c === sep) { row.push(cell.trim()); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(cell.trim());
      if (row.some((x) => x !== "")) rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  row.push(cell.trim());
  if (row.some((x) => x !== "")) rows.push(row);
  return rows;
}

// ---- dates and amounts ----------------------------------------------------------------------------

const MONTHS: Record<string, number> = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12 };

/** Indian bank dates: 05/10/2026, 05-10-26, 05.10.2026, 05-Oct-2026, 05 Oct 26, 2026-10-05 (a time after it is ignored). */
export function parseBankDate(raw: string): string | null {
  const s = raw.trim().split(/\s+\d{1,2}:\d{2}/)[0]!.trim();
  let d: number, m: number, y: number;
  let r = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s);
  if (r) { y = +r[1]!; m = +r[2]!; d = +r[3]!; } else {
    r = /^(\d{1,2})[/.\- ](\d{1,2}|[A-Za-z]{3,4})[/.\-, ]+(\d{2}|\d{4})$/.exec(s);
    if (!r) return null;
    d = +r[1]!;
    m = /\d/.test(r[2]!) ? +r[2]! : MONTHS[r[2]!.toLowerCase()] ?? 0;
    y = r[3]!.length === 2 ? 2000 + +r[3]! : +r[3]!;
  }
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  const iso = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  return new Date(`${iso}T00:00:00Z`).toISOString().slice(0, 10) === iso ? iso : null;
}

/** "1,23,456.78", "₹ 500", "(250.00)", "250.00 Dr", "-" and blanks (→ null). */
export function parseBankAmount(raw: string): { value: Dec; side: "dr" | "cr" | null } | null {
  let s = raw.trim().replace(/₹|INR|Rs\.?/gi, "").replace(/,/g, "").replace(/\s+/g, " ").trim();
  if (s === "" || s === "-" || s === "--") return null;
  let side: "dr" | "cr" | null = null;
  const suffix = /\s*(dr|cr)\.?$/i.exec(s);
  if (suffix) { side = suffix[1]!.toLowerCase() as "dr" | "cr"; s = s.slice(0, suffix.index).trim(); }
  let neg = false;
  if (/^\(.*\)$/.test(s)) { neg = true; s = s.slice(1, -1); }
  if (!/^[+-]?\d+(\.\d+)?$/.test(s)) throw new BankError("bad_amount");
  const v = dec(s);
  return { value: neg ? v.neg() : v, side };
}

// ---- statements ----------------------------------------------------------------------------------

export interface StatementLine { date: string; description: string; reference: string | null; debit: string; credit: string; balance: string | null }
type Role = "date" | "valueDate" | "description" | "reference" | "debit" | "credit" | "amount" | "type" | "balance";

const ROLE_PATTERNS: [Role, RegExp][] = [
  ["valueDate", /^value\s*(date|dt)\.?$/],
  ["date", /^(txn|tran|transaction|posting|post|trans)?\.?\s*(date|dt)\.?$/],
  ["description", /^(narration|description|particulars|remarks|transaction\s*(details|description|remarks)|details)$/],
  ["reference", /(chq|cheque|ref(erence)?)\.?\s*(\/|\s|\.)*\s*(no|number|ref|num)?\.?|^utr/],
  ["debit", /^(withdrawal|withdrawals|debit|debits|dr)\s*(amt|amount)?\.?\s*(\(dr\))?\s*(\(inr\)|\(₹\)|inr)?$|^withdrawal\s*amount/],
  ["credit", /^(deposit|deposits|credit|credits|cr)\s*(amt|amount)?\.?\s*(\(cr\))?\s*(\(inr\)|\(₹\)|inr)?$|^deposit\s*amount/],
  ["balance", /^(closing\s*)?(balance|bal)\s*(amt|amount)?\.?\s*(\(inr\)|\(₹\)|inr|\(cr\)|\(dr\))?$|^running\s*balance/],
  ["type", /^(cr\/dr|dr\/cr|dr\s*\/\s*cr|type|debit\/credit)$/],
  ["amount", /^(transaction\s*)?amount\s*(\(inr\)|\(₹\)|inr)?$|^amt$/],
];

function roles(header: string[]) {
  const map: Partial<Record<Role, number>> = {};
  header.forEach((h, i) => {
    const k = h.toLowerCase().replace(/\s+/g, " ").trim();
    for (const [role, re] of ROLE_PATTERNS) {
      if (re.test(k) && map[role] === undefined) { map[role] = i; break; }
    }
  });
  if (map.date === undefined && map.valueDate !== undefined) map.date = map.valueDate;
  return map;
}

/**
 * Reads a bank statement exported as CSV. Banks put account details above the table and totals
 * below it; the header row is the first one naming a date, a description and amount columns.
 */
export function parseStatement(text: string) {
  const rows = parseCsv(text);
  let headerAt = -1;
  let map: Partial<Record<Role, number>> = {};
  for (let i = 0; i < Math.min(rows.length, 40); i++) {
    const m = roles(rows[i]!);
    if (m.date !== undefined && m.description !== undefined && ((m.debit !== undefined && m.credit !== undefined) || m.amount !== undefined)) { headerAt = i; map = m; break; }
  }
  if (headerAt < 0) throw new BankError("no_header");
  const lines: StatementLine[] = [];
  let skipped = 0;
  for (const r of rows.slice(headerAt + 1)) {
    const date = parseBankDate(r[map.date!] ?? "");
    if (!date) { skipped++; continue; } // footers, "opening balance" rows, page breaks
    let debit = dec(0);
    let credit = dec(0);
    if (map.debit !== undefined && map.credit !== undefined) {
      debit = parseBankAmount(r[map.debit] ?? "")?.value.abs() ?? dec(0);
      credit = parseBankAmount(r[map.credit] ?? "")?.value.abs() ?? dec(0);
    } else {
      const a = parseBankAmount(r[map.amount!] ?? "");
      if (!a) { skipped++; continue; }
      const t = (map.type !== undefined ? r[map.type] ?? "" : "").trim().toLowerCase();
      const side = t.startsWith("d") ? "dr" : t.startsWith("c") ? "cr" : a.side ?? (a.value.lt(0) ? "dr" : "cr");
      if (side === "dr") debit = a.value.abs(); else credit = a.value.abs();
    }
    if (debit.isZero() && credit.isZero()) { skipped++; continue; }
    const bal = map.balance !== undefined ? parseBankAmount(r[map.balance] ?? "") : null;
    const description = (r[map.description!] ?? "").replace(/\s+/g, " ").trim();
    const ref = map.reference !== undefined ? (r[map.reference] ?? "").trim().replace(/^0+$/, "") : "";
    lines.push({
      date, description, reference: ref || null, debit: money(debit), credit: money(credit),
      balance: bal ? money(bal.side === "dr" ? bal.value.abs().neg() : bal.value) : null,
    });
  }
  if (!lines.length) throw new BankError("no_rows");
  // Most banks list the newest first; keep the statement's own order but report the period.
  const dates = lines.map((l) => l.date).sort();
  return { lines, from: dates[0]!, to: dates[dates.length - 1]!, skipped, header: rows[headerAt]! };
}

export interface StatementBreak { date: string; description: string; expected: string; found: string; difference: string }
export interface StatementCheck {
  /** False when too few lines carry a balance to check anything. */
  checkable: boolean;
  /** Banks list newest first or oldest first; the check always runs oldest first. */
  order: "oldest_first" | "newest_first";
  opening: string | null; closing: string | null; totalDebit: string; totalCredit: string;
  /** Lines whose balance is not the previous balance plus credit less debit: a missing, doubled or misread line. */
  breaks: StatementBreak[];
  withBalance: number; lines: number;
}

/**
 * Checks a statement against itself before it is trusted: every line's balance must equal the line before it plus the credit less the debit.
 * A break means a line is missing, repeated or misread, and the figures after it cannot be relied on. The opening balance is worked back
 * from the first line, so it can be compared with the closing balance of the last statement loaded.
 */
export function checkStatement(lines: StatementLine[]): StatementCheck {
  const order = lines.length > 1 && lines[0]!.date > lines[lines.length - 1]!.date ? "newest_first" : "oldest_first";
  const seq = order === "newest_first" ? [...lines].reverse() : lines;
  const withBalance = seq.filter((l) => l.balance !== null).length;
  const totalDebit = seq.reduce((t, l) => t.plus(l.debit), dec(0));
  const totalCredit = seq.reduce((t, l) => t.plus(l.credit), dec(0));
  const base = { order, totalDebit: money(totalDebit), totalCredit: money(totalCredit), withBalance, lines: seq.length } as const;
  if (seq.length === 0 || withBalance < seq.length * 0.8 || seq[0]!.balance === null) {
    return { checkable: false, opening: null, closing: seq.length ? seq[seq.length - 1]!.balance : null, breaks: [], ...base };
  }
  const breaks: StatementBreak[] = [];
  let prev: Dec = dec(seq[0]!.balance!).minus(seq[0]!.credit).plus(seq[0]!.debit);
  const opening = prev;
  for (const l of seq) {
    const expected = prev.plus(l.credit).minus(l.debit);
    if (l.balance !== null) {
      const found = dec(l.balance);
      if (expected.minus(found).abs().gt("0.005")) {
        breaks.push({ date: l.date, description: l.description, expected: money(expected), found: money(found), difference: money(found.minus(expected)) });
      }
      prev = found; // carry on from what the bank says, so one break is reported once
    } else prev = expected;
  }
  return { checkable: true, opening: money(opening), closing: money(prev), breaks, ...base };
}

/** A stable fingerprint of a statement line, so importing an overlapping statement again doesn't duplicate it. */
export function lineFingerprint(l: Pick<StatementLine, "date" | "description" | "debit" | "credit" | "balance">, occurrence = 0) {
  return [l.date, l.description.toLowerCase().replace(/\s+/g, " "), l.debit, l.credit, l.balance ?? "", occurrence].join("|");
}

// ---- matching ------------------------------------------------------------------------------------------

/** Reference-like tokens: UPI RRNs, NEFT/RTGS UTRs, IMPS numbers, cheque numbers. */
export function extractRefs(text: string | null | undefined): string[] {
  if (!text) return [];
  const out = new Set<string>();
  for (const t of text.toUpperCase().split(/[^A-Z0-9]+/)) {
    if (t.length >= 6 && (t.match(/\d/g)?.length ?? 0) >= 5) out.add(t.replace(/^0+(?=\d{6})/, ""));
  }
  return [...out];
}

export interface BankLineForMatch { id: string; date: string; description: string; reference: string | null; debit: string; credit: string }
export interface BookEntryForMatch {
  id: string; date: string;
  /** Money into the bank (debit to the bank ledger) or out of it. */
  direction: "in" | "out";
  amount: string;
  number: string; reference: string | null; narration: string | null; party: string | null;
}
export interface MatchSuggestion { lineId: string; entryId: string; score: number; reasons: string[] }

const words = (s: string | null) => (s ?? "").toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 4 && !/^\d+$/.test(w));

/** How well a book entry explains a statement line (0 = not at all). The amount and direction must agree. */
export function matchScore(l: BankLineForMatch, e: BookEntryForMatch, windowDays = 10): { score: number; reasons: string[] } {
  const inflow = dec(l.credit).gt(0);
  const amount = inflow ? l.credit : l.debit;
  if ((inflow ? "in" : "out") !== e.direction || !dec(amount).eq(e.amount)) return { score: 0, reasons: [] };
  const gap = Math.abs(Math.round((Date.parse(l.date) - Date.parse(e.date)) / 86_400_000));
  const lineRefs = new Set([...extractRefs(l.reference), ...extractRefs(l.description)]);
  const sameRef = [...extractRefs(e.reference), ...extractRefs(e.narration), ...extractRefs(e.number)].some((r) => lineRefs.has(r));
  // A cheque can be presented up to three months after it is written; its number still ties it.
  if (gap > (sameRef ? 90 : windowDays)) return { score: 0, reasons: [] };
  const reasons = ["amount"];
  let score = Math.max(50 - gap * 3, 5);
  if (gap === 0) reasons.push("same_day");
  if (sameRef) { score += 40; reasons.push("reference"); }
  const desc = l.description.toLowerCase();
  if (words(e.party).some((w) => desc.includes(w))) { score += 20; reasons.push("party"); }
  return { score: Math.max(score, 1), reasons };
}

/**
 * Pairs statement lines with book entries one to one, best pairs first. "sure" pairs (a reference
 * or party match, or the only same-amount entry that day) can be matched automatically; the rest are
 * offered as suggestions.
 */
export function suggestMatches(lines: BankLineForMatch[], entries: BookEntryForMatch[], windowDays = 10) {
  const all: MatchSuggestion[] = [];
  for (const l of lines) for (const e of entries) {
    const s = matchScore(l, e, windowDays);
    if (s.score > 0) all.push({ lineId: l.id, entryId: e.id, ...s });
  }
  all.sort((a, b) => b.score - a.score || a.lineId.localeCompare(b.lineId) || a.entryId.localeCompare(b.entryId));
  const usedLines = new Set<string>();
  const usedEntries = new Set<string>();
  const pairs: (MatchSuggestion & { sure: boolean })[] = [];
  for (const s of all) {
    if (usedLines.has(s.lineId) || usedEntries.has(s.entryId)) continue;
    // Ambiguous if another free entry scores the same for this line, or another line for this entry.
    const rivals = all.filter((o) => o !== s && o.score === s.score && ((o.lineId === s.lineId && !usedEntries.has(o.entryId)) || (o.entryId === s.entryId && !usedLines.has(o.lineId))));
    usedLines.add(s.lineId);
    usedEntries.add(s.entryId);
    pairs.push({ ...s, sure: rivals.length === 0 && (s.reasons.includes("reference") || s.score >= 80 || (s.reasons.includes("same_day") && s.score >= 50)) });
  }
  return pairs;
}

export interface BankRule { id: string; contains: string; direction: "in" | "out" | "any"; accountId: string; priority: number }

/** The first rule (by priority) whose words all appear in the line's description. */
export function applyRules(l: Pick<BankLineForMatch, "description" | "debit" | "credit">, rules: BankRule[]) {
  const desc = l.description.toLowerCase();
  const dir = dec(l.credit).gt(0) ? "in" : "out";
  return [...rules].sort((a, b) => a.priority - b.priority).find((r) =>
    (r.direction === "any" || r.direction === dir) && r.contains.toLowerCase().split(/\s+/).filter(Boolean).every((w) => desc.includes(w))) ?? null;
}

// ---- payment gateway settlements ------------------------------------------------------------------

export interface Settlement {
  settlementId: string; utr: string | null; settledOn: string;
  payments: number; gross: string; refunds: string; fees: string; tax: string; adjustments: string; net: string;
}

/**
 * Reads a gateway settlement report (Razorpay's settlement reconciliation CSV, or any report with
 * settlement id, amount, fee, tax and settled amount columns) and totals it per settlement.
 * Net = payments − refunds − fees − GST on fees ± adjustments.
 */
export function parseSettlements(text: string): Settlement[] {
  const rows = parseCsv(text);
  const find = (h: string[], ...res: RegExp[]) => h.findIndex((x) => res.some((re) => re.test(x.toLowerCase().trim())));
  let at = -1;
  let col: Record<string, number> = {};
  for (let i = 0; i < Math.min(rows.length, 20); i++) {
    const h = rows[i]!;
    const c = {
      id: find(h, /^settlement[_ ]?id$/, /^settlement\s*(ref|reference|no)/),
      utr: find(h, /utr/),
      settledAt: find(h, /^settled[_ ]?(at|on|date)$/, /^settlement[_ ]?date$/),
      type: find(h, /^(type|txn[_ ]?type|transaction[_ ]?type)$/),
      amount: find(h, /^(amount|gross[_ ]?amount|transaction[_ ]?amount|order[_ ]?amount)$/),
      fee: find(h, /^(fee|fees|mdr|commission|charges)$/),
      tax: find(h, /^(tax|gst|gst[_ ]?on[_ ]?fee|service[_ ]?tax)$/),
      credit: find(h, /^(credit|net[_ ]?amount|settled[_ ]?amount|payout[_ ]?amount)$/),
      debit: find(h, /^debit$/),
    };
    if (c.id >= 0 && c.amount >= 0 && (c.credit >= 0 || c.fee >= 0)) { at = i; col = c; break; }
  }
  if (at < 0) throw new BankError("unknown_format");
  const groups = new Map<string, { utr: string | null; settledOn: string; payments: number; gross: Dec; refunds: Dec; fees: Dec; tax: Dec; adjustments: Dec; net: Dec }>();
  const num = (r: string[], i: number) => (i >= 0 ? parseBankAmount(r[i] ?? "")?.value ?? dec(0) : dec(0));
  for (const r of rows.slice(at + 1)) {
    const id = (r[col.id!] ?? "").trim();
    if (!id) continue;
    const settledOn = parseBankDate((r[col.settledAt!] ?? "").replace(/T.*$/, "")) ?? "";
    const g = groups.get(id) ?? { utr: null, settledOn, payments: 0, gross: dec(0), refunds: dec(0), fees: dec(0), tax: dec(0), adjustments: dec(0), net: dec(0) };
    const type = col.type! >= 0 ? (r[col.type!] ?? "").toLowerCase() : "payment";
    const amount = num(r, col.amount!).abs();
    let fee = num(r, col.fee!).abs();
    const tax = num(r, col.tax!).abs();
    // Some gateways (Razorpay) report the fee including its GST: amount − fee = what was settled.
    if (col.credit! >= 0 && !tax.isZero()) {
      const credited = num(r, col.credit!).abs();
      if (amount.minus(fee).minus(credited).abs().lt(0.01)) fee = fee.minus(tax);
    }
    if (type.startsWith("refund") || type.startsWith("reversal")) g.refunds = g.refunds.plus(amount);
    else if (type.startsWith("adjust")) g.adjustments = g.adjustments.plus(num(r, col.credit!).minus(num(r, col.debit!)));
    else if (type.startsWith("settlement")) continue; // the payout row itself
    else { g.payments++; g.gross = g.gross.plus(amount); }
    g.fees = g.fees.plus(fee);
    g.tax = g.tax.plus(tax);
    if (col.utr! >= 0 && r[col.utr!]) g.utr = r[col.utr!]!.trim();
    if (!g.settledOn && settledOn) g.settledOn = settledOn;
    groups.set(id, g);
  }
  if (!groups.size) throw new BankError("no_rows");
  return [...groups.entries()].map(([settlementId, g]) => ({
    settlementId, utr: g.utr, settledOn: g.settledOn, payments: g.payments, gross: money(g.gross), refunds: money(g.refunds), fees: money(g.fees),
    tax: money(g.tax), adjustments: money(g.adjustments), net: money(g.gross.minus(g.refunds).minus(g.fees).minus(g.tax).plus(g.adjustments)),
  }));
}
