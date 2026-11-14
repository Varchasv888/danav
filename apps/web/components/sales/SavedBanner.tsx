"use client";

import { CheckCircle2, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface SavedAction { href: string; label: string; primary?: boolean; newTab?: boolean }

/**
 * Shown once, right after a sales document is saved (the form adds ?saved=1): what was saved, what it did to stock and
 * accounts, and the few things people do next. The server decides the words; this only decides whether to show them.
 */
export function SavedBanner({ title, effect, nextLabel, actions, dismissLabel }: { title: string; effect: string; nextLabel: string; actions: SavedAction[]; dismissLabel: string }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  if (!params.has("saved")) return null;
  const close = () => { const next = new URLSearchParams(params.toString()); next.delete("saved"); const q = next.toString(); router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false }); };
  return (
    <section role="status" className="mb-4 rounded-lg border border-success/40 bg-success-soft px-4 py-3">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{title}</p>
          <p className="mt-0.5 text-[0.9286rem] text-muted">{effect}</p>
          {actions.length ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-[0.8571rem] font-medium text-muted">{nextLabel}</span>
              {actions.map((a) => (
                <Link key={a.href + a.label} href={a.href} target={a.newTab ? "_blank" : undefined}
                  className={a.primary
                    ? "inline-flex h-9 items-center rounded-lg bg-primary px-3 text-sm font-medium text-on-primary hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    : "inline-flex h-9 items-center rounded-lg border border-border bg-surface px-3 text-sm font-medium hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-primary"}>{a.label}</Link>
              ))}
            </div>
          ) : null}
        </div>
        <button type="button" onClick={close} aria-label={dismissLabel} className="grid size-8 shrink-0 place-items-center rounded-md text-muted hover:bg-surface hover:text-text focus-visible:outline-2 focus-visible:outline-primary">
          <X className="size-4" aria-hidden />
        </button>
      </div>
    </section>
  );
}
