import { getTranslations } from "next-intl/server";
import { OwnerRegisters } from "@/components/reports/OwnerRegisters";
import { PageHeader } from "@/components/ui";

export async function generateMetadata() {
  return { title: (await getTranslations("ownerreg"))("title") };
}

export default async function RegistersPage() {
  const t = await getTranslations("ownerreg");
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <OwnerRegisters />
    </>
  );
}
