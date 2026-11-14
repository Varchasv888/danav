import { getTranslations } from "next-intl/server";
import { MergeMasters } from "@/components/masters/MergeMasters";
import { PageHeader } from "@/components/ui";
import { customers, items, suppliers } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("merge"))("title") };
}

export default async function MergePage() {
  const t = await getTranslations("merge");
  const [cs, ss, its, me] = await Promise.all([customers(), suppliers(), items<{ id: string; name: string; nameHi: string | null; archived?: boolean }>(), serverApi<Me>("/auth/me")]);
  const pick = (r: { id: string; name: string }[]) => r.map((x) => ({ id: x.id, name: x.name }));
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <MergeMasters
        customers={pick(cs)} suppliers={pick(ss)} items={pick(its.filter((i) => !i.archived))}
        canParty={me.permissions.includes("accounts.edit")} canItem={me.permissions.includes("inventory.edit")}
      />
    </>
  );
}
