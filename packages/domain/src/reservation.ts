import { dec, type Dec, type DecimalInput } from "./money.js";

/**
 * Stock set aside for a sales order. One reservation per order line. What is still held is the lesser of what was reserved
 * and what the line still has to deliver, so delivering or invoicing a line releases its reservation by itself, and an order
 * that is closed or cancelled holds nothing. These rules are pure; the API reads the figures and applies them.
 */
export function heldQty(r: { reserved: DecimalInput; ordered: DecimalInput; done: DecimalInput; orderLive: boolean; released: boolean }): Dec {
  if (!r.orderLive || r.released) return dec(0);
  const left = dec(r.ordered).minus(r.done);
  const held = dec(r.reserved);
  const capped = held.lt(left) ? held : left;
  return capped.lt(0) ? dec(0) : capped;
}

export interface WantedLine { lineId: string; itemId: string; ordered: DecimalInput; done: DecimalInput; alreadyHeld: DecimalInput }
export interface Allocation { lineId: string; itemId: string; wanted: string; give: string; short: string }

/**
 * Shares what is free among the lines of one order, in line order. A line wants what it still has to deliver less what it
 * already holds; it gets that or what is left of the item's free stock, whichever is smaller. Nothing goes negative, and an
 * item that appears on two lines is not given twice.
 */
export function planReservation(lines: WantedLine[], free: Map<string, DecimalInput>): Allocation[] {
  const left = new Map([...free].map(([k, v]) => [k, dec(v)]));
  return lines.map((l) => {
    const wanted = dec(l.ordered).minus(l.done).minus(l.alreadyHeld);
    const want = wanted.gt(0) ? wanted : dec(0);
    const have = left.get(l.itemId) ?? dec(0);
    const give = want.lt(have) ? want : have.gt(0) ? have : dec(0);
    left.set(l.itemId, have.minus(give));
    return { lineId: l.lineId, itemId: l.itemId, wanted: want.toFixed(4), give: give.toFixed(4), short: want.minus(give).toFixed(4) };
  });
}

export interface Candidate { itemId: string; name: string; colour: string | null; size: string | null; free: DecimalInput }
export interface Substitute extends Candidate { covers: boolean }

/**
 * Other items of the same style that have free stock, most stock first, at most three. `covers` says whether one alone could
 * fill the whole shortage. The person decides; nothing is swapped automatically.
 */
export function suggestSubstitutes(short: DecimalInput, candidates: Candidate[], limit = 3): Substitute[] {
  return candidates
    .filter((c) => dec(c.free).gt(0))
    .sort((a, b) => dec(b.free).comparedTo(a.free) || a.name.localeCompare(b.name))
    .slice(0, limit)
    .map((c) => ({ ...c, covers: dec(c.free).gte(short) }));
}
