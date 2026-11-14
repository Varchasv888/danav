import { Activity } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";
import { DateFilter } from "@/components/DateFilter";
import { Card, PageHeader } from "@/components/ui";
import { todayIso } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

interface Result {
  from: string; to: string;
  tiles: { activeUsers: number; signIns: number; documentsCreated: number; changes: number; cancellations: number; vouchersCreated: number };
  people: { userId: string; name: string; logins: number; created: number; changed: number; cancelled: number; vouchersCreated: number; vouchersCancelled: number; daysActive: number; lastAt: string }[];
}
type Props = { searchParams: Promise<{ from?: string; to?: string }> };

export async function generateMetadata() {
  return { title: (await getTranslations("userActivity"))("title") };
}

/** Who signed in and what they made, changed and cancelled, from the audit trail. */
export default async function UserActivityPage({ searchParams }: Props) {
  const { from, to } = await searchParams;
  const t = await getTranslations("userActivity");
  const format = await getFormatter();
  const day = /^\d{4}-\d{2}-\d{2}$/;
  const end = to && day.test(to) ? to : todayIso();
  const start = from && day.test(from) ? from : new Date(Date.parse(`${end}T00:00:00Z`) - 29 * 86_400_000).toISOString().slice(0, 10);
  const r = await serverApi<Result>(`/reports/user-activity?from=${start}&to=${end}`);
  const tile = (label: string, v: number) => <div className="rounded-md border border-border bg-surface p-3"><div className="text-xs text-muted">{label}</div><div className="num mt-1 text-[1.5rem] font-semibold">{v.toLocaleString("en-IN")}</div></div>;
  return (
    <>
      <PageHeader icon={Activity} title={t("title")} subtitle={t("subtitle")} print />
      <div className="mb-4 print:hidden"><DateFilter from={start} to={end} /></div>
      <div className="mb-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {tile(t("activeUsers"), r.tiles.activeUsers)}{tile(t("signIns"), r.tiles.signIns)}{tile(t("created"), r.tiles.documentsCreated)}
        {tile(t("changes"), r.tiles.changes)}{tile(t("cancellations"), r.tiles.cancellations)}{tile(t("vouchers"), r.tiles.vouchersCreated)}
      </div>
      <Card className="p-0">
        {r.people.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-[0.9286rem]">
              <thead><tr className="border-b border-border bg-surface-2 text-left text-xs font-semibold text-muted">
                <th className="px-4 py-1.5">{t("person")}</th><th className="px-4 py-1.5 text-right">{t("signIns")}</th><th className="px-4 py-1.5 text-right">{t("daysActive")}</th><th className="px-4 py-1.5 text-right">{t("created")}</th>
                <th className="px-4 py-1.5 text-right">{t("changes")}</th><th className="px-4 py-1.5 text-right">{t("cancellations")}</th><th className="px-4 py-1.5 text-right">{t("vouchersMadeCancelled")}</th><th className="px-4 py-1.5">{t("lastSeen")}</th>
              </tr></thead>
              <tbody>
                {r.people.map((p) => (
                  <tr key={p.userId} className="border-b border-rule last:border-0">
                    <td className="px-4 py-2 font-medium">{p.name}</td>
                    <td className="num px-4 py-2 text-right">{p.logins}</td><td className="num px-4 py-2 text-right">{p.daysActive}</td><td className="num px-4 py-2 text-right">{p.created}</td>
                    <td className="num px-4 py-2 text-right">{p.changed}</td><td className="num px-4 py-2 text-right">{p.cancelled}</td><td className="num px-4 py-2 text-right">{p.vouchersCreated} / {p.vouchersCancelled}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-muted">{format.dateTime(new Date(p.lastAt), { dateStyle: "medium", timeStyle: "short" })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="px-4 py-8 text-center text-muted">{t("none")}</p>}
      </Card>
    </>
  );
}
