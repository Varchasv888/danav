import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  applyRules, bookDepreciation, disposalResult, extractRefs, itBlockDepreciation, parseBankAmount, parseBankDate, parseSettlements, parseStatement,
  suggestMatches, wdvRate,
} from "../src/index.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const f: any = JSON.parse(readFileSync(fileURLToPath(new URL("../../../spec/fixtures/banking-assets.json", import.meta.url)), "utf8"));
const named = <T extends { name: string }>(xs: T[]) => xs.map((x) => [x.name, x] as const);

describe("book depreciation", () => {
  it.each(named(f.bookDepreciation))("%s", (_n, c: { asset: never; period: never; accumulatedAtFyStart: string; accumulatedBefore: string; expect: object }) => {
    expect(bookDepreciation(c.asset, c.period, c.accumulatedAtFyStart, c.accumulatedBefore)).toEqual(c.expect);
  });
  it("works out the WDV rate from life and residual value", () => {
    expect(wdvRate(8, 5).toFixed(6)).toBe("0.312344");
    expect(() => wdvRate(8, 0)).toThrow("invalid_residual");
  });
  it("profit or loss on sale", () => {
    const d = f.disposal;
    expect(disposalResult(d.cost, d.accumulated, d.saleValue)).toEqual(d.expect);
  });
});

describe("income-tax blocks", () => {
  it.each(named(f.itBlocks))("%s", (_n, c: { block: never; fyEnd: string; expect: object }) => {
    expect(itBlockDepreciation(c.block, c.fyEnd)).toMatchObject(c.expect);
  });
});

describe("bank statements", () => {
  it.each(named(f.statements))("%s", (_n, c: { csv: string; expect: object }) => {
    expect(parseStatement(c.csv)).toMatchObject(c.expect);
  });
  it("reads Indian dates and amounts", () => {
    expect(["05/10/2026", "5-10-26", "05.10.2026", "05-Oct-2026", "05 Oct 26", "2026-10-05", "05/10/2026 14:22:01"].map(parseBankDate)).toEqual(Array(7).fill("2026-10-05"));
    expect(parseBankDate("31/02/2026")).toBeNull();
    expect(parseBankAmount("₹ 1,23,456.78 Cr")).toMatchObject({ side: "cr" });
    expect(parseBankAmount("(250.00)")!.value.toFixed(2)).toBe("-250.00");
    expect(parseBankAmount(" - ")).toBeNull();
    expect(() => parseBankAmount("abc")).toThrow("bad_amount");
    expect(() => parseStatement("hello,world\n1,2\n")).toThrow("no_header");
  });
  it("finds UTRs, RRNs and cheque numbers", () => {
    expect(extractRefs("NEFT DR-ICIC0000123-ANAND DAIRY-N276262012345678")).toEqual(["ICIC0000123", "N276262012345678"]);
    expect(extractRefs("0000627412345678")).toEqual(["627412345678"]);
  });
});

describe("reconciliation", () => {
  it("pairs statement lines with book entries, best first, and says which are sure", () => {
    expect(suggestMatches(f.matching.lines, f.matching.entries)).toEqual(f.matching.expect);
  });
  it("ties a cheque presented weeks later by its number, but not a same-amount entry without one", () => {
    const line = { id: "L", date: "2026-11-02", description: "CHQ PAID-000124-RAJ ELECTRICALS", reference: null, debit: "5000.00", credit: "0.00" };
    const cheque = { id: "C", date: "2026-10-20", direction: "out" as const, amount: "5000.00", number: "P/26-27/00010", reference: "000124", narration: null, party: null };
    expect(suggestMatches([line], [cheque])).toEqual([{ lineId: "L", entryId: "C", score: 51, reasons: ["amount", "reference"], sure: true }]);
    expect(suggestMatches([line], [{ ...cheque, reference: null }])).toEqual([]);
  });
  it.each(f.rules.cases.map((c: { line: { description: string }; expect: string | null }) => [c.line.description, c]))("rule for %s", (_n, c: { line: never; expect: string | null }) => {
    expect(applyRules(c.line, f.rules.rules)?.id ?? null).toBe(c.expect);
  });
  it("totals a gateway settlement report per payout, fees net of their GST", () => {
    expect(parseSettlements(f.settlements.csv)).toEqual(f.settlements.expect);
  });
});
