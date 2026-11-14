"use client";

import { RotateCcw, Send, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { baseLocale } from "@varchasv/i18n/locales";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Button, Card, Input } from "./ui";

interface Msg { role: "user" | "assistant"; content: string; tools?: string[] }
const KEY = "varchasv.assistant";

/** Chat with the assistant; the conversation stays in this browser tab only. */
export function Assistant({ mode }: { mode: "claude" | "demo" }) {
  const t = useTranslations();
  const locale = useLocale();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    try { const saved = sessionStorage.getItem(KEY); if (saved) setMessages(JSON.parse(saved) as Msg[]); } catch { /* storage blocked */ }
  }, []);
  useEffect(() => {
    try { sessionStorage.setItem(KEY, JSON.stringify(messages.slice(-30))); } catch { /* storage blocked */ }
    end.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  async function ask(text: string) {
    const question = text.trim();
    if (!question || busy) return;
    const next = [...messages, { role: "user" as const, content: question }];
    setMessages(next);
    setQ("");
    setBusy(true);
    try {
      const r = await api<{ answer: string; tools: string[] }>("/assistant/ask", { body: { locale: baseLocale(locale), messages: next.slice(-12).map(({ role, content }) => ({ role, content })) } });
      setMessages([...next, { role: "assistant", content: r.answer || "…", tools: r.tools }]);
    } catch (err) {
      setMessages([...next, { role: "assistant", content: errorText(t, err, ["assistant.errors"]) }]);
    } finally { setBusy(false); }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="flex items-center gap-2 text-sm text-muted"><Sparkles className="size-4 text-primary" aria-hidden />{mode === "claude" ? t("assistant.claude") : t("assistant.demo")}</p>
      <Card className="flex min-h-[50vh] flex-col gap-3">
        {!messages.length ? (
          <div className="flex flex-wrap gap-2">
            {(["s1", "s2", "s3", "s4", "s5"] as const).map((s) => (
              <button key={s} type="button" onClick={() => ask(t(`assistant.suggestions.${s}`))} className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-primary hover:bg-primary-soft">{t(`assistant.suggestions.${s}`)}</button>
            ))}
          </div>
        ) : null}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "self-end max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2 text-on-primary" : "max-w-[90%] self-start"}>
            <div className="text-sm whitespace-pre-wrap">{m.content}</div>
            {m.tools?.length ? <div className="mt-1 text-xs text-muted">{t("assistant.tools", { tools: [...new Set(m.tools)].map((x) => x.replace(/_/g, " ")).join(", ") })}</div> : null}
          </div>
        ))}
        {busy ? <div className="self-start text-sm text-muted">{t("assistant.thinking")}</div> : null}
        <div ref={end} />
      </Card>
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); void ask(q); }}>
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("assistant.placeholder")} aria-label={t("assistant.placeholder")} maxLength={2000} autoFocus />
        <Button type="submit" disabled={busy || !q.trim()}><Send className="size-4" aria-hidden />{t("assistant.send")}</Button>
        {messages.length ? <Button type="button" variant="ghost" onClick={() => setMessages([])} title={t("assistant.clear")}><RotateCcw className="size-4" aria-hidden /></Button> : null}
      </form>
    </div>
  );
}
