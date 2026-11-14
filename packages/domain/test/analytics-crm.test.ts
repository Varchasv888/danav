import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { nextRun, normalizeIndianMobile, presetPeriod, renderTemplate, reportPeriod, templateParams, toCsv, type Schedule } from "../src/index.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const f: any = JSON.parse(readFileSync(fileURLToPath(new URL("../../../spec/fixtures/analytics-crm.json", import.meta.url)), "utf8"));

describe("report schedules", () => {
  it.each(f.nextRun.map((c: { name: string }) => [c.name, c]))("%s", (_n, c: { schedule: Schedule; after: string; expect: string }) => {
    expect(nextRun(c.schedule, new Date(c.after)).toISOString()).toBe(c.expect);
  });
  it.each(f.periods.map((c: { name: string }) => [c.name, c]))("period: %s", (_n, c: { frequency: "daily"; runAt: string; expect: object }) => {
    expect(reportPeriod({ frequency: c.frequency }, new Date(c.runAt))).toEqual(c.expect);
  });
  it("refuses impossible schedules", () => {
    expect(() => nextRun({ frequency: "monthly", hour: 9, day: 31 }, new Date())).toThrow("invalid_day");
    expect(() => nextRun({ frequency: "weekly", hour: 9 }, new Date())).toThrow("invalid_weekday");
    expect(() => nextRun({ frequency: "daily", hour: 24 }, new Date())).toThrow("invalid_hour");
  });
  it("writes CSV that spreadsheets can't run as formulas", () => {
    expect(toCsv(f.csv.rows)).toBe(f.csv.expect);
  });
});

describe("messages", () => {
  it("fills WhatsApp-style placeholders", () => {
    expect(renderTemplate(f.templates.body, f.templates.values)).toBe(f.templates.expect);
    expect(templateParams(f.templates.body)).toEqual(f.templates.params);
    expect(() => renderTemplate(f.templates.body, ["Asha"])).toThrow("missing_param");
  });
  it.each(f.phones)("mobile %s", (raw: string, want: string | null) => {
    expect(normalizeIndianMobile(raw)).toBe(want);
  });
});

describe("period presets", () => {
  it.each([
    ["this_quarter", "2026-10-01", "2026-10-01", "2026-10-01"], ["last_quarter", "2026-10-01", "2026-07-01", "2026-09-30"],
    ["this_quarter", "2027-02-10", "2027-01-01", "2027-02-10"], ["last_quarter", "2027-02-10", "2026-10-01", "2026-12-31"],
    ["this_quarter", "2026-05-15", "2026-04-01", "2026-05-15"], ["last_quarter", "2026-05-15", "2026-01-01", "2026-03-31"],
    ["this_fy", "2027-02-10", "2026-04-01", "2027-02-10"], ["last_fy", "2026-04-01", "2025-04-01", "2026-03-31"],
    ["last_month", "2026-03-15", "2026-02-01", "2026-02-28"], ["yesterday", "2026-03-01", "2026-02-28", "2026-02-28"],
  ] as const)("%s on %s", (preset, today, from, to) => {
    expect(presetPeriod(preset, today)).toEqual({ from, to });
  });
});
