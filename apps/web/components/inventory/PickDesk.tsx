"use client";

import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Button, Card, Input } from "../ui";

export interface PickData {
  id: string; number: string; status: "open" | "done" | "cancelled"; orderId: string; orderNumber: string; customer: string; warehouse: string;
  exceptions: { kind: string; code: string; at: string }[]; acceptedShort: boolean; unplaced: number;
  lines: { id: string; item: string; color: string | null; size: string | null; bin: string | null; toPick: string; picked: string }[];
  missing: { lineId: string; missing: string }[];
}
const q = (v: string) => Number(v).toLocaleString("en-IN", { maximumFractionDigits: 3 });

/**
 * The picking desk: the walk through the bins and a scan box. Every scan is checked against the list: it counts, or it is a wrong
 * item (not on the list) or an extra (that line is already complete). Finishing with lines short needs the short accepted.
 */
export function PickDesk({ data, canEdit }: { data: PickData; canEdit: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState("");
  const [last, setLast] = useState<{ result: "ok" | "wrong" | "extra"; code: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmShort, setConfirmShort] = useState(false);
  const open = data.status === "open";
  const total = data.lines.reduce((s, l) => s + Number(l.toPick), 0), done = data.lines.reduce((s, l) => s + Number(l.picked), 0);

  async function scan(e: React.FormEvent) {
    e.preventDefault();
    const c = code.trim();
    if (!c) return;
    setBusy(true); setError(null);
    try {
      const r = await api<{ result: "ok" | "wrong" | "extra" }>(`/pick-lists/${data.id}/scan`, { body: { code: c } });
      setLast({ result: r.result, code: c }); setCode(""); router.refresh();
    } catch (err) { setError(errorText(t, err, ["picking.errors"])); } finally { setBusy(false); input.current?.focus(); }
  }
  async function finish(acceptShort: boolean) {
    setBusy(true); setError(null);
    try { await api(`/pick-lists/${data.id}/complete`, { body: { acceptShort } }); setConfirmShort(false); router.refresh(); }
    catch (err) { if (err instanceof ApiError && err.code === "lines_missing") setConfirmShort(true); else setError(errorText(t, err, ["picking.errors"])); }
    finally { setBusy(false); }
  }
  async function cancel() {
    setBusy(true); setError(null);
    try { await api(`/pick-lists/${data.id}/cancel`, { body: {} }); router.refresh(); } catch (err) { setError(errorText(t, err, ["picking.errors"])); } finally { setBusy(false); }
  }
  const tone = { ok: "bg-success-soft text-success", wrong: "bg-danger-soft text-danger", extra: "bg-accent-soft text-accent" } as const;

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm">{t("picking.summary", { customer: data.customer, order: data.orderNumber, warehouse: data.warehouse })}</p>
        <p className="num text-sm font-medium">{t("picking.progress", { done: q(String(done)), total: q(String(total)) })}</p>
      </Card>
      {data.unplaced ? <Alert>{t("picking.unplaced", { count: data.unplaced })}</Alert> : null}
      {error ? <Alert>{error}</Alert> : null}
      {open && canEdit ? (
        <Card>
          <form onSubmit={scan} className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1 text-sm"><span className="text-muted">{t("picking.scan")}</span>
              <Input ref={input} value={code} onChange={(e) => setCode(e.target.value)} autoFocus autoComplete="off" spellCheck={false} className="w-72 max-w-full font-mono" aria-describedby="scan-result" />
            </label>
            <Button type="submit" disabled={busy || !code.trim()}>{t("picking.count")}</Button>
          </form>
          <p id="scan-result" role="status" className={clsx("mt-3 min-h-6 rounded px-2 py-1 text-sm", last && tone[last.result])}>
            {last ? t(`picking.result.${last.result}`, { code: last.code }) : ""}
          </p>
        </Card>
      ) : null}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border"><th className="px-4 py-2 font-medium">{t("picking.bin")}</th><th className="px-3 py-2 font-medium">{t("picking.item")}</th><th className="px-3 py-2 text-right font-medium">{t("picking.toPick")}</th><th className="px-3 py-2 text-right font-medium">{t("picking.picked")}</th></tr>
            </thead>
            <tbody>
              {data.lines.map((l) => {
                const complete = Number(l.picked) >= Number(l.toPick);
                return (
                  <tr key={l.id} className={clsx("border-b border-border last:border-0", complete && "bg-success-soft/40")}>
                    <td className="px-4 py-2 font-mono font-semibold">{l.bin ?? <span className="font-sans text-xs font-normal text-danger">{t("picking.noBin")}</span>}</td>
                    <td className="px-3 py-2">{l.item}</td>
                    <td className="num px-3 py-2 text-right">{q(l.toPick)}</td>
                    <td className={clsx("num px-3 py-2 text-right font-medium", !complete && open && "text-danger")}>{q(l.picked)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      {data.exceptions.length ? (
        <Card><h2 className="font-semibold">{t("picking.exceptions")}</h2><ul className="mt-1 text-sm text-danger">{data.exceptions.map((e, i) => <li key={i}>{t(`picking.result.${e.kind}`, { code: e.code })}</li>)}</ul></Card>
      ) : null}
      {confirmShort ? (
        <Alert>
          <span>{t("picking.shortAsk", { count: data.missing.length })}</span>{" "}
          <button type="button" onClick={() => void finish(true)} className="font-medium underline">{t("picking.acceptShort")}</button>
        </Alert>
      ) : null}
      {open && canEdit ? (
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => void finish(false)} disabled={busy}>{t("picking.finish")}</Button>
          <Button variant="ghost" onClick={() => void cancel()} disabled={busy}>{t("picking.cancel")}</Button>
        </div>
      ) : null}
      {data.status === "done" ? (
        <p className="text-sm">{data.acceptedShort ? t("picking.doneShort") : t("picking.done")} <Link href={`/sales/deliveries/new?orderId=${data.orderId}`} className="text-primary hover:underline">{t("picking.makeChallan")}</Link></p>
      ) : null}
    </div>
  );
}
