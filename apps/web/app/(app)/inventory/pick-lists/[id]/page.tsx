import { ClipboardCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PickDesk, type PickData } from "@/components/inventory/PickDesk";
import { StatusBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export default async function PickListPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations("picking");
  const [data, me] = await Promise.all([serverApi<PickData>(`/pick-lists/${id}`), serverApi<Me>("/auth/me")]);
  return (
    <>
      <PageHeader icon={ClipboardCheck} title={<span className="font-mono">{data.number}</span>} subtitle={t("title")} actions={<StatusBadge status={data.status} label={t(`statuses.${data.status}`)} />} />
      <PickDesk data={data} canEdit={me.permissions.includes("inventory.edit")} />
    </>
  );
}
