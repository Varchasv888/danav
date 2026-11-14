/** Journal entries that move GST alone: no goods, no party bill, just the tax accounts. */
export const GST_HEADS = ["cgst", "sgst", "igst", "cess"] as const;
export type GstHead = (typeof GST_HEADS)[number];

export const GST_JV_KINDS = ["setoff", "itc_reverse", "itc_claim", "liability_add", "liability_cut"] as const;
export type GstJvKind = (typeof GST_JV_KINDS)[number];

/** Which credit pays which liability, as the GST law orders it: IGST credit pays IGST, CGST and SGST; CGST and SGST credit pay their own head and IGST, never each other. */
export const SETOFF_ALLOWED: Record<GstHead, readonly GstHead[]> = {
  igst: ["igst", "cgst", "sgst"],
  cgst: ["cgst", "igst"],
  sgst: ["sgst", "igst"],
  cess: ["cess"],
};

/** True when `credit` may be used against `liability`. */
export function canSetOff(credit: GstHead, liability: GstHead) {
  return SETOFF_ALLOWED[credit].includes(liability);
}
