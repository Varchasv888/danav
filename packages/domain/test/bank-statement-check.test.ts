import { describe, expect, it } from "vitest";
import { checkStatement, parseStatement } from "../src/index.js";

// Header layouts as the big banks export them. They are written from the banks' published formats, not copied from real accounts.
const hdfc = `Date,Narration,Chq./Ref.No.,Value Dt,Withdrawal Amt.,Deposit Amt.,Closing Balance
01/04/26,UPI-CUSTOMER A-9876@okhdfc,0000412345678,01/04/26,,"5,000.00","105,000.00"
02/04/26,NEFT DR-SUPPLIER B,N0912345,02/04/26,"20,000.00",,"85,000.00"
03/04/26,CHQ PAID 000123,000123,03/04/26,"1,500.50",,"83,499.50"
`;
const sbi = `Txn Date,Value Date,Description,Ref No./Cheque No.,Debit,Credit,Balance
01 Apr 2026,01 Apr 2026,BY TRANSFER-UPI/CR/412345678/CUSTOMER A,TRANSFER,,5000.00,105000.00
02 Apr 2026,02 Apr 2026,TO TRANSFER-NEFT SUPPLIER B,TRANSFER,20000.00,,85000.00
`;
const icici = `S No.,Value Date,Transaction Date,Cheque Number,Transaction Remarks,Withdrawal Amount (INR),Deposit Amount (INR),Balance (INR)
1,01/04/2026,01/04/2026,,UPI/412345678/CUSTOMER A,0.00,5000.00,105000.00
2,02/04/2026,02/04/2026,,NEFT-SUPPLIER B,20000.00,0.00,85000.00
`;
const axis = `SRL NO,Tran Date,CHQNO,PARTICULARS,DR,CR,BAL,SOL
1,01-04-2026,,UPI/P2A/412345678/CUSTOMER A,,5000.00,105000.00,123
2,02-04-2026,,NEFT/SUPPLIER B,20000.00,,85000.00,123
`;

const kotak = `Sl. No.,Transaction Date,Value Date,Description,Chq / Ref No.,Withdrawal (Dr),Deposit (Cr),Balance
1,01-04-2026,01-04-2026,UPI/CUSTOMER A/412345678,,,5000.00,105000.00
2,02-04-2026,02-04-2026,NEFT SUPPLIER B,N0912345,20000.00,,85000.00
`;
const yes = `Transaction Date,Value Date,Description,Reference No,Debit,Credit,Running Balance
01-04-2026,01-04-2026,UPI CUSTOMER A,412345678,0.00,5000.00,105000.00
02-04-2026,02-04-2026,NEFT SUPPLIER B,N0912345,20000.00,0.00,85000.00
`;

describe("reading the main banks' CSV layouts", () => {
  for (const [name, text, n] of [["HDFC", hdfc, 3], ["SBI", sbi, 2], ["ICICI", icici, 2], ["Axis", axis, 2], ["Kotak", kotak, 2], ["Yes Bank", yes, 2]] as const) {
    it(`${name}: finds the columns and a statement that agrees with itself`, () => {
      const p = parseStatement(text);
      expect(p.lines).toHaveLength(n);
      expect(p.lines[0]).toMatchObject({ date: "2026-04-01", credit: "5000.00", debit: "0.00", balance: "105000.00" });
      const c = checkStatement(p.lines);
      expect(c).toMatchObject({ checkable: true, opening: "100000.00", order: "oldest_first" });
      expect(c.breaks).toEqual([]);
    });
  }
});

describe("checking a statement against itself", () => {
  it("works the same on a statement listed newest first", () => {
    const lines = parseStatement(hdfc).lines.reverse();
    const c = checkStatement(lines);
    expect(c).toMatchObject({ order: "newest_first", opening: "100000.00", closing: "83499.50", totalDebit: "21500.50", totalCredit: "5000.00" });
    expect(c.breaks).toEqual([]);
  });

  it("reports a line that is missing, once, where the balance stops adding up", () => {
    const lines = parseStatement(hdfc).lines;
    const missing = [lines[0]!, lines[2]!]; // the 20,000 debit was dropped
    const c = checkStatement(missing);
    expect(c.breaks).toHaveLength(1);
    expect(c.breaks[0]).toMatchObject({ date: "2026-04-03", expected: "103499.50", found: "83499.50", difference: "-20000.00" });
  });

  it("says it cannot check a statement that has no balance column", () => {
    const noBal = parseStatement("Date,Narration,Debit,Credit\n01/04/2026,A,,100\n02/04/2026,B,50,\n");
    expect(checkStatement(noBal.lines)).toMatchObject({ checkable: false, opening: null, breaks: [] });
  });
});
