import { Hourglass } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { businessDate } from "@varchasv/domain";
import { StockAgeing, type Ageing } from "@/components/reports/OwnerReports";
import { PageHeader } from "@/components/ui";
import { serverApi } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("ownerReports"))("ageingTitle") };
}

export default async function StockAgeingPage({ searchParams }: { searchParams: Promise<{ asOf?: string; deadDays?: string; dead?: string; all?: string }> }) {
  const sp = await searchParams;
  const asOf = sp.asOf && /^\d{4}-\d{2}-\d{2}$/.test(sp.asOf) ? sp.asOf : businessDate();
  const deadDays = sp.deadDays && /^\d+$/.test(sp.deadDays) ? sp.deadDays : "90";
  const t = await getTranslations("ownerReports");
  const data = await serverApi<Ageing>(`/reports/stock-ageing?asOf=${asOf}&deadDays=${deadDays}${sp.all === "1" ? "&all=1" : ""}`);
  return (
    <>
      <PageHeader icon={Hourglass} print title={t("ageingTitle")} subtitle={t("ageingSubtitle")} />
      <StockAgeing key={`${asOf}:${deadDays}:${sp.all}`} data={data} params={{ asOf, deadDays, dead: sp.dead, all: sp.all }} />
    </>
  );
}
