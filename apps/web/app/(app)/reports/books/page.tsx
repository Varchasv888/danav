import clsx from "clsx";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import type { Group } from "@/components/accounts/ChartOfAccounts";
import { Button, Field, Input, PageHeader, Select } from "@/components/ui";
import { fyStart, rupees, todayIso } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

const VIEWS = ["cash", "bank", "group", "expense", "flow", "rcm", "adjust"] as const;
type View = (typeof VIEWS)[number];
type Props = { searchParams: Promise<{ view?: string; from?: string; to?: string; group?: string }> };

interface Book { opening: string; receipts: string; payments: string; closing: string; accounts: { id: string; name: string; opening: string; receipts: string; payments: string; closing: string }[]; days: { date: string; receipts: string; payments: string; closing: string }[] }
interface GroupMonth { group: string; opening: string; accounts: number; months: { month: string; debit: string; credit: string; closing: string }[] }
interface Expense { rows: { accountId: string; name: string; group: string; amount: string; vouchers: number }[]; total: string }
interface Rcm { rows: { id: string; number: string; date: string; supplier: string; gstin: string | null; invoiceNo: string; taxable: string; cgst: string; sgst: string; igst: string; cess: string }[]; totals: { taxable: string; cgst: string; sgst: string; igst: string; cess: string } }
interface Adjust { rows: { id: string; voucher: string; date: string; bill: string; billDate: string; party: string; amount: string }[]; total: string }
interface Flow { rows: { group: string; moneyIn: string; moneyOut: string; net: string }[]; moneyIn: string; moneyOut: string; net: string }

export async function generateMetadata({ searchParams }: Props) {
  const { view } = await searchParams;
  return { title: (await getTranslations("books"))(VIEWS.find((v) => v === view) ?? "cash") };
}

const th = "px-3 py-1.5 text-xs font-semibold text-muted";
const num = "num px-3 py-1.5 text-right";

/** Cash book, bank book, a group month by month, cash and bank expense, and cash flow, over a date range. */
export default async function BooksPage({ searchParams }: Props) {
  const sp = await searchParams;
  const view: View = VIEWS.find((v) => v === sp.view) ?? "cash";
  const t = await getTranslations("books");
  const tc = await getTranslations("common");
  const format = await getFormatter();
  const day = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  const month = (ym: string) => format.dateTime(new Date(`${ym}-01T00:00:00`), { month: "long", year: "numeric" });
  const to = sp.to ?? todayIso();
  const from = sp.from ?? fyStart(to);
  const q = `from=${from}&to=${to}`;
  const groups = view === "group" ? await serverApi<Group[]>("/accounts/groups") : [];
  const groupId = groups.find((g) => g.id === sp.group)?.id ?? groups.find((g) => g.key === "cash_in_hand")?.id ?? groups[0]?.id ?? "";

  const book = view === "cash" || view === "bank" ? await serverApi<Book>(`/reports/cash-book?kind=${view}&${q}`) : null;
  const gm = view === "group" && groupId ? await serverApi<GroupMonth>(`/reports/group-month?groupId=${groupId}&${q}`) : null;
  const ex = view === "expense" ? await serverApi<Expense>(`/reports/cash-bank-expense?${q}`) : null;
  const rcm = view === "rcm" ? await serverApi<Rcm>(`/reports/rcm-register?${q}`) : null;
  const adj = view === "adjust" ? await serverApi<Adjust>(`/reports/bill-adjustments?${q}`) : null;
  const flow = view === "flow" ? await serverApi<Flow>(`/reports/cash-flow?${q}`) : null;

  return (
    <>
      <PageHeader icon={BookOpen} title={t("title")} subtitle={t("subtitle")} print />
      <nav aria-label={t("title")} className="mb-3 flex flex-wrap gap-1 print:hidden">
        {VIEWS.map((v) => (
          <Link key={v} href={`/reports/books?view=${v}&${q}`} aria-current={v === view ? "page" : undefined}
            className={clsx("rounded-md px-3 py-1.5 text-[0.9286rem] font-semibold", v === view ? "bg-primary-soft text-primary" : "text-muted hover:bg-surface-2 hover:text-text")}>{t(v)}</Link>
        ))}
      </nav>
      <form method="get" className="mb-4 flex flex-wrap items-end gap-3 print:hidden">
        <input type="hidden" name="view" value={view} />
        {view === "group" ? (
          <Field label={t("pickGroup")} htmlFor="bk-group">
            <Select id="bk-group" name="group" defaultValue={groupId} className="w-56">{groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}</Select>
          </Field>
        ) : null}
        <Field label={tc("from")} htmlFor="bk-from"><Input id="bk-from" type="date" name="from" defaultValue={from} /></Field>
        <Field label={tc("to")} htmlFor="bk-to"><Input id="bk-to" type="date" name="to" defaultValue={to} /></Field>
        <Button type="submit" variant="outline">{t("show")}</Button>
      </form>

      <div className="overflow-x-auto rounded-md border border-border bg-surface">
        {book ? (
          <>
            <table className="w-full text-[0.9286rem]">
              <thead><tr className="border-b border-border bg-surface-2 text-left"><th className={th}>{t("accounts")}</th><th className={clsx(th, "text-right")}>{t("opening")}</th><th className={clsx(th, "text-right")}>{t("receipts")}</th><th className={clsx(th, "text-right")}>{t("payments")}</th><th className={clsx(th, "text-right")}>{t("closing")}</th></tr></thead>
              <tbody>
                {book.accounts.map((a) => (
                  <tr key={a.id} className="border-b border-rule"><td className="px-3 py-1.5 font-medium">{a.name}</td><td className={num}>{rupees(a.opening)}</td><td className={num}>{rupees(a.receipts)}</td><td className={num}>{rupees(a.payments)}</td><td className={clsx(num, "font-semibold")}>{rupees(a.closing)}</td></tr>
                ))}
                <tr className="bg-surface-2 font-semibold"><td className="px-3 py-1.5">{t("total")}</td><td className={num}>{rupees(book.opening)}</td><td className={num}>{rupees(book.receipts)}</td><td className={num}>{rupees(book.payments)}</td><td className={num}>{rupees(book.closing)}</td></tr>
              </tbody>
            </table>
            <h2 className="border-y border-border bg-surface-2 px-3 py-1 text-[0.8571rem] font-semibold text-muted">{t("byDay")}</h2>
            <table className="w-full text-[0.9286rem]">
              <thead><tr className="border-b border-border text-left"><th className={th}>{tc("date")}</th><th className={clsx(th, "text-right")}>{t("receipts")}</th><th className={clsx(th, "text-right")}>{t("payments")}</th><th className={clsx(th, "text-right")}>{t("closing")}</th></tr></thead>
              <tbody>
                {book.days.map((d) => <tr key={d.date} className="border-b border-rule last:border-0"><td className="px-3 py-1.5">{day(d.date)}</td><td className={num}>{rupees(d.receipts)}</td><td className={num}>{rupees(d.payments)}</td><td className={num}>{rupees(d.closing)}</td></tr>)}
              </tbody>
            </table>
            {!book.days.length ? <p className="px-3 py-6 text-center text-muted">{t("empty")}</p> : null}
          </>
        ) : null}

        {view === "group" ? (
          gm ? (
            <>
              <p className="border-b border-border px-3 py-2 text-[0.9286rem]"><b>{gm.group}</b> <span className="text-muted">({t("accounts")}: {gm.accounts}; {t("opening")}: {rupees(gm.opening)})</span></p>
              {gm.accounts ? (
                <table className="w-full text-[0.9286rem]">
                  <thead><tr className="border-b border-border bg-surface-2 text-left"><th className={th}>{t("month")}</th><th className={clsx(th, "text-right")}>{t("debit")}</th><th className={clsx(th, "text-right")}>{t("credit")}</th><th className={clsx(th, "text-right")}>{t("closing")}</th></tr></thead>
                  <tbody>{gm.months.map((m) => <tr key={m.month} className="border-b border-rule last:border-0"><td className="px-3 py-1.5">{month(m.month)}</td><td className={num}>{rupees(m.debit)}</td><td className={num}>{rupees(m.credit)}</td><td className={clsx(num, "font-semibold")}>{rupees(m.closing)}</td></tr>)}</tbody>
                </table>
              ) : <p className="px-3 py-6 text-center text-muted">{t("noAccounts")}</p>}
            </>
          ) : null
        ) : null}

        {ex ? (
          ex.rows.length ? (
            <table className="w-full text-[0.9286rem]">
              <thead><tr className="border-b border-border bg-surface-2 text-left"><th className={th}>{t("expenseAccount")}</th><th className={th}>{t("group")}</th><th className={clsx(th, "text-right")}>{t("vouchers")}</th><th className={clsx(th, "text-right")}>{tc("total")}</th></tr></thead>
              <tbody>
                {ex.rows.map((r) => <tr key={r.accountId} className="border-b border-rule"><td className="px-3 py-1.5 font-medium">{r.name}</td><td className="px-3 py-1.5 text-muted">{r.group}</td><td className={num}>{r.vouchers}</td><td className={num}>{rupees(r.amount)}</td></tr>)}
                <tr className="bg-surface-2 font-semibold"><td className="px-3 py-1.5" colSpan={3}>{t("total")}</td><td className={num}>{rupees(ex.total)}</td></tr>
              </tbody>
            </table>
          ) : <p className="px-3 py-6 text-center text-muted">{t("empty")}</p>
        ) : null}

        {rcm ? (
          rcm.rows.length ? (
            <table className="w-full text-[0.9286rem]">
              <thead><tr className="border-b border-border bg-surface-2 text-left"><th className={th}>{tc("date")}</th><th className={th}>{t("supplier")}</th><th className={th}>{t("invoice")}</th><th className={clsx(th, "text-right")}>{t("taxable")}</th><th className={clsx(th, "text-right")}>{t("cgst")}</th><th className={clsx(th, "text-right")}>{t("sgst")}</th><th className={clsx(th, "text-right")}>{t("igst")}</th><th className={clsx(th, "text-right")}>{t("cess")}</th></tr></thead>
              <tbody>
                {rcm.rows.map((r) => <tr key={r.id} className="border-b border-rule"><td className="px-3 py-1.5">{day(r.date)}</td><td className="px-3 py-1.5"><span className="font-medium">{r.supplier}</span>{r.gstin ? <span className="ml-2 font-mono text-xs text-muted">{r.gstin}</span> : null}</td><td className="px-3 py-1.5 font-mono text-xs">{r.invoiceNo}</td><td className={num}>{rupees(r.taxable)}</td><td className={num}>{rupees(r.cgst)}</td><td className={num}>{rupees(r.sgst)}</td><td className={num}>{rupees(r.igst)}</td><td className={num}>{rupees(r.cess)}</td></tr>)}
                <tr className="bg-surface-2 font-semibold"><td className="px-3 py-1.5" colSpan={3}>{t("total")}</td><td className={num}>{rupees(rcm.totals.taxable)}</td><td className={num}>{rupees(rcm.totals.cgst)}</td><td className={num}>{rupees(rcm.totals.sgst)}</td><td className={num}>{rupees(rcm.totals.igst)}</td><td className={num}>{rupees(rcm.totals.cess)}</td></tr>
              </tbody>
            </table>
          ) : <p className="px-3 py-6 text-center text-muted">{t("empty")}</p>
        ) : null}

        {adj ? (
          adj.rows.length ? (
            <table className="w-full text-[0.9286rem]">
              <thead><tr className="border-b border-border bg-surface-2 text-left"><th className={th}>{tc("date")}</th><th className={th}>{t("voucher")}</th><th className={th}>{t("party")}</th><th className={th}>{t("bill")}</th><th className={clsx(th, "text-right")}>{t("amount")}</th></tr></thead>
              <tbody>
                {adj.rows.map((r) => <tr key={r.id} className="border-b border-rule"><td className="px-3 py-1.5">{day(r.date)}</td><td className="px-3 py-1.5 font-mono text-xs">{r.voucher}</td><td className="px-3 py-1.5 font-medium">{r.party}</td><td className="px-3 py-1.5"><span className="font-mono text-xs">{r.bill}</span> <span className="text-muted">({day(r.billDate)})</span></td><td className={num}>{rupees(r.amount)}</td></tr>)}
                <tr className="bg-surface-2 font-semibold"><td className="px-3 py-1.5" colSpan={4}>{t("total")}</td><td className={num}>{rupees(adj.total)}</td></tr>
              </tbody>
            </table>
          ) : <p className="px-3 py-6 text-center text-muted">{t("empty")}</p>
        ) : null}

        {flow ? (
          flow.rows.length ? (
            <table className="w-full text-[0.9286rem]">
              <thead><tr className="border-b border-border bg-surface-2 text-left"><th className={th}>{t("otherSide")}</th><th className={clsx(th, "text-right")}>{t("moneyIn")}</th><th className={clsx(th, "text-right")}>{t("moneyOut")}</th><th className={clsx(th, "text-right")}>{t("net")}</th></tr></thead>
              <tbody>
                {flow.rows.map((r) => <tr key={r.group} className="border-b border-rule"><td className="px-3 py-1.5 font-medium">{r.group}</td><td className={num}>{rupees(r.moneyIn)}</td><td className={num}>{rupees(r.moneyOut)}</td><td className={num}>{rupees(r.net)}</td></tr>)}
                <tr className="bg-surface-2 font-semibold"><td className="px-3 py-1.5">{t("total")}</td><td className={num}>{rupees(flow.moneyIn)}</td><td className={num}>{rupees(flow.moneyOut)}</td><td className={num}>{rupees(flow.net)}</td></tr>
              </tbody>
            </table>
          ) : <p className="px-3 py-6 text-center text-muted">{t("empty")}</p>
        ) : null}
      </div>
      {view === "flow" ? <p className="mt-3 text-sm"><Link href={`/reports/cash-flow-statement?from=${from}&to=${to}`} className="font-semibold text-primary hover:underline">{t("statementLink")}</Link></p> : null}
    </>
  );
}
