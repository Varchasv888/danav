import { getTranslations } from "next-intl/server";
import { StockLimitsGrid, type LimitRow } from "@/components/inventory/StockLimitsGrid";
import { PageHeader } from "@/components/ui";
import { inventorySetup } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";
import { TrendingUp } from "lucide-react";

export async function generateMetadata() {
  return { title: (await getTranslations("limits"))("title") };
}

export default async function StockLimitsPage({ searchParams }: { searchParams: Promise<{ warehouse?: string }> }) {
  const t = await getTranslations("limits");
  const { warehouse } = await searchParams;
  const [setup, me] = await Promise.all([inventorySetup(), serverApi<Me>("/auth/me")]);
  const warehouses = setup.warehouses.filter((w) => !w.archived);
  const current = warehouses.find((w) => w.id === warehouse) ?? warehouses.find((w) => w.isDefault) ?? warehouses[0];
  const rows = current ? await serverApi<LimitRow[]>(`/stock-limits?warehouseId=${current.id}`) : [];
  return (
    <>
      <PageHeader icon={TrendingUp} title={t("title")} subtitle={t("subtitle")} />
      {current ? (
        <StockLimitsGrid key={current.id} warehouses={warehouses} warehouseId={current.id} rows={rows} canEdit={me.permissions.includes("inventory.edit")} />
      ) : null}
    </>
  );
}
