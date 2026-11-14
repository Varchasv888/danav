import { describe, expect, it } from "vitest";
import { gstr9Tables, type Gstr9Heads, type Gstr9Month } from "../src/index.js";

const h = (igst: string, cgst: string, sgst: string, cess = "0"): Gstr9Heads => ({ igst, cgst, sgst, cess });
const month = (fp: string, over: Partial<Gstr9Month> = {}): Gstr9Month => ({
  fp,
  outward: { taxable: "1000.00", ...h("0", "50", "50") },
  zeroRated: { taxable: "0", ...h("0", "0", "0") },
  nilExempt: "0",
  reverseCharge: { taxable: "0", ...h("0", "0", "0") },
  itcAvailed: h("10", "20", "20"),
  itcReversed: h("0", "0", "0"),
  taxPayable: h("0", "50", "50"),
  taxPaidInCash: h("0", "30", "30"),
  ...over,
});

describe("GSTR-9 tables", () => {
  const months = [month("042025"), month("052025", { itcReversed: h("0", "5", "5") })];
  const base = { months, creditPer2b: h("30", "50", "50"), creditPerBooks: h("20", "40", "40"), monthsWithout2b: ["062025"] };

  it("adds the months up for the outward, credit and tax tables", () => {
    const t = gstr9Tables({ ...base, basis: "2b" });
    expect(t.table4).toMatchObject({ taxable: "2000.00", cgst: "100.00", sgst: "100.00", totalTax: "200.00" });
    expect(t.table6.availed).toEqual(h("20.00", "40.00", "40.00", "0.00"));
    expect(t.table7.reversed).toEqual(h("0.00", "5.00", "5.00", "0.00"));
    expect(t.netCredit).toEqual(h("20.00", "35.00", "35.00", "0.00"));
    expect(t.table9.payable.cgst).toBe("100.00");
    expect(t.table9.paidInCash.cgst).toBe("60.00");
    expect(t.table9.paidByCredit.cgst).toBe("40.00");
  });

  it("takes Table 8A from the chosen basis and always shows the other beside it", () => {
    const a = gstr9Tables({ ...base, basis: "2b" }).table8;
    expect(a.a).toEqual(h("30", "50", "50"));
    expect(a.d).toEqual(h("10.00", "10.00", "10.00", "0.00")); // 2B credit less what was availed
    expect(a.gapBetweenBases).toEqual(h("10.00", "10.00", "10.00", "0.00"));
    expect(a.monthsWithout2b).toEqual(["062025"]);
    const b = gstr9Tables({ ...base, basis: "books" }).table8;
    expect(b.a).toEqual(h("20", "40", "40"));
    expect(b.d).toEqual(h("0.00", "0.00", "0.00", "0.00"));
    expect(b.dNote).toBe("agrees");
    expect(a.dNote).toBe("available_not_availed");
  });

  it("counts credit carried to the next year in 8C", () => {
    const t = gstr9Tables({ ...base, basis: "2b", nextYearCredit: h("10", "10", "10") }).table8;
    expect(t.d).toEqual(h("0.00", "0.00", "0.00", "0.00"));
  });

  it("flags credit taken beyond what was available", () => {
    const t = gstr9Tables({ ...base, creditPer2b: h("0", "0", "0"), basis: "2b" }).table8;
    expect(t.dNote).toBe("availed_more_than_available");
  });
});
