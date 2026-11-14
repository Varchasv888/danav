import { Waves } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { DateFilter } from "@/components/DateFilter";
import { Card, PageHeader } from "@/components/ui";
import { fyStart, rupees, todayIso } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

interface Line { name: string; amount: string }
interface Section { lines: Line[]; total: string }
interface Flow { from: string; to: string; openingCash: string; closingCash: string; change: string; operating: Section; investing: Section; financing: Section; net: string; difference: string }

export async function generateMetadata() {
  return { title: (await getTranslations("cashflow"))("title") };
}

/** Where the cash came from and went: operating, investing and financing, adding up to the change in cash and bank. */
export default async function CashFlowPage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  const sp = await searchParams;
  const to = sp.to ?? todayIso();
  const from = sp.from ?? fyStart(to);
  const t = await getTranslations("cashflow");
  const f = await serverApi<Flow>(`/reports/cash-flow-statement?from=${from}&to=${to}`);
  const part = (key: "operating" | "investing" | "financing", s: Section) => (
    <Card className="p-0">
      <h2 className="border-b border-border px-5 py-3 text-sm font-semibold">{t(key)}</h2>
      <table className="w-full text-sm">
        <tbody>
          {s.lines.length ? s.lines.map((l, i) => (
            <tr key={i} className="border-b border-rule last:border-0"><td className="px-5 py-2">{l.name}</td><td className="num px-5 py-2 text-right">{rupees(l.amount)}</td></tr>
          )) : <tr><td className="px-5 py-3 text-muted">{t("none")}</td><td /></tr>}
          <tr className="border-t border-border bg-surface-2/60 font-semibold"><td className="px-5 py-2">{t("totalOf", { part: t(key) })}</td><td className="num px-5 py-2 text-right">{rupees(s.total)}</td></tr>
        </tbody>
      </table>
    </Card>
  );
  return (
    <>
      <PageHeader icon={Waves} title={t("title")} subtitle={t("subtitle")} actions={<DateFilter from={from} to={to} />} print />
      <div className="flex max-w-3xl flex-col gap-4">
        {part("operating", f.operating)}
        {part("investing", f.investing)}
        {part("financing", f.financing)}
        <Card className="p-0">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-rule"><td className="px-5 py-2">{t("net")}</td><td className="num px-5 py-2 text-right font-semibold">{rupees(f.net)}</td></tr>
              <tr className="border-b border-rule"><td className="px-5 py-2">{t("opening")}</td><td className="num px-5 py-2 text-right">{rupees(f.openingCash)}</td></tr>
              <tr className="border-b border-rule"><td className="px-5 py-2">{t("closing")}</td><td className="num px-5 py-2 text-right font-semibold">{rupees(f.closingCash)}</td></tr>
              {Number(f.difference) !== 0 ? <tr><td className="px-5 py-2 text-warning">{t("difference")}</td><td className="num px-5 py-2 text-right text-warning">{rupees(f.difference)}</td></tr> : null}
            </tbody>
          </table>
        </Card>
        <p className="text-xs text-muted">{t("note")}</p>
      </div>
    </>
  );
}
