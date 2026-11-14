import { Landmark } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { sum } from "@varchasv/domain";
import { Amendments, type Amendment } from "@/components/gst/Amendments";
import { ThreeBCompare, type CompareData } from "@/components/gst/ThreeBCompare";
import { DownloadJson } from "@/components/gst/DownloadJson";
import { DownloadXlsx } from "@/components/gst/DownloadXlsx";
import { Gstr1Transactions } from "@/components/gst/Gstr1Transactions";
import { FileReturn, PortalConnection, type Filing, type PortalStatus } from "@/components/gst/Filing";
import type { GstSettings } from "@/components/gst/GstSettingsForm";
import { ManualFiling, type Workpaper } from "@/components/gst/ManualFiling";
import { Button, Card, PageHeader, Select } from "@/components/ui";
import Link from "next/link";
import { rupees, todayIso } from "@/lib/format";
import { gstr1OfflineSheets, type Gstr1Json } from "@/lib/gstr1-offline";
import { serverApi, type Me } from "@/lib/server-api";

interface Sum { count: number; taxable: string; tax: string; total: string }
interface TimeBar { dueDate: string; lastDay: string; barred: boolean }
interface Gstr1 { summary: Record<"B2B" | "B2CL" | "B2CS" | "EXP" | "creditNotes", Sum> & { cancelledInvoices: number }; json: unknown; timeBar: TimeBar }
type Heads = { igst: string; cgst: string; sgst: string; cess: string };
interface FromStatement {
  claim: Heads;
  heldBack: { queried: Heads; notAvailable: Heads; inStatementNotInBooks: Heads; inBooksNotInStatement: Heads };
  counts: { claimed: number; queried: number; notAvailable: number; inStatementNotInBooks: number; inBooksNotInStatement: number };
}
interface Comparison { imported: boolean; rows?: number; itcPer2b?: Heads; itcPerBooks?: Heads; inBooksNotIn2b?: { count: number; tax: Heads }; in2bNotInBooks?: number; queried?: number; accepted?: number; notAvailableIn2b?: number }
interface Gstr3b {
  "3.1": Record<"a_taxable" | "b_zeroRated" | "c_nilExempt" | "d_inwardReverseCharge", Heads & { taxable: string }> & { e_nonGst: string };
  "3.2": { unregistered: { pos: string; taxable: string; igst: string }[] };
  "4": {
    a1_importGoods: Heads; a2_importServices: Heads; a3_reverseCharge: Heads; a4_isd: Heads; a5_allOther: Heads; a5_reclaimed: Heads; available: Heads;
    b1_reversedRules: Heads; b2_reversedOthers: Heads; reversed: Heads; d_ineligible: { rules: Heads; others: Heads }; netItc: Heads; shortfall: Heads;
    itcBasis: "books" | "2b"; itcBasisNote: string | null; fromStatement: FromStatement | null;
  };
  timeBar: TimeBar;
  "5": { exemptInter: string; exemptIntra: string; nonGstInter: string; nonGstIntra: string };
  "5.1": { interest: Heads; lateFee: Heads };
  comparison: Comparison;
  liability: Heads;
  setOff: { paidByCredit: Record<keyof Heads, Heads>; cashPayable: Heads; creditCarriedForward: Heads; reverseChargeCash: Heads };
}

export async function generateMetadata() {
  return { title: (await getTranslations("returns"))("title") };
}

/** The last 13 months as MMYYYY, newest first. */
function periods(today: string) {
  const out: { fp: string; label: string }[] = [];
  let y = Number(today.slice(0, 4));
  let m = Number(today.slice(5, 7));
  for (let i = 0; i < 13; i++) {
    out.push({ fp: `${String(m).padStart(2, "0")}${y}`, label: new Date(Date.UTC(y, m - 1, 1)).toLocaleString("en-IN", { month: "long", year: "numeric", timeZone: "UTC" }) });
    m -= 1;
    if (m === 0) { m = 12; y -= 1; }
  }
  return out;
}

export default async function GstReturnsPage({ searchParams }: { searchParams: Promise<{ period?: string; basis?: string }> }) {
  const options = periods(todayIso());
  const sp = await searchParams;
  const period = sp.period ?? options[0]!.fp;
  // Input credit from the books (default) or driven by the imported GSTR-2B statement.
  const basis = sp.basis === "2b" ? "2b" : "books";
  const t = await getTranslations();
  let g1: Gstr1 | null = null;
  let g3: Gstr3b | null = null;
  let portal: PortalStatus | null = null;
  let gstSettings: GstSettings | null = null;
  let filings: Filing[] = [];
  let wp1: Workpaper | null = null;
  let wp3: Workpaper | null = null;
  let amendments: Amendment[] = [];
  let compare: CompareData | null = null;
  let problem: string | null = null;
  const me = await serverApi<Me>("/auth/me");
  try {
    [g1, g3, portal, filings, wp1, wp3, gstSettings, amendments, compare] = await Promise.all([
      serverApi<Gstr1>(`/gst/gstr1?period=${period}`), serverApi<Gstr3b>(`/gst/gstr3b?period=${period}&basis=${basis}`), serverApi<PortalStatus>("/gst/portal"), serverApi<Filing[]>("/gst/filings"),
      serverApi<Workpaper>(`/gst/workpaper?returnType=GSTR1&period=${period}`), serverApi<Workpaper>(`/gst/workpaper?returnType=GSTR3B&period=${period}`),
      serverApi<GstSettings>("/gst/settings"), serverApi<Amendment[]>(`/gst/amendments?period=${period}`), serverApi<CompareData>(`/gst/gstr3b/compare?period=${period}&basis=${basis}`),
    ]);
  } catch {
    problem = t("common.errors.generic");
  }
  const filingOf = (rt: "GSTR1" | "GSTR3B") => filings.find((f) => f.returnType === rt && f.period === period);
  const canUpload = me.permissions.includes("gst.submit");
  const canFile = me.permissions.includes("gst.approve");
  const filingMethod = gstSettings?.filingMethod ?? "manual";
  const cashTotal = g3 ? heads2cash(g3) : "0";
  const heads = ["igst", "cgst", "sgst", "cess"] as const;
  const headRow = (label: string, h: Heads & { taxable?: string }, strong = false) => (
    <tr className={`border-b border-border ${strong ? "font-semibold" : ""}`}>
      <td className="px-4 py-2">{label}</td>
      <td className="num whitespace-nowrap px-4 py-2 text-right">{h.taxable !== undefined ? rupees(h.taxable) : ""}</td>
      {heads.map((k) => <td key={k} className="num whitespace-nowrap px-4 py-2 text-right">{Number(h[k]) ? rupees(h[k]) : "-"}</td>)}
    </tr>
  );
  const headHeader = (
    <thead className="text-left text-muted">
      <tr className="border-b border-border">
        <th className="px-4 py-2 font-medium" />
        <th className="px-4 py-2 text-right font-medium">{t("returns.taxable")}</th>
        {heads.map((k) => <th key={k} className="px-4 py-2 text-right font-medium">{k.toUpperCase()}</th>)}
      </tr>
    </thead>
  );

  const periodLabel = options.find((o) => o.fp === period)?.label ?? period;
  const n = (v: string) => Number(v) || 0;
  const g1SummaryKeys = ["B2B", "B2CL", "B2CS", "EXP", "creditNotes"] as const;
  const g1EntryCount = g1?.summary ? g1SummaryKeys.reduce((total, key) => total + (g1.summary[key]?.count ?? 0), 0) : 0;
  const g1TaxableTotal = g1?.summary ? sum(g1SummaryKeys.map((key) => g1.summary[key]?.taxable ?? "0")).toFixed(2) : "0.00";
  const g1TaxTotal = g1?.summary ? sum(g1SummaryKeys.map((key) => g1.summary[key]?.tax ?? "0")).toFixed(2) : "0.00";
  const g1Sheets = g1 ? [{
    title: "GSTR-1", note: `${periodLabel}. ${t("returns.cancelled")}: ${g1.summary.cancelledInvoices}`, totalLabel: t("table.total", { count: 5 }),
    columns: [{ label: t("returns.section"), type: "text" as const, width: 28 }, { label: t("returns.count"), type: "count" as const }, { label: `${t("returns.taxable")} (₹)`, type: "money" as const }, { label: `${t("returns.tax")} (₹)`, type: "money" as const }],
    rows: (["b2b", "b2cl", "b2cs", "exp", "cdn"] as const).map((label, i) => { const k = (["B2B", "B2CL", "B2CS", "EXP", "creditNotes"] as const)[i]!; return [t(`returns.${label}`), g1!.summary[k].count, n(g1!.summary[k].taxable), n(g1!.summary[k].tax)]; }),
  }] : [];
  const g3Rows = g3 ? ([
    [t("returns.outward"), g3["3.1"].a_taxable], [t("returns.zeroRated"), g3["3.1"].b_zeroRated], [t("returns.nil"), g3["3.1"].c_nilExempt], [t("returns.rcm"), g3["3.1"].d_inwardReverseCharge], [t("returns.itc"), g3["4"].netItc],
  ] as [string, Heads & { taxable?: string }][]) : [];
  const g3Sheets = g3 ? [
    { title: "GSTR-3B", note: periodLabel,
      columns: [{ label: "", type: "text" as const, width: 36 }, { label: `${t("returns.taxable")} (₹)`, type: "money" as const }, ...heads.map((k) => ({ label: `${k.toUpperCase()} (₹)`, type: "money" as const }))],
      rows: g3Rows.map(([label, h]) => [label, h.taxable === undefined ? null : n(h.taxable), ...heads.map((k) => n(h[k]))]) },
    { title: t("returns.setOff"), note: periodLabel, totalLabel: t("table.total", { count: 4 }),
      columns: [{ label: t("returns.head"), type: "text" as const }, ...[t("returns.liability"), t("returns.paidByCredit"), t("returns.cash"), t("returns.carryForward")].map((label) => ({ label: `${label} (₹)`, type: "money" as const }))],
      rows: heads.map((h) => [h.toUpperCase(), n(g3!.liability[h]), heads.reduce((sm, from) => sm + n(g3!.setOff.paidByCredit[from][h]), 0), n(g3!.setOff.cashPayable[h]) + n(g3!.setOff.reverseChargeCash[h]), n(g3!.setOff.creditCarriedForward[h])]) },
    ...(() => {
      const four = g3!["4"];
      const h = (label: string, x: Heads): (string | number | null)[] => [label, ...heads.map((k) => n(x[k]))];
      const headCols = [{ label: "", type: "text" as const, width: 44 }, ...heads.map((k) => ({ label: `${k.toUpperCase()} (₹)`, type: "money" as const }))];
      const unreg = g3!["3.2"].unregistered;
      const cmp = g3!.comparison;
      return [
        { title: "3.2", note: `${periodLabel}. ${t("gstmanual.t32")}`, totalLabel: t("table.total", { count: 2 }),
          columns: [{ label: t("gstmanual.pos"), type: "text" as const, width: 22 }, { label: `${t("returns.taxable")} (₹)`, type: "money" as const }, { label: "IGST (₹)", type: "money" as const }],
          rows: unreg.map((u) => [u.pos, n(u.taxable), n(u.igst)]) },
        { title: "4 ITC", note: `${periodLabel}. ${t("gstmanual.t4")}`, columns: headCols,
          rows: [h(t("gstmanual.rows.importGoods"), four.a1_importGoods), h(t("gstmanual.rows.importServices"), four.a2_importServices), h(t("gstmanual.rows.reverseCharge"), four.a3_reverseCharge), h(t("gstmanual.rows.isd"), four.a4_isd),
            h(t("gstmanual.allOther"), four.a5_allOther), h(t("gstmanual.reclaimed"), four.a5_reclaimed), h(t("gstmanual.available"), four.available),
            h(t("gstmanual.rows.reversalRules"), four.b1_reversedRules), h(t("gstmanual.reversedOthers"), four.b2_reversedOthers), h(t("gstmanual.netItc"), four.netItc), h(t("gstmanual.shortfall"), four.shortfall),
            h(t("gstmanual.rows.ineligibleRule"), four.d_ineligible.rules), h(t("gstmanual.rows.ineligibleOther"), four.d_ineligible.others)] },
        { title: "5 and 5.1", note: periodLabel,
          columns: [{ label: "", type: "text" as const, width: 44 }, { label: "₹", type: "money" as const }, { label: "", type: "money" as const }, { label: "", type: "money" as const }, { label: "", type: "money" as const }],
          rows: [[t("gstmanual.rows.exemptInwardInter"), n(g3!["5"].exemptInter), null, null, null], [t("gstmanual.rows.exemptInwardIntra"), n(g3!["5"].exemptIntra), null, null, null],
            [t("gstmanual.rows.nonGstInwardInter"), n(g3!["5"].nonGstInter), null, null, null], [t("gstmanual.rows.nonGstInwardIntra"), n(g3!["5"].nonGstIntra), null, null, null],
            [t("gstmanual.rows.interest"), ...heads.map((k) => n(g3!["5.1"].interest[k]))], [t("gstmanual.rows.lateFee"), ...heads.map((k) => n(g3!["5.1"].lateFee[k]))]] },
        ...(cmp.imported ? [{ title: "ITC vs 2B", note: periodLabel, columns: headCols,
          rows: [h(t("gstmanual.cmp.per2b"), cmp.itcPer2b!), h(t("gstmanual.cmp.perBooks"), cmp.itcPerBooks!), h(t("gstmanual.cmp.booksNot2b"), cmp.inBooksNotIn2b!.tax)] }] : []),
      ];
    })(),
  ] : [];
  const itcRows: [string, Heads, boolean?][] = g3 ? [
    [t("gstmanual.rows.importGoods"), g3["4"].a1_importGoods], [t("gstmanual.rows.importServices"), g3["4"].a2_importServices], [t("gstmanual.rows.reverseCharge"), g3["4"].a3_reverseCharge], [t("gstmanual.rows.isd"), g3["4"].a4_isd],
    [t("gstmanual.allOther"), g3["4"].a5_allOther], [t("gstmanual.reclaimed"), g3["4"].a5_reclaimed], [t("gstmanual.available"), g3["4"].available, true],
    [t("gstmanual.rows.reversalRules"), g3["4"].b1_reversedRules], [t("gstmanual.reversedOthers"), g3["4"].b2_reversedOthers], [t("gstmanual.netItc"), g3["4"].netItc, true],
    ...(heads.some((k) => n(g3!["4"].shortfall[k])) ? [[t("gstmanual.shortfall"), g3["4"].shortfall, true] as [string, Heads, boolean]] : []),
    [t("gstmanual.rows.ineligibleRule"), g3["4"].d_ineligible.rules], [t("gstmanual.rows.ineligibleOther"), g3["4"].d_ineligible.others],
  ] : [];
  const g1Offline = g1 ? gstr1OfflineSheets(g1.json as Gstr1Json, periodLabel) : [];
  const cmp = g3?.comparison;

  return (
    <>
      <PageHeader icon={Landmark} title={t("returns.title")} subtitle={t("returns.subtitle")}
        actions={(
          <form className="flex items-end gap-3">
            <label className="flex flex-col gap-1 text-sm"><span className="text-muted">{t("returns.period")}</span>
              <Select name="period" defaultValue={period} className="w-48">{options.map((o) => <option key={o.fp} value={o.fp}>{o.label}</option>)}</Select>
            </label>
            <Button type="submit" variant="outline">{t("common.apply")}</Button>
          </form>
        )}
      />
      {problem ? <Card><p className="text-sm text-danger">{problem}</p></Card> : null}
      {g1?.summary && g3 && portal ? (
        <div className="flex flex-col gap-6">
          {filingMethod === "manual" ? <Card><p className="text-sm text-muted">{t("gstSettings.manualHint")}</p></Card> : <PortalConnection status={portal} canConnect={canUpload} />}
          <nav aria-label="Return sections" className="-mb-2 flex flex-wrap gap-2 print:hidden">
            {[["#gstr1", "GSTR-1"], ["#gstr3b", "GSTR-3B"], ["#itc-match", t("gstmanual.cmp.title")]].map(([href, label]) => (
              <a key={href} href={href} className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-medium text-muted shadow-raised transition-colors hover:border-primary/40 hover:text-primary">{label}</a>
            ))}
          </nav>
          <section aria-label="Return overview" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "GSTR-1 section entries", value: String(g1EntryCount), note: `${periodLabel} · ${g1.summary.cancelledInvoices} cancelled` },
              { label: t("returns.taxable"), value: rupees(g1TaxableTotal), note: "GSTR-1 reported sections" },
              { label: t("returns.tax"), value: rupees(g1TaxTotal), note: "GSTR-1 tax reported" },
              { label: t("returns.cash"), value: rupees(cashTotal), note: "GSTR-3B cash payable" },
            ].map((item) => (
              <div key={item.label} className="surface-raised rounded-xl border border-border/80 bg-surface px-4 py-3.5">
                <p className="text-xs font-semibold tracking-wide text-muted uppercase">{item.label}</p>
                <p className="num mt-1 text-xl font-bold tracking-tight text-text">{item.value}</p>
                <p className="mt-1 truncate text-xs text-muted">{item.note}</p>
              </div>
            ))}
          </section>
          {[["GSTR-1", g1.timeBar], ["GSTR-3B", g3.timeBar]].map(([label, tb]) => {
            const bar = tb as TimeBar;
            return (
              <p key={label as string} role={bar.barred ? "alert" : undefined} className={`rounded-lg border px-4 py-2.5 text-sm ${bar.barred ? "border-danger/40 bg-danger-soft text-danger" : "border-border bg-surface text-muted"}`}>
                {bar.barred ? t("gstfile.barred", { ret: label as string, period: periodLabel, date: bar.lastDay }) : t("gstfile.dates", { ret: label as string, due: bar.dueDate, last: bar.lastDay })}
              </p>
            );
          })}
          <Card id="itc-basis" className="scroll-mt-32">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">{t("gstfile.basisTitle")}</h2>
                <p className="mt-0.5 text-sm text-muted">{t(`gstfile.basis.${g3["4"].itcBasis}`)}</p>
              </div>
              <div role="group" aria-label={t("gstfile.basisTitle")} className="flex gap-1.5">
                {(["books", "2b"] as const).map((b) => (
                  <Link key={b} href={`/gst/returns?period=${period}&basis=${b}`} aria-current={basis === b ? "true" : undefined}
                    className={`inline-flex h-9 items-center rounded-lg border px-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-primary ${basis === b ? "border-primary bg-primary-soft text-primary" : "border-border bg-surface text-muted hover:bg-surface-2"}`}>{t(`gstfile.basisName.${b}`)}</Link>
                ))}
              </div>
            </div>
            {g3["4"].itcBasisNote === "no_2b_import" ? <p role="status" className="mt-3 text-sm text-accent">{t("gstfile.noImport")}</p> : null}
            {g3["4"].itcBasis === "2b" && g3["4"].fromStatement ? (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead className="text-left text-muted">
                    <tr className="border-b border-border"><th className="px-4 py-2 font-medium" />{heads.map((k) => <th key={k} className="px-4 py-2 text-right font-medium">{k.toUpperCase()}</th>)}</tr>
                  </thead>
                  <tbody>
                    {([
                      ["claim", g3["4"].fromStatement.claim, g3["4"].fromStatement.counts.claimed],
                      ["queried", g3["4"].fromStatement.heldBack.queried, g3["4"].fromStatement.counts.queried],
                      ["notAvailable", g3["4"].fromStatement.heldBack.notAvailable, g3["4"].fromStatement.counts.notAvailable],
                      ["inStatementNotInBooks", g3["4"].fromStatement.heldBack.inStatementNotInBooks, g3["4"].fromStatement.counts.inStatementNotInBooks],
                      ["inBooksNotInStatement", g3["4"].fromStatement.heldBack.inBooksNotInStatement, g3["4"].fromStatement.counts.inBooksNotInStatement],
                    ] as [string, Heads, number][]).map(([key, h, count]) => (
                      <tr key={key} className={`border-b border-border ${key === "claim" ? "font-semibold" : ""}`}>
                        <td className="px-4 py-2">{t(`gstfile.rows.${key}`)} <span className="text-muted">({count})</span></td>
                        {heads.map((k) => <td key={k} className="num whitespace-nowrap px-4 py-2 text-right">{Number(h[k]) ? rupees(h[k]) : "-"}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </Card>
          <Card id="gstr1" className="scroll-mt-32 overflow-hidden p-0">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-3">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <h2 className="font-semibold">{t("returns.gstr1")}</h2>
                <DownloadJson data={g1.json} filename={`GSTR1_${period}.json`} label={t("returns.download")} />
                <DownloadXlsx filename={`GSTR1_${period}_summary`} sheets={g1Sheets} label={t("returns.downloadExcel")} />
                <DownloadXlsx filename={`GSTR1_${period}_offline_utility`} sheets={g1Offline} label={t("gstmanual.offlineExcel")} className="h-auto min-h-9 max-w-full whitespace-normal text-center" />
              </div>
              {filingMethod === "provider" ? <FileReturn returnType="GSTR1" period={period} filing={filingOf("GSTR1")} connected={portal.connected} canUpload={canUpload} canFile={canFile} /> : null}
            </div>
            <Gstr1Transactions data={g1.json as Gstr1Json} summary={g1.summary} labels={{ section: t("returns.section"), count: t("returns.count"), taxable: t("returns.taxable"), tax: t("returns.tax"), cancelled: t("returns.cancelled") }} />
            <p className="border-t border-border px-4 py-2 text-xs text-muted">{t("gstmanual.offlineNote")}</p>
          </Card>
          {wp1 ? <ManualFiling key={`1${period}${wp1.status}${wp1.updatedAt ?? ""}`} wp={wp1} canPrepare={canUpload} canSign={canFile} /> : null}
          <Amendments key={`am${period}${amendments.length}`} period={period} rows={amendments} canEdit={canUpload} locked={wp1?.status === "filed"} />
          <Card id="gstr3b" className="scroll-mt-32 overflow-hidden p-0">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-3">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <h2 className="font-semibold">{t("returns.gstr3b")}</h2>
                <DownloadJson data={(g3 as Gstr3b & { json: unknown }).json} filename={`GSTR3B_${period}.json`} label={t("returns.download")} />
                <DownloadXlsx filename={`GSTR3B_${period}_workings`} sheets={g3Sheets} label={t("returns.downloadExcel")} />
              </div>
              {filingMethod === "provider" ? <FileReturn returnType="GSTR3B" period={period} filing={filingOf("GSTR3B")} connected={portal.connected} canUpload={canUpload} canFile={canFile} cashPayable={cashTotal} /> : null}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                {headHeader}
                <tbody>
                  {headRow(t("returns.outward"), g3["3.1"].a_taxable)}
                  {headRow(t("returns.zeroRated"), g3["3.1"].b_zeroRated)}
                  {headRow(t("returns.nil"), g3["3.1"].c_nilExempt)}
                  {headRow(t("returns.rcm"), g3["3.1"].d_inwardReverseCharge)}
                  {headRow(t("returns.itc"), g3["4"].netItc, true)}
                </tbody>
              </table>
              <h3 className="border-t border-border px-4 pt-3 text-sm font-semibold">{t("returns.setOff")}</h3>
              <table className="w-full min-w-[640px] text-sm">
                <thead className="text-left text-muted">
                  <tr className="border-b border-border">
                    <th className="px-4 py-2 font-medium">{t("returns.head")}</th>
                    <th className="px-4 py-2 text-right font-medium">{t("returns.liability")}</th>
                    <th className="px-4 py-2 text-right font-medium">{t("returns.paidByCredit")}</th>
                    <th className="px-4 py-2 text-right font-medium">{t("returns.cash")}</th>
                    <th className="px-4 py-2 text-right font-medium">{t("returns.carryForward")}</th>
                  </tr>
                </thead>
                <tbody>
                  {heads.map((h) => {
                    const paid = heads.reduce((s, from) => s + Number(g3!.setOff.paidByCredit[from][h]), 0);
                    const cash = Number(g3!.setOff.cashPayable[h]) + Number(g3!.setOff.reverseChargeCash[h]);
                    return (
                      <tr key={h} className="border-b border-border">
                        <td className="px-4 py-2 font-medium">{h.toUpperCase()}</td>
                        <td className="num whitespace-nowrap px-4 py-2 text-right">{rupees(g3!.liability[h])}</td>
                        <td className="num whitespace-nowrap px-4 py-2 text-right">{rupees(paid.toFixed(2))}</td>
                        <td className="num px-4 py-2 text-right font-semibold">{rupees(cash.toFixed(2))}</td>
                        <td className="num whitespace-nowrap px-4 py-2 text-right">{rupees(g3!.setOff.creditCarriedForward[h])}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <h3 className="border-t border-border px-4 pt-3 text-sm font-semibold">{t("gstmanual.t4title")}</h3>
              <table className="w-full min-w-[640px] text-sm">
                <thead className="text-left text-muted">
                  <tr className="border-b border-border"><th className="px-4 py-2 font-medium" />{heads.map((k) => <th key={k} className="px-4 py-2 text-right font-medium">{k.toUpperCase()}</th>)}</tr>
                </thead>
                <tbody>
                  {itcRows.map(([label, h, strong]) => (
                    <tr key={label} className={`border-b border-border ${strong ? "font-semibold" : ""}`}>
                      <td className="px-4 py-2">{label}</td>
                      {heads.map((k) => <td key={k} className="num whitespace-nowrap px-4 py-2 text-right">{Number(h[k]) ? rupees(h[k]) : "-"}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
              <h3 className="border-t border-border px-4 pt-3 text-sm font-semibold">{t("gstmanual.t32title")}</h3>
              {g3["3.2"].unregistered.length ? (
                <table className="w-full min-w-[640px] text-sm">
                  <thead className="text-left text-muted"><tr className="border-b border-border"><th className="px-4 py-2 font-medium">{t("gstmanual.pos")}</th><th className="px-4 py-2 text-right font-medium">{t("returns.taxable")}</th><th className="px-4 py-2 text-right font-medium">IGST</th></tr></thead>
                  <tbody>{g3["3.2"].unregistered.map((u) => (
                    <tr key={u.pos} className="border-b border-border"><td className="px-4 py-2">{u.pos}</td><td className="num whitespace-nowrap px-4 py-2 text-right">{rupees(u.taxable)}</td><td className="num whitespace-nowrap px-4 py-2 text-right">{rupees(u.igst)}</td></tr>
                  ))}</tbody>
                </table>
              ) : <p className="px-4 py-3 text-sm text-muted">{t("gstmanual.t32none")}</p>}
              <h3 className="border-t border-border px-4 pt-3 text-sm font-semibold">{t("gstmanual.t51title")}</h3>
              <table className="w-full min-w-[640px] text-sm">
                <thead className="text-left text-muted">
                  <tr className="border-b border-border"><th className="px-4 py-2 font-medium" />{heads.map((k) => <th key={k} className="px-4 py-2 text-right font-medium">{k.toUpperCase()}</th>)}</tr>
                </thead>
                <tbody>
                  {([["interest", g3["5.1"].interest], ["lateFee", g3["5.1"].lateFee]] as const).map(([k, h]) => (
                    <tr key={k} className="border-b border-border"><td className="px-4 py-2">{t(`gstmanual.rows.${k}`)}</td>{heads.map((x) => <td key={x} className="num whitespace-nowrap px-4 py-2 text-right">{Number(h[x]) ? rupees(h[x]) : "-"}</td>)}</tr>
                  ))}
                </tbody>
              </table>
              <p className="px-4 py-2 text-xs text-muted">{t("gstmanual.t51note")}</p>
            </div>
          </Card>
          {cmp ? (
            <Card id="itc-match" className="scroll-mt-32 overflow-hidden p-0">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
                <h2 className="font-semibold">{t("gstmanual.cmp.title")}</h2>
                <Link href="/gst/workspace" className="text-sm text-primary hover:underline">{t("gstmanual.cmp.open")}</Link>
              </div>
              {cmp.imported ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead className="text-left text-muted"><tr className="border-b border-border"><th className="px-4 py-2 font-medium" />{heads.map((k) => <th key={k} className="px-4 py-2 text-right font-medium">{k.toUpperCase()}</th>)}</tr></thead>
                    <tbody>
                      {([[t("gstmanual.cmp.per2b"), cmp.itcPer2b!], [t("gstmanual.cmp.perBooks"), cmp.itcPerBooks!], [t("gstmanual.cmp.booksNot2b"), cmp.inBooksNotIn2b!.tax]] as [string, Heads][]).map(([label, h]) => (
                        <tr key={label} className="border-b border-border"><td className="px-4 py-2">{label}</td>{heads.map((x) => <td key={x} className="num whitespace-nowrap px-4 py-2 text-right">{Number(h[x]) ? rupees(h[x]) : "-"}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="px-4 py-3 text-sm text-muted">{t("gstmanual.cmp.counts", { notIn2b: cmp.inBooksNotIn2b!.count, notInBooks: cmp.in2bNotInBooks ?? 0, queried: cmp.queried ?? 0, notAvailable: cmp.notAvailableIn2b ?? 0 })}</p>
                </div>
              ) : <p className="px-4 py-3 text-sm text-muted">{t("gstmanual.cmp.none")}</p>}
            </Card>
          ) : null}
          {wp3 ? <ManualFiling key={`3${period}${wp3.status}${wp3.updatedAt ?? ""}`} wp={wp3} canPrepare={canUpload} canSign={canFile} /> : null}
          {compare ? <ThreeBCompare key={`cmp${period}${compare.updatedAt ?? ""}`} data={compare} canEdit={canUpload} /> : null}
        </div>
      ) : null}
      <p className="mt-4 text-xs text-muted">{t("returns.filingNote")} {t("filing.locked")}</p>
    </>
  );
}

/** Tax to pay in cash this month: what credit doesn't cover, plus reverse-charge tax. */
function heads2cash(g3: Gstr3b) {
  const keys = ["igst", "cgst", "sgst", "cess"] as const;
  return keys.reduce((sum, k) => sum + Number(g3.setOff.cashPayable[k]) + Number(g3.setOff.reverseChargeCash[k]), 0).toFixed(2);
}
