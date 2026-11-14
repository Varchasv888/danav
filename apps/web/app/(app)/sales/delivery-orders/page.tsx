import { ClipboardList, Plus } from "lucide-react";
import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

interface Row { id: string; number: string; date: string; customer: string; status: string; pieces: string; dispatched: string; billed: string }

export async function generateMetadata() {
  return { title: (await getTranslations("deliveryOrders"))("title") };
}

/** Delivery orders: what the warehouse has been told to send, how much went out and how much was billed. */
export default async function DeliveryOrdersPage() {
  const t = await getTranslations("deliveryOrders");
  const format = await getFormatter();
  const [rows, me] = await Promise.all([serverApi<Row[]>("/delivery-orders"), serverApi<Me>("/auth/me")]);
  const n = (v: string) => Number(v).toLocaleString("en-IN");
  return (
    <>
      <PageHeader
        icon={ClipboardList}
        title={t("title")}
        subtitle={t("subtitle")}
        actions={me.permissions.includes("sales.create") ? (
          <Link href="/sales/delivery-orders/new" className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover">
            <Plus className="size-4" aria-hidden />{t("new")}
          </Link>
        ) : null}
      />
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">{t("date")}</th>
                <th className="px-5 py-3 font-medium">{t("number")}</th>
                <th className="px-5 py-3 font-medium">{t("customer")}</th>
                <th className="px-5 py-3 font-medium">{t("statusLabel")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("pieces")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("sent")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("billed")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d.id} className="border-b border-border last:border-0 hover:bg-surface-2/60">
                  <td className="px-5 py-2.5 whitespace-nowrap">{format.dateTime(new Date(`${d.date}T00:00:00`), { dateStyle: "medium" })}</td>
                  <td className="px-5 py-2.5"><Link href={`/sales/delivery-orders/${d.id}`} className="font-mono text-primary hover:underline">{d.number}</Link></td>
                  <td className="px-5 py-2.5">{d.customer}</td>
                  <td className="px-5 py-2.5"><StatusBadge status={d.status} label={t(`status.${d.status}`)} /></td>
                  <td className="num px-5 py-2.5 text-right">{n(d.pieces)}</td>
                  <td className="num px-5 py-2.5 text-right">{n(d.dispatched)}</td>
                  <td className="num px-5 py-2.5 text-right">{n(d.billed)}</td>
                </tr>
              ))}
              {!rows.length ? <tr><td colSpan={7} className="px-5 py-10 text-center text-muted">{t("empty")}</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
