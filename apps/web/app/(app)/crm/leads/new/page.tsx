import { getTranslations } from "next-intl/server";
import { LeadForm } from "@/components/crm/Crm";
import { PageHeader } from "@/components/ui";

export async function generateMetadata() {
  return { title: (await getTranslations("crm.leads"))("new") };
}

export default async function NewLeadPage() {
  const t = await getTranslations();
  return (
    <>
      <PageHeader title={t("crm.leads.new")} subtitle={t("crm.leads.subtitle")} />
      <LeadForm />
    </>
  );
}
