"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Button, Card } from "../ui";

export interface PackingListData {
  note: { id: string; number: string };
  boxes: { id: string; code: string; lines: { itemId: string; item: string; qty: string }[] }[];
  comparison: { rows: { itemId: string; item: string; challanQty: string; packedQty: string; difference: string; state: "ok" | "short" | "extra" }[]; boxCount: number; packedPieces: string; complete: boolean; problems: number };
  availableBoxes: { id: string; code: string }[];
}

/** The cartons travelling with a challan and whether they add up to it item by item; packed cartons are added from the open ones. */
export function PackingListPanel({ data, canEdit }: { data: PackingListData; canEdit: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [picked, setPicked] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const qty = (v: string) => String(Number(v));

  async function call(path: string, body: unknown) {
    setBusy(true); setError(null);
    try { await api(path, { body }); setPicked([]); router.refresh(); } catch (err) { setError(errorText(t, err, ["packingList.errors"])); } finally { setBusy(false); }
  }
  const { comparison: c } = data;
  return (
    <Card className="mt-4 flex flex-col gap-3 p-4 print:border-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium">{t("packingList.title")}</h2>
        <div className="flex items-center gap-3 print:hidden">
          {c.boxCount ? <span className={clsx("text-sm", c.complete ? "text-success" : "text-danger")}>{c.complete ? t("packingList.complete", { boxes: c.boxCount, pieces: qty(c.packedPieces) }) : t("packingList.problems", { count: c.problems })}</span> : null}
          {c.boxCount ? <Button variant="outline" onClick={() => window.print()}>{t("packingList.print")}</Button> : null}
        </div>
      </div>
      {error ? <Alert>{error}</Alert> : null}
      {data.boxes.length ? (
        <>
          <table className="w-full text-sm">
            <thead className="text-left text-muted"><tr className="border-b border-border"><th className="py-1.5 font-medium">{t("packingList.item")}</th><th className="py-1.5 text-right font-medium">{t("packingList.challan")}</th><th className="py-1.5 text-right font-medium">{t("packingList.packed")}</th><th className="py-1.5 text-right font-medium">{t("packingList.state")}</th></tr></thead>
            <tbody>{c.rows.map((r) => (
              <tr key={r.itemId} className="border-b border-rule last:border-0">
                <td className="py-1.5">{r.item}</td><td className="num py-1.5 text-right">{qty(r.challanQty)}</td><td className="num py-1.5 text-right">{qty(r.packedQty)}</td>
                <td className={clsx("py-1.5 text-right", r.state === "ok" ? "text-success" : "text-danger")}>{t(`packingList.s.${r.state}`, { n: qty(String(Math.abs(Number(r.difference)))) })}</td>
              </tr>
            ))}</tbody>
          </table>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.boxes.map((b) => (
              <div key={b.id} className="rounded-lg border border-border p-3 text-sm">
                <div className="mb-1 flex items-center justify-between"><span className="font-mono font-medium">{b.code}</span>
                  {canEdit ? <button type="button" disabled={busy} onClick={() => void call(`/delivery-notes/${data.note.id}/packing-list/${b.id}/remove`, {})} className="text-xs text-muted hover:text-text print:hidden">{t("packingList.remove")}</button> : null}</div>
                <ul>{b.lines.map((l) => <li key={l.itemId} className="flex justify-between gap-2"><span>{l.item}</span><span className="num">{qty(l.qty)}</span></li>)}</ul>
              </div>
            ))}
          </div>
        </>
      ) : <p className="text-sm text-muted">{t("packingList.none")}</p>}
      {canEdit && data.availableBoxes.length ? (
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <span className="text-sm text-muted">{t("packingList.add")}</span>
          {data.availableBoxes.map((b) => (
            <label key={b.id} className={clsx("cursor-pointer rounded-lg border px-2 py-1 font-mono text-xs", picked.includes(b.id) ? "border-primary bg-primary-soft text-primary" : "border-border")}>
              <input type="checkbox" className="sr-only" checked={picked.includes(b.id)} onChange={() => setPicked((p) => (p.includes(b.id) ? p.filter((x) => x !== b.id) : [...p, b.id]))} />{b.code}
            </label>
          ))}
          <Button disabled={busy || !picked.length} onClick={() => void call(`/delivery-notes/${data.note.id}/packing-list`, { boxIds: picked })}>{t("packingList.attach")}</Button>
        </div>
      ) : null}
    </Card>
  );
}
