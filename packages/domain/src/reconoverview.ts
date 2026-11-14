import { dec, money, type DecimalInput } from "./money.js";

/**
 * One workbench over the places the books must agree with something else: customers (ledger against the receivables
 * report), suppliers (ledger against the payables report), stock (register against the stock ledger), bank (statement lines
 * still unmatched) and GST credit (books against the GSTR-2B statement). Each area says ok, differs, or waiting (nothing
 * to compare yet), and by how much.
 */
export type ReconArea = "customers" | "suppliers" | "stock" | "bank" | "gst";
export type ReconState = "ok" | "differs" | "waiting";

export interface ReconRow { area: ReconArea; state: ReconState; left: string | null; right: string | null; difference: string | null; open: number; }

/** Two figures that should be equal. A rupee of rounding is tolerated. */
export function compareFigures(area: ReconArea, left: DecimalInput, right: DecimalInput, open = 0): ReconRow {
  const diff = dec(left).minus(right);
  return { area, state: diff.abs().lte(1) && open === 0 ? "ok" : "differs", left: money(left), right: money(right), difference: money(diff), open };
}

/** An area with nothing to compare, for example no GSTR-2B statement imported or no bank account linked. */
export const waitingRow = (area: ReconArea): ReconRow => ({ area, state: "waiting", left: null, right: null, difference: null, open: 0 });

/** Bank has no second figure: the question is how many statement lines are not matched to an entry yet. */
export function bankRow(unmatched: number, accounts: number): ReconRow {
  if (!accounts) return waitingRow("bank");
  return { area: "bank", state: unmatched === 0 ? "ok" : "differs", left: null, right: null, difference: null, open: unmatched };
}

/** Overall: the worst of the areas that could be compared. */
export function overallState(rows: ReconRow[]): ReconState {
  const live = rows.filter((r) => r.state !== "waiting");
  if (!live.length) return "waiting";
  return live.some((r) => r.state === "differs") ? "differs" : "ok";
}
