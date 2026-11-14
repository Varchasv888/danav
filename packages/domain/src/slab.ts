import { dec, type DecimalInput } from "./money.js";

/**
 * GST rates that depend on the price of each piece. Garments (Chapters 61 and 62) and made-ups
 * (Chapter 63, except 6309 and the sack sub-headings) pay a lower rate up to a sale value per piece and
 * a higher one above it; footwear does the same per pair. The test uses the value after any discount
 * shown on the invoice and before GST.
 */
export type GstSlab = "apparel" | "footwear";
export const GST_SLABS = ["apparel", "footwear"] as const;

export interface SlabPeriod { from: string; threshold: string; below: string; above: string }

const PERIODS: Record<GstSlab, SlabPeriod[]> = {
  // 5% up to Rs 1,000 and 12% above until 21 Sep 2025; 5% up to Rs 2,500 and 18% above from
  // 22 Sep 2025 (56th GST Council, 3 Sep 2025).
  apparel: [
    { from: "2017-07-01", threshold: "1000", below: "5", above: "12" },
    { from: "2025-09-22", threshold: "2500", below: "5", above: "18" },
  ],
  // 12% up to Rs 1,000 a pair and 18% above from 1 Jan 2022 (earlier rules are not modelled);
  // 5% up to Rs 2,500 and 18% above from 22 Sep 2025.
  footwear: [
    { from: "2022-01-01", threshold: "1000", below: "12", above: "18" },
    { from: "2025-09-22", threshold: "2500", below: "5", above: "18" },
  ],
};

export const isGstSlab = (v: unknown): v is GstSlab => typeof v === "string" && (GST_SLABS as readonly string[]).includes(v);

/** The rule in force on a date (the earliest one for dates before it). */
export function slabPeriod(slab: GstSlab, date: string): SlabPeriod {
  const list = PERIODS[slab];
  let found = list[0]!;
  for (const p of list) if (p.from <= date) found = p;
  return found;
}

/** Rate for a per-piece value that excludes GST: at or below the threshold takes the lower rate. */
export function slabRate(slab: GstSlab, date: string, pieceValue: DecimalInput): string {
  const p = slabPeriod(slab, date);
  return dec(pieceValue).lte(p.threshold) ? p.below : p.above;
}

/**
 * Rate for a per-piece price that already includes GST (shop and MRP prices): the price is worked back
 * at the lower rate and tested. Prices whose value would fall on the other side of the threshold at
 * either rate (for apparel, above Rs 2,625 up to Rs 2,950) take the higher rate and are reported by
 * {@link slabAmbiguous}.
 */
export function slabRateInclusive(slab: GstSlab, date: string, piecePrice: DecimalInput): string {
  const p = slabPeriod(slab, date);
  const value = dec(piecePrice).times(100).div(dec(100).plus(p.below));
  return value.lte(p.threshold) ? p.below : p.above;
}

/** An inclusive price in the band where neither rate gives a consistent value. */
export function slabAmbiguous(slab: GstSlab, date: string, piecePrice: DecimalInput): boolean {
  const p = slabPeriod(slab, date);
  const price = dec(piecePrice);
  const t = dec(p.threshold);
  return price.gt(t.times(dec(100).plus(p.below)).div(100)) && price.lte(t.times(dec(100).plus(p.above)).div(100));
}

export interface SlabItem {
  gstRate: DecimalInput;
  gstSlab?: string | null | undefined;
  /** Pieces in one unit for the test (a set of four sold as one unit is 4; 1 treats the set as one piece). */
  slabPieces?: number | null | undefined;
}

/**
 * The GST rate for an invoice line: the item's own rate, or the slab rate for its value per piece
 * (line value after the line discount, divided by quantity and by pieces per unit).
 */
export function lineGstRate(item: SlabItem, line: { qty: DecimalInput; rate: DecimalInput; discount?: DecimalInput | undefined }, date: string, inclusive = false): string {
  if (!isGstSlab(item.gstSlab)) return dec(item.gstRate).toString();
  const pieces = Math.max(1, item.slabPieces ?? 1);
  const qty = dec(line.qty);
  const perUnit = qty.isZero() ? dec(line.rate) : qty.times(line.rate).minus(line.discount ?? 0).div(qty);
  const perPiece = perUnit.div(pieces);
  return inclusive ? slabRateInclusive(item.gstSlab, date, perPiece) : slabRate(item.gstSlab, date, perPiece);
}
