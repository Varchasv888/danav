import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const style = (code: string, attributes?: Record<string, string>) => post("/styles", {
  code, name: `Style ${code}`, uomId: id.pcs, colorIds: [id.red], sizes: ["M"], saleRate: "900", ...(attributes ? { attributes } : {}),
});

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("attrs")).cookie;
  id.pcs = ((await t.call(c, "GET", "/inventory/setup")).body.uoms as { id: string; code: string }[]).find((u) => u.code === "PCS")!.id;
  id.red = (await post("/colors", { name: "Red" })).body.id;
});
afterAll(() => t.close());

describe("style attributes", () => {
  it("keeps the descriptive values on a style and filters the list by one", async () => {
    const a = await style("KS-1", { fabric: "Cotton", sleeves: "Full", gender: "Men" });
    const b = await style("KS-2", { fabric: "Linen", gender: "Men" });
    expect(a.status).toBe(201);
    expect(a.body.attributes).toEqual({ fabric: "Cotton", sleeves: "Full", gender: "Men" });
    const men = (await t.call(c, "GET", "/styles?attr=gender:Men")).body as { code: string }[];
    expect(men.map((s) => s.code).sort()).toEqual(["KS-1", "KS-2"]);
    const cotton = (await t.call(c, "GET", "/styles?attr=fabric:Cotton")).body as { code: string }[];
    expect(cotton.map((s) => s.code)).toEqual(["KS-1"]);
    id.b = b.body.id;
  });

  it("changes one value, clears another, and refuses a name that is not an attribute", async () => {
    const r = await t.call(c, "PATCH", `/styles/${id.b}`, { attributes: { fabric: "Silk", gender: "" } });
    expect(r.status).toBe(200);
    expect(r.body.attributes).toEqual({ fabric: "Silk" });
    expect((await style("KS-3", { colour: "Red" } as never)).status).toBe(400);
    expect((await t.call(c, "GET", "/styles?attr=nonsense:Men")).status).toBe(400);
  });
});
