import { HandCoins, Wallet } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";
import { DateFilter } from "../DateFilter";
import { Card, PageHeader } from "../ui";
import { rupees, todayIso } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";
import { RemindButton } from "../sharing/RemindButton";

interface Row {
  partyId: string; name: string; phone: string | null; balance: string; advance: string;
  buckets: Record<(typeof BUCKETS)[number], string>;
  openItems: { number: string; date: string; dueOn: string; amount: string; daysOverdue: number }[];
}

const BUCKETS = ["notDue", "d0_30", "d31_60", "d61_90", "d91_180", "d180plus"] as const;

/** Receivables or payables with ageing buckets; each party expands to its open bills. */
export async function Outstanding({ kind, asOf }: { kind: "receivables" | "payables"; asOf?: string }) {
  const date = asOf ?? todayIso();
  const t = await getTranslations();
  const format = await getFormatter();
  const [data, me] = await Promise.all([serverApi<{ rows: Row[]; total: string }>(`/reports/${kind}?asOf=${date}`), serverApi<Me>("/auth/me")]);
  const canRemind = kind === "receivables" && me.permissions.includes("crm.create");
  const totals = Object.fromEntries(BUCKETS.map((b) => [b, data.rows.reduce((s, r) => s + Number(r.buckets[b]), 0)]));
  const cell = (v: string | number, danger = false, key?: string) => (
    <td key={key} className={`num px-4 py-2.5 text-right ${danger && Number(v) > 0 ? "text-danger" : ""}`}>{Number(v) ? rupees(String(v)) : ""}</td>
  );

  return (
    <>
      <PageHeader icon={kind === "receivables" ? HandCoins : Wallet} print title={t(`outstanding.${kind}Title`)} subtitle={t(`outstanding.${kind}Subtitle`)} actions={<div className="flex flex-wrap items-start gap-3">{canRemind && data.rows.length ? <RemindButton asOf={date} /> : null}<DateFilter asOf={date} /></div>} />
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-4 py-3 font-medium">{t("outstanding.party")}</th>
                {BUCKETS.map((b) => <th key={b} className="px-4 py-3 text-right font-medium">{t(`outstanding.${b}`)}</th>)}
                <th className="px-4 py-3 text-right font-medium">{t("outstanding.balance")}</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((r) => (
                <tr key={r.partyId} className="border-b border-border align-top last:border-0">
                  <td className="px-4 py-2.5">
                    <details>
                      <summary className="cursor-pointer font-medium">{r.name}</summary>
                      <ul className="mt-2 space-y-1 text-xs text-muted">
                        {r.openItems.map((o) => (
                          <li key={`${o.number}${o.date}`} className="flex gap-3">
                            <span className="font-mono">{o.number}</span>
                            <span>{format.dateTime(new Date(`${o.date}T00:00:00`), { dateStyle: "medium" })}</span>
                            <span className={o.daysOverdue ? "text-danger" : ""}>{t("outstanding.overdue", { days: o.daysOverdue })}</span>
                            <span className="num ml-auto">{rupees(o.amount)}</span>
                          </li>
                        ))}
                        {Number(r.advance) ? <li>{t("outstanding.advance")}: {rupees(r.advance)}</li> : null}
                      </ul>
                    </details>
                    <span className="mt-0.5 flex items-center gap-3 text-xs text-muted">
                      {r.phone ? <span>{r.phone}</span> : null}
                      {canRemind && r.phone && Number(r.balance) > 0 ? <RemindButton accountId={r.partyId} asOf={date} compact /> : null}
                    </span>
                  </td>
                  {BUCKETS.map((b) => cell(r.buckets[b], b !== "notDue", b))}
                  <td className="num px-4 py-2.5 text-right font-semibold">{rupees(r.balance)}</td>
                </tr>
              ))}
              {!data.rows.length ? <tr><td colSpan={8} className="px-4 py-10 text-center text-muted">{t("outstanding.none")}</td></tr> : null}
            </tbody>
            {data.rows.length ? (
              <tfoot>
                <tr className="border-t-2 border-border font-semibold">
                  <td className="px-4 py-3">{t("common.total")}</td>
                  {BUCKETS.map((b) => cell(totals[b]!, false, b))}
                  <td className="num px-4 py-3 text-right">{rupees(data.total)}</td>
                </tr>
              </tfoot>
            ) : null}
          </table>
        </div>
      </Card>
    </>
  );
}
