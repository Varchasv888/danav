import { getTranslations } from "next-intl/server";
import { BomForm, type WorkCentre } from "@/components/mfg/Boms";
import { PageHeader } from "@/components/ui";
import { items } from "@/lib/masters";
import { serverApi } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("mfg.boms"))("new") };
}

export default async function NewBomPage({ searchParams }: { searchParams: Promise<{ item?: string }> }) {
  const t = await getTranslations();
  const { item } = await searchParams;
  const [list, centres] = await Promise.all([items(), serverApi<WorkCentre[]>("/work-centres")]);
  return (
    <>
      <PageHeader title={t("mfg.boms.new")} subtitle={t("mfg.boms.subtitle")} />
      <BomForm items={list} workCentres={centres} {...(item ? { itemId: item } : {})} />
    </>
  );
}
