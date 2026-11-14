import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { DisposeForm } from "@/components/assets/Assets";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, PageHeader } from "@/components/ui";
import { localName, rupees } from "@/lib/format";
import { ledgers } from "@/lib/ledgers";
import { homeState } from "@/lib/masters";
import { serverApi, type Me } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("assets.register"))("title") };
}

interface Asset {
  id: string; code: string; name: string; status: string; purchaseDate: string; putToUseOn: string; cost: string; openingAccumulated: string; accumulated: string; bookValue: string;
  location: string | null; serialNo: string | null; invoiceRef: string | null; notes: string | null; disposedOn: string | null; saleValue: string | null;
  class: { name: string; nameHi: string | null; method: string; lifeYears: string; residualPct: string };
  history: { from: string; to: string; amount: string; days: number; voucher: string | null }[]; purchaseVoucher: string | null; disposalVoucher: string | null;
}

export default async function AssetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations();
  const locale = await getLocale();
  const format = await getFormatter();
  const [a, me, l, home] = await Promise.all([serverApi<Asset>(`/assets/${id}`), serverApi<Me>("/auth/me"), ledgers(), homeState()]);
  const day = (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { dateStyle: "medium" });
  const info: [string, string | null][] = [
    [t("assets.register.class"), `${localName(a.class, locale)} · ${t(`assets.classes.methods.${a.class.method}`)} · ${t("assets.classes.life")}: ${Number(a.class.lifeYears)}`],
    [t("assets.register.purchased"), day(a.purchaseDate)], [t("assets.register.putToUse"), day(a.putToUseOn)],
    [t("assets.register.location"), a.location], [t("assets.register.serialNo"), a.serialNo], [t("assets.form.invoiceRef"), a.invoiceRef],
    [t("assets.detail.purchase"), a.purchaseVoucher], [t("assets.form.notes"), a.notes],
  ];
  return (
    <>
      <PageHeader title={a.name} subtitle={<span className="font-mono">{a.code}</span>}
        actions={<StatusBadge status={a.status === "active" ? "open" : "closed"} label={t(`assets.register.statuses.${a.status}`)} />} />
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card><div className="text-sm text-muted">{t("assets.register.cost")}</div><div className="num text-2xl font-semibold">{rupees(a.cost)}</div></Card>
          <Card><div className="text-sm text-muted">{t("assets.register.accumulated")}</div><div className="num text-2xl font-semibold">{rupees(a.accumulated)}</div></Card>
          <Card><div className="text-sm text-muted">{t("assets.register.bookValue")}</div><div className="num text-2xl font-semibold">{rupees(a.bookValue)}</div></Card>
        </div>
        {a.status === "disposed" && a.disposedOn ? <p className="text-sm">{t("assets.detail.disposed", { date: day(a.disposedOn), value: rupees(a.saleValue ?? 0) })} {a.disposalVoucher ? <span className="font-mono text-muted">({a.disposalVoucher})</span> : null}</p> : null}
        <Card>
          <dl className="grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
            {info.filter(([, v]) => v).map(([k, v]) => <div key={k}><dt className="text-muted">{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </Card>
        <Card className="p-0">
          <div className="border-b border-border px-5 py-3 font-semibold">{t("assets.detail.history")}</div>
          <table className="w-full text-sm">
            <thead className="text-left text-muted"><tr className="border-b border-border">
              <th className="px-5 py-2 font-medium">{t("assets.detail.period")}</th><th className="px-5 py-2 text-right font-medium">{t("assets.detail.days")}</th>
              <th className="px-5 py-2 font-medium">{t("assets.detail.voucher")}</th><th className="px-5 py-2 text-right font-medium">{t("assets.depreciation.total")}</th>
            </tr></thead>
            <tbody>
              {Number(a.openingAccumulated) ? <tr className="border-b border-border"><td className="px-5 py-2" colSpan={3}>{t("assets.form.openingAccumulated")}</td><td className="num px-5 py-2 text-right">{rupees(a.openingAccumulated)}</td></tr> : null}
              {a.history.map((h) => (
                <tr key={`${h.from}-${h.to}`} className="border-b border-border last:border-0">
                  <td className="px-5 py-2">{day(h.from)} – {day(h.to)}</td><td className="num px-5 py-2 text-right">{h.days}</td>
                  <td className="px-5 py-2 font-mono text-xs">{h.voucher}</td><td className="num px-5 py-2 text-right">{rupees(h.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        {a.status === "active" && me.permissions.includes("assets.submit") ? <DisposeForm id={a.id} receivers={[...l.under("cash_in_hand", "bank_accounts", "bank_od"), ...l.under("sundry_debtors")]} homeState={home} /> : null}
      </div>
    </>
  );
}
