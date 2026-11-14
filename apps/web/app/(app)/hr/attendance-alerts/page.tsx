import { CalendarX } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Badge, Button, Card, Field, Input, PageHeader } from "@/components/ui";
import { todayIso } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

interface Result { date: string; workingDay: boolean; staff: number; absent: number; late: number; alerts: { employeeId: string; code: string; name: string; kind: "absent" | "late"; inTime?: string | null }[] }
type Props = { searchParams: Promise<{ date?: string }> };

export async function generateMetadata() {
  return { title: (await getTranslations("attendanceAlerts"))("title") };
}

/** Who was absent or late on a day, with a link to each employee. */
export default async function AttendanceAlertsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const date = sp.date && /^\d{4}-\d{2}-\d{2}$/.test(sp.date) ? sp.date : todayIso();
  const t = await getTranslations("attendanceAlerts");
  const r = await serverApi<Result>(`/hr/attendance-alerts?date=${date}`);
  const tile = (label: string, v: number) => <div className="rounded-md border border-border bg-surface p-3"><div className="text-xs text-muted">{label}</div><div className="num mt-1 text-[1.5rem] font-semibold">{v}</div></div>;
  return (
    <>
      <PageHeader icon={CalendarX} title={t("title")} subtitle={t("subtitle")} />
      <form method="get" className="mb-4 flex items-end gap-3">
        <Field label={t("day")} htmlFor="aa-date"><Input id="aa-date" type="date" name="date" defaultValue={date} className="w-44" /></Field>
        <Button type="submit" variant="outline">{t("show")}</Button>
      </form>
      {!r.workingDay ? <p className="mb-4 rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-muted">{t("notWorking")}</p> : null}
      <div className="mb-4 grid gap-3 sm:grid-cols-3">{tile(t("staff"), r.staff)}{tile(t("absent"), r.absent)}{tile(t("late"), r.late)}</div>
      <Card className="p-0">
        {r.alerts.length ? (
          <ul>
            {r.alerts.map((a) => (
              <li key={`${a.employeeId}-${a.kind}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-rule px-4 py-2.5 text-[0.9286rem] last:border-0">
                <Link href={`/hr/employees/${a.employeeId}`} className="font-medium text-primary hover:underline">{a.name}</Link>
                <span className="font-mono text-xs text-muted">{a.code}</span>
                <Badge tone={a.kind === "absent" ? "danger" : "warning"}>{t(`kinds.${a.kind}`)}</Badge>
                {a.inTime ? <span className="text-muted">{t("cameAt", { time: a.inTime })}</span> : null}
              </li>
            ))}
          </ul>
        ) : <p className="px-4 py-8 text-center text-muted">{t("none")}</p>}
      </Card>
    </>
  );
}
