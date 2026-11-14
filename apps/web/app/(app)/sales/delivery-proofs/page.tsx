import clsx from "clsx";
import { PackageCheck } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Card, PageHeader } from "@/components/ui";
import { serverApi } from "@/lib/server-api";

interface Exceptions {
  claims: { proofId: string; noteId: string; note: string; customer: string; owner: string | null; receivedOn: string; deadline: string | null; state: "open" | "due_soon" | "overdue" }[];
  awaitingProof: { noteId: string; number: string; date: string; customer: string; transporter: string | null }[];
}

export async function generateMetadata() {
  return { title: (await getTranslations("deliveryProof"))("pageTitle") };
}

/** Claims for short or damaged goods still open, most urgent first, and challans sent a few days ago with no proof of delivery. */
export default async function DeliveryProofsPage() {
  const t = await getTranslations("deliveryProof");
  const data = await serverApi<Exceptions>("/reports/delivery-proofs");
  const tone = { open: "bg-surface-2 text-muted", due_soon: "bg-accent-soft text-accent", overdue: "bg-danger-soft text-danger" } as const;
  return (
    <>
      <PageHeader icon={PackageCheck} title={t("pageTitle")} subtitle={t("pageSubtitle")} />
      <div className="flex flex-col gap-4">
        <Card className="overflow-hidden p-0">
          <h2 className="border-b border-border px-4 py-3 font-semibold">{t("claimsTitle")}</h2>
          {data.claims.length ? (
            <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-sm">
              <thead className="text-left text-muted"><tr className="border-b border-border"><th className="px-4 py-2 font-medium">{t("challan")}</th><th className="px-3 py-2 font-medium">{t("customer")}</th><th className="px-3 py-2 font-medium">{t("owner")}</th><th className="px-3 py-2 font-medium">{t("deadline")}</th><th className="px-3 py-2 font-medium">{t("status")}</th></tr></thead>
              <tbody>{data.claims.map((c) => (
                <tr key={c.proofId} className="border-b border-border last:border-0">
                  <td className="px-4 py-2"><Link href={`/sales/deliveries/${c.noteId}`} className="font-mono text-primary hover:underline">{c.note}</Link></td>
                  <td className="px-3 py-2">{c.customer}</td><td className="px-3 py-2">{c.owner ?? "-"}</td><td className="px-3 py-2">{c.deadline ?? "-"}</td>
                  <td className="px-3 py-2"><span className={clsx("rounded px-2 py-0.5 text-xs font-medium", tone[c.state])}>{t(`state.${c.state}`)}</span></td>
                </tr>))}</tbody>
            </table></div>
          ) : <p className="px-4 py-4 text-sm text-muted">{t("noClaims")}</p>}
        </Card>
        <Card className="overflow-hidden p-0">
          <h2 className="border-b border-border px-4 py-3 font-semibold">{t("awaitingTitle")}</h2>
          {data.awaitingProof.length ? (
            <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-sm">
              <thead className="text-left text-muted"><tr className="border-b border-border"><th className="px-4 py-2 font-medium">{t("challan")}</th><th className="px-3 py-2 font-medium">{t("sentOn")}</th><th className="px-3 py-2 font-medium">{t("customer")}</th><th className="px-3 py-2 font-medium">{t("transporter")}</th></tr></thead>
              <tbody>{data.awaitingProof.map((n) => (
                <tr key={n.noteId} className="border-b border-border last:border-0">
                  <td className="px-4 py-2"><Link href={`/sales/deliveries/${n.noteId}`} className="font-mono text-primary hover:underline">{n.number}</Link></td>
                  <td className="px-3 py-2">{n.date}</td><td className="px-3 py-2">{n.customer}</td><td className="px-3 py-2">{n.transporter ?? "-"}</td>
                </tr>))}</tbody>
            </table></div>
          ) : <p className="px-4 py-4 text-sm text-muted">{t("noneAwaiting")}</p>}
        </Card>
      </div>
      <p className="mt-3 text-xs text-muted">{t("pageNote")}</p>
    </>
  );
}
