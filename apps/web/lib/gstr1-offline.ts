import { findState } from "@varchasv/domain";
import type { SheetSpec, XlsxCell, XlsxColumn } from "./xlsx-export";

/**
 * GSTR-1 as the workbook the GST offline utility reads: one sheet per table (b2b, b2cl, b2cs, cdnr, cdnur, exp, hsn, docs),
 * one row per invoice and tax rate, headers on row 4 and data from row 5, dates as dates, place of supply as "27-Maharashtra".
 * Built from the same figures as the portal JSON. The sheet and column names follow the offline utility's published template
 * and have not been checked against its current version, so the first file should be opened in the utility to confirm.
 */
interface Item { itm_det: { txval: number; rt: number; iamt?: number; camt?: number; samt?: number; csamt?: number } }
interface Doc { inum?: string; idt?: string; val: number; pos?: string; rchrg?: string; inv_typ?: string; itms: Item[]; nt_num?: string; nt_dt?: string; ntty?: string; typ?: string; exp_typ?: string }
export interface Gstr1Json {
  b2b?: { ctin: string; inv: Doc[] }[]; b2cl?: { pos: string; inv: Doc[] }[];
  b2cs?: { sply_ty: string; pos: string; rt: number; txval: number; csamt: number }[];
  exp?: { exp_typ: string; inv: Doc[] }[]; cdnr?: { ctin: string; nt: Doc[] }[]; cdnur?: Doc[];
  hsn?: { hsn_b2b?: HsnRow[]; hsn_b2c?: HsnRow[] };
  doc_issue?: { doc_det?: { doc_num: number; docs: { from: string; to: string; totnum: number; cancel: number; net_issue: number }[] }[] };
}
interface HsnRow { hsn_sc: string; uqc: string; qty: number; rt: number; txval: number; iamt: number; camt: number; samt: number; csamt: number }

const col = (label: string, type: XlsxColumn["type"] = "text", width?: number): XlsxColumn => (width ? { label, type, width } : { label, type });
const iso = (d: string | undefined): string => (d && /^\d{2}-\d{2}-\d{4}$/.test(d) ? `${d.slice(6)}-${d.slice(3, 5)}-${d.slice(0, 2)}` : d ?? "");
const place = (pos: string | undefined) => { const s = pos ? findState(pos) : undefined; return s ? `${s.code}-${s.name}` : pos ?? ""; };
const INV_TYPE: Record<string, string> = { R: "Regular B2B", SEWP: "SEZ supplies with payment", SEWOP: "SEZ supplies without payment", DE: "Deemed Exp", CBW: "Intra-State supplies attracting IGST" };
const NOTE_TYPE: Record<string, string> = { C: "Credit Note", D: "Debit Note" };
const none = "";

export function gstr1OfflineSheets(j: Gstr1Json, periodLabel: string): SheetSpec[] {
  const note = `${periodLabel}. Prepared from the books; check against the GST offline utility before upload.`;
  const sheets: SheetSpec[] = [];
  const sheet = (title: string, columns: XlsxColumn[], rows: XlsxCell[][]) => sheets.push({ title, note, columns, rows });

  const b2b: XlsxCell[][] = [];
  for (const s of j.b2b ?? []) for (const inv of s.inv) for (const it of inv.itms) {
    b2b.push([s.ctin, none, inv.inum ?? "", iso(inv.idt), inv.val, place(inv.pos), inv.rchrg ?? "N", none, INV_TYPE[inv.inv_typ ?? "R"] ?? "Regular B2B", none, it.itm_det.rt, it.itm_det.txval, it.itm_det.csamt ?? 0]);
  }
  sheet("b2b", [col("GSTIN/UIN of Recipient", "text", 20), col("Receiver Name", "text", 24), col("Invoice Number"), col("Invoice date", "date"), col("Invoice Value", "money"), col("Place Of Supply", "text", 22), col("Reverse Charge"),
    col("Applicable % of Tax Rate"), col("Invoice Type", "text", 26), col("E-Commerce GSTIN"), col("Rate", "money"), col("Taxable Value", "money"), col("Cess Amount", "money")], b2b);

  const b2cl: XlsxCell[][] = [];
  for (const s of j.b2cl ?? []) for (const inv of s.inv) for (const it of inv.itms) b2cl.push([inv.inum ?? "", iso(inv.idt), inv.val, place(s.pos), none, it.itm_det.rt, it.itm_det.txval, it.itm_det.csamt ?? 0, none]);
  sheet("b2cl", [col("Invoice Number"), col("Invoice date", "date"), col("Invoice Value", "money"), col("Place Of Supply", "text", 22), col("Applicable % of Tax Rate"), col("Rate", "money"), col("Taxable Value", "money"), col("Cess Amount", "money"), col("E-Commerce GSTIN")], b2cl);

  sheet("b2cs", [col("Type"), col("Place Of Supply", "text", 22), col("Applicable % of Tax Rate"), col("Rate", "money"), col("Taxable Value", "money"), col("Cess Amount", "money"), col("E-Commerce GSTIN")],
    (j.b2cs ?? []).map((r) => ["OE", place(r.pos), none, r.rt, r.txval, r.csamt ?? 0, none]));

  const cdnr: XlsxCell[][] = [];
  for (const s of j.cdnr ?? []) for (const nt of s.nt) for (const it of nt.itms) {
    cdnr.push([s.ctin, none, nt.nt_num ?? "", iso(nt.nt_dt), NOTE_TYPE[nt.ntty ?? "C"] ?? "Credit Note", place(nt.pos), nt.rchrg ?? "N", INV_TYPE[nt.inv_typ ?? "R"] ?? "Regular B2B", nt.val, none, it.itm_det.rt, it.itm_det.txval, it.itm_det.csamt ?? 0]);
  }
  sheet("cdnr", [col("GSTIN/UIN of Recipient", "text", 20), col("Receiver Name", "text", 24), col("Note Number"), col("Note Date", "date"), col("Note Type"), col("Place Of Supply", "text", 22), col("Reverse Charge"), col("Note Supply Type", "text", 26),
    col("Note Value", "money"), col("Applicable % of Tax Rate"), col("Rate", "money"), col("Taxable Value", "money"), col("Cess Amount", "money")], cdnr);

  const cdnur: XlsxCell[][] = [];
  for (const nt of j.cdnur ?? []) for (const it of nt.itms) cdnur.push([nt.typ ?? "B2CL", nt.nt_num ?? "", iso(nt.nt_dt), NOTE_TYPE[nt.ntty ?? "C"] ?? "Credit Note", place(nt.pos), nt.val, none, it.itm_det.rt, it.itm_det.txval, it.itm_det.csamt ?? 0]);
  sheet("cdnur", [col("UR Type"), col("Note Number"), col("Note Date", "date"), col("Note Type"), col("Place Of Supply", "text", 22), col("Note Value", "money"), col("Applicable % of Tax Rate"), col("Rate", "money"), col("Taxable Value", "money"), col("Cess Amount", "money")], cdnur);

  const exp: XlsxCell[][] = [];
  for (const g of j.exp ?? []) for (const inv of g.inv) for (const it of inv.itms) exp.push([g.exp_typ === "WPAY" ? "WPAY" : "WOPAY", inv.inum ?? "", iso(inv.idt), inv.val, none, none, none, none, it.itm_det.rt, it.itm_det.txval, it.itm_det.csamt ?? 0]);
  sheet("exp", [col("Export Type"), col("Invoice Number"), col("Invoice date", "date"), col("Invoice Value", "money"), col("Port Code"), col("Shipping Bill Number"), col("Shipping Bill Date"), col("Applicable % of Tax Rate"), col("Rate", "money"), col("Taxable Value", "money"), col("Cess Amount", "money")], exp);

  const hsn = (rows: HsnRow[] | undefined) => (rows ?? []).map((h): XlsxCell[] => [h.hsn_sc, none, h.uqc, h.qty, h.txval + h.iamt + h.camt + h.samt + h.csamt, h.rt, h.txval, h.iamt, h.camt, h.samt, h.csamt]);
  const hsnCols = [col("HSN"), col("Description", "text", 24), col("UQC"), col("Total Quantity", "money"), col("Total Value", "money"), col("Rate", "money"), col("Taxable Value", "money"), col("Integrated Tax Amount", "money"), col("Central Tax Amount", "money"), col("State/UT Tax Amount", "money"), col("Cess Amount", "money")];
  sheet("hsn(b2b)", hsnCols, hsn(j.hsn?.hsn_b2b));
  sheet("hsn(b2c)", hsnCols, hsn(j.hsn?.hsn_b2c));

  const NATURE: Record<number, string> = { 1: "Invoices for outward supply", 5: "Credit Note" };
  const docs: XlsxCell[][] = [];
  for (const d of j.doc_issue?.doc_det ?? []) for (const r of d.docs) docs.push([NATURE[d.doc_num] ?? `Document type ${d.doc_num}`, r.from, r.to, r.totnum, r.cancel]);
  sheet("docs", [col("Nature of Document", "text", 28), col("Sr. No. From"), col("Sr. No. To"), col("Total Number", "count"), col("Cancelled", "count")], docs);
  return sheets;
}
