/**
 * Report schedules and exports. Schedules are in Indian time (UTC+5:30, no daylight saving): "daily at
 * 9", "every Monday at 8", "on the 1st at 7". Monthly days are 1–28 so every month has them.
 */
export type Frequency = "daily" | "weekly" | "monthly";
export interface Schedule {
  frequency: Frequency;
  /** 0–23, Indian time. */
  hour: number;
  /** Weekly: 0 = Sunday … 6 = Saturday. */
  weekday?: number | undefined;
  /** Monthly: 1–28. */
  day?: number | undefined;
}

export class ScheduleError extends Error {
  constructor(public code: "invalid_hour" | "invalid_weekday" | "invalid_day") {
    super(code);
  }
}

const IST_MINUTES = 330;

export function checkSchedule(s: Schedule) {
  if (!Number.isInteger(s.hour) || s.hour < 0 || s.hour > 23) throw new ScheduleError("invalid_hour");
  if (s.frequency === "weekly" && (!Number.isInteger(s.weekday) || s.weekday! < 0 || s.weekday! > 6)) throw new ScheduleError("invalid_weekday");
  if (s.frequency === "monthly" && (!Number.isInteger(s.day) || s.day! < 1 || s.day! > 28)) throw new ScheduleError("invalid_day");
}

/** The first run strictly after `after`, as a UTC instant. */
export function nextRun(s: Schedule, after: Date): Date {
  checkSchedule(s);
  const local = new Date(after.getTime() + IST_MINUTES * 60_000); // IST wall clock, read with getUTC*
  for (let i = 0; i < 400; i++) {
    const d = new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() + i, s.hour));
    if (s.frequency === "weekly" && d.getUTCDay() !== s.weekday) continue;
    if (s.frequency === "monthly" && d.getUTCDate() !== s.day) continue;
    const utc = new Date(d.getTime() - IST_MINUTES * 60_000);
    if (utc.getTime() > after.getTime()) return utc;
  }
  throw new Error("no run found");
}

/** The period a scheduled report covers when it runs: the previous day, week (Mon–Sun) or month, in Indian dates. */
export function reportPeriod(s: Pick<Schedule, "frequency">, runAt: Date): { from: string; to: string } {
  const local = new Date(runAt.getTime() + IST_MINUTES * 60_000);
  const day = (y: number, m: number, d: number) => new Date(Date.UTC(y, m, d)).toISOString().slice(0, 10);
  const [y, m, d] = [local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()];
  if (s.frequency === "daily") return { from: day(y, m, d - 1), to: day(y, m, d - 1) };
  if (s.frequency === "monthly") return { from: day(y, m - 1, 1), to: day(y, m, 0) };
  const weekday = (local.getUTCDay() + 6) % 7; // Monday = 0
  return { from: day(y, m, d - weekday - 7), to: day(y, m, d - weekday - 1) };
}

/**
 * CSV for spreadsheets. Text that starts like a formula (=, +, @, or - when it isn't a number) is
 * prefixed with an apostrophe so a party name can't run as a formula when the file is opened.
 */
export function toCsv(rows: (string | number | null | undefined)[][]): string {
  const cell = (v: string | number | null | undefined) => {
    if (v === null || v === undefined) return "";
    let s = String(v);
    if (typeof v === "string" && (/^[=+@\t\r]/.test(s) || (s.startsWith("-") && !/^-\d+(\.\d+)?$/.test(s)))) s = `'${s}`;
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return rows.map((r) => r.map(cell).join(",")).join("\r\n") + "\r\n";
}

export const PERIOD_PRESETS = ["today", "yesterday", "this_month", "last_month", "this_quarter", "last_quarter", "this_fy", "last_fy"] as const;
export type PeriodPreset = (typeof PERIOD_PRESETS)[number];

/** Date range for a preset, in Indian financial-year terms (quarters Apr–Jun, Jul–Sep, Oct–Dec, Jan–Mar). */
export function presetPeriod(preset: PeriodPreset, today: string): { from: string; to: string } {
  const [y, m] = [Number(today.slice(0, 4)), Number(today.slice(5, 7)) - 1];
  const day = (yy: number, mm: number, dd: number) => new Date(Date.UTC(yy, mm, dd)).toISOString().slice(0, 10);
  const fyStart = m >= 3 ? y : y - 1;
  const qStartMonth = m - (((m - 3) % 3) + 3) % 3; // month index of the quarter's first month
  switch (preset) {
    case "today": return { from: today, to: today };
    case "yesterday": { const d = day(y, m, Number(today.slice(8)) - 1); return { from: d, to: d }; }
    case "this_month": return { from: day(y, m, 1), to: today };
    case "last_month": return { from: day(y, m - 1, 1), to: day(y, m, 0) };
    case "this_quarter": return { from: day(y, qStartMonth, 1), to: today };
    case "last_quarter": return { from: day(y, qStartMonth - 3, 1), to: day(y, qStartMonth, 0) };
    case "this_fy": return { from: `${fyStart}-04-01`, to: today };
    case "last_fy": return { from: `${fyStart - 1}-04-01`, to: `${fyStart}-03-31` };
  }
}
