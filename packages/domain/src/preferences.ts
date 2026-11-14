/**
 * The preferences a business can set on the Settings screen, as one registry: the screen draws its controls from it, the server checks every value
 * against it, and the code that uses a preference reads it with its default. A preference appears here only when something in the product acts on it.
 */
export type PrefTab = "print" | "transaction" | "general" | "thermal";
export type PrefValue = boolean | string;
export interface PrefDef {
  key: string; tab: PrefTab; section: string;
  /** bool: a check box; enum: one of `options`; text: free text up to `max` characters; number: a whole number from `min` to `max`, kept as text. */
  type: "bool" | "enum" | "text" | "number";
  default: PrefValue;
  options?: readonly string[];
  min?: number;
  max?: number;
}

export const ACCENTS = ["none", "navy", "blue", "indigo", "teal", "green", "olive", "amber", "orange", "red", "maroon", "pink", "magenta", "purple", "brown", "slate", "sky", "lime", "gold", "coral", "rose", "violet", "cocoa", "steel", "mint"] as const;

/** The tax invoice layouts, in the order the strip shows them. Both landscape layouts are drawn on a wide page. */
export const PRINT_THEMES = ["tally", "landscape1", "landscape2", "gst1", "gst2"] as const;
export const LANDSCAPE_THEMES: readonly string[] = ["landscape1", "landscape2"];
/** The counter receipt layouts for the paper roll, in the order the strip shows them. */
export const THERMAL_THEMES = ["theme1", "theme2", "theme3", "theme4", "theme5"] as const;
export const PAPERS = ["A4", "A5", "A3", "Letter", "Legal"] as const;
export const THERMAL_SIZES = ["58", "68", "88", "custom"] as const;

const bool = (key: string, tab: PrefTab, section: string, def: boolean): PrefDef => ({ key, tab, section, type: "bool", default: def });
const text = (key: string, tab: PrefTab, section: string, max: number, def = ""): PrefDef => ({ key, tab, section, type: "text", default: def, max });

/** The options the two printers share: what shows in the header, the item table, the totals and the foot. `p` is the tab and the key prefix. */
function shared(p: "print" | "thermal"): PrefDef[] {
  const k = (n: string) => `${p}.${n}`;
  return [
    bool(k("showCompany"), p, "header", true), text(k("companyNameText"), p, "header", 80),
    bool(k("showAddress"), p, "header", true), text(k("addressText"), p, "header", 200),
    bool(k("showEmail"), p, "header", true), text(k("emailText"), p, "header", 80),
    bool(k("showPhone"), p, "header", true), text(k("phoneText"), p, "header", 30),
    bool(k("showGstin"), p, "header", true), text(k("gstinText"), p, "header", 20),
    bool(k("showSno"), p, "items", true), bool(k("showHsn"), p, "items", true), bool(k("showUom"), p, "items", true), bool(k("showMrp"), p, "items", p === "thermal"), bool(k("showSize"), p, "items", true),
    bool(k("showBatch"), p, "items", true), bool(k("showExpiry"), p, "items", true), bool(k("showModel"), p, "items", true), ...(p === "thermal" ? [bool(k("showSerial"), p, "items", true)] : []),
    bool(k("showTotalQty"), p, "totals", true), bool(k("amountDecimal"), p, "totals", true), bool(k("showReceived"), p, "totals", true), bool(k("showBalance"), p, "totals", true),
    ...(p === "print" ? [bool(k("showCurrentBalance"), p, "totals", false)] : []), bool(p === "print" ? "print.showTaxSummary" : "thermal.showTaxTable", p, "totals", true), bool(k("showYouSaved"), p, "totals", true), bool(k("amountGrouping"), p, "totals", true),
    bool(k("showWords"), p, "totals", true), { key: k("wordsStyle"), tab: p, section: "totals", type: "enum", default: "indian", options: ["indian", "international"] },
    bool(k("showDescription"), p, "footer", true), ...(p === "print" ? [bool(k("showTerms"), p, "footer", true)] : []),
  ];
}

export const PREFS: readonly PrefDef[] = [
  // How amounts are written on printed documents and in report lists.
  { key: "general.amountDecimals", tab: "general", section: "amounts", type: "enum", default: "2", options: ["0", "1", "2", "3", "4"] },
  // Rules for documents.
  bool("txn.blockNegativeStock", "transaction", "stock", false),
  bool("txn.roundOff", "transaction", "totals", true),
  bool("security.passcodeOnCancel", "transaction", "security", false),

  // The regular printer: the tax invoice, quotation and proforma.
  ...shared("print"),
  bool("print.showLogo", "print", "header", true), text("print.logo", "print", "header", 200_000),
  bool("print.showPan", "print", "header", true), bool("print.repeatHeader", "print", "header", true),
  bool("print.showBank", "print", "footer", true), bool("print.showSignatory", "print", "footer", true),
  // Which printer a tax invoice goes to first, the UPI id behind the pay-now QR code, and the names the documents carry.
  { key: "print.defaultPrinter", tab: "print", section: "paper", type: "enum", default: "regular", options: ["regular", "thermal"] },
  text("print.upiId", "print", "footer", 60), bool("print.showUpiQr", "print", "footer", true),
  text("names.invoice", "print", "names", 40), text("names.quotation", "print", "names", 40), text("names.proforma", "print", "names", 40), text("names.receipt", "print", "names", 40),
  { key: "print.theme", tab: "print", section: "paper", type: "enum", default: "tally", options: PRINT_THEMES },
  { key: "print.paper", tab: "print", section: "paper", type: "enum", default: "A4", options: PAPERS },
  { key: "print.orientation", tab: "print", section: "paper", type: "enum", default: "portrait", options: ["portrait", "landscape"] },
  { key: "print.companyNameSize", tab: "print", section: "paper", type: "enum", default: "large", options: ["large", "medium", "small"] },
  { key: "print.accent", tab: "print", section: "paper", type: "enum", default: "none", options: ACCENTS },

  // The thermal printer: the counter receipt on a paper roll.
  ...shared("thermal"),
  { key: "thermal.theme", tab: "thermal", section: "roll", type: "enum", default: "theme1", options: THERMAL_THEMES },
  { key: "thermal.size", tab: "thermal", section: "roll", type: "enum", default: "68", options: THERMAL_SIZES },
  { key: "thermal.chars", tab: "thermal", section: "roll", type: "number", default: "48", min: 24, max: 96 },
  bool("thermal.bold", "thermal", "roll", true),
  // Printing straight to the receipt printer through the print agent: ESC/POS text, with the cutter and the cash drawer.
  { key: "thermal.printType", tab: "thermal", section: "roll", type: "enum", default: "browser", options: ["browser", "direct"] },
  bool("thermal.autoCut", "thermal", "roll", false), bool("thermal.cashDrawer", "thermal", "roll", false),
  text("thermal.agentUrl", "thermal", "roll", 100, "http://127.0.0.1:9101"), text("thermal.printerTarget", "thermal", "roll", 100),
  { key: "thermal.extraLines", tab: "thermal", section: "roll", type: "number", default: "0", min: 0, max: 10 },
  { key: "thermal.copies", tab: "thermal", section: "roll", type: "number", default: "1", min: 1, max: 5 },
  bool("thermal.showCustomer", "thermal", "receipt", true),
];

const BY_KEY = new Map(PREFS.map((p) => [p.key, p]));

/** Values saved by the first version of these screens, read as the layout or roll they stand for now. */
const LEGACY: Record<string, Record<string, string>> = {
  "print.theme": { classic: "tally", clean: "gst1", gst: "gst2" },
  "thermal.theme": { classic: "theme1", compact: "theme2", detailed: "theme3", tabular: "theme4", bold: "theme5" },
  "thermal.paper": { "80": "68" },
};

/** Keeps only known keys with a valid value, so nothing odd is stored. */
export function cleanPreferences(input: unknown): Record<string, PrefValue> {
  const out: Record<string, PrefValue> = {};
  if (!input || typeof input !== "object") return out;
  for (const [key, raw] of Object.entries(input as Record<string, unknown>)) {
    const def = BY_KEY.get(key);
    if (!def) {
      if (key === "thermal.paper" && typeof raw === "string" && LEGACY[key]![raw]) out["thermal.size"] ??= LEGACY[key]![raw]!;
      else if (key === "thermal.paper" && raw === "58") out["thermal.size"] ??= "58";
      continue;
    }
    const value = typeof raw === "string" ? (LEGACY[key]?.[raw] ?? raw) : raw;
    if (def.type === "bool" && typeof value === "boolean") out[key] = value;
    else if (def.type === "enum" && typeof value === "string" && def.options!.includes(value)) out[key] = value;
    else if (def.type === "text" && typeof value === "string" && value.length <= (def.max ?? 200) && (key !== "print.logo" || value === "" || /^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(value))) out[key] = value.trim();
    else if (def.type === "number" && (typeof value === "string" || typeof value === "number")) {
      const n = Number(value);
      if (Number.isInteger(n) && n >= (def.min ?? 0) && n <= (def.max ?? 99)) out[key] = String(n);
    }
  }
  return out;
}

/** Every preference with its saved value, or its default where nothing is saved. */
export function resolvePreferences(saved: unknown): Record<string, PrefValue> {
  const clean = cleanPreferences(saved);
  return Object.fromEntries(PREFS.map((p) => [p.key, clean[p.key] ?? p.default]));
}

/** The colour an accent name stands for (the header band of a printed invoice); null for the plain black-and-white look. */
export const ACCENT_COLOURS: Record<string, string | null> = {
  none: null, navy: "#1f3a5f", blue: "#1d5fb4", indigo: "#3f3fa8", teal: "#0f766e", green: "#2f7d32", olive: "#6b7a1f", amber: "#a86a00", orange: "#c2570c",
  red: "#b91c1c", maroon: "#7a1f2b", pink: "#be3a7d", magenta: "#9d1f8f", purple: "#5b3f9a", brown: "#6b4423", slate: "#475569",
  sky: "#0b84c6", lime: "#5d9b1a", gold: "#b8860b", coral: "#d4533b", rose: "#c2415f", violet: "#7c4dff", cocoa: "#4e342e", steel: "#37474f", mint: "#1f9d7a",
};

/** The width a roll prints at, in millimetres (printable width), and the characters that fit a line. */
export function rollWidth(size: string, chars: string | number): { mm: number; chars: number } {
  if (size === "58") return { mm: 48, chars: 32 };
  if (size === "88") return { mm: 80, chars: 56 };
  if (size === "custom") { const c = Number(chars); return { mm: Math.round(c * 1.4), chars: c }; }
  return { mm: 68, chars: 48 };
}
