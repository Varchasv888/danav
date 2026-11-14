import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";
import { read2bWorkbook } from "../lib/gstr2b-xlsx";

// A workbook laid out the way the portal's GSTR-2B Excel is: a few title rows above the header, one row per rate of an invoice, and "B2B" and "B2B-CDNR" sheets.
async function portalWorkbook() {
  const wb = new ExcelJS.Workbook();
  wb.addWorksheet("Read me").addRow(["Read me"]);
  const b2b = wb.addWorksheet("B2B");
  b2b.addRow(["Goods and Services Tax - GSTR-2B"]);
  b2b.addRow(["Taxable inward supplies received from registered persons"]);
  b2b.addRow([]);
  b2b.addRow(["GSTIN of supplier", "Trade/Legal name", "Invoice details", "", "", "", "", "", "Rate(%)", "Taxable Value (₹)", "Tax Amount", "", "", "", "GSTR-1/IFF/GSTR-5 Period", "GSTR-1/IFF/GSTR-5 Filing Date", "ITC Availability", "Reason", "Applicable % of Tax Rate"]);
  b2b.addRow(["GSTIN of supplier", "Trade/Legal name", "Invoice number", "Invoice type", "Invoice Date", "Invoice Value(₹)", "Place of supply", "Supply Attract Reverse Charge", "Rate(%)", "Taxable Value (₹)", "Integrated Tax(₹)", "Central Tax(₹)", "State/UT Tax(₹)", "Cess(₹)", "GSTR-1/IFF/GSTR-5 Period", "GSTR-1/IFF/GSTR-5 Filing Date", "ITC Availability", "Reason", "Applicable % of Tax Rate"]);
  const inv = (no: string, date: string, val: number, rate: number, tx: number, igst: number, itc: string, rsn = "") =>
    b2b.addRow(["29AAGCB7383J1Z4", "Bengaluru Mills", no, "Regular", date, val, "27-Maharashtra", "No", rate, tx, igst, 0, 0, 0, "Nov-26", "09/12/2026", itc, rsn, ""]);
  inv("BM/1", "05/11/2026", 19460, 5, 10000, 500, "Yes");
  inv("BM/1", "05/11/2026", 19460, 12, 8000, 960, "Yes");
  inv("BM/2", "07/11/2026", 1050, 5, 1000, 50, "No", "POS");
  const cdn = wb.addWorksheet("B2B-CDNR");
  cdn.addRow(["Goods and Services Tax - GSTR-2B"]);
  cdn.addRow(["GSTIN of supplier", "Trade/Legal name", "Note number", "Note type", "Note Supply type", "Note Date", "Note Value (₹)", "Place of supply", "Supply Attract Reverse Charge", "Rate(%)", "Taxable Value (₹)", "Integrated Tax(₹)", "Central Tax(₹)", "State/UT Tax(₹)", "Cess(₹)", "ITC Availability", "Reason"]);
  cdn.addRow(["29AAGCB7383J1Z4", "Bengaluru Mills", "CN/1", "Credit Note", "Regular", "20/11/2026", 2100, "27-Maharashtra", "No", 5, 2000, 100, 0, 0, 0, "Yes", ""]);
  cdn.addRow(["29AAGCB7383J1Z4", "Bengaluru Mills", "DN/1", "Debit Note", "Regular", "21/11/2026", 420, "27-Maharashtra", "No", 5, 400, 20, 0, 0, 0, "Yes", ""]);
  return new File([await wb.xlsx.writeBuffer()], "GSTR2B_27AAPFU0939F1ZV_112026.xlsx");
}

describe("reading the portal's GSTR-2B Excel", () => {
  it("finds the header below the title rows, adds the rate rows of an invoice up, and takes the period and GSTIN from the file name", async () => {
    const r = await read2bWorkbook(await portalWorkbook());
    expect(r).toMatchObject({ invoices: 2, notes: 2, debitNotes: 1, period: "112026", gstin: "27AAPFU0939F1ZV", notAvailable: 1 });
    const inv = (r.json.data.docdata.b2b[0] as { inv: Record<string, unknown>[] }).inv;
    expect(inv.find((x) => x.inum === "BM/1")).toMatchObject({ txval: 18000, igst: 1460, itcavl: "Y", dt: "05-11-2026" });
    expect(inv.find((x) => x.inum === "BM/2")).toMatchObject({ itcavl: "N", rsn: "POS" });
  });

  it("keeps a debit note as a debit note so it adds credit rather than taking it away", async () => {
    const r = await read2bWorkbook(await portalWorkbook());
    const nt = (r.json.data.docdata.cdnr[0] as { nt: Record<string, unknown>[] }).nt;
    expect(nt.find((x) => x.ntnum === "DN/1")).toMatchObject({ typ: "D" });
    expect(nt.find((x) => x.ntnum === "CN/1")?.typ).toBeUndefined();
  });

  it("says so when the sheets are not the portal's", async () => {
    const wb = new ExcelJS.Workbook();
    wb.addWorksheet("Sheet1").addRow(["nothing here"]);
    await expect(read2bWorkbook(new File([await wb.xlsx.writeBuffer()], "x.xlsx"))).rejects.toThrow("layout");
  });
});
