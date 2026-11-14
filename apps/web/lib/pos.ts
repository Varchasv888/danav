import "server-only";
import type { Terminal } from "@/components/pos/Billing";
import type { PosItem, PosSettings } from "@/components/pos/Checkout";
import type { Scheme } from "@varchasv/domain";
import { customers } from "./masters";
import { serverApi } from "./server-api";

/** What the billing and table screens need: counters, sellable items, POS settings (with the store schemes) and customers for on-account sales. */
export async function posData() {
  const [terminals, items, settings, schemes, custs] = await Promise.all([
    serverApi<Terminal[]>("/pos/terminals"), serverApi<PosItem[]>("/items"), serverApi<PosSettings>("/pos/settings"), serverApi<Scheme[]>("/pos/schemes"), customers(),
  ]);
  return { terminals, items: items.filter((i) => !i.archived), settings: { ...settings, schemes }, customers: custs.map(({ id, name, nameHi }) => ({ id, name, nameHi })) };
}
