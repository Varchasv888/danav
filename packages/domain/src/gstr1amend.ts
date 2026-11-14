import { dec, money } from "./money.js";
import { GST_RATES } from "./gst.js";
import { validateGstin } from "./gstin.js";
import { gstPeriodOf, taxPeriod } from "./gstr.js";

/**
 * Amendments to supplies already reported in an earlier GSTR-1: the B2BA (invoices), CDNRA (credit and debit notes to
 * registered buyers) and B2CSA (B2C summaries) tables. Each amendment names the original and carries the corrected values.
 * The JSON keys follow the published offline-tool names; they have not been run through the current offline tool.
 */
export type AmendmentKind = "b2b" | "cdn" | "b2cs";

export interface AmendmentLine { rate: string; taxable: string; igst: string; cgst: string; sgst: string; cess: string }
export interface AmendmentInput {
  kind: AmendmentKind; period: string; ctin?: string | null | undefined;
  originalNumber?: string | null | undefined; originalDate?: string | null | undefined; originalPeriod?: string | null | undefined;
  number?: string | null | undefined; docDate?: string | null | undefined; noteType?: string | null | undefined;
  pos: string; intra: boolean; reverseCharge?: boolean | undefined; invoiceType?: string | null | undefined; value?: string | undefined; lines: AmendmentLine[];
}

const idt = (iso: string) => `${iso.slice(8, 10)}-${iso.slice(5, 7)}-${iso.slice(0, 4)}`;
const n = (v: string) => Number(money(v));
const monthOf = (fp: string) => taxPeriod(fp).from;

/** The reasons an amendment cannot be accepted, as short codes (empty when it is fine). */
export function amendmentProblems(a: AmendmentInput): string[] {
  const out: string[] = [];
  if (!/^(0[1-9]|1[0-2])\d{4}$/.test(a.period)) { out.push("invalid_period"); return out; }
  if (!a.lines.length) out.push("no_lines");
  if (a.kind !== "b2cs") {
    if (!a.ctin || !validateGstin(a.ctin).valid) out.push("invalid_gstin");
    if (!a.originalNumber?.trim() || !a.originalDate) out.push("original_required");
    if (!a.number?.trim() || !a.docDate) out.push("corrected_required");
    // The original must belong to an earlier return than the one reporting the correction.
    if (a.originalDate && monthOf(gstPeriodOf(a.originalDate)) >= monthOf(a.period)) out.push("original_not_earlier");
  } else {
    if (!a.originalPeriod || !/^(0[1-9]|1[0-2])\d{4}$/.test(a.originalPeriod)) out.push("original_period_required");
    else if (monthOf(a.originalPeriod) >= monthOf(a.period)) out.push("original_not_earlier");
  }
  if (a.kind === "cdn" && a.noteType !== "C" && a.noteType !== "D") out.push("note_type_required");
  for (const l of a.lines) {
    const rate = dec(l.rate);
    if (!(GST_RATES as readonly string[]).includes(rate.toString())) out.push("invalid_rate");
    if (dec(l.taxable).lt(0)) out.push("negative_amount");
    if (a.intra && !dec(l.igst).isZero()) out.push("igst_on_intra");
    if (!a.intra && (!dec(l.cgst).isZero() || !dec(l.sgst).isZero())) out.push("cgst_sgst_on_inter");
    // Tax must follow the rate, within a rupee for rounding.
    const expected = dec(l.taxable).times(rate).div(100);
    const given = dec(l.igst).plus(l.cgst).plus(l.sgst);
    if (expected.minus(given).abs().gt(1)) out.push("tax_does_not_match_rate");
  }
  return [...new Set(out)];
}

const items = (lines: AmendmentLine[], intra: boolean) => lines.map((l, i) => ({
  num: i + 1,
  itm_det: { txval: n(l.taxable), rt: Number(l.rate), ...(intra ? { camt: n(l.cgst), samt: n(l.sgst) } : { iamt: n(l.igst) }), csamt: n(l.cess) },
}));

export interface AmendmentRow extends AmendmentInput { value: string }

/** The three amendment tables of a GSTR-1 for the rows reported in it. Tables with no rows are left out. */
export function amendmentSections(rows: AmendmentRow[]) {
  const group = <T,>(xs: AmendmentRow[], row: (r: AmendmentRow) => T) => {
    const m = new Map<string, T[]>();
    for (const r of xs) { const k = r.ctin!; m.set(k, [...(m.get(k) ?? []), row(r)]); }
    return [...m.entries()];
  };
  const b2ba = group(rows.filter((r) => r.kind === "b2b"), (r) => ({
    oinum: r.originalNumber, oidt: idt(r.originalDate!), inum: r.number, idt: idt(r.docDate!), val: n(r.value), pos: r.pos,
    rchrg: r.reverseCharge ? "Y" : "N", inv_typ: r.invoiceType ?? "R", itms: items(r.lines, r.intra),
  })).map(([ctin, inv]) => ({ ctin, inv }));
  const cdnra = group(rows.filter((r) => r.kind === "cdn"), (r) => ({
    ont_num: r.originalNumber, ont_dt: idt(r.originalDate!), nt_num: r.number, nt_dt: idt(r.docDate!), ntty: r.noteType, val: n(r.value), pos: r.pos,
    rchrg: r.reverseCharge ? "Y" : "N", inv_typ: r.invoiceType ?? "R", itms: items(r.lines, r.intra),
  })).map(([ctin, nt]) => ({ ctin, nt }));
  const b2csa = rows.filter((r) => r.kind === "b2cs").flatMap((r) => r.lines.map((l) => ({
    omon: r.originalPeriod, sply_ty: r.intra ? "INTRA" : "INTER", pos: r.pos, typ: "OE", rt: Number(l.rate), txval: n(l.taxable),
    ...(r.intra ? { camt: n(l.cgst), samt: n(l.sgst) } : { iamt: n(l.igst) }), csamt: n(l.cess),
  })));
  return { ...(b2ba.length ? { b2ba } : {}), ...(cdnra.length ? { cdnra } : {}), ...(b2csa.length ? { b2csa } : {}) };
}
