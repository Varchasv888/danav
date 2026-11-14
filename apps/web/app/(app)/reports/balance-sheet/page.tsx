import { BarChart3 } from "lucide-react";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { DateFilter } from "@/components/DateFilter";
import { Card, PageHeader } from "@/components/ui";
import { localName, rupees, todayIso } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

interface Line { accountId: string; name: string; nameHi: string | null; groupName: string; groupNameHi: string | null; amount: string }
interface BS { assets: Line[]; liabilities: Line[]; profitAndLoss: string; closingStock: string; totalAssets: string; totalLiabilities: string; difference: string }

export async function generateMetadata() {
  return { title: (await getTranslations("nav"))("balanceSheet") };
}

const lastYear = (iso: string) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCFullYear(d.getUTCFullYear() - 1);
  return d.toISOString().slice(0, 10);
};

export default async function BalanceSheetPage({ searchParams }: { searchParams: Promise<{ asOf?: string; compare?: string }> }) {
  const sp = await searchParams;
  const asOf = sp.asOf ?? todayIso();
  const compare = sp.compare === "1";
  const t = await getTranslations();
  const locale = await getLocale();
  const [bs, before] = await Promise.all([serverApi<BS>(`/reports/balance-sheet?asOf=${asOf}`), compare ? serverApi<BS>(`/reports/balance-sheet?asOf=${lastYear(asOf)}`) : Promise.resolve(null)]);
  const was = new Map([...(before?.assets ?? []), ...(before?.liabilities ?? [])].map((l) => [l.accountId, Number(l.amount)]));
  const wasGroup = new Map<string, number>();
  for (const l of [...(before?.assets ?? []), ...(before?.liabilities ?? [])]) wasGroup.set(l.groupName, (wasGroup.get(l.groupName) ?? 0) + Number(l.amount));
  const prev = (v: number | undefined) => (compare ? <td className="num px-5 py-1.5 text-right text-xs text-muted">{v === undefined ? "-" : rupees(v.toFixed(2))}</td> : null);

  const grouped = (lines: Line[]) => {
    const m = new Map<string, { nameHi: string | null; lines: Line[]; total: number }>();
    for (const l of lines) {
      const g = m.get(l.groupName) ?? { nameHi: l.groupNameHi, lines: [], total: 0 };
      g.lines.push(l);
      g.total += Number(l.amount);
      m.set(l.groupName, g);
    }
    return [...m.entries()];
  };

  const side = (title: string, lines: Line[], total: string, extra?: React.ReactNode) => (
    <Card className="p-0">
      <h2 className="border-b border-border px-5 py-3 font-semibold">{title}</h2>
      <table className="w-full text-sm">
        <tbody>
          {grouped(lines).map(([group, g]) => [
            <tr key={group} className="bg-surface-2/60">
              <td className="px-5 py-2 font-medium">{localName({ name: group, nameHi: g.nameHi }, locale)}</td>
              <td className="num px-5 py-2 text-right font-medium">{rupees(g.total.toFixed(2))}</td>
              {prev(wasGroup.get(group))}
            </tr>,
            ...g.lines.map((l) => (
              <tr key={l.accountId} className="border-b border-border text-muted">
                <td className="py-1.5 pr-5 pl-9">{localName(l, locale)}</td>
                <td className="num px-5 py-1.5 text-right">{rupees(l.amount)}</td>
                {prev(was.get(l.accountId))}
              </tr>
            )),
          ])}
          {extra}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-border font-semibold">
            <td className="px-5 py-3">{t("common.total")}</td>
            <td className="num px-5 py-3 text-right">{rupees(total)}</td>
          </tr>
        </tfoot>
      </table>
    </Card>
  );

  return (
    <>
      <PageHeader icon={BarChart3} print title={t("nav.balanceSheet")} actions={<div className="flex flex-wrap items-center gap-2"><DateFilter asOf={asOf} extra={compare ? { compare: "1" } : undefined} /><Link href={`/reports/balance-sheet?asOf=${asOf}${compare ? "" : "&compare=1"}`} className={`inline-flex h-9 items-center rounded-lg border px-3.5 text-sm font-medium ${compare ? "border-primary bg-primary-soft text-primary" : "border-border hover:bg-surface-2"}`}>{t("ownerReports.compareLastYear")}</Link></div>} />
      <div className="grid gap-6 xl:grid-cols-2">
        {side(t("reports.liabilities"), bs.liabilities, bs.totalLiabilities, (
          <tr className="bg-surface-2/60">
            <td className="px-5 py-2 font-medium">{t("reports.profitAndLoss")}</td>
            <td className={`num px-5 py-2 text-right font-medium ${Number(bs.profitAndLoss) < 0 ? "text-danger" : ""}`}>{Number(bs.profitAndLoss) < 0 ? "−" : ""}{rupees(String(Math.abs(Number(bs.profitAndLoss))))}</td>
          </tr>
        ))}
        {side(t("reports.assets"), bs.assets, bs.totalAssets, Number(bs.closingStock) ? (
          <tr className="bg-surface-2/60">
            <td className="px-5 py-2 font-medium"><Link href="/inventory/stock" className="hover:text-primary hover:underline">{t("reports.closingStock")}</Link></td>
            <td className="num px-5 py-2 text-right font-medium">{rupees(bs.closingStock)}</td>
          </tr>
        ) : undefined)}
      </div>
      {Number(bs.difference) ? <p className="mt-4 text-sm text-danger">{t("reports.openingDifference")}: {rupees(bs.difference)}</p> : null}
    </>
  );
}
