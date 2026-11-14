import { Plus } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { statusTone } from "@/lib/project-status";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, PageHeader } from "@/components/ui";
import { rupees } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("projects.list"))("title") };
}

interface Project { id: string; code: string; name: string; customer: string | null; billing: string; status: string; summary: { revenue: string; cost: string; margin: string; marginPct: string | null; hours: string; budgetUsedPct: string | null } }

export default async function ProjectsPage() {
  const t = await getTranslations();
  const [projects, me] = await Promise.all([serverApi<Project[]>("/projects"), serverApi<Me>("/auth/me")]);
  return (
    <>
      <PageHeader title={t("projects.list.title")} subtitle={t("projects.list.subtitle")}
        actions={me.permissions.includes("projects.create") ? (
          <Link href="/projects/new" className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover"><Plus className="size-4" aria-hidden />{t("projects.list.new")}</Link>
        ) : null} />
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="text-left text-muted"><tr className="border-b border-border">
              <th className="px-5 py-3 font-medium">{t("projects.list.name")}</th>
              <th className="px-5 py-3 font-medium">{t("projects.list.customer")}</th>
              <th className="px-5 py-3 font-medium">{t("projects.list.billing")}</th>
              <th className="px-5 py-3 text-right font-medium">{t("projects.list.hours")}</th>
              <th className="px-5 py-3 text-right font-medium">{t("projects.list.revenue")}</th>
              <th className="px-5 py-3 text-right font-medium">{t("projects.list.cost")}</th>
              <th className="px-5 py-3 text-right font-medium">{t("projects.list.margin")}</th>
              <th className="px-5 py-3 font-medium">{t("projects.list.status")}</th>
            </tr></thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-surface-2/60">
                  <td className="px-5 py-2.5"><Link href={`/projects/${p.id}`} className="font-medium text-primary hover:underline">{p.name}</Link><span className="block font-mono text-xs text-muted">{p.code}</span></td>
                  <td className="px-5 py-2.5">{p.customer ?? "-"}</td>
                  <td className="px-5 py-2.5">{t(`projects.list.billings.${p.billing}`)}</td>
                  <td className="num px-5 py-2.5 text-right">{Number(p.summary.hours)}</td>
                  <td className="num px-5 py-2.5 text-right">{rupees(p.summary.revenue)}</td>
                  <td className="num px-5 py-2.5 text-right">{rupees(p.summary.cost)}{p.summary.budgetUsedPct ? <span className="block text-xs text-muted">{t("projects.detail.budgetUsed", { pct: p.summary.budgetUsedPct })}</span> : null}</td>
                  <td className={`num px-5 py-2.5 text-right ${Number(p.summary.margin) < 0 ? "text-danger" : ""}`}>{rupees(p.summary.margin)}{p.summary.marginPct ? <span className="block text-xs text-muted">{p.summary.marginPct}%</span> : null}</td>
                  <td className="px-5 py-2.5"><StatusBadge status={statusTone(p.status)} label={t(`projects.list.statuses.${p.status}`)} /></td>
                </tr>
              ))}
              {!projects.length ? <tr><td colSpan={8} className="px-5 py-10 text-center text-muted">{t("projects.list.none")}</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
