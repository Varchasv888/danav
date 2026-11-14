import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { testApp } from "./helpers.js";

let t: Awaited<ReturnType<typeof testApp>>;
let c: string;
const id: Record<string, string> = {};

const get = async (url: string) => (await t.call(c, "GET", url)).body;
const post = (url: string, body: unknown) => t.call(c, "POST", url, body);
const review = (over: Record<string, unknown> = {}) => post(`/employees/${id.emp}/reviews`, { period: "2026-H1", reviewedOn: "2026-07-05", rating: 4, strengths: "Customer handling", ...over });

beforeAll(async () => {
  t = await testApp();
  c = (await t.signup("reviews")).cookie;
  id.emp = (await post("/employees", { name: "Reviewed Person", gender: "female", joinedOn: "2026-01-01", workState: "27", components: [{ code: "BASIC", name: "Basic", monthly: "15000", pfWage: true }] })).body.id;
});
afterAll(() => t.close());

describe("performance reviews", () => {
  it("keeps a history, newest first, with the average rating", async () => {
    expect((await review()).status).toBe(201);
    id.second = (await review({ period: "2026-H2", reviewedOn: "2026-12-30", rating: 5, improvements: "Stock counting" })).body.id;
    const r = await get(`/employees/${id.emp}/reviews`);
    expect(r.average).toBe("4.5");
    expect(r.reviews.map((x: { period: string }) => x.period)).toEqual(["2026-H2", "2026-H1"]);
    expect(r.reviews[0]).toMatchObject({ rating: 5, improvements: "Stock counting" });
  });

  it("refuses a rating outside 1 to 5 and a review for nobody", async () => {
    expect((await review({ rating: 6 })).status).toBe(400);
    expect((await review({ rating: 0 })).status).toBe(400);
    expect((await t.call(c, "POST", `/employees/${crypto.randomUUID()}/reviews`, { period: "x", reviewedOn: "2026-07-05", rating: 3 })).status).toBe(404);
  });

  it("deletes a review and keeps businesses apart", async () => {
    const other = (await t.signup("reviews-other")).cookie;
    expect((await t.call(other, "DELETE", `/employees/${id.emp}/reviews/${id.second}`)).status).toBe(404);
    expect((await t.call(c, "DELETE", `/employees/${id.emp}/reviews/${id.second}`)).status).toBe(200);
    const r = await get(`/employees/${id.emp}/reviews`);
    expect(r.average).toBe("4.0");
    expect(r.reviews).toHaveLength(1);
  });
});
