export interface LocaleInfo {
  code: string;
  name: string;
  native: string;
  script: "latin" | "devanagari" | "gujarati" | "bengali" | "tamil" | "telugu" | "kannada" | "malayalam" | "gurmukhi" | "oriya";
  ready: boolean;
}
export declare const LOCALES: LocaleInfo[];
export declare const READY_LOCALES: string[];
export declare const DEFAULT_LOCALE: string;
export declare const withLatinDigits: (code: string) => string;
export declare const baseLocale: (locale: string) => string;
export declare const intlLocale: (locale: string) => string;
