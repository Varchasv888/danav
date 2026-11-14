"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { LOCALES, baseLocale } from "@varchasv/i18n/locales";

/** Every language the product speaks, each written in its own script; choosing one switches to it. */
export function LanguageList({ label }: { label: string }) {
  const locale = baseLocale(useLocale());
  const router = useRouter();
  const choose = (code: string) => {
    document.cookie = `vlocale=${code}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  };
  return (
    <ul aria-label={label} className="grid grid-cols-2 gap-x-8 xl:grid-cols-3">
      {LOCALES.filter((l) => l.ready).map((l) => (
        <li key={l.code} className="border-b border-border">
          <button
            type="button"
            lang={l.code}
            aria-pressed={l.code === locale}
            onClick={() => choose(l.code)}
            className={clsx("w-full py-2 text-left text-[1.0625rem] transition-colors", l.code === locale ? "font-semibold text-text" : "text-muted hover:text-text")}
          >
            {l.native}
          </button>
        </li>
      ))}
    </ul>
  );
}
