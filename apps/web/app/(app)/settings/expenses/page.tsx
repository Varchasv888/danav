import { getTranslations } from "next-intl/server";
import { CategoriesEditor, type Category } from "@/components/expenses/Claims";
import { PageHeader } from "@/components/ui";
import { ledgers } from "@/lib/ledgers";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("expenses.categories"))("title") };
}

export default async function ExpenseCategoriesPage() {
  const t = await getTranslations();
  const [categories, l, me] = await Promise.all([serverApi<Category[]>("/expenses/categories"), ledgers(), serverApi<Me>("/auth/me")]);
  return (
    <>
      <PageHeader title={t("expenses.categories.title")} subtitle={t("expenses.categories.subtitle")} />
      <CategoriesEditor key={categories.map((c) => `${c.id}:${c.name}:${c.accountId}:${c.blockedCredit}:${c.limitPerClaim}:${c.receiptRequiredAbove}:${c.archived}`).join()}
        categories={categories} accounts={l.under("indirect_expenses", "direct_expenses")} canEdit={me.permissions.includes("expenses.approve")} />
    </>
  );
}
