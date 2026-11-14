"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { localName, todayIso } from "@/lib/format";
import type { ItemOption } from "@/lib/masters";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

const NS = ["mfg.errors", "purchase.errors", "sj.errors"];
export interface Challan {
  id: string; number: string; date: string; direction: "out" | "in"; jobWorker: string; process: string | null; status: string; charges: string;
  lines: { itemId: string; qty: string; rate: string; capitalGoods?: boolean }[];
  pending: { itemId: string; qty: string; pending: string }[] | null;
}
type Party = { id: string; name: string; nameHi: string | null };
type Row = { key: number; itemId: string; qty: string; capitalGoods?: boolean };

function Lines({ rows, setRows, items, capital }: { rows: Row[]; setRows: (r: Row[]) => void; items: ItemOption[]; capital?: boolean }) {
  const t = useTranslations();
  const locale = useLocale();
  const goods = [...items].filter((i) => i.kind === "goods" && !i.archived).sort((a, b) => localName(a, locale).localeCompare(localName(b, locale)));
  return (
    <div className="flex flex-col gap-2">
      {rows.map((l) => (
        <div key={l.key} className="grid items-center gap-3 md:grid-cols-[1fr_140px_auto_auto]">
          <Select value={l.itemId} onChange={(e) => setRows(rows.map((x) => (x.key === l.key ? { ...x, itemId: e.target.value } : x)))} aria-label={t("mfg.boms.component")}>
            <option value="">-</option>
            {goods.map((i) => <option key={i.id} value={i.id}>{localName(i, locale)} · {i.uom}</option>)}
          </Select>
          <Input value={l.qty} onChange={(e) => setRows(rows.map((x) => (x.key === l.key ? { ...x, qty: e.target.value } : x)))} inputMode="decimal" className="num text-right" aria-label={t("mfg.boms.qty")} />
          {capital ? (
            <label className="flex items-center gap-2 text-sm whitespace-nowrap"><input type="checkbox" checked={!!l.capitalGoods} onChange={(e) => setRows(rows.map((x) => (x.key === l.key ? { ...x, capitalGoods: e.target.checked } : x)))} className="size-4 accent-[var(--primary)]" />{t("mfg.jobWork.capitalGoods")}</label>
          ) : <span />}
          {rows.length > 1 ? <button type="button" onClick={() => setRows(rows.filter((x) => x.key !== l.key))} className="rounded-md p-2 text-muted hover:text-danger" title={t("common.remove")}><Trash2 className="size-4" aria-hidden /></button> : <span />}
        </div>
      ))}
      <div><Button type="button" variant="ghost" className="-ml-3" onClick={() => setRows([...rows, { key: Math.max(0, ...rows.map((r) => r.key)) + 1, itemId: "", qty: "" }])}><Plus className="size-4" aria-hidden />{t("mfg.boms.addLine")}</Button></div>
    </div>
  );
}

const clean = (rows: Row[]) => rows.filter((r) => r.itemId && Number(r.qty) > 0).map((r) => ({ itemId: r.itemId, qty: r.qty, ...(r.capitalGoods ? { capitalGoods: true } : {}) }));

export function JobWorkForms({ items, parties, open }: { items: ItemOption[]; parties: Party[]; open: Challan[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [mode, setMode] = useState<"send" | "receive" | null>(null);
  const [sent, setSent] = useState<Row[]>([{ key: 1, itemId: "", qty: "" }]);
  const [received, setReceived] = useState<Row[]>([{ key: 1, itemId: "", qty: "" }]);
  const [consumed, setConsumed] = useState<Row[]>([]);
  const [challanId, setChallanId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const pickChallan = (id: string) => {
    setChallanId(id);
    const ch = open.find((c) => c.id === id);
    setConsumed((ch?.pending ?? []).filter((p) => Number(p.pending) > 0).map((p, i) => ({ key: i + 1, itemId: p.itemId, qty: String(Number(p.pending)) })));
  };
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    try {
      if (mode === "send") await api("/job-work/send", { body: { date: f.get("date"), jobWorkerId: f.get("jobWorkerId"), process: String(f.get("process") || "") || undefined, lines: clean(sent) } });
      else await api("/job-work/receive", { body: { date: f.get("date"), sentChallanId: challanId, charges: String(f.get("charges") || "") || undefined, received: clean(received), consumed: clean(consumed) } });
      setMode(null);
      router.refresh();
    } catch (err) { setError(errorText(t, err, NS)); } finally { setBusy(false); }
  }

  if (!mode) {
    return (
      <div className="flex gap-3">
        <Button onClick={() => setMode("send")}>{t("mfg.jobWork.send")}</Button>
        <Button variant="outline" onClick={() => setMode("receive")} disabled={!open.length}>{t("mfg.jobWork.receive")}</Button>
      </div>
    );
  }
  return (
    <Card>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <h2 className="font-semibold">{t(`mfg.jobWork.${mode}`)}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label={t("common.date")} htmlFor="jw-date"><Input id="jw-date" name="date" type="date" defaultValue={todayIso()} required /></Field>
          {mode === "send" ? (
            <>
              <Field label={t("mfg.jobWork.jobWorker")} htmlFor="jw-worker">
                <Select id="jw-worker" name="jobWorkerId" required defaultValue="">
                  <option value="">-</option>
                  {parties.map((p) => <option key={p.id} value={p.id}>{localName(p, locale)}</option>)}
                </Select>
              </Field>
              <Field label={t("mfg.jobWork.process")} htmlFor="jw-proc"><Input id="jw-proc" name="process" maxLength={80} /></Field>
            </>
          ) : (
            <>
              <Field label={t("mfg.jobWork.from")} htmlFor="jw-ch">
                <Select id="jw-ch" value={challanId} onChange={(e) => pickChallan(e.target.value)} required>
                  <option value="">-</option>
                  {open.map((c) => <option key={c.id} value={c.id}>{c.number} · {c.jobWorker}{c.process ? ` · ${c.process}` : ""}</option>)}
                </Select>
              </Field>
              <Field label={t("mfg.jobWork.charges")} htmlFor="jw-chg"><Input id="jw-chg" name="charges" inputMode="decimal" className="num" /></Field>
            </>
          )}
        </div>
        {mode === "send" ? <Lines rows={sent} setRows={setSent} items={items} capital /> : (
          <>
            <h3 className="text-sm font-medium text-muted">{t("mfg.jobWork.received")}</h3>
            <Lines rows={received} setRows={setReceived} items={items} />
            <h3 className="text-sm font-medium text-muted">{t("mfg.jobWork.consumed")}</h3>
            <Lines rows={consumed.length ? consumed : [{ key: 1, itemId: "", qty: "" }]} setRows={setConsumed} items={items} />
          </>
        )}
        {error ? <Alert>{error}</Alert> : null}
        <div className="flex gap-3">
          <Button type="submit" disabled={busy}>{t(`mfg.jobWork.${mode}`)}</Button>
          <Button type="button" variant="ghost" onClick={() => setMode(null)}>{t("common.cancel")}</Button>
        </div>
      </form>
    </Card>
  );
}
