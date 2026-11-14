"use client";

import clsx from "clsx";
import { ArrowDown, ArrowUp, Columns3, Download, Filter, Printer, Search } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { downloadCsv } from "@/lib/csv";
import { rupees } from "@/lib/format";
import { downloadXlsx } from "@/lib/xlsx-export";
import { Badge } from "../ui";
import { EmptyState } from "./states";

/** What a cell can hold. Plain data only, so a server page can hand a whole register to this component. */
export type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "teal";
export type Cell = string | number | null | { label: string; tone?: Tone };
export type Row = { id: string; href?: string } & Record<string, Cell | undefined>;
export interface Column {
  key: string;
  label: string;
  /** text and link run left; date is shown as 15 Nov 2026 and sorts as ISO; money and count run right in tabular figures and are totalled. */
  type?: "text" | "link" | "date" | "money" | "count" | "status";
  /** Hidden until the person turns it on in Columns. */
  hidden?: boolean;
  /** Keep out of the search (a status label is searchable; a long note is not worth it). */
  noSearch?: boolean;
}

const text = (c: Cell | undefined) => (c === null || c === undefined ? "" : typeof c === "object" ? c.label : String(c));
const num = (c: Cell | undefined) => Number(typeof c === "object" && c ? c.label : c) || 0;
const day = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });

/**
 * A register: the list of documents or records a person scans and acts on. Header is quiet and stays in view, rows are
 * one line, figures are right-aligned in tabular numerals, the first column leads, and the foot states how many rows
 * are shown and totals the money columns for exactly those rows. The person's sort and column choice are remembered per
 * register on this device. Export writes what is on screen: a real Excel file (dates as dates, a SUBTOTAL total) or CSV.
 */
export function DataTable({ id, title, note, columns, rows, empty, limitNote, filters }: {
  id: string; title: string; note?: string; columns: Column[]; rows: Row[]; empty: { title: string; hint?: string }; limitNote?: string; filters?: ReactNode;
}) {
  const t = useTranslations("table");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const [hidden, setHidden] = useState<string[]>(() => columns.filter((c) => c.hidden).map((c) => c.key));
  const [chooser, setChooser] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [menu, setMenu] = useState(false);
  const [filterKey, setFilterKey] = useState<string | null>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [statusPick, setStatusPick] = useState<string | null>(null);
  const KEY = `varchasv.table.${id}`;
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem(KEY) ?? "null") as { sort: typeof sort; hidden: string[] } | null;
      if (v) { setSort(v.sort ?? null); setHidden(v.hidden.filter((k) => columns.some((c) => c.key === k))); }
    } catch { /* storage unavailable */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [KEY]);
  const remember = (s: typeof sort, h: string[]) => { try { localStorage.setItem(KEY, JSON.stringify({ sort: s, hidden: h })); } catch { /* storage unavailable */ } };
  useEffect(() => {
    if (!chooser && !menu) return;
    const off = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) { setChooser(false); setMenu(false); } };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { setChooser(false); setMenu(false); } };
    document.addEventListener("mousedown", off);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", off); document.removeEventListener("keydown", esc); };
  }, [chooser, menu]);

  const shown = columns.filter((c) => !hidden.includes(c.key));
  // Status chips: one per status that appears in the rows, with how many, so "show me only the unpaid ones" is one click.
  const statusKey = columns.find((c) => c.type === "status")?.key;
  const statusCounts = useMemo(() => {
    const m = new Map<string, number>();
    if (statusKey) for (const r of rows) { const s = text(r[statusKey]); if (s) m.set(s, (m.get(s) ?? 0) + 1); }
    return [...m.entries()];
  }, [rows, statusKey]);
  const activeStatus = statusPick && statusCounts.some(([s]) => s === statusPick) ? statusPick : null;
  const view = useMemo(() => {
    const s = q.trim().toLowerCase();
    let out = rows.filter((r) => (!activeStatus || !statusKey || text(r[statusKey]) === activeStatus) && (!s || columns.some((c) => !c.noSearch && c.type !== "money" && text(r[c.key]).toLowerCase().includes(s) || (c.type === "date" && r[c.key] ? day(String(r[c.key])).toLowerCase().includes(s) : false)))
      && Object.entries(columnFilters).every(([key, value]) => !value.trim() || text(r[key]).toLowerCase().includes(value.trim().toLowerCase())));
    if (sort) {
      const col = columns.find((c) => c.key === sort.key);
      const money = col?.type === "money" || col?.type === "count";
      out = [...out].sort((a, b) => (money ? num(a[sort.key]) - num(b[sort.key]) : text(a[sort.key]).localeCompare(text(b[sort.key]), "en", { numeric: true })) * sort.dir);
    }
    return out;
  }, [rows, q, sort, columns, columnFilters, activeStatus, statusKey]);
  const totals = shown.filter((c) => c.type === "money" || c.type === "count").map((c) => ({ key: c.key, type: c.type!, sum: view.reduce((s, r) => s + num(r[c.key]), 0) }));

  const toggleSort = (key: string) => {
    const next = sort?.key !== key ? { key, dir: 1 as const } : sort.dir === 1 ? { key, dir: -1 as const } : null;
    setSort(next);
    remember(next, hidden);
  };
  const toggleCol = (key: string) => {
    const next = hidden.includes(key) ? hidden.filter((k) => k !== key) : [...hidden, key];
    setHidden(next);
    remember(sort, next);
  };
  const exportRows = () => view.map((r) => shown.map((c) => (c.type === "money" || c.type === "count" ? (r[c.key] === null || r[c.key] === undefined ? null : num(r[c.key])) : text(r[c.key]) || null)));
  const exportCols = shown.map((c) => ({ label: c.label, type: (c.type === "money" ? "money" : c.type === "count" ? "count" : c.type === "date" ? "date" : "text") as "money" | "count" | "date" | "text" }));
  const stamp = new Date().toISOString().slice(0, 10);
  async function toExcel() {
    setExporting(true);
    try { await downloadXlsx({ name: `${id}-${stamp}`, title, note: [note, q ? t("filteredBy", { q }) : "", t("generated", { date: stamp })].filter(Boolean).join(". "), columns: exportCols, rows: exportRows(), totalLabel: t("total", { count: view.length }) }); }
    finally { setExporting(false); setMenu(false); }
  }
  const toCsv = () => { downloadCsv(`${id}-${stamp}`, [shown.map((c) => c.label), ...exportRows()]); setMenu(false); };

  const align = (c: Column) => (c.type === "money" || c.type === "count" ? "text-right" : "text-left");
  const btn = "inline-flex h-11 items-center md:h-8 gap-1.5 rounded-lg border border-border-input bg-surface px-2.5 text-[0.8571rem] font-medium text-text shadow-raised hover:bg-surface-2";

  return (
    <section aria-label={title} className="overflow-hidden border border-[#dce0e7] bg-white shadow-none">
      {filters ? <div className="flex min-h-[4.5rem] flex-wrap items-center gap-3 border-b border-[#e0e3e8] bg-white px-3 py-3 print:hidden">{filters}</div> : null}
      <div ref={box} className="relative flex min-h-[3.5rem] flex-wrap items-center gap-2 border-b border-[#e0e3e8] bg-white px-3 py-2.5">
        <label className="relative">
          <span className="sr-only">{t("search")}</span>
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-faint" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search")} type="search"
            className="inset-control h-11 w-64 max-w-full rounded-lg border border-border-input bg-surface pr-2 pl-8 text-[1rem] text-text placeholder:text-faint focus:border-ring focus:outline-none md:h-8 md:text-[0.9286rem]" />
        </label>
        <span className="text-[0.8571rem] text-muted" aria-live="polite">{t("rows", { shown: view.length, total: rows.length })}</span>
        <div className="ml-auto flex items-center gap-2">
          <button type="button" onClick={() => window.print()} className={btn}><Printer className="size-3.5 text-muted" aria-hidden />Print</button>
          <div className="relative max-lg:hidden">
            <button type="button" className={btn} aria-expanded={chooser} aria-haspopup="true" onClick={() => { setChooser((o) => !o); setMenu(false); }}><Columns3 className="size-3.5 text-muted" aria-hidden />{t("columns")}</button>
            {chooser ? (
              <div role="group" aria-label={t("columns")} className="absolute right-0 z-30 mt-1 w-52 rounded-lg border border-border-strong bg-surface p-1 shadow-overlay">
                {columns.map((c) => (
                  <label key={c.key} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[0.9286rem] hover:bg-surface-2">
                    <input type="checkbox" checked={!hidden.includes(c.key)} onChange={() => toggleCol(c.key)} className="size-4 accent-[var(--primary)]" />{c.label}
                  </label>
                ))}
              </div>
            ) : null}
          </div>
          <div className="relative">
            <button type="button" className={btn} aria-expanded={menu} aria-haspopup="menu" disabled={!view.length || exporting} onClick={() => { setMenu((o) => !o); setChooser(false); }}><Download className="size-3.5 text-muted" aria-hidden />{exporting ? t("exporting") : "Excel Report"}</button>
            {menu ? (
              <ul role="menu" className="absolute right-0 z-30 mt-1 w-48 rounded-lg border border-border-strong bg-surface p-1 shadow-overlay">
                <li role="none"><button role="menuitem" className="w-full rounded-md px-2.5 py-1.5 text-left text-[0.9286rem] hover:bg-surface-2" onClick={toExcel}>{t("excel")}</button></li>
                <li role="none"><button role="menuitem" className="w-full rounded-md px-2.5 py-1.5 text-left text-[0.9286rem] hover:bg-surface-2" onClick={toCsv}>{t("csv")}</button></li>
              </ul>
            ) : null}
          </div>
        </div>
      </div>

      {statusCounts.length > 1 ? (
        <div role="group" aria-label={t("status")} className="flex flex-wrap items-center gap-1.5 border-b border-[#e0e3e8] bg-white px-3 py-2 print:hidden">
          {[[null, rows.length] as const, ...statusCounts].map(([s, n]) => {
            const on = (s ?? null) === activeStatus;
            return (
              <button key={s ?? "all"} type="button" aria-pressed={on} onClick={() => setStatusPick(s)}
                className={clsx("inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[0.8571rem] font-medium focus-visible:outline-2 focus-visible:outline-primary pointer-coarse:h-10",
                  on ? "border-primary bg-primary-soft text-primary" : "border-border bg-surface text-muted hover:bg-surface-2 hover:text-text")}>
                {s ?? t("all")}<span className="num text-[0.78rem] opacity-80">{n}</span>
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="max-h-[calc(100dvh-16rem)] min-h-40 overflow-auto max-lg:hidden">
        <table className="w-full min-w-[640px] border-separate border-spacing-0 text-[0.9286rem]">
          <thead>
            <tr>
              <th scope="col" className="sticky top-0 z-10 h-10 w-10 border-b border-[#d7dbe2] bg-[#f4f4f5] px-3 text-left text-[0.78rem] font-semibold text-[#596579]">#</th>
              {shown.map((c, i) => {
                const on = sort?.key === c.key;
                return (
                  <th key={c.key} scope="col" aria-sort={on ? (sort!.dir === 1 ? "ascending" : "descending") : "none"}
                    className={clsx("sticky top-0 z-10 h-10 border-b border-[#d7dbe2] bg-[#f4f4f5] px-3 text-[0.78rem] font-semibold text-[#596579]", align(c), i === 0 && "pl-4")}>
                    <div className={clsx("relative flex items-center gap-2", (c.type === "money" || c.type === "count") && "justify-end")}>
                      <button type="button" onClick={() => toggleSort(c.key)} className="inline-flex items-center gap-1 hover:text-text focus-visible:text-text">
                        <span className={on ? "font-medium text-text" : undefined}>{c.label}</span>
                        {on ? (sort!.dir === 1 ? <ArrowUp className="size-3" aria-hidden /> : <ArrowDown className="size-3" aria-hidden />) : null}
                      </button>
                      <button type="button" aria-label={`Filter ${c.label}`} aria-expanded={filterKey === c.key} onClick={() => setFilterKey((current) => current === c.key ? null : c.key)} className={clsx("shrink-0 text-[#77808d] hover:text-primary", columnFilters[c.key] && "text-primary")}><Filter className="size-3.5" aria-hidden /></button>
                      {filterKey === c.key ? <input autoFocus aria-label={`Filter ${c.label}`} value={columnFilters[c.key] ?? ""} onChange={(e) => setColumnFilters((current) => ({ ...current, [c.key]: e.target.value }))} placeholder={`Filter ${c.label}`} className="absolute top-full right-0 z-30 mt-1 h-8 w-40 rounded border border-border-input bg-white px-2 text-left text-xs font-normal text-text shadow-overlay" /> : null}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {view.map((r) => (
              <tr key={r.id} className="group hover:bg-[#f5f7fa]">
                <td className="h-10 border-b border-[#e0e3e8] px-3 text-left text-[#647084]">{view.indexOf(r) + 1}</td>
                {shown.map((c, i) => {
                  const v = r[c.key];
                  const cls = clsx("h-10 border-b border-[#e0e3e8] px-3 whitespace-nowrap group-last:border-b-0", align(c), i === 0 && "pl-4", (c.type === "money" || c.type === "count") && "num");
                  if (c.type === "link") return <td key={c.key} className={cls}>{r.href ? <Link href={r.href} className="font-medium text-primary hover:underline">{text(v)}</Link> : text(v)}</td>;
                  if (c.type === "date") return <td key={c.key} className={cls}>{v ? day(String(v)) : <span className="text-faint">-</span>}</td>;
                  if (c.type === "money" || c.type === "count") return <td key={c.key} className={cls}>{v === null || v === undefined || v === "" ? <span className="text-faint">-</span> : c.type === "money" ? rupees(num(v)) : num(v).toLocaleString("en-IN")}</td>;
                  if (c.type === "status") return <td key={c.key} className={cls}>{v ? <Badge tone={typeof v === "object" ? v.tone ?? "neutral" : "neutral"}>{text(v)}</Badge> : <span className="text-faint">-</span>}</td>;
                  return <td key={c.key} className={cls}>{text(v) || <span className="text-faint">-</span>}</td>;
                })}
              </tr>
            ))}
          </tbody>
          {view.length && totals.length ? (
            <tfoot>
              <tr>
                <td className="sticky bottom-0 h-10 border-t border-[#d7dbe2] bg-white px-3" />
                {shown.map((c, i) => {
                  const tot = totals.find((x) => x.key === c.key);
                  const cls = clsx("sticky bottom-0 h-10 border-t border-border-strong bg-surface px-3 font-medium", align(c), i === 0 && "pl-4", tot && "num");
                  return <td key={c.key} className={cls}>{i === 0 ? t("total", { count: view.length }) : tot ? (tot.type === "money" ? rupees(tot.sum) : tot.sum.toLocaleString("en-IN")) : null}</td>;
                })}
              </tr>
            </tfoot>
          ) : null}
        </table>
        {!view.length ? (rows.length ? <EmptyState title={t("noMatch", { q })} hint={t("noMatchHint")} action={<button type="button" className={btn} onClick={() => setQ("")}>{t("clear")}</button>} /> : <EmptyState title={empty.title} hint={empty.hint} />) : null}
      </div>
      <div className="lg:hidden">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <label className="flex flex-1 items-center gap-2 text-[0.8571rem] text-muted">
            {t("sortBy")}
            <select value={sort ? `${sort.key}:${sort.dir}` : ""} onChange={(e) => { const [k, d] = e.target.value.split(":"); const next = k ? { key: k, dir: (Number(d) === -1 ? -1 : 1) as 1 | -1 } : null; setSort(next); remember(next, hidden); }}
              className="h-11 min-w-0 flex-1 rounded-md border border-border-input bg-surface px-2 text-[1rem] text-text">
              <option value="">{t("noSort")}</option>
              {shown.flatMap((c) => [<option key={`${c.key}1`} value={`${c.key}:1`}>{c.label} (A-Z)</option>, <option key={`${c.key}-1`} value={`${c.key}:-1`}>{c.label} (Z-A)</option>])}
            </select>
          </label>
        </div>
        <ul>
          {view.map((r) => {
            const [first, ...rest] = shown;
            const money = rest.find((c) => c.type === "money");
            const status = rest.find((c) => c.type === "status");
            const body = rest.filter((c) => c !== money && c !== status && r[c.key] !== null && r[c.key] !== undefined && r[c.key] !== "");
            return (
              <li key={r.id} className="border-b border-rule px-3 py-3 last:border-b-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    {first ? (r.href && first.type === "link" ? <Link href={r.href} className="block min-h-6 text-[1rem] font-medium text-primary">{text(r[first.key])}</Link> : <p className="text-[1rem] font-medium">{text(r[first.key])}</p>) : null}
                    {body.length ? <p className="mt-0.5 text-[0.9286rem] text-muted">{body.map((c) => (c.type === "date" ? day(String(r[c.key])) : text(r[c.key]))).join("  ·  ")}</p> : null}
                  </div>
                  <div className="shrink-0 text-right">
                    {money ? <p className="num text-[1rem] font-medium">{r[money.key] === null || r[money.key] === undefined ? <span className="text-faint">-</span> : rupees(num(r[money.key]))}</p> : null}
                    {status && r[status.key] ? <div className="mt-1"><Badge tone={typeof r[status.key] === "object" ? (r[status.key] as { tone?: Tone }).tone ?? "neutral" : "neutral"}>{text(r[status.key])}</Badge></div> : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        {!view.length ? (rows.length ? <EmptyState title={t("noMatch", { q })} hint={t("noMatchHint")} /> : <EmptyState title={empty.title} hint={empty.hint} />) : null}
        {view.length && totals.length ? <p className="num border-t border-border-strong px-3 py-3 text-[0.9286rem] font-medium">{t("total", { count: view.length })}: {totals.map((x) => (x.type === "money" ? rupees(x.sum) : x.sum.toLocaleString("en-IN"))).join("  ·  ")}</p> : null}
      </div>
      {limitNote ? <p className="border-t border-border px-4 py-2 text-[0.8571rem] text-muted">{limitNote}</p> : null}
    </section>
  );
}
