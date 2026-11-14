import { Percent } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { CommissionRules, type Report, type Rule } from "@/components/sales/CommissionRules";
import { PageHeader } from "@/components/ui";
import { todayIso } from "@/lib/format";
import { items } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("commissionRules"))("title") };
}

/** Salesman commission rules by item, brand, category or MRP range, and what they pay for a month. */
export default async function CommissionRulesPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const { month: m } = await searchParams;
  const month = m && /^\d{4}-(0[1-9]|1[0-2])$/.test(m) ? m : todayIso().slice(0, 7);
  const t = await getTranslations("commissionRules");
  const [rules, report, me, i] = await Promise.all([
    serverApi<Rule[]>("/salesman-commission/rules"),
    serverApi<Report>(`/salesman-commission/report?month=${month}`),
    serverApi<Me>("/auth/me"),
    items<{ id: string; name: string; archived: boolean; kind: string }>(),
  ]);
  return (
    <>
      <PageHeader icon={Percent} title={t("title")} subtitle={t("subtitle")} />
      <CommissionRules month={month} rules={rules} report={report} items={i.filter((x) => x.kind === "goods" && !x.archived).map((x) => ({ id: x.id, name: x.name }))} canEdit={me.permissions.includes("payroll.edit")} />
    </>
  );
}
