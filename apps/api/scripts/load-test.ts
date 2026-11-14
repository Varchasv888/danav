/**
 * Load test against a running API (start it with a high RATE_LIMIT_PER_MINUTE, or every request after
 * the first 600 a minute is a 429):
 *
 *   npm run load-test -w @varchasv/api -- --url http://localhost:4100 --email tester-xxxx@varchasv.test
 *
 * Signs in as a seeded demo owner (npm run demo:seed) and drives the screens people open most, then a
 * burst of invoice creation, which contends on number series and stock. Prints latency and throughput.
 */
import autocannon from "autocannon";

const arg = (name: string, fallback?: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1]! : fallback;
};
const url = arg("url", "http://localhost:4100")!;
const email = arg("email");
const password = arg("password", process.env.DEV_DEMO_PASSWORD);
const seconds = Number(arg("seconds", "10"));
const connections = Number(arg("connections", "20"));
if (!email || !password) throw new Error("Pass --email (a seeded demo owner) and --password or DEV_DEMO_PASSWORD");

const login = await fetch(`${url}/auth/login`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, password, client: "app" }) });
if (!login.ok) throw new Error(`sign-in failed: ${login.status} ${await login.text()}`);
const { token } = (await login.json()) as { token: string };
const headers: Record<string, string> = { authorization: `Bearer ${token}` };
const json = { ...headers, "content-type": "application/json" };
const api = async (path: string) => (await fetch(`${url}${path}`, { headers })).json() as Promise<any>;

const customers = ((await api("/accounts")) as { id: string; groupKey?: string; name: string }[]);
const items = (await api("/items")) as { id: string; kind: string; name: string }[];
const customer =
  customers.find((a) => a.name === "Hotel Panchavati") ??
  customers.find((a) => a.name === "Mumbai Fashion House") ??
  customers.find((a) => a.groupKey === "sundry_debtors");
const stockItem =
  items.find((i) => i.name.startsWith("Milk Rusk")) ??
  items.find((i) => i.name.startsWith("Cotton poplin fabric")) ??
  items.find((i) => i.kind !== "service");
if (!customer || !stockItem) {
  throw new Error("Load-test fixture needs a customer and a non-service item; seed a demo business first.");
}
const today = new Date().toISOString().slice(0, 10);

interface Row { name: string; rps: number; p50: number; p97_5: number; p99: number; errors: number; non2xx: number }
const rows: Row[] = [];
async function hit(name: string, opts: Partial<autocannon.Options> & { path: string }) {
  // One request by hand first, so a broken scenario fails loudly instead of timing error responses.
  const probe = await fetch(`${url}${opts.path}`, { method: opts.method ?? "GET", headers: opts.body ? json : headers, body: opts.body as string | undefined });
  if (!probe.ok) throw new Error(`${name} → ${probe.status} ${await probe.text()}`);
  const { path, ...rest } = opts as Partial<autocannon.Options> & { path: string };
  const r = await autocannon({ connections, duration: seconds, headers: opts.body ? json : headers, ...rest, url: `${url}${path}` } as autocannon.Options);
  rows.push({ name, rps: Math.round(r.requests.average), p50: r.latency.p50, p97_5: r.latency.p97_5, p99: r.latency.p99, errors: r.errors, non2xx: r.non2xx });
  process.stdout.write(`  ${name.padEnd(28)} done\n`);
}

console.log(`Load test: ${connections} connections × ${seconds}s per scenario against ${url}`);
await hit("GET /analytics/dashboard", { path: "/analytics/dashboard" });
await hit("GET /sales-invoices", { path: "/sales-invoices" });
await hit("GET /items", { path: "/items" });
await hit("GET /reports/trial-balance", { path: `/reports/trial-balance?asOf=${today}` });
await hit("GET /reports/receivables", { path: `/reports/receivables?asOf=${today}` });
await hit("GET /reports/stock-summary", { path: `/reports/stock-summary?asOf=${today}` });
await hit("POST /sales-invoices", {
  method: "POST", path: "/sales-invoices", connections: Math.min(connections, 10),
  body: JSON.stringify({ customerId: customer.id, date: today, lines: [{ itemId: stockItem.id, qty: "1", rate: "60" }] }),
});

console.table(rows.map((r) => ({ scenario: r.name, "req/s": r.rps, "p50 ms": r.p50, "p97.5 ms": r.p97_5, "p99 ms": r.p99, errors: r.errors, "non-2xx": r.non2xx })));
