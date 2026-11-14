import { getTranslations } from "next-intl/server";
import { AssetForm, type AssetClass } from "@/components/assets/Assets";
import { PageHeader } from "@/components/ui";
import { ledgers } from "@/lib/ledgers";
import { serverApi } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("assets.register"))("new") };
}

export default async function NewAssetPage() {
  const t = await getTranslations();
  const [classes, l, employees] = await Promise.all([
    serverApi<AssetClass[]>("/assets/classes"), ledgers(), serverApi<{ id: string; code: string; name: string; status: string }[]>("/employees").catch(() => []),
  ]);
  return (
    <>
      <PageHeader title={t("assets.register.new")} subtitle={t("assets.register.subtitle")} />
      <AssetForm classes={classes} suppliers={l.under("sundry_creditors")} cashBank={l.under("cash_in_hand", "bank_accounts", "bank_od")}
        employees={employees.filter((e) => e.status === "active").map(({ id, code, name }) => ({ id, code, name }))} />
    </>
  );
}
