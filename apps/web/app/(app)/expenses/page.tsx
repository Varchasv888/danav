import { Plus } from "lucide-react";
import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, PageHeader } from "@/components/ui";
import { rupees } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("expenses.claims"))("title") };
}

interface Claim { id: string; number: string; date: string; title: string; employee: string; employeeCode: string; total: string; itc: string; status: string }
const STATUSES = ["submitted", "approved", "paid", "draft", "rejected", "cancelled"] as const;
const TONE: Record<string, string> = { submitted: "partial", approved: "open", paid: "completed", draft: "planned", rejected: "cancelled", cancelled: "cancelled" };

export default async function ClaimsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const raw = (await searchParams).status;
  const status = (STATUSES as readonly string[]).includes(raw ?? "") ? raw : undefined;
  const t = await getTranslations();
  const format = await getFormatter();
  const [claims, totals, me] = await Promise.all([
    serverApi<Claim[]>(`/expenses/claims${status ? `?status=${status}` : ""}`), serverApi<Record<string, { count: number; total: string }>>("/expenses/totals"), serverApi<Me>("/auth/me"),
  ]);
  const tab = (s: string | undefined, label: string) => (
    <Link key={s ?? "all"} href={s ? `?status=${s}` : "?"} className={`rounded-full px-3 py-1 text-sm ${s === status ? "bg-primary text-on-primary" : "bg-surface-2 hover:bg-surface-2/70"}`}>{label}</Link>
  );
  return (
    <>
      <PageHeader title={t("expenses.claims.title")} subtitle={t("expenses.claims.subtitle")}
        actions={me.permissions.includes("expenses.create") ? (
          <Link href="/expenses/new" className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover"><Plus className="size-4" aria-hidden />{t("expenses.claims.new")}</Link>
        ) : null} />
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card><div className="text-sm text-muted">{t("expenses.claims.waiting")}</div><div className="num text-2xl font-semibold">{rupees(totals.submitted?.total ?? 0)}</div><div className="text-xs text-muted">{totals.submitted?.count ?? 0}</div></Card>
          <Card><div className="text-sm text-muted">{t("expenses.claims.toPay")}</div><div className="num text-2xl font-semibold">{rupees(totals.approved?.total ?? 0)}</div><div className="text-xs text-muted">{totals.approved?.count ?? 0}</div></Card>
        </div>
        <nav className="flex flex-wrap gap-2">{[tab(undefined, t("expenses.claims.all")), ...STATUSES.map((s) => tab(s, t(`expenses.claims.statuses.${s}`)))]}</nav>
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="text-left text-muted"><tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">{t("expenses.claims.date")}</th>
                <th className="px-5 py-3 font-medium">{t("expenses.claims.number")}</th>
                <th className="px-5 py-3 font-medium">{t("expenses.claims.employee")}</th>
                <th className="px-5 py-3 font-medium">{t("expenses.claims.claimTitle")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("expenses.claims.total")}</th>
                <th className="px-5 py-3 font-medium">{t("expenses.claims.status")}</th>
              </tr></thead>
              <tbody>
                {claims.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-surface-2/60">
                    <td className="px-5 py-2.5 whitespace-nowrap">{format.dateTime(new Date(`${c.date}T00:00:00`), { dateStyle: "medium" })}</td>
                    <td className="px-5 py-2.5"><Link href={`/expenses/${c.id}`} className="font-mono text-primary hover:underline">{c.number}</Link></td>
                    <td className="px-5 py-2.5"><span className="font-mono text-xs text-muted">{c.employeeCode}</span> {c.employee}</td>
                    <td className="px-5 py-2.5">{c.title}</td>
                    <td className="num px-5 py-2.5 text-right">{rupees(c.total)}</td>
                    <td className="px-5 py-2.5"><StatusBadge status={TONE[c.status] ?? "closed"} label={t(`expenses.claims.statuses.${c.status}`)} /></td>
                  </tr>
                ))}
                {!claims.length ? <tr><td colSpan={6} className="px-5 py-10 text-center text-muted">{t("expenses.claims.none")}</td></tr> : null}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
