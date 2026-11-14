import { getTranslations } from "next-intl/server";
import { Labels, type Sellable } from "@/components/inventory/Labels";
import type { LabelItem } from "@/components/inventory/LabelSheet";
import { PageHeader } from "@/components/ui";
import { serverApi } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("labels"))("title") };
}

type Item = { id: string; name: string; sku: string | null; barcode: string | null; mrp: string | null; saleRate: string; color: string | null; size: string | null; styleId: string | null; kind: string; archived: boolean; isPack: boolean; stockQty: string };

export default async function LabelsPage({ searchParams }: { searchParams: Promise<{ bill?: string; receipt?: string; style?: string; invoice?: string; delivery?: string; journal?: string; fixedBarcode?: string }> }) {
  const sp = await searchParams;
  const t = await getTranslations("labels");
  const [items, styles, companies] = await Promise.all([
    serverApi<Item[]>("/items"), serverApi<{ id: string; code: string; name: string; archived: boolean; imageFileId?: string | null; attributes?: Record<string, string> }[]>("/styles"), serverApi<{ name: string }[]>("/companies"),
  ]);
  const code = new Map(styles.map((s) => [s.id, s.code]));
  const photo = new Map(styles.map((s) => [s.id, s.imageFileId ?? null]));
  const attrs = new Map(styles.map((s) => [s.id, Object.fromEntries(Object.entries(s.attributes ?? {}).filter(([, v]) => v))]));
  const sellable: Sellable[] = items.filter((i) => i.kind === "goods" && !i.archived).map((i) => ({
    itemId: i.id, name: i.name, design: i.styleId ? code.get(i.styleId) ?? null : null, color: i.color, size: i.size, barcode: i.barcode, sku: i.sku,
    mrp: i.mrp, price: i.saleRate, photo: i.styleId ? photo.get(i.styleId) ?? null : null, attrs: i.styleId ? attrs.get(i.styleId) : undefined, stock: Math.max(0, Math.floor(Number(i.stockQty))),
  }));
  // Labels for a purchase bill's goods (one per piece received) or one of each piece of a design.
  let initial: LabelItem[] = [];
  const uuid = /^[0-9a-f-]{36}$/;
  const fromDoc = sp.bill && uuid.test(sp.bill) ? `/purchase-bills/${sp.bill}` : sp.receipt && uuid.test(sp.receipt) ? `/goods-receipts/${sp.receipt}`
    : sp.invoice && uuid.test(sp.invoice) ? `/sales-invoices/${sp.invoice}` : sp.delivery && uuid.test(sp.delivery) ? `/delivery-notes/${sp.delivery}` : sp.journal && uuid.test(sp.journal) ? `/stock-journals/${sp.journal}` : null;
  if (fromDoc) {
    const bill = await serverApi<{ lines: { itemId: string; qty?: string; qtyIn?: string }[] }>(fromDoc);
    initial = bill.lines.flatMap((l) => {
      const it = sellable.find((x) => x.itemId === l.itemId);
      return it ? [{ ...it, qty: Math.floor(Number(l.qty ?? l.qtyIn ?? 0)) }] : [];
    });
  } else if (sp.style && uuid.test(sp.style)) {
    initial = sellable.filter((x) => x.design === code.get(sp.style!)).map((x) => ({ ...x, qty: 1 }));
  }
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Labels items={sellable} styles={styles.filter((s) => !s.archived).map(({ id, code: c, name }) => ({ id, code: c, name }))} business={companies[0]?.name ?? ""} initial={initial} fixedBarcodeSelection={sp.fixedBarcode === "1"} />
    </>
  );
}
