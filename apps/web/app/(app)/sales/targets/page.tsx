import { getTranslations } from "next-intl/server";
import { SalesTargets, type SalesmanRow } from "@/components/sales/SalesTargets";
import { TargetsYear, type YearRow } from "@/components/sales/TargetsYear";
import { PageHeader } from "@/components/ui";
import { todayIso } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("targets"))("title") };
}

/** Salesman targets for a month, what each one sold, and the commission their slab pays. */
export default async function TargetsPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const { month: m } = await searchParams;
  const month = m && /^\d{4}-(0[1-9]|1[0-2])$/.test(m) ? m : todayIso().slice(0, 7);
  const t = await getTranslations("targets");
  const year = Number(month.slice(0, 4));
  const [data, salesmen, me, yearly] = await Promise.all([
    serverApi<{ month: string; rows: SalesmanRow[]; commission: string }>(`/reports/salesman?month=${month}`),
    serverApi<{ id: string; name: string; code: string }[]>("/salesmen"),
    serverApi<Me>("/auth/me"),
    serverApi<{ rows: YearRow[] }>(`/reports/salesman-year?year=${year}`),
  ]);
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <SalesTargets key={month} month={month} rows={data.rows} total={data.commission} salesmen={salesmen} canEdit={me.permissions.includes("sales.approve")} />
      <TargetsYear year={year} rows={yearly.rows} />
    </>
  );
}
