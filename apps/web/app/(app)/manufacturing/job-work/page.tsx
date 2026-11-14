import Link from "next/link";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { CancelDocument } from "@/components/CancelDocument";
import { JobWorkForms, type Challan } from "@/components/mfg/JobWork";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, PageHeader } from "@/components/ui";
import { localName, rupees, todayIso } from "@/lib/format";
import { customers, items, suppliers } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("mfg.jobWork"))("title") };
}

interface Itc04 {
  sent: { challan: string; date: string; jobWorker: string; item: string; hsn: string | null; uqc: string; qty: string; value: string; type: string }[];
  received: { challan: string; date: string; originalChallan: string; jobWorker: string; item: string; qty: string }[];
  pending: { challan: string; date: string; jobWorker: string; item: string; qty: string; value: string; returnBy: string; overdue: boolean }[];
}
const n = (v: string) => Number(v).toLocaleString("en-IN", { maximumFractionDigits: 4 });

/** The half-year containing a date, or the one chosen: "2026-h1" is April–September 2026. */
function half(key: string | undefined) {
  const today = todayIso();
  const fallback = today.slice(5) >= "10-01" ? `${today.slice(0, 4)}-h2` : today.slice(5) >= "04-01" ? `${today.slice(0, 4)}-h1` : `${Number(today.slice(0, 4)) - 1}-h2`;
  const k = key && /^\d{4}-h[12]$/.test(key) ? key : fallback;
  const y = Number(k.slice(0, 4));
  return k.endsWith("h1") ? { key: k, from: `${y}-04-01`, to: `${y}-09-30`, h: "h1" as const, y } : { key: k, from: `${y}-10-01`, to: `${y + 1}-03-31`, h: "h2" as const, y };
}

export default async function JobWorkPage({ searchParams }: { searchParams: Promise<{ half?: string }> }) {
  const period = half((await searchParams).half);
  const t = await getTranslations();
  const locale = await getLocale();
  const format = await getFormatter();
  const [rows, report, me, list, sups, custs] = await Promise.all([
    serverApi<Challan[]>("/job-work"), serverApi<Itc04>(`/job-work/itc04?from=${period.from}&to=${period.to}`), serverApi<Me>("/auth/me"), items(), suppliers(), customers(),
  ]);
  const day = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  const itemName = (id: string) => { const i = list.find((x) => x.id === id); return i ? localName(i, locale) : ""; };
  const open = rows.filter((r) => r.direction === "out" && r.status === "posted" && r.pending?.some((p) => Number(p.pending) > 0));
  const halves = [0, 1, 2, 3].map((i) => { let y = period.y; let h = period.h; for (let j = 0; j < i; j++) { if (h === "h2") h = "h1"; else { h = "h2"; y -= 1; } } return `${y}-${h}`; });
  return (
    <>
      <PageHeader title={t("mfg.jobWork.title")} subtitle={t("mfg.jobWork.subtitle")} />
      <div className="flex flex-col gap-6">
        {me.permissions.includes("inventory.create") ? <JobWorkForms items={list} parties={[...sups, ...custs.filter((c) => !sups.some((s) => s.id === c.id))]} open={open} /> : null}
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="text-left text-muted"><tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">{t("common.date")}</th>
                <th className="px-5 py-3 font-medium">{t("vouchers.number")}</th>
                <th className="px-5 py-3 font-medium">{t("mfg.jobWork.jobWorker")}</th>
                <th className="px-5 py-3 font-medium">{t("mfg.boms.component")}</th>
                <th className="px-5 py-3 font-medium">{t("mfg.jobWork.pending")}</th>
                <th className="px-5 py-3" />
              </tr></thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id} className="border-b border-border align-top last:border-0">
                    <td className="px-5 py-2.5 whitespace-nowrap">{day(c.date)}</td>
                    <td className="px-5 py-2.5 font-mono">{c.number}{c.status === "cancelled" ? <span className="ml-2"><StatusBadge status="cancelled" label={t("purchase.statuses.cancelled")} /></span> : null}</td>
                    <td className="px-5 py-2.5">{c.jobWorker}{c.process ? <span className="block text-xs text-muted">{c.process}</span> : null}</td>
                    <td className="px-5 py-2.5">
                      {c.lines.map((l, i) => <span key={i} className="block">{c.direction === "out" ? "→" : "←"} {itemName(l.itemId)} <span className="num">{n(l.qty)}</span></span>)}
                      {Number(c.charges) ? <span className="block text-xs text-muted">{t("mfg.jobWork.charges")}: {rupees(c.charges)}</span> : null}
                    </td>
                    <td className="px-5 py-2.5">{c.pending?.filter((p) => Number(p.pending) > 0).map((p, i) => <span key={i} className="num block">{itemName(p.itemId)} {n(p.pending)}</span>)}</td>
                    <td className="px-5 py-2.5">{c.status === "posted" && me.permissions.includes("inventory.cancel") ? <CancelDocument path={`/job-work/${c.id}/cancel`} label={t("common.cancel")} /> : null}</td>
                  </tr>
                ))}
                {!rows.length ? <tr><td colSpan={6} className="px-5 py-10 text-center text-muted">{t("mfg.jobWork.none")}</td></tr> : null}
              </tbody>
            </table>
          </div>
        </Card>
        <Card className="p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
            <h2 className="font-semibold">{t("mfg.jobWork.itc04")}</h2>
            <div className="flex flex-wrap gap-2 text-sm">
              {halves.map((k) => {
                const y = Number(k.slice(0, 4));
                const label = k.endsWith("h1") ? `${t("mfg.jobWork.halves.h1")} ${y}` : `${t("mfg.jobWork.halves.h2")} ${y}-${String((y + 1) % 100).padStart(2, "0")}`;
                return <Link key={k} href={`?half=${k}`} className={`rounded-full px-3 py-1 ${k === period.key ? "bg-primary text-on-primary" : "bg-surface-2 hover:bg-surface-2/70"}`}>{label}</Link>;
              })}
            </div>
          </div>
          {[
            { title: t("mfg.jobWork.sentTable"), rows: report.sent.map((r) => [r.challan, day(r.date), r.jobWorker, `${r.item} (${r.hsn ?? ""})`, `${n(r.qty)} ${r.uqc}`, rupees(r.value)]) },
            { title: t("mfg.jobWork.receivedTable"), rows: report.received.map((r) => [r.challan, day(r.date), r.jobWorker, `${r.item} ← ${r.originalChallan}`, n(r.qty), ""]) },
            { title: t("mfg.jobWork.pendingTable"), rows: report.pending.map((r) => [r.challan, day(r.date), r.jobWorker, r.item, n(r.qty), `${rupees(r.value)} · ${t("mfg.jobWork.returnBy")} ${day(r.returnBy)}${r.overdue ? ` (${t("mfg.jobWork.overdue")})` : ""}`]) },
          ].map((s) => (
            <div key={s.title} className="px-5 py-3">
              <h3 className="mb-2 text-sm font-medium text-muted">{s.title}</h3>
              {s.rows.length ? (
                <table className="w-full text-sm"><tbody>
                  {s.rows.map((r, i) => <tr key={i} className="border-b border-border last:border-0">{r.map((c, j) => <td key={j} className={`py-1.5 pr-4 ${j >= 4 ? "num text-right" : ""} ${j === 0 ? "font-mono" : ""}`}>{c}</td>)}</tr>)}
                </tbody></table>
              ) : <p className="text-sm text-muted">-</p>}
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}
