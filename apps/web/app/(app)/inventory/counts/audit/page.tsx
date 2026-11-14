import { getFormatter, getTranslations } from "next-intl/server";
import { Card, PageHeader } from "@/components/ui";
import { todayIso } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

interface Audit {
  from: string; to: string;
  counts: { countId: string; number: string; name: string; store: string; date: string; status: string; spotCheck: boolean; shortPieces: string; excessPieces: string; shortValue: string; excessValue: string; netValue: string; accuracyPct: string | null }[];
  totals: { shortValue: string; excessValue: string; netValue: string };
  repeatedShortages: { item: string; counts: number; shortPieces: string; shortValue: string }[];
}

export async function generateMetadata() {
  return { title: (await getTranslations("stockAudit"))("title") };
}

export default async function StockAuditPage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  const q = await searchParams;
  const to = q.to && /^\d{4}-\d{2}-\d{2}$/.test(q.to) ? q.to : todayIso();
  const from = q.from && /^\d{4}-\d{2}-\d{2}$/.test(q.from) ? q.from : `${to.slice(0, 4)}-01-01`;
  const t = await getTranslations("stockAudit");
  const format = await getFormatter();
  const a = await serverApi<Audit>(`/reports/stock-audit?from=${from}&to=${to}`);
  const money = (v: string) => format.number(Number(v), { style: "currency", currency: "INR" });
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <form method="get" className="mb-4 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm">{t("from")}<input type="date" name="from" defaultValue={from} className="h-9 rounded-md border border-border bg-surface px-2" /></label>
        <label className="flex flex-col gap-1 text-sm">{t("to")}<input type="date" name="to" defaultValue={to} className="h-9 rounded-md border border-border bg-surface px-2" /></label>
        <button type="submit" className="h-9 rounded-md border border-border px-3 text-sm hover:bg-surface-2">{t("show")}</button>
      </form>
      <Card className="overflow-x-auto p-0">
        {a.counts.length === 0 ? <p className="p-4 text-sm text-muted">{t("empty")}</p> : (
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted"><tr className="border-y border-rule"><th className="px-4 py-1.5 font-medium">{t("count")}</th><th className="px-4 py-1.5 font-medium">{t("store")}</th><th className="px-4 py-1.5 text-right font-medium">{t("short")}</th><th className="px-4 py-1.5 text-right font-medium">{t("excess")}</th><th className="px-4 py-1.5 text-right font-medium">{t("net")}</th><th className="px-4 py-1.5 text-right font-medium">{t("accuracy")}</th></tr></thead>
            <tbody>{a.counts.map((c) => (
              <tr key={c.countId} className="border-b border-rule last:border-0"><td className="px-4 py-1.5">{c.number}<div className="text-xs text-muted">{c.name} · {c.date}{c.spotCheck ? ` · ${t("spotCheck")}` : ""}</div></td><td className="px-4 py-1.5">{c.store}</td><td className="num px-4 py-1.5 text-right">{c.shortPieces} · {money(c.shortValue)}</td><td className="num px-4 py-1.5 text-right">{c.excessPieces} · {money(c.excessValue)}</td><td className="num px-4 py-1.5 text-right">{money(c.netValue)}</td><td className="num px-4 py-1.5 text-right">{c.accuracyPct ? `${c.accuracyPct}%` : ""}</td></tr>
            ))}</tbody>
            <tfoot><tr className="border-t border-rule font-medium"><td className="px-4 py-1.5" colSpan={2}>{t("total")}</td><td className="num px-4 py-1.5 text-right">{money(a.totals.shortValue)}</td><td className="num px-4 py-1.5 text-right">{money(a.totals.excessValue)}</td><td className="num px-4 py-1.5 text-right">{money(a.totals.netValue)}</td><td /></tr></tfoot>
          </table>
        )}
      </Card>
      {a.repeatedShortages.length ? (
        <Card className="mt-4 p-0">
          <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("repeated")}</h2>
          <table className="w-full text-sm"><tbody>{a.repeatedShortages.map((r) => <tr key={r.item} className="border-b border-rule last:border-0"><td className="px-4 py-1.5">{r.item}</td><td className="num px-4 py-1.5 text-right">{t("inCounts", { n: r.counts })}</td><td className="num px-4 py-1.5 text-right">{t("shortN", { n: r.shortPieces })}</td><td className="num px-4 py-1.5 text-right">{money(r.shortValue)}</td></tr>)}</tbody></table>
        </Card>
      ) : null}
    </>
  );
}
