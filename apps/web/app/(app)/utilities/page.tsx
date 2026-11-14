import { Wrench } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ModuleWindow } from "@/components/nav/ModuleWindow";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("hub"))("utilitiesTitle") };
}

/** The tools that look after the business itself: backups, imports, devices, number series and the like. */
export default async function UtilitiesPage() {
  const t = await getTranslations("hub");
  const me = await serverApi<Me>("/auth/me");
  return (
    <>
      <PageHeader icon={Wrench} title={t("utilitiesTitle")} subtitle={t("utilitiesSubtitle")} />
      <ModuleWindow tabKey="utilities" permissions={me.permissions} findLabel={t("findUtility")} />
    </>
  );
}
