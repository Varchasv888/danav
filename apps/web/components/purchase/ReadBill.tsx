"use client";

import { ScanText } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Card } from "../ui";

export interface ReadBillResult {
  reader: string;
  fields: { vendorName: string | null; vendorGstin: string | null; invoiceNo: string | null; date: string | null; total: string | null } | null;
  supplierId: string | null;
  lines: { description: string; hsn: string | null; qty: string | null; rate: string | null; gstRate: string | null; itemId: string | null }[];
}

const toBase64 = (f: File) => new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(",")[1] ?? ""); r.onerror = rej; r.readAsDataURL(f); });

/** Photo or PDF of the supplier's bill → the form is filled in to be checked; nothing is saved. */
export function ReadBill({ onRead }: { onRead: (r: ReadBillResult) => void }) {
  const t = useTranslations();
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function pick(file: File) {
    setBusy(true);
    setNote(t("purchase.read.reading"));
    try {
      const contentType = file.type === "image/jpg" ? "image/jpeg" : file.type;
      const f = await api<{ id: string }>("/files", { body: { name: file.name, contentType, base64: await toBase64(file) } });
      const r = await api<ReadBillResult>("/purchase-bills/read", { body: { fileId: f.id } });
      if (!r.fields) setNote(r.reader === "demo" ? t("purchase.read.demo") : t("purchase.read.none"));
      else {
        onRead(r);
        const unmatched = r.lines.filter((l) => !l.itemId).map((l) => l.description);
        setNote([t("purchase.read.done"), unmatched.length ? t("purchase.read.unmatched", { items: unmatched.join(", ") }) : ""].filter(Boolean).join(" "));
      }
    } catch (err) {
      setNote(errorText(t, err, ["expenses.errors", "purchase.errors"]));
    } finally { setBusy(false); }
  }
  return (
    <Card className="flex flex-wrap items-center gap-3 border-dashed">
      <label className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium hover:bg-surface-2 ${busy ? "pointer-events-none opacity-60" : ""}`}>
        <ScanText className="size-4" aria-hidden />{t("purchase.read.button")}
        <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) void pick(f); }} />
      </label>
      <span className="text-sm text-muted">{note ?? t("purchase.read.hint")}</span>
    </Card>
  );
}
