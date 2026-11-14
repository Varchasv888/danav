import { D, dec, money, type DecimalInput } from "./money.js";

/**
 * Depreciation of fixed assets.
 *
 * Books (Companies Act 2013, Schedule II): straight line or written down value over the asset's
 * useful life, down to a residual value (usually 5% of cost), charged pro rata by days from the date
 * the asset is put to use and up to the date it is sold.
 *
 * Income tax (section 32): assets are pooled in blocks with one rate; depreciation is on the block's
 * written down value, at half the rate on additions used for less than 180 days in the year. A block
 * whose sales exceed its value gives a short-term capital gain (section 50).
 */

export class DepreciationError extends Error {
  constructor(public code: "invalid_life" | "invalid_residual" | "invalid_cost" | "invalid_period") {
    super(code);
  }
}

export type DepMethod = "slm" | "wdv";

export interface BookAsset {
  cost: DecimalInput;
  method: DepMethod;
  lifeYears: DecimalInput;
  /** Residual value as % of cost (Schedule II allows up to 5% without justification). */
  residualPct: DecimalInput;
  putToUseOn: string;
  disposedOn?: string | null | undefined;
}

export interface DepPeriod {
  /** The financial year the period falls in (a period never crosses 31 March). */
  fyStart: string;
  fyEnd: string;
  from: string;
  to: string;
}

const DAY = 86_400_000;
export const daysBetween = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / DAY);
export const addDaysIso = (d: string, n: number) => new Date(Date.parse(`${d}T00:00:00Z`) + n * DAY).toISOString().slice(0, 10);

/** WDV rate that brings cost down to the residual value over the life: 1 − (residual / cost)^(1 / life). */
export function wdvRate(lifeYears: DecimalInput, residualPct: DecimalInput) {
  const life = dec(lifeYears);
  const r = dec(residualPct).div(100);
  if (!life.gt(0)) throw new DepreciationError("invalid_life");
  if (!r.gt(0) || !r.lt(1)) throw new DepreciationError("invalid_residual");
  return dec(1).minus(D.pow(r, dec(1).div(life)));
}

/**
 * Book depreciation for a period.
 * @param accumulatedAtFyStart depreciation charged on this asset before the financial year began (the WDV base)
 * @param accumulatedBefore depreciation charged before this period (caps the total at cost − residual)
 */
export function bookDepreciation(a: BookAsset, p: DepPeriod, accumulatedAtFyStart: DecimalInput, accumulatedBefore: DecimalInput) {
  const cost = dec(a.cost);
  if (!cost.gt(0)) throw new DepreciationError("invalid_cost");
  if (!dec(a.lifeYears).gt(0)) throw new DepreciationError("invalid_life");
  if (p.from > p.to || p.from < p.fyStart || p.to > p.fyEnd) throw new DepreciationError("invalid_period");
  const start = a.putToUseOn > p.from ? a.putToUseOn : p.from;
  const end = a.disposedOn && a.disposedOn < p.to ? a.disposedOn : p.to;
  const residual = cost.times(a.residualPct).div(100);
  const remaining = cost.minus(residual).minus(accumulatedBefore);
  if (start > end || !remaining.gt(0)) return { amount: "0.00", days: 0 };
  const days = daysBetween(start, end) + 1;
  const yearDays = daysBetween(p.fyStart, p.fyEnd) + 1;
  const annual = a.method === "slm"
    ? cost.minus(residual).div(a.lifeYears)
    : cost.minus(accumulatedAtFyStart).times(wdvRate(a.lifeYears, a.residualPct));
  const amount = D.min(annual.times(days).div(yearDays), remaining);
  return { amount: money(amount), days };
}

/** Profit (positive) or loss on selling an asset: sale value − (cost − accumulated depreciation). */
export function disposalResult(cost: DecimalInput, accumulated: DecimalInput, saleValue: DecimalInput) {
  const bookValue = dec(cost).minus(accumulated);
  return { bookValue: money(bookValue), profit: money(dec(saleValue).minus(bookValue)) };
}

// ---- Income tax blocks -------------------------------------------------------------------------------

export interface ItBlockInput {
  rate: DecimalInput;
  openingWdv: DecimalInput;
  /** Assets acquired in the year: cost and the date first put to use. */
  additions: { cost: DecimalInput; putToUseOn: string }[];
  /** Money received or receivable on assets of the block sold or discarded in the year. */
  sales: DecimalInput[];
  /** True when no asset of the block is left at the year end (the balance is then a capital loss). */
  blockCeases?: boolean | undefined;
}

/** One financial year of a block of assets (the tax audit report's clause 18 schedule). */
export function itBlockDepreciation(b: ItBlockInput, fyEnd: string) {
  const rate = dec(b.rate).div(100);
  let full = dec(b.openingWdv);
  let half = dec(0);
  let addFull = dec(0);
  let addHalf = dec(0);
  for (const a of b.additions) {
    // "Put to use for less than 180 days" in the year of acquisition.
    const used = daysBetween(a.putToUseOn, fyEnd) + 1;
    if (used < 180) { half = half.plus(a.cost); addHalf = addHalf.plus(a.cost); } else { full = full.plus(a.cost); addFull = addFull.plus(a.cost); }
  }
  const sales = b.sales.reduce<ReturnType<typeof dec>>((s, v) => s.plus(v), dec(0));
  full = full.minus(sales);
  if (full.lt(0)) { half = half.plus(full); full = dec(0); }
  const out = {
    openingWdv: money(b.openingWdv), additionsFullRate: money(addFull), additionsHalfRate: money(addHalf), sales: money(sales),
    depreciation: "0.00", closingWdv: "0.00", shortTermGain: "0.00", shortTermLoss: "0.00",
  };
  if (half.lt(0)) return { ...out, shortTermGain: money(half.neg()) };
  if (b.blockCeases) return { ...out, shortTermLoss: money(full.plus(half)) };
  const depreciation = dec(money(full.times(rate))).plus(money(half.times(rate).div(2)));
  return { ...out, depreciation: money(depreciation), closingWdv: money(full.plus(half).minus(depreciation)) };
}

// ---- Presets ---------------------------------------------------------------------------------------

/** Common asset classes: Schedule II useful lives and the income-tax block rates. Check them each year. */
export const ASSET_CLASS_PRESETS = [
  { key: "building", name: "Buildings (other than factory)", nameHi: "भवन (कारख़ाने के अलावा)", lifeYears: 60, itBlock: "building", itRate: 10 },
  { key: "factory_building", name: "Factory buildings", nameHi: "कारख़ाना भवन", lifeYears: 30, itBlock: "building", itRate: 10 },
  { key: "plant_machinery", name: "Plant & machinery", nameHi: "संयंत्र और मशीनरी", lifeYears: 15, itBlock: "plant_machinery", itRate: 15 },
  { key: "furniture", name: "Furniture & fittings", nameHi: "फ़र्नीचर और फ़िटिंग", lifeYears: 10, itBlock: "furniture", itRate: 10 },
  { key: "vehicles", name: "Motor vehicles", nameHi: "मोटर वाहन", lifeYears: 8, itBlock: "plant_machinery", itRate: 15 },
  { key: "two_wheelers", name: "Two-wheelers", nameHi: "दोपहिया वाहन", lifeYears: 10, itBlock: "plant_machinery", itRate: 15 },
  { key: "computers", name: "Computers & laptops", nameHi: "कंप्यूटर और लैपटॉप", lifeYears: 3, itBlock: "computers", itRate: 40 },
  { key: "servers", name: "Servers & networks", nameHi: "सर्वर और नेटवर्क", lifeYears: 6, itBlock: "computers", itRate: 40 },
  { key: "office_equipment", name: "Office equipment", nameHi: "कार्यालय उपकरण", lifeYears: 5, itBlock: "plant_machinery", itRate: 15 },
  { key: "electrical", name: "Electrical installations", nameHi: "विद्युत संस्थापन", lifeYears: 10, itBlock: "plant_machinery", itRate: 15 },
  { key: "software", name: "Computer software", nameHi: "कंप्यूटर सॉफ़्टवेयर", lifeYears: 5, itBlock: "computers", itRate: 40 },
  { key: "intangibles", name: "Patents, trademarks & know-how", nameHi: "पेटेंट, ट्रेडमार्क और तकनीकी ज्ञान", lifeYears: 10, itBlock: "intangibles", itRate: 25 },
] as const;
