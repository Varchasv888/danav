import { getTranslations } from "next-intl/server";
import { Communications } from "@/components/crm/Communications";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("comms"))("title") };
}

export default async function CommunicationsPage() {
  const t = await getTranslations("comms");
  const me = await serverApi<Me>("/auth/me");
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Communications canEdit={me.permissions.includes("crm.edit")} />
    </>
  );
}
