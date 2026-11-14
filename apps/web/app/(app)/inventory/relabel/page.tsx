import { getTranslations } from "next-intl/server";
import { Relabel } from "@/components/inventory/Relabel";
import { PageHeader } from "@/components/ui";
import { items } from "@/lib/masters";
import { serverApi } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("relabel"))("title") };
}

export default async function RelabelPage() {
  const t = await getTranslations("relabel");
  const [i, past] = await Promise.all([
    items<{ id: string; name: string; color: string | null; size: string | null; mrp: string | null; saleRate: string; archived: boolean; kind: string }>(),
    serverApi<{ id: string; number: string; date: string; reason: string; changes: { itemId: string; before: Record<string, unknown>; after: Record<string, unknown> }[] }[]>("/relabels"),
  ]);
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Relabel items={i.filter((x) => x.kind === "goods" && !x.archived).map((x) => ({ id: x.id, name: x.name, color: x.color ?? null, size: x.size ?? null, mrp: x.mrp ?? null, saleRate: x.saleRate }))} past={past} />
    </>
  );
}
