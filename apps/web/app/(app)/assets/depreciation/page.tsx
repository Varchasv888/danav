import { getFormatter, getTranslations } from "next-intl/server";
import { DepreciationRunner } from "@/components/assets/Assets";
import { CancelDocument } from "@/components/CancelDocument";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, PageHeader } from "@/components/ui";
import { rupees } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("assets.depreciation"))("title") };
}

interface Run { id: string; fromDate: string; toDate: string; total: string; status: string; number: string | null; voucherId: string | null; assets: number }

export default async function DepreciationPage() {
  const t = await getTranslations();
  const format = await getFormatter();
  const [runs, me] = await Promise.all([serverApi<Run[]>("/assets/depreciation/runs"), serverApi<Me>("/auth/me")]);
  const day = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  return (
    <>
      <PageHeader title={t("assets.depreciation.title")} subtitle={t("assets.depreciation.subtitle")} />
      <div className="flex flex-col gap-6">
        {me.permissions.includes("assets.submit") ? <DepreciationRunner /> : null}
        <Card className="p-0">
          <div className="border-b border-border px-5 py-3 font-semibold">{t("assets.depreciation.runs")}</div>
          <table className="w-full text-sm">
            <tbody>
              {runs.map((r) => (
                <tr key={r.id} className="border-b border-border align-top last:border-0">
                  <td className="px-5 py-2.5">{day(r.fromDate)} – {day(r.toDate)}<span className="block text-xs text-muted">{t("assets.depreciation.assets", { count: r.assets })}</span></td>
                  <td className="px-5 py-2.5">{r.voucherId ? <a href={`/accounts/vouchers/${r.voucherId}`} className="font-mono text-primary hover:underline">{r.number}</a> : null}</td>
                  <td className="num px-5 py-2.5 text-right">{rupees(r.total)}</td>
                  <td className="px-5 py-2.5">{r.status === "cancelled" ? <StatusBadge status="cancelled" label={t("purchase.statuses.cancelled")} /> : null}</td>
                  <td className="px-5 py-2.5 text-right">{r.status === "posted" && me.permissions.includes("assets.cancel") ? <CancelDocument path={`/assets/depreciation/runs/${r.id}/cancel`} label={t("assets.depreciation.cancel")} /> : null}</td>
                </tr>
              ))}
              {!runs.length ? <tr><td className="px-5 py-8 text-center text-muted">-</td></tr> : null}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
}
