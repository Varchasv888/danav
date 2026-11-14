"use client";

import { CheckCircle2, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Button, Input } from "../ui";

const masked = (to: string) => `XXXXXX${to.slice(-4)}`;

/**
 * Sends a bill or invoice on WhatsApp with a link to it. Uses the number on the document when there is
 * one; otherwise asks for a mobile. `sent` shows a send that already happened (the counter's auto-send).
 */
export function SendWhatsApp({ endpoint, phone, sent: already, compact = false }: { endpoint: string; phone?: string | null; sent?: string | null; compact?: boolean }) {
  const t = useTranslations();
  const [asking, setAsking] = useState(false);
  const [mobile, setMobile] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<string | null>(already && phone ? phone : null);
  const [error, setError] = useState<string | null>(already === "failed" ? t("share.autoFailed") : null);

  const send = async (to?: string) => {
    setBusy(true);
    setError(null);
    try {
      const m = await api<{ to: string; status: string }>(endpoint, { body: to ? { phone: to } : {} });
      if (m.status === "sent") { setSent(m.to); setAsking(false); } else setError(t("share.failed"));
    } catch (err) {
      setError(errorText(t, err, ["share.errors"]));
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <span className="inline-flex h-10 items-center gap-2 text-sm text-success">
        <CheckCircle2 className="size-4" aria-hidden />{t("share.sentTo", { to: masked(sent) })}
        <button type="button" onClick={() => { setSent(null); setAsking(true); }} className="text-muted underline-offset-2 hover:underline">{t("share.again")}</button>
      </span>
    );
  }
  return (
    <div className="flex flex-col items-center gap-1">
      {asking ? (
        <form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); void send(mobile); }}>
          <Input value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} inputMode="numeric" placeholder={t("share.mobile")} aria-label={t("share.mobile")} className="h-10 w-40" autoFocus />
          <Button type="submit" disabled={busy || mobile.length !== 10}><MessageCircle className="size-4" aria-hidden />{t("share.send")}</Button>
        </form>
      ) : (
        <Button variant="outline" disabled={busy} onClick={() => (phone ? send() : setAsking(true))} className={compact ? "h-9" : ""}>
          <MessageCircle className="size-4" aria-hidden />{t("share.sendWhatsApp")}
        </Button>
      )}
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
