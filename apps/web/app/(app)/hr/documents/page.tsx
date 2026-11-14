import { IdCard } from "lucide-react";
import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { Badge, Button, Card, Field, PageHeader, Select } from "@/components/ui";
import { serverApi } from "@/lib/server-api";

interface Doc { id: string; kind: string; number: string | null; expiresOn: string; employeeId: string; employee: string; code: string; daysLeft: number }
type Props = { searchParams: Promise<{ days?: string }> };

export async function generateMetadata() {
  return { title: (await getTranslations("hr.documents"))("expiringTitle") };
}

const WINDOWS = [30, 60, 90, 180, 365] as const;

/** Employee documents that have lapsed or lapse soon, soonest first, across everyone. */
export default async function ExpiringDocumentsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const days = WINDOWS.find((d) => String(d) === sp.days) ?? 60;
  const t = await getTranslations("hr.documents");
  const format = await getFormatter();
  const rows = await serverApi<Doc[]>(`/hr/documents/expiring?days=${days}`);
  const day = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  return (
    <>
      <PageHeader icon={IdCard} title={t("expiringTitle")} subtitle={t("expiringSubtitle")} print />
      <form method="get" className="mb-4 flex items-end gap-3 print:hidden">
        <Field label={t("within")} htmlFor="ex-days"><Select id="ex-days" name="days" defaultValue={String(days)} className="w-44">{WINDOWS.map((d) => <option key={d} value={d}>{t("windowDays", { n: d })}</option>)}</Select></Field>
        <Button type="submit" variant="outline">{t("show")}</Button>
      </form>
      <Card className="p-0">
        {rows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-[0.9286rem]">
              <thead><tr className="border-b border-border bg-surface-2 text-left text-xs font-semibold text-muted"><th className="px-4 py-1.5">{t("employee")}</th><th className="px-4 py-1.5">{t("kind")}</th><th className="px-4 py-1.5">{t("number")}</th><th className="px-4 py-1.5">{t("expiresOnLabel")}</th><th className="px-4 py-1.5" /></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-rule last:border-0">
                    <td className="px-4 py-2"><Link href={`/hr/employees/${r.employeeId}`} className="font-medium text-primary hover:underline">{r.employee}</Link> <span className="font-mono text-xs text-muted">{r.code}</span></td>
                    <td className="px-4 py-2">{t(`kinds.${r.kind}`)}</td>
                    <td className="px-4 py-2 font-mono text-xs text-muted">{r.number}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{day(r.expiresOn)}</td>
                    <td className="px-4 py-2">{r.daysLeft < 0 ? <Badge tone="danger">{t("expired")}</Badge> : <Badge tone={r.daysLeft <= 30 ? "warning" : "neutral"}>{t("daysLeft", { n: r.daysLeft })}</Badge>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="px-4 py-8 text-center text-muted">{t("noneExpiring")}</p>}
      </Card>
    </>
  );
}
