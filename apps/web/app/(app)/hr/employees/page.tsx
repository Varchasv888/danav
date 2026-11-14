import { Plus } from "lucide-react";
import Link from "next/link";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, PageHeader } from "@/components/ui";
import { localName, rupees } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";

interface Row { id: string; code: string; name: string; nameHi: string | null; designation: string | null; department: string | null; joinedOn: string; status: string; monthlyGross: string | null }

export async function generateMetadata() {
  return { title: (await getTranslations("hr.employees"))("title") };
}

export default async function EmployeesPage() {
  const t = await getTranslations();
  const locale = await getLocale();
  const format = await getFormatter();
  const [rows, me] = await Promise.all([serverApi<Row[]>("/employees"), serverApi<Me>("/auth/me")]);
  return (
    <>
      <PageHeader title={t("hr.employees.title")} subtitle={t("hr.employees.subtitle")}
        actions={me.permissions.includes("hr.create") ? (
          <Link href="/hr/employees/new" className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover">
            <Plus className="size-4" aria-hidden />{t("hr.employees.new")}
          </Link>
        ) : null} />
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">{t("hr.code")}</th>
                <th className="px-5 py-3 font-medium">{t("hr.name")}</th>
                <th className="px-5 py-3 font-medium">{t("hr.designation")}</th>
                <th className="px-5 py-3 font-medium">{t("hr.joinedOn")}</th>
                <th className="px-5 py-3 font-medium">{t("hr.status")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("hr.monthlyGross")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id} className="border-b border-border last:border-0 hover:bg-surface-2/60">
                  <td className="px-5 py-2.5"><Link href={`/hr/employees/${e.id}`} className="font-mono text-primary hover:underline">{e.code}</Link></td>
                  <td className="px-5 py-2.5">{localName(e, locale)}</td>
                  <td className="px-5 py-2.5 text-muted">{[e.designation, e.department].filter(Boolean).join(" · ")}</td>
                  <td className="px-5 py-2.5 whitespace-nowrap">{format.dateTime(new Date(`${e.joinedOn}T00:00:00`), { dateStyle: "medium" })}</td>
                  <td className="px-5 py-2.5"><StatusBadge status={e.status === "left" ? "closed" : "open"} label={t(`hr.statuses.${e.status}`)} /></td>
                  <td className="num px-5 py-2.5 text-right">{e.monthlyGross ? rupees(e.monthlyGross) : "-"}</td>
                </tr>
              ))}
              {!rows.length ? <tr><td colSpan={6} className="px-5 py-10 text-center text-muted">{t("hr.employees.none")}</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
