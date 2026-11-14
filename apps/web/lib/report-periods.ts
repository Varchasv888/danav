import { fyStart } from "./format";

/** The period choices every report offers beside its date range. */
export const PERIODS = ["today", "yesterday", "thisWeek", "thisMonth", "lastMonth", "thisQuarter", "thisYear", "lastYear", "custom"] as const;
export type Period = (typeof PERIODS)[number];

const day = (iso: string, delta: number) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
};
const monthEnd = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10);
const ym = (y: number, m: number, d = 1) => `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

/** The dates a period stands for as of a day. Weeks start on Monday; years are the Indian financial year (April to March). */
export function periodRange(period: Period, today: string): { from: string; to: string } | null {
  const y = Number(today.slice(0, 4)), m = Number(today.slice(5, 7));
  switch (period) {
    case "today": return { from: today, to: today };
    case "yesterday": return { from: day(today, -1), to: day(today, -1) };
    case "thisWeek": {
      const dow = (new Date(`${today}T00:00:00Z`).getUTCDay() + 6) % 7; // Monday is 0
      return { from: day(today, -dow), to: day(today, 6 - dow) };
    }
    case "thisMonth": return { from: ym(y, m), to: monthEnd(y, m) };
    case "lastMonth": { const py = m === 1 ? y - 1 : y, pm = m === 1 ? 12 : m - 1; return { from: ym(py, pm), to: monthEnd(py, pm) }; }
    case "thisQuarter": {
      // Quarters of the financial year: Apr-Jun, Jul-Sep, Oct-Dec, Jan-Mar.
      const start = fyStart(today), sy = Number(start.slice(0, 4));
      const idx = Math.floor((((m - 4) % 12) + 12) % 12 / 3);
      const sm = ((3 + idx * 3) % 12) + 1, syear = sm >= 4 ? sy : sy + 1;
      const em = ((sm + 1) % 12) + 1, eyear = em >= sm ? syear : syear + 1;
      return { from: ym(syear, sm), to: monthEnd(eyear, em) };
    }
    case "thisYear": { const s = Number(fyStart(today).slice(0, 4)); return { from: `${s}-04-01`, to: `${s + 1}-03-31` }; }
    case "lastYear": { const s = Number(fyStart(today).slice(0, 4)) - 1; return { from: `${s}-04-01`, to: `${s + 1}-03-31` }; }
    default: return null;
  }
}

/** Which preset a range matches, or custom when none does. */
export function periodOf(from: string, to: string, today: string): Period {
  for (const p of PERIODS) {
    const r = periodRange(p, today);
    if (r && r.from === from && r.to === to) return p;
  }
  return "custom";
}
