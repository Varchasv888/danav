import { getTranslations } from "next-intl/server";
import { InventorySettings } from "@/components/inventory/InventorySettings";
import { PageHeader } from "@/components/ui";
import { inventorySetup } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("inventorySettings"))("title") };
}

export default async function InventorySettingsPage() {
  const t = await getTranslations("inventorySettings");
  const [setup, me] = await Promise.all([inventorySetup(), serverApi<Me>("/auth/me")]);
  return (
    <>
      <PageHeader title={t("title")} />
      <InventorySettings setup={setup} canChangeMethod={me.permissions.includes("inventory.approve")} canAddWarehouse={me.permissions.includes("inventory.create")} />
    </>
  );
}
