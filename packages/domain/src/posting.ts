import { dec, money, sum, type DecimalInput } from "./money.js";

/**
 * Every business document becomes a journal: a set of lines whose debits equal credits.
 * This check runs before anything is written to the general ledger, in the cloud API
 * and in the offline app alike.
 */
export interface JournalLine {
  accountId: string;
  debit?: DecimalInput;
  credit?: DecimalInput;
  costCenterId?: string;
  partyId?: string;
}

export type JournalError =
  | { code: "too_few_lines" }
  | { code: "negative_amount"; line: number }
  | { code: "both_sides"; line: number }
  | { code: "zero_line"; line: number }
  | { code: "unbalanced"; debit: string; credit: string };

export function validateJournal(lines: JournalLine[]): JournalError[] {
  const errors: JournalError[] = [];
  if (lines.length < 2) errors.push({ code: "too_few_lines" });
  lines.forEach((l, i) => {
    const dr = dec(l.debit ?? 0);
    const cr = dec(l.credit ?? 0);
    if (dr.isNegative() || cr.isNegative()) errors.push({ code: "negative_amount", line: i });
    else if (!dr.isZero() && !cr.isZero()) errors.push({ code: "both_sides", line: i });
    else if (dr.isZero() && cr.isZero()) errors.push({ code: "zero_line", line: i });
  });
  const debit = sum(lines.map((l) => l.debit ?? 0));
  const credit = sum(lines.map((l) => l.credit ?? 0));
  if (!debit.equals(credit)) errors.push({ code: "unbalanced", debit: money(debit), credit: money(credit) });
  return errors;
}

/** A reversal swaps debit and credit on every line; posted entries are never edited. */
export function reverseJournal(lines: JournalLine[]): JournalLine[] {
  return lines.map((l) => {
    const { debit, credit, ...rest } = l;
    const out: JournalLine = { ...rest };
    if (credit !== undefined) out.debit = credit;
    if (debit !== undefined) out.credit = debit;
    return out;
  });
}
