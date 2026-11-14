import { getTranslations } from "next-intl/server";
import { PayrollSettingsForm, type PayrollSettings } from "@/components/hr/PayrollSettingsForm";
import { Shifts, type Shift } from "@/components/hr/Shifts";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("payroll.settings"))("title") };
}

export default async function PayrollSettingsPage() {
  const t = await getTranslations("payroll.settings");
  const [settings, me, shifts] = await Promise.all([serverApi<PayrollSettings>("/payroll/settings"), serverApi<Me>("/auth/me"), serverApi<Shift[]>("/shifts")]);
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="flex flex-col gap-6">
        <PayrollSettingsForm settings={settings} canEdit={me.permissions.includes("payroll.edit")} />
        <Shifts shifts={shifts} canEdit={me.permissions.includes("hr.edit")} />
      </div>
    </>
  );
}
