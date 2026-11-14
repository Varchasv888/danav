import { getTranslations } from "next-intl/server";
import { Alterations, type AlterationType, type Karigar, type LabourRow, type Slip } from "@/components/pos/Alterations";
import type { Terminal } from "@/components/pos/Billing";
import { PageHeader } from "@/components/ui";
import { todayIso } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("alterations"))("title") };
}

export default async function AlterationsPage() {
  const t = await getTranslations("alterations");
  const today = todayIso();
  const from = `${today.slice(0, 7)}-01`;
  const [slips, types, karigars, terminals, labour, me] = await Promise.all([
    serverApi<Slip[]>("/alterations?status=open"), serverApi<AlterationType[]>("/alteration-types"), serverApi<Karigar[]>("/karigars"),
    serverApi<Terminal[]>("/pos/terminals"), serverApi<{ from: string; to: string; rows: LabourRow[] }>(`/alterations/labour?from=${from}&to=${today}`), serverApi<Me>("/auth/me"),
  ]);
  const counters = terminals.filter((x) => !x.archived && !x.deviceId && x.openSession).map((x) => ({ id: x.id, code: x.code, name: x.name }));
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Alterations slips={slips} types={types} karigars={karigars} counters={counters} labour={labour} canEdit={me.permissions.includes("sales.edit")} />
    </>
  );
}
