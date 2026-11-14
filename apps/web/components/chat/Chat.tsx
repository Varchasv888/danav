"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Button, Input } from "../ui";

export interface Person { userId: string; name: string; role: string; unread: number; lastAt: string | null }
interface Message { id: string; mine: boolean; body: string; at: string }
const POLL_MS = 5000;

/** People on the left, the open conversation on the right. The open thread refreshes every few seconds. */
export function Chat({ people }: { people: Person[] }) {
  const t = useTranslations();
  const format = useFormatter();
  const [list, setList] = useState(people);
  const [open, setOpen] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);
  const lastAt = useRef<string | null>(null);

  const refreshPeople = useCallback(async () => { try { setList(await api<Person[]>("/chat/people")); } catch { /* the next poll tries again */ } }, []);

  const load = useCallback(async (userId: string, full: boolean) => {
    try {
      const rows = await api<Message[]>(`/chat/${userId}${!full && lastAt.current ? `?after=${encodeURIComponent(lastAt.current)}` : ""}`);
      if (full) setMessages(rows); else if (rows.length) setMessages((m) => [...m, ...rows.filter((r) => !m.some((x) => x.id === r.id))]);
      if (rows.length) lastAt.current = rows[rows.length - 1]!.at;
    } catch { /* the next poll tries again */ }
  }, []);

  useEffect(() => {
    if (!open) return;
    lastAt.current = null;
    void load(open, true).then(refreshPeople);
    const timer = setInterval(() => { void load(open, false); void refreshPeople(); }, POLL_MS);
    return () => clearInterval(timer);
  }, [open, load, refreshPeople]);
  useEffect(() => { bottom.current?.scrollIntoView({ block: "end" }); }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!open || !draft.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const m = await api<Message>(`/chat/${open}`, { body: { body: draft } });
      setMessages((rows) => [...rows, m]);
      lastAt.current = m.at;
      setDraft("");
    } catch (err) { setError(errorText(t, err, ["chat.errors"])); } finally { setBusy(false); }
  }
  const person = list.find((p) => p.userId === open);

  return (
    <div className="grid min-h-[28rem] gap-4 md:grid-cols-[16rem_1fr]">
      <ul className="rounded-md border border-border bg-surface">
        {list.map((p) => (
          <li key={p.userId}>
            <button type="button" onClick={() => setOpen(p.userId)} aria-current={open === p.userId ? "true" : undefined} className={`flex w-full items-center justify-between gap-2 border-b border-rule px-3 py-2 text-left text-sm last:border-0 hover:bg-surface-2 ${open === p.userId ? "bg-primary-soft" : ""}`}>
              <span><span className="block font-medium">{p.name}</span><span className="block text-xs text-muted">{p.role}</span></span>
              {p.unread ? <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-on-primary" aria-label={t("chat.unread", { n: p.unread })}>{p.unread}</span> : null}
            </button>
          </li>
        ))}
        {!list.length ? <li className="px-3 py-6 text-center text-sm text-muted">{t("chat.nobody")}</li> : null}
      </ul>
      <div className="flex flex-col rounded-md border border-border bg-surface">
        {person ? (
          <>
            <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{person.name}</h2>
            <div className="flex max-h-96 min-h-64 flex-1 flex-col gap-2 overflow-y-auto p-4" aria-live="polite">
              {messages.map((m) => (
                <div key={m.id} className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${m.mine ? "self-end bg-primary text-on-primary" : "self-start bg-surface-2"}`}>
                  <div className="whitespace-pre-wrap break-words">{m.body}</div>
                  <div className={`mt-1 text-[0.7rem] ${m.mine ? "text-on-primary/70" : "text-muted"}`}>{format.dateTime(new Date(m.at), { hour: "numeric", minute: "2-digit", day: "numeric", month: "short" })}</div>
                </div>
              ))}
              {!messages.length ? <p className="m-auto text-sm text-muted">{t("chat.noMessages")}</p> : null}
              <div ref={bottom} />
            </div>
            {error ? <div className="px-4 pb-2"><Alert>{error}</Alert></div> : null}
            <form onSubmit={send} method="post" className="flex gap-2 border-t border-border p-3">
              <Input aria-label={t("chat.message")} value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={1000} placeholder={t("chat.message")} />
              <Button type="submit" disabled={busy || !draft.trim()}>{t("chat.send")}</Button>
            </form>
          </>
        ) : <p className="m-auto px-4 py-10 text-sm text-muted">{t("chat.pick")}</p>}
      </div>
    </div>
  );
}
