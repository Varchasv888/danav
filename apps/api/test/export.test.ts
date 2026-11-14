import { createHash } from "node:crypto";
import { inflateRawSync } from "node:zlib";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;

/** Reads a ZIP from its central directory: name to content, the way any unzip tool would. */
function unzip(buf: Buffer) {
  const end = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  const count = buf.readUInt16LE(end + 10);
  let p = buf.readUInt32LE(end + 16);
  const out = new Map<string, Buffer>();
  for (let i = 0; i < count; i++) {
    const method = buf.readUInt16LE(p + 10), csize = buf.readUInt32LE(p + 20), nlen = buf.readUInt16LE(p + 28), off = buf.readUInt32LE(p + 42);
    const name = buf.toString("utf8", p + 46, p + 46 + nlen);
    const lh = off + 30 + buf.readUInt16LE(off + 26) + buf.readUInt16LE(off + 28);
    const raw = buf.subarray(lh, lh + csize);
    out.set(name, method === 8 ? inflateRawSync(raw) : raw);
    p += 46 + nlen + buf.readUInt16LE(p + 30) + buf.readUInt16LE(p + 32);
  }
  return out;
}

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("exporter")).cookie;
  const groups: { id: string; key: string }[] = (await t.call(c, "GET", "/accounts/groups")).body;
  await t.call(c, "POST", "/accounts", { name: "Export Probe Traders", groupId: groups.find((g) => g.key === "sundry_debtors")!.id, stateCode: "27" });
});
afterAll(() => t.close());

describe("the business's own export", () => {
  it("is a zip with every table as CSV and JSON, a README and a manifest that matches", async () => {
    const res = await t.app.inject({ method: "GET", url: "/export/business.zip", headers: { cookie: c } });
    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toBe("application/zip");
    expect(res.headers["content-disposition"]).toMatch(/attachment; filename="varchasv-export-\d{4}-\d{2}-\d{2}\.zip"/);
    const files = unzip(res.rawPayload);
    expect(files.has("README.txt")).toBe(true);
    expect(files.get("csv/accounts.csv")!.toString("utf8")).toContain("Export Probe Traders");
    const json = JSON.parse(files.get("json/accounts.json")!.toString("utf8")) as { name: string }[];
    expect(json.some((a) => a.name === "Export Probe Traders")).toBe(true);
    const manifest = JSON.parse(files.get("manifest.json")!.toString("utf8")) as { files: { name: string; sha256: string }[] };
    for (const f of manifest.files) expect(createHash("sha256").update(files.get(f.name)!).digest("hex"), f.name).toBe(f.sha256);
  });

  it("leaves out passwords, tokens and integration sessions, and other businesses' data", async () => {
    const other = (await t.signup("exporter-other")).cookie;
    const files = unzip((await t.app.inject({ method: "GET", url: "/export/business.zip", headers: { cookie: other } })).rawPayload);
    const all = [...files.entries()].filter(([n]) => n.endsWith(".json")).map(([, b]) => b.toString("utf8")).join("\n");
    expect(all).not.toContain("Export Probe Traders");
    expect([...files.keys()].some((n) => /(^|\/)(gst_sessions|invitations|sessions|password_resets)\./.test(n))).toBe(false);
    expect(all).not.toMatch(/password_hash|token_hash|token_enc/);
  });

  it("needs the export right", async () => {
    expect((await t.app.inject({ method: "GET", url: "/export/business.zip" })).statusCode).toBe(401);
  });
});
