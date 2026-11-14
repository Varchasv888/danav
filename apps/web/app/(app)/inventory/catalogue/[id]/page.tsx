import { getTranslations } from "next-intl/server";
import { CatalogueSelection, type SelectionDetail } from "@/components/inventory/CatalogueSelection";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  return { title: (await serverApi<SelectionDetail>(`/catalogue/selections/${(await params).id}`)).name };
}

export default async function SelectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations("catalogue");
  const [sel, me] = await Promise.all([serverApi<SelectionDetail>(`/catalogue/selections/${id}`), serverApi<Me>("/auth/me")]);
  return (
    <>
      <PageHeader title={sel.name} subtitle={sel.party && !sel.name.includes(sel.party.name) ? t("forPartyLine", { party: sel.party.name }) : t("selectionSubtitle")} />
      <CatalogueSelection sel={sel} canCreate={me.permissions.includes("sales.create")} />
    </>
  );
}
