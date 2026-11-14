import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { StylesList, type Color, type Scale, type StyleRow } from "@/components/inventory/Styles";
import { PageHeader } from "@/components/ui";
import { inventorySetup } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("styles"))("title") };
}

export default async function StylesPage() {
  const t = await getTranslations("styles");
  const [styles, scales, colors, setup, me] = await Promise.all([
    serverApi<StyleRow[]>("/styles"), serverApi<Scale[]>("/size-scales"), serverApi<Color[]>("/colors"), inventorySetup(), serverApi<Me>("/auth/me"),
  ]);
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")}
        actions={<Link href="/inventory/styles/setup" className="inline-flex h-9 items-center rounded-lg border border-border bg-surface px-3.5 text-sm font-medium hover:border-primary/35">{t("sizesAndColors")}</Link>} />
      <StylesList styles={styles} scales={scales} colors={colors} uoms={setup.uoms} canCreate={me.permissions.includes("inventory.create")} />
    </>
  );
}
