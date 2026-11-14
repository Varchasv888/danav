import Link from "next/link";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { SalaryRevision, SettleForm, TaxDeclarationForm } from "@/components/hr/EmployeeActions";
import { EmployeeDocuments, type EmployeeDocument } from "@/components/hr/EmployeeDocuments";
import { EmployeeReviews, type Review } from "@/components/hr/EmployeeReviews";
import { EmployeeForm, type EmployeeData } from "@/components/hr/EmployeeForm";
import { Loans, type Loan } from "@/components/hr/Loans";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, PageHeader } from "@/components/ui";
import { localName, rupees, todayIso } from "@/lib/format";
import { cashBankAccounts, homeState } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

type Component = { code: string; name: string; monthly: string; pfWage?: boolean; hra?: boolean; esiExcluded?: boolean };
type Employee = EmployeeData & {
  leftOn: string | null; structures: { id: string; effectiveFrom: string; components: Component[] }[];
  settlement: { leftOn: string; total: string } | null;
};
interface Balances { fy: string; types: { leaveTypeId: string; code: string; name: string; nameHi: string | null; paid: boolean; opening: string; quota: string; taken: string; pending: string; balance: string | null }[] }
interface Slip { id: string; period: string; gross: string; netPay: string; tds: string; status: string }

const fyOf = (iso: string) => { const y = Number(iso.slice(0, 4)) - (iso.slice(5) < "04-01" ? 1 : 0); return `${y}-${String((y + 1) % 100).padStart(2, "0")}`; };

export default async function EmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations();
  const locale = await getLocale();
  const format = await getFormatter();
  const fy = fyOf(todayIso());
  const [e, me, home] = await Promise.all([serverApi<Employee>(`/employees/${id}`), serverApi<Me>("/auth/me"), homeState()]);
  const can = (p: string) => me.permissions.includes(p);
  const [balances, slips, decl, loans, shifts, accounts, documents, reviewData] = await Promise.all([
    serverApi<Balances>(`/employees/${id}/leave-balances?fy=${fy}`),
    can("payroll.view") ? serverApi<Slip[]>(`/employees/${id}/payslips`) : Promise.resolve([] as Slip[]),
    can("payroll.view") ? serverApi<Record<string, string>>(`/employees/${id}/tax-declaration?fy=${fy}`) : Promise.resolve({}),
    can("payroll.view") ? serverApi<Loan[]>(`/employees/${id}/loans`) : Promise.resolve([] as Loan[]),
    serverApi<{ id: string; name: string; startTime: string; endTime: string }[]>("/shifts"),
    can("payroll.create") ? cashBankAccounts() : Promise.resolve([]),
    serverApi<EmployeeDocument[]>(`/employees/${id}/documents`),
    serverApi<{ average: string | null; reviews: Review[] }>(`/employees/${id}/reviews`),
  ]);
  const current = e.structures[0];
  const month = (p: string) => format.dateTime(new Date(`${p}-01T00:00:00`), { month: "long", year: "numeric" });
  const date = (d: string) => format.dateTime(new Date(`${d}T00:00:00`), { dateStyle: "medium" });

  return (
    <>
      <PageHeader title={<span>{localName(e, locale)} <span className="font-mono text-base text-muted">{e.code}</span></span>}
        subtitle={[e.designation, e.department, `${t("hr.joinedOn")} ${date(e.joinedOn)}`, e.leftOn ? `${t("hr.leftOn")} ${date(e.leftOn)}` : null].filter(Boolean).join(" · ")}
        actions={<Link href="/hr/employees" className="text-sm text-primary hover:underline">← {t("common.back")}</Link>} />
      <div className="mb-6"><StatusBadge status={e.status === "left" ? "closed" : "open"} label={t(`hr.statuses.${e.status}`)} /></div>

      <div className="flex flex-col gap-6">
        {can("payroll.view") && current ? (
          <Card>
            <h2 className="mb-3 font-semibold">{t("hr.salary.title")} <span className="text-sm font-normal text-muted">· {t("hr.salary.effectiveFrom")} {date(current.effectiveFrom)}</span></h2>
            {can("payroll.edit") && e.status === "active" ? <SalaryRevision employeeId={e.id} current={current.components} /> : (
              <ul className="text-sm">{current.components.map((c) => <li key={c.code}>{c.name}: <span className="num">{rupees(c.monthly)}</span></li>)}</ul>
            )}
            {e.structures.length > 1 ? (
              <details className="mt-4 text-sm">
                <summary className="cursor-pointer text-muted">{t("hr.salary.history")}</summary>
                <ul className="mt-2 space-y-1">
                  {e.structures.slice(1).map((s) => (
                    <li key={s.id}>{date(s.effectiveFrom)}: <span className="num">{rupees(s.components.reduce((sum, c) => sum + Number(c.monthly), 0).toFixed(2))}</span></li>
                  ))}
                </ul>
              </details>
            ) : null}
          </Card>
        ) : null}

        <Card className="p-0">
          <h2 className="border-b border-border px-5 py-3 font-semibold">{t("hr.leave.balances")} <span className="text-sm font-normal text-muted">· {balances.fy}</span></h2>
          <table className="w-full text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-5 py-2 font-medium">{t("hr.leave.type")}</th>
                <th className="px-5 py-2 text-right font-medium">{t("hr.leave.opening")}</th>
                <th className="px-5 py-2 text-right font-medium">{t("hr.leave.quota")}</th>
                <th className="px-5 py-2 text-right font-medium">{t("hr.leave.taken")}</th>
                <th className="px-5 py-2 text-right font-medium">{t("hr.leave.balance")}</th>
              </tr>
            </thead>
            <tbody>
              {balances.types.filter((b) => b.paid).map((b) => (
                <tr key={b.leaveTypeId} className="border-b border-border last:border-0">
                  <td className="px-5 py-2">{localName(b, locale)} <span className="font-mono text-xs text-muted">{b.code}</span></td>
                  <td className="num px-5 py-2 text-right">{b.opening}</td>
                  <td className="num px-5 py-2 text-right">{b.quota}</td>
                  <td className="num px-5 py-2 text-right">{b.taken}{Number(b.pending) ? <span className="text-muted"> (+{b.pending})</span> : null}</td>
                  <td className="num px-5 py-2 text-right font-semibold">{b.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {can("payroll.view") ? (
          <Card>
            <h2 className="mb-3 font-semibold">{t("hr.declaration.title")}</h2>
            <TaxDeclarationForm employeeId={e.id} fy={fy} values={decl} />
          </Card>
        ) : null}

        <EmployeeDocuments employeeId={e.id} documents={documents} canEdit={can("hr.edit")} />
        <EmployeeReviews employeeId={e.id} average={reviewData.average} reviews={reviewData.reviews} canEdit={can("hr.edit")} />
        {can("payroll.view") ? <Loans employeeId={e.id} loans={loans} accounts={accounts} canCreate={can("payroll.create") && e.status === "active"} canCancel={can("payroll.cancel")} /> : null}

        {slips.length ? (
          <Card className="p-0">
            <h2 className="border-b border-border px-5 py-3 font-semibold">{t("hr.payslips")}</h2>
            <table className="w-full text-sm">
              <tbody>
                {slips.map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-2"><Link href={`/print/payslip/${s.id}`} target="_blank" className="text-primary hover:underline">{month(s.period)}</Link></td>
                    <td className="px-5 py-2"><StatusBadge status={s.status === "draft" ? "partial" : "posted"} label={t(`payroll.statuses.${s.status}`)} /></td>
                    <td className="num px-5 py-2 text-right text-muted">{t("payroll.cols.gross")} {rupees(s.gross)}</td>
                    <td className="num px-5 py-2 text-right text-muted">{t("payroll.cols.tds")} {rupees(s.tds)}</td>
                    <td className="num px-5 py-2 text-right font-semibold">{rupees(s.netPay)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ) : null}

        {can("hr.edit") ? <EmployeeForm employee={e} homeState={home} shifts={shifts} /> : null}

        {e.settlement ? (
          <Card><p className="text-sm">{t("hr.settle.done", { date: date(e.settlement.leftOn), amount: rupees(e.settlement.total) })}</p></Card>
        ) : e.status === "active" && can("payroll.approve") ? <SettleForm employeeId={e.id} /> : null}
      </div>
    </>
  );
}
