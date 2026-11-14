import { dec, money, type DecimalInput } from "./money.js";

/**
 * Ordered, received and billed, line by line. A purchase order line is checked against the goods receipts and the supplier
 * bills raised on it: how much arrived, how much was billed, whether the billed rate is the ordered rate, and what came short,
 * damaged or went on hold. Pure; the API reads the figures and this decides what to flag.
 */
export type MatchFlag = "billed_more_than_received" | "received_not_billed" | "rate_differs" | "short_supply" | "damaged" | "on_hold" | "not_yet_received";

export interface MatchLine {
  ordered: DecimalInput; received: DecimalInput; billed: DecimalInput;
  orderRate: DecimalInput;
  /** Quantity-weighted rate of the posted bills on this line; null when nothing is billed. */
  billedRate: DecimalInput | null;
  short: DecimalInput; damaged: DecimalInput; hold: DecimalInput;
  /** The order is closed or fully received, so what has not arrived will not arrive. */
  orderDone: boolean;
}

export interface MatchResult {
  flags: MatchFlag[];
  status: "matched" | "open" | "exception";
  /** Billed rate less ordered rate, per unit; "0.00" when there is nothing to compare. */
  rateDifference: string;
  /** What the rate difference costs on the billed quantity (positive: billed above the order). */
  rateCost: string;
  /** Billed quantity above what was received. */
  excessBilled: string;
}

const EPS = "0.0001";

export function matchLine(l: MatchLine): MatchResult {
  const ordered = dec(l.ordered), received = dec(l.received), billed = dec(l.billed);
  const flags: MatchFlag[] = [];
  const excess = billed.minus(received);
  if (excess.gt(EPS)) flags.push("billed_more_than_received");
  if (received.minus(billed).gt(EPS)) flags.push("received_not_billed");
  const diff = l.billedRate === null ? dec(0) : dec(l.billedRate).minus(l.orderRate);
  if (l.billedRate !== null && diff.abs().gt("0.005")) flags.push("rate_differs");
  if (dec(l.short).gt(0) || (l.orderDone && ordered.minus(received).gt(EPS))) flags.push("short_supply");
  if (dec(l.damaged).gt(0)) flags.push("damaged");
  if (dec(l.hold).gt(0)) flags.push("on_hold");
  if (!l.orderDone && ordered.minus(received).gt(EPS)) flags.push("not_yet_received");
  const exception = flags.some((f) => ["billed_more_than_received", "rate_differs", "short_supply", "damaged", "on_hold"].includes(f));
  const open = flags.some((f) => f === "received_not_billed" || f === "not_yet_received");
  return {
    flags, status: exception ? "exception" : open ? "open" : "matched",
    rateDifference: money(diff), rateCost: money(diff.times(billed)), excessBilled: money(excess.gt(0) ? excess : 0),
  };
}

/** The status of a whole order: the worst of its lines. */
export function matchOrder(lines: MatchResult[]): "matched" | "open" | "exception" {
  if (lines.some((x) => x.status === "exception")) return "exception";
  if (lines.some((x) => x.status === "open")) return "open";
  return "matched";
}
