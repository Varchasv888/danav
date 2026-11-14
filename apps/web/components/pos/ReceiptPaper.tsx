"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export type Paper = "58" | "68" | "88" | "custom" | "a4";
const KEY = "varchasv.receipt.paper";
export const PAPERS: Paper[] = ["58", "68", "88", "a4"];

/**
 * Which paper the receipt prints on: 80 mm roll, 58 mm roll or A4. The choice is remembered on this machine, so the counter's printer
 * is set once and every later receipt opens for it. It is a no-print control.
 */
export function ReceiptPaper({ current, labels }: { current: Paper; labels: Partial<Record<Paper, string>> }) {
  const path = usePathname();
  const router = useRouter();
  const has = useSearchParams().has("w");
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY) as Paper | null;
      if (!has && saved && PAPERS.includes(saved) && saved !== current) router.replace(`${path}?w=${saved}`);
    } catch { /* storage unavailable */ }
  }, [has, current, path, router]);
  return (
    <div className="flex items-center gap-1" role="group">
      {PAPERS.map((p) => (
        <Link key={p} href={`${path}?w=${p}`} replace onClick={() => { try { localStorage.setItem(KEY, p); } catch { /* storage unavailable */ } }}
          aria-current={p === current ? "true" : undefined}
          className={clsx("rounded-md border px-2.5 py-1 text-xs font-medium", p === current ? "border-black bg-black text-white" : "border-gray-400 text-black hover:bg-gray-100")}>{labels[p] ?? p}</Link>
      ))}
    </div>
  );
}
