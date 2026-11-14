import { getTranslations } from "next-intl/server";
import { ChartOfAccounts, type Account, type Group } from "@/components/accounts/ChartOfAccounts";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("accounts"))("suppliers.title") };
}

/** The mills, wholesalers and vendors you buy from. They are accounts under Sundry creditors, so every ledger, bill and payment already uses them. */
export default async function SuppliersPage() {
  const t = await getTranslations("accounts");
  const [accounts, groups, me] = await Promise.all([serverApi<Account[]>("/accounts"), serverApi<Group[]>("/accounts/groups"), serverApi<Me>("/auth/me")]);
  return (
    <>
      <PageHeader title={t("suppliers.title")} subtitle={t("suppliers.subtitle")} />
      <ChartOfAccounts only="supplier" accounts={accounts} groups={groups} canCreate={me.permissions.includes("accounts.create")} canEdit={me.permissions.includes("accounts.edit")} />
    </>
  );
}
