import { getTranslations } from "next-intl/server";
import { TemplatesEditor, type Template } from "@/components/crm/Crm";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("crm.templates"))("title") };
}

export default async function TemplatesPage() {
  const t = await getTranslations();
  const [templates, me, messaging] = await Promise.all([serverApi<Template[]>("/crm/templates"), serverApi<Me>("/auth/me"), serverApi<{ provider: string }>("/crm/messaging")]);
  return (
    <>
      <PageHeader title={t("crm.templates.title")} subtitle={t("crm.templates.subtitle")} />
      {messaging.provider === "demo" ? <p className="mb-4 text-sm text-muted">{t("crm.messages.demo")}</p> : null}
      <TemplatesEditor key={templates.map((x) => `${x.id}:${x.name}:${x.body}:${x.archived}:${x.providerName}`).join()} templates={templates} canEdit={me.permissions.includes("crm.edit")} />
    </>
  );
}
