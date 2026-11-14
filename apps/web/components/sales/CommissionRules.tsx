"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { rupees } from "@/lib/format";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

export interface Rule { id: string; name: string; kind: "all" | "brand" | "category" | "item" | "mrp_range" | "margin" | "age"; match: string | null; itemId: string | null; mrpFrom: string | null; mrpTo: string | null; bandFrom: string | null; bandTo: string | null; ratePct: string; active: boolean }
export interface Report { month: string; totalCommission: string; helperSharePct: string; salesmen: { salesmanId: string; name: string; sales: string; commission: string; sharedWithHelpers: string; uncovered: string; rules: { name: string; sales: string; commission: string }[] }[]; helpers: { employeeId: string; name: string; sales: string; commission: string; workingDays: number; lossOfPayDays: number; daysWorked: number }[] }
const KINDS = ["all", "brand", "category", "item", "mrp_range", "margin", "age"] as const;
const PCT = /^\d*\.?\d{0,2}$/;

/** The commission rules, and under them what each salesman earned for the month. */
export function CommissionRules({ month, rules, report, items, canEdit }: { month: string; rules: Rule[]; report: Report; items: { id: string; name: string }[]; canEdit: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [name, setName] = useState("");
  const [kind, setKind] = useState<(typeof KINDS)[number]>("brand");
  const [match, setMatch] = useState("");
  const [itemId, setItemId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [bandFrom, setBandFrom] = useState("");
  const [bandTo, setBandTo] = useState("");
  const [rate, setRate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const describe = (r: Rule) => r.kind === "all" ? t("commissionRules.kinds.all") : r.kind === "brand" || r.kind === "category" ? `${t(`commissionRules.kinds.${r.kind}`)}: ${r.match}`
    : r.kind === "item" ? `${t("commissionRules.kinds.item")}: ${items.find((i) => i.id === r.itemId)?.name ?? ""}` : r.kind === "margin" || r.kind === "age" ? `${t(`commissionRules.kinds.${r.kind}`)}: ${r.bandFrom ?? 0} - ${r.bandTo ?? t("commissionRules.noLimit")}` : `${t("commissionRules.kinds.mrp_range")}: ${r.mrpFrom ?? 0} - ${r.mrpTo ?? t("commissionRules.noLimit")}`;

  async function call(fn: () => Promise<unknown>) {
    setBusy(true);
    setError(null);
    try { await fn(); router.refresh(); } catch (err) { setError(errorText(t, err, ["commissionRules.errors"])); } finally { setBusy(false); }
  }
  const add = (e: React.FormEvent) => {
    e.preventDefault();
    void call(async () => {
      await api("/salesman-commission/rules", { body: { name, kind, match: match || undefined, itemId: itemId || undefined, mrpFrom: from || undefined, mrpTo: to || undefined, bandFrom: bandFrom || undefined, bandTo: bandTo || undefined, ratePct: rate } });
      setBandFrom(""); setBandTo("");
      setName(""); setMatch(""); setItemId(""); setFrom(""); setTo(""); setRate("");
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {error ? <Alert>{error}</Alert> : null}
      {canEdit ? (
        <form onSubmit={add} method="post" className="grid gap-3 rounded-md border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-6">
          <Field label={t("commissionRules.name")} htmlFor="cr-name"><Input id="cr-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} required /></Field>
          <Field label={t("commissionRules.appliesTo")} htmlFor="cr-kind"><Select id="cr-kind" value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}>{KINDS.map((k) => <option key={k} value={k}>{t(`commissionRules.kinds.${k}`)}</option>)}</Select></Field>
          {kind === "brand" || kind === "category" ? <Field label={t("commissionRules.matchName")} htmlFor="cr-match"><Input id="cr-match" value={match} onChange={(e) => setMatch(e.target.value)} maxLength={80} required /></Field> : null}
          {kind === "item" ? <Field label={t("commissionRules.item")} htmlFor="cr-item"><Select id="cr-item" value={itemId} onChange={(e) => setItemId(e.target.value)} required><option value="">{t("commissionRules.chooseItem")}</option>{items.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}</Select></Field> : null}
          {kind === "mrp_range" ? (
            <>
              <Field label={t("commissionRules.mrpFrom")} htmlFor="cr-from"><Input id="cr-from" inputMode="decimal" value={from} onChange={(e) => PCT.test(e.target.value) && setFrom(e.target.value)} className="num text-right" /></Field>
              <Field label={t("commissionRules.mrpTo")} htmlFor="cr-to"><Input id="cr-to" inputMode="decimal" value={to} onChange={(e) => PCT.test(e.target.value) && setTo(e.target.value)} className="num text-right" /></Field>
            </>
          ) : null}
          {kind === "margin" || kind === "age" ? (
            <>
              <Field label={t(`commissionRules.${kind}From`)} htmlFor="cr-bf"><Input id="cr-bf" inputMode="decimal" value={bandFrom} onChange={(e) => PCT.test(e.target.value) && setBandFrom(e.target.value)} className="num text-right" /></Field>
              <Field label={t(`commissionRules.${kind}To`)} htmlFor="cr-bt"><Input id="cr-bt" inputMode="decimal" value={bandTo} onChange={(e) => PCT.test(e.target.value) && setBandTo(e.target.value)} className="num text-right" /></Field>
            </>
          ) : null}
          <Field label={t("commissionRules.rate")} htmlFor="cr-rate"><Input id="cr-rate" inputMode="decimal" value={rate} onChange={(e) => PCT.test(e.target.value) && setRate(e.target.value)} className="num text-right" required /></Field>
          <div className="flex items-end"><Button type="submit" disabled={busy}>{t("commissionRules.add")}</Button></div>
        </form>
      ) : null}

      <Card className="p-0">
        <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("commissionRules.rules")}</h2>
        {rules.length ? (
          <table className="w-full text-sm">
            <tbody>
              {rules.map((r) => (
                <tr key={r.id} className={`border-b border-rule last:border-0 ${r.active ? "" : "text-muted"}`}>
                  <td className="px-4 py-2 font-medium">{r.name}</td><td className="px-4 py-2">{describe(r)}</td><td className="num px-4 py-2 text-right">{Number(r.ratePct)}%</td>
                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    {canEdit ? (
                      <>
                        <button type="button" disabled={busy} onClick={() => call(() => api(`/salesman-commission/rules/${r.id}`, { method: "PUT", body: { name: r.name, kind: r.kind, match: r.match, itemId: r.itemId, mrpFrom: r.mrpFrom, mrpTo: r.mrpTo, bandFrom: r.bandFrom, bandTo: r.bandTo, ratePct: r.ratePct, active: !r.active } }))} className="mr-3 text-primary hover:underline">{r.active ? t("commissionRules.switchOff") : t("commissionRules.switchOn")}</button>
                        <button type="button" aria-label={t("commissionRules.remove")} disabled={busy} onClick={() => call(() => api(`/salesman-commission/rules/${r.id}`, { method: "DELETE" }))} className="inline-flex size-7 items-center justify-center rounded-md text-muted hover:bg-surface-2"><Trash2 className="size-4" aria-hidden /></button>
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="px-4 py-6 text-center text-muted">{t("commissionRules.noRules")}</p>}
      </Card>

      <form method="get" className="flex items-end gap-3">
        <Field label={t("commissionRules.month")} htmlFor="cr-month"><Input id="cr-month" name="month" type="month" defaultValue={month} className="w-44" /></Field>
        <Button type="submit" variant="outline">{t("commissionRules.show")}</Button>
      </form>
      {report.salesmen.length ? (
        <Card className="p-4">
          <h2 className="mb-2 text-sm font-semibold">{t("commissionRules.chart")}</h2>
          <div className="flex flex-col gap-1.5" role="img" aria-label={t("commissionRules.chart")}>
            {report.salesmen.map((s) => {
              const max = Math.max(...report.salesmen.map((x) => Number(x.sales)), 1);
              return (
                <div key={s.salesmanId} className="grid grid-cols-[8rem_1fr_6rem] items-center gap-2 text-sm">
                  <span className="truncate">{s.name}</span>
                  <span className="h-4 rounded-sm bg-surface-2"><span className="block h-4 rounded-sm bg-primary" style={{ width: `${(Number(s.sales) / max) * 100}%` }} /></span>
                  <span className="num text-right">{rupees(s.sales)}</span>
                </div>
              );
            })}
          </div>
        </Card>
      ) : null}
      <Card className="p-0">
        {report.salesmen.length ? (
          <table className="w-full text-sm">
            <thead className="text-left text-muted"><tr className="border-b border-border"><th className="px-4 py-2 font-medium">{t("commissionRules.salesman")}</th><th className="px-4 py-2 text-right font-medium">{t("commissionRules.sales")}</th><th className="px-4 py-2 text-right font-medium">{t("commissionRules.notCovered")}</th><th className="px-4 py-2 text-right font-medium">{t("commissionRules.commission")}</th></tr></thead>
            <tbody>
              {report.salesmen.map((s) => (
                <tr key={s.salesmanId} className="border-b border-rule last:border-0 align-top">
                  <td className="px-4 py-2"><span className="font-medium">{s.name}</span><div className="text-xs text-muted">{s.rules.map((r) => `${r.name} ${rupees(r.commission)}`).join(", ")}</div></td>
                  <td className="num px-4 py-2 text-right">{rupees(s.sales)}</td><td className="num px-4 py-2 text-right text-muted">{Number(s.uncovered) ? rupees(s.uncovered) : ""}</td><td className="num px-4 py-2 text-right font-semibold">{rupees(s.commission)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr className="border-t border-border"><td className="px-4 py-2 font-semibold" colSpan={3}>{t("commissionRules.total")}</td><td className="num px-4 py-2 text-right font-semibold">{rupees(report.totalCommission)}</td></tr></tfoot>
          </table>
        ) : <p className="px-4 py-6 text-center text-muted">{t("commissionRules.noSales")}</p>}
      </Card>
      {report.helpers.length ? (
        <Card className="p-0">
          <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("commissionRules.helpers", { pct: Number(report.helperSharePct) })}</h2>
          <table className="w-full text-sm">
            <thead className="text-left text-muted"><tr className="border-b border-border"><th className="px-4 py-2 font-medium">{t("commissionRules.helper")}</th><th className="px-4 py-2 text-right font-medium">{t("commissionRules.sales")}</th><th className="px-4 py-2 text-right font-medium">{t("commissionRules.daysWorked")}</th><th className="px-4 py-2 text-right font-medium">{t("commissionRules.commission")}</th></tr></thead>
            <tbody>{report.helpers.map((h) => <tr key={h.employeeId} className="border-b border-rule last:border-0"><td className="px-4 py-2">{h.name}</td><td className="num px-4 py-2 text-right">{rupees(h.sales)}</td><td className="num px-4 py-2 text-right">{h.daysWorked} / {h.workingDays}</td><td className="num px-4 py-2 text-right font-semibold">{rupees(h.commission)}</td></tr>)}</tbody>
          </table>
        </Card>
      ) : null}
    </div>
  );
}
