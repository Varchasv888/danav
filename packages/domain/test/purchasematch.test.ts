import { describe, expect, it } from "vitest";
import { matchLine, matchOrder, type MatchLine } from "../src/index.js";

const base: MatchLine = { ordered: "100", received: "100", billed: "100", orderRate: "300", billedRate: "300", short: "0", damaged: "0", hold: "0", orderDone: true };

describe("ordered, received and billed", () => {
  it("a line that was ordered, received and billed at the ordered rate is matched", () => {
    expect(matchLine(base)).toMatchObject({ status: "matched", flags: [], rateDifference: "0.00", rateCost: "0.00", excessBilled: "0.00" });
  });

  it("billing more than was received is an exception and says by how much", () => {
    const r = matchLine({ ...base, received: "90" });
    expect(r.status).toBe("exception");
    expect(r.flags).toContain("billed_more_than_received");
    expect(r.flags).toContain("short_supply");
    expect(r.excessBilled).toBe("10.00");
  });

  it("a billed rate above the order is flagged with its cost on the billed quantity", () => {
    const r = matchLine({ ...base, billedRate: "310" });
    expect(r.status).toBe("exception");
    expect(r.flags).toEqual(["rate_differs"]);
    expect(r.rateDifference).toBe("10.00");
    expect(r.rateCost).toBe("1000.00");
  });

  it("goods received but not yet billed, or not yet received on an open order, are open and not wrong", () => {
    expect(matchLine({ ...base, billed: "60", billedRate: "300" })).toMatchObject({ status: "open", flags: ["received_not_billed"] });
    expect(matchLine({ ...base, received: "60", billed: "60", orderDone: false })).toMatchObject({ status: "open", flags: ["not_yet_received"] });
    expect(matchLine({ ...base, received: "0", billed: "0", billedRate: null, orderDone: false }).status).toBe("open");
  });

  it("short, damaged and held quantities are exceptions", () => {
    expect(matchLine({ ...base, short: "5" }).flags).toContain("short_supply");
    expect(matchLine({ ...base, damaged: "2" }).flags).toContain("damaged");
    expect(matchLine({ ...base, hold: "3" }).flags).toContain("on_hold");
  });

  it("an order is as bad as its worst line", () => {
    const ok = matchLine(base), open = matchLine({ ...base, billed: "50" }), bad = matchLine({ ...base, damaged: "1" });
    expect(matchOrder([ok, ok])).toBe("matched");
    expect(matchOrder([ok, open])).toBe("open");
    expect(matchOrder([ok, open, bad])).toBe("exception");
  });
});
