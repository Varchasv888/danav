"use client";

import { ChevronDown, FileSpreadsheet, Printer } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { periodOf, periodRange, PERIODS, type Period } from "@/lib/report-periods";
import { Input } from "../ui";

export interface BarFilter { name: string; label: string; options: { value: string; label: string }[]; value: string }

/**
 * The header every list report shares: a period drop-down (today, this month, last month, this year and so on), the date range it stands for,
 * report-specific filters as drop-downs, and the Excel and Print buttons at the right. Changing anything reloads the report for the new range.
 */
export function ReportBar({ from, to, today, filters = [], onExcel, singleDate = false }: { from: string; to: string; today: string; filters?: BarFilter[]; onExcel?: () => void; singleDate?: boolean }) {
  const t = useTranslations("reportBar");
  const router = useRouter();
  const path = usePathname();
  const params = useSearchParams();
  const period = periodOf(from, to, today);

  const go = (next: Record<string, string>) => {
    const q = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) { if (v) q.set(k, v); else q.delete(k); }
    router.push(`${path}?${q.toString()}`);
  };
  const pick = (p: Period) => {
    const r = periodRange(p, today);
    if (r) go({ from: r.from, to: r.to });
  };

  return (
    <div className="mb-3 flex flex-wrap items-start justify-between gap-3 rounded-lg border border-border bg-surface p-3 print:hidden">
      <div className="flex flex-wrap items-center gap-3">
        {singleDate ? (
          <div className="flex items-center gap-2 rounded-md border border-border bg-surface-2/50 pl-2.5 text-sm">
            <span className="font-medium text-muted">{t("date")}</span>
            <Input type="date" aria-label={t("date")} value={from} onChange={(e) => e.target.value && go({ from: e.target.value, to: e.target.value })} className="h-9 w-40 border-0 bg-transparent" />
          </div>
        ) : (
          <>
            <label className="relative inline-flex items-center">
              <span className="sr-only">{t("period")}</span>
              <select value={period} onChange={(e) => pick(e.target.value as Period)}
                className="h-10 cursor-pointer appearance-none rounded-md border border-transparent bg-transparent pr-7 pl-1 text-[1.1429rem] font-semibold text-text hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-primary">
                {PERIODS.map((p) => <option key={p} value={p}>{t(`p.${p}`)}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-1 size-4 text-muted" aria-hidden />
            </label>
            <div className="flex items-center overflow-hidden rounded-md border border-border text-sm">
              <span className="self-stretch bg-surface-2 px-2.5 py-2 text-[0.8571rem] font-semibold text-muted">{t("between")}</span>
              <Input type="date" aria-label={t("from")} value={from} onChange={(e) => e.target.value && go({ from: e.target.value, to: to < e.target.value ? e.target.value : to })} className="h-9 w-40 rounded-none border-0" />
              <span className="px-1 text-muted">{t("to")}</span>
              <Input type="date" aria-label={t("toDate")} value={to} onChange={(e) => e.target.value && go({ to: e.target.value, from: from > e.target.value ? e.target.value : from })} className="h-9 w-40 rounded-none border-0" />
            </div>
          </>
        )}
        {filters.map((f) => (
          <label key={f.name} className="inline-flex items-center">
            <span className="sr-only">{f.label}</span>
            <select value={f.value} onChange={(e) => go({ [f.name]: e.target.value })} className="h-10 rounded-md border border-border bg-surface px-2.5 text-sm focus-visible:outline-2 focus-visible:outline-primary">
              {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
        ))}
      </div>
      <div className="flex items-start gap-4">
        {onExcel ? (
          <button type="button" onClick={onExcel} className="flex flex-col items-center gap-0.5 rounded-md px-2 py-1 text-[0.75rem] text-muted hover:bg-surface-2 hover:text-text focus-visible:outline-2 focus-visible:outline-primary">
            <FileSpreadsheet className="size-6 text-success" aria-hidden />{t("excel")}
          </button>
        ) : null}
        <button type="button" onClick={() => window.print()} className="flex flex-col items-center gap-0.5 rounded-md px-2 py-1 text-[0.75rem] text-muted hover:bg-surface-2 hover:text-text focus-visible:outline-2 focus-visible:outline-primary">
          <Printer className="size-6" aria-hidden />{t("print")}
        </button>
      </div>
    </div>
  );
}
