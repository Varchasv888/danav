"use client";

import clsx from "clsx";
import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Button, Field, Input } from "./ui";

const KEY = "varchasv.locked";
const IDLE_MS = 15 * 60_000;

const read = () => { try { return sessionStorage.getItem(KEY) === "1"; } catch { return false; } };
const write = (on: boolean) => { try { if (on) sessionStorage.setItem(KEY, "1"); else sessionStorage.removeItem(KEY); } catch { /* storage blocked: the lock lasts until reload */ } };

/**
 * A lock button for the top bar and the screen it brings up. The screen covers everything until the signed-in user types their
 * password; it also comes up on its own after 15 minutes with no keys or mouse. Nothing is signed out, so open screens stay as they were.
 */
export function LockScreen({ className, onSignOut }: { className?: string; onSignOut: () => void }) {
  const t = useTranslations();
  const [locked, setLocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const idle = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lock = useCallback(() => { write(true); setLocked(true); setPassword(""); setError(null); }, []);
  useEffect(() => { if (read()) setLocked(true); }, []);

  useEffect(() => {
    if (locked) return;
    const arm = () => { if (idle.current) clearTimeout(idle.current); idle.current = setTimeout(lock, IDLE_MS); };
    const keys = ["keydown", "pointerdown", "pointermove", "wheel"] as const;
    for (const k of keys) window.addEventListener(k, arm, { passive: true });
    arm();
    const onKey = (e: KeyboardEvent) => { if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "l") { e.preventDefault(); lock(); } };
    window.addEventListener("keydown", onKey);
    return () => { for (const k of keys) window.removeEventListener(k, arm); window.removeEventListener("keydown", onKey); if (idle.current) clearTimeout(idle.current); };
  }, [locked, lock]);

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try { await api("/auth/unlock", { body: { password } }); write(false); setLocked(false); setPassword(""); } catch (err) { setError(errorText(t, err, ["lock.errors", "auth.errors"])); } finally { setBusy(false); }
  }

  return (
    <>
      <button type="button" onClick={lock} title={t("lock.lock")} className={clsx(className)}>
        <Lock className="size-4" aria-hidden /><span className="sr-only">{t("lock.lock")}</span>
      </button>
      {locked ? (
        <div role="dialog" aria-modal="true" aria-label={t("lock.title")} className="fixed inset-0 z-[100] grid place-items-center bg-navy/95 p-4 backdrop-blur print:hidden">
          <form onSubmit={unlock} method="post" className="flex w-full max-w-sm flex-col gap-4 rounded-lg bg-surface p-6 shadow-xl">
            <div className="flex items-center gap-2"><Lock className="size-5 text-primary" aria-hidden /><h2 className="text-lg font-semibold">{t("lock.title")}</h2></div>
            <p className="text-sm text-muted">{t("lock.help")}</p>
            {error ? <Alert>{error}</Alert> : null}
            <Field label={t("auth.password")} htmlFor="lock-pass"><Input id="lock-pass" type="password" autoComplete="current-password" autoFocus value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
            <div className="flex items-center justify-between gap-3">
              <Button type="submit" disabled={busy || !password}>{t("lock.unlock")}</Button>
              <button type="button" onClick={() => { write(false); onSignOut(); }} className="text-sm text-muted hover:text-text hover:underline">{t("lock.signOut")}</button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
