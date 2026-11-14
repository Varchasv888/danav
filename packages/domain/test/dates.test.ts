import { describe, expect, it } from "vitest";
import { businessDate } from "../src/index.js";

describe("business date", () => {
  it("rolls over at midnight in India, not in UTC", () => {
    expect(businessDate(new Date("2026-10-28T18:29:59Z"))).toBe("2026-10-28");
    expect(businessDate(new Date("2026-10-28T18:30:00Z"))).toBe("2026-10-29");
    expect(businessDate(new Date("2026-03-31T20:00:00Z"))).toBe("2026-04-01"); // a new financial year at 1:30 am
  });
});
