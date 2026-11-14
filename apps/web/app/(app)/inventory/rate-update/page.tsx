import { RefreshCcw } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { RateUpdate, type RateRequest } from "@/components/inventory/RateUpdate";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

interface Style { id: string; code: string; name: string; brand: string | null; category: string | null; season: string | null }

export async function generateMetadata() {
  return { title: (await getTranslations("rateUpdate"))("title") };
}

/** Change sale rate, MRP or purchase rate for a brand, category, season or style in one go, after a preview. */
export default async function RateUpdatePage() {
  const t = await getTranslations("rateUpdate");
  const [styles, me, requests] = await Promise.all([serverApi<Style[]>("/styles"), serverApi<Me>("/auth/me"), serverApi<RateRequest[]>("/inventory/rate-update/requests")]);
  const distinct = (pick: (s: Style) => string | null) => [...new Set(styles.map(pick).filter((v): v is string => !!v))].sort();
  return (
    <>
      <PageHeader icon={RefreshCcw} title={t("title")} subtitle={t("subtitle")} />
      <RateUpdate brands={distinct((s) => s.brand)} categories={distinct((s) => s.category)} seasons={distinct((s) => s.season)} styles={styles.map((s) => ({ id: s.id, label: `${s.code} ${s.name}` }))} canApprove={me.permissions.includes("inventory.approve")} requests={requests} />
    </>
  );
}
