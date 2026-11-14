import { getTranslations } from "next-intl/server";
import { ApprovalMemos } from "@/components/sales/ApprovalMemos";
import { PageHeader } from "@/components/ui";
import { inventorySetup, items as itemList } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("memos"))("title") };
}

export default async function ApprovalMemosPage() {
  const t = await getTranslations("memos");
  const [setup, items, memos, me] = await Promise.all([
    inventorySetup(), itemList(), serverApi<Parameters<typeof ApprovalMemos>[0]["memos"]>("/approval-memos?status=open"), serverApi<Me>("/auth/me"),
  ]);
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <ApprovalMemos
        stores={setup.warehouses.filter((w: { archived?: boolean; inTransit?: boolean }) => !w.archived && !w.inTransit).map((w: { id: string; name: string }) => ({ id: w.id, name: w.name }))}
        items={items.filter((i) => i.kind === "goods" && !i.archived).map((i) => ({ id: i.id, name: i.name }))} memos={memos}
        canCreate={me.permissions.includes("sales.create")} canEdit={me.permissions.includes("sales.edit")}
      />
    </>
  );
}
