import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;

beforeAll(async () => { t = await testApp(); c = (await t.signup("printbytes")).cookie as string; });
afterAll(() => t.close());

describe("receipt printer bytes", () => {
  it("returns a test page as base64 printer commands with the printer and agent chosen in Settings", async () => {
    await t.call(c, "PUT", "/settings/preferences", { "thermal.printerTarget": "192.168.1.50:9100", "thermal.autoCut": true, "thermal.cashDrawer": true, "thermal.copies": "2" });
    const r = await t.call(c, "GET", "/settings/print-test");
    expect(r.status, JSON.stringify(r.body)).toBe(200);
    const b = Buffer.from(r.body.base64, "base64");
    expect(r.body.target).toBe("192.168.1.50:9100");
    expect(r.body.agentUrl).toBe("http://127.0.0.1:9101");
    expect([...b.slice(0, 3)]).toEqual([0x1b, 0x70, 0x00]);
    expect(b.toString("latin1").split("\x1d\x56\x41\x03").length - 1).toBe(2);
    expect(b.toString("latin1")).toContain("Printer test");
  });

  it("keeps the printer settings it was given and refuses a bad value", async () => {
    expect((await t.call(c, "PUT", "/settings/preferences", { "thermal.printType": "direct", "print.defaultPrinter": "thermal", "names.invoice": "Sale" })).status).toBe(200);
    expect((await t.call(c, "PUT", "/settings/preferences", { "thermal.printType": "carrier-pigeon" })).status).toBe(400);
    expect((await t.call(c, "PUT", "/settings/preferences", { "names.invoice": "x".repeat(41) })).status).toBe(400);
  });
});
