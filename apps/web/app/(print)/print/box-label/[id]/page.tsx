import { getTranslations } from "next-intl/server";
import { PrintButton } from "@/components/sales/PrintButton";
import { serverApi } from "@/lib/server-api";
import { PrintSetup } from "@/components/print/PrintSetup";

interface Data {
  invoice: { number: string; date: string; customerName: string; cartons?: number | null; lines: { id: string; itemName: string; qty: string; kind: string }[] };
  company: { name: string; legalName: string | null };
}
interface PackingBoxData {
  id: string; companyId: string; code: string; status: "open" | "packed";
  company: { id: string; name: string; legalName: string | null };
  lines: { itemId: string; itemName: string; sku: string | null; color: string | null; size: string | null; fit: string | null; qty: string }[];
}

export async function generateMetadata() {
  return { title: { absolute: "Box label" } };
}

/** Prints either a packing-box record or the legacy sales-consignment carton label. */
export default async function BoxLabelPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ box?: string; record?: string; companyId?: string }> }) {
  const { id } = await params;
  const q = await searchParams;
  if (q.record === "packing-box") {
    const companyId = /^[0-9a-f-]{36}$/i.test(q.companyId ?? "") ? q.companyId : undefined;
    const box = await serverApi<PackingBoxData>(`/packing-boxes/${id}${companyId ? `?companyId=${companyId}` : ""}`);
    const company = box.company;
    return (
      <main className="mx-auto max-w-[148mm] bg-white p-6 text-[13px] text-black print:max-w-none print:p-0"><PrintSetup size="A5" margin="8mm" />
        <div className="mb-4 flex justify-end print:hidden"><PrintButton /></div>
        <section className="break-inside-avoid border-2 border-black p-5">
          <header className="flex items-start justify-between gap-4 border-b border-black pb-3">
            <div><p className="text-xs uppercase tracking-wide">{company?.legalName ?? company?.name ?? "Business"}</p><h1 className="mt-1 text-lg font-bold">Packing Box</h1></div>
            <div className="text-right"><p className="font-mono text-xl font-bold">{box.code}</p><p className="mt-1 text-xs font-semibold uppercase">{box.status}</p></div>
          </header>
          <h2 className="mt-4 text-sm font-semibold">Contents</h2>
          {box.lines.length ? <table className="mt-2 w-full border-collapse">
            <thead><tr className="border-b border-black text-left"><th className="py-1.5">Variant item</th><th className="py-1.5 text-right">Quantity</th></tr></thead>
            <tbody>{box.lines.map((line) => <tr key={line.itemId} className="border-b border-gray-300"><td className="py-1.5">{line.itemName}{line.color || line.size || line.fit ? <span className="block text-xs">{[line.color, line.size, line.fit].filter(Boolean).join(" / ")}</span> : null}{line.sku ? <span className="block font-mono text-[10px]">{line.sku}</span> : null}</td><td className="py-1.5 text-right tabular-nums">{line.qty.replace(/(\.\d*?[1-9])0+$|\.0+$/, "$1")}</td></tr>)}</tbody>
          </table> : <p className="mt-2 text-sm">No contents recorded.</p>}
          <footer className="mt-8 border-t border-black pt-2 text-xs">Keep this label with box {box.code}.</footer>
        </section>
      </main>
    );
  }

  const d = await serverApi<Data>(`/sales-invoices/${id}/print`);
  const t = await getTranslations("boxLabel");
  const goods = d.invoice.lines.filter((l) => l.kind === "goods");
  const pieces = goods.reduce((s, l) => s + Number(l.qty), 0);
  const n = Math.max(1, d.invoice.cartons ?? 1);
  const only = Number(q.box);
  const boxes = only >= 1 && only <= n ? [only] : Array.from({ length: n }, (_, i) => i + 1);
  return (
    <main className="mx-auto max-w-[210mm] bg-white p-6 text-black print:max-w-none print:p-0"><PrintSetup size="A4" />
      <div className="mb-4 print:hidden"><PrintButton /><p className="mt-2 text-sm text-gray-600">{t("help", { n })}</p></div>
      {boxes.map((b) => (
        <section key={b} className="mb-4 break-inside-avoid border-2 border-black p-4 text-[13px]" style={{ breakAfter: "page" }}>
          <div className="flex items-start justify-between border-b border-black pb-2">
            <div><p className="text-lg font-bold">{d.invoice.customerName}</p><p className="font-mono text-xs">{d.invoice.number}</p></div>
            <p className="text-4xl font-bold">{t("box", { i: b, n })}</p>
          </div>
          <table className="mt-2 w-full"><tbody>{goods.map((l) => <tr key={l.id} className="border-b border-gray-300"><td className="py-1">{l.itemName}</td><td className="py-1 text-right tabular-nums">{Number(l.qty)}</td></tr>)}</tbody>
            <tfoot><tr className="font-semibold"><td className="pt-2">{t("pieces")}</td><td className="pt-2 text-right tabular-nums">{pieces}</td></tr></tfoot></table>
          <p className="mt-3 text-xs">{t("from")}: {d.company.legalName ?? d.company.name} · {t("packedBy")}: ____________</p>
        </section>
      ))}
    </main>
  );
}
