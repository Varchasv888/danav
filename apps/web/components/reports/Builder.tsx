"use client";

import { Download, Play, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { todayIso } from "@/lib/format";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

const NS = ["reports.errors"];
const PRESETS = ["this_month", "last_month", "this_quarter", "last_quarter", "this_fy", "last_fy", "today", "yesterday", "custom"] as const;
export interface DatasetInfo { key: string; dims: string[]; measures: string[] }
export interface SavedReport {
  id: string; name: string; config: { dataset: string; groupBy: string[]; measures: string[]; period: { preset: string; from?: string; to?: string }; layout?: { columns: string[] } };
  frequency: "daily" | "weekly" | "monthly" | null; hour: number | null; weekday: number | null; day: number | null; recipients: string[];
}
interface Result { from: string; to: string; columns: string[]; rows: string[][]; totals: (string | null)[] }

export function ReportBuilder({ datasets, saved }: { datasets: DatasetInfo[]; saved?: SavedReport }) {
  const t = useTranslations();
  const router = useRouter();
  const [dataset, setDataset] = useState(saved?.config.dataset ?? datasets[0]?.key ?? "");
  const ds = datasets.find((d) => d.key === dataset);
  const [groupBy, setGroupBy] = useState<string[]>(saved?.config.groupBy ?? ["month"]);
  const [measures, setMeasures] = useState<string[]>(saved?.config.measures ?? ds?.measures.slice(0, 2) ?? []);
  const [preset, setPreset] = useState(saved?.config.period.preset ?? "this_month");
  const [from, setFrom] = useState(saved?.config.period.from ?? todayIso().slice(0, 8) + "01");
  const [to, setTo] = useState(saved?.config.period.to ?? todayIso());
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(saved?.name ?? "");
  const [frequency, setFrequency] = useState<string>(saved?.frequency ?? "none");
  const [hour, setHour] = useState(String(saved?.hour ?? 9));
  const [weekday, setWeekday] = useState(String(saved?.weekday ?? 1));
  const [day, setDay] = useState(String(saved?.day ?? 1));
  const [recipients, setRecipients] = useState(saved?.recipients.join(", ") ?? "");
  const [msg, setMsg] = useState<string | null>(null);
  // The column chooser: which columns show and in what order. Untouched, the report shows every column as built.
  const [layout, setLayout] = useState<string[] | null>(saved?.config.layout?.columns ?? null);
  const [mailTo, setMailTo] = useState("");

  const base = () => ({ dataset, groupBy: groupBy.filter((g) => ds?.dims.includes(g)), measures: measures.filter((m) => ds?.measures.includes(m)), period: preset === "custom" ? { preset, from, to } : { preset } });
  const allColumns = [...base().groupBy, ...base().measures];
  // A saved layout keeps only columns that still exist; new columns are added at the end.
  const shown = layout ? [...layout.filter((c) => allColumns.includes(c))] : allColumns;
  const hidden = layout ? allColumns.filter((c) => !shown.includes(c)) : [];
  const config = () => ({ ...base(), ...(layout && shown.length ? { layout: { columns: shown } } : {}) });
  const move = (c: string, by: -1 | 1) => { const i = shown.indexOf(c); const j = i + by; if (i < 0 || j < 0 || j >= shown.length) return; const next = [...shown]; [next[i], next[j]] = [next[j]!, next[i]!]; setLayout(next); };
  const toggleCol = (c: string) => setLayout(shown.includes(c) ? (shown.length > 1 ? shown.filter((x) => x !== c) : shown) : [...shown, c]);
  async function mail() {
    setError(null); setMsg(null);
    try { await api("/reports/builder/email", { body: { name: name || dataset, config: config(), to: mailTo.split(/[,\s]+/).map((r) => r.trim()).filter(Boolean) } }); setMsg(t("reports.builder.mailed")); } catch (err) { setError(errorText(t, err, NS)); }
  }
  const toggle = (list: string[], set: (x: string[]) => void, v: string, max: number) => set(list.includes(v) ? list.filter((x) => x !== v) : list.length < max ? [...list, v] : list);
  const label = (kind: "dims" | "measureNames", k: string) => (t.has(`reports.builder.${kind}.${k}`) ? t(`reports.builder.${kind}.${k}`) : k);

  async function run() {
    setError(null);
    try { setResult(await api<Result>("/reports/builder/run", { body: config() })); } catch (err) { setError(errorText(t, err, NS)); }
  }
  async function csv() {
    setError(null);
    const res = await fetch("/api/reports/builder/csv", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...config(), name: name || dataset }) });
    if (!res.ok) { setError(t("auth.errors.generic")); return; }
    const url = URL.createObjectURL(await res.blob());
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(name || dataset).replace(/[^\w-]+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  async function save() {
    setError(null);
    setMsg(null);
    const schedule = frequency === "none" ? null : {
      frequency, hour: Number(hour), ...(frequency === "weekly" ? { weekday: Number(weekday) } : {}), ...(frequency === "monthly" ? { day: Number(day) } : {}),
      recipients: recipients.split(/[,\s]+/).map((r) => r.trim()).filter(Boolean),
    };
    try {
      await api(saved ? `/reports/saved/${saved.id}` : "/reports/saved", { method: saved ? "PUT" : "POST", body: { name, config: config(), schedule } });
      setMsg(t("reports.builder.saved"));
      router.refresh();
    } catch (err) { setError(errorText(t, err, NS)); }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label={t("reports.builder.dataset")} htmlFor="rb-ds">
            <Select id="rb-ds" value={dataset} onChange={(e) => { setDataset(e.target.value); const d = datasets.find((x) => x.key === e.target.value); setGroupBy(["month"]); setMeasures(d?.measures.slice(0, 2) ?? []); setResult(null); }}>
              {datasets.map((d) => <option key={d.key} value={d.key}>{t(`reports.builder.datasets.${d.key}`)}</option>)}
            </Select>
          </Field>
          <Field label={t("reports.builder.period")} htmlFor="rb-p">
            <Select id="rb-p" value={preset} onChange={(e) => setPreset(e.target.value)}>{PRESETS.map((p) => <option key={p} value={p}>{t(`reports.builder.presets.${p}`)}</option>)}</Select>
          </Field>
          {preset === "custom" ? (
            <div className="flex gap-2">
              <Field label={t("common.from")} htmlFor="rb-f"><Input id="rb-f" type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></Field>
              <Field label={t("common.to")} htmlFor="rb-t"><Input id="rb-t" type="date" value={to} onChange={(e) => setTo(e.target.value)} /></Field>
            </div>
          ) : null}
        </div>
        {ds ? (
          <div className="grid gap-4 md:grid-cols-2">
            <fieldset>
              <legend className="mb-1 text-sm font-medium">{t("reports.builder.groupBy")}</legend>
              <div className="flex flex-wrap gap-2">
                {ds.dims.map((d) => <label key={d} className={`cursor-pointer rounded-full border px-3 py-1 text-sm ${groupBy.includes(d) ? "border-primary bg-primary-soft text-primary" : "border-border"}`}><input type="checkbox" className="sr-only" checked={groupBy.includes(d)} onChange={() => toggle(groupBy, setGroupBy, d, 3)} />{label("dims", d)}</label>)}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-1 text-sm font-medium">{t("reports.builder.measures")}</legend>
              <div className="flex flex-wrap gap-2">
                {ds.measures.map((m) => <label key={m} className={`cursor-pointer rounded-full border px-3 py-1 text-sm ${measures.includes(m) ? "border-primary bg-primary-soft text-primary" : "border-border"}`}><input type="checkbox" className="sr-only" checked={measures.includes(m)} onChange={() => toggle(measures, setMeasures, m, 6)} />{label("measureNames", m)}</label>)}
              </div>
            </fieldset>
          </div>
        ) : null}
        {allColumns.length > 1 ? (
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1 text-sm font-medium">{t("reports.builder.columnsShown")}</legend>
            <div className="flex flex-wrap gap-2">
              {shown.map((c, i) => (
                <span key={c} className="inline-flex items-center gap-1 rounded-full border border-primary bg-primary-soft px-3 py-1 text-sm text-primary">
                  <button type="button" aria-label={t("reports.builder.moveLeft")} disabled={i === 0} onClick={() => move(c, -1)} className="disabled:opacity-30">‹</button>
                  {label(base().groupBy.includes(c) ? "dims" : "measureNames", c)}
                  <button type="button" aria-label={t("reports.builder.moveRight")} disabled={i === shown.length - 1} onClick={() => move(c, 1)} className="disabled:opacity-30">›</button>
                  <button type="button" aria-label={t("reports.builder.hideColumn")} disabled={shown.length === 1} onClick={() => { if (!layout) setLayout(allColumns); toggleCol(c); }} className="ml-1 disabled:opacity-30">×</button>
                </span>
              ))}
              {hidden.map((c) => <button key={c} type="button" onClick={() => toggleCol(c)} className="rounded-full border border-border px-3 py-1 text-sm text-muted">+ {label(base().groupBy.includes(c) ? "dims" : "measureNames", c)}</button>)}
            </div>
          </fieldset>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <Button onClick={run} disabled={!measures.length}><Play className="size-4" aria-hidden />{t("reports.builder.run")}</Button>
          <Button variant="outline" onClick={csv} disabled={!measures.length}><Download className="size-4" aria-hidden />{t("reports.builder.csv")}</Button>
          <Input aria-label={t("reports.builder.mailTo")} placeholder={t("reports.builder.mailTo")} value={mailTo} onChange={(e) => setMailTo(e.target.value)} className="w-64" />
          <Button variant="outline" onClick={mail} disabled={!measures.length || !mailTo.trim()}>{t("reports.builder.mailNow")}</Button>
        </div>
        {error ? <Alert>{error}</Alert> : null}
      </Card>
      {result ? (
        <Card className="p-0">
          <div className="border-b border-border px-5 py-2 text-sm text-muted">{result.from} – {result.to}</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted"><tr className="border-b border-border">
                {result.columns.map((c, i) => <th key={c} className={`px-5 py-2 font-medium ${i >= result.columns.length - result.totals.length ? "text-right" : ""}`}>{i < result.columns.length - result.totals.length ? label("dims", c) : label("measureNames", c)}</th>)}
              </tr></thead>
              <tbody>
                {result.rows.map((r, i) => <tr key={i} className="border-b border-border">{r.map((v, j) => <td key={j} className={`px-5 py-1.5 ${j >= r.length - result.totals.length ? "num text-right" : ""}`}>{v}</td>)}</tr>)}
                {result.rows.length ? (
                  <tr className="font-semibold">
                    <td className="px-5 py-2" colSpan={Math.max(1, result.columns.length - result.totals.length)}>{t("reports.builder.total")}</td>
                    {result.totals.map((v, i) => <td key={i} className="num px-5 py-2 text-right">{v ?? ""}</td>)}
                  </tr>
                ) : <tr><td className="px-5 py-8 text-center text-muted" colSpan={result.columns.length}>{t("reports.builder.noRows")}</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}
      <Card className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <div className="md:col-span-2"><Field label={t("reports.builder.name")} htmlFor="rb-n"><Input id="rb-n" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} /></Field></div>
        <Field label={t("reports.builder.schedule")} htmlFor="rb-fr">
          <Select id="rb-fr" value={frequency} onChange={(e) => setFrequency(e.target.value)}>{(["none", "daily", "weekly", "monthly"] as const).map((f) => <option key={f} value={f}>{t(`reports.builder.frequencies.${f}`)}</option>)}</Select>
        </Field>
        {frequency === "weekly" ? (
          <Field label={t("reports.builder.weekday")} htmlFor="rb-wd"><Select id="rb-wd" value={weekday} onChange={(e) => setWeekday(e.target.value)}>{[1, 2, 3, 4, 5, 6, 0].map((d) => <option key={d} value={d}>{t(`reports.builder.weekdays.${d}`)}</option>)}</Select></Field>
        ) : null}
        {frequency === "monthly" ? <Field label={t("reports.builder.day")} htmlFor="rb-d"><Input id="rb-d" value={day} onChange={(e) => setDay(e.target.value.replace(/\D/g, ""))} inputMode="numeric" className="num" /></Field> : null}
        {frequency !== "none" ? (
          <>
            <Field label={t("reports.builder.hour")} htmlFor="rb-h"><Select id="rb-h" value={hour} onChange={(e) => setHour(e.target.value)}>{Array.from({ length: 24 }, (_, h) => <option key={h} value={h}>{String(h).padStart(2, "0")}:00</option>)}</Select></Field>
            <div className="md:col-span-3 xl:col-span-6"><Field label={t("reports.builder.recipients")} htmlFor="rb-r"><Input id="rb-r" value={recipients} onChange={(e) => setRecipients(e.target.value)} /></Field></div>
          </>
        ) : null}
        <div className="flex items-end gap-3 md:col-span-3 xl:col-span-6">
          <Button variant="outline" onClick={save} disabled={name.trim().length < 2 || !measures.length}><Save className="size-4" aria-hidden />{t("reports.builder.save")}</Button>
          {msg ? <span className="text-sm text-success">{msg}</span> : null}
        </div>
      </Card>
    </div>
  );
}

export function DeleteReport({ id }: { id: string }) {
  const t = useTranslations();
  const router = useRouter();
  return <button type="button" className="text-sm text-danger hover:underline" onClick={async () => { await api(`/reports/saved/${id}`, { method: "DELETE" }); router.refresh(); }}>{t("reports.builder.delete")}</button>;
}
