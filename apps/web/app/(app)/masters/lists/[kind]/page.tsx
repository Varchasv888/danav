import { isLookupKind, LOOKUP_KINDS } from "@varchasv/domain";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { LookupList, type LookupRow } from "@/components/masters/LookupList";
import { PageHeader } from "@/components/ui";
import { MENU } from "@/lib/menu";
import { serverApi, type Me } from "@/lib/server-api";

type Props = { params: Promise<{ kind: string }> };

export async function generateMetadata({ params }: Props) {
  const { kind } = await params;
  return { title: isLookupKind(kind) ? (await getTranslations("menu.i"))(kind) : undefined };
}

/** One small master (brand, fabric, region...): its entries, with the other lists of the Masters menu beside it. */
export default async function LookupPage({ params }: Props) {
  const { kind } = await params;
  if (!isLookupKind(kind)) notFound();
  const t = await getTranslations();
  const [rows, counts, me] = await Promise.all([
    serverApi<LookupRow[]>(`/lookups/${kind}?all=1`), serverApi<Record<string, number>>("/lookups"), serverApi<Me>("/auth/me"),
  ]);
  const groups = MENU.flatMap((h) => h.groups);
  const rail = groups
    .map((g) => ({ key: g.key, lists: g.items.map((x) => x.label.replace("menu.i.", "")).filter((k) => isLookupKind(k) && me.permissions.includes(`${LOOKUP_KINDS[k as keyof typeof LOOKUP_KINDS]}.view`)) }))
    .filter((g) => g.lists.length);
  const icon = groups.flatMap((g) => g.items).find((x) => x.label === `menu.i.${kind}`)?.icon;
  const module = LOOKUP_KINDS[kind];
  return (
    <>
      <PageHeader icon={icon} title={t(`menu.i.${kind}`)} subtitle={t("lists.subtitle")} />
      <LookupList kind={kind} rows={rows} counts={counts} rail={rail}
        canCreate={me.permissions.includes(`${module}.create`)} canEdit={me.permissions.includes(`${module}.edit`)} />
    </>
  );
}
