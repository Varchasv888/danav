import { getTranslations } from "next-intl/server";
import { ClaimForm } from "@/components/expenses/Claims";
import { PageHeader } from "@/components/ui";
import { claimFormData } from "@/lib/expenses";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("expenses.form"))("title") };
}

interface Claim {
  id: string; number: string; employeeId: string; date: string; title: string; projectId: string | null;
  lines: { date: string; categoryId: string; description: string | null; amount: string; gstRate: string; vendorName: string | null; vendorGstin: string | null; invoiceNo: string | null; fileId: string | null; fileName: string | null; travel?: { from: string; to: string; km?: string; days?: number } | null }[];
}

export default async function EditClaimPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations();
  const [c, me] = await Promise.all([serverApi<Claim>(`/expenses/claims/${id}`), serverApi<Me>("/auth/me")]);
  const d = await claimFormData(me.permissions.includes("projects.view"));
  return (
    <>
      <PageHeader title={<span className="font-mono">{c.number}</span>} subtitle={t("expenses.form.title")} />
      <ClaimForm employees={d.employees} categories={d.categories} projects={d.projects} draft={{
        id: c.id, employeeId: c.employeeId, date: c.date, title: c.title, projectId: c.projectId,
        lines: c.lines.map((l) => ({
          date: l.date, categoryId: l.categoryId, description: l.description ?? "", amount: String(Number(l.amount)), gstRate: String(Number(l.gstRate)),
          vendorName: l.vendorName ?? "", vendorGstin: l.vendorGstin ?? "", invoiceNo: l.invoiceNo ?? "", fileId: l.fileId ?? "", fileName: l.fileName ?? "",
          tripFrom: l.travel?.from ?? "", tripTo: l.travel?.to ?? "", km: l.travel?.km ?? "", days: l.travel?.days ? String(l.travel.days) : "",
        })),
      }} />
    </>
  );
}
