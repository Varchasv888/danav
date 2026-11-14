import { getTranslations } from "next-intl/server";
import { Scenarios } from "@/components/accounts/Scenarios";
import { PageHeader } from "@/components/ui";

export async function generateMetadata() {
  return { title: (await getTranslations("scen"))("title") };
}

export default async function ScenariosPage() {
  const t = await getTranslations("scen");
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Scenarios />
    </>
  );
}
