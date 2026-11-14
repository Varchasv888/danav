import { readFileSync } from "node:fs";
import { READY_LOCALES } from "../locales.js";
import { hasPound } from "./pound.js";

/** Fails if any shipped language is missing a key, has an extra key, or drops an ICU placeholder. */
type Tree = { [k: string]: string | Tree };

const load = (code: string): Tree => JSON.parse(readFileSync(new URL(`../messages/${code}.json`, import.meta.url), "utf8"));

function flatten(t: Tree, prefix = ""): Map<string, string> {
  const out = new Map<string, string>();
  for (const [k, v] of Object.entries(t)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") out.set(key, v);
    else for (const [kk, vv] of flatten(v, key)) out.set(kk, vv);
  }
  return out;
}

/** Argument names at the top level of an ICU message ({name} or {count, plural, …}), not plural branch text. */
function placeholders(s: string) {
  const names: string[] = [];
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "{") {
      if (depth === 0) {
        const m = /^\{(\w+)\s*[,}]/.exec(s.slice(i));
        if (m) names.push(m[1]!);
      }
      depth++;
    } else if (s[i] === "}") depth--;
  }
  return names.sort().join(",");
}

const base = flatten(load("en"));
// Placeholders must be lower-camel identifiers ({name}); an upper-case token like {FY} is usually a
// literal that ICU would misread (both next-intl and Flutter gen-l10n parse ICU). Plural branches
// such as {Everything is uploaded} contain spaces, so they don't match.
for (const [k, v] of base) {
  const unquoted = v.replace(/'\{[A-Z][A-Z0-9:]*\}'/g, "");
  if (/\{[A-Z][A-Z0-9:]*\}/.test(unquoted)) { console.error("en: literal-looking braces in " + k); process.exitCode = 1; }
}
let problems = 0;
// "#" in a plural branch shows native digits on the web and a literal "#" in Flutter; name the argument.
for (const code of READY_LOCALES) for (const [k, v] of flatten(load(code))) if (hasPound(v)) { console.error(`${code}: use {arg} instead of # in ${k}`); problems++; }
for (const code of READY_LOCALES.filter((c) => c !== "en")) {
  const other = flatten(load(code));
  for (const [k, v] of base) {
    const t = other.get(k);
    if (t === undefined) { console.error(`${code}: missing ${k}`); problems++; }
    else if (placeholders(t) !== placeholders(v)) { console.error(`${code}: placeholders differ in ${k}`); problems++; }
  }
  for (const k of other.keys()) if (!base.has(k)) { console.error(`${code}: extra key ${k}`); problems++; }
}
if (problems) {
  console.error(`${problems} i18n problem(s)`);
  process.exit(1);
}
console.log(`i18n ok: ${base.size} keys × ${READY_LOCALES.length} languages`);
