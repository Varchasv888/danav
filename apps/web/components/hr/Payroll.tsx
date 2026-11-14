"use client";

import { Download, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { localName, rupees, todayIso } from "@/lib/format";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

const NS = ["payroll.errors", "hr.errors", "vouchers.errors"];

export function NewRun({ months }: { months: { value: string; label: string }[] }) {
  const t = useTranslations();
  const router = useRouter();
  const [period, setPeriod] = useState(months[0]!.value);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <form className="flex flex-wrap items-end gap-3" onSubmit={async (e) => {
      e.preventDefault();
      setBusy(true);
      setError(null);
      try {
        const r = await api<{ id: string }>("/payroll-runs", { body: { period } });
        router.push(`/hr/payroll/${r.id}`);
      } catch (err) {
        setError(errorText(t, err, NS));
        setBusy(false);
      }
    }}>
      <Select value={period} onChange={(e) => setPeriod(e.target.value)} className="w-48" aria-label={t("payroll.month")}>{months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}</Select>
      <Button type="submit" disabled={busy}>{t("payroll.run")}</Button>
      {error ? <div className="w-full"><Alert>{error}</Alert></div> : null}
    </form>
  );
}

export interface RunSlip {
  id: string; code: string; name: string; nameHi: string | null; lopDays: string; lopOverride: string | null; paidDays: string; gross: string; pfEmployee: string; esiEmployee: string;
  pt: string; lwfEmployee: string; tds: string; otherDeductions: { name: string; amount: string }[]; netPay: string;
  extraEarnings: { code: string; name: string; amount: string; esiExcluded?: boolean }[];
  loanRecoveries: { loanId: string; name: string; amount: string; overridden?: boolean }[];
}
export interface RunData {
  id: string; period: string; status: string; gross: string; deductions: string; netPay: string; employerContributions: string; payslips: RunSlip[];
}

function SlipEditor({ runId, slip, onDone }: { runId: string; slip: RunSlip; onDone: () => void }) {
  const t = useTranslations();
  const router = useRouter();
  const [lop, setLop] = useState(slip.lopOverride !== null ? String(Number(slip.lopOverride)) : "");
  const [items, setItems] = useState(slip.otherDeductions.map((o) => ({ ...o, amount: String(Number(o.amount)) })));
  const [extras, setExtras] = useState(slip.extraEarnings.map((x) => ({ ...x, amount: String(Number(x.amount)), esiExcluded: !!x.esiExcluded })));
  const [loans, setLoans] = useState(slip.loanRecoveries.map((l) => ({ loanId: l.loanId, name: l.name, amount: l.overridden ? String(Number(l.amount)) : "", placeholder: String(Number(l.amount)) })));
  const [error, setError] = useState<string | null>(null);
  const save = async (lopDays: string | null) => {
    setError(null);
    try {
      await api(`/payroll-runs/${runId}/payslips/${slip.id}`, {
        method: "PATCH",
        body: {
          lopDays, otherDeductions: items.filter((i) => i.name && i.amount),
          extraEarnings: extras.filter((x) => x.name && x.amount).map((x) => ({ code: x.code || x.name.replace(/[^A-Za-z]/g, "").slice(0, 10).toUpperCase() || "EXTRA", name: x.name, amount: x.amount, esiExcluded: x.esiExcluded })),
          loanRecoveries: loans.map((l) => ({ loanId: l.loanId, amount: l.amount === "" ? null : l.amount })),
        },
      });
      router.refresh();
      onDone();
    } catch (err) {
      setError(errorText(t, err, NS));
    }
  };
  const pair = (key: string, label1: string, v1: string, set1: (v: string) => void, label2: string, v2: string, set2: (v: string) => void, extra?: React.ReactNode, remove?: () => void) => (
    <div key={key} className="flex flex-wrap items-end gap-3">
      <Field label={label1} htmlFor={`${key}-a`}><Input id={`${key}-a`} value={v1} onChange={(e) => set1(e.target.value)} maxLength={40} /></Field>
      <Field label={label2} htmlFor={`${key}-b`}><Input id={`${key}-b`} value={v2} onChange={(e) => set2(e.target.value)} inputMode="decimal" className="num w-32" /></Field>
      {extra}
      {remove ? <Button type="button" variant="ghost" onClick={remove}>{t("common.remove")}</Button> : null}
    </div>
  );
  return (
    <form className="flex flex-col gap-4 bg-surface-2/50 p-4" onSubmit={(e) => { e.preventDefault(); void save(lop === "" ? null : lop); }}>
      <div className="flex flex-wrap items-end gap-3">
        <Field label={t("payroll.cols.lop")} htmlFor={`lop-${slip.id}`} hint={`${t("hr.attendance.title")}: ${Number(slip.lopDays)}`}>
          <Input id={`lop-${slip.id}`} value={lop} onChange={(e) => setLop(e.target.value)} inputMode="decimal" pattern="\d+(\.5)?" className="num w-28" placeholder={String(Number(slip.lopDays))} />
        </Field>
        {slip.lopOverride !== null ? <Button type="button" variant="ghost" onClick={() => save(null)}>{t("payroll.lopReset")}</Button> : null}
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-medium">{t("payroll.extra.title")}</legend>
        {extras.map((x, i) => pair(`ex-${slip.id}-${i}`, t("payroll.extra.name"), x.name, (v) => setExtras(extras.map((y, j) => (j === i ? { ...y, name: v } : y))),
          t("payroll.extra.amount"), x.amount, (v) => setExtras(extras.map((y, j) => (j === i ? { ...y, amount: v } : y))),
          <label className="flex items-center gap-2 pb-2 text-sm"><input type="checkbox" checked={x.esiExcluded} onChange={(e) => setExtras(extras.map((y, j) => (j === i ? { ...y, esiExcluded: e.target.checked } : y)))} className="size-4 accent-[var(--primary)]" />{t("payroll.extra.esiExcluded")}</label>,
          () => setExtras(extras.filter((_, j) => j !== i))))}
        <div><Button type="button" variant="ghost" className="-ml-3" onClick={() => setExtras([...extras, { code: "", name: "", amount: "", esiExcluded: false }])}>{t("payroll.extra.add")}</Button></div>
      </fieldset>

      {loans.length ? (
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-sm font-medium">{t("payroll.loanRecovery.title")}</legend>
          <p className="text-xs text-muted">{t("payroll.loanRecovery.hint")}</p>
          {loans.map((l, i) => (
            <Field key={l.loanId} label={l.name} htmlFor={`ln-${l.loanId}`}>
              <Input id={`ln-${l.loanId}`} value={l.amount} placeholder={l.placeholder} onChange={(e) => setLoans(loans.map((y, j) => (j === i ? { ...y, amount: e.target.value } : y)))} inputMode="decimal" className="num w-32" />
            </Field>
          ))}
        </fieldset>
      ) : null}

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-medium">{t("payroll.cols.other")}</legend>
        {items.map((it, i) => pair(`dn-${slip.id}-${i}`, t("payroll.deductionName"), it.name, (v) => setItems(items.map((x, j) => (j === i ? { ...x, name: v } : x))),
          t("payroll.deductionAmount"), it.amount, (v) => setItems(items.map((x, j) => (j === i ? { ...x, amount: v } : x))), undefined, () => setItems(items.filter((_, j) => j !== i))))}
        <div><Button type="button" variant="ghost" className="-ml-3" onClick={() => setItems([...items, { name: "", amount: "" }])}>{t("payroll.addDeduction")}</Button></div>
      </fieldset>

      <div className="flex gap-3">
        <Button type="submit">{t("common.save")}</Button>
        <Button type="button" variant="ghost" onClick={onDone}>{t("common.close")}</Button>
      </div>
      {error ? <Alert>{error}</Alert> : null}
    </form>
  );
}

async function download(path: string) {
  const r = await api<{ filename: string; content: string; missing?: string[] }>(path);
  const url = URL.createObjectURL(new Blob([r.content], { type: r.filename.endsWith(".csv") ? "text/csv" : "text/plain" }));
  Object.assign(document.createElement("a"), { href: url, download: r.filename }).click();
  URL.revokeObjectURL(url);
  return r.missing ?? [];
}

export function PayrollRun({ run, perms, payAccounts }: { run: RunData; perms: string[]; payAccounts: { id: string; name: string; nameHi: string | null }[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [missing, setMissing] = useState<string[] | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [payFrom, setPayFrom] = useState(payAccounts[0]?.id ?? "");
  const [payDate, setPayDate] = useState(todayIso());
  const can = (p: string) => perms.includes(p);
  const draft = run.status === "draft";
  const final = run.status === "finalized" || run.status === "paid";
  const act = async (path: string, body: unknown = {}) => {
    setBusy(true);
    setError(null);
    try { await api(`/payroll-runs/${run.id}${path}`, { body }); router.refresh(); } catch (err) { setError(errorText(t, err, NS)); } finally { setBusy(false); }
  };
  const sum = (k: keyof RunSlip) => run.payslips.reduce((s, p) => s + Number(p[k] as string), 0).toFixed(2);
  const other = (p: RunSlip) => [...p.otherDeductions, ...p.loanRecoveries].reduce((s, o) => s + Number(o.amount), 0);
  const cell = "num whitespace-nowrap px-3 py-2 text-right";

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {([["gross", run.gross], ["deductions", run.deductions], ["net", run.netPay], ["employer", run.employerContributions]] as const).map(([k, v]) => (
          <Card key={k}><p className="text-sm text-muted">{t(`payroll.totals.${k}`)}</p><p className="num mt-1 text-xl font-semibold">{rupees(v)}</p></Card>
        ))}
      </div>

      {error ? <Alert>{error}</Alert> : null}
      <div className="flex flex-wrap items-end gap-3">
        {draft && can("payroll.edit") ? <Button variant="outline" disabled={busy} onClick={() => act("/refresh")}><RefreshCw className="size-4" aria-hidden />{t("payroll.refresh")}</Button> : null}
        {draft && can("payroll.approve") ? <Button disabled={busy || !run.payslips.length} onClick={() => act("/finalize")} title={t("payroll.finalizeHint")}>{t("payroll.finalize")}</Button> : null}
        {run.status === "finalized" && can("payroll.submit") ? (
          <form className="flex flex-wrap items-end gap-3" onSubmit={(e) => { e.preventDefault(); void act("/pay", { accountId: payFrom, date: payDate }); }}>
            <Field label={t("payroll.payFrom")} htmlFor="pay-from">
              <Select id="pay-from" value={payFrom} onChange={(e) => setPayFrom(e.target.value)} required>{payAccounts.map((a) => <option key={a.id} value={a.id}>{localName(a, locale)}</option>)}</Select>
            </Field>
            <Field label={t("payroll.payDate")} htmlFor="pay-date"><Input id="pay-date" type="date" value={payDate} onChange={(e) => setPayDate(e.target.value)} required /></Field>
            <Button type="submit" disabled={busy}>{t("payroll.pay")}</Button>
          </form>
        ) : null}
      </div>
      {draft ? <p className="-mt-3 text-xs text-muted">{t("payroll.finalizeHint")}</p> : null}

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-3 py-2 font-medium">{t("payroll.cols.employee")}</th>
                {(["paidDays", "lop", "gross", "pf", "esi", "pt", "lwf", "tds", "other", "net"] as const).map((k) => <th key={k} className="px-3 py-2 text-right font-medium">{t(`payroll.cols.${k}`)}</th>)}
                <th className="w-28" />
              </tr>
            </thead>
            <tbody>
              {run.payslips.map((p) => (
                <FragmentRow key={p.id} editing={editing === p.id} editor={<SlipEditor runId={run.id} slip={p} onDone={() => setEditing(null)} />}>
                  <td className="px-3 py-2"><span className="font-mono text-xs text-muted">{p.code}</span> {localName(p, locale)}</td>
                  <td className={cell}>{Number(p.paidDays)}</td>
                  <td className={cell}>{Number(p.lopDays) || ""}{p.lopOverride !== null ? <span className="ml-1 text-xs text-accent">*</span> : null}</td>
                  <td className={cell}>{rupees(p.gross)}</td>
                  <td className={cell}>{rupees(p.pfEmployee)}</td>
                  <td className={cell}>{Number(p.esiEmployee) ? rupees(p.esiEmployee) : "-"}</td>
                  <td className={cell}>{Number(p.pt) ? rupees(p.pt) : "-"}</td>
                  <td className={cell}>{Number(p.lwfEmployee) ? rupees(p.lwfEmployee) : "-"}</td>
                  <td className={cell}>{Number(p.tds) ? rupees(p.tds) : "-"}</td>
                  <td className={cell}>{other(p) ? rupees(other(p).toFixed(2)) : "-"}</td>
                  <td className={`${cell} font-semibold`}>{rupees(p.netPay)}</td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    {draft && can("payroll.edit") ? <button type="button" onClick={() => setEditing(editing === p.id ? null : p.id)} className="mr-2 text-primary hover:underline">{t("payroll.edit")}</button> : null}
                    <Link href={`/print/payslip/${p.id}`} target="_blank" className="text-primary hover:underline">{t("payroll.view")}</Link>
                  </td>
                </FragmentRow>
              ))}
            </tbody>
            {run.payslips.length ? (
              <tfoot>
                <tr className="border-t-2 border-border font-semibold">
                  <td className="px-3 py-2">{t("common.total")}</td><td /><td />
                  <td className={cell}>{rupees(sum("gross"))}</td><td className={cell}>{rupees(sum("pfEmployee"))}</td><td className={cell}>{rupees(sum("esiEmployee"))}</td>
                  <td className={cell}>{rupees(sum("pt"))}</td><td className={cell}>{rupees(sum("lwfEmployee"))}</td><td className={cell}>{rupees(sum("tds"))}</td>
                  <td className={cell}>{rupees(run.payslips.reduce((s, p) => s + other(p), 0).toFixed(2))}</td><td className={cell}>{rupees(run.netPay)}</td><td />
                </tr>
              </tfoot>
            ) : null}
          </table>
        </div>
      </Card>

      {final && can("payroll.export") ? (
        <Card>
          <h2 className="mb-3 font-semibold">{t("payroll.files.title")}</h2>
          <div className="flex flex-wrap gap-3">
            {(["ecr", "esi", "bank"] as const).map((k) => (
              <Button key={k} variant="outline" onClick={async () => { try { setMissing(await download(`/payroll-runs/${run.id}/${k}`)); } catch (err) { setError(errorText(t, err, NS)); } }}>
                <Download className="size-4" aria-hidden />{t(`payroll.files.${k}`)}
              </Button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button variant="outline" onClick={async () => { try { await download(`/payroll-runs/${run.id}/register`); } catch (err) { setError(errorText(t, err, NS)); } }}>
              <Download className="size-4" aria-hidden />{t("payroll.register")}
            </Button>
            {can("payroll.submit") ? (
              <Button variant="outline" disabled={busy} onClick={async () => {
                setBusy(true);
                try {
                  const r = await api<{ sent: number; skipped: string[] }>(`/payroll-runs/${run.id}/email`, { body: {} });
                  setNotice([t("payroll.emailed", { sent: String(r.sent) }), r.skipped.length ? t("payroll.noEmail", { codes: r.skipped.join(", ") }) : ""].filter(Boolean).join(" "));
                } catch (err) { setError(errorText(t, err, NS)); } finally { setBusy(false); }
              }}>{t("payroll.email")}</Button>
            ) : null}
          </div>
          {notice ? <p className="mt-3 text-sm text-success">{notice}</p> : null}
          {missing?.length ? <p className="mt-3 text-sm text-accent">{t("payroll.files.missing", { codes: missing.join(", ") })}</p> : null}
        </Card>
      ) : null}
    </div>
  );
}

function FragmentRow({ children, editing, editor }: { children: React.ReactNode; editing: boolean; editor: React.ReactNode }) {
  return (
    <>
      <tr className="border-b border-border last:border-0">{children}</tr>
      {editing ? <tr className="border-b border-border"><td colSpan={12}>{editor}</td></tr> : null}
    </>
  );
}
