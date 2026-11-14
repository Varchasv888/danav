import { getTranslations } from "next-intl/server";
import QRCode from "qrcode";
import { dec, findState, formatIndian } from "@varchasv/domain";
import { PrintButton } from "@/components/sales/PrintButton";
import type { PrintData } from "@/components/print/TaxDocument";
import { serverApi } from "@/lib/server-api";

type Ewb = PrintData["invoice"] & { ewbDate?: string | null; ewbValidUpto?: string | null; vehicleNo?: string | null; transportDistanceKm?: number | null };

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const d = await serverApi<{ invoice: Ewb }>(`/sales-invoices/${(await params).id}/print`);
  return { title: { absolute: `EWB ${d.invoice.ewbNo ?? ""} ${d.invoice.number.replaceAll("/", "-")}` } };
}

/**
 * The e-way bill as a page to print and keep with the goods: number, dates, who it is from and to, the goods, the vehicle and a QR code a checking
 * officer can scan. It is the details held for the bill; the portal's own copy stays the legal one.
 */
export default async function PrintEwayBillPage({ params }: { params: Promise<{ id: string }> }) {
  const t = await getTranslations("ewbPrint");
  const d = await serverApi<Omit<PrintData, "invoice"> & { invoice: Ewb }>(`/sales-invoices/${(await params).id}/print`);
  const inv = d.invoice;
  if (!inv.ewbNo) return <p className="p-8 text-sm">{t("none")}</p>;
  const stamp = (iso?: string | null) => (iso ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(iso)) : "-");
  const day = (iso: string) => new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date(`${iso}T00:00:00+05:30`));
  const state = (code: string) => `${findState(code)?.name ?? code} (${code})`;
  const money = (v: string | ReturnType<typeof dec>) => formatIndian(v);
  const goods = inv.lines.filter((l) => l.hsn);
  // What the portal's own QR carries: the bill number, the generator's GSTIN and the date it was made.
  const when = inv.ewbDate ? new Date(inv.ewbDate) : null;
  const ddmmyyyy = when ? new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata" }).format(when) : "";
  const qr = await QRCode.toString(`${inv.ewbNo}/${d.branch.gstin ?? ""}/${ddmmyyyy}`, { type: "svg", margin: 0, errorCorrectionLevel: "M" });
  const th = "border border-black/60 px-2 py-1 text-left font-semibold";
  const td = "border border-black/60 px-2 py-1 align-top";
  const num = `${td} text-right tabular-nums`;
  const sum = (k: "taxable" | "cgst" | "sgst" | "utgst" | "igst" | "cess") => inv.lines.reduce((s, l) => s.plus(l[k]), dec(0));
  const addr = (a?: { line1?: string; city?: string; pincode?: string } | null) => [a?.line1, a?.city, a?.pincode].filter(Boolean).join(", ");
  const to = inv.shippingAddress?.line1 ? inv.shippingAddress : inv.billingAddress;

  return (
    <main className="mx-auto max-w-[210mm] p-[10mm] text-[11px] leading-snug print:p-0">
      <style>{`@page { size: A4; margin: 10mm } @media print { .no-print { display: none } }`}</style>
      <div className="no-print mb-4 flex justify-end"><PrintButton /></div>
      {inv.ewbStatus === "cancelled" ? <p className="mb-2 border-2 border-red-700 p-1 text-center text-base font-bold text-red-700">{t("cancelled")}</p> : null}

      <header className="flex items-start justify-between gap-6 border-b-2 border-black pb-3">
        <div>
          <h1 className="text-xl font-bold">{t("title")}</h1>
          <p className="mt-1 text-2xl font-bold tabular-nums">{inv.ewbNo}</p>
          <table className="mt-2">
            <tbody>
              <tr><td className="pr-3 font-semibold">{t("generated")}</td><td>{stamp(inv.ewbDate)}</td></tr>
              <tr><td className="pr-3 font-semibold">{t("generatedBy")}</td><td className="font-mono">{d.branch.gstin}</td></tr>
              <tr><td className="pr-3 font-semibold">{t("validUntil")}</td><td>{stamp(inv.ewbValidUpto)}</td></tr>
              <tr><td className="pr-3 font-semibold">{t("mode")}</td><td>{t("road")}</td></tr>
              {inv.transportDistanceKm ? <tr><td className="pr-3 font-semibold">{t("distance")}</td><td>{inv.transportDistanceKm} km</td></tr> : null}
            </tbody>
          </table>
        </div>
        <div className="size-28 shrink-0" dangerouslySetInnerHTML={{ __html: qr }} />
      </header>

      <section className="grid grid-cols-2 gap-4 border-b border-black/60 py-3">
        <div>
          <p className="font-semibold">{t("from")}</p>
          <p className="text-sm font-bold">{d.company.legalName ?? d.company.name}</p>
          <p className="font-mono">{d.branch.gstin}</p>
          <p>{addr(d.branch.address)}</p>
          <p>{state(d.branch.stateCode)}</p>
        </div>
        <div>
          <p className="font-semibold">{t("to")}</p>
          <p className="text-sm font-bold">{inv.customerName}</p>
          <p className="font-mono">{inv.customerGstin ?? t("unregistered")}</p>
          <p>{addr(to)}</p>
          <p>{state(inv.placeOfSupply)}</p>
        </div>
      </section>

      <section className="border-b border-black/60 py-3">
        <table>
          <tbody>
            <tr><td className="pr-3 font-semibold">{t("document")}</td><td>{t("invoice")} {inv.number}, {day(inv.date)}</td></tr>
            <tr><td className="pr-3 font-semibold">{t("supply")}</td><td>{t("outward")}, {inv.supplyKind === "inter" ? t("inter") : t("intra")}</td></tr>
          </tbody>
        </table>
      </section>

      <table className="mt-3 w-full border-collapse">
        <thead>
          <tr><th className={th}>{t("hsn")}</th><th className={th}>{t("product")}</th><th className={`${th} text-right`}>{t("qty")}</th><th className={`${th} text-right`}>{t("taxable")}</th><th className={`${th} text-right`}>{t("rate")}</th></tr>
        </thead>
        <tbody>
          {goods.map((l) => (
            <tr key={l.id}>
              <td className={`${td} font-mono`}>{l.hsn}</td><td className={td}>{l.itemName}</td>
              <td className={num}>{Number(l.qty).toLocaleString("en-IN", { maximumFractionDigits: 3 })} {l.uom}</td>
              <td className={num}>{money(l.taxable)}</td><td className={num}>{Number(l.gstRate)}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <section className="mt-3 grid grid-cols-2 gap-4">
        <table className="self-start">
          <tbody>
            <tr><td className="pr-3 font-semibold">{t("taxableTotal")}</td><td className="text-right tabular-nums">{money(sum("taxable"))}</td></tr>
            {dec(inv.igst).gt(0) ? <tr><td className="pr-3 font-semibold">IGST</td><td className="text-right tabular-nums">{money(inv.igst)}</td></tr> : <>
              <tr><td className="pr-3 font-semibold">CGST</td><td className="text-right tabular-nums">{money(inv.cgst)}</td></tr>
              <tr><td className="pr-3 font-semibold">{dec(inv.utgst).gt(0) ? "UTGST" : "SGST"}</td><td className="text-right tabular-nums">{money(dec(inv.sgst).plus(inv.utgst))}</td></tr></>}
            {dec(inv.cess).gt(0) ? <tr><td className="pr-3 font-semibold">Cess</td><td className="text-right tabular-nums">{money(inv.cess)}</td></tr> : null}
            <tr><td className="pr-3 font-bold">{t("invoiceValue")}</td><td className="text-right font-bold tabular-nums">{money(inv.total)}</td></tr>
          </tbody>
        </table>
        <div>
          <p className="font-semibold">{t("partB")}</p>
          <table>
            <tbody>
              <tr><td className="pr-3 font-semibold">{t("vehicle")}</td><td className="font-mono text-base font-bold">{inv.vehicleNo ?? "-"}</td></tr>
              <tr><td className="pr-3 font-semibold">{t("entered")}</td><td>{stamp(inv.ewbDate)}</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-6 text-[10px] text-black/60">{t("note")}</p>
    </main>
  );
}
