import { Repeat } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Recurring, type Template } from "@/components/accounts/Recurring";
import { PageHeader } from "@/components/ui";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("recurring"))("title") };
}

/** Rent, loan instalments, subscriptions: entries that repeat, posted as ordinary vouchers when due. */
export default async function RecurringPage() {
  const t = await getTranslations("recurring");
  const [rows, accounts, me] = await Promise.all([serverApi<Template[]>("/recurring-vouchers"), serverApi<{ id: string; name: string; archived: boolean }[]>("/accounts"), serverApi<Me>("/auth/me")]);
  return (
    <>
      <PageHeader icon={Repeat} title={t("title")} subtitle={t("subtitle")} />
      <Recurring rows={rows} accounts={accounts.filter((a) => !a.archived).map((a) => ({ id: a.id, name: a.name }))} canEdit={me.permissions.includes("accounts.create")} />
    </>
  );
}
