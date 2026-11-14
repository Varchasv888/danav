import { PackageOpen } from "lucide-react";
import { PackingBoxes } from "@/components/inventory/PackingBoxes";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

interface Company { id: string; name: string }
interface GoodsItem { id: string; name: string; sku: string | null; barcode: string | null; color: string | null; size: string | null; fit: string | null; kind: string; archived: boolean }
interface Box { id: string; code: string; status: "open" | "packed"; createdAt: string; lines: { itemId: string; itemName: string; sku: string | null; barcode: string | null; color: string | null; size: string | null; fit: string | null; qty: string }[] }

export const metadata = { title: "Re-open Box" };

export default async function ReopenBoxPage() {
  const [companies, me] = await Promise.all([serverApi<Company[]>("/packing-boxes/companies"), serverApi<Me>("/auth/me")]);
  const companyId = companies[0]?.id ?? "";
  const [boxes, items] = companyId ? await Promise.all([
    serverApi<Box[]>(`/packing-boxes?companyId=${companyId}`),
    serverApi<GoodsItem[]>(`/items?companyId=${companyId}`),
  ]) : [[], []];
  return (
    <>
      <PageHeader icon={PackageOpen} title="Re-open Box" subtitle="Re-open a packed box with a recorded reason while preserving its saved contents." />
      <PackingBoxes mode="reopen" companies={companies} initialCompanyId={companyId} initialBoxes={boxes} initialItems={items.filter((item) => item.kind === "goods" && !item.archived)}
        canCreate={false} canEdit={me.permissions.includes("inventory.edit")} />
    </>
  );
}
