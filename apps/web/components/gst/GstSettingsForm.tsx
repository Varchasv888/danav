"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { LOCALES } from "@varchasv/i18n/locales";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

export interface GstSettings { filingMethod: "manual" | "provider"; einvoiceEnabled: boolean; ewayBillThreshold: string; bilingualPrint: boolean; printLanguage: string; invoiceTerms: string | null; bankDetails: string | null }

export function GstSettingsForm({ settings, canEdit }: { settings: GstSettings; canEdit: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [filingMethod, setFilingMethod] = useState<"manual" | "provider">(settings.filingMethod ?? "manual");

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    try {
      await api("/gst/settings", {
        method: "PUT",
        body: {
          filingMethod: String(f.get("filingMethod") || "manual"),
          einvoiceEnabled: f.get("einvoice") === "on", bilingualPrint: f.get("bilingual") === "on", printLanguage: String(f.get("printLanguage") || "hi"),
          ewayBillThreshold: String(f.get("threshold") || "50000"),
          invoiceTerms: (f.get("terms") as string) || null, bankDetails: (f.get("bank") as string) || null,
        },
      });
      setStatus("saved");
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  const textarea = "min-h-24 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-ring focus:outline-2 focus:outline-ring/30";
  return (
    <Card className="max-w-3xl">
      <form onSubmit={save} className="flex flex-col gap-5">
        {status === "error" ? <Alert>{t("auth.errors.generic")}</Alert> : null}
        <div className="max-w-sm">
          <Field label={t("gstSettings.filingMethod")} htmlFor="gst-filing-method">
            <Select id="gst-filing-method" name="filingMethod" value={filingMethod} onChange={(e) => setFilingMethod(e.target.value as "manual" | "provider")} disabled={!canEdit}>
              <option value="manual">{t("gstSettings.manualFiling")}</option>
              <option value="provider">{t("gstSettings.simulatorProvider")}</option>
            </Select>
          </Field>
          <p className="mt-1 text-sm text-muted">{t(filingMethod === "manual" ? "gstSettings.manualHint" : "gstSettings.providerHint")}</p>
        </div>
        <label className="flex items-start gap-3">
          <input type="checkbox" name="einvoice" defaultChecked={settings.einvoiceEnabled} disabled={!canEdit} className="mt-1 size-4 accent-[var(--primary)]" />
          <span><span className="font-medium">{t("gstSettings.einvoice")}</span><span className="block text-sm text-muted">{t("gstSettings.einvoiceHint")}</span></span>
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" name="bilingual" defaultChecked={settings.bilingualPrint} disabled={!canEdit} className="size-4 accent-[var(--primary)]" />
          <span className="font-medium">{t("gstSettings.bilingual")}</span>
        </label>
        <div className="max-w-xs">
          <Field label={t("gstSettings.printLanguage")} htmlFor="gst-lang">
            <Select id="gst-lang" name="printLanguage" defaultValue={settings.printLanguage ?? "hi"} disabled={!canEdit}>
              {LOCALES.filter((l) => l.ready && l.code !== "en").map((l) => <option key={l.code} value={l.code}>{l.native} · {l.name}</option>)}
            </Select>
          </Field>
        </div>
        <div className="max-w-xs"><Field label={t("gstSettings.ewbThreshold")} htmlFor="gst-thr"><Input id="gst-thr" name="threshold" defaultValue={Number(settings.ewayBillThreshold)} inputMode="numeric" disabled={!canEdit} className="num" /></Field></div>
        <Field label={t("gstSettings.bank")} htmlFor="gst-bank"><textarea id="gst-bank" name="bank" defaultValue={settings.bankDetails ?? ""} maxLength={500} disabled={!canEdit} className={textarea} /></Field>
        <Field label={t("gstSettings.terms")} htmlFor="gst-terms"><textarea id="gst-terms" name="terms" defaultValue={settings.invoiceTerms ?? ""} maxLength={1000} disabled={!canEdit} className={textarea} /></Field>
        {canEdit ? (
          <div className="flex items-center gap-3">
            <Button type="submit">{t("common.save")}</Button>
            {status === "saved" ? <span className="text-sm text-success">{t("common.saved")}</span> : null}
          </div>
        ) : null}
      </form>
    </Card>
  );
}
