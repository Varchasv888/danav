import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { BomActions } from "@/components/mfg/Boms";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, PageHeader } from "@/components/ui";
import { localName, rupees } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";

interface Bom {
  id: string; itemId: string; itemName: string; itemNameHi: string | null; version: number; outputQty: string; overhead: string; overheadPerBatch: string;
  isDefault: boolean; status: string; notes: string | null;
  lines: { id: string; itemId: string; name: string; nameHi: string | null; uom: string; qty: string; wastagePct: string }[];
  operations: { id: string; name: string; workCentre: string; minutes: string; rate: string; cost: string }[];
  cost: { unitCost: string; overheadPerUnit: string; lines: { itemId: string; rate: string }[] } | null;
}

export async function generateMetadata() {
  return { title: (await getTranslations("mfg.boms"))("title") };
}

const n = (v: string) => Number(v).toLocaleString("en-IN", { maximumFractionDigits: 4 });

export default async function BomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations();
  const locale = await getLocale();
  const [b, me] = await Promise.all([serverApi<Bom>(`/boms/${id}`), serverApi<Me>("/auth/me")]);
  const name = localName({ name: b.itemName, nameHi: b.itemNameHi }, locale);
  return (
    <>
      <PageHeader title={`${name} · v${b.version}`}
        subtitle={<>{t("mfg.boms.outputQty")}: <span className="num">{n(b.outputQty)}</span></>}
        actions={(
          <div className="flex items-center gap-3">
            {b.status === "archived" ? <StatusBadge status="closed" label={t("mfg.boms.archived")} /> : b.isDefault ? <StatusBadge status="posted" label={t("mfg.boms.default")} /> : null}
            {me.permissions.includes("inventory.create") ? <Link href={`/manufacturing/boms/new?item=${b.itemId}`} className="text-sm text-primary hover:underline">{t("mfg.boms.new")}</Link> : null}
          </div>
        )} />
      <div className="flex flex-col gap-6">
        {b.cost ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Card><div className="text-sm text-muted">{t("mfg.boms.unitCost")}</div><div className="num text-2xl font-semibold">₹ {Number(b.cost.unitCost).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</div></Card>
            <Card><div className="text-sm text-muted">{t("mfg.boms.overheadPerUnit")}</div><div className="num text-2xl font-semibold">{rupees(b.cost.overheadPerUnit)}</div></Card>
          </div>
        ) : null}
        <Card className="p-0">
          <table className="w-full text-sm">
            <thead className="text-left text-muted"><tr className="border-b border-border">
              <th className="px-5 py-3 font-medium">{t("mfg.boms.component")}</th>
              <th className="px-5 py-3 text-right font-medium">{t("mfg.boms.qty")}</th>
              <th className="px-5 py-3 text-right font-medium">{t("mfg.boms.wastage")}</th>
              <th className="px-5 py-3 text-right font-medium">{t("mfg.boms.rate")}</th>
            </tr></thead>
            <tbody>
              {b.lines.map((l) => {
                const c = b.cost?.lines.find((x) => x.itemId === l.itemId);
                return (
                  <tr key={l.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-2.5">{localName(l, locale)}</td>
                    <td className="num px-5 py-2.5 text-right">{n(l.qty)} {l.uom}</td>
                    <td className="num px-5 py-2.5 text-right">{Number(l.wastagePct) ? `${Number(l.wastagePct)}%` : "-"}</td>
                    <td className="num px-5 py-2.5 text-right">{c ? `₹ ${Number(c.rate).toLocaleString("en-IN", { maximumFractionDigits: 4 })}` : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
        {b.operations.length || Number(b.overhead) ? (
          <Card className="p-0">
            <div className="border-b border-border px-5 py-3 font-semibold">{t("mfg.boms.operations")}</div>
            <table className="w-full text-sm">
              <tbody>
                {b.operations.map((o) => (
                  <tr key={o.id} className="border-b border-border">
                    <td className="px-5 py-2.5">{o.name}</td><td className="px-5 py-2.5 text-muted">{o.workCentre}</td>
                    <td className="num px-5 py-2.5 text-right">{n(o.minutes)} min</td><td className="num px-5 py-2.5 text-right">{rupees(o.cost)}</td>
                  </tr>
                ))}
                {Number(b.overhead) ? <tr><td className="px-5 py-2.5" colSpan={3}>{t("mfg.boms.overhead")}</td><td className="num px-5 py-2.5 text-right">{rupees(b.overhead)}</td></tr> : null}
              </tbody>
            </table>
          </Card>
        ) : null}
        {b.notes ? <p className="text-sm text-muted">{b.notes}</p> : null}
        {me.permissions.includes("inventory.edit") ? <BomActions id={b.id} isDefault={b.isDefault} archived={b.status === "archived"} /> : null}
      </div>
    </>
  );
}
