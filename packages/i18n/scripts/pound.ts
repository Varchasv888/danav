/**
 * ICU's "#" inside a plural branch is formatted with the locale's own digits (Marathi and Bengali
 * default to "१२" / "১২"), and Flutter's gen-l10n prints it literally. The catalogues therefore name
 * the argument instead: "{count, plural, one {# item} …}" is written "{count, plural, one {{count} item} …}".
 * `replacePound` does that rewrite; `hasPound` lets the check reject a "#" that slips back in.
 */

/** Index of the "}" matching the "{" at `open`. */
function matching(s: string, open: number) {
  let depth = 0;
  for (let i = open; i < s.length; i++) {
    if (s[i] === "{") depth++;
    else if (s[i] === "}" && --depth === 0) return i;
  }
  throw new Error(`unbalanced braces in: ${s}`);
}

/** Rewrites "#" in plural branches to "{arg}"; `arg` is the innermost enclosing plural argument. */
export function replacePound(s: string, arg: string | null = null): string {
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const c = s[i]!;
    if (c === "#" && arg) { out += `{${arg}}`; continue; }
    if (c !== "{") { out += c; continue; }
    const end = matching(s, i);
    const inner = s.slice(i + 1, end);
    const m = /^\s*(\w+)\s*,\s*(plural|selectordinal|select)\s*,/.exec(inner);
    if (!m) { out += s.slice(i, end + 1); i = end; continue; }
    // Branches: "key {text}" pairs after "arg, kind,"; a select keeps the outer plural's argument.
    const branchArg = m[2] === "select" ? arg : m[1]!;
    let rest = inner.slice(m[0].length);
    let body = "";
    while (rest.length) {
      const b = rest.indexOf("{");
      if (b < 0) { body += rest; break; }
      const e = matching(rest, b);
      body += rest.slice(0, b + 1) + replacePound(rest.slice(b + 1, e), branchArg) + "}";
      rest = rest.slice(e + 1);
    }
    out += `{${m[0]}${body}}`;
    i = end;
  }
  return out;
}

export const hasPound = (s: string) => replacePound(s) !== s;
