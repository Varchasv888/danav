"use client";

import { KeyRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { setPasscodeAsker } from "@/lib/client-api";
import { Button, Field, Input } from "./ui";

/** The box that appears when cancelling a document needs the business passcode. Mounted once in the app frame. */
export function PasscodeDialog() {
  const t = useTranslations("passcode");
  const [open, setOpen] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [code, setCode] = useState("");
  const resolver = useRef<((v: string | null) => void) | null>(null);

  useEffect(() => {
    setPasscodeAsker((again) => new Promise<string | null>((resolve) => { resolver.current = resolve; setCode(""); setWrong(again); setOpen(true); }));
    return () => setPasscodeAsker(null);
  }, []);
  const close = (value: string | null) => { setOpen(false); resolver.current?.(value); resolver.current = null; };
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label={t("title")} className="fixed inset-0 z-[90] grid place-items-center bg-navy/60 p-4 print:hidden">
      <form onSubmit={(e) => { e.preventDefault(); if (code) close(code); }} className="flex w-full max-w-sm flex-col gap-4 rounded-lg bg-surface p-5 shadow-raised">
        <div className="flex items-center gap-2"><KeyRound className="size-5 text-primary" aria-hidden /><h2 className="text-lg font-semibold">{t("title")}</h2></div>
        <p className="text-sm text-muted">{t("help")}</p>
        {wrong ? <p role="alert" className="text-sm text-danger">{t("wrong")}</p> : null}
        <Field label={t("code")} htmlFor="pc-code"><Input id="pc-code" type="password" inputMode="numeric" autoComplete="off" autoFocus maxLength={8} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} className="num tracking-widest" /></Field>
        <div className="flex gap-3"><Button type="submit" disabled={code.length < 4}>{t("confirm")}</Button><Button type="button" variant="ghost" onClick={() => close(null)}>{t("cancel")}</Button></div>
      </form>
    </div>
  );
}
