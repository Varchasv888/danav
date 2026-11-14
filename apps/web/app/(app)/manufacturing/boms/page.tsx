import { Plus } from "lucide-react";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { WorkCentres, type WorkCentre } from "@/components/mfg/Boms";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, PageHeader } from "@/components/ui";
import { localName } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("mfg.boms"))("title") };
}

interface BomRow { id: string; itemId: string; itemName: string; itemNameHi: string | null; version: number; outputQty: string; isDefault: boolean; status: string; lines: number }

export default async function BomsPage() {
  const t = await getTranslations();
  const locale = await getLocale();
  const [boms, centres, me] = await Promise.all([serverApi<BomRow[]>("/boms"), serverApi<WorkCentre[]>("/work-centres"), serverApi<Me>("/auth/me")]);
  return (
    <>
      <PageHeader title={t("mfg.boms.title")} subtitle={t("mfg.boms.subtitle")}
        actions={me.permissions.includes("inventory.create") ? (
          <Link href="/manufacturing/boms/new" className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover">
            <Plus className="size-4" aria-hidden />{t("mfg.boms.new")}
          </Link>
        ) : null} />
      <div className="flex flex-col gap-6">
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="text-left text-muted"><tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">{t("mfg.boms.item")}</th>
                <th className="px-5 py-3 font-medium">{t("mfg.boms.version")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("mfg.boms.outputQty")}</th>
                <th className="px-5 py-3 font-medium">{t("mfg.boms.component")}</th>
                <th className="px-5 py-3 font-medium" />
              </tr></thead>
              <tbody>
                {boms.map((b) => (
                  <tr key={b.id} className="border-b border-border last:border-0 hover:bg-surface-2/60">
                    <td className="px-5 py-2.5"><Link href={`/manufacturing/boms/${b.id}`} className="font-medium text-primary hover:underline">{localName({ name: b.itemName, nameHi: b.itemNameHi }, locale)}</Link></td>
                    <td className="px-5 py-2.5">v{b.version}</td>
                    <td className="num px-5 py-2.5 text-right">{Number(b.outputQty).toLocaleString("en-IN")}</td>
                    <td className="px-5 py-2.5 text-muted">{t("mfg.boms.lines", { count: b.lines })}</td>
                    <td className="px-5 py-2.5">
                      {b.status === "archived" ? <StatusBadge status="closed" label={t("mfg.boms.archived")} /> : b.isDefault ? <StatusBadge status="posted" label={t("mfg.boms.default")} /> : null}
                    </td>
                  </tr>
                ))}
                {!boms.length ? <tr><td colSpan={5} className="px-5 py-10 text-center text-muted">{t("mfg.boms.none")}</td></tr> : null}
              </tbody>
            </table>
          </div>
        </Card>
        <WorkCentres key={centres.map((c) => `${c.id}:${c.name}:${c.costPerHour}`).join()} rows={centres} canEdit={me.permissions.includes("inventory.edit")} />
      </div>
    </>
  );
}
