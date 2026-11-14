import { Grid3x3 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { BinBoard, type BinData } from "@/components/inventory/BinBoard";
import { Button, PageHeader, Select } from "@/components/ui";
import { inventorySetup } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("bins"))("title") };
}

/** Where pieces sit inside a godown. Bins are a register of places, not a second stock ledger. */
export default async function BinsPage({ searchParams }: { searchParams: Promise<{ warehouseId?: string }> }) {
  const sp = await searchParams;
  const t = await getTranslations("bins");
  const [setup, me] = await Promise.all([inventorySetup(), serverApi<Me>("/auth/me")]);
  const warehouses = setup.warehouses.filter((w) => !w.qualityHold && !w.archived);
  const warehouseId = warehouses.find((w) => w.id === sp.warehouseId)?.id ?? warehouses[0]?.id;
  const data = warehouseId ? await serverApi<BinData>(`/warehouses/${warehouseId}/bins`) : null;
  return (
    <>
      <PageHeader icon={Grid3x3} title={t("title")} subtitle={t("subtitle")} />
      <form className="mb-4 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm"><span className="text-muted">{t("godown")}</span>
          <Select name="warehouseId" defaultValue={warehouseId} className="w-64">{warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}</Select>
        </label>
        <Button type="submit" variant="outline">{t("show")}</Button>
      </form>
      {data ? <BinBoard key={warehouseId} data={data} canEdit={me.permissions.includes("inventory.edit")} /> : <p className="text-sm text-muted">{t("noGodown")}</p>}
    </>
  );
}
