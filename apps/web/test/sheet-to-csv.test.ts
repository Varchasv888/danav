import ExcelJS from "exceljs";
import { parseStatement } from "@varchasv/domain";
import { describe, expect, it } from "vitest";
import { sheetToCsv } from "../lib/sheet-to-csv";

describe("an Excel bank statement", () => {
  it("reads through the same statement reader as a CSV, with real dates and numbers", async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Statement");
    ws.addRow(["Account Statement"]);
    ws.addRow(["Date", "Narration", "Chq./Ref.No.", "Value Dt", "Withdrawal Amt.", "Deposit Amt.", "Closing Balance"]);
    ws.addRow([new Date(Date.UTC(2026, 3, 1)), "UPI-CUSTOMER A, PUNE", "412345678", new Date(Date.UTC(2026, 3, 1)), null, 5000, 105000]);
    ws.addRow([new Date(Date.UTC(2026, 3, 2)), "NEFT DR-SUPPLIER B", "N0912345", new Date(Date.UTC(2026, 3, 2)), 20000, null, 85000]);
    const csv = await sheetToCsv(new File([await wb.xlsx.writeBuffer()], "stmt.xlsx"));
    const p = parseStatement(csv);
    expect(p.lines).toHaveLength(2);
    expect(p.lines[0]).toMatchObject({ date: "2026-04-01", description: "UPI-CUSTOMER A, PUNE", credit: "5000.00", balance: "105000.00" });
    expect(p.lines[1]).toMatchObject({ debit: "20000.00", balance: "85000.00" });
  });
});
