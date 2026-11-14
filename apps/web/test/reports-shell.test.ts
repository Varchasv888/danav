import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { periodOf, periodRange } from "../lib/report-periods";
import { REPORT_KEYS } from "../lib/report-keys";
import { activeEntry, entryPath, REPORTS_MENU } from "../lib/reports-menu";

describe("report periods", () => {
  it("gives the dates of each preset", () => {
    expect(periodRange("thisMonth", "2026-11-07")).toEqual({ from: "2026-11-01", to: "2026-11-30" });
    expect(periodRange("lastMonth", "2026-01-15")).toEqual({ from: "2025-12-01", to: "2025-12-31" });
    expect(periodRange("thisWeek", "2026-11-07")).toEqual({ from: "2026-11-02", to: "2026-11-08" }); // a Saturday: the week runs Monday to Sunday
    expect(periodRange("yesterday", "2026-03-01")).toEqual({ from: "2026-02-28", to: "2026-02-28" });
  });
  it("uses the Indian financial year for quarters and years", () => {
    expect(periodRange("thisYear", "2026-11-07")).toEqual({ from: "2026-04-01", to: "2027-03-31" });
    expect(periodRange("thisYear", "2027-02-10")).toEqual({ from: "2026-04-01", to: "2027-03-31" });
    expect(periodRange("lastYear", "2026-11-07")).toEqual({ from: "2025-04-01", to: "2026-03-31" });
    expect(periodRange("thisQuarter", "2026-11-07")).toEqual({ from: "2026-10-01", to: "2026-12-31" });
    expect(periodRange("thisQuarter", "2027-02-10")).toEqual({ from: "2027-01-01", to: "2027-03-31" });
    expect(periodRange("thisQuarter", "2026-05-01")).toEqual({ from: "2026-04-01", to: "2026-06-30" });
  });
  it("names the preset a range matches, or custom", () => {
    expect(periodOf("2026-11-01", "2026-11-30", "2026-11-07")).toBe("thisMonth");
    expect(periodOf("2026-11-03", "2026-11-09", "2026-11-07")).toBe("custom");
  });
});

describe("reports menu", () => {
  it("points every entry at a screen that exists", () => {
    const root = join(__dirname, "..", "app", "(app)");
    for (const e of REPORTS_MENU.flatMap((g) => g.items)) {
      if (entryPath(e).startsWith("/reports/list/")) { expect((REPORT_KEYS as readonly string[]).includes(entryPath(e).split("/").pop()!), e.href).toBe(true); continue; }
      const dir = join(root, ...entryPath(e).split("/").filter(Boolean));
      expect(existsSync(join(dir, "page.tsx")), e.href).toBe(true);
    }
  });
  it("marks the most specific entry on a shared path as open", () => {
    expect(activeEntry("/reports/profitability", new URLSearchParams("by=customer"))?.key).toBe("partyProfit");
    expect(activeEntry("/reports/profitability", new URLSearchParams("by=item"))?.key).toBe("itemProfit");
    expect(activeEntry("/reports/profitability", new URLSearchParams(""))?.key).toBe("styleProfit");
    expect(activeEntry("/reports/transactions", new URLSearchParams("type=purchase"))?.key).toBe("purchase");
    expect(activeEntry("/reports/transactions", new URLSearchParams(""))?.key).toBe("allTransactions");
  });
});
