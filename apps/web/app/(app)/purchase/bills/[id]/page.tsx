import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { dec } from "@varchasv/domain";
import { CancelDocument } from "@/components/CancelDocument";
import { DocDetail, type Doc } from "@/components/purchase/DocDetail";
import { loadPurchaseFlow, PurchaseFlowBar } from "@/components/purchase/PurchaseFlowBar";
import { ReturnForm } from "@/components/purchase/ReturnForm";
import { paySupplierHref } from "@/lib/purchase-flow";
import { serverApi, type Me } from "@/lib/server-api";

type Bill = Doc & { supplierInvoiceNo: string; supplierInvoiceDate: string; reverseCharge: boolean; voucherId: string | null };

export default async function BillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations();
  const [bill, me, flow, shortages] = await Promise.all([serverApi<Bill>(`/purchase-bills/${id}`), serverApi<Me>("/auth/me"), loadPurchaseFlow("bill", id), serverApi<{ billLineId: string; itemName: string; itemNameHi: string | null; available: string }[]>(`/purchase-bills/${id}/shortages`)]);
  const returnable = bill.lines.filter((l) => dec(l.qty).gt(l.returnedQty ?? "0"));
  const posted = bill.status === "posted";
  const payHref = flow ? paySupplierHref(flow) : null;
  return (
    <DocDetail doc={bill} kind="bills" back="/purchase/bills" extraColumns={["returnedQty"]} flow={<PurchaseFlowBar flow={flow} kind="bill" docId={bill.id} permissions={me.permissions} />}
      subtitle={`${t("purchase.bills.invoiceNo")} ${bill.supplierInvoiceNo}${bill.reverseCharge ? " · RCM" : ""}`}>
      {posted && payHref && me.permissions.includes("accounts.create") ? (
        <div className="mt-4">
          <Link href={payHref} className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover">{t("purchaseFlow.action.paySupplier")}</Link>
        </div>
      ) : null}
      <p className="mt-3 flex flex-wrap gap-4 text-sm">
        {bill.voucherId ? <Link href={`/accounts/vouchers/${bill.voucherId}`} className="text-primary hover:underline">{t("nav.vouchers")} →</Link> : null}
        {posted ? <Link href={`/inventory/labels?bill=${bill.id}`} className="text-primary hover:underline">{t("labels.forBill")} →</Link> : null}
      </p>
      {posted && returnable.length && me.permissions.includes("purchase.create") ? (
        <ReturnForm billId={bill.id} lines={returnable.map((l) => ({ id: l.id, itemName: l.itemName, itemNameHi: l.itemNameHi, max: dec(l.qty).minus(l.returnedQty ?? "0").toString() }))} />
      ) : null}
      {posted && shortages.length && me.permissions.includes("purchase.create") ? (
        <ReturnForm shortage billId={bill.id} lines={shortages.map((x) => ({ id: x.billLineId, itemName: x.itemName, itemNameHi: x.itemNameHi, max: x.available }))} />
      ) : null}
      {posted && me.permissions.includes("purchase.cancel") ? <CancelDocument path={`/purchase-bills/${bill.id}/cancel`} label={t("common.cancel")} /> : null}
    </DocDetail>
  );
}
