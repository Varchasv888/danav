import { describe, expect, it } from "vitest";
import { dueRecurringDates, firstRecurringDate, nextRecurringDate } from "../src/index.js";

describe("recurring entry dates", () => {
  it("the first run is on the chosen day, this month if it has not passed", () => {
    expect(firstRecurringDate("2026-11-03", 5)).toBe("2026-11-05");
    expect(firstRecurringDate("2026-11-05", 5)).toBe("2026-11-05");
    expect(firstRecurringDate("2026-11-06", 5)).toBe("2026-12-05");
  });

  it("steps by a month, a quarter or a year and clamps a late day to the month's end", () => {
    expect(nextRecurringDate("2026-11-30", "monthly", 30)).toBe("2026-12-30");
    expect(nextRecurringDate("2026-12-31", "monthly", 31)).toBe("2027-01-31");
    expect(nextRecurringDate("2027-01-31", "monthly", 31)).toBe("2027-02-28");
    expect(nextRecurringDate("2027-02-28", "monthly", 31)).toBe("2027-03-31");
    expect(nextRecurringDate("2026-11-10", "quarterly", 10)).toBe("2027-02-10");
    expect(nextRecurringDate("2026-11-10", "yearly", 10)).toBe("2027-11-10");
    expect(nextRecurringDate("2028-01-31", "yearly", 31)).toBe("2029-01-31");
  });

  it("lists every run due, oldest first, up to the end date and the catch-up cap", () => {
    expect(dueRecurringDates("2026-09-05", null, "2026-11-10", "monthly", 5)).toEqual(["2026-09-05", "2026-10-05", "2026-11-05"]);
    expect(dueRecurringDates("2026-09-05", "2026-10-31", "2026-11-10", "monthly", 5)).toEqual(["2026-09-05", "2026-10-05"]);
    expect(dueRecurringDates("2026-12-05", null, "2026-11-10", "monthly", 5)).toEqual([]);
    expect(dueRecurringDates("2020-01-01", null, "2026-11-10", "monthly", 1, 12)).toHaveLength(12);
  });
});
