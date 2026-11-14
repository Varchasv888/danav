"use client";

import { AlertCircle, CheckCircle2, Clock, X } from "lucide-react";
import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "./ui";

export interface ToastInput {
  tone?: "success" | "warning" | "danger";
  title: string;
  detail?: string;
  /** One follow-up: a link (Print invoice) or a button (Undo). */
  action?: { label: string; href?: string; onClick?: () => void };
  /** How long it stays, in milliseconds (default 4000; an error stays longer). */
  ms?: number;
}
interface Item extends ToastInput { id: number }

const Ctx = createContext<{ toast: (t: ToastInput) => void } | null>(null);

/** Shows a message on screen from anywhere: `const { toast } = useToast(); toast({ title: "Invoice INV-26-27-00012 saved", action: { label: "Print invoice", href } })`. */
export function useToast() {
  const c = useContext(Ctx);
  if (!c) return { toast: () => undefined };
  return c;
}

let next = 1;

/** Feedback toasts, bottom left: a status icon, what happened, one action, and a thin bar that counts down the 4 seconds (it waits while the pointer is over it). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const toast = useCallback((t: ToastInput) => setItems((l) => [...l.slice(-3), { ...t, id: next++ }]), []);
  const value = useMemo(() => ({ toast }), [toast]);
  return (
    <Ctx.Provider value={value}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-6 left-6 z-[70] lg:left-24 flex w-[min(24rem,calc(100vw-3rem))] flex-col gap-2 max-lg:bottom-[calc(4.5rem+env(safe-area-inset-bottom))] print:hidden">
        {items.map((t) => <ToastCard key={t.id} item={t} onDone={() => setItems((l) => l.filter((x) => x.id !== t.id))} />)}
      </div>
    </Ctx.Provider>
  );
}

function ToastCard({ item, onDone }: { item: Item; onDone: () => void }) {
  const ms = item.ms ?? (item.tone === "danger" ? 7000 : 4000);
  const left = useRef(ms);
  const started = useRef(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    started.current = Date.now();
    const h = setTimeout(onDone, left.current);
    return () => { clearTimeout(h); left.current -= Date.now() - started.current; };
  }, [paused, onDone]);
  const tone = item.tone ?? "success";
  const Icon = tone === "success" ? CheckCircle2 : tone === "warning" ? Clock : AlertCircle;
  return (
    <div role={tone === "danger" ? "alert" : "status"} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      className="pointer-events-auto relative animate-toast-in overflow-hidden rounded-xl border border-border bg-surface shadow-flyout motion-reduce:animate-none">
      <div className="flex items-start gap-3 px-4 py-3">
        <Icon className={cn("mt-0.5 size-5 shrink-0", tone === "success" && "text-success", tone === "warning" && "text-accent", tone === "danger" && "text-danger")} aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-5 font-semibold">{item.title}</p>
          {item.detail ? <p className="mt-0.5 text-[13px] leading-[18px] text-muted">{item.detail}</p> : null}
          {item.action ? (
            item.action.href
              ? <Link href={item.action.href} target="_blank" className="mt-1.5 inline-block text-sm font-medium text-primary hover:underline">{item.action.label}</Link>
              : <button type="button" onClick={() => { item.action?.onClick?.(); onDone(); }} className="mt-1.5 text-sm font-medium text-primary hover:underline">{item.action.label}</button>
          ) : null}
        </div>
        <button type="button" onClick={onDone} aria-label="Dismiss" className="grid size-7 shrink-0 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-text"><X className="size-4" aria-hidden /></button>
      </div>
      <span aria-hidden className={cn("absolute inset-x-0 bottom-0 h-[3px] origin-left animate-[toast-bar_linear_forwards] motion-reduce:hidden", tone === "success" && "bg-success", tone === "warning" && "bg-accent", tone === "danger" && "bg-danger")}
        style={{ animationDuration: `${ms}ms`, animationPlayState: paused ? "paused" : "running" }} />
    </div>
  );
}
