import { getTranslations } from "next-intl/server";
import { Exports } from "@/components/gst/Exports";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("exports"))("title") };
}

export default async function ExportsPage() {
  const t = await getTranslations("exports");
  const me = await serverApi<Me>("/auth/me");
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Exports canEdit={me.permissions.includes("gst.submit")} />
    </>
  );
}
