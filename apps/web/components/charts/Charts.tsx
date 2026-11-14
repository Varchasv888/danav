"use client";

import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { compactRupees } from "@/lib/format";

/**
 * The chart kit. One question per chart, one axis, series coloured by the fixed `--chart-*` order, a 2px line, a quiet grid,
 * a crosshair with a tooltip on hover or arrow keys, and a table view for everyone who wants the numbers. A chart with two
 * or more series carries a legend; the last value is labelled on the line so identity never depends on colour alone.
 */
export interface Point { label: string; value: number }
export interface Series { name: string; points: Point[] }
/** Figures are formatted here from a unit name, so a server page can hand a chart plain data. */
export type Unit = "rupees" | "count" | "percent";
const fmt = (u: Unit) => (v: number) => (u === "rupees" ? compactRupees(v) : u === "percent" ? `${v.toFixed(1)}%` : Math.round(v).toLocaleString("en-IN"));

const H = 220;
const PAD = { top: 12, right: 64, bottom: 24, left: 52 };

function ticks(max: number) {
  const step = Math.pow(10, Math.floor(Math.log10(max || 1)));
  const nice = [1, 2, 2.5, 5, 10].map((m) => m * step).find((s) => max / s <= 4) ?? step * 10;
  const top = Math.ceil(max / nice) * nice || nice;
  return { top, list: Array.from({ length: Math.round(top / nice) + 1 }, (_, i) => i * nice) };
}

export function TrendChart({ title, series, unit, tableLabel }: { title: string; series: Series[]; unit: Unit; tableLabel?: string }) {
  const t = useTranslations("charts");
  const format = fmt(unit);
  const wrap = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(640);
  const [hover, setHover] = useState<number | null>(null);
  const [table, setTable] = useState(false);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const fit = (px: number) => setW(Math.max(260, Math.round(px)));
    fit(el.clientWidth);
    const ro = new ResizeObserver(([e]) => fit(e!.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const n = series[0]?.points.length ?? 0;
  const max = Math.max(0, ...series.flatMap((s) => s.points.map((p) => p.value)));
  const { top, list } = useMemo(() => ticks(max), [max]);
  const iw = w - PAD.left - PAD.right, ih = H - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (n <= 1 ? iw / 2 : (i / (n - 1)) * iw);
  const y = (v: number) => PAD.top + ih - (v / top) * ih;
  const color = (si: number) => `var(--chart-${si + 1})`;
  const labelEvery = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(iw / 80))));

  if (!n) return <p className="py-8 text-sm text-muted">{t("noData")}</p>;
  const move = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - r.left - PAD.left) / iw) * (n - 1));
    setHover(Math.min(n - 1, Math.max(0, i)));
  };
  const key = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); setHover((h) => Math.min(n - 1, (h ?? -1) + 1)); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); setHover((h) => Math.max(0, (h ?? n) - 1)); }
    else if (e.key === "Escape") setHover(null);
  };
  const active = hover === null ? null : hover;
  const tipLeft = active === null ? 0 : Math.min(Math.max(x(active) - 80, 0), w - 168);

  return (
    <figure className="m-0">
      {series.length > 1 ? (
        <ul className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.8571rem] text-muted" aria-label={t("legend")}>
          {series.map((s, si) => <li key={s.name} className="inline-flex items-center gap-1.5"><span aria-hidden className="inline-block h-0.5 w-4 rounded-full" style={{ background: color(si) }} />{s.name}</li>)}
        </ul>
      ) : null}
      <div ref={wrap} className="relative w-full min-w-0 overflow-hidden">
        {!table ? (
          <svg viewBox={`0 0 ${w} ${H}`} style={{ width: "100%", height: "auto", maxWidth: "100%" }} role="img" tabIndex={0} aria-label={`${title}. ${t("keys")}`} onPointerMove={move} onPointerLeave={() => setHover(null)} onKeyDown={key} onBlur={() => setHover(null)}
            className="block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2">
            {list.map((v) => (
              <g key={v}>
                <line x1={PAD.left} x2={w - PAD.right} y1={y(v)} y2={y(v)} stroke="var(--rule)" strokeWidth={1} />
                <text x={PAD.left - 8} y={y(v) + 4} textAnchor="end" fontSize={11} fill="var(--muted)" className="num">{format(v)}</text>
              </g>
            ))}
            {series[0]!.points.map((p, i) => (i % labelEvery === 0 || i === n - 1) ? <text key={i} x={x(i)} y={H - 6} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} fontSize={11} fill="var(--muted)">{p.label}</text> : null)}
            {series.map((s, si) => (
              <g key={s.name}>
                <polyline fill="none" stroke={color(si)} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" points={s.points.map((p, i) => `${x(i)},${y(p.value)}`).join(" ")} />
                {n <= 40 ? s.points.map((p, i) => <circle key={i} cx={x(i)} cy={y(p.value)} r={active === i ? 4.5 : 0} fill={color(si)} stroke="var(--surface)" strokeWidth={2} />) : active !== null ? <circle cx={x(active)} cy={y(s.points[active]!.value)} r={4.5} fill={color(si)} stroke="var(--surface)" strokeWidth={2} /> : null}
                <text x={x(n - 1) + 8} y={y(s.points[n - 1]!.value) + 4} fontSize={11} fontWeight={600} fill="var(--text)" className="num">{format(s.points[n - 1]!.value)}</text>
              </g>
            ))}
            {active !== null ? <line x1={x(active)} x2={x(active)} y1={PAD.top} y2={PAD.top + ih} stroke="var(--border-strong)" strokeWidth={1} /> : null}
          </svg>
        ) : (
          <table className="w-full text-[0.9286rem]">
            <caption className="sr-only">{tableLabel ?? title}</caption>
            <thead><tr><th scope="col" className="h-8 border-b border-border-strong text-left text-[0.8571rem] font-normal text-muted">{t("period")}</th>{series.map((s) => <th key={s.name} scope="col" className="h-8 border-b border-border-strong text-right text-[0.8571rem] font-normal text-muted">{s.name}</th>)}</tr></thead>
            <tbody>{series[0]!.points.map((p, i) => <tr key={i}><td className="h-8 border-b border-rule">{p.label}</td>{series.map((s) => <td key={s.name} className="num h-8 border-b border-rule text-right">{format(s.points[i]!.value)}</td>)}</tr>)}</tbody>
          </table>
        )}
        {active !== null && !table ? (
          <div role="status" className="pointer-events-none absolute top-0 z-10 w-40 rounded-md border border-border-strong bg-surface px-2.5 py-1.5 text-[0.8571rem] shadow-overlay" style={{ left: tipLeft }}>
            <b className="block font-semibold text-text">{series[0]!.points[active]!.label}</b>
            {series.map((s, si) => <span key={s.name} className="mt-0.5 flex items-center justify-between gap-2 text-muted"><span className="inline-flex items-center gap-1.5"><span aria-hidden className="inline-block size-2 rounded-full" style={{ background: color(si) }} />{series.length > 1 ? s.name : ""}</span><span className="num font-medium text-text">{format(s.points[active]!.value)}</span></span>)}
          </div>
        ) : null}
      </div>
      <figcaption className="mt-1.5">
        <button type="button" onClick={() => setTable((v) => !v)} className="text-[0.8571rem] text-primary hover:underline">{table ? t("showChart") : t("showTable")}</button>
      </figcaption>
    </figure>
  );
}

/** A ranked list: label and figure on one line, a 10px bar under it, the longest bar about 88% of the width, one colour. */
export function BarList({ rows, unit, empty }: { rows: { name: string; value: number; note?: string }[]; unit: Unit; empty: string }) {
  const format = fmt(unit);
  const max = Math.max(...rows.map((r) => r.value), 1);
  if (!rows.length) return <p className="py-4 text-sm text-muted">{empty}</p>;
  return (
    <ol className="flex flex-col gap-3">
      {rows.map((r) => (
        <li key={r.name} title={r.note ? `${r.name}: ${r.note}` : r.name}>
          <div className="flex items-baseline justify-between gap-3 text-[0.9286rem]">
            <span className="truncate text-text">{r.name}</span>
            <span className="num shrink-0 text-muted">{format(r.value)}</span>
          </div>
          <div className="mt-1 h-2.5 rounded-full bg-transparent"><div className={clsx("h-2.5 rounded-full")} style={{ width: `${(r.value / max) * 88}%`, background: "var(--chart-1)" }} /></div>
        </li>
      ))}
    </ol>
  );
}
