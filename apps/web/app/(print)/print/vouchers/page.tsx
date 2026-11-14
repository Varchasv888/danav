import { getFormatter, getTranslations } from "next-intl/server";
import { PrintButton } from "@/components/sales/PrintButton";
import { rupees } from "@/lib/format";
import { serverApi } from "@/lib/server-api";
import { PrintSetup } from "@/components/print/PrintSetup";

interface Row { id: string }
interface Voucher { id: string; type: string; number: string; date: string; narration: string | null; reference: string | null; total: string; status: string; lines: { id: string; accountName: string; debit: string | null; credit: string | null }[] }
type Props = { searchParams: Promise<{ from?: string; to?: string; type?: string }> };
const MAX = 100;

export async function generateMetadata() {
  return { title: (await getTranslations("printVouchers"))("title") };
}

/** Many vouchers, one per page, ready to save as a single PDF from the browser's print dialog. */
export default async function PrintVouchersPage({ searchParams }: Props) {
  const sp = await searchParams;
  const day = /^\d{4}-\d{2}-\d{2}$/;
  const qs = new URLSearchParams({ limit: String(MAX), ...(sp.from && day.test(sp.from) ? { from: sp.from } : {}), ...(sp.to && day.test(sp.to) ? { to: sp.to } : {}), ...(sp.type && /^[a-z_]+$/.test(sp.type) ? { type: sp.type } : {}) });
  const t = await getTranslations("printVouchers");
  const format = await getFormatter();
  const rows = await serverApi<Row[]>(`/vouchers?${qs}`);
  const vouchers = await Promise.all(rows.map((r) => serverApi<Voucher>(`/vouchers/${r.id}`)));
  return (
    <main className="mx-auto max-w-[210mm] bg-white p-6 text-[13px] text-black print:max-w-none print:p-0"><PrintSetup size="A4" />
      <div className="mb-4 flex items-center justify-between print:hidden"><PrintButton /><span className="text-xs text-gray-600">{t("count", { n: vouchers.length })}{rows.length >= MAX ? ` ${t("capped", { n: MAX })}` : ""}</span></div>
      {vouchers.map((v) => (
        <section key={v.id} className="mb-8 break-after-page border border-black p-5 print:mb-0 print:border-0">
          <header className="flex justify-between border-b border-black pb-2">
            <div><h1 className="text-lg font-bold uppercase">{v.type}</h1><p className="font-mono">{v.number}</p></div>
            <div className="text-right"><p>{format.dateTime(new Date(`${v.date}T00:00:00`), { dateStyle: "long" })}</p>{v.status === "cancelled" ? <p className="font-bold">{t("cancelled")}</p> : null}</div>
          </header>
          <table className="my-3 w-full border-collapse">
            <thead><tr className="border-b border-black text-left"><th className="py-1">{t("account")}</th><th className="py-1 text-right">{t("debit")}</th><th className="py-1 text-right">{t("credit")}</th></tr></thead>
            <tbody>{v.lines.map((l) => <tr key={l.id} className="border-b border-gray-300"><td className="py-1">{l.accountName}</td><td className="py-1 text-right tabular-nums">{Number(l.debit) ? rupees(l.debit!) : ""}</td><td className="py-1 text-right tabular-nums">{Number(l.credit) ? rupees(l.credit!) : ""}</td></tr>)}</tbody>
            <tfoot><tr className="border-t border-black font-semibold"><td className="py-1">{t("total")}</td><td className="py-1 text-right tabular-nums">{rupees(v.total)}</td><td className="py-1 text-right tabular-nums">{rupees(v.total)}</td></tr></tfoot>
          </table>
          {v.narration ? <p><span className="font-semibold">{t("narration")}:</span> {v.narration}</p> : null}
          {v.reference ? <p><span className="font-semibold">{t("reference")}:</span> {v.reference}</p> : null}
          <footer className="mt-10 flex justify-between text-xs"><span>{t("preparedBy")}: ____________</span><span>{t("approvedBy")}: ____________</span></footer>
        </section>
      ))}
      {!vouchers.length ? <p className="py-10 text-center text-gray-600">{t("none")}</p> : null}
    </main>
  );
}
