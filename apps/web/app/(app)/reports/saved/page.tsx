import { CalendarClock, Plus } from "lucide-react";
import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { DeleteReport, type SavedReport } from "@/components/reports/Builder";
import { Card, PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("reports.builder"))("savedTitle") };
}

export default async function SavedReportsPage() {
  const t = await getTranslations();
  const format = await getFormatter();
  const [reports, me] = await Promise.all([serverApi<(SavedReport & { nextRunAt: string | null; lastError: string | null })[]>("/reports/saved"), serverApi<Me>("/auth/me")]);
  const canEdit = me.permissions.includes("reports.export");
  return (
    <>
      <PageHeader icon={CalendarClock} title={t("reports.builder.savedTitle")} subtitle={t("reports.builder.subtitle")}
        actions={<Link href="/reports/builder" className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover"><Plus className="size-4" aria-hidden />{t("reports.builder.title")}</Link>} />
      <Card className="p-0">
        <ul className="divide-y divide-border">
          {reports.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center gap-4 px-5 py-3 text-sm">
              <div className="min-w-0 flex-1">
                <Link href={`/reports/builder?id=${r.id}`} className="font-medium text-primary hover:underline">{r.name}</Link>
                <p className="text-xs text-muted">
                  {t(`reports.builder.datasets.${r.config.dataset}`)} · {t(`reports.builder.presets.${r.config.period.preset}`)}
                  {r.frequency ? ` · ${t(`reports.builder.frequencies.${r.frequency}`)} → ${r.recipients.join(", ")}` : ""}
                </p>
                {r.nextRunAt ? <p className="text-xs text-muted">{t("reports.builder.nextRun", { date: format.dateTime(new Date(r.nextRunAt), { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }) })}</p> : null}
                {r.lastError ? <p className="text-xs text-danger">{t("reports.builder.lastError", { error: r.lastError })}</p> : null}
              </div>
              {canEdit ? <DeleteReport id={r.id} /> : null}
            </li>
          ))}
          {!reports.length ? <li className="px-5 py-10 text-center text-muted">{t("reports.builder.none")}</li> : null}
        </ul>
      </Card>
    </>
  );
}
