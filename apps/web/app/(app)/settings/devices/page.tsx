import { getTranslations } from "next-intl/server";
import { Devices, type DeviceRow, type Rejection } from "@/components/settings/Devices";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("devicesPage"))("title") };
}

export default async function DevicesPage({ searchParams }: { searchParams: Promise<{ show?: string }> }) {
  const t = await getTranslations("devicesPage");
  const show = (await searchParams).show === "done" ? "resolved" : "open";
  const [devices, rejections, me] = await Promise.all([
    serverApi<DeviceRow[]>("/sync/status"), serverApi<Rejection[]>(`/sync/rejections?status=${show}`), serverApi<Me>("/auth/me"),
  ]);
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Devices devices={devices} rejections={rejections} show={show} canEdit={me.permissions.includes("users.edit")} />
    </>
  );
}
