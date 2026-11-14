import clsx from "clsx";
import { getTranslations } from "next-intl/server";
import { rupees } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

interface Match {
  status: "matched" | "open" | "exception"; rateCost: string;
  lines: { lineId: string; item: string; ordered: string; received: string; billed: string; orderRate: string; billedRate: string | null; short: string; damaged: string; hold: string; status: "matched" | "open" | "exception"; flags: string[]; rateDifference: string; excessBilled: string }[];
}
const q = (v: string) => Number(v).toLocaleString("en-IN", { maximumFractionDigits: 3 });

/** Ordered, received and billed side by side for one purchase order, with a plain line on each thing to look at. A failure here never stops the order opening. */
export async function OrderMatch({ orderId }: { orderId: string }) {
  let m: Match;
  try { m = await serverApi<Match>(`/purchase/match?orderId=${orderId}`); } catch (e) {
    if (typeof (e as { digest?: unknown })?.digest === "string" && (e as { digest: string }).digest.startsWith("NEXT_")) throw e;
    return null;
  }
  const t = await getTranslations("purchaseMatch");
  const tone = { matched: "bg-success-soft text-success", open: "bg-surface-2 text-muted", exception: "bg-danger-soft text-danger" } as const;
  return (
    <section aria-label={t("title")} className="mt-4 overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
        <h2 className="font-semibold">{t("title")}</h2>
        <span className={clsx("rounded px-2 py-0.5 text-xs font-medium", tone[m.status])}>{t(`status.${m.status}`)}</span>
        {Number(m.rateCost) !== 0 ? <span className="text-sm text-danger">{t("rateCost", { amount: rupees(m.rateCost) })}</span> : null}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="text-left text-muted">
            <tr className="border-b border-border">
              <th className="px-4 py-2 font-medium">{t("item")}</th>
              <th className="px-3 py-2 text-right font-medium">{t("ordered")}</th>
              <th className="px-3 py-2 text-right font-medium">{t("received")}</th>
              <th className="px-3 py-2 text-right font-medium">{t("billed")}</th>
              <th className="px-3 py-2 text-right font-medium">{t("orderRate")}</th>
              <th className="px-3 py-2 text-right font-medium">{t("billedRate")}</th>
              <th className="px-4 py-2 font-medium">{t("look")}</th>
            </tr>
          </thead>
          <tbody>
            {m.lines.map((l) => (
              <tr key={l.lineId} className="border-b border-border last:border-0">
                <td className="px-4 py-2 font-medium">{l.item}</td>
                <td className="num px-3 py-2 text-right">{q(l.ordered)}</td>
                <td className="num px-3 py-2 text-right">{q(l.received)}</td>
                <td className="num px-3 py-2 text-right">{q(l.billed)}</td>
                <td className="num px-3 py-2 text-right">{rupees(l.orderRate)}</td>
                <td className={clsx("num px-3 py-2 text-right", l.flags.includes("rate_differs") && "text-danger")}>{l.billedRate === null ? "-" : rupees(l.billedRate)}</td>
                <td className="px-4 py-2 text-xs">
                  {l.flags.length ? (
                    <ul className="flex flex-col gap-0.5">
                      {l.flags.map((f) => (
                        <li key={f} className={clsx(["received_not_billed", "not_yet_received"].includes(f) ? "text-muted" : "text-danger")}>
                          {t(`flags.${f}`, { short: q(l.short), damaged: q(l.damaged), hold: q(l.hold), excess: q(l.excessBilled), diff: rupees(l.rateDifference) })}
                        </li>
                      ))}
                    </ul>
                  ) : <span className="text-success">{t("flags.ok")}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
