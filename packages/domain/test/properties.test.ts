import { describe, expect, it } from "vitest";
import { computeInvoiceTax, dec, reverseJournal, validateJournal, valueStock, type JournalLine } from "../src/index.js";

// Small deterministic PRNG so failures are reproducible.
function rng(seed: number) {
  return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

describe("invoice tax invariants", () => {
  const rand = rng(42);
  const rates = ["0", "3", "5", "12", "18", "28", "40"];
  const states = ["27", "29", "04", "07", "33"];
  it("CGST equals SGST/UTGST, and grand total = taxable + tax + round-off, over 2,000 random invoices", () => {
    for (let i = 0; i < 2000; i++) {
      const lines = Array.from({ length: 1 + Math.floor(rand() * 6) }, () => ({
        qty: (1 + Math.floor(rand() * 500) / 100).toFixed(2),
        rate: (rand() * 10000).toFixed(2),
        gstRate: rates[Math.floor(rand() * rates.length)]!,
      }));
      const ctx = { supplierState: states[Math.floor(rand() * states.length)]!, placeOfSupply: states[Math.floor(rand() * states.length)]! };
      const t = computeInvoiceTax(lines, ctx);
      expect(dec(t.cgst).equals(dec(t.sgst).plus(t.utgst))).toBe(true);
      if (t.supplyKind === "intra") expect(t.igst).toBe("0.00");
      else expect(t.cgst).toBe("0.00");
      const total = dec(t.taxableValue).plus(t.taxCharged).plus(t.roundOff);
      expect(total.toFixed(2)).toBe(t.grandTotal);
      expect(dec(t.roundOff).abs().lte("0.50")).toBe(true);
    }
  });
});

describe("stock valuation invariants", () => {
  it("value changes always add up to the closing value, and zero stock has zero value (3,000 random ledgers)", () => {
    const rand = rng(7);
    for (let i = 0; i < 3000; i++) {
      const moves = Array.from({ length: 1 + Math.floor(rand() * 12) }, () =>
        rand() < 0.55
          ? { qtyIn: (rand() * 50).toFixed(3), rate: (rand() * 500).toFixed(2) }
          : { qtyOut: (rand() * 30).toFixed(3) },
      );
      for (const method of ["fifo", "average"] as const) {
        const r = valueStock(moves, method);
        const total = r.moves.reduce((s, m) => s.plus(m.valueChange), dec(0));
        expect(total.toFixed(2)).toBe(r.value);
        if (dec(r.qty).isZero()) expect(r.value).toBe("0.00");
      }
    }
  });
});

describe("journal invariants", () => {
  it("a reversal of a balanced journal is balanced and cancels it out", () => {
    const lines: JournalLine[] = [
      { accountId: "debtors", debit: "1180.00" },
      { accountId: "sales", credit: "1000.00" },
      { accountId: "output-igst", credit: "180.00" },
    ];
    const rev = reverseJournal(lines);
    expect(validateJournal(rev)).toEqual([]);
    const net = new Map<string, string>();
    for (const l of [...lines, ...rev]) {
      const prev = dec(net.get(l.accountId) ?? 0);
      net.set(l.accountId, prev.plus(l.debit ?? 0).minus(l.credit ?? 0).toFixed(2));
    }
    expect([...net.values()].every((v) => v === "0.00")).toBe(true);
  });
});
