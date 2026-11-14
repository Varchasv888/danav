import { getTranslations } from "next-intl/server";
import { PrintButton } from "@/components/sales/PrintButton";
import { serverApi } from "@/lib/server-api";
import { PrintSetup } from "@/components/print/PrintSetup";

interface Line { itemId: string; name: string; barcode: string | null; sku: string | null; design: string | null; color: string | null; size: string | null; counted: string; expected?: string }
interface Count { number: string; name: string; store: string; blind: boolean; showBooks: boolean; verifyOnly?: boolean; lines: Line[] }

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const c = await serverApi<Count>(`/stock-counts/${(await params).id}`);
  return { title: { absolute: `Count sheet ${c.number.replaceAll("/", "-")}` } };
}

/** A sheet to count against with a pen: every item in scope by design, a blank for the count, and the books' quantity only when the count is not blind. */
export default async function CountSheetPage({ params }: { params: Promise<{ id: string }> }) {
  const c = await serverApi<Count>(`/stock-counts/${(await params).id}`);
  const t = await getTranslations("countSheet");
  const groups = new Map<string, Line[]>();
  for (const l of c.lines) groups.set(l.design ?? t("noDesign"), [...(groups.get(l.design ?? t("noDesign")) ?? []), l]);
  return (
    <main className="mx-auto max-w-[210mm] bg-white p-8 text-[12px] text-black print:max-w-none print:p-0"><PrintSetup size="A4" />
      <div className="mb-4 print:hidden"><PrintButton /></div>
      <header className="flex items-start justify-between border-b border-black pb-2">
        <div><h1 className="text-lg font-bold">{t("title")}</h1><p>{c.store} · {c.name}</p>{c.verifyOnly ? <p>{t("spotCheck")}</p> : null}</div>
        <p className="font-mono font-semibold">{c.number}</p>
      </header>
      {[...groups].map(([design, lines]) => (
        <section key={design} className="mt-3 break-inside-avoid">
          <h2 className="font-semibold">{design}</h2>
          <table className="w-full border-collapse">
            <thead><tr className="border-y border-black text-left"><th className="py-1">{t("item")}</th><th className="py-1">{t("barcode")}</th><th className="py-1">{t("colour")}</th><th className="py-1">{t("size")}</th>{c.showBooks ? <th className="py-1 text-right">{t("books")}</th> : null}<th className="w-24 py-1 text-right">{t("counted")}</th></tr></thead>
            <tbody>{lines.map((l) => (
              <tr key={l.itemId} className="border-b border-gray-300"><td className="py-1.5">{l.name}</td><td className="py-1.5 font-mono">{l.barcode ?? l.sku ?? ""}</td><td className="py-1.5">{l.color ?? ""}</td><td className="py-1.5">{l.size ?? ""}</td>{c.showBooks ? <td className="py-1.5 text-right tabular-nums">{Number(l.expected ?? 0)}</td> : null}<td className="py-1.5"><span className="block h-5 border-b border-black" /></td></tr>
            ))}</tbody>
          </table>
        </section>
      ))}
      <footer className="mt-8 flex justify-between text-xs"><span>{t("countedBy")}: ______________</span><span>{t("checkedBy")}: ______________</span></footer>
    </main>
  );
}
