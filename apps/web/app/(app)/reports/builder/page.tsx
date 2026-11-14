import { Table2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ReportBuilder, type DatasetInfo, type SavedReport } from "@/components/reports/Builder";
import { PageHeader } from "@/components/ui";
import { serverApi } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("reports.builder"))("title") };
}

export default async function BuilderPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  const t = await getTranslations();
  const [datasets, saved] = await Promise.all([serverApi<DatasetInfo[]>("/reports/builder/datasets"), id ? serverApi<SavedReport[]>("/reports/saved") : Promise.resolve([])]);
  const report = saved.find((r) => r.id === id);
  return (
    <>
      <PageHeader icon={Table2} title={report?.name ?? t("reports.builder.title")} subtitle={t("reports.builder.subtitle")} />
      <ReportBuilder key={report?.id ?? "new"} datasets={datasets} {...(report ? { saved: report } : {})} />
    </>
  );
}
