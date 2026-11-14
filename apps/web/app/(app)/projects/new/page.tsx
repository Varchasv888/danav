import { getTranslations } from "next-intl/server";
import { ProjectForm } from "@/components/projects/Projects";
import { PageHeader } from "@/components/ui";
import { projectMasters } from "@/lib/projects";

export async function generateMetadata() {
  return { title: (await getTranslations("projects.list"))("new") };
}

export default async function NewProjectPage() {
  const t = await getTranslations();
  const m = await projectMasters();
  return (
    <>
      <PageHeader title={t("projects.list.new")} subtitle={t("projects.list.subtitle")} />
      <ProjectForm customers={m.customers} services={m.services} />
    </>
  );
}
