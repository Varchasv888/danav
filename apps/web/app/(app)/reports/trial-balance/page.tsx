import { Scale } from "lucide-react";
import Link from "next/link";
import { dec } from "@varchasv/domain";
import { getLocale, getTranslations } from "next-intl/server";
import { DateFilter } from "@/components/DateFilter";
import { Card, PageHeader } from "@/components/ui";
import { fyStart, localName, rupees, todayIso } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

interface TB {
  rows: { accountId: string; name: string; nameHi: string | null; groupName: string; groupNameHi: string | null; dr: string; cr: string }[];
  openingStock: string; totalDebit: string; totalCredit: string; openingDifference: string;
}

export async function generateMetadata() {
  return { title: (await getTranslations("nav"))("trialBalance") };
}

const lastYear = (iso: string) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCFullYear(d.getUTCFullYear() - 1);
  return d.toISOString().slice(0, 10);
};

export default async function TrialBalancePage({ searchParams }: { searchParams: Promise<{ asOf?: string; compare?: string }> }) {
  const sp = await searchParams;
  const asOf = sp.asOf ?? todayIso();
  const compare = sp.compare === "1";
  const t = await getTranslations();
  const locale = await getLocale();
  const [tb, before] = await Promise.all([serverApi<TB>(`/reports/trial-balance?asOf=${asOf}`), compare ? serverApi<TB>(`/reports/trial-balance?asOf=${lastYear(asOf)}`) : Promise.resolve(null)]);
  // One signed figure per account for the comparison: debit balance positive, credit balance negative.
  const net = (r: { dr: string; cr: string } | undefined) => (r ? dec(r.dr).minus(r.cr) : dec(0));
  const prior = new Map((before?.rows ?? []).map((r) => [r.accountId, net(r)]));
  const side = (v: ReturnType<typeof dec>) => (v.isZero() ? "" : `${rupees(v.abs().toFixed(2))} ${v.isPositive() ? t("reports.dr") : t("reports.cr")}`);
  const change = (now: ReturnType<typeof dec>, was: ReturnType<typeof dec> | undefined) => {
    if (!was || was.isZero()) return <span className="text-muted">-</span>;
    const c = now.minus(was).div(was.abs()).times(100).toNumber();
    return <span className={c >= 0 ? "text-success" : "text-danger"}>{c >= 0 ? "▲" : "▼"} {Math.abs(c).toFixed(1)}%</span>;
  };

  // Grouped by account group, as accountants read it.
  const groups = new Map<string, TB["rows"]>();
  for (const r of tb.rows) groups.set(r.groupName, [...(groups.get(r.groupName) ?? []), r]);
  const money = (v: string) => (Number(v) ? rupees(v) : "");
  // The opening difference sits on the short side, so both totals agree (as in Tally).
  const diff = dec(tb.openingDifference);
  const shownDebit = diff.isNegative() ? dec(tb.totalDebit).minus(diff) : dec(tb.totalDebit);
  const shownCredit = diff.isPositive() && !diff.isZero() ? dec(tb.totalCredit).plus(diff) : dec(tb.totalCredit);

  return (
    <>
      <PageHeader icon={Scale} print title={t("nav.trialBalance")} actions={<div className="flex flex-wrap items-center gap-2"><DateFilter asOf={asOf} extra={compare ? { compare: "1" } : undefined} /><Link href={`/reports/trial-balance?asOf=${asOf}${compare ? "" : "&compare=1"}`} className={`inline-flex h-9 items-center rounded-lg border px-3.5 text-sm font-medium ${compare ? "border-primary bg-primary-soft text-primary" : "border-border hover:bg-surface-2"}`}>{t("ownerReports.compareLastYear")}</Link></div>} />
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">{t("reports.particulars")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("common.debit")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("common.credit")}</th>
                {compare ? <><th className="px-5 py-3 text-right font-medium">{t("reports.lastYear")}</th><th className="px-5 py-3 text-right font-medium">{t("reports.change")}</th></> : null}
              </tr>
            </thead>
            {Number(tb.openingStock) ? (
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-5 py-2"><Link href="/inventory/stock" className="font-medium hover:text-primary hover:underline">{t("reports.openingStock")}</Link></td>
                  <td className="num px-5 py-2 text-right">{rupees(tb.openingStock)}</td>
                  <td />
                </tr>
              </tbody>
            ) : null}
            {[...groups.entries()].map(([group, rows]) => (
              <tbody key={group}>
                <tr className="bg-surface-2/60"><td colSpan={compare ? 5 : 3} className="px-5 py-2 text-xs font-semibold tracking-wide text-muted uppercase">{localName({ name: group, nameHi: rows[0]!.groupNameHi }, locale)}</td></tr>
                {rows.map((r) => (
                  <tr key={r.accountId} className="border-b border-border">
                    <td className="px-5 py-2"><Link href={`/reports/ledger/${r.accountId}?from=${fyStart(asOf)}&to=${asOf}`} className="hover:text-primary hover:underline">{localName(r, locale)}</Link></td>
                    <td className="num px-5 py-2 text-right">{money(r.dr)}</td>
                    <td className="num px-5 py-2 text-right">{money(r.cr)}</td>
                    {compare ? <><td className="num px-5 py-2 text-right text-muted">{side(prior.get(r.accountId) ?? dec(0))}</td><td className="num px-5 py-2 text-right text-xs">{change(net(r), prior.get(r.accountId))}</td></> : null}
                  </tr>
                ))}
              </tbody>
            ))}
            <tfoot>
              {Number(tb.openingDifference) ? (
                <tr className="text-danger">
                  <td className="px-5 py-2">{t("reports.openingDifference")}</td>
                  <td className="num px-5 py-2 text-right">{Number(tb.openingDifference) < 0 ? rupees(String(-Number(tb.openingDifference))) : ""}</td>
                  <td className="num px-5 py-2 text-right">{Number(tb.openingDifference) > 0 ? rupees(tb.openingDifference) : ""}</td>
                </tr>
              ) : null}
              <tr className="border-t-2 border-border font-semibold">
                <td className="px-5 py-3">{t("common.total")}</td>
                <td className="num px-5 py-3 text-right">{rupees(shownDebit.toFixed(2))}</td>
                <td className="num px-5 py-3 text-right">{rupees(shownCredit.toFixed(2))}</td>
              </tr>
            </tfoot>
          </table>
          {!tb.rows.length ? <p className="px-5 py-10 text-center text-muted">{t("reports.noData")}</p> : null}
        </div>
      </Card>
    </>
  );
}
