import { dec, type Dec, type DecimalInput } from "./money.js";

/**
 * Picking from bins. A pick list says, for each order line with stock set aside, which bin to take it from and how many.
 * Scanning checks the picker took the right item: a wrong item is not on the list at all, an extra is one more of an item whose
 * line is already complete, and a missing is a line short when the picker says they are done. Pure rules; the API stores them.
 */
export interface PickWant { lineId: string; itemId: string; toPick: DecimalInput }
export interface BinHolding { binId: string; code: string; itemId: string; qty: DecimalInput }
export interface PickAllocation { lineId: string; itemId: string; binId: string | null; code: string | null; qty: string }

/**
 * Chooses bins for each line, fullest bin first so a line touches as few bins as possible. A bin's stock is used up as lines
 * are served, so two lines for one item never take the same pieces twice. Whatever no bin holds is planned with no bin
 * (`binId: null`) and flagged as unplaced for the picker to find.
 */
export function planPick(wants: PickWant[], holdings: BinHolding[]): PickAllocation[] {
  const left = new Map<string, Dec>(holdings.map((h) => [`${h.binId}|${h.itemId}`, dec(h.qty)]));
  const out: PickAllocation[] = [];
  for (const w of wants) {
    let need = dec(w.toPick);
    const bins = holdings.filter((h) => h.itemId === w.itemId)
      .sort((a, b) => (left.get(`${b.binId}|${b.itemId}`)!).comparedTo(left.get(`${a.binId}|${a.itemId}`)!) || a.code.localeCompare(b.code));
    for (const b of bins) {
      if (!need.gt(0)) break;
      const have = left.get(`${b.binId}|${b.itemId}`)!;
      if (!have.gt(0)) continue;
      const take = need.lt(have) ? need : have;
      out.push({ lineId: w.lineId, itemId: w.itemId, binId: b.binId, code: b.code, qty: take.toFixed(4) });
      left.set(`${b.binId}|${b.itemId}`, have.minus(take));
      need = need.minus(take);
    }
    if (need.gt(0)) out.push({ lineId: w.lineId, itemId: w.itemId, binId: null, code: null, qty: need.toFixed(4) });
  }
  return out;
}

export interface PickLine { id: string; itemId: string; toPick: DecimalInput; picked: DecimalInput }
export type ScanResult = { kind: "ok"; lineId: string } | { kind: "extra" } | { kind: "wrong" };

/** What a scanned item means for the list: counts toward the first line of that item still open, is an extra, or is not on the list. */
export function scanResult(lines: PickLine[], itemId: string): ScanResult {
  const mine = lines.filter((l) => l.itemId === itemId);
  if (!mine.length) return { kind: "wrong" };
  const open = mine.find((l) => dec(l.picked).lt(l.toPick));
  return open ? { kind: "ok", lineId: open.id } : { kind: "extra" };
}

export interface Missing { lineId: string; itemId: string; missing: string }

/** Lines still short of what was to be picked. A list with any cannot be completed unless the short is accepted. */
export function missingLines(lines: PickLine[]): Missing[] {
  return lines.filter((l) => dec(l.picked).lt(l.toPick)).map((l) => ({ lineId: l.id, itemId: l.itemId, missing: dec(l.toPick).minus(l.picked).toFixed(4) }));
}

/** Items put away in a bin beyond what the godown holds: the bins are out of step with the stock. */
export function binDrift(holdings: { itemId: string; qty: DecimalInput }[], stock: Map<string, DecimalInput>): { itemId: string; assigned: string; inStock: string; over: string }[] {
  const assigned = new Map<string, Dec>();
  for (const h of holdings) assigned.set(h.itemId, (assigned.get(h.itemId) ?? dec(0)).plus(h.qty));
  return [...assigned].flatMap(([itemId, a]) => {
    const s = dec(stock.get(itemId) ?? 0);
    return a.gt(s) ? [{ itemId, assigned: a.toFixed(4), inStock: s.toFixed(4), over: a.minus(s).toFixed(4) }] : [];
  });
}
