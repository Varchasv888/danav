import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { DeliveryOrderActions } from "@/components/sales/DeliveryOrderActions";
import { loadFlow, SalesFlowBar } from "@/components/sales/SalesFlowBar";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, PageHeader } from "@/components/ui";
import { localName } from "@/lib/format";
import { customers, items } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

interface Line { id: string; itemId: string; qty: string; dispatched: string; toDispatch: string; billed: string; difference: string }
interface Order {
  id: string; number: string; date: string; deliverBy: string | null; transporter: string | null; status: string; narration: string | null; customerId: string;
  lines: Line[]; challans: { id: string; number: string; date: string; status: string }[];
}

export default async function DeliveryOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations("deliveryOrders");
  const format = await getFormatter();
  const [order, me, c, i, flow] = await Promise.all([serverApi<Order>(`/delivery-orders/${id}`), serverApi<Me>("/auth/me"), customers(), items(), loadFlow("deliveryOrder", id)]);
  const customer = c.find((x) => x.id === order.customerId);
  const itemName = (itemId: string) => { const it = i.find((x) => x.id === itemId); return it ? localName(it, "en") : itemId; };
  const day = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  const n = (v: string) => Number(v).toLocaleString("en-IN");
  const open = order.status === "open";
  const left = order.lines.some((l) => Number(l.toDispatch) > 0);
  const canSend = me.permissions.includes("sales.create");
  return (
    <>
      <PageHeader
        icon={ClipboardList}
        title={`${t("title")} ${order.number}`}
        subtitle={[customer?.name, day(order.date), order.deliverBy ? t("deliverByOn", { date: day(order.deliverBy) }) : null, order.transporter].filter(Boolean).join(", ")}
        actions={<StatusBadge status={order.status} label={t(`status.${order.status}`)} />}
      />
      <SalesFlowBar flow={flow} kind="deliveryOrder" docId={order.id} />
      {order.narration ? <p className="mb-4 text-sm text-muted">{order.narration}</p> : null}
      <Card className="mb-4 p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">{t("item")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("ordered")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("sent")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("toSend")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("billed")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("notBilled")}</th>
              </tr>
            </thead>
            <tbody>
              {order.lines.map((l) => (
                <tr key={l.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-2.5 font-medium">{itemName(l.itemId)}</td>
                  <td className="num px-5 py-2.5 text-right">{n(l.qty)}</td>
                  <td className="num px-5 py-2.5 text-right">{n(l.dispatched)}</td>
                  <td className="num px-5 py-2.5 text-right">{n(l.toDispatch)}</td>
                  <td className="num px-5 py-2.5 text-right">{n(l.billed)}</td>
                  <td className="num px-5 py-2.5 text-right font-semibold">{n(l.difference)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card className="mb-4">
        <h2 className="mb-2 text-sm font-semibold">{t("challans")}</h2>
        {order.challans.length ? (
          <ul className="flex flex-col gap-1 text-sm">
            {order.challans.map((d) => (
              <li key={d.id} className="flex items-center gap-3">
                <Link href={`/sales/deliveries/${d.id}`} className="font-mono text-primary hover:underline">{d.number}</Link>
                <span className="text-muted">{day(d.date)}</span>
                <StatusBadge status={d.status} label={d.status} />
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted">{t("noChallans")}</p>}
      </Card>
      {open ? (
        <div className="flex flex-wrap gap-3">
          {canSend && left ? <Link href={`/sales/deliveries/new?deliveryOrderId=${order.id}`} className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover">{t("makeChallan")}</Link> : null}
          <DeliveryOrderActions id={order.id} canClose={canSend} canCancel={me.permissions.includes("sales.cancel") && order.challans.length === 0} />
        </div>
      ) : null}
    </>
  );
}
