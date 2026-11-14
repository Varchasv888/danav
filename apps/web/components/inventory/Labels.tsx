"use client";

import { Printer, Search, Trash2 } from "lucide-react";
import { STYLE_ATTRIBUTES } from "@varchasv/domain";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/client-api";
import { rupees } from "@/lib/format";
import { Button, Card, Field, Input, Select } from "../ui";
import { Label, TEMPLATES, type LabelFields, type LabelItem, type LabelJob, type TemplateKey } from "./LabelSheet";

export type Sellable = Omit<LabelItem, "qty"> & { stock: number };
const ATTR_NAMES = STYLE_ATTRIBUTES;
const JOB = "varchasv.labels.job";
const PREFS = "varchasv.labels.prefs.v2";
const FIXED_BARCODE_SELECTION = "varchasv.fixedBarcode.printIds";

/** Pick what to label (search, a whole design, or a purchase bill's lines), choose the label stock, print. */
export function Labels({ items, styles, business, initial, fixedBarcodeSelection = false }: {
  items: Sellable[]; styles: { id: string; code: string; name: string }[]; business: string; initial: LabelItem[]; fixedBarcodeSelection?: boolean;
}) {
  const t = useTranslations("labels");
  const tm = useTranslations();
  const [lines, setLines] = useState<LabelItem[]>(initial);
  const [q, setQ] = useState("");
  const [style, setStyle] = useState("");
  const [template, setTemplate] = useState<TemplateKey>("a4x65");
  const [fields, setFields] = useState<LabelFields>({ business: true, name: true, design: true, colourSize: true, mrp: true, extra: false });
  const [extraText, setExtraText] = useState("");
  const [skip, setSkip] = useState("0");
  const [copies, setCopies] = useState("1");
  const [mode, setMode] = useState<"single" | "sizes">("single");
  // Only attributes that the items being labelled actually have are offered.
  const usedAttrs = ATTR_NAMES.filter((k) => lines.some((l) => l.attrs?.[k]));
  const router = useRouter();
  const [made, setMade] = useState<number | null>(null);
  const giveCodes = async () => { try { const r = await api<{ assigned: number }>("/items/barcodes/generate", { body: {} }); setMade(r.assigned); router.refresh(); } catch { setMade(-1); } };
  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem(PREFS) ?? "null") as Pick<LabelJob, "template" | "fields" | "extraText"> | null;
      if (p?.template && p.template in TEMPLATES) { setTemplate(p.template); setFields(p.fields); setExtraText(p.extraText ?? ""); }
    } catch { /* storage blocked: defaults */ }
  }, []);
  useEffect(() => {
    if (!fixedBarcodeSelection) return;
    try {
      const raw = JSON.parse(sessionStorage.getItem(FIXED_BARCODE_SELECTION) ?? "[]");
      const ids = new Set<string>(Array.isArray(raw) ? raw.filter((id): id is string => typeof id === "string") : []);
      setLines(items.filter((item) => ids.has(item.itemId) && Boolean(item.barcode)).map(({ stock: _stock, ...item }) => ({ ...item, qty: 1 })));
      sessionStorage.removeItem(FIXED_BARCODE_SELECTION);
    } catch {
      sessionStorage.removeItem(FIXED_BARCODE_SELECTION);
    }
  }, [fixedBarcodeSelection, items]);
  const add = (it: Sellable, qty = 1) => setLines((ls) => {
    const i = ls.findIndex((l) => l.itemId === it.itemId);
    if (i >= 0) return ls.map((l, j) => (j === i ? { ...l, qty: l.qty + qty } : l));
    const { stock: _s, ...rest } = it;
    return [...ls, { ...rest, qty }];
  });
  const s = q.trim().toLowerCase();
  const matches = s ? items.filter((i) => i.barcode === s || ((i as { aliases?: string[] }).aliases ?? []).includes(s) || (i.sku ?? "").toLowerCase() === s || i.name.toLowerCase().includes(s)).slice(0, 8) : [];
  const total = lines.reduce((n, l) => n + Math.max(0, Math.floor(l.qty)), 0) * Math.max(1, Number(copies) || 1);
  const job: LabelJob = { template, fields, extraText, business, items: lines, skip: Number(skip) || 0, copies: Number(copies) || 1, mode };
  const print = () => {
    try {
      localStorage.setItem(JOB, JSON.stringify(job));
      localStorage.setItem(PREFS, JSON.stringify({ template, fields, extraText }));
    } catch { /* the print tab will say there is nothing to print */ }
    window.open("/print/labels", "_blank");
  };
  const toggle = (k: keyof LabelFields) => setFields({ ...fields, [k]: !fields[k] });

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
      <div className="flex flex-col gap-4">
        <p className="flex flex-wrap items-center gap-3 text-sm"><Button type="button" variant="outline" onClick={giveCodes}>{t("giveBarcodes")}</Button>{made === null ? null : <span role="status" className={made < 0 ? "text-danger" : "text-success"}>{made < 0 ? t("giveBarcodesFailed") : t("giveBarcodesDone", { n: made })}</span>}</p>
        <Card className="flex flex-col gap-3">
          <div className="flex flex-wrap items-end gap-3">
            <div className="relative min-w-60 flex-1">
              <Search className="pointer-events-none absolute top-2.5 left-2.5 size-4 text-muted" aria-hidden />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search")} aria-label={t("search")} className="pl-8"
                onKeyDown={(e) => { if (e.key === "Enter" && matches[0]) { e.preventDefault(); add(matches[0]); setQ(""); } }} />
            </div>
            <Select value={style} onChange={(e) => setStyle(e.target.value)} className="w-64" aria-label={t("wholeDesign")}>
              <option value="">{t("wholeDesign")}</option>
              {styles.map((x) => <option key={x.id} value={x.id}>{x.code} {x.name}</option>)}
            </Select>
            <Button variant="outline" disabled={!style} onClick={() => { for (const it of items.filter((i) => i.design === styles.find((x) => x.id === style)?.code)) add(it); }}>{t("addOneEach")}</Button>
            <Button variant="outline" disabled={!style} onClick={() => { for (const it of items.filter((i) => i.design === styles.find((x) => x.id === style)?.code && i.stock > 0)) add(it, it.stock); }}>{t("addStock")}</Button>
          </div>
          {matches.length ? (
            <ul className="divide-y divide-border rounded-lg border border-border text-sm">
              {matches.map((m) => (
                <li key={m.itemId}><button type="button" onClick={() => { add(m); setQ(""); }} className="flex w-full justify-between px-3 py-2 text-left hover:bg-surface-2">
                  <span>{m.name}</span><span className="font-mono text-xs text-muted">{m.barcode}</span>
                </button></li>
              ))}
            </ul>
          ) : null}
        </Card>
        <Card className="p-0">
          <table className="w-full text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-4 py-2 font-medium">{t("item")}</th><th className="px-3 py-2 font-medium">{t("barcode")}</th>
                <th className="px-3 py-2 text-right font-medium">{t("mrp")}</th>
                <th className="w-24 px-3 py-2 font-medium">{t("labels")}</th><th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <tr key={l.itemId} className="border-b border-border last:border-0">
                  <td className="px-4 py-1.5">{l.name}</td>
                  <td className="px-3 py-1.5 font-mono text-xs">{l.barcode ?? <span className="text-muted">{t("noBarcode")}</span>}</td>
                  <td className="num px-3 py-1.5 text-right">{l.mrp ? rupees(l.mrp) : "-"}</td>
                  <td className="px-3 py-1.5"><Input value={String(l.qty)} onChange={(e) => setLines(lines.map((x, j) => (j === i ? { ...x, qty: Number(e.target.value.replace(/\D/g, "") || 0) } : x)))} inputMode="numeric" className="num h-8" aria-label={t("labels")} /></td>
                  <td className="px-2"><button type="button" onClick={() => setLines(lines.filter((_, j) => j !== i))} className="rounded p-1 text-muted hover:text-danger" title={t("remove")}><Trash2 className="size-4" aria-hidden /></button></td>
                </tr>
              ))}
              {!lines.length ? <tr><td colSpan={5} className="px-4 py-8 text-center text-muted">{t("empty")}</td></tr> : null}
            </tbody>
          </table>
        </Card>
      </div>
      <Card className="flex flex-col gap-4 self-start">
        <Field label={t("stock")} htmlFor="lb-tpl">
          <Select id="lb-tpl" value={template} onChange={(e) => setTemplate(e.target.value as TemplateKey)}>
            {(Object.keys(TEMPLATES) as TemplateKey[]).map((k) => <option key={k} value={k}>{t(`templates.${k}`)}</option>)}
          </Select>
        </Field>
        <Field label={t("mode")} htmlFor="lb-mode"><Select id="lb-mode" value={mode} onChange={(e) => setMode(e.target.value as "single" | "sizes")}><option value="single">{t("modeSingle")}</option><option value="sizes">{t("modeSizes")}</option></Select></Field>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {(["business", "name", "design", "colourSize", "mrp", "extra", "photo"] as const).map((k) => (
            <label key={k} className="flex items-center gap-2"><input type="checkbox" checked={!!fields[k]} onChange={() => toggle(k)} className="accent-[var(--color-primary)]" />{t(`fields.${k}`)}</label>
          ))}
        </div>
        {usedAttrs.length ? (
          <fieldset className="text-sm">
            <legend className="mb-1 text-muted">{t("attrsOnLabel")}</legend>
            <div className="grid grid-cols-2 gap-2">
              {usedAttrs.map((k) => (
                <label key={k} className="flex items-center gap-2"><input type="checkbox" checked={!!fields.attrs?.includes(k)} onChange={() => setFields({ ...fields, attrs: fields.attrs?.includes(k) ? fields.attrs.filter((x) => x !== k) : [...(fields.attrs ?? []), k] })} className="accent-[var(--color-primary)]" />{tm(`menu.i.${k}`)}</label>
              ))}
            </div>
          </fieldset>
        ) : null}
        <div className="grid grid-cols-2 gap-3">
          <Field label={t("copies")} htmlFor="lb-copies"><Input id="lb-copies" inputMode="numeric" value={copies} onChange={(e) => setCopies(e.target.value.replace(/\D/g, "").slice(0, 2))} className="num" /></Field>
          <Field label={t("skipUsed")} htmlFor="lb-skip" hint={t("skipHint")}><Input id="lb-skip" inputMode="numeric" value={skip} onChange={(e) => setSkip(e.target.value.replace(/\D/g, "").slice(0, 3))} className="num" /></Field>
        </div>
        {fields.extra ? <Field label={t("extraText")} htmlFor="lb-extra" hint={t("extraHint")}><Input id="lb-extra" value={extraText} onChange={(e) => setExtraText(e.target.value)} maxLength={60} /></Field> : null}
        <div className="flex flex-col items-center gap-2 rounded-lg bg-surface-2 p-4">
          <span className="text-xs text-muted">{t("preview")}</span>
          {lines[0] ? <div className="border border-dashed border-border shadow-sm"><Label item={lines[0]} job={job} /></div> : <span className="text-sm text-muted">{t("previewEmpty")}</span>}
        </div>
        <Button onClick={print} disabled={!total} className="h-11"><Printer className="size-4" aria-hidden />{t("print", { n: total })}</Button>
        <p className="text-xs text-muted">{t("printHint")}</p>
      </Card>
    </div>
  );
}
