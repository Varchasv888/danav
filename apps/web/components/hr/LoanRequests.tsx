"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { rupees, todayIso } from "@/lib/format";
import { StatusBadge } from "../StatusBadge";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

export interface LoanRequest {
  id: string; employeeId: string; employeeName: string; employeeCode: string; kind: string; amount: string; instalment: string; reason: string | null;
  status: "pending" | "approved" | "rejected"; decisionNote: string | null; createdAt: string;
}
const NS = ["loanRequests.errors", "payroll.errors", "hr.errors", "vouchers.errors"];
const MONEY = /^\d*\.?\d{0,2}$/;

/** Ask for an advance or loan for an employee, and decide the requests waiting. */
export function LoanRequests({ requests, employees, accounts, canRequest, canDecide }: {
  requests: LoanRequest[]; employees: { id: string; code: string; name: string }[]; accounts: { id: string; name: string }[]; canRequest: boolean; canDecide: boolean;
}) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState("");
  const [kind, setKind] = useState<"advance" | "loan">("advance");
  const [amount, setAmount] = useState("");
  const [instalment, setInstalment] = useState("");
  const [reason, setReason] = useState("");
  const [deciding, setDeciding] = useState<string | null>(null);
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const [date, setDate] = useState(todayIso());
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const day = (iso: string) => format.dateTime(new Date(iso), { dateStyle: "medium" });

  async function send(url: string, body: unknown, after?: () => void) {
    setBusy(true);
    setError(null);
    try { await api(url, { body }); after?.(); router.refresh(); } catch (err) { setError(errorText(t, err, NS)); } finally { setBusy(false); }
  }
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    void send(`/employees/${employeeId}/loan-requests`, { kind, amount, instalment, reason: reason || undefined }, () => { setAmount(""); setInstalment(""); setReason(""); });
  };

  const pending = requests.filter((r) => r.status === "pending");
  const decided = requests.filter((r) => r.status !== "pending");

  return (
    <div className="flex flex-col gap-4">
      {error ? <Alert>{error}</Alert> : null}
      {canRequest ? (
        <form onSubmit={submit} method="post" className="grid gap-3 rounded-md border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-5">
          <Field label={t("loanRequests.employee")} htmlFor="lr-emp">
            <Select id="lr-emp" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} required>
              <option value="">{t("loanRequests.chooseEmployee")}</option>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.name} ({e.code})</option>)}
            </Select>
          </Field>
          <Field label={t("loanRequests.kind")} htmlFor="lr-kind">
            <Select id="lr-kind" value={kind} onChange={(e) => setKind(e.target.value as "advance" | "loan")}>
              <option value="advance">{t("loanRequests.kinds.advance")}</option>
              <option value="loan">{t("loanRequests.kinds.loan")}</option>
            </Select>
          </Field>
          <Field label={t("loanRequests.amount")} htmlFor="lr-amt"><Input id="lr-amt" inputMode="decimal" value={amount} onChange={(e) => MONEY.test(e.target.value) && setAmount(e.target.value)} className="num text-right" required /></Field>
          <Field label={t("loanRequests.instalment")} htmlFor="lr-inst"><Input id="lr-inst" inputMode="decimal" value={instalment} onChange={(e) => MONEY.test(e.target.value) && setInstalment(e.target.value)} className="num text-right" required /></Field>
          <Field label={t("loanRequests.reason")} htmlFor="lr-reason"><Input id="lr-reason" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={200} /></Field>
          <div className="sm:col-span-2 lg:col-span-5"><Button type="submit" disabled={busy || !employeeId}>{t("loanRequests.send")}</Button></div>
        </form>
      ) : null}

      <Card className="p-0">
        <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("loanRequests.waiting")}</h2>
        {pending.length ? (
          <ul>
            {pending.map((r) => (
              <li key={r.id} className="border-b border-rule px-4 py-3 last:border-0">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.9286rem]">
                  <span className="font-medium">{r.employeeName} <span className="font-mono text-xs text-muted">{r.employeeCode}</span></span>
                  <span>{t(`loanRequests.kinds.${r.kind}`)}</span>
                  <span className="num font-semibold">{rupees(r.amount)}</span>
                  <span className="text-muted">{t("loanRequests.perMonth", { amount: rupees(r.instalment) })}</span>
                  <span className="text-muted">{day(r.createdAt)}</span>
                  {canDecide ? <Button type="button" variant="outline" onClick={() => setDeciding(deciding === r.id ? null : r.id)}>{t("loanRequests.decide")}</Button> : null}
                </div>
                {r.reason ? <p className="mt-1 text-xs text-muted">{r.reason}</p> : null}
                {deciding === r.id ? (
                  <div className="mt-3 grid gap-3 rounded-md bg-surface-2/60 p-3 sm:grid-cols-4">
                    <Field label={t("loanRequests.paidFrom")} htmlFor={`d-acc-${r.id}`}>
                      <Select id={`d-acc-${r.id}`} value={accountId} onChange={(e) => setAccountId(e.target.value)}>{accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</Select>
                    </Field>
                    <Field label={t("common.date")} htmlFor={`d-date-${r.id}`}><Input id={`d-date-${r.id}`} type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
                    <div className="sm:col-span-2"><Field label={t("loanRequests.note")} htmlFor={`d-note-${r.id}`}><Input id={`d-note-${r.id}`} value={note} onChange={(e) => setNote(e.target.value)} maxLength={200} /></Field></div>
                    <div className="flex gap-2 sm:col-span-4">
                      <Button type="button" disabled={busy || !accountId} onClick={() => send(`/loan-requests/${r.id}/decide`, { decision: "approve", date, accountId, note: note || undefined }, () => { setDeciding(null); setNote(""); })}>{t("loanRequests.approve")}</Button>
                      <Button type="button" variant="outline" disabled={busy} onClick={() => send(`/loan-requests/${r.id}/decide`, { decision: "reject", note: note || undefined }, () => { setDeciding(null); setNote(""); })}>{t("loanRequests.reject")}</Button>
                    </div>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        ) : <p className="px-4 py-6 text-center text-muted">{t("loanRequests.nonePending")}</p>}
      </Card>

      {decided.length ? (
        <Card className="p-0">
          <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("loanRequests.history")}</h2>
          <ul>
            {decided.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-rule px-4 py-2 text-[0.9286rem] last:border-0">
                <span className="font-medium">{r.employeeName}</span>
                <span>{t(`loanRequests.kinds.${r.kind}`)}</span>
                <span className="num">{rupees(r.amount)}</span>
                <StatusBadge status={r.status === "approved" ? "closed" : "cancelled"} label={t(`loanRequests.status.${r.status}`)} />
                {r.decisionNote ? <span className="text-xs text-muted">{r.decisionNote}</span> : null}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}
