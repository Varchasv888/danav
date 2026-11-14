import { dec, type Dec } from "./money.js";

/**
 * Reconciliation matching. Two lists of records, ours and theirs (a customer's statement against our ledger, a bank against the books), each with a
 * reference, a date and a signed amount in the same direction. Records are paired in passes, strictest first, so a loose match never steals a record
 * an exact one would have claimed:
 *   1. same reference and the same amount (within the tolerance)
 *   2. the same amount (within the tolerance) and a date within the window, nearest date first
 *   3. one record on one side against several on the other that add up to it (up to four)
 * A record is used once. Whatever is left is an exception for a person to look at.
 */
export interface ReconRecord { id: string; ref: string; date: string; amount: string }
export interface ReconRules { tolerance: string; dateWindowDays: number; maxGroup: number }
export interface ReconMatch { ours: string[]; theirs: string[]; rule: "reference" | "amount_date" | "one_to_many" | "many_to_one"; difference: string }

export const DEFAULT_RULES: ReconRules = { tolerance: "0.50", dateWindowDays: 7, maxGroup: 4 };

const norm = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, "").replace(/^0+/, "").replace(/([A-Z])0+(?=\d)/g, "$1");
const dayNo = (iso: string) => Date.parse(`${iso}T00:00:00Z`) / 86_400_000;

export function matchRecords(ours: ReconRecord[], theirs: ReconRecord[], rules: ReconRules = DEFAULT_RULES): { matches: ReconMatch[]; ours: ReconRecord[]; theirs: ReconRecord[] } {
  const tol = dec(rules.tolerance);
  let freeO = [...ours];
  let freeT = [...theirs];
  const matches: ReconMatch[] = [];
  const take = (o: ReconRecord[], t: ReconRecord[], rule: ReconMatch["rule"]) => {
    const diff = o.reduce((s, r) => s.plus(r.amount), dec(0)).minus(t.reduce((s, r) => s.plus(r.amount), dec(0)));
    matches.push({ ours: o.map((r) => r.id), theirs: t.map((r) => r.id), rule, difference: diff.toFixed(2) });
    const usedO = new Set(o.map((r) => r.id));
    const usedT = new Set(t.map((r) => r.id));
    freeO = freeO.filter((r) => !usedO.has(r.id));
    freeT = freeT.filter((r) => !usedT.has(r.id));
  };
  const close = (a: Dec, b: Dec) => a.minus(b).abs().lte(tol);

  // 1. Same reference, same amount.
  for (const t of [...freeT]) {
    const key = norm(t.ref);
    if (!key) continue;
    const hit = freeO.find((o) => norm(o.ref) === key && close(dec(o.amount), dec(t.amount)));
    if (hit) take([hit], [t], "reference");
  }
  // 2. Same amount, nearby date, nearest first.
  for (const t of [...freeT]) {
    const cands = freeO.filter((o) => close(dec(o.amount), dec(t.amount)) && Math.abs(dayNo(o.date) - dayNo(t.date)) <= rules.dateWindowDays)
      .sort((a, b) => Math.abs(dayNo(a.date) - dayNo(t.date)) - Math.abs(dayNo(b.date) - dayNo(t.date)));
    if (cands[0]) take([cands[0]], [t], "amount_date");
  }
  // 3. One against several.
  const subset = (pool: ReconRecord[], target: Dec): ReconRecord[] | null => {
    const items = pool.slice(0, 14);
    const walk = (start: number, chosen: ReconRecord[], sum: Dec): ReconRecord[] | null => {
      if (chosen.length >= 2 && close(sum, target)) return chosen;
      if (chosen.length >= rules.maxGroup) return null;
      for (let i = start; i < items.length; i++) {
        const found = walk(i + 1, [...chosen, items[i]!], sum.plus(items[i]!.amount));
        if (found) return found;
      }
      return null;
    };
    return walk(0, [], dec(0));
  };
  for (const t of [...freeT]) {
    const within = freeO.filter((o) => Math.abs(dayNo(o.date) - dayNo(t.date)) <= rules.dateWindowDays * 4);
    const group = subset(within, dec(t.amount));
    if (group) take(group, [t], "one_to_many");
  }
  for (const o of [...freeO]) {
    const within = freeT.filter((t) => Math.abs(dayNo(o.date) - dayNo(t.date)) <= rules.dateWindowDays * 4);
    const group = subset(within, dec(o.amount));
    if (group) take([o], group, "many_to_one");
  }
  return { matches, ours: freeO, theirs: freeT };
}
