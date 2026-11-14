#!/usr/bin/env node
// Merges new strings into every catalogue:  node scripts/merge.cjs <keys.json> [namespace-to-follow]
// keys.json maps each language code to a nested object of keys, e.g. { "en": { "items": { "x": "…" } }, "hi": … }.
// New top-level namespaces are placed after the one named (or at the end); existing keys are overwritten.
// Run `npm run check` afterwards: every language must end up with every key.
const fs = require("fs");
const path = require("path");

const [file, after] = process.argv.slice(2);
if (!file) throw new Error("usage: node scripts/merge.cjs <keys.json> [namespace-to-follow]");
const add = JSON.parse(fs.readFileSync(file, "utf8"));
const dir = path.join(__dirname, "..", "messages");

const merge = (base, extra) => {
  for (const [k, v] of Object.entries(extra)) {
    if (v && typeof v === "object" && base[k] && typeof base[k] === "object") merge(base[k], v);
    else base[k] = v;
  }
  return base;
};

for (const [code, keys] of Object.entries(add)) {
  const target = path.join(dir, `${code}.json`);
  const cur = JSON.parse(fs.readFileSync(target, "utf8"));
  const out = {};
  for (const [k, v] of Object.entries(cur)) {
    out[k] = keys[k] ? merge(v, keys[k]) : v;
    if (k === after) for (const [nk, nv] of Object.entries(keys)) if (!(nk in cur)) out[nk] = nv;
  }
  for (const [nk, nv] of Object.entries(keys)) if (!(nk in out)) out[nk] = nv;
  fs.writeFileSync(target, JSON.stringify(out, null, 2) + "\n");
}
console.log("merged", Object.keys(add).join(","));
