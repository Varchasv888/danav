import { dec, money } from "./money.js";

/**
 * The annual return (GSTR-9) worked from the twelve monthly figures. Each month brings what its GSTR-3B holds; the tables add them up the way the
 * annual form does. Table 8A, the credit the portal says was available, can be taken from the GSTR-2B statements or from the purchase books:
 * the basis is chosen by the caller (the accountant), and both figures are always shown so the gap is visible.
 */
export const HEAD_KEYS = ["igst", "cgst", "sgst", "cess"] as const;
export interface Gstr9Heads { igst: string; cgst: string; sgst: string; cess: string }
export interface Gstr9Taxable extends Gstr9Heads { taxable: string }

export interface Gstr9Month {
  fp: string;
  /** Supplies on which tax is paid, net of credit notes (3.1a). */
  outward: Gstr9Taxable;
  /** Exports and supplies to SEZ (3.1b). */
  zeroRated: Gstr9Taxable;
  /** Nil rated and exempt supplies (3.1c): taxable value only. */
  nilExempt: string;
  /** Inward supplies on reverse charge (3.1d). */
  reverseCharge: Gstr9Taxable;
  /** Credit availed in the month (4A) and reversed (4B), by head. */
  itcAvailed: Gstr9Heads;
  itcReversed: Gstr9Heads;
  /** Tax payable for the month, and the part paid in cash after credit was used. */
  taxPayable: Gstr9Heads;
  taxPaidInCash: Gstr9Heads;
}

export type Table8Basis = "2b" | "books";

const zeroHeads = (): Gstr9Heads => ({ igst: "0.00", cgst: "0.00", sgst: "0.00", cess: "0.00" });
export function addHeads(a: Gstr9Heads, b: Gstr9Heads): Gstr9Heads {
  return Object.fromEntries(HEAD_KEYS.map((k) => [k, money(dec(a[k]).plus(b[k]))])) as unknown as Gstr9Heads;
}
export function subHeads(a: Gstr9Heads, b: Gstr9Heads): Gstr9Heads {
  return Object.fromEntries(HEAD_KEYS.map((k) => [k, money(dec(a[k]).minus(b[k]))])) as unknown as Gstr9Heads;
}
const sumHeads = (xs: Gstr9Heads[]) => xs.reduce(addHeads, zeroHeads());
const sumTaxable = (xs: Gstr9Taxable[]): Gstr9Taxable => ({ taxable: money(xs.reduce((s, x) => s.plus(x.taxable), dec(0))), ...sumHeads(xs) });
export const totalOf = (h: Gstr9Heads) => money(HEAD_KEYS.reduce((s, k) => s.plus(h[k]), dec(0)));

export interface Gstr9Input {
  months: Gstr9Month[];
  /** Credit on inward documents for the year per the GSTR-2B statements, and per the purchase books, by head. */
  creditPer2b: Gstr9Heads;
  creditPerBooks: Gstr9Heads;
  /** Months of the year with no GSTR-2B statement imported. */
  monthsWithout2b: string[];
  basis: Table8Basis;
  /** Credit of the year that is availed in the next year's returns, and credit availed this year for last year's documents: typed in by the accountant. */
  nextYearCredit?: Gstr9Heads | undefined;
}

export function gstr9Tables(input: Gstr9Input) {
  const m = input.months;
  const table4 = sumTaxable(m.map((x) => x.outward));
  const zero = sumTaxable(m.map((x) => x.zeroRated));
  const nil = money(m.reduce((s, x) => s.plus(x.nilExempt), dec(0)));
  const rcm = sumTaxable(m.map((x) => x.reverseCharge));
  const availed = sumHeads(m.map((x) => x.itcAvailed));
  const reversed = sumHeads(m.map((x) => x.itcReversed));
  const net = subHeads(availed, reversed);

  // Table 8A: the credit the statements show was available. The chosen basis feeds 8A and so 8D; the other is kept to see the gap.
  const eightA = input.basis === "2b" ? input.creditPer2b : input.creditPerBooks;
  const eightC = input.nextYearCredit ?? zeroHeads();
  const eightD = subHeads(eightA, addHeads(availed, eightC));

  const payable = sumHeads(m.map((x) => x.taxPayable));
  const cash = sumHeads(m.map((x) => x.taxPaidInCash));
  const byCredit = subHeads(payable, cash);

  return {
    table4: { ...table4, totalTax: totalOf(table4) },
    table5: { zeroRated: zero, nilExempt: nil },
    reverseCharge: rcm,
    table6: { availed, totalTax: totalOf(availed) },
    table7: { reversed, totalTax: totalOf(reversed) },
    netCredit: net,
    table8: {
      basis: input.basis, a: eightA, per2b: input.creditPer2b, perBooks: input.creditPerBooks,
      gapBetweenBases: subHeads(input.creditPer2b, input.creditPerBooks),
      b: availed, c: eightC, d: eightD, monthsWithout2b: input.monthsWithout2b,
      dNote: dec(totalOf(eightD)).gt(0) ? "available_not_availed" : dec(totalOf(eightD)).lt(0) ? "availed_more_than_available" : "agrees",
    },
    table9: { payable, paidInCash: cash, paidByCredit: byCredit },
  };
}

export type Gstr9Tables = ReturnType<typeof gstr9Tables>;
