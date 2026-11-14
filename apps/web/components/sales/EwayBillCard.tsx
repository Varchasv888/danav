"use client";

import clsx from "clsx";
import { Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

export interface EwbState {
  id: string; ewbStatus?: string; ewbNo?: string | null; ewbDate?: string | null; ewbValidUpto?: string | null; vehicleNo?: string | null;
}
type Action = "vehicle" | "extend" | "cancel" | null;

const VEHICLE_REASONS = ["1", "2", "3", "4"] as const;
const EXTEND_REASONS = ["1", "2", "4", "5", "99"] as const;
const CANCEL_REASONS = ["1", "2", "3", "4"] as const;

/** E-way bill on an invoice: generate; then change vehicle (Part-B), extend near expiry, or cancel within 24 hours. */
export function EwayBillCard({ inv, canSubmit, canCancel }: { inv: EwbState; canSubmit: boolean; canCancel: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [action, setAction] = useState<Action>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const active = inv.ewbStatus === "active" && !!inv.ewbNo;

  const run = async (path: string, body: Record<string, unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await api(`/sales-invoices/${inv.id}/eway-bill${path}`, { body });
      setAction(null);
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? (err.issues?.[0]?.message ?? err.code) : "generic";
      const key = [`ewb.errors.${code}`, `sales.errors.${code}`, `einvoice.errors.${code}`].find((k) => t.has(k));
      setError(key ? t(key) : t("auth.errors.generic"));
    } finally {
      setBusy(false);
    }
  };
  const submit = (path: string) => (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const body: Record<string, unknown> = { ...f };
    for (const k of ["distanceKm", "remainingKm"]) if (f[k]) body[k] = Number(f[k]);
    for (const k of ["vehicleNo"]) if (f[k] !== undefined) body[k] = f[k]!.toUpperCase() || undefined;
    void run(path, body);
  };
  const when = (iso?: string | null) => (iso ? format.dateTime(new Date(iso), { dateStyle: "medium", timeStyle: "short" }) : "");
  const vehicleInput = (id: string, required = true) => (
    <Field label={t(required ? "ewb.vehicleNo" : "ewb.newVehicle")} htmlFor={id}>
      <Input id={id} name="vehicleNo" required={required} minLength={6} maxLength={15} className="font-mono uppercase" placeholder="MH12AB1234" />
    </Field>
  );
  const reasonSelect = (id: string, reasons: readonly string[], group: string) => (
    <Field label={t("ewb.reason")} htmlFor={id}>
      <Select id={id} name="reason" defaultValue={reasons[0]}>{reasons.map((r) => <option key={r} value={r}>{t(`ewb.${group}.${r}`)}</option>)}</Select>
    </Field>
  );
  const remark = (id: string) => <Field label={t("ewb.remark")} htmlFor={id}><Input id={id} name="remark" required minLength={3} maxLength={100} /></Field>;
  const formButtons = (danger = false) => (
    <div className="flex gap-3 sm:col-span-2">
      <Button type="submit" variant={danger ? "danger" : "primary"} disabled={busy}>{danger ? t("ewb.cancel") : t("ewb.save")}</Button>
      <Button type="button" variant="ghost" onClick={() => setAction(null)}>{t("common.close")}</Button>
    </div>
  );
  const tab = (a: Exclude<Action, null>, label: string) => (
    <button type="button" onClick={() => { setAction(action === a ? null : a); setError(null); }}
      className={clsx("rounded-lg border px-3 py-1.5 text-sm font-medium", action === a ? "border-primary bg-primary-soft text-primary" : "border-border hover:bg-surface-2", a === "cancel" && action !== a && "text-danger")}>
      {label}
    </button>
  );

  return (
    <Card>
      <h2 className="flex items-center gap-2 font-semibold">
        <Truck className="size-4 text-primary" aria-hidden />{t("ewb.title")}
        {inv.ewbStatus && inv.ewbStatus !== "none" ? <span className="text-sm font-normal text-muted">· {t(`ewb.status.${inv.ewbStatus}`)}</span> : null}
      </h2>
      {error ? <div className="mt-3"><Alert>{error}</Alert></div> : null}

      {active ? (
        <>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            <dt className="text-muted">{t("ewb.number")}</dt><dd className="font-mono">{inv.ewbNo}</dd>
            <dt className="text-muted">{t("ewb.vehicleNo")}</dt><dd className="font-mono">{inv.vehicleNo}</dd>
            <dt className="text-muted">{t("ewb.validUpto")}</dt><dd>{when(inv.ewbValidUpto)}</dd>
          </dl>
          <div className="mt-3"><a href={`/print/eway-bill/${inv.id}`} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center rounded-lg border border-border px-3 text-sm font-medium hover:bg-surface-2">{t("ewb.print")}</a></div>
          {canSubmit || canCancel ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {canSubmit ? tab("vehicle", t("ewb.changeVehicle")) : null}
              {canSubmit ? tab("extend", t("ewb.extend")) : null}
              {canCancel ? tab("cancel", t("ewb.cancel")) : null}
            </div>
          ) : null}
          {action === "vehicle" ? (
            <form onSubmit={submit("/vehicle")} className="mt-4 grid gap-3 sm:grid-cols-2">
              {vehicleInput("ewb-v-no")}
              <Field label={t("ewb.currentPlace")} htmlFor="ewb-v-place"><Input id="ewb-v-place" name="fromPlace" required minLength={2} maxLength={50} /></Field>
              {reasonSelect("ewb-v-reason", VEHICLE_REASONS, "vehicleReasons")}
              {remark("ewb-v-remark")}
              {formButtons()}
            </form>
          ) : null}
          {action === "extend" ? (
            <form onSubmit={submit("/extend")} className="mt-4 grid gap-3 sm:grid-cols-2">
              <p className="text-xs text-muted sm:col-span-2">{t("ewb.extendHint")}</p>
              <Field label={t("ewb.currentPlace")} htmlFor="ewb-x-place"><Input id="ewb-x-place" name="fromPlace" required minLength={2} maxLength={50} /></Field>
              <Field label={t("ewb.currentPincode")} htmlFor="ewb-x-pin"><Input id="ewb-x-pin" name="fromPincode" required inputMode="numeric" pattern="[1-9][0-9]{5}" className="num" /></Field>
              <Field label={t("ewb.remainingKm")} htmlFor="ewb-x-km"><Input id="ewb-x-km" name="remainingKm" required inputMode="numeric" pattern="\d{1,4}" className="num" /></Field>
              {vehicleInput("ewb-x-no", false)}
              {reasonSelect("ewb-x-reason", EXTEND_REASONS, "extendReasons")}
              {remark("ewb-x-remark")}
              {formButtons()}
            </form>
          ) : null}
          {action === "cancel" ? (
            <form onSubmit={submit("/cancel")} className="mt-4 grid gap-3 sm:grid-cols-2">
              <p className="text-xs text-muted sm:col-span-2">{t("ewb.cancelHint")}</p>
              {reasonSelect("ewb-c-reason", CANCEL_REASONS, "cancelReasons")}
              {remark("ewb-c-remark")}
              {formButtons(true)}
            </form>
          ) : null}
        </>
      ) : canSubmit ? (
        <>
          {inv.ewbStatus === "cancelled" && inv.ewbNo ? <p className="mt-2 text-sm text-muted">{t("ewb.cancelledNote", { number: inv.ewbNo })}</p> : null}
          <form className="mt-3 grid items-end gap-3 sm:grid-cols-[1fr_140px_auto]" onSubmit={submit("")}>
            {vehicleInput("ewb-veh")}
            <Field label={t("ewb.distance")} htmlFor="ewb-km"><Input id="ewb-km" name="distanceKm" required inputMode="numeric" pattern="\d{1,4}" className="num" /></Field>
            <Button type="submit" disabled={busy}>{t("ewb.generate")}</Button>
          </form>
        </>
      ) : null}
    </Card>
  );
}
