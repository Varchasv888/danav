import { getTranslations } from "next-intl/server";
import { type TcsSectionSettingsResponse } from "@/components/accounts/TcsSectionMaster";
import { Tds, type Challan, type Deduction } from "@/components/accounts/Tds";
import { PageHeader } from "@/components/ui";
import { todayIso } from "@/lib/format";
import { cashBankAccounts, customers, suppliers } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";
import { fiscalYearOf, type TdsSection } from "@varchasv/domain";

export async function generateMetadata() {
  return { title: (await getTranslations("tds"))("title") };
}

export default async function TdsPage({ searchParams }: { searchParams: Promise<{ fy?: string }> }) {
  const t = await getTranslations("tds");
  const fy = (await searchParams).fy ?? fiscalYearOf(todayIso()).label;
  const [sections, tcsSettings, deductions, challans, banks, ss, cs, me] = await Promise.all([
    serverApi<TdsSection[]>("/tds/sections"), serverApi<TcsSectionSettingsResponse>("/tcs/section-settings"), serverApi<Deduction[]>(`/tds/deductions?fy=${fy}`), serverApi<Challan[]>(`/tds/challans?fy=${fy}`),
    cashBankAccounts(), suppliers(), customers(), serverApi<Me>("/auth/me"),
  ]);
  const tcsSections = tcsSettings.sections.filter((section) => section.enabled).map(({ enabled: _enabled, ...section }) => section);
  const payees = [...ss, ...cs].map((p) => ({ id: p.id, name: p.name })).sort((a, b) => a.name.localeCompare(b.name));
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Tds fy={fy} sections={sections} tcsSections={tcsSections} tcsCompanyId={tcsSettings.companyId} companies={tcsSettings.companies} tcsPayees={cs.map((customer) => ({ id: customer.id, name: customer.name }))} deductions={deductions} challans={challans} banks={banks} payees={payees} canEdit={me.permissions.includes("accounts.create")} />
    </>
  );
}
