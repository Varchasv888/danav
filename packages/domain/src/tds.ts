import { D, dec, type DecimalInput } from "./money.js";

/**
 * Tax deducted at source on payments other than salary (Form 26Q). Rates and limits are the common ones under the Income-tax Act, 1961
 * for FY 2025-26; every entry lets the rate be overridden, so a change in the law needs no new release.
 */
export interface TdsSection {
  code: string;
  nature: string;
  /** % when the payee is an individual or HUF, and for everyone else. */
  rateIndividual: string;
  rateOther: string;
  /** A single payment above this is taxed on its own (0 = no single-payment limit). */
  singleLimit: string;
  /** Payments to one payee in the year above this are taxed (from the first rupee over, or in full: see `excessOnly`). */
  annualLimit: string;
  /** Tax only the part of the year's payments above the annual limit (194Q), not all of it. */
  excessOnly?: boolean;
  /** % when the payee has no PAN, if the section says so; otherwise twice the rate or 20%, whichever is higher. */
  noPanRate?: string;
}

export const TDS_SECTIONS: TdsSection[] = [
  { code: "194C", nature: "Contractors and job work", rateIndividual: "1", rateOther: "2", singleLimit: "30000", annualLimit: "100000" },
  { code: "194H", nature: "Commission and brokerage", rateIndividual: "2", rateOther: "2", singleLimit: "0", annualLimit: "20000" },
  { code: "194I(a)", nature: "Rent of plant and machinery", rateIndividual: "2", rateOther: "2", singleLimit: "0", annualLimit: "600000" },
  { code: "194I(b)", nature: "Rent of land, building or furniture", rateIndividual: "10", rateOther: "10", singleLimit: "0", annualLimit: "600000" },
  { code: "194J(a)", nature: "Technical services and call centres", rateIndividual: "2", rateOther: "2", singleLimit: "0", annualLimit: "50000" },
  { code: "194J(b)", nature: "Professional fees and directors", rateIndividual: "10", rateOther: "10", singleLimit: "0", annualLimit: "50000" },
  { code: "194A", nature: "Interest other than on securities", rateIndividual: "10", rateOther: "10", singleLimit: "0", annualLimit: "10000" },
  { code: "194Q", nature: "Purchase of goods over Rs 50 lakh", rateIndividual: "0.1", rateOther: "0.1", singleLimit: "0", annualLimit: "5000000", excessOnly: true, noPanRate: "5" },
];

export const tdsSection = (code: string) => TDS_SECTIONS.find((s) => s.code === code);

export interface TdsInput {
  /** The payment this time. */
  base: DecimalInput;
  /** Payments to this payee under this section earlier in the year, and the part of them already taxed. */
  priorBase?: DecimalInput;
  priorTaxedBase?: DecimalInput;
  individual: boolean;
  hasPan: boolean;
  rateOverride?: DecimalInput | null | undefined;
}

export interface TdsResult { rate: string; taxableBase: string; tds: string; noPan: boolean }

/** TDS on one payment: what part is over the limits, at the right rate, rounded to the rupee (section 288B). */
export function tdsOn(section: TdsSection, input: TdsInput): TdsResult {
  const base = dec(input.base);
  const prior = dec(input.priorBase ?? 0);
  const priorTaxed = dec(input.priorTaxedBase ?? 0);
  const total = prior.plus(base);
  const annual = dec(section.annualLimit);
  const single = dec(section.singleLimit);
  let taxable = dec(0);
  if (section.excessOnly) {
    taxable = D.max(0, total.minus(annual)).minus(D.max(0, prior.minus(annual)));
  } else if (total.gt(annual)) {
    // Over the year's limit: everything not yet taxed is taxed now, including earlier small payments.
    taxable = total.minus(priorTaxed);
  } else if (single.gt(0) && base.gt(single)) {
    taxable = base;
  }
  const normal = dec(input.rateOverride ?? (input.individual ? section.rateIndividual : section.rateOther));
  const noPan = !input.hasPan;
  const rate = input.rateOverride != null || !noPan ? normal : section.noPanRate ? dec(section.noPanRate) : D.max(normal.times(2), 20);
  return { rate: rate.toFixed(2), taxableBase: taxable.toFixed(2), tds: taxable.times(rate).div(100).toDecimalPlaces(0, D.ROUND_HALF_UP).toFixed(2), noPan };
}

/** The quarter (1 to 4, April to March) a date falls in. */
export const tdsQuarter = (isoDate: string) => Math.floor(((Number(isoDate.slice(5, 7)) + 8) % 12) / 3) + 1;

// ---- tax collected at source (Form 27EQ) -----------------------------------------------------------------

export interface TcsSection { code: string; nature: string; rate: string; noPanRate: string; note?: string }

/** The common collections a seller makes under section 206C. A seller of apparel rarely collects any; scrap sales are the usual case. */
export const TCS_SECTIONS: TcsSection[] = [
  { code: "206C(1) scrap", nature: "Sale of scrap", rate: "1", noPanRate: "5" },
  { code: "206C(1) timber", nature: "Timber obtained under a forest lease", rate: "2.5", noPanRate: "5" },
  { code: "206C(1) tendu", nature: "Tendu leaves", rate: "5", noPanRate: "5" },
  { code: "206C(1C)", nature: "Parking lot, toll plaza or mining and quarrying lease", rate: "2", noPanRate: "5" },
  { code: "206C(1H)", nature: "Sale of goods over Rs 50 lakh (omitted from 1 April 2025; for earlier years)", rate: "0.1", noPanRate: "1", note: "Only the part of the year's sales above Rs 50 lakh" },
];

export const tcsSection = (code: string) => TCS_SECTIONS.find((s) => s.code === code);

/** Tax to collect on a sale: the rate on the amount (twice the rate or the section's no-PAN rate when the buyer gave no PAN), to the rupee. */
export function tcsOn(section: TcsSection, input: { base: DecimalInput; hasPan: boolean; rateOverride?: DecimalInput | null | undefined }) {
  const rate = input.rateOverride != null ? dec(input.rateOverride) : input.hasPan ? dec(section.rate) : D.max(dec(section.rate).times(2), section.noPanRate);
  return { rate: rate.toFixed(2), tcs: dec(input.base).times(rate).div(100).toDecimalPlaces(0, D.ROUND_HALF_UP).toFixed(2), noPan: !input.hasPan };
}
