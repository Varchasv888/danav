import type { Tx } from "@varchasv/db";
import { escposBytes, invoiceAsReceipt, receiptLines, resolvePreferences, rollWidth, type ReceiptData } from "@varchasv/domain";
import { getBill } from "./pos.js";
import { getPreferences } from "./preferences.js";
import { invoicePrintData } from "./sharing.js";

/**
 * A receipt as ESC/POS bytes for the print agent (or a Flutter app) to send to the roll printer, laid out by the chosen theme and options on the Thermal printer tab,
 * with the cutter and the cash drawer if those are on. The bytes come back base64 coded, with the number of copies and the printer address chosen in Settings.
 */
function pack(r: ReceiptData, pf: Record<string, boolean | string>) {
  const { chars } = rollWidth(String(pf["thermal.size"]), pf["thermal.chars"] as string);
  const bytes = escposBytes(receiptLines(r, pf, chars), {
    cut: pf["thermal.autoCut"] === true, drawer: pf["thermal.cashDrawer"] === true, copies: Number(pf["thermal.copies"]), extraLines: Number(pf["thermal.extraLines"]), boldAll: pf["thermal.bold"] === true && false,
  });
  return { base64: Buffer.from(bytes).toString("base64"), bytes: bytes.length, agentUrl: String(pf["thermal.agentUrl"]), target: String(pf["thermal.printerTarget"]), chars };
}

export async function billBytes(tx: Tx, id: string) {
  const pf = await getPreferences(tx);
  const bill = await getBill(tx, id);
  const title = String(pf["names.receipt"] ?? "").trim();
  return pack({ ...(bill as unknown as ReceiptData), ...(title ? { title } : {}) }, pf);
}

/** A tax invoice for the roll printer: the same layouts as the counter receipt, with what was received, what is due, and a UPI pay-now QR code when there is a balance. */
export async function invoiceBytes(tx: Tx, id: string) {
  const pf = await getPreferences(tx);
  const d = await invoicePrintData(tx, id);
  const title = String(pf["names.invoice"] ?? "").trim() || "Tax invoice";
  const balance = Number(d.invoice.balance ?? 0);
  const upi = String(pf["print.upiId"] ?? "").trim();
  const upiUrl = upi && pf["print.showUpiQr"] === true && balance > 0 ? `upi://pay?pa=${encodeURIComponent(upi)}&pn=${encodeURIComponent(d.company.name)}&am=${balance.toFixed(2)}&cu=INR&tn=${encodeURIComponent(d.invoice.number)}` : null;
  const br = d.branch!;
  const addr = br.address as { line1?: string; line2?: string; city?: string; pincode?: string } | null;
  return pack(invoiceAsReceipt(d.invoice as never, { name: d.company.legalName ?? d.company.name }, { gstin: br.gstin, address: addr, stateCode: br.stateCode }, title, upiUrl), pf);
}

/** A made-up bill printed from the Settings screen to check the printer, the cutter and the drawer. */
export async function testBytes(tx: Tx) {
  const pf = await getPreferences(tx);
  const sample: ReceiptData = {
    number: "TEST-0001", createdAt: new Date().toISOString(), status: "paid", customerName: null, customerPhone: null, discount: "0", roundOff: "0", total: "1050.00", change: "0",
    taxable: "1000.00", cgst: "25.00", sgst: "25.00", cess: "0", payments: [{ mode: "Cash", amount: "1050.00" }], taxByRate: [{ rate: "5", taxable: "1000.00", cgst: "25.00", sgst: "25.00", cess: "0" }],
    lines: [{ name: "Test item", hsn: "6105", qty: "1", price: "1000.00", total: "1050.00", gstRate: "5", uom: "PCS", discount: "0", taxable: "1000.00" }],
    terminal: null, footer: "Printer test", company: { name: "Printer test" }, branch: { gstin: null, address: null, stateCode: "18" },
  };
  return pack(sample, resolvePreferences(pf));
}
