import { Plus } from "lucide-react";
import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { ClassesEditor, type AssetClass, type Preset } from "@/components/assets/Assets";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, PageHeader } from "@/components/ui";
import { rupees } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("assets.register"))("title") };
}

interface Asset { id: string; code: string; name: string; className: string; purchaseDate: string; cost: string; accumulated: string; bookValue: string; status: string; location: string | null; custodian: string | null }

export default async function AssetsPage() {
  const t = await getTranslations();
  const format = await getFormatter();
  const [assets, classes, presets, me] = await Promise.all([
    serverApi<Asset[]>("/assets"), serverApi<AssetClass[]>("/assets/classes"), serverApi<Preset[]>("/assets/presets"), serverApi<Me>("/auth/me"),
  ]);
  const total = (k: "cost" | "accumulated" | "bookValue") => assets.filter((a) => a.status === "active").reduce((s, a) => s + Number(a[k]), 0);
  return (
    <>
      <PageHeader title={t("assets.register.title")} subtitle={t("assets.register.subtitle")}
        actions={me.permissions.includes("assets.create") && classes.length ? (
          <Link href="/assets/new" className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover"><Plus className="size-4" aria-hidden />{t("assets.register.new")}</Link>
        ) : null} />
      <div className="flex flex-col gap-6">
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="text-left text-muted"><tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">{t("assets.register.code")}</th>
                <th className="px-5 py-3 font-medium">{t("assets.register.name")}</th>
                <th className="px-5 py-3 font-medium">{t("assets.register.purchased")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("assets.register.cost")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("assets.register.accumulated")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("assets.register.bookValue")}</th>
                <th className="px-5 py-3 font-medium">{t("assets.register.status")}</th>
              </tr></thead>
              <tbody>
                {assets.map((a) => (
                  <tr key={a.id} className="border-b border-border last:border-0 hover:bg-surface-2/60">
                    <td className="px-5 py-2.5 font-mono text-xs">{a.code}</td>
                    <td className="px-5 py-2.5"><Link href={`/assets/${a.id}`} className="font-medium text-primary hover:underline">{a.name}</Link>
                      <span className="block text-xs text-muted">{[a.className, a.location, a.custodian].filter(Boolean).join(" · ")}</span></td>
                    <td className="px-5 py-2.5 whitespace-nowrap">{format.dateTime(new Date(`${a.purchaseDate}T00:00:00`), { dateStyle: "medium" })}</td>
                    <td className="num px-5 py-2.5 text-right">{rupees(a.cost)}</td>
                    <td className="num px-5 py-2.5 text-right">{rupees(a.accumulated)}</td>
                    <td className="num px-5 py-2.5 text-right font-medium">{rupees(a.bookValue)}</td>
                    <td className="px-5 py-2.5"><StatusBadge status={a.status === "active" ? "open" : "closed"} label={t(`assets.register.statuses.${a.status}`)} /></td>
                  </tr>
                ))}
                {assets.length ? (
                  <tr className="font-semibold"><td colSpan={3} className="px-5 py-2.5" /><td className="num px-5 py-2.5 text-right">{rupees(total("cost"))}</td><td className="num px-5 py-2.5 text-right">{rupees(total("accumulated"))}</td><td className="num px-5 py-2.5 text-right">{rupees(total("bookValue"))}</td><td /></tr>
                ) : <tr><td colSpan={7} className="px-5 py-10 text-center text-muted">{t("assets.register.none")}</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>
        <ClassesEditor classes={classes} presets={presets} canEdit={me.permissions.includes("assets.edit")} />
      </div>
    </>
  );
}
