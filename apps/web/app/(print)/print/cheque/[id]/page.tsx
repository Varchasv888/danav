import { getTranslations } from "next-intl/server";
import { amountInWords } from "@varchasv/domain";
import { PrintButton } from "@/components/sales/PrintButton";
import { serverApi } from "@/lib/server-api";
import { PrintSetup } from "@/components/print/PrintSetup";

interface Voucher { type: string; number: string; date: string; total: string; narration: string | null; lines: { id: string; accountName: string; debit: string; credit: string }[] }
type Q = { crossed?: string; dx?: string; dy?: string; bearer?: string };

export async function generateMetadata() {
  return { title: { absolute: "Cheque" } };
}

const mm = (v: string | undefined) => { const n = Number(v); return Number.isFinite(n) ? Math.max(-50, Math.min(50, n)) : 0; };

/**
 * A cheque leaf filled from a payment voucher: date, payee, amount in words and figures, the way a printed cheque takes them. The leaf is 203 by 89 mm;
 * dx and dy (millimetres) shift everything so it lines up with the bank's leaf, and crossed=1 adds the A/C Payee crossing.
 */
export default async function ChequePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Q> }) {
  const { id } = await params;
  const q = await searchParams;
  const v = await serverApi<Voucher>(`/vouchers/${id}`);
  const t = await getTranslations("chequePrint");
  const payee = v.lines.filter((l) => Number(l.debit) > 0).map((l) => l.accountName).join(", ");
  const bank = v.lines.find((l) => Number(l.credit) > 0)?.accountName ?? "";
  const [y, m, d] = v.date.split("-");
  const dx = mm(q.dx), dy = mm(q.dy);
  const figures = Number(v.total).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (
    <main className="mx-auto bg-white p-6 text-black print:p-0"><PrintSetup size="203mm 89mm" margin="0" />
      <div className="mb-4 print:hidden">
        <PrintButton />
        <p className="mt-2 text-sm text-gray-600">{t("help", { bank })}</p>
        <p className="text-sm text-gray-600">{t("adjust")}</p>
      </div>
      <div className="relative border border-dashed border-gray-300 print:border-0" style={{ width: "203mm", height: "89mm" }}>
        <div className="absolute" style={{ left: `${dx}mm`, top: `${dy}mm`, width: "203mm", height: "89mm", fontFamily: "ui-monospace, monospace" }}>
          <div className="absolute text-[15px] tracking-[0.6em]" style={{ left: "150mm", top: "8mm" }}>{d}{m}{y}</div>
          {q.crossed === "1" ? <div className="absolute -rotate-12 border-y-2 border-black px-1 text-[11px] font-bold" style={{ left: "20mm", top: "10mm" }}>A/C PAYEE</div> : null}
          <div className="absolute text-[15px]" style={{ left: "28mm", top: "24mm", width: "140mm" }}>{payee}{q.bearer === "1" ? "" : ""}</div>
          <div className="absolute text-[13px] leading-6" style={{ left: "28mm", top: "34mm", width: "125mm" }}>{amountInWords(v.total)}</div>
          <div className="absolute text-[17px] font-semibold" style={{ left: "158mm", top: "40mm" }}>{figures}</div>
        </div>
      </div>
    </main>
  );
}
