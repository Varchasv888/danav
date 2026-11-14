import { Wrench } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Repairs, type Repair } from "@/components/sales/Repairs";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

type Props = { searchParams: Promise<{ status?: string; q?: string }> };

export async function generateMetadata() {
  return { title: (await getTranslations("repairs"))("title") };
}

/** The service desk: repairs taken in, estimated, approved, repaired and handed back. */
export default async function RepairsPage({ searchParams }: Props) {
  const { status = "", q = "" } = await searchParams;
  const t = await getTranslations("repairs");
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (q) params.set("search", q);
  const [rows, me] = await Promise.all([serverApi<Repair[]>(`/repairs?${params}`), serverApi<Me>("/auth/me")]);
  return (
    <>
      <PageHeader icon={Wrench} title={t("title")} subtitle={t("subtitle")} />
      <Repairs rows={rows} status={status} q={q} canCreate={me.permissions.includes("sales.create")} canEdit={me.permissions.includes("sales.edit")} />
    </>
  );
}
