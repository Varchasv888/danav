import { D, dec, money, round2, type Dec, type DecimalInput } from "./money.js";
import { isGstSlab, slabRate, slabRateInclusive } from "./slab.js";

/**
 * Point-of-sale bill for a walk-in (B2C, same state) sale. Shop prices (MRP) usually include GST,
 * so the tax is taken out of the price and the customer pays exactly the printed price; exclusive
 * pricing adds tax on top. A bill discount (or loyalty points redeemed) is a price reduction, spread
 * over the lines by value before tax.
 */
export interface PosLineInput {
  qty: DecimalInput; price: DecimalInput; gstRate: DecimalInput; cessRate?: DecimalInput; discount?: DecimalInput;
  /** Price-based GST (apparel, footwear): the rate is picked per piece after discounts. */
  gstSlab?: string | null | undefined;
  slabPieces?: number | null | undefined;
}
export interface PosOptions {
  inclusive: boolean;
  /** Bill date (YYYY-MM-DD), for price-based GST rules. Defaults to the rule in force now. */
  date?: string;
  billDiscount?: DecimalInput;
  roundOff?: boolean;
}

const r2 = (v: Dec) => v.toDecimalPlaces(2, D.ROUND_HALF_UP);

/** The line's rate: its own, or the slab rate for its price per piece after every discount. */
function slabbed(l: PosLineInput, amount: Dec, o: PosOptions): DecimalInput {
  if (!isGstSlab(l.gstSlab) || dec(l.qty).isZero()) return l.gstRate;
  const perPiece = amount.div(l.qty).div(Math.max(1, l.slabPieces ?? 1));
  const date = o.date ?? "9999-12-31";
  return o.inclusive ? slabRateInclusive(l.gstSlab, date, perPiece) : slabRate(l.gstSlab, date, perPiece);
}

export function posBill(lines: PosLineInput[], o: PosOptions) {
  if (!lines.length) throw new Error("no_lines");
  const amounts = lines.map((l) => {
    const a = dec(l.qty).times(l.price).minus(l.discount ?? 0);
    if (a.lt(0)) throw new Error("discount_exceeds_amount");
    return r2(a);
  });
  const before = amounts.reduce((s, a) => s.plus(a), dec(0));
  const billDiscount = r2(dec(o.billDiscount ?? 0));
  if (billDiscount.gt(before)) throw new Error("discount_exceeds_amount");
  // Spread the bill discount by value; the last line takes the rounding difference.
  let left = billDiscount;
  const shares = amounts.map((a, i) => {
    const share = i === amounts.length - 1 ? left : before.isZero() ? dec(0) : r2(billDiscount.times(a).div(before));
    left = left.minus(share);
    return share;
  });
  const out = lines.map((l, i) => {
    const amount = amounts[i]!.minus(shares[i]!);
    const rate = dec(slabbed(l, amount, o));
    const cessRate = dec(l.cessRate ?? 0);
    let taxable: Dec;
    if (o.inclusive) {
      const base = r2(amount.times(100).div(dec(100).plus(rate).plus(cessRate)));
      const half = r2(base.times(rate).div(200));
      const cess = r2(base.times(cessRate).div(100));
      taxable = amount.minus(half.times(2)).minus(cess); // the customer pays exactly the price
      return { qty: dec(l.qty).toString(), price: money(l.price), gstRate: rate.toString(), discount: money(dec(l.discount ?? 0).plus(shares[i]!)), taxable: money(taxable), cgst: money(half), sgst: money(half), cess: money(cess), total: money(amount) };
    }
    taxable = amount;
    const half = r2(taxable.times(rate).div(200));
    const cess = r2(taxable.times(cessRate).div(100));
    return { qty: dec(l.qty).toString(), price: money(l.price), gstRate: rate.toString(), discount: money(dec(l.discount ?? 0).plus(shares[i]!)), taxable: money(taxable), cgst: money(half), sgst: money(half), cess: money(cess), total: money(taxable.plus(half.times(2)).plus(cess)) };
  });
  const sum = (k: "taxable" | "cgst" | "sgst" | "cess" | "total") => out.reduce((s, l) => s.plus(l[k]), dec(0));
  const exact = sum("total");
  const total = o.roundOff === false ? exact : exact.toDecimalPlaces(0, D.ROUND_HALF_UP);
  // Tax by rate, as the bill and GSTR-1 (B2CS) show it.
  const byRate = new Map<string, { taxable: Dec; cgst: Dec; sgst: Dec; cess: Dec }>();
  const addRate = (rate: string, t: DecimalInput, c: DecimalInput, s: DecimalInput, x: DecimalInput) => {
    const cur = byRate.get(rate) ?? { taxable: dec(0), cgst: dec(0), sgst: dec(0), cess: dec(0) };
    byRate.set(rate, { taxable: cur.taxable.plus(t), cgst: cur.cgst.plus(c), sgst: cur.sgst.plus(s), cess: cur.cess.plus(x) });
  };
  for (const l of out) addRate(l.gstRate, l.taxable, l.cgst, l.sgst, l.cess);
  return {
    lines: out, discount: money(billDiscount),
    taxable: money(sum("taxable")), cgst: money(sum("cgst")), sgst: money(sum("sgst")), cess: money(sum("cess")),
    roundOff: money(total.minus(exact)), total: money(total),
    taxByRate: [...byRate.entries()].sort((a, b) => Number(a[0]) - Number(b[0])).map(([rate, v]) => ({ rate, taxable: money(v.taxable), cgst: money(v.cgst), sgst: money(v.sgst), cess: money(v.cess) })),
  };
}

export type PayMode = "cash" | "upi" | "card" | "credit";
export interface PosPayment { mode: PayMode; amount: DecimalInput; reference?: string | undefined }

/**
 * Checks what the customer paid against the bill: UPI, card and credit can't exceed what's due (only
 * cash gets change); the bill must be fully paid. Returns the change to hand back.
 */
export function settlePayments(total: DecimalInput, payments: PosPayment[]) {
  let due = dec(total);
  let change = dec(0);
  const ordered = [...payments.filter((p) => p.mode !== "cash"), ...payments.filter((p) => p.mode === "cash")];
  for (const p of ordered) {
    const amt = dec(p.amount);
    if (!amt.gt(0)) throw new Error("invalid_payment");
    if (p.mode !== "cash" && amt.gt(due)) throw new Error("overpaid_non_cash");
    if (amt.gt(due)) { change = change.plus(amt.minus(due)); due = dec(0); } else due = due.minus(amt);
  }
  if (due.gt(0)) throw new Error("underpaid");
  const byMode = (m: PayMode) => money(payments.filter((p) => p.mode === m).reduce((s, p) => s.plus(p.amount), dec(0)));
  return { change: money(change), cash: money(dec(byMode("cash")).minus(change)), upi: byMode("upi"), card: byMode("card"), credit: byMode("credit") };
}

export interface LoyaltyRule {
  pointsPer100: number; pointValue: DecimalInput; maxRedeemPct: DecimalInput;
  /** Richer bills earn more: the highest slab whose `from` the amount reaches sets points per 100 (instead of the base rate). */
  slabs?: { from: DecimalInput; per100: number }[] | null | undefined;
  /** Fewest points that can be redeemed on one bill; a smaller balance cannot be used. */
  minRedeem?: number | null | undefined;
}

/** Points earned on a bill: whole hundreds of the amount paid × the rate. */
export function loyaltyEarned(paid: DecimalInput, rule: LoyaltyRule) {
  let per100 = rule.pointsPer100;
  let reached = dec(-1);
  for (const s of rule.slabs ?? []) {
    const from = dec(s.from);
    if (dec(paid).gte(from) && from.gt(reached)) { per100 = s.per100; reached = from; }
  }
  return dec(paid).div(100).toDecimalPlaces(0, D.ROUND_DOWN).times(per100).toNumber();
}

export interface EarnLine { amount: DecimalInput; discounted: boolean; brand?: string | null | undefined; category?: string | null | undefined }
export interface EarnExclusions {
  /** No points at all on a bill that carried any discount. */
  discountedBills?: boolean | undefined;
  /** No points on lines sold under an offer or a discount. */
  discountedItems?: boolean | undefined;
  brands?: string[] | null | undefined;
  categories?: string[] | null | undefined;
}

/**
 * The share of a bill's payment that earns points once excluded lines are left out: 1 when nothing is excluded, 0 when everything is.
 * Brands and categories match without regard to case. A line's amount is what the customer pays for it before the bill discount.
 */
export function loyaltyEarningShare(lines: EarnLine[], rules: EarnExclusions): Dec {
  const total = lines.reduce((t, l) => t.plus(l.amount), dec(0));
  if (total.lte(0)) return dec(0);
  if (rules.discountedBills && lines.some((l) => l.discounted)) return dec(0);
  const brands = new Set((rules.brands ?? []).map((b) => b.trim().toLowerCase()).filter(Boolean));
  const cats = new Set((rules.categories ?? []).map((b) => b.trim().toLowerCase()).filter(Boolean));
  const eligible = lines.reduce((t, l) => {
    const out = (rules.discountedItems && l.discounted) || (l.brand && brands.has(l.brand.toLowerCase())) || (l.category && cats.has(l.category.toLowerCase()));
    return out ? t : t.plus(l.amount);
  }, dec(0));
  return eligible.div(total);
}

/** Points that can be redeemed on a bill (capped by balance and a share of the bill) and their value. */
export function loyaltyRedeemable(balance: number, billAmount: DecimalInput, rule: LoyaltyRule) {
  const value = dec(rule.pointValue);
  if (!value.gt(0) || balance <= 0 || balance < (rule.minRedeem ?? 0)) return { points: 0, value: "0.00" };
  const cap = dec(billAmount).times(rule.maxRedeemPct).div(100);
  const points = Math.min(balance, cap.div(value).toDecimalPlaces(0, D.ROUND_DOWN).toNumber());
  return { points, value: money(value.times(points)) };
}

export interface CouponRule { kind: "percent" | "amount"; value: DecimalInput; maxDiscount?: DecimalInput | null | undefined; minBill?: DecimalInput | null | undefined }

/**
 * Discount card and coupon on a bill (online counters only): the card's percent of the bill first, then
 * the coupon on what is left (a percent up to its cap, or a fixed amount). The coupon's minimum is
 * checked against the bill before either. Both are price reductions, like a bill discount.
 */
export function promoDiscounts(bill: DecimalInput, card?: { pct: DecimalInput } | null, coupon?: CouponRule | null) {
  const base = dec(bill);
  if (coupon?.minBill && base.lt(coupon.minBill)) throw new Error("coupon_min_bill");
  const cardOff = card ? round2(base.times(card.pct).div(100)) : dec(0);
  const left = base.minus(cardOff);
  let couponOff = dec(0);
  if (coupon) {
    couponOff = coupon.kind === "percent" ? round2(left.times(coupon.value).div(100)) : round2(coupon.value);
    if (coupon.maxDiscount && couponOff.gt(coupon.maxDiscount)) couponOff = round2(coupon.maxDiscount);
    if (couponOff.gt(left)) couponOff = left;
  }
  return { card: money(cardOff), coupon: money(couponOff) };
}

/** A bill line as charged, for working out what part of it is worth when it comes back. */
export interface ChargedLine { qty: DecimalInput; taxable: DecimalInput; cgst: DecimalInput; sgst: DecimalInput; cess: DecimalInput }

/**
 * Goods back against a bill: each line's share of what it was charged (its discounts and the bill's
 * spread into it), and the refund to the nearest rupee. The counter screen and the server use this one
 * rule, so an exchange shows the same credit the server gives.
 */
export function returnCredit(lines: { line: ChargedLine; qty: DecimalInput }[]) {
  const parts = lines.map(({ line, qty }) => {
    const share = dec(qty).div(line.qty);
    const part = (v: DecimalInput) => money(dec(v).times(share));
    const taxable = part(line.taxable), cgst = part(line.cgst), sgst = part(line.sgst), cess = part(line.cess);
    return { taxable, cgst, sgst, cess, total: money(dec(taxable).plus(cgst).plus(sgst).plus(cess)) };
  });
  const sum = (k: "taxable" | "cgst" | "sgst" | "cess" | "total") => parts.reduce((s, p) => s.plus(p[k]), dec(0));
  const total = sum("total");
  const refund = total.toDecimalPlaces(0);
  return {
    parts, taxable: money(sum("taxable")), cgst: money(sum("cgst")), sgst: money(sum("sgst")), cess: money(sum("cess")),
    refund: money(refund), roundOff: money(refund.minus(total)),
  };
}
