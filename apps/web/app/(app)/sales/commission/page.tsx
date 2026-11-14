import { getTranslations } from "next-intl/server";
import { DateFilter } from "@/components/DateFilter";
import { AgentCommission, type AgentRow, type BrokerageBill } from "@/components/sales/AgentCommission";
import { PageHeader } from "@/components/ui";
import { todayIso } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("agents"))("title") };
}

/** Brokers and agents: commission earned on money received, and their brokerage bills. */
export default async function CommissionPage({ searchParams }: { searchParams: Promise<{ asOf?: string }> }) {
  const { asOf } = await searchParams;
  const date = asOf ?? todayIso();
  const t = await getTranslations("agents");
  const me = await serverApi<Me>("/auth/me");
  const canBill = me.permissions.includes("accounts.create");
  const [data, bills] = await Promise.all([
    serverApi<{ rows: AgentRow[] }>(`/reports/agent-commission?asOf=${date}`),
    me.permissions.includes("accounts.view") ? serverApi<BrokerageBill[]>("/brokerage-bills") : Promise.resolve([]),
  ]);
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} actions={<DateFilter asOf={date} />} />
      <AgentCommission rows={data.rows} bills={bills} asOf={date} canBill={canBill} />
    </>
  );
}
