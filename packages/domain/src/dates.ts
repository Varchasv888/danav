/**
 * The business date: today in India (Asia/Kolkata, UTC+5:30, no daylight saving). Servers run in UTC,
 * so a bill rung up at 1 am in a shop must not get yesterday's date.
 */
export const businessDate = (now: Date = new Date()): string => new Date(now.getTime() + 330 * 60_000).toISOString().slice(0, 10);

/** The time of day in India as HH:MM, for offers that run between certain hours. */
export const businessTime = (now: Date = new Date()): string => new Date(now.getTime() + 330 * 60_000).toISOString().slice(11, 16);
