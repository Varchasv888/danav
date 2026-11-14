import { Settings2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LedgerParameters, type LedgerParametersResponse } from "@/components/accounts/LedgerParameters";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  const t = await getTranslations("menu.i");
  return { title: t("ledgerParameter") };
}

export default async function LedgerParametersPage() {
  const [data, me] = await Promise.all([
    serverApi<LedgerParametersResponse>("/accounts/ledger-parameters"),
    serverApi<Me>("/auth/me"),
  ]);
  return (
    <>
      <PageHeader icon={Settings2} title="Ledger Posting Defaults" subtitle="Choose which ledgers automatic postings use for this company." />
      <LedgerParameters companyId={data.companyId} companies={data.companies} roles={data.roles} canEdit={me.permissions.includes("accounts.edit")} />
    </>
  );
}
