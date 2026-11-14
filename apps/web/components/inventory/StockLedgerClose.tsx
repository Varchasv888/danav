"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/client-api";
import { Alert, Button, Card, Field, Input } from "../ui";

interface Result { noChange: boolean; voucherId: string | null; voucherNumber?: string; difference: string; ledgerValueAfter: string }

export function StockLedgerClose({ asOf, canPost }: { asOf: string; canPost: boolean }) {
  const router = useRouter();
  const [date, setDate] = useState(asOf);
  const [reason, setReason] = useState("");
  const [landedCostsBooked, setLandedCostsBooked] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null); setResult(null);
    try {
      const posted = await api<Result>("/inventory/stock-ledger-reconciliations", { body: { asOf: date, reason, landedCostsBooked } });
      setResult(posted);
      setReason("");
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "";
      setError(code === "landed_costs_not_booked"
        ? "Confirm that allocated inward costs are supported and separately posted before closing stock."
        : code === "opening_stock_balance_mismatch"
        ? "The opening Stock-in-Hand ledger does not match the opening stock register. Reconcile opening balances before posting this close."
        : code === "period_closed" ? "This date is in a closed accounting period. Reopen it before posting."
          : "The closing-stock journal could not be posted. Check the date, period and account setup.");
    } finally { setBusy(false); }
  }

  if (!canPost) return null;
  return <Card className="mb-4 p-4">
    <h2 className="font-semibold">Post reviewed closing stock</h2>
    <p className="mt-1 text-sm text-muted">This posts only the difference shown above to Closing Stock and Change in Stock. The action is recorded as a journal; an unchanged repeat creates no duplicate.</p>
    <form onSubmit={submit} className="mt-3 flex flex-wrap items-end gap-3">
      <Field label="Journal date" htmlFor="stock-close-date"><Input id="stock-close-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-44" /></Field>
      <Field label="Review reason" htmlFor="stock-close-reason"><Input id="stock-close-reason" value={reason} onChange={(e) => setReason(e.target.value)} required minLength={3} maxLength={250} className="min-w-64" placeholder="Period-end stock valuation reviewed" /></Field>
      <label className="flex max-w-2xl items-start gap-2 text-sm"><input type="checkbox" required checked={landedCostsBooked} onChange={(e) => setLandedCostsBooked(e.target.checked)} className="mt-1" /><span>I confirm allocated inward costs have source documents, are separately posted in the books, and exclude recoverable GST.</span></label>
      <Button type="submit" disabled={busy || !reason.trim() || !landedCostsBooked}>{busy ? "Posting…" : "Post closing-stock journal"}</Button>
    </form>
    {error ? <div className="mt-3"><Alert>{error}</Alert></div> : null}
    {result ? <p role="status" className="mt-3 text-sm text-success">{result.noChange ? "No difference remains; no journal was created." : `Posted ${result.voucherNumber ?? "journal"} for ₹${Number(result.difference).toLocaleString("en-IN", { minimumFractionDigits: 2 })}.`}</p> : null}
  </Card>;
}
