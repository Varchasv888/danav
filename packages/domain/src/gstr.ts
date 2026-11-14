import { dec, money, type DecimalInput } from "./money.js";

/**
 * GST return rules for outward supplies (GSTR-1) and the e-invoice payload (NIC IRP schema 1.1).
 * Pure functions: the API feeds them invoice data and turns the result into the portal JSON.
 */

/** Unregistered inter-state invoices above this go to B2CL (lowered from ₹2.5 lakh to ₹1 lakh from 1 Aug 2024). */
export const B2CL_THRESHOLD = "100000";

export type Gstr1Section = "B2B" | "B2CL" | "B2CS" | "EXP";

export interface OutwardInvoice {
  customerGstin: string | null;
  supplyKind: "intra" | "inter" | "export" | "sez";
  invoiceValue: DecimalInput;
}

/** Which GSTR-1 table an invoice is reported in. SEZ supplies to a registered unit are B2B (type SEWP/SEWOP). */
export function gstr1Section(inv: OutwardInvoice): Gstr1Section {
  if (inv.supplyKind === "export") return "EXP";
  if (inv.customerGstin) return "B2B";
  if (inv.supplyKind === "inter" && dec(inv.invoiceValue).gt(B2CL_THRESHOLD)) return "B2CL";
  return "B2CS";
}

/** GSTR-1 invoice type for B2B rows: regular, SEZ with/without payment, deemed export. */
export function b2bInvoiceType(supplyKind: string, lut: boolean): "R" | "SEWP" | "SEWOP" {
  if (supplyKind !== "sez") return "R";
  return lut ? "SEWOP" : "SEWP";
}

/** Tax period "MMYYYY" (e.g. 092026) → first and last day. */
export function taxPeriod(fp: string): { from: string; to: string } {
  const m = /^(0[1-9]|1[0-2])(\d{4})$/.exec(fp);
  if (!m) throw new Error("tax period must be MMYYYY");
  const month = Number(m[1]);
  const year = Number(m[2]);
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const mm = String(month).padStart(2, "0");
  return { from: `${year}-${mm}-01`, to: `${year}-${mm}-${String(last).padStart(2, "0")}` };
}

/** The tax period a date falls in: "2026-09-29" → "092026". */
export function gstPeriodOf(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) throw new Error("date must be YYYY-MM-DD");
  return `${iso.slice(5, 7)}${iso.slice(0, 4)}`;
}

/** "2026-09-29" → "29/09/2026" (the date format GSTN and the IRP use). */
export const gstDate = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;

// ---- ITC set-off (GSTR-3B table 6.1) -------------------------------------------------------------

export interface TaxHeads { igst: DecimalInput; cgst: DecimalInput; sgst: DecimalInput; cess: DecimalInput }
type Head = "igst" | "cgst" | "sgst" | "cess";

/**
 * Uses input tax credit against output tax in the order the law requires (Section 49 + Rule 88A):
 * IGST credit first (IGST, then CGST, then SGST); then CGST credit (CGST, then IGST);
 * then SGST credit (SGST, then IGST). CGST never pays SGST or the reverse. Cess pays only cess.
 * Returns what each credit paid, the cash still payable, and the credit carried forward.
 */
export function gstSetOff(liability: TaxHeads, credit: TaxHeads) {
  const due = { igst: dec(liability.igst), cgst: dec(liability.cgst), sgst: dec(liability.sgst), cess: dec(liability.cess) };
  const left = { igst: dec(credit.igst), cgst: dec(credit.cgst), sgst: dec(credit.sgst), cess: dec(credit.cess) };
  const used: Record<Head, Record<Head, string>> = {
    igst: { igst: "0.00", cgst: "0.00", sgst: "0.00", cess: "0.00" },
    cgst: { igst: "0.00", cgst: "0.00", sgst: "0.00", cess: "0.00" },
    sgst: { igst: "0.00", cgst: "0.00", sgst: "0.00", cess: "0.00" },
    cess: { igst: "0.00", cgst: "0.00", sgst: "0.00", cess: "0.00" },
  };
  const apply = (from: Head, to: Head) => {
    const amt = left[from].lt(due[to]) ? left[from] : due[to];
    if (amt.lte(0)) return;
    left[from] = left[from].minus(amt);
    due[to] = due[to].minus(amt);
    used[from][to] = money(dec(used[from][to]).plus(amt));
  };
  apply("igst", "igst"); apply("igst", "cgst"); apply("igst", "sgst");
  apply("cgst", "cgst"); apply("cgst", "igst");
  apply("sgst", "sgst"); apply("sgst", "igst");
  apply("cess", "cess");
  const m = (h: typeof due) => ({ igst: money(h.igst), cgst: money(h.cgst), sgst: money(h.sgst), cess: money(h.cess) });
  return { paidByCredit: used, cashPayable: m(due), creditCarriedForward: m(left) };
}

// ---- e-invoice (IRP schema 1.1) --------------------------------------------------------------------

export interface EinvoiceParty {
  gstin: string; legalName: string; address1: string; location: string; pincode: string; stateCode: string;
}
export interface EinvoiceLine {
  isService: boolean; hsn: string; qty: DecimalInput; unit: string; unitPrice: DecimalInput; discount: DecimalInput;
  taxable: DecimalInput; gstRate: DecimalInput; igst: DecimalInput; cgst: DecimalInput; sgst: DecimalInput; utgst: DecimalInput;
  cessRate: DecimalInput; cess: DecimalInput; total: DecimalInput;
}
export interface EinvoiceDoc {
  docType: "INV" | "CRN" | "DBN";
  number: string;
  date: string; // ISO
  supplyKind: "intra" | "inter" | "export" | "sez";
  lut: boolean;
  reverseCharge: boolean;
  placeOfSupply: string;
  seller: EinvoiceParty;
  buyer: EinvoiceParty;
  lines: EinvoiceLine[];
  totals: { taxable: DecimalInput; cgst: DecimalInput; sgst: DecimalInput; utgst: DecimalInput; igst: DecimalInput; cess: DecimalInput; roundOff: DecimalInput; total: DecimalInput };
}

const n2 = (v: DecimalInput) => Number(money(v));
const n3 = (v: DecimalInput) => Number(dec(v).toDecimalPlaces(3).toFixed(3));

/** Supply type code for the IRP. */
export function einvoiceSupplyType(kind: EinvoiceDoc["supplyKind"], lut: boolean): "B2B" | "SEZWP" | "SEZWOP" | "EXPWP" | "EXPWOP" {
  if (kind === "sez") return lut ? "SEZWOP" : "SEZWP";
  if (kind === "export") return lut ? "EXPWOP" : "EXPWP";
  return "B2B";
}

/** The JSON the IRP expects. UTGST is reported in the SGST fields, as the schema requires. */
export function einvoicePayload(d: EinvoiceDoc) {
  const party = (p: EinvoiceParty) => ({ Gstin: p.gstin, LglNm: p.legalName, Addr1: p.address1, Loc: p.location, Pin: Number(p.pincode), Stcd: p.stateCode });
  return {
    Version: "1.1",
    TranDtls: { TaxSch: "GST", SupTyp: einvoiceSupplyType(d.supplyKind, d.lut), RegRev: d.reverseCharge ? "Y" : "N" },
    DocDtls: { Typ: d.docType, No: d.number, Dt: gstDate(d.date) },
    SellerDtls: party(d.seller),
    BuyerDtls: { ...party(d.buyer), Pos: d.placeOfSupply },
    ItemList: d.lines.map((l, i) => ({
      SlNo: String(i + 1),
      IsServc: l.isService ? "Y" : "N",
      HsnCd: l.hsn,
      Qty: n3(l.qty),
      Unit: l.unit,
      UnitPrice: n3(l.unitPrice),
      TotAmt: n2(dec(l.qty).times(l.unitPrice)),
      Discount: n2(l.discount),
      AssAmt: n2(l.taxable),
      GstRt: Number(l.gstRate),
      IgstAmt: n2(l.igst),
      CgstAmt: n2(l.cgst),
      SgstAmt: n2(dec(l.sgst).plus(l.utgst)),
      CesRt: Number(l.cessRate),
      CesAmt: n2(l.cess),
      TotItemVal: n2(l.total),
    })),
    ValDtls: {
      AssVal: n2(d.totals.taxable),
      CgstVal: n2(d.totals.cgst),
      SgstVal: n2(dec(d.totals.sgst).plus(d.totals.utgst)),
      IgstVal: n2(d.totals.igst),
      CesVal: n2(d.totals.cess),
      RndOffAmt: n2(d.totals.roundOff),
      TotInvVal: n2(d.totals.total),
    },
  };
}

/** Problems the IRP would reject, checked before sending. Returns error codes (empty = fine). */
export function checkEinvoice(d: EinvoiceDoc): string[] {
  const errors: string[] = [];
  if (!d.buyer.gstin && d.supplyKind !== "export") errors.push("buyer_gstin_required");
  if (d.number.length > 16 || !/^[A-Za-z0-9/-]+$/.test(d.number) || /^[0/-]/.test(d.number)) errors.push("invalid_doc_number");
  for (const p of [d.seller, d.buyer]) if (!/^[1-9]\d{5}$/.test(p.pincode)) errors.push("invalid_pincode");
  if (!d.seller.address1 || !d.buyer.address1) errors.push("address_required");
  d.lines.forEach((l) => { if (!/^\d{4}(\d{2}(\d{2})?)?$/.test(l.hsn)) errors.push("invalid_hsn"); });
  // The IRP checks the item totals add up to the invoice (allowing ₹1 of rounding).
  const itemTotal = d.lines.reduce((s, l) => s.plus(l.total), dec(0));
  if (itemTotal.plus(d.totals.roundOff).minus(d.totals.total).abs().gt(1)) errors.push("totals_mismatch");
  return [...new Set(errors)];
}
