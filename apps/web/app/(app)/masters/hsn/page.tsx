import { Hash } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { HsnMaster, type HsnRow } from "@/components/masters/HsnMaster";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("hsn"))("title") };
}

export default async function HsnPage() {
  const t = await getTranslations("hsn");
  const [rows, me] = await Promise.all([serverApi<HsnRow[]>("/hsn?all=1"), serverApi<Me>("/auth/me")]);
  return (
    <>
      <PageHeader icon={Hash} title={t("title")} subtitle={t("subtitle")} />
      <HsnMaster rows={rows} canCreate={me.permissions.includes("inventory.create")} canEdit={me.permissions.includes("inventory.edit")} />
    </>
  );
}
