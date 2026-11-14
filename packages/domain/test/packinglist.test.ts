import { describe, expect, it } from "vitest";
import { comparePacking } from "../src/index.js";

const challan = [{ itemId: "shirt-M", qty: "30" }, { itemId: "shirt-L", qty: "20" }];

describe("packing list against the challan", () => {
  it("is complete when the cartons hold exactly what the challan says", () => {
    const r = comparePacking(challan, [
      { id: "1", code: "BOX/1", lines: [{ itemId: "shirt-M", qty: "30" }] },
      { id: "2", code: "BOX/2", lines: [{ itemId: "shirt-L", qty: "20" }] },
    ]);
    expect(r).toMatchObject({ complete: true, problems: 0, boxCount: 2, packedPieces: "50.0000" });
  });

  it("shows what is short, what is extra and what the challan does not list", () => {
    const r = comparePacking(challan, [
      { id: "1", code: "BOX/1", lines: [{ itemId: "shirt-M", qty: "25" }, { itemId: "shirt-L", qty: "22" }, { itemId: "belt", qty: "3" }] },
    ]);
    const by = Object.fromEntries(r.rows.map((x) => [x.itemId, x]));
    expect(by["shirt-M"]).toMatchObject({ state: "short", difference: "-5.0000" });
    expect(by["shirt-L"]).toMatchObject({ state: "extra", difference: "2.0000" });
    expect(by["belt"]).toMatchObject({ state: "extra", challanQty: "0.0000" });
    expect(r).toMatchObject({ complete: false, problems: 3 });
  });

  it("adds a quantity split over several cartons, and is never complete with no cartons", () => {
    const r = comparePacking([{ itemId: "a", qty: "10" }], [{ id: "1", code: "B1", lines: [{ itemId: "a", qty: "4" }] }, { id: "2", code: "B2", lines: [{ itemId: "a", qty: "6" }] }]);
    expect(r.complete).toBe(true);
    expect(comparePacking([{ itemId: "a", qty: "10" }], []).complete).toBe(false);
  });
});
