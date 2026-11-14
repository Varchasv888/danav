"use client";

import { ChevronDown, Copy, Download, GitCompare, Plus, Save, Trash2 } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { NumberField } from "../fields";
import { Alert, Button, Card, Field, Input, Select, cn } from "../ui";

type Ranged = [string, string, string];
interface Draft { id: number; kind: string; values: Record<string, Ranged>; impact?: number }
interface Case { sales: string; grossMargin: string; operatingCost: string; interest: string; profit: string; capex: string; workingCapital: string; cashChange: string; closingCash: string }
interface Result { baseline: Case; cases: { worst: Case; expected: Case; best: Case } }
interface Baseline { from: string; to: string; sales: string; costOfGoods: string; operatingCost: string; cash: string; receivableDays: number; payableDays: number; stockDays: number }
interface Saved { id: string; name: string; note: string | null; createdAt: string; adjustments: Record<string, unknown>[]; result: Result }

/** The fields each kind of change asks for, with what an owner is unsure of shown as worst, expected and best. */
const FIELDS: Record<string, string[]> = {
  hire: ["count", "monthlyCost", "startMonth", "yearlySalesPerHire"],
  store: ["capex", "monthlyRent", "monthlyStaff", "monthlySales", "rampMonths", "startMonth"],
  price: ["changePct", "volumeChangePct"],
  discount: ["extraDiscountPct", "volumeUpliftPct"],
  supplier: ["costChangePct"],
  credit: ["receivableDaysChange", "payableDaysChange"],
  loan: ["amount", "ratePct", "tenureMonths", "startMonth", "capexSpend"],
  demand: ["salesChangePct"],
  stock: ["stockDaysChange"],
};
/** The menu of changes, grouped the way an owner thinks about them. */
const GROUPS: { key: string; kinds: string[] }[] = [
  { key: "workforce", kinds: ["hire"] },
  { key: "pricing", kinds: ["price", "discount", "demand"] },
  { key: "costs", kinds: ["supplier", "stock"] },
  { key: "finance", kinds: ["loan", "credit"] },
  { key: "growth", kinds: ["store"] },
];
/** The unit written to the right of each box. */
const UNIT: Record<string, string> = {
  count: "people", monthlyCost: "₹", startMonth: "month", yearlySalesPerHire: "₹", capex: "₹", monthlyRent: "₹", monthlyStaff: "₹", monthlySales: "₹", rampMonths: "month",
  changePct: "%", volumeChangePct: "%", extraDiscountPct: "%", volumeUpliftPct: "%", costChangePct: "%", receivableDaysChange: "days", payableDaysChange: "days",
  amount: "₹", ratePct: "%", tenureMonths: "month", capexSpend: "₹", salesChangePct: "%", stockDaysChange: "days",
};
const CASES = ["worst", "expected", "best"] as const;
const NS = ["scen.errors"];
let nextId = 1;

const toAdjustment = (d: Draft) => ({ kind: d.kind, ...Object.fromEntries(Object.entries(d.values).map(([k, v]) => [k, v.map((x) => Number(x) || 0) as [number, number, number]])) });
const fromAdjustment = (a: Record<string, unknown>): Draft => {
  const kind = String(a.kind);
  return { id: nextId++, kind, values: Object.fromEntries((FIELDS[kind] ?? []).map((f) => { const r = Array.isArray(a[f]) ? (a[f] as unknown[]) : []; return [f, [0, 1, 2].map((i) => String(Number(r[i] ?? 0))) as Ranged]; })) };
};

/** What-if planning: a strip of today's figures against the projection, a scenario bar, changes as cards, and the year ahead as a worst, expected and best range. */
export function Scenarios() {
  const t = useTranslations();
  const format = useFormatter();
  const [base, setBase] = useState<Baseline | null>(null);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [saved, setSaved] = useState<Saved[]>([]);
  const [current, setCurrent] = useState<string>("");
  const [name, setName] = useState("");
  const [naming, setNaming] = useState(false);
  const [menu, setMenu] = useState(false);
  const [compare, setCompare] = useState<string>("");
  const [comparing, setComparing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const menuBox = useRef<HTMLDivElement>(null);
  const money = (v: string | number) => format.number(Number(v), { style: "currency", currency: "INR", maximumFractionDigits: 0 });
  const signed = (n: number) => `${n >= 0 ? "+" : "-"} ${money(Math.abs(n))}`;
  const fail = useCallback((err: unknown) => setError(errorText(t, err, NS)), [t]);
  const loadSaved = useCallback(() => { api<Saved[]>("/scenarios").then(setSaved).catch(fail); }, [fail]);
  useEffect(() => { api<Baseline>("/scenarios/baseline").then(setBase).catch(fail); loadSaved(); }, [fail, loadSaved]);
  useEffect(() => {
    if (!menu) return;
    const away = (e: MouseEvent) => { if (!menuBox.current?.contains(e.target as Node)) setMenu(false); };
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, [menu]);

  // The numbers run again a moment after any change, so the cards and the result are always the current ones.
  const key = JSON.stringify(drafts.map(toAdjustment));
  useEffect(() => {
    if (!drafts.length) { setResult(null); return; }
    let live = true;
    const h = setTimeout(async () => {
      try {
        const all = await api<Result>("/scenarios/preview", { method: "POST", body: { adjustments: drafts.map(toAdjustment) } });
        const each = await Promise.all(drafts.map((d) => api<Result>("/scenarios/preview", { method: "POST", body: { adjustments: [toAdjustment(d)] } })));
        if (!live) return;
        setResult(all);
        setDrafts((ds) => ds.map((d, i) => (each[i] ? { ...d, impact: Number(each[i]!.cases.expected.profit) - Number(each[i]!.baseline.profit) } : d)));
        setError(null);
      } catch (err) { if (live) fail(err); }
    }, 450);
    return () => { live = false; clearTimeout(h); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const add = (kind: string) => { setDrafts((d) => [...d, { id: nextId++, kind, values: Object.fromEntries(FIELDS[kind]!.map((f) => [f, ["0", "0", "0"] as Ranged])) }]); setMenu(false); };
  const setValue = (id: number, field: string, i: number, v: string) => setDrafts((d) => d.map((x) => (x.id === id ? { ...x, values: { ...x.values, [field]: x.values[field]!.map((y, j) => (j === i ? v : y)) as Ranged } } : x)));
  const fresh = () => { setDrafts([]); setResult(null); setName(""); setCurrent(""); setNaming(false); };
  const open = (id: string) => {
    setCurrent(id);
    const s = saved.find((x) => x.id === id);
    if (!s) { fresh(); return; }
    setDrafts(s.adjustments.map(fromAdjustment));
    setName(s.name);
  };
  const duplicate = () => { setDrafts((ds) => ds.map((d) => ({ ...d, id: nextId++ }))); setName(name ? t("scen.copyOf", { name }) : ""); setCurrent(""); setNaming(true); };
  const save = async () => {
    setBusy(true);
    try { await api("/scenarios", { method: "POST", body: { name: name.trim(), adjustments: drafts.map(toAdjustment) } }); setNaming(false); loadSaved(); }
    catch (err) { fail(err); } finally { setBusy(false); }
  };
  const remove = async (id: string) => { setBusy(true); try { await api(`/scenarios/${id}`, { method: "DELETE" }); if (current === id) fresh(); loadSaved(); } catch (err) { fail(err); } finally { setBusy(false); } };
  const exportCsv = () => {
    if (!result) return;
    const rows = ["sales", "grossMargin", "operatingCost", "interest", "profit", "capex", "workingCapital", "cashChange", "closingCash"] as const;
    const lines = [[t("scen.row"), t("scen.now"), ...CASES.map((c) => t(`scen.${c}`))], ...rows.map((r) => [t(`scen.rows.${r}`), result.baseline[r], result.cases.worst[r], result.cases.expected[r], result.cases.best[r]])];
    const blob = new Blob([lines.map((l) => l.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(name || "scenario").replace(/[^\w-]+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // Today's figures against the expected projection.
  const days = (field: "receivableDaysChange" | "payableDaysChange" | "stockDaysChange") => drafts.reduce((n, d) => n + Number(d.values[field]?.[1] ?? 0), 0);
  const gmPct = (sales: string, margin: string) => (Number(sales) ? (Number(margin) / Number(sales)) * 100 : 0);
  const exp = result?.cases.expected;
  const baseMargin = base ? gmPct(base.sales, String(Number(base.sales) - Number(base.costOfGoods))) : 0;
  const cards: { k: string; now: string; then?: string; delta?: number; good: "up" | "down" }[] = base ? [
    { k: "sales", now: money(base.sales), ...(exp ? { then: money(exp.sales), delta: Number(exp.sales) - Number(base.sales) } : {}), good: "up" },
    { k: "grossMarginPct", now: `${baseMargin.toFixed(1)}%`, ...(exp ? { then: `${gmPct(exp.sales, exp.grossMargin).toFixed(1)}%`, delta: gmPct(exp.sales, exp.grossMargin) - baseMargin } : {}), good: "up" },
    { k: "operatingCost", now: money(base.operatingCost), ...(exp ? { then: money(exp.operatingCost), delta: Number(exp.operatingCost) - Number(base.operatingCost) } : {}), good: "down" },
    { k: "cash", now: money(base.cash), ...(exp ? { then: money(exp.closingCash), delta: Number(exp.closingCash) - Number(base.cash) } : {}), good: "up" },
  ] : [];
  const wc = base ? ([["receivableDays", base.receivableDays, days("receivableDaysChange")], ["payableDays", base.payableDays, days("payableDaysChange")], ["stockDays", base.stockDays, days("stockDaysChange")]] as const) : [];
  const other = saved.find((s) => s.id === compare);

  return (
    <div className="flex flex-col gap-4">
      {error ? <Alert>{error}</Alert> : null}

      {/* Today against the projection. */}
      {base ? (
        <section aria-label={t("scen.baselineHelp", { from: base.from, to: base.to })}>
          <p className="mb-2 text-[13px] text-muted">{t("scen.baselineHelp", { from: base.from, to: base.to })}</p>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            {cards.map((c) => (
              <Card key={c.k} className="p-3">
                <p className="text-xs font-medium text-muted">{t(`scen.base.${c.k}`)}</p>
                <p className="mt-0.5 text-lg leading-7 font-semibold tabular-nums">{c.then ?? c.now}</p>
                <p className="flex items-baseline gap-1.5 text-xs tabular-nums text-muted">
                  <span>{t("scen.now")} {c.now}</span>
                  {c.delta !== undefined && Math.abs(c.delta) > 0.0001 ? <span className={cn("font-semibold", (c.delta > 0) === (c.good === "up") ? "text-success" : "text-danger")}>{c.delta > 0 ? "+" : "-"}{c.k === "grossMarginPct" ? `${Math.abs(c.delta).toFixed(1)} pts` : money(Math.abs(c.delta))}</span> : null}
                </p>
              </Card>
            ))}
            <Card className="p-3">
              <p className="text-xs font-medium text-muted">{t("scen.base.workingCapitalDays")}</p>
              <dl className="mt-1 grid grid-cols-[1fr_auto] gap-x-2 text-xs tabular-nums">
                {wc.map(([k, now, change]) => (
                  <div key={k} className="contents"><dt className="text-muted">{t(`scen.base.${k}`)}</dt><dd className="text-right font-semibold">{now}{change ? <span className={cn("ml-1", change > 0 ? (k === "payableDays" ? "text-success" : "text-danger") : (k === "payableDays" ? "text-danger" : "text-success"))}>{change > 0 ? "+" : ""}{change}</span> : null}</dd></div>
                ))}
              </dl>
            </Card>
          </div>
        </section>
      ) : null}

      {/* Scenario bar. */}
      <Card className="flex flex-wrap items-end gap-2 p-3">
        <div className="min-w-48">
          <Field label={t("scen.scenario")} htmlFor="sc-pick">
            <Select id="sc-pick" value={current} onChange={(e) => open(e.target.value)}>
              <option value="">{t("scen.unsaved")}</option>
              {saved.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </Field>
        </div>
        <Button type="button" variant="outline" onClick={fresh}><Plus className="size-4" aria-hidden />{t("scen.new")}</Button>
        <Button type="button" variant="outline" disabled={!drafts.length} onClick={duplicate}><Copy className="size-4" aria-hidden />{t("scen.duplicate")}</Button>
        <Button type="button" variant="outline" disabled={!saved.length || !drafts.length} aria-pressed={comparing} onClick={() => { setComparing((c) => !c); if (!compare && saved[0]) setCompare(saved.find((s) => s.id !== current)?.id ?? saved[0].id); }}><GitCompare className="size-4" aria-hidden />{t("scen.compare")}</Button>
        <Button type="button" variant="outline" disabled={!drafts.length} onClick={() => setNaming(true)}><Save className="size-4" aria-hidden />{t("scen.save")}</Button>
        <Button type="button" variant="outline" disabled={!result} onClick={exportCsv}><Download className="size-4" aria-hidden />{t("scen.export")}</Button>
        {current ? <Button type="button" variant="ghost" disabled={busy} onClick={() => void remove(current)} aria-label={t("scen.delete")}><Trash2 className="size-4" aria-hidden />{t("scen.delete")}</Button> : null}
        {naming ? (
          <div className="flex w-full items-end gap-2 border-t border-border pt-3">
            <Field label={t("scen.name")} htmlFor="sc-name" hint={t("scen.nameHint")}><Input id="sc-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} autoFocus className="w-72" onKeyDown={(e) => { if (e.key === "Enter" && name.trim().length >= 2) { e.preventDefault(); void save(); } }} /></Field>
            <Button type="button" loading={busy} disabled={name.trim().length < 2} onClick={() => void save()}>{t("scen.saveScenario")}</Button>
            <Button type="button" variant="ghost" onClick={() => setNaming(false)}>{t("common.cancel")}</Button>
          </div>
        ) : null}
      </Card>

      {/* Add a change, and the changes. */}
      <div className="flex items-center gap-3">
        <div ref={menuBox} className="relative">
          <Button type="button" aria-haspopup="menu" aria-expanded={menu} onClick={() => setMenu((m) => !m)}><Plus className="size-4" aria-hidden />{t("scen.addChange")}<ChevronDown className="size-4" aria-hidden /></Button>
          {menu ? (
            <div role="menu" className="absolute top-full left-0 z-30 mt-1.5 w-64 origin-top-left animate-pop-in rounded-xl border border-border bg-surface py-1 shadow-flyout motion-reduce:animate-none">
              {GROUPS.map((g) => (
                <div key={g.key} role="group" aria-label={t(`scen.groups.${g.key}`)}>
                  <p className="px-3 pt-2 pb-0.5 text-xs font-semibold tracking-wider text-muted uppercase">{t(`scen.groups.${g.key}`)}</p>
                  {g.kinds.map((k) => <button key={k} role="menuitem" type="button" onClick={() => add(k)} className="block w-full px-3 py-1.5 text-left text-sm hover:bg-primary-soft">{t(`scen.kinds.${k}`)}</button>)}
                </div>
              ))}
            </div>
          ) : null}
        </div>
        {drafts.length === 0 ? <p className="text-sm text-muted">{t("scen.empty")}</p> : null}
      </div>

      <div className="flex flex-col gap-3">
        {drafts.map((d) => (
          <Card key={d.id} className="p-0">
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
              <span className="text-sm font-semibold">{t(`scen.kinds.${d.kind}`)}</span>
              <span className="flex items-center gap-2">
                {d.impact !== undefined ? <span className={cn("rounded-full border px-2 py-0.5 text-xs font-semibold tabular-nums", d.impact >= 0 ? "border-success/30 bg-success-soft text-success" : "border-danger/30 bg-danger-soft text-danger")}>{signed(d.impact)} {t("scen.profitWord")}</span> : null}
                <button type="button" onClick={() => setDrafts((x) => x.filter((y) => y.id !== d.id))} aria-label={t("scen.removeChange")} title={t("scen.removeChange")} className="grid size-8 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-danger"><Trash2 className="size-4" aria-hidden /></button>
              </span>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-muted"><th className="px-4 py-1.5 font-medium">{t("scen.input")}</th><th className="px-2 py-1.5 font-medium">{t("scen.now")}</th>{CASES.map((c) => <th key={c} className="px-2 py-1.5 font-medium">{t(`scen.${c}`)}</th>)}</tr></thead>
              <tbody>
                {FIELDS[d.kind]!.map((f) => {
                  const unit = UNIT[f] ?? "";
                  const now = f === "receivableDaysChange" ? base?.receivableDays : f === "payableDaysChange" ? base?.payableDays : f === "stockDaysChange" ? base?.stockDays : 0;
                  return (
                    <tr key={f} className="border-t border-rule">
                      <td className="px-4 py-1.5">{t(`scen.fields.${f}`)}</td>
                      <td className="px-2 py-1.5 tabular-nums text-muted">{now ?? 0}</td>
                      {CASES.map((c, i) => (
                        <td key={c} className="px-2 py-1">
                          <span className="inline-flex items-center gap-1.5">
                            <NumberField value={d.values[f]![i]!} onValueChange={(v) => setValue(d.id, f, i, v)} decimals={2} negative aria-label={`${t(`scen.fields.${f}`)} ${t(`scen.${c}`)}`} className="h-9 w-24" />
                            <span className="w-10 text-xs text-muted">{unit === "people" || unit === "month" || unit === "days" ? t(`scen.units.${unit}`) : unit}</span>
                          </span>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        ))}
      </div>

      {/* The result. */}
      {result ? <ResultPanel result={result} money={money} signed={signed} t={t} /> : null}

      {comparing && other && result ? (
        <Card className="p-0">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
            <span className="text-sm font-semibold">{t("scen.compare")}</span>
            <Select value={compare} onChange={(e) => setCompare(e.target.value)} aria-label={t("scen.compare")} className="w-64">{saved.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</Select>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-muted"><th className="px-4 py-1.5 font-medium">{t("scen.row")}</th><th className="px-2 py-1.5 text-right font-medium">{t("scen.unsaved")} ({t("scen.expected")})</th><th className="px-2 py-1.5 text-right font-medium">{other.name} ({t("scen.expected")})</th><th className="px-4 py-1.5 text-right font-medium">{t("scen.difference")}</th></tr></thead>
            <tbody>
              {(["sales", "operatingCost", "profit", "closingCash"] as const).map((r) => {
                const a = Number(result.cases.expected[r]), b = Number(other.result.cases.expected[r]);
                return <tr key={r} className="border-t border-rule"><td className="px-4 py-1.5">{t(`scen.rows.${r}`)}</td><td className="px-2 py-1.5 text-right tabular-nums">{money(a)}</td><td className="px-2 py-1.5 text-right tabular-nums">{money(b)}</td><td className={cn("px-4 py-1.5 text-right font-semibold tabular-nums", a - b >= 0 ? "text-success" : "text-danger")}>{signed(a - b)}</td></tr>;
              })}
            </tbody>
          </table>
        </Card>
      ) : null}
    </div>
  );
}

/** Worst, expected and best side by side for sales, profit and the cash at the year's end, each as a bar against the same scale, with the table of every figure below. */
function ResultPanel({ result, money, signed, t }: { result: Result; money: (v: string | number) => string; signed: (n: number) => string; t: ReturnType<typeof useTranslations> }) {
  const metrics = ["sales", "profit", "closingCash"] as const;
  const CASES3 = ["worst", "expected", "best"] as const;
  const tone = { worst: "var(--danger)", expected: "var(--primary)", best: "var(--success)" } as const;
  const ROWS = ["sales", "grossMargin", "operatingCost", "interest", "profit", "capex", "workingCapital", "cashChange", "closingCash"] as const;
  return (
    <Card className="p-0">
      <div className="grid gap-4 p-4 md:grid-cols-3">
        {metrics.map((m) => {
          const vals = CASES3.map((c) => Number(result.cases[c][m]));
          const max = Math.max(...vals.map(Math.abs), Number(result.baseline[m]) ? Math.abs(Number(result.baseline[m])) : 0, 1);
          return (
            <section key={m} aria-label={t(`scen.rows.${m}`)}>
              <h3 className="text-xs font-semibold tracking-wider text-muted uppercase">{t(`scen.rows.${m}`)}</h3>
              <p className="text-xs text-muted tabular-nums">{t("scen.now")} {money(result.baseline[m])}</p>
              <div className="mt-2 flex flex-col gap-1.5">
                {CASES3.map((c, i) => (
                  <div key={c} className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-2 text-xs">
                    <span className="text-muted">{t(`scen.${c}`)}</span>
                    <span className="h-3 rounded-sm bg-surface-2"><span className="block h-3 rounded-sm" style={{ width: `${Math.max((Math.abs(vals[i]!) / max) * 100, 2)}%`, background: tone[c], opacity: vals[i]! < 0 ? 0.55 : 1 }} /></span>
                    <span className={cn("min-w-20 text-right font-semibold tabular-nums", vals[i]! < 0 && "text-danger")}>{money(vals[i]!)}</span>
                  </div>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-muted tabular-nums">{t("scen.expected")}: {signed(vals[1]! - Number(result.baseline[m]))}</p>
            </section>
          );
        })}
      </div>
      <table className="w-full border-t border-border text-sm">
        <thead className="text-left text-xs text-muted"><tr><th className="px-4 py-1.5 font-medium" /><th className="px-4 py-1.5 text-right font-medium">{t("scen.now")}</th>{CASES3.map((c) => <th key={c} className="px-4 py-1.5 text-right font-medium">{t(`scen.${c}`)}</th>)}</tr></thead>
        <tbody>{ROWS.map((row) => (
          <tr key={row} className="border-t border-rule">
            <td className={cn("px-4 py-1.5", row === "profit" && "font-semibold")}>{t(`scen.rows.${row}`)}</td>
            {[result.baseline, result.cases.worst, result.cases.expected, result.cases.best].map((c, i) => <td key={i} className={cn("px-4 py-1.5 text-right tabular-nums", row === "profit" && "font-semibold", Number(c[row]) < 0 && ["profit", "cashChange", "closingCash"].includes(row) && "text-danger")}>{money(c[row])}</td>)}
          </tr>
        ))}</tbody>
      </table>
    </Card>
  );
}
