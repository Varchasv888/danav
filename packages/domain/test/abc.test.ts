import { describe, expect, it } from "vitest";
import { classifyAbc } from "../src/index.js";

const items = [["a", "700"], ["b", "150"], ["c", "60"], ["d", "50"], ["e", "30"], ["f", "10"], ["g", "0"]].map(([id, value]) => ({ id: id!, value: value! }));

describe("ABC classification", () => {
  const rows = classifyAbc(items);
  it("ranks by value, drops items that did not sell, and gives each item's share", () => {
    expect(rows.map((r) => r.id)).toEqual(["a", "b", "c", "d", "e", "f"]);
    expect(rows[0]).toMatchObject({ sharePct: "70.00", cumulativePct: "70.00" });
    expect(rows[5]!.cumulativePct).toBe("100.00");
  });
  it("puts an item in the class where its share starts, so the one crossing 80% is still A", () => {
    // total 1000: a 0-70, b 70-85, c 85-91, d 91-96, e 96-99, f 99-100
    expect(Object.fromEntries(rows.map((r) => [r.id, r.class]))).toEqual({ a: "A", b: "A", c: "B", d: "B", e: "C", f: "C" });
  });
  it("says how often each class should be counted", () => {
    expect(rows.find((r) => r.id === "a")!.countEveryDays).toBe(30);
    expect(rows.find((r) => r.id === "c")!.countEveryDays).toBe(90);
    expect(rows.find((r) => r.id === "f")!.countEveryDays).toBe(180);
  });
  it("has nothing to class when nothing sold", () => {
    expect(classifyAbc([{ id: "x", value: "0" }])).toEqual([]);
  });
});
