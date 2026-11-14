import { describe, expect, it } from "vitest";
import { rankQuotes, type Quote } from "../src/index.js";

const q = (id: string, supplier: string, rate: string, extraCost: string, over: Partial<Quote> = {}): Quote =>
  ({ id, supplier, rate, extraCost, minQty: null, leadDays: null, validUntil: null, quotedOn: "2026-11-01", ...over });

describe("supplier quote comparison", () => {
  const today = "2026-11-10";

  it("ranks by estimated landed cost, marks the cheapest and says how much dearer the others are", () => {
    const r = rankQuotes([q("a", "Mill A", "300", "12"), q("b", "Mill B", "290", "30"), q("c", "Mill C", "310", "0")], today, null);
    expect(r.map((x) => x.supplier)).toEqual(["Mill C", "Mill A", "Mill B"]); // 310, 312, 320
    expect(r[0]).toMatchObject({ landed: "310.00", cheapest: true, overCheapestPct: "0.0" });
    expect(r[1]).toMatchObject({ landed: "312.00", cheapest: false, overCheapestPct: "0.6" });
    expect(r[2]).toMatchObject({ landed: "320.00", overCheapestPct: "3.2" });
  });

  it("shows expired quotes last and never ranks them", () => {
    const r = rankQuotes([q("a", "Cheap but old", "100", "0", { validUntil: "2026-10-31" }), q("b", "Current", "300", "0", { validUntil: "2026-11-30" })], today, null);
    expect(r.map((x) => x.supplier)).toEqual(["Current", "Cheap but old"]);
    expect(r[0]!.cheapest).toBe(true);
    expect(r[1]).toMatchObject({ expired: true, cheapest: false, overCheapestPct: null });
  });

  it("compares with the last price actually paid, when there was one", () => {
    const r = rankQuotes([q("a", "Mill A", "270", "0")], today, "300");
    expect(r[0]!.vsLastPaidPct).toBe("-10.0");
    expect(rankQuotes([q("a", "Mill A", "270", "0")], today, null)[0]!.vsLastPaidPct).toBeNull();
  });

  it("with no valid quote nothing is marked cheapest", () => {
    const r = rankQuotes([q("a", "Old", "100", "0", { validUntil: "2026-01-01" })], today, null);
    expect(r[0]!.cheapest).toBe(false);
  });
});
