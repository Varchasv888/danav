import { getTranslations } from "next-intl/server";
import { rupees } from "@/lib/format";

export interface SheetTile {
  key: string; code: string; name: string; brand: string | null; color: string | null; colorHex: string | null;
  image: { fileId: string; thumbFileId: string } | null; rate: string | null; mrp: string | null; sizes: { size: string | null; inStock?: boolean }[];
}

/** A catalogue laid out for paper or a phone screen: photo, design, colour, sizes and (if shown) the rate. */
export async function CatalogueSheet({ company, name, party, tiles, image }: {
  company: string; name: string; party: string | null; tiles: SheetTile[]; image: (fileId: string) => string;
}) {
  const t = await getTranslations("catalogue");
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 print:max-w-none print:p-0">
      <header className="mb-5 border-b border-black/20 pb-3">
        <p className="text-sm text-black/60">{company}</p>
        <h1 className="text-xl font-semibold">{name}</h1>
        {party && !name.includes(party) ? <p className="text-sm text-black/60">{t("forPartyLine", { party })}</p> : null}
      </header>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 print:grid-cols-3">
        {tiles.map((x) => (
          <li key={x.key} className="break-inside-avoid overflow-hidden rounded-lg border border-black/15">
            {x.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image(x.image.fileId)} alt={`${x.name} ${x.color ?? ""}`} className="aspect-[3/4] w-full object-cover" />
            ) : <div className="flex aspect-[3/4] items-center justify-center bg-black/5 text-sm text-black/40">{t("noPhoto")}</div>}
            <div className="flex flex-col gap-0.5 px-3 py-2 text-sm">
              <span className="font-medium">{x.name}</span>
              <span className="text-black/60"><span className="font-mono text-xs">{x.code}</span>{x.color ? ` · ${x.color}` : ""}{x.brand ? ` · ${x.brand}` : ""}</span>
              {x.rate ? <span className="num font-semibold">{rupees(x.rate)}{x.mrp ? <span className="ml-2 text-xs font-normal text-black/50">{t("mrp", { v: rupees(x.mrp) })}</span> : null}</span> : null}
              <span className="flex flex-wrap gap-1 text-xs">
                {x.sizes.map((s, i) => <span key={i} className={`rounded border px-1 ${s.inStock === false ? "border-transparent text-black/35 line-through" : "border-black/20"}`}>{s.size ?? "-"}</span>)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
