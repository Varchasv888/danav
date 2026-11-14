import { getTranslations } from "next-intl/server";
import { amountInWords, dec, devanagari, findState, formatIndian } from "@varchasv/domain";
import { PrintButton } from "@/components/sales/PrintButton";

interface Line { id: string; itemName: string; itemNameHi: string | null; hsn: string | null; uom: string; qty: string; rate: string | null; gstRate: string | null; taxable: string; batchNo: string | null }
export interface ChallanData {
  invoice: {
    number: string; date: string; reason: string; status: string; customerName: string; customerGstin: string | null; placeOfSupply: string; supplyKind: string;
    transporter: string | null; vehicleNo: string | null; validUntil?: string; narration: string | null;
    billingAddress: { line1?: string; city?: string; pincode?: string; stateCode?: string };
    taxable: string; cgst: string; sgst: string; utgst: string; igst: string; cess: string; total: string; lines: Line[];
  };
  company: { name: string; legalName: string | null; pan: string | null };
  branch: { gstin: string | null; stateCode: string; address: { line1?: string; line2?: string; city?: string; pincode?: string } };
  settings: { bilingualPrint: boolean; printLanguage?: string };
}

const COPIES = ["print.copyConsignee", "print.copyTransporter", "print.copyConsignor"] as const;

/**
 * Delivery challan under Rule 55, printed in triplicate: original for the consignee, duplicate for the
 * transporter, triplicate for the consignor. It carries the reason for the movement, HSN, quantity, value
 * and, when the goods go as a supply, the tax rate and amount. A sale on approval shows the date by which
 * it must be invoiced.
 */
export async function ChallanDocument({ d }: { d: ChallanData }) {
  const en = await getTranslations({ locale: "en" });
  const second = d.settings.printLanguage ?? "hi";
  const hi = await getTranslations({ locale: second });
  const bi = d.settings.bilingualPrint;
  const L = (key: string, values?: Record<string, string>) => (bi ? `${en(key, values)} / ${hi(key, values)}` : en(key, values));
  const n = d.invoice;
  const state = (code: string) => findState(code)?.name ?? code;
  const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
  const date = (iso: string) => dateFmt.format(new Date(`${iso}T00:00:00+05:30`));
  const taxed = n.lines.some((l) => l.gstRate !== null);
  const money = (v: string) => formatIndian(v);
  const th = "border border-black/60 px-2 py-1 text-left font-semibold";
  const td = "border border-black/60 px-2 py-1 align-top";
  const num = `${td} text-right tabular-nums`;

  const copy = (label: string, last: boolean) => (
    <section key={label} className={last ? "" : "break-after-page mb-10 print:mb-0"}>
      {n.status === "cancelled" ? <p className="mb-2 border-2 border-red-700 p-1 text-center text-base font-bold text-red-700">CANCELLED</p> : null}
      <header className="flex items-start justify-between gap-6 border-b-2 border-black pb-3">
        <div>
          <h1 className="text-xl font-bold">{d.company.legalName ?? d.company.name}</h1>
          <p>{[d.branch.address.line1, d.branch.address.line2, d.branch.address.city, d.branch.address.pincode].filter(Boolean).join(", ")}</p>
          <p>{state(d.branch.stateCode)} ({d.branch.stateCode})</p>
          {d.branch.gstin ? <p className="font-semibold">GSTIN: {d.branch.gstin}</p> : null}
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">{L(n.reason === "approval" ? "print.approvalMemo" : "print.deliveryChallan")}</p>
          <p className="italic">{en(label)}</p>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-4 py-3">
        <div>
          <p className="font-semibold">{L("print.consignee")}</p>
          <p className="text-sm font-bold">{n.customerName}</p>
          <p>{[n.billingAddress.line1, n.billingAddress.city, n.billingAddress.pincode].filter(Boolean).join(", ")}</p>
          {n.customerGstin ? <p className="font-semibold">GSTIN: {n.customerGstin}</p> : null}
        </div>
        <table className="self-start">
          <tbody>
            <tr><td className="pr-3 font-semibold">{L("print.challanNo")}</td><td className="font-mono">{n.number}</td></tr>
            <tr><td className="pr-3 font-semibold">{L("print.challanDate")}</td><td>{date(n.date)}</td></tr>
            <tr><td className="pr-3 font-semibold">{L("sales.deliveries.reason")}</td><td>{en(`sales.deliveries.reasons.${n.reason}`)}</td></tr>
            {n.validUntil ? <tr><td className="pr-3 font-semibold">{L("print.invoiceBy")}</td><td>{date(n.validUntil)}</td></tr> : null}
            <tr><td className="pr-3 font-semibold">{L("sales.placeOfSupply")}</td><td>{state(n.placeOfSupply)} ({n.placeOfSupply})</td></tr>
            {n.transporter ? <tr><td className="pr-3 font-semibold">{L("sales.deliveries.transporter")}</td><td>{n.transporter}</td></tr> : null}
            {n.vehicleNo ? <tr><td className="pr-3 font-semibold">{L("sales.deliveries.vehicleNo")}</td><td className="font-mono">{n.vehicleNo}</td></tr> : null}
          </tbody>
        </table>
      </section>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className={th}>{en("print.sno")}</th>
            <th className={th}>{L("purchase.item")}</th>
            <th className={th}>{en("print.hsn")}</th>
            <th className={`${th} text-right`}>{L("purchase.qty")}</th>
            <th className={`${th} text-right`}>{L("purchase.rate")}</th>
            <th className={`${th} text-right`}>{en("print.value")}</th>
            {taxed ? <th className={`${th} text-right`}>GST</th> : null}
          </tr>
        </thead>
        <tbody>
          {n.lines.map((l, i) => (
            <tr key={l.id}>
              <td className={td}>{i + 1}</td>
              <td className={td}>
                {l.itemName}{bi && l.itemNameHi && devanagari(second) ? <span className="block">{l.itemNameHi}</span> : null}
                {l.batchNo ? <span className="block font-mono text-[9px]">#{l.batchNo}</span> : null}
              </td>
              <td className={`${td} font-mono`}>{l.hsn}</td>
              <td className={num}>{Number(l.qty).toLocaleString("en-IN", { maximumFractionDigits: 3 })} {l.uom}</td>
              <td className={num}>{l.rate ? money(l.rate) : ""}</td>
              <td className={num}>{money(l.taxable)}</td>
              {taxed ? <td className={num}>{l.gstRate !== null ? `${Number(l.gstRate)}%` : ""}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>

      <section className="mt-3 grid grid-cols-[1fr_auto] gap-6">
        <div>
          <p className="font-semibold">{L("print.amountInWords")}</p>
          <p>{amountInWords(n.total, "en")}</p>
          {taxed ? null : <p className="mt-2">{en("print.notASupply")}</p>}
          {n.narration ? <p className="mt-2">{n.narration}</p> : null}
        </div>
        <table className="self-start border-collapse">
          <tbody>
            <tr><td className={td}>{en("print.value")}</td><td className={num}>{money(n.taxable)}</td></tr>
            {dec(n.cgst).gt(0) ? <tr><td className={td}>CGST</td><td className={num}>{money(n.cgst)}</td></tr> : null}
            {dec(n.sgst).gt(0) ? <tr><td className={td}>SGST</td><td className={num}>{money(n.sgst)}</td></tr> : null}
            {dec(n.utgst).gt(0) ? <tr><td className={td}>UTGST</td><td className={num}>{money(n.utgst)}</td></tr> : null}
            {dec(n.igst).gt(0) ? <tr><td className={td}>IGST</td><td className={num}>{money(n.igst)}</td></tr> : null}
            {dec(n.cess).gt(0) ? <tr><td className={td}>Cess</td><td className={num}>{money(n.cess)}</td></tr> : null}
            <tr className="text-sm font-bold"><td className={td}>{L("purchase.total")}</td><td className={num}>₹ {money(n.total)}</td></tr>
          </tbody>
        </table>
      </section>

      <footer className="mt-6 grid grid-cols-2 gap-6 border-t border-black/60 pt-3">
        <div><p className="font-semibold">{L("print.receivedBy")}</p><p className="mt-12">{L("print.signatureAndDate")}</p></div>
        <div className="text-right">
          <p className="font-semibold">{en("print.forCompany", { company: d.company.legalName ?? d.company.name })}</p>
          <p className="mt-12">{L("print.signatory")}</p>
        </div>
      </footer>
    </section>
  );

  return (
    <main className="mx-auto max-w-[210mm] p-[10mm] text-[11px] leading-snug print:p-0">
      <style>{`@page { size: A4; margin: 10mm } @media print { .no-print { display: none } }`}</style>
      <div className="no-print mb-4 flex justify-end"><PrintButton /></div>
      {COPIES.map((c, i) => copy(c, i === COPIES.length - 1))}
    </main>
  );
}
