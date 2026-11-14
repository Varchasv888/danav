"use client";

import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { LOCALES, baseLocale } from "@varchasv/i18n/locales";

/** Saves the language in a cookie (read by i18n/request.ts) and, when signed in, on the user profile. */
export function LanguageSwitch({ signedIn = false, variant = "plain" }: { signedIn?: boolean; variant?: "plain" | "rail" }) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("common");

  async function change(code: string) {
    document.cookie = `vlocale=${code}; path=/; max-age=31536000; samesite=lax`;
    if (signedIn) {
      await fetch("/api/auth/me", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ locale: code }) }).catch(() => {});
    }
    router.refresh();
  }

  return (
    <label className={`relative inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm ${variant === "rail" ? "text-rail-muted hover:bg-rail-hover" : "text-muted hover:bg-surface-2"}`}>
      <Languages className="size-4" aria-hidden />
      <span className="sr-only">{t("language")}</span>
      <select value={baseLocale(locale)} onChange={(e) => change(e.target.value)} className={`cursor-pointer appearance-none bg-transparent pr-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${variant === "rail" ? "text-rail-text" : "text-text"}`}>
        {LOCALES.filter((l) => l.ready).map((l) => <option key={l.code} value={l.code} className="bg-surface text-text">{l.native}</option>)}
      </select>
    </label>
  );
}
