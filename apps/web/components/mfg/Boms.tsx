"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { localName } from "@/lib/format";
import type { ItemOption } from "@/lib/masters";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

const NS = ["mfg.errors", "items.errors", "purchase.errors"];
export interface WorkCentre { id: string; name: string; costPerHour: string; archived: boolean }

/** A new BOM version: output, materials with wastage, and operations on work centres. */
export function BomForm({ items, workCentres, itemId: initialItem }: { items: ItemOption[]; workCentres: WorkCentre[]; itemId?: string }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const goods = [...items].filter((i) => i.kind === "goods" && !i.archived).sort((a, b) => localName(a, locale).localeCompare(localName(b, locale)));
  const [itemId, setItemId] = useState(initialItem ?? "");
  const [outputQty, setOutputQty] = useState("1");
  const [overhead, setOverhead] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState([{ key: 1, itemId: "", qty: "", wastagePct: "" }]);
  const [ops, setOps] = useState<{ key: number; name: string; workCentreId: string; minutes: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  let next = Math.max(0, ...lines.map((l) => l.key), ...ops.map((o) => o.key)) + 1;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const b = await api<{ id: string }>("/boms", {
        body: {
          itemId, outputQty, overhead: overhead || undefined, notes: notes || undefined,
          lines: lines.filter((l) => l.itemId && l.qty).map((l) => ({ itemId: l.itemId, qty: l.qty, ...(l.wastagePct ? { wastagePct: l.wastagePct } : {}) })),
          operations: ops.filter((o) => o.name && o.workCentreId && o.minutes).map(({ key: _k, ...o }) => o),
        },
      });
      router.push(`/manufacturing/boms/${b.id}`);
    } catch (err) {
      setError(errorText(t, err, NS));
      setBusy(false);
    }
  }
  const uom = (id: string) => items.find((i) => i.id === id)?.uom ?? "";
  const del = <T extends { key: number }>(list: T[], set: (x: T[]) => void, key: number) => (
    <button type="button" onClick={() => set(list.filter((x) => x.key !== key))} className="rounded-md p-2 text-muted hover:text-danger" title={t("common.remove")}><Trash2 className="size-4" aria-hidden /></button>
  );
  return (
    <form onSubmit={save} className="flex flex-col gap-6">
      <Card>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <Field label={t("mfg.boms.item")} htmlFor="bom-item">
              <Select id="bom-item" value={itemId} onChange={(e) => setItemId(e.target.value)} required>
                <option value="">-</option>
                {goods.map((i) => <option key={i.id} value={i.id}>{localName(i, locale)}</option>)}
              </Select>
            </Field>
          </div>
          <Field label={t("mfg.boms.outputQty")} htmlFor="bom-out" hint={uom(itemId)}><Input id="bom-out" value={outputQty} onChange={(e) => setOutputQty(e.target.value)} required inputMode="decimal" className="num" /></Field>
          <Field label={t("mfg.boms.overhead")} htmlFor="bom-oh"><Input id="bom-oh" value={overhead} onChange={(e) => setOverhead(e.target.value)} inputMode="decimal" className="num" /></Field>
          <div className="md:col-span-4"><Field label={t("mfg.boms.notes")} htmlFor="bom-notes"><Input id="bom-notes" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500} /></Field></div>
        </div>
      </Card>
      <Card>
        <h2 className="mb-3 font-semibold">{t("mfg.boms.component")}</h2>
        <table className="w-full text-sm">
          <thead className="text-left text-muted"><tr className="border-b border-border">
            <th className="py-2 pr-3 font-medium">{t("mfg.boms.component")}</th><th className="w-36 py-2 pr-3 text-right font-medium">{t("mfg.boms.qty")}</th>
            <th className="w-28 py-2 pr-3 text-right font-medium">{t("mfg.boms.wastage")}</th><th className="w-10" />
          </tr></thead>
          <tbody>
            {lines.map((l) => (
              <tr key={l.key} className="border-b border-border">
                <td className="py-1.5 pr-3">
                  <Select value={l.itemId} onChange={(e) => setLines(lines.map((x) => (x.key === l.key ? { ...x, itemId: e.target.value } : x)))} aria-label={t("mfg.boms.component")}>
                    <option value="">-</option>
                    {goods.filter((i) => i.id !== itemId).map((i) => <option key={i.id} value={i.id}>{localName(i, locale)}</option>)}
                  </Select>
                </td>
                <td className="py-1.5 pr-3"><Input value={l.qty} onChange={(e) => setLines(lines.map((x) => (x.key === l.key ? { ...x, qty: e.target.value } : x)))} inputMode="decimal" className="num text-right" aria-label={t("mfg.boms.qty")} />
                  <span className="block pt-0.5 text-right text-xs text-muted">{uom(l.itemId)}</span></td>
                <td className="py-1.5 pr-3"><Input value={l.wastagePct} onChange={(e) => setLines(lines.map((x) => (x.key === l.key ? { ...x, wastagePct: e.target.value } : x)))} inputMode="decimal" className="num text-right" aria-label={t("mfg.boms.wastage")} /></td>
                <td>{lines.length > 1 ? del(lines, setLines, l.key) : null}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button type="button" variant="ghost" className="-ml-3 mt-2" onClick={() => setLines([...lines, { key: next++, itemId: "", qty: "", wastagePct: "" }])}><Plus className="size-4" aria-hidden />{t("mfg.boms.addLine")}</Button>
      </Card>
      <Card>
        <h2 className="mb-3 font-semibold">{t("mfg.boms.operations")}</h2>
        {ops.map((o) => (
          <div key={o.key} className="mb-2 grid items-end gap-3 md:grid-cols-[1fr_1fr_120px_auto]">
            <Field label={t("mfg.boms.operation")} htmlFor={`op-n-${o.key}`}><Input id={`op-n-${o.key}`} value={o.name} onChange={(e) => setOps(ops.map((x) => (x.key === o.key ? { ...x, name: e.target.value } : x)))} maxLength={60} /></Field>
            <Field label={t("mfg.boms.workCentre")} htmlFor={`op-w-${o.key}`}>
              <Select id={`op-w-${o.key}`} value={o.workCentreId} onChange={(e) => setOps(ops.map((x) => (x.key === o.key ? { ...x, workCentreId: e.target.value } : x)))}>
                <option value="">-</option>
                {workCentres.filter((w) => !w.archived).map((w) => <option key={w.id} value={w.id}>{w.name} · ₹{Number(w.costPerHour)}/h</option>)}
              </Select>
            </Field>
            <Field label={t("mfg.boms.minutes")} htmlFor={`op-m-${o.key}`}><Input id={`op-m-${o.key}`} value={o.minutes} onChange={(e) => setOps(ops.map((x) => (x.key === o.key ? { ...x, minutes: e.target.value } : x)))} inputMode="decimal" className="num" /></Field>
            {del(ops, setOps, o.key)}
          </div>
        ))}
        <Button type="button" variant="ghost" className="-ml-3" disabled={!workCentres.length} onClick={() => setOps([...ops, { key: next++, name: "", workCentreId: workCentres[0]?.id ?? "", minutes: "" }])}>
          <Plus className="size-4" aria-hidden />{t("mfg.boms.addOperation")}
        </Button>
      </Card>
      {error ? <Alert>{error}</Alert> : null}
      <div><Button type="submit" disabled={busy || !itemId}>{t("mfg.boms.save")}</Button></div>
    </form>
  );
}

export function WorkCentres({ rows, canEdit }: { rows: WorkCentre[]; canEdit: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [list, setList] = useState<(WorkCentre | { id?: undefined; name: string; costPerHour: string; archived: boolean })[]>(rows);
  const [error, setError] = useState<string | null>(null);
  const save = async (i: number) => {
    const w = list[i]!;
    setError(null);
    try {
      await api(w.id ? `/work-centres/${w.id}` : "/work-centres", { method: w.id ? "PUT" : "POST", body: { name: w.name, costPerHour: w.costPerHour || "0", archived: w.archived } });
      router.refresh();
    } catch (err) { setError(errorText(t, err, NS)); }
  };
  return (
    <Card>
      <h2 className="mb-3 font-semibold">{t("mfg.workCentres.title")}</h2>
      {list.map((w, i) => (
        <div key={w.id ?? `new-${i}`} className="mb-2 flex flex-wrap items-end gap-3">
          <Field label={t("mfg.workCentres.name")} htmlFor={`wc-n-${i}`}><Input id={`wc-n-${i}`} value={w.name} disabled={!canEdit} onChange={(e) => setList(list.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} maxLength={60} /></Field>
          <Field label={t("mfg.workCentres.costPerHour")} htmlFor={`wc-c-${i}`}><Input id={`wc-c-${i}`} value={String(Number(w.costPerHour) || "")} disabled={!canEdit} onChange={(e) => setList(list.map((x, j) => (j === i ? { ...x, costPerHour: e.target.value } : x)))} inputMode="decimal" className="num w-32" /></Field>
          {canEdit ? <Button variant="outline" onClick={() => save(i)} disabled={!w.name.trim()}>{t("mfg.workCentres.save")}</Button> : null}
        </div>
      ))}
      {canEdit ? <Button variant="ghost" className="-ml-3" onClick={() => setList([...list, { name: "", costPerHour: "", archived: false }])}><Plus className="size-4" aria-hidden />{t("mfg.workCentres.add")}</Button> : null}
      {error ? <div className="mt-3"><Alert>{error}</Alert></div> : null}
    </Card>
  );
}

export function BomActions({ id, isDefault, archived }: { id: string; isDefault: boolean; archived: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const act = async (what: "default" | "archive") => {
    setError(null);
    try { await api(`/boms/${id}/${what}`, { body: {} }); router.refresh(); } catch (err) { setError(errorText(t, err, NS)); }
  };
  if (archived) return null;
  return (
    <div className="flex flex-wrap items-center gap-3">
      {!isDefault ? <Button variant="outline" onClick={() => act("default")}>{t("mfg.boms.makeDefault")}</Button> : null}
      <Button variant="ghost" className="text-danger" onClick={() => act("archive")}>{t("mfg.boms.archive")}</Button>
      {error ? <Alert>{error}</Alert> : null}
    </div>
  );
}
