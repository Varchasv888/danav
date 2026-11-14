import { dec, money, type Dec } from "./money.js";
import { taxPeriod } from "./gstr.js";

/**
 * Filing dates and the rules that follow from them. Sources and the points still to be confirmed with an accountant are
 * in docs/gst-practice-garment-distributor.md (sections 3 and 5).
 */

export type ReturnKind = "GSTR1" | "GSTR3B" | "GSTR9" | "GSTR9C";

const iso = (y: number, m: number, d: number) => `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

/**
 * The standard due date of a return. Monthly: GSTR-1 on the 11th and GSTR-3B on the 20th of the next month. The annual
 * return and its reconciliation statement are due on 31 December after the financial year (period given as "FY2025-26").
 * Quarterly (QRMP) dates and state-wise extensions differ and are not modelled; a notified extension is not known here.
 */
export function returnDueDate(kind: ReturnKind, period: string): string {
  if (kind === "GSTR9" || kind === "GSTR9C") {
    const m = /^FY(\d{4})-(\d{2})$/.exec(period);
    if (!m) throw new Error("annual period must look like FY2025-26");
    return iso(Number(m[1]) + 1, 12, 31);
  }
  const { from } = taxPeriod(period);
  const y = Number(from.slice(0, 4)), mo = Number(from.slice(5, 7));
  const ny = mo === 12 ? y + 1 : y, nm = mo === 12 ? 1 : mo + 1;
  return iso(ny, nm, kind === "GSTR1" ? 11 : 20);
}

/** The last day a return can still be filed: three years after its due date (in force from July 2025, first periods barred from 1 August 2025). */
export function returnTimeBarDate(kind: ReturnKind, period: string): string {
  const due = returnDueDate(kind, period);
  return iso(Number(due.slice(0, 4)) + 3, Number(due.slice(5, 7)), Number(due.slice(8, 10)));
}

/** True when the period can no longer be filed on `today`. */
export function isReturnTimeBarred(kind: ReturnKind, period: string, today: string): boolean {
  return today > returnTimeBarDate(kind, period);
}

// ---- input credit from the GSTR-2B statement ---------------------------------------------------

export interface ItcHeads { igst: string; cgst: string; sgst: string; cess: string }
const ZERO: ItcHeads = { igst: "0.00", cgst: "0.00", sgst: "0.00", cess: "0.00" };
const KEYS = ["igst", "cgst", "sgst", "cess"] as const;
const plus = (a: ItcHeads, b: ItcHeads, sign: 1 | -1 = 1): ItcHeads => Object.fromEntries(KEYS.map((k) => [k, money(dec(a[k]).plus(dec(b[k]).times(sign)))])) as unknown as ItcHeads;
const lower = (a: ItcHeads, b: ItcHeads): ItcHeads => Object.fromEntries(KEYS.map((k) => [k, money(lowerOf(dec(a[k]), dec(b[k])))])) as unknown as ItcHeads;
function lowerOf(a: Dec, b: Dec): Dec { return a.lte(b) ? a : b; }

export interface StatementRow extends ItcHeads { kind: "invoice" | "note"; itcAvailable: boolean; decision: string | null; billId: string | null }

export interface ItcFrom2b {
  /** What may be taken in GSTR-3B Table 4(A)(5) on the strength of the statement. */
  claim: ItcHeads;
  /** Credit that exists in the books or on the statement but is not claimed this month, and why. */
  heldBack: { queried: ItcHeads; notAvailable: ItcHeads; inStatementNotInBooks: ItcHeads; inBooksNotInStatement: ItcHeads };
  counts: { claimed: number; queried: number; notAvailable: number; inStatementNotInBooks: number; inBooksNotInStatement: number };
}

/**
 * Credit driven by the statement. Rule 36(4): credit is taken only as far as GSTR-2B shows it. A matched invoice earns the
 * lower of the books and the statement, head by head. Rows the buyer queried, rows the statement marks as not available and
 * statement rows with no bill in the books are held back. Books bills missing from the statement wait for the supplier.
 * Credit and debit notes on the statement reduce the claim.
 */
export function itcFrom2b(rows: StatementRow[], books: Map<string, ItcHeads>): ItcFrom2b {
  let claim = ZERO, queried = ZERO, notAvailable = ZERO, notInBooks = ZERO, notInStatement = ZERO;
  const counts = { claimed: 0, queried: 0, notAvailable: 0, inStatementNotInBooks: 0, inBooksNotInStatement: 0 };
  const seen = new Set<string>();
  for (const r of rows) {
    const sign = r.kind === "invoice" ? 1 : -1;
    const stmt: ItcHeads = { igst: r.igst, cgst: r.cgst, sgst: r.sgst, cess: r.cess };
    if (r.billId) seen.add(r.billId);
    if (!r.itcAvailable) { notAvailable = plus(notAvailable, stmt, sign); counts.notAvailable++; continue; }
    if (r.kind === "note") { claim = plus(claim, stmt, -1); continue; }
    if (r.decision === "queried") { queried = plus(queried, stmt); counts.queried++; continue; }
    const bill = r.billId ? books.get(r.billId) : undefined;
    if (!bill) { notInBooks = plus(notInBooks, stmt); counts.inStatementNotInBooks++; continue; }
    claim = plus(claim, lower(stmt, bill)); counts.claimed++;
  }
  for (const [id, tax] of books) if (!seen.has(id)) { notInStatement = plus(notInStatement, tax); counts.inBooksNotInStatement++; }
  return { claim, heldBack: { queried, notAvailable, inStatementNotInBooks: notInBooks, inBooksNotInStatement: notInStatement }, counts };
}
