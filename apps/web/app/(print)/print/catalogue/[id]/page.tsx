import { CatalogueSheet } from "@/components/inventory/CatalogueSheet";
import type { SelectionDetail } from "@/components/inventory/CatalogueSelection";
import { PrintButton } from "@/components/sales/PrintButton";
import { fileUrl } from "@/lib/images";
import { serverApi } from "@/lib/server-api";
import { PrintSetup } from "@/components/print/PrintSetup";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  return { title: (await serverApi<SelectionDetail & { company: { name: string } }>(`/catalogue/selections/${(await params).id}`)).name };
}

/** The selection as a printable catalogue; "Print" also saves it as a PDF from the browser. */
export default async function PrintCataloguePage({ params }: { params: Promise<{ id: string }> }) {
  const s = await serverApi<SelectionDetail & { company: { name: string } }>(`/catalogue/selections/${(await params).id}`);
  const tiles = s.tiles.map((x) => ({
    ...x, rate: s.showPrices ? x.rate : null, mrp: s.showPrices ? x.mrp : null,
    sizes: x.sizes.map((z) => ({ size: z.size, ...(s.showStock ? { inStock: Number(z.stock) > 0 } : {}) })),
  }));
  return (
    <>
      <PrintSetup size="A4" margin="8mm" />
      <div className="no-print mx-auto flex max-w-5xl justify-end px-4 pt-4"><PrintButton /></div>
      <CatalogueSheet company={s.company.name} name={s.name} party={s.party?.name ?? null} tiles={tiles} image={fileUrl} />
    </>
  );
}
