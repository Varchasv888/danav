import { Shirt } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { businessDate } from "@varchasv/domain";
import { ColourSize, type Matrix } from "@/components/reports/OwnerReports";
import { PageHeader } from "@/components/ui";
import { inventorySetup } from "@/lib/masters";
import { serverApi } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("ownerReports"))("colourSizeTitle") };
}

const KEYS = ["type", "asOf", "from", "to", "warehouseId", "brand", "category", "season", "q"];

export default async function ColourSizePage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const today = businessDate();
  const params: Record<string, string | undefined> = { type: "stock", asOf: today, from: `${today.slice(0, 7)}-01`, to: today, ...Object.fromEntries(Object.entries(sp).filter(([k, v]) => KEYS.includes(k) && v)) };
  const query = new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][]);
  const t = await getTranslations("ownerReports");
  const [data, setup] = await Promise.all([serverApi<Matrix>(`/reports/colour-size?${query.toString()}`), inventorySetup()]);
  return (
    <>
      <PageHeader icon={Shirt} print title={t("colourSizeTitle")} subtitle={t("colourSizeSubtitle")} />
      <ColourSize data={data} params={params} stores={setup.warehouses.filter((w) => !w.archived).map(({ id, name }) => ({ id, name }))} />
    </>
  );
}
