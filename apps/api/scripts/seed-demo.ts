/**
 * Creates a complete demo business for hands-on testing, through the real API (every rule, posting and
 * permission check runs exactly as it does for a user):
 *
 *   npm run demo:seed                                   # a fresh business with a random tester email
 *   npm run demo:seed -- --email asha@example.test --business "Asha Garments"
 *   npm run demo:seed -- --url https://varchasv-api.vercel.app   # through a deployed API, over HTTPS
 *   npm run demo:seed -- --years 0                      # only the current year (quicker)
 *
 * The business is a garment maker and wholesaler in Bhiwandi with a retail showroom in Dadar, Mumbai: it
 * buys fabric and trims, sends rayon out for embroidery, cuts and stitches shirts, kurtas and trousers in
 * colours and sizes, sells them wholesale on GST invoices (some through a broker, some on approval) and
 * over the showroom counter with offers, vouchers and exchanges, and has staff on payroll. Its books begin
 * on 1 April 2024 (--years 2, the default) and every month to September 2026 has trading, production,
 * payroll and expenses, so year-on-year reports, ageing and the dashboard have real history. The newest
 * months carry the showcase work (offers, alterations, tailoring, consignment) and work left open.
 *
 * Everyone it creates signs in with --password, or DEV_DEMO_PASSWORD from .env / .env.example.
 * Without --url it runs the API in-process, so the database must be up and migrated
 * (npm run db:up && npm run db:migrate). With --url the deployed API does the work next to its database.
 */
import { existsSync, readFileSync } from "node:fs";
import { crc32, deflateSync } from "node:zlib";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const fromEnvFiles = (key: string) => {
  for (const f of [".env", ".env.example"]) {
    const p = resolve(root, f);
    if (!existsSync(p)) continue;
    const m = readFileSync(p, "utf8").match(new RegExp(`^${key}=(.*)$`, "m"));
    if (m?.[1]?.trim()) return m[1].trim();
  }
  return undefined;
};

const suffix = Math.random().toString(36).slice(2, 6);
const email = arg("email") ?? `tester-${suffix}@varchasv.test`;
const password = arg("password") ?? process.env.DEV_DEMO_PASSWORD ?? fromEnvFiles("DEV_DEMO_PASSWORD");
const business = arg("business") ?? "Shree Ganesh Textiles";
if (!password || password.length < 8) throw new Error("Pass --password (8+ characters) or set DEV_DEMO_PASSWORD in .env");

interface Reply { status: number; body: string; session?: string }
type Send = (method: string, url: string, payload: unknown, cookie: string) => Promise<Reply>;

/** Requests go to a deployed API over HTTPS (--url), or to the API built in-process against the database. */
const remote = arg("url")?.replace(/\/$/, "");
let send: Send;
let shutdown = async () => {};
if (remote) {
  send = async (method, url, payload, cookie) => {
    const res = await fetch(`${remote}${url}`, {
      method,
      headers: { ...(cookie ? { cookie } : {}), ...(payload !== undefined ? { "content-type": "application/json" } : {}) },
      body: payload !== undefined ? JSON.stringify(payload) : undefined,
    });
    const session = res.headers.getSetCookie().find((c) => c.startsWith("vsid="))?.split(";")[0];
    return { status: res.status, body: await res.text(), session };
  };
} else {
  const [{ createDb }, { buildApp }, { LogMailer }] = await Promise.all([import("@varchasv/db"), import("../src/app.js"), import("../src/lib/mailer.js")]);
  const dbUrl = process.env.APP_DATABASE_URL || process.env.DATABASE_URL || "postgres://varchasv_app:varchasv_app_dev@localhost:5433/varchasv";
  const conn = createDb(dbUrl, { max: 4 });
  const app = await buildApp({ db: conn.db, logger: false, rateLimits: false, mailer: new LogMailer(() => {}) });
  send = async (method, url, payload, cookie) => {
    const res = await app.inject({ method: method as "GET", url, headers: cookie ? { cookie } : {}, payload: payload as object });
    const c = res.cookies.find((x) => x.name === "vsid");
    return { status: res.statusCode, body: res.body, session: c ? `vsid=${c.value}` : undefined };
  };
  shutdown = async () => {
    await app.close();
    await conn.close();
  };
}

/** The owner's session, set by the sign-up call. */
let cookie = "";
async function call<T = any>(method: string, url: string, payload?: unknown, signedIn = true): Promise<T> {
  const res = await send(method, url, payload, signedIn ? cookie : "");
  const body = res.body ? JSON.parse(res.body) : undefined;
  if (res.status >= 400) throw new Error(`${method} ${url} → ${res.status} ${JSON.stringify(body)}`);
  return body as T;
}
const get = <T = any>(url: string) => call<T>("GET", url);
const post = <T = any>(url: string, body: unknown = {}) => call<T>("POST", url, body);
const put = <T = any>(url: string, body: unknown) => call<T>("PUT", url, body);

// Deterministic "randomness", so every demo business looks alike.
let s = 42;
const rnd = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
const pick = <T>(xs: T[]) => xs[Math.floor(rnd() * xs.length)]!;
const between = (lo: number, hi: number) => Math.round(lo + rnd() * (hi - lo));
const day = (month: number, d: number) => `2026-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const step = (label: string) => process.stdout.write(`  · ${label}\n`);

/** A plain PNG in the garment's colour with a lighter yoke band, so catalogue tiles have a picture. */
function swatchPng(hex: string, width: number, height: number) {
  const rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const light = rgb.map((c) => Math.round(c + (255 - c) * 0.25));
  const raw = Buffer.alloc((width * 3 + 1) * height);
  for (let y = 0; y < height; y++) {
    const c = y > height * 0.18 && y < height * 0.26 ? light : rgb;
    for (let x = 0; x < width; x++) raw.set(c, y * (width * 3 + 1) + 1 + x * 3);
  }
  const chunk = (type: string, data: Buffer) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body));
    return Buffer.concat([len, body, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // truecolour
  return Buffer.concat([Buffer.from("89504e470d0a1a0a", "hex"), chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]).toString("base64");
}

// The books begin --years financial years before FY 2026-27; trading runs every month up to September 2026.
const years = Number(arg("years") ?? 2);
if (!Number.isInteger(years) || years < 0 || years > 2) throw new Error("--years is 0 to 2 (books can begin from FY 2024-25)");
const booksFrom = `${2026 - years}-04-01`;
const months: string[] = [];
for (const d = new Date(`${booksFrom}T00:00:00Z`); d < new Date("2026-10-01T00:00:00Z"); d.setUTCMonth(d.getUTCMonth() + 1)) months.push(d.toISOString().slice(0, 7));
const on = (ym: string, d: number) => `${ym}-${String(d).padStart(2, "0")}`;
const nextMonth = (ym: string) => new Date(Date.UTC(Number(ym.slice(0, 4)), Number(ym.slice(5, 7)), 1)).toISOString().slice(0, 7);
const lastDayOf = (ym: string) => new Date(Date.UTC(Number(ym.slice(0, 4)), Number(ym.slice(5, 7)), 0)).toISOString().slice(0, 10);
/** Prices rise about 4% a financial year, so older years trade a little cheaper. */
const fyOf = (ym: string) => (Number(ym.slice(5, 7)) >= 4 ? Number(ym.slice(0, 4)) : Number(ym.slice(0, 4)) - 1);
const priced = (rate: string | number, ym: string) => (Number(rate) * (1 - 0.04 * (2026 - fyOf(ym)))).toFixed(2);
/** August to November is the festive and wedding season: more orders, and kurtas move. */
const isFestive = (ym: string) => ["08", "09", "10", "11"].includes(ym.slice(5, 7));

try {
  console.log(`Creating demo business "${business}"…`);
  const firm = { businessName: business, stateCode: "27", gstin: "27AAPFU0939F1ZV", industry: "apparel", booksFrom };
  const signup = await send("POST", "/auth/signup", { name: "Asha Verma", email, password, ...firm }, "");
  if (signup.status === 409) {
    // The login already exists (an earlier demo): sign in and add this business to it.
    const login = await send("POST", "/auth/login", { email, password }, "");
    if (login.status !== 200 || !login.session) throw new Error(`sign-in failed: ${login.status} ${login.body}`);
    cookie = login.session;
    await post("/tenants", firm);
  } else {
    if ((signup.status !== 201 && signup.status !== 200) || !signup.session) throw new Error(`sign-up failed: ${signup.status} ${signup.body}`);
    cookie = signup.session;
  }

  // ---- company, accounts, parties ----------------------------------------------------------------------
  step("company, bank, customers, suppliers and agent");
  const [company] = await get("/companies");
  await call("PATCH", `/companies/${company.id}`, { legalName: `${business} Private Limited`, pan: "AAPFU0939F" });
  await call("PATCH", `/branches/${company.branches[0].id}`, { address: { line1: "Gala 7, Kalher Textile Park, Bhiwandi", city: "Thane", pincode: "421302" } });
  const groups: { id: string; key: string }[] = await get("/accounts/groups");
  const group = (k: string) => groups.find((g) => g.key === k)!.id;
  const acc: Record<string, string> = {};
  const account = async (key: string, body: object) => (acc[key] = (await post("/accounts", body)).id);
  await account("hdfc", { name: "HDFC Bank Current A/c", groupId: group("bank_accounts"), openingBalance: "850000" });
  // The money in the bank came from the owner, so the opening books balance (the Integrity page checks this).
  const capital = ((await get("/accounts")) as { id: string; key: string | null }[]).find((x) => x.key === "owners_capital");
  if (capital) await call("PATCH", `/accounts/${capital.id}`, { openingBalance: "-850000" });
  // A broker who brings in the up-country retailers, paid 2% on what they pay.
  await account("broker", { name: "Ramesh Textile Brokers", groupId: group("sundry_creditors"), stateCode: "27", isAgent: true, commissionPct: "2" });
  const wholesaleList = (await post("/price-lists", { name: "Wholesale", discountPct: "10" })).id;
  const customers = [
    { key: "mfh", name: "Mumbai Fashion House", phone: "9820012345", gstin: "27AABCU9603R1ZN", city: "Mumbai", pincode: "400002", creditDays: 30, creditLimit: "600000", priceListId: wholesaleList },
    { key: "surat", name: "Surat Saree Kendra", phone: "9824012345", gstin: "24AAACS1234F1ZY", city: "Surat", pincode: "395003", creditDays: 45, creditLimit: "400000", priceListId: wholesaleList },
    { key: "blr", name: "Bengaluru Trends", phone: "9845012345", gstin: "29AAGCB7383J1Z4", city: "Bengaluru", pincode: "560009", creditDays: 45, creditLimit: "500000" },
    { key: "kolhapur", name: "Kolhapur Kapda Bazaar", phone: "9850012345", stateCode: "27", city: "Kolhapur", pincode: "416002", creditDays: 30, creditLimit: "150000", creditControl: "block", agentId: acc.broker, interestRate: "18" },
    { key: "nashik", name: "Nashik Readymade Stores", stateCode: "27", city: "Nashik", pincode: "422001", creditDays: 21, agentId: acc.broker },
    { key: "school", name: "St. Mary's High School", stateCode: "27", city: "Thane", pincode: "400601", creditDays: 15 },
    // Before the counter software, the showroom's takings were entered as one bill a month.
    { key: "walkin", name: "Dadar showroom walk-in customers", stateCode: "27", city: "Mumbai", pincode: "400014" },
  ];
  for (const c of customers) {
    const { key, city, pincode, ...rest } = c;
    await account(key, { ...rest, groupId: group("sundry_debtors"), address: { line1: "Main Market Road", city, pincode } });
  }
  await account("arvind", { name: "Arvind Fabrics", groupId: group("sundry_creditors"), gstin: "24AABCA1234B1ZN", stateCode: "24" });
  await account("weaving", { name: "Bhiwandi Weaving Mills", groupId: group("sundry_creditors"), stateCode: "27" });
  await account("trims", { name: "Sai Trims and Buttons", groupId: group("sundry_creditors"), stateCode: "27" });
  await account("packing", { name: "Shubh Packaging", groupId: group("sundry_creditors"), stateCode: "27" });
  await account("raju", { name: "Raju Embroidery Works", groupId: group("sundry_creditors"), stateCode: "27" });
  await account("croma", { name: "Sai Computers", groupId: group("sundry_creditors"), gstin: "27AAECS5678K1ZP" });
  for (const a of (await get("/accounts")) as { id: string; key: string | null }[]) if (a.key && !acc[a.key]) acc[a.key] = a.id;

  // ---- materials, styles and opening stock -------------------------------------------------------------
  step("fabrics, trims, styles in colours and sizes, opening stock");
  const setup = await get("/inventory/setup");
  const uom = (code: string) => setup.uoms.find((u: { code: string }) => u.code === code).id;
  const main = setup.warehouses[0].id;
  const showroom = (await post("/warehouses", { name: "Dadar showroom" })).id;
  const it: Record<string, string> = {};
  const item = async (key: string, body: object) => (it[key] = (await post("/items", body)).id);
  await item("poplin", { name: "Cotton poplin fabric 58\"", nameHi: "कॉटन पॉपलिन कपड़ा", hsn: "5208", gstRate: "5", uomId: uom("MTR"), purchaseRate: "118", saleRate: "180", reorderLevel: "800", reorderQty: "2000", leadTimeDays: 7 });
  await item("rayon", { name: "Rayon print fabric 44\"", nameHi: "रेयॉन प्रिंट कपड़ा", hsn: "5408", gstRate: "5", uomId: uom("MTR"), purchaseRate: "92", reorderLevel: "600", reorderQty: "1500", leadTimeDays: 5 });
  await item("embroidered", { name: "Embroidered rayon fabric", nameHi: "कढ़ाई वाला रेयॉन", hsn: "5810", gstRate: "5", uomId: uom("MTR"), purchaseRate: "135" });
  await item("twill", { name: "Polyviscose twill fabric", nameHi: "पॉलीविस्कोस ट्विल", hsn: "5515", gstRate: "5", uomId: uom("MTR"), purchaseRate: "165", reorderLevel: "400", reorderQty: "1000", leadTimeDays: 7 });
  await item("buttons", { name: "Shirt buttons (pack of 144)", hsn: "9606", gstRate: "18", uomId: uom("PAC"), purchaseRate: "85", reorderLevel: "40", reorderQty: "100" });
  await item("thread", { name: "Polyester thread cone 5000 m", hsn: "5401", gstRate: "12", uomId: uom("NOS"), purchaseRate: "95", reorderLevel: "60", reorderQty: "200" });
  await item("labels", { name: "Woven brand labels", hsn: "5807", gstRate: "12", uomId: uom("NOS"), purchaseRate: "1.2", reorderLevel: "3000", reorderQty: "10000" });
  await item("polybag", { name: "Poly bag with print", hsn: "3923", gstRate: "18", uomId: uom("NOS"), purchaseRate: "2.5", reorderLevel: "2000", reorderQty: "10000" });
  await item("stitching", { name: "Uniform stitching (customer fabric)", kind: "service", hsn: "998821", gstRate: "5", uomId: uom("OTH"), saleRate: "250" });
  await item("freight", { name: "Freight charges", kind: "service", hsn: "996511", gstRate: "18", uomId: uom("OTH"), saleRate: "1500" });

  const scales: { id: string; name: string }[] = await get("/size-scales");
  const garments = scales.find((x) => x.name.startsWith("Garments"))!.id;
  const waist = scales.find((x) => x.name.startsWith("Waist"))!.id;
  const colors: { id: string; name: string }[] = await get("/colors");
  const color = (name: string) => colors.find((x) => x.name === name)!.id;
  type Variant = { id: string; color: string; size: string; saleRate: string };
  const style = async (body: object) => (await post("/styles", { uomId: uom("PCS"), gstSlab: "apparel", ...body })).variants as Variant[];
  const shirts = await style({
    code: "SH-101", name: "Cotton Formal Shirt", nameHi: "कॉटन फ़ॉर्मल शर्ट", brand: "Ganesh Classic", category: "Shirts", season: "Core", hsn: "6205",
    purchaseRate: "380", saleRate: "899", mrp: "1299", sizeScaleId: garments, colorIds: [color("White"), color("Sky blue"), color("Navy")], sizes: ["S", "M", "L", "XL", "XXL"],
    sizePrices: { XXL: { saleRate: "949", mrp: "1399" } },
  });
  const kurtas = await style({
    code: "KT-201", name: "Embroidered Rayon Kurta", nameHi: "कढ़ाईदार रेयॉन कुर्ता", brand: "Anvi", category: "Kurtas", season: "Festive 2026", collection: "Diwali", hsn: "6211",
    purchaseRate: "520", saleRate: "1199", mrp: "1599", sizeScaleId: garments, colorIds: [color("Maroon"), color("Mustard"), color("Green")], sizes: ["M", "L", "XL", "XXL"],
  });
  const trousers = await style({
    code: "TR-301", name: "Formal Trousers", nameHi: "फ़ॉर्मल पतलून", brand: "Ganesh Classic", category: "Trousers", season: "Core", hsn: "6203",
    purchaseRate: "540", saleRate: "1099", mrp: "1499", sizeScaleId: waist, colorIds: [color("Black"), color("Grey"), color("Navy")], sizes: ["30", "32", "34", "36", "38"],
  });
  const all = [...shirts, ...kurtas, ...trousers];
  const v = (list: Variant[], c: string, size: string) => list.find((x) => x.color === c && x.size === size)!;
  // Pieces of each garment in the main store, so the history never sells what has not been made yet.
  const onHand = new Map<string, number>();
  const made: Record<string, { id: string; qty: number }[]> = {};

  await post("/stock-journals", {
    kind: "opening", date: booksFrom, narration: "Opening stock",
    lines: [
      { itemId: it.poplin, warehouseId: main, qty: "3000", rate: "115" },
      { itemId: it.rayon, warehouseId: main, qty: "1800", rate: "90" },
      { itemId: it.twill, warehouseId: main, qty: "1500", rate: "160" },
      { itemId: it.buttons, warehouseId: main, qty: "150", rate: "82" },
      { itemId: it.thread, warehouseId: main, qty: "300", rate: "92" },
      { itemId: it.labels, warehouseId: main, qty: "15000", rate: "1.1" },
      { itemId: it.polybag, warehouseId: main, qty: "12000", rate: "2.4" },
      ...all.map((x) => {
        const qty = between(40, 90);
        onHand.set(x.id, qty);
        return { itemId: x.id, warehouseId: main, qty: String(qty), rate: shirts.includes(x) ? "380" : kurtas.includes(x) ? "520" : "540" };
      }),
    ],
  });

  // ---- purchasing --------------------------------------------------------------------------------------
  step("fabric and trims purchases");
  const buys: [string, string, string, string][] = [
    ["arvind", "poplin", "620", "118"], ["arvind", "rayon", "700", "92"], ["weaving", "twill", "420", "165"], ["trims", "buttons", "20", "85"],
    ["trims", "thread", "16", "95"], ["trims", "labels", "800", "1.2"], ["packing", "polybag", "800", "2.5"],
  ];
  let billNo = 300;
  const billed: Record<string, number> = {};
  for (const ym of months) {
    // Fabric is bought before the month's cutting starts.
    for (const [sup, itemKey, qty, rate] of buys) {
      const bill = await post("/purchase-bills", {
        supplierId: acc[sup], date: on(ym, between(1, 4)), supplierInvoiceNo: `${sup.slice(0, 3).toUpperCase()}/${++billNo}`, supplierInvoiceDate: on(ym, 1),
        lines: [{ itemId: it[itemKey], qty, rate: priced(rate, ym) }],
      });
      billed[`${sup}:${ym}`] = (billed[`${sup}:${ym}`] ?? 0) + Number(bill.total);
    }
  }
  // ---- production: BOMs, job work and production orders ------------------------------------------------
  step("BOMs per variant, embroidery job work and monthly production");
  const cutting = (await post("/work-centres", { name: "Cutting table", costPerHour: "250" })).id;
  const stitching = (await post("/work-centres", { name: "Stitching line (12 machines)", costPerHour: "900" })).id;
  await post("/work-centres", { name: "Finishing and packing", costPerHour: "300" });
  const ops = (minutes: string) => [{ name: "Cut", workCentreId: cutting, minutes: "60" }, { name: "Stitch", workCentreId: stitching, minutes }];
  const trimsFor = (buttons: string) => [{ itemId: it.buttons, qty: buttons }, { itemId: it.thread, qty: "2" }, { itemId: it.labels, qty: "100" }, { itemId: it.polybag, qty: "100" }];
  for (const s of shirts) {
    // Fabric per shirt grows with the size: 1.5 m for S up to 1.9 m for XXL, for a lot of 100.
    const metres = { S: 150, M: 160, L: 170, XL: 180, XXL: 190 }[s.size as "S"]!;
    await post("/boms", { itemId: s.id, outputQty: "100", overhead: "1500", lines: [{ itemId: it.poplin, qty: String(metres), wastagePct: "4" }, ...trimsFor("6")], operations: ops("480") });
  }
  for (const k of kurtas) {
    const metres = { M: 250, L: 260, XL: 270, XXL: 280 }[k.size as "M"]!;
    await post("/boms", { itemId: k.id, outputQty: "100", overhead: "2000", lines: [{ itemId: it.embroidered, qty: String(metres), wastagePct: "5" }, ...trimsFor("0.5")], operations: ops("600") });
  }
  for (const tr of trousers) {
    await post("/boms", { itemId: tr.id, outputQty: "100", overhead: "1800", lines: [{ itemId: it.twill, qty: "125", wastagePct: "4" }, ...trimsFor("1")], operations: ops("540") });
  }
  // Rayon goes to Raju for embroidery and comes back as embroidered fabric, a little short.
  for (const ym of months) {
    const sent = await post("/job-work/send", { date: on(ym, 2), jobWorkerId: acc.raju, process: "Chikan embroidery", lines: [{ itemId: it.rayon, qty: "700" }] });
    await post("/job-work/receive", {
      date: on(ym, 12), sentChallanId: sent.challan.id, charges: priced(700 * 38, ym),
      received: [{ itemId: it.embroidered, qty: "686" }], consumed: [{ itemId: it.rayon, qty: "700" }],
    });
  }
  // Eight lots of 100 a month, going round every colour and size so stock keeps up with sales.
  let lot = 0;
  for (const ym of months) {
    for (let n = 0; n < 8; n++) {
      const variant = all[lot++ % all.length]!;
      const po = await post("/production-orders", { itemId: variant.id, qty: "100", date: on(ym, 5 + n), release: true });
      const good = 100 - between(0, 3);
      await post(`/production-orders/${po.id}/complete`, { date: on(ym, 14 + n), goodQty: String(good), rejectedQty: "0" });
      (made[ym] ??= []).push({ id: variant.id, qty: good });
    }
  }
  await post("/production-orders", { itemId: v(kurtas, "Mustard", "XL").id, qty: "200", date: "2026-10-06" }); // planned, for testers to run

  const po = await post("/purchase-orders", { supplierId: acc.arvind, date: "2026-09-24", lines: [{ itemId: it.poplin, qty: "2000", rate: "116" }, { itemId: it.rayon, qty: "1000", rate: "91" }] });
  const poLines = (await get(`/purchase-orders/${po.id}`)).lines;
  await post("/goods-receipts", {
    supplierId: acc.arvind, orderId: po.id, date: "2026-09-30", supplierChallan: "AF/2627/0418", transporter: "VRL Logistics", lrNumber: "VRL 4471203", lrDate: "2026-09-27",
    lines: [{ itemId: it.poplin, qty: "1200", orderLineId: poLines[0].id }],
  });
  // Trousers bought in from a stitching unit when the floor was full: an inward challan by size with a new MRP.
  await account("trouserUnit", { name: "Ulhasnagar Trouser Works", groupId: group("sundry_creditors"), stateCode: "27", phone: "9822033445" });
  await post("/goods-receipts", {
    supplierId: acc.trouserUnit, date: "2026-10-08", supplierChallan: "UTW-212", transporter: "Shree Maruti Courier", lrNumber: "SMC 88120", lrDate: "2026-10-07",
    lines: ["32", "34", "36"].map((size) => ({ itemId: v(trousers, "Grey", size).id, qty: size === "34" ? "12" : "8", rate: "560", mrp: "1549" })),
  });
  await post("/purchase-orders", { supplierId: acc.weaving, date: "2026-10-02", lines: [{ itemId: it.twill, qty: "800", rate: "162" }] });

  // ---- staff (salesman needed before sales) ------------------------------------------------------------
  step("staff, attendance, leave and a payroll run every month");
  await put("/payroll/settings", { tan: "MUMG12345B" });
  await post("/shifts", { name: "General", startTime: "09:30", endTime: "18:30", graceMinutes: 10, fullDayMinutes: 480, halfDayMinutes: 240, isDefault: true });
  await post("/holidays", { date: "2026-08-15", name: "Independence Day" });
  await post("/holidays", { date: "2026-09-14", name: "Ganesh Chaturthi" });
  await post("/holidays", { date: "2026-10-02", name: "Gandhi Jayanti" });
  const staff = [
    { name: "Ravi Kulkarni", nameHi: "रवि कुलकर्णी", gender: "male", department: "Production", designation: "Cutting master", basic: "18000", hra: "7200", other: "4800", uan: "100200300400", bank: true },
    { name: "Meera Patil", nameHi: "मीरा पाटिल", gender: "female", department: "Showroom", designation: "Showroom manager", basic: "15000", hra: "6000", other: "4000", bank: true },
    { name: "Arjun Shinde", nameHi: "अर्जुन शिंदे", gender: "male", department: "Sales", designation: "Sales executive", basic: "22000", hra: "8800", other: "9200", bank: true },
    { name: "Fatima Shaikh", nameHi: "फ़ातिमा शेख़", gender: "female", department: "Accounts", designation: "Accountant", basic: "20000", hra: "8000", other: "6000", bank: true },
    { name: "Suresh Pawar", nameHi: "सुरेश पवार", gender: "male", department: "Production", designation: "Tailor", basic: "8000", hra: "3200", other: "1800", esi: "1234567891", bank: false },
    { name: "Lata More", nameHi: "लता मोरे", gender: "female", department: "Production", designation: "Tailor", basic: "7500", hra: "3000", other: "1500", esi: "1234567892", bank: false },
    { name: "Pooja Sawant", nameHi: "पूजा सावंत", gender: "female", department: "Showroom", designation: "Sales associate", basic: "12000", hra: "4800", other: "3200", bank: true },
    { name: "Rahul Gaikwad", nameHi: "राहुल गायकवाड", gender: "male", department: "Showroom", designation: "Sales associate", basic: "12000", hra: "4800", other: "3200", bank: true },
  ];
  const emp: string[] = [];
  for (const [n, p] of staff.entries()) {
    emp.push((await post("/employees", {
      name: p.name, nameHi: p.nameHi, gender: p.gender, joinedOn: n < 4 ? "2023-06-01" : "2026-04-15", workState: "27", department: p.department, designation: p.designation,
      phone: `98${String(22000000 + n * 1111111).slice(0, 8)}`, pan: ["ABCPK1234F", "BCDPP2345G", "CDEPS3456H", "DEFPS4567J", "EFGPP5678K", "FGHPM6789L", "GHIPS7890M", "HIJPG8901N"][n],
      ...(p.uan ? { uan: p.uan } : {}), ...(p.esi ? { esiNumber: p.esi } : {}),
      ...(p.bank ? { paymentMode: "bank", bankName: "HDFC Bank", bankIfsc: "HDFC0001234", bankAccount: `501000${12345678 + n}` } : { paymentMode: "cash" }),
      costPerHour: String(Math.round(Number(p.basic) * 2 / 26 / 8)),
      components: [
        { code: "BASIC", name: "Basic", monthly: p.basic, pfWage: true },
        { code: "HRA", name: "HRA", monthly: p.hra, hra: true },
        { code: "SPL", name: "Special allowance", monthly: p.other },
      ],
    })).id);
  }
  const salesman = emp[2]!;
  for (const key of ["mfh", "blr", "surat"]) await call("PATCH", `/accounts/${acc[key]}`, { salesmanId: salesman });
  const slabs = [{ from: "0", rate: "0.5" }, { from: "80", rate: "1" }, { from: "100", rate: "1.5" }];
  for (const month of ["2026-08", "2026-09", "2026-10"]) await put(`/sales-targets/${month}`, { targets: [{ employeeId: salesman, target: "400000", slabs }] });
  const leaveTypes: { id: string; code: string }[] = await get("/leave-types");
  const lt = (code: string) => leaveTypes.find((l) => l.code === code)!.id;
  const leave = await post("/leave-requests", { employeeId: emp[1], leaveTypeId: lt("CL"), fromDate: "2026-08-20", toDate: "2026-08-21", reason: "Family function" });
  await post(`/leave-requests/${leave.id}/approve`);
  const sick = await post("/leave-requests", { employeeId: emp[4], leaveTypeId: lt("SL"), fromDate: "2026-09-08", toDate: "2026-09-09", reason: "Fever" });
  await post(`/leave-requests/${sick.id}/approve`);
  await post("/leave-requests", { employeeId: emp[2], leaveTypeId: lt("EL"), fromDate: "2026-10-19", toDate: "2026-10-23", reason: "Diwali trip home" }); // waiting for approval
  await put("/attendance", { entries: [
    { employeeId: emp[5], date: "2026-09-03", status: "absent" },
    { employeeId: emp[4], date: "2026-09-17", status: "half_day" },
    { employeeId: emp[0], date: "2026-07-22", status: "absent" },
  ] });
  for (const period of months) {
    const run = await post("/payroll-runs", { period });
    await post(`/payroll-runs/${run.id}/finalize`);
    await post(`/payroll-runs/${run.id}/pay`, { accountId: acc.hdfc, date: lastDayOf(period) });
  }

  // ---- wholesale -----------------------------------------------------------------------------------------
  step("wholesale invoices, showroom takings, receipts, a return, quotation, proforma, order and approval challan");
  const wholesale = ["mfh", "surat", "blr", "kolhapur", "nashik"];
  const invoices: { id: string; customer: string; total: string; date: string }[] = [];
  const pickSizes = (list: Variant[], n: number) => Array.from({ length: n }, () => pick(list));
  // What can go out of a garment and still leave a dozen pieces for the showroom and later orders.
  const take = (id: string) => Math.max(0, onHand.get(id)! - 12);
  for (const ym of months) {
    for (let n = 0; n < (isFestive(ym) ? 10 : 7); n++) {
      const customer = pick(wholesale);
      const date = on(ym, between(16, 28));
      // A set per style: a few colour and size variants, 6 to 18 pieces each, at wholesale rates.
      const chosen = [...new Set(pickSizes(all, isFestive(ym) ? 8 : 7))];
      const goods = chosen.map((x) => ({ x, qty: Math.min(between(1, 3) * 6, Math.floor(take(x.id) / 6) * 6) })).filter((l) => l.qty > 0);
      if (!goods.length) continue;
      for (const g of goods) onHand.set(g.x.id, onHand.get(g.x.id)! - g.qty);
      const lines = [
        ...goods.map(({ x, qty }) => ({ itemId: x.id, qty: String(qty), rate: priced(Math.round(Number(x.saleRate) * 0.9), ym) })),
        ...(customer === "blr" || customer === "surat" ? [{ itemId: it.freight, qty: "1", rate: "2500" }] : []),
      ];
      const inv = await post("/sales-invoices", { customerId: acc[customer], date, lines, overrideCredit: true, overrideReason: "Demo data" });
      invoices.push({ id: inv.id, customer, total: inv.total, date });
    }
    // The month's lots are finished by the 21st; the showroom sells from them at the month end.
    for (const lot of made[ym] ?? []) onHand.set(lot.id, onHand.get(lot.id)! + lot.qty);
    if (ym >= "2026-09") continue;
    // Before the counter software, the showroom's takings went in as one bill a month, banked the same day.
    const picks = [...new Set(Array.from({ length: isFestive(ym) ? 16 : 10 }, () => pick(all)))]
      .map((x) => ({ x, qty: Math.min(between(2, 6), take(x.id)) })).filter((l) => l.qty > 0);
    for (const l of picks) onHand.set(l.x.id, onHand.get(l.x.id)! - l.qty);
    const takings = await post("/sales-invoices", {
      customerId: acc.walkin, date: lastDayOf(ym), narration: `Dadar showroom counter sales, ${ym}`,
      // The showroom manager until the associates joined in April 2026, then whoever sold most that month.
      salesmanId: ym < "2026-04" ? emp[1] : pick([emp[1]!, emp[6]!, emp[7]!]),
      lines: picks.map(({ x, qty }) => ({ itemId: x.id, qty: String(qty), rate: priced(x.saleRate, ym) })),
    });
    await post("/vouchers", { type: "receipt", date: lastDayOf(ym), narration: "Showroom cash and UPI banked", lines: [{ accountId: acc.hdfc, debit: takings.total }, { accountId: acc.walkin, credit: takings.total }] });
  }
  // Most invoices are paid; recent ones and a few old ones stay open so ageing, interest and reminders have work.
  for (const inv of invoices) {
    const recent = inv.date >= "2026-09-01";
    // Older years are almost all collected; a few bad payers keep ageing and interest busy.
    if (recent || rnd() < (inv.date >= "2026-04-01" ? 0.15 : 0.03)) continue;
    const paidOn = new Date(Date.parse(inv.date) + between(10, 40) * 86_400_000).toISOString().slice(0, 10);
    await post("/vouchers", { type: "receipt", date: paidOn > "2026-09-30" ? "2026-09-30" : paidOn, reference: `UTR${between(100000, 999999)}`, lines: [{ accountId: acc.hdfc, debit: inv.total }, { accountId: acc[inv.customer], credit: inv.total }] });
  }
  for (const ym of months.slice(0, -1)) {
    for (const sup of ["arvind", "weaving", "trims", "packing"]) {
      const amount = billed[`${sup}:${ym}`]!.toFixed(2);
      await post("/vouchers", { type: "payment", date: on(nextMonth(ym), 3), lines: [{ accountId: acc[sup], debit: amount }, { accountId: acc.hdfc, credit: amount }] });
    }
  }

  step("running costs, every month");
  for (const ym of months) {
    const costs: [string, string, string][] = [
      ["rent", priced(65000, ym), "Showroom rent, Dadar"], ["rent", priced(35000, ym), "Factory gala rent, Bhiwandi"],
      ["telephone", priced(3600, ym), "Phones and internet"],
      // September 2026's electricity autopay is left in the bank statement for testers to match.
      ...(ym === "2026-09" ? [] : [["electricity", String(between(16000, 24000) + (isFestive(ym) ? 3000 : 0)), "MSEDCL electricity"] as [string, string, string]]),
    ];
    for (const [key, amount, narration] of costs) {
      if (!acc[key]) continue;
      await post("/vouchers", { type: "payment", date: on(ym, 7), narration, lines: [{ accountId: acc[key], debit: amount }, { accountId: acc.hdfc, credit: amount }] });
    }
  }
  for (const fyEnd of [...months.filter((x) => x.endsWith("-03")).map(lastDayOf), "2026-09-30"]) {
    try { await post("/brokerage-bills", { agentId: acc.broker, date: fyEnd }); } catch { /* nothing earned in the period */ }
  }
  const returned = invoices.find((i) => i.date >= "2026-09-01")!;
  const firstLine = (await get(`/sales-invoices/${returned.id}`)).lines[0];
  await post("/credit-notes", { invoiceId: returned.id, date: "2026-09-29", reason: "Six pieces with stitching faults", lines: [{ invoiceLineId: firstLine.id, qty: "6" }] });
  const festive = kurtas.slice(0, 6).map((x) => ({ itemId: x.id, qty: "24", rate: "1050" }));
  const quote = await post("/quotations", { customerId: acc.blr, date: "2026-09-26", lines: festive });
  await post("/quotations", { customerId: acc.school, date: "2026-10-01", lines: [{ itemId: it.stitching, qty: "400", rate: "250" }] });
  await post("/sales-orders", { customerId: acc.blr, quotationId: quote.id, date: "2026-09-28", lines: festive });
  await post("/sales-orders", { customerId: acc.kolhapur, date: "2026-10-01", lines: shirts.slice(0, 5).map((x) => ({ itemId: x.id, qty: "12", rate: "810" })), overrideCredit: true, overrideReason: "Demo data" });
  await post("/quotations", { kind: "proforma", customerId: acc.surat, date: "2026-10-03", advanceDue: "50000", lines: kurtas.slice(4, 8).map((x) => ({ itemId: x.id, qty: "30", rate: "1080" })) });
  // Goods sent to a retailer on approval: they keep what sells and send back the rest.
  const approval = await post("/delivery-notes", {
    customerId: acc.mfh, date: "2026-09-20", reason: "approval", transporter: "Shree Sai Transport", vehicleNo: "MH04AB1234",
    lines: kurtas.slice(0, 4).map((x) => ({ itemId: x.id, qty: "10", rate: "1080" })),
  });
  const approvalLines = (await get(`/delivery-notes/${approval.id}`)).lines;
  await post(`/delivery-notes/${approval.id}/returns`, { date: "2026-10-05", lines: [{ lineId: approvalLines[0].id, qty: "4" }] });

  // ---- showroom counter ------------------------------------------------------------------------------------
  step("Dadar showroom: offers, vouchers, bills and an exchange");
  await post("/stock-journals", { kind: "transfer", date: "2026-09-30", lines: all.map((x) => ({ itemId: x.id, warehouseId: main, toWarehouseId: showroom, qty: "8" })) });
  await put("/pos/settings", { pricesIncludeTax: true, loyaltyEnabled: true, loyaltyPointsPer100: 1, loyaltyPointValue: "1", loyaltyMaxRedeemPct: "10", referralPoints: 50, receiptFooter: "Exchange within 15 days with the bill. No exchange on altered garments.",
    // Cashiers may give up to 10% on a line and 5% on a bill; more needs the owner or an admin with a reason.
    allowRateChange: false, maxLineDiscountPct: "10", maxBillDiscountPct: "5",
    // A customer who gives a mobile gets the bill on WhatsApp as soon as it is paid.
    autoSendBill: true });
  await post("/schemes", { name: "Diwali 15% on Anvi", kind: "percent", pct: "15", startsOn: "2026-10-01", endsOn: "2026-11-15", scope: { brands: ["Anvi"] } });
  await post("/schemes", { name: "Shirts: buy 2 get 1 free", kind: "buy_get", buy: 2, get: 1, pct: "100", scope: { categories: ["Shirts"] } });
  await post("/schemes", { name: "Shirt and trouser combo 1799", kind: "combo", comboPrice: "1799", comboItems: [{ itemId: v(shirts, "White", "L").id, qty: 1 }, { itemId: v(trousers, "Black", "34").id, qty: 1 }] });
  await post("/coupons", { code: "DIWALI200", kind: "amount", value: "200", minBill: "2000", endsOn: "2026-11-15", maxUses: 500 });
  await post("/discount-cards", { number: "STAFF-01", holder: "Showroom staff", pct: "20", validUntil: "2027-03-31" });
  await post("/gift-vouchers", { value: "1000", count: 3, expiresOn: "2027-10-31", paidBy: "upi", customerName: "Corporate Diwali gifts" });
  const terminal = (await post("/pos/terminals", { name: "Dadar showroom counter", warehouseId: showroom })).id;
  await post("/pos/sessions", { terminalId: terminal, openingCash: "5000" });
  const { applySchemes, businessDate, posBill } = await import("@varchasv/domain");
  const offers = await get("/pos/schemes");
  const today = businessDate();
  const counterSales: string[] = [];
  const floorStaff = [emp[1]!, emp[6]!, emp[7]!]; // the showroom manager and two sales associates
  for (let n = 0; n < 14; n++) {
    const lines = [...new Set([pick(all), ...(rnd() > 0.4 ? [pick(shirts), pick(shirts)] : []), ...(rnd() > 0.6 ? [pick(kurtas)] : [])])].map((x) => ({ itemId: x.id, qty: "1", price: Number(x.saleRate) }));
    // The counter works out the same figures as the server: schemes, then GST taken out of the price.
    const got = applySchemes(lines.map((l) => ({ itemId: l.itemId, qty: l.qty, price: String(l.price) })), offers, today);
    const bill = posBill(lines.map((l, i) => ({ qty: l.qty, price: l.price, gstRate: "5", discount: got.discounts[i], gstSlab: "apparel", slabPieces: 1 })), { inclusive: true, date: today });
    const mode = pick(["cash", "upi", "upi", "card"]);
    const r = await post("/pos/bills", {
      terminalId: terminal, salesmanId: pick(floorStaff), ...(n % 3 === 0 ? { customerPhone: `98${between(10000000, 99999999)}`, customerName: pick(["Rohan Mehta", "Sneha Iyer", "Imran Khan", "Kavya Nair"]) } : {}),
      lines: lines.map((l) => ({ itemId: l.itemId, qty: l.qty })), payments: [{ mode, amount: bill.total, ...(mode !== "cash" ? { reference: String(between(1000, 9999)) } : {}) }],
    });
    counterSales.push(r.number);
  }
  // A customer brings back a shirt in the wrong size and takes another size with the store credit.
  const sold = await get(`/pos/bills/lookup?number=${encodeURIComponent(counterSales[1]!)}`);
  const swap = await post("/pos/returns", { billId: sold.id, terminalId: terminal, refundMode: "voucher", lines: [{ lineId: sold.lines[0].id, qty: "1", reason: "size", grade: "A" }] });
  const credit = Number(swap.total);
  const other = all.find((x) => Number(x.saleRate) >= credit && x.id !== sold.lines[0].itemId)!;
  const exchange = posBill([{ qty: "1", price: other.saleRate, gstRate: "5", discount: applySchemes([{ itemId: other.id, qty: "1", price: other.saleRate }], offers, today).discounts[0], gstSlab: "apparel" }], { inclusive: true, date: today });
  const due = (Number(exchange.total) - credit).toFixed(2);
  await post("/pos/bills", {
    terminalId: terminal, lines: [{ itemId: other.id, qty: "1" }], giftVouchers: [{ code: swap.voucherCode, amount: Math.min(credit, Number(exchange.total)).toFixed(2) }],
    payments: Number(due) > 0 ? [{ mode: "cash", amount: due }] : [],
  });
  // An exchange on one bill: a kurta comes back for size and its credit pays for a trouser.
  const sold2 = await get(`/pos/bills/lookup?number=${encodeURIComponent(counterSales[2]!)}`);
  const back = sold2.lines[0];
  const { returnCredit } = await import("@varchasv/domain");
  const backCredit = Number(returnCredit([{ line: back, qty: "1" }]).refund);
  const swapTo = v(trousers, "Navy", "34");
  const swapBill = posBill([{ qty: "1", price: swapTo.saleRate, gstRate: "5", discount: applySchemes([{ itemId: swapTo.id, qty: "1", price: swapTo.saleRate }], offers, today).discounts[0], gstSlab: "apparel" }], { inclusive: true, date: today });
  const swapDue = Math.max(0, Number(swapBill.total) - backCredit).toFixed(2);
  await post("/pos/bills", {
    terminalId: terminal, salesmanId: floorStaff[1], lines: [{ itemId: swapTo.id, qty: "1" }],
    exchange: { billId: sold2.id, lines: [{ lineId: back.id, qty: "1", reason: "size", grade: "A" }] },
    payments: Number(swapDue) > 0 ? [{ mode: "upi", amount: swapDue, reference: "5521" }] : [],
  });
  // A customer still trying trousers: the bill waits on hold for testers to pick up (F4 on the counter).
  await post("/pos/held", { terminalId: terminal, label: "Gentleman in the trial room", lines: [{ itemId: v(trousers, "Black", "34").id, qty: "1", salesmanId: emp[6] }, { itemId: v(shirts, "White", "L").id, qty: "1", salesmanId: emp[6] }] });

  // Stock counts at the showroom: the shirt rack counted by scanning and approved, the kurta wall still being counted.
  const pieces = (await get("/items") as { id: string; barcode: string | null }[]);
  const barcode = (id: string) => pieces.find((x) => x.id === id)!.barcode!;
  const shirtCount = await post("/stock-counts", { warehouseId: showroom, name: "Shirt rack", scope: { category: "Shirts" }, blind: true });
  const shirtLines = (await get(`/stock-counts/${shirtCount.id}`)).lines as { itemId: string; expected: string }[];
  for (const [n, l] of shirtLines.entries()) {
    const have = Math.max(0, Math.round(Number(l.expected)));
    // Two pieces missing on one size; everything else as the books say.
    const counted = n === 3 ? Math.max(0, have - 2) : have;
    if (counted > 0) await post(`/stock-counts/${shirtCount.id}/scan`, { code: barcode(l.itemId), qty: String(counted) });
  }
  await post(`/stock-counts/${shirtCount.id}/scan`, { code: barcode(v(kurtas, "Maroon", "L").id) }); // a kurta found on the shirt rack
  await post(`/stock-counts/${shirtCount.id}/submit`, {});
  await post(`/stock-counts/${shirtCount.id}/approve`, { reason: "Two shirts missing after the Sunday rush; one kurta was on the wrong rack" });
  const kurtaCount = await post("/stock-counts", { warehouseId: showroom, name: "Kurta wall", scope: { category: "Kurtas" }, blind: true });
  for (const k of kurtas.slice(0, 4)) await post(`/stock-counts/${kurtaCount.id}/scan`, { code: barcode(k.id), qty: "3" });

  // ---- alterations ----------------------------------------------------------------------------------------
  step("alteration desk: karigars, rates and slips");
  const workroom = (await post("/karigars", { name: "Showroom workroom" })).id;
  const salim = (await post("/karigars", { name: "Salim Tailors", phone: "9844412345", outside: true })).id;
  const altTypes: Record<string, string> = {};
  for (const [key, name, kind, charge, labour] of [
    ["sleeves", "Shorten sleeves", "alteration", "150", "60"], ["hem", "Trouser hemming", "alteration", "100", "40"], ["waist", "Waist fitting", "alteration", "150", "60"],
    ["kurta", "Kurta fitting", "alteration", "200", "80"], ["zip", "Button or zip repair", "repair", "80", "30"],
  ] as const) altTypes[key] = (await post("/alteration-types", { name, kind, charge, labour })).id;
  const bills = await Promise.all(counterSales.slice(2, 4).map((n) => get(`/pos/bills/lookup?number=${encodeURIComponent(n)}`)));
  const plus = (n: number) => businessDate(new Date(Date.now() + n * 86_400_000));
  const slip1 = await post("/alterations", { billId: bills[0].id, trialOn: plus(1), deliveryOn: plus(2), lines: [{ typeId: altTypes.sleeves, garment: bills[0].lines[0].name, qty: 1, notes: "1 inch shorter" }], complimentary: true });
  const slip2 = await post("/alterations", { billId: bills[1].id, deliveryOn: plus(1), lines: [{ typeId: altTypes.hem, garment: bills[1].lines[0].name, qty: 1, notes: "Inseam 30" }, { typeId: altTypes.waist, garment: bills[1].lines[0].name, qty: 1 }] });
  await post("/alterations", { customerName: "Walk-in customer", customerPhone: "9876501234", deliveryOn: plus(3), lines: [{ typeId: altTypes.zip, garment: "Customer's own trousers", qty: 1 }] });
  await post(`/alterations/${slip1.id}/issue`, { karigarId: workroom });
  await post(`/alterations/${slip2.id}/issue`, { karigarId: salim });
  await post(`/alterations/${slip2.id}/receive`, {});

  // ---- tailoring ------------------------------------------------------------------------------------------
  step("made-to-order tailoring: rates, measurements and orders");
  await put("/tailoring-rates", { rates: [
    { garment: "Shirt", process: "Cutting", rate: "40" }, { garment: "Shirt", process: "Stitching", rate: "160" }, { garment: "Shirt", process: "Finishing", rate: "30" },
    { garment: "Kurta", process: "Cutting", rate: "50" }, { garment: "Kurta", process: "Stitching", rate: "220" }, { garment: "Kurta", process: "Embroidery", rate: "300" },
    { garment: "Trouser", process: "Cutting", rate: "40" }, { garment: "Trouser", process: "Stitching", rate: "180" },
  ] });
  const shirtCard = await post("/measurements", { customerPhone: "9820011223", customerName: "Nikhil Rao", garment: "Shirt", values: { Chest: "40", Waist: "36", Shoulder: "18", Length: "29", Sleeve: "25", Neck: "15.5" }, notes: "Prefers a slim fit" });
  const kurtaCard = await post("/measurements", { customerPhone: "9820099887", customerName: "Priya Desai", garment: "Kurta", values: { Chest: "36", Waist: "30", Hip: "40", Length: "44", Sleeve: "17" } });
  const tOrder = await post("/tailoring-orders", {
    customerName: "Nikhil Rao", customerPhone: "9820011223", trialOn: plus(2), deliveryOn: plus(5), advance: "1000", advancePaidBy: "upi",
    lines: [{ garment: "Shirt", qty: 2, price: "650", measurementId: shirtCard.id, fabricItemId: it.poplin, fabricQty: "3.4", notes: "Cutaway collar, one pocket" }],
  });
  await post(`/tailoring-orders/${tOrder.id}/assign`, { line: 0, process: 0, karigarId: workroom });
  await post(`/tailoring-orders/${tOrder.id}/done`, { line: 0, process: 0 });
  await post(`/tailoring-orders/${tOrder.id}/assign`, { line: 0, process: 1, karigarId: salim });
  await post("/tailoring-orders", {
    customerName: "Priya Desai", customerPhone: "9820099887", trialOn: plus(4), deliveryOn: plus(9), advance: "800", advancePaidBy: "cash",
    lines: [{ garment: "Kurta", qty: 1, price: "1400", measurementId: kurtaCard.id, notes: "Customer's own silk, chikan work on yoke" }],
  });

  // ---- consignment ----------------------------------------------------------------------------------------
  step("shop-in-shop counter at a department store, on consignment");
  const phoenix = (await post("/accounts", {
    name: "Phoenix Mall Department Store", groupId: group("sundry_debtors"), stateCode: "27", creditDays: 30,
    address: { line1: "Phoenix Mall, Lower Parel", city: "Mumbai", pincode: "400013" },
  })).id;
  await post("/consignment/send", { customerId: phoenix, date: day(5, 10), narration: "Festive counter stock", lines: [
    { itemId: v(kurtas, "Maroon", "M").id, qty: "6", rate: "1050" }, { itemId: v(kurtas, "Mustard", "L").id, qty: "6", rate: "1050" }, { itemId: v(kurtas, "Green", "XL").id, qty: "4", rate: "1050" },
  ] });
  await post("/consignment/send", { customerId: phoenix, date: day(8, 1), lines: [
    { itemId: v(shirts, "White", "M").id, qty: "8", rate: "780" }, { itemId: v(shirts, "Sky blue", "L").id, qty: "8", rate: "780" },
  ] });
  await post("/consignment/return", { customerId: phoenix, date: day(9, 15), narration: "Green kurtas not moving", lines: [{ itemId: v(kurtas, "Green", "XL").id, qty: "2" }] });
  await post("/consignment/sales", { customerId: phoenix, date: day(10, 5), narration: "September sales report", lines: [
    { itemId: v(kurtas, "Maroon", "M").id, qty: "4", rate: "1050" }, { itemId: v(kurtas, "Mustard", "L").id, qty: "3", rate: "1050" }, { itemId: v(shirts, "White", "M").id, qty: "5", rate: "780" },
  ] });

  // ---- image catalogue -------------------------------------------------------------------------------
  step("image catalogue: a photo per colour and a selection for a buyer");
  const palette: { name: string; hex: string | null }[] = await get("/colors");
  const styleOf: Record<string, string> = {};
  for (const [key, list] of [["shirts", shirts], ["kurtas", kurtas], ["trousers", trousers]] as const) {
    const styleId = (await get(`/items/${list[0]!.id}`)).styleId as string;
    styleOf[key] = styleId;
    for (const color of [...new Set(list.map((x) => x.color))]) {
      const hex = palette.find((p) => p.name === color)?.hex ?? "#8a8a8a";
      const up = async (w: number, h: number, suffix: string) => (await post("/files", { name: `${color}${suffix}.png`, contentType: "image/png", base64: swatchPng(hex, w, h) })).id;
      await post(`/styles/${styleId}/images`, { fileId: await up(600, 800, ""), thumbFileId: await up(180, 240, "-thumb"), color, view: "front" });
    }
  }
  await post("/catalogue/selections", {
    name: "Diwali kurtas for Surat", partyId: acc.surat, showStock: true,
    lines: [...new Set(kurtas.map((x) => x.color))].map((color) => ({ styleId: styleOf.kurtas, color })),
  });

  // ---- fixed assets ------------------------------------------------------------------------------------
  step("fixed assets and depreciation");
  const plant = (await post("/assets/classes", { preset: "plant_machinery" })).id;
  const vehicles = (await post("/assets/classes", { preset: "vehicles" })).id;
  const computers = (await post("/assets/classes", { preset: "computers" })).id;
  const furniture = (await post("/assets/classes", { preset: "furniture" })).id;
  // Machines already owned when the books began come in at their written-down value; later ones are bought in the books.
  await post("/assets", { classId: plant, name: "Juki industrial sewing machines (12)", purchaseDate: "2022-04-10", cost: "540000", acquisition: "opening", openingAccumulated: "137000", location: "Bhiwandi" });
  await post("/assets", { classId: plant, name: "Straight knife cutting machine", purchaseDate: "2023-01-15", cost: "95000", acquisition: "opening", openingAccumulated: "15800", location: "Bhiwandi" });
  const inBooks = (date: string) => date >= booksFrom;
  const van = { classId: vehicles, name: "Tata Ace delivery van", purchaseDate: "2025-04-01", cost: "720000", location: "Bhiwandi" };
  await post("/assets", inBooks(van.purchaseDate) ? { ...van, acquisition: "paid", accountId: acc.hdfc } : { ...van, acquisition: "opening", openingAccumulated: "89000" });
  await post("/assets", { classId: computers, name: "Dell Vostro laptop", purchaseDate: "2026-06-12", cost: "58000", acquisition: "supplier", accountId: acc.croma, gstRate: "18", invoiceRef: "SC/7781" });
  await post("/assets", { classId: furniture, name: "Showroom racks and display fixtures", purchaseDate: "2026-04-20", cost: "240000", acquisition: "paid", accountId: acc.hdfc, location: "Dadar" });
  for (let y = 2026 - years; y < 2026; y++) await post("/assets/depreciation", { from: `${y}-04-01`, to: `${y + 1}-03-31` });
  await post("/assets/depreciation", { from: "2026-04-01", to: "2026-09-30" });

  // ---- banking -----------------------------------------------------------------------------------------
  step("bank statement import and a rule");
  // September's statement: everything booked through HDFC that month, plus three lines nobody has
  // entered yet (bank charges, an electricity autopay, a customer's UPI) for testers to reconcile.
  const ledger = await get(`/reports/ledger/${acc.hdfc}?from=2026-09-01&to=2026-09-30`);
  const fmt = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(2, 4)}`;
  const money = (n: number) => `"${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}"`;
  let balance = Number(ledger.opening);
  const rows = ["HDFC BANK Ltd.,,,,,,", "Date,Narration,Chq./Ref.No.,Value Dt,Withdrawal Amt.,Deposit Amt.,Closing Balance"];
  const line = (date: string, narration: string, ref: string, out: number, inn: number) => {
    balance += inn - out;
    rows.push(`${fmt(date)},${narration},${ref},${fmt(date)},${out ? money(out) : ""},${inn ? money(inn) : ""},${money(balance)}`);
  };
  for (const r of ledger.rows as { date: string; debit: string; credit: string; counterparts: string; number: string; type: string }[]) {
    const who = r.counterparts.toUpperCase().replace(/[^A-Z0-9 ]/g, "").slice(0, 30);
    const ref = `N${String(between(10 ** 9, 10 ** 10 - 1))}`;
    if (Number(r.debit) > 0) line(r.date, `NEFT CR-${who}`, ref, 0, Number(r.debit));
    else line(r.date, r.type === "payment" ? `NEFT DR-${who}` : `BULK PAYMENT-${who}`, ref, Number(r.credit), 0);
  }
  line("2026-09-30", "SMS CHARGES FOR SEP", "", 17.7, 0);
  line("2026-09-30", "MSEDCL ELECTRICITY BILL AUTOPAY", "", 18640, 0);
  line("2026-09-30", "UPI-NASHIK READYMADE-NASHIKREADY@OKHDFC-627499991234", "627499991234", 0, 25000);
  await post(`/banking/accounts/${acc.hdfc}/statements`, { fileName: "hdfc-september.csv", csv: rows.join("\n") });
  if (acc.bank_charges) await post("/banking/rules", { contains: "sms charges", direction: "out", accountId: acc.bank_charges, narration: "SMS alert charges" });

  // ---- expenses and projects ---------------------------------------------------------------------------
  step("expense claims and a school uniform project");
  const cats: { id: string; name: string }[] = await get("/expenses/categories");
  const cat = (word: string) => (cats.find((c) => c.name.toLowerCase().includes(word)) ?? cats[0]!).id;
  const claim1 = await post("/expenses/claims", { employeeId: emp[2], date: "2026-09-12", title: "Retailer visits, Kolhapur and Sangli", submit: true, lines: [{ date: "2026-09-11", categoryId: cat("travel"), amount: "1450" }, { date: "2026-09-11", categoryId: cat("meal"), amount: "520" }] });
  await post(`/expenses/claims/${claim1.id}/approve`);
  await post(`/expenses/claims/${claim1.id}/pay`, { date: "2026-09-20", accountId: acc.cash ?? acc.hdfc });
  await post("/expenses/claims", { employeeId: emp[1], date: "2026-09-28", title: "Showroom display props", submit: true, lines: [{ date: "2026-09-27", categoryId: cat("travel"), amount: "380" }] });
  await post("/expenses/claims", { employeeId: emp[0], date: "2026-10-01", title: "Cutting machine blade (draft)", lines: [{ date: "2026-09-30", categoryId: cat("travel"), amount: "260" }] });
  const project = await post("/projects", { name: "School uniforms, St. Mary's High School", customerId: acc.school, billing: "fixed", contractValue: "100000", billingItemId: it.stitching, budgetCost: "62000", budgetHours: "120" });
  await post(`/projects/${project.id}/milestones`, { name: "Advance on order", amount: "30000", dueOn: "2026-10-05" });
  await post(`/projects/${project.id}/milestones`, { name: "Delivery of 400 sets", amount: "70000", dueOn: "2026-11-10" });
  for (const [e, d, h] of [[0, "2026-09-24", "6"], [4, "2026-09-25", "8"], [5, "2026-09-29", "8"]] as const) {
    await post("/timesheets", { projectId: project.id, employeeId: emp[e], date: d, hours: h });
  }

  // ---- CRM ---------------------------------------------------------------------------------------------
  step("leads and follow-ups");
  const leads = [
    { name: "Ritu Jain", organisation: "Jain Garments, Pune", phone: "+91 99887 76655", source: "indiamart", stage: "qualified", value: "250000", city: "Pune" },
    { name: "Vikram Desai", organisation: "Desai Wedding Collection", phone: "9822012345", source: "referral", stage: "proposal", value: "480000", city: "Mumbai" },
    { name: "Neha Kapoor", organisation: "Kapoor Corporate Uniforms", phone: "9765012345", source: "website", stage: "new", value: "175000", city: "Pune" },
    { name: "Anil Gupta", organisation: "Gupta Cloth Emporium", phone: "9890012345", source: "walk_in", stage: "contacted", value: "340000", city: "Nagpur" },
  ];
  for (const [n, l] of leads.entries()) {
    const lead = await post("/crm/leads", l);
    await post("/crm/activities", { leadId: lead.id, kind: n % 2 ? "meeting" : "call", subject: n % 2 ? "Show the festive collection at the showroom" : "Call back with the wholesale price list", dueAt: new Date(Date.UTC(2026, 9, 3 + n * 2, 5, 30)).toISOString() });
  }

  // ---- WhatsApp: invoices and payment reminders, each with a link to open it -----------------------------
  step("WhatsApp: an invoice and payment reminders");
  const gst = await get("/gst/settings");
  await put("/gst/settings", { einvoiceEnabled: gst.einvoiceEnabled, ewayBillThreshold: gst.ewayBillThreshold, bilingualPrint: gst.bilingualPrint, printLanguage: gst.printLanguage,
    invoiceTerms: gst.invoiceTerms ?? "Goods once sold will be taken back only within 7 days with the bill.",
    bankDetails: "HDFC Bank, Bhiwandi branch\nA/c 50200012345678, IFSC HDFC0001234\nUPI shreeganesh@hdfcbank" });
  const latest = (await get("/sales-invoices") as { id: string; customerId: string; status: string }[]).find((i) => i.customerId === acc.mfh && i.status === "posted");
  if (latest) await post(`/sales-invoices/${latest.id}/send`, {});
  // Nashik has no mobile on file, so it is listed to be called instead.
  await post("/reminders/payments", { overdueOnly: true });

  // ---- team: one login per role ------------------------------------------------------------------------
  step("team members, one per role");
  const roles: { id: string; key: string; name: string }[] = await get("/roles");
  const [local, domain] = email.split("@");
  const team: string[] = [];
  for (const r of roles.filter((x) => x.key && x.key !== "owner")) {
    const memberEmail = `${local}+${r.key}@${domain}`;
    const inv = await post("/invitations", { email: memberEmail, roleId: r.id });
    const token = inv.inviteUrl.split("/invite/")[1];
    try {
      await call("POST", "/invitations/accept", { token, name: `${r.name} (demo)`, password }, false);
      team.push(`${r.name.padEnd(14)} ${memberEmail}`);
    } catch {
      // A login from an earlier demo: the invitation waits for them to accept it after signing in.
      team.push(`${r.name.padEnd(14)} ${memberEmail} (invited; accept after signing in)`);
    }
  }

  console.log(`\nDone. "${business}" is ready (books from ${booksFrom}, activity to early October 2026).\n`);
  console.log(`  Owner          ${email}`);
  for (const line of team) console.log(`  ${line}`);
  console.log(`\n  Password for all of them: ${arg("password") ? "the one you passed with --password" : "DEV_DEMO_PASSWORD from .env (or .env.example)"}`);
  console.log(`  Sign in at ${process.env.WEB_ORIGIN ?? "http://localhost:3100"}/login\n`);
} finally {
  await shutdown();
}
