import { getTranslations } from "next-intl/server";
import { ResetStock } from "@/components/inventory/ResetStock";
import { PageHeader } from "@/components/ui";
import { serverApi } from "@/lib/server-api";

interface Style { id: string; code: string; name: string; brand: string | null; category: string | null }

export async function generateMetadata() {
  return { title: (await getTranslations("resetStock"))("title") };
}

export default async function ResetStockPage() {
  const t = await getTranslations("resetStock");
  const [setup, styles] = await Promise.all([serverApi<{ warehouses: { id: string; name: string; archived?: boolean; inTransit?: boolean }[] }>("/inventory/setup"), serverApi<Style[]>("/styles")]);
  const distinct = (pick: (s: Style) => string | null) => [...new Set(styles.map(pick).filter((v): v is string => !!v))].sort();
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <ResetStock warehouses={setup.warehouses.filter((w) => !w.archived && !w.inTransit).map((w) => ({ id: w.id, name: w.name }))} brands={distinct((s) => s.brand)} categories={distinct((s) => s.category)} styles={styles.map((s) => ({ id: s.id, name: `${s.code} ${s.name}` }))} />
    </>
  );
}
