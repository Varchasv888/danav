import { getTranslations } from "next-intl/server";
import { PurchaseForm } from "@/components/purchase/PurchaseForm";
import { FitScreen, PageHeader } from "@/components/ui";
import { homeState, inventorySetup, items, suppliers } from "@/lib/masters";

export async function generateMetadata() {
  return { title: (await getTranslations("purchase.orders"))("new") };
}

export default async function NewOrderPage({ searchParams }: { searchParams: Promise<{ supplierId?: string; itemId?: string; rate?: string; qty?: string }> }) {
  const sp = await searchParams;
  const t = await getTranslations("purchase.orders");
  const [s, i, setup, home] = await Promise.all([suppliers(), items(), inventorySetup(), homeState()]);
  // Coming from a quote: the supplier, item and quoted rate are filled in, and the buyer only adds the quantity.
  const fromQuote = s.some((x) => x.id === sp.supplierId) && i.some((x) => x.id === sp.itemId);
  const initial = fromQuote ? { supplierId: sp.supplierId!, lines: [{ itemId: sp.itemId!, qty: /^\d+(\.\d+)?$/.test(sp.qty ?? "") ? sp.qty! : "", rate: /^\d+(\.\d+)?$/.test(sp.rate ?? "") ? sp.rate! : "" }] } : undefined;
  return (
    <FitScreen>
      <PageHeader title={t("new")} />
      <PurchaseForm mode="order" suppliers={s} items={i} warehouses={setup.warehouses} homeState={home} {...(initial ? { initial } : {})} />
    </FitScreen>
  );
}
