import { Truck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LrBoard, type LrRow } from "@/components/sales/LrBoard";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

type Props = { searchParams: Promise<{ status?: string; q?: string }> };

export async function generateMetadata() {
  return { title: (await getTranslations("lr"))("title") };
}

/** Consignments sent through transporters: LR number, invoice, freight and whether each has arrived. */
export default async function LrPage({ searchParams }: Props) {
  const sp = await searchParams;
  const status = ["booked", "in_transit", "delivered"].includes(sp.status ?? "") ? sp.status : undefined;
  const t = await getTranslations("lr");
  const qs = new URLSearchParams({ ...(status ? { status } : {}), ...(sp.q ? { search: sp.q } : {}) }).toString();
  const [rows, invoices, transporters, me] = await Promise.all([
    serverApi<LrRow[]>(`/lr-entries${qs ? `?${qs}` : ""}`),
    serverApi<{ id: string; number: string; customerName: string }[]>("/sales-invoices"),
    serverApi<{ name: string }[]>("/lookups/transporterMaster").catch(() => []),
    serverApi<Me>("/auth/me"),
  ]);
  return (
    <>
      <PageHeader icon={Truck} title={t("title")} subtitle={t("subtitle")} print />
      <LrBoard rows={rows} invoices={invoices.slice(0, 200).map((i) => ({ id: i.id, label: `${i.number}: ${i.customerName}` }))} transporters={transporters.map((x) => x.name)}
        status={status ?? ""} q={sp.q ?? ""} canCreate={me.permissions.includes("sales.create")} canEdit={me.permissions.includes("sales.edit")} />
    </>
  );
}
