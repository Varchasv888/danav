import { getTranslations } from "next-intl/server";
import { dec } from "@varchasv/domain";
import type { Doc } from "@/components/purchase/DocDetail";
import { SalesForm, type SalesDraftLine } from "@/components/sales/SalesForm";
import { FitScreen, PageHeader } from "@/components/ui";
import { customers, homeState, inventorySetup, items } from "@/lib/masters";
import { quotationDraft } from "@/lib/quotation-draft";
import { serverApi } from "@/lib/server-api";

export async function generateMetadata() {
  return { title: (await getTranslations("sales.invoices"))("new") };
}

type Linked = Doc & { customerId: string; orderId?: string | null; agentId?: string | null; agentPct?: string | null; salesmanId?: string | null; lines: (Doc["lines"][number] & { orderLineId?: string | null; kind?: string })[] };

/** An order line's discount covers its whole quantity; invoicing part of it takes the same share. */
function proRata(discount: string | undefined, qty: string, orderedQty: string) {
  if (!discount || dec(discount).isZero()) return undefined;
  return dec(discount).times(qty).div(orderedQty).toDecimalPlaces(2).toString();
}

export default async function NewInvoicePage({ searchParams }: { searchParams: Promise<{ orderId?: string; deliveryId?: string; quotationId?: string; n?: string }> }) {
  const { orderId, deliveryId, quotationId, n } = await searchParams;
  const t = await getTranslations("sales.invoices");
  const [c, i, setup, home] = await Promise.all([customers(), items(), inventorySetup(), homeState()]);

  let initial: { customerId: string; orderId?: string; agentId?: string | null; agentPct?: string | null; salesmanId?: string | null; lines: SalesDraftLine[] } | Awaited<ReturnType<typeof quotationDraft>> | undefined;
  if (quotationId) {
    initial = await quotationDraft(quotationId);
  } else if (deliveryId) {
    // Invoice what went out on the challan and isn't invoiced yet, at the order's price when there was one.
    const note = await serverApi<Linked>(`/delivery-notes/${deliveryId}`);
    const order = note.orderId ? await serverApi<Linked>(`/sales-orders/${note.orderId}`) : null;
    initial = {
      customerId: note.customerId, ...(note.orderId && order ? { orderId: note.orderId, agentId: order.agentId, agentPct: order.agentPct, salesmanId: order.salesmanId } : {}),
      lines: note.lines.filter((l) => dec(l.qty).minus(l.returnedQty ?? "0").gt(l.invoicedQty ?? "0")).map((l) => {
        const ol = order?.lines.find((o) => o.id === l.orderLineId);
        const qty = dec(l.qty).minus(l.invoicedQty ?? "0").minus(l.returnedQty ?? "0").toString();
        const it = i.find((x) => x.id === l.itemId) as ({ saleRate?: string }) | undefined;
        const discount = ol ? proRata(ol.discount, qty, ol.qty) : undefined;
        return {
          itemId: l.itemId, qty, deliveryLineId: l.id, locked: true,
          rate: ol ? String(Number(ol.rate)) : l.rate ? String(Number(l.rate)) : String(Number(it?.saleRate ?? "0")),
          ...(discount ? { discount } : {}), ...(ol?.gstRate ? { gstRate: String(Number(ol.gstRate)) } : {}),
        };
      }),
    };
  } else if (orderId) {
    // Invoice straight from the order (no challan): goods go out with the invoice.
    const order = await serverApi<Linked>(`/sales-orders/${orderId}`);
    initial = {
      customerId: order.customerId, orderId, agentId: order.agentId, agentPct: order.agentPct, salesmanId: order.salesmanId,
      lines: order.lines.filter((l) => dec(l.qty).gt(l.invoicedQty ?? "0") && dec(l.deliveredQty ?? "0").lte(l.invoicedQty ?? "0")).map((l) => {
        const qty = dec(l.qty).minus(l.invoicedQty ?? "0").toString();
        const discount = proRata(l.discount, qty, l.qty);
        return { itemId: l.itemId, qty, orderLineId: l.id, locked: true, rate: String(Number(l.rate)), gstRate: String(Number(l.gstRate)), ...(discount ? { discount } : {}) };
      }),
    };
  }
  return (
    <FitScreen>
      <PageHeader title={t("new")} />
      <SalesForm key={n ?? "new"} mode="invoice" customers={c} items={i} warehouses={setup.warehouses.filter((w) => !w.archived)} homeState={home} {...(initial ? { initial } : {})} />
    </FitScreen>
  );
}
