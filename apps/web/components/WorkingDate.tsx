"use client";

import clsx from "clsx";
import { CalendarClock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { createContext, useContext, useState } from "react";
import { WORKING_DATE_COOKIE } from "@/lib/working-date";
import { Button, Field, Input } from "./ui";

interface Value { date: string; today: string; custom: boolean; canSet: boolean }
const Ctx = createContext<Value | null>(null);

/** Gives every screen under it the date new documents start with: the working date when one is set, else today. */
export function WorkingDateProvider({ date, today, canSet, children }: { date: string | null; today: string; canSet: boolean; children: React.ReactNode }) {
  return <Ctx.Provider value={{ date: date ?? today, today, custom: !!date && date !== today, canSet }}>{children}</Ctx.Provider>;
}

/** The date a new document should start with. Outside the provider (public pages) it is today in India. */
export function useWorkDate(): string {
  const v = useContext(Ctx);
  return v ? v.date : new Date(Date.now() + 330 * 60_000).toISOString().slice(0, 10);
}

/** A chip in the top bar: shows a changed working date in amber and lets someone with the right set or clear it. */
export function WorkingDateControl({ className }: { className?: string }) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const v = useContext(Ctx);
  const [open, setOpen] = useState(false);
  const [pick, setPick] = useState("");
  if (!v || (!v.canSet && !v.custom)) return null;
  const set = (d: string | null) => {
    try {
      document.cookie = d ? `${WORKING_DATE_COOKIE}=${d}; path=/; SameSite=Lax` : `${WORKING_DATE_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
    } catch { /* cookies blocked: the date simply stays today */ }
    setOpen(false);
    router.refresh();
  };
  const label = format.dateTime(new Date(`${v.date}T00:00:00`), { day: "numeric", month: "short" });
  return (
    <div className="relative">
      <button type="button" onClick={() => { setPick(v.date); setOpen((o) => !o); }} title={t("workingDate.title")}
        className={clsx(className, v.custom && "bg-warning text-black hover:bg-warning")}>
        <CalendarClock className="size-4" aria-hidden />
        <span className={clsx(!v.custom && "sr-only xl:not-sr-only")}>{v.custom ? t("workingDate.chip", { date: label }) : label}</span>
      </button>
      {open ? (
        <div role="dialog" aria-label={t("workingDate.title")} className="absolute right-0 z-50 mt-2 w-72 rounded-lg border border-border bg-surface p-4 text-text shadow-xl">
          <p className="mb-3 text-sm text-muted">{t("workingDate.help")}</p>
          {v.canSet ? (
            <form onSubmit={(e) => { e.preventDefault(); set(pick && pick !== v.today ? pick : null); }} className="flex flex-col gap-3">
              <Field label={t("workingDate.date")} htmlFor="wd-date"><Input id="wd-date" type="date" value={pick} onChange={(e) => setPick(e.target.value)} required /></Field>
              <div className="flex gap-2">
                <Button type="submit">{t("workingDate.set")}</Button>
                {v.custom ? <Button type="button" variant="outline" onClick={() => set(null)}>{t("workingDate.reset")}</Button> : null}
              </div>
            </form>
          ) : (
            <Button type="button" variant="outline" onClick={() => set(null)}>{t("workingDate.reset")}</Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
