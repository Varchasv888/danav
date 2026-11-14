"use client";

import clsx from "clsx";
import { Paperclip } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { todayIso } from "@/lib/format";
import { Alert, Button, Card, Field, Input } from "../ui";

export interface Proof {
  id: string; receivedOn: string; receivedBy: string; note: string | null; fileId: string | null; fileName: string | null; discrepancy: boolean;
  claimOwner: string | null; claimDeadline: string | null; claimStatus: "open" | "settled" | "waived"; claimNote: string | null;
  state: "none" | "open" | "due_soon" | "overdue" | "settled" | "waived";
  lines: { lineId: string; item: string; delivered: string; short: string; damaged: string }[];
}
const q = (v: string) => Number(v).toLocaleString("en-IN", { maximumFractionDigits: 3 });
const toBase64 = (f: File) => new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(",")[1] ?? ""); r.onerror = rej; r.readAsDataURL(f); });

/**
 * Proof of delivery on a challan: who received the goods and when, a photo or signed copy, and anything short or damaged,
 * which opens a claim with an owner and a deadline. Once recorded it shows the claim and lets it be closed.
 */
export function DeliveryProofPanel({ noteId, lines, proof, canEdit }: { noteId: string; lines: { id: string; itemName: string; qty: string }[]; proof: Proof | null; canEdit: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bad, setBad] = useState<Record<string, { short: string; damaged: string }>>({});
  const [closing, setClosing] = useState<"settled" | "waived" | null>(null);
  const tone = { none: "", open: "bg-surface-2 text-muted", due_soon: "bg-accent-soft text-accent", overdue: "bg-danger-soft text-danger", settled: "bg-success-soft text-success", waived: "bg-surface-2 text-muted" } as const;

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const s = (k: string) => String(f.get(k) ?? "").trim();
    setBusy(true); setError(null);
    try {
      const file = f.get("file");
      let fileId: string | undefined;
      if (file instanceof File && file.size) fileId = (await api<{ id: string }>("/files", { body: { name: file.name, contentType: file.type === "image/jpg" ? "image/jpeg" : file.type, base64: await toBase64(file) } })).id;
      await api(`/delivery-notes/${noteId}/proof`, { body: {
        receivedOn: s("receivedOn"), receivedBy: s("receivedBy"), ...(fileId ? { fileId } : {}), ...(s("note") ? { note: s("note") } : {}),
        lines: Object.entries(bad).filter(([, v]) => Number(v.short) > 0 || Number(v.damaged) > 0).map(([noteLineId, v]) => ({ noteLineId, short: v.short || "0", damaged: v.damaged || "0" })),
      } });
      setOpen(false); router.refresh();
    } catch (err) { setError(errorText(t, err, ["deliveryProof.errors"])); } finally { setBusy(false); }
  }
  async function close(status: "settled" | "waived", note: string) {
    setBusy(true); setError(null);
    try { await api(`/delivery-proofs/${proof!.id}/close`, { body: { status, note } }); setClosing(null); router.refresh(); } catch (err) { setError(errorText(t, err, ["deliveryProof.errors"])); } finally { setBusy(false); }
  }

  return (
    <Card className="mt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold">{t("deliveryProof.title")}</h2>
        {proof ? <span className={clsx("rounded px-2 py-0.5 text-xs font-medium", tone[proof.state])}>{t(`deliveryProof.state.${proof.state}`)}</span> : null}
        {!proof && canEdit ? <Button variant="outline" onClick={() => setOpen((v) => !v)}>{open ? t("common.cancel") : t("deliveryProof.record")}</Button> : null}
      </div>
      {error ? <div className="mt-3"><Alert>{error}</Alert></div> : null}
      {proof ? (
        <div className="mt-3 flex flex-col gap-2 text-sm">
          <p>{t("deliveryProof.receivedLine", { by: proof.receivedBy, date: proof.receivedOn })}</p>
          {proof.fileId ? <a href={`/api/files/${proof.fileId}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline"><Paperclip className="size-3.5" aria-hidden />{proof.fileName}</a> : null}
          {proof.note ? <p className="text-muted">{proof.note}</p> : null}
          {proof.discrepancy ? (
            <>
              <table className="w-full max-w-xl text-sm">
                <thead className="text-left text-muted"><tr className="border-b border-border"><th className="py-1 pr-3 font-medium">{t("deliveryProof.item")}</th><th className="py-1 text-right font-medium">{t("deliveryProof.delivered")}</th><th className="py-1 text-right font-medium">{t("deliveryProof.short")}</th><th className="py-1 text-right font-medium">{t("deliveryProof.damaged")}</th></tr></thead>
                <tbody>{proof.lines.map((l) => <tr key={l.lineId} className="border-b border-border last:border-0"><td className="py-1 pr-3">{l.item}</td><td className="num py-1 text-right">{q(l.delivered)}</td><td className="num py-1 text-right text-danger">{q(l.short)}</td><td className="num py-1 text-right text-danger">{q(l.damaged)}</td></tr>)}</tbody>
              </table>
              <p>{t("deliveryProof.claimLine", { owner: proof.claimOwner ?? "-", deadline: proof.claimDeadline ?? "-" })}</p>
              {proof.claimNote ? <p className="text-muted">{proof.claimNote}</p> : null}
              {proof.claimStatus === "open" && canEdit ? (
                closing ? (
                  <form className="flex flex-wrap items-end gap-2" onSubmit={(e) => { e.preventDefault(); void close(closing, String(new FormData(e.currentTarget).get("note") ?? "")); }}>
                    <Field label={t(`deliveryProof.closeAs.${closing}`)} htmlFor="dp-note"><Input id="dp-note" name="note" required maxLength={300} autoFocus className="w-80 max-w-full" /></Field>
                    <Button type="submit" disabled={busy}>{t("common.save")}</Button><Button type="button" variant="ghost" onClick={() => setClosing(null)}>{t("common.cancel")}</Button>
                  </form>
                ) : (
                  <div className="flex gap-2"><Button variant="outline" onClick={() => setClosing("settled")}>{t("deliveryProof.settle")}</Button><Button variant="ghost" onClick={() => setClosing("waived")}>{t("deliveryProof.waive")}</Button></div>
                )
              ) : null}
            </>
          ) : <p className="text-success">{t("deliveryProof.clean")}</p>}
        </div>
      ) : !open ? <p className="mt-2 text-sm text-muted">{t("deliveryProof.none")}</p> : null}
      {open && !proof ? (
        <form onSubmit={save} className="mt-4 flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label={t("deliveryProof.receivedBy")} htmlFor="dp-by"><Input id="dp-by" name="receivedBy" required minLength={2} maxLength={80} /></Field>
            <Field label={t("deliveryProof.receivedOn")} htmlFor="dp-on"><Input id="dp-on" name="receivedOn" type="date" defaultValue={todayIso()} max={todayIso()} required /></Field>
            <Field label={t("deliveryProof.photo")} htmlFor="dp-file" hint={t("deliveryProof.photoHint")}><Input id="dp-file" name="file" type="file" accept="image/png,image/jpeg,application/pdf" /></Field>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium">{t("deliveryProof.anyProblem")}</p>
            <table className="w-full max-w-xl text-sm">
              <thead className="text-left text-muted"><tr className="border-b border-border"><th className="py-1 pr-3 font-medium">{t("deliveryProof.item")}</th><th className="py-1 text-right font-medium">{t("deliveryProof.delivered")}</th><th className="py-1 pl-3 font-medium">{t("deliveryProof.short")}</th><th className="py-1 pl-3 font-medium">{t("deliveryProof.damaged")}</th></tr></thead>
              <tbody>
                {lines.map((l) => (
                  <tr key={l.id} className="border-b border-border last:border-0">
                    <td className="py-1 pr-3">{l.itemName}</td><td className="num py-1 text-right">{q(l.qty)}</td>
                    {(["short", "damaged"] as const).map((k) => (
                      <td key={k} className="py-1 pl-3"><Input inputMode="decimal" aria-label={`${l.itemName} ${t(`deliveryProof.${k}`)}`} value={bad[l.id]?.[k] ?? ""} onChange={(e) => setBad((b) => ({ ...b, [l.id]: { short: b[l.id]?.short ?? "", damaged: b[l.id]?.damaged ?? "", [k]: e.target.value } }))} className="num h-8 w-20 text-right" /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Field label={t("deliveryProof.note")} htmlFor="dp-note2"><Input id="dp-note2" name="note" maxLength={300} /></Field>
          <div><Button type="submit" disabled={busy}>{t("common.save")}</Button></div>
        </form>
      ) : null}
    </Card>
  );
}
