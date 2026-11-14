"use client";

import { CheckCircle2, PlugZap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { rupees } from "@/lib/format";
import { Alert, Button, Card, Field, Input } from "../ui";

export interface PortalStatus { gstin: string; provider: string; testOtp?: string; connected: boolean; username: string | null; expiresAt: string | null }
export interface Filing { returnType: "GSTR1" | "GSTR3B"; period: string; status: "uploaded" | "filed"; uploadedAt: string; filedAt: string | null; arn: string | null }

function useAction() {
  const t = useTranslations();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = async (path: string, body: unknown, after?: () => void) => {
    setBusy(true);
    setError(null);
    try {
      await api(path, { body });
      after?.();
      router.refresh();
      return true;
    } catch (err) {
      const code = err instanceof ApiError ? (err.issues?.[0]?.message ?? err.code) : "generic";
      const key = [`filing.errors.${code}`, `einvoice.errors.${code}`].find((k) => t.has(k));
      setError(key ? t(key) : t("auth.errors.generic"));
      return false;
    } finally {
      setBusy(false);
    }
  };
  return { busy, error, run };
}

/** Log in to the GST portal (username + OTP) so returns can be uploaded and filed for a few hours. */
export function PortalConnection({ status, canConnect }: { status: PortalStatus; canConnect: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const { busy, error, run } = useAction();
  const [username, setUsername] = useState(status.username ?? "");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 font-semibold"><PlugZap className="size-4 text-primary" aria-hidden />{t("filing.portal")} <span className="font-mono text-sm font-normal text-muted">{status.gstin}</span></h2>
          {status.provider === "simulator" ? <p className="mt-1 text-sm text-muted">{t("gstSettings.providerHint")}</p> : null}
          {status.connected ? (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-success"><CheckCircle2 className="size-4" aria-hidden />
              {t("filing.connected", { username: status.username ?? "", time: format.dateTime(new Date(status.expiresAt!), { timeStyle: "short" }) })}
            </p>
          ) : <p className="mt-1 text-sm text-muted">{t("filing.portalHint")}</p>}
          {status.testOtp && !status.connected ? <p className="mt-1 text-xs text-muted">{t("filing.simulatorOtp", { otp: status.testOtp })}</p> : null}
        </div>
        {status.connected && canConnect ? <Button variant="ghost" disabled={busy} onClick={() => run("/gst/portal/disconnect", {})}>{t("filing.disconnect")}</Button> : null}
      </div>
      {!status.connected && canConnect ? (
        <form className="mt-4 grid items-end gap-3 sm:grid-cols-[1fr_auto_160px_auto]"
          onSubmit={(e) => { e.preventDefault(); void (otpSent ? run("/gst/portal/connect", { username, otp }, () => { setOtp(""); setOtpSent(false); }) : run("/gst/portal/otp", { username }, () => setOtpSent(true))); }}>
          <Field label={t("filing.username")} htmlFor="gst-user"><Input id="gst-user" value={username} onChange={(e) => { setUsername(e.target.value); setOtpSent(false); }} required minLength={3} maxLength={60} autoComplete="username" /></Field>
          {otpSent ? <span /> : <Button type="submit" variant="outline" disabled={busy}>{t("filing.sendOtp")}</Button>}
          {otpSent ? <Field label={t("filing.otp")} htmlFor="gst-otp"><Input id="gst-otp" value={otp} onChange={(e) => setOtp(e.target.value)} required inputMode="numeric" pattern="\d{6}" maxLength={6} autoComplete="one-time-code" className="num" autoFocus /></Field> : null}
          {otpSent ? <Button type="submit" disabled={busy}>{t("filing.connect")}</Button> : null}
        </form>
      ) : null}
      {error ? <div className="mt-3"><Alert>{error}</Alert></div> : null}
    </Card>
  );
}

/** Upload one return, then file it with an EVC (OTP to the authorised signatory). */
export function FileReturn({ returnType, period, filing, connected, canUpload, canFile, cashPayable }: {
  returnType: "GSTR1" | "GSTR3B"; period: string; filing: Filing | undefined; connected: boolean; canUpload: boolean; canFile: boolean; cashPayable?: string;
}) {
  const t = useTranslations();
  const format = useFormatter();
  const { busy, error, run } = useAction();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const body = { returnType, period };
  const when = (iso: string) => format.dateTime(new Date(iso), { dateStyle: "medium", timeStyle: "short" });

  if (filing?.status === "filed") {
    return (
      <p className="flex items-center gap-1.5 text-sm text-success">
        <CheckCircle2 className="size-4" aria-hidden />{t("filing.filed", { time: when(filing.filedAt!) })} · {t("filing.arn")} <span className="font-mono">{filing.arn}</span>
      </p>
    );
  }
  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <span className="text-xs text-muted">{filing ? t("filing.uploaded", { time: when(filing.uploadedAt) }) : t("filing.notUploaded")}</span>
        {canUpload ? (
          <Button variant="outline" disabled={busy || !connected} title={connected ? undefined : t("filing.errors.gst_session_required")}
            onClick={() => run("/gst/filings/upload", body, () => setOtpSent(false))}>
            {filing ? t("filing.uploadAgain") : t("filing.upload")}
          </Button>
        ) : null}
        {filing && canFile && !otpSent ? <Button disabled={busy || !connected} onClick={() => run("/gst/filings/otp", body, () => setOtpSent(true))}>{t("filing.getOtp")}</Button> : null}
      </div>
      {filing && canFile && otpSent ? (
        <form className="flex items-end gap-2" onSubmit={(e) => { e.preventDefault(); void run("/gst/filings/file", { ...body, otp }, () => { setOtp(""); setOtpSent(false); }); }}>
          <Field label={t("filing.otp")} htmlFor={`evc-${returnType}`} hint={t("filing.evcHint")}>
            <Input id={`evc-${returnType}`} value={otp} onChange={(e) => setOtp(e.target.value)} required inputMode="numeric" pattern="\d{6}" maxLength={6} autoComplete="one-time-code" className="num w-36" autoFocus />
          </Field>
          <Button type="submit" disabled={busy}>{t("filing.file")}</Button>
        </form>
      ) : null}
      {cashPayable && Number(cashPayable) > 0 && filing && canFile ? <p className="max-w-md text-right text-xs text-muted">{t("filing.cashNote", { amount: rupees(cashPayable) })}</p> : null}
      {error ? <div className="max-w-md"><Alert>{error}</Alert></div> : null}
    </div>
  );
}
