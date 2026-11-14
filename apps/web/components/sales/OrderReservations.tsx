"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Button } from "../ui";

export interface ReservationData {
  orderId: string; status: string;
  lines: { lineId: string; item: string; color: string | null; size: string | null; ordered: string; done: string; held: string; toGet: string; freeNow: string;
    substitutes: { itemId: string; name: string; free: string; covers: boolean }[] }[];
}
const q = (v: string) => Number(v).toLocaleString("en-IN", { maximumFractionDigits: 3 });

/**
 * Stock set aside for this order: what each line has been given, what is still short, and other items of the same style that
 * could fill a shortage. Setting aside takes only what is free; releasing lets go of it.
 */
export function OrderReservations({ data, canEdit, canPick = false, warehouses = [] }: { data: ReservationData; canEdit: boolean; canPick?: boolean; warehouses?: { id: string; name: string }[] }) {
  const t = useTranslations();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const anyHeld = data.lines.some((l) => Number(l.held) > 0);
  const anyShort = data.lines.some((l) => Number(l.toGet) > 0);
  const [godown, setGodown] = useState(warehouses[0]?.id ?? "");

  async function makePickList() {
    setBusy(true); setError(null);
    try { const r = await api<{ id: string }>("/pick-lists", { body: { orderId: data.orderId, warehouseId: godown } }); router.push(`/inventory/pick-lists/${r.id}`); }
    catch (err) { setError(errorText(t, err, ["picking.errors"])); setBusy(false); }
  }

  async function act(path: "reserve" | "release") {
    setBusy(true); setError(null);
    try { await api(`/sales-orders/${data.orderId}/${path}`, { body: {} }); router.refresh(); } catch (err) { setError(errorText(t, err, ["reservations.errors"])); } finally { setBusy(false); }
  }
  return (
    <section aria-label={t("reservations.title")} className="mt-4 overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <h2 className="font-semibold">{t("reservations.title")}</h2>
          <p className="mt-0.5 text-sm text-muted">{t("reservations.help")}</p>
        </div>
        {canEdit ? (
          <div className="flex gap-2">
            {anyShort ? <Button onClick={() => void act("reserve")} disabled={busy}>{t("reservations.reserve")}</Button> : null}
            {anyHeld && canPick && warehouses.length ? (
              <>
                {warehouses.length > 1 ? <select value={godown} onChange={(e) => setGodown(e.target.value)} aria-label={t("picking.godown")} className="h-10 rounded-lg border border-border-input bg-surface px-2 text-sm">{warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}</select> : null}
                <Button variant="outline" onClick={() => void makePickList()} disabled={busy}>{t("picking.make")}</Button>
              </>
            ) : null}
            {anyHeld ? <Button variant="outline" onClick={() => void act("release")} disabled={busy}>{t("reservations.release")}</Button> : null}
          </div>
        ) : null}
      </div>
      {error ? <div className="px-4 pt-3"><Alert>{error}</Alert></div> : null}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="text-left text-muted">
            <tr className="border-b border-border">
              <th className="px-4 py-2 font-medium">{t("reservations.item")}</th>
              <th className="px-3 py-2 text-right font-medium">{t("reservations.ordered")}</th>
              <th className="px-3 py-2 text-right font-medium">{t("reservations.sent")}</th>
              <th className="px-3 py-2 text-right font-medium">{t("reservations.held")}</th>
              <th className="px-3 py-2 text-right font-medium">{t("reservations.toGet")}</th>
              <th className="px-3 py-2 text-right font-medium">{t("reservations.free")}</th>
            </tr>
          </thead>
          <tbody>
            {data.lines.map((l) => (
              <tr key={l.lineId} className="border-b border-border last:border-0">
                <td className="px-4 py-2 align-top">
                  <span className="font-medium">{l.item}</span>
                  {l.substitutes.length ? (
                    <span className="mt-1 block text-xs text-muted">
                      {t("reservations.instead")} {l.substitutes.map((s) => `${s.name} (${q(s.free)}${s.covers ? ", " + t("reservations.covers") : ""})`).join("; ")}
                    </span>
                  ) : null}
                </td>
                <td className="num px-3 py-2 text-right align-top">{q(l.ordered)}</td>
                <td className="num px-3 py-2 text-right align-top">{q(l.done)}</td>
                <td className="num px-3 py-2 text-right align-top font-medium">{q(l.held)}</td>
                <td className={`num px-3 py-2 text-right align-top ${Number(l.toGet) > 0 ? "font-medium text-danger" : ""}`}>{q(l.toGet)}</td>
                <td className="num px-3 py-2 text-right align-top text-muted">{q(l.freeNow)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
