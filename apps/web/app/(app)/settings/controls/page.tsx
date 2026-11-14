import { getTranslations } from "next-intl/server";
import { Controls } from "@/components/settings/Controls";
import { PageHeader } from "@/components/ui";
import { customers, suppliers } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("controls"))("title") };
}

export default async function ControlsPage() {
  const t = await getTranslations("controls");
  const [me, cs, ss] = await Promise.all([serverApi<Me>("/auth/me"), customers(), suppliers()]);
  const parties = [...cs, ...ss].map((p) => ({ id: p.id, name: p.name })).sort((a, b) => a.name.localeCompare(b.name));
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Controls parties={parties} canEdit={me.permissions.includes("users.edit")} canMark={me.permissions.includes("accounts.edit")} />
    </>
  );
}
