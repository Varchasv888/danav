import { Plus } from "lucide-react";
import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { DateFilter } from "@/components/DateFilter";
import { Card, PageHeader } from "@/components/ui";
import { fyStart, rupees, todayIso } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";

interface VoucherRow { id: string; type: string; number: string; date: string; narration: string | null; total: string; status: string; accounts: string | null }

export async function generateMetadata() {
  return { title: (await getTranslations("vouchers"))("title") };
}

const TYPES = ["journal", "payment", "receipt", "contra"];

export default async function VouchersPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const to = sp.to ?? todayIso();
  const from = sp.from ?? fyStart(to);
  const type = TYPES.includes(sp.type ?? "") ? sp.type : undefined;
  const t = await getTranslations();
  const format = await getFormatter();
  const qs = new URLSearchParams({ from, to, limit: "500", ...(type ? { type } : {}) });
  const [rows, me] = await Promise.all([serverApi<VoucherRow[]>(`/vouchers?${qs}`), serverApi<Me>("/auth/me")]);

  const tab = (value: string | undefined, label: string) => {
    const q = new URLSearchParams({ from, to, ...(value ? { type: value } : {}) });
    const active = value === type;
    return (
      <Link key={label} href={`?${q}`} className={`rounded-lg px-3 py-1.5 text-sm font-medium ${active ? "bg-primary-soft text-primary" : "text-muted hover:bg-surface-2 hover:text-text"}`}>{label}</Link>
    );
  };

  return (
    <>
      <PageHeader
        title={t("vouchers.title")}
        subtitle={t("vouchers.subtitle")}
        actions={me.permissions.includes("accounts.create") ? (
          <Link href="/accounts/vouchers/new" className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover">
            <Plus className="size-4" aria-hidden />{t("vouchers.new")}
          </Link>
        ) : null}
      />
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <nav className="flex flex-wrap gap-1">{[tab(undefined, t("common.all")), ...TYPES.map((x) => tab(x, t(`vouchers.types.${x}`)))]}</nav>
        <div className="flex flex-wrap items-end gap-3">
          <DateFilter from={from} to={to} extra={type ? { type } : undefined} />
          <Link href={`/print/vouchers?${new URLSearchParams({ from, to, ...(type ? { type } : {}) })}`} target="_blank" className="inline-flex h-9 items-center rounded-lg border border-border px-3.5 text-sm font-medium hover:bg-surface-2">{t("vouchers.printAll")}</Link>
        </div>
      </div>
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">{t("common.date")}</th>
                <th className="px-5 py-3 font-medium">{t("vouchers.number")}</th>
                <th className="px-5 py-3 font-medium">{t("vouchers.accounts")}</th>
                <th className="px-5 py-3 font-medium">{t("common.narration")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("vouchers.amount")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((v) => (
                <tr key={v.id} className={`border-b border-border last:border-0 hover:bg-surface-2/60 ${v.status === "cancelled" ? "text-muted line-through" : ""}`}>
                  <td className="px-5 py-2.5 whitespace-nowrap">{format.dateTime(new Date(`${v.date}T00:00:00`), { dateStyle: "medium" })}</td>
                  <td className="px-5 py-2.5 whitespace-nowrap">
                    <Link href={`/accounts/vouchers/${v.id}`} className="font-mono text-primary hover:underline">{v.number}</Link>
                    <span className="ml-2 text-xs text-muted no-underline">{t(`vouchers.types.${v.type}`)}</span>
                  </td>
                  <td className="max-w-80 truncate px-5 py-2.5">{v.accounts}</td>
                  <td className="max-w-64 truncate px-5 py-2.5 text-muted">{v.narration}</td>
                  <td className="num px-5 py-2.5 text-right">{rupees(v.total)}</td>
                </tr>
              ))}
              {!rows.length ? <tr><td colSpan={5} className="px-5 py-10 text-center text-muted">{t("vouchers.empty")}</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
