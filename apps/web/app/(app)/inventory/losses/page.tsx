import { getTranslations } from "next-intl/server";
import { Losses, type Loss, type LossReport } from "@/components/inventory/Losses";
import { PageHeader } from "@/components/ui";
import { fyStart, todayIso } from "@/lib/format";
import { inventorySetup, items } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("losses"))("title") };
}

export default async function LossesPage() {
  const t = await getTranslations("losses");
  const to = todayIso();
  const [list, report, settings, its, setup, me] = await Promise.all([
    serverApi<Loss[]>("/stock-losses"), serverApi<LossReport>(`/reports/stock-losses?from=${fyStart(to)}&to=${to}`),
    serverApi<{ approvalLimit: string }>("/stock-losses/settings"), items<{ id: string; name: string; kind: string; archived?: boolean }>(), inventorySetup(), serverApi<Me>("/auth/me"),
  ]);
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Losses
        losses={list} report={report} limit={settings.approvalLimit} userId={me.user.id}
        items={its.filter((i) => i.kind === "goods" && !i.archived).map((i) => ({ id: i.id, name: i.name }))}
        warehouses={setup.warehouses.filter((w) => !w.archived).map((w) => ({ id: w.id, name: w.name }))}
        canCreate={me.permissions.includes("inventory.create")} canApprove={me.permissions.includes("inventory.approve")}
      />
    </>
  );
}
