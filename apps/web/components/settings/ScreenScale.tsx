"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button, Card } from "../ui";

export const SCALES = [70, 80, 90, 100, 110, 115, 120, 130] as const;
const KEY = "varchasv.scale";

const read = () => {
  try { const v = Number(window.localStorage.getItem(KEY)); return (SCALES as readonly number[]).includes(v) ? v : 100; } catch { return 100; }
};
const apply = (n: number) => { document.documentElement.style.zoom = n === 100 ? "" : String(n / 100); };

/** Puts the screen size this device chose back on every page (kept on the device, not the business). */
export function ScreenScaleApplier() {
  useEffect(() => { apply(read()); }, []);
  return null;
}

/** A slider to make the whole screen larger or smaller on this device, with the same steps people expect from a browser zoom. */
export function ScreenScale() {
  const t = useTranslations("settingsUi");
  const [value, setValue] = useState(100);
  const [saved, setSaved] = useState(100);
  useEffect(() => { const v = read(); setValue(v); setSaved(v); }, []);
  const idx = Math.max(0, SCALES.indexOf(value as (typeof SCALES)[number]));

  return (
    <Card className="mb-4 flex flex-col gap-3 p-4">
      <h2 className="text-[1rem] font-semibold">{t("scale.title")}</h2>
      <p className="text-sm text-muted">{t("scale.hint")}</p>
      <div className="flex flex-wrap items-center gap-4">
        <div className="w-full max-w-md">
          <input type="range" min={0} max={SCALES.length - 1} step={1} value={idx} aria-label={t("scale.title")} aria-valuetext={`${value}%`}
            onChange={(e) => setValue(SCALES[Number(e.target.value)]!)} className="w-full accent-[var(--color-primary)]" />
          <div className="mt-1 flex justify-between text-[0.7rem] text-muted">{SCALES.map((s) => <span key={s} className={s === value ? "font-semibold text-text" : ""}>{s}%</span>)}</div>
        </div>
        <Button variant="outline" disabled={value === saved} onClick={() => { try { window.localStorage.setItem(KEY, String(value)); } catch { /* the choice still applies until the page is closed */ } apply(value); setSaved(value); }}>{t("scale.apply")}</Button>
      </div>
    </Card>
  );
}
