import { getTranslations } from "next-intl/server";
import { CatalogueSheet, type SheetTile } from "@/components/inventory/CatalogueSheet";

import { serverApiUrl as API_URL } from "@/lib/server-api-url";
type Shared = { company: string; name: string; party: string | null; until: string | null; tiles: SheetTile[] };

async function load(token: string): Promise<Shared | null> {
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(token)) return null;
  const res = await fetch(`${API_URL}/public/catalogue/${token}`, { cache: "no-store" });
  return res.ok ? ((await res.json()) as Shared) : null;
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }) {
  const s = await load((await params).token);
  return { title: s ? `${s.name} · ${s.company}` : (await getTranslations("catalogue"))("linkExpiredTitle"), robots: { index: false } };
}

/** A shared catalogue: opens without signing in while the link is live. */
export default async function SharedCataloguePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const s = await load(token);
  const t = await getTranslations("catalogue");
  if (!s) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-2 px-6 text-center">
        <h1 className="text-xl font-semibold">{t("linkExpiredTitle")}</h1>
        <p className="text-muted">{t("linkExpired")}</p>
      </main>
    );
  }
  return (
    <main className="min-h-dvh bg-white text-black">
      <CatalogueSheet company={s.company} name={s.name} party={s.party} tiles={s.tiles} image={(id) => `/api/public/catalogue/${token}/files/${id}`} />
    </main>
  );
}
