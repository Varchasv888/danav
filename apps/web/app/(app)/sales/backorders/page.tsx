import { PackageX } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { DataTable, type Column, type Row } from "@/components/data/DataTable";
import { PageHeader } from "@/components/ui";
import { serverApi } from "@/lib/server-api";

interface Backorders {
  items: { itemId: string; item: string; color: string | null; size: string | null; wanted: string; customers: number; neededBy: string | null; freeNow: string; incoming: string; incomingFrom: string | null; shortAfterFree: string; coveredByIncoming: boolean }[];
}

export async function generateMetadata() {
  return { title: (await getTranslations("backorders"))("title") };
}

/** What open orders want that no stock has been set aside for, with what is free and what is already on order from suppliers. */
export default async function BackordersPage() {
  const t = await getTranslations();
  const data = await serverApi<Backorders>("/reports/backorders");
  const columns: Column[] = [
    { key: "item", label: t("backorders.item"), type: "text" },
    { key: "wanted", label: t("backorders.wanted"), type: "count" },
    { key: "customers", label: t("backorders.customers"), type: "count" },
    { key: "neededBy", label: t("backorders.neededBy"), type: "date" },
    { key: "free", label: t("backorders.free"), type: "count" },
    { key: "incoming", label: t("backorders.incoming"), type: "count" },
    { key: "incomingFrom", label: t("backorders.firstArrival"), type: "date" },
    { key: "action", label: t("backorders.action"), type: "status" },
  ];
  const rows: Row[] = data.items.map((i) => ({
    id: i.itemId, item: i.item, wanted: Number(i.wanted), customers: i.customers, neededBy: i.neededBy, free: Number(i.freeNow), incoming: Number(i.incoming), incomingFrom: i.incomingFrom,
    action: i.coveredByIncoming ? { label: t("backorders.covered"), tone: "success" } : { label: t("backorders.buy"), tone: "danger" },
  }));
  return (
    <>
      <PageHeader icon={PackageX} title={t("backorders.title")} subtitle={t("backorders.subtitle")} />
      <DataTable id="backorders" title={t("backorders.title")} columns={columns} rows={rows} empty={{ title: t("backorders.empty") }} />
      <p className="mt-3 text-xs text-muted">{t("backorders.note")}</p>
    </>
  );
}
