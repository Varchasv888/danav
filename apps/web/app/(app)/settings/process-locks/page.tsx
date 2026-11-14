import { getTranslations } from "next-intl/server";
import { ProcessLocks } from "@/components/settings/ProcessLocks";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("processLocks"))("title") };
}

export default async function ProcessLocksPage() {
  const t = await getTranslations("processLocks");
  const [locks, me] = await Promise.all([serverApi<{ docType: string; name: string; lockedUpTo: string | null }[]>("/settings/process-locks"), serverApi<Me>("/auth/me")]);
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <ProcessLocks locks={locks} canEdit={me.permissions.includes("settings.edit")} />
    </>
  );
}
