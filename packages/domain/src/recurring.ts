/**
 * Recurring entries: rent, loan instalments, subscriptions and the like. A template runs on a day of the month, every
 * month, quarter or year. These helpers say which dates are due; the API posts one voucher for each.
 */
export type RecurringFrequency = "monthly" | "quarterly" | "yearly";
const STEP: Record<RecurringFrequency, number> = { monthly: 1, quarterly: 3, yearly: 12 };

const pad = (n: number) => String(n).padStart(2, "0");
const lastDay = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();

/** The date on `day` of the month `monthsAhead` months after `from`'s month, with a day past the month's end clamped to its last day. */
function onDay(from: string, monthsAhead: number, day: number) {
  const total = Number(from.slice(0, 4)) * 12 + (Number(from.slice(5, 7)) - 1) + monthsAhead;
  const y = Math.floor(total / 12), m = (total % 12) + 1;
  return `${y}-${pad(m)}-${pad(Math.min(day, lastDay(y, m)))}`;
}

/** The first run on or after `start` that falls on `day` of the month. */
export function firstRecurringDate(start: string, day: number): string {
  const same = onDay(start, 0, day);
  return same >= start ? same : onDay(start, 1, day);
}

/** The run after `current`. */
export function nextRecurringDate(current: string, frequency: RecurringFrequency, day: number): string {
  return onDay(current, STEP[frequency], day);
}

/**
 * Every run due on or before `today`, oldest first, from the template's next date, stopping at its end date. A template
 * left unrun for a long time catches up, but never more than `cap` runs at once.
 */
export function dueRecurringDates(nextOn: string, endsOn: string | null, today: string, frequency: RecurringFrequency, day: number, cap = 12): string[] {
  const out: string[] = [];
  let d = nextOn;
  while (d <= today && (!endsOn || d <= endsOn) && out.length < cap) { out.push(d); d = nextRecurringDate(d, frequency, day); }
  return out;
}
