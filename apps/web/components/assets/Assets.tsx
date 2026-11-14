"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { GST_STATES, devanagari } from "@varchasv/domain";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { localName, rupees, todayIso } from "@/lib/format";
import { Alert, Button, Card, Field, Input, Select } from "../ui";

export const ASSET_NS = ["assets.errors", "vouchers.errors"];
type Opt = { id: string; name: string; nameHi: string | null };
export interface AssetClass { id: string; name: string; nameHi: string | null; method: "slm" | "wdv"; lifeYears: string; residualPct: string; itBlock: string; itRate: string; archived: boolean }
export interface Preset { key: string; name: string; nameHi: string; lifeYears: number; itBlock: string; itRate: number }
const BLOCKS = ["building", "plant_machinery", "furniture", "computers", "intangibles"];

export function ClassesEditor({ classes, presets, canEdit }: { classes: AssetClass[]; presets: Preset[]; canEdit: boolean }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const unused = presets.filter((p) => !classes.some((c) => c.name === p.name));
  const [preset, setPreset] = useState(unused[0]?.key ?? "");
  const [error, setError] = useState<string | null>(null);
  const create = async (body: object) => {
    setError(null);
    try { await api("/assets/classes", { body }); router.refresh(); } catch (err) { setError(errorText(t, err, ASSET_NS)); }
  };
  return (
    <Card className="flex flex-col gap-4">
      <h2 className="font-semibold">{t("assets.classes.title")}</h2>
      {classes.length ? (
        <table className="w-full text-sm">
          <thead className="text-left text-muted"><tr className="border-b border-border">
            <th className="py-2 pr-3 font-medium">{t("assets.classes.name")}</th><th className="py-2 pr-3 font-medium">{t("assets.classes.method")}</th>
            <th className="py-2 pr-3 text-right font-medium">{t("assets.classes.life")}</th><th className="py-2 pr-3 text-right font-medium">{t("assets.classes.residual")}</th>
            <th className="py-2 pr-3 font-medium">{t("assets.classes.itBlock")}</th><th className="py-2 text-right font-medium">{t("assets.classes.itRate")}</th>
          </tr></thead>
          <tbody>
            {classes.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="py-2 pr-3">{localName(c, locale)}</td><td className="py-2 pr-3">{t(`assets.classes.methods.${c.method}`)}</td>
                <td className="num py-2 pr-3 text-right">{Number(c.lifeYears)}</td><td className="num py-2 pr-3 text-right">{Number(c.residualPct)}%</td>
                <td className="py-2 pr-3">{t.has(`assets.classes.blocks.${c.itBlock}`) ? t(`assets.classes.blocks.${c.itBlock}`) : c.itBlock}</td><td className="num py-2 text-right">{Number(c.itRate)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
      {canEdit ? (
        <>
          {unused.length ? (
            <div className="flex flex-wrap items-end gap-3">
              <Field label={t("assets.classes.presets")} htmlFor="ac-preset">
                <Select id="ac-preset" value={preset} onChange={(e) => setPreset(e.target.value)} className="w-72">
                  {unused.map((p) => <option key={p.key} value={p.key}>{devanagari(locale) ? p.nameHi : p.name} · {p.lifeYears} / {p.itRate}%</option>)}
                </Select>
              </Field>
              <Button variant="outline" onClick={() => create({ preset })} disabled={!preset}><Plus className="size-4" aria-hidden />{t("assets.classes.add")}</Button>
            </div>
          ) : null}
          <details>
            <summary className="cursor-pointer text-sm text-primary">{t("assets.classes.custom")}</summary>
            <form className="mt-3 grid gap-3 md:grid-cols-3 xl:grid-cols-6" onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              void create({ name: f.get("name"), method: f.get("method"), lifeYears: f.get("life"), residualPct: f.get("residual") || "5", itBlock: f.get("block"), itRate: f.get("rate") });
            }}>
              <Field label={t("assets.classes.name")} htmlFor="ac-name"><Input id="ac-name" name="name" required minLength={2} maxLength={60} /></Field>
              <Field label={t("assets.classes.method")} htmlFor="ac-method"><Select id="ac-method" name="method">{(["slm", "wdv"] as const).map((m) => <option key={m} value={m}>{t(`assets.classes.methods.${m}`)}</option>)}</Select></Field>
              <Field label={t("assets.classes.life")} htmlFor="ac-life"><Input id="ac-life" name="life" required inputMode="decimal" className="num" /></Field>
              <Field label={t("assets.classes.residual")} htmlFor="ac-res"><Input id="ac-res" name="residual" defaultValue="5" inputMode="decimal" className="num" /></Field>
              <Field label={t("assets.classes.itBlock")} htmlFor="ac-block"><Select id="ac-block" name="block">{BLOCKS.map((b) => <option key={b} value={b}>{t(`assets.classes.blocks.${b}`)}</option>)}</Select></Field>
              <Field label={t("assets.classes.itRate")} htmlFor="ac-rate"><Input id="ac-rate" name="rate" required inputMode="decimal" className="num" /></Field>
              <div className="md:col-span-3 xl:col-span-6"><Button type="submit" variant="outline">{t("assets.classes.add")}</Button></div>
            </form>
          </details>
        </>
      ) : null}
      {error ? <Alert>{error}</Alert> : null}
    </Card>
  );
}

export function AssetForm({ classes, suppliers, cashBank, employees }: { classes: AssetClass[]; suppliers: Opt[]; cashBank: Opt[]; employees: { id: string; code: string; name: string }[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [acquisition, setAcq] = useState<"supplier" | "paid" | "opening">("supplier");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const s = (k: string) => String(f.get(k) ?? "").trim() || undefined;
    setBusy(true);
    setError(null);
    try {
      const a = await api<{ id: string }>("/assets", {
        body: {
          classId: s("classId"), name: s("name"), purchaseDate: s("purchaseDate"), putToUseOn: s("putToUseOn"), cost: s("cost"), acquisition,
          accountId: acquisition === "opening" ? undefined : s("accountId"), gstRate: acquisition === "opening" ? undefined : s("gstRate"),
          supplierGstin: s("supplierGstin"), openingAccumulated: acquisition === "opening" ? s("openingAccumulated") : undefined,
          location: s("location"), serialNo: s("serialNo"), custodianId: s("custodianId"), invoiceRef: s("invoiceRef"), notes: s("notes"),
        },
      });
      router.push(`/assets/${a.id}`);
    } catch (err) { setError(errorText(t, err, ASSET_NS)); setBusy(false); }
  }
  return (
    <Card>
      <form onSubmit={save} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="md:col-span-2"><Field label={t("assets.register.name")} htmlFor="as-name"><Input id="as-name" name="name" required minLength={2} maxLength={120} autoFocus /></Field></div>
        <Field label={t("assets.register.class")} htmlFor="as-class">
          <Select id="as-class" name="classId" required>{classes.filter((c) => !c.archived).map((c) => <option key={c.id} value={c.id}>{localName(c, locale)}</option>)}</Select>
        </Field>
        <Field label={t("assets.register.cost")} htmlFor="as-cost"><Input id="as-cost" name="cost" required inputMode="decimal" className="num" /></Field>
        <Field label={t("assets.register.purchased")} htmlFor="as-pd"><Input id="as-pd" name="purchaseDate" type="date" defaultValue={todayIso()} required /></Field>
        <Field label={t("assets.register.putToUse")} htmlFor="as-pu"><Input id="as-pu" name="putToUseOn" type="date" /></Field>
        <div className="md:col-span-2">
          <Field label={t("assets.form.acquisition")} htmlFor="as-acq">
            <Select id="as-acq" value={acquisition} onChange={(e) => setAcq(e.target.value as typeof acquisition)}>
              {(["supplier", "paid", "opening"] as const).map((a) => <option key={a} value={a}>{t(`assets.form.acquisitions.${a}`)}</option>)}
            </Select>
          </Field>
        </div>
        {acquisition === "opening" ? (
          <Field label={t("assets.form.openingAccumulated")} htmlFor="as-oa"><Input id="as-oa" name="openingAccumulated" inputMode="decimal" className="num" /></Field>
        ) : (
          <>
            <Field label={acquisition === "supplier" ? t("assets.form.supplier") : t("assets.form.paidFrom")} htmlFor="as-acct">
              <Select id="as-acct" name="accountId" required>
                <option value="">-</option>
                {(acquisition === "supplier" ? suppliers : cashBank).map((a) => <option key={a.id} value={a.id}>{localName(a, locale)}</option>)}
              </Select>
            </Field>
            <Field label={t("assets.form.gstRate")} htmlFor="as-gst"><Select id="as-gst" name="gstRate" defaultValue="0">{["0", "5", "12", "18", "28"].map((r) => <option key={r} value={r}>{r}%</option>)}</Select></Field>
            <Field label={t("assets.form.supplierGstin")} htmlFor="as-sg"><Input id="as-sg" name="supplierGstin" maxLength={15} className="font-mono uppercase" /></Field>
            <Field label={t("assets.form.invoiceRef")} htmlFor="as-ref"><Input id="as-ref" name="invoiceRef" maxLength={40} /></Field>
          </>
        )}
        <Field label={t("assets.register.location")} htmlFor="as-loc"><Input id="as-loc" name="location" maxLength={80} /></Field>
        <Field label={t("assets.register.serialNo")} htmlFor="as-sn"><Input id="as-sn" name="serialNo" maxLength={60} /></Field>
        <Field label={t("assets.register.custodian")} htmlFor="as-cust">
          <Select id="as-cust" name="custodianId"><option value="">-</option>{employees.map((e) => <option key={e.id} value={e.id}>{e.code} {e.name}</option>)}</Select>
        </Field>
        <div className="md:col-span-2 xl:col-span-4"><Field label={t("assets.form.notes")} htmlFor="as-notes"><Input id="as-notes" name="notes" maxLength={500} /></Field></div>
        {error ? <div className="md:col-span-2 xl:col-span-4"><Alert>{error}</Alert></div> : null}
        <div className="md:col-span-2 xl:col-span-4"><Button type="submit" disabled={busy || !classes.length}>{t("assets.form.save")}</Button></div>
      </form>
    </Card>
  );
}

export function DisposeForm({ id, receivers, homeState }: { id: string; receivers: Opt[]; homeState: string }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ profit: string } | null>(null);
  return (
    <Card>
      <h2 className="mb-3 font-semibold">{t("assets.detail.dispose")}</h2>
      <form className="grid gap-4 md:grid-cols-3 xl:grid-cols-6" onSubmit={async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const s = (k: string) => String(f.get(k) ?? "").trim() || undefined;
        setError(null);
        try {
          setResult(await api(`/assets/${id}/dispose`, { body: { date: s("date"), saleValue: s("saleValue") ?? "0", accountId: s("accountId"), gstRate: s("gstRate"), buyerStateCode: s("buyerState") } }));
          router.refresh();
        } catch (err) { setError(errorText(t, err, ASSET_NS)); }
      }}>
        <Field label={t("assets.detail.disposeDate")} htmlFor="ds-date"><Input id="ds-date" name="date" type="date" defaultValue={todayIso()} required /></Field>
        <Field label={t("assets.detail.saleValue")} htmlFor="ds-val"><Input id="ds-val" name="saleValue" defaultValue="0" inputMode="decimal" className="num" required /></Field>
        <Field label={t("assets.detail.receivedIn")} htmlFor="ds-acct">
          <Select id="ds-acct" name="accountId"><option value="">-</option>{receivers.map((a) => <option key={a.id} value={a.id}>{localName(a, locale)}</option>)}</Select>
        </Field>
        <Field label={t("assets.detail.saleGst")} htmlFor="ds-gst"><Select id="ds-gst" name="gstRate" defaultValue="0">{["0", "5", "12", "18", "28"].map((r) => <option key={r} value={r}>{r}%</option>)}</Select></Field>
        <Field label={t("assets.detail.buyerState")} htmlFor="ds-st">
          <Select id="ds-st" name="buyerState" defaultValue={homeState}>{GST_STATES.map((s) => <option key={s.code} value={s.code}>{s.code} · {devanagari(locale) ? s.nameHi : s.name}</option>)}</Select>
        </Field>
        <div className="flex items-end"><Button type="submit" variant="danger">{t("assets.detail.disposeButton")}</Button></div>
        {result ? <p className="text-sm md:col-span-3 xl:col-span-6">{Number(result.profit) >= 0 ? t("assets.detail.profit") : t("assets.detail.loss")}: <span className="num font-semibold">{rupees(Math.abs(Number(result.profit)))}</span></p> : null}
        {error ? <div className="md:col-span-3 xl:col-span-6"><Alert>{error}</Alert></div> : null}
      </form>
    </Card>
  );
}

export function DepreciationRunner() {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();
  const today = todayIso();
  const fyStart = today.slice(5) >= "04-01" ? `${today.slice(0, 4)}-04-01` : `${Number(today.slice(0, 4)) - 1}-04-01`;
  const [from, setFrom] = useState(fyStart);
  const [to, setTo] = useState(today);
  const [preview, setPreview] = useState<{ total: string; lines: { assetId: string; code: string; name: string; className: string; from: string; amount: string; days: number }[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const day = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <Field label={t("assets.depreciation.from")} htmlFor="dp-from"><Input id="dp-from" type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPreview(null); }} /></Field>
        <Field label={t("assets.depreciation.to")} htmlFor="dp-to"><Input id="dp-to" type="date" value={to} onChange={(e) => { setTo(e.target.value); setPreview(null); }} /></Field>
        <Button variant="outline" onClick={async () => {
          setError(null);
          try { setPreview(await api(`/assets/depreciation/preview?from=${from}&to=${to}`)); } catch (err) { setError(errorText(t, err, ASSET_NS)); }
        }}>{t("assets.depreciation.preview")}</Button>
      </div>
      {preview ? (
        preview.lines.length ? (
          <>
            <table className="w-full text-sm">
              <tbody>
                {preview.lines.map((l) => (
                  <tr key={l.assetId} className="border-b border-border">
                    <td className="py-1.5 pr-3 font-mono text-xs">{l.code}</td><td className="py-1.5 pr-3">{l.name}<span className="block text-xs text-muted">{l.className}</span></td>
                    <td className="py-1.5 pr-3 text-muted">{day(l.from)} · {l.days}</td><td className="num py-1.5 text-right">{rupees(l.amount)}</td>
                  </tr>
                ))}
                <tr><td colSpan={3} className="py-2 font-semibold">{t("assets.depreciation.total")}</td><td className="num py-2 text-right font-semibold">{rupees(preview.total)}</td></tr>
              </tbody>
            </table>
            <div><Button onClick={async () => {
              setError(null);
              try { await api("/assets/depreciation", { body: { from, to } }); setPreview(null); router.refresh(); } catch (err) { setError(errorText(t, err, ASSET_NS)); }
            }}>{t("assets.depreciation.post")}</Button></div>
          </>
        ) : <p className="text-sm text-muted">{t("assets.depreciation.none")}</p>
      ) : null}
      {error ? <Alert>{error}</Alert> : null}
    </Card>
  );
}

export function BlockOpening({ fy, blocks }: { fy: string; blocks: { block: string; rate: string }[] }) {
  const t = useTranslations();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  return (
    <Card className="flex flex-col gap-3">
      <h2 className="font-semibold">{t("assets.it.openingTitle")}</h2>
      <p className="text-sm text-muted">{t("assets.it.openingHint")}</p>
      <form className="flex flex-wrap items-end gap-3" onSubmit={async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const [block, rate] = String(f.get("block")).split("|");
        setError(null);
        try { await api("/assets/income-tax/openings", { method: "PUT", body: { fy, block, rate, openingWdv: String(f.get("wdv") || "0") } }); router.refresh(); } catch (err) { setError(errorText(t, err, ASSET_NS)); }
      }}>
        <Field label={t("assets.it.block")} htmlFor="bo-b">
          <Select id="bo-b" name="block" className="w-64">
            {blocks.map((b) => <option key={`${b.block}|${b.rate}`} value={`${b.block}|${b.rate}`}>{t.has(`assets.classes.blocks.${b.block}`) ? t(`assets.classes.blocks.${b.block}`) : b.block} · {Number(b.rate)}%</option>)}
          </Select>
        </Field>
        <Field label={t("assets.it.opening")} htmlFor="bo-w"><Input id="bo-w" name="wdv" inputMode="decimal" className="num w-40" required /></Field>
        <Button type="submit" variant="outline" disabled={!blocks.length}>{t("assets.it.save")}</Button>
      </form>
      {error ? <Alert>{error}</Alert> : null}
    </Card>
  );
}
