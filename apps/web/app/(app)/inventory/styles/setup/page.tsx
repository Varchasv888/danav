import { getTranslations } from "next-intl/server";
import { SizesColors, type Color, type Scale } from "@/components/inventory/Styles";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("styles"))("sizesAndColors") };
}

export default async function SizesColorsPage() {
  const t = await getTranslations("styles");
  const [scales, colors, me] = await Promise.all([serverApi<Scale[]>("/size-scales"), serverApi<Color[]>("/colors"), serverApi<Me>("/auth/me")]);
  return (
    <>
      <PageHeader title={t("sizesAndColors")} subtitle={t("sizesAndColorsSubtitle")} />
      <SizesColors scales={scales} colors={colors} canEdit={me.permissions.includes("inventory.edit")} />
    </>
  );
}
