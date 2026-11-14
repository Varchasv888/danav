import { Plus } from "lucide-react";
import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

interface Journal { id: string; number: string; date: string; kind: string; narration: string | null; status: string; lineCount: number }

export async function generateMetadata() {
  return { title: (await getTranslations("sj"))("title") };
}

export default async function StockJournalsPage() {
  const t = await getTranslations();
  const format = await getFormatter();
  const [rows, me] = await Promise.all([serverApi<Journal[]>("/stock-journals"), serverApi<Me>("/auth/me")]);
  return (
    <>
      <PageHeader
        title={t("sj.title")}
        subtitle={t("sj.subtitle")}
        actions={me.permissions.includes("inventory.create") ? (
          <Link href="/inventory/journals/new" className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover">
            <Plus className="size-4" aria-hidden />{t("sj.new")}
          </Link>
        ) : null}
      />
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">{t("common.date")}</th>
                <th className="px-5 py-3 font-medium">{t("vouchers.number")}</th>
                <th className="px-5 py-3 font-medium">{t("items.kind")}</th>
                <th className="px-5 py-3 font-medium">{t("common.narration")}</th>
                <th className="px-5 py-3 font-medium">{t("purchase.status")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((j) => (
                <tr key={j.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-2.5 whitespace-nowrap">{format.dateTime(new Date(`${j.date}T00:00:00`), { dateStyle: "medium" })}</td>
                  <td className="px-5 py-2.5"><Link href={`/inventory/journals/${j.id}`} className="font-mono text-primary hover:underline">{j.number}</Link></td>
                  <td className="px-5 py-2.5">{t(`sj.kinds.${j.kind}`)}</td>
                  <td className="max-w-80 truncate px-5 py-2.5 text-muted">{j.narration}</td>
                  <td className="px-5 py-2.5"><StatusBadge status={j.status} label={t(`purchase.statuses.${j.status}`)} /></td>
                </tr>
              ))}
              {!rows.length ? <tr><td colSpan={5} className="px-5 py-10 text-center text-muted">{t("vouchers.empty")}</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
