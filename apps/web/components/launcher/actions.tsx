"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { CREATE, SECTIONS } from "@/lib/nav";

export interface Action {
  href: string;
  label: string;
  group: string;
  groupKey: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Function key bound to it everywhere (F4 to F9). */
  shortcut?: string | undefined;
}

/** Launcher groups in the order a shop works, each with its own colour (G-Retail's transaction menu). */
export const GROUPS = ["entries", "workspace", "salesPos", "promotions", "crm", "purchase", "inventory", "manufacturing", "finance", "reports", "hr", "operations", "masters", "settings"] as const;

/** One colour per section, carried by its tiles everywhere (launcher, My Menu, hubs). */
export const TONES: Record<string, string> = {
  entries: "bg-[#2878d0]",
  workspace: "bg-[#3b5b8c]",
  salesPos: "bg-[#e0525c]",
  promotions: "bg-[#c2410c]",
  crm: "bg-[#16a34a]",
  purchase: "bg-[#0284c7]",
  inventory: "bg-[#d97706]",
  manufacturing: "bg-[#78716c]",
  finance: "bg-[#1d4ed8]",
  reports: "bg-[#9333ea]",
  hr: "bg-[#db2777]",
  operations: "bg-[#0d9488]",
  masters: "bg-[#475569]",
  settings: "bg-[#64748b]",
};

/** A new user's My Menu: what a textile shop does every day, kept to what their role allows. */
export const DEFAULT_MENU = [
  "/pos/billing", "/sales/invoices/new", "/accounts/vouchers/new?type=receipt", "/purchase/receipts/new", "/purchase/bills/new", "/inventory/labels",
  "/inventory/catalogue", "/inventory/counts", "/inventory/stock", "/reports/receivables", "/reports/sales-register", "/insights",
];

/** Every screen and entry the user may open, grouped for the launcher. */
export function useActions(permissions: string[]): Action[] {
  const t = useTranslations();
  return useMemo(() => {
    const allowed = (p?: string) => !p || permissions.includes(p);
    const out: Action[] = CREATE.filter((c) => allowed(c.permission)).map((c) => ({
      href: c.href, label: c.label(t), group: t("launcher.groups.entries"), groupKey: "entries", icon: c.icon, shortcut: c.key,
    }));
    for (const s of SECTIONS) {
      const key = s.title;
      for (const i of s.items) {
        if (!allowed(i.permission) || i.phase || i.href === "/launcher") continue;
        out.push({ href: i.href, label: t(`nav.${i.key}`), group: t(`nav.${key}`), groupKey: key, icon: i.icon });
      }
    }
    return out.sort((a, b) => GROUPS.indexOf(a.groupKey as never) - GROUPS.indexOf(b.groupKey as never));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissions, t]);
}

/** The big square icon of a tile, in its group's colour. */
export function TileIcon({ action, size = "lg" }: { action: Action; size?: "sm" | "lg" }) {
  const box = size === "lg" ? "size-11 rounded-lg" : "size-9 rounded-md";
  const glyph = size === "lg" ? "size-[1.4rem]" : "size-5";
  return (
    <span className={`inline-flex shrink-0 items-center justify-center text-white ${TONES[action.groupKey] ?? TONES.workspace} ${box}`}>
      <action.icon className={glyph} aria-hidden />
    </span>
  );
}
