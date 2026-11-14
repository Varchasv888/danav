import { getTranslations } from "next-intl/server";
import type { Terminal } from "@/components/pos/Billing";
import { Tailoring, type Rate, type TailoringOrder } from "@/components/pos/Tailoring";
import { PageHeader } from "@/components/ui";
import { items } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("tailoring"))("title") };
}

export default async function TailoringPage() {
  const t = await getTranslations("tailoring");
  const [orders, rates, karigars, terminals, its, me] = await Promise.all([
    serverApi<TailoringOrder[]>("/tailoring-orders?status=open"), serverApi<Rate[]>("/tailoring-rates"),
    serverApi<{ id: string; name: string; active: boolean }[]>("/karigars"), serverApi<Terminal[]>("/pos/terminals"), items(), serverApi<Me>("/auth/me"),
  ]);
  // Fabric sold by length (metres or yards) can go into an order from stock.
  const fabrics = its.filter((i) => i.kind === "goods" && !i.archived && ["MTR", "YDS"].includes(i.uom)).map((i) => ({ id: i.id, name: i.name, nameHi: i.nameHi, saleRate: i.saleRate ?? "0" }));
  const counters = terminals.filter((x) => !x.archived && !x.deviceId && x.openSession).map((x) => ({ id: x.id, code: x.code, name: x.name }));
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Tailoring orders={orders} rates={rates} karigars={karigars.filter((k) => k.active).map(({ id, name }) => ({ id, name }))} fabrics={fabrics} counters={counters} canEdit={me.permissions.includes("sales.edit")} />
    </>
  );
}
