import Link from "next/link";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { Card, PageHeader } from "@/components/ui";
import { localName, rupees } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("banking.accounts"))("title") };
}

interface Bank { id: string; name: string; nameHi: string | null; bookBalance: string; statementBalance: string | null; statementDate: string | null; unmatched: number; profile: { bankName: string | null; accountLast4: string | null; feedStatus: string | null } | null }

export default async function BanksPage() {
  const t = await getTranslations();
  const locale = await getLocale();
  const format = await getFormatter();
  const banks = await serverApi<Bank[]>("/banking/accounts");
  return (
    <>
      <PageHeader title={t("banking.accounts.title")} subtitle={t("banking.accounts.subtitle")} />
      {!banks.length ? <Card><p className="py-6 text-center text-muted">{t("banking.accounts.none")}</p></Card> : null}
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {banks.map((b) => (
          <Link key={b.id} href={`/banking/${b.id}`} className="group">
            <Card className="flex h-full flex-col gap-3 transition group-hover:border-primary">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{localName(b, locale)}</h2>
                  {b.profile?.bankName ? <p className="text-sm text-muted">{b.profile.bankName}{b.profile.accountLast4 ? ` ··${b.profile.accountLast4}` : ""}</p> : null}
                </div>
                {b.profile?.feedStatus === "active" ? <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary">{t("banking.feed.statuses.active")}</span> : null}
              </div>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div><dt className="text-muted">{t("banking.accounts.bookBalance")}</dt><dd className="num text-lg font-semibold">{rupees(b.bookBalance)}</dd></div>
                <div>
                  <dt className="text-muted">{t("banking.accounts.statementBalance")}</dt>
                  <dd className="num text-lg font-semibold">{b.statementBalance ? rupees(b.statementBalance) : "-"}</dd>
                  <dd className="text-xs text-muted">{b.statementDate ? t("banking.accounts.asOf", { date: format.dateTime(new Date(`${b.statementDate}T00:00:00`), { dateStyle: "medium" }) }) : t("banking.accounts.noStatement")}</dd>
                </div>
              </dl>
              <p className={`mt-auto text-sm font-medium ${b.unmatched ? "text-accent" : "text-success"}`}>{b.unmatched ? t("banking.accounts.unmatched", { count: b.unmatched }) : t("banking.accounts.allMatched")}</p>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
