import { dec, money } from "./money.js";

/**
 * ABC classification of stock by what each item sold for over a period: the few items that make most of the sales are A, the middle band B and the long
 * tail C. A counts are checked most often, so the class says how often an item should be counted.
 */
export type AbcClass = "A" | "B" | "C";
export const COUNT_EVERY_DAYS: Record<AbcClass, number> = { A: 30, B: 90, C: 180 };

export interface AbcInput { id: string; value: string }
export interface AbcRow { id: string; value: string; sharePct: string; cumulativePct: string; class: AbcClass; countEveryDays: number }

/** Items sorted by value, with each one's share, the running share and its class (A up to 80% of the total, B up to 95%, C the rest). */
export function classifyAbc(items: AbcInput[], aLimit = 80, bLimit = 95): AbcRow[] {
  const sorted = [...items].filter((i) => dec(i.value).gt(0)).sort((a, b) => dec(b.value).comparedTo(a.value) || a.id.localeCompare(b.id));
  const total = sorted.reduce((t, i) => t.plus(i.value), dec(0));
  let run = dec(0);
  return sorted.map((i) => {
    const before = run;
    run = run.plus(i.value);
    // An item belongs to the class in which its share starts, so the one that crosses 80% is still an A.
    const startPct = total.isZero() ? dec(0) : before.div(total).times(100);
    const cls: AbcClass = startPct.lt(aLimit) ? "A" : startPct.lt(bLimit) ? "B" : "C";
    return { id: i.id, value: money(i.value), sharePct: money(dec(i.value).div(total).times(100)), cumulativePct: money(run.div(total).times(100)), class: cls, countEveryDays: COUNT_EVERY_DAYS[cls] };
  });
}
