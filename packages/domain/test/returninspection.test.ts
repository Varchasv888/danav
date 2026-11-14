import { describe, expect, it } from "vitest";
import { inspectionProblems, inspectionState, remainingToInspect } from "../src/index.js";

const row = { qty: "10", restocked: "0", writtenOff: "0" };

describe("return inspection", () => {
  it("what is not yet restocked or written off is still to inspect, and the line is done when none is left", () => {
    expect(remainingToInspect(row).toFixed(4)).toBe("10.0000");
    expect(remainingToInspect({ ...row, restocked: "6", writtenOff: "1" }).toFixed(4)).toBe("3.0000");
    expect(inspectionState(row)).toBe("pending");
    expect(inspectionState({ ...row, restocked: "7", writtenOff: "3" })).toBe("done");
  });

  it("accepts a decision within what is left, and refuses nothing, negatives and too much", () => {
    expect(inspectionProblems(row, { restock: "7", writeOff: "3" })).toEqual([]);
    expect(inspectionProblems(row, { restock: "0", writeOff: "0" })).toEqual(["nothing_decided"]);
    expect(inspectionProblems(row, { restock: "-1", writeOff: "2" })).toContain("negative_quantity");
    expect(inspectionProblems({ ...row, restocked: "8" }, { restock: "2", writeOff: "1" })).toEqual(["more_than_remaining"]);
  });
});
