import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { sql } from "drizzle-orm";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let owner: string;
let other: string;
let inventoryViewer: string;
let tenantId: string;
let companyId: string;
let companyBId: string;
let itemId: string;
let serviceId: string;
let foreignItemId: string;
let companyBItemId: string;
let warehouseId: string;

const get = async (cookie: string, url: string) => t.call(cookie, "GET", url);
const post = async (cookie: string, url: string, body?: unknown) => t.call(cookie, "POST", url, body);
const patch = async (cookie: string, url: string, body?: unknown) => t.call(cookie, "PATCH", url, body);

async function makeBox() {
  const result = await post(owner, "/packing-boxes", { companyId });
  expect(result.status, JSON.stringify(result.body)).toBe(201);
  return result.body as { id: string; code: string; status: string };
}

async function stockSnapshot() {
  const [ledger] = await t.ownerDb.db.execute<{ count: number }>(sql`
    select count(*)::int as count from stock_ledger
    where tenant_id = ${tenantId} and company_id = ${companyId} and item_id = ${itemId}`);
  const items = await get(owner, `/items?companyId=${companyId}`);
  const item = (items.body as { id: string; stockQty: string }[]).find((row) => row.id === itemId)!;
  return { ledgerRows: ledger!.count, stockQty: item.stockQty };
}

beforeAll(async () => {
  t = await testApp();
  const signup = await t.signup("packing-boxes", { gstin: "27AAPFU0939F1ZV" });
  owner = signup.cookie;
  tenantId = signup.body.tenantId;
  const secondSignup = await t.signup("packing-boxes-other");
  expect(secondSignup.status, JSON.stringify(secondSignup.body)).toBe(201);
  other = secondSignup.cookie;
  const otherSetupResult = await get(other, "/inventory/setup");
  expect(otherSetupResult.status, JSON.stringify(otherSetupResult.body)).toBe(200);
  const otherSetup = otherSetupResult.body as { uoms: { id: string; code: string }[] };
  const foreignItem = await post(other, "/items", { name: "Foreign boxed goods", uomId: otherSetup.uoms.find((unit) => unit.code === "PCS")!.id, gstRate: "5" });
  foreignItemId = foreignItem.body.id;

  const companies = (await get(owner, "/companies")).body as { id: string }[];
  companyId = companies[0]!.id;
  const [companyB] = await t.ownerDb.db.execute<{ id: string }>(sql`
    insert into companies (tenant_id, name, books_begin_on) values (${tenantId}, 'Packing Company B', '2020-01-01') returning id`);
  companyBId = companyB!.id;
  const role = await post(owner, "/roles", { name: "Packing inventory viewer", permissions: ["inventory.view"] });
  const invitation = await post(owner, "/invitations", { email: `packing-viewer-${t.run}@test.varchasv.in`, roleId: role.body.id });
  const token = (invitation.body as { inviteUrl: string }).inviteUrl.split("/invite/")[1];
  inventoryViewer = (await t.call("", "POST", "/invitations/accept", { token, name: "Packing Viewer", password: "ledger-balanced-1" })).cookie;
  const setupB = (await get(owner, `/inventory/setup?companyId=${companyBId}`)).body as { uoms: { id: string; code: string }[] };
  const companyBItem = await post(owner, "/items", { name: "Company B goods", uomId: setupB.uoms.find((unit) => unit.code === "PCS")!.id, gstRate: "5", companyId: companyBId });
  companyBItemId = companyBItem.body.id;
  const setup = (await get(owner, `/inventory/setup?companyId=${companyId}`)).body as {
    uoms: { id: string; code: string }[];
    warehouses: { id: string }[];
  };
  const pcs = setup.uoms.find((unit) => unit.code === "PCS")!.id;
  warehouseId = setup.warehouses[0]!.id;
  const goods = await post(owner, "/items", { name: "Boxed goods", uomId: pcs, gstRate: "5", saleRate: "500", companyId });
  itemId = goods.body.id;
  const service = await post(owner, "/items", { name: "Boxing service", kind: "service", uomId: pcs, gstRate: "18", companyId });
  serviceId = service.body.id;
  const opening = await post(owner, "/stock-journals", {
    companyId, kind: "opening", lines: [{ itemId, warehouseId, qty: "12", rate: "100" }],
  });
  expect(opening.status, JSON.stringify(opening.body)).toBe(201);
});

afterAll(() => t.close());

describe("packing boxes", () => {
  it("lets inventory-only staff load the company context needed by packing pages", async () => {
    const companies = await get(inventoryViewer, "/packing-boxes/companies");
    expect(companies.status, JSON.stringify(companies.body)).toBe(200);
    expect(companies.body).toEqual(expect.arrayContaining([expect.objectContaining({ id: companyId, name: "packing-boxes Traders" })]));
    expect((companies.body as Record<string, unknown>[])[0]).not.toHaveProperty("branches");
    expect((await get(inventoryViewer, "/companies")).status).toBe(403);
    const box = await makeBox();
    const detail = await get(inventoryViewer, `/packing-boxes/${box.id}`);
    expect(detail.status, JSON.stringify(detail.body)).toBe(200);
    expect(detail.body).toMatchObject({ company: { id: companyId, name: "packing-boxes Traders" } });
  });

  it("creates a numbered box, repacks its goods, and records the immutable contents history without moving stock", async () => {
    const before = await stockSnapshot();
    const box = await makeBox();
    expect(await stockSnapshot()).toEqual(before);
    expect(box.code).toMatch(/^BOX\//);
    expect(box.status).toBe("open");

    const packed = await post(owner, `/packing-boxes/${box.id}/repack`, {
      lines: [{ itemId, qty: "3.5" }],
    });
    expect(packed.status, JSON.stringify(packed.body)).toBe(200);

    const detail = await get(owner, `/packing-boxes/${box.id}`);
    expect(detail.status).toBe(200);
    expect(detail.body).toMatchObject({
      id: box.id,
      status: "packed",
      lines: [{ itemId, qty: "3.5000" }],
    });
    expect(detail.body.events).toEqual(expect.arrayContaining([
      expect.objectContaining({
        operation: "repack", beforeContents: [],
        afterContents: [expect.objectContaining({ itemId, name: "Boxed goods", qty: "3.5000" })],
      }),
    ]));
    expect((detail.body.events as { sequence: number }[]).map((event) => event.sequence)).toEqual([1, 2]);
    const repackEvent = (detail.body.events as { id: string; operation: string }[]).find((event) => event.operation === "repack")!;
    await expect(t.ownerDb.db.execute(sql`update packing_box_events set reason = 'tampered' where id = ${repackEvent.id}`))
      .rejects.toMatchObject({ cause: { message: expect.stringContaining("append-only") } });
    const [audits] = await t.ownerDb.db.execute<{ count: number }>(sql`
      select count(*)::int as count from audit_log where tenant_id = ${tenantId} and entity = 'packing_box' and entity_id = ${box.id}`);
    expect(audits!.count).toBe(2);

    const after = await stockSnapshot();
    expect(after).toEqual(before);
  });

  it("reopens and repacks a box with reasons while rejecting invalid state transitions", async () => {
    const before = await stockSnapshot();
    const box = await makeBox();
    expect(await stockSnapshot()).toEqual(before);
    expect((await post(owner, `/packing-boxes/${box.id}/reopen`, { reason: "Need to inspect" })).status).toBe(409);
    expect((await post(owner, `/packing-boxes/${box.id}/repack`, { lines: [{ itemId, qty: "2" }] })).status).toBe(200);
    expect(await stockSnapshot()).toEqual(before);
    expect((await patch(owner, `/items/${itemId}`, { name: "Renamed boxed goods" })).status).toBe(200);
    expect((await post(owner, `/packing-boxes/${box.id}/repack`, { lines: [{ itemId, qty: "4" }] })).status).toBe(409);
    expect((await post(owner, `/packing-boxes/${box.id}/reopen`, { reason: "x" })).status).toBe(400);

    const reopened = await post(owner, `/packing-boxes/${box.id}/reopen`, { reason: "Customer requested size change" });
    expect(reopened.status, JSON.stringify(reopened.body)).toBe(200);
    expect(await stockSnapshot()).toEqual(before);
    expect((await post(owner, `/packing-boxes/${box.id}/reopen`, { reason: "Open again" })).status).toBe(409);

    const repacked = await post(owner, `/packing-boxes/${box.id}/repack`, { lines: [{ itemId, qty: "1.25" }] });
    expect(repacked.status).toBe(200);
    expect(await stockSnapshot()).toEqual(before);
    const detail = await get(owner, `/packing-boxes/${box.id}`);
    expect(detail.body).toMatchObject({ status: "packed", lines: [{ itemId, qty: "1.2500" }] });
    expect((detail.body.events as { operation: string; sequence: number }[]).map((event) => [event.operation, event.sequence])).toEqual([
      ["create", 1], ["repack", 2], ["reopen", 3], ["repack", 4],
    ]);
    const reopenedEvent = detail.body.events[2];
    expect(reopenedEvent).toMatchObject({ operation: "reopen", reason: "Customer requested size change" });
    expect(reopenedEvent.beforeContents).toEqual([expect.objectContaining({ itemId, name: "Boxed goods", qty: "2.0000" })]);
    expect(reopenedEvent.afterContents).toEqual([expect.objectContaining({ itemId, name: "Boxed goods", qty: "2.0000" })]);
    expect(detail.body.events[3].beforeContents).toEqual([expect.objectContaining({ itemId, name: "Boxed goods", qty: "2.0000" })]);
    expect(detail.body.events[3].afterContents).toEqual([expect.objectContaining({ itemId, name: "Renamed boxed goods", qty: "1.2500" })]);
  });

  it("rejects empty contents, non-positive quantities, and service items without changing the open box", async () => {
    const box = await makeBox();
    for (const lines of [
      [],
      [{ itemId, qty: "0" }],
      [{ itemId, qty: "-1" }],
      [{ itemId: serviceId, qty: "1" }],
      [{ itemId: foreignItemId, qty: "1" }],
      [{ itemId: companyBItemId, qty: "1" }],
    ]) {
      const invalid = await post(owner, `/packing-boxes/${box.id}/repack`, { lines });
      expect(invalid.status).toBeGreaterThanOrEqual(400);
      expect(invalid.status).toBeLessThan(500);
      const current = await get(owner, `/packing-boxes/${box.id}`);
      expect(current.body).toMatchObject({ status: "open", lines: [] });
      expect(current.body.events).toHaveLength(1);
    }
    expect((await post(owner, `/packing-boxes/${box.id}/repack`, { companyId: companyBId, lines: [{ itemId, qty: "1" }] })).status).toBe(404);
  });

  it("keeps box records and operations isolated to their tenant", async () => {
    const box = await makeBox();
    expect((await get(other, `/packing-boxes/${box.id}`)).status).toBe(404);
    expect((await post(other, `/packing-boxes/${box.id}/reopen`, { reason: "Try to cross tenant" })).status).toBe(404);
  });
});
