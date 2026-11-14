import { getTranslations } from "next-intl/server";
import { DatedChanges, type Change, type Kind } from "@/components/settings/DatedChanges";
import { PageHeader } from "@/components/ui";
import { customers, items, suppliers } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("dated"))("title") };
}

export default async function DatedChangesPage() {
  const t = await getTranslations("dated");
  const [changes, fields, its, cs, ss, me] = await Promise.all([
    serverApi<Change[]>("/config/changes"), serverApi<Record<Kind, string[]>>("/config/fields"),
    items<{ id: string; name: string; archived?: boolean }>(), customers(), suppliers(), serverApi<Me>("/auth/me"),
  ]);
  const canRole = me.permissions.includes("users.edit");
  const canSeries = me.permissions.includes("settings.edit");
  const roles = canRole ? await serverApi<{ id: string; key: string; name: string; permissions: string[] }[]>("/roles") : [];
  const series = canSeries ? await serverApi<{ id: string; name: string; pattern: string; fiscalYear: string }[]>("/number-series") : [];
  const parties = [...cs, ...ss].map((p) => ({ id: p.id, name: p.name })).sort((a, b) => a.name.localeCompare(b.name));
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <DatedChanges
        changes={changes} fields={fields} items={its.filter((i) => !i.archived).map((i) => ({ id: i.id, name: i.name }))} parties={parties}
        canItem={me.permissions.includes("inventory.edit")} canParty={me.permissions.includes("accounts.edit")}
        roles={roles.filter((r) => r.key !== "owner").map((r) => ({ id: r.id, name: r.name, permissions: r.permissions }))}
        series={series.map((x) => ({ id: x.id, name: `${x.name} (${x.fiscalYear})`, pattern: x.pattern }))}
      />
    </>
  );
}
