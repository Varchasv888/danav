import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Dues, TdsReturn, type DueRow } from "@/components/hr/Statutory";
import { Button, Card, PageHeader, Select } from "@/components/ui";
import { localName, todayIso } from "@/lib/format";
import { cashBankAccounts } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("statutory"))("title") };
}

const fyOf = (iso: string) => { const y = Number(iso.slice(0, 4)) - (iso.slice(5) < "04-01" ? 1 : 0); return `${y}-${String((y + 1) % 100).padStart(2, "0")}`; };

export default async function StatutoryPage({ searchParams }: { searchParams: Promise<{ fy?: string }> }) {
  const current = fyOf(todayIso());
  const fy = (await searchParams).fy ?? current;
  const options = [0, 1, 2].map((i) => { const y = Number(current.slice(0, 4)) - i; return `${y}-${String((y + 1) % 100).padStart(2, "0")}`; });
  const t = await getTranslations();
  const locale = await getLocale();
  const [dues, me, accounts, employees] = await Promise.all([
    serverApi<{ rows: DueRow[] }>(`/statutory/dues?fy=${fy}`), serverApi<Me>("/auth/me"), cashBankAccounts(),
    serverApi<{ id: string; code: string; name: string; nameHi: string | null; pan: string | null }[]>("/employees"),
  ]);
  return (
    <>
      <PageHeader title={t("statutory.title")} subtitle={t("statutory.subtitle")}
        actions={(
          <form className="flex items-end gap-3">
            <Select name="fy" defaultValue={fy} className="w-36" aria-label={t("statutory.fy")}>{options.map((o) => <option key={o} value={o}>{o}</option>)}</Select>
            <Button type="submit" variant="outline">{t("common.apply")}</Button>
          </form>
        )} />
      <div className="flex flex-col gap-6">
        <Dues rows={dues.rows} accounts={accounts} canPay={me.permissions.includes("payroll.submit")} />
        <TdsReturn fy={fy} />
        <Card className="p-0">
          <div className="border-b border-border px-5 py-3">
            <h2 className="font-semibold">{t("statutory.form16.title")}</h2>
            <p className="text-sm text-muted">{t("statutory.form16.hint")}</p>
          </div>
          <ul className="divide-y divide-border text-sm">
            {employees.map((e) => (
              <li key={e.id} className="flex items-center justify-between px-5 py-2">
                <span><span className="font-mono text-xs text-muted">{e.code}</span> {localName(e, locale)} <span className="font-mono text-xs text-muted">{e.pan ?? ""}</span></span>
                <Link href={`/print/form16/${e.id}?fy=${fy}`} target="_blank" className="text-primary hover:underline">{t("statutory.form16.view")}</Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
