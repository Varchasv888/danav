import { rupees } from "./format";
import { periodRange } from "./report-periods";
import { serverApi } from "./server-api";
import type { BarFilter } from "@/components/reports/ReportBar";
import type { ListColumn, ListFooter, ListRow } from "@/components/reports/ReportList";

/**
 * The list reports that share one page (/reports/list/<key>): for each, the data it reads, its columns, its filters and its footer.
 * A report is added by adding one entry here and one line in the reports menu.
 */
export interface Loaded {
  singleDate?: boolean; asOf?: boolean;
  filters: BarFilter[]; columns: ListColumn[]; rows: ListRow[]; footer: ListFooter[];
  /** Extra text under the table. */
  note?: string;
}
type T = (key: string, values?: Record<string, string | number>) => string;
type Sp = Record<string, string | undefined>;
interface Ctx { t: T; sp: Sp; today: string; from: string; to: string }

import { REPORT_KEYS, type ReportKey } from "./report-keys";
export { REPORT_KEYS };

const m = (v: string) => rupees(v);
const range = (c: Ctx) => `from=${c.from}&to=${c.to}`;
const select = (name: string, label: string, value: string, options: { value: string; label: string }[]): BarFilter => ({ name, label, value, options });

async function categories(c: Ctx, name = "category"): Promise<BarFilter> {
  const list = await serverApi<string[]>("/reports/categories").catch(() => [] as string[]);
  return select(name, c.t("category"), c.sp[name] ?? "", [{ value: "", label: c.t("allCategories") }, ...list.map((x) => ({ value: x, label: x }))]);
}
const cat = (c: Ctx) => (c.sp.category ? `&category=${encodeURIComponent(c.sp.category)}` : "");

const LOADERS: Record<ReportKey, (c: Ctx) => Promise<Loaded>> = {
  async partyStatement(c) {
    const parties = await serverApi<{ rows: { id: string; name: string }[] }>(`/reports/all-parties?asOf=${c.today}`);
    const party = c.sp.party ?? "";
    const filters = [select("party", c.t("party"), party, [{ value: "", label: c.t("choose") }, ...parties.rows.map((p) => ({ value: p.id, label: p.name }))])];
    const cols: ListColumn[] = [
      { key: "date", label: c.t("c.date"), kind: "date" }, { key: "typeLabel", label: c.t("c.txnType"), kind: "tag" }, { key: "number", label: c.t("c.ref"), link: true }, { key: "narration", label: c.t("c.narration") },
      { key: "debit", label: c.t("c.debit"), kind: "money" }, { key: "credit", label: c.t("c.credit"), kind: "money" }, { key: "balance", label: c.t("c.balance"), kind: "money" },
    ];
    if (!party) return { filters, columns: cols, rows: [], footer: [], note: c.t("choosePartyNote") };
    const l = await serverApi<{ opening: string; closing: string; rows: { id: number; date: string; debit: string; credit: string; voucherId: string; number: string; type: string; narration: string | null; counterparts: string | null; balance: string }[] }>(`/reports/ledger/${party}?${range(c)}`);
    const rows: ListRow[] = l.rows.map((r) => ({ id: r.id, date: r.date, typeLabel: r.type.replace(/_/g, " "), number: r.number, narration: r.narration ?? r.counterparts ?? "", debit: r.debit, credit: r.credit, balance: r.balance, href: `/accounts/vouchers/${r.voucherId}` }));
    const dr = l.rows.reduce((s, r) => s + Number(r.debit), 0), cr = l.rows.reduce((s, r) => s + Number(r.credit), 0);
    return { filters, columns: cols, rows, footer: [{ label: c.t("f.opening"), value: m(l.opening) }, { label: c.t("f.debit"), value: m(String(dr)), tone: "in" }, { label: c.t("f.credit"), value: m(String(cr)), tone: "out" }, { label: c.t("f.closing"), value: m(l.closing) }] };
  },
  async allParties(c) {
    const kind = ["customers", "suppliers"].includes(c.sp.kind ?? "") ? c.sp.kind! : "all";
    const d = await serverApi<{ rows: Record<string, string | null>[]; totals: { receivable: string; payable: string } }>(`/reports/all-parties?asOf=${c.to}&kind=${kind}`);
    return {
      asOf: true, filters: [select("kind", c.t("c.type"), kind, [{ value: "all", label: c.t("allParties") }, { value: "customers", label: c.t("customers") }, { value: "suppliers", label: c.t("suppliers") }])],
      columns: [{ key: "name", label: c.t("c.party") }, { key: "email", label: c.t("c.email") }, { key: "phone", label: c.t("c.phone") }, { key: "receivable", label: c.t("c.receivable"), kind: "money" }, { key: "payable", label: c.t("c.payable"), kind: "money" }, { key: "creditLimit", label: c.t("c.creditLimit"), kind: "money" }],
      rows: d.rows, footer: [{ label: c.t("f.receivable"), value: m(d.totals.receivable), tone: "in" }, { label: c.t("f.payable"), value: m(d.totals.payable), tone: "out" }],
    };
  },
  async partyByItem(c) {
    const items = await serverApi<{ id: string; name: string }[]>("/items").catch(() => [] as { id: string; name: string }[]);
    const item = c.sp.itemId ?? "";
    const d = await serverApi<{ rows: Record<string, string>[]; totals: Record<string, string> }>(`/reports/party-by-item?${range(c)}${item ? `&itemId=${item}` : ""}${cat(c)}`);
    return {
      filters: [await categories(c), select("itemId", c.t("item"), item, [{ value: "", label: c.t("allItems") }, ...items.slice(0, 300).map((i) => ({ value: i.id, label: i.name }))])],
      columns: [{ key: "party", label: c.t("c.party") }, { key: "saleQty", label: c.t("c.saleQty"), kind: "number" }, { key: "saleAmount", label: c.t("c.saleAmount"), kind: "money" }, { key: "purchaseQty", label: c.t("c.purchaseQty"), kind: "number" }, { key: "purchaseAmount", label: c.t("c.purchaseAmount"), kind: "money" }],
      rows: d.rows, footer: [{ label: c.t("f.saleAmount"), value: m(d.totals.saleAmount!), tone: "in" }, { label: c.t("f.purchaseAmount"), value: m(d.totals.purchaseAmount!), tone: "out" }],
    };
  },
  async saleByParty(c) { return saleBy(c, "party"); },
  async saleByGroup(c) { return saleBy(c, "group"); },
  async hsnSummary(c) { return hsn(c, "hsn"); },
  async sacSummary(c) { return hsn(c, "sac"); },
  async lowStock(c) {
    const only = c.sp.inStock === "true";
    const d = await serverApi<{ rows: Record<string, string>[]; totals: { items: number } }>(`/reports/low-stock?asOf=${c.to}${cat(c)}&onlyInStock=${only}`);
    return {
      asOf: true, filters: [await categories(c), select("inStock", c.t("show"), only ? "true" : "", [{ value: "", label: c.t("allLow") }, { value: "true", label: c.t("onlyInStock") }])],
      columns: [{ key: "name", label: c.t("c.item") }, { key: "minimum", label: c.t("c.minimum"), kind: "number" }, { key: "stock", label: c.t("c.stock"), kind: "number" }, { key: "value", label: c.t("c.value"), kind: "money" }],
      rows: d.rows, footer: [{ label: c.t("f.items"), value: String(d.totals.items) }],
    };
  },
  async stockDetail(c) {
    const d = await serverApi<{ rows: Record<string, string>[]; totals: Record<string, string> }>(`/reports/stock-detail?${range(c)}${cat(c)}`);
    return {
      filters: [await categories(c)],
      columns: [{ key: "name", label: c.t("c.item") }, { key: "opening", label: c.t("c.opening"), kind: "number" }, { key: "qtyIn", label: c.t("c.qtyIn"), kind: "number" }, { key: "inValue", label: c.t("c.inValue"), kind: "money" }, { key: "qtyOut", label: c.t("c.qtyOut"), kind: "number" }, { key: "closing", label: c.t("c.closing"), kind: "number" }],
      rows: d.rows, footer: [{ label: c.t("f.opening"), value: d.totals.opening! }, { label: c.t("f.qtyIn"), value: d.totals.qtyIn!, tone: "in" }, { label: c.t("f.qtyOut"), value: d.totals.qtyOut!, tone: "out" }, { label: c.t("f.closing"), value: d.totals.closing! }],
    };
  },
  async itemDetail(c) {
    const items = await serverApi<{ id: string; name: string }[]>("/items").catch(() => [] as { id: string; name: string }[]);
    const item = c.sp.itemId ?? "";
    const filters = [select("itemId", c.t("item"), item, [{ value: "", label: c.t("chooseItem") }, ...items.slice(0, 300).map((i) => ({ value: i.id, label: i.name }))])];
    const columns: ListColumn[] = [{ key: "date", label: c.t("c.date"), kind: "date" }, { key: "sale", label: c.t("c.saleQty"), kind: "number" }, { key: "purchase", label: c.t("c.purchaseQty"), kind: "number" }, { key: "adjustment", label: c.t("c.adjustment"), kind: "number" }, { key: "closing", label: c.t("c.closing"), kind: "number" }];
    if (!item) return { filters, columns, rows: [], footer: [], note: c.t("chooseItemNote") };
    const d = await serverApi<{ opening: string; rows: Record<string, string>[] }>(`/reports/item-detail?${range(c)}&itemId=${item}`);
    return { filters, columns, rows: d.rows, footer: [{ label: c.t("f.opening"), value: d.opening }, { label: c.t("f.closing"), value: d.rows.at(-1)?.closing ?? d.opening }] };
  },
  async itemDiscount(c) {
    const d = await serverApi<{ rows: Record<string, string>[]; totals: Record<string, string> }>(`/reports/item-discount?${range(c)}${cat(c)}`);
    return {
      filters: [await categories(c)],
      columns: [{ key: "name", label: c.t("c.item") }, { key: "qty", label: c.t("c.qtySold"), kind: "number" }, { key: "sale", label: c.t("c.saleAmount"), kind: "money" }, { key: "discount", label: c.t("c.discount"), kind: "money" }, { key: "avgPct", label: c.t("c.avgDiscount"), kind: "number" }],
      rows: d.rows, footer: [{ label: c.t("f.saleAmount"), value: m(d.totals.sale!), tone: "in" }, { label: c.t("f.discount"), value: m(d.totals.discount!), tone: "out" }],
    };
  },
  async expenseCategory(c) { return expense(c, "category"); },
  async expenseItem(c) { return expense(c, "item"); },
  async saleOrderItems(c) {
    const status = ["open", "partial", "closed"].includes(c.sp.status ?? "") ? c.sp.status! : "";
    const d = await serverApi<{ rows: Record<string, string>[]; totals: Record<string, string> }>(`/reports/sale-order-items?${range(c)}${status ? `&status=${status}` : ""}`);
    return {
      filters: [select("status", c.t("c.status"), status, [{ value: "", label: c.t("allStatus") }, { value: "open", label: c.t("s.open") }, { value: "partial", label: c.t("s.partial") }, { value: "closed", label: c.t("s.closed") }])],
      columns: [{ key: "name", label: c.t("c.item") }, { key: "qty", label: c.t("c.quantity"), kind: "number" }, { key: "amount", label: c.t("c.amount"), kind: "money" }],
      rows: d.rows, footer: [{ label: c.t("f.quantity"), value: d.totals.qty! }, { label: c.t("f.amount"), value: m(d.totals.amount!) }],
    };
  },
  async loanStatement(c) {
    const d = await serverApi<{ rows: Record<string, string>[]; totals: Record<string, string> }>(`/reports/loan-statement?${range(c)}`);
    return {
      filters: [], columns: [{ key: "name", label: c.t("c.account") }, { key: "group", label: c.t("c.type"), kind: "tag" }, { key: "opening", label: c.t("c.opening"), kind: "money" }, { key: "drawn", label: c.t("c.drawn"), kind: "money" }, { key: "repaid", label: c.t("c.repaid"), kind: "money" }, { key: "balance", label: c.t("c.balanceDue"), kind: "money" }],
      rows: d.rows, footer: [{ label: c.t("f.opening"), value: m(d.totals.opening!) }, { label: c.t("f.drawn"), value: m(d.totals.drawn!), tone: "in" }, { label: c.t("f.repaid"), value: m(d.totals.repaid!), tone: "out" }, { label: c.t("f.balanceDue"), value: m(d.totals.balance!) }],
    };
  },
  async abcClass(c) {
    const d = await serverApi<{ rows: Record<string, string | number>[]; totals: { a: number; b: number; c: number; value: string } }>(`/reports/abc?asOf=${c.to}`);
    return {
      asOf: true, filters: [],
      columns: [{ key: "name", label: c.t("c.item") }, { key: "class", label: c.t("c.class"), kind: "tag" }, { key: "value", label: c.t("c.yearSales"), kind: "money" }, { key: "sharePct", label: c.t("c.share"), kind: "number" }, { key: "cumulativePct", label: c.t("c.cumulative"), kind: "number" }, { key: "countEveryDays", label: c.t("c.countEvery"), kind: "number" }],
      rows: d.rows, footer: [{ label: c.t("f.classA"), value: String(d.totals.a) }, { label: c.t("f.classB"), value: String(d.totals.b) }, { label: c.t("f.classC"), value: String(d.totals.c) }, { label: c.t("f.yearSales"), value: m(d.totals.value) }],
      note: c.t("abcNote"),
    };
  },
  async likelyDue(c) {
    const d = await serverApi<{ rows: Record<string, string | number>[]; totals: { customers: number } }>(`/reports/likely-due?asOf=${c.to}`);
    return {
      asOf: true, filters: [],
      columns: [{ key: "party", label: c.t("c.party") }, { key: "invoices", label: c.t("c.invoices"), kind: "number" }, { key: "usualGapDays", label: c.t("c.usualGap"), kind: "number" }, { key: "lastOrder", label: c.t("c.lastOrder"), kind: "date" }, { key: "daysSince", label: c.t("c.daysSince"), kind: "number" }, { key: "daysPast", label: c.t("c.daysPast"), kind: "number" }, { key: "averageOrder", label: c.t("c.averageOrder"), kind: "money" }],
      rows: d.rows, footer: [{ label: c.t("f.customers"), value: String(d.totals.customers) }],
      note: c.t("likelyDueNote"),
    };
  },
  async saleByCategory(c) {
    const d = await serverApi<{ rows: Record<string, string>[]; totals: Record<string, string> }>(`/reports/sale-by-category?${range(c)}`);
    return {
      filters: [], columns: [{ key: "category", label: c.t("c.itemCategory") }, { key: "saleQty", label: c.t("c.saleQty"), kind: "number" }, { key: "saleAmount", label: c.t("c.saleAmount"), kind: "money" }, { key: "purchaseQty", label: c.t("c.purchaseQty"), kind: "number" }, { key: "purchaseAmount", label: c.t("c.purchaseAmount"), kind: "money" }],
      rows: d.rows, footer: [{ label: c.t("f.saleAmount"), value: m(d.totals.saleAmount!), tone: "in" }, { label: c.t("f.purchaseAmount"), value: m(d.totals.purchaseAmount!), tone: "out" }],
    };
  },
  async stockByCategory(c) {
    const d = await serverApi<{ rows: Record<string, string>[]; totals: Record<string, string> }>(`/reports/stock-by-category?asOf=${c.to}`);
    return {
      asOf: true, filters: [], columns: [{ key: "category", label: c.t("c.itemCategory") }, { key: "qty", label: c.t("c.stockQty"), kind: "number" }, { key: "value", label: c.t("c.value"), kind: "money" }],
      rows: d.rows, footer: [{ label: c.t("f.stockQty"), value: d.totals.qty! }, { label: c.t("f.stockValue"), value: m(d.totals.value!) }],
    };
  },
  async discountReport(c) {
    const d = await serverApi<{ rows: Record<string, string>[]; totals: Record<string, string> }>(`/reports/discount-report?${range(c)}`);
    return {
      filters: [], columns: [{ key: "party", label: c.t("c.party") }, { key: "sale", label: c.t("c.saleDiscount"), kind: "money" }, { key: "purchase", label: c.t("c.purchaseDiscount"), kind: "money" }],
      rows: d.rows, footer: [{ label: c.t("f.saleDiscount"), value: m(d.totals.sale!), tone: "in" }, { label: c.t("f.purchaseDiscount"), value: m(d.totals.purchase!), tone: "out" }],
    };
  },
  async bankStatement(c) {
    const banks = await serverApi<{ id: string; name: string }[]>("/banking/accounts").catch(() => [] as { id: string; name: string }[]);
    const bank = c.sp.account ?? banks[0]?.id ?? "";
    const filters = [select("account", c.t("c.bank"), bank, banks.map((b) => ({ value: b.id, label: b.name })))];
    const columns: ListColumn[] = [{ key: "date", label: c.t("c.date"), kind: "date" }, { key: "description", label: c.t("c.description") }, { key: "reference", label: c.t("c.ref") }, { key: "withdrawal", label: c.t("c.withdrawal"), kind: "money" }, { key: "deposit", label: c.t("c.deposit"), kind: "money" }, { key: "balance", label: c.t("c.balance"), kind: "money" }, { key: "status", label: c.t("c.status"), kind: "tag" }];
    if (!bank) return { filters, columns, rows: [], footer: [], note: c.t("noBank") };
    const d = await serverApi<{ rows: Record<string, string | null>[]; totals: { withdrawal: string; deposit: string; balance: string | null } }>(`/reports/bank-statement?${range(c)}&accountId=${bank}`);
    return { filters, columns, rows: d.rows, footer: [{ label: c.t("f.withdrawal"), value: m(d.totals.withdrawal), tone: "out" }, { label: c.t("f.deposit"), value: m(d.totals.deposit), tone: "in" }, ...(d.totals.balance ? [{ label: c.t("f.balance"), value: m(d.totals.balance) }] : [])] };
  },
};

async function saleBy(c: Ctx, by: "party" | "group"): Promise<Loaded> {
  const d = await serverApi<{ rows: Record<string, string>[]; totals: Record<string, string> }>(`/reports/sale-by-party?${range(c)}&by=${by}`);
  return {
    filters: [], columns: [{ key: "name", label: c.t(by === "party" ? "c.party" : "c.group") }, { key: "sale", label: c.t("c.saleAmount"), kind: "money" }, { key: "purchase", label: c.t("c.purchaseAmount"), kind: "money" }],
    rows: d.rows, footer: [{ label: c.t("f.saleAmount"), value: m(d.totals.sale!), tone: "in" }, { label: c.t("f.purchaseAmount"), value: m(d.totals.purchase!), tone: "out" }],
  };
}
async function hsn(c: Ctx, kind: "hsn" | "sac"): Promise<Loaded> {
  const d = await serverApi<{ rows: Record<string, string>[]; totals: { total: string; items: number } }>(`/reports/hsn-summary?${range(c)}&kind=${kind}`);
  return {
    filters: [], columns: [{ key: "code", label: kind === "hsn" ? "HSN" : "SAC" }, { key: "total", label: c.t("c.totalValue"), kind: "money" }, { key: "taxable", label: c.t("c.taxableValue"), kind: "money" }, { key: "igst", label: "IGST", kind: "money" }, { key: "cgst", label: "CGST", kind: "money" }, { key: "sgst", label: "SGST", kind: "money" }, { key: "cess", label: c.t("c.cess"), kind: "money" }],
    rows: d.rows, footer: [{ label: c.t("f.totalValue"), value: m(d.totals.total), tone: "in" }, { label: c.t("f.items"), value: String(d.totals.items) }],
  };
}
async function expense(c: Ctx, by: "category" | "item"): Promise<Loaded> {
  const d = await serverApi<{ rows: Record<string, string>[]; totals: { amount: string } }>(`/reports/expense-report?${range(c)}&by=${by}`);
  return {
    filters: [], columns: [{ key: "name", label: c.t(by === "category" ? "c.expenseCategory" : "c.expenseItem") }, ...(by === "item" ? [{ key: "kind", label: c.t("c.categoryType"), kind: "tag" } as ListColumn] : []), { key: "amount", label: c.t("c.amount"), kind: "money" }],
    rows: d.rows, footer: [{ label: c.t("f.expense"), value: m(d.totals.amount), tone: "out" }],
  };
}

/** Everything one list report needs to draw itself, or null for an unknown key. */
export async function loadReport(key: string, sp: Sp, t: T, today: string): Promise<(Loaded & { from: string; to: string }) | null> {
  const loader = (LOADERS as Record<string, (c: Ctx) => Promise<Loaded>>)[key];
  if (!loader) return null;
  const month = periodRange("thisMonth", today)!;
  // Reports as of one day take that day for both ends; the rest default to this month.
  const asOfDay = key === "allParties" || key === "lowStock" || key === "abcClass" || key === "likelyDue" || key === "stockByCategory";
  const from = asOfDay ? (sp.from ?? today) : (sp.from ?? month.from), to = asOfDay ? (sp.from ?? today) : (sp.to ?? month.to);
  const loaded = await loader({ t, sp, today, from, to });
  return { ...loaded, from, to };
}
