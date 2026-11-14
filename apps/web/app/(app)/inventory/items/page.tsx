import { getTranslations } from "next-intl/server";
import { ItemsManager, type Item } from "@/components/inventory/ItemsManager";
import { PageHeader } from "@/components/ui";
import { inventorySetup, items } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("items"))("title") };
}

export default async function ItemsPage() {
  const t = await getTranslations("items");
  const [list, setup, me] = await Promise.all([items<Item>(), inventorySetup(), serverApi<Me>("/auth/me")]);
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <ItemsManager items={list} uoms={setup.uoms} canCreate={me.permissions.includes("inventory.create")} canEdit={me.permissions.includes("inventory.edit")} />
    </>
  );
}
