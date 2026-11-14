import { CheckCircle2 } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";
import { SettlementImport } from "@/components/banking/Setup";
import { Card, PageHeader } from "@/components/ui";
import { rupees } from "@/lib/format";
import { ledgers } from "@/lib/ledgers";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("banking.settlements"))("title") };
}

interface Settlement { id: string; provider: string; settlementId: string; utr: string | null; settledOn: string; payments: number; gross: string; refunds: string; fees: string; tax: string; net: string; number: string | null; voucherId: string | null; matched: boolean }

export default async function SettlementsPage() {
  const t = await getTranslations();
  const format = await getFormatter();
  const [rows, l, me] = await Promise.all([serverApi<Settlement[]>("/banking/settlements"), ledgers(), serverApi<Me>("/auth/me")]);
  const clearing = [...l.all.filter((a) => a.key === "upi_clearing" || a.key === "card_clearing"), ...l.under("sundry_debtors", "current_assets").filter((a) => a.key !== "upi_clearing" && a.key !== "card_clearing")];
  return (
    <>
      <PageHeader title={t("banking.settlements.title")} subtitle={t("banking.settlements.subtitle")} />
      <div className="flex flex-col gap-6">
        {me.permissions.includes("banking.create") ? <SettlementImport banks={l.under("bank_accounts", "bank_od")} clearing={clearing} /> : null}
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="text-left text-muted"><tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">{t("banking.settlements.settledOn")}</th>
                <th className="px-5 py-3 font-medium">{t("banking.settlements.settlementId")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("banking.settlements.payments")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("banking.settlements.gross")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("banking.settlements.refunds")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("banking.settlements.fees")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("banking.settlements.tax")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("banking.settlements.net")}</th>
                <th className="px-5 py-3 font-medium">{t("banking.settlements.matched")}</th>
              </tr></thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-2.5 whitespace-nowrap">{format.dateTime(new Date(`${s.settledOn}T00:00:00`), { dateStyle: "medium" })}</td>
                    <td className="px-5 py-2.5">
                      <span className="capitalize">{s.provider}</span> <span className="font-mono text-xs">{s.settlementId}</span>
                      {s.number && s.voucherId ? <a href={`/accounts/vouchers/${s.voucherId}`} className="block font-mono text-xs text-primary hover:underline">{s.number}</a> : null}
                    </td>
                    <td className="num px-5 py-2.5 text-right">{s.payments}</td>
                    <td className="num px-5 py-2.5 text-right">{rupees(s.gross)}</td>
                    <td className="num px-5 py-2.5 text-right">{Number(s.refunds) ? rupees(s.refunds) : "-"}</td>
                    <td className="num px-5 py-2.5 text-right">{rupees(s.fees)}</td>
                    <td className="num px-5 py-2.5 text-right">{rupees(s.tax)}</td>
                    <td className="num px-5 py-2.5 text-right font-medium">{rupees(s.net)}</td>
                    <td className="px-5 py-2.5">{s.matched ? <CheckCircle2 className="size-4 text-success" aria-label={t("banking.settlements.matched")} /> : <span className="text-muted">-</span>}</td>
                  </tr>
                ))}
                {!rows.length ? <tr><td colSpan={9} className="px-5 py-10 text-center text-muted">{t("banking.settlements.none")}</td></tr> : null}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
