import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const closing = async (accountId: string) => (await get(`/reports/ledger/${accountId}?from=2026-01-01&to=2027-12-31`)).closing as string;

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("tds")).cookie;
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  const group = (k: string) => groups.find((g) => g.key === k)!.id;
  id.firm = (await post("/accounts", { name: "Shah Contractors LLP", groupId: group("sundry_creditors"), stateCode: "27", pan: "AAAFS1234C" })).body.id;
  id.person = (await post("/accounts", { name: "Dr Mehta", groupId: group("sundry_creditors"), stateCode: "27", pan: "ABCPM1234D" })).body.id;
  id.nopan = (await post("/accounts", { name: "Cash Labour", groupId: group("sundry_creditors"), stateCode: "27" })).body.id;
  id.expense = (await get("/accounts")).find((a: { key: string | null }) => a.key === "cash")?.id;
});
afterAll(() => t.close());

describe("TDS on payments other than salary", () => {
  it("lists the sections and previews the tax without posting anything", async () => {
    expect((await get("/tds/sections")).map((s: { code: string }) => s.code)).toContain("194C");
    const p = await get(`/tds/preview?deducteeId=${id.firm}&section=194C&date=2026-11-03&base=50000`);
    expect(p).toMatchObject({ rate: "2.00", tds: "1000.00", individual: false });
    expect(await closing(id.firm)).toBe("0.00");
  });

  it("holds the tax back from the payee and records it", async () => {
    const d = await post("/tds/deductions", { deducteeId: id.firm, section: "194C", date: "2026-11-03", base: "50000", note: "Shop fitting" });
    expect(d.status).toBe(201);
    expect(d.body).toMatchObject({ tds: "1000.00", taxableBase: "50000.00", challanId: null });
    // Debiting the supplier by the tax leaves less owed to them (a credit balance).
    expect(await closing(id.firm)).toBe("1000.00");
    // A professional taxed at 10%, and a payee with no PAN at 20%.
    expect((await post("/tds/deductions", { deducteeId: id.person, section: "194J(b)", date: "2026-11-05", base: "80000" })).body).toMatchObject({ rate: "10.00", tds: "8000.00" });
    expect((await post("/tds/deductions", { deducteeId: id.nopan, section: "194C", date: "2026-11-06", base: "40000" })).body).toMatchObject({ rate: "20.00", tds: "8000.00", noPan: true });
  });

  it("counts small payments toward the year's limit even when no tax is due yet", async () => {
    const a = await post("/tds/deductions", { deducteeId: id.person, section: "194A", date: "2026-11-07", base: "6000" });
    expect(a.body).toMatchObject({ tds: "0.00", taxableBase: "0.00" });
    const b = await post("/tds/deductions", { deducteeId: id.person, section: "194A", date: "2026-11-08", base: "6000" });
    // 12,000 is over the 10,000 limit: all of it is taxed now, 10% = 1,200.
    expect(b.body).toMatchObject({ taxableBase: "12000.00", tds: "1200.00" });
  });

  it("refuses an unknown section, a non-party account and a bad amount", async () => {
    expect((await post("/tds/deductions", { deducteeId: id.firm, section: "999", date: "2026-11-03", base: "100" })).body.error).toBe("unknown_section");
    expect((await post("/tds/deductions", { deducteeId: id.expense, section: "194C", date: "2026-11-03", base: "100000" })).body.error).toBe("not_a_party");
    expect((await post("/tds/deductions", { deducteeId: id.firm, section: "194C", date: "2026-11-03", base: "0" })).body.error).toBe("invalid_amount");
  });

  it("files the deductions under a challan and builds the quarterly return", async () => {
    const list = await get("/tds/deductions?fy=2026-27&quarter=3");
    expect(list.length).toBe(5);
    const mine = list.filter((d: { section: string; tds: string }) => d.section !== "194A" || d.tds !== "0.00").map((d: { id: string }) => d.id);
    const before = await get("/tds/26q?fy=2026-27&quarter=3");
    expect(before.totals).toMatchObject({ deducted: "18200.00", deposited: "0.00" });
    expect(before.warnings.map((w: { code: string }) => w.code)).toEqual(expect.arrayContaining(["tan_missing", "pan_missing", "deposit_mismatch"]));
    expect((await post("/tds/challans", { paidOn: "2026-12-05", amount: "18200", accountId: id.expense, bsrCode: "123", challanSerial: "00001" })).status).toBe(400);
    const ch = await post("/tds/challans", { paidOn: "2026-12-05", amount: "18200", accountId: id.expense, bsrCode: "0510308", challanSerial: "00001", deductionIds: mine });
    expect(ch.status).toBe(201);
    const after = await get("/tds/26q?fy=2026-27&quarter=3");
    expect(after.totals).toEqual({ deducted: "18200.00", deposited: "18200.00" });
    expect(after.warnings.map((w: { code: string }) => w.code)).not.toContain("deposit_mismatch");
    expect(after.deductees.find((d: { name: string }) => d.name === "Shah Contractors LLP")).toMatchObject({ bsrCode: "0510308", challanSerial: "00001", section: "194C" });
    expect(after.files.deductees.content).toContain("AAAFS1234C,Shah Contractors LLP,194C,,,2026-11-03,50000.00");
    // Another quarter is empty.
    expect((await get("/tds/26q?fy=2026-27&quarter=2")).deductees).toEqual([]);
    // A deposited deduction cannot be cancelled until the challan is.
    const firm = list.find((d: { deductee: string }) => d.deductee === "Shah Contractors LLP");
    expect((await post(`/tds/deductions/${firm.id}/cancel`, { reason: "Wrong amount" })).body.error).toBe("tds_deposited");
    expect((await post(`/tds/challans/${ch.body.id}/cancel`, { reason: "Wrong bank" })).status).toBe(200);
    expect((await post(`/tds/deductions/${firm.id}/cancel`, { reason: "Wrong amount" })).status).toBe(200);
    expect(await closing(id.firm)).toBe("0.00");
  });

  it("is private to the business", async () => {
    const other = (await t.signup("tds-other")).cookie;
    expect((await t.call(other, "GET", "/tds/deductions")).body).toEqual([]);
    expect((await t.call(other, "POST", "/tds/deductions", { deducteeId: id.firm, section: "194C", date: "2026-11-03", base: "50000" })).status).toBe(400);
  });
});

describe("certificate and 194Q tracker", () => {
  it("gives a payee's quarterly certificate from the deductions and challans, and nothing when there are none", async () => {
    const cert = await get(`/tds/certificate?deducteeId=${id.person}&fy=2026-27&quarter=3`);
    expect(cert).toMatchObject({ number: expect.stringMatching(/^16A\/2026-27\/Q3\//), totals: { tds: "9200.00" }, deductee: { name: "Dr Mehta", pan: "ABCPM1234D" } });
    expect(cert.rows.map((r: { section: string }) => r.section).sort()).toEqual(["194A", "194J(b)"]);
    expect((await t.call(c, "GET", `/tds/certificate?deducteeId=${id.person}&fy=2026-27&quarter=1`)).body.error).toBe("no_deductions");
  });

  it("lists suppliers against the 194Q limit", async () => {
    const r = await get("/tds/194q?fy=2026-27");
    expect(r).toMatchObject({ limit: "5000000.00", totalShortfall: "0.00" });
    expect(Array.isArray(r.rows)).toBe(true);
  });
});

describe("tax collected at source", () => {
  it("collects from a customer, deposits it and builds the 27EQ files", async () => {
    const groups: { id: string; key: string }[] = await get("/accounts/groups");
    const buyer = (await post("/accounts", { name: "Scrap Buyer", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27", pan: "AAACS1234E" })).body.id;
    expect((await get(`/tcs/preview?customerId=${buyer}&section=${encodeURIComponent("206C(1) scrap")}&base=200000`))).toMatchObject({ rate: "1.00", tcs: "2000.00" });
    const r = await post("/tcs/collections", { customerId: buyer, section: "206C(1) scrap", date: "2026-11-10", base: "200000" });
    expect(r.status).toBe(201);
    expect(await closing(buyer)).toBe("-2000.00".replace("-", ""));
    expect((await post("/tcs/collections", { customerId: buyer, section: "nonsense", date: "2026-11-10", base: "100" })).body.error).toBe("unknown_section");
    const before = await get("/tcs/27eq?fy=2026-27&quarter=3");
    expect(before.totals).toEqual({ collected: "2000.00", deposited: "0.00" });
    expect(before.warnings.map((w: { code: string }) => w.code)).toContain("deposit_mismatch");
    const ch = await post("/tds/challans", { paidOn: "2026-11-20", amount: "2000", accountId: id.expense, bsrCode: "0510308", challanSerial: "00002", kind: "tcs", deductionIds: [r.body.id] });
    expect(ch.status).toBe(201);
    const after = await get("/tcs/27eq?fy=2026-27&quarter=3");
    expect(after.totals).toEqual({ collected: "2000.00", deposited: "2000.00" });
    expect(after.files.collectees.content).toContain("AAACS1234E,Scrap Buyer,206C(1) scrap");
    // The TDS return is unaffected by a TCS challan.
    expect((await get("/tds/26q?fy=2026-27&quarter=3")).challans.some((x: { bsrCode: string; challanSerial: string }) => x.challanSerial === "00002")).toBe(false);
    expect((await post(`/tcs/collections/${r.body.id}/cancel`, { reason: "Wrong party" })).body.error).toBe("tds_deposited");
    expect((await post(`/tds/challans/${ch.body.id}/cancel`, { reason: "Wrong bank" })).status).toBe(200);
    expect((await post(`/tcs/collections/${r.body.id}/cancel`, { reason: "Wrong party" })).status).toBe(200);
  });
});

describe("section 393 numbering", () => {
  it("starts with no reference set, takes pasted lines, and carries them into the 26Q file and the certificate", async () => {
    const empty = await get("/tds/section-map");
    expect(empty.find((m: { legacySection: string }) => m.legacySection === "194J(b)")).toMatchObject({ newRef: null, paymentCode: null });
    expect((await t.call(c, "PUT", "/tds/section-map", { text: "999\tX" })).body.error).toBe("unknown_section");
    expect((await t.call(c, "PUT", "/tds/section-map", { text: "194J(b);393(1) Table Sl. 6(ii);1027\n194C,393(1) Table Sl. 6(i)" })).body).toMatchObject({ ok: true, saved: 2 });
    const map = await get("/tds/section-map");
    expect(map.find((m: { legacySection: string }) => m.legacySection === "194J(b)")).toMatchObject({ newRef: "393(1) Table Sl. 6(ii)", paymentCode: "1027" });
    const q = await get("/tds/26q?fy=2026-27&quarter=3");
    expect(q.deductees.find((d: { section: string }) => d.section === "194J(b)")).toMatchObject({ newRef: "393(1) Table Sl. 6(ii)", paymentCode: "1027" });
    expect(q.files.deductees.content.split("\n")[0]).toContain("Section 393 reference");
    const cert = await get(`/tds/certificate?deducteeId=${id.person}&fy=2026-27&quarter=3`);
    expect(cert.rows.find((r: { section: string }) => r.section === "194J(b)")).toMatchObject({ newRef: "393(1) Table Sl. 6(ii)" });
    expect((await t.call(c, "DELETE", "/tds/section-map/194C")).status).toBe(200);
    expect((await get("/tds/section-map")).find((m: { legacySection: string }) => m.legacySection === "194C").newRef).toBeNull();
    expect((await t.call(c, "PUT", "/tds/section-map", { text: "\n" })).status).toBe(400);
  });
});
