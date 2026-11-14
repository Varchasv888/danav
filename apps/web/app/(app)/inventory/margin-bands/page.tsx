import { getTranslations } from "next-intl/server";
import { MarginBands } from "@/components/inventory/MarginBands";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("bands"))("title") };
}

export default async function MarginBandsPage() {
  const t = await getTranslations("bands");
  const [bands, me] = await Promise.all([serverApi<{ fromRate: string; markupPct: string; markdown1Pct: string; markdown2Pct: string }[]>("/margin-bands"), serverApi<Me>("/auth/me")]);
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <MarginBands initial={bands} canEdit={me.permissions.includes("inventory.approve")} />
    </>
  );
}
