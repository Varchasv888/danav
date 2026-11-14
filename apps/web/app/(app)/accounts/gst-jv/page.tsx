import { FileSpreadsheet } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Account } from "@/components/accounts/ChartOfAccounts";
import { GstJvForm } from "@/components/accounts/GstJvForm";
import { Card, PageHeader } from "@/components/ui";
import { rupees } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

interface Position { head: "cgst" | "sgst" | "igst" | "cess"; credit: string; liability: string }

export async function generateMetadata() {
  return { title: (await getTranslations("gstjv"))("title") };
}

/** GST journal voucher: tax-only adjustments, with the credit and liability the books hold right now. */
export default async function GstJvPage() {
  const t = await getTranslations("gstjv");
  const [position, accounts] = await Promise.all([serverApi<Position[]>("/gst-jv/position"), serverApi<Account[]>("/accounts")]);
  const options = accounts.filter((a) => !a.archived && !/^(output|input)_/.test(a.key ?? "")).map((a) => ({ id: a.id, name: a.name }));
  return (
    <>
      <PageHeader icon={FileSpreadsheet} title={t("title")} subtitle={t("subtitle")} />
      <Card className="mb-4 max-w-3xl p-0">
        <table className="w-full text-[0.9286rem]">
          <thead><tr className="border-b border-border bg-surface-2 text-left text-xs font-semibold text-muted">
            <th className="px-4 py-1.5">{t("tax")}</th><th className="px-4 py-1.5 text-right">{t("creditAvailable")}</th><th className="px-4 py-1.5 text-right">{t("liabilityOwed")}</th>
          </tr></thead>
          <tbody>{position.map((p) => (
            <tr key={p.head} className="border-b border-rule last:border-0">
              <td className="px-4 py-2 font-medium">{t(`head.${p.head}`)}</td>
              <td className="num px-4 py-2 text-right">{rupees(p.credit)}</td>
              <td className="num px-4 py-2 text-right">{rupees(p.liability)}</td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
      <GstJvForm accounts={options} />
    </>
  );
}
