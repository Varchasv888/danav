import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ReportList } from "@/components/reports/ReportList";
import { FitScreen, PageHeader } from "@/components/ui";
import { todayIso } from "@/lib/format";
import { loadReport, REPORT_KEYS } from "@/lib/report-defs";

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const t = await getTranslations("reportsMenu");
  return { title: (REPORT_KEYS as readonly string[]).includes(key) ? t(`i.${key}`) : t("title") };
}

/** One page for the list reports that share a layout: the report comes from the key in the address. */
export default async function ListReportPage({ params, searchParams }: { params: Promise<{ key: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { key } = await params;
  if (!(REPORT_KEYS as readonly string[]).includes(key)) notFound();
  const sp = await searchParams;
  const menu = await getTranslations("reportsMenu");
  const t = await getTranslations("reportDefs");
  const today = todayIso();
  const r = await loadReport(key, sp, (k, v) => t(k, v as never), today);
  if (!r) notFound();
  return (
    <FitScreen>
      <PageHeader title={menu(`i.${key}`)} />
      <ReportList
        title={menu(`i.${key}`)} from={r.from} to={r.to} today={today} fileName={key} empty={t("none")}
        {...(r.asOf ? { singleDate: true } : {})} filters={r.filters} columns={r.columns} rows={r.rows} footer={r.footer}
      />
      {r.note ? <p className="mt-2 text-sm text-muted">{r.note}</p> : null}
    </FitScreen>
  );
}
