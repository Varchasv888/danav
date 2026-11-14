"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Button, Card, Field, Input } from "../ui";

/** Sets or changes the business passcode. Changing it needs the current one; the person's password is asked for first. */
export function PasscodeSettings({ isSet, canEdit }: { isSet: boolean; canEdit: boolean }) {
  const t = useTranslations();
  const s = useTranslations("passcode");
  const router = useRouter();
  const [current, setCurrent] = useState("");
  const [code, setCode] = useState("");
  const [again, setAgain] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const digits = (v: string) => v.replace(/\D/g, "").slice(0, 8);
  const ready = canEdit && code.length >= 4 && code === again && (!isSet || current.length >= 4);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setMsg(null);
    try {
      await api("/settings/passcode", { method: "PUT", body: { passcode: code, ...(isSet ? { current } : {}) } });
      setMsg(s("saved")); setCurrent(""); setCode(""); setAgain(""); router.refresh();
    } catch (err) { setError(errorText(t, err, ["passcode.errors"])); }
  }
  return (
    <Card className="mb-4 p-4">
      <h2 className="text-[1rem] font-semibold">{isSet ? s("change") : s("set")}</h2>
      <p className="mt-1 mb-3 text-sm text-muted">{s("hint")}</p>
      {error ? <Alert>{error}</Alert> : null}
      {msg ? <p className="text-sm text-success">{msg}</p> : null}
      <form onSubmit={save} className="mt-2 flex flex-wrap items-end gap-3">
        {isSet ? <Field label={s("current")} htmlFor="pc-cur"><Input id="pc-cur" type="password" inputMode="numeric" autoComplete="off" value={current} onChange={(e) => setCurrent(digits(e.target.value))} className="num w-36" /></Field> : null}
        <Field label={s("new")} htmlFor="pc-new"><Input id="pc-new" type="password" inputMode="numeric" autoComplete="off" value={code} onChange={(e) => setCode(digits(e.target.value))} className="num w-36" /></Field>
        <Field label={s("again")} htmlFor="pc-again"><Input id="pc-again" type="password" inputMode="numeric" autoComplete="off" value={again} onChange={(e) => setAgain(digits(e.target.value))} className="num w-36" /></Field>
        <Button type="submit" disabled={!ready}>{s("save")}</Button>
      </form>
    </Card>
  );
}
