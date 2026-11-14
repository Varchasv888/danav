import { getTranslations } from "next-intl/server";
import type { Account, Group } from "@/components/accounts/ChartOfAccounts";
import { VoucherForm } from "@/components/accounts/VoucherForm";
import { FitScreen, PageHeader } from "@/components/ui";
import { serverApi } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("vouchers"))("new") };
}

export default async function NewVoucherPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const t = await getTranslations("vouchers");
  const [accounts, groups] = await Promise.all([serverApi<Account[]>("/accounts"), serverApi<Group[]>("/accounts/groups")]);
  // Which accounts count as cash/bank, so the form can apply the same voucher rules the API does.
  const cashBankGroupIds = new Set<string>();
  for (const g of groups) {
    const parent = groups.find((p) => p.id === g.parentId);
    if (["cash_in_hand", "bank_accounts", "bank_od"].includes(g.key ?? "") || ["cash_in_hand", "bank_accounts", "bank_od"].includes(parent?.key ?? "")) cashBankGroupIds.add(g.id);
  }
  const options = accounts.filter((a) => !a.archived).map((a) => ({ id: a.id, name: a.name, nameHi: a.nameHi, groupName: a.groupName ?? "", groupNameHi: a.groupNameHi ?? null, cashOrBank: cashBankGroupIds.has(a.groupId), balance: a.balance }));
  return (
    <FitScreen>
      <PageHeader title={t("new")} />
      <VoucherForm accounts={options} initialType={(["journal", "payment", "receipt", "contra"] as const).find((x) => x === type) ?? "payment"} />
    </FitScreen>
  );
}
