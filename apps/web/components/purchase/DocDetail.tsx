import Link from "next/link";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { amountInWords, dec, wordsLang } from "@varchasv/domain";
import { StatusBadge } from "../StatusBadge";
import { Card, PageHeader } from "../ui";
import { localName, rupees } from "@/lib/format";

export interface DocLine {
  id: string; itemId: string; orderLineId?: string | null; itemName: string; itemNameHi: string | null; hsn: string | null; qty: string; rate: string; discount?: string; gstRate?: string;
  taxable?: string; total?: string; receivedQty?: string; billedQty?: string; returnedQty?: string; deliveredQty?: string; invoicedQty?: string; batchNo?: string | null;
  kind?: string;
}
export interface Doc {
  id: string; number: string; date: string; status: string; supplierName?: string; customerName?: string; supplierGstin: string | null; narration?: string | null;
  taxable?: string; cgst?: string; sgst?: string; utgst?: string; igst?: string; cess?: string; roundOff?: string; total?: string;
  lines: DocLine[];
}

const n = (v?: string) => (v === undefined ? "" : Number(v).toLocaleString("en-IN", { maximumFractionDigits: 3 }));

/** Read-only view of a purchase document: header, lines, tax totals. `extra` columns show fulfilment. */
export async function DocDetail({ doc, kind, back, extraColumns = [], subtitle, title, children, flow }: {
  doc: Doc; kind?: "orders" | "receipts" | "bills" | "returns"; back: string;
  extraColumns?: ("receivedQty" | "billedQty" | "returnedQty" | "deliveredQty" | "invoicedQty")[]; subtitle?: string | undefined;
  /** Document type name for the subtitle; defaults to the purchase document name. */
  title?: string; children?: React.ReactNode;
  /** Shown between the heading and the document, e.g. the sales trail. */
  flow?: React.ReactNode;
}) {
  const t = await getTranslations();
  const locale = await getLocale();
  const format = await getFormatter();
  const priced = doc.total !== undefined;
  const hasRate = doc.lines.some((l) => l.rate !== undefined && l.rate !== null);
  const colLabel = {
    receivedQty: t("purchase.orders.received"), billedQty: t("purchase.orders.billed"), returnedQty: t("purchase.bills.returned"),
    deliveredQty: t("sales.orders.delivered"), invoicedQty: t("sales.orders.invoiced"),
  };
  const statusLabel = t.has(`purchase.statuses.${doc.status}`) ? t(`purchase.statuses.${doc.status}`) : t(`sales.statuses.${doc.status}`);

  return (
    <>
      <PageHeader
        title={<span className="font-mono">{doc.number}</span>}
        subtitle={[title ?? (kind ? t(`purchase.${kind}.title`) : ""), doc.supplierName ?? doc.customerName, doc.supplierGstin, format.dateTime(new Date(`${doc.date}T00:00:00`), { dateStyle: "long" }), subtitle].filter(Boolean).join(" · ")}
        actions={<Link href={back} className="text-sm text-primary hover:underline">← {t("common.back")}</Link>}
      />
      {flow}
      <Card>
        <div className="mb-4"><StatusBadge status={doc.status} label={statusLabel} /></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="text-left text-muted">
              <tr className="border-b border-border">
                <th className="py-2 pr-4 font-medium">{t("purchase.item")}</th>
                <th className="py-2 pr-4 text-right font-medium">{t("purchase.qty")}</th>
                {extraColumns.map((c) => <th key={c} className="py-2 pr-4 text-right font-medium">{colLabel[c]}</th>)}
                {hasRate ? <th className="py-2 pr-4 text-right font-medium">{t("purchase.rate")}</th> : null}
                {priced ? <th className="py-2 pr-4 text-right font-medium">{t("purchase.gst")}</th> : null}
                {priced ? <th className="py-2 text-right font-medium">{t("purchase.taxable")}</th> : null}
              </tr>
            </thead>
            <tbody>
              {doc.lines.map((l) => (
                <tr key={l.id} className="border-b border-border">
                  <td className="py-2.5 pr-4">
                    {localName({ name: l.itemName, nameHi: l.itemNameHi }, locale)}
                    {l.hsn ? <span className="ml-2 font-mono text-xs text-muted">{l.hsn}</span> : null}
                    {l.batchNo ? <span className="ml-2 font-mono text-xs text-muted">#{l.batchNo}</span> : null}
                  </td>
                  <td className="num py-2.5 pr-4 text-right">{n(l.qty)}</td>
                  {extraColumns.map((c) => <td key={c} className="num py-2.5 pr-4 text-right">{n(l[c])}</td>)}
                  {hasRate ? <td className="num py-2.5 pr-4 text-right">{rupees(l.rate)}</td> : null}
                  {priced ? <td className="num py-2.5 pr-4 text-right">{Number(l.gstRate)}%</td> : null}
                  {priced ? <td className="num py-2.5 text-right">{rupees(l.taxable ?? "0")}</td> : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {priced ? (
          <dl className="mt-4 ml-auto grid max-w-sm grid-cols-[1fr_auto] gap-x-6 gap-y-1 text-sm">
            <dt className="text-muted">{t("purchase.taxable")}</dt><dd className="num text-right">{rupees(doc.taxable!)}</dd>
            {(["cgst", "sgst", "utgst", "igst", "cess"] as const).filter((k) => doc[k] && !dec(doc[k]!).isZero()).map((k) => (
              <div key={k} className="contents"><dt className="text-muted">{t(`calc.${k}`)}</dt><dd className="num text-right">{rupees(doc[k]!)}</dd></div>
            ))}
            {doc.roundOff && !dec(doc.roundOff).isZero() ? <><dt className="text-muted">{t("calc.roundOff")}</dt><dd className="num text-right">{rupees(doc.roundOff)}</dd></> : null}
            <dt className="border-t border-border pt-2 font-semibold">{t("purchase.total")}</dt><dd className="num border-t border-border pt-2 text-right font-semibold">{rupees(doc.total!)}</dd>
            <dd className="col-span-2 text-xs text-muted">{amountInWords(doc.total!, wordsLang(locale))}</dd>
          </dl>
        ) : null}
        {doc.narration ? <p className="mt-4 text-sm"><span className="text-muted">{t("common.narration")}:</span> {doc.narration}</p> : null}
      </Card>
      {children}
    </>
  );
}
