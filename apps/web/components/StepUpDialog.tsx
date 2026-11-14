"use client";

import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { setPasswordAsker } from "@/lib/client-api";
import { Button, Field, Input } from "./ui";

/** The box that appears when an action needs the password typed again. Mounted once in the app frame. */
export function StepUpDialog() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const resolver = useRef<((v: string | null) => void) | null>(null);

  useEffect(() => {
    setPasswordAsker(() => new Promise<string | null>((resolve) => { resolver.current = resolve; setPassword(""); setOpen(true); }));
    return () => setPasswordAsker(null);
  }, []);
  const close = (value: string | null) => { setOpen(false); resolver.current?.(value); resolver.current = null; };
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label={t("stepUp.title")} className="fixed inset-0 z-[90] grid place-items-center bg-navy/60 p-4 print:hidden">
      <form onSubmit={(e) => { e.preventDefault(); if (password) close(password); }} method="post" className="flex w-full max-w-sm flex-col gap-4 rounded-lg bg-surface p-6 shadow-xl">
        <div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" aria-hidden /><h2 className="text-lg font-semibold">{t("stepUp.title")}</h2></div>
        <p className="text-sm text-muted">{t("stepUp.help")}</p>
        <Field label={t("auth.password")} htmlFor="su-pass"><Input id="su-pass" type="password" autoComplete="current-password" autoFocus value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
        <div className="flex gap-3"><Button type="submit" disabled={!password}>{t("stepUp.confirm")}</Button><Button type="button" variant="ghost" onClick={() => close(null)}>{t("common.cancel")}</Button></div>
      </form>
    </div>
  );
}
