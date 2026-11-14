"use client";

import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { GST_STATES, devanagari } from "@varchasv/domain";
import { ApiError, api } from "@/lib/client-api";
import { Alert, Button, Field, Input, Select } from "./ui";

export function BusinessSwitcher({ current, tenants, tone = "plain" }: { current: string | null; tenants: { tenantId: string; name: string; role: string }[]; tone?: "plain" | "shell" }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) { setOpen(false); setAdding(false); } };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  async function switchTo(tenantId: string) {
    if (tenantId !== current) {
      await api("/auth/switch", { body: { tenantId } });
      router.push("/dashboard");
      router.refresh();
    }
    setOpen(false);
  }

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setError(null);
    try {
      await api("/tenants", { body: { businessName: f.get("businessName"), stateCode: f.get("stateCode"), gstin: (f.get("gstin") as string) || undefined } });
      setOpen(false);
      setAdding(false);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "generic";
      setError(t.has(`auth.errors.${code}`) ? t(`auth.errors.${code}`) : t("auth.errors.generic"));
    }
  }

  const name = tenants.find((x) => x.tenantId === current)?.name ?? "-";
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className={tone === "shell" ? "flex h-9 w-full items-center gap-2 rounded-md bg-white/10 px-2.5 text-left text-[0.9286rem] text-white ring-1 ring-white/15 hover:bg-white/15" : "flex w-full items-center gap-2 rounded-md border border-border px-3 py-2 text-left text-sm hover:bg-surface-2"}>
        <span className="flex-1 truncate font-medium">{name}</span>
        <ChevronsUpDown className={tone === "shell" ? "size-4 text-white/70" : "size-4 text-muted"} aria-hidden />
      </button>
      {open ? (
        <div className="absolute left-0 top-full z-40 mt-1 w-72 max-w-[90vw] rounded-lg border border-border-strong bg-surface p-1 text-text shadow-card">
          <p className="px-2 py-1 text-xs font-medium text-muted">{t("switcher.title")}</p>
          <ul>
            {tenants.map((x) => (
              <li key={x.tenantId}>
                <button type="button" onClick={() => switchTo(x.tenantId)} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-surface-2">
                  <span className="flex-1 truncate">{x.name}</span>
                  {x.tenantId === current ? <Check className="size-4 text-primary" aria-hidden /> : null}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-1 border-t border-border pt-1">
            {adding ? (
              <form onSubmit={create} className="flex flex-col gap-2 p-2">
                {error ? <Alert>{error}</Alert> : null}
                <Field label={t("auth.businessName")} htmlFor="sw-name"><Input id="sw-name" name="businessName" required minLength={2} autoFocus /></Field>
                <Field label={t("auth.state")} htmlFor="sw-state">
                  <Select id="sw-state" name="stateCode" defaultValue="27">
                    {GST_STATES.filter((s) => s.code !== "96").map((s) => <option key={s.code} value={s.code}>{s.code} · {devanagari(locale) ? s.nameHi : s.name}</option>)}
                  </Select>
                </Field>
                <Field label={t("auth.gstin")} htmlFor="sw-gstin"><Input id="sw-gstin" name="gstin" maxLength={15} className="uppercase" /></Field>
                <Button type="submit">{t("switcher.create")}</Button>
              </form>
            ) : (
              <button type="button" onClick={() => setAdding(true)} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-primary hover:bg-surface-2">
                <Plus className="size-4" aria-hidden />{t("switcher.addBusiness")}
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
