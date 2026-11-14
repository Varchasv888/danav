import { Paperclip } from "lucide-react";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { ClaimActions } from "@/components/expenses/Claims";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, PageHeader } from "@/components/ui";
import { localName, rupees } from "@/lib/format";
import { ledgers } from "@/lib/ledgers";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("expenses.form"))("title") };
}

interface Claim {
  id: string; number: string; date: string; title: string; status: string; total: string; itc: string; employee: string; employeeCode: string; project: string | null;
  rejectReason: string | null; voucher: string | null; paymentVoucher: string | null;
  lines: { id: string; date: string; category: string; categoryHi: string | null; description: string | null; amount: string; taxable: string; cgst: string; sgst: string; igst: string; vendorName: string | null; vendorGstin: string | null; invoiceNo: string | null; fileId: string | null; fileName: string | null }[];
}
const TONE: Record<string, string> = { submitted: "partial", approved: "open", paid: "completed", draft: "planned", rejected: "cancelled", cancelled: "cancelled" };

export default async function ClaimPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations();
  const locale = await getLocale();
  const format = await getFormatter();
  const [c, me, l] = await Promise.all([serverApi<Claim>(`/expenses/claims/${id}`), serverApi<Me>("/auth/me"), ledgers()]);
  const day = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  return (
    <>
      <PageHeader title={c.title} subtitle={<><span className="font-mono">{c.number}</span> · {c.employeeCode} {c.employee} · {day(c.date)}{c.project ? ` · ${c.project}` : ""}</>}
        actions={<StatusBadge status={TONE[c.status] ?? "closed"} label={t(`expenses.claims.statuses.${c.status}`)} />} />
      <div className="flex flex-col gap-6">
        {c.status === "rejected" && c.rejectReason ? <p className="text-sm text-danger">{t("expenses.detail.rejected", { reason: c.rejectReason })}</p> : null}
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="text-left text-muted"><tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">{t("expenses.claims.date")}</th>
                <th className="px-5 py-3 font-medium">{t("expenses.form.category")}</th>
                <th className="px-5 py-3 font-medium">{t("expenses.form.vendor")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("expenses.claims.itc")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("expenses.claims.total")}</th>
                <th className="px-5 py-3" />
              </tr></thead>
              <tbody>
                {c.lines.map((x) => (
                  <tr key={x.id} className="border-b border-border align-top last:border-0">
                    <td className="px-5 py-2.5 whitespace-nowrap">{day(x.date)}</td>
                    <td className="px-5 py-2.5">{localName({ name: x.category, nameHi: x.categoryHi }, locale)}{x.description ? <span className="block text-xs text-muted">{x.description}</span> : null}</td>
                    <td className="px-5 py-2.5">{x.vendorName}{x.vendorGstin ? <span className="block font-mono text-xs text-muted">{x.vendorGstin} {x.invoiceNo}</span> : null}</td>
                    <td className="num px-5 py-2.5 text-right">{Number(x.cgst) + Number(x.sgst) + Number(x.igst) ? rupees(Number(x.cgst) + Number(x.sgst) + Number(x.igst)) : "-"}</td>
                    <td className="num px-5 py-2.5 text-right">{rupees(x.amount)}</td>
                    <td className="px-5 py-2.5">{x.fileId ? <a href={`/api/files/${x.fileId}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline" title={x.fileName ?? ""}><Paperclip className="size-3.5" aria-hidden />{t("expenses.detail.receipt")}</a> : null}</td>
                  </tr>
                ))}
                <tr className="font-semibold"><td colSpan={3} className="px-5 py-2.5" /><td className="num px-5 py-2.5 text-right">{rupees(c.itc)}</td><td className="num px-5 py-2.5 text-right">{rupees(c.total)}</td><td /></tr>
              </tbody>
            </table>
          </div>
        </Card>
        {c.voucher || c.paymentVoucher ? (
          <p className="text-sm text-muted">{c.voucher ? `${t("expenses.detail.voucher")}: ${c.voucher}` : ""}{c.paymentVoucher ? ` · ${t("expenses.detail.paymentVoucher")}: ${c.paymentVoucher}` : ""}</p>
        ) : null}
        <ClaimActions id={c.id} status={c.status} canEdit={me.permissions.includes("expenses.edit")} canApprove={me.permissions.includes("expenses.approve")}
          canCancel={me.permissions.includes("expenses.cancel")} payFrom={l.under("cash_in_hand", "bank_accounts", "bank_od")} />
      </div>
    </>
  );
}
