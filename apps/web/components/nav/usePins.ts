"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/client-api";
import { DEFAULT_MENU } from "../launcher/actions";

/**
 * The screens this person pinned to Home ("My Menu"), shared with the Launcher and My Menu pages through /me/menu.
 * Loaded the first time the menu panel opens; a person with no saved list starts from the default set.
 */
export function usePins(enabled: boolean) {
  const [pins, setPins] = useState<string[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!enabled || pins !== null) return;
    let live = true;
    api<{ items: string[] | null }>("/me/menu").then((r) => { if (live) setPins(r.items ?? [...DEFAULT_MENU]); }).catch(() => { if (live) setPins([...DEFAULT_MENU]); });
    return () => { live = false; };
  }, [enabled, pins]);

  const isPinned = useCallback((href: string) => !!pins?.includes(href), [pins]);
  const toggle = useCallback(async (href: string) => {
    const before = pins ?? [...DEFAULT_MENU];
    const next = before.includes(href) ? before.filter((h) => h !== href) : [...before, href];
    setPins(next);
    setFailed(false);
    try { await api("/me/menu", { method: "PUT", body: { items: next } }); } catch { setPins(before); setFailed(true); }
  }, [pins]);

  return { isPinned, toggle, failed, ready: pins !== null };
}
