import { Plus, Truck } from "lucide-react";
import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

interface Row { id: string; number: string; date: string; from: string; to: string; status: string; pieces: string; received: string; short: string }

export async function generateMetadata() {
  return { title: (await getTranslations("transfers"))("title") };
}

/** Stock sent between warehouses: what is on the road, and what arrived against what left. */
export default async function TransfersPage() {
  const t = await getTranslations("transfers");
  const format = await getFormatter();
  const [rows, me] = await Promise.all([serverApi<Row[]>("/stock-transfers"), serverApi<Me>("/auth/me")]);
  const n = (v: string) => Number(v).toLocaleString("en-IN");
  return (
    <>
      <PageHeader
        icon={Truck} title={t("title")} subtitle={t("subtitle")}
        actions={me.permissions.includes("inventory.create") ? (
          <Link href="/inventory/transfers/new" className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover"><Plus className="size-4" aria-hidden />{t("new")}</Link>
        ) : null}
      />
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="text-left text-muted"><tr className="border-b border-border">
              <th className="px-5 py-3 font-medium">{t("date")}</th><th className="px-5 py-3 font-medium">{t("number")}</th><th className="px-5 py-3 font-medium">{t("from")}</th><th className="px-5 py-3 font-medium">{t("to")}</th>
              <th className="px-5 py-3 font-medium">{t("statusLabel")}</th><th className="px-5 py-3 text-right font-medium">{t("sent")}</th><th className="px-5 py-3 text-right font-medium">{t("received")}</th><th className="px-5 py-3 text-right font-medium">{t("short")}</th>
            </tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface-2/60">
                  <td className="px-5 py-2.5 whitespace-nowrap">{format.dateTime(new Date(`${r.date}T00:00:00`), { dateStyle: "medium" })}</td>
                  <td className="px-5 py-2.5"><Link href={`/inventory/transfers/${r.id}`} className="font-mono text-primary hover:underline">{r.number}</Link></td>
                  <td className="px-5 py-2.5">{r.from}</td><td className="px-5 py-2.5">{r.to}</td>
                  <td className="px-5 py-2.5"><StatusBadge status={r.status === "in_transit" ? "partial" : r.status === "received" ? "closed" : "cancelled"} label={t(`status.${r.status}`)} /></td>
                  <td className="num px-5 py-2.5 text-right">{n(r.pieces)}</td>
                  <td className="num px-5 py-2.5 text-right">{r.status === "received" ? n(r.received) : ""}</td>
                  <td className={`num px-5 py-2.5 text-right ${Number(r.short) > 0 ? "font-semibold text-danger" : ""}`}>{r.status === "received" ? n(r.short) : ""}</td>
                </tr>
              ))}
              {!rows.length ? <tr><td colSpan={8} className="px-5 py-10 text-center text-muted">{t("empty")}</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
