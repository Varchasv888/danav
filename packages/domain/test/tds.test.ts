import { describe, expect, it } from "vitest";
import { tdsOn, tdsQuarter, tdsSection } from "../src/tds.js";

const sec = (c: string) => tdsSection(c)!;

describe("TDS on payments other than salary", () => {
  it("takes nothing below the limits and tax on a single large payment", () => {
    expect(tdsOn(sec("194C"), { base: "25000", individual: false, hasPan: true }).tds).toBe("0.00");
    const r = tdsOn(sec("194C"), { base: "50000", individual: false, hasPan: true });
    expect(r).toMatchObject({ rate: "2.00", taxableBase: "50000.00", tds: "1000.00" });
    expect(tdsOn(sec("194C"), { base: "50000", individual: true, hasPan: true }).tds).toBe("500.00");
  });

  it("catches up on earlier small payments once the year's limit is crossed", () => {
    // Four payments of 30,000 stay below both limits, then a fifth takes the year past 1,00,000.
    const fifth = tdsOn(sec("194C"), { base: "30000", priorBase: "120000", priorTaxedBase: "0", individual: false, hasPan: true });
    expect(fifth).toMatchObject({ taxableBase: "150000.00", tds: "3000.00" });
    // The next one is taxed alone, because the rest was already taxed.
    expect(tdsOn(sec("194C"), { base: "10000", priorBase: "150000", priorTaxedBase: "150000", individual: false, hasPan: true }).tds).toBe("200.00");
  });

  it("charges the higher rate when the payee has no PAN", () => {
    expect(tdsOn(sec("194J(b)"), { base: "100000", individual: true, hasPan: false })).toMatchObject({ rate: "20.00", tds: "20000.00", noPan: true });
    expect(tdsOn(sec("194C"), { base: "50000", individual: false, hasPan: false }).rate).toBe("20.00");
  });

  it("taxes only the part of purchases over 50 lakh under 194Q", () => {
    expect(tdsOn(sec("194Q"), { base: "4000000", individual: false, hasPan: true }).tds).toBe("0.00");
    const r = tdsOn(sec("194Q"), { base: "2000000", priorBase: "4000000", individual: false, hasPan: true });
    expect(r).toMatchObject({ taxableBase: "1000000.00", tds: "1000.00" });
    expect(tdsOn(sec("194Q"), { base: "1000000", priorBase: "6000000", individual: false, hasPan: true }).taxableBase).toBe("1000000.00");
    expect(tdsOn(sec("194Q"), { base: "1000000", priorBase: "6000000", individual: false, hasPan: false }).rate).toBe("5.00");
  });

  it("uses a rate given, rounds to the rupee and names the quarter", () => {
    expect(tdsOn(sec("194H"), { base: "25555", individual: false, hasPan: true, rateOverride: "5" }).tds).toBe("1278.00");
    expect([tdsQuarter("2026-04-01"), tdsQuarter("2026-06-30"), tdsQuarter("2026-07-01"), tdsQuarter("2026-12-31"), tdsQuarter("2027-01-01"), tdsQuarter("2027-03-31")]).toEqual([1, 1, 2, 3, 4, 4]);
  });
});

import { tcsOn, tcsSection } from "../src/tds.js";
describe("tax collected at source", () => {
  it("collects at the section rate, more when the buyer has no PAN, to the rupee", () => {
    const scrap = tcsSection("206C(1) scrap")!;
    expect(tcsOn(scrap, { base: "100000", hasPan: true })).toEqual({ rate: "1.00", tcs: "1000.00", noPan: false });
    expect(tcsOn(scrap, { base: "100000", hasPan: false })).toEqual({ rate: "5.00", tcs: "5000.00", noPan: true });
    expect(tcsOn(scrap, { base: "12345", hasPan: true, rateOverride: "2" }).tcs).toBe("247.00");
  });
});
