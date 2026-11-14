import { getTranslations } from "next-intl/server";
import { SalesForm } from "@/components/sales/SalesForm";
import { FitScreen, PageHeader } from "@/components/ui";
import { customers, homeState, inventorySetup, items } from "@/lib/masters";

export async function generateMetadata() {
  return { title: (await getTranslations("sales.quotations"))("new") };
}

export default async function NewQuotationPage() {
  const t = await getTranslations("sales.quotations");
  const [c, i, setup, home] = await Promise.all([customers(), items(), inventorySetup(), homeState()]);
  return (
    <FitScreen>
      <PageHeader title={t("new")} />
      <SalesForm mode="quotation" customers={c} items={i} warehouses={setup.warehouses} homeState={home} />
    </FitScreen>
  );
}
