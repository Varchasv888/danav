import { getTranslations } from "next-intl/server";
import { Consignment, type Consignee, type Reconciliation } from "@/components/sales/Consignment";
import { PageHeader } from "@/components/ui";
import { customers, items } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("consignment"))("title") };
}

export default async function ConsignmentPage({ searchParams }: { searchParams: Promise<{ customer?: string }> }) {
  const { customer } = await searchParams;
  const t = await getTranslations("consignment");
  const [list, c, its, me] = await Promise.all([serverApi<Consignee[]>("/consignees"), customers(), items(), serverApi<Me>("/auth/me")]);
  const open = customer ?? (list.length === 1 ? list[0]!.customerId : undefined);
  const detail = open ? await serverApi<Reconciliation>(`/consignees/${open}`) : null;
  const goods = its.filter((i) => i.kind === "goods" && !i.archived).map(({ id, name, nameHi }) => ({ id, name, nameHi }));
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Consignment consignees={list} customers={c.map(({ id, name, nameHi }) => ({ id, name, nameHi }))} items={goods} detail={detail} canCreate={me.permissions.includes("sales.create")} />
    </>
  );
}
