import { getTranslations } from "next-intl/server";
import { Assistant } from "@/components/Assistant";
import { PageHeader } from "@/components/ui";
import { serverApi } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("assistant"))("title") };
}

export default async function AssistantPage() {
  const t = await getTranslations();
  const info = await serverApi<{ mode: "claude" | "demo" }>("/assistant/tools");
  return (
    <>
      <PageHeader title={t("assistant.title")} subtitle={t("assistant.subtitle")} />
      <Assistant mode={info.mode} />
    </>
  );
}
