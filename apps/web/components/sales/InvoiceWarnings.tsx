"use client";

import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatIndian } from "@varchasv/domain";

/** Non-blocking warnings returned when the invoice was saved (credit limit, e-way bill, HSN, stock). */
export function InvoiceWarnings({ warnings }: { warnings: { code: string; lineNo?: number; detail?: string }[] }) {
  const t = useTranslations("sales.invoices.warnings");
  const shown = warnings.filter((w) => t.has(w.code));
  if (!shown.length) return null;
  return (
    <ul className="mt-4 flex flex-col gap-2">
      {[...new Map(shown.map((w) => [`${w.code}${w.lineNo ?? ""}`, w])).values()].map((w) => (
        <li key={`${w.code}${w.lineNo ?? ""}`} role="status" className="flex items-start gap-2 rounded-lg bg-accent-soft px-3 py-2 text-sm">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
          {t(w.code, { lineNo: w.lineNo ?? "", days: w.detail ?? "", detail: w.detail && /^-?\d/.test(w.detail) ? `₹ ${formatIndian(w.detail)}` : (w.detail ?? "") })}
        </li>
      ))}
    </ul>
  );
}
