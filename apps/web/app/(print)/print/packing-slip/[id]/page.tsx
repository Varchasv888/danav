import { getFormatter, getTranslations } from "next-intl/server";
import { PrintButton } from "@/components/sales/PrintButton";
import { serverApi } from "@/lib/server-api";
import { PrintSetup } from "@/components/print/PrintSetup";

interface Line { id: string; itemName: string; hsn: string | null; uom: string; qty: string; kind: string }
interface Data {
  invoice: { number: string; date: string; customerName: string; cartons?: number | null; billingAddress: { line1?: string; city?: string; pincode?: string }; shippingAddress?: { line1?: string; city?: string; pincode?: string } | null; lines: Line[] };
  company: { name: string; legalName: string | null };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const d = await serverApi<Data>(`/sales-invoices/${(await params).id}/print`);
  return { title: { absolute: `Packing slip ${d.invoice.number.replaceAll("/", "-")} ${d.invoice.customerName}` } };
}

/** What is in the box: items and quantities for the warehouse and the transporter, with no prices. */
export default async function PackingSlipPage({ params }: { params: Promise<{ id: string }> }) {
  const d = await serverApi<Data>(`/sales-invoices/${(await params).id}/print`);
  const t = await getTranslations("packingSlip");
  const format = await getFormatter();
  const goods = d.invoice.lines.filter((l) => l.kind === "goods");
  const pieces = goods.reduce((s, l) => s + Number(l.qty), 0);
  const to = d.invoice.shippingAddress?.line1 ? d.invoice.shippingAddress : d.invoice.billingAddress;
  return (
    <main className="mx-auto max-w-[210mm] bg-white p-8 text-[13px] text-black print:max-w-none print:p-0"><PrintSetup size="A4" />
      <div className="mb-4 flex items-start justify-between print:hidden"><PrintButton /></div>
      <header className="flex items-start justify-between border-b border-black pb-3">
        <div><h1 className="text-xl font-bold">{t("title")}</h1><p className="text-sm">{d.company.legalName ?? d.company.name}</p></div>
        <div className="text-right"><p className="font-mono font-semibold">{d.invoice.number}</p><p>{format.dateTime(new Date(`${d.invoice.date}T00:00:00`), { dateStyle: "medium" })}</p></div>
      </header>
      <section className="my-3 flex justify-between gap-6">
        <div><p className="font-semibold">{t("shipTo")}</p><p>{d.invoice.customerName}</p><p>{[to?.line1, to?.city, to?.pincode].filter(Boolean).join(", ")}</p></div>
        <div className="text-right"><p className="font-semibold">{t("cartons")}</p><p className="text-2xl font-bold">{d.invoice.cartons ?? "-"}</p></div>
      </section>
      <table className="w-full border-collapse">
        <thead><tr className="border-y border-black text-left"><th className="w-10 py-1.5">#</th><th className="py-1.5">{t("item")}</th><th className="py-1.5">{t("hsn")}</th><th className="py-1.5 text-right">{t("qty")}</th><th className="w-20 py-1.5 text-center">{t("checked")}</th></tr></thead>
        <tbody>
          {goods.map((l, i) => (
            <tr key={l.id} className="border-b border-gray-300"><td className="py-1.5">{i + 1}</td><td className="py-1.5">{l.itemName}</td><td className="py-1.5">{l.hsn ?? ""}</td><td className="py-1.5 text-right tabular-nums">{Number(l.qty)} {l.uom}</td><td className="py-1.5 text-center">[ ]</td></tr>
          ))}
        </tbody>
        <tfoot><tr className="border-t border-black font-semibold"><td colSpan={3} className="py-1.5">{t("total")}</td><td className="py-1.5 text-right tabular-nums">{pieces}</td><td /></tr></tfoot>
      </table>
      <footer className="mt-10 flex justify-between text-xs"><span>{t("packedBy")}: ______________</span><span>{t("checkedBy")}: ______________</span></footer>
    </main>
  );
}
