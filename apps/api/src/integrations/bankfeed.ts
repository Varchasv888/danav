import { createHash, randomUUID } from "node:crypto";
import { dec, money } from "@varchasv/domain";

/**
 * Bank feed adapter. In India a business's bank transactions are shared through the RBI's Account
 * Aggregator framework: the business approves a consent in its AA app, and the FIU (us, through a
 * licensed provider such as Setu or Finvu) fetches the statement.
 *
 * `SimulatorFeed` stands in until a provider is signed up. Consent is approved at once, and the
 * "bank" reports what the books say went through the account — with the bank's own narrations,
 * cheques clearing two days later, and SMS charges at each month end — so reconciliation can be
 * tried end to end. A real provider plugs in by implementing `BankFeed`.
 */
export interface FeedTxn { txnId: string; date: string; description: string; reference: string | null; debit: string; credit: string }
export interface BookHint { date: string; direction: "in" | "out"; amount: string; party: string | null; reference: string | null; number: string }

export interface BankFeed {
  readonly name: string;
  createConsent(req: { bankName: string | null; accountLast4: string | null }): Promise<{ consentId: string; status: "pending" | "active" }>;
  consentStatus(consentId: string): Promise<"pending" | "active" | "revoked">;
  fetch(consentId: string, from: string, to: string, hints: BookHint[]): Promise<FeedTxn[]>;
  revoke(consentId: string): Promise<void>;
}

const addDays = (d: string, n: number) => new Date(Date.parse(`${d}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);
const monthEnds = (from: string, to: string) => {
  const out: string[] = [];
  let d = new Date(`${from.slice(0, 7)}-01T00:00:00Z`);
  while (d.toISOString().slice(0, 10) <= to) {
    const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).toISOString().slice(0, 10);
    if (end >= from && end <= to) out.push(end);
    d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1));
  }
  return out;
};

export class SimulatorFeed implements BankFeed {
  readonly name = "simulator";
  private revoked = new Set<string>();

  async createConsent() {
    return { consentId: `SIM-${randomUUID()}`, status: "active" as const };
  }
  async consentStatus(consentId: string) {
    return this.revoked.has(consentId) ? "revoked" as const : "active" as const;
  }
  async revoke(consentId: string) {
    this.revoked.add(consentId);
  }
  async fetch(consentId: string, from: string, to: string, hints: BookHint[]): Promise<FeedTxn[]> {
    if (this.revoked.has(consentId)) throw new Error("consent_revoked");
    const id = (...parts: string[]) => createHash("sha256").update([consentId, ...parts].join("|")).digest("hex").slice(0, 16);
    const out: FeedTxn[] = [];
    hints.forEach((h, i) => {
      const party = (h.party ?? "").toUpperCase().slice(0, 30);
      const ref = h.reference ?? String(600000000000 + parseInt(id(h.number).slice(0, 8), 16) % 99999999999);
      // Cheques and transfers out take a couple of days to show; money in shows the same day.
      const date = h.direction === "out" ? addDays(h.date, h.reference && /^\d{6}$/.test(h.reference) ? 2 : 0) : h.date;
      if (date < from || date > to) return;
      out.push({
        txnId: id(h.number, String(i)), date, reference: ref,
        description: h.direction === "in" ? `UPI/CR/${ref}/${party}` : h.reference && /^\d{6}$/.test(h.reference) ? `CHQ PAID-${h.reference}-${party}` : `NEFT DR-${party}-${ref}`,
        debit: h.direction === "out" ? money(h.amount) : "0.00", credit: h.direction === "in" ? money(h.amount) : "0.00",
      });
    });
    for (const d of monthEnds(from, to)) out.push({ txnId: id("sms", d), date: d, reference: null, description: `SMS CHARGES ${d.slice(0, 7)}`, debit: money(dec(15).times(1.18)), credit: "0.00" });
    return out.sort((a, b) => a.date.localeCompare(b.date) || a.txnId.localeCompare(b.txnId));
  }
}

export const bankFeed: BankFeed = new SimulatorFeed();
