import { ScanSearch } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button, Card, Field, Input, PageHeader } from "@/components/ui";
import { rupees } from "@/lib/format";
import { items } from "@/lib/masters";

interface Item { id: string; name: string; sku: string | null; barcode: string | null; saleRate: string; mrp: string | null; stockQty: string; uom: string; archived: boolean }
type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata() {
  return { title: (await getTranslations("barcodeSearch"))("title") };
}

/** Find an item from a scanned or typed barcode, SKU or part of its name, with its rates and stock. */
export default async function BarcodeSearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const term = q.trim().toLowerCase();
  const t = await getTranslations("barcodeSearch");
  const all = term ? await items<Item>() : [];
  const exact = all.filter((i) => i.barcode?.toLowerCase() === term || i.sku?.toLowerCase() === term);
  const rows = (exact.length ? exact : all.filter((i) => i.name.toLowerCase().includes(term) || i.barcode?.toLowerCase().includes(term) || i.sku?.toLowerCase().includes(term))).slice(0, 50);
  const n = (v: string) => Number(v).toLocaleString("en-IN");
  return (
    <>
      <PageHeader icon={ScanSearch} title={t("title")} subtitle={t("subtitle")} />
      <form method="get" className="mb-4 flex items-end gap-3">
        <Field label={t("scan")} htmlFor="bs-q"><Input id="bs-q" name="q" defaultValue={q} autoFocus className="w-72 font-mono" /></Field>
        <Button type="submit">{t("find")}</Button>
      </form>
      {term ? (
        <Card className="p-0">
          {rows.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="text-left text-muted"><tr className="border-b border-border">
                  <th className="px-4 py-2 font-medium">{t("item")}</th><th className="px-4 py-2 font-medium">{t("barcode")}</th><th className="px-4 py-2 text-right font-medium">{t("saleRate")}</th>
                  <th className="px-4 py-2 text-right font-medium">{t("mrp")}</th><th className="px-4 py-2 text-right font-medium">{t("stock")}</th>
                </tr></thead>
                <tbody>
                  {rows.map((i) => (
                    <tr key={i.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-2 font-medium">{i.name}{i.sku ? <span className="ml-2 font-mono text-xs text-muted">{i.sku}</span> : null}</td>
                      <td className="px-4 py-2 font-mono text-xs">{i.barcode ?? ""}</td>
                      <td className="num px-4 py-2 text-right">{rupees(i.saleRate)}</td>
                      <td className="num px-4 py-2 text-right">{i.mrp ? rupees(i.mrp) : ""}</td>
                      <td className="num px-4 py-2 text-right">{n(i.stockQty)} {i.uom}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="px-4 py-8 text-center text-muted">{t("none")}</p>}
        </Card>
      ) : null}
    </>
  );
}
