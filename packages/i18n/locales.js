// Languages the product ships in. Order is the order shown in the language menu.
// `ready: false` languages are listed on the roadmap but not selectable yet.
// `script` picks the print font; Devanagari languages also show the Hindi names of items and parties.
export const LOCALES = [
  { code: "en", name: "English", native: "English", script: "latin", ready: true },
  { code: "hi", name: "Hindi", native: "हिन्दी", script: "devanagari", ready: true },
  { code: "mr", name: "Marathi", native: "मराठी", script: "devanagari", ready: true },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી", script: "gujarati", ready: true },
  { code: "bn", name: "Bengali", native: "বাংলা", script: "bengali", ready: true },
  { code: "ta", name: "Tamil", native: "தமிழ்", script: "tamil", ready: true },
  { code: "te", name: "Telugu", native: "తెలుగు", script: "telugu", ready: true },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", script: "kannada", ready: true },
  { code: "ml", name: "Malayalam", native: "മലയാളം", script: "malayalam", ready: true },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ", script: "gurmukhi", ready: true },
  { code: "as", name: "Assamese", native: "অসমীয়া", script: "bengali", ready: true },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ", script: "oriya", ready: true },
];
export const READY_LOCALES = LOCALES.filter((l) => l.ready).map((l) => l.code);
export const DEFAULT_LOCALE = "en";

// The web app runs each language with Latin digits ("mr-u-nu-latn"): Marathi, Bengali and Assamese
// default to native digits, which would mix "१२" in dates and counts with "₹ 12.00" in amounts.
export const withLatinDigits = (code) => `${code}-u-nu-latn`;
/** "mr-u-nu-latn" → "mr". */
export const baseLocale = (locale) => locale.split("-")[0];
/** Intl locale for dates in Indian style: "mr" → "mr-IN-u-nu-latn". */
export const intlLocale = (locale) => `${baseLocale(locale)}-IN-u-nu-latn`;
