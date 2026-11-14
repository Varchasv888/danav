import { BookOpen } from "lucide-react";
import Link from "next/link";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { DateFilter } from "@/components/DateFilter";
import { Card, PageHeader } from "@/components/ui";
import { drCr, fyStart, localName, rupees, todayIso } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

interface Row { id: number; date: string; debit: string; credit: string; isReversal: boolean; voucherId: string; number: string; type: string; narration: string | null; counterparts: string | null; balance: string }
interface Ledger { account: { id: string; name: string; nameHi: string | null }; opening: string; closing: string; rows: Row[] }

/**
 * A ledger the way an accountant reads it: opening balance, then each entry with its voucher type and number, debit and credit in
 * ruled columns, the running balance beside them, a subtotal at the end of every month, and the closing balance. The column heads
 * and the closing row stay in view while the entries scroll.
 */
export default async function LedgerPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ from?: string; to?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  const to = sp.to ?? todayIso();
  const from = sp.from ?? fyStart(to);
  const t = await getTranslations();
  const locale = await getLocale();
  const format = await getFormatter();
  const l = await serverApi<Ledger>(`/reports/ledger/${id}?from=${from}&to=${to}`);
  const labels = { dr: t("common.dr"), cr: t("common.cr") };
  const date = (d: string) => format.dateTime(new Date(`${d}T00:00:00`), { day: "2-digit", month: "short", year: "numeric" });
  const monthName = (ym: string) => format.dateTime(new Date(`${ym}-01T00:00:00`), { month: "long", year: "numeric" });
  const kind = (type: string) => (t.has(`vouchers.types.${type}`) ? t(`vouchers.types.${type}`) : type.replace(/_/g, " "));

  const sum = (rows: Row[], k: "debit" | "credit") => rows.reduce((s, r) => s + Number(r[k]), 0);
  const totalDr = sum(l.rows, "debit"), totalCr = sum(l.rows, "credit");
  // Entries grouped by month, each with its own totals and the balance at the month's end.
  const months: { ym: string; rows: Row[] }[] = [];
  for (const r of l.rows) {
    const ym = r.date.slice(0, 7);
    const last = months[months.length - 1];
    if (last && last.ym === ym) last.rows.push(r); else months.push({ ym, rows: [r] });
  }
  const ruled = "border-l border-border";

  return (
    <>
      <PageHeader icon={BookOpen} print title={t("reports.ledgerTitle", { account: localName(l.account, locale) })} subtitle={`${date(from)} - ${date(to)}`} actions={<DateFilter from={from} to={to} />} />
      <section aria-label={t("ledger.summary")} className="mb-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-5">
        {[
          [t("reports.opening"), drCr(l.opening, labels)], [t("ledger.totalDebit"), rupees(totalDr)], [t("ledger.totalCredit"), rupees(totalCr)],
          [t("reports.closing"), drCr(l.closing, labels)], [t("ledger.entries"), String(l.rows.length)],
        ].map(([label, value]) => (
          <div key={label} className="bg-surface px-4 py-2.5">
            <p className="text-[0.8125rem] text-muted">{label}</p>
            <p className="num mt-0.5 text-[1.0714rem] font-semibold">{value}</p>
          </div>
        ))}
      </section>
      <Card className="p-0">
        <div className="max-h-[calc(100dvh-18rem)] min-h-48 overflow-auto">
          <table className="w-full min-w-[820px] border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="text-left text-[0.8125rem] text-muted">
                {[
                  [t("common.date"), "", "w-28"], [t("reports.particulars"), "", ""], [t("ledger.voucher"), "", "w-44"],
                  [t("common.debit"), `text-right ${ruled}`, "w-32"], [t("common.credit"), `text-right ${ruled}`, "w-32"], [t("common.balance"), `text-right ${ruled}`, "w-36"],
                ].map(([label, cls, width]) => <th key={label} scope="col" className={`sticky top-0 z-10 border-b border-border-strong bg-surface-2 px-4 py-2.5 font-semibold ${cls} ${width}`}>{label}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr className="bg-surface-2/60 font-medium">
                <td className="border-b border-border px-4 py-2 whitespace-nowrap">{date(from)}</td>
                <td className="border-b border-border px-4 py-2" colSpan={2}>{t("reports.opening")}</td>
                <td className={`border-b border-border px-4 py-2 ${ruled}`} /><td className={`border-b border-border px-4 py-2 ${ruled}`} />
                <td className={`num border-b border-border px-4 py-2 text-right ${ruled}`}>{drCr(l.opening, labels)}</td>
              </tr>
              {months.map((m) => (
                <MonthBlock key={m.ym} ym={m.ym} title={monthName(m.ym)} rows={m.rows} labels={labels} date={date} kind={kind} ruled={ruled} subtotalLabel={t("ledger.monthTotal")} />
              ))}
              {!l.rows.length ? <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">{t("ledger.none")}</td></tr> : null}
            </tbody>
            <tfoot>
              <tr className="font-semibold">
                <td className="sticky bottom-0 border-t-2 border-border-strong bg-surface px-4 py-2.5 whitespace-nowrap">{date(to)}</td>
                <td className="sticky bottom-0 border-t-2 border-border-strong bg-surface px-4 py-2.5" colSpan={2}>{t("ledger.periodTotal")}</td>
                <td className={`num sticky bottom-0 border-t-2 border-border-strong bg-surface px-4 py-2.5 text-right ${ruled}`}>{rupees(totalDr)}</td>
                <td className={`num sticky bottom-0 border-t-2 border-border-strong bg-surface px-4 py-2.5 text-right ${ruled}`}>{rupees(totalCr)}</td>
                <td className={`num sticky bottom-0 border-t-2 border-border-strong bg-surface px-4 py-2.5 text-right ${ruled}`}>{drCr(l.closing, labels)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </>
  );
}

function MonthBlock({ ym, title, rows, labels, date, kind, ruled, subtotalLabel }: {
  ym: string; title: string; rows: Row[]; labels: { dr: string; cr: string }; date: (d: string) => string; kind: (t: string) => string; ruled: string; subtotalLabel: string;
}) {
  const dr = rows.reduce((s, r) => s + Number(r.debit), 0), cr = rows.reduce((s, r) => s + Number(r.credit), 0);
  return (
    <>
      <tr><th scope="rowgroup" colSpan={6} className="border-b border-border bg-surface px-4 pt-3 pb-1 text-left text-[0.8125rem] font-semibold text-muted">{title}</th></tr>
      {rows.map((r) => (
        <tr key={`${ym}${r.id}`} className={`hover:bg-surface-2/50 ${r.isReversal ? "text-muted italic" : ""}`}>
          <td className="border-b border-rule px-4 py-2 whitespace-nowrap align-top">{date(r.date)}</td>
          <td className="border-b border-rule px-4 py-2 align-top">
            {r.counterparts}
            {r.narration ? <span className="block text-xs text-muted">{r.narration}</span> : null}
          </td>
          <td className="border-b border-rule px-4 py-2 whitespace-nowrap align-top">
            <span className="mr-2 rounded bg-surface-2 px-1.5 py-0.5 text-xs text-muted not-italic">{kind(r.type)}</span>
            <Link href={`/accounts/vouchers/${r.voucherId}`} className="font-mono text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary">{r.number}</Link>
          </td>
          <td className={`num border-b border-rule px-4 py-2 text-right align-top ${ruled}`}>{Number(r.debit) ? rupees(r.debit) : ""}</td>
          <td className={`num border-b border-rule px-4 py-2 text-right align-top ${ruled}`}>{Number(r.credit) ? rupees(r.credit) : ""}</td>
          <td className={`num border-b border-rule px-4 py-2 text-right align-top ${ruled}`}>{drCr(r.balance, labels)}</td>
        </tr>
      ))}
      <tr className="bg-surface-2/40 text-[0.8125rem] font-medium">
        <td className="border-b border-border px-4 py-1.5" colSpan={3}>{subtotalLabel}</td>
        <td className={`num border-b border-border px-4 py-1.5 text-right ${ruled}`}>{rupees(dr)}</td>
        <td className={`num border-b border-border px-4 py-1.5 text-right ${ruled}`}>{rupees(cr)}</td>
        <td className={`num border-b border-border px-4 py-1.5 text-right ${ruled}`}>{drCr(rows[rows.length - 1]!.balance, labels)}</td>
      </tr>
    </>
  );
}
