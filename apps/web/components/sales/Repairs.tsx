"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { rupees, todayIso } from "@/lib/format";
import { StatusBadge } from "../StatusBadge";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

export interface Repair {
  id: string; number: string; receivedOn: string; customerName: string; customerPhone: string | null; itemDescription: string; complaint: string | null; diagnosis: string | null;
  warranty: boolean; estimate: string | null; deposit: string; finalCharge: string | null; status: string; promisedOn: string | null; reason: string | null; sourceNumber?: string | null;
}
const STATUSES = ["received", "estimated", "approved", "in_repair", "ready", "delivered", "declined", "cancelled"] as const;
const TONE: Record<string, string> = { received: "open", estimated: "partial", approved: "accepted", in_repair: "released", ready: "billed", delivered: "closed", declined: "cancelled", cancelled: "cancelled" };
const MONEY = /^\d*\.?\d{0,2}$/;

/** Repairs list with an intake form; each open repair shows the one next step that is allowed. */
export function Repairs({ rows, status, q, canCreate, canEdit }: { rows: Repair[]; status: string; q: string; canCreate: boolean; canEdit: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ customerName: "", customerPhone: "", itemDescription: "", complaint: "", deposit: "", promisedOn: "", warranty: false });
  const [sale, setSale] = useState<{ kind: "order" | "invoice" | "bill"; id: string; number: string } | null>(null);
  const [saleNo, setSaleNo] = useState("");
  const [acting, setActing] = useState<string | null>(null);
  const [value, setValue] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const day = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });

  async function call(fn: () => Promise<unknown>, done?: () => void) {
    setBusy(true);
    setError(null);
    try { await fn(); done?.(); router.refresh(); } catch (err) { setError(errorText(t, err, ["repairs.errors"])); } finally { setBusy(false); }
  }
  const create = (e: React.FormEvent) => {
    e.preventDefault();
    void call(() => api("/repairs", { body: { receivedOn: todayIso(), customerName: f.customerName, customerPhone: f.customerPhone || undefined, itemDescription: f.itemDescription, complaint: f.complaint || undefined, deposit: f.deposit || undefined, promisedOn: f.promisedOn || undefined, warranty: f.warranty, ...(sale ? { source: { kind: sale.kind, id: sale.id } } : {}) } }),
      () => { setOpen(false); setSale(null); setSaleNo(""); setF({ customerName: "", customerPhone: "", itemDescription: "", complaint: "", deposit: "", promisedOn: "", warranty: false }); });
  };
  const fillFromSale = () => call(async () => {
    const s = await api<{ kind: "order" | "invoice" | "bill"; id: string; number: string; customerName: string; customerPhone: string | null; items: string[] }>(`/repairs/from-sale?number=${encodeURIComponent(saleNo.trim())}`);
    setSale({ kind: s.kind, id: s.id, number: s.number });
    setF((x) => ({ ...x, customerName: s.customerName || x.customerName, customerPhone: s.customerPhone ?? x.customerPhone, itemDescription: x.itemDescription || s.items.join(", ") }));
  });
  const send = (r: Repair, body: Record<string, unknown>) => void call(() => api(`/repairs/${r.id}/act`, { body }), () => { setActing(null); setValue(""); setText(""); });
  const next = (r: Repair) => {
    const btn = (label: string, onClick: () => void, variant: "primary" | "outline" = "primary") => <Button key={label} type="button" variant={variant === "primary" ? undefined : "outline"} disabled={busy} onClick={onClick}>{label}</Button>;
    const ask = (key: string, label: string, ok: () => void) => acting === `${r.id}:${key}` ? (
      <div key={key} className="flex flex-wrap items-end gap-2">
        {key === "estimate" || key === "ready" ? <Field label={t("repairs.amount")} htmlFor={`rp-v-${r.id}`}><Input id={`rp-v-${r.id}`} inputMode="decimal" value={value} onChange={(e) => MONEY.test(e.target.value) && setValue(e.target.value)} className="num w-32 text-right" /></Field> : null}
        {key === "deliver" ? <Field label={t("repairs.gstRate")} htmlFor={`rp-g-${r.id}`}><Input id={`rp-g-${r.id}`} inputMode="decimal" value={value} onChange={(e) => MONEY.test(e.target.value) && setValue(e.target.value)} className="w-24" /></Field> : null}
        {key === "decline" || key === "cancel" ? <Field label={t("repairs.reason")} htmlFor={`rp-t-${r.id}`}><Input id={`rp-t-${r.id}`} value={text} onChange={(e) => setText(e.target.value)} maxLength={200} className="w-56" /></Field> : null}
        <Button type="button" disabled={busy} onClick={ok}>{label}</Button>
        <Button type="button" variant="ghost" onClick={() => setActing(null)}>{t("common.cancel")}</Button>
      </div>
    ) : btn(label, () => { setActing(`${r.id}:${key}`); setValue(key === "deliver" ? "18" : r.estimate ? String(Number(r.estimate)) : ""); setText(""); }, key === "decline" || key === "cancel" ? "outline" : "primary");
    const out: React.ReactNode[] = [];
    if (r.status === "received") {
      if (r.warranty) out.push(btn(t("repairs.start"), () => send(r, { action: "start" })));
      else out.push(ask("estimate", t("repairs.giveEstimate"), () => send(r, { action: "estimate", estimate: value || "0" })));
      if (!r.warranty) out.push(ask("decline", t("repairs.decline"), () => send(r, { action: "decline", reason: text })));
    }
    if (r.status === "estimated") { out.push(btn(t("repairs.approve"), () => send(r, { action: "approve" }))); out.push(ask("decline", t("repairs.decline"), () => send(r, { action: "decline", reason: text }))); }
    if (r.status === "approved") out.push(btn(t("repairs.start"), () => send(r, { action: "start" })));
    if (r.status === "in_repair") out.push(ask("ready", t("repairs.markReady"), () => send(r, { action: "ready", ...(value && !r.warranty ? { finalCharge: value } : {}) })));
    if (r.status === "ready") out.push(r.warranty ? btn(t("repairs.deliver"), () => send(r, { action: "deliver", date: todayIso() })) : ask("deliver", t("repairs.deliver"), () => send(r, { action: "deliver", date: todayIso(), gstRate: value || "0" })));
    if (!["delivered", "declined", "cancelled"].includes(r.status)) out.push(ask("cancel", t("repairs.cancelJob"), () => send(r, { action: "cancel", reason: text })));
    return out;
  };

  return (
    <div className="flex flex-col gap-4">
      {error ? <Alert>{error}</Alert> : null}
      <form method="get" className="flex flex-wrap items-end gap-3">
        <Field label={t("repairs.search")} htmlFor="rp-q"><Input id="rp-q" name="q" defaultValue={q} className="w-64" /></Field>
        <Field label={t("repairs.statusLabel")} htmlFor="rp-status"><Select id="rp-status" name="status" defaultValue={status} className="w-44"><option value="">{t("repairs.all")}</option>{STATUSES.map((s) => <option key={s} value={s}>{t(`repairs.status.${s}`)}</option>)}</Select></Field>
        <Button type="submit" variant="outline">{t("repairs.find")}</Button>
        {canCreate && !open ? <Button type="button" onClick={() => setOpen(true)}>{t("repairs.new")}</Button> : null}
      </form>
      {open ? (
        <form onSubmit={create} method="post" className="grid gap-3 rounded-md border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-4">
            <Field label={t("repairs.fromSale")} htmlFor="rp-sale" hint={sale ? t("repairs.linkedTo", { number: sale.number }) : t("repairs.fromSaleHint")}><Input id="rp-sale" value={saleNo} onChange={(e) => setSaleNo(e.target.value)} maxLength={30} /></Field>
            <Button type="button" variant="outline" disabled={busy || !saleNo.trim()} onClick={fillFromSale}>{t("repairs.fillIn")}</Button>
          </div>
          <Field label={t("repairs.customer")} htmlFor="rp-cust"><Input id="rp-cust" value={f.customerName} onChange={(e) => setF({ ...f, customerName: e.target.value })} maxLength={80} required /></Field>
          <Field label={t("repairs.phone")} htmlFor="rp-phone"><Input id="rp-phone" inputMode="numeric" value={f.customerPhone} onChange={(e) => setF({ ...f, customerPhone: e.target.value.replace(/\D/g, "").slice(0, 10) })} /></Field>
          <div className="sm:col-span-2"><Field label={t("repairs.item")} htmlFor="rp-item"><Input id="rp-item" value={f.itemDescription} onChange={(e) => setF({ ...f, itemDescription: e.target.value })} maxLength={300} required /></Field></div>
          <div className="sm:col-span-2"><Field label={t("repairs.complaint")} htmlFor="rp-comp"><Input id="rp-comp" value={f.complaint} onChange={(e) => setF({ ...f, complaint: e.target.value })} maxLength={500} /></Field></div>
          <Field label={t("repairs.deposit")} htmlFor="rp-dep"><Input id="rp-dep" inputMode="decimal" value={f.deposit} onChange={(e) => MONEY.test(e.target.value) && setF({ ...f, deposit: e.target.value })} className="num text-right" /></Field>
          <Field label={t("repairs.promised")} htmlFor="rp-prom"><Input id="rp-prom" type="date" value={f.promisedOn} onChange={(e) => setF({ ...f, promisedOn: e.target.value })} /></Field>
          <label className="flex items-center gap-2 text-[0.9286rem] sm:col-span-2"><input type="checkbox" className="size-4" checked={f.warranty} onChange={(e) => setF({ ...f, warranty: e.target.checked })} />{t("repairs.warranty")}</label>
          <div className="flex gap-3 sm:col-span-2 lg:col-span-4"><Button type="submit" disabled={busy}>{t("repairs.takeIn")}</Button><Button type="button" variant="ghost" onClick={() => setOpen(false)}>{t("common.close")}</Button></div>
        </form>
      ) : null}
      <Card className="p-0">
        {rows.length ? (
          <ul>
            {rows.map((r) => (
              <li key={r.id} className="border-b border-rule px-4 py-3 text-sm last:border-0">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="font-mono text-primary">{r.number}</span>{r.sourceNumber ? <span className="text-xs text-muted">{t("repairs.fromNumber", { number: r.sourceNumber })}</span> : null}<span className="font-medium">{r.customerName}</span>{r.customerPhone ? <span className="font-mono text-xs text-muted">{r.customerPhone}</span> : null}
                  <StatusBadge status={TONE[r.status] ?? "open"} label={t(`repairs.status.${r.status}`)} />
                  {r.warranty ? <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent">{t("repairs.underWarranty")}</span> : null}
                  <span className="text-muted">{day(r.receivedOn)}{r.promisedOn ? `, ${t("repairs.promisedOn", { date: day(r.promisedOn) })}` : ""}</span>
                </div>
                <p className="mt-1">{r.itemDescription}{r.complaint ? <span className="text-muted">: {r.complaint}</span> : null}</p>
                {r.diagnosis ? <p className="text-muted">{t("repairs.diagnosis")}: {r.diagnosis}</p> : null}
                <p className="text-xs text-muted">
                  {r.estimate ? `${t("repairs.estimate")} ${rupees(r.estimate)}. ` : ""}{Number(r.deposit) ? `${t("repairs.deposit")} ${rupees(r.deposit)}. ` : ""}{r.finalCharge ? `${t("repairs.charge")} ${rupees(r.finalCharge)}. ` : ""}{r.reason ?? ""}
                </p>
                {canEdit ? <div className="mt-2 flex flex-wrap gap-2">{next(r)}</div> : null}
              </li>
            ))}
          </ul>
        ) : <p className="px-4 py-8 text-center text-muted">{t("repairs.empty")}</p>}
      </Card>
    </div>
  );
}
