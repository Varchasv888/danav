import { describe, expect, it } from "vitest";
import { cleanCompareFigures, compare3b, COMPARE_LINES, type CompareLine, type ItcHeads } from "../src/index.js";

const h = (igst: string, cgst = "0.00", sgst = "0.00", cess = "0.00"): ItcHeads => ({ igst, cgst, sgst, cess });
const erp = Object.fromEntries(COMPARE_LINES.map((l) => [l, h("100.00", "50.00", "50.00")])) as Record<CompareLine, ItcHeads>;

describe("GSTR-3B side by side", () => {
  it("a line is waiting until something is typed from the portal or the final return", () => {
    const rows = compare3b(erp, {}, {});
    expect(rows.every((r) => r.status === "waiting")).toBe(true);
    expect(rows[0]!.heads.igst).toEqual({ erp: "100.00", portal: null, final: null, diffPortal: null, diffFinal: null });
  });

  it("shows the difference against the ERP per head and marks lines that match or differ", () => {
    const rows = compare3b(erp, { outwardTax: h("100.00", "50.00", "50.00"), itcNet: h("90.00", "50.00", "50.00") }, { itcNet: h("100.00", "50.00", "50.00") });
    const by = Object.fromEntries(rows.map((r) => [r.line, r]));
    expect(by.outwardTax!.status).toBe("match");
    expect(by.itcNet!.status).toBe("differs");
    expect(by.itcNet!.heads.igst).toMatchObject({ portal: "90.00", diffPortal: "-10.00", final: "100.00", diffFinal: "0.00" });
    expect(by.cashPayable!.status).toBe("waiting");
  });

  it("keeps only known lines and valid amounts", () => {
    expect(cleanCompareFigures({ itcNet: { igst: "12.5", cgst: "abc", sgst: " 3 " }, bogus: { igst: "1" }, outwardTax: "x" })).toEqual({ itcNet: { igst: "12.50", sgst: "3.00" } });
  });
});
