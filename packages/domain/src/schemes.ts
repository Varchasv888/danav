import { dec, money, round2, type Dec } from "./money.js";

/**
 * Store schemes (offers) applied at billing. The server works out which items a scheme covers (by
 * item, style, brand or category) before calling this, so here a scheme only lists item ids
 * (`null` covers every item). The same rules run on the offline counter (Dart port, spec/fixtures/schemes.json).
 *
 * - percent: pct off every covered line, once the covered value reaches minValue.
 * - amount_off: a fixed amount off the covered value once it reaches minValue, spread by value.
 * - qty_slab / value_slab: the highest slab reached by covered pieces (or value) sets the pct off.
 * - buy_get: pieces sorted dearest first, in groups of buy + get; the get cheapest of each group
 *   are pct off (100 = free).
 * - combo: a fixed price for a set of items (a hamper); as many sets as the bill holds.
 *
 * A line with its own discount takes no scheme, and a combo takes the whole of each line it draws from.
 * Each line gets at most one scheme; each scheme takes every free line it covers. Schemes are tried in
 * every order (up to six that touch the bill) and the order that saves the customer most wins; with
 * more, the biggest discount on the lines still free goes first. Free pieces and combos count only
 * whole pieces (not loose goods sold by weight).
 */
export type SchemeKind = "percent" | "amount_off" | "qty_slab" | "value_slab" | "buy_get" | "combo";
export const SCHEME_KINDS = ["percent", "amount_off", "qty_slab", "value_slab", "buy_get", "combo"] as const;

export interface Scheme {
  id: string;
  name: string;
  kind: SchemeKind;
  startsOn?: string | null;
  endsOn?: string | null;
  /** Days of the week it runs on, 0 Sunday to 6 Saturday; none or null means every day. */
  weekdays?: number[] | null;
  /** Hours it runs between, "HH:MM" (from inclusive, to exclusive; from later than to runs overnight). Both or neither. */
  fromTime?: string | null;
  toTime?: string | null;
  /** Manual order: schemes with a priority go first, lowest number first, then the rest in whatever order saves the customer most. */
  priority?: number | null;
  /** Branches it runs at, for the screen to filter by; the offer maths ignores it. */
  branchIds?: string[] | null;
  itemIds: string[] | null;
  /** Counter flags, read by the till and the server before the maths; the offer maths ignores them. */
  confirmBeforeApply?: boolean | undefined;
  allowWithGiftVouchers?: boolean | undefined;
  allowWithCustomerDiscount?: boolean | undefined;
  allowReturns?: boolean | undefined;
  /** Also applies to lines that already carry a discount of their own, on what is left after it. Off: such lines take no offer. */
  applyOnDiscounted?: boolean | undefined;
  /** Its thresholds, amount and combo price are stated with tax in them: with tax-exclusive prices, line values are grossed up by their tax rate to compare. */
  inclusiveOfTax?: boolean | undefined;
  /** What the salesman's commission is worked on for lines this offer touched: the price paid (default), the price before the offer, or nothing. Read by the bill and the commission report; the offer maths ignores it. */
  commissionBasis?: "net" | "list" | "none" | undefined;
  pct?: string | null;
  amount?: string | null;
  minValue?: string | null;
  buy?: number | null;
  get?: number | null;
  slabs?: { from: string; pct: string }[] | null;
  comboPrice?: string | null;
  comboItems?: { itemId: string; qty: number }[] | null;
}

export interface SchemeLine { itemId: string; qty: string; price: string; discount?: string | undefined; /** GST % on the line, for offers stated with tax in them. */ taxRate?: string | undefined }

/** How the bill's prices are stated: with the tax in them or without. */
export interface SchemeContext { pricesIncludeTax?: boolean | undefined }

export interface SchemeResult {
  /** Discount on each line, in the order given ("0.00" for none). */
  discounts: string[];
  applied: { schemeId: string; name: string; discount: string }[];
  /** What each offer took off each line, in the order given, so the bill can tell which offer touched which line. */
  byLine: { schemeId: string; discount: string }[][];
}

interface Candidate { total: Dec; perLine: Map<number, Dec>; uses: number[] }

const weekdayOf = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay();

/**
 * Is the scheme running on this date, and at this time of day? Dates, days of the week and hours must all allow it. A scheme with hours
 * needs the time of the bill: with no time given it is not applied, rather than guessed at.
 */
export const schemeActive = (s: Pick<Scheme, "startsOn" | "endsOn" | "weekdays" | "fromTime" | "toTime">, date: string, time?: string) => {
  if ((s.startsOn && s.startsOn > date) || (s.endsOn && date > s.endsOn)) return false;
  if (s.weekdays?.length && !s.weekdays.includes(weekdayOf(date))) return false;
  if (s.fromTime && s.toTime) {
    if (!time) return false;
    return s.fromTime <= s.toTime ? time >= s.fromTime && time < s.toTime : time >= s.fromTime || time < s.toTime;
  }
  return true;
};

/** Splits an amount over lines in proportion to their value; the last line takes what rounding leaves. */
function spread(total: Dec, idx: number[], value: (i: number) => Dec): Map<number, Dec> {
  const out = new Map<number, Dec>();
  const all = idx.reduce((s, i) => s.plus(value(i)), dec(0));
  let left = round2(total);
  idx.forEach((i, k) => {
    const share = k === idx.length - 1 ? left : round2(round2(total).times(value(i)).div(all));
    out.set(i, share);
    left = left.minus(share);
  });
  return out;
}

const whole = (qty: string) => dec(qty).isInteger();

function evaluate(s: Scheme, lines: SchemeLine[], all: number[], ctx: SchemeContext): Candidate | null {
  // Lines with a discount of their own join only if the offer says so; they are then worked on what is left after it.
  const free = all.filter((i) => s.applyOnDiscounted || dec(lines[i]!.discount ?? 0).isZero());
  const unit = (i: number) => dec(lines[i]!.price).minus(dec(lines[i]!.qty).gt(0) ? dec(lines[i]!.discount ?? 0).div(lines[i]!.qty) : 0);
  const value = (i: number) => dec(lines[i]!.qty).times(lines[i]!.price).minus(lines[i]!.discount ?? 0);
  // Tax-inclusive offers on tax-exclusive prices: compare in tax-inclusive terms, then bring the discount back to the price unit.
  const gross = (i: number) => (s.inclusiveOfTax && !ctx.pricesIncludeTax ? dec(1).plus(dec(lines[i]!.taxRate ?? 0).div(100)) : dec(1));
  if (s.kind === "combo") {
    const parts = s.comboItems ?? [];
    if (!parts.length || !s.comboPrice) return null;
    // Sets the bill holds: the scarcest part decides.
    let sets = Infinity;
    for (const p of parts) {
      const have = free.filter((i) => lines[i]!.itemId === p.itemId && whole(lines[i]!.qty)).reduce((n, i) => n + Math.floor(Number(lines[i]!.qty)), 0);
      sets = Math.min(sets, Math.floor(have / p.qty));
    }
    if (!sets || !Number.isFinite(sets)) return null;
    // Take the pieces line by line; the set's list value against its combo price.
    const used = new Map<number, Dec>();
    for (const p of parts) {
      let need = p.qty * sets;
      for (const i of free) {
        if (!need) break;
        if (lines[i]!.itemId !== p.itemId || !whole(lines[i]!.qty)) continue;
        const take = Math.min(need, Math.floor(Number(lines[i]!.qty)) - (used.get(i)?.toNumber() ?? 0));
        if (take <= 0) continue;
        used.set(i, (used.get(i) ?? dec(0)).plus(take));
        need -= take;
      }
    }
    const idx = [...used.keys()].sort((a, b) => a - b);
    const usedValue = (i: number) => used.get(i)!.times(unit(i));
    const listValue = idx.reduce((t, i) => t.plus(usedValue(i)), dec(0));
    const listTerms = idx.reduce((t, i) => t.plus(usedValue(i).times(gross(i))), dec(0));
    const total = listTerms.gt(0) ? round2(listTerms.minus(dec(s.comboPrice).times(sets)).times(listValue).div(listTerms)) : dec(0);
    if (!total.gt(0)) return null;
    return { total, perLine: spread(total, idx, usedValue), uses: idx };
  }

  const idx = free.filter((i) => s.itemIds === null || s.itemIds.includes(lines[i]!.itemId));
  if (!idx.length) return null;
  const covered = idx.reduce((t, i) => t.plus(value(i)), dec(0));
  const coveredTerms = idx.reduce((t, i) => t.plus(value(i).times(gross(i))), dec(0));
  const byPct = (pct: Dec) => {
    const perLine = new Map(idx.map((i) => [i, round2(value(i).times(pct).div(100))]));
    return { total: [...perLine.values()].reduce((t, v) => t.plus(v), dec(0)), perLine, uses: idx };
  };
  switch (s.kind) {
    case "percent":
      if (s.minValue && coveredTerms.lt(s.minValue)) return null;
      return byPct(dec(s.pct ?? 0));
    case "amount_off": {
      if (s.minValue && coveredTerms.lt(s.minValue)) return null;
      const wanted = coveredTerms.gt(0) ? dec(s.amount ?? 0).times(covered).div(coveredTerms) : dec(0);
      const total = round2(wanted.gt(covered) ? covered : wanted);
      return { total, perLine: spread(total, idx, value), uses: idx };
    }
    case "qty_slab":
    case "value_slab": {
      const reached = s.kind === "qty_slab" ? idx.reduce((t, i) => t.plus(lines[i]!.qty), dec(0)) : coveredTerms;
      let pct = dec(0);
      for (const sl of [...(s.slabs ?? [])].sort((a, b) => dec(a.from).cmp(b.from))) if (reached.gte(sl.from)) pct = dec(sl.pct);
      return byPct(pct);
    }
    case "buy_get": {
      const buy = s.buy ?? 0, get = s.get ?? 0;
      if (buy < 1 || get < 1) return null;
      const pieces: { line: number; price: Dec }[] = [];
      for (const i of idx.filter((x) => whole(lines[x]!.qty))) for (let n = 0; n < Math.floor(Number(lines[i]!.qty)); n++) pieces.push({ line: i, price: unit(i) });
      pieces.sort((a, b) => b.price.cmp(a.price) || a.line - b.line);
      const size = buy + get;
      const raw = new Map<number, Dec>();
      for (let g = 0; g + size <= pieces.length; g += size) {
        for (const p of pieces.slice(g + buy, g + size)) raw.set(p.line, (raw.get(p.line) ?? dec(0)).plus(p.price.times(s.pct ?? 100).div(100)));
      }
      const perLine = new Map([...raw].map(([i, v]) => [i, round2(v)]));
      return { total: [...perLine.values()].reduce((t, v) => t.plus(v), dec(0)), perLine, uses: idx };
    }
  }
  return null;
}

interface Run { total: Dec; discounts: Dec[]; applied: SchemeResult["applied"]; byLine: SchemeResult["byLine"] }

/** Applies schemes in the given order, each to the free lines it covers. */
function run(lines: SchemeLine[], order: Scheme[], start: number[], ctx: SchemeContext): Run {
  const discounts = lines.map(() => dec(0));
  const byLine: SchemeResult["byLine"] = lines.map(() => []);
  const applied: SchemeResult["applied"] = [];
  let free = start;
  let total = dec(0);
  for (const s of order) {
    const c = evaluate(s, lines, free, ctx);
    if (!c || !c.total.gt(0)) continue;
    for (const [i, v] of c.perLine) { discounts[i] = discounts[i]!.plus(v); if (v.gt(0)) byLine[i]!.push({ schemeId: s.id, discount: money(v) }); }
    applied.push({ schemeId: s.id, name: s.name, discount: money(c.total) });
    total = total.plus(c.total);
    free = free.filter((i) => !c.uses.includes(i));
  }
  return { total, discounts, applied, byLine };
}

export function applySchemes(lines: SchemeLine[], schemes: Scheme[], date: string, time?: string, ctx: SchemeContext = {}): SchemeResult {
  const start = lines.map((_, i) => i).filter((i) => dec(lines[i]!.qty).gt(0));
  const touching = schemes.filter((s) => schemeActive(s, date, time) && evaluate(s, lines, start, ctx));
  // Schemes the owner ranked go first, in that order (a tie keeps the order given); the others are tried in every order after them.
  const ranked = touching.filter((s) => s.priority != null).sort((a, b) => a.priority! - b.priority!);
  const unranked = touching.filter((s) => s.priority == null);
  let best: Run;
  if (touching.length <= 6) {
    best = run(lines, ranked, start, ctx);
    const permute = (chosen: Scheme[], rest: Scheme[]) => {
      if (!rest.length) {
        const r = run(lines, chosen, start, ctx);
        if (r.total.gt(best.total)) best = r;
        return;
      }
      rest.forEach((s, k) => permute([...chosen, s], [...rest.slice(0, k), ...rest.slice(k + 1)]));
    };
    permute(ranked, unranked);
  } else {
    // Many schemes: the biggest discount on the lines still free first.
    const order: Scheme[] = [...ranked];
    let free = start;
    for (const s of ranked) {
      const c = evaluate(s, lines, free, ctx);
      if (c && c.total.gt(0)) free = free.filter((i) => !c.uses.includes(i));
    }
    let left = unranked;
    for (;;) {
      let pick: { s: Scheme; c: Candidate } | null = null;
      for (const s of left) {
        const c = evaluate(s, lines, free, ctx);
        if (c && c.total.gt(0) && (!pick || c.total.gt(pick.c.total))) pick = { s, c };
      }
      if (!pick) break;
      order.push(pick.s);
      free = free.filter((i) => !pick!.c.uses.includes(i));
      left = left.filter((s) => s !== pick!.s);
    }
    best = run(lines, order, start, ctx);
  }
  return { discounts: best.discounts.map((d) => money(d)), applied: best.applied, byLine: best.byLine };
}

/**
 * The offers that may run on this bill given what else it carries: ones that need a yes only with the cashier's yes, ones not allowed
 * with gift vouchers or with a discount card or coupon left out when those are used.
 */
export function schemesAllowed(schemes: Scheme[], ctx: { giftVouchers: boolean; customerDiscount: boolean; confirmed: string[] }): Scheme[] {
  return schemes.filter((s) => (!s.confirmBeforeApply || ctx.confirmed.includes(s.id)) && !(ctx.giftVouchers && s.allowWithGiftVouchers === false) && !(ctx.customerDiscount && s.allowWithCustomerDiscount === false));
}
