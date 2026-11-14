import { dec, formatIndian, devanagari } from "@varchasv/domain";

/** Hindi name when the UI is in a Devanagari language (Hindi, Marathi) and one exists, else the English name. */
export const localName = (o: { name: string; nameHi?: string | null }, locale: string) => (devanagari(locale) && o.nameHi ? o.nameHi : o.name);

export const rupees = (v: string | number) => {
  const d = dec(v);
  // A no-break space keeps the rupee sign with its figure wherever the amount lands.
  return d.isNegative() ? `−₹ ${formatIndian(d.abs())}` : `₹ ${formatIndian(d)}`;
};

/** An amount in rupees or in lakhs (one lakh is 1,00,000), for the reports that offer the choice. */
export const rupeesIn = (v: string | number, unit: "rupees" | "lakh") => {
  if (unit !== "lakh") return rupees(v);
  const d = dec(v).div(100000);
  return `${d.isNegative() ? "−" : ""}₹ ${formatIndian(d.abs())} L`;
};

/** A signed balance as "12,300.00 Dr" / "4,000.00 Cr" (positive = debit). */
export function drCr(v: string, labels: { dr: string; cr: string }) {
  const d = dec(v);
  if (d.isZero()) return "0.00";
  return `${formatIndian(d.abs())} ${d.isNegative() ? labels.cr : labels.dr}`;
}

export const todayIso = () => {
  const now = new Date(Date.now() + 330 * 60_000); // India time, no DST
  return now.toISOString().slice(0, 10);
};

/** 1 April of the financial year containing the date. */
export const fyStart = (iso: string) => (iso.slice(5) >= "04-01" ? `${iso.slice(0, 4)}-04-01` : `${Number(iso.slice(0, 4)) - 1}-04-01`);

/** Rupees the Indian way for tiles and axes: 12,400 / 4.2 L / 1.3 Cr. */
export function compactRupees(v: string | number) {
  const n = Number(v);
  const a = Math.abs(n);
  const sign = n < 0 ? "−" : "";
  if (a >= 1e7) return `${sign}₹${(a / 1e7).toFixed(a >= 1e8 ? 0 : 1)} Cr`;
  if (a >= 1e5) return `${sign}₹${(a / 1e5).toFixed(a >= 1e6 ? 0 : 1)} L`;
  return `${sign}₹${Math.round(a).toLocaleString("en-IN")}`;
}
