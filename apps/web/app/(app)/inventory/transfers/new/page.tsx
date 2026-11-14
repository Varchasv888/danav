import { Truck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { TransferForm } from "@/components/inventory/TransferForm";
import { FitScreen, PageHeader } from "@/components/ui";
import { inventorySetup, items } from "@/lib/masters";

export async function generateMetadata() {
  return { title: (await getTranslations("transfers"))("new") };
}

export default async function NewTransferPage() {
  const t = await getTranslations("transfers");
  const [setup, i] = await Promise.all([inventorySetup(), items()]);
  return (
    <FitScreen>
      <PageHeader icon={Truck} title={t("new")} />
      <TransferForm warehouses={setup.warehouses.filter((w) => !w.archived && w.name !== "In transit")} items={i} />
    </FitScreen>
  );
}
