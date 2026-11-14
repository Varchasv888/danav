import { describe, expect, it } from "vitest";
import { heldQty, planReservation, suggestSubstitutes } from "../src/index.js";

describe("what a reservation still holds", () => {
  const base = { reserved: "50", ordered: "100", done: "0", orderLive: true, released: false };
  it("holds what was reserved until the line is delivered", () => {
    expect(heldQty(base).toFixed(4)).toBe("50.0000");
    expect(heldQty({ ...base, done: "70" }).toFixed(4)).toBe("30.0000"); // only 30 left to deliver, so only 30 held
    expect(heldQty({ ...base, done: "100" }).toFixed(4)).toBe("0.0000");
    expect(heldQty({ ...base, done: "120" }).toFixed(4)).toBe("0.0000");
  });
  it("holds nothing once released or when the order is closed or cancelled", () => {
    expect(heldQty({ ...base, released: true }).toFixed(4)).toBe("0.0000");
    expect(heldQty({ ...base, orderLive: false }).toFixed(4)).toBe("0.0000");
  });
});

describe("sharing free stock among an order's lines", () => {
  const free = new Map([["a", "60"], ["b", "10"]]);
  it("gives each line what it wants or what is left, in line order, and reports the shortage", () => {
    const r = planReservation([
      { lineId: "l1", itemId: "a", ordered: "50", done: "0", alreadyHeld: "0" },
      { lineId: "l2", itemId: "b", ordered: "40", done: "0", alreadyHeld: "0" },
      { lineId: "l3", itemId: "a", ordered: "30", done: "0", alreadyHeld: "0" },
    ], free);
    expect(r.map((x) => [x.give, x.short])).toEqual([["50.0000", "0.0000"], ["10.0000", "30.0000"], ["10.0000", "20.0000"]]);
  });
  it("counts what a line already holds and what it has already delivered", () => {
    const r = planReservation([{ lineId: "l1", itemId: "a", ordered: "100", done: "20", alreadyHeld: "30" }], new Map([["a", "100"]]));
    expect(r[0]).toMatchObject({ wanted: "50.0000", give: "50.0000", short: "0.0000" });
  });
  it("never gives a negative amount when stock is short or there is nothing left to deliver", () => {
    const r = planReservation([{ lineId: "l1", itemId: "z", ordered: "10", done: "0", alreadyHeld: "0" }, { lineId: "l2", itemId: "a", ordered: "10", done: "10", alreadyHeld: "0" }], new Map([["a", "5"]]));
    expect(r.map((x) => x.give)).toEqual(["0.0000", "0.0000"]);
    expect(r[0]!.short).toBe("10.0000");
  });
});

describe("substitute suggestions", () => {
  it("lists same-style items with free stock, most first, and says whether one covers the shortage", () => {
    const r = suggestSubstitutes("30", [
      { itemId: "x", name: "Shirt blue M", colour: "Blue", size: "M", free: "12" },
      { itemId: "y", name: "Shirt blue L", colour: "Blue", size: "L", free: "40" },
      { itemId: "z", name: "Shirt blue XL", colour: "Blue", size: "XL", free: "0" },
    ]);
    expect(r.map((s) => [s.itemId, s.covers])).toEqual([["y", true], ["x", false]]);
  });
});
