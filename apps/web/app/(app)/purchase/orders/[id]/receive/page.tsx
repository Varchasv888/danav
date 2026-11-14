import { getTranslations } from "next-intl/server";
import { ScanReceive } from "@/components/purchase/ScanReceive";
import { PageHeader } from "@/components/ui";
import { serverApi } from "@/lib/server-api";

export default async function ReceiveByScanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations();
  const order = await serverApi<{ number: string }>(`/purchase-orders/${id}`);
  return (
    <>
      <PageHeader title={t("scanReceive.title", { number: order.number })} subtitle={t("scanReceive.subtitle")} />
      <ScanReceive orderId={id} />
    </>
  );
}
