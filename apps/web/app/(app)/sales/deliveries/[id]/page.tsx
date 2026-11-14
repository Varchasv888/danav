import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CancelDocument } from "@/components/CancelDocument";
import { DocDetail, type Doc } from "@/components/purchase/DocDetail";
import { PackingListPanel, type PackingListData } from "@/components/sales/PackingListPanel";
import { DeliveryProofPanel, type Proof } from "@/components/sales/DeliveryProofPanel";
import { ReturnGoods } from "@/components/sales/ReturnGoods";
import { loadFlow, SalesFlowBar } from "@/components/sales/SalesFlowBar";
import { serverApi, type Me } from "@/lib/server-api";

type Challan = Doc & { reason: string; transporter: string | null; vehicleNo: string | null; invoiceBy?: string; returns: { id: string; date: string; lines: { lineId: string; qty: string }[] }[] };

export default async function DeliveryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations();
  const [doc, me, flow] = await Promise.all([serverApi<Challan>(`/delivery-notes/${id}`), serverApi<Me>("/auth/me"), loadFlow("challan", id)]);
  const proof = doc.status === "cancelled" ? null : (await serverApi<{ proof: Proof | null }>(`/delivery-notes/${id}/proof`).catch(() => ({ proof: null }))).proof;
  const packing = doc.status === "cancelled" ? null : await serverApi<PackingListData>(`/delivery-notes/${id}/packing-list`).catch(() => null);
  const open = (l: Challan["lines"][number]) => Number(l.qty) - Number(l.invoicedQty ?? 0) - Number(l.returnedQty ?? 0);
  const outstanding = doc.status === "posted" && doc.lines.some((l) => open(l) > 0);
  const untouched = doc.lines.every((l) => Number(l.invoicedQty) === 0 && Number(l.returnedQty ?? 0) === 0);
  const fmt = (iso: string) => new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" }).format(new Date(`${iso}T00:00:00+05:30`));
  const subtitle = [
    t(`sales.deliveries.reasons.${doc.reason}`), doc.vehicleNo, doc.transporter,
    doc.invoiceBy && outstanding ? t("sales.deliveries.invoiceBy", { date: fmt(doc.invoiceBy) }) : null,
  ].filter(Boolean).join(" · ");
  const btn = "inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium";
  return (
    <DocDetail doc={doc} title={t("sales.deliveries.title")} back="/sales/deliveries" extraColumns={["invoicedQty", "returnedQty"]} subtitle={subtitle} flow={<SalesFlowBar flow={flow} kind="challan" docId={doc.id} />}>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {outstanding && me.permissions.includes("sales.create") ? (
          <Link href={`/sales/invoices/new?deliveryId=${doc.id}`} className={`${btn} bg-primary text-on-primary hover:bg-primary-hover`}>{t("sales.deliveries.invoice")}</Link>
        ) : null}
        <Link href={`/print/challan/${doc.id}`} target="_blank" className={`${btn} border border-border bg-surface hover:bg-surface-2`}>{t("sales.deliveries.print")}</Link>
      </div>
      {outstanding && me.permissions.includes("sales.create") ? (
        <ReturnGoods noteId={doc.id} date={doc.date} lines={doc.lines.filter((l) => open(l) > 0).map((l) => ({ id: l.id, name: l.itemName, open: String(open(l)) }))} />
      ) : null}
      {doc.returns.length ? (
        <p className="mt-4 text-sm text-muted">{t("sales.deliveries.returnsMade", { count: doc.returns.length, dates: doc.returns.map((r) => fmt(r.date)).join(", ") })}</p>
      ) : null}
      {packing && (packing.boxes.length || packing.availableBoxes.length) ? <PackingListPanel data={packing} canEdit={me.permissions.includes("inventory.edit")} /> : null}
      {doc.status !== "cancelled" ? <DeliveryProofPanel noteId={doc.id} lines={doc.lines.map((l) => ({ id: l.id, itemName: l.itemName, qty: l.qty }))} proof={proof} canEdit={me.permissions.includes("sales.create")} /> : null}
      {doc.status === "posted" && untouched && me.permissions.includes("sales.cancel") ? <CancelDocument path={`/delivery-notes/${doc.id}/cancel`} label={t("common.cancel")} /> : null}
    </DocDetail>
  );
}
