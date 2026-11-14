import { describe, expect, it } from "vitest";
import { binDrift, missingLines, planPick, scanResult } from "../src/index.js";

const holdings = [
  { binId: "b1", code: "A-01", itemId: "x", qty: "30" },
  { binId: "b2", code: "A-02", itemId: "x", qty: "50" },
  { binId: "b3", code: "B-01", itemId: "y", qty: "5" },
];

describe("choosing bins for a pick list", () => {
  it("takes from the fullest bin first so a line touches few bins, and spills into the next", () => {
    const r = planPick([{ lineId: "l1", itemId: "x", toPick: "60" }], holdings);
    expect(r.map((a) => [a.code, a.qty])).toEqual([["A-02", "50.0000"], ["A-01", "10.0000"]]);
  });

  it("never takes the same pieces for two lines, and plans what no bin holds with no bin", () => {
    const r = planPick([{ lineId: "l1", itemId: "y", toPick: "3" }, { lineId: "l2", itemId: "y", toPick: "4" }, { lineId: "l3", itemId: "z", toPick: "2" }], holdings);
    expect(r.map((a) => [a.lineId, a.code, a.qty])).toEqual([["l1", "B-01", "3.0000"], ["l2", "B-01", "2.0000"], ["l2", null, "2.0000"], ["l3", null, "2.0000"]]);
  });
});

describe("checking what is scanned", () => {
  const lines = [{ id: "l1", itemId: "x", toPick: "2", picked: "1" }, { id: "l2", itemId: "y", toPick: "1", picked: "1" }];
  it("counts toward an open line, calls a finished line's item an extra, and an unlisted item wrong", () => {
    expect(scanResult(lines, "x")).toEqual({ kind: "ok", lineId: "l1" });
    expect(scanResult(lines, "y")).toEqual({ kind: "extra" });
    expect(scanResult(lines, "q")).toEqual({ kind: "wrong" });
  });

  it("lists the lines still short when the picker says they are done", () => {
    expect(missingLines(lines)).toEqual([{ lineId: "l1", itemId: "x", missing: "1.0000" }]);
    expect(missingLines([{ id: "l1", itemId: "x", toPick: "1", picked: "1" }])).toEqual([]);
  });
});

describe("bins against stock", () => {
  it("flags items shelved in bins beyond what the godown holds", () => {
    const drift = binDrift([{ itemId: "x", qty: "30" }, { itemId: "x", qty: "50" }, { itemId: "y", qty: "5" }], new Map([["x", "70"], ["y", "5"]]));
    expect(drift).toEqual([{ itemId: "x", assigned: "80.0000", inStock: "70.0000", over: "10.0000" }]);
  });
});
