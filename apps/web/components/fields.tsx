"use client";

import { Calendar, ChevronDown, Loader2, Plus, X } from "lucide-react";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type InputHTMLAttributes, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { amountInWords } from "@varchasv/domain";
import { cleanAmount, finishAmount, formatDateText, groupTyping, monthGrid, numberOnBlur, numberOnFocus, parseDateText, toIso } from "@/lib/field-format";
import { cn, fieldClass } from "./ui";

/**
 * A popover that floats above the page, anchored to a box. It is drawn in the page body with fixed positioning, so a scrolling table or a clipped card can never cut it off;
 * it opens below the box, or above when there is not room, and follows the box as the page scrolls.
 */
function Floating({ anchor, children, width, className, role, label }: { anchor: RefObject<HTMLElement | null>; children: ReactNode; width?: number | "anchor"; className?: string; role?: string; label?: string }) {
  const [style, setStyle] = useState<CSSProperties>({ visibility: "hidden", position: "fixed" });
  useLayoutEffect(() => {
    const place = () => {
      const el = anchor.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const below = window.innerHeight - r.bottom, above = r.top;
      const up = below < 280 && above > below;
      const w = width === "anchor" || width === undefined ? Math.max(r.width, 256) : width;
      setStyle({ position: "fixed", left: Math.min(Math.max(r.left, 8), window.innerWidth - w - 8), width: w, zIndex: 60, ...(up ? { bottom: window.innerHeight - r.top + 6, maxHeight: Math.max(above - 16, 160) } : { top: r.bottom + 6, maxHeight: Math.max(below - 16, 160) }) });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => { window.removeEventListener("resize", place); window.removeEventListener("scroll", place, true); };
  }, [anchor, width]);
  return createPortal(<div data-floating role={role} aria-label={label} style={style} className={className}>{children}</div>, document.body);
}

/** True when a click landed inside a box or inside any floating popover (so choosing a row does not count as clicking away). */
const inside = (box: HTMLElement | null, target: EventTarget | null) => !!box?.contains(target as Node) || !!(target as Element | null)?.closest?.("[data-floating]");

type Base = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "defaultValue" | "type">;

/**
 * A money box. A rupee sign sits inside the left edge, the figures are right aligned and grouped the Indian way as they are typed (12,34,567.50), a pasted "₹ 12,500.00"
 * is understood, the whole number is selected on entry so typing replaces it, and the decimals are filled in when the person leaves the box. `value` is the plain
 * number ("1234567.50"); `words` writes the amount in words under the box.
 */
export function MoneyField({ value, onValueChange, decimals = 2, allowNegative = false, currency = true, words = false, className, ...rest }: Base & {
  value: string; onValueChange: (value: string) => void; decimals?: number; allowNegative?: boolean; currency?: boolean; words?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const focused = useRef(false);
  const caret = useRef<number | null>(null);
  const [text, setText] = useState(() => groupTyping(value));
  useEffect(() => { if (!focused.current) setText(groupTyping(value)); }, [value]);
  // Keep the caret next to the same digit after the grouping commas change.
  useLayoutEffect(() => {
    if (caret.current === null || !ref.current) return;
    let seen = 0, pos = 0;
    while (pos < text.length && seen < caret.current) { if (/[0-9.]/.test(text[pos]!)) seen++; pos++; }
    ref.current.setSelectionRange(pos, pos);
    caret.current = null;
  }, [text]);
  const spoken = useMemo(() => {
    if (!words || !value || Number(value) <= 0) return null;
    try { return amountInWords(value); } catch { return null; }
  }, [words, value]);
  return (
    <div>
      <div className="relative">
        {currency ? <span aria-hidden className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-muted">₹</span> : null}
        <input
          ref={ref} inputMode="decimal" autoComplete="off" value={text}
          data-numeric="managed" data-decimals={decimals}
          onFocus={(e) => {
            focused.current = true;
            const f = numberOnFocus(text);
            if (f.select) e.currentTarget.select();
            else if (text !== "") { setText(""); onValueChange(""); }
          }}
          onChange={(e) => {
            const raw = e.target.value;
            const before = raw.slice(0, e.target.selectionStart ?? raw.length);
            caret.current = (before.match(/[0-9.]/g) ?? []).length;
            const clean = cleanAmount(raw, { decimals, negative: allowNegative });
            setText(groupTyping(clean));
            onValueChange(clean);
          }}
          onBlur={() => {
            focused.current = false;
            const clean = cleanAmount(text, { decimals, negative: allowNegative });
            const done = clean === "" || clean === "-" || clean === "." ? numberOnBlur("", { required: !!rest.required, decimals }) : finishAmount(clean, decimals);
            setText(groupTyping(done));
            onValueChange(done);
          }}
          className={cn(fieldClass, "text-right tabular-nums", currency && "pl-8", className)} {...rest}
        />
      </div>
      {spoken ? <p className="mt-1 animate-count-up text-[13px] leading-[18px] text-muted motion-reduce:animate-none">{spoken}</p> : null}
    </div>
  );
}

/**
 * A plain number box for quantities, percentages, days and grid cells (no rupee sign, no grouping): right aligned in tabular figures; a zero empties when the box is entered so
 * typing starts straight away, any other value is selected so typing replaces it, and on leaving an empty required box goes back to 0 (an optional one stays empty).
 */
export function NumberField({ value, onValueChange, decimals = 0, negative = false, className, ...rest }: Base & { value: string; onValueChange: (value: string) => void; decimals?: number; negative?: boolean }) {
  return (
    <input
      inputMode={decimals > 0 ? "decimal" : "numeric"} autoComplete="off" value={value} data-numeric="managed" data-decimals={decimals}
      onFocus={(e) => { const f = numberOnFocus(value); if (f.select) e.currentTarget.select(); else if (value !== "") onValueChange(""); }}
      onChange={(e) => onValueChange(cleanAmount(e.target.value, { decimals, negative }))}
      onBlur={() => { const done = numberOnBlur(value, { required: !!rest.required, decimals }); if (done !== value) onValueChange(done); }}
      className={cn(fieldClass, "text-right tabular-nums", className)} {...rest}
    />
  );
}

/** Today as an ISO date on this computer. */
const todayIso = () => { const d = new Date(); return toIso(d.getFullYear(), d.getMonth() + 1, d.getDate()); };
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * A date box the way a counter clerk uses it: type 11/11, 1111, 111126, "11 nov", t (today), y (yesterday), e (end of month) or +3 (three days on), and the date is
 * shown as 11 Nov 2026. A calendar opens from the icon, with Today, Yesterday and Month end shortcuts. `value` is an ISO date (2026-11-11) or "".
 */
export function DateField({ value, onValueChange, today, labels, className, disabled, invalid, ...rest }: Base & {
  value: string; onValueChange: (iso: string) => void; today?: string; invalid?: boolean;
  labels?: { calendar?: string; today?: string; yesterday?: string; monthEnd?: string; prev?: string; next?: string; bad?: string };
}) {
  const t = { calendar: "Open calendar", today: "Today", yesterday: "Yesterday", monthEnd: "Month end", prev: "Previous month", next: "Next month", bad: "Not a date", ...labels };
  const now = today ?? todayIso();
  const [text, setText] = useState(value ? formatDateText(value) : "");
  const [bad, setBad] = useState(false);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => { const [y, m] = (value || now).split("-").map(Number) as [number, number]; return { y, m }; });
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => { setText(value ? formatDateText(value) : ""); setBad(false); }, [value]);
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => { if (!inside(box.current, e.target)) setOpen(false); };
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, [open]);
  const pick = (iso: string) => { onValueChange(iso); setOpen(false); };
  function commit() {
    if (!text.trim()) { setBad(false); onValueChange(""); return; }
    const iso = parseDateText(text, now);
    if (iso) { setBad(false); onValueChange(iso); setText(formatDateText(iso)); } else setBad(true);
  }
  const { days, first } = monthGrid(view.y, view.m);
  const shift = (n: number) => setView(({ y, m }) => { const k = y * 12 + (m - 1) + n; return { y: Math.floor(k / 12), m: (k % 12) + 1 }; });
  return (
    <div ref={box} className="relative" onKeyDown={(e) => { if (e.key === "Escape" && open) { e.stopPropagation(); setOpen(false); } }}>
      <input
        value={text} disabled={disabled} autoComplete="off" aria-invalid={invalid || bad || undefined}
        onChange={(e) => { setText(e.target.value); setBad(false); }}
        onFocus={(e) => e.currentTarget.select()} onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "ArrowDown" && !open) setOpen(true); }}
        className={cn(fieldClass, "pr-11", className)} {...rest}
      />
      <button type="button" aria-label={t.calendar} aria-expanded={open} disabled={disabled} onClick={() => { setOpen((o) => !o); const [y, m] = (value || now).split("-").map(Number) as [number, number]; setView({ y, m }); }}
        className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-lg text-muted hover:text-text focus-visible:outline-2"><Calendar className="size-4" aria-hidden /></button>
      {bad ? <p role="alert" className="mt-1 text-[13px] leading-[18px] text-danger">{t.bad}</p> : null}
      {open ? (
        <Floating anchor={box} width={280} role="dialog" label={t.calendar} className="animate-pop-in overflow-auto rounded-xl border border-border bg-surface p-3 shadow-flyout motion-reduce:animate-none">
          <div className="mb-2 flex items-center justify-between">
            <button type="button" aria-label={t.prev} onClick={() => shift(-1)} className="grid size-8 place-items-center rounded-md hover:bg-surface-2">‹</button>
            <span className="text-sm font-semibold">{MONTH_NAMES[view.m - 1]} {view.y}</span>
            <button type="button" aria-label={t.next} onClick={() => shift(1)} className="grid size-8 place-items-center rounded-md hover:bg-surface-2">›</button>
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-center text-xs text-muted">{WEEKDAYS.map((d) => <span key={d} className="py-1">{d}</span>)}</div>
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: first }, (_, i) => <span key={`b${i}`} />)}
            {Array.from({ length: days }, (_, i) => {
              const iso = toIso(view.y, view.m, i + 1);
              return (
                <button key={iso} type="button" aria-pressed={iso === value} onClick={() => pick(iso)}
                  className={cn("grid h-9 place-items-center rounded-md text-sm tabular-nums transition-colors duration-[120ms] hover:bg-surface-2", iso === now && "font-semibold text-primary", iso === value && "bg-primary text-on-primary hover:bg-primary-hover")}>{i + 1}</button>
              );
            })}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5 border-t border-border pt-2">
            {([[t.today, now], [t.yesterday, parseDateText("y", now)!], [t.monthEnd, parseDateText("e", now)!]] as const).map(([label, iso]) => (
              <button key={label} type="button" onClick={() => pick(iso)} className="rounded-full border border-border px-2.5 py-1 text-xs font-medium hover:bg-surface-2">{label}</button>
            ))}
          </div>
        </Floating>
      ) : null}
    </div>
  );
}

export interface ComboOption { value: string; label: string; sub?: string; right?: ReactNode }

/**
 * A picker that is searched by typing: for parties, items, ledgers. Give it `options` (filtered here) or `load` (asked for each search, after a short pause). Each row can
 * carry a second line and a right-hand figure (a balance, the stock on hand). Up and Down move, Enter chooses, Escape closes; `onCreate` adds a last row to make a new one.
 */
export function Combobox({ value, onValueChange, options, load, selected, placeholder, onCreate, labels, className, disabled, invalid, ...rest }: Base & {
  value: string; onValueChange: (value: string, option: ComboOption | null) => void; options?: ComboOption[]; load?: (query: string) => Promise<ComboOption[]>;
  selected?: ComboOption | null; onCreate?: (query: string) => void; invalid?: boolean;
  labels?: { empty?: string; loading?: string; clear?: string; create?: (q: string) => string };
}) {
  const t = { empty: "Nothing found", loading: "Searching", clear: "Clear", create: (q: string) => (q ? `Add "${q}"` : "Add new"), ...labels };
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<ComboOption[]>(options ?? []);
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const known = useMemo(() => selected ?? options?.find((o) => o.value === value) ?? null, [selected, options, value]);
  useEffect(() => {
    if (!open) return;
    if (!load) { const q = query.trim().toLowerCase(); setRows((options ?? []).filter((o) => !q || `${o.label} ${o.sub ?? ""}`.toLowerCase().includes(q))); setActive(0); return; }
    setBusy(true);
    const handle = setTimeout(() => { void load(query).then((r) => { setRows(r); setActive(0); }).finally(() => setBusy(false)); }, 180);
    return () => clearTimeout(handle);
  }, [open, query, options, load]);
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => { if (!inside(box.current, e.target)) setOpen(false); };
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, [open]);
  const total = rows.length + (onCreate ? 1 : 0);
  const choose = (i: number) => {
    if (i < rows.length) { onValueChange(rows[i]!.value, rows[i]!); setOpen(false); setQuery(""); }
    else if (onCreate) { onCreate(query.trim()); setOpen(false); }
  };
  return (
    <div ref={box} className="relative">
      <input
        role="combobox" aria-expanded={open} aria-controls={`${id}-list`} aria-autocomplete="list" aria-activedescendant={open && total ? `${id}-${active}` : undefined}
        aria-invalid={invalid || undefined} autoComplete="off" disabled={disabled} placeholder={placeholder}
        value={open ? query : known?.label ?? ""}
        onFocus={() => { setOpen(true); setQuery(""); }}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); if (!open) setOpen(true); else setActive((a) => Math.min(a + 1, Math.max(total - 1, 0))); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
          else if (e.key === "Enter" && open && total) { e.preventDefault(); choose(active); }
          else if (e.key === "Escape" && open) { e.stopPropagation(); setOpen(false); }
          else if (e.key === "Tab") setOpen(false);
        }}
        className={cn(fieldClass, "pr-16", className)} {...rest}
      />
      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted">
        {value && !disabled ? <button type="button" aria-label={t.clear} onMouseDown={(e) => e.preventDefault()} onClick={() => { onValueChange("", null); setQuery(""); }} className="mr-1 grid size-6 place-items-center rounded-md hover:bg-surface-2"><X className="size-3.5" aria-hidden /></button> : null}
        {busy ? <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden /> : <ChevronDown className="size-4" aria-hidden />}
      </span>
      {open ? (
        <Floating anchor={box} width="anchor" className="animate-pop-in overflow-auto rounded-xl border border-border bg-surface py-1 shadow-flyout motion-reduce:animate-none">
        <ul id={`${id}-list`} role="listbox">
          {rows.map((o, i) => (
            <li key={o.value} id={`${id}-${i}`} role="option" aria-selected={o.value === value} onMouseEnter={() => setActive(i)} onMouseDown={(e) => { e.preventDefault(); choose(i); }}
              className={cn("flex cursor-pointer items-center justify-between gap-3 px-3 py-2", i === active && "bg-primary-soft", o.value === value && "font-semibold")}>
              <span className="min-w-0"><span className="block truncate text-[15px] leading-[22px]">{o.label}</span>{o.sub ? <span className="block truncate text-[13px] leading-[18px] text-muted">{o.sub}</span> : null}</span>
              {o.right ? <span className="shrink-0 text-sm tabular-nums">{o.right}</span> : null}
            </li>
          ))}
          {!rows.length ? <li role="presentation" className="px-3 py-2 text-sm text-muted">{busy ? t.loading : t.empty}</li> : null}
          {onCreate ? (
            <li id={`${id}-${rows.length}`} role="option" aria-selected={false} onMouseEnter={() => setActive(rows.length)} onMouseDown={(e) => { e.preventDefault(); choose(rows.length); }}
              className={cn("flex cursor-pointer items-center gap-2 border-t border-border px-3 py-2 text-sm font-medium text-primary", active === rows.length && "bg-primary-soft")}><Plus className="size-4" aria-hidden />{t.create(query.trim())}</li>
          ) : null}
        </ul>
        </Floating>
      ) : null}
    </div>
  );
}
