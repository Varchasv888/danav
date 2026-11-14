"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ACCENT_COLOURS, ACCENTS, LANDSCAPE_THEMES, PAPERS, PRINT_THEMES, THERMAL_SIZES, THERMAL_THEMES } from "@varchasv/domain";
import { api } from "@/lib/client-api";
import { errorText } from "@/lib/error-text";
import { Alert, Card } from "../ui";
import { DirectPrint } from "../pos/DirectPrint";
import { LayoutPicker } from "./LayoutPicker";

type Prefs = Record<string, boolean | string>;
type Printer = "print" | "thermal";
type Pane = "layout" | "colours";
const PAPER_MM: Record<string, [number, number]> = { A4: [210, 297], A5: [148, 210], A3: [297, 420], Letter: [216, 279], Legal: [216, 356] };
const MM = 3.78;

/** A box that keeps its own text and saves it when the person leaves it, with its name on the border as on the reference screens. */
function BoxField({ label, value, onCommit, disabled, max, className }: { label: string; value: string; onCommit: (v: string) => void; disabled?: boolean; max?: number; className?: string }) {
  const [v, setV] = useState(value);
  useEffect(() => setV(value), [value]);
  return (
    <div className={clsx("relative flex-1", className)}>
      <label className="absolute -top-2 left-2.5 bg-surface px-1 text-xs text-muted">{label}</label>
      <input value={v} maxLength={max} disabled={disabled} onChange={(e) => setV(e.target.value)} onBlur={() => { if (v.trim() !== value) onCommit(v.trim()); }}
        className="h-10 w-full rounded-md border border-border-input bg-surface px-3 text-sm focus:border-ring focus:outline-none disabled:bg-surface-2" />
    </div>
  );
}

/** A whole number box saved as it is changed. */
function NumberBox({ label, value, min, max, onCommit, disabled }: { label: string; value: string; min: number; max: number; onCommit: (v: string) => void; disabled?: boolean }) {
  const [v, setV] = useState(value);
  useEffect(() => setV(value), [value]);
  const commit = () => { const n = Number(v); if (Number.isInteger(n) && n >= min && n <= max) { if (String(n) !== value) onCommit(String(n)); } else setV(value); };
  return (
    <label className="flex items-center gap-3 text-sm">
      <span className="w-44">{label}</span>
      <input type="number" min={min} max={max} value={v} disabled={disabled} onChange={(e) => setV(e.target.value)} onBlur={commit} onKeyDown={(e) => { if (e.key === "Enter") commit(); }}
        className="h-10 w-20 rounded-md border border-border-input bg-surface px-3 text-sm focus:border-ring focus:outline-none disabled:bg-surface-2" />
    </label>
  );
}

/** The sample beside the options: the real printed document with made-up figures, drawn with the saved choices and scaled to fit the pane. */
function Preview({ kind, prefs, rev, label }: { kind: "invoice" | "receipt"; prefs: Prefs; rev: number; label: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  const wide = LANDSCAPE_THEMES.includes(String(prefs["print.theme"]));
  const [pw, ph] = PAPER_MM[String(prefs["print.paper"])] ?? PAPER_MM.A4!;
  const landscape = prefs["print.orientation"] === "landscape" || wide;
  const size = String(prefs["thermal.size"]);
  const rollMm = size === "58" ? 48 : size === "88" ? 80 : size === "custom" ? Math.round(Number(prefs["thermal.chars"]) * 1.4) : 68;
  const sheetW = kind === "invoice" ? (landscape ? ph : pw) * MM + 40 : rollMm * MM + 24;
  const sheetH = kind === "invoice" ? (landscape ? pw : ph) * MM + 40 : 900;
  const scale = Math.min(1, Math.max(width, 120) / sheetW);
  return (
    <div ref={box} className="min-w-0 overflow-hidden rounded-lg border border-border bg-surface-2 p-3" aria-label={label}>
      <div style={{ height: sheetH * scale }} className={clsx(kind === "receipt" && "flex justify-center")}>
        <iframe title={label} key={`${kind}-${rev}`} src={`/print/sample/${kind}?v=${rev}`} loading="eager"
          style={{ width: sheetW, height: sheetH, transform: `scale(${scale})`, transformOrigin: "top left", border: 0, background: "#fff" }} className="shadow-raised" />
      </div>
    </div>
  );
}

/**
 * The Print tab of Settings, laid out as in the reference product: Regular printer and Thermal printer, each with the strip of layouts, what the header, item table, totals
 * and foot show, and a sample on the right that is the real printed document. Every change is saved as it is made and the sample reloads.
 */
export function PrintWorkspace({ initial, canEdit }: { initial: Prefs; canEdit: boolean }) {
  const t = useTranslations();
  const s = useTranslations("settingsUi");
  const [prefs, setPrefs] = useState<Prefs>(initial);
  const [error, setError] = useState<string | null>(null);
  const [rev, setRev] = useState(0);
  const [printer, setPrinter] = useState<Printer>("print");
  const [pane, setPane] = useState<Pane>("layout");
  const [namesOpen, setNamesOpen] = useState(false);
  const p = printer;
  const key = (n: string) => `${p}.${n}`;
  const on = (n: string) => prefs[key(n)] === true;
  const str = (n: string) => String(prefs[key(n)] ?? "");
  const accent = ACCENT_COLOURS[String(prefs["print.accent"])] ?? null;

  async function setMany(changes: Record<string, boolean | string>) {
    const before = prefs;
    setPrefs({ ...prefs, ...changes });
    setError(null);
    try { setPrefs(await api<Prefs>("/settings/preferences", { method: "PUT", body: changes })); setRev((n) => n + 1); }
    catch (err) { setPrefs(before); setError(errorText(t, err, ["settingsUi.errors"])); }
  }
  const set = (n: string, v: boolean | string) => setMany({ [key(n)]: v });
  // A landscape layout is drawn on a wide page, so choosing one turns the page to landscape as well.
  const pickInvoiceLayout = (id: string) => void setMany(LANDSCAPE_THEMES.includes(id) ? { "print.theme": id, "print.orientation": "landscape" } : { "print.theme": id });

  async function pickLogo(file: File) {
    try {
      const bmp = await createImageBitmap(file);
      const scale = Math.min(1, 320 / Math.max(bmp.width, bmp.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bmp.width * scale); canvas.height = Math.round(bmp.height * scale);
      canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
      let url = canvas.toDataURL("image/png");
      if (url.length > 190_000) url = canvas.toDataURL("image/jpeg", 0.8);
      if (url.length > 190_000) throw new Error("too_big");
      void setMany({ "print.logo": url, "print.showLogo": true });
    } catch { setError(s("errors.logo")); }
  }

  const Check = ({ n, label, hint }: { n: string; label?: string; hint?: string }) => (
    <label className="flex cursor-pointer items-start gap-3 text-sm">
      <input type="checkbox" checked={on(n)} disabled={!canEdit} onChange={(e) => void set(n, e.target.checked)} className="mt-0.5 size-[1.1rem] accent-[var(--color-primary)]" />
      <span>{label ?? s(`pref.${n}`)}{hint ? <span className="block text-xs text-muted">{hint}</span> : null}</span>
    </label>
  );
  const Row = ({ show, text, label }: { show: string; text: string; label: string }) => (
    <div className="flex items-center gap-3">
      <input type="checkbox" aria-label={label} checked={on(show)} disabled={!canEdit} onChange={(e) => void set(show, e.target.checked)} className="size-[1.1rem] shrink-0 accent-[var(--color-primary)]" />
      <BoxField label={label} value={str(text)} onCommit={(v) => void set(text, v)} disabled={!canEdit || !on(show)} max={text === "addressText" ? 200 : 80} />
    </div>
  );
  const Select = ({ k, label, options, text }: { k: string; label: string; options: readonly string[]; text: (o: string) => string }) => (
    <label className="flex items-center justify-between gap-3 text-sm">{label}
      <select value={String(prefs[k])} disabled={!canEdit} onChange={(e) => void setMany({ [k]: e.target.value })} className="h-10 w-44 rounded-md border border-border-input bg-surface px-2.5">
        {options.map((o) => <option key={o} value={o}>{text(o)}</option>)}
      </select>
    </label>
  );
  const Section = ({ title, children }: { title: string; children: ReactNode }) => (
    <fieldset disabled={!canEdit} className="min-w-0">
      <legend className="mb-3 w-full border-b border-border pb-2 text-[1.05rem] font-semibold">{title}</legend>
      <div className="flex flex-col gap-3.5">{children}</div>
    </fieldset>
  );

  const items = (
    <Section title={s("section.items")}>
      <Check n="showSno" /><Check n="showHsn" /><Check n="showUom" /><Check n="showMrp" /><Check n="showSize" /><Check n="showBatch" /><Check n="showExpiry" /><Check n="showModel" />{p === "thermal" ? <Check n="showSerial" /> : null}
    </Section>
  );
  const totals = (
    <Section title={s("section.totals")}>
      <Check n="showTotalQty" /><Check n="amountDecimal" hint={s("hint.amountDecimal")} /><Check n="showReceived" /><Check n="showBalance" />
      {p === "print" ? <Check n="showCurrentBalance" /> : null}
      <Check n={p === "print" ? "showTaxSummary" : "showTaxTable"} label={p === "print" ? s("pref.showTaxDetails") : s("pref.showTaxTable")} /><Check n="showYouSaved" /><Check n="amountGrouping" /><Check n="showWords" />
      <Select k={key("wordsStyle")} label={s("pref.wordsStyle")} options={["indian", "international"]} text={(o) => s(`opt.wordsStyle.${o}`)} />
    </Section>
  );

  return (
    <div className="mb-4">
      {error ? <Alert>{error}</Alert> : null}
      {!canEdit ? <p className="mb-2 text-sm text-muted">{s("readOnly")}</p> : null}
      <div role="tablist" className="mb-3 flex gap-2 border-b border-border">
        {(["print", "thermal"] as const).map((k) => (
          <button key={k} type="button" role="tab" aria-selected={printer === k} onClick={() => setPrinter(k)}
            className={clsx("-mb-px border-b-2 px-4 py-2 text-[0.95rem] font-bold uppercase tracking-wide focus-visible:outline-2 focus-visible:outline-primary", printer === k ? "border-primary text-primary" : "border-transparent text-text hover:text-primary")}>
            {s(k === "print" ? "layout.regular" : "layout.thermal")}
          </button>
        ))}
      </div>
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
        <Card className="flex flex-col gap-6 p-4">
          {p === "print" ? (
            <div>
              <div role="tablist" className="mb-3 flex gap-1 border-b border-border">
                {(["layout", "colours"] as const).map((k) => (
                  <button key={k} type="button" role="tab" aria-selected={pane === k} onClick={() => setPane(k)}
                    className={clsx("-mb-px border-b-2 px-3 py-1.5 text-sm font-semibold uppercase focus-visible:outline-2 focus-visible:outline-primary", pane === k ? "border-primary text-primary" : "border-transparent text-text hover:text-primary")}>
                    {s(k === "layout" ? "layout.invoiceTitle" : "layout.colourTitle")}
                  </button>
                ))}
              </div>
              {pane === "layout" ? (
                <LayoutPicker kind="invoice" options={PRINT_THEMES} value={String(prefs["print.theme"])} onPick={pickInvoiceLayout} accent={accent} disabled={!canEdit} />
              ) : (
                <div className="flex flex-wrap gap-2.5 py-1" role="radiogroup" aria-label={s("pref.accent")}>
                  {ACCENTS.map((a) => (
                    <button key={a} type="button" role="radio" aria-checked={prefs["print.accent"] === a} aria-label={s(`accent.${a}`)} title={s(`accent.${a}`)} disabled={!canEdit} onClick={() => void setMany({ "print.accent": a })}
                      className={clsx("size-7 rounded-full border border-black/20 focus-visible:outline-2 focus-visible:outline-primary", prefs["print.accent"] === a && "ring-2 ring-primary ring-offset-2")}
                      style={{ background: ACCENT_COLOURS[a] ?? "linear-gradient(135deg,#fff 48%,#111 52%)" }} />
                  ))}
                </div>
              )}
              {pane === "layout" && LANDSCAPE_THEMES.includes(String(prefs["print.theme"])) ? <p className="mt-2 text-xs text-muted">{s("layout.landscapeNote")}</p> : null}
            </div>
          ) : (
            <div>
              <div className="mb-3 border-b border-border"><span className="-mb-px inline-block border-b-2 border-primary px-3 py-1.5 text-sm font-semibold uppercase text-primary">{s("layout.invoiceTitle")}</span></div>
              <LayoutPicker kind="receipt" options={THERMAL_THEMES} value={str("theme")} onPick={(id) => void set("theme", id)} disabled={!canEdit} />
            </div>
          )}

          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input type="checkbox" checked={prefs["print.defaultPrinter"] === (p === "print" ? "regular" : "thermal")} disabled={!canEdit}
              onChange={(e) => void setMany({ "print.defaultPrinter": e.target.checked ? (p === "print" ? "regular" : "thermal") : p === "print" ? "thermal" : "regular" })} className="mt-0.5 size-[1.1rem] accent-[var(--color-primary)]" />
            <span>{s(p === "print" ? "pref.defaultRegular" : "pref.defaultThermal")}<span className="block text-xs text-muted">{s("hint.defaultPrinter")}</span></span>
          </label>

          {p === "thermal" ? (
            <>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="w-24 text-[0.95rem]">{s("pref.size")}</span>
                <div role="radiogroup" aria-label={s("pref.size")} className="flex overflow-hidden rounded-md border border-border">
                  {THERMAL_SIZES.map((z) => (
                    <button key={z} type="button" role="radio" aria-checked={str("size") === z} disabled={!canEdit} onClick={() => void set("size", z)}
                      className={clsx("flex min-w-[4.2rem] flex-col items-center px-2.5 py-1.5 text-xs leading-tight", str("size") === z ? "bg-primary text-white" : "bg-surface hover:bg-surface-2")}>
                      <span className="text-[0.8rem]">{s(`size.${z}`)}</span>
                      {z === "custom" ? (
                        <input type="number" min={24} max={96} aria-label={s("size.chars")} value={str("chars")} disabled={!canEdit} onClick={(e) => e.stopPropagation()} onChange={(e) => setPrefs({ ...prefs, "thermal.chars": e.target.value })}
                          onBlur={(e) => void setMany({ "thermal.size": "custom", "thermal.chars": e.target.value })} className="mt-0.5 h-5 w-12 rounded border border-border bg-white px-1 text-center text-black" />
                      ) : <span>{z}mm</span>}
                      {z === "custom" ? <span className="text-[0.65rem]">({s("size.chars")})</span> : null}
                    </button>
                  ))}
                </div>
              </div>
              <Section title={s("section.roll")}>
                <Select k="thermal.printType" label={s("pref.printType")} options={["browser", "direct"]} text={(o) => s(`opt.printType.${o}`)} />
                <Check n="bold" />
                <Check n="autoCut" hint={s("hint.direct")} /><Check n="cashDrawer" hint={s("hint.direct")} />
                {str("printType") === "direct" ? (
                  <>
                    <div className="flex items-center gap-3"><BoxField label={s("field.agentUrl")} value={str("agentUrl")} onCommit={(v) => void set("agentUrl", v)} disabled={!canEdit} max={100} /></div>
                    <div className="flex items-center gap-3"><BoxField label={s("field.printerTarget")} value={str("printerTarget")} onCommit={(v) => void set("printerTarget", v)} disabled={!canEdit} max={100} /></div>
                    <p className="text-xs text-muted">{s("hint.agent")}</p>
                    <div><DirectPrint path="/settings/print-test" label={s("layout.testPrint")} /></div>
                  </>
                ) : null}
                <NumberBox label={s("pref.extraLines")} value={str("extraLines")} min={0} max={10} onCommit={(v) => void set("extraLines", v)} disabled={!canEdit} />
                <NumberBox label={s("pref.copies")} value={str("copies")} min={1} max={5} onCommit={(v) => void set("copies", v)} disabled={!canEdit} />
              </Section>
            </>
          ) : null}

          <Section title={s("section.header")}>
            {p === "print" ? <Check n="repeatHeader" /> : null}
            <Row show="showCompany" text="companyNameText" label={s("field.company")} />
            {p === "print" ? (
              <div className="flex items-center gap-3 text-sm">
                <input type="checkbox" aria-label={s("pref.showLogo")} checked={on("showLogo")} disabled={!canEdit} onChange={(e) => void set("showLogo", e.target.checked)} className="size-[1.1rem] shrink-0 accent-[var(--color-primary)]" />
                <span>{s("pref.showLogo")}</span>
                {str("logo") ? <img src={str("logo")} alt="" className="max-h-8 max-w-16 object-contain" /> : null}
                <label className="cursor-pointer text-primary hover:underline">({s("layout.change")})<input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" disabled={!canEdit} onChange={(e) => { const f = e.target.files?.[0]; if (f) void pickLogo(f); e.target.value = ""; }} /></label>
                {str("logo") ? <button type="button" className="text-muted hover:underline" disabled={!canEdit} onClick={() => void set("logo", "")}>{s("layout.remove")}</button> : null}
              </div>
            ) : null}
            <Row show="showAddress" text="addressText" label={s("field.address")} />
            <Row show="showEmail" text="emailText" label={s("field.email")} />
            <Row show="showPhone" text="phoneText" label={s("field.phone")} />
            <Row show="showGstin" text="gstinText" label={s("field.gstin")} />
            {p === "print" ? <Check n="showPan" /> : <Check n="showCustomer" />}
          </Section>

          <div>
            <button type="button" className="text-sm font-medium text-primary hover:underline" onClick={() => setNamesOpen((o) => !o)} aria-expanded={namesOpen}>{s("layout.names")} {namesOpen ? "⌄" : ">"}</button>
            {namesOpen ? (
              <div className="mt-4 flex flex-col gap-4">
                <p className="text-xs text-muted">{s("hint.names")}</p>
                {(["invoice", "quotation", "proforma", "receipt"] as const).map((n) => (
                  <BoxField key={n} label={s(`field.name.${n}`)} value={String(prefs[`names.${n}`] ?? "")} onCommit={(v) => void setMany({ [`names.${n}`]: v })} disabled={!canEdit} max={40} />
                ))}
              </div>
            ) : null}
          </div>

          {p === "print" ? (
            <Section title={s("section.paper")}>
              <Select k="print.paper" label={s("pref.paper")} options={PAPERS} text={(o) => s(`option.${o}`)} />
              <Select k="print.orientation" label={s("pref.orientation")} options={["portrait", "landscape"]} text={(o) => s(`option.${o}`)} />
              <Select k="print.companyNameSize" label={s("pref.companyNameSize")} options={["large", "medium", "small"]} text={(o) => s(`opt.companyNameSize.${o}`)} />
            </Section>
          ) : null}

          {items}
          {totals}

          <Section title={s("section.footer")}>
            <Check n="showDescription" />
            {p === "print" ? <><Check n="showTerms" /><Check n="showBank" /><Check n="showSignatory" />
              <div className="flex items-center gap-3"><BoxField label={s("field.upiId")} value={String(prefs["print.upiId"] ?? "")} onCommit={(v) => void setMany({ "print.upiId": v })} disabled={!canEdit} max={60} /></div>
              <Check n="showUpiQr" hint={s("hint.upi")} /></> : null}
          </Section>
        </Card>
        <div className="xl:sticky xl:top-2"><Preview kind={p === "print" ? "invoice" : "receipt"} prefs={prefs} rev={rev} label={s(p === "print" ? "preview" : "layout.preview")} /></div>
      </div>
    </div>
  );
}
