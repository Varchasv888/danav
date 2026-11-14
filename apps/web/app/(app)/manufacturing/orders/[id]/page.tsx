import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { ProductionActions } from "@/components/mfg/Production";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, PageHeader } from "@/components/ui";
import { localName, rupees } from "@/lib/format";
import { items } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

interface Order {
  id: string; number: string; date: string; itemId: string; itemName: string; itemNameHi: string | null; qty: string; status: string;
  producedQty: string; rejectedQty: string; materialCost: string; overheadCost: string; remaining: string; notes: string | null;
  materialsForRemaining: { itemId: string; qty: string; name?: string; nameHi?: string | null }[];
  entries: { id: string; kind: "issue" | "complete"; date: string; goodQty: string; rejectedQty: string; materialCost: string; overheadCost: string; unitCost: string; lines: { itemId: string; qty: string; name: string | null }[] }[];
}

export async function generateMetadata() {
  return { title: (await getTranslations("mfg.orders"))("title") };
}

const n = (v: string) => Number(v).toLocaleString("en-IN", { maximumFractionDigits: 4 });

export default async function ProductionOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations();
  const locale = await getLocale();
  const format = await getFormatter();
  const [o, me, list] = await Promise.all([serverApi<Order>(`/production-orders/${id}`), serverApi<Me>("/auth/me"), items()]);
  const uom = list.find((i) => i.id === o.itemId)?.uom ?? "";
  const uomOf = (itemId: string) => list.find((i) => i.id === itemId)?.uom ?? "";
  const open = o.status === "planned" || o.status === "released";
  return (
    <>
      <PageHeader title={<span className="font-mono">{o.number}</span>}
        subtitle={<>{localName({ name: o.itemName, nameHi: o.itemNameHi }, locale)} · <span className="num">{n(o.qty)} {uom}</span> · {format.dateTime(new Date(`${o.date}T00:00:00`), { dateStyle: "medium" })}</>}
        actions={<StatusBadge status={o.status} label={t(`mfg.orders.statuses.${o.status}`)} />} />
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card><div className="text-sm text-muted">{t("mfg.orders.produced")}</div><div className="num text-2xl font-semibold">{n(o.producedQty)} <span className="text-base font-normal text-muted">{uom}</span></div></Card>
          <Card><div className="text-sm text-muted">{t("mfg.orders.rejected")}</div><div className="num text-2xl font-semibold">{n(o.rejectedQty)}</div></Card>
          <Card><div className="text-sm text-muted">{t("mfg.orders.materialCost")}</div><div className="num text-2xl font-semibold">{rupees(o.materialCost)}</div></Card>
          <Card><div className="text-sm text-muted">{t("mfg.orders.overheadCost")}</div><div className="num text-2xl font-semibold">{rupees(o.overheadCost)}</div></Card>
        </div>
        {open && o.materialsForRemaining.length ? (
          <Card className="p-0">
            <div className="border-b border-border px-5 py-3">
              <h2 className="font-semibold">{t("mfg.orders.materials")}</h2>
              <p className="text-sm text-muted">{t("mfg.orders.remaining")}: <span className="num">{n(o.remaining)} {uom}</span></p>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {o.materialsForRemaining.map((m) => {
                  const stock = list.find((i) => i.id === m.itemId)?.stockQty ?? "0";
                  const short = Number(stock) < Number(m.qty);
                  return (
                    <tr key={m.itemId} className="border-b border-border last:border-0">
                      <td className="px-5 py-2.5">{localName({ name: m.name ?? "", nameHi: m.nameHi ?? null }, locale)}</td>
                      <td className="num px-5 py-2.5 text-right">{n(m.qty)} {uomOf(m.itemId)}</td>
                      <td className={`num px-5 py-2.5 text-right ${short ? "text-danger" : "text-muted"}`}>{t("mfg.mrp.onHand")}:{n(stock)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        ) : null}
        {o.entries.length ? (
          <Card className="p-0">
            <div className="border-b border-border px-5 py-3 font-semibold">{t("mfg.orders.entries")}</div>
            <table className="w-full text-sm">
              <thead className="text-left text-muted"><tr className="border-b border-border">
                <th className="px-5 py-2 font-medium">{t("common.date")}</th><th className="px-5 py-2 font-medium" />
                <th className="px-5 py-2 text-right font-medium">{t("mfg.orders.goodQty")}</th>
                <th className="px-5 py-2 text-right font-medium">{t("mfg.orders.materialCost")}</th>
                <th className="px-5 py-2 text-right font-medium">{t("mfg.orders.unitCost")}</th>
              </tr></thead>
              <tbody>
                {o.entries.map((e) => (
                  <tr key={e.id} className="border-b border-border align-top last:border-0">
                    <td className="px-5 py-2.5 whitespace-nowrap">{format.dateTime(new Date(`${e.date}T00:00:00`), { dateStyle: "medium" })}</td>
                    <td className="px-5 py-2.5">
                      {t(`mfg.orders.kinds.${e.kind}`)}
                      <span className="block text-xs text-muted">{e.lines.map((l) => `${l.name ?? ""} ${n(l.qty)}`).join(" · ")}</span>
                    </td>
                    <td className="num px-5 py-2.5 text-right">{e.kind === "complete" ? <>{n(e.goodQty)}{Number(e.rejectedQty) ? <span className="text-danger"> +{n(e.rejectedQty)}</span> : null}</> : "-"}</td>
                    <td className="num px-5 py-2.5 text-right">{rupees(e.materialCost)}</td>
                    <td className="num px-5 py-2.5 text-right">{e.kind === "complete" ? `₹ ${Number(e.unitCost).toLocaleString("en-IN", { maximumFractionDigits: 4 })}` : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ) : null}
        {o.notes ? <p className="text-sm text-muted">{o.notes}</p> : null}
        {me.permissions.includes("inventory.create") ? (
          <ProductionActions id={o.id} status={o.status} remaining={o.remaining} uom={uom} items={list} canCancel={me.permissions.includes("inventory.cancel")} />
        ) : null}
      </div>
    </>
  );
}
