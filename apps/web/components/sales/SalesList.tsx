import { Plus } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { DateFilter } from "../DateFilter";
import { DataTable, type Column, type Row, type Tone } from "../data/DataTable";
import { PageHeader } from "../ui";
import { todayIso } from "@/lib/format";
import { LIST_LIMIT, range } from "@/lib/lists";
import { serverApi, type Me } from "@/lib/server-api";

interface Doc { id: string; number: string; date: string; customerName: string; status: string; total?: string; reason?: string; einvoiceStatus?: string; ewbStatus?: string; ewbNo?: string | null; validUntil?: string }

export type SalesKind = "quotations" | "proformas" | "orders" | "deliveries" | "invoices" | "creditNotes";
export const SALES_ENDPOINT: Record<SalesKind, string> = {
  quotations: "/quotations", proformas: "/quotations?kind=proforma", orders: "/sales-orders", deliveries: "/delivery-notes", invoices: "/sales-invoices", creditNotes: "/credit-notes",
};
export const SALES_PATH: Record<SalesKind, string> = {
  quotations: "/sales/quotations", proformas: "/sales/proformas", orders: "/sales/orders", deliveries: "/sales/deliveries", invoices: "/sales/invoices", creditNotes: "/sales/credit-notes",
};

export async function SalesList({ kind, from, to }: { kind: SalesKind; from?: string; to?: string }) {
  const t = await getTranslations();
  const [rows, me] = await Promise.all([serverApi<Doc[]>(`${SALES_ENDPOINT[kind]}${SALES_ENDPOINT[kind].includes("?") ? range(from, to).replace("?", "&") : range(from, to)}`), serverApi<Me>("/auth/me")]);
  const statusLabel = (s: string) => (t.has(`purchase.statuses.${s}`) ? t(`purchase.statuses.${s}`) : t(`sales.statuses.${s}`));
  const today = todayIso();
  // A quotation past its date shows as expired (it can still be converted if the customer agrees).
  const shown = (d: Doc) => (d.validUntil && d.validUntil < today && (d.status === "open" || d.status === "accepted") ? "expired" : d.status);
  const canNew = kind !== "creditNotes" && me.permissions.includes("sales.create");

  const tone = (st: string): Tone => (["open", "posted", "released"].includes(st) ? "info" : ["partial", "accepted"].includes(st) ? "warning" : ["received", "billed", "delivered", "invoiced", "converted", "completed", "paid"].includes(st) ? "success" : ["cancelled", "void"].includes(st) ? "danger" : "neutral");
  const columns: Column[] = [
    { key: "number", label: t("vouchers.number"), type: "link" },
    { key: "date", label: t("common.date"), type: "date" },
    { key: "customer", label: t("sales.customer") },
    { key: "status", label: t("purchase.status"), type: "status" },
    ...(kind === "invoices" ? [{ key: "einvoice", label: t("einvoice.title") }] : []),
    ...(kind === "quotations" || kind === "proformas" ? [{ key: "validUntil", label: t("sales.quotations.validUntil"), type: "date" as const }] : []),
    ...(kind === "deliveries" ? [{ key: "reason", label: t("sales.deliveries.reason") }] : []),
    { key: "total", label: kind === "deliveries" ? t("sales.deliveries.value") : t("purchase.total"), type: "money" },
  ];
  const data: Row[] = rows.map((d) => {
    const st = shown(d);
    return {
      id: d.id, href: `${SALES_PATH[kind]}/${d.id}`, number: d.number, date: d.date, customer: d.customerName, status: { label: statusLabel(st), tone: tone(st) },
      einvoice: d.einvoiceStatus && d.einvoiceStatus !== "not_required" ? `${t(`einvoice.status.${d.einvoiceStatus}`)}${d.ewbStatus === "active" ? " + EWB" : ""}` : d.ewbStatus === "active" ? "EWB" : null,
      validUntil: d.validUntil ?? null, reason: d.reason ? t(`sales.deliveries.reasons.${d.reason}`) : null, total: d.total && Number(d.total) ? Number(d.total) : null,
    };
  });

  return (
    <>
      <PageHeader
        title={t(`sales.${kind}.title`)}
        subtitle={t(`sales.${kind}.subtitle`)}
        actions={canNew ? (
          <Link href={`${SALES_PATH[kind]}/new`} className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3.5 text-[0.9286rem] font-semibold text-on-primary hover:bg-primary-hover">
            <Plus className="size-4" aria-hidden />{t(`sales.${kind}.new`)}
          </Link>
        ) : null}
      />
      <DataTable id={`sales-${kind}`} title={t(`sales.${kind}.title`)} note={from || to ? `${from ?? ""} - ${to ?? ""}` : undefined} filters={<DateFilter from={from} to={to} />} columns={columns} rows={data}
        empty={{ title: t("vouchers.empty") }} {...(rows.length >= LIST_LIMIT ? { limitNote: t("common.listCapped", { count: LIST_LIMIT }) } : {})} />
    </>
  );
}
