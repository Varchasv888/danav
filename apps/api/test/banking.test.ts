import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const tb = async (key: string, asOf = "2026-12-31") => ((await get(`/reports/trial-balance?asOf=${asOf}`)).rows as { accountId: string; dr: string; cr: string }[]).find((r) => r.accountId === id[key]) ?? { dr: "0.00", cr: "0.00" };
const voucher = async (type: string, date: string, lines: { accountId: string; debit?: string; credit?: string }[], reference?: string) =>
  (await post("/vouchers", { type, date, lines, ...(reference ? { reference } : {}) })).body;

const HDFC = [
  "HDFC BANK Ltd.,,,,,,",
  "Date,Narration,Chq./Ref.No.,Value Dt,Withdrawal Amt.,Deposit Amt.,Closing Balance",
  '01/10/26,UPI-SHARMA TRADERS-SHARMA@OKSBI-SBIN0001234-627412345678-PAYMENT,0000627412345678,01/10/26,,"12,500.00","1,12,500.00"',
  '03/10/26,NEFT DR-ICIC0000123-ANAND DAIRY-NETBANK-N276262012345678,N276262012345678,03/10/26,"8,000.00",,"1,04,500.00"',
  '05/10/26,CHQ PAID-000123-RAJ ELECTRICALS,000123,05/10/26,"2,360.00",,"1,02,140.00"',
  '31/10/26,SMS CHARGES FOR OCT,,31/10/26,17.70,,"1,02,122.30"',
].join("\n");

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("bank", { gstin: "27AAPFU0939F1ZV" })).cookie;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  const group = (k: string) => groups.find((g) => g.key === k)!.id;
  id.hdfc = (await post("/accounts", { name: "HDFC Current", groupId: group("bank_accounts"), openingBalance: "100000" })).body.id;
  id.icici = (await post("/accounts", { name: "ICICI Current", groupId: group("bank_accounts") })).body.id;
  id.sharma = (await post("/accounts", { name: "Sharma Traders", groupId: group("sundry_debtors"), stateCode: "27" })).body.id;
  id.anand = (await post("/accounts", { name: "Anand Dairy", groupId: group("sundry_creditors"), stateCode: "27" })).body.id;
  id.raj = (await post("/accounts", { name: "Raj Electricals", groupId: group("sundry_creditors"), stateCode: "27" })).body.id;
  for (const a of await get("/accounts") as { id: string; key: string | null }[]) if (a.key) id[a.key] = a.id;
  await voucher("receipt", "2026-09-30", [{ accountId: id.hdfc!, debit: "12500" }, { accountId: id.sharma!, credit: "12500" }], "627412345678");
  await voucher("payment", "2026-10-03", [{ accountId: id.anand!, debit: "8000" }, { accountId: id.hdfc!, credit: "8000" }]);
  await voucher("payment", "2026-10-02", [{ accountId: id.raj!, debit: "2360" }, { accountId: id.hdfc!, credit: "2360" }], "000123");
  id.cheque = (await voucher("payment", "2026-10-20", [{ accountId: id.raj!, debit: "5000" }, { accountId: id.hdfc!, credit: "5000" }], "000124")).id;
  id.deposit = (await voucher("receipt", "2026-10-31", [{ accountId: id.hdfc!, debit: "3000" }, { accountId: id.sharma!, credit: "3000" }])).id;
});
afterAll(() => t.close());

describe("statements", () => {
  it("imports an HDFC statement and clears what it can be sure of", async () => {
    const r = await post(`/banking/accounts/${id.hdfc}/statements`, { fileName: "hdfc-oct.csv", csv: HDFC });
    expect(r.status).toBe(201);
    expect(r.body).toMatchObject({ added: 4, duplicates: 0, matched: 3, from: "2026-10-01", to: "2026-10-31" });
    expect(r.body.check).toMatchObject({ checkable: true, breaks: [], closing: "102122.30" }); // every balance follows from the line before it
    expect(r.body.continuity).toBeNull(); // nothing was loaded before it
    const again = await post(`/banking/accounts/${id.hdfc}/statements`, { csv: HDFC });
    expect(again.body).toMatchObject({ added: 0, duplicates: 4, matched: 0 });
    expect((await post(`/banking/accounts/${id.hdfc}/statements`, { csv: "hello,world\n1,2\n" })).body.error).toBe("no_header");
    expect((await post(`/banking/accounts/${id.sharma}/statements`, { csv: HDFC })).body.error).toBe("not_a_bank_account");
  });

  it("posts bank charges through a rule, then the reconciliation balances to the statement", async () => {
    const lines = await get(`/banking/accounts/${id.hdfc}/lines?status=unmatched`);
    expect(lines.map((l: { description: string }) => l.description)).toEqual(["SMS CHARGES FOR OCT"]);
    await post("/banking/rules", { contains: "sms charges", direction: "out", accountId: id.bank_charges, narration: "SMS alert charges" });
    expect((await get(`/banking/accounts/${id.hdfc}/lines?status=unmatched`))[0].rule).toMatchObject({ accountId: id.bank_charges, account: "Bank Charges" });
    expect((await post(`/banking/accounts/${id.hdfc}/apply-rules`, {})).body.posted).toBe(1);
    expect((await tb("bank_charges")).dr).toBe("17.70");
    const brs = await get(`/banking/accounts/${id.hdfc}/reconciliation?asOf=2026-10-31`);
    // Books: 1,00,000 + 12,500 − 8,000 − 2,360 − 5,000 + 3,000 − 17.70
    expect(brs).toMatchObject({
      balancePerBooks: "100122.30",
      notPresented: { total: "5000.00", rows: [expect.objectContaining({ voucherId: id.cheque, number: expect.any(String) })] },
      notCredited: { total: "3000.00" }, bankDebits: { total: "0.00" }, bankCredits: { total: "0.00" },
      balancePerBank: "102122.30", statement: { date: "2026-10-31", balance: "102122.30", difference: "0.00" },
    });
  });

  it("matches by hand, including several book entries against one line, and refuses wrong totals", async () => {
    const nov = "Transaction Date,Transaction Remarks,Amount (INR),Cr/Dr,Balance(INR)\n01-Nov-2026,CASH DEPOSIT BRANCH,3000.00,CR,105122.30\n02-Nov-2026,CHQ PAID-000124-RAJ ELECTRICALS,5000.00,DR,100122.30\n";
    const r = await post(`/banking/accounts/${id.hdfc}/statements`, { csv: nov });
    expect(r.body).toMatchObject({ added: 2, matched: 1 }); // the cheque number makes the payment certain
    // November opens where October closed, and the statement adds up on its own.
    expect(r.body.continuity).toMatchObject({ previousDate: "2026-10-31", previousBalance: "102122.30", opening: "102122.30", agrees: true });
    expect(r.body.check).toMatchObject({ checkable: true, breaks: [] });
    const kg = ((await get("/accounts/groups")) as { id: string; key: string }[]).find((g) => g.key === "bank_accounts")!.id;
    id.kotak = (await post("/accounts", { name: "Kotak Current", groupId: kg })).body.id;
    // A second statement that does not start where the last one ended means a statement is missing between them; a line left out inside one is a break.
    const head = "Transaction Date,Transaction Remarks,Amount (INR),Cr/Dr,Balance(INR)";
    const nl = "\n";
    await post(`/banking/accounts/${id.kotak}/statements`, { csv: [head, "01-Nov-2026,NEFT CR A,1000.00,CR,1000.00", "02-Nov-2026,NEFT CR B,500.00,CR,1500.00"].join(nl) });
    const later = await post(`/banking/accounts/${id.kotak}/statements`, { csv: [head, "20-Nov-2026,NEFT CR C,200.00,CR,5200.00", "21-Nov-2026,NEFT CR D,100.00,CR,5300.00"].join(nl) });
    expect(later.body.check.breaks).toEqual([]);
    expect(later.body.continuity).toMatchObject({ previousBalance: "1500.00", opening: "5000.00", agrees: false });
    const holed = await post(`/banking/accounts/${id.kotak}/statements`, { csv: [head, "25-Nov-2026,NEFT CR E,100.00,CR,5400.00", "27-Nov-2026,NEFT CR G,300.00,CR,5900.00"].join(nl) });
    expect(holed.body.check.breaks).toEqual([expect.objectContaining({ date: "2026-11-27", expected: "5700.00", found: "5900.00" })]);
    const open = await get(`/banking/accounts/${id.hdfc}/lines?status=unmatched`);
    expect(open).toHaveLength(1);
    expect(open[0].suggestion).toMatchObject({ id: id.deposit, amount: "3000.00" });
    expect((await post(`/banking/lines/${open[0].id}/match`, { voucherIds: [id.cheque] })).body.error).toBe("voucher_not_open");
    await post(`/banking/lines/${open[0].id}/match`, { voucherIds: [id.deposit] });
    expect(await get(`/banking/accounts/${id.hdfc}/lines?status=unmatched`)).toEqual([]);
    const brs = await get(`/banking/accounts/${id.hdfc}/reconciliation?asOf=2026-11-30`);
    expect(brs).toMatchObject({ notPresented: { total: "0.00" }, notCredited: { total: "0.00" }, statement: { difference: "0.00" } });
    await post(`/banking/lines/${open[0].id}/unmatch`, {});
    await post(`/banking/lines/${open[0].id}/ignore`, {});
    expect((await get(`/banking/accounts/${id.hdfc}/lines?status=ignored`)).length).toBe(1);
  });
});

describe("bank feed (Account Aggregator simulator)", () => {
  it("connects, fetches what the bank saw, and matches it", async () => {
    await voucher("receipt", "2026-10-10", [{ accountId: id.icici!, debit: "1000" }, { accountId: id.sharma!, credit: "1000" }]);
    await voucher("payment", "2026-10-12", [{ accountId: id.raj!, debit: "400" }, { accountId: id.icici!, credit: "400" }], "000555");
    expect((await post(`/banking/accounts/${id.icici}/feed/fetch`, {})).body.error).toBe("feed_not_connected");
    expect((await post(`/banking/accounts/${id.icici}/feed/connect`, {})).body).toEqual({ provider: "simulator", status: "active" });
    const r = await post(`/banking/accounts/${id.icici}/feed/fetch`, { to: "2026-10-31" });
    // The receipt and the cheque (cleared two days later), and SMS charges at three month ends.
    expect(r.body).toMatchObject({ added: 5, matched: 2 });
    expect((await post(`/banking/accounts/${id.icici}/feed/fetch`, { to: "2026-10-31" })).body).toMatchObject({ added: 0 });
    const accounts = await get("/banking/accounts");
    expect(accounts.find((a: { id: string }) => a.id === id.icici)).toMatchObject({ unmatched: 3, profile: { feedStatus: "active", feedFetchedTo: "2026-10-31" } });
  });
});

describe("gateway settlements", () => {
  it("posts each payout once with fees and GST on fees, and the bank credit matches it", async () => {
    const csv = [
      "entity_id,type,debit,credit,amount,currency,fee,tax,settled_at,settlement_id,settlement_utr",
      "pay_A,payment,0,982.3,1000,INR,17.7,2.7,2026-11-03 09:00:00,setl_1,UTIBR52026110312345",
      "pay_B,payment,0,491.15,500,INR,8.85,1.35,2026-11-03 09:00:00,setl_1,UTIBR52026110312345",
      "rfnd_C,refund,200,0,200,INR,0,0,2026-11-03 09:00:00,setl_1,UTIBR52026110312345",
    ].join("\n");
    const r = await post("/banking/settlements", { provider: "Razorpay", csv, bankAccountId: id.hdfc, clearingAccountId: id.upi_clearing });
    expect(r.body).toMatchObject({ posted: [expect.objectContaining({ settlementId: "setl_1", net: "1273.45", number: "STL/26-27/00001" })], skipped: 0 });
    expect((await tb("gateway_charges")).dr).toBe("22.50");
    for (const a of await get("/accounts") as { id: string; key: string | null }[]) if (a.key) id[a.key] = a.id;
    expect((await tb("input_igst")).dr).toBe("4.05");
    expect((await tb("upi_clearing")).cr).toBe("1300.00");
    expect((await post("/banking/settlements", { provider: "razorpay", csv, bankAccountId: id.hdfc, clearingAccountId: id.upi_clearing })).body).toMatchObject({ posted: [], skipped: 1 });
    const stmt = "Transaction Date,Transaction Remarks,Amount (INR),Cr/Dr,Balance(INR)\n04-Nov-2026,NEFT CR-RAZORPAY SOFTWARE-UTIBR52026110312345,1273.45,CR,101395.75\n";
    expect((await post(`/banking/accounts/${id.hdfc}/statements`, { csv: stmt })).body).toMatchObject({ added: 1, matched: 1 });
    expect((await get("/banking/settlements"))[0]).toMatchObject({ matched: true, utr: "UTIBR52026110312345" });
  });
});
