import { getTranslations } from "next-intl/server";
import { RulesEditor, type Rule } from "@/components/banking/Setup";
import { PageHeader } from "@/components/ui";
import { ledgers } from "@/lib/ledgers";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("banking.rules"))("title") };
}

export default async function BankRulesPage() {
  const t = await getTranslations();
  const [rules, l, me] = await Promise.all([serverApi<Rule[]>("/banking/rules"), ledgers(), serverApi<Me>("/auth/me")]);
  return (
    <>
      <PageHeader title={t("banking.rules.title")} subtitle={t("banking.rules.subtitle")} />
      <RulesEditor key={rules.map((r) => `${r.id}:${r.contains}:${r.accountId}:${r.archived}`).join()} rules={rules} ledgers={l.all} canEdit={me.permissions.includes("banking.edit")} />
    </>
  );
}
