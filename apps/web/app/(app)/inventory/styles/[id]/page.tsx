import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { StyleView, type Color, type Scale, type StyleDetail } from "@/components/inventory/Styles";
import type { StyleImage } from "@/components/inventory/StylePhotos";
import { PageHeader } from "@/components/ui";
import { inventorySetup } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const style = await serverApi<StyleDetail>(`/styles/${(await params).id}`);
  return { title: `${style.code} ${style.name}` };
}

export default async function StylePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ warehouseId?: string }> }) {
  const [{ id }, { warehouseId }] = await Promise.all([params, searchParams]);
  const t = await getTranslations("styles");
  const tl = await getTranslations("labels");
  const wh = warehouseId && /^[0-9a-f-]{36}$/.test(warehouseId) ? warehouseId : null;
  const [style, colors, scales, setup, me, images] = await Promise.all([
    serverApi<StyleDetail>(`/styles/${id}${wh ? `?warehouseId=${wh}` : ""}`), serverApi<Color[]>("/colors"), serverApi<Scale[]>("/size-scales"), inventorySetup(), serverApi<Me>("/auth/me"),
    serverApi<StyleImage[]>(`/styles/${id}/images`),
  ]);
  const facts = [style.brand, style.category, style.season, style.collection].filter(Boolean).join(", ");
  return (
    <>
      <PageHeader title={<><span className="mr-3 font-mono text-[0.7em] text-muted">{style.code}</span>{style.name}</>} subtitle={facts || t("subtitle")}
        actions={<Link href={`/inventory/labels?style=${style.id}`} className="inline-flex h-9 items-center rounded-lg border border-border px-3.5 text-sm font-medium hover:bg-surface-2">{tl("printLabels")}</Link>} />
      <StyleView style={style} colors={colors} scales={scales} warehouses={setup.warehouses.filter((w) => !w.archived)} warehouseId={wh} canEdit={me.permissions.includes("inventory.edit")} images={images} />
    </>
  );
}
