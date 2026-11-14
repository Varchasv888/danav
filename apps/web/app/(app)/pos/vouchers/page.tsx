import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/ui";
import { Vouchers, type Coupon, type DiscountCard, type GiftVoucher, type LuckyDraw } from "@/components/pos/Vouchers";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("promos"))("title") };
}

export default async function VouchersPage() {
  const t = await getTranslations("promos");
  const [vouchers, coupons, cards, draws, me] = await Promise.all([
    serverApi<GiftVoucher[]>("/gift-vouchers"), serverApi<Coupon[]>("/coupons"), serverApi<DiscountCard[]>("/discount-cards"),
    serverApi<LuckyDraw[]>("/lucky-draws"), serverApi<Me>("/auth/me"),
  ]);
  const can = (p: string) => me.permissions.includes(p);
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Vouchers vouchers={vouchers} coupons={coupons} cards={cards} draws={draws} canEdit={can("sales.edit")} canExpire={can("accounts.create")} canDraw={can("sales.approve")} />
    </>
  );
}
