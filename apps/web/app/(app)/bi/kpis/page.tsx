import { Library } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card, PageHeader } from "@/components/ui";
import { KPIS } from "@/lib/bi-catalogue";

export async function generateMetadata() {
  return { title: (await getTranslations("bi.kpis"))("title") };
}

/** The KPI dictionary: one entry per figure the live analysis shows, with its formula, source and known limits. */
export default async function KpiDictionary() {
  const t = await getTranslations("bi");
  return (
    <>
      <PageHeader icon={Library} title={t("kpis.title")} subtitle={t("kpis.subtitle")} />
      <div className="flex flex-col gap-3">
        {KPIS.map((k) => (
          <Card key={k.id} id={k.id} className="scroll-mt-40">
            <h2 className="font-semibold">{t(`kpi.${k.id}.name`)}</h2>
            <p className="mt-0.5 mb-3 text-sm text-muted">{t(`kpi.${k.id}.what`)}</p>
            <dl className="grid gap-x-6 gap-y-2 text-sm md:grid-cols-2">
              <Row label={t("kpis.formula")}><code className="text-[0.8571rem]">{t(`kpi.${k.id}.formula`)}</code></Row>
              <Row label={t("kpis.unit")}>{t(`kpis.units.${k.unit}`)}</Row>
              <Row label={t("kpis.grain")}>{t(`kpis.grains.${k.grain}`) }</Row>
              <Row label={t("kpis.aggregation")}>{t(`kpis.aggs.${k.aggregation}`)}</Row>
              <Row label={t("kpis.dimensions")}>{k.dimensions.map((d) => t(`kpis.dims.${d}`)).join(", ")}</Row>
              <Row label={t("kpis.permission")}><code className="text-[0.8571rem]">{k.permission}</code></Row>
              <Row label={t("kpis.refresh")}>{t("kpis.refreshLive")}</Row>
              <Row label={t("kpis.source")}><code className="text-[0.8571rem] break-all">{k.source}</code></Row>
              <Row label={t("kpis.limits")} wide>{t(`kpi.${k.id}.limits`)}</Row>
            </dl>
          </Card>
        ))}
      </div>
    </>
  );
}

function Row({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "md:col-span-2" : undefined}>
      <dt className="text-xs font-medium text-muted">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
