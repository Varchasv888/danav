import { getTranslations } from "next-intl/server";
import { LeaveForm, LeaveTable, type LeaveRequest } from "@/components/hr/Leave";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("hr.leave"))("title") };
}

interface Option { id: string; code: string; name: string; nameHi: string | null; status?: string; archived?: boolean }

export default async function LeavePage() {
  const t = await getTranslations();
  const [requests, employees, types, me] = await Promise.all([
    serverApi<LeaveRequest[]>("/leave-requests"), serverApi<Option[]>("/employees"), serverApi<Option[]>("/leave-types"), serverApi<Me>("/auth/me"),
  ]);
  const can = (p: string) => me.permissions.includes(p);
  const pending = requests.filter((r) => r.status === "pending");
  return (
    <>
      <PageHeader title={t("hr.leave.title")} subtitle={t("hr.leave.subtitle")} />
      <div className="flex flex-col gap-6">
        {can("hr.create") ? <LeaveForm employees={employees.filter((e) => e.status === "active")} types={types.filter((ty) => !ty.archived)} /> : null}
        {pending.length ? <LeaveTable rows={pending} canApprove={can("hr.approve")} canEdit={can("hr.edit")} title={t("hr.leave.pending")} /> : null}
        <LeaveTable rows={requests.filter((r) => r.status !== "pending")} canApprove={false} canEdit={can("hr.edit")} title={t("hr.leave.all")} />
      </div>
    </>
  );
}
