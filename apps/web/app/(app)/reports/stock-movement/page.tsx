import clsx from "clsx";
import { Rabbit } from "lucide-react";
import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { Badge, Button, Card, Field, Input, PageHeader, Select } from "@/components/ui";
import { rupees, todayIso } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

type Cls = "fast" | "slow" | "none";
interface Row { itemId: string; name: string; sku: string | null; styleCode: string | null; stockQty: string; stockValue: string; soldQty: string; lastSold: string | null; daysSinceSale: number | null; class: Cls }
interface Result { asOf: string; from: string; days: number; fastMin: number; summary: { class: Cls; items: number; pieces: string; value: string }[]; rows: Row[]; truncated: boolean }
type Props = { searchParams: Promise<{ days?: string; fastMin?: string; all?: string; class?: string }> };

const WINDOWS = [30, 60, 90, 180, 365] as const;
const TONE: Record<Cls, "success" | "warning" | "danger"> = { fast: "success", slow: "warning", none: "danger" };

export async function generateMetadata() {
  return { title: (await getTranslations("movement"))("title") };
}

/** Which stock sells and which sits: pieces sold over a window, with the bands (window and "fast" line) set by the user. */
export default async function StockMovementPage({ searchParams }: Props) {
  const sp = await searchParams;
  const days = WINDOWS.find((d) => String(d) === sp.days) ?? 90;
  const fastMin = Math.max(1, Math.min(100000, Number(sp.fastMin) || 10));
  const all = sp.all === "1";
  const only = (["fast", "slow", "none"] as const).find((c) => c === sp.class);
  const t = await getTranslations("movement");
  const tb = await getTranslations("books");
  const format = await getFormatter();
  const r = await serverApi<Result>(`/reports/stock-movement?asOf=${todayIso()}&days=${days}&fastMin=${fastMin}${all ? "&all=1" : ""}`);
  const rows = only ? r.rows.filter((x) => x.class === only) : r.rows;
  const base = `days=${days}&fastMin=${fastMin}${all ? "&all=1" : ""}`;
  const day = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  return (
    <>
      <PageHeader icon={Rabbit} title={t("title")} subtitle={t("subtitle", { days, fastMin })} print />
      <form method="get" className="mb-4 flex flex-wrap items-end gap-3 print:hidden">
        <Field label={t("window")} htmlFor="mv-days"><Select id="mv-days" name="days" defaultValue={String(days)} className="w-40">{WINDOWS.map((d) => <option key={d} value={d}>{t("windowDays", { n: d })}</option>)}</Select></Field>
        <Field label={t("fastFrom")} htmlFor="mv-fast"><Input id="mv-fast" name="fastMin" type="number" min={1} defaultValue={fastMin} className="num w-28 text-right" /></Field>
        <label className="flex h-9 items-center gap-1.5 text-[0.9286rem] text-muted"><input type="checkbox" name="all" value="1" defaultChecked={all} className="size-3.5" />{t("includeFabric")}</label>
        <Button type="submit" variant="outline">{tb("show")}</Button>
      </form>
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {r.summary.map((s) => (
          <Link key={s.class} href={`/reports/stock-movement?${base}&class=${only === s.class ? "" : s.class}`} aria-current={only === s.class ? "true" : undefined}
            className={clsx("rounded-md border bg-surface p-3 hover:border-primary/50", only === s.class ? "border-primary ring-1 ring-primary/40" : "border-border")}>
            <span className="flex items-center justify-between"><Badge tone={TONE[s.class]}>{t(`class.${s.class}`)}</Badge><span className="text-[0.8571rem] text-muted">{t("items", { n: s.items })}</span></span>
            <span className="num mt-2 block text-[1.4rem] font-semibold">{rupees(s.value)}</span>
            <span className="text-[0.8571rem] text-muted">{t("piecesInStock", { n: Number(s.pieces).toLocaleString("en-IN") })}</span>
          </Link>
        ))}
      </div>
      <Card className="p-0">
        {rows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-[0.9286rem]">
              <thead><tr className="border-b border-border bg-surface-2 text-left text-xs font-semibold text-muted">
                <th className="px-4 py-1.5">{t("item")}</th><th className="px-4 py-1.5">{t("status")}</th><th className="px-4 py-1.5 text-right">{t("sold", { days })}</th>
                <th className="px-4 py-1.5 text-right">{t("inStock")}</th><th className="px-4 py-1.5 text-right">{t("stockValue")}</th><th className="px-4 py-1.5">{t("lastSold")}</th>
              </tr></thead>
              <tbody>
                {rows.map((x) => (
                  <tr key={x.itemId} className="border-b border-rule last:border-0">
                    <td className="px-4 py-2"><span className="font-medium">{x.name}</span>{x.sku ? <span className="ml-2 font-mono text-xs text-muted">{x.sku}</span> : null}</td>
                    <td className="px-4 py-2"><Badge tone={TONE[x.class]}>{t(`class.${x.class}`)}</Badge></td>
                    <td className="num px-4 py-2 text-right">{Number(x.soldQty).toLocaleString("en-IN")}</td>
                    <td className="num px-4 py-2 text-right">{Number(x.stockQty).toLocaleString("en-IN")}</td>
                    <td className="num px-4 py-2 text-right">{rupees(x.stockValue)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-muted">{x.lastSold ? `${day(x.lastSold)} (${t("daysAgo", { n: x.daysSinceSale ?? 0 })})` : t("never")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="px-4 py-8 text-center text-muted">{t("empty")}</p>}
        {r.truncated ? <p className="border-t border-border px-4 py-2 text-xs text-muted">{t("firstRows")}</p> : null}
      </Card>
    </>
  );
}
