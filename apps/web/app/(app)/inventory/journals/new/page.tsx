import { getTranslations } from "next-intl/server";
import { StockJournalForm } from "@/components/inventory/StockJournalForm";
import { FitScreen, PageHeader } from "@/components/ui";
import { inventorySetup, items } from "@/lib/masters";

export async function generateMetadata() {
  return { title: (await getTranslations("sj"))("new") };
}

export default async function NewStockJournalPage() {
  const t = await getTranslations("sj");
  const [list, setup] = await Promise.all([items(), inventorySetup()]);
  return (
    <FitScreen>
      <PageHeader title={t("new")} />
      <StockJournalForm items={list.filter((i) => i.kind === "goods" && !i.archived)} warehouses={setup.warehouses.filter((w) => !w.archived)} />
    </FitScreen>
  );
}
