import { Store } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";
import { DateFilter } from "@/components/DateFilter";
import { Badge, Card, PageHeader } from "@/components/ui";
import { rupees, todayIso } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

interface Bill { number: string; date: string; amount: string; ageDays: number; dueBy: string; pastLimit: boolean }
interface Row { partyId: string; name: string; udyam: string | null; msmeClass: string; underRule: boolean; total: string; pastLimit: string; bills: Bill[] }
interface Result { asOf: string; limitDays: number; rows: Row[]; totalOwed: string; totalPastLimit: string; disallowance?: string; totalInterest?: string }

export async function generateMetadata() {
  return { title: (await getTranslations("msmeReport"))("title") };
}

/** What is owed to micro and small suppliers and how much is past the 45 day limit (the cost is not allowed until paid). */
export default async function MsmeReportPage({ searchParams }: { searchParams: Promise<{ asOf?: string }> }) {
  const asOf = (await searchParams).asOf ?? todayIso();
  const t = await getTranslations("msmeReport");
  const format = await getFormatter();
  const r = await serverApi<Result>(`/reports/msme?asOf=${asOf}`);
  const day = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  return (
    <>
      <PageHeader icon={Store} title={t("title")} subtitle={t("subtitle", { days: r.limitDays })} print actions={<DateFilter asOf={asOf} />} />
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-border bg-surface p-3"><div className="text-xs text-muted">{t("owed")}</div><div className="num mt-1 text-[1.5rem] font-semibold">{rupees(r.totalOwed)}</div></div>
        <div className="rounded-md border border-border bg-surface p-3"><div className="text-xs text-muted">{t("pastLimit", { days: r.limitDays })}</div><div className={`num mt-1 text-[1.5rem] font-semibold ${Number(r.totalPastLimit) ? "text-danger" : ""}`}>{rupees(r.totalPastLimit)}</div></div>
      </div>
      {Number(r.disallowance) ? <p className="mb-4 text-sm">{t("disallowance", { amount: rupees(r.disallowance!), interest: rupees(r.totalInterest ?? "0") })}</p> : null}
      {r.rows.length ? r.rows.map((s) => (
        <Card key={s.partyId} className="mb-4 p-0">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-border px-4 py-2">
            <h2 className="font-semibold">{s.name}</h2>
            <Badge tone={s.underRule ? "info" : "neutral"}>{t(`class.${s.msmeClass}`)}</Badge>
            {s.udyam ? <span className="font-mono text-xs text-muted">{s.udyam}</span> : null}
            {!s.underRule ? <span className="text-xs text-muted">{t("notUnderRule")}</span> : null}
            <span className="num ml-auto text-sm">{rupees(s.total)}{Number(s.pastLimit) ? <span className="ml-3 font-semibold text-danger">{rupees(s.pastLimit)} {t("late")}</span> : null}</span>
          </div>
          <table className="w-full text-[0.9286rem]">
            <thead className="text-left text-xs text-muted"><tr className="border-b border-rule"><th className="px-4 py-1.5 font-medium">{t("bill")}</th><th className="px-4 py-1.5 font-medium">{t("date")}</th><th className="px-4 py-1.5 font-medium">{t("payBy")}</th><th className="px-4 py-1.5 text-right font-medium">{t("age")}</th><th className="px-4 py-1.5 text-right font-medium">{t("amount")}</th></tr></thead>
            <tbody>
              {s.bills.map((b) => (
                <tr key={b.number} className="border-b border-rule last:border-0">
                  <td className="px-4 py-1.5 font-mono text-xs">{b.number}</td><td className="px-4 py-1.5">{day(b.date)}</td><td className="px-4 py-1.5">{day(b.dueBy)}</td>
                  <td className={`num px-4 py-1.5 text-right ${b.pastLimit ? "font-semibold text-danger" : ""}`}>{b.ageDays}</td><td className="num px-4 py-1.5 text-right">{rupees(b.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )) : <Card><p className="py-6 text-center text-muted">{t("none")}</p></Card>}
    </>
  );
}
