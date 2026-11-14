import { describe, expect, it } from "vitest";
import { receivingCheck } from "../src/index.js";

const order = [{ lineId: "l1", itemId: "m", ordered: "50", received: "20" }, { lineId: "l2", itemId: "l", ordered: "30", received: "0" }];
const scan = (itemId: string | null, qty: string, code = "x") => ({ itemId, code, qty });

describe("receiving against the order", () => {
  it("counts against what is still to come, not the whole order", () => {
    const r = receivingCheck(order, [scan("m", "30"), scan("l", "30")]);
    expect(r.rows[0]).toMatchObject({ open: "30.0000", counted: "30.0000", state: "complete" });
    expect(r.allIn).toBe(true);
  });

  it("shows what is short and what is over", () => {
    const r = receivingCheck(order, [scan("m", "25"), scan("l", "34")]);
    expect(r.rows[0]).toMatchObject({ state: "short", difference: "-5.0000" });
    expect(r.rows[1]).toMatchObject({ state: "over", difference: "4.0000" });
    expect(r.allIn).toBe(false);
  });

  it("adds repeated scans and flags items not on the order and codes nobody knows", () => {
    const r = receivingCheck(order, [scan("m", "10"), scan("m", "20"), scan("belt", "2"), scan(null, "1", "999")]);
    expect(r.rows[0]).toMatchObject({ counted: "30.0000", state: "complete" });
    expect(r.notOnOrder).toEqual([{ itemId: "belt", qty: "2.0000" }]);
    expect(r.unknown).toEqual([{ code: "999", qty: "1" }]);
    expect(r.problems).toBe(3); // line l is short, plus the belt and the unknown code
  });

  it("treats a fully received line as over if anything more arrives", () => {
    const r = receivingCheck([{ lineId: "a", itemId: "m", ordered: "10", received: "10" }], [scan("m", "2")]);
    expect(r.rows[0]).toMatchObject({ open: "0.0000", counted: "2.0000", state: "over" });
  });
});
