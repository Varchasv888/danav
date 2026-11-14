import { getTranslations } from "next-intl/server";
import { Card, PageHeader } from "@/components/ui";
import { serverApi } from "@/lib/server-api";

interface Check { checked: number; differing: number; documents: { kind: string; id: string; number: string; date: string; expected: string; moved: string }[] }

export async function generateMetadata() {
  return { title: (await getTranslations("postingCheck"))("title") };
}

/** Every sale should have taken exactly its pieces out of stock. This lists the ones that did not. */
export default async function PostingCheckPage() {
  const t = await getTranslations("postingCheck");
  const r = await serverApi<Check>("/reports/stock-posting-check");
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <Card className="p-4 text-sm">{r.differing === 0 ? t("clean", { n: r.checked }) : t("differing", { n: r.differing, checked: r.checked })}</Card>
      {r.documents.length ? (
        <Card className="mt-4 p-0">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted"><tr className="border-b border-rule"><th className="px-4 py-1.5 font-medium">{t("document")}</th><th className="px-4 py-1.5 font-medium">{t("date")}</th><th className="px-4 py-1.5 text-right font-medium">{t("expected")}</th><th className="px-4 py-1.5 text-right font-medium">{t("moved")}</th></tr></thead>
            <tbody>{r.documents.map((d) => <tr key={d.id} className="border-b border-rule last:border-0"><td className="px-4 py-1.5">{d.number}<span className="ml-2 text-xs text-muted">{t(`kinds.${d.kind}`)}</span></td><td className="px-4 py-1.5">{d.date}</td><td className="num px-4 py-1.5 text-right">{d.expected}</td><td className="num px-4 py-1.5 text-right">{d.moved}</td></tr>)}</tbody>
          </table>
        </Card>
      ) : null}
    </>
  );
}
