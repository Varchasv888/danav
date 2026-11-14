import { validateGstin } from "@varchasv/domain";

/**
 * Reads a bill or receipt photo/PDF: for an expense claim (vendor, GSTIN, invoice number, date, total,
 * GST rate) or for a purchase bill (also its lines). With ANTHROPIC_API_KEY set, Claude reads it;
 * otherwise `DemoReceiptReader` returns nothing and the details are typed. The reader only suggests:
 * nothing is saved until the user does.
 */
export interface ReceiptFields {
  vendorName: string | null; vendorGstin: string | null; invoiceNo: string | null; date: string | null;
  total: string | null; gstRate: string | null; category: string | null;
}
export interface BillLineFields { description: string; hsn: string | null; qty: string | null; rate: string | null; gstRate: string | null }
export type BillFields = Omit<ReceiptFields, "category" | "gstRate"> & { lines: BillLineFields[] };
type File = { data: Buffer; contentType: string };

export interface ReceiptReader {
  readonly name: string;
  read(file: File, categories: string[]): Promise<ReceiptFields | null>;
  readBill(file: File): Promise<BillFields | null>;
}

export class DemoReceiptReader implements ReceiptReader {
  readonly name = "demo";
  async read() {
    return null;
  }
  async readBill() {
    return null;
  }
}

const GST_RATES = ["0", "0.25", "3", "5", "12", "18", "28", "40"];
const strOf = (raw: Record<string, unknown>, k: string) => (typeof raw[k] === "string" && (raw[k] as string).trim() ? (raw[k] as string).trim() : typeof raw[k] === "number" ? String(raw[k]) : null);
const amount = (v: string | null) => { const s = v?.replace(/[,₹\s]|Rs\.?/gi, "") ?? null; return s && /^\d+(\.\d{1,4})?$/.test(s) ? s : null; };
const rateOf = (v: string | null) => { const s = v?.replace(/%/, "") ?? null; return s && GST_RATES.includes(String(Number(s))) ? String(Number(s)) : null; };
const gstinOf = (v: string | null) => { const g = v?.toUpperCase().replace(/\s/g, "") ?? null; return g && validateGstin(g).valid ? g : null; };
const dateOf = (v: string | null) => (v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null);

/** Keeps only values that look right: a valid GSTIN, an ISO date, a plain amount, a GST rate. */
export function cleanReceipt(raw: Record<string, unknown>, categories: string[]): ReceiptFields {
  const category = strOf(raw, "category");
  const total = amount(strOf(raw, "total"));
  return {
    vendorName: strOf(raw, "vendor_name")?.slice(0, 100) ?? null, vendorGstin: gstinOf(strOf(raw, "vendor_gstin")),
    invoiceNo: strOf(raw, "invoice_no")?.slice(0, 30) ?? null, date: dateOf(strOf(raw, "date")),
    total: total && /^\d+(\.\d{1,2})?$/.test(total) ? total : null, gstRate: rateOf(strOf(raw, "gst_rate")),
    category: category && categories.includes(category) ? category : null,
  };
}

export function cleanBill(raw: Record<string, unknown>): BillFields {
  const r = cleanReceipt(raw, []);
  const lines = (Array.isArray(raw.lines) ? raw.lines : []).slice(0, 100).flatMap((x) => {
    if (!x || typeof x !== "object") return [];
    const l = x as Record<string, unknown>;
    const description = strOf(l, "description")?.slice(0, 200);
    if (!description) return [];
    const hsn = strOf(l, "hsn")?.replace(/\s/g, "") ?? null;
    return [{ description, hsn: hsn && /^\d{4,8}$/.test(hsn) ? hsn : null, qty: amount(strOf(l, "qty")), rate: amount(strOf(l, "rate")), gstRate: rateOf(strOf(l, "gst_rate")) }];
  });
  return { vendorName: r.vendorName, vendorGstin: r.vendorGstin, invoiceNo: r.invoiceNo, date: r.date, total: r.total, lines };
}

const HEADER_FIELDS = {
  vendor_name: { type: "string", description: "Seller's name as printed" },
  vendor_gstin: { type: "string", description: "Seller's 15-character GSTIN, if printed" },
  invoice_no: { type: "string", description: "Bill or invoice number" },
  date: { type: "string", description: "Bill date as YYYY-MM-DD" },
  total: { type: "string", description: "Amount payable including taxes, digits only, e.g. 1180.00" },
};

export class ClaudeReceiptReader implements ReceiptReader {
  readonly name = "claude";
  constructor(private apiKey: string, private model = process.env.RECEIPT_MODEL ?? "claude-sonnet-5-5", private fetchFn: typeof fetch = fetch) {}

  private async callTool(file: File, tool: { name: string; description: string; input_schema: object }, prompt: string, maxTokens: number) {
    const source = { type: "base64", media_type: file.contentType, data: file.data.toString("base64") };
    const res = await this.fetchFn("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": this.apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      signal: AbortSignal.timeout(60_000),
      body: JSON.stringify({
        model: this.model, max_tokens: maxTokens, tools: [tool], tool_choice: { type: "tool", name: tool.name },
        messages: [{ role: "user", content: [file.contentType === "application/pdf" ? { type: "document", source } : { type: "image", source }, { type: "text", text: prompt }] }],
      }),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { content?: { type: string; input?: Record<string, unknown> }[] };
    return body.content?.find((c) => c.type === "tool_use")?.input ?? null;
  }

  async read(file: File, categories: string[]): Promise<ReceiptFields | null> {
    const input = await this.callTool(file, {
      name: "record_receipt", description: "Record the details read from an Indian bill, tax invoice or receipt.",
      input_schema: {
        type: "object",
        properties: {
          ...HEADER_FIELDS,
          gst_rate: { type: "string", description: "GST rate in percent if a single rate applies, e.g. 18" },
          category: { type: "string", enum: categories, description: "The expense category that fits best" },
        },
      },
    }, "Read this bill for an expense claim. Leave out anything you cannot read clearly.", 1024);
    return input ? cleanReceipt(input, categories) : null;
  }

  async readBill(file: File): Promise<BillFields | null> {
    const input = await this.callTool(file, {
      name: "record_purchase_bill", description: "Record a supplier's tax invoice: header and each line.",
      input_schema: {
        type: "object",
        properties: {
          ...HEADER_FIELDS,
          lines: {
            type: "array",
            items: {
              type: "object",
              properties: {
                description: { type: "string" }, hsn: { type: "string", description: "HSN or SAC code" },
                qty: { type: "string", description: "Quantity, digits only" }, rate: { type: "string", description: "Rate per unit before GST, digits only" },
                gst_rate: { type: "string", description: "GST rate in percent" },
              },
              required: ["description"],
            },
          },
        },
      },
    }, "Read this supplier's tax invoice for a purchase entry. Leave out anything you cannot read clearly.", 4096);
    return input ? cleanBill(input) : null;
  }
}

export const receiptReader: ReceiptReader = process.env.ANTHROPIC_API_KEY ? new ClaudeReceiptReader(process.env.ANTHROPIC_API_KEY) : new DemoReceiptReader();
