import { getTranslations } from "next-intl/server";
import { businessDate } from "@varchasv/domain";
import { Catalogue, type CatalogueData, type SelectionRow } from "@/components/inventory/Catalogue";
import { PageHeader } from "@/components/ui";
import { customers } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("catalogue"))("title") };
}

const KEYS = ["q", "brand", "category", "season", "color", "minRate", "maxRate", "inStock", "withImage", "receivedFrom", "receivedTo", "partyId", "sort", "offset"];

export default async function CataloguePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = Object.fromEntries(Object.entries(await searchParams).filter(([k]) => KEYS.includes(k)));
  const t = await getTranslations("catalogue");
  // "Sold" on a tile counts the last 90 days.
  const query = new URLSearchParams({ soldFrom: businessDate(new Date(Date.now() - 90 * 86_400_000)), limit: "60" });
  for (const [k, v] of Object.entries(params)) for (const x of Array.isArray(v) ? v : v ? [v] : []) query.append(k, x);
  const [data, parties, selections, me] = await Promise.all([
    serverApi<CatalogueData>(`/catalogue?${query.toString()}`), customers(), serverApi<SelectionRow[]>("/catalogue/selections"), serverApi<Me>("/auth/me"),
  ]);
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Catalogue data={data} params={params} parties={parties.map(({ id, name }) => ({ id, name }))} selections={selections} canCreate={me.permissions.includes("sales.create")} />
    </>
  );
}
