import { Plus } from "lucide-react";
import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { LEAD_STAGES as STAGES } from "@varchasv/domain";
import { Button, Card, Input, PageHeader } from "@/components/ui";
import { rupees } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("crm.leads"))("title") };
}

interface Lead { id: string; code: string; name: string; organisation: string | null; phone: string | null; city: string | null; source: string; stage: string; value: string | null; owner: string | null; nextFollowUp: string | null }

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ stage?: string; q?: string }> }) {
  const sp = await searchParams;
  const stage = (STAGES as readonly string[]).includes(sp.stage ?? "") ? sp.stage : undefined;
  const t = await getTranslations();
  const format = await getFormatter();
  const qs = new URLSearchParams({ ...(stage ? { stage } : {}), ...(sp.q ? { q: sp.q.slice(0, 80) } : {}) });
  const [leads, pipe, me] = await Promise.all([
    serverApi<Lead[]>(`/crm/leads?${qs}`), serverApi<{ stage: string; count: number; value: string; weighted: string }[]>("/crm/pipeline"), serverApi<Me>("/auth/me"),
  ]);
  return (
    <>
      <PageHeader title={t("crm.leads.title")} subtitle={t("crm.leads.subtitle")}
        actions={me.permissions.includes("crm.create") ? (
          <Link href="/crm/leads/new" className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover"><Plus className="size-4" aria-hidden />{t("crm.leads.new")}</Link>
        ) : null} />
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {pipe.map((p) => (
            <Link key={p.stage} href={p.stage === stage ? "?" : `?stage=${p.stage}`}>
              <Card className={`h-full ${p.stage === stage ? "border-primary" : ""}`}>
                <div className="text-sm text-muted">{t(`crm.leads.stages.${p.stage}`)} · {p.count}</div>
                <div className="num text-lg font-semibold">{rupees(p.value)}</div>
                {p.stage !== "won" && p.stage !== "lost" ? <div className="text-xs text-muted">{t("crm.leads.weighted", { amount: rupees(p.weighted) })}</div> : null}
              </Card>
            </Link>
          ))}
        </div>
        <form className="flex gap-3">
          {stage ? <input type="hidden" name="stage" value={stage} /> : null}
          <Input name="q" defaultValue={sp.q ?? ""} placeholder={t("crm.leads.search")} aria-label={t("crm.leads.search")} />
          <Button type="submit" variant="outline">{t("common.search")}</Button>
        </form>
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="text-left text-muted"><tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">{t("crm.leads.name")}</th>
                <th className="px-5 py-3 font-medium">{t("crm.leads.source")}</th>
                <th className="px-5 py-3 font-medium">{t("crm.leads.stage")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("crm.leads.value")}</th>
                <th className="px-5 py-3 font-medium">{t("crm.leads.nextFollowUp")}</th>
                <th className="px-5 py-3 font-medium">{t("crm.leads.owner")}</th>
              </tr></thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-b border-border last:border-0 hover:bg-surface-2/60">
                    <td className="px-5 py-2.5">
                      <Link href={`/crm/leads/${l.id}`} className="font-medium text-primary hover:underline">{l.organisation || l.name}</Link>
                      <span className="block text-xs text-muted">{l.code} · {[l.organisation ? l.name : null, l.phone, l.city].filter(Boolean).join(" · ")}</span>
                    </td>
                    <td className="px-5 py-2.5">{t(`crm.leads.sources.${l.source}`)}</td>
                    <td className="px-5 py-2.5">{t(`crm.leads.stages.${l.stage}`)}</td>
                    <td className="num px-5 py-2.5 text-right">{l.value ? rupees(l.value) : "-"}</td>
                    <td className={`px-5 py-2.5 ${l.nextFollowUp && new Date(l.nextFollowUp) < new Date() ? "text-danger" : ""}`}>{l.nextFollowUp ? format.dateTime(new Date(l.nextFollowUp), { dateStyle: "medium" }) : "-"}</td>
                    <td className="px-5 py-2.5 text-muted">{l.owner ?? ""}</td>
                  </tr>
                ))}
                {!leads.length ? <tr><td colSpan={6} className="px-5 py-10 text-center text-muted">{t("crm.leads.none")}</td></tr> : null}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
