import { getTranslations } from "next-intl/server";
import type { Terminal } from "@/components/pos/Billing";
import type { PosSettings } from "@/components/pos/Checkout";
import { PosSettingsForm, TerminalsEditor } from "@/components/pos/PosSettingsForm";
import { PageHeader } from "@/components/ui";
import { inventorySetup } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("pos.settings"))("title") };
}

export default async function PosSettingsPage() {
  const t = await getTranslations();
  const me = await serverApi<Me>("/auth/me");
  const [settings, terminals, setup, devices] = await Promise.all([
    serverApi<PosSettings>("/pos/settings"), serverApi<Terminal[]>("/pos/terminals"), inventorySetup(),
    me.permissions.includes("users.view") ? serverApi<{ id: string; name: string; revokedAt: string | null }[]>("/devices") : Promise.resolve(null),
  ]);
  const canEdit = me.permissions.includes("sales.edit");
  return (
    <>
      <PageHeader title={t("pos.settings.title")} subtitle={t("pos.settings.subtitle")} />
      <div className="flex flex-col gap-6">
        <PosSettingsForm settings={settings} canEdit={canEdit} />
        <TerminalsEditor key={terminals.map((x) => `${x.id}:${x.name}:${x.warehouseId}:${x.deviceId}:${x.archived}`).join()} terminals={terminals} canEdit={canEdit}
          warehouses={setup.warehouses.filter((w) => !w.archived).map(({ id, name }) => ({ id, name }))}
          devices={devices ? devices.filter((d) => !d.revokedAt).map(({ id, name }) => ({ id, name })) : null} />
      </div>
    </>
  );
}
