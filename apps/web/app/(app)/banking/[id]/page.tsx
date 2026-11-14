import Link from "next/link";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { BankProfileForm, FeedPanel, ImportStatement, LinesTable, type BankLine } from "@/components/banking/Reconcile";
import { Button, Card, Input, PageHeader } from "@/components/ui";
import { localName, rupees, todayIso } from "@/lib/format";
import { ledgers } from "@/lib/ledgers";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("nav"))("bankAccounts") };
}

interface Bank { id: string; name: string; nameHi: string | null; bookBalance: string; unmatched: number; profile: { bankName: string | null; accountLast4: string | null; ifsc: string | null; feedStatus: string | null; feedFetchedTo: string | null } | null }
interface Brs {
  balancePerBooks: string; balancePerBank: string;
  notPresented: { total: string; rows: { voucherId: string; date: string; number: string; party: string | null; amount: string }[] };
  notCredited: { total: string; rows: { voucherId: string; date: string; number: string; party: string | null; amount: string }[] };
  bankDebits: { total: string; rows: { lineId: string; date: string; description: string; amount: string }[] };
  bankCredits: { total: string; rows: { lineId: string; date: string; description: string; amount: string }[] };
  statement: { date: string; balance: string; difference: string } | null;
}
const TABS = ["open", "matched", "ignored", "brs"] as const;

export default async function ReconcilePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string; asOf?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  const tab = (TABS as readonly string[]).includes(sp.tab ?? "") ? (sp.tab as (typeof TABS)[number]) : "open";
  const asOf = sp.asOf && /^\d{4}-\d{2}-\d{2}$/.test(sp.asOf) ? sp.asOf : todayIso();
  const t = await getTranslations();
  const locale = await getLocale();
  const format = await getFormatter();
  const [banks, me, l] = await Promise.all([serverApi<Bank[]>("/banking/accounts"), serverApi<Me>("/auth/me"), ledgers()]);
  const bank = banks.find((b) => b.id === id);
  if (!bank) return <PageHeader title={t("banking.errors.not_a_bank_account")} />;
  const canEdit = me.permissions.includes("banking.edit");
  const status = tab === "open" ? "unmatched" : tab === "brs" ? null : tab;
  const [lines, brs] = await Promise.all([
    status ? serverApi<BankLine[]>(`/banking/accounts/${id}/lines?status=${status}`) : Promise.resolve([]),
    tab === "brs" ? serverApi<Brs>(`/banking/accounts/${id}/reconciliation?asOf=${asOf}`) : Promise.resolve(null),
  ]);
  const day = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  const section = (label: string, total: string, rows: { key: string; date: string; text: string; amount: string; href?: string }[]) => (
    <>
      <tr className="border-t border-border"><td className="py-2 pr-4 font-medium">{label}</td><td className="num py-2 text-right font-medium">{rupees(total)}</td></tr>
      {rows.map((r) => (
        <tr key={r.key} className="text-muted"><td className="py-0.5 pr-4 pl-4">{day(r.date)} · {r.href ? <a href={r.href} className="font-mono text-primary hover:underline">{r.text}</a> : r.text}</td><td className="num py-0.5 text-right">{rupees(r.amount)}</td></tr>
      ))}
    </>
  );
  return (
    <>
      <PageHeader title={localName(bank, locale)} subtitle={<>{t("banking.accounts.bookBalance")}: <span className="num font-semibold">{rupees(bank.bookBalance)}</span></>}
        actions={<Link href="/banking" className="text-sm text-primary hover:underline">{t("banking.accounts.title")}</Link>} />
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 lg:grid-cols-2">
          {me.permissions.includes("banking.create") ? <ImportStatement accountId={id} /> : null}
          <FeedPanel accountId={id} status={bank.profile?.feedStatus ?? null} fetchedTo={bank.profile?.feedFetchedTo ?? null} canEdit={canEdit} />
        </div>
        <nav className="flex flex-wrap gap-1 border-b border-border">
          {TABS.map((x) => (
            <Link key={x} href={`?tab=${x}`} className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${x === tab ? "border-primary text-primary" : "border-transparent text-muted hover:text-text"}`}>
              {t(`banking.tabs.${x}`)}{x === "open" && bank.unmatched ? <span className="ml-1.5 rounded-full bg-accent-soft px-1.5 text-xs text-accent">{bank.unmatched}</span> : null}
            </Link>
          ))}
        </nav>
        {tab !== "brs" ? <LinesTable accountId={id} lines={lines} ledgers={l.all} tab={tab} canEdit={canEdit} /> : null}
        {brs ? (
          <Card className="flex flex-col gap-4">
            <form className="flex items-end gap-3">
              <input type="hidden" name="tab" value="brs" />
              <Input type="date" name="asOf" defaultValue={asOf} aria-label={t("banking.brs.asOf")} className="w-44" />
              <Button type="submit" variant="outline">{t("common.apply")}</Button>
            </form>
            <table className="w-full max-w-3xl text-sm">
              <tbody>
                <tr><td className="py-2 pr-4 font-semibold">{t("banking.brs.perBooks")}</td><td className="num py-2 text-right font-semibold">{rupees(brs.balancePerBooks)}</td></tr>
                {section(t("banking.brs.notPresented"), brs.notPresented.total, brs.notPresented.rows.map((r) => ({ key: r.voucherId, date: r.date, text: `${r.number}${r.party ? ` ${r.party}` : ""}`, amount: r.amount, href: `/accounts/vouchers/${r.voucherId}` })))}
                {section(t("banking.brs.notCredited"), brs.notCredited.total, brs.notCredited.rows.map((r) => ({ key: r.voucherId, date: r.date, text: `${r.number}${r.party ? ` ${r.party}` : ""}`, amount: r.amount, href: `/accounts/vouchers/${r.voucherId}` })))}
                {section(t("banking.brs.bankDebits"), brs.bankDebits.total, brs.bankDebits.rows.map((r) => ({ key: r.lineId, date: r.date, text: r.description, amount: r.amount })))}
                {section(t("banking.brs.bankCredits"), brs.bankCredits.total, brs.bankCredits.rows.map((r) => ({ key: r.lineId, date: r.date, text: r.description, amount: r.amount })))}
                <tr className="border-t-2 border-text"><td className="py-2 pr-4 font-semibold">{t("banking.brs.perBank")}</td><td className="num py-2 text-right font-semibold">{rupees(brs.balancePerBank)}</td></tr>
                {brs.statement ? (
                  <>
                    <tr><td className="py-1 pr-4 text-muted">{t("banking.brs.statement", { date: day(brs.statement.date) })}</td><td className="num py-1 text-right text-muted">{rupees(brs.statement.balance)}</td></tr>
                    <tr><td className="py-1 pr-4 font-medium">{t("banking.brs.difference")}</td>
                      <td className={`num py-1 text-right font-semibold ${Number(brs.statement.difference) === 0 ? "text-success" : "text-danger"}`}>{Number(brs.statement.difference) === 0 ? t("banking.brs.balanced") : rupees(brs.statement.difference)}</td></tr>
                  </>
                ) : null}
              </tbody>
            </table>
          </Card>
        ) : null}
        <div>
          <h2 className="mb-2 font-semibold">{t("banking.profile.title")}</h2>
          <BankProfileForm accountId={id} profile={bank.profile} canEdit={canEdit} />
        </div>
      </div>
    </>
  );
}
