import { UserPlus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LoanRequests, type LoanRequest } from "@/components/hr/LoanRequests";
import { PageHeader } from "@/components/ui";
import { cashBankAccounts } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("loanRequests"))("title") };
}

/** Advance and loan requests: ask on an employee's behalf, then approve (which pays it out) or reject. */
export default async function LoanRequestsPage() {
  const t = await getTranslations("loanRequests");
  const [requests, employees, me, accounts] = await Promise.all([
    serverApi<LoanRequest[]>("/loan-requests"),
    serverApi<{ id: string; code: string; name: string; status: string }[]>("/employees"),
    serverApi<Me>("/auth/me"),
    cashBankAccounts(),
  ]);
  return (
    <>
      <PageHeader icon={UserPlus} title={t("title")} subtitle={t("subtitle")} />
      <LoanRequests requests={requests} employees={employees.filter((e) => e.status === "active")} accounts={accounts} canRequest={me.permissions.includes("payroll.create")} canDecide={me.permissions.includes("payroll.approve")} />
    </>
  );
}
