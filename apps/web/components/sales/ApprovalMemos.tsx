"use client";

import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { todayIso } from "@/lib/format";
import { Alert, Badge, Button, Card, Field, Input, Select } from "../ui";

interface Option { id: string; name: string }
interface Memo { id: string; number: string; date: string; store: string; customerName: string; customerPhone: string | null; dueBack: string | null; piecesOut: string; valueOut: string; overdue: boolean }
interface Detail { id: string; number: string; lines: { id: string; name: string; qty: string; rate: string; outQty: string }[] }

const NS = ["memos.errors"];

/** Goods out on approval: hand some to a customer, take pieces back, or bill what the customer keeps. */
export function ApprovalMemos({ stores, items, memos, canCreate, canEdit }: { stores: Option[]; items: Option[]; memos: Memo[]; canCreate: boolean; canEdit: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const [f, setF] = useState({ warehouseId: stores[0]?.id ?? "", customerName: "", customerPhone: "", dueBack: "", itemId: items[0]?.id ?? "", qty: "1" });
  const [lines, setLines] = useState<{ itemId: string; qty: string }[]>([]);
  const [open, setOpen] = useState<Detail | null>(null);
  const [back, setBack] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const money = (v: string) => format.number(Number(v), { style: "currency", currency: "INR" });
  const nameOf = (id: string) => items.find((i) => i.id === id)?.name ?? "";
  const act = async (fn: () => Promise<unknown>) => { setBusy(true); setError(null); try { await fn(); router.refresh(); } catch (err) { setError(errorText(t, err, NS)); } finally { setBusy(false); } };

  return (
    <div className="flex flex-col gap-4">
      {error ? <Alert>{error}</Alert> : null}
      {canCreate ? (
        <Card className="p-4">
          <h2 className="mb-3 text-sm font-medium">{t("memos.new")}</h2>
          <div className="grid gap-3 sm:grid-cols-4">
            <Field label={t("memos.store")}><Select value={f.warehouseId} onChange={(e) => setF({ ...f, warehouseId: e.target.value })}>{stores.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</Select></Field>
            <Field label={t("memos.customer")}><Input value={f.customerName} onChange={(e) => setF({ ...f, customerName: e.target.value })} maxLength={80} /></Field>
            <Field label={t("memos.phone")}><Input value={f.customerPhone} onChange={(e) => setF({ ...f, customerPhone: e.target.value.replace(/\D/g, "").slice(0, 10) })} inputMode="numeric" className="num" /></Field>
            <Field label={t("memos.dueBack")}><Input type="date" value={f.dueBack} onChange={(e) => setF({ ...f, dueBack: e.target.value })} /></Field>
            <Field label={t("memos.item")}><Select value={f.itemId} onChange={(e) => setF({ ...f, itemId: e.target.value })}>{items.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}</Select></Field>
            <Field label={t("memos.qty")}><Input value={f.qty} onChange={(e) => setF({ ...f, qty: e.target.value.replace(/[^\d]/g, "") })} inputMode="numeric" className="num w-24" /></Field>
            <div className="flex items-end"><Button type="button" variant="outline" disabled={!f.itemId || !Number(f.qty) || lines.some((l) => l.itemId === f.itemId)} onClick={() => setLines([...lines, { itemId: f.itemId, qty: f.qty }])}>{t("memos.addLine")}</Button></div>
          </div>
          {lines.length ? <ul className="mt-3 text-sm">{lines.map((l) => <li key={l.itemId} className="flex items-center justify-between border-b border-rule py-1">{nameOf(l.itemId)} x {l.qty}<Button variant="ghost" onClick={() => setLines(lines.filter((x) => x.itemId !== l.itemId))}>{t("common.remove")}</Button></li>)}</ul> : null}
          <Button className="mt-3" disabled={busy || !lines.length || !f.customerName.trim()} onClick={() => act(async () => {
            await api("/approval-memos", { body: { warehouseId: f.warehouseId, date: todayIso(), customerName: f.customerName.trim(), ...(f.customerPhone ? { customerPhone: f.customerPhone } : {}), ...(f.dueBack ? { dueBack: f.dueBack } : {}), lines } });
            setLines([]); setF({ ...f, customerName: "", customerPhone: "", dueBack: "" });
          })}>{t("memos.issue")}</Button>
        </Card>
      ) : null}

      <Card className="p-0">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted"><tr className="border-b border-rule"><th className="px-4 py-1.5 font-medium">{t("memos.number")}</th><th className="px-4 py-1.5 font-medium">{t("memos.customer")}</th><th className="px-4 py-1.5 font-medium">{t("memos.store")}</th><th className="px-4 py-1.5 text-right font-medium">{t("memos.out")}</th><th className="px-4 py-1.5 text-right font-medium">{t("memos.value")}</th><th /></tr></thead>
          <tbody>{memos.map((m) => (
            <tr key={m.id} className="border-b border-rule last:border-0">
              <td className="px-4 py-1.5">{m.number}<span className="ml-2 text-xs text-muted">{m.date}</span>{m.overdue ? <Badge tone="danger">{t("memos.overdue", { date: m.dueBack ?? "" })}</Badge> : null}</td>
              <td className="px-4 py-1.5">{m.customerName}{m.customerPhone ? <span className="ml-2 text-xs text-muted">{m.customerPhone}</span> : null}</td>
              <td className="px-4 py-1.5">{m.store}</td><td className="num px-4 py-1.5 text-right">{m.piecesOut}</td><td className="num px-4 py-1.5 text-right">{money(m.valueOut)}</td>
              <td className="px-4 py-1.5 text-right"><span className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => act(async () => { setBack({}); setOpen(await api<Detail>(`/approval-memos/${m.id}`)); })}>{t("memos.pieces")}</Button>
                <Link href={`/pos/billing?memo=${m.id}`} className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-sm text-on-primary">{t("memos.bill")}</Link>
              </span></td>
            </tr>
          ))}</tbody>
        </table>
        {memos.length ? null : <p className="px-4 py-3 text-sm text-muted">{t("memos.none")}</p>}
      </Card>

      {open ? (
        <Card className="p-4">
          <h2 className="mb-2 text-sm font-medium">{open.number}</h2>
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted"><tr className="border-b border-rule"><th className="py-1.5 font-medium">{t("memos.item")}</th><th className="py-1.5 text-right font-medium">{t("memos.rate")}</th><th className="py-1.5 text-right font-medium">{t("memos.out")}</th><th className="py-1.5 text-right font-medium">{t("memos.takeBack")}</th></tr></thead>
            <tbody>{open.lines.map((l) => (
              <tr key={l.id} className="border-b border-rule last:border-0"><td className="py-1.5">{l.name}</td><td className="num py-1.5 text-right">{money(l.rate)}</td><td className="num py-1.5 text-right">{Number(l.outQty)}</td>
                <td className="py-1.5 text-right">{canEdit && Number(l.outQty) > 0 ? <Input value={back[l.id] ?? ""} onChange={(e) => setBack({ ...back, [l.id]: e.target.value.replace(/[^\d]/g, "") })} inputMode="numeric" className="num ml-auto w-20 text-right" aria-label={t("memos.takeBack")} /> : null}</td></tr>
            ))}</tbody>
          </table>
          <div className="mt-3 flex gap-2">
            <Button disabled={busy || !Object.values(back).some((v) => Number(v) > 0)} onClick={() => act(async () => {
              await api(`/approval-memos/${open.id}/return`, { body: { date: todayIso(), lines: Object.entries(back).filter(([, v]) => Number(v) > 0).map(([lineId, qty]) => ({ lineId, qty })) } });
              setOpen(null);
            })}>{t("memos.takeBackGo")}</Button>
            <Button variant="ghost" onClick={() => setOpen(null)}>{t("common.cancel")}</Button>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
