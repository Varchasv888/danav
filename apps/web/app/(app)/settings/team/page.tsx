import { getTranslations } from "next-intl/server";
import { TeamManager, type Invitation, type Member, type Role } from "@/components/team/TeamManager";
import { PageHeader } from "@/components/ui";
import { inventorySetup } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("team"))("title") };
}

export default async function TeamPage() {
  const t = await getTranslations("team");
  const [members, invitations, roles, me] = await Promise.all([
    serverApi<Member[]>("/members"), serverApi<Invitation[]>("/invitations"), serverApi<Role[]>("/roles"), serverApi<Me>("/auth/me"),
  ]);
  const setup = await inventorySetup().catch(() => null);
  const stores = (setup?.warehouses ?? []).filter((w: { archived?: boolean; inTransit?: boolean }) => !w.archived && !w.inTransit).map((w: { id: string; name: string }) => ({ id: w.id, name: w.name }));
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <TeamManager members={members} invitations={invitations} roles={roles} myRole={me.role ?? ""} permissions={me.permissions} stores={stores} />
    </>
  );
}
