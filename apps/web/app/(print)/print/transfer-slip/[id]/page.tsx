import { getFormatter, getTranslations } from "next-intl/server";
import { PrintButton } from "@/components/sales/PrintButton";
import { serverApi } from "@/lib/server-api";
import { PrintSetup } from "@/components/print/PrintSetup";

interface Transfer { number: string; date: string; from: string; to: string; transporter: string | null; vehicleNo: string | null; narration: string | null; lines: { id: string; name: string; qty: string }[] }

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const d = await serverApi<Transfer>(`/stock-transfers/${(await params).id}`);
  return { title: { absolute: `Transfer slip ${d.number.replaceAll("/", "-")}` } };
}

/** What is in the consignment between two stores: items and pieces for the person packing and the person receiving, no prices. */
export default async function TransferSlipPage({ params }: { params: Promise<{ id: string }> }) {
  const d = await serverApi<Transfer>(`/stock-transfers/${(await params).id}`);
  const t = await getTranslations("transferSlip");
  const format = await getFormatter();
  const pieces = d.lines.reduce((s, l) => s + Number(l.qty), 0);
  return (
    <main className="mx-auto max-w-[210mm] bg-white p-8 text-[13px] text-black print:max-w-none print:p-0"><PrintSetup size="A4" />
      <div className="mb-4 print:hidden"><PrintButton /></div>
      <header className="flex items-start justify-between border-b border-black pb-3">
        <div><h1 className="text-xl font-bold">{t("title")}</h1><p>{d.from} → {d.to}</p></div>
        <div className="text-right"><p className="font-mono font-semibold">{d.number}</p><p>{format.dateTime(new Date(`${d.date}T00:00:00`), { dateStyle: "medium" })}</p></div>
      </header>
      <section className="my-3 flex gap-8"><p>{t("transporter")}: {d.transporter ?? "-"}</p><p>{t("vehicle")}: {d.vehicleNo ?? "-"}</p></section>
      <table className="w-full border-collapse">
        <thead><tr className="border-y border-black text-left"><th className="w-10 py-1.5">#</th><th className="py-1.5">{t("item")}</th><th className="py-1.5 text-right">{t("sent")}</th><th className="w-28 py-1.5 text-right">{t("received")}</th></tr></thead>
        <tbody>{d.lines.map((l, i) => <tr key={l.id} className="border-b border-gray-300"><td className="py-1.5">{i + 1}</td><td className="py-1.5">{l.name}</td><td className="py-1.5 text-right tabular-nums">{Number(l.qty)}</td><td className="py-1.5"><span className="block h-5 border-b border-black" /></td></tr>)}</tbody>
        <tfoot><tr className="border-t border-black font-semibold"><td colSpan={2} className="py-1.5">{t("total")}</td><td className="py-1.5 text-right tabular-nums">{pieces}</td><td /></tr></tfoot>
      </table>
      <footer className="mt-10 flex justify-between text-xs"><span>{t("packedBy")}: ______________</span><span>{t("receivedBy")}: ______________</span></footer>
    </main>
  );
}
