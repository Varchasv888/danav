import { Truck } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { DateFilter } from "@/components/DateFilter";
import { DataTable, type Column, type Row } from "@/components/data/DataTable";
import { PageHeader } from "@/components/ui";
import { fyStart, todayIso } from "@/lib/format";
import { serverApi } from "@/lib/server-api";

interface Score {
  suppliers: { supplierId: string; supplier: string; orders: number; receipts: number; onTimePct: string | null; inFullPct: string | null; problemPct: string | null; claimValue: string; leadDaysAvg: string | null; leadDaysMax: number | null; billedRateGapPct: string | null }[];
}

export async function generateMetadata() {
  return { title: (await getTranslations("scorecard"))("title") };
}

/** How each supplier has performed on orders in the range. The measures stand on their own; no single score is made up. */
export default async function SupplierScorecardPage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  const sp = await searchParams;
  const to = sp.to ?? todayIso(), from = sp.from ?? fyStart(to);
  const t = await getTranslations();
  const data = await serverApi<Score>(`/purchase/supplier-scorecard?from=${from}&to=${to}`);
  const n = (v: string | null) => (v === null ? null : Number(v));
  const columns: Column[] = [
    { key: "supplier", label: t("scorecard.supplier") },
    { key: "orders", label: t("scorecard.orders"), type: "count" },
    { key: "onTime", label: t("scorecard.onTime"), type: "count" },
    { key: "inFull", label: t("scorecard.inFull"), type: "count" },
    { key: "problem", label: t("scorecard.problem"), type: "count" },
    { key: "claim", label: t("scorecard.claim"), type: "money" },
    { key: "lead", label: t("scorecard.lead"), type: "count" },
    { key: "rate", label: t("scorecard.rateGap"), type: "count" },
  ];
  const rows: Row[] = data.suppliers.map((s) => ({
    id: s.supplierId, supplier: s.supplier, orders: s.orders, onTime: n(s.onTimePct), inFull: n(s.inFullPct), problem: n(s.problemPct), claim: n(s.claimValue), lead: n(s.leadDaysAvg), rate: n(s.billedRateGapPct),
  }));
  return (
    <>
      <PageHeader icon={Truck} title={t("scorecard.title")} subtitle={t("scorecard.subtitle")} actions={<Link href="/reports/payables" className="text-sm text-primary hover:underline">{t("scorecard.payables")}</Link>} />
      <DataTable id="supplier-scorecard" title={t("scorecard.title")} note={`${from} - ${to}`} filters={<DateFilter from={from} to={to} />} columns={columns} rows={rows} empty={{ title: t("scorecard.empty") }} />
      <p className="mt-3 text-xs text-muted">{t("scorecard.note")}</p>
    </>
  );
}
