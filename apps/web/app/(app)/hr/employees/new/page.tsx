import { getTranslations } from "next-intl/server";
import { EmployeeForm } from "@/components/hr/EmployeeForm";
import { PageHeader } from "@/components/ui";
import { homeState } from "@/lib/masters";
import { serverApi } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("hr.employees"))("new") };
}

export default async function NewEmployeePage() {
  const t = await getTranslations("hr.employees");
  return (
    <>
      <PageHeader title={t("new")} />
      <EmployeeForm homeState={await homeState()} shifts={await serverApi<{ id: string; name: string; startTime: string; endTime: string }[]>("/shifts")} />
    </>
  );
}
