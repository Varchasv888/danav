#!/usr/bin/env node
// English-first merge:  node scripts/merge-en.cjs <keys.json> [namespace-to-follow]
// keys.json has only an "en" object. The English text is added to en.json, and copied into every other language
// where the key does not exist yet, as a placeholder so the app never shows a missing key. The copied keys are
// listed in messages/NEEDS-TRANSLATION.txt (one dotted key per line) so they can be translated later.
const fs = require("fs");
const path = require("path");

const [file, after] = process.argv.slice(2);
if (!file) throw new Error("usage: node scripts/merge-en.cjs <keys.json> [namespace-to-follow]");
const en = JSON.parse(fs.readFileSync(file, "utf8")).en;
const dir = path.join(__dirname, "..", "messages");
const LANGS = ["en", "hi", "mr", "gu", "bn", "as", "ta", "te", "kn", "ml", "pa", "or"];
const pending = [];

const flat = (o, p = "") => Object.entries(o).flatMap(([k, v]) => (v && typeof v === "object" ? flat(v, `${p}${k}.`) : [`${p}${k}`]));
const merge = (base, extra, overwrite, p = "") => {
  for (const [k, v] of Object.entries(extra)) {
    if (v && typeof v === "object") { if (!base[k] || typeof base[k] !== "object") base[k] = {}; merge(base[k], v, overwrite, `${p}${k}.`); }
    else if (overwrite || !(k in base)) { base[k] = v; if (!overwrite) pending.push(`${p}${k}`); }
  }
  return base;
};

for (const code of LANGS) {
  const target = path.join(dir, `${code}.json`);
  const cur = JSON.parse(fs.readFileSync(target, "utf8"));
  const out = {};
  for (const [k, v] of Object.entries(cur)) {
    out[k] = en[k] ? merge(v, en[k], code === "en", `${k}.`) : v;
    if (k === after) for (const [nk, nv] of Object.entries(en)) if (!(nk in cur)) { out[nk] = nv; if (code !== "en") pending.push(...flat({ [nk]: nv })); }
  }
  for (const [nk, nv] of Object.entries(en)) if (!(nk in out)) { out[nk] = nv; if (code !== "en") pending.push(...flat({ [nk]: nv })); }
  fs.writeFileSync(target, JSON.stringify(out, null, 2) + "\n");
}
const list = path.join(dir, "NEEDS-TRANSLATION.txt");
const have = new Set(fs.existsSync(list) ? fs.readFileSync(list, "utf8").split("\n").filter(Boolean) : []);
for (const k of pending) have.add(k);
fs.writeFileSync(list, [...have].sort().join("\n") + "\n");
console.log("merged English; placeholders for", new Set(pending).size, "keys");
