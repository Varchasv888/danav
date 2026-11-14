import { getTranslations } from "next-intl/server";
import { BlockOpening, type AssetClass } from "@/components/assets/Assets";
import { Button, Card, PageHeader, Select } from "@/components/ui";
import { rupees, todayIso } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("assets.it"))("title") };
}

type Row = { block: string; rate: string; openingWdv: string; additionsFullRate: string; additionsHalfRate: string; sales: string; depreciation: string; closingWdv: string; shortTermGain: string; shortTermLoss: string };
const fyOf = (iso: string) => { const y = Number(iso.slice(0, 4)) - (iso.slice(5) < "04-01" ? 1 : 0); return `${y}-${String((y + 1) % 100).padStart(2, "0")}`; };

export default async function IncomeTaxDepreciationPage({ searchParams }: { searchParams: Promise<{ fy?: string }> }) {
  const current = fyOf(todayIso());
  const raw = (await searchParams).fy;
  const fy = raw && /^\d{4}-\d{2}$/.test(raw) ? raw : current;
  const t = await getTranslations();
  const [s, classes, me] = await Promise.all([serverApi<{ rows: Row[]; totals: Omit<Row, "block" | "rate"> }>(`/assets/income-tax?fy=${fy}`), serverApi<AssetClass[]>("/assets/classes"), serverApi<Me>("/auth/me")]);
  const options = [1, 0, -1, -2].map((i) => { const y = Number(current.slice(0, 4)) + i; return `${y}-${String((y + 1) % 100).padStart(2, "0")}`; });
  const blocks = [...new Map(classes.map((c) => [`${c.itBlock}|${c.itRate}`, { block: c.itBlock, rate: c.itRate }])).values()];
  const cols: [keyof Row, string][] = [["openingWdv", "opening"], ["additionsFullRate", "addFull"], ["additionsHalfRate", "addHalf"], ["sales", "sales"], ["depreciation", "depreciation"], ["closingWdv", "closing"], ["shortTermGain", "gain"], ["shortTermLoss", "loss"]];
  return (
    <>
      <PageHeader title={t("assets.it.title")} subtitle={t("assets.it.subtitle")}
        actions={(
          <form className="flex items-end gap-3">
            <Select name="fy" defaultValue={fy} className="w-36" aria-label={t("assets.it.fy")}>{options.map((o) => <option key={o} value={o}>{o}</option>)}</Select>
            <Button type="submit" variant="outline">{t("common.apply")}</Button>
          </form>
        )} />
      <div className="flex flex-col gap-6">
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead className="text-left text-muted"><tr className="border-b border-border">
                <th className="px-4 py-3 font-medium">{t("assets.it.block")}</th>
                {cols.map(([, k]) => <th key={k} className="px-4 py-3 text-right font-medium">{t(`assets.it.${k}`)}</th>)}
              </tr></thead>
              <tbody>
                {s.rows.map((r) => (
                  <tr key={`${r.block}|${r.rate}`} className="border-b border-border">
                    <td className="px-4 py-2.5">{t.has(`assets.classes.blocks.${r.block}`) ? t(`assets.classes.blocks.${r.block}`) : r.block} <span className="text-muted">· {Number(r.rate)}%</span></td>
                    {cols.map(([k]) => <td key={k} className="num px-4 py-2.5 text-right">{Number(r[k]) ? rupees(r[k]) : "-"}</td>)}
                  </tr>
                ))}
                {s.rows.length ? (
                  <tr className="font-semibold"><td className="px-4 py-2.5">{t("assets.it.total")}</td>{cols.map(([k]) => <td key={k} className="num px-4 py-2.5 text-right">{rupees(s.totals[k as keyof typeof s.totals])}</td>)}</tr>
                ) : <tr><td colSpan={9} className="px-4 py-10 text-center text-muted">{t("assets.it.none")}</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>
        {me.permissions.includes("assets.edit") ? <BlockOpening fy={fy} blocks={blocks} /> : null}
      </div>
    </>
  );
}
