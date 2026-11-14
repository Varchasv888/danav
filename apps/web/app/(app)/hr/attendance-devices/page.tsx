import { Fingerprint } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { AttendanceDevices, type Device, type PunchRow } from "@/components/hr/AttendanceDevices";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("devices"))("title") };
}

/** Attendance machines that push their punches to the system, and what they have sent. */
export default async function AttendanceDevicesPage() {
  const t = await getTranslations("devices");
  const [devices, punches, me] = await Promise.all([serverApi<Device[]>("/attendance/devices"), serverApi<PunchRow[]>("/attendance/punches"), serverApi<Me>("/auth/me")]);
  return (
    <>
      <PageHeader icon={Fingerprint} title={t("title")} subtitle={t("subtitle")} />
      <AttendanceDevices devices={devices} punches={punches} canEdit={me.permissions.includes("hr.edit")} />
    </>
  );
}
