import { dec, round2, type DecimalInput } from "./money.js";

/** Amount in words using the Indian system (thousand, lakh, crore), as printed on invoices. */

const EN_ONES = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
];
const EN_TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

// Hindi numbers 0–99 are irregular, so they are listed in full.
const HI_0_99 = (
  "शून्य एक दो तीन चार पाँच छह सात आठ नौ " +
  "दस ग्यारह बारह तेरह चौदह पंद्रह सोलह सत्रह अठारह उन्नीस " +
  "बीस इक्कीस बाईस तेईस चौबीस पच्चीस छब्बीस सत्ताईस अट्ठाईस उनतीस " +
  "तीस इकतीस बत्तीस तैंतीस चौंतीस पैंतीस छत्तीस सैंतीस अड़तीस उनतालीस " +
  "चालीस इकतालीस बयालीस तैंतालीस चवालीस पैंतालीस छियालीस सैंतालीस अड़तालीस उनचास " +
  "पचास इक्यावन बावन तिरपन चौवन पचपन छप्पन सत्तावन अट्ठावन उनसठ " +
  "साठ इकसठ बासठ तिरसठ चौंसठ पैंसठ छियासठ सड़सठ अड़सठ उनहत्तर " +
  "सत्तर इकहत्तर बहत्तर तिहत्तर चौहत्तर पचहत्तर छिहत्तर सतहत्तर अठहत्तर उनासी " +
  "अस्सी इक्यासी बयासी तिरासी चौरासी पचासी छियासी सत्तासी अट्ठासी नवासी " +
  "नब्बे इक्यानबे बानबे तिरानबे चौरानबे पचानबे छियानबे सत्तानबे अट्ठानबे निन्यानबे"
).split(" ");
if (HI_0_99.length !== 100) throw new Error("Hindi number table must have 100 entries");

// Marathi likewise. Hundreds join the number ("दोनशे"), and exactly one hundred is "शंभर".
const MR_0_99 = (
  "शून्य एक दोन तीन चार पाच सहा सात आठ नऊ " +
  "दहा अकरा बारा तेरा चौदा पंधरा सोळा सतरा अठरा एकोणीस " +
  "वीस एकवीस बावीस तेवीस चोवीस पंचवीस सव्वीस सत्तावीस अठ्ठावीस एकोणतीस " +
  "तीस एकतीस बत्तीस तेहतीस चौतीस पस्तीस छत्तीस सदतीस अडतीस एकोणचाळीस " +
  "चाळीस एक्केचाळीस बेचाळीस त्रेचाळीस चव्वेचाळीस पंचेचाळीस सेहेचाळीस सत्तेचाळीस अठ्ठेचाळीस एकोणपन्नास " +
  "पन्नास एक्कावन्न बावन्न त्रेपन्न चोपन्न पंचावन्न छप्पन्न सत्तावन्न अठ्ठावन्न एकोणसाठ " +
  "साठ एकसष्ट बासष्ट त्रेसष्ट चौसष्ट पासष्ट सहासष्ट सदुसष्ट अडुसष्ट एकोणसत्तर " +
  "सत्तर एक्काहत्तर बाहत्तर त्र्याहत्तर चौऱ्याहत्तर पंच्याहत्तर शहात्तर सत्त्याहत्तर अठ्ठ्याहत्तर एकोणऐंशी " +
  "ऐंशी एक्क्याऐंशी ब्याऐंशी त्र्याऐंशी चौऱ्याऐंशी पंच्याऐंशी शहाऐंशी सत्त्याऐंशी अठ्ठ्याऐंशी एकोणनव्वद " +
  "नव्वद एक्क्याण्णव ब्याण्णव त्र्याण्णव चौऱ्याण्णव पंच्याण्णव शहाण्णव सत्त्याण्णव अठ्ठ्याण्णव नव्व्याण्णव"
).split(" ");
if (MR_0_99.length !== 100) throw new Error("Marathi number table must have 100 entries");

export type WordsLang = "en" | "hi" | "mr";

/** The words language for a UI or print locale; languages without a number table use English. */
export const wordsLang = (locale: string): WordsLang => {
  const base = locale.split("-")[0];
  return base === "hi" || base === "mr" ? base : "en";
};

/** Devanagari-script languages, whose readers are shown the Hindi names of items, parties and states. */
export const devanagari = (locale: string) => wordsLang(locale) !== "en";

interface Lang {
  under100(n: number): string;
  /** "Two Hundred"; `alone` when nothing follows in the hundreds group. */
  hundreds(n: number, alone: boolean): string;
  thousand: string;
  lakh: string;
  crore: string;
  zero: string;
  amount(rupees: string, paise: string | null): string;
}

const LANGS: Record<WordsLang, Lang> = {
  en: {
    under100: (n) => (n < 20 ? EN_ONES[n]! : EN_TENS[Math.floor(n / 10)]! + (n % 10 ? `-${EN_ONES[n % 10]}` : "")),
    hundreds: (n) => `${EN_ONES[n]} Hundred`,
    thousand: "Thousand",
    lakh: "Lakh",
    crore: "Crore",
    zero: "Zero",
    amount: (r, p) => (p ? `Rupees ${r} and ${p} Paise Only` : `Rupees ${r} Only`),
  },
  hi: {
    under100: (n) => HI_0_99[n]!,
    hundreds: (n) => `${HI_0_99[n]} सौ`,
    thousand: "हज़ार",
    lakh: "लाख",
    crore: "करोड़",
    zero: "शून्य",
    amount: (r, p) => (p ? `${r} रुपये और ${p} पैसे मात्र` : `${r} रुपये मात्र`),
  },
  mr: {
    under100: (n) => MR_0_99[n]!,
    hundreds: (n, alone) => (n === 1 && alone ? "शंभर" : `${MR_0_99[n]}शे`),
    thousand: "हजार",
    lakh: "लाख",
    crore: "कोटी",
    zero: "शून्य",
    amount: (r, p) => (p ? `${r} रुपये आणि ${p} पैसे फक्त` : `${r} रुपये फक्त`),
  },
};

/** Whole number to words in the Indian system. Amounts of 100 crore and above recurse on the crore part. */
export function integerToWords(n: bigint, lang: WordsLang = "en"): string {
  const L = LANGS[lang];
  if (n < 0n) throw new Error("negative amounts are not spelled out");
  if (n === 0n) return L.zero;
  const parts: string[] = [];
  const crore = n / 10_000_000n;
  let rest = n % 10_000_000n;
  if (crore > 0n) parts.push(`${integerToWords(crore, lang)} ${L.crore}`);
  const lakh = Number(rest / 100_000n);
  rest %= 100_000n;
  if (lakh) parts.push(`${L.under100(lakh)} ${L.lakh}`);
  const thousand = Number(rest / 1000n);
  rest %= 1000n;
  if (thousand) parts.push(`${L.under100(thousand)} ${L.thousand}`);
  const hundred = Number(rest / 100n);
  const below = Number(rest % 100n);
  if (hundred) parts.push(L.hundreds(hundred, below === 0));
  if (below) parts.push(L.under100(below));
  return parts.join(" ");
}

/**
 * "Rupees One Thousand Two Hundred Thirty-Four and Fifty Paise Only" /
 * "एक हज़ार दो सौ चौंतीस रुपये और पचास पैसे मात्र" / "एक हजार दोनशे चौतीस रुपये आणि पन्नास पैसे फक्त"
 */
export function amountInWords(amount: DecimalInput, lang: WordsLang = "en"): string {
  const a = round2(amount);
  if (a.isNegative()) throw new Error("negative amounts are not spelled out");
  const rupees = BigInt(a.floor().toFixed(0));
  const paise = Number(a.minus(a.floor()).times(100).toFixed(0));
  return LANGS[lang].amount(integerToWords(rupees, lang), paise ? integerToWords(BigInt(paise), lang) : null);
}

/** Indian digit grouping: 1234567.8 → "12,34,567.80". */
export function formatIndian(amount: DecimalInput, decimals = 2): string {
  const v = dec(amount).toDecimalPlaces(decimals);
  const negative = v.isNegative();
  const [intPart, frac] = v.abs().toFixed(decimals).split(".") as [string, string | undefined];
  const last3 = intPart.slice(-3);
  const head = intPart.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  const grouped = head ? `${head},${last3}` : last3;
  return `${negative ? "-" : ""}${grouped}${frac !== undefined ? `.${frac}` : ""}`;
}

/** Amount in words with the international system (thousand, million, billion), for a business whose readers expect it. English only. */
export function amountInWordsIntl(amount: DecimalInput): string {
  const a = round2(amount);
  if (a.isNegative()) throw new Error("negative amounts are not spelled out");
  const en = LANGS.en;
  let rupees = BigInt(a.floor().toFixed(0));
  const paise = Number(a.minus(a.floor()).times(100).toFixed(0));
  const group = (n: number) => {
    const parts: string[] = [];
    if (n >= 100) parts.push(`${EN_ONES[Math.floor(n / 100)]} Hundred`);
    if (n % 100) parts.push(en.under100(n % 100));
    return parts.join(" ");
  };
  const scales = ["", "Thousand", "Million", "Billion", "Trillion"];
  const words: string[] = [];
  for (let i = 0; rupees > 0n; i++) {
    const g = Number(rupees % 1000n);
    rupees /= 1000n;
    if (g) words.unshift(`${group(g)}${scales[i] ? ` ${scales[i]}` : ""}`);
  }
  return en.amount(words.length ? words.join(" ") : en.zero, paise ? en.under100(paise) : null);
}
