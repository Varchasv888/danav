import "server-only";
import { serverApi } from "./server-api";

/** Master data the purchase and inventory screens need, fetched on the server. */
export interface ItemOption {
  tileBrand?: string | null; tileFinish?: string | null;
  id: string; name: string; nameHi: string | null; kind: "goods" | "service"; hsn: string | null; gstRate: string; cessRate: string;
  gstSlab?: string | null; slabPieces?: number;
  /** Other codes the item answers to (supplier barcodes, old labels, merged duplicates). */
  aliases?: string[];
  units?: { uomId: string; code: string; factor: string }[];
  purchaseRate: string; saleRate?: string; uom: string; trackBatches: boolean; trackSerials?: boolean; archived: boolean; stockQty: string;
  mrp?: string | null; styleId?: string | null; size?: string | null; color?: string | null; barcode?: string | null; sku?: string | null;
}
export interface SupplierOption { id: string; name: string; nameHi: string | null; gstin: string | null; stateCode: string | null }
export interface WarehouseOption { id: string; name: string; isDefault: boolean; archived: boolean; qualityHold?: boolean }

interface Group { id: string; key: string | null; parentId: string | null }
interface Account { id: string; name: string; nameHi: string | null; groupId: string; gstin: string | null; stateCode: string | null; archived: boolean }

export async function suppliers(): Promise<SupplierOption[]> {
  const [accounts, groups] = await Promise.all([serverApi<Account[]>("/accounts"), serverApi<Group[]>("/accounts/groups")]);
  const creditors = new Set(groups.filter((g) => g.key === "sundry_creditors" || groups.find((p) => p.id === g.parentId)?.key === "sundry_creditors").map((g) => g.id));
  return accounts
    .filter((a) => creditors.has(a.groupId) && !a.archived)
    .map(({ id, name, nameHi, gstin, stateCode }) => ({ id, name, nameHi, gstin, stateCode }));
}

export const items = <T = ItemOption>() => serverApi<T[]>("/items");

export async function inventorySetup() {
  return serverApi<{ uoms: { id: string; code: string; name: string; nameHi: string | null }[]; warehouses: WarehouseOption[]; valuationMethod: string; valuationMethodLocked: boolean }>("/inventory/setup");
}

/** Our state (head office), which decides CGST+SGST vs IGST on purchases. */
export async function homeState() {
  const companies = await serverApi<{ branches: { stateCode: string; isHeadOffice: boolean }[] }[]>("/companies");
  return companies[0]?.branches.find((b) => b.isHeadOffice)?.stateCode ?? companies[0]?.branches[0]?.stateCode ?? "27";
}

export interface CustomerOption { id: string; name: string; nameHi: string | null; gstin: string | null; stateCode: string | null; creditDays: number | null; priceListId?: string | null; agentId?: string | null; salesmanId?: string | null; address?: { line1?: string; line2?: string; city?: string; pincode?: string } | null }

/** Cash and bank ledgers (for paying salaries). */
export async function cashBankAccounts() {
  const [accounts, groups] = await Promise.all([serverApi<Account[]>("/accounts"), serverApi<Group[]>("/accounts/groups")]);
  const keys = ["cash_in_hand", "bank_accounts", "bank_od"];
  const ok = new Set(groups.filter((g) => keys.includes(g.key ?? "") || keys.includes(groups.find((p) => p.id === g.parentId)?.key ?? "")).map((g) => g.id));
  return accounts.filter((a) => ok.has(a.groupId) && !a.archived).map(({ id, name, nameHi }) => ({ id, name, nameHi }));
}

/** Accounts under Sundry Debtors (or a sub-group), for sales documents. */
export async function customers(): Promise<CustomerOption[]> {
  const [accounts, groups] = await Promise.all([serverApi<(Account & { creditDays: number | null; priceListId: string | null; agentId: string | null; salesmanId: string | null; address?: { line1?: string; line2?: string; city?: string; pincode?: string } | null })[]>("/accounts"), serverApi<Group[]>("/accounts/groups")]);
  const debtors = new Set(groups.filter((g) => g.key === "sundry_debtors" || groups.find((p) => p.id === g.parentId)?.key === "sundry_debtors").map((g) => g.id));
  return accounts
    .filter((a) => debtors.has(a.groupId) && !a.archived)
    .map(({ id, name, nameHi, gstin, stateCode, creditDays, priceListId, agentId, salesmanId, address }) => ({ id, name, nameHi, gstin, stateCode, creditDays, priceListId, agentId, salesmanId, address: address ?? null }));
}
