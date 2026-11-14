"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Badge, Card } from "../ui";

export interface DeviceRow { id: string; name: string; code: string; platform: string; lastSeenAt: string | null; revokedAt: string | null; openRejections: number }
export interface Rejection { id: string; deviceId: string; device: string; deviceCode: string; opId: string; kind: string | null; error: string; payload: unknown; status: "open" | "resolved"; note: string | null; createdAt: string }

const NS = ["devicesPage.errors"];

/** A short, readable line for what the device was trying to do. */
function describe(p: unknown): string {
  if (!p || typeof p !== "object") return "";
  const o = (p as { payload?: Record<string, unknown> }).payload ?? (p as Record<string, unknown>);
  const bits = [o.number, o.name, o.type, o.date, o.narration].filter((x) => typeof x === "string" && x) as string[];
  return bits.slice(0, 4).join(" · ");
}

/** The devices that sync with this business, and the changes the server refused. */
export function Devices({ devices, rejections, show, canEdit }: { devices: DeviceRow[]; rejections: Rejection[]; show: "open" | "resolved"; canEdit: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const when = (iso: string | null) => (iso ? format.dateTime(new Date(iso), { dateStyle: "medium", timeStyle: "short" }) : t("devicesPage.neverSeen"));
  const call = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try { await fn(); router.refresh(); } catch (err) { setError(errorText(t, err, NS)); } finally { setBusy(false); }
  };
  const why = (code: string) => (t.has(`devicesPage.errors.${code}`) ? t(`devicesPage.errors.${code}`) : code);

  return (
    <div className="flex flex-col gap-4">
      {error ? <Alert>{error}</Alert> : null}
      <Card className="p-0">
        <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("devicesPage.devices")}</h2>
        {devices.length ? (
          <ul>
            {devices.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-rule px-4 py-2.5 text-[0.9286rem] last:border-0">
                <span className="font-mono text-xs text-muted">{d.code}</span>
                <span className="font-medium">{d.name}</span>
                <span className="text-muted">{d.platform}</span>
                <Badge tone={d.revokedAt ? "danger" : "success"}>{d.revokedAt ? t("devicesPage.revoked") : t("devicesPage.active")}</Badge>
                <span className="text-muted">{t("devicesPage.lastSeen", { when: when(d.lastSeenAt) })}</span>
                {d.openRejections ? <Badge tone="warning">{t("devicesPage.refused", { n: d.openRejections })}</Badge> : null}
                {canEdit && !d.revokedAt ? (
                  <button type="button" disabled={busy} className="ml-auto text-primary hover:underline"
                    onClick={() => { if (window.confirm(t("devicesPage.revokeConfirm", { name: d.name }))) void call(() => api(`/devices/${d.id}/revoke`, { body: {} })); }}>{t("devicesPage.revoke")}</button>
                ) : null}
              </li>
            ))}
          </ul>
        ) : <p className="px-4 py-6 text-center text-muted">{t("devicesPage.none")}</p>}
      </Card>

      <Card className="p-0">
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-2">
          <h2 className="text-sm font-semibold">{t("devicesPage.queue")}</h2>
          <Link href="/settings/devices" className={show === "open" ? "font-semibold text-primary" : "text-muted hover:underline"}>{t("devicesPage.showOpen")}</Link>
          <Link href="/settings/devices?show=done" className={show === "resolved" ? "font-semibold text-primary" : "text-muted hover:underline"}>{t("devicesPage.showDone")}</Link>
        </div>
        <p className="px-4 pt-2 text-xs text-muted">{t("devicesPage.queueHelp")}</p>
        {rejections.length ? (
          <ul>
            {rejections.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-rule px-4 py-2.5 text-sm last:border-0">
                <span className="whitespace-nowrap text-muted">{when(r.createdAt)}</span>
                <span className="font-mono text-xs">{r.deviceCode}</span>
                <span className="font-medium">{r.kind ?? "?"}</span>
                <span className="text-muted">{describe(r.payload)}</span>
                <span className="text-danger">{why(r.error)}</span>
                {r.status === "resolved" && r.note ? <span className="text-muted">{t("devicesPage.done", { note: r.note })}</span> : null}
                {canEdit && r.status === "open" ? (
                  <button type="button" disabled={busy} className="ml-auto text-primary hover:underline"
                    onClick={() => { const note = window.prompt(t("devicesPage.settleNote")); if (note !== null) void call(() => api(`/sync/rejections/${r.id}/resolve`, { body: { note: note.trim() || undefined } })); }}>{t("devicesPage.settle")}</button>
                ) : null}
              </li>
            ))}
          </ul>
        ) : <p className="px-4 py-6 text-center text-muted">{t("devicesPage.queueNone")}</p>}
      </Card>
    </div>
  );
}
