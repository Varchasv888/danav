import { getTranslations } from "next-intl/server";
import { ReceivingDesk } from "@/components/purchase/ReceivingDesk";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("receiving"))("title") };
}

export default async function ReceivingPage() {
  const t = await getTranslations("receiving");
  const me = await serverApi<Me>("/auth/me");
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <ReceivingDesk canApprove={me.permissions.includes("purchase.approve")} />
    </>
  );
}
