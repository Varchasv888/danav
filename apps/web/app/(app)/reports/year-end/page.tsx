import { CalendarCheck } from "lucide-react";
import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { Badge, Button, Card, Field, PageHeader, Select } from "@/components/ui";
import { fyStart, rupees, todayIso } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

interface Result {
  fy: string; from: string; to: string; netProfit: string; ready: boolean; integrityOk: boolean;
  integrityFailing: { key: string; severity: string; difference: string | null; count: number }[]; pending: { key: string; count: number }[];
}
interface Carry {
  assets: { group: string; total: string; accounts: { name: string; amount: string }[] }[]; liabilities: { group: string; total: string; accounts: { name: string; amount: string }[] }[];
  closingStock: string; profitThisYear: string; profitCarriedFromEarlier: string; profitCarriedForward: string; totalAssets: string; totalLiabilities: string; difference: string; balanced: boolean;
  openBills: { receivable: { parties: number; total: string }; payable: { parties: number; total: string } };
}
type Props = { searchParams: Promise<{ fy?: string }> };
const LINKS: Record<string, string> = {
  stockCounts: "/inventory/counts", payrollRuns: "/hr/payroll", challansNotBilled: "/sales/deliveries", salesOrdersOpen: "/sales/orders",
  deliveryOrdersOpen: "/sales/delivery-orders", transfersInTransit: "/inventory/transfers", purchaseOrdersOpen: "/purchase/orders",
};

export async function generateMetadata() {
  return { title: (await getTranslations("yearEnd"))("title") };
}

/** What to settle before a financial year is closed: the profit, the books' checks, and documents still half done. */
export default async function YearEndPage({ searchParams }: Props) {
  const { fy: q } = await searchParams;
  const startYear = Number(fyStart(todayIso()).slice(0, 4));
  const options = [startYear + 1, startYear, startYear - 1, startYear - 2].map((y) => `${y}-${String((y + 1) % 100).padStart(2, "0")}`);
  const fy = options.find((o) => o === q) ?? options[1]!;
  const t = await getTranslations("yearEnd");
  const format = await getFormatter();
  const [r, carry] = await Promise.all([serverApi<Result>(`/reports/year-end?fy=${fy}`), serverApi<Carry>(`/reports/carry-forward?fy=${fy}`)]);
  const day = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  return (
    <>
      <PageHeader icon={CalendarCheck} title={t("title")} subtitle={t("subtitle")} print />
      <form method="get" className="mb-4 flex items-end gap-3 print:hidden">
        <Field label={t("year")} htmlFor="ye-fy"><Select id="ye-fy" name="fy" defaultValue={fy} className="w-40">{options.map((o) => <option key={o} value={o}>{o}</option>)}</Select></Field>
        <Button type="submit" variant="outline">{t("check")}</Button>
      </form>
      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Badge tone={r.ready ? "success" : "warning"}>{r.ready ? t("ready") : t("notReady")}</Badge>
          <span className="text-sm text-muted">{day(r.from)} to {day(r.to)}</span>
          <span className="text-sm">{t("netProfit")}: <span className="num font-semibold">{rupees(r.netProfit)}</span></span>
        </div>
      </Card>
      <Card className="p-0">
        <table className="w-full text-[0.9286rem]">
          <tbody>
            <tr className="border-b border-rule">
              <td className="px-4 py-2.5 font-medium">{t("integrity")}</td>
              <td className="px-4 py-2.5">{r.integrityOk ? <Badge tone="success">{t("ok")}</Badge> : <Badge tone="danger">{t("failing", { n: r.integrityFailing.length })}</Badge>}</td>
              <td className="px-4 py-2.5 text-right"><Link href="/reports/integrity" className="text-primary hover:underline">{t("open")}</Link></td>
            </tr>
            {r.pending.map((p) => (
              <tr key={p.key} className="border-b border-rule last:border-0">
                <td className="px-4 py-2.5 font-medium">{t(`items.${p.key}`)}</td>
                <td className="px-4 py-2.5">{p.count === 0 ? <Badge tone="success">{t("none")}</Badge> : <Badge tone="warning">{p.count}</Badge>}</td>
                <td className="px-4 py-2.5 text-right">{p.count ? <Link href={LINKS[p.key] ?? "/"} className="text-primary hover:underline">{t("open")}</Link> : null}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card className="mt-4 p-0">
        <h2 className="border-b border-border px-4 py-2 text-sm font-semibold">{t("carryTitle")}</h2>
        <p className="px-4 py-2 text-sm text-muted">{t("carryHelp")}</p>
        <div className="grid gap-4 p-4 pt-0 md:grid-cols-2">
          {[["assets", carry.assets, carry.totalAssets], ["liabilities", carry.liabilities, carry.totalLiabilities]].map(([k, groups, total]) => (
            <div key={k as string}>
              <h3 className="mb-1 text-sm font-medium">{t(`carry.${k as string}`)}</h3>
              <table className="w-full text-sm"><tbody>
                {(groups as Carry["assets"]).map((g) => <tr key={g.group} className="border-b border-rule"><td className="py-1">{g.group}</td><td className="num py-1 text-right">{rupees(g.total)}</td></tr>)}
                {k === "assets" ? <tr className="border-b border-rule"><td className="py-1">{t("carry.stock")}</td><td className="num py-1 text-right">{rupees(carry.closingStock)}</td></tr> : <tr className="border-b border-rule"><td className="py-1">{t("carry.profit")}</td><td className="num py-1 text-right">{rupees(carry.profitCarriedForward)}</td></tr>}
                <tr className="font-medium"><td className="py-1">{t("carry.total")}</td><td className="num py-1 text-right">{rupees(total as string)}</td></tr>
              </tbody></table>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-rule px-4 py-3 text-sm">
          <Badge tone={carry.balanced ? "success" : "danger"}>{carry.balanced ? t("carry.balanced") : t("carry.gap", { amount: rupees(carry.difference) })}</Badge>
          <span>{t("carry.profitYear")}: <span className="num font-medium">{rupees(carry.profitThisYear)}</span></span>
          <span>{t("carry.profitEarlier")}: <span className="num font-medium">{rupees(carry.profitCarriedFromEarlier)}</span></span>
          <span>{t("carry.openReceivable", { n: carry.openBills.receivable.parties })}: <span className="num font-medium">{rupees(carry.openBills.receivable.total)}</span></span>
          <span>{t("carry.openPayable", { n: carry.openBills.payable.parties })}: <span className="num font-medium">{rupees(carry.openBills.payable.total)}</span></span>
        </div>
      </Card>
      <p className="mt-3 text-xs text-muted">{t("lockHelp")}</p>
    </>
  );
}
