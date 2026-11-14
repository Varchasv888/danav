import { Plus } from "lucide-react";
import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { Card, PageHeader } from "@/components/ui";
import { rupees } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";

interface Pending { id: string; number: string; date: string; customerName: string; pieces: string; value: string; daysOut: number; invoiceBy: string; daysLeft: number }

export async function generateMetadata() {
  return { title: (await getTranslations("sales.approvals"))("title") };
}

/** Goods out on approval, oldest first: chase the customer, take back what didn't sell, invoice the rest before six months. */
export default async function ApprovalsPage() {
  const t = await getTranslations();
  const format = await getFormatter();
  const [rows, me] = await Promise.all([serverApi<Pending[]>("/approvals/pending"), serverApi<Me>("/auth/me")]);
  const d = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  const total = rows.reduce((s, r) => s + Number(r.value), 0);
  return (
    <>
      <PageHeader
        title={t("sales.approvals.title")}
        subtitle={t("sales.approvals.subtitle")}
        actions={me.permissions.includes("sales.create") ? (
          <Link href="/sales/deliveries/new?reason=approval" className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover">
            <Plus className="size-4" aria-hidden />{t("sales.deliveries.newApproval")}
          </Link>
        ) : null}
      />
      {rows.length ? <p className="mb-4 text-sm text-muted">{t("sales.approvals.summary", { count: rows.length, value: rupees(String(total)) })}</p> : null}
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">{t("common.date")}</th>
                <th className="px-5 py-3 font-medium">{t("vouchers.number")}</th>
                <th className="px-5 py-3 font-medium">{t("sales.customer")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("sales.deliveries.stillOut")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("sales.deliveries.value")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("sales.approvals.daysOut")}</th>
                <th className="px-5 py-3 font-medium">{t("print.invoiceBy")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface-2/60">
                  <td className="px-5 py-2.5 whitespace-nowrap">{d(r.date)}</td>
                  <td className="px-5 py-2.5"><Link href={`/sales/deliveries/${r.id}`} className="font-mono text-primary hover:underline">{r.number}</Link></td>
                  <td className="px-5 py-2.5">{r.customerName}</td>
                  <td className="num px-5 py-2.5 text-right">{Number(r.pieces).toLocaleString("en-IN")}</td>
                  <td className="num px-5 py-2.5 text-right">{rupees(r.value)}</td>
                  <td className={`num px-5 py-2.5 text-right ${r.daysOut > 30 ? "font-semibold text-accent" : ""}`}>{r.daysOut}</td>
                  <td className={`px-5 py-2.5 whitespace-nowrap ${r.daysLeft <= 30 ? "font-semibold text-danger" : ""}`}>
                    {d(r.invoiceBy)}{r.daysLeft <= 30 ? <span className="ml-2 text-xs">{t("sales.approvals.daysLeft", { days: Math.max(r.daysLeft, 0) })}</span> : null}
                  </td>
                </tr>
              ))}
              {!rows.length ? <tr><td colSpan={7} className="px-5 py-10 text-center text-muted">{t("sales.approvals.empty")}</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
