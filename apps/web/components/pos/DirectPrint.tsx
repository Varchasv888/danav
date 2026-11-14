"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "@/lib/client-api";

/**
 * Sends a receipt straight to the receipt printer through the print agent running on this computer: the app asks the server for the receipt as printer commands (cut and
 * cash drawer included if chosen in Settings) and hands them to the agent. A no-print control.
 */
export function DirectPrint({ path, className, label }: { path: string; className?: string; label?: string }) {
  const t = useTranslations("print");
  const [state, setState] = useState<{ kind: "idle" | "busy" | "ok" | "error"; text?: string }>({ kind: "idle" });
  async function go() {
    setState({ kind: "busy" });
    try {
      const j = await api<{ base64: string; agentUrl: string; target: string }>(path);
      let res: Response;
      try { res = await fetch(`${j.agentUrl.replace(/\/$/, "")}/print`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ target: j.target, data: j.base64 }) }); }
      catch { setState({ kind: "error", text: t("agentDown") }); return; }
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setState(res.ok ? { kind: "ok", text: t("sent") } : { kind: "error", text: body.error ?? t("agentDown") });
    } catch { setState({ kind: "error", text: t("agentDown") }); }
  }
  return (
    <span className={className}>
      <button type="button" onClick={() => void go()} disabled={state.kind === "busy"} className="rounded-md border border-black bg-black px-2.5 py-1 text-xs font-medium text-white disabled:opacity-60">{label ?? t("direct")}</button>
      {state.text ? <span role="status" className={`ml-2 text-xs ${state.kind === "error" ? "text-red-700" : "text-green-700"}`}>{state.text}</span> : null}
    </span>
  );
}
