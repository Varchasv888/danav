import { getTranslations } from "next-intl/server";
import { Launcher } from "@/components/launcher/Launcher";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("launcher"))("title") };
}

/** Every action in labelled groups of icon tiles; the star pins one to My Menu. */
export default async function LauncherPage() {
  const t = await getTranslations("launcher");
  const [me, menu] = await Promise.all([serverApi<Me>("/auth/me"), serverApi<{ items: string[] | null }>("/me/menu")]);
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Launcher permissions={me.permissions} menu={menu.items} />
    </>
  );
}
