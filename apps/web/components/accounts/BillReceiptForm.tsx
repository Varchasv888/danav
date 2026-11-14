"use client";

import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { rupees, todayIso } from "@/lib/format";
import { Alert, Button, Field, Input, Select } from "../ui";
import { useWorkDate } from "@/components/WorkingDate";

export interface OpenBill { voucherId: string; number: string; date: string; dueOn: string; amount: string; daysOverdue: number }
export interface OpenBills { advance: string; bills: OpenBill[] }

const cents = (v: string) => Math.round(Number(v || 0) * 100);
const fromCents = (c: number) => (c / 100).toFixed(2);

/**
 * One receipt or payment that names the bills it settles. Type the amount, press "Fill oldest first" or
 * type against each bill. What is not placed on a bill stays on account and clears the oldest bills.
 */
export function BillReceiptForm({ kind, parties, accounts, partyId, open }: {
  kind: "receivable" | "payable"; parties: { id: string; name: string }[]; accounts: { id: string; name: string }[]; partyId: string; open: OpenBills | null;
}) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const day = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  const receipt = kind === "receivable";
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const workDate = useWorkDate();
  const [date, setDate] = useState(workDate);
  const [amount, setAmount] = useState("");
  const [pay, setPay] = useState<Record<string, string>>({});
  const [narration, setNarration] = useState("");
  const [reference, setReference] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const total = cents(amount);
  const allocated = Object.values(pay).reduce((s, v) => s + cents(v), 0);
  const onAccount = total - allocated;
  const bills = open?.bills ?? [];

  function setBill(b: OpenBill, v: string) {
    if (!/^\d*\.?\d{0,2}$/.test(v)) return;
    setDone(null);
    setPay((p) => {
      const next = { ...p };
      if (!v || cents(v) === 0) delete next[b.voucherId]; else next[b.voucherId] = cents(v) > cents(b.amount) ? b.amount : v;
      return next;
    });
  }
  function fillOldest() {
    let left = total;
    const next: Record<string, string> = {};
    for (const b of bills) {
      if (left <= 0) break;
      const use = Math.min(left, cents(b.amount));
      next[b.voucherId] = fromCents(use);
      left -= use;
    }
    setPay(next);
  }
  function chooseParty(id: string) {
    router.push(`/accounts/bill-receipt?kind=${kind}${id ? `&party=${id}` : ""}`);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const r = await api<{ voucher: { number: string } }>("/bill-receipts", {
        method: "POST",
        body: {
          kind, partyId, accountId, date, amount: fromCents(total), narration: narration || undefined, reference: reference || undefined,
          allocations: Object.entries(pay).map(([billVoucherId, v]) => ({ billVoucherId, amount: v })),
        },
      });
      setDone(r.voucher.number);
      setAmount(""); setPay({}); setNarration(""); setReference("");
      router.refresh();
    } catch (err) { setError(errorText(t, err, ["billReceipt.errors"])); } finally { setBusy(false); }
  }

  const tab = (k: "receivable" | "payable", label: string) => (
    <Link href={`/accounts/bill-receipt?kind=${k}`} aria-current={k === kind ? "page" : undefined}
      className={clsx("rounded-md px-3 py-1.5 text-[0.9286rem] font-semibold", k === kind ? "bg-primary-soft text-primary" : "text-muted hover:bg-surface-2 hover:text-text")}>{label}</Link>
  );

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="flex gap-1">{tab("receivable", t("billReceipt.tabReceipt"))}{tab("payable", t("billReceipt.tabPayment"))}</div>
      {error ? <Alert>{error}</Alert> : null}
      {done ? <div role="status" className="rounded-md border border-success/30 bg-success-soft px-3 py-2 text-[0.9286rem] text-success">{t("billReceipt.saved", { number: done })}</div> : null}

      <div className="grid gap-3 rounded-md border border-border bg-surface p-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label={t(receipt ? "billReceipt.customer" : "billReceipt.supplier")} htmlFor="br-party">
          <Select id="br-party" value={partyId} onChange={(e) => chooseParty(e.target.value)}>
            <option value="">{t("billReceipt.choose")}</option>
            {parties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Select>
        </Field>
        <Field label={t("billReceipt.account")} htmlFor="br-account">
          <Select id="br-account" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
            {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </Select>
        </Field>
        <Field label={t("common.date")} htmlFor="br-date"><Input id="br-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></Field>
        <Field label={t(receipt ? "billReceipt.amountReceived" : "billReceipt.amountPaid")} htmlFor="br-amount">
          <Input id="br-amount" inputMode="decimal" value={amount} onChange={(e) => /^\d*\.?\d{0,2}$/.test(e.target.value) && (setDone(null), setAmount(e.target.value))} className="num text-right" required />
        </Field>
        <Field label={t("billReceipt.reference")} htmlFor="br-ref"><Input id="br-ref" value={reference} onChange={(e) => setReference(e.target.value)} maxLength={60} /></Field>
        <div className="sm:col-span-2 lg:col-span-3"><Field label={t("common.narration")} htmlFor="br-narr"><Input id="br-narr" value={narration} onChange={(e) => setNarration(e.target.value)} maxLength={300} /></Field></div>
      </div>

      {partyId ? (
        <div className="rounded-md border border-border bg-surface">
          <div className="flex flex-wrap items-center gap-3 border-b border-border px-3 py-2">
            <h2 className="font-semibold">{t("billReceipt.openBills")}</h2>
            {Number(open?.advance ?? 0) > 0 ? <span className="text-[0.9286rem] text-muted">{t("billReceipt.advance", { amount: rupees(open!.advance) })}</span> : null}
            <div className="ml-auto flex gap-2">
              <Button type="button" variant="outline" className="h-8" onClick={fillOldest} disabled={!total || !bills.length}>{t("billReceipt.fillOldest")}</Button>
              <Button type="button" variant="outline" className="h-8" onClick={() => setPay({})} disabled={!allocated}>{t("billReceipt.clear")}</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[0.9286rem]">
              <thead>
                <tr className="border-b border-border bg-surface-2 text-left text-xs font-semibold text-muted">
                  <th className="px-3 py-1.5">{t("billReceipt.bill")}</th><th className="px-3 py-1.5">{t("common.date")}</th><th className="px-3 py-1.5">{t("billReceipt.dueOn")}</th>
                  <th className="px-3 py-1.5 text-right">{t("billReceipt.pending")}</th><th className="w-36 px-3 py-1.5 text-right">{t("billReceipt.payNow")}</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((b) => (
                  <tr key={b.voucherId} className={clsx("border-b border-rule last:border-0", pay[b.voucherId] && "bg-primary-soft/40")}>
                    <td className="px-3 py-1.5 font-mono text-xs">{b.number}</td>
                    <td className="px-3 py-1.5 text-muted">{day(b.date)}</td>
                    <td className={clsx("px-3 py-1.5", b.daysOverdue > 0 ? "text-danger" : "text-muted")}>{day(b.dueOn)}{b.daysOverdue > 0 ? ` (${t("billReceipt.late", { n: b.daysOverdue })})` : ""}</td>
                    <td className="num px-3 py-1.5 text-right">{rupees(b.amount)}</td>
                    <td className="px-3 py-1">
                      <Input inputMode="decimal" value={pay[b.voucherId] ?? ""} onChange={(e) => setBill(b, e.target.value)} aria-label={`${b.number}: ${t("billReceipt.payNow")}`} className="num h-8 text-right" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!bills.length ? <p className="px-3 py-6 text-center text-muted">{t("billReceipt.noBills")}</p> : null}
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-md border border-border bg-surface px-3 py-2">
        <span className="text-[0.9286rem] text-muted">{t("billReceipt.onBills")} <b className="num text-text">{rupees(fromCents(allocated))}</b></span>
        <span className={clsx("text-[0.9286rem]", onAccount < 0 ? "text-danger" : "text-muted")}>{t("billReceipt.onAccount")} <b className="num">{rupees(fromCents(onAccount))}</b></span>
        <Button type="submit" className="ml-auto" disabled={busy || !partyId || !total || onAccount < 0 || !accountId}>{t(receipt ? "billReceipt.saveReceipt" : "billReceipt.savePayment")}</Button>
      </div>
    </form>
  );
}
