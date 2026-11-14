import { dec } from "./money.js";

/**
 * Goods counted at the gate against the purchase order. For each order line: what is still to come (ordered less already received), what has been counted,
 * and whether it is short, exact or over. Items counted that the order does not list are "notOnOrder", and codes that belong to no item are "unknown".
 */
export interface ReceivingOrderLine { lineId: string; itemId: string; ordered: string; received: string }
export interface ReceivingScan { itemId: string | null; code: string; qty: string }
export type ReceivingState = "complete" | "short" | "over";
export interface ReceivingRow { lineId: string; itemId: string; ordered: string; received: string; open: string; counted: string; difference: string; state: ReceivingState }

export function receivingCheck(lines: ReceivingOrderLine[], scans: ReceivingScan[]) {
  const counted = new Map<string, ReturnType<typeof dec>>();
  const unknown: { code: string; qty: string }[] = [];
  for (const s of scans) {
    if (!s.itemId) { unknown.push({ code: s.code, qty: s.qty }); continue; }
    counted.set(s.itemId, (counted.get(s.itemId) ?? dec(0)).plus(s.qty));
  }
  // An item on two order lines is filled in line order, so a count is never shown twice.
  const left = new Map(counted);
  const rows: ReceivingRow[] = lines.map((l) => {
    const open = dec(l.ordered).minus(l.received);
    const have = left.get(l.itemId) ?? dec(0);
    const openPos = open.gt(0) ? open : dec(0);
    const take = have.lt(openPos) ? have : openPos;
    left.set(l.itemId, have.minus(take));
    return { lineId: l.lineId, itemId: l.itemId, ordered: dec(l.ordered).toFixed(4), received: dec(l.received).toFixed(4), open: openPos.toFixed(4), counted: take.toFixed(4), difference: take.minus(openPos).toFixed(4), state: take.eq(openPos) ? "complete" : "short" };
  });
  // Whatever is left over after every line is filled is over-delivery on the last line for that item, or not on the order at all.
  const onOrder = new Set(lines.map((l) => l.itemId));
  const notOnOrder: { itemId: string; qty: string }[] = [];
  for (const [itemId, q] of left) {
    if (q.lte(0)) continue;
    if (onOrder.has(itemId)) {
      const last = [...rows].reverse().find((r) => r.itemId === itemId)!;
      last.counted = dec(last.counted).plus(q).toFixed(4);
      last.difference = dec(last.counted).minus(last.open).toFixed(4);
      last.state = "over";
    } else notOnOrder.push({ itemId, qty: q.toFixed(4) });
  }
  const problems = rows.filter((r) => r.state !== "complete").length + notOnOrder.length + unknown.length;
  return { rows, notOnOrder, unknown, problems, allIn: rows.every((r) => r.state === "complete") && !notOnOrder.length && !unknown.length };
}
export type ReceivingCheck = ReturnType<typeof receivingCheck>;
