import { and, eq, ilike, or, sql } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec, formatIndian, money, presetPeriod } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest } from "../lib/errors.js";
import { profitAndLoss, resolveCompany } from "./accounting.js";
import { anomalies, dashboard } from "./analytics.js";
import { stockSummary } from "./inventory.js";
import { runReport } from "./reportbuilder.js";
import { gstr3b, outstanding } from "./returns.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }
export interface ChatMessage { role: "user" | "assistant"; content: string }

/**
 * The business assistant. It answers questions about the business from read-only tools that run in the
 * business's own data with the asking user's permissions; it cannot post, change or delete anything.
 * With ANTHROPIC_API_KEY set Claude answers (it chooses the tools); without it a simple built-in
 * assistant answers the common questions from the same tools.
 */
interface Tool {
  description: string;
  permission: string;
  input: Record<string, unknown>;
  run: (tx: Tx, args: Record<string, unknown>, ctx: { today: string; perms: Set<string> }) => Promise<unknown>;
}

const period = { type: "object", properties: { from: { type: "string", description: "YYYY-MM-DD" }, to: { type: "string", description: "YYYY-MM-DD" } }, required: ["from", "to"] };
const isoOr = (v: unknown, fallback: string) => (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : fallback);

export const TOOLS: Record<string, Tool> = {
  business_overview: {
    description: "Today's key numbers: sales today and this month, cash and bank balances, receivables, payables, this month's profit, low stock, things waiting for approval, and alerts.",
    permission: "reports.view", input: { type: "object", properties: {} },
    run: (tx, _a, c) => dashboard(tx, c.perms, c.today),
  },
  sales_summary: {
    description: "Sales (taxable value, tax, total, quantity, number of invoices) for a period, grouped by month, day, customer, item, HSN or state.",
    permission: "sales.view",
    input: { type: "object", properties: { ...period.properties, group_by: { type: "string", enum: ["month", "day", "customer", "item", "hsn", "state"] } }, required: ["from", "to"] },
    run: async (tx, a, c) => {
      const from = isoOr(a.from, presetPeriod("this_month", c.today).from);
      const to = isoOr(a.to, c.today);
      const groupBy = typeof a.group_by === "string" ? [a.group_by] : [];
      const r = await runReport(tx, c.perms, { dataset: "sales", groupBy, measures: ["taxable", "tax", "total", "qty", "documents"], period: { preset: "custom", from, to } }, c.today);
      return { ...r, rows: r.rows.slice(0, 50), truncated: r.rows.length > 50 };
    },
  },
  purchase_summary: {
    description: "Purchases for a period, grouped by month, supplier, item or HSN.",
    permission: "purchase.view",
    input: { type: "object", properties: { ...period.properties, group_by: { type: "string", enum: ["month", "supplier", "item", "hsn"] } }, required: ["from", "to"] },
    run: async (tx, a, c) => {
      const r = await runReport(tx, c.perms, { dataset: "purchases", groupBy: typeof a.group_by === "string" ? [a.group_by] : [], measures: ["taxable", "tax", "total", "documents"], period: { preset: "custom", from: isoOr(a.from, c.today), to: isoOr(a.to, c.today) } }, c.today);
      return { ...r, rows: r.rows.slice(0, 50) };
    },
  },
  outstanding: {
    description: "Who owes us (receivable) or whom we owe (payable), with ageing (not due, 0-30, 31-60, 61-90, over 90 days overdue), largest first.",
    permission: "reports.view",
    input: { type: "object", properties: { kind: { type: "string", enum: ["receivable", "payable"] }, top: { type: "integer" } }, required: ["kind"] },
    run: async (tx, a, c) => {
      const r = await outstanding(tx, undefined, a.kind === "payable" ? "payable" : "receivable", c.today);
      const top = Math.min(Number(a.top) || 10, 30);
      const owed = r.rows.filter((x) => dec(x.balance).gt(0)).reduce((s, x) => s.plus(x.balance), dec(0));
      const advances = r.rows.filter((x) => dec(x.balance).lt(0)).reduce((s, x) => s.minus(x.balance), dec(0));
      return { total: money(owed), advances: money(advances), parties: r.rows.filter((x) => dec(x.balance).gt(0)).sort((x, y) => Number(y.balance) - Number(x.balance)).slice(0, top).map((x) => ({ name: x.name, balance: x.balance, buckets: x.buckets, phone: x.phone })) };
    },
  },
  profit_and_loss: {
    description: "Profit and loss for a period: sales, purchases, stock change, gross profit, other income and expenses by ledger, net profit.",
    permission: "reports.view", input: period,
    run: async (tx, a, c) => {
      const company = await resolveCompany(tx);
      const r = await profitAndLoss(tx, company.id, isoOr(a.from, presetPeriod("this_month", c.today).from), isoOr(a.to, c.today));
      const slim = (xs: { name: string; amount: string }[]) => xs.map((x) => ({ name: x.name, amount: x.amount }));
      return { ...r, tradingIncome: slim(r.tradingIncome), tradingExpense: slim(r.tradingExpense), otherIncome: slim(r.otherIncome), otherExpense: slim(r.otherExpense) };
    },
  },
  stock: {
    description: "Stock on hand and value for items matching a name (or all items below their reorder level when no name is given).",
    permission: "inventory.view", input: { type: "object", properties: { item: { type: "string" } } },
    run: async (tx, a, c) => {
      const company = await resolveCompany(tx);
      const s = await stockSummary(tx, company, c.today);
      const q = typeof a.item === "string" ? a.item.toLowerCase() : "";
      const rows = s.rows.filter((r) => !r.archived && (q ? r.name.toLowerCase().includes(q) || (r.sku ?? "").toLowerCase() === q : r.belowReorder));
      return { totalValue: s.totalValue, items: rows.slice(0, 30).map((r) => ({ name: r.name, qty: r.qty, uom: r.uom, value: r.value, reorderLevel: r.reorderLevel, belowReorder: r.belowReorder })) };
    },
  },
  find_party: {
    description: "Find customers or suppliers by name, phone or GSTIN, with their current balance (positive = they owe us).",
    permission: "accounts.view", input: { type: "object", properties: { query: { type: "string" } }, required: ["query"] },
    run: async (tx, a, c) => {
      const company = await resolveCompany(tx);
      const like = `%${String(a.query ?? "").replace(/[%_\\]/g, "\\$&")}%`;
      const rows = await tx.select({ id: tables.accounts.id, name: tables.accounts.name, phone: tables.accounts.phone, gstin: tables.accounts.gstin, opening: tables.accounts.openingBalance })
        .from(tables.accounts).where(and(eq(tables.accounts.companyId, company.id), or(ilike(tables.accounts.name, like), ilike(tables.accounts.phone, like), ilike(tables.accounts.gstin, like)))).limit(10);
      const out = [];
      for (const r of rows) {
        const [b] = await tx.execute<{ bal: string }>(sql`select (${r.opening}::numeric + coalesce(sum(debit - credit), 0))::text as bal from gl_entries where account_id = ${r.id} and date <= ${c.today}::date`);
        out.push({ name: r.name, phone: r.phone, gstin: r.gstin, balance: money(b!.bal) });
      }
      return out;
    },
  },
  gst_summary: {
    description: "GSTR-3B figures for a month (period as MMYYYY): outward supplies, input tax credit and tax payable.",
    permission: "gst.view", input: { type: "object", properties: { period: { type: "string", description: "MMYYYY, e.g. 092026" } }, required: ["period"] },
    run: async (tx, a) => {
      if (typeof a.period !== "string" || !/^(0[1-9]|1[0-2])\d{4}$/.test(a.period)) return { error: "period must be MMYYYY" };
      const r = await gstr3b(tx, undefined, a.period);
      return r;
    },
  },
  checks: {
    description: "Entries worth a second look: cash payments over ₹10,000 to one party in a day (s. 40A(3)), cash receipts of ₹2 lakh or more (s. 269ST), possible duplicate purchase bills, sales below cost, negative stock.",
    permission: "reports.view", input: period,
    run: (tx, a, c) => anomalies(tx, isoOr(a.from, presetPeriod("this_fy", c.today).from), isoOr(a.to, c.today)),
  },
};

const allowedTools = (perms: Set<string>) => Object.entries(TOOLS).filter(([, t]) => perms.has(t.permission));

// ---- Claude ---------------------------------------------------------------------------------------------

type Block = { type: "text"; text: string } | { type: "tool_use"; id: string; name: string; input: Record<string, unknown> } | { type: "tool_result"; tool_use_id: string; content: string };
interface ApiMessage { role: "user" | "assistant"; content: string | Block[] }
export type ClaudeCall = (body: Record<string, unknown>) => Promise<{ content: Block[]; stop_reason: string }>;

export const claudeCall = (apiKey: string, fetchFn: typeof fetch = fetch): ClaudeCall => async (body) => {
  const res = await fetchFn("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify(body), signal: AbortSignal.timeout(60_000),
  });
  if (!res.ok) throw badRequest(res.status === 429 || res.status === 529 ? "assistant_busy" : "assistant_failed");
  return res.json() as Promise<{ content: Block[]; stop_reason: string }>;
};

const MODEL = process.env.ASSISTANT_MODEL ?? "claude-sonnet-5-5";
const defaultCall: ClaudeCall | null = process.env.ANTHROPIC_API_KEY ? claudeCall(process.env.ANTHROPIC_API_KEY) : null;

export async function ask(tx: Tx, actor: Actor, perms: Set<string>, history: ChatMessage[], opts: { today: string; locale: string; call?: ClaudeCall | null }) {
  const question = history[history.length - 1];
  if (!question || question.role !== "user" || !question.content.trim()) throw badRequest("empty_question");
  const company = await resolveCompany(tx);
  const call = opts.call === undefined ? defaultCall : opts.call;
  const tools = allowedTools(perms);
  const used: string[] = [];
  await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "ask", entity: "assistant", after: { question: question.content.slice(0, 300), mode: call ? "claude" : "demo" }, ip: actor.ip });
  if (!call) return { mode: "demo" as const, answer: await demoAnswer(tx, perms, question.content, opts.today), tools: used };

  const system = [
    `You are the assistant inside Varchasv ERP for ${company.legalName ?? company.name}, an Indian business. Today is ${opts.today}; the financial year runs April to March.`,
    "Answer only from the tools; if they can't answer, say so. You can't create, change or delete anything: if asked to, explain where in the app it's done.",
    "Show money as ₹ with Indian digit grouping (₹12,34,567.00). Be brief: a sentence or two, then a short list or table if it helps.",
    `Reply in the language of the question (the user's app language is ${opts.locale === "hi" ? "Hindi" : "English"}).`,
  ].join(" ");
  const messages: ApiMessage[] = history.slice(-12).map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
  for (let turn = 0; turn < 6; turn++) {
    const res = await call({
      model: MODEL, max_tokens: 1500, system, messages,
      tools: tools.map(([name, t]) => ({ name, description: t.description, input_schema: t.input })),
    });
    const toolUses = res.content.filter((b): b is Extract<Block, { type: "tool_use" }> => b.type === "tool_use");
    if (res.stop_reason !== "tool_use" || !toolUses.length) {
      return { mode: "claude" as const, answer: res.content.filter((b): b is Extract<Block, { type: "text" }> => b.type === "text").map((b) => b.text).join("\n").trim(), tools: used };
    }
    messages.push({ role: "assistant", content: res.content });
    const results: Block[] = [];
    for (const u of toolUses) {
      const tool = TOOLS[u.name];
      used.push(u.name);
      let content: string;
      if (!tool || !perms.has(tool.permission)) content = JSON.stringify({ error: "not allowed" });
      else {
        try { content = JSON.stringify(await tool.run(tx, u.input ?? {}, { today: opts.today, perms })).slice(0, 20_000); } catch { content = JSON.stringify({ error: "tool failed" }); }
      }
      results.push({ type: "tool_result", tool_use_id: u.id, content });
    }
    messages.push({ role: "user", content: results });
  }
  return { mode: "claude" as const, answer: "", tools: used };
}

// ---- built-in assistant (no API key) ------------------------------------------------------------------------

const r = (v: string | number) => `₹${formatIndian(v)}`;

async function demoAnswer(tx: Tx, perms: Set<string>, q: string, today: string) {
  const text = q.toLowerCase();
  const has = (...words: string[]) => words.some((w) => text.includes(w));
  const ctx = { today, perms };
  const can = (tool: string) => perms.has(TOOLS[tool]!.permission);
  if (has("outstanding", "receivable", "owe", "due", "बकाया", "लेना")) {
    if (!can("outstanding")) return "You don't have access to that report.";
    const o = (await TOOLS.outstanding!.run(tx, { kind: has("payable", "we owe", "देना") ? "payable" : "receivable", top: 5 }, ctx)) as { total: string; parties: { name: string; balance: string }[] };
    return [`Total: ${r(o.total)}`, ...o.parties.map((p) => `• ${p.name}: ${r(p.balance)}`)].join("\n");
  }
  if (has("profit", "loss", "लाभ", "मुनाफ़ा", "मुनाफा")) {
    if (!can("profit_and_loss")) return "You don't have access to that report.";
    const p = (await TOOLS.profit_and_loss!.run(tx, presetPeriod("this_month", today), ctx)) as { grossProfit: string; netProfit: string };
    return `This month so far: gross profit ${r(p.grossProfit)}, net profit ${r(p.netProfit)}.`;
  }
  if (has("stock", "reorder", "स्टॉक", "माल")) {
    if (!can("stock")) return "You don't have access to stock.";
    const s = (await TOOLS.stock!.run(tx, {}, ctx)) as { totalValue: string; items: { name: string; qty: string; uom: string }[] };
    return [`Stock value: ${r(s.totalValue)}.`, s.items.length ? "Below reorder level:" : "Nothing is below its reorder level.", ...s.items.slice(0, 10).map((i) => `• ${i.name}: ${Number(i.qty)} ${i.uom}`)].join("\n");
  }
  if (has("check", "anomal", "unusual", "40a", "269st", "जाँच")) {
    if (!can("checks")) return "You don't have access to that.";
    const c = (await TOOLS.checks!.run(tx, {}, ctx)) as { rows: { key: string; date: string; params: Record<string, string> }[] };
    const label: Record<string, (p: Record<string, string>) => string> = {
      cash40A3: (p) => `cash paid to ${p.party}: ${r(p.amount ?? 0)} in a day (over ₹10,000, s. 40A(3))`,
      cash269ST: (p) => `cash received from ${p.party}: ${r(p.amount ?? 0)} in a day (₹2 lakh or more, s. 269ST)`,
      duplicateBill: (p) => `${p.supplier} billed ${r(p.amount ?? 0)} twice (${p.first}, ${p.second})`,
      belowCost: (p) => `${p.number}: ${p.item} sold at ${r(p.rate ?? 0)}, below cost ${r(p.cost ?? 0)}`,
      negativeStock: (p) => `${p.item} stock is ${p.qty} ${p.uom}`,
    };
    return c.rows.length
      ? [`${c.rows.length} entries to look at this year:`, ...c.rows.slice(0, 10).map((x) => `• ${x.date}: ${label[x.key]?.(x.params) ?? x.key}`), "See Reports → Checks for the full list."].join("\n")
      : "Nothing unusual found this financial year.";
  }
  if (has("sale", "sold", "बिक्री", "सेल")) {
    if (!can("sales_summary")) return "You don't have access to sales.";
    const p = presetPeriod(has("last month", "पिछले महीने") ? "last_month" : has("year", "साल") ? "this_fy" : "this_month", today);
    const s = (await TOOLS.sales_summary!.run(tx, { ...p, group_by: "customer" }, ctx)) as { totals: (string | null)[]; rows: string[][] };
    return [`Sales ${p.from} to ${p.to}: ${r(s.totals[0] ?? 0)} before tax, ${r(s.totals[2] ?? 0)} with tax.`, ...s.rows.sort((a, b) => Number(b[1]) - Number(a[1])).slice(0, 5).map((x) => `• ${x[0]}: ${r(x[1] ?? 0)}`)].join("\n");
  }
  if (has("cash", "bank", "balance", "नकद", "बैंक")) {
    const d = (await dashboard(tx, perms, today)) as { money?: { cashBank: { name: string; balance: string }[] } };
    if (!d.money) return "You don't have access to balances.";
    return d.money.cashBank.map((c) => `• ${c.name}: ${r(c.balance)}`).join("\n") || "No cash or bank ledgers yet.";
  }
  return "I can tell you about sales, outstanding payments, profit, stock, cash and bank balances, and entries worth checking. Try: \"Who owes us the most?\"";
}

export function assistantTools(perms: Set<string>) {
  return allowedTools(perms).map(([name, t]) => ({ name, description: t.description }));
}
