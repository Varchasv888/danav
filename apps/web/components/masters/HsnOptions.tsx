"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/client-api";

/** Suggestions for an HSN or SAC box from the business's own list: put `list={id}` on the input. Any code can still be typed. */
export function HsnOptions({ id }: { id: string }) {
  const [codes, setCodes] = useState<{ code: string; description: string }[]>([]);
  useEffect(() => {
    let live = true;
    api<{ code: string; description: string }[]>("/hsn").then((rows) => { if (live) setCodes(rows); }).catch(() => { /* no rights or offline: plain box */ });
    return () => { live = false; };
  }, []);
  return <datalist id={id}>{codes.map((c) => <option key={c.code} value={c.code}>{c.description}</option>)}</datalist>;
}
