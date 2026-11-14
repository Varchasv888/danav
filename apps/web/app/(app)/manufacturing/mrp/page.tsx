import { getTranslations } from "next-intl/server";
import { MrpPlan, type MrpLine } from "@/components/mfg/Mrp";
import { Button, Input, PageHeader } from "@/components/ui";
import { todayIso } from "@/lib/format";
import { suppliers } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("mfg.mrp"))("title") };
}

export default async function MrpPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const raw = (await searchParams).date;
  const date = raw && /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : todayIso();
  const t = await getTranslations();
  const [plan, sups, me] = await Promise.all([serverApi<MrpLine[]>(`/mrp?date=${date}`), suppliers(), serverApi<Me>("/auth/me")]);
  return (
    <>
      <PageHeader title={t("mfg.mrp.title")} subtitle={t("mfg.mrp.subtitle")}
        actions={(
          <form className="flex items-end gap-3">
            <Input type="date" name="date" defaultValue={date} aria-label={t("mfg.mrp.asOf")} className="w-44" />
            <Button type="submit" variant="outline">{t("common.apply")}</Button>
          </form>
        )} />
      <MrpPlan key={date + plan.length} date={date} lines={plan} suppliers={sups}
        canConvert={me.permissions.includes("purchase.create") && me.permissions.includes("inventory.create")} />
    </>
  );
}
