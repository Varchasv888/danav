"use client";

import clsx from "clsx";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { localName, rupees, todayIso } from "@/lib/format";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

export interface DueRow {
  period: string; kind: "pf" | "esi" | "pt" | "lwf" | "tds"; due: string; paid: string; balance: string; dueDate: string | null;
  payments: { id: string; amount: string; paidOn: string; reference: string | null; bsrCode: string | null; challanSerial: string | null }[];
}
const NS = ["payroll.errors", "vouchers.errors"];

function PayForm({ row, accounts, onDone }: { row: DueRow; accounts: { id: string; name: string; nameHi: string | null }[]; onDone: () => void }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setBusy(true);
    setError(null);
    try {
      await api("/statutory/payments", {
        body: { kind: row.kind, period: row.period, amount: f.amount, paidOn: f.paidOn, accountId: f.accountId, reference: f.reference || undefined, bsrCode: f.bsrCode || undefined, challanSerial: f.challanSerial || undefined },
      });
      router.refresh();
      onDone();
    } catch (err) {
      setError(errorText(t, err, NS));
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="grid gap-3 bg-surface-2/50 p-4 md:grid-cols-4">
      <Field label={t("hr.loans.amount")} htmlFor="sp-amt"><Input id="sp-amt" name="amount" defaultValue={Number(row.balance) > 0 ? String(Number(row.balance)) : ""} required inputMode="decimal" className="num" /></Field>
      <Field label={t("statutory.paidOn")} htmlFor="sp-date"><Input id="sp-date" name="paidOn" type="date" defaultValue={todayIso()} required /></Field>
      <Field label={t("statutory.account")} htmlFor="sp-acc"><Select id="sp-acc" name="accountId" required>{accounts.map((a) => <option key={a.id} value={a.id}>{localName(a, locale)}</option>)}</Select></Field>
      <Field label={t("statutory.reference")} htmlFor="sp-ref"><Input id="sp-ref" name="reference" maxLength={40} /></Field>
      {row.kind === "tds" ? (
        <>
          <Field label={t("statutory.bsrCode")} htmlFor="sp-bsr"><Input id="sp-bsr" name="bsrCode" required inputMode="numeric" pattern="\d{7}" maxLength={7} className="num" /></Field>
          <Field label={t("statutory.challanSerial")} htmlFor="sp-ser"><Input id="sp-ser" name="challanSerial" required inputMode="numeric" pattern="\d{1,5}" maxLength={5} className="num" /></Field>
        </>
      ) : null}
      <div className="flex items-end gap-3 md:col-span-4">
        <Button type="submit" disabled={busy}>{t("statutory.record")}</Button>
        <Button type="button" variant="ghost" onClick={onDone}>{t("common.close")}</Button>
      </div>
      {error ? <div className="md:col-span-4"><Alert>{error}</Alert></div> : null}
    </form>
  );
}

export function Dues({ rows, accounts, canPay }: { rows: DueRow[]; accounts: { id: string; name: string; nameHi: string | null }[]; canPay: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const [open, setOpen] = useState<string | null>(null);
  const today = todayIso();
  const month = (p: string) => format.dateTime(new Date(`${p}-01T00:00:00`), { month: "long", year: "numeric" });
  const date = (d: string) => format.dateTime(new Date(`${d}T00:00:00`), { day: "numeric", month: "short" });
  return (
    <Card className="p-0">
      <h2 className="border-b border-border px-5 py-3 font-semibold">{t("statutory.dues")}</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="text-left text-muted">
            <tr className="border-b border-border">
              <th className="px-4 py-2 font-medium">{t("statutory.period")}</th><th className="px-4 py-2 font-medium">{t("statutory.kind")}</th>
              <th className="px-4 py-2 text-right font-medium">{t("statutory.due")}</th><th className="px-4 py-2 text-right font-medium">{t("statutory.paid")}</th>
              <th className="px-4 py-2 text-right font-medium">{t("statutory.balance")}</th><th className="px-4 py-2 font-medium">{t("statutory.dueDate")}</th><th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const key = `${r.period}|${r.kind}`;
              const late = !!r.dueDate && r.dueDate < today && Number(r.balance) > 0;
              return (
                <FragmentRows key={key} open={open === key} form={<PayForm row={r} accounts={accounts} onDone={() => setOpen(null)} />}>
                  <td className="px-4 py-2">{month(r.period)}</td>
                  <td className="px-4 py-2 font-medium">{t(`statutory.kinds.${r.kind}`)}</td>
                  <td className="num px-4 py-2 text-right">{rupees(r.due)}</td>
                  <td className="num px-4 py-2 text-right">{rupees(r.paid)}
                    {r.payments.map((p) => <span key={p.id} className="block text-[11px] text-muted">{date(p.paidOn)}{p.reference ? ` · ${p.reference}` : ""}{p.bsrCode ? ` · ${p.bsrCode}/${p.challanSerial}` : ""}</span>)}
                  </td>
                  <td className={clsx("num px-4 py-2 text-right font-semibold", Number(r.balance) > 0 ? "text-text" : "text-success")}>{rupees(r.balance)}</td>
                  <td className={clsx("px-4 py-2 whitespace-nowrap", late && "font-semibold text-danger")}>{r.dueDate ? date(r.dueDate) : "-"}{late ? ` · ${t("statutory.overdue")}` : ""}</td>
                  <td className="px-4 py-2 text-right">{canPay && Number(r.balance) > 0 ? <button type="button" onClick={() => setOpen(open === key ? null : key)} className="text-primary hover:underline">{t("statutory.pay")}</button> : null}</td>
                </FragmentRows>
              );
            })}
            {!rows.length ? <tr><td colSpan={7} className="px-5 py-8 text-center text-muted">{t("statutory.none")}</td></tr> : null}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function FragmentRows({ children, open, form }: { children: React.ReactNode; open: boolean; form: React.ReactNode }) {
  return (
    <>
      <tr className="border-b border-border align-top last:border-0">{children}</tr>
      {open ? <tr className="border-b border-border"><td colSpan={7}>{form}</td></tr> : null}
    </>
  );
}

interface Return24Q {
  quarter: number; challans: { period: string; amount: string; paidOn: string; bsrCode: string | null; challanSerial: string | null }[];
  deductees: { tds: string }[]; annexureII: unknown[]; warnings: { code: string; detail: string }[];
  files: { annexureI: { filename: string; content: string }; annexureII: { filename: string; content: string } | null };
}

const save = (f: { filename: string; content: string }) => {
  const url = URL.createObjectURL(new Blob([f.content], { type: "text/csv" }));
  Object.assign(document.createElement("a"), { href: url, download: f.filename }).click();
  URL.revokeObjectURL(url);
};

export function TdsReturn({ fy }: { fy: string }) {
  const t = useTranslations();
  const [quarter, setQuarter] = useState(1);
  const [r, setR] = useState<Return24Q | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setR(null);
    api<Return24Q>(`/tds/24q?fy=${fy}&quarter=${quarter}`).then(setR).catch((err) => setError(errorText(t, err, NS)));
  }, [fy, quarter, t]);
  const tds = r ? r.deductees.reduce((s, d) => s + Number(d.tds), 0) : 0;
  const deposited = r ? r.challans.reduce((s, c) => s + Number(c.amount), 0) : 0;
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold">{t("statutory.q24.title")}</h2>
        <Select value={quarter} onChange={(e) => setQuarter(Number(e.target.value))} className="w-48" aria-label={t("statutory.q24.quarter")}>
          {[1, 2, 3, 4].map((q) => <option key={q} value={q}>{t(`statutory.q24.quarters.${q}`)}</option>)}
        </Select>
      </div>
      {error ? <div className="mt-3"><Alert>{error}</Alert></div> : null}
      {r ? (
        <>
          <dl className="mt-4 grid max-w-lg grid-cols-[1fr_auto] gap-x-6 gap-y-1 text-sm">
            <dt className="text-muted">{t("statutory.q24.deductees")}</dt><dd className="num text-right">{r.deductees.length}</dd>
            <dt className="text-muted">{t("statutory.q24.totalTds")}</dt><dd className="num text-right">{rupees(tds.toFixed(2))}</dd>
            <dt className="text-muted">{t("statutory.q24.challans")} ({r.challans.length})</dt><dd className="num text-right">{rupees(deposited.toFixed(2))}</dd>
          </dl>
          {r.warnings.map((w, i) => <p key={i} className="mt-2 text-sm text-accent">{t(`statutory.q24.warnings.${w.code}`, { detail: w.detail })}</p>)}
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => save(r.files.annexureI)} disabled={!r.deductees.length}><Download className="size-4" aria-hidden />{t("statutory.q24.download")}</Button>
            {r.files.annexureII ? <Button variant="outline" onClick={() => save(r.files.annexureII!)}><Download className="size-4" aria-hidden />{t("statutory.q24.downloadAnnex2")}</Button> : null}
          </div>
          <p className="mt-3 text-xs text-muted">{t("statutory.q24.rpuHint")}</p>
        </>
      ) : null}
    </Card>
  );
}
