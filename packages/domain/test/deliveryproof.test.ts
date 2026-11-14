import { describe, expect, it } from "vitest";
import { addDays, awaitingProof, claimDeadline, claimState, hasDiscrepancy, proofProblems } from "../src/index.js";

describe("proof of delivery", () => {
  it("the claim deadline is a week after receipt, across month and year ends", () => {
    expect(claimDeadline("2026-11-10")).toBe("2026-11-17");
    expect(claimDeadline("2026-12-28")).toBe("2027-01-04");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("refuses short and damaged quantities that exceed what was delivered or are negative", () => {
    expect(proofProblems([{ qty: "10", short: "2", damaged: "1" }])).toEqual([]);
    expect(proofProblems([{ qty: "10", short: "8", damaged: "3" }])).toEqual(["more_than_delivered"]);
    expect(proofProblems([{ qty: "10", short: "-1", damaged: "0" }])).toEqual(["negative_quantity"]);
  });

  it("knows whether anything was wrong", () => {
    expect(hasDiscrepancy([{ qty: "10", short: "0", damaged: "0" }])).toBe(false);
    expect(hasDiscrepancy([{ qty: "10", short: "0", damaged: "1" }])).toBe(true);
  });

  it("a claim is open, then due soon in the last two days, then overdue, until it is settled or waived", () => {
    const base = { discrepancy: true, status: "open" as const, deadline: "2026-11-17" };
    expect(claimState({ ...base, today: "2026-11-10" })).toBe("open");
    expect(claimState({ ...base, today: "2026-11-15" })).toBe("due_soon");
    expect(claimState({ ...base, today: "2026-11-17" })).toBe("due_soon");
    expect(claimState({ ...base, today: "2026-11-18" })).toBe("overdue");
    expect(claimState({ ...base, status: "settled", today: "2026-11-30" })).toBe("settled");
    expect(claimState({ ...base, discrepancy: false, today: "2026-11-30" })).toBe("none");
  });

  it("a challan with no proof is chased after the grace days", () => {
    expect(awaitingProof("2026-11-10", "2026-11-13")).toBe(false);
    expect(awaitingProof("2026-11-10", "2026-11-14")).toBe(true);
  });
});
