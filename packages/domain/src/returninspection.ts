import { dec, type Dec, type DecimalInput } from "./money.js";

/**
 * Goods a customer sent back wait in the Quality hold godown until someone looks at them. For each line the inspector decides
 * how many go back on the shelf (restock) and how many are written off; what is not yet decided stays on hold. Pure rules; the
 * API moves the stock.
 */
export interface Inspection { qty: DecimalInput; restocked: DecimalInput; writtenOff: DecimalInput }

export const remainingToInspect = (i: Inspection): Dec => {
  const r = dec(i.qty).minus(i.restocked).minus(i.writtenOff);
  return r.gt(0) ? r : dec(0);
};

export type InspectionState = "pending" | "done";
export const inspectionState = (i: Inspection): InspectionState => (remainingToInspect(i).isZero() ? "done" : "pending");

/** Reasons a decision cannot be accepted (empty when fine). */
export function inspectionProblems(i: Inspection, d: { restock: DecimalInput; writeOff: DecimalInput }): string[] {
  const out: string[] = [];
  if (dec(d.restock).lt(0) || dec(d.writeOff).lt(0)) out.push("negative_quantity");
  if (!dec(d.restock).plus(d.writeOff).gt(0)) out.push("nothing_decided");
  if (dec(d.restock).plus(d.writeOff).gt(remainingToInspect(i))) out.push("more_than_remaining");
  return out;
}
