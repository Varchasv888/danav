import { describe, expect, it } from "vitest";
import { bandFor, endIn9, priceFromBand } from "../src/index.js";

const bands = [
  { fromRate: "0", markupPct: "100", markdown1Pct: "10", markdown2Pct: "20" },
  { fromRate: "500", markupPct: "80", markdown1Pct: "10", markdown2Pct: "25" },
  { fromRate: "1500", markupPct: "60", markdown1Pct: "5", markdown2Pct: "15" },
];

describe("margin bands", () => {
  it("picks the band with the highest start at or below the cost", () => {
    expect(bandFor(bands, "499.99")!.markupPct).toBe("100");
    expect(bandFor(bands, "500")!.markupPct).toBe("80");
    expect(bandFor(bands, "2000")!.markupPct).toBe("60");
    expect(bandFor([], "100")).toBeNull();
    expect(bandFor(bands, "-1")).toBeNull();
  });
  it("rounds up to a price ending in 9", () => {
    expect(endIn9("1287").toString()).toBe("1289");
    expect(endIn9("1299").toString()).toBe("1299");
    expect(endIn9("1300").toString()).toBe("1309");
    expect(endIn9("5").toString()).toBe("9");
  });
  it("works out the MRP and the two sale rates", () => {
    // cost 600 with 80% mark-up is 1,080, up to 1,089; 10% off is 980.1, 25% off is 816.75
    expect(priceFromBand(bands[1]!, "600")).toEqual({ mrp: "1089.00", sale1: "980.00", sale2: "817.00" });
  });
});
