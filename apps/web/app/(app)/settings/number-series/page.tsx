import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/ui";
import { SeriesTable, type Series } from "@/components/SeriesTable";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("series"))("title") };
}

export default async function NumberSeriesPage() {
  const t = await getTranslations("series");
  const [series, me] = await Promise.all([serverApi<Series[]>("/number-series"), serverApi<Me>("/auth/me")]);
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <SeriesTable series={series} canEdit={me.permissions.includes("settings.edit")} />
    </>
  );
}
