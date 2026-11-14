/** Pure helpers behind the money and date fields: what the person types in, and what is kept and shown. */

/** Keeps the digits, one decimal point and (when allowed) a leading minus; drops the rupee sign, commas and spaces, so a pasted "₹ 12,500.00" becomes "12500.00". */
export function cleanAmount(input: string, o: { decimals?: number; negative?: boolean } = {}): string {
  const decimals = o.decimals ?? 2;
  const trimmed = input.replace(/[₹\s,]/g, "").replace(/^rs\.?/i, "");
  const neg = !!o.negative && trimmed.startsWith("-");
  const digits = trimmed.replace(/[^0-9.]/g, "");
  const [whole = "", ...rest] = digits.split(".");
  const hasDot = digits.includes(".") && decimals > 0;
  const int = whole.replace(/^0+(?=\d)/, "");
  return `${neg ? "-" : ""}${int}${hasDot ? `.${rest.join("").slice(0, decimals)}` : ""}`;
}

/** Indian digit grouping for an amount being typed: 1234567.5 shows as 12,34,567.5, and a trailing point is kept so typing can go on. */
export function groupTyping(clean: string): string {
  const neg = clean.startsWith("-");
  const [whole = "", frac] = (neg ? clean.slice(1) : clean).split(".");
  const last3 = whole.slice(-3);
  const head = whole.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  const grouped = head ? `${head},${last3}` : last3;
  return `${neg ? "-" : ""}${grouped || (frac !== undefined ? "0" : "")}${frac !== undefined ? `.${frac}` : ""}`;
}

/** The amount as kept when the person leaves the box: the full number of decimals ("12500" becomes "12500.00"), or nothing if there is no number. */
export function finishAmount(clean: string, decimals = 2): string {
  if (clean === "" || clean === "-" || clean === ".") return "";
  const n = Number(clean);
  return Number.isFinite(n) ? n.toFixed(decimals) : "";
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const pad = (n: number) => String(n).padStart(2, "0");
export const toIso = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;

function valid(y: number, m: number, d: number): string | null {
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d ? toIso(y, m, d) : null;
}
const addDays = (iso: string, n: number) => {
  const [y, m, d] = iso.split("-").map(Number) as [number, number, number];
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return toIso(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate());
};

/**
 * Reads a date typed the way a counter clerk types it, as an ISO date (2026-11-11), or null if it is not a date. `today` is the working date.
 * Accepted: t (today), y (yesterday), e (end of this month), +3 or -3 (days from today), 11 (that day of this month), 1111 or 11/11 or 11-11 (day and month),
 * 111126 or 11/11/26 (two digit year), 11112026 or 11/11/2026 and 11 nov or 11 nov 2026.
 */
export function parseDateText(text: string, today: string): string | null {
  const s = text.trim().toLowerCase();
  if (!s) return null;
  const [ty, tm] = today.split("-").map(Number) as [number, number];
  if (s === "t") return today;
  if (s === "y") return addDays(today, -1);
  if (s === "e") return toIso(ty, tm, new Date(Date.UTC(ty, tm, 0)).getUTCDate());
  const off = s.match(/^([+-])(\d{1,3})$/);
  if (off) return addDays(today, (off[1] === "-" ? -1 : 1) * Number(off[2]));
  const year = (v: string) => (v.length === 2 ? 2000 + Number(v) : Number(v));
  const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (iso) return valid(Number(iso[1]), Number(iso[2]), Number(iso[3]));
  const named = s.match(/^(\d{1,2})[\s/.-]*([a-z]{3,9})[\s/.,-]*(\d{2}|\d{4})?$/);
  if (named) {
    const m = MONTHS.indexOf(named[2]!.slice(0, 3)) + 1;
    return m ? valid(named[3] ? year(named[3]) : ty, m, Number(named[1])) : null;
  }
  const parts = s.split(/[\s/.-]+/).filter(Boolean);
  if (parts.length >= 2 && parts.every((p) => /^\d+$/.test(p))) return valid(parts[2] ? year(parts[2]) : ty, Number(parts[1]), Number(parts[0]));
  const digits = s.match(/^\d+$/)?.[0];
  if (digits) {
    if (digits.length <= 2) return valid(ty, tm, Number(digits));
    if (digits.length === 4) return valid(ty, Number(digits.slice(2)), Number(digits.slice(0, 2)));
    if (digits.length === 6) return valid(year(digits.slice(4)), Number(digits.slice(2, 4)), Number(digits.slice(0, 2)));
    if (digits.length === 8) return valid(Number(digits.slice(4)), Number(digits.slice(2, 4)), Number(digits.slice(0, 2)));
  }
  return null;
}

/** An ISO date as shown in a field: 11 Nov 2026. */
export function formatDateText(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return iso;
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]!.replace(/^./, (c) => c.toUpperCase())} ${m[1]}`;
}

/** Whole days in a month, and the weekday (0 = Sunday) of its first day, for the calendar grid. */
export const monthGrid = (y: number, m: number) => ({ days: new Date(Date.UTC(y, m, 0)).getUTCDate(), first: new Date(Date.UTC(y, m - 1, 1)).getUTCDay() });

/** True for an empty-looking number: 0, 0.00, 00, "₹ 0" and the like (but not an empty box). */
export function isZeroAmount(text: string): boolean {
  const s = text.replace(/[₹\s,]/g, "").replace(/^rs\.?/i, "");
  return /\d/.test(s) && /^[-+]?[0.]*$/.test(s) && Number(s.replace(/^[-+]/, "") || "0") === 0;
}

/** What a number box does when it is entered: a zero empties it so typing starts straight away, any other value is selected so typing replaces it. */
export function numberOnFocus(text: string): { text: string; select: boolean } {
  return isZeroAmount(text) ? { text: "", select: false } : { text, select: true };
}

/** What a number box does when it is left: an empty required box goes back to zero in its format (0.00 for money), an empty optional one stays empty, anything else is kept. */
export function numberOnBlur(text: string, o: { required?: boolean; decimals?: number } = {}): string {
  if (text.trim() !== "") return text;
  return o.required ? (0).toFixed(o.decimals ?? 0) : "";
}
