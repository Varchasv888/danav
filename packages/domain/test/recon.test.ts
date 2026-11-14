import { describe, expect, it } from "vitest";
import { matchRecords, type ReconRecord } from "../src/recon.js";

const r = (id: string, ref: string, date: string, amount: string): ReconRecord => ({ id, ref, date, amount });

describe("reconciliation matching", () => {
  it("pairs on reference and amount first, ignoring punctuation and leading zeros", () => {
    const out = matchRecords([r("o1", "INV/0101", "2026-10-01", "1000")], [r("t1", "inv-101", "2026-10-20", "1000")]);
    expect(out.matches).toEqual([{ ours: ["o1"], theirs: ["t1"], rule: "reference", difference: "0.00" }]);
    expect(out.ours).toEqual([]);
  });

  it("pairs on amount and a nearby date when there is no reference, nearest first, using each record once", () => {
    const ours = [r("o1", "", "2026-10-01", "500"), r("o2", "", "2026-10-05", "500")];
    const out = matchRecords(ours, [r("t1", "x", "2026-10-06", "500"), r("t2", "y", "2026-10-02", "500")]);
    expect(out.matches.map((m) => [m.ours[0], m.theirs[0]]).sort()).toEqual([["o1", "t2"], ["o2", "t1"]]);
    // A date outside the window does not pair.
    expect(matchRecords([r("o1", "", "2026-10-01", "500")], [r("t1", "", "2026-12-01", "500")]).matches).toEqual([]);
  });

  it("allows a small difference within the tolerance and reports it", () => {
    const out = matchRecords([r("o1", "A1", "2026-10-01", "1000.00")], [r("t1", "A1", "2026-10-01", "999.70")]);
    expect(out.matches[0]).toMatchObject({ rule: "reference", difference: "0.30" });
    expect(matchRecords([r("o1", "A1", "2026-10-01", "1000")], [r("t1", "A1", "2026-10-01", "990")]).matches).toEqual([]);
  });

  it("pairs one payment against several invoices, in either direction", () => {
    const ours = [r("o1", "B1", "2026-10-01", "300"), r("o2", "B2", "2026-10-03", "450"), r("o3", "B3", "2026-10-04", "250"), r("o9", "B9", "2026-10-04", "77")];
    const out = matchRecords(ours, [r("t1", "PAY", "2026-10-10", "1000")]);
    expect(out.matches).toHaveLength(1);
    expect(out.matches[0]).toMatchObject({ rule: "one_to_many", theirs: ["t1"], difference: "0.00" });
    expect(out.matches[0]!.ours.sort()).toEqual(["o1", "o2", "o3"]);
    expect(out.ours.map((x) => x.id)).toEqual(["o9"]);
    const rev = matchRecords([r("o1", "PAY", "2026-10-10", "1000")], [r("t1", "B1", "2026-10-01", "600"), r("t2", "B2", "2026-10-02", "400")]);
    expect(rev.matches[0]).toMatchObject({ rule: "many_to_one", ours: ["o1"] });
  });

  it("leaves what cannot be paired as exceptions", () => {
    const out = matchRecords([r("o1", "A", "2026-10-01", "100")], [r("t1", "Z", "2026-10-01", "345")]);
    expect(out.matches).toEqual([]);
    expect(out.ours).toHaveLength(1);
    expect(out.theirs).toHaveLength(1);
  });
});
