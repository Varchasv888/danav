import { Percent } from "lucide-react";
import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { DateFilter } from "@/components/DateFilter";
import { Card, PageHeader } from "@/components/ui";
import { rupees, todayIso } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

interface Row {
  partyId: string; name: string; phone: string | null; rate: string; overdue: string; interest: string;
  bills: { number: string; date: string; dueOn: string; amount: string; daysOverdue: number; interest: string }[];
}

export async function generateMetadata() {
  return { title: (await getTranslations("interest"))("title") };
}

/** Interest on overdue receivables at each customer's rate: a statement to send, or to bill from. */
export default async function InterestPage({ searchParams }: { searchParams: Promise<{ asOf?: string; rate?: string }> }) {
  const { asOf, rate } = await searchParams;
  const date = asOf ?? todayIso();
  const t = await getTranslations();
  const format = await getFormatter();
  const ok = rate && /^\d{1,2}(\.\d{1,2})?$/.test(rate);
  const data = await serverApi<{ rows: Row[]; total: string }>(`/reports/interest?asOf=${date}${ok ? `&rate=${rate}` : ""}`);
  const d = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  return (
    <>
      <PageHeader icon={Percent} print title={t("interest.title")} subtitle={t("interest.subtitle")} actions={<DateFilter asOf={date} {...(ok ? { extra: { rate: rate! } } : {})} />} />
      <p className="mb-4 text-sm text-muted">
        {ok ? t("interest.usingRate", { rate }) : t("interest.partyRates")}{" "}
        {ok ? <Link href={`/reports/interest?asOf=${date}`} className="text-primary hover:underline">{t("interest.partyRatesOnly")}</Link>
          : <Link href={`/reports/interest?asOf=${date}&rate=18`} className="text-primary hover:underline">{t("interest.tryRate", { rate: 18 })}</Link>}
      </p>
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">{t("outstanding.party")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("interest.rate")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("interest.overdue")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("interest.interest")}</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((r) => (
                <tr key={r.partyId} className="border-b border-border align-top last:border-0">
                  <td className="px-5 py-2.5">
                    <details>
                      <summary className="cursor-pointer font-medium">{r.name}</summary>
                      <ul className="mt-2 space-y-1 text-xs text-muted">
                        {r.bills.map((b) => (
                          <li key={`${b.number}${b.date}`} className="flex gap-3">
                            <span className="font-mono">{b.number}</span>
                            <span>{t("interest.dueOn", { date: d(b.dueOn) })}</span>
                            <span className="text-danger">{t("outstanding.overdue", { days: b.daysOverdue })}</span>
                            <span className="num ml-auto">{rupees(b.amount)}</span>
                            <span className="num w-20 text-right">{rupees(b.interest)}</span>
                          </li>
                        ))}
                      </ul>
                    </details>
                    {r.phone ? <span className="block text-xs text-muted">{r.phone}</span> : null}
                  </td>
                  <td className="num px-5 py-2.5 text-right">{Number(r.rate)}%</td>
                  <td className="num px-5 py-2.5 text-right">{rupees(r.overdue)}</td>
                  <td className="num px-5 py-2.5 text-right font-semibold">{rupees(r.interest)}</td>
                </tr>
              ))}
              {!data.rows.length ? <tr><td colSpan={4} className="px-5 py-10 text-center text-muted">{t("interest.none")}</td></tr> : null}
            </tbody>
            {data.rows.length ? (
              <tfoot>
                <tr className="border-t-2 border-border font-semibold">
                  <td className="px-5 py-3" colSpan={3}>{t("common.total")}</td>
                  <td className="num px-5 py-3 text-right">{rupees(data.total)}</td>
                </tr>
              </tfoot>
            ) : null}
          </table>
        </div>
      </Card>
      <p className="mt-3 text-xs text-muted">{t("interest.gstNote")}</p>
    </>
  );
}
