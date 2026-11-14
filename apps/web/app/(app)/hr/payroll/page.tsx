import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { NewRun } from "@/components/hr/Payroll";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, PageHeader } from "@/components/ui";
import { rupees, todayIso } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";
import { intlLocale } from "@varchasv/i18n/locales";

interface Run { id: string; period: string; status: string; gross: string; netPay: string; employees: number }
const TONE: Record<string, string> = { draft: "partial", finalized: "posted", paid: "invoiced", cancelled: "cancelled" };

export async function generateMetadata() {
  return { title: (await getTranslations("payroll"))("title") };
}

export default async function PayrollPage() {
  const t = await getTranslations();
  const locale = await getLocale();
  const [runs, me] = await Promise.all([serverApi<Run[]>("/payroll-runs"), serverApi<Me>("/auth/me")]);
  const label = (p: string) => new Date(`${p}-01T00:00:00Z`).toLocaleString(intlLocale(locale), { month: "long", year: "numeric", timeZone: "UTC" });
  // This month and the eleven before it, newest first.
  const today = todayIso();
  const months: { value: string; label: string }[] = [];
  for (let i = 0, y = Number(today.slice(0, 4)), m = Number(today.slice(5, 7)); i < 12; i++) {
    const v = `${y}-${String(m).padStart(2, "0")}`;
    months.push({ value: v, label: label(v) });
    if (--m === 0) { m = 12; y -= 1; }
  }
  return (
    <>
      <PageHeader title={t("payroll.title")} subtitle={t("payroll.subtitle")}
        actions={me.permissions.includes("payroll.create") ? <NewRun months={months} /> : null} />
      <Card className="p-0">
        <table className="w-full text-sm">
          <thead className="text-left text-muted">
            <tr className="border-b border-border">
              <th className="px-5 py-3 font-medium">{t("payroll.month")}</th>
              <th className="px-5 py-3 font-medium">{t("purchase.status")}</th>
              <th className="px-5 py-3 font-medium">{t("payroll.cols.employee")}</th>
              <th className="px-5 py-3 text-right font-medium">{t("payroll.cols.gross")}</th>
              <th className="px-5 py-3 text-right font-medium">{t("payroll.cols.net")}</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface-2/60">
                <td className="px-5 py-2.5"><Link href={`/hr/payroll/${r.id}`} className="text-primary hover:underline">{label(r.period)}</Link></td>
                <td className="px-5 py-2.5"><StatusBadge status={TONE[r.status] ?? r.status} label={t(`payroll.statuses.${r.status}`)} /></td>
                <td className="px-5 py-2.5 text-muted">{t("payroll.employees", { count: r.employees })}</td>
                <td className="num px-5 py-2.5 text-right">{rupees(r.gross)}</td>
                <td className="num px-5 py-2.5 text-right font-semibold">{rupees(r.netPay)}</td>
              </tr>
            ))}
            {!runs.length ? <tr><td colSpan={5} className="px-5 py-10 text-center text-muted">{t("payroll.none")}</td></tr> : null}
          </tbody>
        </table>
      </Card>
    </>
  );
}
