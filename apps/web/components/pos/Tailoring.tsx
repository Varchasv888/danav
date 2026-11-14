"use client";

import { Camera, Plus, Ruler, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { ApiError, api } from "@/lib/client-api";
import { localName, rupees, todayIso } from "@/lib/format";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

type Process = { process: string; rate: string; karigarId: string | null; karigar: string | null; doneOn: string | null };
export interface TailoringOrder {
  id: string; number: string; date: string; customerName: string; customerPhone: string; total: string; advance: string; advanceCode: string | null; advanceLeft: string | null;
  lines: { garment: string; qty: number; price: string; notes?: string; fabricQty: string | null; processes: Process[] }[];
  trialOn: string | null; deliveryOn: string; status: "booked" | "in_work" | "ready"; trialDue: boolean; dueToday: boolean; overdue: boolean;
}
export interface Rate { garment: string; process: string; rate: string }
interface Measurement { id: string; garment: string; values: Record<string, string>; takenOn: string; photoFileId: string | null; notes: string | null }
type Choice = { id: string; name: string };
type Fabric = { id: string; name: string; nameHi: string | null; saleRate: string };

const KEYS = ["Chest", "Waist", "Hip", "Shoulder", "Length", "Sleeve", "Neck", "Inseam"];
const STAGES = ["booked", "in_work", "ready"] as const;
const plusDays = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10);

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
      const key = [`tailoring.errors.${code}`, `alterations.errors.${code}`, `pos.errors.${code}`, `pos.promo.errors.${code}`].find((k) => t.has(k));
      setError(key ? t(key) : t("auth.errors.generic"));
    }
    setBusy(false);
  };
  return { error, setError, busy, run };
}

/** The tailoring counter: book orders on measurements, run them through karigars, bill at delivery. */
export function Tailoring({ orders, rates, karigars, fabrics, counters, canEdit }: {
  orders: TailoringOrder[]; rates: Rate[]; karigars: Choice[]; fabrics: Fabric[]; counters: { id: string; code: string; name: string }[]; canEdit: boolean;
}) {
  const t = useTranslations();
  const format = useFormatter();
  const d = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  const [mode, setMode] = useState<"order" | "measure" | null>(null);
  const garments = [...new Set(rates.map((r) => r.garment))];
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setMode(mode === "order" ? null : "order")}><Plus className="size-4" aria-hidden />{t("tailoring.newOrder")}</Button>
        <Button variant="outline" onClick={() => setMode(mode === "measure" ? null : "measure")}><Ruler className="size-4" aria-hidden />{t("tailoring.takeMeasurements")}</Button>
      </div>
      {mode === "order" ? <OrderForm garments={garments} fabrics={fabrics} onDone={() => setMode(null)} /> : null}
      {mode === "measure" ? <MeasureForm garments={garments} onDone={() => setMode(null)} /> : null}

      <div className="grid gap-4 xl:grid-cols-3">
        {STAGES.map((stage) => {
          const list = orders.filter((o) => o.status === stage);
          return (
            <Card key={stage} className="flex flex-col gap-3">
              <h2 className="flex items-center justify-between font-semibold">{t(`tailoring.status.${stage}`)}<span className="num text-sm font-normal text-muted">{list.length}</span></h2>
              {list.map((o) => <OrderCard key={o.id} order={o} karigars={karigars} counters={counters} d={d} />)}
              {!list.length ? <p className="text-sm text-muted">{t("alterations.none")}</p> : null}
            </Card>
          );
        })}
      </div>
      <RatesEditor rates={rates} canEdit={canEdit} />
    </div>
  );
}

function OrderCard({ order: o, karigars, counters, d }: { order: TailoringOrder; karigars: Choice[]; counters: { id: string; code: string; name: string }[]; d: (iso: string) => string }) {
  const t = useTranslations();
  const { error, busy, run } = useRun();
  const [pick, setPick] = useState<Record<string, string>>({});
  const [terminalId, setTerminalId] = useState(counters[0]?.id ?? "");
  const [mode, setMode] = useState<"cash" | "upi" | "card">("cash");
  const [cancelling, setCancelling] = useState(false);
  const [reason, setReason] = useState("");
  const credit = Number(o.advanceLeft ?? 0);
  const due = Math.max(0, Number(o.total) - credit);
  const noProcesses = o.lines.every((l) => !l.processes.length);
  return (
    <div className={`flex flex-col gap-2 rounded-lg border p-3 text-sm ${o.overdue ? "border-danger" : "border-border"}`}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono font-medium">{o.number}</span>
        <span className="flex gap-2 text-xs">
          {o.trialDue ? <span className="font-medium text-accent">{t("tailoring.trialDue")}</span> : null}
          {o.overdue ? <span className="font-medium text-danger">{t("alterations.overdue")}</span> : o.dueToday ? <span className="font-medium text-accent">{t("tailoring.today")}</span> : <span className="text-muted">{t("alterations.due", { date: d(o.deliveryOn) })}</span>}
        </span>
      </div>
      <div>{o.customerName} <span className="text-muted">· {o.customerPhone}</span></div>
      {o.lines.map((l, li) => (
        <div key={li} className="rounded-md bg-surface-2 p-2">
          <div className="font-medium">{l.garment} × {l.qty} <span className="font-normal text-muted">· {rupees(l.price)}</span></div>
          {l.notes ? <div className="text-xs text-muted">{l.notes}</div> : null}
          {l.processes.map((p, pi) => {
            const key = `${li}:${pi}`;
            return (
              <div key={pi} className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                <span className={`min-w-20 ${p.doneOn ? "text-success line-through" : ""}`}>{p.process}</span>
                {p.doneOn ? <span className="text-muted">{p.karigar} · {d(p.doneOn)}</span> : p.karigarId ? (
                  <>
                    <span className="text-muted">{p.karigar}</span>
                    <Button variant="ghost" className="h-7 px-2 text-xs" disabled={busy} onClick={() => run(() => api(`/tailoring-orders/${o.id}/done`, { body: { line: li, process: pi } }))}>{t("tailoring.markDone")}</Button>
                  </>
                ) : (
                  <>
                    <Select value={pick[key] ?? karigars[0]?.id ?? ""} onChange={(e) => setPick({ ...pick, [key]: e.target.value })} className="h-7 w-32 text-xs" aria-label={t("alterations.karigar")}>
                      {karigars.map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}
                    </Select>
                    <Button variant="ghost" className="h-7 px-2 text-xs" disabled={busy || !karigars.length} onClick={() => run(() => api(`/tailoring-orders/${o.id}/assign`, { body: { line: li, process: pi, karigarId: pick[key] ?? karigars[0]!.id } }))}>{t("alterations.give")}</Button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      ))}
      <div className="flex flex-wrap gap-x-3 text-xs text-muted">
        {o.trialOn ? <span>{t("alterations.trial", { date: d(o.trialOn) })}</span> : null}
        <span>{t("tailoring.totalAdvance", { total: rupees(o.total), advance: rupees(o.advance) })}</span>
      </div>
      {error ? <Alert>{error}</Alert> : null}
      {o.status !== "ready" && noProcesses ? <div><Button variant="outline" disabled={busy} onClick={() => run(() => api(`/tailoring-orders/${o.id}/ready`, { body: {} }))}>{t("tailoring.markReady")}</Button></div> : null}
      {o.status === "ready" ? (
        <div className="flex flex-wrap gap-2">
          <Select value={terminalId} onChange={(e) => setTerminalId(e.target.value)} aria-label={t("posReturns.counter")} className="min-w-32 flex-1">
            {counters.map((c) => <option key={c.id} value={c.id}>{c.code} · {c.name}</option>)}
          </Select>
          {due > 0 ? (
            <Select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)} aria-label={t("pos.billing.payments")} className="w-28">
              {(["cash", "upi", "card"] as const).map((m) => <option key={m} value={m}>{t(`pos.billing.modes.${m}`)}</option>)}
            </Select>
          ) : null}
          <Button disabled={busy || !terminalId} onClick={() => run(() => api(`/tailoring-orders/${o.id}/deliver`, { body: { terminalId, payments: due > 0 ? [{ mode, amount: due.toFixed(2) }] : [] } }))}>
            {t("tailoring.deliver", { amount: rupees(due) })}
          </Button>
          {!counters.length ? <p className="w-full text-xs text-muted">{t("posReturns.noShift")}</p> : null}
        </div>
      ) : null}
      {cancelling ? (
        <div className="flex gap-2">
          <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder={t("vouchers.cancelReason")} aria-label={t("vouchers.cancelReason")} />
          <Button variant="danger" disabled={busy || reason.trim().length < 3} onClick={() => run(() => api(`/tailoring-orders/${o.id}/cancel`, { body: { reason } }))}>{t("common.cancel")}</Button>
        </div>
      ) : <button type="button" onClick={() => setCancelling(true)} className="self-start text-xs text-muted hover:text-danger">{t("tailoring.cancelOrder")}</button>}
    </div>
  );
}

function OrderForm({ garments, fabrics, onDone }: { garments: string[]; fabrics: Fabric[]; onDone: () => void }) {
  const t = useTranslations();
  const locale = useLocale();
  const { error, setError, busy, run } = useRun();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [measures, setMeasures] = useState<Measurement[]>([]);
  const [lines, setLines] = useState([{ garment: garments[0] ?? "", qty: "1", price: "", measurementId: "", fabricItemId: "", fabricQty: "", notes: "" }]);
  const [advance, setAdvance] = useState("");
  const [advancePaidBy, setAdvancePaidBy] = useState<"cash" | "upi" | "card">("cash");
  const set = (i: number, patch: Partial<(typeof lines)[number]>) => setLines(lines.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  const total = lines.reduce((s, l) => s + Number(l.price || 0) * Number(l.qty || 0) + (l.fabricItemId ? Number(fabrics.find((f) => f.id === l.fabricItemId)?.saleRate ?? 0) * Number(l.fabricQty || 0) : 0), 0);
  async function lookup(v: string) {
    setPhone(v);
    if (v.length !== 10) { setMeasures([]); return; }
    try { setMeasures(await api<Measurement[]>(`/measurements?phone=${v}`)); } catch { setMeasures([]); }
  }
  function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const s = (k: string) => ((f.get(k) as string | null) ?? "").trim();
    if (!/^[6-9]\d{9}$/.test(phone)) { setError(t("promos.errors.invalid_phone")); return; }
    void run(() => api("/tailoring-orders", {
      body: {
        customerName: name, customerPhone: phone, deliveryOn: s("deliveryOn"), ...(s("trialOn") ? { trialOn: s("trialOn") } : {}),
        ...(Number(advance) > 0 ? { advance, advancePaidBy } : {}),
        lines: lines.filter((l) => l.garment.trim() && Number(l.price) >= 0).map((l) => ({
          garment: l.garment.trim(), qty: Math.max(1, Math.floor(Number(l.qty) || 1)), price: l.price || "0",
          ...(l.measurementId ? { measurementId: l.measurementId } : {}), ...(l.notes.trim() ? { notes: l.notes.trim() } : {}),
          ...(l.fabricItemId ? { fabricItemId: l.fabricItemId, fabricQty: l.fabricQty || "0" } : {}),
        })),
      },
    }), onDone);
  }
  return (
    <Card>
      <form onSubmit={save} className="flex flex-col gap-4">
        {error ? <Alert>{error}</Alert> : null}
        <div className="grid gap-4 md:grid-cols-4">
          <Field label={t("alterations.phone")} htmlFor="tl-phone" hint={measures.length ? t("tailoring.cardsFound", { n: measures.length }) : undefined}>
            <Input id="tl-phone" value={phone} onChange={(e) => void lookup(e.target.value.replace(/\D/g, "").slice(0, 10))} inputMode="tel" className="num" required />
          </Field>
          <Field label={t("pos.billing.customerName")} htmlFor="tl-name"><Input id="tl-name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} /></Field>
          <Field label={t("alterations.trialOn")} htmlFor="tl-trial"><Input id="tl-trial" name="trialOn" type="date" defaultValue={plusDays(5)} /></Field>
          <Field label={t("alterations.deliveryOn")} htmlFor="tl-del"><Input id="tl-del" name="deliveryOn" type="date" defaultValue={plusDays(8)} required /></Field>
        </div>
        <datalist id="tl-garments">{garments.map((g) => <option key={g} value={g} />)}</datalist>
        {lines.map((l, i) => (
          <div key={i} className="grid gap-2 rounded-lg border border-border p-3 md:grid-cols-6">
            <Input value={l.garment} onChange={(e) => set(i, { garment: e.target.value })} list="tl-garments" placeholder={t("alterations.garment")} aria-label={t("alterations.garment")} maxLength={40} />
            <Input value={l.qty} onChange={(e) => set(i, { qty: e.target.value })} inputMode="numeric" className="num" placeholder={t("schemes.qty")} aria-label={t("schemes.qty")} />
            <Input value={l.price} onChange={(e) => set(i, { price: e.target.value })} inputMode="decimal" className="num" placeholder={t("tailoring.stitchingPrice")} aria-label={t("tailoring.stitchingPrice")} />
            <Select value={l.measurementId} onChange={(e) => set(i, { measurementId: e.target.value })} aria-label={t("tailoring.measurements")}>
              <option value="">{t("tailoring.noCard")}</option>
              {measures.filter((m) => !l.garment || m.garment.toLowerCase() === l.garment.trim().toLowerCase()).map((m) => <option key={m.id} value={m.id}>{m.garment} · {m.takenOn}</option>)}
            </Select>
            <Select value={l.fabricItemId} onChange={(e) => set(i, { fabricItemId: e.target.value })} aria-label={t("tailoring.fabric")}>
              <option value="">{t("tailoring.ownFabric")}</option>
              {fabrics.map((f) => <option key={f.id} value={f.id}>{localName(f, locale)} · {rupees(f.saleRate)}</option>)}
            </Select>
            <div className="flex gap-2">
              {l.fabricItemId ? <Input value={l.fabricQty} onChange={(e) => set(i, { fabricQty: e.target.value })} inputMode="decimal" className="num" placeholder={t("tailoring.metres")} aria-label={t("tailoring.metres")} /> : <span className="flex-1" />}
              <button type="button" onClick={() => setLines(lines.filter((_, j) => j !== i))} disabled={lines.length === 1} className="rounded-md p-2 text-muted hover:text-danger disabled:opacity-40" title={t("common.remove")}>
                <Trash2 className="size-4" aria-hidden /><span className="sr-only">{t("common.remove")}</span>
              </button>
            </div>
            <div className="md:col-span-6"><Input value={l.notes} onChange={(e) => set(i, { notes: e.target.value })} placeholder={t("tailoring.styleNotes")} aria-label={t("tailoring.styleNotes")} maxLength={300} /></div>
          </div>
        ))}
        <div><Button type="button" variant="ghost" className="-ml-3" onClick={() => setLines([...lines, { garment: garments[0] ?? "", qty: "1", price: "", measurementId: "", fabricItemId: "", fabricQty: "", notes: "" }])}><Plus className="size-4" aria-hidden />{t("tailoring.addGarment")}</Button></div>
        <div className="grid gap-4 md:grid-cols-4">
          <Field label={t("tailoring.advance")} htmlFor="tl-adv" hint={t("tailoring.advanceHint")}><Input id="tl-adv" value={advance} onChange={(e) => setAdvance(e.target.value)} inputMode="decimal" className="num" /></Field>
          <Field label={t("promos.gift.paidBy")} htmlFor="tl-paid">
            <Select id="tl-paid" value={advancePaidBy} onChange={(e) => setAdvancePaidBy(e.target.value as typeof advancePaidBy)}>
              {(["cash", "upi", "card"] as const).map((m) => <option key={m} value={m}>{t(`pos.billing.modes.${m}`)}</option>)}
            </Select>
          </Field>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={busy}>{t("tailoring.book")}</Button>
          <Button type="button" variant="ghost" onClick={onDone}>{t("common.cancel")}</Button>
          <span className="ml-auto text-sm text-muted">{t("tailoring.estimate", { amount: rupees(total) })}</span>
        </div>
      </form>
    </Card>
  );
}

function MeasureForm({ garments, onDone }: { garments: string[]; onDone: () => void }) {
  const t = useTranslations();
  const { error, setError, busy, run } = useRun();
  const [values, setValues] = useState<Record<string, string>>({});
  const [extra, setExtra] = useState({ key: "", value: "" });
  const [photo, setPhoto] = useState<{ id: string; name: string } | null>(null);
  async function upload(file: File) {
    if (file.size > 6 * 1024 * 1024) { setError(t("tailoring.errors.photo_too_big")); return; }
    const base64 = await new Promise<string>((resolve) => { const r = new FileReader(); r.onload = () => resolve(String(r.result).split(",")[1] ?? ""); r.readAsDataURL(file); });
    await run(async () => setPhoto({ id: (await api<{ id: string }>("/files", { body: { name: file.name, contentType: file.type, base64 } })).id, name: file.name }));
  }
  function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const s = (k: string) => ((f.get(k) as string | null) ?? "").trim();
    const all = { ...values, ...(extra.key.trim() && extra.value.trim() ? { [extra.key.trim()]: extra.value.trim() } : {}) };
    void run(() => api("/measurements", { body: { customerPhone: s("phone"), customerName: s("name") || undefined, garment: s("garment"), values: all, ...(photo ? { photoFileId: photo.id } : {}), ...(s("notes") ? { notes: s("notes") } : {}) } }), onDone);
  }
  return (
    <Card>
      <form onSubmit={save} className="flex flex-col gap-4">
        {error ? <Alert>{error}</Alert> : null}
        <div className="grid gap-4 md:grid-cols-3">
          <Field label={t("alterations.phone")} htmlFor="ms-phone"><Input id="ms-phone" name="phone" inputMode="tel" maxLength={10} pattern="[6-9][0-9]{9}" className="num" required /></Field>
          <Field label={t("pos.billing.customerName")} htmlFor="ms-name"><Input id="ms-name" name="name" maxLength={80} /></Field>
          <Field label={t("alterations.garment")} htmlFor="ms-garment"><Input id="ms-garment" name="garment" list="ms-garments" defaultValue={garments[0] ?? ""} required maxLength={40} /></Field>
          <datalist id="ms-garments">{garments.map((g) => <option key={g} value={g} />)}</datalist>
        </div>
        <p className="text-sm text-muted">{t("tailoring.inches")}</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {KEYS.map((k) => (
            <Field key={k} label={t(`tailoring.keys.${k}`)} htmlFor={`ms-${k}`}>
              <Input id={`ms-${k}`} value={values[k] ?? ""} onChange={(e) => setValues({ ...values, [k]: e.target.value })} inputMode="decimal" className="num" maxLength={10} />
            </Field>
          ))}
          <Field label={t("tailoring.otherMeasure")} htmlFor="ms-xk"><Input id="ms-xk" value={extra.key} onChange={(e) => setExtra({ ...extra, key: e.target.value })} maxLength={30} /></Field>
          <Field label={t("tailoring.value")} htmlFor="ms-xv"><Input id="ms-xv" value={extra.value} onChange={(e) => setExtra({ ...extra, value: e.target.value })} inputMode="decimal" className="num" maxLength={10} /></Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={t("alterations.notes")} htmlFor="ms-notes"><Input id="ms-notes" name="notes" maxLength={300} /></Field>
          <div className="flex items-end gap-3">
            <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-border px-3 text-sm hover:bg-surface-2">
              <Camera className="size-4" aria-hidden />{photo ? photo.name : t("tailoring.photo")}
              <input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" className="sr-only" onChange={(e) => { const file = e.target.files?.[0]; if (file) void upload(file); }} />
            </label>
          </div>
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={busy}>{t("common.save")}</Button>
          <Button type="button" variant="ghost" onClick={onDone}>{t("common.cancel")}</Button>
        </div>
      </form>
    </Card>
  );
}

function RatesEditor({ rates, canEdit }: { rates: Rate[]; canEdit: boolean }) {
  const t = useTranslations();
  const { error, busy, run } = useRun();
  const [rows, setRows] = useState(rates.map((r) => ({ ...r, rate: String(Number(r.rate)) })));
  const set = (i: number, patch: Partial<Rate>) => setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-semibold">{t("tailoring.rates")}</h2>
      <p className="text-sm text-muted">{t("tailoring.ratesHint")}</p>
      <Card className="flex flex-col gap-2">
        {error ? <Alert>{error}</Alert> : null}
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_100px_auto] gap-2">
            <Input value={r.garment} onChange={(e) => set(i, { garment: e.target.value })} placeholder={t("alterations.garment")} aria-label={t("alterations.garment")} disabled={!canEdit} maxLength={40} />
            <Input value={r.process} onChange={(e) => set(i, { process: e.target.value })} placeholder={t("tailoring.process")} aria-label={t("tailoring.process")} disabled={!canEdit} maxLength={40} />
            <Input value={r.rate} onChange={(e) => set(i, { rate: e.target.value })} inputMode="decimal" className="num" placeholder={t("alterations.labourCol")} aria-label={t("alterations.labourCol")} disabled={!canEdit} />
            {canEdit ? <button type="button" onClick={() => setRows(rows.filter((_, j) => j !== i))} className="rounded-md p-2 text-muted hover:text-danger" title={t("common.remove")}><Trash2 className="size-4" aria-hidden /><span className="sr-only">{t("common.remove")}</span></button> : <span />}
          </div>
        ))}
        {!rows.length ? <p className="text-sm text-muted">{t("tailoring.noRates")}</p> : null}
        {canEdit ? (
          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" className="-ml-3" onClick={() => setRows([...rows, { garment: rows.at(-1)?.garment ?? "", process: "", rate: "" }])}><Plus className="size-4" aria-hidden />{t("tailoring.addRate")}</Button>
            <Button variant="outline" disabled={busy} onClick={() => run(() => api("/tailoring-rates", { method: "PUT", body: { rates: rows.filter((r) => r.garment.trim() && r.process.trim()).map((r) => ({ ...r, rate: r.rate || "0" })) } }))}>{t("common.save")}</Button>
          </div>
        ) : null}
      </Card>
    </section>
  );
}
