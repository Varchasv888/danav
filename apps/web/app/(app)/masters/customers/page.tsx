import { getTranslations } from "next-intl/server";
import { ChartOfAccounts, type Account, type Group } from "@/components/accounts/ChartOfAccounts";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("accounts"))("customers.title") };
}

/** The shops and people you sell to. They are accounts under Sundry debtors, so every ledger, bill and receipt already uses them. */
export default async function CustomersPage() {
  const t = await getTranslations("accounts");
  const [accounts, groups, me] = await Promise.all([serverApi<Account[]>("/accounts"), serverApi<Group[]>("/accounts/groups"), serverApi<Me>("/auth/me")]);
  return (
    <>
      <PageHeader title={t("customers.title")} subtitle={t("customers.subtitle")} />
      <ChartOfAccounts only="customer" accounts={accounts} groups={groups} canCreate={me.permissions.includes("accounts.create")} canEdit={me.permissions.includes("accounts.edit")} />
    </>
  );
}
