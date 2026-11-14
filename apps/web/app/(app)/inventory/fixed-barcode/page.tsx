import { getTranslations } from "next-intl/server";
import { FixedBarcode } from "@/components/inventory/FixedBarcode";
import { PageHeader } from "@/components/ui";
import { serverApi } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("fixedBarcode"))("title") };
}

type Item = { id: string; name: string; sku: string | null; barcode: string | null; kind: string; archived: boolean };

export default async function FixedBarcodePage() {
  const [t, items] = await Promise.all([getTranslations("fixedBarcode"), serverApi<Item[]>("/items")]);
  const goods = items.filter((item) => item.kind === "goods" && !item.archived);
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <FixedBarcode items={goods.map(({ id, name, sku, barcode }) => ({ id, name, sku, barcode }))} />
    </>
  );
}