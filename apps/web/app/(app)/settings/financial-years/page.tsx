import { getTranslations } from "next-intl/server";
import { FiscalYearLocks, type FiscalYear } from "@/components/accounts/FiscalYearLocks";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("fy"))("title") };
}

export default async function FinancialYearsPage() {
  const t = await getTranslations("fy");
  const [years, me] = await Promise.all([serverApi<FiscalYear[]>("/fiscal-years"), serverApi<Me>("/auth/me")]);
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <FiscalYearLocks years={years} canLock={me.permissions.includes("accounts.approve")} />
    </>
  );
}
