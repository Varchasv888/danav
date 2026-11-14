import { getLocale, getTranslations } from "next-intl/server";
import { AttendanceGrid, Holidays, WeekOffChanges, type Month, type OffChange } from "@/components/hr/AttendanceGrid";
import { PunchImport } from "@/components/hr/PunchImport";
import { Button, PageHeader, Select } from "@/components/ui";
import { todayIso } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";
import { intlLocale } from "@varchasv/i18n/locales";

export async function generateMetadata() {
  return { title: (await getTranslations("hr.attendance"))("title") };
}

/** This month and the eleven before it, newest first. */
function months(today: string) {
  const out: string[] = [];
  let y = Number(today.slice(0, 4));
  let m = Number(today.slice(5, 7));
  for (let i = 0; i < 12; i++) {
    out.push(`${y}-${String(m).padStart(2, "0")}`);
    if (--m === 0) { m = 12; y -= 1; }
  }
  return out;
}

export default async function AttendancePage({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
  const options = months(todayIso());
  const period = (await searchParams).period ?? options[0]!;
  const t = await getTranslations();
  const locale = await getLocale();
  const [month, me, holidays, changes] = await Promise.all([
    serverApi<Month>(`/attendance?period=${period}`), serverApi<Me>("/auth/me"), serverApi<{ id: string; date: string; name: string }[]>(`/holidays?year=${period.slice(0, 4)}`),
    serverApi<OffChange[]>(`/hr/week-off-changes?period=${period}`),
  ]);
  const label = (p: string) => new Date(`${p}-01T00:00:00Z`).toLocaleString(intlLocale(locale), { month: "long", year: "numeric", timeZone: "UTC" });
  const canEdit = me.permissions.includes("hr.edit");
  return (
    <>
      <PageHeader title={t("hr.attendance.title")} subtitle={t("hr.attendance.subtitle")}
        actions={(
          <form className="flex items-end gap-3">
            <Select name="period" defaultValue={period} className="w-48" aria-label={t("payroll.month")}>{options.map((p) => <option key={p} value={p}>{label(p)}</option>)}</Select>
            <Button type="submit" variant="outline">{t("common.apply")}</Button>
          </form>
        )} />
      <div className="flex flex-col gap-6">
        <AttendanceGrid month={month} canEdit={canEdit} />
        {canEdit ? <PunchImport /> : null}
        <WeekOffChanges employees={month.employees} changes={changes} canEdit={canEdit} locked={month.locked} />
        <Holidays holidays={holidays} canEdit={canEdit} />
      </div>
    </>
  );
}
