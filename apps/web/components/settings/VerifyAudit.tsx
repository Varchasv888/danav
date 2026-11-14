"use client";

import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { Alert, Button, Field, Input } from "../ui";

interface Check { ok: boolean; checked: number; broken?: { seq: number; reason: "gap" | "link" | "content" | "anchor" } }
interface Anchor { seq: number; hash: string; at: string }

/** "42:3f9a..." as written by the anchor line below. */
const parseAnchor = (text: string) => { const m = /^\s*(\d+)\s*:\s*([0-9a-f]{64})\s*$/i.exec(text); return m ? { seq: Number(m[1]), hash: m[2]!.toLowerCase() } : null; };

/** Runs the hash-chain check on the audit trail and says plainly whether anything was changed or removed. */
export function VerifyAudit() {
  const t = useTranslations("audit");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Check | null>(null);
  const [failed, setFailed] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null | undefined>(undefined);
  const [saved, setSaved] = useState("");

  async function run() {
    setBusy(true);
    setFailed(false);
    const pinned = saved.trim() ? parseAnchor(saved) : undefined;
    if (pinned === null) { setFailed(true); setBusy(false); return; }
    try { setResult(await api<Check>("/audit-log/verify", { method: "POST", body: pinned ? { anchor: pinned } : {} })); } catch { setFailed(true); } finally { setBusy(false); }
  }
  async function showAnchor() {
    setFailed(false);
    try { setAnchor(await api<Anchor | null>("/audit-log/anchor")); } catch { setFailed(true); }
  }

  return (
    <div className="mb-4 flex flex-col gap-3 print:hidden">
      <div className="flex flex-wrap items-end gap-3">
        <Button type="button" variant="outline" onClick={run} disabled={busy}><ShieldCheck className="size-4" aria-hidden />{busy ? t("verifying") : t("verify")}</Button>
        <Field label={t("savedAnchor")} htmlFor="au-anchor"><Input id="au-anchor" value={saved} onChange={(e) => setSaved(e.target.value)} placeholder="42:3f9a..." className="w-96 font-mono text-xs" /></Field>
        <Button type="button" variant="ghost" onClick={showAnchor}>{t("showAnchor")}</Button>
      </div>
      {anchor ? <p className="break-all rounded-md border border-border bg-surface-2 px-3 py-2 font-mono text-xs" role="status">{anchor.seq}:{anchor.hash}<span className="mt-1 block font-sans text-muted">{t("anchorHelp")}</span></p> : null}
      {anchor === null ? <p className="text-sm text-muted">{t("anchorNone")}</p> : null}
      {failed ? <Alert>{t("verifyFailed")}</Alert> : null}
      {result?.ok ? <div role="status" className="rounded-md border border-success/30 bg-success-soft px-3 py-2 text-[0.9286rem] text-success">{t("verifyOk", { n: result.checked })}</div> : null}
      {result && !result.ok && result.broken ? <Alert>{t("verifyBroken", { seq: result.broken.seq, reason: t(`reason.${result.broken.reason}`) })}</Alert> : null}
    </div>
  );
}
