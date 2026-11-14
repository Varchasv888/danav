import { Plus } from "lucide-react";
import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { DateFilter } from "../DateFilter";
import { StatusBadge } from "../StatusBadge";
import { Card, PageHeader } from "../ui";
import { rupees } from "@/lib/format";
import { LIST_LIMIT, range } from "@/lib/lists";
import { serverApi, type Me } from "@/lib/server-api";

interface Doc { id: string; number: string; date: string; supplierName: string; status: string; total?: string; supplierInvoiceNo?: string; supplierChallan?: string | null }

/** List screen shared by purchase orders, goods receipts, bills and returns. */
export async function DocList({ kind, from, to }: { kind: "orders" | "receipts" | "bills" | "returns"; from?: string; to?: string }) {
  const t = await getTranslations();
  const format = await getFormatter();
  const endpoint = { orders: "/purchase-orders", receipts: "/goods-receipts", bills: "/purchase-bills", returns: "/purchase-returns" }[kind];
  const [rows, me] = await Promise.all([serverApi<Doc[]>(`${endpoint}${range(from, to)}`), serverApi<Me>("/auth/me")]);
  const newHref = kind === "returns" ? null : `/purchase/${kind}/new`;
  const showTotal = kind !== "receipts";

  return (
    <>
      <PageHeader
        title={t(`purchase.${kind}.title`)}
        subtitle={t(`purchase.${kind}.subtitle`)}
        actions={newHref && me.permissions.includes("purchase.create") ? (
          <Link href={newHref} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover">
            <Plus className="size-4" aria-hidden />{t(`purchase.${kind}.new`)}
          </Link>
        ) : null}
      />
      <div className="mb-4"><DateFilter from={from} to={to} /></div>
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">{t("common.date")}</th>
                <th className="px-5 py-3 font-medium">{t("vouchers.number")}</th>
                <th className="px-5 py-3 font-medium">{t("purchase.supplier")}</th>
                {kind === "bills" ? <th className="px-5 py-3 font-medium">{t("purchase.bills.invoiceNo")}</th> : null}
                <th className="px-5 py-3 font-medium">{t("purchase.status")}</th>
                {showTotal ? <th className="px-5 py-3 text-right font-medium">{t("purchase.total")}</th> : null}
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d.id} className="border-b border-border last:border-0 hover:bg-surface-2/60">
                  <td className="px-5 py-2.5 whitespace-nowrap">{format.dateTime(new Date(`${d.date}T00:00:00`), { dateStyle: "medium" })}</td>
                  <td className="px-5 py-2.5"><Link href={`/purchase/${kind}/${d.id}`} className="font-mono text-primary hover:underline">{d.number}</Link></td>
                  <td className="px-5 py-2.5">{d.supplierName}</td>
                  {kind === "bills" ? <td className="px-5 py-2.5 font-mono text-xs">{d.supplierInvoiceNo}</td> : null}
                  <td className="px-5 py-2.5"><StatusBadge status={d.status} label={t(`purchase.statuses.${d.status}`)} /></td>
                  {showTotal ? <td className="num px-5 py-2.5 text-right">{d.total ? rupees(d.total) : ""}</td> : null}
                </tr>
              ))}
              {!rows.length ? <tr><td colSpan={6} className="px-5 py-10 text-center text-muted">{t("vouchers.empty")}</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>
      {rows.length >= LIST_LIMIT ? <p className="mt-3 text-sm text-muted">{t("common.listCapped", { count: LIST_LIMIT })}</p> : null}
    </>
  );
}
