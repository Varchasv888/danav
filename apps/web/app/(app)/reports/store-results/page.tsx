import { getTranslations } from "next-intl/server";
import { StoreResults } from "@/components/reports/StoreResults";
import { PageHeader } from "@/components/ui";
import { todayIso } from "@/lib/format";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("storeResults"))("title") };
}

export default async function StoreResultsPage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  const q = await searchParams;
  const to = q.to && /^\d{4}-\d{2}-\d{2}$/.test(q.to) ? q.to : todayIso();
  const from = q.from && /^\d{4}-\d{2}-\d{2}$/.test(q.from) ? q.from : `${to.slice(0, 7)}-01`;
  const t = await getTranslations("storeResults");
  const [me, data] = await Promise.all([serverApi<Me>("/auth/me"), serverApi<Parameters<typeof StoreResults>[0]["data"]>(`/finance/store-results?from=${from}&to=${to}`)]);
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <StoreResults data={data} from={from} to={to} canEdit={me.permissions.includes("accounts.create")} />
    </>
  );
}
