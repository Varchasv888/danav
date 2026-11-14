import { getFormatter, getTranslations } from "next-intl/server";
import { Card, PageHeader } from "@/components/ui";
import { todayIso } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

interface Data { checked: number; exceptions: number; overCharged: string; underCharged: string; rows: { kind: string; id: string; number: string; date: string; item: string; pieceValue: string; charged: string; expected: string; taxDifference: string }[] }

export async function generateMetadata() {
  return { title: (await getTranslations("slabCheck"))("title") };
}

/** Sales where the GST rate charged is not the one the piece value calls for. */
export default async function SlabExceptionsPage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  const q = await searchParams;
  const to = q.to && /^\d{4}-\d{2}-\d{2}$/.test(q.to) ? q.to : todayIso();
  const from = q.from && /^\d{4}-\d{2}-\d{2}$/.test(q.from) ? q.from : `${to.slice(0, 7)}-01`;
  const t = await getTranslations("slabCheck");
  const format = await getFormatter();
  const d = await serverApi<Data>(`/gst/work/slab-exceptions?from=${from}&to=${to}`);
  const money = (v: string) => format.number(Number(v), { style: "currency", currency: "INR" });
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <form method="get" className="mb-4 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm">{t("from")}<input type="date" name="from" defaultValue={from} className="h-9 rounded-md border border-border bg-surface px-2" /></label>
        <label className="flex flex-col gap-1 text-sm">{t("to")}<input type="date" name="to" defaultValue={to} className="h-9 rounded-md border border-border bg-surface px-2" /></label>
        <button type="submit" className="h-9 rounded-md border border-border px-3 text-sm hover:bg-surface-2">{t("show")}</button>
      </form>
      <Card className="mb-4 p-4 text-sm">{d.exceptions === 0 ? t("clean", { n: d.checked }) : t("summary", { n: d.exceptions, checked: d.checked, over: money(d.overCharged), under: money(d.underCharged) })}</Card>
      {d.rows.length ? (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted"><tr className="border-b border-rule"><th className="px-4 py-1.5 font-medium">{t("document")}</th><th className="px-4 py-1.5 font-medium">{t("item")}</th><th className="px-4 py-1.5 text-right font-medium">{t("pieceValue")}</th><th className="px-4 py-1.5 text-right font-medium">{t("charged")}</th><th className="px-4 py-1.5 text-right font-medium">{t("expected")}</th><th className="px-4 py-1.5 text-right font-medium">{t("difference")}</th></tr></thead>
            <tbody>{d.rows.map((r, i) => <tr key={`${r.id}-${i}`} className="border-b border-rule last:border-0"><td className="px-4 py-1.5">{r.number}<span className="ml-2 text-xs text-muted">{r.date}</span></td><td className="px-4 py-1.5">{r.item}</td><td className="num px-4 py-1.5 text-right">{money(r.pieceValue)}</td><td className="num px-4 py-1.5 text-right">{r.charged}%</td><td className="num px-4 py-1.5 text-right">{r.expected}%</td><td className="num px-4 py-1.5 text-right">{money(r.taxDifference)}</td></tr>)}</tbody>
          </table>
        </Card>
      ) : null}
    </>
  );
}
