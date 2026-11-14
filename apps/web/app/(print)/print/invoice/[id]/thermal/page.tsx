import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { invoiceAsReceipt, resolvePreferences, type InvoiceLike } from "@varchasv/domain";
import { ReceiptView, type Receipt } from "@/components/pos/ReceiptView";
import type { Paper } from "@/components/pos/ReceiptPaper";
import { printTitle, type PrintData } from "@/components/print/TaxDocument";
import { serverApi } from "@/lib/server-api";

const loadPrefs = () => serverApi<Record<string, boolean | string>>("/settings/preferences").catch(() => undefined);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  return printTitle(await serverApi<PrintData>(`/sales-invoices/${(await params).id}/print`));
}

/** A tax invoice on the paper roll: the same layouts and options as the counter receipt, with what was received, what is due and a UPI pay-now QR code. */
export default async function PrintInvoiceThermal({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ w?: string }> }) {
  const id = (await params).id;
  const w = (await searchParams).w;
  const t = await getTranslations("print");
  const prefs = await loadPrefs();
  const pf = resolvePreferences(prefs);
  const d = await serverApi<PrintData>(`/sales-invoices/${id}/print?count=1`);
  const title = String(pf["names.invoice"] ?? "").trim() || (await getTranslations({ locale: "en" }))("print.taxInvoice");
  const balance = Number(d.invoice.balance ?? 0);
  const upi = String(pf["print.upiId"] ?? "").trim();
  const upiUrl = upi && pf["print.showUpiQr"] === true && balance > 0
    ? `upi://pay?pa=${encodeURIComponent(upi)}&pn=${encodeURIComponent(d.company.name)}&am=${balance.toFixed(2)}&cu=INR&tn=${encodeURIComponent(d.invoice.number)}` : null;
  const r = invoiceAsReceipt(d.invoice as unknown as InvoiceLike, { name: d.company.legalName ?? d.company.name }, { gstin: d.branch.gstin, address: d.branch.address, stateCode: d.branch.stateCode }, title, upiUrl) as unknown as Receipt;
  const paper = (w === "58" || w === "68" || w === "88" || w === "a4" ? w : String(pf["thermal.size"])) as Paper;
  return (
    <>
      <p className="no-print mx-auto mb-2 max-w-[80mm] text-center text-xs"><Link href={`/print/invoice/${id}?as=regular`} className="text-blue-700 underline">{t("useRegular")}</Link></p>
      <ReceiptView r={r} paper={paper} prefs={prefs} direct={`/sales-invoices/${id}/escpos`} />
    </>
  );
}
