import { AlertTriangle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { StatusBadge } from "@/components/StatusBadge";
import { VoidBill } from "@/components/pos/VoidBill";
import { Button, Card, Input, PageHeader } from "@/components/ui";
import { rupees, todayIso } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("pos.bills"))("title") };
}

interface Bill { id: string; number: string; date: string; createdAt: string; customerPhone: string | null; customerName: string | null; total: string; status: string; payments: { mode: string; amount: string }[]; mismatch: unknown; voidReason: string | null }
interface Summary { bills: number; voided: number; total: string; discount: string; cash: string; upi: string; card: string; credit: string; taxByRate: { rate: string; taxable: string; tax: string }[]; topItems: { name: string; qty: string; amount: string }[] }

export default async function PosBillsPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const raw = (await searchParams).date;
  const date = raw && /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : todayIso();
  const t = await getTranslations();
  const [bills, s, me] = await Promise.all([serverApi<Bill[]>(`/pos/bills?date=${date}`), serverApi<Summary>(`/pos/summary?date=${date}`), serverApi<Me>("/auth/me")]);
  const canVoid = date === todayIso() && me.permissions.includes("sales.cancel");
  const canReturn = me.permissions.includes("sales.create");
  const stat = (label: string, v: string) => <Card><div className="text-sm text-muted">{label}</div><div className="num text-xl font-semibold">{v}</div></Card>;
  return (
    <>
      <PageHeader title={t("pos.bills.title")} subtitle={t("pos.bills.subtitle")}
        actions={(
          <form className="flex items-end gap-3">
            <Input type="date" name="date" defaultValue={date} aria-label={t("pos.bills.date")} className="w-44" />
            <Button type="submit" variant="outline">{t("common.apply")}</Button>
          </form>
        )} />
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-6">
          {stat(t("pos.billing.bills"), `${s.bills}${s.voided ? ` (+${s.voided} ${t("pos.bills.voided").toLowerCase()})` : ""}`)}
          {stat(t("pos.billing.total"), rupees(s.total))}
          {stat(t("pos.billing.modes.cash"), rupees(s.cash))}
          {stat(t("pos.billing.modes.upi"), rupees(s.upi))}
          {stat(t("pos.billing.modes.card"), rupees(s.card))}
          {stat(t("pos.billing.modes.credit"), rupees(s.credit))}
        </div>
        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <Card className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-sm">
                <thead className="text-left text-muted"><tr className="border-b border-border">
                  <th className="px-5 py-3 font-medium">{t("pos.bills.number")}</th>
                  <th className="px-5 py-3 font-medium">{t("pos.bills.time")}</th>
                  <th className="px-5 py-3 font-medium">{t("sales.customer")}</th>
                  <th className="px-5 py-3 font-medium">{t("pos.bills.mode")}</th>
                  <th className="px-5 py-3 text-right font-medium">{t("pos.billing.total")}</th>
                  <th className="px-5 py-3" />
                </tr></thead>
                <tbody>
                  {bills.map((b) => (
                    <tr key={b.id} className="border-b border-border align-top last:border-0">
                      <td className="px-5 py-2.5">
                        <a href={`/print/receipt/${b.id}`} target="_blank" rel="noreferrer" className="font-mono text-primary hover:underline">{b.number}</a>
                        {b.mismatch ? <span className="ml-2 inline-flex items-center gap-1 text-xs text-accent" title={JSON.stringify(b.mismatch)}><AlertTriangle className="size-3" aria-hidden />{t("pos.bills.mismatch")}</span> : null}
                      </td>
                      <td className="px-5 py-2.5 whitespace-nowrap">{new Date(b.createdAt).toLocaleTimeString("en-IN", { timeStyle: "short", timeZone: "Asia/Kolkata" })}</td>
                      <td className="px-5 py-2.5">{b.customerName ?? ""}{b.customerPhone ? <span className="block font-mono text-xs text-muted">{b.customerPhone}</span> : null}</td>
                      <td className="px-5 py-2.5">{[...new Set(b.payments.map((p) => t(`pos.billing.modes.${p.mode}`)))].join(" + ")}</td>
                      <td className={`num px-5 py-2.5 text-right ${b.status === "void" ? "text-muted line-through" : ""}`}>{rupees(b.total)}</td>
                      <td className="px-5 py-2.5 text-right">
                        {b.status === "void" ? <span title={b.voidReason ?? ""}><StatusBadge status="void" label={t("pos.bills.voided")} /></span> : (
                          <span className="inline-flex items-center gap-3">
                            {canReturn ? <a href={`/pos/returns?bill=${encodeURIComponent(b.number)}`} className="text-sm text-primary hover:underline">{t("posReturns.return")}</a> : null}
                            {canVoid ? <VoidBill id={b.id} /> : null}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!bills.length ? <tr><td colSpan={6} className="px-5 py-10 text-center text-muted">{t("pos.bills.none")}</td></tr> : null}
                </tbody>
              </table>
            </div>
          </Card>
          <div className="flex flex-col gap-6">
            <Card className="p-0">
              <div className="border-b border-border px-5 py-3 font-semibold">{t("pos.bills.topItems")}</div>
              <ul className="divide-y divide-border text-sm">
                {s.topItems.map((i) => <li key={i.name} className="flex justify-between px-5 py-2"><span>{i.name} <span className="num text-muted">× {Number(i.qty)}</span></span><span className="num">{rupees(i.amount)}</span></li>)}
                {!s.topItems.length ? <li className="px-5 py-4 text-muted">-</li> : null}
              </ul>
            </Card>
            <Card className="p-0">
              <div className="border-b border-border px-5 py-3 font-semibold">{t("pos.billing.tax")}</div>
              <table className="w-full text-sm"><tbody>
                {s.taxByRate.map((r) => <tr key={r.rate} className="border-b border-border last:border-0"><td className="px-5 py-2">{Number(r.rate)}%</td><td className="num px-5 py-2 text-right">{rupees(r.taxable)}</td><td className="num px-5 py-2 text-right">{rupees(r.tax)}</td></tr>)}
              </tbody></table>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
