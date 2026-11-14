import { getTranslations } from "next-intl/server";
import { PrintButton } from "@/components/sales/PrintButton";
import { rupees } from "@/lib/format";
import { serverApi } from "@/lib/server-api";
import { PrintSetup } from "@/components/print/PrintSetup";

interface Cert {
  fy: string; assessmentYear: string; quarter: number; number: string; undeposited: number;
  deductor: { name: string; pan: string | null; tan: string | null; address: { line1?: string; city?: string; pincode?: string } | null };
  deductee: { name: string; pan: string | null; address: { line1?: string; city?: string; pincode?: string } | null };
  rows: { date: string; section: string; amountPaid: string; tds: string; rate: string; bsrCode: string | null; challanSerial: string | null; depositedOn: string | null }[];
  totals: { paid: string; tds: string };
}

export async function generateMetadata() {
  return { title: { absolute: "Certificate of tax deducted" } };
}

/** Certificate of tax deducted at source on a payment other than salary (the Form 16A working copy), for one payee and quarter. */
export default async function TdsCertificatePage({ searchParams }: { searchParams: Promise<{ deducteeId?: string; fy?: string; quarter?: string }> }) {
  const sp = await searchParams;
  const t = await getTranslations("tdsCertificate");
  const c = await serverApi<Cert>(`/tds/certificate?deducteeId=${sp.deducteeId}&fy=${sp.fy}&quarter=${sp.quarter}`);
  const addr = (a: Cert["deductor"]["address"]) => [a?.line1, a?.city, a?.pincode].filter(Boolean).join(", ");
  return (
    <main className="mx-auto max-w-[210mm] bg-white p-8 text-[13px] text-black print:max-w-none print:p-0"><PrintSetup size="A4" />
      <div className="mb-4 print:hidden"><PrintButton /></div>
      <header className="border-b border-black pb-3 text-center">
        <h1 className="text-lg font-bold">{t("title")}</h1>
        <p className="text-xs">{t("sub")}</p>
        <p className="mt-1 font-mono text-xs">{c.number}</p>
      </header>
      <section className="my-3 grid grid-cols-2 gap-6">
        <div><p className="font-semibold">{t("deductor")}</p><p>{c.deductor.name}</p><p>{addr(c.deductor.address)}</p><p>PAN {c.deductor.pan ?? "-"} · TAN {c.deductor.tan ?? "-"}</p></div>
        <div><p className="font-semibold">{t("deductee")}</p><p>{c.deductee.name}</p><p>{addr(c.deductee.address)}</p><p>PAN {c.deductee.pan ?? "-"}</p></div>
      </section>
      <p className="mb-2">{t("period", { fy: c.fy, ay: c.assessmentYear, q: c.quarter })}</p>
      <table className="w-full border-collapse">
        <thead><tr className="border-y border-black text-left"><th className="py-1.5">{t("date")}</th><th>{t("section")}</th><th className="text-right">{t("paid")}</th><th className="text-right">{t("rate")}</th><th className="text-right">{t("tds")}</th><th>{t("challan")}</th></tr></thead>
        <tbody>
          {c.rows.map((r, i) => (
            <tr key={i} className="border-b border-gray-300">
              <td className="py-1.5">{r.date}</td><td>{r.section}</td><td className="text-right">{rupees(r.amountPaid)}</td><td className="text-right">{Number(r.rate)}%</td><td className="text-right">{rupees(r.tds)}</td>
              <td className="text-xs">{r.bsrCode ? `${r.bsrCode} / ${r.challanSerial} · ${r.depositedOn}` : t("notDeposited")}</td>
            </tr>
          ))}
          <tr className="border-t border-black font-semibold"><td className="py-1.5" colSpan={2}>{t("total")}</td><td className="text-right">{rupees(c.totals.paid)}</td><td /><td className="text-right">{rupees(c.totals.tds)}</td><td /></tr>
        </tbody>
      </table>
      {c.undeposited ? <p className="mt-3 text-xs">{t("undeposited", { n: c.undeposited })}</p> : null}
      <p className="mt-6 text-xs">{t("note")}</p>
      <div className="mt-12 flex justify-end"><div className="w-56 border-t border-black pt-1 text-center text-xs">{t("signature")}</div></div>
    </main>
  );
}
