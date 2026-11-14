"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

const FOCUSABLE = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

/**
 * A panel that slides in from the right for adding or editing one record while the list stays visible behind it.
 * Esc or the shade closes it, Tab stays inside it, and focus goes back to whatever opened it. The caller keeps the form and
 * its own save and cancel buttons; `dirty` asks before an unsaved form is thrown away.
 */
export function Drawer({ title, subtitle, onClose, dirty = false, children }: { title: string; subtitle?: string | undefined; onClose: () => void; dirty?: boolean; children: React.ReactNode }) {
  const t = useTranslations();
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const askClose = () => { if (!dirty || window.confirm(t("drawer.discard"))) onClose(); };

  useEffect(() => {
    opener.current = document.activeElement as HTMLElement | null;
    const first = panel.current?.querySelector<HTMLElement>("input:not([type=hidden]), select, textarea");
    (first ?? panel.current)?.focus({ preventScroll: true });
    const lock = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = lock; opener.current?.focus?.({ preventScroll: true }); };
  }, []);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") { e.stopPropagation(); askClose(); return; }
    if (e.key !== "Tab") return;
    const nodes = [...(panel.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])];
    if (!nodes.length) return;
    const i = nodes.indexOf(document.activeElement as HTMLElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); nodes[nodes.length - 1]!.focus(); }
    else if (!e.shiftKey && i === nodes.length - 1) { e.preventDefault(); nodes[0]!.focus(); }
  }

  return (
    <>
      <button type="button" tabIndex={-1} aria-hidden onClick={askClose} className="fixed inset-0 z-40 cursor-default bg-[rgb(15_23_42/0.45)] backdrop-blur-[2px] motion-safe:animate-[fade-in_180ms_ease-out] print:hidden" />
      <div ref={panel} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} onKeyDown={onKeyDown}
        className="fixed top-0 right-0 bottom-0 z-50 flex w-[min(34rem,100vw)] flex-col rounded-l-xl border-l border-border bg-surface text-text shadow-flyout motion-safe:animate-slide-in-right print:hidden">
        <div className="flex items-start gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[1.0714rem] leading-tight font-semibold">{title}</h2>
            {subtitle ? <p className="mt-0.5 truncate text-[0.8571rem] text-muted">{subtitle}</p> : null}
          </div>
          <button type="button" onClick={askClose} aria-label={t("common.close")} className="grid size-9 shrink-0 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-text focus-visible:outline-2 focus-visible:outline-primary">
            <X className="size-4" aria-hidden />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </>
  );
}
