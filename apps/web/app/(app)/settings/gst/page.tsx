import { getTranslations } from "next-intl/server";
import { GstSettingsForm, type GstSettings } from "@/components/gst/GstSettingsForm";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("gstSettings"))("title") };
}

export default async function GstSettingsPage() {
  const t = await getTranslations("gstSettings");
  const [settings, me] = await Promise.all([serverApi<GstSettings>("/gst/settings"), serverApi<Me>("/auth/me")]);
  return (
    <>
      <PageHeader title={t("title")} />
      <GstSettingsForm settings={settings} canEdit={me.permissions.includes("gst.edit")} />
    </>
  );
}
