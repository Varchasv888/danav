import { Printer } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { dec } from "@varchasv/domain";
import { CancelDocument } from "@/components/CancelDocument";
import { DocDetail, type Doc } from "@/components/purchase/DocDetail";
import { CreditNoteForm } from "@/components/sales/CreditNoteForm";
import { EinvoicePanel, type EinvoiceState } from "@/components/sales/EinvoicePanel";
import { ActionMenu } from "@/components/sales/ActionMenu";
import { InvoiceWarnings } from "@/components/sales/InvoiceWarnings";
import { loadFlow, SalesFlowBar } from "@/components/sales/SalesFlowBar";
import { SendWhatsApp } from "@/components/sharing/SendWhatsApp";
import { receivePaymentHref } from "@/lib/sales-flow";
import { serverApi, type Me } from "@/lib/server-api";

type Invoice = Doc & EinvoiceState & { voucherId: string | null; dueOn: string | null; customerPhone: string | null; placeOfSupply: string; lines: (Doc["lines"][number] & { kind: string })[] };

export default async function InvoicePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ w?: string }> }) {
  const { id } = await params;
  const { w } = await searchParams;
  const t = await getTranslations();
  const [inv, me, flow] = await Promise.all([serverApi<Invoice>(`/sales-invoices/${id}`), serverApi<Me>("/auth/me"), loadFlow("invoice", id)]);
  const posted = inv.status === "posted";
  const payHref = flow ? receivePaymentHref(flow) : null;
  const returnable = inv.lines.filter((l) => dec(l.qty).gt(l.returnedQty ?? "0"));
  let warnings: { code: string; lineNo?: number; detail?: string }[] = [];
  try { warnings = w ? JSON.parse(w) : []; } catch { /* ignore a mangled link */ }

  return (
    <DocDetail doc={inv} title={t("sales.invoices.title")} back="/sales/invoices" extraColumns={["returnedQty"]} flow={<SalesFlowBar flow={flow} kind="invoice" docId={inv.id} permissions={me.permissions} />}
      subtitle={[`${t("sales.placeOfSupply")} ${inv.placeOfSupply}`, inv.dueOn ? `${t("sales.invoices.dueOn")} ${inv.dueOn}` : null].filter(Boolean).join(" · ")}>
      <InvoiceWarnings warnings={warnings} />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {posted && payHref && me.permissions.includes("accounts.create") ? (
          <Link href={payHref} className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover">{t("salesFlow.action.receivePayment")}</Link>
        ) : null}
        <ActionMenu label={t("sales.invoices.print")} icon={<Printer className="size-4" aria-hidden />} items={[
          { href: `/print/invoice/${inv.id}`, label: t("sales.invoices.print"), newTab: true },
          { href: `/print/packing-slip/${inv.id}`, label: t("sales.invoices.packingSlip"), newTab: true },
          { href: `/print/parcel-labels/${inv.id}`, label: t("parcelLabels.link"), newTab: true },
          { href: `/print/box-label/${inv.id}`, label: t("boxLabel.link"), newTab: true },
        ]} />
        {posted && me.permissions.includes("sales.create") ? <SendWhatsApp endpoint={`/sales-invoices/${inv.id}/send`} phone={inv.customerPhone} /> : null}
        {inv.voucherId ? <Link href={`/accounts/vouchers/${inv.voucherId}`} className="text-sm text-primary hover:underline">{t("nav.vouchers")} →</Link> : null}
      </div>
      <EinvoicePanel invoice={inv} canSubmit={me.permissions.includes("gst.submit")} canCancel={me.permissions.includes("gst.cancel")} hasGoods={inv.lines.some((l) => l.kind === "goods")} />
      {posted && returnable.length && me.permissions.includes("sales.create") ? (
        <CreditNoteForm invoiceId={inv.id} lines={returnable.map((l) => ({ id: l.id, itemName: l.itemName, itemNameHi: l.itemNameHi, max: dec(l.qty).minus(l.returnedQty ?? "0").toString(), rate: l.rate }))} />
      ) : null}
      {posted && inv.einvoiceStatus !== "generated" && me.permissions.includes("sales.cancel") ? <CancelDocument path={`/sales-invoices/${inv.id}/cancel`} label={t("common.cancel")} /> : null}
    </DocDetail>
  );
}
