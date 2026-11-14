import { getTranslations } from "next-intl/server";
import { GstCompliance } from "@/components/gst/GstCompliance";
import { PageHeader } from "@/components/ui";
import { todayIso } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("gstCompliance"))("title") };
}

export default async function GstCompliancePage() {
  const t = await getTranslations("gstCompliance");
  const [imports, accounts, groups, settings, me] = await Promise.all([
    serverApi<{ id: string; period: string; rows: number }[]>("/gst/work/2a"),
    serverApi<{ id: string; name: string; groupId: string; archived: boolean }[]>("/accounts"),
    serverApi<{ id: string; key: string | null }[]>("/accounts/groups"),
    serverApi<{ approvalRequired: boolean }>("/gst/work/settings"),
    serverApi<Me>("/auth/me"),
  ]);
  const expense = new Set(groups.filter((g) => g.key === "indirect_expenses" || g.key === "direct_expenses").map((g) => g.id));
  const today = todayIso();
  const defaultFy = Number(today.slice(5, 7)) >= 4 ? Number(today.slice(0, 4)) - 1 : Number(today.slice(0, 4)) - 2;
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <GstCompliance
        imports2a={imports} accounts={accounts.filter((a) => expense.has(a.groupId) && !a.archived).map((a) => ({ id: a.id, name: a.name }))}
        canSubmit={me.permissions.includes("gst.submit")} canApprove={me.permissions.includes("gst.approve")} approvalRequired={settings.approvalRequired} defaultFy={defaultFy}
      />
    </>
  );
}
