"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useState } from "react";

/** A small drawing of each layout, so the choice is made by looking, as on the reference screens. Strokes follow the text colour; fills follow the chosen colour. */
function InvoiceThumb({ id, accent }: { id: string; accent: string }) {
  // Drawn after the layouts they stand for: tally = the boxed Tally layout, gst1 = ruled lines with a coloured head, gst2 = a framed page with a coloured band.
  const draw = id === "tally" ? "classic" : id === "gst1" ? "clean" : id === "gst2" ? "gst" : id;
  const band = draw === "gst" || draw === "landscape2";
  const wide = draw === "landscape1" || draw === "landscape2";
  const grid = draw === "classic" || draw === "gst" || wide;
  const w = wide ? 88 : 64, h = wide ? 62 : 88;
  const rows = [0, 1, 2, 3];
  const top = band ? 16 : 12;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="0.8" aria-hidden>
      <rect x="0.5" y="0.5" width={w - 1} height={h - 1} fill="var(--color-surface)" stroke={draw === "gst" ? "currentColor" : "var(--color-border)"} />
      {band ? <rect x="1" y="1" width={w - 2} height="12" fill={accent} stroke="none" /> : null}
      {draw === "landscape1" ? (
        <>
          <rect x="5" y="5" width="18" height="4" fill="currentColor" stroke="none" opacity=".5" />
          <rect x={w / 2 - 9} y="5" width="18" height="5" fill={accent} stroke="none" />
          <rect x={w - 14} y="4" width="9" height="9" />
        </>
      ) : band ? (
        <>
          <rect x="5" y="5" width="18" height="4" fill="#fff" stroke="none" />
          <rect x={w - 23} y="5" width="18" height="4" fill="#fff" stroke="none" />
        </>
      ) : (
        <>
          <rect x="5" y="5" width="18" height="4" fill="currentColor" stroke="none" opacity=".55" />
          <rect x={w - 23} y="5" width="18" height="4" fill={draw === "clean" ? accent : "currentColor"} stroke="none" opacity={draw === "clean" ? 1 : 0.55} />
          <line x1="4" x2={w - 4} y1="12" y2="12" strokeWidth={grid ? 1.4 : 0.8} stroke={grid ? "currentColor" : accent} />
        </>
      )}
      {wide ? (
        <>
          <rect x="5" y="17" width="22" height="9" stroke="none" fill="currentColor" opacity=".12" />
          <rect x="33" y="17" width="22" height="9" stroke="none" fill="currentColor" opacity=".12" />
          <rect x="61" y="17" width="22" height="9" stroke="none" fill="currentColor" opacity=".12" />
        </>
      ) : (
        <>
          <rect x="5" y={top + 3} width="26" height="9" stroke="none" fill="currentColor" opacity=".12" />
          <rect x={w - 31} y={top + 3} width="26" height="9" stroke="none" fill="currentColor" opacity=".12" />
        </>
      )}
      {(() => {
        const y0 = wide ? 30 : top + 17, x0 = 4, tw = w - 8;
        return (
          <g>
            <rect x={x0} y={y0} width={tw} height="6" fill={band || draw === "clean" ? accent : "none"} stroke={grid ? "currentColor" : "none"} />
            {!grid && !band ? <line x1={x0} x2={x0 + tw} y1={y0 + 6} y2={y0 + 6} stroke="currentColor" strokeWidth="1.2" /> : null}
            {rows.map((i) => (grid
              ? <rect key={i} x={x0} y={y0 + 6 + i * 5.5} width={tw} height="5.5" />
              : <line key={i} x1={x0} x2={x0 + tw} y1={y0 + 11.5 + i * 5.5} y2={y0 + 11.5 + i * 5.5} stroke="var(--color-border)" />))}
          </g>
        );
      })()}
      <rect x={w - 26} y={h - 16} width="22" height="9" fill={band || draw === "clean" ? accent : "none"} stroke={grid ? "currentColor" : "none"} opacity={band || draw === "clean" ? 0.85 : 1} />
      <rect x="5" y={h - 14} width="24" height="2.5" fill="currentColor" stroke="none" opacity=".35" />
      <rect x="5" y={h - 9} width="18" height="2.5" fill="currentColor" stroke="none" opacity=".25" />
    </svg>
  );
}

function ReceiptThumb({ id }: { id: string }) {
  const n = Number(id.replace("theme", "")) || 1;
  const tabular = n === 1 || n === 2;
  const lines = [0, 1, 2];
  return (
    <svg viewBox="0 0 44 88" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="0.8" aria-hidden>
      <rect x="0.5" y="0.5" width="43" height="87" fill="var(--color-surface)" stroke="var(--color-border)" />
      <rect x="12" y="6" width="20" height="4" fill="currentColor" stroke="none" opacity=".55" />
      <rect x="9" y="14" width="26" height="2" fill="currentColor" stroke="none" opacity=".3" />
      {n === 4 ? <><line x1="4" x2="40" y1="20" y2="20" strokeWidth="1.2" /><line x1="4" x2="40" y1="22" y2="22" strokeWidth="1.2" /></> : <line x1="4" x2="40" y1="21" y2="21" strokeDasharray="2 1.5" />}
      {tabular ? (
        <g>
          <line x1="4" x2="40" y1="29" y2="29" />
          {[0, 1, 2].map((i) => <g key={i}><rect x="5" y={32 + i * 7} width="15" height="2.2" fill="currentColor" stroke="none" opacity=".45" /><rect x="24" y={32 + i * 7} width="4" height="2.2" fill="currentColor" stroke="none" opacity=".45" /><rect x="31" y={32 + i * 7} width="8" height="2.2" fill="currentColor" stroke="none" opacity=".45" /></g>)}
          {n === 2 ? <rect x="22" y="56" width="18" height="3" fill="currentColor" stroke="none" opacity=".3" /> : null}
        </g>
      ) : (
        lines.map((i) => <g key={i}><rect x="5" y={25 + i * 10} width="24" height="2.2" fill="currentColor" stroke="none" opacity=".5" /><rect x="9" y={29.5 + i * 10} width="14" height="2" fill="currentColor" stroke="none" opacity=".3" /><rect x="31" y={29.5 + i * 10} width="8" height="2" fill="currentColor" stroke="none" opacity=".4" />{n === 5 ? <rect x="9" y={33 + i * 10} width="20" height="1.6" fill="currentColor" stroke="none" opacity=".2" /> : null}</g>)
      )}
      <line x1="4" x2="40" y1="60" y2="60" strokeDasharray="2 1.5" />
      <rect x="22" y="63" width="18" height="4" fill="currentColor" stroke="none" opacity=".7" />
      <rect x="4" y="71" width="14" height="2" fill="currentColor" stroke="none" opacity=".3" />
      <rect x="4" y="75" width="10" height="2" fill="currentColor" stroke="none" opacity=".3" />
      <rect x="12" y="81" width="20" height="2" fill="currentColor" stroke="none" opacity=".3" />
    </svg>
  );
}

/**
 * The strip of layout thumbnails, with the name under each and the chosen one shaded: four are shown at a time with an arrow to the others, as on the reference screens.
 * The same strip picks the look of the printed invoice and of the counter receipt.
 */
export function LayoutPicker({ kind, options, value, onPick, accent = "#1f3a5f", disabled }: { kind: "invoice" | "receipt"; options: readonly string[]; value: string; onPick: (id: string) => void; accent?: string | null | undefined; disabled?: boolean }) {
  const s = useTranslations("settingsUi");
  const SHOWN = 4;
  const [start, setStart] = useState(() => Math.min(Math.max(options.indexOf(value) - SHOWN + 1, 0), Math.max(options.length - SHOWN, 0)));
  const more = options.length > SHOWN;
  return (
    <div className="flex items-center gap-1">
      {more ? <button type="button" aria-label={s("layout.previous")} disabled={start === 0} onClick={() => setStart(start - 1)} className="grid size-7 shrink-0 place-items-center rounded-full text-lg text-muted hover:bg-surface-2 disabled:opacity-30">‹</button> : null}
      <div role="radiogroup" aria-label={s("pref.theme")} className="flex min-w-0 flex-1 gap-2">
        {options.slice(start, start + SHOWN).map((id) => {
          const chosen = value === id;
          const wide = kind === "invoice" && (id === "landscape1" || id === "landscape2");
          return (
            <button key={id} type="button" role="radio" aria-checked={chosen} disabled={disabled} onClick={() => onPick(id)}
              className={clsx("flex min-w-0 flex-1 flex-col items-center gap-1.5 rounded-lg p-2 text-center text-xs transition-colors focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-60",
                chosen ? "bg-surface-2 font-semibold ring-1 ring-border-strong" : "hover:bg-surface-2")}>
              <span className={clsx("block text-text", kind === "receipt" ? "h-24 w-12" : wide ? "h-[4.5rem] w-24" : "h-24 w-[4.5rem]")}>
                {kind === "invoice" ? <InvoiceThumb id={id} accent={accent ?? "#1f3a5f"} /> : <ReceiptThumb id={id} />}
              </span>
              <span className="leading-tight">{s(`opt.theme.${id}`)}</span>
            </button>
          );
        })}
      </div>
      {more ? <button type="button" aria-label={s("layout.next")} disabled={start + SHOWN >= options.length} onClick={() => setStart(start + 1)} className="grid size-7 shrink-0 place-items-center rounded-full text-lg text-muted hover:bg-surface-2 disabled:opacity-30">›</button> : null}
    </div>
  );
}
