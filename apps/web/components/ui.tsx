import clsx, { type ClassValue } from "clsx";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ComponentType, InputHTMLAttributes, ReactNode, Ref, SelectHTMLAttributes } from "react";
import { PrintButton } from "./sales/PrintButton";
import { twMerge } from "tailwind-merge";

/** Later classes win over earlier ones (so `className="w-44"` overrides the default `w-full`). */
export const cn = (...c: ClassValue[]) => twMerge(clsx(c));

/**
 * A button. 44px high by default (36px with `size="sm"` and inside a table or a compact area), 8px corners. It lifts a hair on hover and presses in on click.
 * `loading` swaps the label for a spinner without changing the button's width; `done` shows a check for a moment after a save.
 */
export function Button({ variant = "primary", size = "md", loading = false, done = false, className, children, disabled, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "outline" | "danger"; size?: "md" | "sm"; loading?: boolean; done?: boolean }) {
  return (
    <button
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-lg px-4 text-sm leading-5 font-semibold whitespace-nowrap",
        "transition-[background-color,border-color,color,box-shadow,transform] duration-[120ms] ease-in-out-smooth",
        "hover:-translate-y-px active:translate-y-px active:scale-[0.985] active:duration-[50ms]",
        "disabled:pointer-events-none disabled:opacity-50",
        size === "md" ? "h-11 in-[table]:h-9 in-[table]:px-3" : "h-9 px-3",
        variant === "primary" && "bg-primary text-on-primary shadow-[0_1px_2px_0_rgb(0_0_0/0.05)] hover:bg-primary-hover hover:shadow-[0_3px_6px_-1px_rgb(29_78_216/0.2)]",
        variant === "outline" && "border border-border-input bg-surface text-text hover:border-border-input-hover hover:bg-surface-3",
        variant === "ghost" && "text-text-secondary hover:bg-surface-2 hover:text-text",
        variant === "danger" && "bg-danger text-on-danger hover:opacity-90",
        done && "bg-success text-white hover:bg-success",
        className,
      )}
      {...props}
    >
      <span className={cn("inline-flex items-center justify-center gap-2 transition-opacity duration-[120ms]", loading && "opacity-0")}>{done ? <Check className="size-4" aria-hidden /> : null}{children}</span>
      {loading ? <Loader2 className="absolute size-4 animate-spin motion-reduce:animate-none" aria-hidden /> : null}
    </button>
  );
}

/** The look of every text box, number box and drop-down: 44px (36px in a table), a clean border that darkens on hover, and a blue border with a soft halo on focus. */
export const fieldClass =
  "h-11 w-full rounded-lg border border-border-input bg-surface px-3 text-[15px] leading-[22px] text-text placeholder:text-muted " +
  "transition-[border-color,box-shadow] duration-[120ms] ease-in-out-smooth hover:border-border-input-hover " +
  "focus:border-ring focus:shadow-focus focus:outline-none disabled:bg-surface-2 disabled:text-muted disabled:hover:border-border-input " +
  "aria-invalid:border-danger aria-invalid:shadow-focus-danger in-[table]:h-9 in-[table]:px-2 in-[table]:text-sm in-[table]:leading-5 in-data-[density=compact]:h-9 in-data-[density=compact]:text-sm";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement> & { ref?: Ref<HTMLInputElement> }) {
  return <input className={cn(fieldClass, className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldClass, "pr-8", className)} {...props}>
      {children}
    </select>
  );
}

/**
 * A form field: the label sits above its box in the normal text colour (14px medium), the hint below in 13px muted. An error replaces the hint, with an icon, and
 * the box shakes once as it appears. `required` writes the word beside the label instead of a red star.
 */
export function Field({ label, hint, error, children, htmlFor, required, requiredText }: { label: ReactNode; hint?: ReactNode; error?: ReactNode; children: ReactNode; htmlFor?: string; required?: boolean; requiredText?: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={htmlFor} className="flex items-baseline justify-between gap-2 text-sm leading-5 font-medium text-text-secondary">
        <span>{label}</span>
        {required ? <span className="text-xs font-normal text-muted">{requiredText ?? "required"}</span> : null}
      </label>
      <div className={error ? "animate-shake motion-reduce:animate-none" : undefined}>{children}</div>
      {error ? <p role="alert" className="flex items-start gap-1 text-[13px] leading-[18px] text-danger animate-pop-in motion-reduce:animate-none"><AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden />{error}</p>
        : hint ? <p className="text-[13px] leading-[18px] text-muted">{hint}</p> : null}
    </div>
  );
}

/**
 * A page whose content must fit one screen (a document or voucher entry): on a desktop it is exactly as tall as the window below the bars, the title is one slim line, and
 * the part that grows (the line table) scrolls inside it while the totals and the Save button stay in view. On a phone it flows and scrolls like any page.
 */
export function FitScreen({ children }: { children: ReactNode }) {
  return <div className="fit-screen">{children}</div>;
}

/** An opaque work surface: tables and forms never sit behind translucent glass. */
export function Card({ className, children, id }: { className?: string; children: ReactNode; id?: string }) {
  return <section id={id} className={cn("rounded-lg border border-border bg-surface p-4 shadow-[0_1px_3px_0_rgb(15_23_42/0.06),0_1px_2px_-1px_rgb(15_23_42/0.04)]", className)}>{children}</section>;
}

/**
 * A page's title line. Reports pass an icon (a navy tile beside the title, as the design shows) and
 * `print` for a Print button; filters and buttons hide on paper.
 */
export function PageHeader({ title, subtitle, actions, icon: Icon, print = false }: {
  title: ReactNode; subtitle?: ReactNode; actions?: ReactNode; icon?: ComponentType<{ className?: string }>; print?: boolean;
}) {
  return (
    <header className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div className="flex min-w-0 items-center gap-3">
        {Icon ? <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary shadow-raised print:hidden"><Icon className="size-[1.35rem]" aria-hidden /></span> : null}
        <div className="min-w-0">
          <h1 className="text-[1.4286rem] leading-tight font-semibold text-text">{title}</h1>
          {subtitle ? <p className="mt-1 max-w-[80ch] text-[0.9286rem] text-muted">{subtitle}</p> : null}
        </div>
      </div>
      {actions || print ? <div className="flex flex-wrap items-center gap-2 print:hidden">{actions}{print ? <PrintButton /> : null}</div> : null}
    </header>
  );
}

export function Alert({ children }: { children: ReactNode }) {
  return <div role="alert" className="rounded-md border border-danger/25 bg-danger-soft px-3 py-2 text-sm text-danger">{children}</div>;
}

/** A status tag: square-ish corners so compound labels keep their width. */
export function Badge({ tone = "neutral", children, className }: { tone?: "neutral" | "success" | "warning" | "danger" | "info" | "teal"; children: ReactNode; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-[3px] border px-1.5 py-px text-xs font-semibold whitespace-nowrap",
      tone === "neutral" && "border-border bg-surface-2 text-muted",
      tone === "success" && "border-success/30 bg-success-soft text-success",
      tone === "warning" && "border-accent/30 bg-accent-soft text-accent",
      tone === "danger" && "border-danger/30 bg-danger-soft text-danger",
      tone === "info" && "border-primary/30 bg-primary-soft text-primary",
      tone === "teal" && "border-teal/30 bg-teal-soft text-teal",
      className,
    )}>{children}</span>
  );
}
