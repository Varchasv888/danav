import { getTranslations } from "next-intl/server";
import { BranchPrices } from "@/components/inventory/BranchPrices";
import { PageHeader } from "@/components/ui";
import { inventorySetup, items as itemList, type ItemOption } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("branchPrices"))("title") };
}

export default async function BranchPricesPage() {
  const t = await getTranslations("branchPrices");
  const [setup, items, me] = await Promise.all([inventorySetup(), itemList<ItemOption & { archived?: boolean }>(), serverApi<Me>("/auth/me")]);
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <BranchPrices
        stores={setup.warehouses.filter((w: { archived?: boolean; inTransit?: boolean }) => !w.archived && !w.inTransit).map((w: { id: string; name: string }) => ({ id: w.id, name: w.name }))}
        items={items.filter((i) => !i.archived).map((i) => ({ id: i.id, name: i.name, sku: i.sku ?? null, saleRate: i.saleRate ?? "0" }))} canEdit={me.permissions.includes("sales.edit")}
      />
    </>
  );
}
