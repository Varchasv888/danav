"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type Mode = "system" | "light" | "dark";

export function ThemeSwitch({ variant = "plain" }: { variant?: "plain" | "rail" }) {
  const t = useTranslations("common");
  const [mode, setMode] = useState<Mode>("system");

  useEffect(() => {
    const saved = document.documentElement.dataset.theme;
    if (saved === "light" || saved === "dark") setMode(saved);
  }, []);

  function apply(next: Mode) {
    setMode(next);
    const root = document.documentElement;
    if (next === "system") delete root.dataset.theme;
    else root.dataset.theme = next;
    // Read by the root layout on the server (see app/layout.tsx).
    document.cookie = next === "system" ? "vtheme=; path=/; max-age=0" : `vtheme=${next}; path=/; max-age=31536000; samesite=lax`;
  }

  const options: { mode: Mode; icon: typeof Sun; label: string }[] = [
    { mode: "light", icon: Sun, label: t("light") },
    { mode: "dark", icon: Moon, label: t("dark") },
    { mode: "system", icon: Monitor, label: t("system") },
  ];

  return (
    <div role="radiogroup" aria-label={t("theme")} className={`inline-flex rounded-lg border p-0.5 ${variant === "rail" ? "border-white/10" : "border-border"}`}>
      {options.map((o) => (
        <button
          key={o.mode}
          role="radio"
          aria-checked={mode === o.mode}
          title={o.label}
          onClick={() => apply(o.mode)}
          className={`grid size-7 place-items-center rounded-md ${mode === o.mode ? "bg-primary-soft text-primary" : variant === "rail" ? "text-rail-muted hover:text-rail-text" : "text-muted hover:text-text"}`}
        >
          <o.icon className="size-4" aria-hidden />
          <span className="sr-only">{o.label}</span>
        </button>
      ))}
    </div>
  );
}
