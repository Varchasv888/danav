import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/ui";
import { CompanyEditor, type Company } from "@/components/CompanyEditor";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("company"))("title") };
}

export default async function CompanyPage() {
  const t = await getTranslations("company");
  const [companies, me] = await Promise.all([serverApi<Company[]>("/companies"), serverApi<Me>("/auth/me")]);
  const canEdit = me.permissions.includes("company.edit");
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      {companies.map((c) => <CompanyEditor key={c.id} company={c} canEdit={canEdit} />)}
    </>
  );
}
