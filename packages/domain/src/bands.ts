import { dec, type DecimalInput } from "./money.js";

/**
 * Mark-up by purchase rate. The band that applies is the one with the highest "from" at or below the cost; the MRP is the cost plus the mark-up
 * rounded the way shops print it (ending in 9), and the two sale rates come off that MRP.
 */
export interface MarginBand { fromRate: DecimalInput; markupPct: DecimalInput; markdown1Pct: DecimalInput; markdown2Pct: DecimalInput }

export function bandFor<T extends MarginBand>(bands: T[], cost: DecimalInput): T | null {
  let best: T | null = null;
  for (const b of bands) if (dec(cost).gte(b.fromRate) && (!best || dec(b.fromRate).gt(best.fromRate))) best = b;
  return best;
}

/** Rounds up to the next price ending in 9 (1,287 becomes 1,289, 1,290 becomes 1,299). */
export const endIn9 = (raw: DecimalInput) => dec(raw).plus(1).div(10).ceil().times(10).minus(1);

export function priceFromBand(band: MarginBand, cost: DecimalInput) {
  const mrp = endIn9(dec(cost).times(dec(100).plus(band.markupPct)).div(100));
  const sale = (pct: DecimalInput) => dec(mrp).times(dec(100).minus(pct)).div(100).toDecimalPlaces(0).toFixed(2);
  return { mrp: mrp.toFixed(2), sale1: sale(band.markdown1Pct), sale2: sale(band.markdown2Pct) };
}
