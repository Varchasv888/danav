import { getTranslations } from "next-intl/server";
import { Schemes, type SchemeRow } from "@/components/pos/Schemes";
import { PageHeader } from "@/components/ui";
import { items } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("schemes"))("title") };
}

export default async function SchemesPage() {
  const t = await getTranslations("schemes");
  const [schemes, its, me] = await Promise.all([serverApi<SchemeRow[]>("/schemes"), items(), serverApi<Me>("/auth/me")]);
  // Styles need inventory access; without it a scheme can still pick brands, categories and items.
  const styles = me.permissions.includes("inventory.view") ? await serverApi<{ id: string; code: string; name: string }[]>("/styles") : [];
  // Branch names need company access; without it the branch choice is simply not offered.
  const branches = me.permissions.includes("company.view") ? ((await serverApi<{ branches: { id: string; name: string }[] }[]>("/companies"))[0]?.branches ?? []).map((b) => ({ id: b.id, name: b.name })) : [];
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Schemes schemes={schemes} items={its} styles={styles} branches={branches} canEdit={me.permissions.includes("sales.edit")} />
    </>
  );
}
