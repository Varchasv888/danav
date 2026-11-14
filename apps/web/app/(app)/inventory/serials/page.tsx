import { getTranslations } from "next-intl/server";
import { Serials } from "@/components/inventory/Serials";
import { PageHeader } from "@/components/ui";
import { inventorySetup, items as itemList } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("serials"))("title") };
}

export default async function SerialsPage() {
  const t = await getTranslations("serials");
  const [setup, items, check, me] = await Promise.all([
    inventorySetup(), itemList(), serverApi<{ items: { itemId: string; item: string; stock: string; serials: number; gap: string }[] }>("/serials/check"), serverApi<Me>("/auth/me"),
  ]);
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Serials
        stores={setup.warehouses.filter((w: { archived?: boolean; inTransit?: boolean }) => !w.archived && !w.inTransit).map((w: { id: string; name: string }) => ({ id: w.id, name: w.name }))}
        items={items.filter((i) => i.trackSerials && !i.archived).map((i) => ({ id: i.id, name: i.name }))} check={check.items} canCreate={me.permissions.includes("inventory.create")}
      />
    </>
  );
}
