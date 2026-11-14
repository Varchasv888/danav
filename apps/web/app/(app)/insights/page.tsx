import { BarChart3 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { businessDate } from "@varchasv/domain";
import { Insights, type InsightsData } from "@/components/insights/Insights";
import { PageHeader } from "@/components/ui";
import { serverApi } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("insights"))("title") };
}

export default async function InsightsPage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  const q = await searchParams;
  const today = businessDate();
  const ok = (v?: string) => (v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : undefined);
  const from = ok(q.from) ?? `${today.slice(0, 7)}-01`;
  const to = ok(q.to) ?? today;
  const t = await getTranslations("insights");
  const data = await serverApi<InsightsData>(`/analytics/insights?from=${from}&to=${to}`);
  return (
    <>
      <PageHeader icon={BarChart3} print title={t("title")} subtitle={t("subtitle")} />
      <Insights key={`${from}:${to}`} data={data} today={today} />
    </>
  );
}
