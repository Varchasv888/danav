// Run with:  node --test tools/print-agent
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import net from "node:net";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";

let agent, fake, received = Buffer.alloc(0), fakePort;
const PORT = 19101;

before(async () => {
  fake = net.createServer((s) => s.on("data", (d) => { received = Buffer.concat([received, d]); })).listen(0, "127.0.0.1");
  await new Promise((r) => fake.on("listening", r));
  fakePort = fake.address().port;
  agent = spawn(process.execPath, [fileURLToPath(new URL("./agent.mjs", import.meta.url))], { env: { ...process.env, PORT: String(PORT) } });
  await new Promise((r) => agent.stdout.once("data", r));
});
after(() => { agent.kill(); fake.close(); });

const post = (body, origin) => fetch(`http://127.0.0.1:${PORT}/print`, { method: "POST", headers: { "content-type": "application/json", ...(origin ? { origin } : {}) }, body: JSON.stringify(body) });

test("passes the bytes it is given to a network printer", async () => {
  const bytes = Buffer.from([0x1b, 0x40, 0x48, 0x69, 0x0a, 0x1d, 0x56, 0x41, 0x03]);
  const res = await post({ target: `127.0.0.1:${fakePort}`, data: bytes.toString("base64") }, "http://localhost:3100");
  assert.equal(res.status, 200);
  await new Promise((r) => setTimeout(r, 100));
  assert.deepEqual(received, bytes);
});

test("says so when the printer cannot be reached or the address is not understood", async () => {
  const a = await post({ target: "127.0.0.1:1", data: "AA==" });
  assert.equal(a.status, 500);
  const b = await post({ target: "nonsense", data: "AA==" });
  assert.match((await b.json()).error, /not understood/);
  const c = await post({ target: "", data: "AA==" });
  assert.match((await c.json()).error, /No printer/);
});

test("refuses a site that was not allowed, answers the browser's pre-check and reports it is alive", async () => {
  assert.equal((await post({ target: "x", data: "AA==" }, "https://evil.example")).status, 403);
  const pre = await fetch(`http://127.0.0.1:${PORT}/print`, { method: "OPTIONS", headers: { origin: "http://localhost:3100" } });
  assert.equal(pre.status, 204);
  assert.equal(pre.headers.get("access-control-allow-private-network"), "true");
  assert.equal((await (await fetch(`http://127.0.0.1:${PORT}/health`)).json()).ok, true);
});
