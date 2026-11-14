import { getTranslations } from "next-intl/server";
import { Distribution } from "@/components/inventory/Distribution";
import { PageHeader } from "@/components/ui";
import { items } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("distribution"))("title") };
}

export default async function DistributionPage() {
  const t = await getTranslations("distribution");
  const [setup, me, i] = await Promise.all([
    serverApi<{ warehouses: { id: string; name: string; archived?: boolean; inTransit?: boolean }[] }>("/inventory/setup"),
    serverApi<Me>("/auth/me"),
    items<{ id: string; name: string; archived: boolean; kind: string }>(),
  ]);
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Distribution warehouses={setup.warehouses.filter((w) => !w.archived && !w.inTransit).map((w) => ({ id: w.id, name: w.name }))} items={i.filter((x) => x.kind === "goods" && !x.archived).map((x) => ({ id: x.id, name: x.name }))} canCreate={me.permissions.includes("inventory.create")} />
    </>
  );
}
