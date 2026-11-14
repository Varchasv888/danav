import { CheckCircle2, ScanSearch, TriangleAlert } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Badge, Card, PageHeader } from "@/components/ui";
import { rupees } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

interface Item { ref: string; detail: string; amount?: string }
interface Check { key: string; severity: "error" | "warn"; ok: boolean; difference: string | null; count: number; items: Item[] }
interface Result { asOf: string; ok: boolean; checks: Check[] }

export async function generateMetadata() {
  return { title: (await getTranslations("integrity"))("title") };
}

/** Do the books agree with themselves? Each check, whether it passes, and the records behind a difference. */
export default async function IntegrityPage() {
  const t = await getTranslations("integrity");
  const r = await serverApi<Result>("/reports/integrity");
  const open = r.checks.filter((c) => !c.ok);
  const money = (c: Check) => c.key !== "vouchersBalance" && !["invoicesMatchLedger", "billsMatchLedger", "documentsPosted", "cancelledReversed", "negativeStock"].includes(c.key);
  const checkText = (key: string, part: "title" | "help") => {
    const path = `${key}.${part}`;
    return t(t.has(path) ? path : `checks.${path}`);
  };
  return (
    <>
      <PageHeader icon={ScanSearch} title={t("title")} subtitle={t("subtitle")} print />
      <div role="status" className={open.length ? "mb-4 flex items-center gap-2 rounded-md border border-accent/30 bg-accent-soft px-3 py-2 text-[0.9286rem] font-semibold text-accent" : "mb-4 flex items-center gap-2 rounded-md border border-success/30 bg-success-soft px-3 py-2 text-[0.9286rem] font-semibold text-success"}>
        {open.length ? <TriangleAlert className="size-4" aria-hidden /> : <CheckCircle2 className="size-4" aria-hidden />}
        {open.length ? t("problems", { n: open.length }) : t("allGood")}
      </div>
      <div className="flex flex-col gap-3">
        {r.checks.map((c) => (
          <Card key={c.key} className="p-0">
            <div className="flex flex-wrap items-start gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold">{checkText(c.key, "title")}</h2>
                <p className="mt-0.5 max-w-[80ch] text-[0.9286rem] text-muted">{checkText(c.key, "help")}</p>
              </div>
              {c.ok ? <Badge tone="success">{t("pass")}</Badge> : <Badge tone={c.severity === "warn" ? "warning" : "danger"}>{c.severity === "warn" ? t("warn") : t("fail")}{c.difference ? `: ${money(c) && c.difference.includes(".") ? rupees(c.difference) : c.difference}` : ""}</Badge>}
            </div>
            {c.items.length ? (
              <div className="overflow-x-auto border-t border-border">
                <table className="w-full text-[0.9286rem]">
                  <thead><tr className="bg-surface-2 text-left text-xs font-semibold text-muted"><th className="px-4 py-1.5">{t("records")}</th><th className="px-4 py-1.5" /><th className="px-4 py-1.5 text-right" /></tr></thead>
                  <tbody>
                    {c.items.map((i, n) => (
                      <tr key={`${i.ref}-${n}`} className="border-t border-rule"><td className="px-4 py-1.5 font-medium">{i.ref}</td><td className="px-4 py-1.5 text-muted">{i.detail}</td><td className="num px-4 py-1.5 text-right">{i.amount && i.amount.includes(".") ? rupees(i.amount) : i.amount}</td></tr>
                    ))}
                  </tbody>
                </table>
                {c.count > c.items.length ? <p className="px-4 py-1.5 text-xs text-muted">{t("firstTwenty")}</p> : null}
              </div>
            ) : null}
          </Card>
        ))}
      </div>
    </>
  );
}
