"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { Fragment, useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { localName, rupees, todayIso } from "@/lib/format";
import { StatusBadge } from "../StatusBadge";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

export interface Loan { id: string; kind: string; date: string; amount: string; instalment: string; recovered: string; startPeriod: string; status: string; remarks: string | null }
const TONE: Record<string, string> = { active: "partial", closed: "closed", cancelled: "cancelled" };
const NS = ["payroll.errors", "hr.errors", "vouchers.errors"];

/** Advances and loans for one employee: pay one out, see what's been recovered. */
export function Loans({ employeeId, loans, accounts, canCreate, canCancel }: {
  employeeId: string; loans: Loan[]; accounts: { id: string; name: string; nameHi: string | null }[]; canCreate: boolean; canCancel: boolean;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const format = useFormatter();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [receiving, setReceiving] = useState<string | null>(null);
  const today = todayIso();

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setBusy(true);
    setError(null);
    try {
      await api(`/employees/${employeeId}/loans`, { body: { kind: f.kind, date: f.date, amount: f.amount, instalment: f.instalment, startPeriod: f.startPeriod || undefined, accountId: f.accountId, remarks: f.remarks || undefined } });
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(errorText(t, err, NS));
    } finally {
      setBusy(false);
    }
  }
  async function receive(e: React.FormEvent<HTMLFormElement>, loanId: string) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setBusy(true);
    setError(null);
    try {
      await api(`/loans/${loanId}/receipts`, { body: { date: f.date, amount: f.amount, accountId: f.accountId } });
      setReceiving(null);
      router.refresh();
    } catch (err) {
      setError(errorText(t, err, NS));
    } finally {
      setBusy(false);
    }
  }
  async function cancel(id: string) {
    setError(null);
    try { await api(`/loans/${id}/cancel`, { body: { reason: "Cancelled" } }); router.refresh(); } catch (err) { setError(errorText(t, err, NS)); }
  }
  const month = (p: string) => format.dateTime(new Date(`${p}-01T00:00:00`), { month: "short", year: "numeric" });

  return (
    <Card className="p-0">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h2 className="font-semibold">{t("hr.loans.title")}</h2>
        {canCreate && !open ? <Button variant="outline" onClick={() => setOpen(true)}>{t("hr.loans.new")}</Button> : null}
      </div>
      {open ? (
        <form onSubmit={create} className="grid gap-4 border-b border-border p-5 md:grid-cols-3">
          <Field label={t("hr.loans.kind")} htmlFor="ln-kind"><Select id="ln-kind" name="kind">{["advance", "loan"].map((k) => <option key={k} value={k}>{t(`hr.loans.kinds.${k}`)}</option>)}</Select></Field>
          <Field label={t("hr.loans.date")} htmlFor="ln-date"><Input id="ln-date" name="date" type="date" defaultValue={today} required /></Field>
          <Field label={t("hr.loans.paidFrom")} htmlFor="ln-acc"><Select id="ln-acc" name="accountId" required>{accounts.map((a) => <option key={a.id} value={a.id}>{localName(a, locale)}</option>)}</Select></Field>
          <Field label={t("hr.loans.amount")} htmlFor="ln-amt"><Input id="ln-amt" name="amount" required inputMode="decimal" pattern="\d+(\.\d{1,2})?" className="num" /></Field>
          <Field label={t("hr.loans.instalment")} htmlFor="ln-inst"><Input id="ln-inst" name="instalment" required inputMode="decimal" pattern="\d+(\.\d{1,2})?" className="num" /></Field>
          <Field label={t("hr.loans.startPeriod")} htmlFor="ln-start"><Input id="ln-start" name="startPeriod" type="month" defaultValue={today.slice(0, 7)} /></Field>
          <div className="md:col-span-3"><Field label={t("hr.loans.remarks")} htmlFor="ln-rem"><Input id="ln-rem" name="remarks" maxLength={200} /></Field></div>
          <div className="flex gap-3 md:col-span-3">
            <Button type="submit" disabled={busy}>{t("hr.loans.create")}</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>{t("common.close")}</Button>
          </div>
        </form>
      ) : null}
      {error ? <div className="px-5 pt-3"><Alert>{error}</Alert></div> : null}
      <table className="w-full text-sm">
        <thead className="text-left text-muted">
          <tr className="border-b border-border">
            <th className="px-5 py-2 font-medium">{t("hr.loans.kind")}</th>
            <th className="px-5 py-2 font-medium">{t("hr.loans.date")}</th>
            <th className="px-5 py-2 text-right font-medium">{t("hr.loans.amount")}</th>
            <th className="px-5 py-2 text-right font-medium">{t("hr.loans.instalment")}</th>
            <th className="px-5 py-2 text-right font-medium">{t("hr.loans.recovered")}</th>
            <th className="px-5 py-2 text-right font-medium">{t("hr.loans.balance")}</th>
            <th className="px-5 py-2 font-medium" />
          </tr>
        </thead>
        <tbody>
          {loans.map((l) => (
            <Fragment key={l.id}>
            <tr className="border-b border-border last:border-0">
              <td className="px-5 py-2">{t(`hr.loans.kinds.${l.kind}`)}{l.remarks ? <span className="block text-xs text-muted">{l.remarks}</span> : null}</td>
              <td className="px-5 py-2 whitespace-nowrap">{format.dateTime(new Date(`${l.date}T00:00:00`), { dateStyle: "medium" })}<span className="block text-xs text-muted">{t("hr.loans.startPeriod")} {month(l.startPeriod)}</span></td>
              <td className="num px-5 py-2 text-right">{rupees(l.amount)}</td>
              <td className="num px-5 py-2 text-right">{rupees(l.instalment)}</td>
              <td className="num px-5 py-2 text-right">{rupees(l.recovered)}</td>
              <td className="num px-5 py-2 text-right font-semibold">{l.status === "cancelled" ? "-" : rupees((Number(l.amount) - Number(l.recovered)).toFixed(2))}</td>
              <td className="px-5 py-2 text-right whitespace-nowrap">
                <StatusBadge status={TONE[l.status] ?? l.status} label={t(`hr.loans.statuses.${l.status}`)} />
                {canCreate && l.status === "active" ? <button type="button" onClick={() => setReceiving(receiving === l.id ? null : l.id)} className="ml-3 text-primary hover:underline">{t("hr.loans.receive")}</button> : null}
                {canCancel && l.status === "active" && Number(l.recovered) === 0 ? <button type="button" onClick={() => cancel(l.id)} className="ml-3 text-danger hover:underline">{t("hr.loans.cancel")}</button> : null}
              </td>
            </tr>
            {receiving === l.id ? (
              <tr className="border-b border-border bg-primary-soft/40">
                <td colSpan={7} className="px-5 py-3">
                  <form onSubmit={(e) => receive(e, l.id)} className="flex flex-wrap items-end gap-3">
                    <Field label={t("hr.loans.date")} htmlFor={`rc-date-${l.id}`}><Input id={`rc-date-${l.id}`} name="date" type="date" defaultValue={today} required /></Field>
                    <Field label={t("hr.loans.receiveAmount")} htmlFor={`rc-amt-${l.id}`}><Input id={`rc-amt-${l.id}`} name="amount" inputMode="decimal" defaultValue={(Number(l.amount) - Number(l.recovered)).toFixed(2)} className="num w-36 text-right" required /></Field>
                    <Field label={t("hr.loans.receivedInto")} htmlFor={`rc-acc-${l.id}`}><Select id={`rc-acc-${l.id}`} name="accountId" required className="w-56">{accounts.map((a) => <option key={a.id} value={a.id}>{localName(a, locale)}</option>)}</Select></Field>
                    <Button type="submit" disabled={busy}>{t("hr.loans.receiveSave")}</Button>
                    <Button type="button" variant="ghost" onClick={() => setReceiving(null)}>{t("common.cancel")}</Button>
                  </form>
                </td>
              </tr>
            ) : null}
            </Fragment>
          ))}
          {!loans.length ? <tr><td colSpan={7} className="px-5 py-6 text-center text-muted">{t("hr.loans.none")}</td></tr> : null}
        </tbody>
      </table>
    </Card>
  );
}
