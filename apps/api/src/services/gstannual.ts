import { sql } from "drizzle-orm";
import type { Tx } from "@varchasv/db";
import { dec, gstr9Tables, money, returnDueDate, type Gstr9Heads, type Gstr9Month, type Table8Basis } from "@varchasv/domain";
import { gstr3b } from "./returns.js";
import { badRequest } from "../lib/errors.js";
import { resolveCompany } from "./accounting.js";

const fyRange = (fyStart: number) => ({ from: `${fyStart}-04-01`, to: `${fyStart + 1}-03-31` });
const label = (fyStart: number) => `${fyStart}-${String(fyStart + 1).slice(2)}`;

/**
 * Outward supplies in a date range from the documents: tax invoices, counter bills (less their returns) and credit notes, with the tax on each.
 * Cancelled documents are left out. Everything is net of credit notes and returns, as the annual return shows it.
 */
async function outwardFromDocuments(tx: Tx, companyId: string, from: string, to: string) {
  const [row] = [...await tx.execute<{ taxable: string; igst: string; cgst: string; sgst: string; cess: string }>(sql`
    select coalesce(sum(taxable), 0)::text as taxable, coalesce(sum(igst), 0)::text as igst, coalesce(sum(cgst + utgst + sgst), 0)::text as cgst,
           0::text as sgst, coalesce(sum(cess), 0)::text as cess
    from (
      select taxable, igst, cgst, utgst, sgst, cess from sales_invoices where company_id = ${companyId} and status = 'posted' and date between ${from}::date and ${to}::date
      union all
      select taxable, 0, cgst, 0, sgst, cess from pos_bills where company_id = ${companyId} and status = 'paid' and date between ${from}::date and ${to}::date
      union all
      select -taxable, -igst, -cgst, -utgst, -sgst, -cess from credit_notes where company_id = ${companyId} and status = 'posted' and date between ${from}::date and ${to}::date
      union all
      select -r.taxable, 0, -r.cgst, 0, -r.sgst, -r.cess from pos_returns r where r.company_id = ${companyId} and r.date between ${from}::date and ${to}::date
    ) x`)];
  const tax = dec(row!.igst).plus(row!.cgst).plus(row!.sgst).plus(row!.cess);
  return { taxable: dec(row!.taxable), tax };
}

/** What the books hold in the sales accounts, the output tax accounts and the input tax accounts for a range. */
async function bookFigures(tx: Tx, companyId: string, from: string, to: string) {
  const rows = [...await tx.execute<{ kind: string; amount: string }>(sql`
    select case when coalesce(pg.key, g.key) = 'sales_accounts' or g.key = 'sales_accounts' then 'sales'
                when a.key like 'output\\_%' then 'output' when a.key like 'input\\_%' then 'input' end as kind,
           coalesce(sum(e.credit - e.debit), 0)::text as amount
    from gl_entries e join accounts a on a.id = e.account_id join account_groups g on g.id = a.group_id left join account_groups pg on pg.id = g.parent_id
    where a.company_id = ${companyId} and e.date between ${from}::date and ${to}::date
      and exists (select 1 from vouchers v where v.id = e.voucher_id and v.status = 'posted')
    group by 1`)];
  const get = (k: string) => dec(rows.find((r) => r.kind === k)?.amount ?? 0);
  return { sales: get("sales"), outputTax: get("output"), inputTax: get("input").negated() };
}

/** Input credit shown on purchase bills in a range (bills the tax was charged on, plus reverse charge credit). */
async function purchaseCredit(tx: Tx, companyId: string, from: string, to: string) {
  const [row] = [...await tx.execute<{ tax: string; rcm: string }>(sql`
    select coalesce(sum(igst + cgst + sgst + utgst + cess), 0)::text as tax,
           coalesce(sum(igst + cgst + sgst + utgst + cess) filter (where reverse_charge), 0)::text as rcm
    from purchase_bills where company_id = ${companyId} and status = 'posted' and date between ${from}::date and ${to}::date`)];
  return { tax: dec(row!.tax), rcm: dec(row!.rcm) };
}

/**
 * The working for GSTR-9C, the reconciliation statement: turnover in the books against turnover in the tax documents, tax paid against tax
 * shown on documents, and input credit in the books against the credit on purchase bills. Each gap is listed with the usual reasons to look at;
 * the figures are for the auditor to confirm, not a filing.
 */
export async function gstr9cWorking(tx: Tx, fyStart: number) {
  if (fyStart < 2017 || fyStart > 2100) throw badRequest("invalid_year");
  const company = await resolveCompany(tx);
  const { from, to } = fyRange(fyStart);
  const docs = await outwardFromDocuments(tx, company.id, from, to);
  const books = await bookFigures(tx, company.id, from, to);
  const credit = await purchaseCredit(tx, company.id, from, to);
  const line = (key: string, a: ReturnType<typeof dec>, b: ReturnType<typeof dec>, reasons: string[]) => {
    const diff = a.minus(b);
    return { key, books: money(a), returns: money(b), difference: money(diff), ok: diff.abs().lte(1), reasons: diff.abs().lte(1) ? [] : reasons };
  };
  const rows = [
    line("turnover", books.sales, docs.taxable, ["advancesAndAdjustments", "unbilledOrDeemedSupplies", "discountsPostedToJournal", "exemptOrNilSupplies"]),
    line("outputTax", books.outputTax, docs.tax, ["rateOrTaxPostedByJournal", "advanceTaxOnReceipts", "reverseChargeLiability"]),
    line("inputCredit", books.inputTax, credit.tax, ["creditReversed", "creditNotClaimed", "ineligibleCredit", "journalAdjustments"]),
  ];
  return {
    fy: label(fyStart), from, to, rows, reverseChargeCredit: money(credit.rcm), allAgree: rows.every((r) => r.ok),
    notCaptured: ["stockSplitOfInputs", "tableWiseDetailOfAnnualReturn", "auditorsNotes"],
  };
}

/**
 * The summary a composition taxpayer needs for the quarterly statement and the annual GSTR-4: turnover for each quarter with tax at the rate
 * the dealer pays (1% for traders and manufacturers, 5% for restaurants, 6% for other services), and purchases split into those from registered
 * suppliers, reverse charge and from unregistered suppliers. A composition dealer charges no tax on the bill, so turnover is the taxable value.
 */
export async function gstr4Summary(tx: Tx, fyStart: number, ratePct = "1") {
  if (fyStart < 2017 || fyStart > 2100) throw badRequest("invalid_year");
  if (!dec(ratePct).gt(0) || dec(ratePct).gt(6)) throw badRequest("invalid_rate");
  const company = await resolveCompany(tx);
  const quarters = [
    { q: 1, from: `${fyStart}-04-01`, to: `${fyStart}-06-30` }, { q: 2, from: `${fyStart}-07-01`, to: `${fyStart}-09-30` },
    { q: 3, from: `${fyStart}-10-01`, to: `${fyStart}-12-31` }, { q: 4, from: `${fyStart + 1}-01-01`, to: `${fyStart + 1}-03-31` },
  ];
  const rate = dec(ratePct);
  const rows = [];
  for (const q of quarters) {
    const d = await outwardFromDocuments(tx, company.id, q.from, q.to);
    // Under composition the bill value is the turnover whatever tax was shown on it.
    const turnover = d.taxable;
    const tax = turnover.times(rate).div(100);
    const half = tax.div(2);
    rows.push({ quarter: q.q, from: q.from, to: q.to, turnover: money(turnover), tax: money(tax), cgst: money(half), sgst: money(tax.minus(half.toDecimalPlaces(2))) });
  }
  const { from, to } = fyRange(fyStart);
  const inward = [...await tx.execute<{ kind: string; taxable: string; tax: string; bills: number }>(sql`
    select case when b.reverse_charge then 'reverseCharge' when a.gstin is null or a.gstin = '' then 'unregistered' else 'registered' end as kind,
           coalesce(sum(b.taxable), 0)::text as taxable, coalesce(sum(b.igst + b.cgst + b.sgst + b.utgst + b.cess), 0)::text as tax, count(*)::int as bills
    from purchase_bills b join accounts a on a.id = b.supplier_id
    where b.company_id = ${company.id} and b.status = 'posted' and b.date between ${from}::date and ${to}::date group by 1`)];
  const totalTurnover = rows.reduce((t, r) => t.plus(r.turnover), dec(0));
  const totalTax = rows.reduce((t, r) => t.plus(r.tax), dec(0));
  return {
    fy: label(fyStart), ratePct: rate.toString(), quarters: rows, totals: { turnover: money(totalTurnover), tax: money(totalTax) },
    inward: ["registered", "reverseCharge", "unregistered"].map((k) => {
      const r = inward.find((x) => x.kind === k);
      return { kind: k, bills: r?.bills ?? 0, taxable: money(r?.taxable ?? 0), tax: money(r?.tax ?? 0) };
    }),
  };
}

const headsOf = (r: { igst?: string; cgst?: string; sgst?: string; cess?: string }): Gstr9Heads => ({ igst: money(r.igst ?? "0"), cgst: money(r.cgst ?? "0"), sgst: money(r.sgst ?? "0"), cess: money(r.cess ?? "0") });

/**
 * The working for the annual return GSTR-9: the twelve months of GSTR-3B added up into the annual tables (4 outward supplies, 5 zero rated and nil,
 * 6 credit availed, 7 reversals, 8 credit against the statement, 9 tax paid). Table 8A can be taken from the GSTR-2B statements imported for the
 * year or from the purchase books; `basis` picks one and both are shown. Tables 10 to 15 (amendments, last year's items, demands, late fees and
 * HSN) are not built here and are listed as not captured. This is a working for the accountant, not a filing.
 */
export async function gstr9Working(tx: Tx, fyStart: number, basis: Table8Basis = "2b") {
  if (fyStart < 2017 || fyStart > 2100) throw badRequest("invalid_year");
  const company = await resolveCompany(tx);
  const { from, to } = fyRange(fyStart);
  const fps: string[] = [];
  for (let i = 0; i < 12; i++) {
    const month = ((3 + i) % 12) + 1, year = month >= 4 ? fyStart : fyStart + 1;
    fps.push(`${String(month).padStart(2, "0")}${year}`);
  }
  const months: Gstr9Month[] = [];
  for (const fp of fps) {
    const r = await gstr3b(tx, company.id, fp);
    const cash = (k: "igst" | "cgst" | "sgst" | "cess") => money(dec(r.setOff.cashPayable[k]).plus(r.setOff.reverseChargeCash[k]));
    months.push({
      fp,
      outward: { taxable: r["3.1"].a_taxable.taxable, ...headsOf(r["3.1"].a_taxable) },
      zeroRated: { taxable: r["3.1"].b_zeroRated.taxable, ...headsOf(r["3.1"].b_zeroRated) },
      nilExempt: r["3.1"].c_nilExempt.taxable,
      reverseCharge: { taxable: r["3.1"].d_inwardReverseCharge.taxable, ...headsOf(r["3.1"].d_inwardReverseCharge) },
      itcAvailed: headsOf(r["4"].available), itcReversed: headsOf(r["4"].reversed),
      taxPayable: headsOf(r.liability), taxPaidInCash: { igst: cash("igst"), cgst: cash("cgst"), sgst: cash("sgst"), cess: cash("cess") },
    });
  }
  // The credit the statements show: the newest GSTR-2B import of each month, invoices less notes, only where the portal says credit is available.
  const imports = [...await tx.execute<{ period: string; id: string }>(sql`
    select distinct on (period) period, id from gstr2b_imports where company_id = ${company.id} and source = '2b' and period = any(${`{${fps.join(",")}}`}::text[])
    order by period, imported_at desc`)];
  const have = new Set(imports.map((i) => i.period));
  const [per2b] = imports.length ? [...await tx.execute<{ igst: string; cgst: string; sgst: string; cess: string }>(sql`
    select coalesce(sum(case when kind = 'invoice' then igst else -igst end), 0)::text as igst, coalesce(sum(case when kind = 'invoice' then cgst else -cgst end), 0)::text as cgst,
           coalesce(sum(case when kind = 'invoice' then sgst else -sgst end), 0)::text as sgst, coalesce(sum(case when kind = 'invoice' then cess else -cess end), 0)::text as cess
    from gstr2b_rows where import_id = any(${`{${imports.map((i) => i.id).join(",")}}`}::uuid[]) and itc_available`)] : [undefined];
  const [books] = [...await tx.execute<{ igst: string; cgst: string; sgst: string; cess: string }>(sql`
    select coalesce(sum(igst), 0)::text as igst, coalesce(sum(cgst), 0)::text as cgst, coalesce(sum(sgst + utgst), 0)::text as sgst, coalesce(sum(cess), 0)::text as cess
    from purchase_bills where company_id = ${company.id} and status = 'posted' and not reverse_charge and date between ${from}::date and ${to}::date`)];
  const [booksRet] = [...await tx.execute<{ igst: string; cgst: string; sgst: string; cess: string }>(sql`
    select coalesce(sum(igst), 0)::text as igst, coalesce(sum(cgst), 0)::text as cgst, coalesce(sum(sgst + utgst), 0)::text as sgst, coalesce(sum(cess), 0)::text as cess
    from purchase_returns where company_id = ${company.id} and status = 'posted' and date between ${from}::date and ${to}::date`)];
  const net = (a: Gstr9Heads, b: Gstr9Heads): Gstr9Heads => ({ igst: money(dec(a.igst).minus(b.igst)), cgst: money(dec(a.cgst).minus(b.cgst)), sgst: money(dec(a.sgst).minus(b.sgst)), cess: money(dec(a.cess).minus(b.cess)) });
  const tables = gstr9Tables({
    months, basis, monthsWithout2b: fps.filter((p) => !have.has(p)),
    creditPer2b: per2b ? headsOf(per2b) : headsOf({}), creditPerBooks: net(headsOf(books!), headsOf(booksRet!)),
  });
  return {
    fy: label(fyStart), from, to, basis, dueOn: returnDueDate("GSTR9", `FY${fyStart}-${String(fyStart + 1).slice(2)}`),
    tables, months: months.map((m) => m.fp),
    notCaptured: ["amendmentsOfTheYear", "lastYearTransactionsReportedThisYear", "demandsAndRefunds", "lateFeeAndPenalty", "hsnSummaryOfOutward", "hsnSummaryOfInward", "differenceOfTable8Reasons"],
    needsAccountant: ["table8ABasis"],
  };
}
