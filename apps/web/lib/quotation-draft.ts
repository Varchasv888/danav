import type { SalesDraftLine } from "@/components/sales/SalesForm";
import { serverApi } from "./server-api";

interface Quotation {
  id: string; customerId: string; placeOfSupply: string; supplyKind: string; lut: boolean;
  lines: { itemId: string; qty: string; rate: string; discount: string; gstRate: string }[];
}

const plain = (v: string) => String(Number(v));

/** Starting values for an order or invoice made from a quotation: same customer, prices and place of supply. */
export async function quotationDraft(quotationId: string) {
  const q = await serverApi<Quotation>(`/quotations/${quotationId}`);
  const lines: SalesDraftLine[] = q.lines.map((l) => ({
    itemId: l.itemId, qty: plain(l.qty), rate: plain(l.rate), gstRate: plain(l.gstRate), ...(Number(l.discount) ? { discount: plain(l.discount) } : {}),
  }));
  return {
    customerId: q.customerId, quotationId: q.id, lines,
    supply: q.supplyKind === "export" ? { export: true, lut: q.lut } : { placeOfSupply: q.placeOfSupply, sez: q.supplyKind === "sez", lut: q.lut },
  };
}
