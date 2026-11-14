import { getTranslations } from "next-intl/server";
import QRCode from "qrcode";
import type { ReactNode } from "react";
import { ACCENT_COLOURS, amountInWords, amountInWordsIntl, dec, devanagari, findState, formatIndian, LANDSCAPE_THEMES, resolvePreferences, wordsLang } from "@varchasv/domain";
import { PrintButton } from "@/components/sales/PrintButton";

interface Line {
  id: string; itemName: string; itemNameHi: string | null; hsn: string | null; uom: string; qty: string; rate: string; discount: string; headerDiscount?: string; gstRate: string;
  taxable: string; cgst: string; sgst: string; utgst: string; igst: string; cess: string; total: string; mrp?: string | null; size?: string | null; colour?: string | null; batchNo?: string | null; expiry?: string | null; model?: string | null;
}
export interface PrintData {
  invoice: {
    number: string; date: string; dueOn?: string | null; validUntil?: string; customerName: string; customerGstin: string | null; placeOfSupply: string; supplyKind: string;
    lut: boolean; cartons?: number | null; headerDiscounts?: { kind: "special" | "cash"; pct: string; amount: string }[]; earlyPayPct?: string | null; earlyPayDays?: number | null; reverseCharge?: boolean; terms?: string | null; kind?: string; advanceDue?: string | null;
    billingAddress: { line1?: string; city?: string; pincode?: string; stateCode?: string }; shippingAddress?: { line1?: string; city?: string; pincode?: string } | null;
    taxable: string; cgst: string; sgst: string; utgst: string; igst: string; cess: string; roundOff?: string; total: string; status: string;
    irn?: string | null; ackNo?: string | null; ackDate?: string | null; signedQr?: string | null; ewbNo?: string | null; ewbStatus?: string; lines: Line[];
    narration?: string | null; received?: string; balance?: string; partyBalance?: string;
  };
  company: { name: string; legalName: string | null; pan: string | null };
  branch: { gstin: string | null; stateCode: string; address: { line1?: string; line2?: string; city?: string; pincode?: string } };
  settings: { bilingualPrint: boolean; printLanguage?: string; invoiceTerms: string | null; bankDetails: string | null };
}

/** The tab title becomes the file name when the document is saved as a PDF. */
export const printTitle = (d: PrintData) => ({ title: { absolute: `${d.invoice.number.replaceAll("/", "-")} ${d.invoice.customerName}` } });

const PAPER_MM: Record<string, [number, number]> = { A4: [210, 297], A5: [148, 210], A3: [297, 420], Letter: [216, 279], Legal: [216, 356] };
const NAME_SIZE: Record<string, string> = { large: "text-[22px]", medium: "text-[17px]", small: "text-[13px]" };

/**
 * A4 tax invoice (Rule 46), quotation or proforma invoice: supplier and buyer GSTIN, place of supply, HSN, taxable value and tax by rate, amount in words, and for
 * an e-invoice the IRN with its signed QR code. Five layouts (Tally, Landscape 1, Landscape 2, GST 1, GST 2) and the options chosen on the Print tab of Settings:
 * what the header, item table, totals and foot show, the paper and the colour. Labels in English with the second print language alongside when bilingual printing is on.
 */
export async function TaxDocument({ d, kind, prefs, preview }: { d: PrintData; kind: "invoice" | "quotation" | "proforma"; prefs?: Record<string, boolean | string> | undefined; preview?: boolean }) {
  // What the business chose on the Settings screen. A page without a signed-in reader (the shared link) prints the defaults.
  const pf = resolvePreferences(prefs);
  const on = (k: string) => pf[`print.${k}`] === true;
  const txt = (k: string) => String(pf[`print.${k}`] ?? "").trim();
  const accent = ACCENT_COLOURS[String(pf["print.accent"])] ?? null;
  const theme = String(pf["print.theme"]);
  const wide = LANDSCAPE_THEMES.includes(theme);
  const band = theme === "gst2";
  const tint = accent ?? "#475569";
  const paper = String(pf["print.paper"]), landscape = pf["print.orientation"] === "landscape" || wide;
  const [pw, ph] = PAPER_MM[paper] ?? PAPER_MM.A4!;
  const widthMm = landscape ? ph : pw;
  const en = await getTranslations({ locale: "en" });
  const second = d.settings.printLanguage ?? "hi";
  const hi = await getTranslations({ locale: second });
  const inv = d.invoice;
  const quote = kind !== "invoice";
  const proforma = kind === "proforma";
  const bi = d.settings.bilingualPrint;
  const L = (key: string, values?: Record<string, string>) => (bi ? `${en(key, values)} / ${hi(key, values)}` : en(key, values));
  const state = (code: string) => findState(code)?.name ?? code;
  // Indian date style (30 Sept 2026) whatever the reader's language.
  const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
  const date = (iso: string) => dateFmt.format(new Date(`${iso}T00:00:00+05:30`));
  const qr = inv.signedQr ? await QRCode.toString(inv.signedQr, { type: "svg", margin: 0, errorCorrectionLevel: "L" }) : null;
  const intra = inv.supplyKind === "intra";
  const utgst = dec(inv.utgst).gt(0);
  const terms = (quote ? inv.terms : null) ?? d.settings.invoiceTerms;
  const decimals = on("amountDecimal") ? Number(pf["general.amountDecimals"]) : 0;
  const money = (v: string | ReturnType<typeof dec>) => (on("amountGrouping") ? formatIndian(v, decimals) : dec(v).toFixed(decimals));

  // Tax summary by HSN and rate, as auditors expect on a GST invoice.
  const byRate = new Map<string, { hsn: string; rate: string; taxable: ReturnType<typeof dec>; cgst: ReturnType<typeof dec>; sgst: ReturnType<typeof dec>; igst: ReturnType<typeof dec>; cess: ReturnType<typeof dec> }>();
  for (const l of inv.lines) {
    const k = `${l.hsn ?? ""}|${Number(l.gstRate)}`;
    const r = byRate.get(k) ?? { hsn: l.hsn ?? "", rate: String(Number(l.gstRate)), taxable: dec(0), cgst: dec(0), sgst: dec(0), igst: dec(0), cess: dec(0) };
    byRate.set(k, { ...r, taxable: r.taxable.plus(l.taxable), cgst: r.cgst.plus(l.cgst), sgst: r.sgst.plus(l.sgst).plus(l.utgst), igst: r.igst.plus(l.igst), cess: r.cess.plus(l.cess) });
  }
  const taxRows = [...byRate.values()].sort((a, b) => Number(a.rate) - Number(b.rate) || a.hsn.localeCompare(b.hsn));
  const totalQty = inv.lines.reduce((s, l) => s.plus(l.qty), dec(0));
  const lineDiscount = (l: Line) => Math.max(Number(l.discount) - Number(l.headerDiscount ?? 0), 0);
  const saved = inv.lines.reduce((s, l) => s.plus(l.discount), dec(0));
  const taxOf = (l: Line) => dec(l.cgst).plus(l.sgst).plus(l.utgst).plus(l.igst).plus(l.cess);
  const wordsOf = (v: string, lang: "en" | "hi" | "mr") => (lang === "en" && pf["print.wordsStyle"] === "international" ? amountInWordsIntl(v) : amountInWords(v, lang));

  // Cell styles of the layout: a grid for every layout but GST 1, which draws ruled lines.
  const grid = theme !== "gst1";
  const th = grid ? "border border-black/60 px-1.5 py-1 text-left font-semibold" : "border-b-2 border-black/70 px-1.5 py-1 text-left font-semibold";
  const headFill = theme === "gst1" || band ? tint : accent;
  const thStyle = headFill ? { backgroundColor: headFill, color: "#fff", borderColor: headFill } : undefined;
  const td = grid ? "border border-black/60 px-1.5 py-1 align-top" : "border-b border-black/15 px-1.5 py-1 align-top";
  const num = `${td} text-right tabular-nums`;
  const cell = "border border-black/60 p-1.5";

  // The name the business gave this kind of document, if any (Settings > Print > Change transaction names).
  const named = String(pf[`names.${proforma ? "proforma" : quote ? "quotation" : "invoice"}`] ?? "").trim();
  const title = named || L(proforma ? "print.proforma" : quote ? "print.quotation" : "print.taxInvoice");
  const companyName = txt("companyNameText") || d.company.legalName || d.company.name;
  const address = txt("addressText") || [d.branch.address.line1, d.branch.address.line2, d.branch.address.city, d.branch.address.pincode].filter(Boolean).join(", ");
  const gstin = txt("gstinText") || d.branch.gstin;
  const logo = on("showLogo") && txt("logo") ? <img src={txt("logo")} alt="" className="max-h-16 max-w-28 object-contain" /> : null;
  const nameColour = !band && accent && theme !== "tally" && !wide ? { color: accent } : undefined;
  const companyBlock = (
    <div className="flex min-w-0 items-center gap-3">
      {logo}
      <div className="min-w-0">
        {on("showCompany") ? <h1 className={`font-bold leading-tight ${NAME_SIZE[String(pf["print.companyNameSize"])]}`} style={nameColour}>{companyName}</h1> : null}
        {on("showAddress") ? <><p>{address}</p><p>{state(d.branch.stateCode)} ({d.branch.stateCode})</p></> : null}
        {on("showPhone") && txt("phoneText") ? <p>{en("print.phone")}: <b>{txt("phoneText")}</b></p> : null}
        {on("showEmail") && txt("emailText") ? <p>{en("print.email")}: {txt("emailText")}</p> : null}
        {on("showGstin") && gstin ? <p className="font-semibold">GSTIN: {gstin}</p> : null}
        {on("showPan") && d.company.pan ? <p>PAN: {d.company.pan}</p> : null}
      </div>
    </div>
  );
  const qrBlock = qr ? <div className="ml-auto mt-1 size-24 bg-white p-0.5" dangerouslySetInnerHTML={{ __html: qr }} /> : null;
  const billTo = (
    <div>
      <p className="font-semibold">{L(quote && !proforma ? "print.quotedTo" : "print.billTo")}:</p>
      <p className="text-[1.05em] font-bold">{inv.customerName}</p>
      <p>{[inv.billingAddress.line1, inv.billingAddress.city, inv.billingAddress.pincode].filter(Boolean).join(", ")}</p>
      {inv.customerGstin ? <p className="font-semibold">GSTIN: {inv.customerGstin}</p> : null}
    </div>
  );
  const shipTo = inv.shippingAddress?.line1 ? (
    <div>
      <p className="font-semibold">{L("print.shipTo")}:</p>
      <p>{[inv.shippingAddress.line1, inv.shippingAddress.city, inv.shippingAddress.pincode].filter(Boolean).join(", ")}</p>
    </div>
  ) : null;
  const metaRows: [string, ReactNode][] = [
    [L(proforma ? "print.proformaNo" : quote ? "print.quotationNo" : "print.invoiceNo"), <span key="n" className="font-mono">{inv.number}</span>],
    [L(proforma ? "print.proformaDate" : quote ? "print.quotationDate" : "print.invoiceDate"), date(inv.date)],
    ...(inv.validUntil ? [[L("sales.quotations.validUntil"), date(inv.validUntil)] as [string, ReactNode]] : []),
    ...(inv.dueOn ? [[L("sales.invoices.dueOn"), date(inv.dueOn)] as [string, ReactNode]] : []),
    [L("sales.placeOfSupply"), `${state(inv.placeOfSupply)} (${inv.placeOfSupply})`],
    ...(quote ? [] : [[en("print.reverseCharge"), inv.reverseCharge ? "Yes" : "No"] as [string, ReactNode]]),
  ];
  const metaTable = (right?: boolean) => (
    <table className={right ? "ml-auto" : ""}><tbody>{metaRows.map(([k, v], i) => <tr key={i}><td className="pr-3 font-semibold">{k}{right ? ":" : ""}</td><td className={right ? "text-right" : ""}>{v}</td></tr>)}</tbody></table>
  );
  const irnLine = inv.irn ? (
    <section className="border-b border-black/60 py-1 font-mono text-[9px]">
      IRN: {inv.irn} · Ack No: {inv.ackNo} · Ack Date: {inv.ackDate ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(inv.ackDate)) : ""}
      {inv.ewbNo && inv.ewbStatus === "active" ? ` · EWB: ${inv.ewbNo}` : ""}
    </section>
  ) : null;

  // The item table: the columns the business chose.
  const lead = (on("showSno") ? 1 : 0) + 1 + (on("showHsn") ? 1 : 0) + (on("showMrp") ? 1 : 0);
  const lineTable = (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {on("showSno") ? <th className={th} style={thStyle}>{en("print.sno")}</th> : null}
          <th className={th} style={thStyle}>{L("purchase.item")}</th>
          {on("showHsn") ? <th className={th} style={thStyle}>{en("print.hsn")}</th> : null}
          {on("showMrp") ? <th className={`${th} text-right`} style={thStyle}>{en("print.mrp")}</th> : null}
          <th className={`${th} text-right`} style={thStyle}>{L("purchase.qty")}</th>
          <th className={`${th} text-right`} style={thStyle}>{L("purchase.rate")}</th>
          <th className={`${th} text-right`} style={thStyle}>{en("purchase.discount")}</th>
          <th className={`${th} text-right`} style={thStyle}>{en("purchase.taxable")}</th>
          <th className={`${th} text-right`} style={thStyle}>GST</th>
          {wide ? <th className={`${th} text-right`} style={thStyle}>{en("print.taxAmount")}</th> : null}
          <th className={`${th} text-right`} style={thStyle}>{L("purchase.amount")}</th>
        </tr>
      </thead>
      <tbody>
        {inv.lines.map((l, i) => (
          <tr key={l.id}>
            {on("showSno") ? <td className={td}>{i + 1}</td> : null}
            <td className={td}>
              {l.itemName}{bi && l.itemNameHi && devanagari(second) ? <span className="block">{l.itemNameHi}</span> : null}
              {[on("showBatch") && l.batchNo ? `${en("print.batch")}: ${l.batchNo}` : null, on("showExpiry") && l.expiry ? `${en("print.expiry")}: ${date(l.expiry)}` : null, on("showModel") && l.model ? `${en("print.model")}: ${l.model}` : null].filter(Boolean).join(", ") ? <span className="block text-[0.9em] text-black/70">{[on("showBatch") && l.batchNo ? `${en("print.batch")}: ${l.batchNo}` : null, on("showExpiry") && l.expiry ? `${en("print.expiry")}: ${date(l.expiry)}` : null, on("showModel") && l.model ? `${en("print.model")}: ${l.model}` : null].filter(Boolean).join(", ")}</span> : null}
              {on("showSize") && (l.size || l.colour) ? <span className="block text-[0.9em] text-black/70">{[l.size ? `${en("print.size")}: ${l.size}` : null, l.colour ? `${en("print.colour")}: ${l.colour}` : null].filter(Boolean).join(", ")}</span> : null}
            </td>
            {on("showHsn") ? <td className={`${td} font-mono`}>{l.hsn}</td> : null}
            {on("showMrp") ? <td className={num}>{l.mrp ? money(l.mrp) : ""}</td> : null}
            <td className={num}>{Number(l.qty).toLocaleString("en-IN", { maximumFractionDigits: 3 })}{on("showUom") ? ` ${l.uom}` : ""}</td>
            <td className={num}>{money(l.rate)}</td>
            <td className={num}>{lineDiscount(l) > 0 ? money(String(lineDiscount(l))) : ""}</td>
            <td className={num}>{money(l.taxable)}</td>
            <td className={num}>{Number(l.gstRate)}%</td>
            {wide ? <td className={num}>{money(taxOf(l))}</td> : null}
            <td className={num}>{money(l.total)}</td>
          </tr>
        ))}
        {on("showTotalQty") ? (
          <tr className="font-bold">
            <td className={td} colSpan={lead}>{L("purchase.total")}</td>
            <td className={num}>{totalQty.toNumber().toLocaleString("en-IN", { maximumFractionDigits: 3 })}</td>
            <td className={td} />
            <td className={num}>{money(inv.lines.reduce((s, l) => s.plus(lineDiscount(l)), dec(0)))}</td>
            <td className={num}>{money(inv.taxable)}</td>
            <td className={td} />
            {wide ? <td className={num}>{money(inv.lines.reduce((s, l) => s.plus(taxOf(l)), dec(0)))}</td> : null}
            <td className={num}>{money(inv.lines.reduce((s, l) => s.plus(l.total), dec(0)))}</td>
          </tr>
        ) : null}
      </tbody>
    </table>
  );
  const billDiscounts = (inv.headerDiscounts ?? []).length || (inv.earlyPayPct && inv.earlyPayDays) ? (
    <div className="mt-2 text-xs">
      {(inv.headerDiscounts ?? []).map((h) => <p key={h.kind} className="flex justify-between gap-6"><span>{en(`print.billDiscount.${h.kind}`, { pct: String(Number(h.pct)) })}</span><span className="num">{money(h.amount)}</span></p>)}
      {inv.earlyPayPct && inv.earlyPayDays ? <p className="mt-1">{en("print.earlyPay", { pct: String(Number(inv.earlyPayPct)), days: String(inv.earlyPayDays) })}</p> : null}
    </div>
  ) : null;

  // The tax summary table, and the totals list.
  const summaryTable = on("showTaxSummary") ? (
    <div>
      <p className="mb-1 font-semibold">{L("print.taxSummary")}</p>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className={th} style={thStyle}>{en("print.hsn")}</th>
            <th className={`${th} text-right`} style={thStyle}>{en("print.rate")}</th>
            <th className={`${th} text-right`} style={thStyle}>{en("purchase.taxable")}</th>
            {intra ? <><th className={`${th} text-right`} style={thStyle}>CGST</th><th className={`${th} text-right`} style={thStyle}>{utgst ? "UTGST" : "SGST"}</th></> : <th className={`${th} text-right`} style={thStyle}>IGST</th>}
            {dec(inv.cess).gt(0) ? <th className={`${th} text-right`} style={thStyle}>Cess</th> : null}
          </tr>
        </thead>
        <tbody>
          {taxRows.map((r) => (
            <tr key={`${r.hsn}|${r.rate}`}>
              <td className={`${td} font-mono`}>{r.hsn}</td><td className={num}>{r.rate}%</td><td className={num}>{money(r.taxable)}</td>
              {intra ? <><td className={num}>{money(r.cgst)}</td><td className={num}>{money(r.sgst)}</td></> : <td className={num}>{money(r.igst)}</td>}
              {dec(inv.cess).gt(0) ? <td className={num}>{money(r.cess)}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : null;
  const tr = (label: string, v: string, strong = false, fill = false) => (
    <tr key={label} className={strong ? "font-bold" : ""} style={fill && (band || theme === "gst1") ? { backgroundColor: tint, color: "#fff" } : undefined}>
      <td className={td}>{label}</td><td className={num}>{v}</td>
    </tr>
  );
  const totalsTable = (
    <table className="w-full min-w-[15rem] self-start border-collapse">
      <tbody>
        {tr(en("purchase.taxable"), money(inv.taxable))}
        {dec(inv.cgst).gt(0) ? tr("CGST", money(inv.cgst)) : null}
        {dec(inv.sgst).gt(0) ? tr("SGST", money(inv.sgst)) : null}
        {utgst ? tr("UTGST", money(inv.utgst)) : null}
        {dec(inv.igst).gt(0) ? tr("IGST", money(inv.igst)) : null}
        {dec(inv.cess).gt(0) ? tr("Cess", money(inv.cess)) : null}
        {inv.roundOff && !dec(inv.roundOff).isZero() ? tr(en("calc.roundOff"), money(inv.roundOff)) : null}
        {tr(L("purchase.total"), `₹ ${money(inv.total)}`, true, true)}
        {proforma && inv.advanceDue ? tr(L("sales.proformas.advanceDue"), `₹ ${money(inv.advanceDue)}`, true) : null}
        {!quote && on("showReceived") && inv.received !== undefined ? tr(en("print.received"), money(inv.received)) : null}
        {!quote && on("showBalance") && inv.balance !== undefined ? tr(en("print.balance"), money(inv.balance)) : null}
        {!quote && on("showCurrentBalance") && inv.partyBalance !== undefined ? tr(en("print.currentBalance"), money(inv.partyBalance)) : null}
        {on("showYouSaved") && saved.gt(0) ? tr(en("print.youSaved"), `₹ ${money(saved)}`, true) : null}
      </tbody>
    </table>
  );
  const words = on("showWords") ? (
    <div>
      <p className="font-semibold">{L("print.amountInWords")}</p>
      <p>{wordsOf(inv.total, "en")}</p>
      {bi && wordsLang(second) !== "en" ? <p>{wordsOf(inv.total, wordsLang(second))}</p> : null}
    </div>
  ) : null;
  const misc = (
    <>
      {inv.cartons ? <p className="mt-2"><span className="font-semibold">{L("print.cartons")}:</span> {inv.cartons}</p> : null}
      {inv.supplyKind === "export" && inv.lut ? <p className="mt-2 font-semibold">{en("print.exportLut")}</p> : null}
    </>
  );
  const descBlock = on("showDescription") && inv.narration ? <div><p className="font-semibold">{en("print.description")}:</p><p className="whitespace-pre-line">{inv.narration}</p></div> : null;
  const termsBlock = on("showTerms") && terms ? <div><p className="font-semibold">{L("print.terms")}:</p><p className="whitespace-pre-line">{terms}</p></div> : null;
  // A UPI pay-now QR code for the amount still due on the invoice, when the business has given its UPI id.
  const due = Number(inv.balance ?? 0);
  const upiId = txt("upiId");
  const upiSvg = !quote && upiId && on("showUpiQr") && due > 0
    ? await QRCode.toString(`upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(d.company.name)}&am=${due.toFixed(2)}&cu=INR&tn=${encodeURIComponent(inv.number)}`, { type: "svg", margin: 0, errorCorrectionLevel: "M" }) : null;
  const bankText = on("showBank") && d.settings.bankDetails ? d.settings.bankDetails : null;
  const bankBlock = bankText || upiSvg ? (
    <div className="flex items-start gap-3">
      {upiSvg ? <div><div className="size-24 bg-white" dangerouslySetInnerHTML={{ __html: upiSvg }} /><p className="text-center text-[9px] font-semibold">{en("print.payNow")}</p></div> : null}
      {bankText ? <div><p className="font-semibold">{L("print.bank")}:</p><p className="whitespace-pre-line">{bankText}</p></div> : null}
    </div>
  ) : null;
  const signBlock = on("showSignatory") ? (
    <div className="text-right">
      <p className="font-semibold">{en("print.forCompany", { company: d.company.legalName ?? d.company.name })}</p>
      <p className="mt-10">{L("print.signatory")}</p>
    </div>
  ) : null;
  const fine = <p className="mt-3 text-center text-[9px] text-black/60">{en(proforma ? "print.computerGeneratedProforma" : quote ? "print.computerGeneratedQuote" : "print.computerGenerated")}</p>;
  const original = quote ? null : <span className="ml-3 text-[10px] font-normal italic">{en("print.original")}</span>;

  // The header of each layout is kept apart from the rest so it can repeat on every page.
  let head: ReactNode;
  let rest: ReactNode;
  if (theme === "tally") {
    head = (
      <>
        <p className="mb-1 text-center text-lg font-bold">{title}{original}</p>
        <div className={`${cell} flex items-center justify-between`}>{companyBlock}{qrBlock}</div>
      </>
    );
    rest = (
      <>
        {irnLine}
        <div className="grid grid-cols-2"><div className={cell}>{billTo}</div><div className={cell}>{metaTable()}</div></div>
        {shipTo ? <div className={cell}>{shipTo}</div> : null}
        {lineTable}{billDiscounts}
        <div className="mt-2 grid grid-cols-[1fr_auto] gap-3">
          <div>{summaryTable}{words ? <div className="mt-2">{words}</div> : null}{misc}</div>
          {totalsTable}
        </div>
        {descBlock || termsBlock ? <div className="mt-2 grid grid-cols-2"><div className={cell}>{descBlock}</div><div className={cell}>{termsBlock}</div></div> : null}
        <div className="grid grid-cols-2"><div className={cell}>{bankBlock}</div><div className={cell}>{signBlock}</div></div>
        {fine}
      </>
    );
  } else if (wide) {
    head = (
      <>
        <div className={`${cell} text-center text-sm font-bold`}>{title}{original}</div>
        <div className="grid grid-cols-[1fr_auto]"><div className={cell}>{companyBlock}</div><div className={`${cell} min-w-[16rem]`}>{metaTable()}{qrBlock}</div></div>
      </>
    );
    const summaryCells: [string, string][] = [[en("purchase.taxable"), money(inv.taxable)], [en("purchase.discount"), money(saved)], [en("print.taxAmount"), money(dec(inv.cgst).plus(inv.sgst).plus(inv.utgst).plus(inv.igst).plus(inv.cess))], [en("calc.roundOff"), money(inv.roundOff ?? "0")], [L("purchase.total"), `₹ ${money(inv.total)}`]];
    rest = (
      <>
        {irnLine}
        <div className="grid grid-cols-2"><div className={cell}>{billTo}</div><div className={cell}>{shipTo}</div></div>
        {lineTable}{billDiscounts}
        {theme === "landscape1" ? (
          <>
            <div className="grid grid-cols-5">{summaryCells.map(([k, v]) => <div key={k} className={cell}>{k}: <b>{v}</b></div>)}</div>
            {words ? <div className={cell}>{words}</div> : null}
            {!quote && (on("showReceived") || on("showBalance") || on("showCurrentBalance") || (on("showYouSaved") && saved.gt(0))) ? (
              <div className="grid grid-cols-4">
                <div className={cell}>{on("showReceived") && inv.received !== undefined ? <>{en("print.received")}: <b>{money(inv.received)}</b></> : null}</div>
                <div className={cell}>{on("showBalance") && inv.balance !== undefined ? <>{en("print.balance")}: <b>{money(inv.balance)}</b></> : null}</div>
                <div className={cell}>{on("showCurrentBalance") && inv.partyBalance !== undefined ? <>{en("print.currentBalance")}: <b>{money(inv.partyBalance)}</b></> : null}</div>
                <div className={cell}>{on("showYouSaved") && saved.gt(0) ? <>{en("print.youSaved")}: <b>{money(saved)}</b></> : null}</div>
              </div>
            ) : null}
            <div className="grid grid-cols-[1fr_auto]"><div className={cell}>{summaryTable}{misc}</div>{bankBlock ? <div className={`${cell} min-w-[12rem]`}>{bankBlock}</div> : null}</div>
          </>
        ) : (
          <div className="grid grid-cols-[1fr_auto]">
            <div className={cell}>{summaryTable}{words ? <div className="mt-2">{words}</div> : null}{misc}</div>
            <div className={cell}>{totalsTable}</div>
          </div>
        )}
        {descBlock || termsBlock || signBlock ? <div className="grid grid-cols-3"><div className={cell}>{descBlock}</div><div className={cell}>{termsBlock}</div><div className={cell}>{signBlock}</div></div> : null}
        {theme === "landscape2" && bankBlock ? <div className={cell}>{bankBlock}</div> : null}
        {fine}
      </>
    );
  } else if (theme === "gst1") {
    head = (
      <>
        <div className="flex items-start justify-between gap-6 pb-2">{companyBlock}{qrBlock}</div>
        <div className="border-t" style={{ borderColor: tint }} />
        <p className="py-2 text-center text-xl font-bold" style={{ color: tint }}>{title}{original}</p>
      </>
    );
    rest = (
      <>
        {irnLine}
        <section className="grid grid-cols-3 gap-4 pb-3"><div>{billTo}</div><div>{shipTo}</div><div className="text-right">{metaTable(true)}</div></section>
        {lineTable}{billDiscounts}
        <section className="mt-3 grid grid-cols-[1fr_auto] gap-6">
          <div className="space-y-2">{descBlock}{words}{termsBlock}{summaryTable}{misc}</div>
          {totalsTable}
        </section>
        <footer className="mt-4 grid grid-cols-2 gap-6 pt-2"><div>{bankBlock}</div>{signBlock}</footer>
        {fine}
      </>
    );
  } else {
    // GST 2: a framed page with a coloured band across the top.
    head = (
      <header className="flex items-start justify-between gap-6 px-3 py-2 text-white" style={{ backgroundColor: tint }}>
        {companyBlock}
        <div className="text-right">
          <p className="text-2xl font-bold tracking-wide">{title}</p>
          {quote ? null : <p className="italic">{en("print.original")}</p>}
          {qrBlock}
        </div>
      </header>
    );
    rest = (
      <>
        {irnLine}
        <section className="grid grid-cols-2 gap-4 px-3 py-3"><div>{billTo}{shipTo ? <div className="mt-2">{shipTo}</div> : null}</div>{metaTable()}</section>
        {lineTable}{billDiscounts}
        <section className="mt-3 grid grid-cols-[1fr_auto] gap-6 px-3">
          <div className="space-y-2">{summaryTable}{words}{misc}</div>
          {totalsTable}
        </section>
        <footer className="mt-6 grid grid-cols-2 gap-6 border-t border-black/60 px-3 pt-3">
          <div className="space-y-2">{descBlock}{bankBlock}{termsBlock}</div>{signBlock}
        </footer>
        {fine}
      </>
    );
  }

  return (
    <main className={`mx-auto p-[10mm] text-[11px] leading-snug print:p-0 ${band ? "border border-black/70 print:p-[3mm]" : ""}`} style={{ maxWidth: `${widthMm}mm` }}>
      <style>{`@page { size: ${paper === "Letter" ? "letter" : paper === "Legal" ? "legal" : paper} ${landscape ? "landscape" : "portrait"}; margin: 10mm } @media print { .no-print { display: none } * { -webkit-print-color-adjust: exact; print-color-adjust: exact } thead { display: table-header-group } }`}</style>
      {preview ? null : <div className="no-print mb-4 flex justify-end"><PrintButton /></div>}
      {inv.status === "cancelled" ? <p className="mb-2 border-2 border-red-700 p-1 text-center text-base font-bold text-red-700">CANCELLED</p> : null}
      {on("repeatHeader") ? (
        <table className="w-full border-collapse">
          <thead><tr><td className="p-0 align-top">{head}</td></tr></thead>
          <tbody><tr><td className="p-0 align-top">{rest}</td></tr></tbody>
        </table>
      ) : <>{head}{rest}</>}
    </main>
  );
}
