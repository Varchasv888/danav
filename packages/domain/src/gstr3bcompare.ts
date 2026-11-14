import { dec, money } from "./money.js";
import type { ItcHeads } from "./gstfiling.js";

/**
 * GSTR-3B side by side: the ERP's own figures, what the portal pre-filled, and what the accountant finally filed, line by
 * line and tax head by tax head. A line is "waiting" until a portal or final figure has been typed in, "match" when every
 * typed figure is within a paisa of the ERP, and "differs" otherwise.
 */
export const COMPARE_LINES = ["outwardTax", "itcAvailable", "itcReversed", "itcNet", "cashPayable"] as const;
export type CompareLine = (typeof COMPARE_LINES)[number];
export const COMPARE_HEADS = ["igst", "cgst", "sgst", "cess"] as const;
export type CompareFigures = Partial<Record<CompareLine, Partial<ItcHeads>>>;

export interface CompareCell { erp: string; portal: string | null; final: string | null; diffPortal: string | null; diffFinal: string | null }
export interface CompareRow { line: CompareLine; status: "waiting" | "match" | "differs"; heads: Record<(typeof COMPARE_HEADS)[number], CompareCell> }

const AMOUNT = /^-?\d+(\.\d{1,2})?$/;
/** Keeps only known lines and heads with valid amounts, so nothing odd is stored. */
export function cleanCompareFigures(input: unknown): CompareFigures {
  const out: CompareFigures = {};
  if (!input || typeof input !== "object") return out;
  for (const line of COMPARE_LINES) {
    const src = (input as Record<string, unknown>)[line];
    if (!src || typeof src !== "object") continue;
    const heads: Partial<ItcHeads> = {};
    for (const h of COMPARE_HEADS) {
      const v = (src as Record<string, unknown>)[h];
      if (typeof v === "string" && AMOUNT.test(v.trim())) heads[h] = money(v.trim());
    }
    if (Object.keys(heads).length) out[line] = heads;
  }
  return out;
}

export function compare3b(erp: Record<CompareLine, ItcHeads>, portal: CompareFigures, final: CompareFigures): CompareRow[] {
  return COMPARE_LINES.map((line) => {
    let typed = false, differs = false;
    const heads = Object.fromEntries(COMPARE_HEADS.map((h) => {
      const e = money(erp[line][h]);
      const p = portal[line]?.[h] ?? null, f = final[line]?.[h] ?? null;
      const dP = p === null ? null : money(dec(p).minus(e)), dF = f === null ? null : money(dec(f).minus(e));
      if (p !== null || f !== null) typed = true;
      if ((dP !== null && !dec(dP).abs().lt("0.01")) || (dF !== null && !dec(dF).abs().lt("0.01"))) differs = true;
      return [h, { erp: e, portal: p, final: f, diffPortal: dP, diffFinal: dF }];
    })) as CompareRow["heads"];
    return { line, status: !typed ? "waiting" : differs ? "differs" : "match", heads };
  });
}
