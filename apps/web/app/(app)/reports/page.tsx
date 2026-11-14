import { FileChartColumn } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ModuleWindow } from "@/components/nav/ModuleWindow";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("hub"))("reportsTitle") };
}

/** Every report in one place, grouped by the part of the business it comes from; built from the same list as the Reports menu. */
export default async function ReportsHubPage() {
  const t = await getTranslations("hub");
  const me = await serverApi<Me>("/auth/me");
  return (
    <>
      <PageHeader icon={FileChartColumn} title={t("reportsTitle")} subtitle={t("reportsSubtitle")} />
      <ModuleWindow tabKey="reports" permissions={me.permissions} findLabel={t("findReport")} />
    </>
  );
}
