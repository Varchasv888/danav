import type { Receipt } from "@/components/pos/ReceiptView";
import type { PrintData } from "@/components/print/TaxDocument";

/** A made-up tax invoice for the preview on the Print tab of Settings: the same document the business prints, drawn with the choices made there. */
export function sampleInvoice(): PrintData {
  const line = (n: number, name: string, hsn: string, qty: string, rate: string, disc: string, gst: number, mrp: string, size: string, colour: string, extra: { batchNo?: string; expiry?: string; model?: string } = {}) => {
    const gross = Number(qty) * Number(rate);
    const taxable = gross - Number(disc);
    const tax = (taxable * gst) / 100;
    return {
      id: `s${n}`, itemName: name, itemNameHi: null, hsn, uom: "PCS", qty, rate, discount: disc, headerDiscount: "0", gstRate: String(gst), taxable: taxable.toFixed(2),
      cgst: (tax / 2).toFixed(2), sgst: (tax / 2).toFixed(2), utgst: "0.00", igst: "0.00", cess: "0.00", total: (taxable + tax).toFixed(2), mrp, size, colour, ...extra,
    };
  };
  const lines = [
    line(1, "Cotton shirt", "6105", "10", "500.00", "0", 5, "799.00", "M", "Blue", { batchNo: "B-204", expiry: "2028-03-31", model: "CS-10" }),
    line(2, "Denim jeans", "6203", "4", "800.00", "100.00", 12, "1299.00", "32", "Indigo", { batchNo: "B-311", model: "DJ-32" }),
  ];
  const sum = (k: "taxable" | "cgst" | "sgst" | "total") => lines.reduce((s, l) => s + Number(l[k]), 0).toFixed(2);
  return {
    invoice: {
      number: "INV-26-27-00001", date: "2026-11-11", dueOn: "2026-11-26", customerName: "Sharma Stores", customerGstin: "18AAAAA0000A1Z5", placeOfSupply: "18", supplyKind: "intra", lut: false,
      billingAddress: { line1: "12 Market Road", city: "Guwahati", pincode: "781001", stateCode: "18" }, shippingAddress: { line1: "Warehouse 4, Industrial Estate", city: "Guwahati", pincode: "781005" },
      taxable: sum("taxable"), cgst: sum("cgst"), sgst: sum("sgst"), utgst: "0.00", igst: "0.00", cess: "0.00", roundOff: "0.00", total: sum("total"), status: "posted", lines,
      narration: "Sample sale of garments", received: "2000.00", balance: (Number(sum("total")) - 2000).toFixed(2), partyBalance: "18500.00",
    },
    company: { name: "Your company", legalName: "Your company", pan: "AAAAA0000A" },
    branch: { gstin: "18AAAAA0000A1Z5", stateCode: "18", address: { line1: "12 Market Road", city: "Guwahati", pincode: "781001" } },
    settings: { bilingualPrint: false, invoiceTerms: "Goods once sold will not be taken back.", bankDetails: "Bank: Sample Bank, A/c 1234567890, IFSC SAMP0000001" },
  };
}

/** A made-up counter bill for the preview of the counter receipt. */
export function sampleReceipt(): Receipt {
  return {
    id: "sample", number: "B-0001", date: "2026-11-11", createdAt: "2026-11-11T10:30:00+05:30", status: "paid", customerPhone: "9876543210", customerName: "A. Sharma",
    taxable: "5000.00", cgst: "125.00", sgst: "125.00", cess: "0.00", discount: "250.00", roundOff: "0.00", total: "5250.00", change: "0.00",
    payments: [{ mode: "cash", amount: "5250.00" }], taxByRate: [{ rate: "5", taxable: "5000.00", cgst: "125.00", sgst: "125.00", cess: "0.00" }],
    loyaltyEarned: 0, loyaltyRedeemed: 0, loyaltyBalance: null,
    lines: [
      { id: "1", name: "Cotton shirt", hsn: "6105", qty: "2", price: "1250.00", total: "2625.00", discount: "0", taxable: "2500.00", gstRate: "5", uom: "PCS", mrp: "1499.00", size: "M", colour: "Blue", batchNo: "B-204", model: "CS-10" },
      { id: "2", name: "Denim jeans", hsn: "6203", qty: "1", price: "2750.00", total: "2625.00", discount: "250.00", taxable: "2500.00", gstRate: "5", uom: "PCS", mrp: "3199.00", size: "32", colour: "Indigo", batchNo: "B-311", model: "DJ-32" },
    ],
    terminal: { code: "T1", name: "Counter 1" }, footer: "Exchange within 7 days with this bill.",
    company: { name: "Your company" }, branch: { gstin: "18AAAAA0000A1Z5", address: { line1: "12 Market Road", city: "Guwahati", pincode: "781001" }, stateCode: "18" },
  };
}
