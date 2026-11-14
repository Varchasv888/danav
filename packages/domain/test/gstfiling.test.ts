import { describe, expect, it } from "vitest";
import { isReturnTimeBarred, itcFrom2b, returnDueDate, returnTimeBarDate, type StatementRow, type ItcHeads } from "../src/index.js";

describe("return due dates and the three-year bar", () => {
  it("GSTR-1 is due on the 11th and GSTR-3B on the 20th of the next month, across the year end", () => {
    expect(returnDueDate("GSTR1", "092026")).toBe("2026-10-11");
    expect(returnDueDate("GSTR3B", "092026")).toBe("2026-10-20");
    expect(returnDueDate("GSTR1", "122025")).toBe("2026-01-11");
    expect(returnDueDate("GSTR3B", "122025")).toBe("2026-01-20");
  });

  it("the annual return and its reconciliation are due on 31 December after the year", () => {
    expect(returnDueDate("GSTR9", "FY2024-25")).toBe("2025-12-31");
    expect(returnDueDate("GSTR9C", "FY2025-26")).toBe("2026-12-31");
    expect(() => returnDueDate("GSTR9", "2025")).toThrow();
  });

  it("a return can be filed up to three years after its due date and not a day later", () => {
    expect(returnTimeBarDate("GSTR3B", "042024")).toBe("2027-05-20"); // the worked example in the research notes
    expect(isReturnTimeBarred("GSTR3B", "042024", "2027-05-20")).toBe(false);
    expect(isReturnTimeBarred("GSTR3B", "042024", "2027-05-21")).toBe(true);
    expect(isReturnTimeBarred("GSTR1", "112026", "2026-11-09")).toBe(false);
    expect(isReturnTimeBarred("GSTR9", "FY2020-21", "2025-08-01")).toBe(true); // 2021-12-31 + 3 years = 2024-12-31
  });
});

const h = (igst: string, cgst = "0.00", sgst = "0.00", cess = "0.00"): ItcHeads => ({ igst, cgst, sgst, cess });
const row = (over: Partial<StatementRow> & { billId: string | null }): StatementRow => ({ kind: "invoice", itcAvailable: true, decision: null, igst: "0.00", cgst: "0.00", sgst: "0.00", cess: "0.00", ...over });

describe("input credit driven by the GSTR-2B statement", () => {
  const books = new Map<string, ItcHeads>([
    ["a", h("0.00", "90.00", "90.00")], // matches the statement
    ["b", h("500.00")], // the books say 500 but the supplier reported 400
    ["c", h("0.00", "50.00", "50.00")], // queried with the supplier
    ["d", h("200.00")], // missing from the statement
  ]);

  it("takes the lower of books and statement per head, and holds the rest back with the reason", () => {
    const rows: StatementRow[] = [
      row({ billId: "a", cgst: "90.00", sgst: "90.00" }),
      row({ billId: "b", igst: "400.00" }),
      row({ billId: "c", cgst: "50.00", sgst: "50.00", decision: "queried" }),
      row({ billId: null, igst: "70.00" }), // on the statement, no bill in the books
      row({ billId: null, igst: "30.00", itcAvailable: false }), // statement says not available
    ];
    const r = itcFrom2b(rows, books);
    expect(r.claim).toEqual(h("400.00", "90.00", "90.00"));
    expect(r.heldBack.queried).toEqual(h("0.00", "50.00", "50.00"));
    expect(r.heldBack.inStatementNotInBooks).toEqual(h("70.00"));
    expect(r.heldBack.notAvailable).toEqual(h("30.00"));
    expect(r.heldBack.inBooksNotInStatement).toEqual(h("200.00")); // bill d only; b and c are on the statement
    expect(r.counts).toEqual({ claimed: 2, queried: 1, notAvailable: 1, inStatementNotInBooks: 1, inBooksNotInStatement: 1 });
  });

  it("a credit or debit note on the statement lowers the claim", () => {
    const r = itcFrom2b([row({ billId: "a", cgst: "90.00", sgst: "90.00" }), row({ kind: "note", billId: null, cgst: "10.00", sgst: "10.00" })], books);
    expect(r.claim).toEqual(h("0.00", "80.00", "80.00"));
  });

  it("with no statement rows nothing is claimed and every bill waits", () => {
    const r = itcFrom2b([], books);
    expect(r.claim).toEqual(h("0.00"));
    expect(r.counts.inBooksNotInStatement).toBe(4);
  });
});
