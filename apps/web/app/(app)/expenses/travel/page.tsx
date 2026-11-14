import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { Card, PageHeader } from "@/components/ui";
import { todayIso } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

interface Travel {
  total: string;
  people: { employeeId: string; name: string; trips: number; km: string; amount: string; lines: { claim: string; status: string; date: string; from: string; to: string; km: string | null; days: number | null; amount: string }[] }[];
}

export async function generateMetadata() {
  return { title: (await getTranslations("travelRegister"))("title") };
}

/** Trips claimed in a period by person: how many, how far and what was paid, each on an ordinary expense claim. */
export default async function TravelPage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  const q = await searchParams;
  const to = q.to && /^\d{4}-\d{2}-\d{2}$/.test(q.to) ? q.to : todayIso();
  const from = q.from && /^\d{4}-\d{2}-\d{2}$/.test(q.from) ? q.from : `${to.slice(0, 7)}-01`;
  const t = await getTranslations("travelRegister");
  const format = await getFormatter();
  const r = await serverApi<Travel>(`/reports/travel-claims?from=${from}&to=${to}`);
  const money = (v: string) => format.number(Number(v), { style: "currency", currency: "INR" });
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <form method="get" className="mb-4 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm">{t("from")}<input type="date" name="from" defaultValue={from} className="h-9 rounded-md border border-border bg-surface px-2" /></label>
        <label className="flex flex-col gap-1 text-sm">{t("to")}<input type="date" name="to" defaultValue={to} className="h-9 rounded-md border border-border bg-surface px-2" /></label>
        <button type="submit" className="h-9 rounded-md border border-border px-3 text-sm hover:bg-surface-2">{t("show")}</button>
      </form>
      {r.people.length === 0 ? <Card className="p-4 text-sm text-muted">{t("empty")}</Card> : r.people.map((p) => (
        <Card key={p.employeeId} className="mb-3 p-0">
          <div className="flex items-center justify-between border-b border-border px-4 py-2"><span className="font-medium">{p.name}</span><span className="num text-sm">{t("summary", { trips: p.trips, km: p.km })} · <span className="font-semibold">{money(p.amount)}</span></span></div>
          <table className="w-full text-sm"><tbody>{p.lines.map((l, i) => (
            <tr key={i} className="border-b border-rule last:border-0"><td className="px-4 py-1.5">{l.date}</td><td className="px-4 py-1.5">{l.from}{l.to ? ` → ${l.to}` : ""}</td><td className="num px-4 py-1.5 text-right">{l.km ? `${l.km} km` : ""}{l.days ? ` · ${t("days", { n: l.days })}` : ""}</td><td className="num px-4 py-1.5 text-right">{money(l.amount)}</td><td className="px-4 py-1.5 text-muted">{l.claim}</td></tr>
          ))}</tbody></table>
        </Card>
      ))}
      {r.people.length ? <p className="text-sm font-medium">{t("total")}: <span className="num">{money(r.total)}</span></p> : null}
      <p className="mt-3 text-sm"><Link href="/expenses" className="text-primary hover:underline">{t("claims")}</Link></p>
    </>
  );
}
