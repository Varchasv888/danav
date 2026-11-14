import { getTranslations } from "next-intl/server";
import { StockFinance } from "@/components/inventory/StockFinance";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("stockfin"))("title") };
}

export default async function StockFinancePage() {
  const t = await getTranslations("stockfin");
  const me = await serverApi<Me>("/auth/me");
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <StockFinance userId={me.user.id} canPropose={me.permissions.includes("inventory.edit")} canApprove={me.permissions.includes("inventory.approve")} />
    </>
  );
}
