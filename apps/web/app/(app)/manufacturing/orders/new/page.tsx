import { getTranslations } from "next-intl/server";
import { ProductionOrderForm } from "@/components/mfg/Production";
import { PageHeader } from "@/components/ui";
import { items } from "@/lib/masters";
import { serverApi } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("mfg.orders"))("new") };
}

export default async function NewProductionOrderPage() {
  const t = await getTranslations();
  const [list, boms] = await Promise.all([items(), serverApi<{ itemId: string; status: string }[]>("/boms")]);
  return (
    <>
      <PageHeader title={t("mfg.orders.new")} subtitle={t("mfg.orders.subtitle")} />
      <ProductionOrderForm items={list} bomItemIds={[...new Set(boms.filter((b) => b.status === "active").map((b) => b.itemId))]} />
    </>
  );
}
