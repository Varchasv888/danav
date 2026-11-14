"use client";

import type { LookupKind } from "@varchasv/domain";
import { useEffect, useState } from "react";
import { api } from "@/lib/client-api";

/**
 * Suggestions from a small master for a free-text field: put `list={id}` on the input. Typing still
 * accepts anything, so documents made before the list existed keep working.
 */
export function LookupOptions({ id, kind }: { id: string; kind: LookupKind }) {
  const [names, setNames] = useState<string[]>([]);
  useEffect(() => {
    let live = true;
    api<{ name: string }[]>(`/lookups/${kind}`).then((rows) => { if (live) setNames(rows.map((r) => r.name)); }).catch(() => { /* no rights or offline: plain text field */ });
    return () => { live = false; };
  }, [kind]);
  return <datalist id={id}>{names.map((n) => <option key={n} value={n} />)}</datalist>;
}
