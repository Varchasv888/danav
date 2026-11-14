import { and, eq } from "drizzle-orm";
import { XMLParser } from "fast-xml-parser";
import { tables, type Tx } from "@varchasv/db";
import { GST_RATES, UQC, checkHsn, dec, isValidStateCode, money, validateGstin } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest } from "../lib/errors.js";
import { ensureChart, resolveCompany } from "./accounting.js";
import { ensureInventory, postStockJournal } from "./inventory.js";

/**
 * Bulk import for switching over: parties and items from a spreadsheet (CSV rows), or ledger and
 * stock-item masters from a Tally XML export. Every import can run as a dry run first; each row is
 * checked on its own and reported, and nothing is written unless the dry run is turned off.
 */
interface Actor { tenantId: string; userId: string; ip?: string | undefined }
export type RowResult = { row: number; name: string; status: "create" | "update" | "exists" | "error"; error?: string };

export interface PartyRow {
  name: string; type: "customer" | "supplier"; gstin?: string | undefined; stateCode?: string | undefined; phone?: string | undefined; email?: string | undefined;
  openingBalance?: string | undefined; creditDays?: string | undefined; address?: string | undefined; city?: string | undefined; pincode?: string | undefined;
}
export interface ItemRow {
  name: string; hsn?: string | undefined; gstRate?: string | undefined; unit?: string | undefined; kind?: "goods" | "service" | undefined;
  purchaseRate?: string | undefined; saleRate?: string | undefined; openingQty?: string | undefined; openingRate?: string | undefined;
}

const cleanNum = (v: string | undefined) => (v === undefined || v.trim() === "" ? undefined : v.replace(/[₹,\s]/g, ""));

export async function importParties(tx: Tx, actor: Actor, rows: PartyRow[], dryRun: boolean, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  await ensureChart(tx, actor.tenantId, company.id);
  const groups = await tx.select().from(tables.accountGroups).where(eq(tables.accountGroups.companyId, company.id));
  const groupId = (key: string) => groups.find((g) => g.key === key)!.id;
  const existing = new Set((await tx.select({ name: tables.accounts.name }).from(tables.accounts).where(eq(tables.accounts.companyId, company.id))).map((a) => a.name.toLowerCase()));
  const results: RowResult[] = [];
  const seen = new Set<string>();
  for (const [i, r] of rows.entries()) {
    const name = (r.name ?? "").trim();
    const res = (status: RowResult["status"], error?: string) => results.push({ row: i + 1, name, status, ...(error ? { error } : {}) });
    if (!name) { res("error", "name_required"); continue; }
    if (existing.has(name.toLowerCase()) || seen.has(name.toLowerCase())) { res("exists"); continue; }
    let gstin: string | null = null;
    let stateCode = r.stateCode?.trim() || null;
    if (r.gstin?.trim()) {
      const g = validateGstin(r.gstin);
      if (!g.valid) { res("error", `gstin_${g.error}`); continue; }
      gstin = g.gstin;
      stateCode = g.stateCode;
    }
    if (stateCode && !isValidStateCode(stateCode)) { res("error", "invalid_state"); continue; }
    const opening = cleanNum(r.openingBalance);
    if (opening !== undefined && !/^-?\d+(\.\d{1,2})?$/.test(opening)) { res("error", "invalid_amount"); continue; }
    if (r.pincode && !/^[1-9]\d{5}$/.test(r.pincode.trim())) { res("error", "invalid_pincode"); continue; }
    seen.add(name.toLowerCase());
    res("create");
    if (dryRun) continue;
    // Customers are owed to us (debit); suppliers we owe (credit): the sheet gives the amount, we sign it.
    const signed = opening ? money(dec(opening).abs().times(r.type === "customer" ? 1 : -1)) : "0";
    await tx.insert(tables.accounts).values({
      tenantId: actor.tenantId, companyId: company.id, groupId: groupId(r.type === "customer" ? "sundry_debtors" : "sundry_creditors"),
      name, gstin, stateCode, pan: gstin ? gstin.slice(2, 12) : null, phone: r.phone?.trim() || null, email: r.email?.trim() || null, openingBalance: signed,
      creditDays: r.creditDays ? Number(r.creditDays) : null,
      address: r.address || r.city || r.pincode ? { line1: r.address?.trim(), city: r.city?.trim(), pincode: r.pincode?.trim() } : null,
    });
  }
  if (!dryRun) await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "import", after: { kind: "parties", created: results.filter((r) => r.status === "create").length }, ip: actor.ip });
  return { dryRun, results };
}

export async function importItems(tx: Tx, actor: Actor, rows: ItemRow[], dryRun: boolean, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  await ensureInventory(tx, actor.tenantId, company.id);
  const uoms = await tx.select().from(tables.uoms).where(eq(tables.uoms.companyId, company.id));
  const [wh] = await tx.select().from(tables.warehouses).where(and(eq(tables.warehouses.companyId, company.id), eq(tables.warehouses.isDefault, true)));
  const existing = new Set((await tx.select({ name: tables.items.name }).from(tables.items).where(eq(tables.items.companyId, company.id))).map((a) => a.name.toLowerCase()));
  const results: RowResult[] = [];
  const opening: { itemId: string; qty: string; rate: string }[] = [];
  const seen = new Set<string>();
  // Common spellings people use in spreadsheets and Tally, mapped to GST unit codes.
  const unitAlias: Record<string, string> = { nos: "NOS", no: "NOS", pcs: "PCS", pc: "PCS", kg: "KGS", kgs: "KGS", gm: "GMS", gms: "GMS", ltr: "LTR", l: "LTR", ml: "MLT", mtr: "MTR", m: "MTR", box: "BOX", pkt: "PAC", pack: "PAC", doz: "DOZ", bag: "BAG", btl: "BTL", set: "SET" };
  for (const [i, r] of rows.entries()) {
    const name = (r.name ?? "").trim();
    const res = (status: RowResult["status"], error?: string) => results.push({ row: i + 1, name, status, ...(error ? { error } : {}) });
    if (!name) { res("error", "name_required"); continue; }
    if (existing.has(name.toLowerCase()) || seen.has(name.toLowerCase())) { res("exists"); continue; }
    const kind = r.kind === "service" ? "service" : "goods";
    const hsn = r.hsn?.trim() || null;
    if (hsn && checkHsn(hsn, kind)) { res("error", kind === "service" ? "invalid_sac" : "invalid_hsn"); continue; }
    const rate = cleanNum(r.gstRate)?.replace("%", "") ?? "18";
    if (!(GST_RATES as readonly string[]).includes(String(Number(rate)))) { res("error", "invalid_gst_rate"); continue; }
    const unitKey = (r.unit ?? "").trim().toLowerCase();
    const code = unitAlias[unitKey] ?? (UQC.some((u) => u.code === unitKey.toUpperCase()) ? unitKey.toUpperCase() : kind === "service" ? "OTH" : unitKey ? null : "NOS");
    const uom = uoms.find((u) => u.code === code);
    if (!uom) { res("error", "unknown_unit"); continue; }
    const oq = cleanNum(r.openingQty);
    const orate = cleanNum(r.openingRate);
    if (oq && (!/^\d+(\.\d{1,4})?$/.test(oq) || (orate !== undefined && !/^\d+(\.\d{1,4})?$/.test(orate)))) { res("error", "invalid_opening"); continue; }
    seen.add(name.toLowerCase());
    res("create");
    if (dryRun) continue;
    const [it] = await tx.insert(tables.items).values({
      tenantId: actor.tenantId, companyId: company.id, name, kind, hsn, gstRate: String(Number(rate)), uomId: uom.id,
      purchaseRate: cleanNum(r.purchaseRate) ?? "0", saleRate: cleanNum(r.saleRate) ?? "0",
    }).returning({ id: tables.items.id });
    if (oq && dec(oq).gt(0) && kind === "goods") opening.push({ itemId: it!.id, qty: oq, rate: orate ?? cleanNum(r.purchaseRate) ?? "0" });
  }
  if (!dryRun && opening.length) {
    await postStockJournal(tx, actor, { companyId: company.id, kind: "opening", narration: "Imported opening stock", lines: opening.map((o) => ({ itemId: o.itemId, warehouseId: wh!.id, qty: o.qty, rate: o.rate })) });
  }
  if (!dryRun) await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "import", after: { kind: "items", created: results.filter((r) => r.status === "create").length }, ip: actor.ip });
  return { dryRun, results };
}

// ---- Tally ---------------------------------------------------------------------------------------

/** Tally's built-in group names → our group keys (ours were named to match). */
const TALLY_GROUPS: Record<string, string> = {
  "capital account": "capital", "reserves & surplus": "reserves", "loans (liability)": "loans_liability", "secured loans": "secured_loans",
  "unsecured loans": "unsecured_loans", "bank od a/c": "bank_od", "bank occ a/c": "bank_od", "current liabilities": "current_liabilities",
  "duties & taxes": "duties_taxes", "sundry creditors": "sundry_creditors", "provisions": "provisions", "suspense a/c": "suspense",
  "fixed assets": "fixed_assets", "investments": "investments", "current assets": "current_assets", "bank accounts": "bank_accounts",
  "cash-in-hand": "cash_in_hand", "sundry debtors": "sundry_debtors", "stock-in-hand": "stock_in_hand", "loans & advances (asset)": "loans_advances_asset",
  "deposits (asset)": "deposits_asset", "sales accounts": "sales_accounts", "direct incomes": "direct_income", "indirect incomes": "indirect_income",
  "purchase accounts": "purchase_accounts", "direct expenses": "direct_expenses", "indirect expenses": "indirect_expenses",
  "misc. expenses (asset)": "current_assets", "branch / divisions": "current_liabilities",
};

const text = (v: unknown): string => (v === undefined || v === null ? "" : typeof v === "object" ? String((v as { "#text"?: unknown })["#text"] ?? "") : String(v)).trim();
const asList = <T>(v: T | T[] | undefined): T[] => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

/** Reads LEDGER and STOCKITEM masters from a Tally XML export (Display → List of Accounts → Export). */
export function parseTallyXml(xml: string) {
  const doc = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@", parseTagValue: false, isArray: (name) => ["TALLYMESSAGE", "LEDGER", "STOCKITEM", "GSTDETAILS.LIST", "STATEWISEDETAILS.LIST", "RATEDETAILS.LIST", "ADDRESS.LIST", "ADDRESS"].includes(name) }).parse(xml);
  const messages = asList(doc?.ENVELOPE?.BODY?.IMPORTDATA?.REQUESTDATA?.TALLYMESSAGE ?? doc?.ENVELOPE?.BODY?.DATA?.TALLYMESSAGE);
  const ledgers: { name: string; parent: string; opening: string; gstin: string; state: string; address: string; pincode: string }[] = [];
  const stockItems: { name: string; unit: string; hsn: string; gstRate: string; openingQty: string; openingRate: string }[] = [];
  for (const m of messages) {
    for (const l of asList(m.LEDGER)) {
      const addr = asList(l["ADDRESS.LIST"]?.[0]?.ADDRESS ?? l["ADDRESS.LIST"]?.ADDRESS).map(text).filter(Boolean);
      ledgers.push({
        name: text(l["@NAME"]) || text(l.NAME), parent: text(l.PARENT), opening: text(l.OPENINGBALANCE) || "0",
        gstin: text(l.PARTYGSTIN) || text(l.GSTIN), state: text(l.LEDSTATENAME) || text(l.STATENAME), address: addr.join(", "), pincode: text(l.PINCODE),
      });
    }
    for (const s of asList(m.STOCKITEM)) {
      const gst = asList(s["GSTDETAILS.LIST"]).at(-1);
      const rates = asList(asList(gst?.["STATEWISEDETAILS.LIST"])[0]?.["RATEDETAILS.LIST"]);
      const igst = rates.find((r) => text(r.GSTRATEDUTYHEAD).toUpperCase() === "IGST");
      // Tally writes quantities as "10 Nos" and rates as "400.00/Nos".
      const [qty] = text(s.OPENINGBALANCE).split(/\s+/);
      const [rate] = text(s.OPENINGRATE).split("/");
      stockItems.push({
        name: text(s["@NAME"]) || text(s.NAME), unit: text(s.BASEUNITS), hsn: text(gst?.HSNCODE), gstRate: text(igst?.GSTRATE) || "",
        openingQty: (qty ?? "").replace(/,/g, ""), openingRate: (rate ?? "").replace(/,/g, ""),
      });
    }
  }
  return { ledgers: ledgers.filter((l) => l.name), stockItems: stockItems.filter((s) => s.name) };
}

const STATE_BY_NAME = new Map<string, string>();
async function stateCodeByName(name: string) {
  if (!STATE_BY_NAME.size) {
    const { GST_STATES } = await import("@varchasv/domain");
    for (const s of GST_STATES) STATE_BY_NAME.set(s.name.toLowerCase(), s.code);
  }
  return STATE_BY_NAME.get(name.toLowerCase()) ?? null;
}

export async function importTally(tx: Tx, actor: Actor, xml: string, dryRun: boolean, companyId?: string) {
  let parsed;
  try {
    parsed = parseTallyXml(xml);
  } catch {
    throw badRequest("invalid_tally_xml");
  }
  if (!parsed.ledgers.length && !parsed.stockItems.length) throw badRequest("no_tally_masters");
  const company = await resolveCompany(tx, companyId);
  await ensureChart(tx, actor.tenantId, company.id);
  const groups = await tx.select().from(tables.accountGroups).where(eq(tables.accountGroups.companyId, company.id));
  const accounts = await tx.select().from(tables.accounts).where(eq(tables.accounts.companyId, company.id));
  const ledgerResults: RowResult[] = [];
  for (const [i, l] of parsed.ledgers.entries()) {
    const res = (status: RowResult["status"], error?: string) => ledgerResults.push({ row: i + 1, name: l.name, status, ...(error ? { error } : {}) });
    // Tally's own predefined ledgers (Cash, Profit & Loss A/c) already exist here under our names.
    if (l.name.toLowerCase() === "profit & loss a/c") { res("exists"); continue; }
    const existing = accounts.find((a) => a.name.toLowerCase() === l.name.toLowerCase() || (a.key === "cash" && l.name.toLowerCase() === "cash"));
    const key = TALLY_GROUPS[l.parent.toLowerCase()];
    const group = key ? groups.find((g) => g.key === key) : groups.find((g) => g.name.toLowerCase() === l.parent.toLowerCase());
    if (existing) {
      // Opening balances of predefined ledgers (like Cash) are still worth bringing across.
      if (!dryRun && Number(l.opening)) await tx.update(tables.accounts).set({ openingBalance: money(dec(l.opening).neg()) }).where(eq(tables.accounts.id, existing.id));
      res("exists");
      continue;
    }
    if (!group) { res("error", "unknown_group"); continue; }
    let gstin: string | null = null;
    if (l.gstin) {
      const g = validateGstin(l.gstin);
      if (g.valid) gstin = g.gstin;
    }
    res("create");
    if (dryRun) continue;
    // Tally stores debit balances as negative numbers; ours are positive for debit.
    await tx.insert(tables.accounts).values({
      tenantId: actor.tenantId, companyId: company.id, groupId: group.id, name: l.name, openingBalance: money(dec(l.opening || "0").neg()),
      gstin, stateCode: gstin ? gstin.slice(0, 2) : await stateCodeByName(l.state), pan: gstin ? gstin.slice(2, 12) : null,
      address: l.address || l.pincode ? { line1: l.address || undefined, pincode: /^[1-9]\d{5}$/.test(l.pincode) ? l.pincode : undefined } : null,
    });
  }
  const itemImport = await importItems(tx, actor, parsed.stockItems.map((s) => ({
    name: s.name, unit: s.unit, hsn: s.hsn || undefined, gstRate: s.gstRate || undefined, openingQty: s.openingQty || undefined, openingRate: s.openingRate || undefined,
  })), dryRun, company.id);
  return { dryRun, ledgers: ledgerResults, items: itemImport.results };
}

export interface OpeningRow { name: string; debit?: string | undefined; credit?: string | undefined }

/**
 * Opening balances from a sheet of ledger name, debit and credit: each row is matched to an existing ledger by name and sets its opening balance (a debit
 * is positive). A dry run shows every row's result and the control totals, so a sheet that does not balance is seen before anything is written.
 */
export async function importOpeningBalances(tx: Tx, actor: Actor, rows: OpeningRow[], dryRun: boolean, companyId?: string) {
  const company = await resolveCompany(tx, companyId);
  const accounts = await tx.select({ id: tables.accounts.id, name: tables.accounts.name, opening: tables.accounts.openingBalance }).from(tables.accounts).where(eq(tables.accounts.companyId, company.id));
  const byName = new Map(accounts.map((a) => [a.name.toLowerCase(), a]));
  const results: RowResult[] = [];
  const seen = new Set<string>();
  const todo: { id: string; name: string; before: string; value: string }[] = [];
  let debit = dec(0), credit = dec(0);
  for (const [i, r] of rows.entries()) {
    const name = (r.name ?? "").trim();
    const res = (status: RowResult["status"], error?: string) => results.push({ row: i + 1, name, status, ...(error ? { error } : {}) });
    if (!name) { res("error", "name_required"); continue; }
    const acct = byName.get(name.toLowerCase());
    if (!acct) { res("error", "account_not_found"); continue; }
    if (seen.has(name.toLowerCase())) { res("error", "duplicate_row"); continue; }
    const dr = cleanNum(r.debit), cr = cleanNum(r.credit);
    if ((dr && !/^\d+(\.\d{1,2})?$/.test(dr)) || (cr && !/^\d+(\.\d{1,2})?$/.test(cr))) { res("error", "invalid_amount"); continue; }
    if (dr && cr && dec(dr).gt(0) && dec(cr).gt(0)) { res("error", "one_side_only"); continue; }
    if (!dr && !cr) { res("error", "amount_required"); continue; }
    seen.add(name.toLowerCase());
    const value = dec(dr ?? 0).minus(cr ?? 0);
    debit = debit.plus(dr ?? 0); credit = credit.plus(cr ?? 0);
    todo.push({ id: acct.id, name: acct.name, before: acct.opening, value: money(value) });
    res("update");
  }
  const totals = { debit: money(debit), credit: money(credit), difference: money(debit.minus(credit)) };
  if (!dryRun && todo.length && !results.some((r) => r.status === "error")) {
    for (const t of todo) await tx.update(tables.accounts).set({ openingBalance: t.value }).where(eq(tables.accounts.id, t.id));
    await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "update", entity: "import", after: { kind: "opening_balances", ledgers: todo.length, ...totals }, ip: actor.ip });
  } else if (!dryRun && results.some((r) => r.status === "error")) throw badRequest("fix_errors_first");
  return { dryRun, results, totals };
}

