import { ReceiptView, type Receipt } from "@/components/pos/ReceiptView";
import type { Paper } from "@/components/pos/ReceiptPaper";
import { serverApi } from "@/lib/server-api";

const loadPrefs = () => serverApi<Record<string, boolean | string>>("/settings/preferences").catch(() => undefined);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const r = await serverApi<Receipt>(`/pos/bills/${(await params).id}`);
  return { title: { absolute: `Receipt ${r.number}` } };
}

export default async function ReceiptPrint({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ w?: string }> }) {
  const w = (await searchParams).w;
  const prefs = await loadPrefs();
  // The roll chosen in Settings is the starting point; the picker on the receipt can still change it.
  const paper = w === "80" ? "68" : w === "58" || w === "68" || w === "88" || w === "a4" ? w : String(prefs?.["thermal.size"] ?? "68");
  return <ReceiptView paper={paper as Paper} prefs={prefs} direct={`/pos/bills/${(await params).id}/escpos`} r={await serverApi<Receipt>(`/pos/bills/${(await params).id}`)} />;
}
