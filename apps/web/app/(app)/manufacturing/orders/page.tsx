import { Plus } from "lucide-react";
import Link from "next/link";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, PageHeader } from "@/components/ui";
import { localName } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("mfg.orders"))("title") };
}

interface Order { id: string; number: string; date: string; itemName: string; itemNameHi: string | null; qty: string; producedQty: string; rejectedQty: string; status: string }
const n = (v: string) => Number(v).toLocaleString("en-IN", { maximumFractionDigits: 4 });

export default async function ProductionOrdersPage() {
  const t = await getTranslations();
  const locale = await getLocale();
  const format = await getFormatter();
  const [rows, me] = await Promise.all([serverApi<Order[]>("/production-orders"), serverApi<Me>("/auth/me")]);
  return (
    <>
      <PageHeader title={t("mfg.orders.title")} subtitle={t("mfg.orders.subtitle")}
        actions={me.permissions.includes("inventory.create") ? (
          <Link href="/manufacturing/orders/new" className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover">
            <Plus className="size-4" aria-hidden />{t("mfg.orders.new")}
          </Link>
        ) : null} />
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="text-left text-muted"><tr className="border-b border-border">
              <th className="px-5 py-3 font-medium">{t("common.date")}</th>
              <th className="px-5 py-3 font-medium">{t("vouchers.number")}</th>
              <th className="px-5 py-3 font-medium">{t("mfg.orders.item")}</th>
              <th className="px-5 py-3 text-right font-medium">{t("mfg.orders.qty")}</th>
              <th className="px-5 py-3 text-right font-medium">{t("mfg.orders.produced")}</th>
              <th className="px-5 py-3 font-medium">{t("mfg.orders.status")}</th>
            </tr></thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id} className="border-b border-border last:border-0 hover:bg-surface-2/60">
                  <td className="px-5 py-2.5 whitespace-nowrap">{format.dateTime(new Date(`${o.date}T00:00:00`), { dateStyle: "medium" })}</td>
                  <td className="px-5 py-2.5"><Link href={`/manufacturing/orders/${o.id}`} className="font-mono text-primary hover:underline">{o.number}</Link></td>
                  <td className="px-5 py-2.5">{localName({ name: o.itemName, nameHi: o.itemNameHi }, locale)}</td>
                  <td className="num px-5 py-2.5 text-right">{n(o.qty)}</td>
                  <td className="num px-5 py-2.5 text-right">{n(o.producedQty)}{Number(o.rejectedQty) ? <span className="text-danger"> +{n(o.rejectedQty)}</span> : null}</td>
                  <td className="px-5 py-2.5"><StatusBadge status={o.status} label={t(`mfg.orders.statuses.${o.status}`)} /></td>
                </tr>
              ))}
              {!rows.length ? <tr><td colSpan={6} className="px-5 py-10 text-center text-muted">{t("mfg.orders.none")}</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
