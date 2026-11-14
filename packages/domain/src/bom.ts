import { D, dec, money, type Dec, type DecimalInput } from "./money.js";

/**
 * Bills of materials: what goes into `outputQty` of an item, with a wastage allowance per
 * line. A component that has its own BOM is a sub-assembly and is exploded to its own materials
 * when planning multi-level; a cycle (A needs B needs A) is an error.
 */
export interface BomLine { itemId: string; qty: DecimalInput; wastagePct?: DecimalInput }
export interface Bom {
  itemId: string;
  outputQty: DecimalInput;
  lines: BomLine[];
  /** Labour and overheads for one batch of `outputQty` (e.g. work-centre time × rate). */
  overhead?: DecimalInput;
}

export class BomError extends Error {
  constructor(public code: "bom_cycle" | "bom_empty" | "invalid_output_qty", public itemId: string) {
    super(`${code}: ${itemId}`);
  }
}

const q4 = (v: Dec) => v.toDecimalPlaces(4, D.ROUND_HALF_UP);
/** Quantity of a line including its wastage allowance, per one unit of output. */
const perUnit = (bom: Bom, l: BomLine) => {
  if (!dec(bom.outputQty).gt(0)) throw new BomError("invalid_output_qty", bom.itemId);
  return dec(l.qty).times(dec(100).plus(l.wastagePct ?? 0)).div(100).div(bom.outputQty);
};

/**
 * Materials needed to make `qty` of an item. Single-level lists the BOM's own lines; multi-level keeps
 * going through sub-assemblies down to bought items. Same components are added together.
 */
export function explodeBom(boms: Record<string, Bom>, itemId: string, qty: DecimalInput, multiLevel = false): { itemId: string; qty: string }[] {
  const totals = new Map<string, Dec>();
  const walk = (id: string, need: Dec, path: string[]) => {
    if (path.includes(id)) throw new BomError("bom_cycle", id);
    const bom = boms[id]!;
    if (!bom.lines.length) throw new BomError("bom_empty", id);
    for (const l of bom.lines) {
      const q = perUnit(bom, l).times(need);
      if (multiLevel && boms[l.itemId]) walk(l.itemId, q, [...path, id]);
      else totals.set(l.itemId, (totals.get(l.itemId) ?? dec(0)).plus(q));
    }
  };
  if (!boms[itemId]) throw new BomError("bom_empty", itemId);
  walk(itemId, dec(qty), []);
  return [...totals.entries()].map(([id, q]) => ({ itemId: id, qty: q4(q).toFixed(4) }));
}

/**
 * Cost of one unit: materials at the given rates (sub-assemblies at their own rolled-up cost) plus
 * the BOM's overhead per unit. Rates are per unit of the component.
 */
export function rollupCost(boms: Record<string, Bom>, itemId: string, rates: Record<string, DecimalInput>) {
  const memo = new Map<string, Dec>();
  const cost = (id: string, path: string[]): Dec => {
    if (path.includes(id)) throw new BomError("bom_cycle", id);
    const bom = boms[id];
    if (!bom) return dec(rates[id] ?? 0);
    const hit = memo.get(id);
    if (hit) return hit;
    let total = dec(0);
    for (const l of bom.lines) total = total.plus(perUnit(bom, l).times(cost(l.itemId, [...path, id])));
    total = total.plus(dec(bom.overhead ?? 0).div(bom.outputQty));
    memo.set(id, total);
    return total;
  };
  const bom = boms[itemId];
  if (!bom) throw new BomError("bom_empty", itemId);
  const lines = bom.lines.map((l) => {
    const qty = perUnit(bom, l);
    const rate = cost(l.itemId, [itemId]);
    return { itemId: l.itemId, qtyPerUnit: q4(qty).toFixed(4), rate: rate.toDecimalPlaces(4, D.ROUND_HALF_UP).toFixed(4), cost: money(qty.times(rate)) };
  });
  const unit = cost(itemId, []);
  return { unitCost: unit.toDecimalPlaces(4, D.ROUND_HALF_UP).toFixed(4), overheadPerUnit: money(dec(bom.overhead ?? 0).div(bom.outputQty)), lines };
}

// ---- MRP ------------------------------------------------------------------------------------------------

export interface MrpItem {
  itemId: string;
  onHand: DecimalInput;
  /** Already coming in: open purchase orders and production orders. */
  onOrder: DecimalInput;
  /** Keep at least this much (the reorder level). */
  safetyStock?: DecimalInput;
  minOrderQty?: DecimalInput;
  leadTimeDays?: number;
  /** Whole units only (pieces, packets): planned quantities are rounded up. */
  wholeUnits?: boolean;
}
export interface Demand { itemId: string; qty: DecimalInput; dueDate: string }
export interface PlannedOrder { itemId: string; action: "make" | "buy"; qty: string; needBy: string; releaseBy: string; shortage: string }

const minusDays = (iso: string, days: number) => new Date(Date.parse(`${iso}T00:00:00Z`) - days * 86_400_000).toISOString().slice(0, 10);

/** Levels so every item is planned after all the items that use it (parents first). */
function lowLevelCodes(boms: Record<string, Bom>, ids: string[]) {
  const level = new Map<string, number>();
  const visit = (id: string, depth: number, path: string[]) => {
    if (path.includes(id)) throw new BomError("bom_cycle", id);
    if ((level.get(id) ?? -1) >= depth && path.length) return;
    level.set(id, Math.max(level.get(id) ?? 0, depth));
    for (const l of boms[id]?.lines ?? []) visit(l.itemId, depth + 1, [...path, id]);
  };
  for (const id of ids) visit(id, 0, []);
  return level;
}

/**
 * Material requirements: for each item (finished goods first, then what they're made of), the demand
 * not covered by stock on hand and on order, plus the safety stock, becomes a planned order — made if
 * it has a BOM, bought otherwise — due by the earliest demand and released lead-time days before.
 * A planned "make" order in turn creates demand for its components, due when it's released.
 */
export function planMrp(items: Record<string, MrpItem>, boms: Record<string, Bom>, demands: Demand[], today: string): PlannedOrder[] {
  const gross = new Map<string, { qty: Dec; due: string }>();
  const add = (id: string, qty: Dec, due: string) => {
    const g = gross.get(id);
    gross.set(id, { qty: (g?.qty ?? dec(0)).plus(qty), due: g && g.due < due ? g.due : due });
  };
  for (const d of demands) add(d.itemId, dec(d.qty), d.dueDate);
  const ids = [...new Set([...Object.keys(items), ...demands.map((d) => d.itemId)])];
  const levels = lowLevelCodes(boms, ids);
  const order = [...levels.entries()].sort((a, b) => a[1] - b[1]).map(([id]) => id);
  const planned: PlannedOrder[] = [];
  for (const id of order) {
    const it = items[id] ?? { itemId: id, onHand: 0, onOrder: 0 };
    const g = gross.get(id) ?? { qty: dec(0), due: today };
    const shortage = g.qty.plus(it.safetyStock ?? 0).minus(it.onHand).minus(it.onOrder);
    if (!shortage.gt(0)) continue;
    let qty = shortage.lt(it.minOrderQty ?? 0) ? dec(it.minOrderQty!) : shortage;
    qty = it.wholeUnits ? qty.toDecimalPlaces(0, D.ROUND_UP) : q4(qty);
    const needBy = g.due < today ? today : g.due;
    const released = minusDays(needBy, it.leadTimeDays ?? 0);
    const releaseBy = released < today ? today : released;
    const make = !!boms[id];
    planned.push({ itemId: id, action: make ? "make" : "buy", qty: qty.toFixed(4), needBy, releaseBy, shortage: q4(shortage).toFixed(4) });
    if (make) for (const c of explodeBom(boms, id, qty)) add(c.itemId, dec(c.qty), releaseBy);
  }
  return planned;
}
