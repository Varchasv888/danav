import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export interface TrailDoc { id: string; number: string; href: string }
export interface TrailStep { key: string; label: string; docs: TrailDoc[]; state: "done" | "current" | "skipped" | "todo" }

/**
 * The strip that shows where a document sits in its chain (sale or purchase): one box per step, every document in a step a
 * link, steps that were left out marked as skipped, one line saying what this document does, the side documents (credit
 * notes, returns) and where the money stands. It only displays what it is given.
 */
export async function FlowTrail({ label, steps, docId, does, sideLabel, sideDocs, money }: {
  label: string; steps: TrailStep[]; docId: string; does: string; sideLabel: string; sideDocs: TrailDoc[]; money: { text: string; paid: boolean } | null;
}) {
  const t = await getTranslations("salesFlow");
  return (
    <section aria-label={label} className="mb-4 rounded-lg border border-border bg-surface">
      <ol className="flex items-stretch overflow-x-auto p-1.5">
        {steps.map(({ key, label: stepLabel, docs, state }, i) => (
          <li key={key} className="flex min-w-0 shrink-0 items-center">
            {i > 0 ? <ChevronRight className="mx-0.5 size-4 shrink-0 text-faint" aria-hidden /> : null}
            <div aria-current={state === "current" ? "step" : undefined}
              className={clsx("min-w-[7.5rem] rounded-md px-3 py-2 text-[0.9286rem] leading-tight", state === "current" ? "bg-primary-soft" : "")}>
              <div className={clsx("text-[0.8571rem]", state === "current" ? "font-semibold text-primary" : "text-muted")}>{stepLabel}</div>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                {docs.length ? docs.slice(0, 2).map((d) => (
                  state === "current" && d.id === docId
                    ? <span key={d.id} className="font-mono font-medium">{d.number}</span>
                    : <Link key={d.id} href={d.href} className="font-mono text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary">{d.number}</Link>
                )) : <span className="text-faint">{state === "skipped" ? t("skipped") : t("notYet")}</span>}
                {docs.length > 2 ? <span className="text-muted">{t("andMore", { count: docs.length - 2 })}</span> : null}
              </div>
            </div>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border px-4 py-2 text-[0.8571rem] text-muted">
        <p className="min-w-0 flex-1">{does}</p>
        {sideDocs.length ? (
          <p>{sideLabel}{" "}{sideDocs.map((c, i) => <span key={c.id}>{i ? ", " : ""}<Link href={c.href} className="font-mono text-primary hover:underline">{c.number}</Link></span>)}</p>
        ) : null}
        {money ? <p className={clsx("font-medium", money.paid ? "text-success" : "text-text")}>{money.text}</p> : null}
      </div>
    </section>
  );
}
