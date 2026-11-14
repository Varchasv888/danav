import { getTranslations } from "next-intl/server";
import { Card } from "../ui";
import { rupees } from "@/lib/format";

export interface YearRow { employeeId: string; name: string; months: { month: string; target: string; achieved: string }[]; target: string; achieved: string; achievedPct: string | null; commission: string }

/** The year so far: each salesman's twelve months as bars (achieved against target) and the year's totals. */
export async function TargetsYear({ year, rows }: { year: number; rows: YearRow[] }) {
  const t = await getTranslations("targets");
  if (!rows.length) return null;
  const max = Math.max(...rows.flatMap((r) => r.months.flatMap((m) => [Number(m.target), Number(m.achieved)])), 1);
  return (
    <Card className="mt-4 p-0">
      <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("yearTitle", { year })}</h2>
      <div className="flex flex-col divide-y divide-rule">
        {rows.map((r) => (
          <div key={r.employeeId} className="grid gap-2 px-4 py-3 md:grid-cols-[12rem_1fr_14rem] md:items-center">
            <span className="font-medium">{r.name}</span>
            <div className="flex h-12 items-end gap-1" role="img" aria-label={t("yearChart", { name: r.name })}>
              {r.months.map((m) => (
                <div key={m.month} className="flex h-full flex-1 flex-col justify-end" title={`${m.month}: ${rupees(m.achieved)} / ${rupees(m.target)}`}>
                  <div className="w-full rounded-sm bg-primary" style={{ height: `${(Number(m.achieved) / max) * 100}%`, minHeight: Number(m.achieved) > 0 ? 2 : 0 }} />
                  <div className="mt-px h-0.5 w-full bg-muted" style={{ opacity: Number(m.target) > 0 ? 1 : 0 }} />
                </div>
              ))}
            </div>
            <div className="num text-right text-sm">{rupees(r.achieved)} / {rupees(r.target)}{r.achievedPct ? ` (${r.achievedPct}%)` : ""}<div className="text-xs text-muted">{t("yearCommission", { amount: rupees(r.commission) })}</div></div>
          </div>
        ))}
      </div>
    </Card>
  );
}
