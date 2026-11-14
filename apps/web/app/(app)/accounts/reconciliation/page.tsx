import { getTranslations } from "next-intl/server";
import { Reconciliation, type RunRow } from "@/components/accounts/Reconciliation";
import { PageHeader } from "@/components/ui";
import { customers, suppliers } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("recon"))("title") };
}

export default async function ReconciliationPage() {
  const t = await getTranslations("recon");
  const me = await serverApi<Me>("/auth/me");
  const [runs, cs, ss, members] = await Promise.all([
    serverApi<RunRow[]>("/recon/runs"), customers(), suppliers(),
    me.permissions.includes("users.view") ? serverApi<{ userId: string; name: string }[]>("/members").catch(() => []) : Promise.resolve([]),
  ]);
  const people = members.length ? members.map((m) => ({ id: m.userId, name: m.name })) : [{ id: me.user.id, name: me.user.name }];
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Reconciliation runs={runs} customers={cs.map((c) => ({ id: c.id, name: c.name }))} suppliers={ss.map((s) => ({ id: s.id, name: s.name }))} people={people} userId={me.user.id} canCreate={me.permissions.includes("accounts.create")} canApprove={me.permissions.includes("accounts.approve")} />
    </>
  );
}
