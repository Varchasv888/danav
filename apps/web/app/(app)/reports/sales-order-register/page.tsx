import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { DateFilter } from "@/components/DateFilter";
import { Badge, Card, PageHeader } from "@/components/ui";
import { rupees, todayIso } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

interface Order { id: string; number: string; date: string; deliverBy: string | null; status: string; customer: string; ordered: string; served: string; pending: string; pendingValue: string; overdue: boolean }
interface Result { asOf: string; orders: Order[]; count: number; overdue: number; pendingPieces: number; pendingValue: string }

export async function generateMetadata() {
  return { title: (await getTranslations("orderRegister"))("title") };
}

/** Sales orders still to be fulfilled, the late ones first. */
export default async function SalesOrderRegisterPage({ searchParams }: { searchParams: Promise<{ asOf?: string }> }) {
  const asOf = (await searchParams).asOf ?? todayIso();
  const t = await getTranslations("orderRegister");
  const format = await getFormatter();
  const r = await serverApi<Result>(`/reports/sales-order-register?asOf=${asOf}`);
  const day = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  const tile = (label: string, value: string) => <div className="rounded-md border border-border bg-surface p-3"><div className="text-xs text-muted">{label}</div><div className="num mt-1 text-[1.4rem] font-semibold">{value}</div></div>;
  return (
    <>
      <PageHeader icon={ClipboardList} title={t("title")} subtitle={t("subtitle")} print actions={<DateFilter asOf={asOf} />} />
      <div className="mb-4 grid gap-3 sm:grid-cols-4">{tile(t("open"), String(r.count))}{tile(t("late"), String(r.overdue))}{tile(t("pendingPieces"), r.pendingPieces.toLocaleString("en-IN"))}{tile(t("pendingValue"), rupees(r.pendingValue))}</div>
      <Card className="p-0">
        {r.orders.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-[0.9286rem]">
              <thead><tr className="border-b border-border bg-surface-2 text-left text-xs font-semibold text-muted">
                <th className="px-4 py-1.5">{t("order")}</th><th className="px-4 py-1.5">{t("customer")}</th><th className="px-4 py-1.5">{t("promised")}</th>
                <th className="px-4 py-1.5 text-right">{t("ordered")}</th><th className="px-4 py-1.5 text-right">{t("sent")}</th><th className="px-4 py-1.5 text-right">{t("pending")}</th><th className="px-4 py-1.5 text-right">{t("value")}</th>
              </tr></thead>
              <tbody>
                {r.orders.map((o) => (
                  <tr key={o.id} className="border-b border-rule last:border-0">
                    <td className="px-4 py-2"><Link href={`/sales/orders/${o.id}`} className="font-mono text-primary hover:underline">{o.number}</Link> <span className="text-xs text-muted">{day(o.date)}</span></td>
                    <td className="px-4 py-2">{o.customer}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{o.deliverBy ? day(o.deliverBy) : ""} {o.overdue ? <Badge tone="danger">{t("lateBadge")}</Badge> : null}</td>
                    <td className="num px-4 py-2 text-right">{o.ordered}</td><td className="num px-4 py-2 text-right">{o.served}</td><td className="num px-4 py-2 text-right font-semibold">{o.pending}</td><td className="num px-4 py-2 text-right">{rupees(o.pendingValue)}</td>
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
