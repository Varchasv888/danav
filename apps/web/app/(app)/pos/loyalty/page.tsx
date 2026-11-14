import { Gift } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";
import { LoyaltyMembers, type Member } from "@/components/pos/LoyaltyMembers";
import { Card, PageHeader } from "@/components/ui";
import { rupees, todayIso } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";

interface Report { enabled: boolean; members: number; pointsHeld: number; liability: string; earned: number; redeemed: number; memberBills: number }
interface Celebration { phone: string; name: string | null; kind: "birthday" | "anniversary"; on: string; inDays: number }
type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata() {
  return { title: (await getTranslations("loyalty"))("title") };
}

/** Loyalty members: the points the shop owes, who to wish this fortnight, and each member's dates. */
export default async function LoyaltyPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const t = await getTranslations("loyalty");
  const format = await getFormatter();
  const today = todayIso();
  const monthStart = `${today.slice(0, 7)}-01`;
  const [report, soon, members, me] = await Promise.all([
    serverApi<Report>(`/loyalty/report?from=${monthStart}&to=${today}`),
    serverApi<Celebration[]>("/loyalty/upcoming?days=14"),
    serverApi<Member[]>(`/loyalty/members${q ? `?search=${encodeURIComponent(q)}` : ""}`),
    serverApi<Me>("/auth/me"),
  ]);
  const tile = (label: string, value: string) => (
    <div className="rounded-md border border-border bg-surface p-3"><div className="text-xs text-muted">{label}</div><div className="num mt-1 text-[1.25rem] font-semibold">{value}</div></div>
  );
  return (
    <>
      <PageHeader icon={Gift} title={t("title")} subtitle={t("subtitle")} />
      {!report.enabled ? <p className="mb-4 rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-muted">{t("notEnabled")}</p> : null}
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tile(t("members"), report.members.toLocaleString("en-IN"))}
        {tile(t("pointsHeld"), report.pointsHeld.toLocaleString("en-IN"))}
        {tile(t("owed"), rupees(report.liability))}
        {tile(t("thisMonth"), `+${report.earned.toLocaleString("en-IN")} / -${report.redeemed.toLocaleString("en-IN")}`)}
      </div>
      <Card className="mb-4">
        <h2 className="mb-2 text-sm font-semibold">{t("wishSoon")}</h2>
        {soon.length ? (
          <ul className="flex flex-col gap-1 text-[0.9286rem]">
            {soon.map((c) => (
              <li key={`${c.phone}-${c.kind}`} className="flex flex-wrap items-center gap-x-4">
                <span className="font-medium">{c.name ?? c.phone}</span><span className="font-mono text-xs text-muted">{c.phone}</span>
                <span>{t(`kinds.${c.kind}`)}</span>
                <span className="text-muted">{c.inDays === 0 ? t("today") : t("inDays", { n: c.inDays })} ({format.dateTime(new Date(`${c.on}T00:00:00`), { day: "numeric", month: "short" })})</span>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted">{t("noneSoon")}</p>}
      </Card>
      <LoyaltyMembers members={members} q={q} canEdit={me.permissions.includes("sales.edit")} />
    </>
  );
}
