import { Plus } from "lucide-react";
import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { Card, PageHeader } from "@/components/ui";
import { rupees } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";

interface Pending { id: string; number: string; date: string; customerName: string; pieces: string; value: string; daysOut: number }

export async function generateMetadata() {
  return { title: (await getTranslations("sales.samples"))("title") };
}

/** Samples sent to parties and not yet back, oldest first: chase them, and take back what they do not keep. */
export default async function SamplesPage() {
  const t = await getTranslations();
  const format = await getFormatter();
  const [rows, me] = await Promise.all([serverApi<Pending[]>("/samples/pending"), serverApi<Me>("/auth/me")]);
  const d = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  const pieces = rows.reduce((s, r) => s + Number(r.pieces), 0);
  return (
    <>
      <PageHeader
        title={t("sales.samples.title")}
        subtitle={t("sales.samples.subtitle")}
        print
        actions={me.permissions.includes("sales.create") ? (
          <Link href="/sales/deliveries/new?reason=sample" className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover">
            <Plus className="size-4" aria-hidden />{t("sales.samples.new")}
          </Link>
        ) : null}
      />
      {rows.length ? <p className="mb-4 text-sm text-muted">{t("sales.samples.summary", { count: rows.length, pieces: Number(pieces).toLocaleString("en-IN") })}</p> : null}
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">{t("common.date")}</th>
                <th className="px-5 py-3 font-medium">{t("vouchers.number")}</th>
                <th className="px-5 py-3 font-medium">{t("sales.customer")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("sales.deliveries.stillOut")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("sales.deliveries.value")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("sales.approvals.daysOut")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface-2/60">
                  <td className="px-5 py-2.5 whitespace-nowrap">{d(r.date)}</td>
                  <td className="px-5 py-2.5"><Link href={`/sales/deliveries/${r.id}`} className="font-mono text-primary hover:underline">{r.number}</Link></td>
                  <td className="px-5 py-2.5">{r.customerName}</td>
                  <td className="num px-5 py-2.5 text-right">{Number(r.pieces).toLocaleString("en-IN")}</td>
                  <td className="num px-5 py-2.5 text-right">{rupees(r.value)}</td>
                  <td className={`num px-5 py-2.5 text-right ${r.daysOut > 30 ? "font-semibold text-accent" : ""}`}>{r.daysOut}</td>
                </tr>
              ))}
              {!rows.length ? <tr><td colSpan={6} className="px-5 py-10 text-center text-muted">{t("sales.samples.empty")}</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
