import { Banknote } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Stipends, type Stipend } from "@/components/hr/Stipends";
import { PageHeader } from "@/components/ui";
import { todayIso } from "@/lib/format";
import { cashBankAccounts } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

type Props = { searchParams: Promise<{ period?: string }> };

export async function generateMetadata() {
  return { title: (await getTranslations("stipends"))("title") };
}

/** Stipend paid to trainees and apprentices: one payment per person per month, no PF or ESI. */
export default async function StipendsPage({ searchParams }: Props) {
  const { period: p } = await searchParams;
  const period = /^\d{4}-(0[1-9]|1[0-2])$/.test(p ?? "") ? p! : todayIso().slice(0, 7);
  const t = await getTranslations("stipends");
  const [rows, employees, me, accounts] = await Promise.all([
    serverApi<Stipend[]>(`/stipends?period=${period}`),
    serverApi<{ id: string; code: string; name: string; status: string }[]>("/employees"),
    serverApi<Me>("/auth/me"),
    cashBankAccounts(),
  ]);
  return (
    <>
      <PageHeader icon={Banknote} title={t("title")} subtitle={t("subtitle")} />
      <Stipends period={period} rows={rows} employees={employees.filter((e) => e.status === "active")} accounts={accounts} canPay={me.permissions.includes("payroll.create")} canCancel={me.permissions.includes("payroll.cancel")} />
    </>
  );
}
