"use client";

import { DEFECT_CODES } from "@varchasv/domain";
import { History, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { bandFor, priceFromBand, type MarginBand } from "@varchasv/domain";
import { ApiError, api } from "@/lib/client-api";
import { localName, rupees, todayIso } from "@/lib/format";
import { fileUrl } from "@/lib/images";
import type { ItemOption, SupplierOption, WarehouseOption } from "@/lib/masters";
import { StyleGridPicker } from "../inventory/StyleGridPicker";
import { Alert, Button, Card, Field, Input, Select } from "../ui";
import { useWorkDate } from "@/components/WorkingDate";

export interface ReceiptDraftLine { itemId: string; qty: string; rate: string; orderLineId?: string; maxQty?: string }
interface Line extends ReceiptDraftLine { key: number; batchNo: string; expiry: string; mrp: string; mrpSet: boolean; landedCostPerUnit: string; landedCostNote: string; short: string; damaged: string; defectCode: string; hold: string; saleRate: string; serials: string }
type LandedBasis = "direct" | "weight" | "volume" | "net_value" | "units";
interface LandedCharge { key: number; description: string; sourceDocument: string; grossAmount: string; recoverableGst: string; allocationBasis: LandedBasis; allocations: Record<number, string> }
type Rounding = "1" | "9" | "10" | "50";
type Past = { date: string; supplier: string; number: string; qty: string; rate: string; mrp: string | null };
let nextKey = 1;

/** MRP from cost and mark-up, rounded the way shops print it (1,299 rather than 1,287). */
export function mrpFrom(rate: string, markupPct: string, rounding: Rounding) {
  const raw = Number(rate) * (1 + Number(markupPct) / 100);
  if (!(raw > 0)) return "";
  const v = rounding === "9" ? Math.ceil((raw + 1) / 10) * 10 - 1 : rounding === "1" ? Math.round(raw) : Math.ceil(raw / Number(rounding)) * Number(rounding);
  return String(v);
}
const pct = (n: number) => `${Math.round(n)}%`;

/**
 * Inward challan (goods receipt): stock goes up now at cost; the bill is recorded later. Entry by size
 * grid, transport details, mark-up to MRP with shop rounding, and the item's last purchases beside the
 * line being entered. The MRPs set here go onto the items, so labels print them.
 */
/** On a phone each line is a card: the item takes the full width and the figures sit two to a row, each under its own label (the labels come from data-label). */
const M = "max-lg:block max-lg:py-0 max-lg:pr-0 max-lg:before:mb-1 max-lg:before:block max-lg:before:text-xs max-lg:before:text-muted max-lg:before:content-[attr(data-label)]";

export function ReceiptForm({ suppliers, items, warehouses, initial, bands = [] }: {
  suppliers: SupplierOption[]; items: ItemOption[]; warehouses: WarehouseOption[]; bands?: MarginBand[];
  initial?: { supplierId: string; orderId: string; orderNumber: string; lines: ReceiptDraftLine[] };
}) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [supplierId, setSupplierId] = useState(initial?.supplierId ?? "");
  const [warehouseId, setWarehouseId] = useState(warehouses.find((w) => w.isDefault)?.id ?? warehouses[0]?.id ?? "");
  const workDate = useWorkDate();
  const [date, setDate] = useState(workDate);
  const [challan, setChallan] = useState("");
  const [transporter, setTransporter] = useState("");
  const [lrNumber, setLrNumber] = useState("");
  const [lrDate, setLrDate] = useState("");
  const [markup, setMarkup] = useState("");
  const [rounding, setRounding] = useState<Rounding>("9");
  const itemMrp = (id: string) => { const m = items.find((x) => x.id === id)?.mrp; return m ? String(Number(m)) : ""; };
  const blank = (l: ReceiptDraftLine): Line => ({ ...l, key: nextKey++, batchNo: "", expiry: "", mrp: itemMrp(l.itemId), mrpSet: false, landedCostPerUnit: "", landedCostNote: "", short: "", damaged: "", defectCode: "", hold: "", saleRate: "", serials: "" });
  const [lines, setLines] = useState<Line[]>(() => (initial?.lines.length ? initial.lines : [{ itemId: "", qty: "", rate: "" }]).map(blank));
  const [landedCharges, setLandedCharges] = useState<LandedCharge[]>([]);
  const [focus, setFocus] = useState<string>("");
  const [exceptions, setExceptions] = useState(false);
  const [useBands, setUseBands] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const goods = items.filter((i) => i.kind === "goods" && !i.archived).sort((a, b) => localName(a, locale).localeCompare(localName(b, locale)));
  const batches = lines.some((l) => items.find((x) => x.id === l.itemId)?.trackBatches);

  // A mark-up fills the MRP of every line whose MRP was not typed by hand.
  const allocatedPerUnit = (line: Line) => {
    const quantity = Number(line.qty) + (Number(line.hold) || 0);
    const allocated = landedCharges.reduce((sum, charge) => sum + (Number(charge.allocations[line.key]) || 0), 0);
    return quantity > 0 ? allocated / quantity : 0;
  };
  const withMrp = (l: Line, m = markup, r = rounding, bandsOn = useBands): Line => {
    const landedRate = Number(l.rate) + (Number(l.landedCostPerUnit) || 0) + allocatedPerUnit(l);
    if (bandsOn && !l.mrpSet && landedRate > 0) {
      const b = bandFor(bands, landedRate);
      if (b) { const p = priceFromBand(b, landedRate); return { ...l, mrp: String(Number(p.mrp)), saleRate: String(Number(p.sale1)) }; }
    }
    return l.mrpSet || !m ? l : { ...l, mrp: mrpFrom(String(landedRate), m, r) || l.mrp };
  };
  const update = (key: number, patch: Partial<Line>) => setLines((ls) => ls.map((l) => (l.key === key ? withMrp({ ...l, ...patch }) : l)));
  const applyMarkup = (m: string, r: Rounding) => { setMarkup(m); setRounding(r); setLines((ls) => ls.map((l) => withMrp(l, m, r))); };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await api<{ id: string }>("/goods-receipts", {
        body: {
          supplierId, orderId: initial?.orderId, warehouseId, date, supplierChallan: challan || undefined,
          ...(transporter.trim() ? { transporter: transporter.trim() } : {}), ...(lrNumber.trim() ? { lrNumber: lrNumber.trim() } : {}), ...(lrDate ? { lrDate } : {}),
          lines: lines.filter((l) => l.itemId && (Number(l.qty) > 0 || Number(l.hold) > 0)).map((l) => ({
            itemId: l.itemId, qty: l.qty || "0", ...(useBands && Number(l.saleRate) > 0 ? { saleRate: l.saleRate } : {}), ...(Number(l.short) > 0 ? { short: l.short } : {}), ...(Number(l.damaged) > 0 ? { damaged: l.damaged, ...(l.defectCode ? { defectCode: l.defectCode } : {}) } : {}), ...(Number(l.hold) > 0 ? { hold: l.hold } : {}), ...(l.rate ? { rate: l.rate } : {}),
            ...(Number(l.landedCostPerUnit) > 0 ? { landedCostPerUnit: l.landedCostPerUnit, landedCostNote: l.landedCostNote } : {}), ...(l.orderLineId ? { orderLineId: l.orderLineId } : {}),
            ...(Number(l.mrp) > 0 && l.mrp !== itemMrp(l.itemId) ? { mrp: l.mrp } : {}),
            ...(l.batchNo ? { batchNo: l.batchNo } : {}), ...(l.expiry ? { expiry: l.expiry } : {}),
            ...(l.serials.trim() ? { serials: l.serials.split(/[\s,;]+/).filter(Boolean) } : {}),
          })),
          ...(landedCharges.length ? { landedCharges: landedCharges.map((charge) => ({
            description: charge.description, sourceDocument: charge.sourceDocument, grossAmount: charge.grossAmount,
            recoverableGst: charge.recoverableGst || "0", allocationBasis: charge.allocationBasis,
            allocations: lines.filter((l) => l.itemId && (Number(l.qty) > 0 || Number(l.hold) > 0)).flatMap((line, lineIndex) => Number(charge.allocations[line.key]) > 0 ? [{ lineIndex, amount: charge.allocations[line.key] }] : []),
          })) } : {}),
        },
      });
      router.push(`/purchase/receipts/${r.id}?saved=1`);
      router.refresh();
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "generic";
      const key = [`purchase.errors.${code}`, `sj.errors.${code}`, `vouchers.errors.${code}`, `serials.errors.${code}`].find((k) => t.has(k));
      setError(key ? t(key) : t("auth.errors.generic"));
      setBusy(false);
    }
  }

  const pieces = lines.reduce((s, l) => s + (Number(l.qty) || 0), 0);
  const value = lines.reduce((s, l) => s + (Number(l.qty) + (Number(l.hold) || 0)) * ((Number(l.rate) || 0) + (Number(l.landedCostPerUnit) || 0)) + landedCharges.reduce((sum, charge) => sum + (Number(charge.allocations[l.key]) || 0), 0), 0);
  const supplier = suppliers.find((x) => x.id === supplierId);
  // Mark-up over cost across the lines that carry an MRP, weighted by pieces.
  const marked = lines.filter((l) => Number(l.mrp) > 0 && (Number(l.rate) + Number(l.landedCostPerUnit) + allocatedPerUnit(l)) > 0 && Number(l.qty) > 0);
  const avgMarkup = marked.length ? (marked.reduce((s, l) => s + Number(l.qty) * Number(l.mrp), 0) / marked.reduce((s, l) => s + Number(l.qty) * (Number(l.rate) + Number(l.landedCostPerUnit) + allocatedPerUnit(l)), 0) - 1) * 100 : null;

  return (
    <form onSubmit={submit} data-density="compact" className="flex flex-col gap-3 pb-20 lg:min-h-0 lg:flex-1 lg:pb-14">
      {initial ? <p className="text-sm text-muted">{t("purchase.receipts.fromOrder", { number: initial.orderNumber })}</p> : null}
      <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-[1fr_1.2fr_1fr_0.9fr]">
        <Card className="grid content-start gap-3 p-3 sm:grid-cols-2">
          <h2 className="text-[0.8571rem] font-semibold tracking-wide text-muted uppercase sm:col-span-2">{t("inward.document")}</h2>
          <Field label={t("common.date")} htmlFor="r-date"><Input id="r-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></Field>
          <Field label={t("purchase.receipts.challan")} htmlFor="r-ch"><Input id="r-ch" value={challan} onChange={(e) => setChallan(e.target.value)} maxLength={40} /></Field>
          <div className="sm:col-span-2">
            <Field label={t("stock.warehouse")} htmlFor="r-wh">
              <Select id="r-wh" value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)}>
                {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
              </Select>
            </Field>
          </div>
        </Card>
        <Card className="flex flex-col gap-3 bg-primary-soft/40 p-3">
          <h2 className="text-[0.8571rem] font-semibold tracking-wide text-muted uppercase">{t("purchase.supplier")}</h2>
          <Field label={t("purchase.supplier")} htmlFor="r-sup">
            <Select id="r-sup" value={supplierId} onChange={(e) => setSupplierId(e.target.value)} required disabled={!!initial}>
              <option value="">{t("purchase.chooseSupplier")}</option>
              {suppliers.map((s) => <option key={s.id} value={s.id}>{localName(s, locale)}</option>)}
            </Select>
          </Field>
          {supplier ? (
            <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-[0.8571rem]">
              <dt className="text-muted">GSTIN</dt><dd className="num font-semibold">{supplier.gstin ?? "-"}</dd>
              <dt className="text-muted">{t("inward.state")}</dt><dd className="font-semibold">{supplier.stateCode ?? "-"}</dd>
            </dl>
          ) : null}
        </Card>
        <Card className="grid content-start gap-3 p-3 sm:grid-cols-2">
          <h2 className="text-[0.8571rem] font-semibold tracking-wide text-muted uppercase sm:col-span-2">{t("inward.transport")}</h2>
          <div className="sm:col-span-2"><Field label={t("inward.transporter")} htmlFor="r-tr"><Input id="r-tr" value={transporter} onChange={(e) => setTransporter(e.target.value)} maxLength={80} /></Field></div>
          <Field label={t("inward.lrNumber")} htmlFor="r-lr"><Input id="r-lr" value={lrNumber} onChange={(e) => setLrNumber(e.target.value)} maxLength={30} /></Field>
          <Field label={t("inward.lrDate")} htmlFor="r-lrd"><Input id="r-lrd" type="date" value={lrDate} onChange={(e) => setLrDate(e.target.value)} /></Field>
        </Card>
        <Card className="flex flex-col gap-3 p-3">
          <h2 className="text-[0.8571rem] font-semibold tracking-wide text-muted uppercase">{t("inward.mrp")}</h2>
          <div className="grid grid-cols-2 gap-2">
            <Field label={t("inward.markup")} htmlFor="r-mu" hint={t("inward.markupHint")}>
              <Input id="r-mu" value={markup} onChange={(e) => applyMarkup(e.target.value.replace(/[^\d.]/g, ""), rounding)} inputMode="decimal" className="num" placeholder="100" />
            </Field>
            <Field label={t("inward.rounding")} htmlFor="r-rd">
              <Select id="r-rd" value={rounding} onChange={(e) => applyMarkup(markup, e.target.value as Rounding)}>
                {(["9", "10", "50", "1"] as const).map((r) => <option key={r} value={r}>{t(`inward.round.${r}`)}</option>)}
              </Select>
            </Field>
          </div>
        </Card>
      </div>

      <div className="grid items-start gap-3 lg:min-h-0 lg:flex-1 xl:grid-cols-[300px_minmax(0,1fr)] xl:grid-rows-[minmax(0,1fr)] xl:items-stretch">
        <div className="flex flex-col gap-3 xl:order-first xl:min-h-0 xl:overflow-auto">
          <LastPurchases item={items.find((x) => x.id === focus)} />
          <SizeCurve lines={lines} items={items} />
        </div>
        <Card className="relative p-3 lg:min-h-0 lg:overflow-auto">
          <div className="overflow-x-auto lg:overflow-visible">
            <table className="w-full text-sm max-lg:block lg:min-w-[820px]">
              <thead className="sticky top-0 z-10 bg-surface text-left text-muted max-lg:hidden">
                <tr className="border-b border-border">
                  <th className="py-2 pr-3 font-medium">{t("purchase.item")}</th>
                  <th className="w-24 py-2 pr-3 text-right font-medium">{t("purchase.qty")}</th>
                  <th className="w-28 py-2 pr-3 text-right font-medium">{t("inward.cost")}</th>
                  <th className="w-36 py-2 pr-3 text-right font-medium">Landed cost / unit (excl. recoverable GST)</th>
                  <th className="w-48 py-2 pr-3 font-medium">Posted bill / source + allocation basis</th>
                  <th className="w-28 py-2 pr-3 text-right font-medium">{t("inward.mrp")}</th>
                  <th className="w-24 py-2 pr-3 text-right font-medium" title={t("inward.markupTitle")}>{t("inward.markupCol")}</th>
                  <th className="w-24 py-2 pr-3 text-right font-medium" title={t("inward.marginTitle")}>{t("inward.marginCol")}</th>
                  {exceptions ? <th className="w-20 py-2 pr-3 text-right font-medium">{t("receiving.short")}</th> : null}
                  {exceptions ? <th className="w-20 py-2 pr-3 text-right font-medium">{t("receiving.damaged")}</th> : null}
                  {exceptions ? <th className="w-20 py-2 pr-3 text-right font-medium">{t("receiving.hold")}</th> : null}
                  {batches ? <th className="w-32 py-2 pr-3 font-medium">{t("sj.batch")}</th> : null}
                  {batches ? <th className="w-36 py-2 pr-3 font-medium">{t("sj.expiry")}</th> : null}
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className="max-lg:block">
                {lines.map((l, i) => {
                  const item = items.find((x) => x.id === l.itemId);
                  const rate = Number(l.rate) + (Number(l.landedCostPerUnit) || 0) + allocatedPerUnit(l), mrp = Number(l.mrp);
                  return (
                    <tr key={l.key} className={`border-b border-border max-lg:mb-3 max-lg:grid max-lg:grid-cols-2 max-lg:gap-x-3 max-lg:gap-y-2 max-lg:rounded-lg max-lg:border max-lg:p-3 ${focus === l.itemId && l.itemId ? "bg-surface-2/60" : ""}`} onFocusCapture={() => setFocus(l.itemId)}>
                      <td data-label={t("purchase.item")} className={`py-2 pr-3 max-lg:col-span-2 ${M}`}>
                        <Select value={l.itemId} disabled={!!l.orderLineId} onChange={(e) => { const id = e.target.value; update(l.key, { itemId: id, rate: l.rate || String(Number(items.find((x) => x.id === id)?.purchaseRate ?? "")), mrp: itemMrp(id), mrpSet: false }); setFocus(id); }} aria-label={`${t("purchase.item")} ${i + 1}`}>
                          <option value="">{t("purchase.chooseItem")}</option>
                          {goods.map((it) => <option key={it.id} value={it.id}>{localName(it, locale)}</option>)}
                        </Select>
                      </td>
                      <td data-label={t("purchase.qty")} className={`py-2 pr-3 ${M}`}>
                        <Input value={l.qty} onChange={(e) => update(l.key, { qty: e.target.value })} inputMode="decimal" className="num text-right" aria-label={t("purchase.qty")} />
                        {l.maxQty ? <span className="block pt-0.5 text-right text-xs text-muted">≤ {Number(l.maxQty).toLocaleString("en-IN")} {item?.uom}</span> : null}
                        {item?.trackSerials ? <textarea value={l.serials} onChange={(e) => update(l.key, { serials: e.target.value })} rows={2} placeholder={t("inward.serials")} aria-label={t("inward.serials")} className="num mt-1 w-full min-w-40 rounded-md border border-border bg-surface p-1 text-xs" /> : null}
                      </td>
                      <td data-label={t("inward.cost")} className={`py-2 pr-3 ${M}`}><Input value={l.rate} onChange={(e) => update(l.key, { rate: e.target.value })} inputMode="decimal" className="num text-right" aria-label={t("inward.cost")} /></td>
                      <td data-label="Landed cost / unit" className={`py-2 pr-3 ${M}`}><Input value={l.landedCostPerUnit} onChange={(e) => update(l.key, { landedCostPerUnit: e.target.value })} inputMode="decimal" className="num text-right" aria-label="Landed cost per unit, excluding recoverable GST" /></td>
                      <td data-label="Posted bill / source + allocation basis" className={`py-2 pr-3 ${M}`}><Input value={l.landedCostNote} onChange={(e) => update(l.key, { landedCostNote: e.target.value })} maxLength={160} placeholder="Posted freight bill ID + allocation basis" aria-label="Posted source document and allocation basis" required={Number(l.landedCostPerUnit) > 0} /></td>
                      <td data-label={t("inward.mrp")} className={`py-2 pr-3 ${M}`}><Input value={l.mrp} onChange={(e) => update(l.key, { mrp: e.target.value.replace(/[^\d.]/g, ""), mrpSet: true })} inputMode="decimal" className="num text-right" aria-label={t("inward.mrp")} /></td>
                      <td data-label={t("inward.markupCol")} className={`num py-2 pr-3 text-right text-muted max-lg:text-left ${M}`}>{rate > 0 && mrp > 0 ? pct((mrp / rate - 1) * 100) : "-"}</td>
                      <td data-label={t("inward.marginCol")} className={`num py-2 pr-3 text-right max-lg:text-left ${M} ${rate > 0 && mrp > 0 && mrp < rate ? "text-danger" : "text-muted"}`}>{rate > 0 && mrp > 0 ? pct((1 - rate / mrp) * 100) : "-"}</td>
                      {exceptions ? (["short", "damaged", "hold"] as const).map((k) => <td key={k} data-label={t(`receiving.${k}`)} className={`py-2 pr-3 ${M}`}><Input value={l[k]} onChange={(e) => update(l.key, { [k]: e.target.value })} inputMode="decimal" className="num text-right" aria-label={t(`receiving.${k}`)} />
                        {k === "damaged" && Number(l.damaged) > 0 ? (
                          <select value={l.defectCode} onChange={(e) => update(l.key, { defectCode: e.target.value })} aria-label={t("receiving.defect")} className="mt-1 h-9 w-full rounded-md border border-border bg-surface px-1.5 text-xs">
                            <option value="">{t("receiving.defect")}</option>
                            {DEFECT_CODES.map((d) => <option key={d} value={d}>{t(`receiving.defects.${d}`)}</option>)}
                          </select>
                        ) : null}
                      </td>) : null}
                      {batches ? <td data-label={t("sj.batch")} className={`py-2 pr-3 ${M}`}><Input value={l.batchNo} onChange={(e) => update(l.key, { batchNo: e.target.value })} maxLength={40} required={item?.trackBatches} aria-label={t("sj.batch")} /></td> : null}
                      {batches ? <td data-label={t("sj.expiry")} className={`py-2 pr-3 ${M}`}><Input type="date" value={l.expiry} onChange={(e) => update(l.key, { expiry: e.target.value })} aria-label={t("sj.expiry")} /></td> : null}
                      <td className="py-2 text-right max-lg:col-span-2 max-lg:flex max-lg:justify-end max-lg:py-0">
                        {lines.length > 1 ? (
                          <button type="button" onClick={() => setLines((ls) => ls.filter((x) => x.key !== l.key))} className="grid size-9 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-danger max-lg:size-11" title={t("common.remove")}>
                            <Trash2 className="size-4" aria-hidden /><span className="sr-only">{t("common.remove")}</span>
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!initial ? (
            <div className="flex flex-wrap gap-2">
              {bands.length ? <label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={useBands} onChange={(e) => { setUseBands(e.target.checked); setLines((ls) => ls.map((l) => withMrp(l, markup, rounding, e.target.checked))); }} />{t("receiving.useBands")}</label> : null}
              <label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={exceptions} onChange={(e) => setExceptions(e.target.checked)} />{t("receiving.record")}</label>
              <Button type="button" variant="ghost" onClick={() => setLines((ls) => [...ls, blank({ itemId: "", qty: "", rate: "" })])} className="-ml-3 mt-2"><Plus className="size-4" aria-hidden />{t("vouchers.addLine")}</Button>
              <StyleGridPicker kind="purchase" onAdd={(add) => setLines((ls) => [...ls.filter((x) => x.itemId), ...add.map((a) => withMrp(blank(a)))])} />
            </div>
          ) : null}
          {!initial ? <section className="mt-4 border-t border-border pt-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div><h3 className="text-sm font-semibold">Shared inward charges</h3><p className="mt-1 text-xs text-muted">Enter the source bill total, recoverable GST, allocation basis and the net amount assigned to each receipt line.</p></div>
              <Button type="button" variant="ghost" onClick={() => setLandedCharges((all) => [...all, { key: nextKey++, description: "", sourceDocument: "", grossAmount: "", recoverableGst: "0", allocationBasis: "net_value", allocations: {} }])}><Plus className="size-4" aria-hidden />Add charge</Button>
            </div>
            {landedCharges.map((charge, chargeIndex) => <div key={charge.key} className="mt-3 rounded-md border border-border p-3">
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_140px_140px_160px_auto]">
                <Field label="Charge" htmlFor={`landed-description-${charge.key}`}><Input id={`landed-description-${charge.key}`} value={charge.description} onChange={(e) => setLandedCharges((all) => all.map((x) => x.key === charge.key ? { ...x, description: e.target.value } : x))} maxLength={120} placeholder="Freight, handling, non-recoverable tax" required /></Field>
                <Field label="Source document" htmlFor={`landed-source-${charge.key}`}><Input id={`landed-source-${charge.key}`} value={charge.sourceDocument} onChange={(e) => setLandedCharges((all) => all.map((x) => x.key === charge.key ? { ...x, sourceDocument: e.target.value } : x))} maxLength={120} placeholder="Invoice or bill reference" required /></Field>
                <Field label="Gross amount" htmlFor={`landed-gross-${charge.key}`}><Input id={`landed-gross-${charge.key}`} value={charge.grossAmount} onChange={(e) => setLandedCharges((all) => all.map((x) => x.key === charge.key ? { ...x, grossAmount: e.target.value } : x))} inputMode="decimal" className="num text-right" required /></Field>
                <Field label="Recoverable GST" htmlFor={`landed-gst-${charge.key}`}><Input id={`landed-gst-${charge.key}`} value={charge.recoverableGst} onChange={(e) => setLandedCharges((all) => all.map((x) => x.key === charge.key ? { ...x, recoverableGst: e.target.value } : x))} inputMode="decimal" className="num text-right" required /></Field>
                <Field label="Allocation basis" htmlFor={`landed-basis-${charge.key}`}><Select id={`landed-basis-${charge.key}`} value={charge.allocationBasis} onChange={(e) => setLandedCharges((all) => all.map((x) => x.key === charge.key ? { ...x, allocationBasis: e.target.value as LandedBasis } : x))}><option value="direct">Direct to line</option><option value="weight">Shipment weight</option><option value="volume">Shipment volume</option><option value="net_value">Net purchase value</option><option value="units">Units</option></Select></Field>
                <button type="button" onClick={() => setLandedCharges((all) => all.filter((x) => x.key !== charge.key))} className="grid size-10 place-items-center self-end rounded-md text-muted hover:bg-surface-2 hover:text-danger" title="Remove charge"><Trash2 className="size-4" aria-hidden /><span className="sr-only">Remove charge {chargeIndex + 1}</span></button>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {lines.filter((line) => line.itemId && (Number(line.qty) > 0 || Number(line.hold) > 0)).map((line) => <Field key={line.key} label={`Allocated to ${localName(items.find((item) => item.id === line.itemId)!, locale)} · net amount`} htmlFor={`landed-allocation-${charge.key}-${line.key}`}><Input id={`landed-allocation-${charge.key}-${line.key}`} value={charge.allocations[line.key] ?? ""} onChange={(e) => setLandedCharges((all) => all.map((x) => x.key === charge.key ? { ...x, allocations: { ...x.allocations, [line.key]: e.target.value } } : x))} inputMode="decimal" className="num text-right" /></Field>)}
              </div>
              <p className="mt-2 text-xs text-muted">Net charge to allocate: {rupees((Number(charge.grossAmount || 0) - Number(charge.recoverableGst || 0)).toFixed(2))}. Allocation amounts must total this value.</p>
            </div>)}
          </section> : null}
        </Card>
              </div>
      {error ? <Alert>{error}</Alert> : null}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border-strong bg-surface/95 px-4 py-2.5 backdrop-blur lg:left-[236px]">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-6 gap-y-2">
          <span className="text-[0.8571rem] text-muted">{t("inward.totalQty")}<b className="num ml-1.5 text-[1.05rem] text-text">{pieces.toLocaleString("en-IN")}</b></span>
          <span className="text-[0.8571rem] text-muted">{t("inward.atCost")}<b className="num ml-1.5 text-[1.05rem] text-text">{rupees(value.toFixed(2))}</b></span>
          {avgMarkup !== null ? <span className="text-[0.8571rem] text-muted">{t("inward.avgMarkup")}<b className="num ml-1.5 text-[1.05rem] text-text">{Math.round(avgMarkup)}%</b></span> : null}
          <div className="ml-auto flex gap-2">
            <Button type="button" variant="ghost" onClick={() => router.back()}>{t("common.cancel")}</Button>
            <Button type="submit" disabled={busy || !supplierId} className="bg-navy hover:bg-navy-deep">{t("purchase.receipts.new")}</Button>
          </div>
        </div>
      </div>
    </form>
  );
}

/** Beside the line being entered: the item's photo, current MRP and the last five purchases. */
function LastPurchases({ item }: { item: ItemOption | undefined }) {
  const t = useTranslations("inward");
  const tm = useTranslations();
  const [past, setPast] = useState<Past[] | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [attrs, setAttrs] = useState<[string, string][]>([]);
  useEffect(() => {
    setPast(null);
    setPhoto(null);
    setAttrs([]);
    if (!item) return;
    let live = true;
    api<Past[]>(`/items/${item.id}/purchase-history`).then((r) => { if (live) setPast(r); }).catch(() => { if (live) setPast([]); });
    if (item.styleId) {
      api<{ attributes?: Record<string, string> }>(`/styles/${item.styleId}`).then((s) => { if (live) setAttrs(Object.entries(s.attributes ?? {}).filter(([, v]) => v)); }).catch(() => undefined);
      api<{ thumbFileId: string; color: string | null }[]>(`/styles/${item.styleId}/images`)
        .then((imgs) => { if (live) setPhoto(imgs[0]?.thumbFileId ?? null); }).catch(() => undefined);
    }
    return () => { live = false; };
  }, [item]);
  return (
    <Card className="flex flex-col gap-3 xl:self-start">
      <h2 className="flex items-center gap-2 text-sm font-semibold"><History className="size-4 text-muted" aria-hidden />{t("lastPurchases")}</h2>
      {!item ? <p className="text-sm text-muted">{t("pickLine")}</p> : (
        <>
          <div className="flex gap-3">
            {photo ? <img src={fileUrl(photo)} alt="" className="size-16 rounded-lg border border-border object-cover" /> : null}
            <div className="min-w-0 text-sm">
              <p className="font-medium">{item.name}</p>
              <p className="text-muted">{t("currentMrp")}: <span className="num text-text">{item.mrp ? rupees(item.mrp) : "-"}</span></p>
              <p className="text-muted">{t("inStock")}: <span className="num text-text">{Number(item.stockQty).toLocaleString("en-IN")}</span></p>
              {attrs.length ? <p className="mt-1 flex flex-wrap gap-1">{attrs.map(([k, v]) => <span key={k} className="rounded bg-surface-2 px-1.5 py-0.5 text-xs text-muted" title={tm(`menu.i.${k}`)}>{v}</span>)}</p> : null}
            </div>
          </div>
          {past === null ? <p className="text-sm text-muted">…</p> : past.length ? (
            <table className="w-full text-xs">
              <thead className="text-left text-muted"><tr><th className="py-1 font-medium">{t("date")}</th><th className="py-1 text-right font-medium">{t("cost")}</th><th className="py-1 text-right font-medium">{t("mrp")}</th></tr></thead>
              <tbody>
                {past.map((p, i) => (
                  <tr key={i} className="border-t border-border" title={`${p.supplier} · ${p.number} · ${Number(p.qty)}`}>
                    <td className="py-1">{new Date(`${p.date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}<span className="block truncate text-muted">{p.supplier}</span></td>
                    <td className="num py-1 text-right">{rupees(p.rate)}</td>
                    <td className="num py-1 text-right">{p.mrp ? rupees(p.mrp) : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="text-sm text-muted">{t("neverBought")}</p>}
        </>
      )}
    </Card>
  );
}

/** Pieces on this challan by size, so a short size run shows before it is saved. */
function SizeCurve({ lines, items }: { lines: Line[]; items: ItemOption[] }) {
  const t = useTranslations("inward");
  const bySize = new Map<string, number>();
  for (const l of lines) {
    const size = items.find((x) => x.id === l.itemId)?.size;
    if (size && Number(l.qty) > 0) bySize.set(size, (bySize.get(size) ?? 0) + Number(l.qty));
  }
  if (!bySize.size) return null;
  const max = Math.max(...bySize.values());
  return (
    <Card className="p-3">
      <h2 className="mb-2 text-[0.8571rem] font-semibold tracking-wide text-muted uppercase">{t("sizeCurve")}</h2>
      <div className="flex items-end gap-1.5">
        {[...bySize.entries()].map(([size, n]) => (
          <div key={size} className="flex min-w-0 flex-1 flex-col items-center gap-1">
            <span className="num text-[0.8571rem] font-semibold">{n}</span>
            <span className="w-full rounded-t-[3px] bg-primary" style={{ height: `${Math.max(6, (n / max) * 56)}px` }} />
            <span className="truncate text-[0.7857rem] text-muted">{size}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
