import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { explodeBom, loyaltyEarned, loyaltyRedeemable, planMrp, posBill, rollupCost, settlePayments, type PosPayment } from "../src/index.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const f: any = JSON.parse(readFileSync(fileURLToPath(new URL("../../../spec/fixtures/manufacturing-pos.json", import.meta.url)), "utf8"));

describe("BOM fixtures", () => {
  it.each(f.explode.map((c: { name: string }) => [c.name, c]))("explode: %s", (_n, c: { itemId: string; qty: string; multiLevel: boolean; expect: object }) => {
    expect(explodeBom(f.boms, c.itemId, c.qty, c.multiLevel)).toEqual(c.expect);
  });
  it("rolls up cost through a sub-assembly, with wastage and overhead", () => {
    expect(rollupCost(f.boms, f.rollup.itemId, f.rollup.rates)).toEqual(f.rollup.expect);
  });
  it("refuses a BOM that uses itself", () => {
    expect(() => explodeBom(f.cycle.boms, "a", "1", true)).toThrow(f.cycle.expect);
  });
  it("plans material requirements level by level", () => {
    expect(planMrp(f.mrp.items, f.boms, f.mrp.demands, f.mrp.today)).toEqual(f.mrp.expect);
  });
});

describe("POS fixtures", () => {
  it.each(f.posBills.map((c: { name: string }) => [c.name, c]))("bill: %s", (_n, c: { lines: []; options: object; expect: { lines: object[] } & Record<string, unknown> }) => {
    const b = posBill(c.lines, c.options as never);
    const { lines, ...rest } = c.expect;
    expect(b).toMatchObject(rest);
    expect(b.lines.map((l) => ({ discount: l.discount, taxable: l.taxable, cgst: l.cgst, total: l.total }))).toEqual(lines);
  });
  it.each(f.payments.map((c: { name: string }) => [c.name, c]))("payments: %s", (_n, c: { total: string; payments: PosPayment[]; expect?: object; error?: string }) => {
    if (c.error) expect(() => settlePayments(c.total, c.payments)).toThrow(c.error);
    else expect(settlePayments(c.total, c.payments)).toEqual(c.expect);
  });
  it("loyalty points", () => {
    for (const e of f.loyalty.earned) expect(loyaltyEarned(e.paid, f.loyalty.rule)).toBe(e.expect);
    for (const r of f.loyalty.redeem) expect(loyaltyRedeemable(r.balance, r.bill, f.loyalty.rule)).toEqual(r.expect);
  });
  it("loyalty slabs and the minimum to redeem", () => {
    for (const e of f.loyalty.slabEarned) expect(loyaltyEarned(e.paid, f.loyalty.slabRule)).toBe(e.expect);
    for (const r of f.loyalty.slabRedeem) expect(loyaltyRedeemable(r.balance, r.bill, f.loyalty.slabRule)).toEqual(r.expect);
  });
});
