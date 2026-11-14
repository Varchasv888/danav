import { getTranslations } from "next-intl/server";
import { Billing } from "@/components/pos/Billing";
import { PageHeader } from "@/components/ui";
import { posData } from "@/lib/pos";
import type { Salesman } from "@/components/pos/Checkout";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("pos.billing"))("title") };
}

export default async function BillingPage({ searchParams }: { searchParams: Promise<{ voucher?: string; memo?: string }> }) {
  const { voucher, memo } = await searchParams;
  const t = await getTranslations();
  const [d, salesmen, me] = await Promise.all([posData(), serverApi<Salesman[]>("/pos/salesmen"), serverApi<Me>("/auth/me")]);
  const fromMemo = memo && /^[0-9a-f-]{36}$/.test(memo) ? await serverApi<{ id: string; number: string; status: string; lines: { itemId: string; outQty: string }[] }>(`/approval-memos/${memo}`).catch(() => null) : null;
  return (
    <>
      <PageHeader title={t("pos.billing.title")} />
      <Billing terminals={d.terminals} items={d.items} settings={d.settings} customers={d.customers} voucher={voucher && /^[A-Z2-9]{4,16}$/.test(voucher) ? voucher : undefined}
        memo={fromMemo && fromMemo.status === "open" ? { id: fromMemo.id, number: fromMemo.number, lines: fromMemo.lines.filter((l) => Number(l.outQty) > 0).map((l) => ({ itemId: l.itemId, qty: String(Number(l.outQty)) })) } : undefined}
        salesmen={salesmen} canOverride={me.permissions.includes("sales.approve")} />
    </>
  );
}
