"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { rupees } from "@/lib/format";
import { Alert, Button, Card, Field, Input } from "../ui";

export interface AgentRow {
  agentId: string; name: string; pct: string | null; earned: string; billed: string; due: string;
  invoices: { invoiceId: string; number: string; date: string; customer: string; pct: string; base: string; total: string; received: string; earned: string; billed: string; due: string }[];
}
export interface BrokerageBill { id: string; number: string; date: string; agent: string; amount: string; tdsRate: string; tds: string; net: string; status: string }

/** Commission each agent has earned on money received, and their brokerage bills. */
export function AgentCommission({ rows, bills, asOf, canBill }: { rows: AgentRow[]; bills: BrokerageBill[]; asOf: string; canBill: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const d = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  const [billing, setBilling] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-6">
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">{t("agents.agent")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("agents.earned")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("agents.billed")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("agents.due")}</th>
                <th className="w-40" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.agentId} className="border-b border-border align-top last:border-0">
                  <td className="px-5 py-2.5">
                    <details>
                      <summary className="cursor-pointer font-medium">{r.name}{r.pct ? <span className="ml-2 text-xs font-normal text-muted">{Number(r.pct)}%</span> : null}</summary>
                      <table className="mt-2 w-full text-xs text-muted">
                        <thead>
                          <tr>
                            <th className="py-1 pr-3 text-left font-medium">{t("agents.invoice")}</th>
                            <th className="py-1 pr-3 text-right font-medium">{t("agents.base")}</th>
                            <th className="py-1 pr-3 text-right font-medium">{t("agents.received")}</th>
                            <th className="py-1 pr-3 text-right font-medium">%</th>
                            <th className="py-1 text-right font-medium">{t("agents.due")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {r.invoices.map((i) => (
                            <tr key={i.invoiceId}>
                              <td className="py-1 pr-3"><span className="font-mono">{i.number}</span> · {i.customer} · {d(i.date)}</td>
                              <td className="num py-1 pr-3 text-right">{rupees(i.base)}</td>
                              <td className="num py-1 pr-3 text-right">{rupees(i.received)} / {rupees(i.total)}</td>
                              <td className="num py-1 pr-3 text-right">{Number(i.pct)}</td>
                              <td className={`num py-1 text-right ${Number(i.due) < 0 ? "text-danger" : ""}`}>{rupees(i.due)}</td>
                            </tr>
                          ))}
                          {!r.invoices.length ? <tr><td colSpan={5} className="py-2">{t("agents.noInvoices")}</td></tr> : null}
                        </tbody>
                      </table>
                    </details>
                  </td>
                  <td className="num px-5 py-2.5 text-right">{rupees(r.earned)}</td>
                  <td className="num px-5 py-2.5 text-right">{rupees(r.billed)}</td>
                  <td className="num px-5 py-2.5 text-right font-semibold">{rupees(r.due)}</td>
                  <td className="px-5 py-2 text-right">
                    {canBill && Number(r.due) > 0 && billing !== r.agentId ? <Button variant="outline" onClick={() => setBilling(r.agentId)}>{t("agents.makeBill")}</Button> : null}
                  </td>
                </tr>
              ))}
              {!rows.length ? <tr><td colSpan={5} className="px-5 py-10 text-center text-muted">{t("agents.empty")}</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>
      {billing ? <BillForm agent={rows.find((r) => r.agentId === billing)!} asOf={asOf} onDone={() => setBilling(null)} /> : null}
      <div>
        <h2 className="mb-3 font-semibold">{t("agents.bills")}</h2>
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="text-left text-muted">
                <tr className="border-b border-border">
                  <th className="px-5 py-3 font-medium">{t("agents.number")}</th>
                  <th className="px-5 py-3 font-medium">{t("common.date")}</th>
                  <th className="px-5 py-3 font-medium">{t("agents.agent")}</th>
                  <th className="px-5 py-3 text-right font-medium">{t("agents.commission")}</th>
                  <th className="px-5 py-3 text-right font-medium">{t("agents.tds")}</th>
                  <th className="px-5 py-3 text-right font-medium">{t("agents.net")}</th>
                  <th className="w-28" />
                </tr>
              </thead>
              <tbody>
                {bills.map((b) => <BillRow key={b.id} bill={b} canCancel={canBill} date={d(b.date)} />)}
                {!bills.length ? <tr><td colSpan={7} className="px-5 py-10 text-center text-muted">{t("agents.noBills")}</td></tr> : null}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

function BillForm({ agent, asOf, onDone }: { agent: AgentRow; asOf: string; onDone: () => void }) {
  const t = useTranslations();
  const router = useRouter();
  const [date, setDate] = useState(asOf);
  const [tdsRate, setTdsRate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api("/brokerage-bills", { body: { agentId: agent.agentId, date, ...(tdsRate ? { tdsRate } : {}) } });
      onDone();
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? (err.issues?.[0]?.message ?? err.code) : "generic";
      const key = [`agents.errors.${code}`, `vouchers.errors.${code}`].find((k) => t.has(k));
      setError(key ? t(key) : t("auth.errors.generic"));
      setBusy(false);
    }
  }
  return (
    <Card>
      <form onSubmit={save} className="grid gap-4 md:grid-cols-3">
        <p className="text-sm md:col-span-3">{t("agents.billFor", { name: agent.name, amount: rupees(agent.due) })}</p>
        {error ? <div className="md:col-span-3"><Alert>{error}</Alert></div> : null}
        <Field label={t("common.date")} htmlFor="bb-date"><Input id="bb-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></Field>
        <Field label={t("agents.tdsRate")} htmlFor="bb-tds" hint={t("agents.tdsHint")}>
          <Input id="bb-tds" value={tdsRate} onChange={(e) => setTdsRate(e.target.value)} inputMode="decimal" maxLength={5} className="num" placeholder="2" />
        </Field>
        <div className="flex items-end gap-3 pb-0.5">
          <Button type="submit" disabled={busy}>{t("agents.post")}</Button>
          <Button type="button" variant="ghost" onClick={onDone}>{t("common.cancel")}</Button>
        </div>
      </form>
    </Card>
  );
}

function BillRow({ bill, canCancel, date }: { bill: BrokerageBill; canCancel: boolean; date: string }) {
  const t = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const cancelled = bill.status === "cancelled";
  async function cancel(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api(`/brokerage-bills/${bill.id}/cancel`, { body: { reason } });
      setOpen(false);
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "generic";
      setError(t.has(`vouchers.errors.${code}`) ? t(`vouchers.errors.${code}`) : t("auth.errors.generic"));
    }
  }
  return (
    <>
      <tr className={`border-b border-border last:border-0 ${cancelled ? "text-muted line-through" : ""}`}>
        <td className="px-5 py-2.5 font-mono">{bill.number}</td>
        <td className="px-5 py-2.5">{date}</td>
        <td className="px-5 py-2.5">{bill.agent}</td>
        <td className="num px-5 py-2.5 text-right">{rupees(bill.amount)}</td>
        <td className="num px-5 py-2.5 text-right">{Number(bill.tds) ? `${rupees(bill.tds)} (${Number(bill.tdsRate)}%)` : ""}</td>
        <td className="num px-5 py-2.5 text-right font-semibold">{rupees(bill.net)}</td>
        <td className="px-5 py-2 text-right">
          {canCancel && !cancelled && !open ? <Button variant="ghost" onClick={() => setOpen(true)} className="text-danger">{t("common.cancel")}</Button> : null}
        </td>
      </tr>
      {open ? (
        <tr className="border-b border-border">
          <td colSpan={7} className="px-5 py-3">
            <form onSubmit={cancel} className="flex flex-wrap items-end gap-3">
              {error ? <div className="w-full"><Alert>{error}</Alert></div> : null}
              <div className="min-w-64 flex-1">
                <Field label={t("vouchers.cancelReason")} htmlFor={`bb-cancel-${bill.id}`}>
                  <Input id={`bb-cancel-${bill.id}`} value={reason} onChange={(e) => setReason(e.target.value)} required minLength={3} maxLength={200} autoFocus />
                </Field>
              </div>
              <Button type="submit" variant="danger">{t("agents.cancelBill")}</Button>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>{t("common.close")}</Button>
            </form>
          </td>
        </tr>
      ) : null}
    </>
  );
}
