import { getTranslations } from "next-intl/server";
import { PrintButton } from "@/components/sales/PrintButton";
import { serverApi } from "@/lib/server-api";
import { PrintSetup } from "@/components/print/PrintSetup";

interface Data {
  invoice: { number: string; date: string; customerName: string; cartons?: number | null; billingAddress: { line1?: string; city?: string; pincode?: string }; shippingAddress?: { line1?: string; city?: string; pincode?: string } | null };
  company: { name: string; legalName: string | null };
}

export async function generateMetadata() {
  return { title: { absolute: "Parcel labels" } };
}

/** One label per carton ("Carton 3 of 10") with the consignee's address, the sender and the invoice, to stick on each parcel. */
export default async function ParcelLabelsPage({ params }: { params: Promise<{ id: string }> }) {
  const d = await serverApi<Data>(`/sales-invoices/${(await params).id}/print`);
  const t = await getTranslations("parcelLabels");
  const to = d.invoice.shippingAddress?.line1 ? d.invoice.shippingAddress : d.invoice.billingAddress;
  const n = Math.max(1, d.invoice.cartons ?? 1);
  return (
    <main className="mx-auto max-w-[210mm] bg-white p-6 text-black print:max-w-none print:p-0"><PrintSetup size="A4" />
      <div className="mb-4 print:hidden"><PrintButton /><p className="mt-2 text-sm text-gray-600">{t("help", { n })}</p></div>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: n }, (_, i) => (
          <section key={i} className="break-inside-avoid border border-black p-3 text-[13px]">
            <p className="text-xs uppercase">{t("to")}</p>
            <p className="text-lg font-bold">{d.invoice.customerName}</p>
            <p>{[to?.line1, to?.city, to?.pincode].filter(Boolean).join(", ")}</p>
            <div className="mt-2 flex items-end justify-between border-t border-black pt-2">
              <div><p className="text-xs uppercase">{t("from")}</p><p>{d.company.legalName ?? d.company.name}</p><p className="font-mono text-xs">{d.invoice.number}</p></div>
              <p className="text-2xl font-bold">{t("carton", { i: i + 1, n })}</p>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
