"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Button, Card, Field, Input, Select } from "../ui";
import type { Terminal } from "./Billing";
import type { PosSettings } from "./Checkout";
import { POS_NS } from "./Checkout";

type Opt = { id: string; name: string };
const NS = [...POS_NS, "settings.errors"];

export function PosSettingsForm({ settings, canEdit }: { settings: PosSettings; canEdit: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loyalty, setLoyalty] = useState(settings.loyaltyEnabled);
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const s = (k: string) => String(f.get(k) ?? "").trim();
    // "5000:2, 20000:3": bills from 5,000 earn 2 points per 100, from 20,000 earn 3.
    const slabText = s("loyaltySlabs");
    if (slabText && !/^\s*\d+(\.\d{1,2})?\s*:\s*\d{1,3}\s*(,\s*\d+(\.\d{1,2})?\s*:\s*\d{1,3}\s*)*$/.test(slabText)) { setError(t("pos.settings.slabsInvalid")); return; }
    const slabs = slabText ? slabText.split(",").map((p) => { const [from, per100] = p.split(":").map((x) => x.trim()); return { from: from!, per100: Number(per100) }; }) : null;
    const list = (v: string) => { const x = v.split(",").map((y) => y.trim()).filter(Boolean); return x.length ? x : null; };
    setError(null);
    setSaved(false);
    try {
      await api("/pos/settings", {
        method: "PUT",
        body: {
          pricesIncludeTax: f.get("pricesIncludeTax") === "on",
          loyaltyEnabled: loyalty, ...(loyalty ? { loyaltyPointsPer100: Number(s("loyaltyPointsPer100") || 1), loyaltyPointValue: s("loyaltyPointValue") || "1", loyaltyMaxRedeemPct: s("loyaltyMaxRedeemPct") || "20", referralPoints: Number(s("referralPoints") || 0), loyaltyMinRedeem: Number(s("loyaltyMinRedeem") || 0), loyaltySlabs: slabs, helperSharePct: s("helperSharePct") || "30", loyaltyValidityDays: s("loyaltyValidityDays") ? Number(s("loyaltyValidityDays")) : null, loyaltyExcludeDiscountedBills: f.get("loyaltyExcludeDiscountedBills") === "on", loyaltyExcludeDiscountedItems: f.get("loyaltyExcludeDiscountedItems") === "on", loyaltyExcludeBrands: list(s("loyaltyExcludeBrands")), loyaltyExcludeCategories: list(s("loyaltyExcludeCategories")) } : {}),
          receiptFooter: s("receiptFooter") || null,
          allowRateChange: f.get("allowRateChange") === "on", requireSalesman: f.get("requireSalesman") === "on",
          autoSendBill: f.get("autoSendBill") === "on",
          maxLineDiscountPct: s("maxLineDiscountPct") || null, maxBillDiscountPct: s("maxBillDiscountPct") || null,
        },
      });
      setSaved(true);
      router.refresh();
    } catch (err) { setError(errorText(t, err, NS)); }
  }
  const check = (name: string, label: string, on: boolean) => (
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" name={name} defaultChecked={on} disabled={!canEdit} className="size-4 accent-[var(--primary)]" />{label}</label>
  );
  return (
    <Card>
      <form onSubmit={save} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="flex flex-col gap-3 md:col-span-2 xl:col-span-4">
          {check("pricesIncludeTax", t("pos.settings.pricesIncludeTax"), settings.pricesIncludeTax)}
        </div>
        <div className="md:col-span-2 xl:col-span-4">
          <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={loyalty} onChange={(e) => setLoyalty(e.target.checked)} disabled={!canEdit} className="size-4 accent-[var(--primary)]" />{t("pos.settings.loyaltyEnabled")}</label>
        </div>
        {loyalty ? (
          <>
            <Field label={t("pos.settings.pointsPer100")} htmlFor="ps-pp"><Input id="ps-pp" name="loyaltyPointsPer100" defaultValue={settings.loyaltyPointsPer100} inputMode="numeric" className="num" disabled={!canEdit} /></Field>
            <Field label={t("pos.settings.pointValue")} htmlFor="ps-pv"><Input id="ps-pv" name="loyaltyPointValue" defaultValue={Number(settings.loyaltyPointValue)} inputMode="decimal" className="num" disabled={!canEdit} /></Field>
            <Field label={t("pos.settings.maxRedeem")} htmlFor="ps-mr"><Input id="ps-mr" name="loyaltyMaxRedeemPct" defaultValue={Number(settings.loyaltyMaxRedeemPct)} inputMode="decimal" className="num" disabled={!canEdit} /></Field>
            <Field label={t("pos.settings.minRedeem")} htmlFor="ps-min" hint={t("pos.settings.minRedeemHint")}><Input id="ps-min" name="loyaltyMinRedeem" defaultValue={settings.loyaltyMinRedeem ?? 0} inputMode="numeric" className="num" disabled={!canEdit} /></Field>
            <Field label={t("pos.settings.slabs")} htmlFor="ps-slabs" hint={t("pos.settings.slabsHint")}><Input id="ps-slabs" name="loyaltySlabs" defaultValue={(settings.loyaltySlabs ?? []).map((x) => `${Number(x.from)}:${x.per100}`).join(", ")} className="w-72" disabled={!canEdit} /></Field>
            <Field label={t("pos.settings.helperShare")} htmlFor="ps-hs" hint={t("pos.settings.helperShareHint")}><Input id="ps-hs" name="helperSharePct" defaultValue={Number(settings.helperSharePct ?? 30)} inputMode="decimal" className="num" disabled={!canEdit} /></Field>
            <Field label={t("pos.settings.validityDays")} htmlFor="ps-val" hint={t("pos.settings.validityDaysHint")}><Input id="ps-val" name="loyaltyValidityDays" defaultValue={settings.loyaltyValidityDays ?? ""} inputMode="numeric" className="num" disabled={!canEdit} /></Field>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="loyaltyExcludeDiscountedBills" defaultChecked={settings.loyaltyExcludeDiscountedBills} disabled={!canEdit} />{t("pos.settings.excludeDiscountedBills")}</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="loyaltyExcludeDiscountedItems" defaultChecked={settings.loyaltyExcludeDiscountedItems} disabled={!canEdit} />{t("pos.settings.excludeDiscountedItems")}</label>
            <Field label={t("pos.settings.excludeBrands")} htmlFor="ps-xb" hint={t("pos.settings.excludeListHint")}><Input id="ps-xb" name="loyaltyExcludeBrands" defaultValue={(settings.loyaltyExcludeBrands ?? []).join(", ")} className="w-72" disabled={!canEdit} /></Field>
            <Field label={t("pos.settings.excludeCategories")} htmlFor="ps-xc" hint={t("pos.settings.excludeListHint")}><Input id="ps-xc" name="loyaltyExcludeCategories" defaultValue={(settings.loyaltyExcludeCategories ?? []).join(", ")} className="w-72" disabled={!canEdit} /></Field>
            <Field label={t("pos.promo.referralPoints")} htmlFor="ps-ref" hint={t("pos.promo.referralPointsHint")}><Input id="ps-ref" name="referralPoints" defaultValue={settings.referralPoints ?? 0} inputMode="numeric" className="num" disabled={!canEdit} /></Field>
          </>
        ) : null}
        <div className="flex flex-col gap-3 border-t border-border pt-4 md:col-span-2 xl:col-span-4">
          <span className="text-sm font-medium">{t("pos.counter.controls")}</span>
          {check("allowRateChange", t("pos.counter.allowRateChange"), settings.allowRateChange ?? false)}
          {check("requireSalesman", t("pos.counter.requireSalesman"), settings.requireSalesman ?? false)}
          {check("autoSendBill", t("pos.counter.autoSendBill"), settings.autoSendBill ?? false)}
        </div>
        <Field label={t("pos.counter.maxLineDiscount")} htmlFor="ps-mld" hint={t("pos.counter.limitHint")}><Input id="ps-mld" name="maxLineDiscountPct" defaultValue={settings.maxLineDiscountPct === null || settings.maxLineDiscountPct === undefined ? "" : Number(settings.maxLineDiscountPct)} inputMode="decimal" className="num" disabled={!canEdit} /></Field>
        <Field label={t("pos.counter.maxBillDiscount")} htmlFor="ps-mbd" hint={t("pos.counter.limitHint")}><Input id="ps-mbd" name="maxBillDiscountPct" defaultValue={settings.maxBillDiscountPct === null || settings.maxBillDiscountPct === undefined ? "" : Number(settings.maxBillDiscountPct)} inputMode="decimal" className="num" disabled={!canEdit} /></Field>
        <div className="md:col-span-2 xl:col-span-4">
          <Field label={t("pos.settings.footer")} htmlFor="ps-footer"><Input id="ps-footer" name="receiptFooter" defaultValue={settings.receiptFooter ?? ""} maxLength={300} disabled={!canEdit} /></Field>
        </div>
        {error ? <div className="md:col-span-2 xl:col-span-4"><Alert>{error}</Alert></div> : null}
        {canEdit ? <div className="flex items-center gap-3 md:col-span-2 xl:col-span-4"><Button type="submit">{t("pos.settings.save")}</Button>{saved ? <span className="text-sm text-success">{t("common.saved")}</span> : null}</div> : null}
      </form>
    </Card>
  );
}

export function TerminalsEditor({ terminals, warehouses, devices, canEdit }: { terminals: Terminal[]; warehouses: Opt[]; devices: Opt[] | null; canEdit: boolean }) {
  const t = useTranslations();
  const router = useRouter();
  const [rows, setRows] = useState(terminals.map((x) => ({ id: x.id as string | undefined, code: x.code, name: x.name, warehouseId: x.warehouseId, deviceId: x.deviceId ?? "", archived: x.archived })));
  const [error, setError] = useState<string | null>(null);
  const set = (i: number, patch: Partial<(typeof rows)[number]>) => setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  async function save(i: number) {
    const r = rows[i]!;
    setError(null);
    try {
      const body = { name: r.name, ...(r.warehouseId ? { warehouseId: r.warehouseId } : {}), ...(devices ? { deviceId: r.deviceId || null } : {}), archived: r.archived };
      await api(r.id ? `/pos/terminals/${r.id}` : "/pos/terminals", { method: r.id ? "PUT" : "POST", body });
      router.refresh();
    } catch (err) { setError(errorText(t, err, NS)); }
  }
  return (
    <Card>
      <h2 className="mb-3 font-semibold">{t("pos.settings.terminals")}</h2>
      <div className="flex flex-col gap-3">
        {rows.map((r, i) => (
          <div key={r.id ?? `new-${i}`} className="grid items-end gap-3 md:grid-cols-[60px_1fr_1fr_1fr_auto_auto]">
            <span className="pb-2 font-mono text-sm text-muted">{r.code || "-"}</span>
            <Field label={t("pos.settings.terminalName")} htmlFor={`pt-n-${i}`}><Input id={`pt-n-${i}`} value={r.name} onChange={(e) => set(i, { name: e.target.value })} maxLength={60} disabled={!canEdit} /></Field>
            <Field label={t("pos.settings.warehouse")} htmlFor={`pt-w-${i}`}>
              <Select id={`pt-w-${i}`} value={r.warehouseId} onChange={(e) => set(i, { warehouseId: e.target.value })} disabled={!canEdit}>
                {!r.warehouseId ? <option value="">-</option> : null}
                {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
              </Select>
            </Field>
            <Field label={t("pos.settings.device")} htmlFor={`pt-d-${i}`}>
              <Select id={`pt-d-${i}`} value={r.deviceId} onChange={(e) => set(i, { deviceId: e.target.value })} disabled={!canEdit || !devices}>
                <option value="">{t("pos.settings.noDevice")}</option>
                {(devices ?? []).map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </Select>
            </Field>
            <label className="flex items-center gap-2 pb-2 text-sm"><input type="checkbox" checked={r.archived} onChange={(e) => set(i, { archived: e.target.checked })} disabled={!canEdit || !r.id} className="size-4 accent-[var(--primary)]" />{t("common.archived")}</label>
            {canEdit ? <Button variant="outline" onClick={() => save(i)} disabled={r.name.trim().length < 2}>{t("pos.settings.save")}</Button> : <span />}
          </div>
        ))}
      </div>
      {canEdit ? <Button variant="ghost" className="-ml-3 mt-2" onClick={() => setRows([...rows, { id: undefined, code: "", name: "", warehouseId: warehouses[0]?.id ?? "", deviceId: "", archived: false }])}><Plus className="size-4" aria-hidden />{t("pos.settings.addTerminal")}</Button> : null}
      {error ? <div className="mt-3"><Alert>{error}</Alert></div> : null}
    </Card>
  );
}
