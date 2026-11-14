import { TicketPercent } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";
import { DateFilter } from "@/components/DateFilter";
import { Card, PageHeader } from "@/components/ui";
import { rupees, todayIso } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

interface Line { date: string; number: string; channel: string; party: string | null; item: string; qty: string; gross: string; discount: string; pct: string }
interface Result { from: string; to: string; lines: Line[]; truncated: boolean; count: number; totalGross: string; totalDiscount: string; averagePct: string; byItem: { item: string; discount: string; gross: string; pct: string }[] }
type Props = { searchParams: Promise<{ from?: string; to?: string }> };

export async function generateMetadata() {
  return { title: (await getTranslations("discountRegister"))("title") };
}

/** Every discounted line on invoices and counter bills, and which items are discounted most. */
export default async function DiscountRegisterPage({ searchParams }: Props) {
  const sp = await searchParams;
  const day = /^\d{4}-\d{2}-\d{2}$/;
  const to = sp.to && day.test(sp.to) ? sp.to : todayIso();
  const from = sp.from && day.test(sp.from) ? sp.from : `${to.slice(0, 7)}-01`;
  const t = await getTranslations("discountRegister");
  const format = await getFormatter();
  const r = await serverApi<Result>(`/reports/discounts?from=${from}&to=${to}`);
  const tile = (label: string, value: string) => <div className="rounded-md border border-border bg-surface p-3"><div className="text-xs text-muted">{label}</div><div className="num mt-1 text-[1.4rem] font-semibold">{value}</div></div>;
  return (
    <>
      <PageHeader icon={TicketPercent} title={t("title")} subtitle={t("subtitle")} print />
      <div className="mb-4 print:hidden"><DateFilter from={from} to={to} /></div>
      <div className="mb-4 grid gap-3 sm:grid-cols-3">{tile(t("given"), rupees(r.totalDiscount))}{tile(t("onGross"), rupees(r.totalGross))}{tile(t("average"), `${r.averagePct}%`)}</div>
      {r.byItem.length ? (
        <Card className="mb-4 p-0">
          <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("byItem")}</h2>
          <table className="w-full text-[0.9286rem]">
            <tbody>{r.byItem.map((x) => <tr key={x.item} className="border-b border-rule last:border-0"><td className="px-4 py-1.5 font-medium">{x.item}</td><td className="num px-4 py-1.5 text-right">{rupees(x.discount)}</td><td className="num px-4 py-1.5 text-right text-muted">{x.pct}%</td></tr>)}</tbody>
          </table>
        </Card>
      ) : null}
      <Card className="p-0">
        {r.lines.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-[0.9286rem]">
              <thead><tr className="border-b border-border bg-surface-2 text-left text-xs font-semibold text-muted">
                <th className="px-4 py-1.5">{t("date")}</th><th className="px-4 py-1.5">{t("number")}</th><th className="px-4 py-1.5">{t("customer")}</th><th className="px-4 py-1.5">{t("item")}</th>
                <th className="px-4 py-1.5 text-right">{t("gross")}</th><th className="px-4 py-1.5 text-right">{t("discount")}</th><th className="px-4 py-1.5 text-right">%</th>
              </tr></thead>
              <tbody>
                {r.lines.map((l, i) => (
                  <tr key={`${l.number}-${i}`} className="border-b border-rule last:border-0">
                    <td className="px-4 py-1.5 whitespace-nowrap">{format.dateTime(new Date(`${l.date}T00:00:00`), { dateStyle: "medium" })}</td>
                    <td className="px-4 py-1.5 font-mono text-xs">{l.number} <span className="text-muted">{t(`channel.${l.channel}`)}</span></td>
                    <td className="px-4 py-1.5">{l.party ?? ""}</td><td className="px-4 py-1.5">{l.item}</td>
                    <td className="num px-4 py-1.5 text-right">{rupees(l.gross)}</td><td className="num px-4 py-1.5 text-right font-semibold">{rupees(l.discount)}</td><td className="num px-4 py-1.5 text-right text-muted">{l.pct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="px-4 py-8 text-center text-muted">{t("none")}</p>}
        {r.truncated ? <p className="border-t border-border px-4 py-2 text-xs text-muted">{t("firstLines", { n: r.lines.length, total: r.count })}</p> : null}
      </Card>
    </>
  );
}
