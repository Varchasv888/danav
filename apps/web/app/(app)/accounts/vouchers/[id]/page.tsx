import Link from "next/link";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { amountInWords, wordsLang } from "@varchasv/domain";
import { CancelVoucher } from "@/components/accounts/CancelVoucher";
import { Card, PageHeader } from "@/components/ui";
import { localName, rupees } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";

interface Voucher {
  id: string; type: string; number: string; date: string; narration: string | null; reference: string | null; total: string; status: string;
  cancelReason: string | null; cancelledAt: string | null;
  lines: { id: string; accountId: string; accountName: string; accountNameHi: string | null; debit: string; credit: string }[];
}

export default async function VoucherPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations();
  const locale = await getLocale();
  const format = await getFormatter();
  const [v, me] = await Promise.all([serverApi<Voucher>(`/vouchers/${id}`), serverApi<Me>("/auth/me")]);
  const cancelled = v.status === "cancelled";

  return (
    <>
      <PageHeader
        title={<span className="font-mono">{v.number}</span>}
        subtitle={`${t(`vouchers.types.${v.type}`)} · ${format.dateTime(new Date(`${v.date}T00:00:00`), { dateStyle: "long" })}`}
        actions={<Link href="/accounts/vouchers" className="text-sm text-primary hover:underline">← {t("common.back")}</Link>}
      />
      <Card>
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${cancelled ? "bg-danger-soft text-danger" : "bg-primary-soft text-primary"}`}>
            {cancelled ? t("vouchers.cancelled") : t("vouchers.posted")}
          </span>
          {v.reference ? <span className="text-muted">{t("vouchers.reference")}: {v.reference}</span> : null}
          {cancelled && v.cancelReason ? <span className="text-muted">- {v.cancelReason}</span> : null}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="py-2 pr-4 font-medium">{t("vouchers.account")}</th>
                <th className="py-2 pr-4 text-right font-medium">{t("common.debit")}</th>
                <th className="py-2 text-right font-medium">{t("common.credit")}</th>
              </tr>
            </thead>
            <tbody>
              {v.lines.map((l) => (
                <tr key={l.id} className="border-b border-border">
                  <td className="py-2.5 pr-4">{localName({ name: l.accountName, nameHi: l.accountNameHi }, locale)}</td>
                  <td className="num py-2.5 pr-4 text-right">{Number(l.debit) ? rupees(l.debit) : ""}</td>
                  <td className="num py-2.5 text-right">{Number(l.credit) ? rupees(l.credit) : ""}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-semibold">
                <td className="py-3 pr-4">{t("common.total")}</td>
                <td className="num py-3 pr-4 text-right">{rupees(v.total)}</td>
                <td className="num py-3 text-right">{rupees(v.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="mt-2 text-xs text-muted">{amountInWords(v.total, wordsLang(locale))}</p>
        {v.narration ? <p className="mt-4 text-sm"><span className="text-muted">{t("common.narration")}:</span> {v.narration}</p> : null}
      </Card>
      {v.type === "payment" && !cancelled ? <p className="mt-3 text-sm"><Link href={`/print/cheque/${v.id}?crossed=1`} target="_blank" className="text-primary hover:underline">{t("chequePrint.link")}</Link></p> : null}
      {!cancelled && me.permissions.includes("accounts.cancel") ? <CancelVoucher id={v.id} /> : null}
    </>
  );
}
