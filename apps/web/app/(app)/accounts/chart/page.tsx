import { getTranslations } from "next-intl/server";
import { ChartOfAccounts, type Account, type Group } from "@/components/accounts/ChartOfAccounts";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("accounts"))("title") };
}

export default async function ChartPage() {
  const t = await getTranslations("accounts");
  const [accounts, groups, me] = await Promise.all([
    serverApi<Account[]>("/accounts"), serverApi<Group[]>("/accounts/groups"), serverApi<Me>("/auth/me"),
  ]);
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <ChartOfAccounts accounts={accounts} groups={groups} canCreate={me.permissions.includes("accounts.create")} canEdit={me.permissions.includes("accounts.edit")} />
    </>
  );
}
