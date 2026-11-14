import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { StartCount } from "@/components/inventory/StockCounts";
import { Card, PageHeader } from "@/components/ui";
import { inventorySetup } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

type Row = { id: string; number: string; name: string; store: string; status: string; items: number; pieces: string; createdAt: string };

export async function generateMetadata() {
  return { title: (await getTranslations("counts"))("title") };
}

/** Stock counts: start one, and the list of counts with where each stands. */
export default async function CountsPage() {
  const t = await getTranslations();
  const format = await getFormatter();
  const [rows, me, setup, scopes] = await Promise.all([
    serverApi<Row[]>("/stock-counts"), serverApi<Me>("/auth/me"), inventorySetup(),
    serverApi<{ brands: string[]; categories: string[]; styles: { id: string; code: string; name: string }[] }>("/stock-counts/scopes"),
  ]);
  return (
    <>
      <PageHeader title={t("counts.title")} subtitle={t("counts.subtitle")} />
      {me.permissions.includes("inventory.create") ? <div className="mb-4"><StartCount warehouses={setup.warehouses.filter((w) => !w.archived)} scopes={scopes} /></div> : null}
      <Card className="p-0">
        <table className="w-full text-sm">
          <thead className="text-left text-muted">
            <tr className="border-b border-border">
              <th className="px-4 py-2.5 font-medium">{t("counts.number")}</th><th className="px-3 py-2.5 font-medium">{t("counts.name")}</th>
              <th className="px-3 py-2.5 font-medium">{t("stock.warehouse")}</th><th className="px-3 py-2.5 font-medium">{t("counts.started")}</th>
              <th className="px-3 py-2.5 text-right font-medium">{t("counts.piecesCounted")}</th><th className="px-4 py-2.5 font-medium">{t("counts.state")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0">
                <td className="px-4 py-2"><Link href={`/inventory/counts/${r.id}`} className="font-mono text-primary hover:underline">{r.number}</Link></td>
                <td className="px-3 py-2">{r.name}</td><td className="px-3 py-2">{r.store}</td>
                <td className="px-3 py-2 text-muted">{format.dateTime(new Date(r.createdAt), { dateStyle: "medium", timeStyle: "short" })}</td>
                <td className="num px-3 py-2 text-right">{Number(r.pieces).toLocaleString("en-IN")}</td>
                <td className="px-4 py-2">{t(`counts.status.${r.status}`)}</td>
              </tr>
            ))}
            {!rows.length ? <tr><td colSpan={6} className="px-4 py-10 text-center text-muted">{t("counts.none")}</td></tr> : null}
          </tbody>
        </table>
      </Card>
    </>
  );
}
