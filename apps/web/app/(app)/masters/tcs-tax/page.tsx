import { FileCheck2 } from "lucide-react";
import { TcsSectionMaster, type TcsSectionSettingsResponse } from "@/components/accounts/TcsSectionMaster";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export const metadata = { title: "TCS Tax Master" };

export default async function TcsTaxMasterPage() {
  const [initial, me] = await Promise.all([
    serverApi<TcsSectionSettingsResponse>("/tcs/section-settings"),
    serverApi<Me>("/auth/me"),
  ]);
  return (
    <>
      <PageHeader icon={FileCheck2} title="TCS Tax Master" subtitle="Review statutory sections and choose which apply to this company." />
      <TcsSectionMaster initial={initial} canEdit={me.permissions.includes("accounts.edit")} />
    </>
  );
}
