import { ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PurchaseLimit } from "@/components/purchase/PurchaseLimit";
import { Approvals, type ChangeRequest } from "@/components/settings/Approvals";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("approvals"))("title") };
}

/** Changes that wait for a second person: the switch for bank details, and the requests to decide. */
export default async function ApprovalsPage() {
  const t = await getTranslations("approvals");
  const [settings, requests, me, po] = await Promise.all([
    serverApi<{ bankChange: boolean }>("/settings/approvals"),
    serverApi<ChangeRequest[]>("/change-requests"),
    serverApi<Me>("/auth/me"), serverApi<{ limit: string | null }>("/settings/purchase-approval"),
  ]);
  return (
    <>
      <PageHeader icon={ShieldCheck} title={t("title")} subtitle={t("subtitle")} />
      <Approvals bankChange={settings.bankChange} requests={requests} userId={me.user.id} canSwitch={me.permissions.includes("settings.edit")} canDecide={me.permissions.includes("special.approveBankChange")} />
      <div className="mt-4"><PurchaseLimit limit={po.limit} canEdit={me.permissions.includes("settings.edit")} /></div>
    </>
  );
}
