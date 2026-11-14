"use client";

import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Button, Card, Field, Select } from "../ui";

interface Option { id: string; name: string }
type Kind = "customers" | "suppliers" | "items";

/** Pick a duplicate and the record to keep; the server moves the balance or stock and closes the duplicate. */
export function MergeMasters({ customers, suppliers, items, canParty, canItem }: { customers: Option[]; suppliers: Option[]; items: Option[]; canParty: boolean; canItem: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const kinds: Kind[] = [...(canParty ? (["customers", "suppliers"] as const) : []), ...(canItem ? (["items"] as const) : [])];
  const [kind, setKind] = useState<Kind>(kinds[0] ?? "customers");
  const [from, setFrom] = useState("");
  const [into, setInto] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const list = kind === "customers" ? customers : kind === "suppliers" ? suppliers : items;
  const name = (id: string) => list.find((o) => o.id === id)?.name ?? "";

  async function merge(e: React.FormEvent) {
    e.preventDefault();
    if (!window.confirm(t("merge.confirm", { from: name(from), into: name(into) }))) return;
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      if (kind === "items") {
        const r = await api<{ stockLines: number }>(`/items/${from}/merge`, { body: { intoId: into } });
        setNote(t("merge.doneItem", { n: r.stockLines }));
      } else {
        const r = await api<{ balanceMoved: string }>(`/accounts/${from}/merge`, { body: { intoId: into } });
        setNote(t("merge.doneParty", { amount: format.number(Number(r.balanceMoved), { style: "currency", currency: "INR" }) }));
      }
      setFrom("");
      setInto("");
      router.refresh();
    } catch (err) { setError(errorText(t, err, ["merge.errors"])); } finally { setBusy(false); }
  }

  return (
    <Card>
      <div className="mb-4 flex gap-2" role="tablist">
        {kinds.map((k) => (
          <button key={k} type="button" role="tab" aria-selected={kind === k} onClick={() => { setKind(k); setFrom(""); setInto(""); setError(null); setNote(null); }}
            className={`rounded-lg border px-3 py-1.5 text-sm ${kind === k ? "border-primary bg-primary-soft text-primary" : "border-border hover:bg-surface-2"}`}>{t(`merge.${k}`)}</button>
        ))}
      </div>
      <p className="mb-4 max-w-2xl text-sm text-muted">{kind === "items" ? t("merge.itemHelp") : t("merge.partyHelp")}</p>
      {error ? <Alert>{error}</Alert> : null}
      {note ? <p role="status" className="mb-3 text-sm text-success">{note}</p> : null}
      <form onSubmit={merge} method="post" className="flex flex-wrap items-end gap-4">
        <Field label={t("merge.duplicate")} htmlFor="mg-from">
          <Select id="mg-from" value={from} onChange={(e) => setFrom(e.target.value)} className="w-72" required>
            <option value="">{t("merge.choose")}</option>
            {list.filter((o) => o.id !== into).map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </Select>
        </Field>
        <Field label={t("merge.keep")} htmlFor="mg-into">
          <Select id="mg-into" value={into} onChange={(e) => setInto(e.target.value)} className="w-72" required>
            <option value="">{t("merge.choose")}</option>
            {list.filter((o) => o.id !== from).map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </Select>
        </Field>
        <Button type="submit" disabled={busy || !from || !into}>{t("merge.go")}</Button>
      </form>
    </Card>
  );
}
