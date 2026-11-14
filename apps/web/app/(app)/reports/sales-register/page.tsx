import { ReceiptText } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { businessDate } from "@varchasv/domain";
import { DateFilter } from "@/components/DateFilter";
import { SalesRegister, type Register } from "@/components/reports/OwnerReports";
import { PageHeader } from "@/components/ui";
import { serverApi } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("ownerReports"))("registerTitle") };
}

export default async function SalesRegisterPage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  const sp = await searchParams;
  const today = businessDate();
  const ok = (v?: string) => (v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : undefined);
  const to = ok(sp.to) ?? today;
  const from = ok(sp.from) ?? `${to.slice(0, 7)}-01`;
  const t = await getTranslations("ownerReports");
  const data = await serverApi<Register>(`/reports/sales-register?from=${from}&to=${to}`);
  return (
    <>
      <PageHeader icon={ReceiptText} print title={t("registerTitle")} subtitle={t("registerSubtitle")} actions={<DateFilter from={from} to={to} />} />
      <SalesRegister key={`${from}:${to}`} data={data} />
    </>
  );
}
