import { getTranslations } from "next-intl/server";
import { WorkingCapital } from "@/components/accounts/WorkingCapital";
import { PageHeader } from "@/components/ui";
import { cashBankAccounts, customers, suppliers } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("workcap"))("title") };
}

export default async function WorkingCapitalPage() {
  const t = await getTranslations("workcap");
  const [banks, cs, ss, me] = await Promise.all([cashBankAccounts(), customers(), suppliers(), serverApi<Me>("/auth/me")]);
  const parties = [...cs, ...ss].map((p) => ({ id: p.id, name: p.name })).sort((a, b) => a.name.localeCompare(b.name));
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <WorkingCapital banks={banks.map((b) => ({ id: b.id, name: b.name }))} parties={parties} canEdit={me.permissions.includes("accounts.create")} />
    </>
  );
}
