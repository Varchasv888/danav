"use client";

import clsx from "clsx";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { moduleTitle, railTitle, type ModTab } from "@/lib/modules-nav";

/**
 * The slim dark rail: one icon and one label per section. A click opens that section's panel (Home goes straight to the
 * dashboard). Once a panel is open, resting a mouse on another section switches to it, as an extra; the click always works.
 */
export function ModuleRail({ tabs, openKey, currentKey, onPress, onHover, registerButton }: {
  tabs: ModTab[]; openKey: string | null; currentKey: string; onPress: (key: string) => void; onHover: (key: string) => void;
  registerButton: (key: string, el: HTMLButtonElement | null) => void;
}) {
  const t = useTranslations();
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <nav aria-label={t("navmenu.rail")} className="scrollbar-none flex h-full min-h-0 flex-col gap-1 overflow-y-auto bg-rail px-1.5 py-3 text-rail-text">
      {tabs.map((tab) => {
        const isOpen = openKey === tab.key;
        const isCurrent = openKey === null && currentKey === tab.key;
        return (
          <button key={tab.key} ref={(el) => registerButton(tab.key, el)} type="button" onClick={() => onPress(tab.key)}
            onPointerEnter={(e) => { if (e.pointerType !== "mouse" || openKey === null || tab.key === "workspace") return; window.clearTimeout(timer.current); timer.current = window.setTimeout(() => onHover(tab.key), 120); }}
            onPointerLeave={() => window.clearTimeout(timer.current)}
            aria-expanded={tab.key === "workspace" ? undefined : isOpen} aria-haspopup={tab.key === "workspace" ? undefined : "dialog"} aria-current={isCurrent ? "page" : undefined}
            style={{ "--tone": `var(--modr-${tab.key})` } as React.CSSProperties}
            className={clsx("flex min-h-14 w-full shrink-0 flex-col items-center justify-center gap-1 rounded-lg px-1 py-1.5 text-[0.7857rem] font-medium leading-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white",
              isOpen || isCurrent ? "bg-rail-active text-rail-text" : "text-rail-muted hover:bg-rail-hover hover:text-rail-text")}>
            <tab.icon className={clsx("size-5 transition-colors", isOpen || isCurrent ? "text-[var(--tone)]" : "")} strokeWidth={1.75} aria-hidden />
            <span className="max-w-full truncate" title={moduleTitle(tab.key)}>{railTitle(tab.key)}</span>
          </button>
        );
      })}
    </nav>
  );
}
