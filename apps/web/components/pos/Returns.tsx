"use client";

import { ArrowLeftRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { rupees } from "@/lib/format";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

const REASONS = ["size", "colour", "defect", "damaged", "not_liked", "other"] as const;
const GRADES = ["A", "B", "C"] as const;
type Mode = "cash" | "upi" | "card" | "voucher";

export interface ReturnBill {
  id: string; number: string; date: string; status: string; total: string; customerName: string | null;
  lines: { id: string; name: string; qty: string; returnedQty: string; total: string }[];
}
interface Row { qty: string; reason: (typeof REASONS)[number]; grade: (typeof GRADES)[number] }

/** Goods back against a bill: what, why and in what condition; refund or store credit for an exchange. */
export function ReturnForm({ bill, terminals }: { bill: ReturnBill; terminals: { id: string; code: string; name: string; open: boolean }[] }) {
  const t = useTranslations();
  const router = useRouter();
  const open = terminals.filter((x) => x.open);
  const [terminalId, setTerminalId] = useState(open[0]?.id ?? "");
  const [mode, setMode] = useState<Mode>("voucher");
  const [rows, setRows] = useState<Record<string, Row>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ number: string; total: string; voucherCode: string | null } | null>(null);
  const left = (l: ReturnBill["lines"][number]) => Number(l.qty) - Number(l.returnedQty);
  const row = (id: string): Row => rows[id] ?? { qty: "", reason: "size", grade: "A" };
  const set = (id: string, patch: Partial<Row>) => setRows({ ...rows, [id]: { ...row(id), ...patch } });
  const chosen = bill.lines.filter((l) => Number(row(l.id).qty) > 0);
  // What the refund will roughly be (the server works out the tax share and rounds to the rupee).
  const estimate = chosen.reduce((s, l) => s + (Number(l.total) * Number(row(l.id).qty)) / Number(l.qty), 0);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const r = await api<{ number: string; total: string; voucherCode: string | null }>("/pos/returns", {
        body: { billId: bill.id, terminalId, refundMode: mode, lines: chosen.map((l) => ({ lineId: l.id, ...row(l.id) })) },
      });
      setDone(r);
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? (err.issues?.[0]?.message ?? err.code) : "generic";
      const key = [`posReturns.errors.${code}`, `pos.errors.${code}`, `pos.promo.errors.${code}`].find((k) => t.has(k));
      setError(key ? t(key) : t("auth.errors.generic"));
    }
    setBusy(false);
  }

  if (done) {
    return (
      <Card className="flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle2 className="size-10 text-success" aria-hidden />
        <p className="text-lg font-semibold">{t("posReturns.saved", { number: done.number })}</p>
        <p className="num text-2xl font-semibold">{rupees(done.total)}</p>
        {done.voucherCode ? (
          <>
            <p className="text-sm">{t("posReturns.creditCode")} <span className="font-mono text-base font-semibold">{done.voucherCode}</span></p>
            <a href={`/pos/billing?voucher=${done.voucherCode}`} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover">
              <ArrowLeftRight className="size-4" aria-hidden />{t("posReturns.exchangeNow")}
            </a>
          </>
        ) : <p className="text-sm text-muted">{t("posReturns.refunded", { mode: t(`pos.billing.modes.${mode}`) })}</p>}
      </Card>
    );
  }
  if (bill.status !== "paid") return <Alert>{t("posReturns.errors.bill_void")}</Alert>;
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-semibold">{t("posReturns.against", { number: bill.number })}</h2>
        <span className="text-sm text-muted">{bill.customerName ?? ""} · {rupees(bill.total)}</span>
      </div>
      {error ? <Alert>{error}</Alert> : null}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-muted">
            <tr className="border-b border-border">
              <th className="py-2 pr-3 font-medium">{t("schemes.item")}</th>
              <th className="py-2 pr-3 text-right font-medium">{t("posReturns.canReturn")}</th>
              <th className="w-24 py-2 pr-3 font-medium">{t("posReturns.qty")}</th>
              <th className="py-2 pr-3 font-medium">{t("posReturns.reason")}</th>
              <th className="py-2 font-medium">{t("posReturns.condition")}</th>
            </tr>
          </thead>
          <tbody>
            {bill.lines.map((l) => (
              <tr key={l.id} className="border-b border-border last:border-0">
                <td className="py-2 pr-3">{l.name}</td>
                <td className="num py-2 pr-3 text-right">{left(l)}</td>
                <td className="py-2 pr-3">
                  <Input value={row(l.id).qty} onChange={(e) => set(l.id, { qty: e.target.value })} inputMode="decimal" className="num" disabled={left(l) <= 0} aria-label={t("posReturns.qty")} placeholder="0" />
                </td>
                <td className="py-2 pr-3">
                  <Select value={row(l.id).reason} onChange={(e) => set(l.id, { reason: e.target.value as Row["reason"] })} aria-label={t("posReturns.reason")} disabled={left(l) <= 0}>
                    {REASONS.map((r) => <option key={r} value={r}>{t(`posReturns.reasons.${r}`)}</option>)}
                  </Select>
                </td>
                <td className="py-2">
                  <Select value={row(l.id).grade} onChange={(e) => set(l.id, { grade: e.target.value as Row["grade"] })} aria-label={t("posReturns.condition")} disabled={left(l) <= 0}>
                    {GRADES.map((g) => <option key={g} value={g}>{t(`posReturns.grades.${g}`)}</option>)}
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Field label={t("posReturns.counter")} htmlFor="ret-term" hint={open.length ? undefined : t("posReturns.noShift")}>
          <Select id="ret-term" value={terminalId} onChange={(e) => setTerminalId(e.target.value)}>
            {open.map((x) => <option key={x.id} value={x.id}>{x.code} · {x.name}</option>)}
          </Select>
        </Field>
        <Field label={t("posReturns.give")} htmlFor="ret-mode" hint={mode === "voucher" ? t("posReturns.voucherHint") : undefined}>
          <Select id="ret-mode" value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
            <option value="voucher">{t("posReturns.storeCredit")}</option>
            {(["cash", "upi", "card"] as const).map((m) => <option key={m} value={m}>{t(`pos.billing.modes.${m}`)}</option>)}
          </Select>
        </Field>
        <div className="flex items-end justify-between gap-3">
          <span className="text-sm text-muted">{t("posReturns.about", { amount: rupees(estimate) })}</span>
          <Button onClick={submit} disabled={busy || !chosen.length || !terminalId}>{t("posReturns.take")}</Button>
        </div>
      </div>
    </Card>
  );
}

export interface ReturnsReport {
  total: string; byReason: { key: string; qty: string; value: string }[]; byGrade: { key: string; qty: string; value: string }[];
  returns: { id: string; number: string; billNumber: string; date: string; total: string; refundMode: string; lines: { name: string; qty: string; reason: string; grade: string }[] }[];
}

/** The day's returns with what came back, why, and in what condition. */
export function ReturnsList({ report }: { report: ReturnsReport }) {
  const t = useTranslations();
  const tally = (rows: ReturnsReport["byReason"], label: (k: string) => string) => (
    <ul className="divide-y divide-border text-sm">
      {rows.map((r) => <li key={r.key} className="flex justify-between gap-3 px-5 py-2"><span>{label(r.key)} <span className="num text-muted">× {Number(r.qty)}</span></span><span className="num">{rupees(r.value)}</span></li>)}
      {!rows.length ? <li className="px-5 py-3 text-muted">-</li> : null}
    </ul>
  );
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">{t("posReturns.number")}</th>
                <th className="px-5 py-3 font-medium">{t("posReturns.bill")}</th>
                <th className="px-5 py-3 font-medium">{t("posReturns.what")}</th>
                <th className="px-5 py-3 font-medium">{t("posReturns.give")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("pos.billing.total")}</th>
              </tr>
            </thead>
            <tbody>
              {report.returns.map((r) => (
                <tr key={r.id} className="border-b border-border align-top last:border-0">
                  <td className="px-5 py-2.5 font-mono">{r.number}</td>
                  <td className="px-5 py-2.5 font-mono">{r.billNumber}</td>
                  <td className="px-5 py-2.5">{r.lines.map((l, i) => <span key={i} className="block">{l.name} × {Number(l.qty)} <span className="text-xs text-muted">({t(`posReturns.reasons.${l.reason}`)}, {l.grade})</span></span>)}</td>
                  <td className="px-5 py-2.5">{r.refundMode === "voucher" ? t("posReturns.storeCredit") : t(`pos.billing.modes.${r.refundMode}`)}</td>
                  <td className="num px-5 py-2.5 text-right">{rupees(r.total)}</td>
                </tr>
              ))}
              {!report.returns.length ? <tr><td colSpan={5} className="px-5 py-10 text-center text-muted">{t("posReturns.none")}</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="flex flex-col gap-6">
        <Card className="p-0"><div className="border-b border-border px-5 py-3 font-semibold">{t("posReturns.byReason")}</div>{tally(report.byReason, (k) => t(`posReturns.reasons.${k}`))}</Card>
        <Card className="p-0"><div className="border-b border-border px-5 py-3 font-semibold">{t("posReturns.byCondition")}</div>{tally(report.byGrade, (k) => t(`posReturns.grades.${k}`))}</Card>
      </div>
    </div>
  );
}
