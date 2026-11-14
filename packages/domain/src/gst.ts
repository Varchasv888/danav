import { dec, money, round2, sum, roundOffToRupee, type DecimalInput } from "./money.js";
import { findState } from "./states.js";

/**
 * GST rates currently in use (GST 2.0 slabs from 22 Sept 2025 are 0/5/18/40, with special
 * rates for precious metals and stones). 12 and 28 stay valid for documents dated before
 * the change and for amendments to them.
 */
export const GST_RATES = ["0", "0.1", "0.25", "1.5", "3", "5", "12", "18", "28", "40"] as const;

export type SupplyKind =
  | "intra" // CGST + SGST/UTGST
  | "inter" // IGST
  | "export" // IGST (with payment) or zero-rated under LUT
  | "sez"; // always treated as inter-state

export interface TaxContext {
  /** State code of the supplier's registration (from the branch GSTIN). */
  supplierState: string;
  /** Place of supply state code ("96" for exports). */
  placeOfSupply: string;
  /** Recipient is an SEZ unit/developer. */
  sez?: boolean;
  /** Export or SEZ supply under LUT/bond: zero-rated, no tax charged. */
  lut?: boolean;
  /** Reverse charge: tax is shown for reporting but payable by the recipient. */
  reverseCharge?: boolean;
  /** Round the grand total to the nearest rupee. Default true. */
  roundOff?: boolean;
}

export interface LineInput {
  qty: DecimalInput;
  rate: DecimalInput; // unit price excluding tax
  discount?: DecimalInput; // flat discount on the line
  gstRate: DecimalInput; // percent, e.g. "18"
  cessRate?: DecimalInput; // percent ad valorem
}

export interface LineTax {
  taxableValue: string;
  cgst: string;
  sgst: string;
  utgst: string;
  igst: string;
  cess: string;
  total: string;
}

export interface InvoiceTax {
  supplyKind: SupplyKind;
  lines: LineTax[];
  taxableValue: string;
  cgst: string;
  sgst: string;
  utgst: string;
  igst: string;
  cess: string;
  /** Tax charged to the customer (zero under reverse charge or LUT). */
  taxCharged: string;
  roundOff: string;
  grandTotal: string;
}

export function supplyKind(ctx: TaxContext): SupplyKind {
  if (ctx.placeOfSupply === "96") return "export";
  if (ctx.sez) return "sez";
  return ctx.supplierState === ctx.placeOfSupply ? "intra" : "inter";
}

export function computeLineTax(line: LineInput, ctx: TaxContext): LineTax {
  const gross = dec(line.qty).times(line.rate);
  const taxable = round2(gross.minus(line.discount ?? 0));
  if (taxable.isNegative()) throw new Error("line discount exceeds line value");
  const rate = dec(line.gstRate);
  const kind = supplyKind(ctx);
  const zeroRated = (kind === "export" || kind === "sez") && ctx.lut;

  let cgst = dec(0), sgst = dec(0), utgst = dec(0), igst = dec(0);
  const cess = zeroRated ? dec(0) : round2(taxable.times(line.cessRate ?? 0).div(100));

  if (!zeroRated) {
    if (kind === "intra") {
      // Each half is computed on its own so CGST always equals SGST/UTGST.
      const half = round2(taxable.times(rate).div(200));
      cgst = half;
      if (findState(ctx.supplierState)?.ut) utgst = half;
      else sgst = half;
    } else {
      igst = round2(taxable.times(rate).div(100));
    }
  }
  const total = taxable.plus(cgst).plus(sgst).plus(utgst).plus(igst).plus(cess);
  return {
    taxableValue: money(taxable),
    cgst: money(cgst),
    sgst: money(sgst),
    utgst: money(utgst),
    igst: money(igst),
    cess: money(cess),
    total: money(total),
  };
}

export function computeInvoiceTax(lines: LineInput[], ctx: TaxContext): InvoiceTax {
  const kind = supplyKind(ctx);
  const lineTaxes = lines.map((l) => computeLineTax(l, ctx));
  const pick = (k: keyof LineTax) => sum(lineTaxes.map((l) => l[k]));
  const taxable = pick("taxableValue");
  const tax = pick("cgst").plus(pick("sgst")).plus(pick("utgst")).plus(pick("igst")).plus(pick("cess"));
  const taxCharged = ctx.reverseCharge ? dec(0) : tax;
  const beforeRound = taxable.plus(taxCharged);
  const { rounded, roundOff } = ctx.roundOff === false
    ? { rounded: money(beforeRound), roundOff: "0.00" }
    : roundOffToRupee(beforeRound);
  return {
    supplyKind: kind,
    lines: lineTaxes,
    taxableValue: money(taxable),
    cgst: money(pick("cgst")),
    sgst: money(pick("sgst")),
    utgst: money(pick("utgst")),
    igst: money(pick("igst")),
    cess: money(pick("cess")),
    taxCharged: money(taxCharged),
    roundOff,
    grandTotal: rounded,
  };
}
