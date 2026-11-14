"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { rupees, todayIso } from "@/lib/format";
import { StatusBadge } from "../StatusBadge";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

export interface Stipend { id: string; employeeId: string; employeeName: string; employeeCode: string; period: string; amount: string; date: string; status: "posted" | "cancelled"; remarks: string | null }
const NS = ["stipends.errors", "payroll.errors", "hr.errors", "vouchers.errors"];

/** The month's stipend payments, with a form to pay one more. */
export function Stipends({ period, rows, employees, accounts, canPay, canCancel }: {
  period: string; rows: Stipend[]; employees: { id: string; code: string; name: string }[]; accounts: { id: string; name: string }[]; canPay: boolean; canCancel: boolean;
}) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayIso());
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const day = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  const total = rows.filter((r) => r.status === "posted").reduce((s, r) => s + Number(r.amount), 0);
  const paid = new Set(rows.filter((r) => r.status === "posted").map((r) => r.employeeId));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api(`/employees/${employeeId}/stipends`, { body: { period, amount, date, accountId, remarks: remarks || undefined } });
      setAmount(""); setRemarks(""); setEmployeeId("");
      router.refresh();
    } catch (err) { setError(errorText(t, err, NS)); } finally { setBusy(false); }
  }
  async function cancel(id: string) {
    setError(null);
    try { await api(`/stipends/${id}/cancel`, { body: { reason: "Cancelled" } }); router.refresh(); } catch (err) { setError(errorText(t, err, NS)); }
  }

  return (
    <div className="flex flex-col gap-4">
      <form method="get" className="flex items-end gap-3">
        <Field label={t("stipends.month")} htmlFor="st-month"><Input id="st-month" name="period" type="month" defaultValue={period} className="w-44" /></Field>
        <Button type="submit" variant="outline">{t("stipends.show")}</Button>
      </form>
      {error ? <Alert>{error}</Alert> : null}
      {canPay ? (
        <form onSubmit={submit} method="post" className="grid gap-3 rounded-md border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-5">
          <Field label={t("stipends.employee")} htmlFor="st-emp">
            <Select id="st-emp" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} required>
              <option value="">{t("stipends.chooseEmployee")}</option>
              {employees.filter((e) => !paid.has(e.id)).map((e) => <option key={e.id} value={e.id}>{e.name} ({e.code})</option>)}
            </Select>
          </Field>
          <Field label={t("stipends.amount")} htmlFor="st-amt"><Input id="st-amt" inputMode="decimal" value={amount} onChange={(e) => /^\d*\.?\d{0,2}$/.test(e.target.value) && setAmount(e.target.value)} className="num text-right" required /></Field>
          <Field label={t("common.date")} htmlFor="st-date"><Input id="st-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></Field>
          <Field label={t("stipends.paidFrom")} htmlFor="st-acc"><Select id="st-acc" value={accountId} onChange={(e) => setAccountId(e.target.value)}>{accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</Select></Field>
          <Field label={t("stipends.remarks")} htmlFor="st-rem"><Input id="st-rem" value={remarks} onChange={(e) => setRemarks(e.target.value)} maxLength={200} /></Field>
          <div className="sm:col-span-2 lg:col-span-5"><Button type="submit" disabled={busy || !employeeId || !accountId}>{t("stipends.pay")}</Button></div>
        </form>
      ) : null}
      <Card className="p-0">
        {rows.length ? (
          <table className="w-full text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-5 py-2 font-medium">{t("stipends.employee")}</th><th className="px-5 py-2 font-medium">{t("common.date")}</th>
                <th className="px-5 py-2 text-right font-medium">{t("stipends.amount")}</th><th className="px-5 py-2 font-medium" /><th className="px-5 py-2" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-2"><span className="font-medium">{r.employeeName}</span> <span className="font-mono text-xs text-muted">{r.employeeCode}</span>{r.remarks ? <span className="ml-2 text-xs text-muted">{r.remarks}</span> : null}</td>
                  <td className="px-5 py-2 whitespace-nowrap">{day(r.date)}</td>
                  <td className="num px-5 py-2 text-right">{rupees(r.amount)}</td>
                  <td className="px-5 py-2">{r.status === "cancelled" ? <StatusBadge status="cancelled" label={t("stipends.cancelled")} /> : null}</td>
                  <td className="px-5 py-2 text-right">{canCancel && r.status === "posted" ? <button type="button" onClick={() => cancel(r.id)} className="text-danger hover:underline">{t("stipends.cancel")}</button> : null}</td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr className="border-t border-border"><td className="px-5 py-2 font-semibold" colSpan={2}>{t("stipends.total")}</td><td className="num px-5 py-2 text-right font-semibold">{rupees(total.toFixed(2))}</td><td colSpan={2} /></tr></tfoot>
          </table>
        ) : <p className="px-5 py-8 text-center text-muted">{t("stipends.empty")}</p>}
      </Card>
    </div>
  );
}
