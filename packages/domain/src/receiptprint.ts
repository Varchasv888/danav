import { dec, type DecimalInput } from "./money.js";
import { amountInWords, amountInWordsIntl, formatIndian } from "./words.js";

/**
 * What a roll printer needs to print a counter bill or a tax invoice: the receipt as lines of plain text and then as ESC/POS commands (the language almost every
 * receipt printer speaks, with its cutter and cash drawer). The browser page, a print agent on the counter computer and the Flutter apps all use the same bytes.
 */
export interface ReceiptLineData {
  name: string; hsn?: string | null; qty: string; price: string; total: string; discount?: string; taxable?: string; gstRate?: string; uom?: string;
  mrp?: string | null; size?: string | null; colour?: string | null; batchNo?: string | null; expiry?: string | null; model?: string | null; serials?: string[] | null;
}
export interface ReceiptData {
  number: string; createdAt: string; status: string; customerName: string | null; customerPhone: string | null; discount: string; roundOff: string; total: string; change: string;
  taxable: string; cgst: string; sgst: string; igst?: string; cess: string;
  payments: { mode: string; amount: string; reference?: string }[];
  taxByRate: { rate: string; taxable: string; cgst: string; sgst: string; igst?: string; cess: string }[];
  lines: ReceiptLineData[]; terminal: { code: string; name: string } | null; footer: string | null;
  company: { name: string }; branch: { gstin: string | null; address: { line1?: string; line2?: string; city?: string; pincode?: string } | null; stateCode: string } | null;
  /** Set for a tax invoice printed on the roll: only the date is shown, and what was received and what is due come from the books. */
  dateOnly?: boolean; received?: string; balance?: string; partyBalance?: string; title?: string; description?: string | null; upiUrl?: string | null;
}

/** The parts of a printed tax invoice that a roll receipt needs. */
export interface InvoiceLike {
  number: string; date: string; customerName: string; status: string; taxable: string; cgst: string; sgst: string; utgst: string; igst: string; cess: string; roundOff?: string; total: string;
  received?: string; balance?: string; partyBalance?: string; narration?: string | null;
  lines: { itemName: string; hsn: string | null; uom: string; qty: string; rate: string; discount: string; gstRate: string; taxable: string; cgst: string; sgst: string; utgst: string; igst: string; cess: string; total: string;
    mrp?: string | null; size?: string | null; colour?: string | null; batchNo?: string | null; expiry?: string | null; model?: string | null }[];
}
export function invoiceAsReceipt(inv: InvoiceLike, company: { name: string }, branch: ReceiptData["branch"], title: string, upiUrl?: string | null): ReceiptData {
  const byRate = new Map<string, ReceiptData["taxByRate"][number]>();
  for (const l of inv.lines) {
    const k = String(Number(l.gstRate));
    const r = byRate.get(k) ?? { rate: k, taxable: "0", cgst: "0", sgst: "0", igst: "0", cess: "0" };
    byRate.set(k, { rate: k, taxable: dec(r.taxable).plus(l.taxable).toFixed(2), cgst: dec(r.cgst).plus(l.cgst).toFixed(2), sgst: dec(r.sgst).plus(l.sgst).plus(l.utgst).toFixed(2), igst: dec(r.igst ?? "0").plus(l.igst).toFixed(2), cess: dec(r.cess).plus(l.cess).toFixed(2) });
  }
  return {
    number: inv.number, createdAt: `${inv.date}T00:00:00+05:30`, status: inv.status === "cancelled" ? "void" : "paid", customerName: inv.customerName, customerPhone: null,
    discount: inv.lines.reduce((s, l) => s.plus(l.discount), dec(0)).toFixed(2), roundOff: inv.roundOff ?? "0", total: inv.total, change: "0",
    taxable: inv.taxable, cgst: inv.cgst, sgst: dec(inv.sgst).plus(inv.utgst).toFixed(2), igst: inv.igst, cess: inv.cess, payments: [], taxByRate: [...byRate.values()],
    lines: inv.lines.map((l) => ({ name: l.itemName, hsn: l.hsn, qty: l.qty, price: l.rate, total: l.total, discount: l.discount, taxable: l.taxable, gstRate: l.gstRate, uom: l.uom, mrp: l.mrp ?? null, size: l.size ?? null, colour: l.colour ?? null, batchNo: l.batchNo ?? null, expiry: l.expiry ?? null, model: l.model ?? null })),
    terminal: null, footer: null, company, branch, dateOnly: true,
    ...(inv.received !== undefined ? { received: inv.received } : {}), ...(inv.balance !== undefined ? { balance: inv.balance } : {}), ...(inv.partyBalance !== undefined ? { partyBalance: inv.partyBalance } : {}),
    title, description: inv.narration ?? null, upiUrl: upiUrl ?? null,
  };
}

/** One line of the printout and how it is set. */
export interface Styled { text: string; bold?: boolean; align?: "left" | "center" | "right"; big?: boolean; qr?: string }

const ENGLISH = { item: "Item", qty: "Qty", rate: "Rate", amount: "Amount", total: "Total", discount: "Discount", subTotal: "Sub total", roundOff: "Round off", received: "Received", balance: "Balance",
  currentBalance: "Current balance", youSaved: "You saved", items: "Items", totalQty: "Qty", taxInvoice: "Tax invoice", billOfSupply: "Cash memo", phone: "Phone", size: "Size", colour: "Colour", batch: "Batch", exp: "Exp", model: "Model", serial: "Sr", thanks: "Thank you! Visit again.", change: "Change", taxable: "Taxable", final: "Final amount" };
export type ReceiptLabels = typeof ENGLISH;

const ascii = (s: string) => s.replace(/₹/g, "Rs.").replace(/[×]/g, "x").replace(/[·•]/g, "-").normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^\x20-\x7e]/g, "?");
const wrap = (text: string, width: number) => {
  const out: string[] = [];
  let cur = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (word.length > width) { if (cur) out.push(cur); for (let i = 0; i < word.length; i += width) out.push(word.slice(i, i + width)); cur = ""; continue; }
    if ((cur ? cur.length + 1 : 0) + word.length > width) { out.push(cur); cur = word; } else cur = cur ? `${cur} ${word}` : word;
  }
  if (cur) out.push(cur);
  return out;
};
const justify = (l: string, r: string, w: number) => {
  const left = l.length + r.length + 1 > w ? l.slice(0, Math.max(w - r.length - 1, 1)) : l;
  return left + " ".repeat(Math.max(w - left.length - r.length, 1)) + r;
};
const money = (v: DecimalInput, pf: Record<string, boolean | string>) => {
  const d = pf["thermal.amountDecimal"] === true ? Number(pf["general.amountDecimals"] ?? 2) : 0;
  return pf["thermal.amountGrouping"] === true ? formatIndian(v, d) : dec(v).toFixed(d);
};

/**
 * The receipt as lines of plain text for a roll `chars` characters wide, laid out by the chosen theme (Theme 1 to Theme 5) and the options on the Thermal printer tab.
 * Only plain ASCII is printed (the rupee sign becomes "Rs."), as text mode on a receipt printer has no other letters.
 */
export function receiptLines(r: ReceiptData, pf: Record<string, boolean | string>, chars: number, labels: Partial<ReceiptLabels> = {}): Styled[] {
  const L = { ...ENGLISH, ...labels };
  const on = (k: string) => pf[`thermal.${k}`] === true;
  const txt = (k: string) => String(pf[`thermal.${k}`] ?? "").trim();
  const theme = String(pf["thermal.theme"]);
  const W = chars;
  const m = (v: DecimalInput) => money(v, pf);
  const out: Styled[] = [];
  const add = (text: string, o: Omit<Styled, "text"> = {}) => { for (const l of wrap(ascii(text), W)) out.push({ text: l, ...o }); };
  const raw = (text: string, o: Omit<Styled, "text"> = {}) => out.push({ text: ascii(text).slice(0, W), ...o });
  const rule = () => raw((theme === "theme4" ? "=" : "-").repeat(W));
  const addr = r.branch?.address;
  const address = txt("addressText") || (addr ? [addr.line1, addr.line2, addr.city, addr.pincode].filter(Boolean).join(", ") : "");
  const gstin = txt("gstinText") || r.branch?.gstin;

  if (r.status === "void") raw("*** VOID ***", { align: "center", bold: true });
  if (on("showCompany")) add(txt("companyNameText") || r.company.name, { align: "center", bold: true, big: true });
  if (on("showAddress") && address) add(address, { align: "center" });
  if (on("showPhone") && txt("phoneText")) add(`${L.phone}: ${txt("phoneText")}`, { align: "center" });
  if (on("showEmail") && txt("emailText")) add(txt("emailText"), { align: "center" });
  if (on("showGstin") && gstin) add(`GSTIN ${gstin}`, { align: "center" });
  add(r.title ?? (r.branch?.gstin ? L.taxInvoice : L.billOfSupply), { align: "center", bold: true });
  rule();
  const when = new Date(r.createdAt);
  const stamp = r.dateOnly ? when.toLocaleDateString("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" }) : when.toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Kolkata" });
  raw(justify(r.number, stamp, W));
  if (r.terminal) raw(r.terminal.name);
  if (on("showCustomer") && (r.customerName || r.customerPhone)) add([r.customerName, r.customerPhone ? `XXXXXX${r.customerPhone.slice(6)}` : null].filter(Boolean).join(" - "));
  rule();

  const sub = (l: ReceiptLineData) => [
    on("showHsn") && l.hsn ? `HSN ${l.hsn}` : null, on("showMrp") && l.mrp ? `MRP ${m(l.mrp)}` : null,
    on("showSize") && l.size ? `${L.size} ${l.size}` : null, on("showSize") && l.colour ? `${L.colour} ${l.colour}` : null,
    on("showBatch") && l.batchNo ? `${L.batch} ${l.batchNo}` : null, on("showExpiry") && l.expiry ? `${L.exp} ${l.expiry}` : null, on("showModel") && l.model ? `${L.model} ${l.model}` : null,
    on("showSerial") && l.serials?.length ? `${L.serial} ${l.serials.join(",")}` : null,
  ].filter(Boolean).join(", ");
  const qtyText = (l: ReceiptLineData) => `${Number(l.qty)}${on("showUom") && l.uom ? ` ${l.uom}` : ""}`;
  const pct = (l: ReceiptLineData) => { const g = dec(l.price).times(l.qty); return g.gt(0) && dec(l.discount ?? 0).gt(0) ? dec(l.discount ?? 0).div(g).times(100).toDecimalPlaces(2).toString() : "0"; };

  if (theme === "theme5" || theme === "theme3" || theme === "theme4") raw(justify(`${on("showSno") ? "# " : ""}${L.item}${on("showHsn") ? "(HSN)" : ""}`, "", W), { bold: true });
  else raw(justify(`${on("showSno") ? "# " : ""}${L.item}`, `${L.qty} x ${L.rate}  ${L.amount}`, W), { bold: true });
  r.lines.forEach((l, i) => {
    const no = on("showSno") ? `${i + 1} ` : "";
    if (theme === "theme1" || theme === "theme2") {
      add(`${no}${l.name}`);
      raw(justify(`  ${qtyText(l)} x ${m(l.price)}`, m(l.total), W));
    } else {
      add(`${no}${l.name}${on("showHsn") && l.hsn ? `(${l.hsn})` : ""}`);
      raw(justify(`  ${qtyText(l)}${on("showMrp") && l.mrp ? ` MRP ${m(l.mrp)}` : ""} @ ${m(l.price)}`, theme === "theme5" ? m(dec(l.price).times(l.qty)) : m(l.total), W));
    }
    const s = sub(l);
    if (s) add(`  ${s}`);
    if (theme === "theme1" && dec(l.discount ?? 0).gt(0)) raw(justify(`  ${L.discount}`, `-${m(l.discount!)}`, W));
    if (theme === "theme4" && dec(l.discount ?? 0).gt(0)) { raw(justify(`  ${L.discount}(${pct(l)}%)`, `-${m(l.discount!)}`, W)); raw(justify(`  ${L.final}`, m(l.total), W)); }
    if (theme === "theme5") raw(justify(`  ${m(l.discount ?? "0")}(${pct(l)}%) ${m(dec(l.total).minus(l.taxable ?? 0))}(${Number(l.gstRate ?? 0)}%)`, m(l.total), W));
  });
  rule();
  const totalQty = r.lines.reduce((s, l) => s.plus(l.qty), dec(0));
  if (on("showTotalQty")) raw(justify(`${L.totalQty}: ${totalQty.toNumber()}`, `${L.items}: ${r.lines.length}`, W));
  if (theme === "theme2") raw(justify(L.subTotal, m(dec(r.taxable).plus(r.cgst).plus(r.sgst).plus(r.igst ?? 0).plus(r.cess)), W));
  if (dec(r.discount).gt(0)) raw(justify(L.discount, `-${m(r.discount)}`, W));
  if (!dec(r.roundOff).isZero()) raw(justify(L.roundOff, r.roundOff, W));
  raw(justify(L.total, `Rs. ${m(r.total)}`, W), { bold: true, big: true });
  const received = r.received ?? r.payments.reduce((s, p) => s.plus(p.amount), dec(0)).toFixed(2);
  if (on("showReceived")) {
    if (r.received !== undefined) raw(justify(L.received, m(received), W));
    else for (const p of r.payments) raw(justify(`${p.mode}${p.reference ? ` ${p.reference}` : ""}`, m(p.amount), W));
    if (dec(r.change).gt(0)) raw(justify(L.change, m(r.change), W));
  }
  if (on("showBalance")) raw(justify(L.balance, m(r.balance ?? Math.max(Number(r.total) - Number(received), 0)), W));
  if (on("showYouSaved") && dec(r.discount).gt(0)) raw(justify(L.youSaved, m(r.discount), W));
  if (r.partyBalance !== undefined && pf["print.showCurrentBalance"] === true) raw(justify(L.currentBalance, m(r.partyBalance), W));
  if (r.branch?.gstin && r.taxByRate.length && on("showTaxTable")) {
    rule();
    const inter = r.taxByRate.some((x) => dec(x.igst ?? 0).gt(0));
    raw(justify("GST%  " + L.taxable, inter ? "IGST" : "CGST   SGST", W));
    for (const x of r.taxByRate) raw(justify(`${Number(x.rate)}  ${m(x.taxable)}`, inter ? m(x.igst ?? 0) : `${m(x.cgst)} ${m(x.sgst)}`, W));
  }
  if (on("showWords")) add(pf["thermal.wordsStyle"] === "international" ? amountInWordsIntl(r.total) : amountInWords(r.total, "en"));
  if (r.upiUrl) { rule(); out.push({ text: "", qr: r.upiUrl, align: "center" }); }
  rule();
  if (on("showDescription") && (r.description || r.footer)) add(r.description ?? r.footer ?? "", { align: "center" });
  add(L.thanks, { align: "center" });
  return out;
}

const ESC = 0x1b, GS = 0x1d;
export interface EscposOptions { cut?: boolean; drawer?: boolean; copies?: number; extraLines?: number; boldAll?: boolean }

/** ESC/POS bytes for the lines: initialise, set each line (alignment, bold, double height), a QR code where asked, blank lines, then the cutter and the cash drawer if chosen. */
export function escposBytes(lines: Styled[], o: EscposOptions = {}): Uint8Array {
  const b: number[] = [];
  const text = (s: string) => { for (const ch of s) b.push(ch.charCodeAt(0) & 0x7f); b.push(0x0a); };
  if (o.drawer) b.push(ESC, 0x70, 0x00, 0x32, 0xfa);
  for (let copy = 0; copy < Math.max(o.copies ?? 1, 1); copy++) {
    b.push(ESC, 0x40);
    for (const l of lines) {
      if (l.qr) {
        const data = [...l.qr].map((c) => c.charCodeAt(0) & 0x7f);
        const len = data.length + 3;
        b.push(ESC, 0x61, 0x01, GS, 0x28, 0x6b, 0x04, 0x00, 0x31, 0x41, 0x32, 0x00, GS, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, 0x05, GS, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x45, 0x31,
          GS, 0x28, 0x6b, len & 0xff, len >> 8, 0x31, 0x50, 0x30, ...data, GS, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x51, 0x30, 0x0a);
        continue;
      }
      b.push(ESC, 0x61, l.align === "center" ? 1 : l.align === "right" ? 2 : 0, ESC, 0x45, l.bold || o.boldAll ? 1 : 0, GS, 0x21, l.big ? 0x01 : 0x00);
      text(l.text);
    }
    b.push(ESC, 0x61, 0, ESC, 0x45, 0, GS, 0x21, 0);
    for (let i = 0; i < (o.extraLines ?? 0); i++) b.push(0x0a);
    if (o.cut) b.push(0x0a, 0x0a, 0x0a, GS, 0x56, 0x41, 0x03);
  }
  return Uint8Array.from(b);
}
