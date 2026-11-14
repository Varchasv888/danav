import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CancelDocument } from "@/components/CancelDocument";
import { DocDetail, type Doc } from "@/components/purchase/DocDetail";
import { QuotationStatus } from "@/components/sales/QuotationStatus";
import { loadFlow, SalesFlowBar } from "@/components/sales/SalesFlowBar";
import { rupees, todayIso } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";

type Quotation = Doc & { validUntil: string; convertedKind: "order" | "invoice" | null; convertedId: string | null; terms: string | null; advanceDue: string | null };

/** A quotation or a proforma invoice: both convert into an order or an invoice and print from the same layout. */
export async function QuotationDetail({ id, kind }: { id: string; kind: "quotations" | "proformas" }) {
  const t = await getTranslations();
  const [doc, me, flow] = await Promise.all([serverApi<Quotation>(`/quotations/${id}`), serverApi<Me>("/auth/me"), kind === "quotations" ? loadFlow("quotation", id) : Promise.resolve(null)]);
  const live = doc.status === "open" || doc.status === "accepted";
  const expired = live && doc.validUntil < todayIso();
  const can = (p: string) => me.permissions.includes(p);
  const btn = "inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium";
  const validUntil = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" }).format(new Date(`${doc.validUntil}T00:00:00+05:30`));
  const subtitle = [`${t("sales.quotations.validUntil")} ${validUntil}`, doc.advanceDue ? `${t("sales.proformas.advanceDue")} ${rupees(doc.advanceDue)}` : null].filter(Boolean).join(" · ");
  return (
    <DocDetail doc={{ ...doc, status: expired ? "expired" : doc.status }} title={t(`sales.${kind}.title`)} back={`/sales/${kind}`} subtitle={subtitle} flow={<SalesFlowBar flow={flow} kind="quotation" docId={doc.id} permissions={me.permissions} />}>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {live && can("sales.create") ? (
          <>
            <Link href={`/sales/invoices/new?quotationId=${doc.id}`} className={`${btn} ${kind === "proformas" ? "bg-primary text-on-primary hover:bg-primary-hover" : "border border-border bg-surface hover:bg-surface-2"}`}>{t("sales.quotations.toInvoice")}</Link>
            <Link href={`/sales/orders/new?quotationId=${doc.id}`} className={`${btn} ${kind === "proformas" ? "border border-border bg-surface hover:bg-surface-2" : "bg-primary text-on-primary hover:bg-primary-hover"}`}>{t("sales.quotations.toOrder")}</Link>
          </>
        ) : null}
        <Link href={`/print/quotation/${doc.id}`} target="_blank" className={`${btn} border border-border bg-surface hover:bg-surface-2`}>{t("sales.quotations.print")}</Link>
        {live && can("sales.edit") ? <QuotationStatus id={doc.id} canAccept={doc.status === "open"} /> : null}
      </div>
      {doc.convertedKind && doc.convertedId ? (
        <p className="mt-3 text-sm">
          <Link href={`/sales/${doc.convertedKind === "order" ? "orders" : "invoices"}/${doc.convertedId}`} className="text-primary hover:underline">
            {t("sales.quotations.convertedTo", { kind: doc.convertedKind })} →
          </Link>
        </p>
      ) : null}
      {live && can("sales.cancel") ? <CancelDocument path={`/quotations/${doc.id}/cancel`} label={t("common.cancel")} /> : null}
    </DocDetail>
  );
}
