import { getTranslations } from "next-intl/server";
import { CountScreen, type CountView } from "@/components/inventory/StockCounts";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const c = await serverApi<CountView>(`/stock-counts/${(await params).id}`);
  return { title: `${c.number} · ${c.name}` };
}

export default async function CountPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations("counts");
  const [count, me] = await Promise.all([serverApi<CountView>(`/stock-counts/${id}`), serverApi<Me>("/auth/me")]);
  return (
    <>
      <PageHeader title={`${count.number} · ${count.name}`} subtitle={`${count.store}${count.blind ? ` · ${t("blindShort")}` : ""}`} />
      <CountScreen key={`${count.status}-${count.lines.length}`} count={count} canApprove={me.permissions.includes("inventory.approve")} canEdit={me.permissions.includes("inventory.create")} />
    </>
  );
}
