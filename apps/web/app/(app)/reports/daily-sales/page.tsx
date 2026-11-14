import { CalendarDays } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button, Card, Field, Input, PageHeader, Select } from "@/components/ui";
import { rupeesIn, todayIso } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

interface Flow { received: string; paid: string; net: string }
interface Result { date: string; topN: number; sales: string; pieces: string; bills: number; averageBill: string; cash: Flow; bank: Flow; ageing: { key: string; qty: string; amount: string }[]; top: { itemId: string; name: string; qty: string; amount: string }[] }
type Props = { searchParams: Promise<{ date?: string; top?: string; unit?: string }> };
const TOPS = [5, 10, 20, 50] as const;

export async function generateMetadata() {
  return { title: (await getTranslations("dailySales"))("title") };
}

/** One day of selling: sales, bills, cash and bank movement, and the top N sellers. */
export default async function DailySalesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const date = sp.date && /^\d{4}-\d{2}-\d{2}$/.test(sp.date) ? sp.date : todayIso();
  const top = TOPS.find((n) => String(n) === sp.top) ?? 10;
  const unit = sp.unit === "lakh" ? "lakh" : "rupees";
  const rupees = (v: string | number) => rupeesIn(v, unit);
  const t = await getTranslations("dailySales");
  const r = await serverApi<Result>(`/reports/daily-sales?date=${date}&top=${top}`);
  const tile = (label: string, value: string, sub?: string) => (
    <div className="rounded-md border border-border bg-surface p-3"><div className="text-xs text-muted">{label}</div><div className="num mt-1 text-[1.4rem] font-semibold">{value}</div>{sub ? <div className="num text-xs text-muted">{sub}</div> : null}</div>
  );
  return (
    <>
      <PageHeader icon={CalendarDays} title={t("title")} subtitle={t("subtitle")} print />
      <form method="get" className="mb-4 flex flex-wrap items-end gap-3 print:hidden">
        <Field label={t("day")} htmlFor="ds-date"><Input id="ds-date" type="date" name="date" defaultValue={date} className="w-44" /></Field>
        <Field label={t("topN")} htmlFor="ds-top"><Select id="ds-top" name="top" defaultValue={String(top)} className="w-28">{TOPS.map((n) => <option key={n} value={n}>{n}</option>)}</Select></Field>
        <Field label={t("unit")} htmlFor="ds-unit"><Select id="ds-unit" name="unit" defaultValue={unit} className="w-32"><option value="rupees">{t("inRupees")}</option><option value="lakh">{t("inLakhs")}</option></Select></Field>
        <Button type="submit" variant="outline">{t("show")}</Button>
      </form>
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tile(t("sales"), rupees(r.sales), t("billsPieces", { bills: r.bills, pieces: r.pieces }))}
        {tile(t("averageBill"), rupees(r.averageBill))}
        {tile(t("cash"), rupees(r.cash.net), t("inOut", { received: rupees(r.cash.received), paid: rupees(r.cash.paid) }))}
        {tile(t("bank"), rupees(r.bank.net), t("inOut", { received: rupees(r.bank.received), paid: rupees(r.bank.paid) }))}
      </div>
      <Card className="p-0">
        <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("best", { n: top })}</h2>
        {r.top.length ? (
          <table className="w-full text-[0.9286rem]">
            <thead className="text-left text-xs text-muted"><tr className="border-b border-rule"><th className="px-4 py-1.5 font-medium">{t("item")}</th><th className="px-4 py-1.5 text-right font-medium">{t("pieces")}</th><th className="px-4 py-1.5 text-right font-medium">{t("value")}</th></tr></thead>
            <tbody>{r.top.map((x) => <tr key={x.itemId} className="border-b border-rule last:border-0"><td className="px-4 py-1.5 font-medium">{x.name}</td><td className="num px-4 py-1.5 text-right">{x.qty}</td><td className="num px-4 py-1.5 text-right">{rupees(x.amount)}</td></tr>)}</tbody>
          </table>
        ) : <p className="px-4 py-8 text-center text-muted">{t("none")}</p>}
      </Card>
      {r.ageing.some((a) => Number(a.qty) !== 0) ? (
        <Card className="mt-4 p-0">
          <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("ageing")}</h2>
          <table className="w-full text-[0.9286rem]"><tbody>{r.ageing.filter((a) => Number(a.qty) !== 0).map((a) => <tr key={a.key} className="border-b border-rule last:border-0"><td className="px-4 py-1.5">{t(`ageBands.${a.key}`)}</td><td className="num px-4 py-1.5 text-right">{a.qty}</td><td className="num px-4 py-1.5 text-right">{rupees(a.amount)}</td></tr>)}</tbody></table>
        </Card>
      ) : null}
    </>
  );
}
