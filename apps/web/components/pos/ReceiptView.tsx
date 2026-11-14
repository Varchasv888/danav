import { getTranslations } from "next-intl/server";
import QRCode from "qrcode";
import { amountInWords, amountInWordsIntl, dec, formatIndian, resolvePreferences, rollWidth } from "@varchasv/domain";
import { PrintButton } from "@/components/sales/PrintButton";
import { ReceiptPaper, type Paper } from "./ReceiptPaper";
import { DirectPrint } from "./DirectPrint";

export interface Receipt {
  id: string; number: string; date: string; createdAt: string; status: string; customerPhone: string | null; customerName: string | null;
  taxable: string; cgst: string; sgst: string; cess: string; discount: string; roundOff: string; total: string; change: string;
  payments: { mode: string; amount: string; reference?: string }[];
  taxByRate: { rate: string; taxable: string; cgst: string; sgst: string; igst?: string; cess: string }[];
  loyaltyEarned: number; loyaltyRedeemed: number; loyaltyBalance: number | null;
  lines: { id: string; name: string; hsn: string | null; qty: string; price: string; total: string; discount?: string; taxable?: string; gstRate?: string; uom?: string; mrp?: string | null; size?: string | null; colour?: string | null; batchNo?: string | null; expiry?: string | null; model?: string | null; serials?: string[] | null }[];
  terminal: { code: string; name: string } | null; footer: string | null;
  promos?: { vouchers?: { code: string; amount: string }[] };
  exchange?: { number: string; against: string | null; total: string; lines: { name: string; qty: string; total: string }[]; creditCode: string | null; creditLeft: string } | null;
  company: { name: string }; branch: { gstin: string | null; address: { line1?: string; line2?: string; city?: string; pincode?: string } | null; stateCode: string } | null;
  /** Set for a tax invoice printed on the roll: only the date shows, and what was received and what is due come from the books. */
  dateOnly?: boolean; received?: string; balance?: string; partyBalance?: string; title?: string; description?: string | null; upiUrl?: string | null;
}

/**
 * The receipt for a counter bill: a B2C tax invoice (or cash memo without a GSTIN) with tax by rate, for a thermal roll or A4. Five layouts (Theme 1 to Theme 5) and the options
 * chosen on the Thermal printer tab of Settings: what the header, item lines, totals and foot show, the roll width, bold text, blank lines at the end and the number of copies.
 * Browsers do not understand a page height of "auto", so on a roll the page height is worked out from what the bill holds (a little more than needed, never less, so a bill
 * is not cut across two sheets); the printer's cutter ends the roll.
 */
export async function ReceiptView({ r, paper = "68", picker = true, prefs, preview, direct }: { r: Receipt; paper?: Paper; picker?: boolean; prefs?: Record<string, boolean | string> | undefined; preview?: boolean; direct?: string }) {
  const pf = resolvePreferences(prefs);
  const on = (k: string) => pf[`thermal.${k}`] === true;
  const txt = (k: string) => String(pf[`thermal.${k}`] ?? "").trim();
  const theme = String(pf["thermal.theme"]);
  const extraLines = Number(pf["thermal.extraLines"]);
  const copies = Number(pf["thermal.copies"]);
  const t = await getTranslations();
  const decimals = on("amountDecimal") ? Number(pf["general.amountDecimals"]) : 0;
  const m = (v: string) => (on("amountGrouping") ? formatIndian(v, decimals) : dec(v).toFixed(decimals));
  const bold = on("bold") ? "font-bold" : "";
  const addr = r.branch?.address;
  const address = txt("addressText") || (addr ? [addr.line1, addr.line2, addr.city, addr.pincode].filter(Boolean).join(", ") : "");
  const gstin = txt("gstinText") || r.branch?.gstin;
  const time = new Date(r.createdAt).toLocaleString("en-IN", r.dateOnly ? { dateStyle: "medium", timeZone: "Asia/Kolkata" } : { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Kolkata" });
  const upiQr = r.upiUrl ? await QRCode.toString(r.upiUrl, { type: "svg", margin: 0, errorCorrectionLevel: "M" }) : null;
  const named = String(pf["names.receipt"] ?? "").trim();
  const rule = <div className={`my-1.5 border-t border-black ${theme === "theme4" ? "border-double border-t-4" : "border-dashed"}`} />;
  const row = (label: string, v: string, big = false) => <div className={`flex justify-between ${big ? `text-[14px] ${bold}` : ""}`}><span>{label}</span><span className="tabular-nums">{v}</span></div>;
  const roll = paper !== "a4";
  const width = roll ? rollWidth(paper, pf["thermal.chars"] as string).mm : 80;
  const lineCount = r.lines.length * (theme === "theme1" || theme === "theme2" ? 1.6 : 2.6);
  // Millimetres: header and footer, then the lines (names wrap), payments and tax rows, and any exchange or vouchers.
  const height = Math.min(1200, Math.max(100, Math.ceil(70 + lineCount * 6 + (r.payments.length + (r.branch?.gstin ? r.taxByRate.length : 0)) * 5 + (r.exchange ? 12 + r.exchange.lines.length * 9 : 0) + (r.promos?.vouchers?.length ?? 0) * 5 + (r.footer ? r.footer.split("\n").length * 5 : 0) + extraLines * 5)));
  const sheet = roll ? `${width}mm ${height}mm` : "A4";
  const sub = (l: Receipt["lines"][number]) => [on("showBatch") && l.batchNo ? `${t("print.batch")}: ${l.batchNo}` : null, on("showExpiry") && l.expiry ? `${t("print.expiry")}: ${l.expiry}` : null, on("showModel") && l.model ? `${t("print.model")}: ${l.model}` : null, on("showSerial") && l.serials?.length ? `${t("print.serial")}: ${l.serials.join(", ")}` : null, on("showHsn") && l.hsn ? `HSN: ${l.hsn}` : null, on("showMrp") && l.mrp ? `MRP: ${m(l.mrp)}` : null, on("showSize") && l.size ? `${t("print.size")}: ${l.size}` : null, on("showSize") && l.colour ? `${t("print.colour")}: ${l.colour}` : null].filter(Boolean).join(", ");
  const qtyText = (l: Receipt["lines"][number]) => `${Number(l.qty)}${on("showUom") && l.uom ? ` ${l.uom}` : ""}`;
  const discPct = (l: Receipt["lines"][number]) => {
    const gross = dec(l.price).times(l.qty);
    return gross.gt(0) && dec(l.discount ?? 0).gt(0) ? `${dec(l.discount ?? 0).div(gross).times(100).toDecimalPlaces(2).toString()}` : "0";
  };
  const inter = r.taxByRate.some((x) => Number(x.igst ?? 0) > 0);
  const totalQty = r.lines.reduce((s, l) => s.plus(l.qty), dec(0));
  const received = r.received !== undefined ? dec(r.received) : r.payments.reduce((s, p) => s.plus(p.amount), dec(0));
  const saved = dec(r.discount);

  const items = theme === "theme1" || theme === "theme2" ? (
    <table className="w-full">
      <thead><tr className="border-b border-black text-left">{on("showSno") ? <th>#</th> : null}<th>{t("purchase.item")}</th><th className="pl-1 text-right">{t("pos.billing.qty")}</th><th className="pl-1 text-right">{t("purchase.rate")}</th><th className="pl-1 text-right">{t("pos.billing.amount")}</th></tr></thead>
      <tbody>
        {r.lines.map((l, i) => (
          <tr key={l.id} className="align-top">
            {on("showSno") ? <td className="pr-1">{i + 1}</td> : null}
            <td className="pr-1">{l.name}{sub(l) ? <span className="block text-[0.85em]">{sub(l)}</span> : null}{theme === "theme1" && dec(l.discount ?? 0).gt(0) ? <span className="block text-[0.85em]">{t("purchase.discount")} -{m(l.discount!)}</span> : null}</td>
            <td className="pl-1 text-right tabular-nums">{qtyText(l)}</td><td className="pl-1 text-right tabular-nums">{m(l.price)}</td><td className="pl-1 text-right tabular-nums">{m(l.total)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <div>
      <div className="border-b border-black"><div className="flex gap-1">{on("showSno") ? <span>#</span> : null}<span>{t("purchase.item")}{on("showHsn") ? "(HSN)" : ""}</span></div>
        <div className="flex justify-between pl-3"><span>{t("pos.billing.qty")}</span>{on("showMrp") ? <span>MRP</span> : null}<span>{t("purchase.rate")}</span><span>{t("pos.billing.amount")}</span></div>
        {theme === "theme5" ? <div className="flex justify-between pl-3"><span>{t("purchase.discount")}(%)</span><span>{t("print.tax")}(%)</span><span>{t("print.finalAmount")}</span></div> : null}</div>
      {r.lines.map((l, i) => (
        <div key={l.id} className="mt-1">
          <div className="flex gap-1">{on("showSno") ? <span>{i + 1}</span> : null}<span>{l.name}{on("showHsn") && l.hsn ? `(${l.hsn})` : ""}</span></div>
          <div className="flex justify-between pl-3"><span>{qtyText(l)}</span>{on("showMrp") ? <span className="tabular-nums">{l.mrp ? m(l.mrp) : ""}</span> : null}<span className="tabular-nums">{m(l.price)}</span><span className="tabular-nums">{theme === "theme5" ? m(String(Number(l.price) * Number(l.qty))) : m(l.total)}</span></div>
          {on("showSize") && (l.size || l.colour) ? <div className="pl-3 text-[0.85em]">{[l.size ? `${t("print.size")}: ${l.size}` : null, l.colour ? `${t("print.colour")}: ${l.colour}` : null].filter(Boolean).join(", ")}</div> : null}
          {theme === "theme4" && dec(l.discount ?? 0).gt(0) ? (
            <>
              <div className="flex justify-between pl-3 text-[0.9em]"><span>{t("purchase.discount")}({discPct(l)}%)</span><span className="tabular-nums">-{m(l.discount!)}</span></div>
              <div className="flex justify-between pl-3 text-[0.9em]"><span>{t("print.finalAmount")}</span><span className="tabular-nums">{m(l.total)}</span></div>
            </>
          ) : null}
          {theme === "theme5" ? <div className="flex justify-between pl-3 text-[0.9em]"><span>{m(l.discount ?? "0")}({discPct(l)}%)</span><span>{m(String(Number(l.total) - Number(l.taxable ?? 0)))}({Number(l.gstRate ?? 0)}%)</span><span className="tabular-nums">{m(l.total)}</span></div> : null}
        </div>
      ))}
    </div>
  );

  const one = (n: number) => (
    <section key={n} className={n < copies ? "break-after-page" : ""}>
      {r.status === "void" ? <p className="mb-1 border-2 border-black text-center font-bold">VOID</p> : null}
      <header className="text-center">
        {on("showCompany") ? <p className={`text-[14px] ${bold}`}>{txt("companyNameText") || r.company.name}</p> : null}
        {on("showAddress") && address ? <p>{address}</p> : null}
        {on("showPhone") && txt("phoneText") ? <p>{t("print.phone")}: {txt("phoneText")}</p> : null}
        {on("showEmail") && txt("emailText") ? <p>{txt("emailText")}</p> : null}
        {gstin && on("showGstin") ? <p>GSTIN {gstin}</p> : null}
        <p className={`mt-1 ${bold}`}>{r.title ?? (named || (r.branch?.gstin ? t("pos.receipt.taxInvoice") : t("pos.receipt.billOfSupply")))}</p>
      </header>
      {rule}
      <div className="flex justify-between"><span>{r.number}</span><span>{time}</span></div>
      {r.terminal ? <div>{r.terminal.name}</div> : null}
      {on("showCustomer") && (r.customerName || r.customerPhone) ? <div>{[r.customerName, r.customerPhone ? `XXXXXX${r.customerPhone.slice(6)}` : null].filter(Boolean).join(" · ")}</div> : null}
      {rule}
      {items}
      {r.exchange ? (
        <>
          {rule}
          <div className={bold}>{t("exchange.receiptReturned", { number: r.exchange.against ?? "" })}</div>
          {r.exchange.lines.map((l, i) => (
            <div key={i} className="flex justify-between pl-2"><span>{l.name} × {Number(l.qty)}</span><span className="tabular-nums">-{m(l.total)}</span></div>
          ))}
        </>
      ) : null}
      {rule}
      {on("showTotalQty") ? <div className="flex justify-between"><span>{t("print.totalQty")}: {totalQty.toNumber()}</span><span>{t("print.items")}: {r.lines.length}</span></div> : null}
      {theme === "theme2" ? row(t("print.subTotal"), m(String(Number(r.taxable) + Number(r.cgst) + Number(r.sgst) + Number(r.cess)))) : null}
      {Number(r.discount) ? row(t("pos.billing.discount"), `-${m(r.discount)}`) : null}
      {Number(r.roundOff) ? row(t("pos.billing.roundOff"), r.roundOff) : null}
      {row(t("pos.billing.total"), `₹ ${m(r.total)}`, true)}
      {r.promos?.vouchers?.map((v) => <div key={v.code}>{row(t("pos.promo.voucher", { code: v.code }), m(v.amount))}</div>)}
      {on("showReceived") ? (r.received !== undefined ? row(t("print.received"), m(r.received)) : r.payments.map((p, i) => <div key={i}>{row(`${t(`pos.billing.modes.${p.mode}`)}${p.reference ? ` ${p.reference}` : ""}`, m(p.amount))}</div>)) : null}
      {on("showReceived") && Number(r.change) ? row(t("pos.billing.change"), m(r.change)) : null}
      {on("showBalance") ? row(t("print.balance"), m(r.balance ?? String(Math.max(Number(r.total) - Number(received), 0)))) : null}
      {pf["print.showCurrentBalance"] === true && r.partyBalance !== undefined ? row(t("print.currentBalance"), m(r.partyBalance)) : null}
      {on("showYouSaved") && saved.gt(0) ? row(t("print.youSaved"), m(r.discount)) : null}
      {r.exchange?.creditCode ? <div className="mt-1">{t("exchange.receiptCredit", { amount: m(r.exchange.creditLeft), code: r.exchange.creditCode })}</div> : null}
      {r.branch?.gstin && r.taxByRate.length && on("showTaxTable") ? (
        <>
          {rule}
          <table className="w-full">
            <thead><tr><th className="text-left">GST%</th><th className="text-right">{t("pos.billing.taxable")}</th>{inter ? <th className="text-right">IGST</th> : <><th className="text-right">CGST</th><th className="text-right">SGST</th></>}</tr></thead>
            <tbody>
              {r.taxByRate.map((x) => (
                <tr key={x.rate}><td>{Number(x.rate)}</td><td className="text-right tabular-nums">{m(x.taxable)}</td>{inter ? <td className="text-right tabular-nums">{m(x.igst ?? "0")}</td> : <><td className="text-right tabular-nums">{m(x.cgst)}</td><td className="text-right tabular-nums">{m(x.sgst)}</td></>}</tr>
              ))}
            </tbody>
          </table>
          {Number(r.cess) ? row("Cess", m(r.cess)) : null}
        </>
      ) : null}
      {on("showWords") ? <p className="mt-1">{pf["thermal.wordsStyle"] === "international" ? amountInWordsIntl(r.total) : amountInWords(r.total, "en")}</p> : null}
      {r.loyaltyEarned || r.loyaltyRedeemed ? (
        <>{rule}<p>{t("pos.receipt.pointsEarned", { points: r.loyaltyEarned, balance: r.loyaltyBalance ?? 0 })}</p></>
      ) : null}
      {rule}
      {upiQr ? <div className="mx-auto size-28" dangerouslySetInnerHTML={{ __html: upiQr }} /> : null}
      {on("showDescription") && (r.description ?? r.footer) ? <p className="text-center whitespace-pre-line">{r.description ?? r.footer}</p> : null}
      <p className="text-center">{t("pos.receipt.thanks")}</p>
      {Array.from({ length: extraLines }, (_, i) => <p key={i} aria-hidden>&nbsp;</p>)}
    </section>
  );

  return (
    <main className={`mx-auto p-[2mm] font-mono leading-tight print:p-0 ${roll && width <= 52 ? "text-[10px]" : "text-[11px]"}`} style={{ width: `${width}mm` }}>
      <style>{`@page { size: ${sheet}; margin: ${roll ? "2mm 0" : "10mm"} } @media print { .no-print { display: none !important } html, body { background: #fff !important; margin: 0 } * { -webkit-print-color-adjust: exact; print-color-adjust: exact } }`}</style>
      {preview ? null : <div className="no-print mb-3 flex items-center justify-between gap-2">{picker ? <ReceiptPaper current={paper} labels={{ "58": "58 mm", "68": "68 mm", "88": "88 mm", a4: "A4" }} /> : <span />}<span className="flex items-center gap-2">{direct && pf["thermal.printType"] === "direct" ? <DirectPrint path={direct} /> : null}<PrintButton /></span></div>}
      {Array.from({ length: copies }, (_, i) => one(i + 1))}
    </main>
  );
}
