#!/usr/bin/env node
// Varchasv print agent: receives receipt bytes (ESC/POS) from the app and sends them to a receipt printer, so the cutter and the cash drawer work.
// No packages needed, only Node 18 or later.  Start it with:  node agent.mjs
//   PORT=9101               the port the app talks to (default 9101)
//   ALLOW_ORIGINS=https://your-app.example.com   extra sites allowed to print (localhost is always allowed)
// A printer is named in Settings > Print > Thermal printer as one of:
//   192.168.1.50:9100        a network printer (raw port 9100)
//   usb:POS-80               a USB printer shared on this Windows computer under the share name POS-80
//   file:/dev/usb/lp0        a device file (Linux)
import http from "node:http";
import net from "node:net";
import { execFile } from "node:child_process";
import { unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const PORT = Number(process.env.PORT ?? 9101);
const EXTRA = (process.env.ALLOW_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const allowed = (o) => !o || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(o) || EXTRA.includes(o);

function toTcp(host, port, buf) {
  return new Promise((resolve, reject) => {
    const s = net.connect({ host, port, timeout: 8000 }, () => s.end(buf));
    s.on("close", () => resolve());
    s.on("timeout", () => { s.destroy(); reject(new Error("The printer did not answer.")); });
    s.on("error", (e) => reject(new Error(`Could not reach the printer: ${e.message}`)));
  });
}

async function send(target, buf) {
  const t = target.trim();
  if (!t) throw new Error("No printer is set. Enter the printer address in Settings.");
  const tcp = t.replace(/^tcp:/i, "").match(/^([\w.-]+):(\d{2,5})$/);
  if (tcp) return toTcp(tcp[1], Number(tcp[2]), buf);
  const usb = t.match(/^(?:usb|windows):(.+)$/i);
  if (usb) {
    const file = join(tmpdir(), `varchasv-${Date.now()}.bin`);
    writeFileSync(file, buf);
    try {
      await new Promise((resolve, reject) => execFile("cmd", ["/c", "copy", "/b", file, `\\localhost\${usb[1]}`], (e, out) => (e ? reject(new Error(`Windows could not print to ${usb[1]}. Share the printer under that name.`)) : resolve(out))));
    } finally { try { unlinkSync(file); } catch { /* already gone */ } }
    return;
  }
  const dev = t.match(/^file:(.+)$/i);
  if (dev) { writeFileSync(dev[1], buf); return; }
  throw new Error("Printer address not understood. Use 192.168.1.50:9100, usb:ShareName or file:/dev/usb/lp0.");
}

http.createServer(async (req, res) => {
  const origin = req.headers.origin;
  const cors = {
    "Access-Control-Allow-Origin": origin ?? "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Private-Network": "true", Vary: "Origin",
  };
  const reply = (code, body) => { res.writeHead(code, { ...cors, "content-type": "application/json" }); res.end(JSON.stringify(body)); };
  if (!allowed(origin)) return reply(403, { error: "This site is not allowed to print here. Add it to ALLOW_ORIGINS." });
  if (req.method === "OPTIONS") { res.writeHead(204, cors); return res.end(); }
  if (req.method === "GET" && req.url === "/health") return reply(200, { ok: true, agent: "varchasv-print-agent" });
  if (req.method === "POST" && req.url === "/print") {
    let body = "";
    for await (const c of req) { body += c; if (body.length > 2_000_000) return reply(413, { error: "Too large." }); }
    try {
      const { target, data } = JSON.parse(body);
      const buf = Buffer.from(String(data), "base64");
      await send(String(target ?? ""), buf);
      return reply(200, { ok: true, bytes: buf.length });
    } catch (e) { return reply(500, { error: e instanceof Error ? e.message : "Printing failed." }); }
  }
  reply(404, { error: "Not found." });
}).listen(PORT, "127.0.0.1", () => console.log(`Varchasv print agent is listening on http://127.0.0.1:${PORT}`));
