"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { todayIso } from "@/lib/format";
import { Alert, Button, Card, Field, Input } from "../ui";

interface Hold { receipt_id: string; number: string; date: string; supplier: string; line_id: string; item: string; hold: string; rate: string }
interface Claims { total: string; suppliers: { supplierId: string; supplier: string; value: string; lines: { receipt: string; date: string; item: string; short: string; damaged: string; defectCode: string | null; returned: string; value: string }[] }[] }

const NS = ["receiving.errors", "purchase.errors"];

/** Goods waiting for inspection (pass or reject each line) and what suppliers owe for goods that came short, damaged or went back. */
export function ReceivingDesk({ canApprove }: { canApprove: boolean }) {
  const t = useTranslations();
  const format = useFormatter();
  const [holds, setHolds] = useState<Hold[]>([]);
  const [claims, setClaims] = useState<Claims | null>(null);
  const [entry, setEntry] = useState<Record<string, { accept: string; reject: string }>>({});
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const money = (v: string) => format.number(Number(v), { style: "currency", currency: "INR" });
  useEffect(() => { const d = todayIso(); setTo(d); setFrom(`${d.slice(0, 4)}-01-01`); }, []);

  const fail = useCallback((err: unknown) => setError(errorText(t, err, NS)), [t]);
  const load = useCallback(() => {
    api<Hold[]>("/goods-receipts/holds").then(setHolds).catch(fail);
    if (from && to) api<Claims>(`/reports/supplier-claims?from=${from}&to=${to}`).then(setClaims).catch(fail);
  }, [from, to, fail]);
  useEffect(() => { load(); }, [load]);

  async function release(h: Hold) {
    const e = entry[h.line_id] ?? { accept: "", reject: "" };
    setBusy(true); setError(null);
    try {
      await api(`/goods-receipts/${h.receipt_id}/release-hold`, { method: "POST", body: { date: todayIso(), lines: [{ lineId: h.line_id, accept: e.accept || "0", reject: e.reject || "0" }] } });
      setEntry((x) => ({ ...x, [h.line_id]: { accept: "", reject: "" } }));
      load();
    } catch (err) { fail(err); } finally { setBusy(false); }
  }

  return (
    <div className="flex flex-col gap-4">
      {error ? <Alert>{error}</Alert> : null}
      <Card className="p-0">
        <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("receiving.holdTitle")}</h2>
        <p className="px-4 py-2 text-sm text-muted">{t("receiving.holdHelp")}</p>
        {holds.length === 0 ? <p className="px-4 pb-4 text-sm text-muted">{t("receiving.noHold")}</p> : (
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted"><tr className="border-y border-rule"><th className="px-4 py-1.5 font-medium">{t("receiving.receipt")}</th><th className="px-4 py-1.5 font-medium">{t("receiving.item")}</th><th className="px-4 py-1.5 text-right font-medium">{t("receiving.onHold")}</th>{canApprove ? <><th className="w-24 px-4 py-1.5 text-right font-medium">{t("receiving.pass")}</th><th className="w-24 px-4 py-1.5 text-right font-medium">{t("receiving.reject")}</th><th /></> : null}</tr></thead>
            <tbody>{holds.map((h) => (
              <tr key={h.line_id} className="border-b border-rule last:border-0">
                <td className="px-4 py-1.5">{h.number}<div className="text-xs text-muted">{h.supplier} · {h.date}</div></td><td className="px-4 py-1.5">{h.item}</td><td className="num px-4 py-1.5 text-right">{Number(h.hold)}</td>
                {canApprove ? (
                  <>
                    <td className="px-4 py-1.5"><Input inputMode="decimal" className="num text-right" aria-label={t("receiving.pass")} value={entry[h.line_id]?.accept ?? ""} onChange={(e) => setEntry((x) => ({ ...x, [h.line_id]: { accept: e.target.value, reject: x[h.line_id]?.reject ?? "" } }))} /></td>
                    <td className="px-4 py-1.5"><Input inputMode="decimal" className="num text-right" aria-label={t("receiving.reject")} value={entry[h.line_id]?.reject ?? ""} onChange={(e) => setEntry((x) => ({ ...x, [h.line_id]: { accept: x[h.line_id]?.accept ?? "", reject: e.target.value } }))} /></td>
                    <td className="px-4 py-1.5 text-right"><Button type="button" disabled={busy} onClick={() => release(h)}>{t("receiving.decide")}</Button></td>
                  </>
                ) : null}
              </tr>
            ))}</tbody>
          </table>
        )}
      </Card>

      <div className="flex flex-wrap items-end gap-3">
        <Field label={t("receiving.from")}><Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></Field>
        <Field label={t("receiving.to")}><Input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></Field>
      </div>
      <Card className="p-0">
        <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("receiving.claimsTitle", { total: claims ? money(claims.total) : "" })}</h2>
        <p className="px-4 py-2 text-sm text-muted">{t("receiving.claimsHelp")}</p>
        {claims && claims.suppliers.length === 0 ? <p className="px-4 pb-4 text-sm text-muted">{t("receiving.noClaims")}</p> : null}
        {claims?.suppliers.map((s) => (
          <div key={s.supplierId} className="border-t border-rule">
            <div className="flex justify-between px-4 py-2 font-medium"><span>{s.supplier}</span><span className="num">{money(s.value)}</span></div>
            <table className="w-full text-sm">
              <tbody>{s.lines.map((l, i) => <tr key={i} className="border-t border-rule text-muted"><td className="px-4 py-1">{l.receipt} · {l.date}</td><td className="px-4 py-1">{l.item}</td><td className="num px-4 py-1 text-right">{t("receiving.shortN", { n: l.short })}</td><td className="num px-4 py-1 text-right">{t("receiving.damagedN", { n: l.damaged })}{l.defectCode ? <span className="block text-xs">{t(`receiving.defects.${l.defectCode}`)}</span> : null}</td><td className="num px-4 py-1 text-right">{t("receiving.returnedN", { n: l.returned })}</td><td className="num px-4 py-1 text-right">{money(l.value)}</td></tr>)}</tbody>
            </table>
          </div>
        ))}
      </Card>
    </div>
  );
}
