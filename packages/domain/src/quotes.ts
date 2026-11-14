import { dec, money, type DecimalInput } from "./money.js";

/**
 * Supplier quotes for one item, side by side. The estimated landed cost per piece is the quoted rate plus the freight and
 * other costs the buyer expects on it, before GST (recoverable GST is not a cost). Quotes past their validity are shown but
 * never ranked, and the cheapest valid one is marked.
 */
export interface Quote {
  id: string; supplier: string; rate: DecimalInput; extraCost: DecimalInput;
  minQty: DecimalInput | null; leadDays: number | null; validUntil: string | null; quotedOn: string;
}

export interface RankedQuote extends Quote {
  landed: string;
  expired: boolean;
  /** Dearer than the cheapest valid quote, in percent (0 for the cheapest). Null for an expired quote. */
  overCheapestPct: string | null;
  /** Landed cost against the last price actually paid, in percent (negative: cheaper). Null when nothing was bought before. */
  vsLastPaidPct: string | null;
  cheapest: boolean;
}

export function rankQuotes(quotes: Quote[], today: string, lastPaid: DecimalInput | null): RankedQuote[] {
  const rows = quotes.map((q) => {
    const landed = dec(q.rate).plus(q.extraCost);
    return { q, landed, expired: !!q.validUntil && q.validUntil < today };
  });
  const valid = rows.filter((r) => !r.expired);
  const low = valid.length ? valid.reduce((m, r) => (r.landed.lt(m) ? r.landed : m), valid[0]!.landed) : null;
  return rows
    .map(({ q, landed, expired }): RankedQuote => ({
      ...q, landed: money(landed), expired,
      overCheapestPct: expired || low === null || low.isZero() ? null : landed.minus(low).div(low).times(100).toDecimalPlaces(1).toFixed(1),
      vsLastPaidPct: lastPaid === null || dec(lastPaid).isZero() ? null : landed.minus(lastPaid).div(lastPaid).times(100).toDecimalPlaces(1).toFixed(1),
      cheapest: !expired && low !== null && landed.eq(low),
    }))
    .sort((a, b) => Number(a.expired) - Number(b.expired) || Number(a.landed) - Number(b.landed) || a.supplier.localeCompare(b.supplier));
}
