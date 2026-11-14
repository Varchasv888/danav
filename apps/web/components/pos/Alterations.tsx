"use client";

import { Plus, Scissors, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { rupees, todayIso } from "@/lib/format";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

export interface AlterationType { id: string; name: string; kind: "alteration" | "repair"; charge: string; labour: string; active: boolean }
export interface Karigar { id: string; name: string; phone: string | null; accountId: string | null; active: boolean }
export interface Slip {
  id: string; number: string; date: string; customerName: string | null; customerPhone: string | null; billNumber: string | null;
  lines: { name: string; garment: string; qty: number; charge: string; notes?: string }[]; charge: string; labour: string; complimentary: boolean;
  trialOn: string | null; deliveryOn: string; status: "received" | "with_karigar" | "ready" | "delivered" | "cancelled"; karigar: string | null; overdue: boolean; trialToday: boolean;
}
export interface LabourRow { karigar: string; outside: boolean; slips: number; pieces: number; labour: string }
type Counter = { id: string; code: string; name: string };

const STAGES = ["received", "with_karigar", "ready"] as const;
const plusDays = (iso: string, n: number) => new Date(Date.parse(`${iso}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

function useRun() {
  const t = useTranslations();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const run = async (fn: () => Promise<unknown>, after?: () => void) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      after?.();
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? (err.issues?.[0]?.message ?? err.code) : "generic";
      const key = [`alterations.errors.${code}`, `pos.errors.${code}`, `pos.promo.errors.${code}`].find((k) => t.has(k));
      setError(key ? t(key) : t("auth.errors.generic"));
    }
    setBusy(false);
  };
  return { error, setError, busy, run };
}

/** The alteration desk: take in a slip, move it through the workroom, hand it back. */
export function Alterations({ slips, types, karigars, counters, labour, canEdit }: {
  slips: Slip[]; types: AlterationType[]; karigars: Karigar[]; counters: Counter[]; labour: { from: string; to: string; rows: LabourRow[] }; canEdit: boolean;
}) {
  const t = useTranslations();
  const format = useFormatter();
  const d = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  const [creating, setCreating] = useState(false);
  return (
    <div className="flex flex-col gap-8">
      {canEdit && !creating && types.some((x) => x.active) ? <div><Button onClick={() => setCreating(true)}><Plus className="size-4" aria-hidden />{t("alterations.newSlip")}</Button></div> : null}
      {creating ? <SlipForm types={types.filter((x) => x.active)} onDone={() => setCreating(false)} /> : null}
      {!types.length ? <Alert>{t("alterations.setUpFirst")}</Alert> : null}

      <div className="grid gap-4 xl:grid-cols-3">
        {STAGES.map((stage) => {
          const list = slips.filter((s) => s.status === stage);
          return (
            <Card key={stage} className="flex flex-col gap-3">
              <h2 className="flex items-center justify-between font-semibold">{t(`alterations.status.${stage}`)}<span className="num text-sm font-normal text-muted">{list.length}</span></h2>
              {list.map((s) => <SlipCard key={s.id} slip={s} karigars={karigars.filter((k) => k.active)} counters={counters} d={d} />)}
              {!list.length ? <p className="text-sm text-muted">{t("alterations.none")}</p> : null}
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <TypesEditor types={types} canEdit={canEdit} />
        <KarigarsEditor karigars={karigars} canEdit={canEdit} />
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">{t("alterations.labour", { from: d(labour.from), to: d(labour.to) })}</h2>
        <Card className="p-0">
          <table className="w-full text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">{t("alterations.karigar")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("alterations.slips")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("alterations.pieces")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("alterations.labourCol")}</th>
              </tr>
            </thead>
            <tbody>
              {labour.rows.map((r) => (
                <tr key={r.karigar} className="border-b border-border last:border-0">
                  <td className="px-5 py-2.5">{r.karigar}<span className="ml-2 text-xs text-muted">{r.outside ? t("alterations.outside") : t("alterations.inHouse")}</span></td>
                  <td className="num px-5 py-2.5 text-right">{r.slips}</td>
                  <td className="num px-5 py-2.5 text-right">{r.pieces}</td>
                  <td className="num px-5 py-2.5 text-right font-medium">{rupees(r.labour)}</td>
                </tr>
              ))}
              {!labour.rows.length ? <tr><td colSpan={4} className="px-5 py-8 text-center text-muted">{t("alterations.noLabour")}</td></tr> : null}
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}

function SlipCard({ slip, karigars, counters, d }: { slip: Slip; karigars: Karigar[]; counters: Counter[]; d: (iso: string) => string }) {
  const t = useTranslations();
  const { error, busy, run } = useRun();
  const [karigarId, setKarigarId] = useState(karigars[0]?.id ?? "");
  const [terminalId, setTerminalId] = useState(counters[0]?.id ?? "");
  const [mode, setMode] = useState<"cash" | "upi" | "card">("cash");
  const [cancelling, setCancelling] = useState(false);
  const [reason, setReason] = useState("");
  const charge = slip.complimentary ? 0 : Number(slip.charge);
  return (
    <div className={`flex flex-col gap-2 rounded-lg border p-3 text-sm ${slip.overdue ? "border-danger" : "border-border"}`}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono font-medium">{slip.number}</span>
        <span className={`text-xs ${slip.overdue ? "font-medium text-danger" : "text-muted"}`}>{slip.overdue ? t("alterations.overdue") : t("alterations.due", { date: d(slip.deliveryOn) })}</span>
      </div>
      <div>{slip.customerName ?? ""}{slip.customerPhone ? <span className="text-muted"> · {slip.customerPhone}</span> : null}{slip.billNumber ? <span className="text-muted"> · {slip.billNumber}</span> : null}</div>
      <ul className="text-muted">{slip.lines.map((l, i) => <li key={i}>{l.garment}: {l.name}{l.qty > 1 ? ` × ${l.qty}` : ""}{l.notes ? ` (${l.notes})` : ""}</li>)}</ul>
      <div className="flex flex-wrap gap-x-3 text-xs text-muted">
        {slip.trialOn ? <span className={slip.trialToday ? "font-medium text-accent" : ""}>{t("alterations.trial", { date: d(slip.trialOn) })}</span> : null}
        {slip.karigar ? <span>{t("alterations.with", { name: slip.karigar })}</span> : null}
        <span>{slip.complimentary ? t("alterations.free") : rupees(slip.charge)}</span>
      </div>
      {error ? <Alert>{error}</Alert> : null}
      {slip.status === "received" ? (
        <div className="flex gap-2">
          <Select value={karigarId} onChange={(e) => setKarigarId(e.target.value)} aria-label={t("alterations.karigar")}>
            {karigars.map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}
          </Select>
          <Button variant="outline" disabled={busy || !karigarId} onClick={() => run(() => api(`/alterations/${slip.id}/issue`, { body: { karigarId } }))}>{t("alterations.give")}</Button>
        </div>
      ) : null}
      {slip.status === "with_karigar" ? <div><Button variant="outline" disabled={busy} onClick={() => run(() => api(`/alterations/${slip.id}/receive`, { body: {} }))}>{t("alterations.back")}</Button></div> : null}
      {slip.status === "ready" ? (
        charge > 0 ? (
          <div className="flex flex-wrap gap-2">
            <Select value={terminalId} onChange={(e) => setTerminalId(e.target.value)} aria-label={t("posReturns.counter")} className="min-w-32 flex-1">
              {counters.map((c) => <option key={c.id} value={c.id}>{c.code} · {c.name}</option>)}
            </Select>
            <Select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)} aria-label={t("pos.billing.payments")} className="w-28">
              {(["cash", "upi", "card"] as const).map((m) => <option key={m} value={m}>{t(`pos.billing.modes.${m}`)}</option>)}
            </Select>
            <Button disabled={busy || !terminalId} onClick={() => run(() => api(`/alterations/${slip.id}/deliver`, { body: { terminalId, payments: [{ mode, amount: slip.charge }] } }))}>
              {t("alterations.deliverCollect", { amount: rupees(slip.charge) })}
            </Button>
            {!counters.length ? <p className="w-full text-xs text-muted">{t("posReturns.noShift")}</p> : null}
          </div>
        ) : <div><Button disabled={busy} onClick={() => run(() => api(`/alterations/${slip.id}/deliver`, { body: {} }))}>{t("alterations.deliver")}</Button></div>
      ) : null}
      {cancelling ? (
        <div className="flex gap-2">
          <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder={t("vouchers.cancelReason")} aria-label={t("vouchers.cancelReason")} />
          <Button variant="danger" disabled={busy || reason.trim().length < 3} onClick={() => run(() => api(`/alterations/${slip.id}/cancel`, { body: { reason } }))}>{t("common.cancel")}</Button>
        </div>
      ) : <button type="button" onClick={() => setCancelling(true)} className="self-start text-xs text-muted hover:text-danger">{t("alterations.cancelSlip")}</button>}
    </div>
  );
}

function SlipForm({ types, onDone }: { types: AlterationType[]; onDone: () => void }) {
  const t = useTranslations();
  const { error, setError, busy, run } = useRun();
  const today = todayIso();
  const [billNumber, setBillNumber] = useState("");
  const [bill, setBill] = useState<{ id: string; customerName: string | null; customerPhone: string | null; lines: { name: string }[] } | null>(null);
  const [lines, setLines] = useState([{ typeId: types[0]?.id ?? "", garment: "", qty: "1", notes: "" }]);
  const charge = lines.reduce((s, l) => s + Number(types.find((x) => x.id === l.typeId)?.charge ?? 0) * Number(l.qty || 0), 0);
  async function findBill() {
    if (!billNumber.trim()) { setBill(null); return; }
    try { setBill(await api(`/pos/bills/lookup?number=${encodeURIComponent(billNumber.trim())}`)); setError(null); } catch { setBill(null); setError(t("posReturns.notFound")); }
  }
  function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const s = (k: string) => ((f.get(k) as string | null) ?? "").trim();
    void run(() => api("/alterations", {
      body: {
        ...(bill ? { billId: bill.id } : {}), ...(s("customerName") ? { customerName: s("customerName") } : {}), ...(s("customerPhone") ? { customerPhone: s("customerPhone") } : {}),
        lines: lines.filter((l) => l.typeId && l.garment.trim()).map((l) => ({ typeId: l.typeId, garment: l.garment.trim(), qty: Math.max(1, Math.floor(Number(l.qty) || 1)), ...(l.notes.trim() ? { notes: l.notes.trim() } : {}) })),
        ...(s("trialOn") ? { trialOn: s("trialOn") } : {}), deliveryOn: s("deliveryOn"), complimentary: f.get("complimentary") === "on", ...(s("notes") ? { notes: s("notes") } : {}),
      },
    }), onDone);
  }
  return (
    <Card>
      <form onSubmit={save} className="flex flex-col gap-4">
        {error ? <Alert>{error}</Alert> : null}
        <div className="grid gap-4 md:grid-cols-4">
          <Field label={t("alterations.againstBill")} htmlFor="al-bill" hint={bill ? bill.lines.map((l) => l.name).join(", ") : undefined}>
            <Input id="al-bill" value={billNumber} onChange={(e) => setBillNumber(e.target.value)} onBlur={() => void findBill()} placeholder={t("common.optional")} className="font-mono uppercase" />
          </Field>
          <Field label={t("pos.billing.customerName")} htmlFor="al-name"><Input id="al-name" name="customerName" key={bill?.id ?? "x"} defaultValue={bill?.customerName ?? ""} maxLength={80} /></Field>
          <Field label={t("alterations.phone")} htmlFor="al-phone"><Input id="al-phone" name="customerPhone" key={`p${bill?.id ?? "x"}`} defaultValue={bill?.customerPhone ?? ""} inputMode="tel" maxLength={10} pattern="[6-9][0-9]{9}" className="num" /></Field>
          <div />
          <Field label={t("alterations.trialOn")} htmlFor="al-trial"><Input id="al-trial" name="trialOn" type="date" defaultValue={plusDays(today, 2)} /></Field>
          <Field label={t("alterations.deliveryOn")} htmlFor="al-del"><Input id="al-del" name="deliveryOn" type="date" defaultValue={plusDays(today, 3)} required /></Field>
          <label className="flex items-center gap-2 self-end pb-2.5 text-sm"><input type="checkbox" name="complimentary" className="size-4 accent-[var(--primary)]" />{t("alterations.complimentary")}</label>
        </div>
        <div className="flex flex-col gap-2">
          {lines.map((l, i) => (
            <div key={i} className="grid gap-2 md:grid-cols-[1.2fr_1.2fr_70px_1.5fr_auto]">
              <Input value={l.garment} onChange={(e) => setLines(lines.map((x, j) => (j === i ? { ...x, garment: e.target.value } : x)))} placeholder={t("alterations.garment")} aria-label={t("alterations.garment")} maxLength={80} />
              <Select value={l.typeId} onChange={(e) => setLines(lines.map((x, j) => (j === i ? { ...x, typeId: e.target.value } : x)))} aria-label={t("alterations.work")}>
                {types.map((ty) => <option key={ty.id} value={ty.id}>{ty.name} · {rupees(ty.charge)}</option>)}
              </Select>
              <Input value={l.qty} onChange={(e) => setLines(lines.map((x, j) => (j === i ? { ...x, qty: e.target.value } : x)))} inputMode="numeric" className="num" aria-label={t("schemes.qty")} />
              <Input value={l.notes} onChange={(e) => setLines(lines.map((x, j) => (j === i ? { ...x, notes: e.target.value } : x)))} placeholder={t("alterations.notes")} aria-label={t("alterations.notes")} maxLength={200} />
              <button type="button" onClick={() => setLines(lines.filter((_, j) => j !== i))} disabled={lines.length === 1} className="rounded-md p-2 text-muted hover:text-danger disabled:opacity-40" title={t("common.remove")}>
                <Trash2 className="size-4" aria-hidden /><span className="sr-only">{t("common.remove")}</span>
              </button>
            </div>
          ))}
          <div><Button type="button" variant="ghost" className="-ml-3" onClick={() => setLines([...lines, { typeId: types[0]?.id ?? "", garment: lines.at(-1)?.garment ?? "", qty: "1", notes: "" }])}><Plus className="size-4" aria-hidden />{t("alterations.addWork")}</Button></div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={busy}>{t("alterations.takeIn")}</Button>
          <Button type="button" variant="ghost" onClick={onDone}>{t("common.cancel")}</Button>
          <span className="ml-auto text-sm text-muted">{t("alterations.charge", { amount: rupees(charge) })}</span>
        </div>
      </form>
    </Card>
  );
}

function TypesEditor({ types, canEdit }: { types: AlterationType[]; canEdit: boolean }) {
  const t = useTranslations();
  const { error, busy, run } = useRun();
  const [draft, setDraft] = useState({ name: "", kind: "alteration", charge: "", labour: "" });
  return (
    <Card className="flex flex-col gap-3">
      <h2 className="flex items-center gap-2 font-semibold"><Scissors className="size-4 text-primary" aria-hidden />{t("alterations.types")}</h2>
      {error ? <Alert>{error}</Alert> : null}
      <table className="w-full text-sm">
        <thead className="text-left text-muted"><tr className="border-b border-border">
          <th className="py-2 pr-3 font-medium">{t("schemes.name")}</th>
          <th className="py-2 pr-3 text-right font-medium">{t("alterations.customerCharge")}</th>
          <th className="py-2 text-right font-medium">{t("alterations.labourCol")}</th>
        </tr></thead>
        <tbody>
          {types.map((ty) => (
            <tr key={ty.id} className={`border-b border-border last:border-0 ${ty.active ? "" : "text-muted"}`}>
              <td className="py-2 pr-3">{ty.name} <span className="text-xs text-muted">{t(`alterations.kinds.${ty.kind}`)}</span></td>
              <td className="num py-2 pr-3 text-right">{rupees(ty.charge)}</td>
              <td className="num py-2 text-right">{rupees(ty.labour)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {canEdit ? (
        <div className="grid gap-2 sm:grid-cols-[1.5fr_1fr_80px_80px_auto]">
          <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder={t("schemes.name")} aria-label={t("schemes.name")} maxLength={60} />
          <Select value={draft.kind} onChange={(e) => setDraft({ ...draft, kind: e.target.value })} aria-label={t("schemes.kind")}>
            <option value="alteration">{t("alterations.kinds.alteration")}</option>
            <option value="repair">{t("alterations.kinds.repair")}</option>
          </Select>
          <Input value={draft.charge} onChange={(e) => setDraft({ ...draft, charge: e.target.value })} placeholder={t("alterations.customerCharge")} aria-label={t("alterations.customerCharge")} inputMode="decimal" className="num" />
          <Input value={draft.labour} onChange={(e) => setDraft({ ...draft, labour: e.target.value })} placeholder={t("alterations.labourCol")} aria-label={t("alterations.labourCol")} inputMode="decimal" className="num" />
          <Button variant="outline" disabled={busy || !draft.name.trim()} onClick={() => run(() => api("/alteration-types", { body: { ...draft, charge: draft.charge || "0", labour: draft.labour || "0" } }), () => setDraft({ name: "", kind: "alteration", charge: "", labour: "" }))}>
            <Plus className="size-4" aria-hidden />{t("common.add")}
          </Button>
        </div>
      ) : null}
    </Card>
  );
}

function KarigarsEditor({ karigars, canEdit }: { karigars: Karigar[]; canEdit: boolean }) {
  const t = useTranslations();
  const { error, busy, run } = useRun();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [outside, setOutside] = useState(false);
  return (
    <Card className="flex flex-col gap-3">
      <h2 className="flex items-center gap-2 font-semibold"><Users className="size-4 text-primary" aria-hidden />{t("alterations.karigars")}</h2>
      <p className="text-sm text-muted">{t("alterations.karigarHint")}</p>
      {error ? <Alert>{error}</Alert> : null}
      <ul className="divide-y divide-border text-sm">
        {karigars.map((k) => (
          <li key={k.id} className={`flex justify-between gap-3 py-2 ${k.active ? "" : "text-muted"}`}>
            <span>{k.name}{k.phone ? <span className="text-muted"> · {k.phone}</span> : null}</span>
            <span className="text-xs text-muted">{k.accountId ? t("alterations.outside") : t("alterations.inHouse")}</span>
          </li>
        ))}
        {!karigars.length ? <li className="py-2 text-muted">{t("alterations.noKarigars")}</li> : null}
      </ul>
      {canEdit ? (
        <div className="grid gap-2 sm:grid-cols-[1.5fr_1fr_auto_auto]">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("schemes.name")} aria-label={t("schemes.name")} maxLength={80} />
          <Input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder={t("alterations.phone")} aria-label={t("alterations.phone")} inputMode="tel" className="num" />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={outside} onChange={(e) => setOutside(e.target.checked)} className="size-4 accent-[var(--primary)]" />{t("alterations.outside")}</label>
          <Button variant="outline" disabled={busy || !name.trim()} onClick={() => run(() => api("/karigars", { body: { name, outside, ...(phone ? { phone } : {}) } }), () => { setName(""); setPhone(""); setOutside(false); })}>
            <Plus className="size-4" aria-hidden />{t("common.add")}
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
