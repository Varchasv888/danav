import { getTranslations } from "next-intl/server";
import { PriceLists, type PriceList } from "@/components/sales/PriceLists";
import { PageHeader } from "@/components/ui";
import { items } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("priceLists"))("title") };
}

export default async function PriceListsPage() {
  const t = await getTranslations("priceLists");
  const [lists, its, me] = await Promise.all([serverApi<PriceList[]>("/price-lists"), items(), serverApi<Me>("/auth/me")]);
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <PriceLists lists={lists} items={its} canEdit={me.permissions.includes("sales.edit")} />
    </>
  );
}
