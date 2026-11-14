"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

/**
 * Empty, loading and error states for a block of data. They keep the block's frame so the page does not jump:
 * an empty block says what it holds and what to do next, a loading block is the final layout in flat grey at real
 * size (no spinner, no shimmer), and a failed block says what failed inside the block, with a way to try again.
 */
export function EmptyState({ title, hint, action }: { title: ReactNode; hint?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-1 px-5 py-8">
      <p className="text-[0.9286rem] font-medium text-text">{title}</p>
      {hint ? <p className="max-w-[60ch] text-[0.8571rem] text-muted">{hint}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export function BlockError({ message, onRetry }: { message?: ReactNode; onRetry?: () => void }) {
  const t = useTranslations("table");
  return (
    <div role="alert" className="flex flex-col items-start gap-1 rounded-md border border-border bg-surface px-5 py-6">
      <p className="text-[0.9286rem] font-medium text-text">{message ?? t("loadFailed")}</p>
      <p className="text-[0.8571rem] text-muted">{t("loadFailedHint")}</p>
      {onRetry ? <button type="button" onClick={onRetry} className="mt-2 h-8 rounded-md border border-border-input px-3 text-[0.8571rem] font-medium text-primary hover:bg-primary-soft">{t("retry")}</button> : null}
    </div>
  );
}

/** The register's final layout with every value as a flat grey bar of its real size. */
export function TableSkeleton({ columns = 5, rows = 8 }: { columns?: number; rows?: number }) {
  const t = useTranslations("table");
  return (
    <div role="status" aria-busy="true" aria-label={t("loading")} className="rounded-lg border border-border bg-surface">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <div className="h-8 w-64 max-w-full rounded-md bg-surface-2" />
        <div className="ml-auto h-8 w-24 rounded-md bg-surface-2" />
      </div>
      <div className="flex gap-6 border-b border-border-strong px-4 py-3">
        {Array.from({ length: columns }, (_, i) => <div key={i} className="h-3 flex-1 rounded-sm bg-surface-2" />)}
      </div>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="flex gap-6 border-b border-rule px-4 py-3 last:border-0">
          {Array.from({ length: columns }, (_, i) => <div key={i} className="h-4 flex-1 rounded-sm bg-surface-2" />)}
        </div>
      ))}
    </div>
  );
}
