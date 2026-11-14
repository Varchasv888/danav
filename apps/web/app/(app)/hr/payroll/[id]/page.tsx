import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { CancelDocument } from "@/components/CancelDocument";
import { PayrollRun, type RunData } from "@/components/hr/Payroll";
import { StatusBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/ui";
import { cashBankAccounts } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";
import { intlLocale } from "@varchasv/i18n/locales";

const TONE: Record<string, string> = { draft: "partial", finalized: "posted", paid: "invoiced", cancelled: "cancelled" };

export default async function PayrollRunPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations();
  const locale = await getLocale();
  const [run, me, accounts] = await Promise.all([serverApi<RunData>(`/payroll-runs/${id}`), serverApi<Me>("/auth/me"), cashBankAccounts()]);
  const label = new Date(`${run.period}-01T00:00:00Z`).toLocaleString(intlLocale(locale), { month: "long", year: "numeric", timeZone: "UTC" });
  return (
    <>
      <PageHeader title={`${t("payroll.title")} · ${label}`} subtitle={t("payroll.employees", { count: run.payslips.length })}
        actions={<Link href="/hr/payroll" className="text-sm text-primary hover:underline">← {t("common.back")}</Link>} />
      <div className="mb-6"><StatusBadge status={TONE[run.status] ?? run.status} label={t(`payroll.statuses.${run.status}`)} /></div>
      <PayrollRun run={run} perms={me.permissions} payAccounts={accounts} />
      {(run.status === "draft" || run.status === "finalized") && me.permissions.includes("payroll.cancel") ? <CancelDocument path={`/payroll-runs/${run.id}/cancel`} label={t("payroll.cancel")} /> : null}
    </>
  );
}
