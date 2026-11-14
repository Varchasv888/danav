"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { todayIso } from "@/lib/format";

export interface Note { id: string; body: string; dueOn: string | null }

/** A person's own notes and reminders on the home screen: write one, give it a day, tick it off. Only they see it. */
export function MyNotes({ notes }: { notes: Note[] }) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const today = todayIso();
  const day = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { day: "numeric", month: "short" });

  async function run(fn: () => Promise<unknown>) {
    setFailed(false);
    setBusy(true);
    try { await fn(); router.refresh(); return true; } catch { setFailed(true); return false; } finally { setBusy(false); }
  }

  return (
    <section className="rounded-lg border border-border bg-surface p-4" aria-labelledby="mm-notes">
      <h2 id="mm-notes" className="mb-1 text-[1rem] font-semibold">{t("notes.title")}</h2>
      <p className="mb-2 text-[0.8571rem] text-muted">{t("notes.private")}</p>
      {notes.length ? (
        <ul className="mb-3 flex flex-col gap-1.5 text-[0.9286rem]">
          {notes.map((n) => {
            const late = n.dueOn !== null && n.dueOn < today;
            const now = n.dueOn === today;
            return (
              <li key={n.id} className="flex items-start gap-2 rounded-md border border-border bg-surface-3 px-2.5 py-2">
                <input type="checkbox" disabled={busy} onChange={() => void run(() => api(`/notes/${n.id}`, { method: "PATCH", body: { done: true } }))} aria-label={t("notes.markDone", { note: n.body })} className="mt-1 size-4 accent-[var(--primary)]" />
                <span className="flex-1 break-words">{n.body}{n.dueOn ? <span className={`ml-2 text-xs font-semibold ${late ? "text-danger" : now ? "text-accent" : "text-muted"}`}>{late ? t("notes.overdue", { date: day(n.dueOn) }) : now ? t("notes.today") : day(n.dueOn)}</span> : null}</span>
                <button type="button" disabled={busy} onClick={() => void run(() => api(`/notes/${n.id}`, { method: "DELETE" }))} className="rounded p-1 text-faint hover:bg-surface-2 hover:text-danger" title={t("notes.remove")}><Trash2 className="size-3.5" aria-hidden /><span className="sr-only">{t("notes.remove")}</span></button>
              </li>
            );
          })}
        </ul>
      ) : <p className="mb-3 text-[0.9286rem] text-muted">{t("notes.none")}</p>}
      {failed ? <p role="alert" className="mb-2 text-[0.8571rem] text-danger">{t("auth.errors.generic")}</p> : null}
      <form method="post" className="flex flex-wrap gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const f = new FormData(form);
          const body = String(f.get("body") ?? "").trim();
          if (!body) return;
          if (await run(() => api("/notes", { body: { body, dueOn: String(f.get("dueOn") ?? "") || null } }))) form.reset();
        }}>
        <input name="body" required maxLength={500} placeholder={t("notes.placeholder")} aria-label={t("notes.placeholder")} className="h-8 min-w-0 flex-1 rounded-md border border-border bg-surface px-2 text-[0.9286rem]" />
        <input name="dueOn" type="date" aria-label={t("notes.remindOn")} className="h-8 rounded-md border border-border bg-surface px-1.5 text-[0.8571rem]" />
        <button type="submit" disabled={busy} className="h-8 rounded-md bg-primary px-3 text-[0.9286rem] font-semibold text-white hover:bg-primary-hover">{t("notes.add")}</button>
      </form>
    </section>
  );
}
