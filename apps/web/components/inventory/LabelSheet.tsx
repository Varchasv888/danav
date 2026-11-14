"use client";

import { ean13Modules } from "@/lib/barcode";
import { fileUrl } from "@/lib/images";

/** Label stock the shop prints on; sizes in millimetres. */
export const TEMPLATES = {
  roll50x25: { w: 50, h: 25, cols: 1, pageW: 50, pageH: 25 },
  roll38x25x2: { w: 38, h: 25, cols: 2, pageW: 80, pageH: 25, gapX: 2, marginX: 1 },
  a4x65: { w: 38.1, h: 21.2, cols: 5, rows: 13, pageW: 210, pageH: 297, gapX: 2.5, marginX: 4.7, marginY: 10.7 },
  // Plain A4 label sheets: many to a page.
  a4x48: { w: 45.7, h: 21.2, cols: 4, rows: 12, pageW: 210, pageH: 297, gapX: 2.5, marginX: 9.8, marginY: 21.2 },
  a4x40: { w: 45.7, h: 25.4, cols: 4, rows: 10, pageW: 210, pageH: 297, gapX: 2.5, marginX: 9.8, marginY: 21.3 },
  a4x24: { w: 63.5, h: 33.9, cols: 3, rows: 8, pageW: 210, pageH: 297, gapX: 2.5, marginX: 7.2, marginY: 12.7 },
  tag50x75: { w: 50, h: 75, cols: 1, pageW: 50, pageH: 75 },
} as const;
export type TemplateKey = keyof typeof TEMPLATES;

export interface LabelItem { itemId: string; name: string; design: string | null; color: string | null; size: string | null; barcode: string | null; sku: string | null; mrp: string | null; price: string; qty: number; photo?: string | null; /** The style's attributes (fabric, fit and so on) by name. */ attrs?: Record<string, string> }
export interface LabelFields { business: boolean; name: boolean; design: boolean; colourSize: boolean; mrp: boolean; extra: boolean; photo?: boolean; /** Names of style attributes to print, in order. */ attrs?: string[] }
export interface LabelJob {
  template: TemplateKey; fields: LabelFields; extraText: string; business: string; items: LabelItem[];
  /** Labels already used on the first sheet (a part sheet): that many places are left blank. */
  skip?: number;
  /** Copies printed of every label. */
  copies?: number;
  /** One label per barcode (the usual), or one per design and colour listing every size with its barcode. */
  mode?: "single" | "sizes";
}

const money = (v: string | null) => (v === null ? "" : `₹${Number(v).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`);

/** Bars drawn as one SVG path; quiet zones on both sides; digits printed under the bars. */
function Bars({ code, height }: { code: string; height: number }) {
  const m = ean13Modules(code);
  if (!m) return <div className="font-mono" style={{ fontSize: "2.4mm" }}>{code}</div>;
  const quiet = 7;
  const width = m.length + quiet * 2;
  let d = "";
  m.forEach((b, i) => { if (b) d += `M${i + quiet} 0h1v${height}h-1z`; });
  return (
    <div className="flex flex-col items-center" style={{ lineHeight: 1 }}>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ width: "100%", height: `${height / 10}mm` }} aria-label={code} role="img">
        <path d={d} fill="#000" />
      </svg>
      <span className="font-mono tracking-wider" style={{ fontSize: "2.2mm" }}>{code}</span>
    </div>
  );
}

/** One label. Sizes in mm so the screen preview and the printout match. */
export function Label({ item, job }: { item: LabelItem; job: Pick<LabelJob, "template" | "fields" | "extraText" | "business"> }) {
  const t = TEMPLATES[job.template];
  const f = job.fields;
  const tag = job.template === "tag50x75";
  const small = t.h < 22;
  const barH = tag ? 120 : small ? 60 : 75; // tenths of a mm
  const cs = [item.color, item.size].filter(Boolean).join(" · ");
  return (
    <div className="relative flex flex-col justify-between overflow-hidden bg-white text-black" style={{ width: `${t.w}mm`, height: `${t.h}mm`, padding: small ? "0.8mm 1.5mm" : "1.2mm 2mm", fontFamily: "Arial, sans-serif" }}>
      {f.photo && item.photo ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={fileUrl(item.photo)} alt="" className="absolute object-cover" style={{ right: "1.5mm", top: "1.2mm", width: tag ? "20mm" : "10mm", height: tag ? "20mm" : "10mm" }} /> : null}
      <div style={{ lineHeight: 1.15, paddingRight: f.photo && item.photo ? (tag ? "21mm" : "11mm") : 0 }}>
        {f.business ? <div className="truncate font-bold" style={{ fontSize: tag ? "3.4mm" : "2.4mm" }}>{job.business}</div> : null}
        {f.name ? <div className="truncate" style={{ fontSize: tag ? "3mm" : "2.3mm" }}>{item.name}</div> : null}
        {f.attrs?.length && item.attrs ? <div className="truncate" style={{ fontSize: tag ? "2.6mm" : "1.9mm" }}>{f.attrs.map((k) => item.attrs?.[k]).filter(Boolean).join(" · ")}</div> : null}
        <div className="flex justify-between gap-1" style={{ fontSize: tag ? "3mm" : "2.2mm" }}>
          {f.design && item.design ? <span className="truncate">{item.design}</span> : <span />}
          {f.colourSize && cs ? <span className={tag ? "font-bold" : ""} style={tag ? { fontSize: "5mm" } : undefined}>{cs}</span> : null}
        </div>
      </div>
      {item.barcode ? <Bars code={item.barcode} height={barH} /> : <div className="font-mono" style={{ fontSize: "2.4mm" }}>{item.sku ?? ""}</div>}
      <div style={{ lineHeight: 1.1 }}>
        {f.mrp && item.mrp ? <div className="flex items-baseline justify-between"><span style={{ fontSize: tag ? "2.6mm" : "2mm" }}>MRP (incl. of all taxes)</span><b style={{ fontSize: tag ? "4.2mm" : "3mm" }}>{money(item.mrp)}</b></div> : null}
        {f.extra && job.extraText ? <div className="truncate" style={{ fontSize: "1.9mm" }}>{job.extraText}</div> : null}
      </div>
    </div>
  );
}

/** One label for a design and colour that lists each size with its barcode, for a hanger tag or a set. */
export function SizesLabel({ items, job }: { items: LabelItem[]; job: Pick<LabelJob, "template" | "fields" | "business"> }) {
  const t = TEMPLATES[job.template];
  const first = items[0]!;
  const f = job.fields;
  return (
    <div className="relative flex flex-col overflow-hidden bg-white text-black" style={{ width: `${t.w}mm`, height: `${t.h}mm`, padding: "1.2mm 2mm", fontFamily: "Arial, sans-serif", lineHeight: 1.2 }}>
      {f.photo && first.photo ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={fileUrl(first.photo)} alt="" className="absolute object-cover" style={{ right: "1.5mm", top: "1.2mm", width: "14mm", height: "14mm" }} /> : null}
      {f.business ? <div className="truncate font-bold" style={{ fontSize: "2.6mm" }}>{job.business}</div> : null}
      <div className="truncate font-semibold" style={{ fontSize: "3mm" }}>{first.design ?? first.name}{first.color ? ` · ${first.color}` : ""}</div>
      <div className="mt-0.5 flex-1">
        {items.map((i) => <div key={i.itemId} className="flex justify-between font-mono" style={{ fontSize: "2.2mm" }}><span className="font-bold">{i.size ?? "-"}</span><span>{i.barcode ?? i.sku ?? ""}</span></div>)}
      </div>
      {f.mrp && first.mrp ? <div className="flex items-baseline justify-between"><span style={{ fontSize: "2mm" }}>MRP (incl. of all taxes)</span><b style={{ fontSize: "3.4mm" }}>{money(first.mrp)}</b></div> : null}
    </div>
  );
}

/** Every label of a job laid out for its stock: one page per row on a roll, sheets of 65 on A4. */
export function LabelPages({ job }: { job: LabelJob }) {
  const t = TEMPLATES[job.template];
  const copies = Math.max(1, Math.min(20, Math.floor(job.copies ?? 1)));
  // Sizes mode: one label for each design and colour, listing its sizes.
  const groups = new Map<string, LabelItem[]>();
  if (job.mode === "sizes") for (const i of job.items) groups.set(`${i.design ?? i.name}|${i.color ?? ""}`, [...(groups.get(`${i.design ?? i.name}|${i.color ?? ""}`) ?? []), i]);
  const sizeLabels = [...groups.values()];
  const real: (LabelItem | null)[] = job.items.flatMap((i) => Array.from({ length: Math.max(0, Math.min(500, Math.floor(i.qty))) * copies }, () => i));
  if (job.mode === "sizes") return <SizesPages groups={sizeLabels} job={job} copies={copies} />;
  const perPage = "rows" in t ? t.cols * t.rows : t.cols;
  // Places already used on a part sheet stay blank so the labels line up with the ones left on the sheet.
  const labels: (LabelItem | null)[] = [...Array.from({ length: perPage > 1 ? Math.max(0, Math.min(perPage - 1, Math.floor(job.skip ?? 0))) : 0 }, () => null), ...real];
  const pages: (LabelItem | null)[][] = [];
  for (let i = 0; i < labels.length; i += perPage) pages.push(labels.slice(i, i + perPage));
  const gapX = "gapX" in t ? t.gapX : 0;
  return (
    <>
      <style>{`@page { size: ${t.pageW}mm ${t.pageH}mm; margin: 0 } @media print { body { margin: 0 } .label-page { break-after: page } }`}</style>
      {pages.map((p, i) => (
        <div key={i} className="label-page bg-white" style={{
          width: `${t.pageW}mm`, height: `${t.pageH}mm`, boxSizing: "border-box",
          padding: `${"marginY" in t ? t.marginY : 0}mm ${"marginX" in t ? t.marginX : 0}mm`,
          display: "grid", gridTemplateColumns: `repeat(${t.cols}, ${t.w}mm)`, columnGap: `${gapX}mm`, alignContent: "start",
        }}>
          {p.map((item, k) => (item ? <Label key={k} item={item} job={job} /> : <div key={k} style={{ width: `${t.w}mm`, height: `${t.h}mm` }} />))}
        </div>
      ))}
    </>
  );
}

function SizesPages({ groups, job, copies }: { groups: LabelItem[][]; job: LabelJob; copies: number }) {
  const t = TEMPLATES[job.template];
  const perPage = "rows" in t ? t.cols * t.rows : t.cols;
  const all = groups.flatMap((g) => Array.from({ length: copies }, () => g));
  const pages: LabelItem[][][] = [];
  for (let i = 0; i < all.length; i += perPage) pages.push(all.slice(i, i + perPage));
  const gapX = "gapX" in t ? t.gapX : 0;
  return (
    <>
      <style>{`@page { size: ${t.pageW}mm ${t.pageH}mm; margin: 0 } @media print { body { margin: 0 } .label-page { break-after: page } }`}</style>
      {pages.map((p, i) => (
        <div key={i} className="label-page bg-white" style={{ width: `${t.pageW}mm`, height: `${t.pageH}mm`, boxSizing: "border-box", padding: `${"marginY" in t ? t.marginY : 0}mm ${"marginX" in t ? t.marginX : 0}mm`, display: "grid", gridTemplateColumns: `repeat(${t.cols}, ${t.w}mm)`, columnGap: `${gapX}mm`, alignContent: "start" }}>
          {p.map((g, k) => <SizesLabel key={k} items={g} job={job} />)}
        </div>
      ))}
    </>
  );
}
