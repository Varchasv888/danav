/**
 * Reads the GSTR-2B Excel the portal gives (the "B2B" and "B2B-CDNR" sheets) into the same JSON shape as the portal's JSON download,
 * so one importer on the server serves both. Columns are found by their header text, not their position, and rows without a valid
 * supplier GSTIN are ignored. An invoice that appears on several rows (one per tax rate) is added up. Written from the portal's published
 * layout and not yet run against a real file, so the preview shows what was found before anything is imported.
 */
export interface Read2b {
  json: { data: { gstin: string | null; rtnprd: string | null; docdata: { b2b: unknown[]; cdnr: unknown[] } } };
  invoices: number; notes: number; debitNotes: number; period: string | null; gstin: string | null; notAvailable: number;
}

const GSTIN = /^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z0-9]Z[A-Z0-9]$/;
const key = (s: unknown) => String(s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

function text(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === "object") {
    const o = v as { text?: unknown; result?: unknown; richText?: { text: string }[] };
    if (o.richText) return o.richText.map((r) => r.text).join("");
    if (o.result !== undefined) return text(o.result);
    if (o.text !== undefined) return text(o.text);
    return "";
  }
  return String(v).trim();
}
function amount(v: unknown): number {
  const raw = v instanceof Date ? NaN : typeof v === "object" && v ? Number(text(v)) : Number(String(v ?? "").replace(/,/g, "").trim());
  return Number.isFinite(raw) ? raw : 0;
}
/** dd-mm-yyyy, whatever the sheet held: a real date, dd/mm/yyyy, dd-mm-yyyy or yyyy-mm-dd. */
function ddmmyyyy(v: unknown): string | null {
  if (v instanceof Date) return `${String(v.getUTCDate()).padStart(2, "0")}-${String(v.getUTCMonth() + 1).padStart(2, "0")}-${v.getUTCFullYear()}`;
  const s = text(v);
  let m = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/.exec(s);
  if (m) return `${m[1]!.padStart(2, "0")}-${m[2]!.padStart(2, "0")}-${m[3]}`;
  m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return null;
}

type Totals = { ctin: string; name: string; no: string; dt: string; val: number; txval: number; igst: number; cgst: number; sgst: number; cess: number; itc: boolean; rsn: string; typ?: string };

export async function read2bWorkbook(file: File): Promise<Read2b> {
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(await file.arrayBuffer());

  const sheetOf = (re: RegExp) => wb.worksheets.find((w) => re.test(key(w.name)));
  const invoices = new Map<string, Totals>(), notes = new Map<string, Totals>();
  let debitNotes = 0;

  const readSheet = (ws: import("exceljs").Worksheet | undefined, into: Map<string, Totals>, isNote: boolean) => {
    if (!ws) return;
    let head = 0;
    for (let r = 1; r <= Math.min(ws.rowCount, 20) && !head; r++) {
      // The portal's header has two levels and the supplier columns appear on both; the real one is the row that also names the document number.
      const names = new Set<string>();
      ws.getRow(r).eachCell((c) => { names.add(key(text(c.value))); });
      if (names.has("gstinofsupplier") && names.has(isNote ? "notenumber" : "invoicenumber")) head = r;
    }
    if (!head) return;
    const cols = new Map<string, number>();
    ws.getRow(head).eachCell((c, i) => { const k = key(text(c.value)); if (k && !cols.has(k)) cols.set(k, i); });
    const find = (...names: string[]) => { for (const n of names) for (const [k, i] of cols) if (k.startsWith(n)) return i; return 0; };
    const c = {
      gstin: find("gstinofsupplier"), name: find("tradelegalname", "tradename"), no: find(isNote ? "notenumber" : "invoicenumber"), dt: find(isNote ? "notedate" : "invoicedate"),
      val: find(isNote ? "notevalue" : "invoicevalue"), tx: find("taxablevalue"), ig: find("integratedtax"), cg: find("centraltax"), sg: find("stateuttax"), cs: find("cess"),
      itc: find("itcavailability"), rsn: find("reason"), type: find("notetype"),
    };
    if (!c.gstin || !c.no || !c.dt || !c.tx) throw new Error("layout");
    for (let r = head + 1; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      const ctin = text(row.getCell(c.gstin).value).toUpperCase();
      if (!GSTIN.test(ctin)) continue;
      const isDebit = isNote && !!c.type && /debit/i.test(text(row.getCell(c.type).value));
      const no = text(row.getCell(c.no).value), dt = ddmmyyyy(row.getCell(c.dt).value);
      if (!no || !dt) continue;
      const k = `${ctin}|${no}`;
      if (isDebit && !into.has(k)) debitNotes++;
      const cur = into.get(k) ?? { ctin, name: c.name ? text(row.getCell(c.name).value) : "", no, dt, val: 0, txval: 0, igst: 0, cgst: 0, sgst: 0, cess: 0, itc: true, rsn: "", ...(isDebit ? { typ: "D" } : {}) };
      // The invoice value repeats on every rate row of one invoice, so it is taken once.
      if (!into.has(k) && c.val) cur.val = amount(row.getCell(c.val).value);
      cur.txval += amount(row.getCell(c.tx).value);
      if (c.ig) cur.igst += amount(row.getCell(c.ig).value);
      if (c.cg) cur.cgst += amount(row.getCell(c.cg).value);
      if (c.sg) cur.sgst += amount(row.getCell(c.sg).value);
      if (c.cs) cur.cess += amount(row.getCell(c.cs).value);
      if (c.itc && /^n/i.test(text(row.getCell(c.itc).value))) { cur.itc = false; cur.rsn = c.rsn ? text(row.getCell(c.rsn).value) : cur.rsn; }
      into.set(k, cur);
    }
  };

  const b2b = sheetOf(/^b2b$/), cdnr = sheetOf(/^b2bcdnr$/);
  if (!b2b && !cdnr) throw new Error("layout");
  try { readSheet(b2b, invoices, false); readSheet(cdnr, notes, true); } catch { throw new Error("layout"); }
  if (!invoices.size && !notes.size) throw new Error("empty");

  const round = (n: number) => Math.round(n * 100) / 100;
  const group = (m: Map<string, Totals>, noteKey: boolean) => {
    const by = new Map<string, { ctin: string; trdnm: string; list: Record<string, unknown>[] }>();
    for (const d of m.values()) {
      const g = by.get(d.ctin) ?? { ctin: d.ctin, trdnm: d.name, list: [] };
      g.list.push({ [noteKey ? "ntnum" : "inum"]: d.no, dt: d.dt, val: round(d.val), txval: round(d.txval), igst: round(d.igst), cgst: round(d.cgst), sgst: round(d.sgst), cess: round(d.cess), itcavl: d.itc ? "Y" : "N", ...(d.typ ? { typ: d.typ } : {}), ...(d.rsn ? { rsn: d.rsn } : {}) });
      by.set(d.ctin, g);
    }
    return [...by.values()].map((g) => ({ ctin: g.ctin, trdnm: g.trdnm, [noteKey ? "nt" : "inv"]: g.list }));
  };

  const fm = /(0[1-9]|1[0-2])(20\d{2})/.exec(file.name) ?? /(20\d{2})[-_]?(0[1-9]|1[0-2])/.exec(file.name);
  const period = fm ? (fm[1]!.length === 2 ? `${fm[1]}${fm[2]}` : `${fm[2]}${fm[1]}`) : null;
  const gstin = file.name.toUpperCase().match(/\d{2}[A-Z]{5}\d{4}[A-Z][A-Z0-9]Z[A-Z0-9]/)?.[0] ?? null;
  const all = [...invoices.values(), ...notes.values()];
  return {
    json: { data: { gstin, rtnprd: period, docdata: { b2b: group(invoices, false), cdnr: group(notes, true) } } },
    invoices: invoices.size, notes: notes.size, debitNotes, period, gstin, notAvailable: all.filter((d) => !d.itc).length,
  };
}
