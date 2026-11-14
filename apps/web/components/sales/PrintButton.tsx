"use client";

import { Printer } from "lucide-react";
import { useTranslations } from "next-intl";

/** Prints the page as it stands (menus, filters and this button hide on paper). */
export function PrintButton() {
  const t = useTranslations("common");
  return (
    <button type="button" onClick={() => window.print()} className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-surface px-3 text-[0.9286rem] font-semibold text-text hover:bg-surface-3 print:hidden">
      <Printer className="size-4" aria-hidden />{t("print")}
    </button>
  );
}
