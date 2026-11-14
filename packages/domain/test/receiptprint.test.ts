import { describe, expect, it } from "vitest";
import { escposBytes, invoiceAsReceipt, receiptLines, resolvePreferences, type ReceiptData } from "../src/index.js";

const bill: ReceiptData = {
  number: "B-0001", createdAt: "2026-11-11T10:30:00+05:30", status: "paid", customerName: "A. Sharma", customerPhone: "9876543210", discount: "250.00", roundOff: "0", total: "5250.00", change: "0",
  taxable: "5000.00", cgst: "125.00", sgst: "125.00", cess: "0", payments: [{ mode: "Cash", amount: "5250.00" }], taxByRate: [{ rate: "5", taxable: "5000.00", cgst: "125.00", sgst: "125.00", cess: "0" }],
  lines: [
    { name: "Cotton shirt ₹ special", hsn: "6105", qty: "2", price: "1250.00", total: "2625.00", discount: "0", taxable: "2500.00", gstRate: "5", uom: "PCS", size: "M", batchNo: "B-204", model: "CS-10" },
    { name: "Denim jeans", hsn: "6203", qty: "1", price: "2750.00", total: "2625.00", discount: "250.00", taxable: "2500.00", gstRate: "5", uom: "PCS", serials: ["SN1", "SN2"] },
  ],
  terminal: null, footer: "Exchange within 7 days", company: { name: "Your company" }, branch: { gstin: "18AAAAA0000A1Z5", address: { line1: "12 Market Road", city: "Guwahati" }, stateCode: "18" },
};

describe("receipt text", () => {
  const pf = (over: Record<string, boolean | string> = {}) => resolvePreferences(over);
  it("never runs past the roll and prints plain letters only", () => {
    for (const theme of ["theme1", "theme2", "theme3", "theme4", "theme5"]) {
      const lines = receiptLines(bill, pf({ "thermal.theme": theme }), 32);
      expect(lines.every((l) => l.text.length <= 32), theme).toBe(true);
      expect(lines.every((l) => /^[\x20-\x7e]*$/.test(l.text)), theme).toBe(true);
    }
    expect(receiptLines(bill, pf(), 48).some((l) => l.text.includes("Rs."))).toBe(true);
  });
  it("follows the options: batch, model, serials, the total and what is left out", () => {
    const text = (o: Record<string, boolean | string>) => receiptLines(bill, pf(o), 48).map((l) => l.text).join("\n");
    expect(text({})).toContain("Batch B-204");
    expect(text({})).toContain("Model CS-10");
    expect(text({})).toContain("Sr SN1,SN2");
    expect(text({ "thermal.showBatch": false })).not.toContain("Batch B-204");
    expect(text({ "thermal.showGstin": false })).not.toContain("GSTIN");
    expect(text({})).toContain("5,250.00");
    expect(text({ "thermal.amountDecimal": false, "thermal.amountGrouping": false })).toContain("Rs. 5250");
    expect(text({ "thermal.theme": "theme4" })).toContain("====");
  });
});

describe("ESC/POS bytes", () => {
  const lines = receiptLines(bill, resolvePreferences({}), 48);
  it("starts with the reset command and has no cut or drawer unless asked", () => {
    const b = escposBytes(lines);
    expect([...b.slice(0, 2)]).toEqual([0x1b, 0x40]);
    expect(Buffer.from(b).includes(Buffer.from([0x1d, 0x56]))).toBe(false);
    expect(Buffer.from(b).includes(Buffer.from([0x1b, 0x70]))).toBe(false);
  });
  it("adds the cutter, the cash drawer pulse, copies and blank lines when asked", () => {
    const b = Buffer.from(escposBytes(lines, { cut: true, drawer: true, copies: 2, extraLines: 3 }));
    expect(b.indexOf(Buffer.from([0x1b, 0x70, 0x00]))).toBe(0);
    const cuts = b.toString("latin1").split("\x1d\x56\x41\x03").length - 1;
    expect(cuts).toBe(2);
    expect(b.toString("latin1").split("\x1b\x40").length - 1).toBe(2);
  });
  it("prints a QR code with the data it was given", () => {
    const b = Buffer.from(escposBytes([{ text: "", qr: "upi://pay?pa=shop@bank&am=10.00", align: "center" }]));
    expect(b.includes(Buffer.from([0x1d, 0x28, 0x6b]))).toBe(true);
    expect(b.toString("latin1")).toContain("upi://pay?pa=shop@bank&am=10.00");
  });
});

describe("a tax invoice on the roll", () => {
  it("shows the date only, what was received and what is due, and groups tax by rate", () => {
    const line = { itemName: "Shirt", hsn: "6105", uom: "PCS", qty: "2", rate: "500.00", discount: "0", gstRate: "5", taxable: "1000.00", cgst: "25.00", sgst: "25.00", utgst: "0", igst: "0", cess: "0", total: "1050.00" };
    const r = invoiceAsReceipt({ number: "INV-1", date: "2026-11-11", customerName: "Sharma Stores", status: "posted", taxable: "1000.00", cgst: "25.00", sgst: "25.00", utgst: "0", igst: "0", cess: "0", total: "1050.00", received: "300.00", balance: "750.00", lines: [line, { ...line, itemName: "Shirt 2" }] },
      { name: "Shop" }, { gstin: "18AAAAA0000A1Z5", address: null, stateCode: "18" }, "Sale", "upi://pay?pa=a@b");
    expect(r.taxByRate).toHaveLength(1);
    expect(r.taxByRate[0]!.taxable).toBe("2000.00");
    expect(r.dateOnly).toBe(true);
    const text = receiptLines(r, resolvePreferences({}), 48).map((l) => l.text).join("\n");
    expect(text).toContain("Received");
    expect(text).toContain("750.00");
    expect(text).toContain("Sale");
  });
});
