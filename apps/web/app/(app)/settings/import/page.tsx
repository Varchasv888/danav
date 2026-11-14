import { getTranslations } from "next-intl/server";
import { ImportWizard } from "@/components/gst/ImportWizard";
import { PageHeader } from "@/components/ui";

export async function generateMetadata() {
  return { title: (await getTranslations("import"))("title") };
}

export default async function ImportPage() {
  const t = await getTranslations("import");
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <ImportWizard />
    </>
  );
}
