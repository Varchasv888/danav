"use client";

import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export interface ActionMenuItem { href: string; label: string; newTab?: boolean }

/** A quiet button that opens a short list of links: "Print", "More". Esc or a click elsewhere closes it and focus returns to the button. */
export function ActionMenu({ label, items, icon }: { label: string; items: ActionMenuItem[]; icon?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  if (!items.length) return null;
  return (
    <div ref={root} className="relative" onKeyDown={(e) => { if (e.key === "Escape" && open) { e.stopPropagation(); setOpen(false); button.current?.focus(); } }}>
      <button ref={button} type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-medium hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-primary">
        {icon}{label}<ChevronDown className={clsx("size-4 text-muted transition-transform", open ? "rotate-180" : "")} aria-hidden />
      </button>
      {open ? (
        <ul role="menu" className="absolute left-0 z-20 mt-1 min-w-52 rounded-lg border border-border bg-surface py-1 shadow-overlay">
          {items.map((item) => (
            <li key={item.href} role="none">
              <Link role="menuitem" href={item.href} target={item.newTab ? "_blank" : undefined} onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:outline-none">{item.label}</Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
