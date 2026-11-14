import { getTranslations } from "next-intl/server";
import { SalesForm } from "@/components/sales/SalesForm";
import { FitScreen, PageHeader } from "@/components/ui";
import { customers, homeState, inventorySetup, items } from "@/lib/masters";
import { quotationDraft } from "@/lib/quotation-draft";

export async function generateMetadata() {
  return { title: (await getTranslations("sales.orders"))("new") };
}

export default async function NewSalesOrderPage({ searchParams }: { searchParams: Promise<{ quotationId?: string }> }) {
  const { quotationId } = await searchParams;
  const t = await getTranslations("sales.orders");
  const [c, i, setup, home, initial] = await Promise.all([customers(), items(), inventorySetup(), homeState(), quotationId ? quotationDraft(quotationId) : undefined]);
  return (
    <FitScreen>
      <PageHeader title={t("new")} />
      <SalesForm mode="order" customers={c} items={i} warehouses={setup.warehouses} homeState={home} {...(initial ? { initial } : {})} />
    </FitScreen>
  );
}
