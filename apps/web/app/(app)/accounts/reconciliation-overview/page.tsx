import clsx from "clsx";
import { ListChecks } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button, Card, Input, PageHeader } from "@/components/ui";
import { rupees, todayIso } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

interface Row { area: "customers" | "suppliers" | "stock" | "bank" | "gst"; state: "ok" | "differs" | "waiting"; left: string | null; right: string | null; difference: string | null; open: number }
interface Overview { asOf: string; gstPeriod: string; state: "ok" | "differs" | "waiting"; rows: Row[] }

export async function generateMetadata() {
  return { title: (await getTranslations("reconOverview"))("title") };
}

const FIX: Record<Row["area"], string> = {
  customers: "/reports/receivables", suppliers: "/reports/payables", stock: "/reports/stock-ledger-reconciliation", bank: "/banking", gst: "/gst/returns",
};

/** Every place the books must agree with something else, in one list: what each side says, the difference, and where to go to fix it. */
export default async function ReconciliationOverviewPage({ searchParams }: { searchParams: Promise<{ asOf?: string }> }) {
  const asOf = (await searchParams).asOf ?? todayIso();
  const t = await getTranslations("reconOverview");
  const data = await serverApi<Overview>(`/accounts/reconciliation-overview?asOf=${asOf}`);
  const tone = { ok: "bg-success-soft text-success", differs: "bg-danger-soft text-danger", waiting: "bg-surface-2 text-muted" } as const;
  return (
    <>
      <PageHeader icon={ListChecks} title={t("title")} subtitle={t("subtitle")}
        actions={(
          <form className="flex items-end gap-2">
            <label className="flex flex-col gap-1 text-sm"><span className="text-muted">{t("asOf")}</span><Input type="date" name="asOf" defaultValue={asOf} className="w-44" /></label>
            <Button type="submit" variant="outline">{t("apply")}</Button>
          </form>
        )} />
      <p role="status" className={clsx("mb-4 rounded-lg px-4 py-2.5 text-sm font-medium", tone[data.state])}>{t(`overall.${data.state}`)}</p>
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-4 py-2 font-medium">{t("area")}</th>
                <th className="px-3 py-2 text-right font-medium">{t("books")}</th>
                <th className="px-3 py-2 text-right font-medium">{t("other")}</th>
                <th className="px-3 py-2 text-right font-medium">{t("difference")}</th>
                <th className="px-3 py-2 font-medium">{t("status")}</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {data.rows.map((r) => (
                <tr key={r.area} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 align-top"><span className="font-medium">{t(`areas.${r.area}.name`)}</span><span className="block text-xs text-muted">{t(`areas.${r.area}.what`, { period: data.gstPeriod })}</span></td>
                  <td className="num px-3 py-3 text-right align-top">{r.left === null ? "-" : rupees(r.left)}</td>
                  <td className="num px-3 py-3 text-right align-top">{r.right === null ? "-" : rupees(r.right)}</td>
                  <td className={clsx("num px-3 py-3 text-right align-top", r.state === "differs" && "font-medium text-danger")}>
                    {r.area === "bank" ? (r.state === "waiting" ? "-" : t("unmatched", { count: r.open })) : r.difference === null ? "-" : rupees(r.difference)}
                  </td>
                  <td className="px-3 py-3 align-top"><span className={clsx("rounded px-2 py-0.5 text-xs font-medium", tone[r.state])}>{t(`state.${r.state}`)}</span></td>
                  <td className="px-3 py-3 text-right align-top"><Link href={FIX[r.area]} className="text-primary hover:underline">{t("open")}</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <p className="mt-3 text-xs text-muted">{t("note")}</p>
    </>
  );
}
