"use client";

import clsx from "clsx";
import { Filter, Search } from "lucide-react";
import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Card } from "../ui";
import { ReportBar, type BarFilter } from "./ReportBar";
import { useReportDecimals } from "./ReportDecimals";

export interface ListColumn { key: string; label: string; kind?: "text" | "money" | "date" | "number" | "tag"; link?: boolean }
export interface ListFooter { label: string; value: string; tone?: "in" | "out" | "plain" }
export type ListRow = Record<string, string | number | boolean | null>;

/**
 * A list report the way the reports screens lay it out: the period bar, a search box, a table with a funnel on each column head to filter that column,
 * the open-document link on each row, and a footer of totals in green (in) and red (out). The Excel button saves what is on screen as a CSV file.
 */
export function ReportList({ title, from, to, today, singleDate, filters, columns, rows, footer, empty, fileName }: {
  title: string; from: string; to: string; today: string; singleDate?: boolean; filters?: BarFilter[];
  columns: ListColumn[]; rows: ListRow[]; footer: ListFooter[]; empty: string; fileName: string;
}) {
  const t = useTranslations("reportBar");
  const format = useFormatter();
  const [query, setQuery] = useState("");
  const [colFilter, setColFilter] = useState<Record<string, string>>({});
  const [open, setOpen] = useState<string | null>(null);

  const decimals = useReportDecimals();
  const money = (v: unknown) => format.number(Number(v), { style: "currency", currency: "INR", minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const text = (c: ListColumn, r: ListRow) => {
    const v = r[c.key];
    if (v === null || v === undefined || v === "") return "";
    if (c.kind === "money") return money(v);
    if (c.kind === "date") return format.dateTime(new Date(`${String(v)}T00:00:00`), { day: "2-digit", month: "short", year: "numeric" });
    return String(v);
  };
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => (!q || columns.some((c) => text(c, r).toLowerCase().includes(q)))
      && columns.every((c) => !colFilter[c.key] || text(c, r).toLowerCase().includes(colFilter[c.key]!.toLowerCase())));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, query, colFilter, columns]);

  function excel() {
    const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
    const lines = [columns.map((c) => esc(c.label)).join(","), ...shown.map((r) => columns.map((c) => esc(c.kind === "money" || c.kind === "number" ? String(r[c.key] ?? "") : text(c, r))).join(","))];
    const blob = new Blob([`﻿${lines.join("\n")}`], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${fileName}-${from}-${to}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="flex flex-col lg:min-h-0 lg:flex-1">
      <ReportBar from={from} to={to} today={today} filters={filters ?? []} onExcel={excel} {...(singleDate ? { singleDate } : {})} />
      <Card className="flex min-h-0 flex-col overflow-hidden p-0 lg:flex-1">
        <div className="flex items-center justify-between gap-3 px-3 pt-3">
          <label className="flex h-10 w-64 items-center gap-2 rounded-md border border-border-input bg-surface px-3 text-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25 print:hidden">
            <Search className="size-4 shrink-0 text-muted" aria-hidden />
            <span className="sr-only">{t("search")}</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} type="search" autoComplete="off" className="min-w-0 flex-1 bg-transparent outline-none" />
          </label>
          <h2 className="hidden text-base font-semibold print:block">{title}</h2>
        </div>
        <div className="max-h-[calc(100dvh-22rem)] min-h-56 overflow-auto lg:max-h-none lg:min-h-0 lg:flex-1">
          <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="text-left text-[0.75rem] tracking-wide text-muted uppercase">
                <th scope="col" className="sticky top-0 z-10 w-10 border-b border-border-strong bg-surface-2 px-3 py-2.5 font-semibold">#</th>
                {columns.map((c) => (
                  <th key={c.key} scope="col" className={clsx("sticky top-0 z-10 border-b border-border-strong bg-surface-2 px-3 py-2.5 font-semibold", (c.kind === "money" || c.kind === "number") && "text-right")}>
                    <span className="inline-flex items-center gap-1.5">
                      {c.label}
                      <button type="button" aria-label={t("filterColumn", { column: c.label })} onClick={() => setOpen(open === c.key ? null : c.key)} className={clsx("rounded p-0.5 hover:bg-border print:hidden", colFilter[c.key] ? "text-primary" : "text-faint")}>
                        <Filter className="size-3.5" aria-hidden />
                      </button>
                    </span>
                    {open === c.key ? (
                      <input autoFocus value={colFilter[c.key] ?? ""} onChange={(e) => setColFilter((f) => ({ ...f, [c.key]: e.target.value }))} onKeyDown={(e) => { if (e.key === "Escape" || e.key === "Enter") setOpen(null); }}
                        aria-label={t("filterColumn", { column: c.label })} className="mt-1 block w-full rounded border border-border-input bg-surface px-2 py-1 text-xs font-normal normal-case text-text" />
                    ) : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((r, i) => (
                <tr key={`${i}-${String(r.id ?? "")}`} className="hover:bg-surface-2/50">
                  <td className="border-b border-rule px-3 py-2 text-muted">{i + 1}</td>
                  {columns.map((c) => (
                    <td key={c.key} className={clsx("border-b border-rule px-3 py-2", (c.kind === "money" || c.kind === "number") && "num text-right", c.kind === "date" && "whitespace-nowrap")}>
                      {c.link && r.href ? <Link href={String(r.href)} className="font-mono text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary">{text(c, r)}</Link>
                        : c.kind === "tag" ? <span className="rounded bg-surface-2 px-1.5 py-0.5 text-xs text-muted">{text(c, r)}</span> : text(c, r)}
                    </td>
                  ))}
                </tr>
              ))}
              {!shown.length ? <tr><td colSpan={columns.length + 1} className="px-4 py-14 text-center text-muted">{empty}</td></tr> : null}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-border-strong bg-surface px-4 py-2.5 text-sm font-medium">
          {footer.map((f) => (
            <span key={f.label} className={clsx(f.tone === "in" && "text-success", f.tone === "out" && "text-danger")}>{f.label}: <span className="num">{f.value}</span></span>
          ))}
        </div>
      </Card>
    </div>
  );
}
