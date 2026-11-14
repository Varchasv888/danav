import { dec } from "./money.js";

/**
 * A challan's packing list: the cartons packed for it set against what the challan says went out. Each item is "ok" when the cartons hold exactly the
 * challan quantity, "short" when they hold less (something is not packed yet), and "extra" when they hold more or hold an item the challan does not list.
 */
export interface PackingChallanLine { itemId: string; qty: string }
export interface PackingBoxIn { id: string; code: string; lines: { itemId: string; qty: string }[] }
export type PackingState = "ok" | "short" | "extra";
export interface PackingRow { itemId: string; challanQty: string; packedQty: string; difference: string; state: PackingState }

export function comparePacking(challan: PackingChallanLine[], boxes: PackingBoxIn[]) {
  const want = new Map<string, ReturnType<typeof dec>>();
  for (const l of challan) want.set(l.itemId, (want.get(l.itemId) ?? dec(0)).plus(l.qty));
  const packed = new Map<string, ReturnType<typeof dec>>();
  for (const b of boxes) for (const l of b.lines) packed.set(l.itemId, (packed.get(l.itemId) ?? dec(0)).plus(l.qty));
  const ids = [...new Set([...want.keys(), ...packed.keys()])];
  const rows: PackingRow[] = ids.map((itemId) => {
    const w = want.get(itemId) ?? dec(0), p = packed.get(itemId) ?? dec(0);
    const diff = p.minus(w);
    return { itemId, challanQty: w.toFixed(4), packedQty: p.toFixed(4), difference: diff.toFixed(4), state: diff.isZero() ? "ok" : diff.lt(0) ? "short" : "extra" };
  });
  const pieces = boxes.reduce((t, b) => b.lines.reduce((s, l) => s.plus(l.qty), t), dec(0));
  return {
    rows, boxCount: boxes.length, packedPieces: pieces.toFixed(4),
    complete: boxes.length > 0 && rows.every((r) => r.state === "ok"),
    problems: rows.filter((r) => r.state !== "ok").length,
  };
}
export type PackingComparison = ReturnType<typeof comparePacking>;
