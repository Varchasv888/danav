import { getTranslations } from "next-intl/server";
import { Inquiries, type Inquiry } from "@/components/sales/Inquiries";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("inquiries"))("title") };
}

export default async function InquiriesPage() {
  const t = await getTranslations("inquiries");
  const [rows, me] = await Promise.all([serverApi<Inquiry[]>("/inquiries"), serverApi<Me>("/auth/me")]);
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Inquiries rows={rows} canEdit={me.permissions.includes("sales.create")} />
    </>
  );
}
