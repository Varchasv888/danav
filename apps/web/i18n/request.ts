import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, READY_LOCALES, baseLocale, withLatinDigits } from "@varchasv/i18n/locales";

export const LOCALE_COOKIE = "vlocale";

// Keep the catalog imports explicit so production bundlers can resolve each JSON export.
const messageLoaders: Record<string, () => Promise<{ default: Record<string, unknown> }>> = {
  as: () => import("@varchasv/i18n/messages/as.json"),
  bn: () => import("@varchasv/i18n/messages/bn.json"),
  en: () => import("@varchasv/i18n/messages/en.json"),
  gu: () => import("@varchasv/i18n/messages/gu.json"),
  hi: () => import("@varchasv/i18n/messages/hi.json"),
  kn: () => import("@varchasv/i18n/messages/kn.json"),
  ml: () => import("@varchasv/i18n/messages/ml.json"),
  mr: () => import("@varchasv/i18n/messages/mr.json"),
  or: () => import("@varchasv/i18n/messages/or.json"),
  pa: () => import("@varchasv/i18n/messages/pa.json"),
  ta: () => import("@varchasv/i18n/messages/ta.json"),
  te: () => import("@varchasv/i18n/messages/te.json"),
};

// The app keeps URLs language-free; the chosen language lives in a cookie (and on the user profile).
// A caller can still ask for a given language: bilingual invoice prints call
// getTranslations({ locale: second }) whatever the reader's own language is.
export default getRequestConfig(async ({ locale }) => {
  const requested = locale && baseLocale(locale);
  const fromCookie = (await cookies()).get(LOCALE_COOKIE)?.value;
  const code = requested && READY_LOCALES.includes(requested) ? requested
    : fromCookie && READY_LOCALES.includes(fromCookie) ? fromCookie : DEFAULT_LOCALE;
  return {
    locale: withLatinDigits(code),
    messages: (await messageLoaders[code]()).default,
    timeZone: "Asia/Kolkata",
  };
});
