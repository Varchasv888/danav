import { SearchCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { InspectionDesk, type Inspection } from "@/components/sales/InspectionDesk";
import { PageHeader } from "@/components/ui";
import { inventorySetup } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("inspection"))("title") };
}

/** Goods customers sent back, waiting in Quality hold to be restocked or written off. */
export default async function ReturnInspectionPage() {
  const t = await getTranslations("inspection");
  const [rows, setup, me] = await Promise.all([serverApi<Inspection[]>("/return-inspections"), inventorySetup(), serverApi<Me>("/auth/me")]);
  return (
    <>
      <PageHeader icon={SearchCheck} title={t("title")} subtitle={t("subtitle")} />
      <InspectionDesk rows={rows} godowns={setup.warehouses.filter((w) => !w.qualityHold && !w.archived).map((w) => ({ id: w.id, name: w.name }))} canEdit={me.permissions.includes("inventory.edit")} />
    </>
  );
}
