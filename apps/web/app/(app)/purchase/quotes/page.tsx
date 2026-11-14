import { Scale } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { QuoteBoard, type QuoteData } from "@/components/purchase/QuoteBoard";
import { Button, PageHeader, Select } from "@/components/ui";
import { items, suppliers } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("quotes"))("title") };
}

/** Supplier quotes for one item side by side, so the order goes to the cheapest landed cost and not the first call. */
export default async function QuotesPage({ searchParams }: { searchParams: Promise<{ itemId?: string }> }) {
  const sp = await searchParams;
  const t = await getTranslations("quotes");
  const [list, sup, me] = await Promise.all([items(), suppliers(), serverApi<Me>("/auth/me")]);
  const goods = list.filter((i) => i.kind === "goods" && !i.archived);
  const itemId = goods.find((i) => i.id === sp.itemId)?.id ?? "";
  const data = itemId ? await serverApi<QuoteData>(`/purchase/quotes?itemId=${itemId}`) : null;
  return (
    <>
      <PageHeader icon={Scale} title={t("title")} subtitle={t("subtitle")} />
      <form className="mb-4 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm"><span className="text-muted">{t("item")}</span>
          <Select name="itemId" defaultValue={itemId} className="w-80 max-w-full"><option value="">{t("chooseItem")}</option>{goods.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}</Select>
        </label>
        <Button type="submit" variant="outline">{t("show")}</Button>
      </form>
      {data ? <QuoteBoard key={itemId} data={data} suppliers={sup.map((s) => ({ id: s.id, name: s.name }))} canEdit={me.permissions.includes("purchase.create")} /> : <p className="text-sm text-muted">{t("pick")}</p>}
    </>
  );
}
