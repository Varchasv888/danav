import { Library } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ModuleWindow } from "@/components/nav/ModuleWindow";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("hub"))("mastersTitle") };
}

/** The records other work depends on, in one window: the everyday masters first, then company, product, sales and people masters. */
export default async function MastersHubPage() {
  const t = await getTranslations("hub");
  const me = await serverApi<Me>("/auth/me");
  return (
    <>
      <PageHeader icon={Library} title={t("mastersTitle")} subtitle={t("mastersSubtitle")} />
      <ModuleWindow tabKey="masters" permissions={me.permissions} findLabel={t("findMaster")} />
    </>
  );
}
