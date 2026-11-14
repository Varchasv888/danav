import { dec, type DecimalInput } from "./money.js";

/**
 * Proof of delivery: who received the goods, when, and whether anything came short or damaged. A shortage or damage opens a claim
 * with an owner and a deadline; the claim is open until it is settled or waived. Pure rules; the API stores them.
 */
export const CLAIM_DAYS = 7;

export function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** The last day to raise the claim: a number of days after the goods were received. */
export const claimDeadline = (receivedOn: string, days = CLAIM_DAYS) => addDays(receivedOn, days);

export interface ProofLine { qty: DecimalInput; short: DecimalInput; damaged: DecimalInput }

/** Reasons a proof cannot be accepted (empty when fine). */
export function proofProblems(lines: ProofLine[]): string[] {
  const out = new Set<string>();
  for (const l of lines) {
    if (dec(l.short).lt(0) || dec(l.damaged).lt(0)) out.add("negative_quantity");
    if (dec(l.short).plus(l.damaged).gt(l.qty)) out.add("more_than_delivered");
  }
  return [...out];
}

export const hasDiscrepancy = (lines: ProofLine[]) => lines.some((l) => dec(l.short).gt(0) || dec(l.damaged).gt(0));

export type ClaimState = "none" | "open" | "due_soon" | "overdue" | "settled" | "waived";

/** Where a claim stands today. Due soon is the last two days before the deadline. */
export function claimState(p: { discrepancy: boolean; status: "open" | "settled" | "waived"; deadline: string | null; today: string }): ClaimState {
  if (!p.discrepancy) return "none";
  if (p.status !== "open") return p.status;
  if (!p.deadline) return "open";
  if (p.today > p.deadline) return "overdue";
  return p.today >= addDays(p.deadline, -2) ? "due_soon" : "open";
}

/** A challan with no proof after a few days is chased. */
export const awaitingProof = (challanDate: string, today: string, graceDays = 3) => today > addDays(challanDate, graceDays);
