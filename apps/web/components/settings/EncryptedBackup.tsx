"use client";

import { Lock, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Button, Field, Input } from "../ui";

interface Check { ok: boolean; business: string; madeOn: string; tables: number; rows: number; files: number; problems: string[] }

/** A backup locked with a passphrase for off-site storage, and the drill that opens one and checks it is whole. */
export function EncryptedBackup() {
  const t = useTranslations();
  const [pass, setPass] = useState("");
  const [drillPass, setDrillPass] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Check | null>(null);
  const [copy, setCopy] = useState<{ tenantId: string; name: string; tables: number; rows: number; problems: string[]; books: { matches: boolean } } | null>(null);

  async function download(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/export/business.vbk", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ passphrase: pass }) });
      if (!res.ok) throw new Error("failed");
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = /filename="([^"]+)"/.exec(res.headers.get("content-disposition") ?? "")?.[1] ?? "varchasv-backup.vbk";
      a.click();
      URL.revokeObjectURL(a.href);
      setPass("");
    } catch { setError(t("backup.encFailed")); } finally { setBusy(false); }
  }

  async function drill(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      let bin = "";
      for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
      setResult(await api<Check>("/export/verify", { body: { passphrase: drillPass, dataBase64: btoa(bin) } }));
    } catch (err) { setError(errorText(t, err, ["backup.errors"])); } finally { setBusy(false); }
  }

  async function restoreTest(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    setCopy(null);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      let bin = "";
      for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
      setCopy(await api<NonNullable<typeof copy>>("/export/restore-test", { body: { passphrase: drillPass, dataBase64: btoa(bin) } }));
    } catch (err) { setError(errorText(t, err, ["backup.errors"])); } finally { setBusy(false); }
  }

  return (
    <div className="flex flex-col gap-4 border-t border-border pt-4">
      <form onSubmit={download} method="post" className="flex flex-col gap-2">
        <h2 className="font-semibold">{t("backup.encTitle")}</h2>
        <p className="text-[0.9286rem] text-muted">{t("backup.encHelp")}</p>
        <div className="flex flex-wrap items-end gap-3">
          <Field label={t("backup.passphrase")} htmlFor="bk-pass"><Input id="bk-pass" type="password" autoComplete="new-password" value={pass} onChange={(e) => setPass(e.target.value)} minLength={12} className="w-72" /></Field>
          <Button type="submit" disabled={busy || pass.length < 12}><Lock className="size-4" aria-hidden />{t("backup.encDownload")}</Button>
        </div>
        <p className="text-xs text-muted">{t("backup.encWarning")}</p>
      </form>
      <div className="flex flex-col gap-2">
        <h2 className="font-semibold">{t("backup.drillTitle")}</h2>
        <p className="text-[0.9286rem] text-muted">{t("backup.drillHelp")}</p>
        <div className="flex flex-wrap items-end gap-3">
          <Field label={t("backup.passphrase")} htmlFor="bk-drill-pass"><Input id="bk-drill-pass" type="password" autoComplete="off" value={drillPass} onChange={(e) => setDrillPass(e.target.value)} className="w-72" /></Field>
          <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-border bg-surface px-4 text-[0.9286rem] font-semibold text-primary hover:bg-primary-soft">
            <Upload className="size-4" aria-hidden />{busy ? t("backup.checking") : t("backup.drillChoose")}
            <input type="file" accept=".vbk" className="sr-only" disabled={busy || !drillPass} onChange={(e) => { void drill(e.target.files?.[0]); e.target.value = ""; }} />
          </label>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="font-semibold">{t("backup.restoreTitle")}</h2>
        <p className="text-[0.9286rem] text-muted">{t("backup.restoreHelp")}</p>
        <label className="inline-flex h-9 w-fit cursor-pointer items-center gap-2 rounded-md border border-border bg-surface px-4 text-[0.9286rem] font-semibold text-primary hover:bg-primary-soft">
          <Upload className="size-4" aria-hidden />{busy ? t("backup.restoring") : t("backup.restoreChoose")}
          <input type="file" accept=".vbk" className="sr-only" disabled={busy || !drillPass} onChange={(e) => { void restoreTest(e.target.files?.[0]); e.target.value = ""; }} />
        </label>
      </div>
      {copy && copy.problems.length === 0 ? <div role="status" className="rounded-md border border-success/30 bg-success-soft px-3 py-2 text-[0.9286rem] text-success">{t("backup.restoreOk", { name: copy.name, tables: copy.tables, rows: copy.rows })}</div> : null}
      {copy && copy.problems.length ? <Alert>{t("backup.restoreBad")} {copy.problems.join("; ")}</Alert> : null}
      {error ? <Alert>{error}</Alert> : null}
      {result?.ok ? <div role="status" className="rounded-md border border-success/30 bg-success-soft px-3 py-2 text-[0.9286rem] text-success">{t("backup.drillOk", { business: result.business, date: result.madeOn, tables: result.tables, rows: result.rows.toLocaleString("en-IN") })}</div> : null}
      {result && !result.ok ? <Alert>{t("backup.drillBad")} {result.problems.join("; ")}</Alert> : null}
    </div>
  );
}
