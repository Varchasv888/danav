import { getTranslations } from "next-intl/server";
import { ClaimForm } from "@/components/expenses/Claims";
import { PageHeader } from "@/components/ui";
import { claimFormData } from "@/lib/expenses";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("expenses.claims"))("new") };
}

export default async function NewClaimPage() {
  const t = await getTranslations();
  const me = await serverApi<Me>("/auth/me");
  const d = await claimFormData(me.permissions.includes("projects.view"));
  return (
    <>
      <PageHeader title={t("expenses.claims.new")} subtitle={t("expenses.claims.subtitle")} />
      <ClaimForm employees={d.employees} categories={d.categories} projects={d.projects} />
    </>
  );
}
