import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  ACCOUNT_TEMPLATE, GROUP_TEMPLATE, validateVoucher, valueStock, type StockMove, type ValuationMethod, type VoucherLine, type VoucherType,
  amountInWords, checkSeriesPattern, gstr1Section, gstPeriodOf, gstSetOff, taxPeriod, type OutwardInvoice, type TaxHeads, computeInvoiceTax, fiscalYearOf, formatDocumentNumber,
  formatIndian, validateGstin, validateJournal, type LineInput, type TaxContext, type WordsLang,
  lineGstRate, posBill, slabAmbiguous, slabRate, slabRateInclusive, type GstSlab, type PosLineInput, type PosOptions, type SlabItem,
  applySchemes, type Scheme, type SchemeLine, type SchemeResult, OFFLINE_ACTIONS,
} from "../src/index.js";

const fixture = (name: string) =>
  JSON.parse(readFileSync(fileURLToPath(new URL(`../../../spec/fixtures/${name}`, import.meta.url)), "utf8"));

describe("GST fixtures", () => {
  const { cases } = fixture("gst.json") as { cases: { name: string; ctx: TaxContext; lines: LineInput[]; expect: Record<string, string> }[] };
  it.each(cases.map((c) => [c.name, c] as const))("%s", (_n, c) => {
    const { lines: _lines, ...totals } = computeInvoiceTax(c.lines, c.ctx);
    expect(totals).toEqual(c.expect);
  });
});

describe("GSTIN fixtures", () => {
  const { cases } = fixture("gstin.json") as { cases: { gstin: string; expect: string }[] };
  it.each(cases.map((c) => [c.gstin, c] as const))("%s", (_g, c) => {
    const r = validateGstin(c.gstin);
    expect(r.valid ? "valid" : r.error).toBe(c.expect);
  });
});

describe("amount in words fixtures", () => {
  const { words, grouping } = fixture("words.json") as {
    words: { amount: string; lang: WordsLang; expect: string }[];
    grouping: { amount: string; expect: string }[];
  };
  it.each(words.map((w) => [`${w.lang} ${w.amount}`, w] as const))("%s", (_n, w) => {
    expect(amountInWords(w.amount, w.lang)).toBe(w.expect);
  });
  it.each(grouping.map((g) => [g.amount, g] as const))("groups %s", (_n, g) => {
    expect(formatIndian(g.amount)).toBe(g.expect);
  });
});

describe("fiscal year and numbering fixtures", () => {
  const f = fixture("fiscal-numbering.json");
  it.each(f.fiscalYear.map((c: { date: string }) => [c.date, c]))("FY of %s", (_d, c: { date: string; expect: object }) => {
    expect(fiscalYearOf(c.date)).toMatchObject(c.expect);
  });
  it.each(f.format.map((c: { expect: string }) => [c.expect, c]))("formats %s", (_e, c: { pattern: string; parts: never; expect: string }) => {
    expect(formatDocumentNumber(c.pattern, c.parts)).toBe(c.expect);
  });
  it.each(f.seriesCheck.map((c: { pattern: string }) => [c.pattern, c]))("checks %s", (_p, c: { pattern: string; expect: string | null }) => {
    expect(checkSeriesPattern(c.pattern)).toBe(c.expect);
  });
});

describe("voucher fixtures", () => {
  const { cases } = fixture("vouchers.json");
  it.each(cases.map((c: { name: string }) => [c.name, c]))("%s", (_n, c: { type: VoucherType; lines: VoucherLine[]; expectErrors: string[] }) => {
    expect(validateVoucher(c.type, c.lines).map((e) => e.code)).toEqual(c.expectErrors);
  });
});

describe("stock valuation fixtures", () => {
  const { cases } = fixture("stock.json");
  it.each(cases.map((c: { name: string }) => [c.name, c]))("%s", (_n, c: { method: ValuationMethod; moves: StockMove[]; expect: { qty: string; value: string; valueChanges: string[] } }) => {
    const r = valueStock(c.moves, c.method);
    expect({ qty: r.qty, value: r.value, valueChanges: r.moves.map((m) => m.valueChange) }).toEqual(c.expect);
  });
});

describe("chart of accounts template", () => {
  it("every account points at a group, every child group at a parent of the same nature", () => {
    const groups = new Map(GROUP_TEMPLATE.map((g) => [g.key, g]));
    for (const a of ACCOUNT_TEMPLATE) expect(groups.has(a.group), a.key).toBe(true);
    for (const g of GROUP_TEMPLATE) if (g.parent) expect(groups.get(g.parent)?.nature, g.key).toBe(g.nature);
    expect(new Set(ACCOUNT_TEMPLATE.map((a) => a.key)).size).toBe(ACCOUNT_TEMPLATE.length);
  });
});

describe("journal fixtures", () => {
  const { cases } = fixture("journal.json");
  it.each(cases.map((c: { name: string }) => [c.name, c]))("%s", (_n, c: { lines: never[]; expectErrors: string[] }) => {
    expect(validateJournal(c.lines).map((e) => e.code)).toEqual(c.expectErrors);
  });
});

describe("GSTR fixtures", () => {
  const f = fixture("gstr.json");
  it.each(f.sections.map((c: { name: string }) => [c.name, c]))("%s", (_n, c: { inv: OutwardInvoice; expect: string }) => {
    expect(gstr1Section(c.inv)).toBe(c.expect);
  });
  it.each(f.periods.map((c: { fp: string }) => [c.fp, c]))("period %s", (_n, c: { fp: string; expect: object }) => {
    expect(taxPeriod(c.fp)).toEqual(c.expect);
    const e = c.expect as { from: string; to: string };
    expect([gstPeriodOf(e.from), gstPeriodOf(e.to)]).toEqual([c.fp, c.fp]);
  });
});

describe("GST set-off fixtures", () => {
  const f = fixture("gstr.json");
  it.each(f.setOff.map((c: { name: string }) => [c.name, c]))("%s", (_n, c: { liability: TaxHeads; credit: TaxHeads; expect: object }) => {
    const r = gstSetOff(c.liability, c.credit);
    expect({ cashPayable: r.cashPayable, creditCarriedForward: r.creditCarriedForward }).toEqual(c.expect);
  });
});

describe("price-based GST fixtures", () => {
  const f = fixture("gst-slab.json") as {
    slabRate: { slab: GstSlab; date: string; value: string; expect: string }[];
    inclusive: { slab: GstSlab; date: string; price: string; expect: string }[];
    ambiguous: { slab: GstSlab; date: string; price: string; expect: boolean }[];
    lineRate: { name: string; item: SlabItem; line: { qty: string; rate: string; discount?: string }; date: string; inclusive?: boolean; expect: string }[];
    posBill: { name: string; options: PosOptions; lines: PosLineInput[]; expectRates: string[] }[];
  };
  it.each(f.slabRate.map((c) => [`${c.slab} ${c.date} ${c.value}`, c] as const))("rate %s", (_n, c) => expect(slabRate(c.slab, c.date, c.value)).toBe(c.expect));
  it.each(f.inclusive.map((c) => [`${c.slab} ${c.date} ${c.price}`, c] as const))("inclusive %s", (_n, c) => expect(slabRateInclusive(c.slab, c.date, c.price)).toBe(c.expect));
  it.each(f.ambiguous.map((c) => [c.price, c] as const))("ambiguous %s", (_n, c) => expect(slabAmbiguous(c.slab, c.date, c.price)).toBe(c.expect));
  it.each(f.lineRate.map((c) => [c.name, c] as const))("%s", (_n, c) => expect(lineGstRate(c.item, c.line, c.date, c.inclusive)).toBe(c.expect));
  it.each(f.posBill.map((c) => [c.name, c] as const))("%s", (_n, c) => {
    expect(posBill(c.lines, c.options).lines.map((l) => l.gstRate)).toEqual(c.expectRates);
  });
});

describe("store scheme fixtures", () => {
  const { cases } = fixture("schemes.json") as { cases: { name: string; date: string; time?: string; lines: SchemeLine[]; schemes: Scheme[]; expect: SchemeResult }[] };
  it.each(cases.map((c) => [c.name, c] as const))("%s", (_n, c) => { const r = applySchemes(c.lines, c.schemes, c.date, c.time); expect({ discounts: r.discounts, applied: r.applied }).toEqual(c.expect); });
});

describe("offline rules fixture", () => {
  const { rules } = fixture("offline_rules.json") as { rules: { action: string; mode: string; note: string }[] };
  it("is exactly the table the server serves", () => {
    expect(rules).toEqual(Object.entries(OFFLINE_ACTIONS).map(([action, v]) => ({ action, mode: v.mode, note: v.note })));
  });
});
