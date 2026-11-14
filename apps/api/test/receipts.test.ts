import { describe, expect, it } from "vitest";
import { ClaudeReceiptReader, cleanReceipt } from "../src/integrations/receipts.js";

describe("receipt reader", () => {
  it("asks Claude for the bill's fields through a forced tool call and keeps only sane values", async () => {
    let sent: { url: string; body: Record<string, unknown>; headers: Record<string, string> } | null = null;
    const fake = (async (url: string, init: RequestInit) => {
      sent = { url, body: JSON.parse(String(init.body)), headers: init.headers as Record<string, string> };
      return new Response(JSON.stringify({
        content: [{ type: "tool_use", name: "record_receipt", input: {
          vendor_name: "Hotel Panchavati", vendor_gstin: "27aapfu0939f1zv", invoice_no: "HP/1123", date: "2026-10-08", total: "₹5,600.00", gst_rate: "12%", category: "Hotel stay",
        } }],
      }), { status: 200 });
    }) as unknown as typeof fetch;
    const r = await new ClaudeReceiptReader("test-key", "claude-sonnet-5-5", fake).read({ data: Buffer.from("%PDF-1.4"), contentType: "application/pdf" }, ["Hotel stay", "Fuel"]);
    expect(r).toEqual({ vendorName: "Hotel Panchavati", vendorGstin: "27AAPFU0939F1ZV", invoiceNo: "HP/1123", date: "2026-10-08", total: "5600.00", gstRate: "12", category: "Hotel stay" });
    expect(sent!.url).toBe("https://api.anthropic.com/v1/messages");
    expect(sent!.headers["anthropic-version"]).toBe("2023-06-01");
    expect(sent!.body).toMatchObject({ model: "claude-sonnet-5-5", tool_choice: { type: "tool", name: "record_receipt" } });
    expect((sent!.body.messages as { content: { type: string }[] }[])[0]!.content[0]!.type).toBe("document");
  });

  it("drops a bad GSTIN, an unknown category, an odd rate and a non-ISO date", () => {
    expect(cleanReceipt({ vendor_gstin: "27AAPFU0939F1ZX", category: "Snacks", gst_rate: "7", date: "08/10/2026", total: "abc" }, ["Fuel"]))
      .toEqual({ vendorName: null, vendorGstin: null, invoiceNo: null, date: null, total: null, gstRate: null, category: null });
  });

  it("returns nothing when the API refuses", async () => {
    const fake = (async () => new Response("{}", { status: 529 })) as unknown as typeof fetch;
    expect(await new ClaudeReceiptReader("k", "m", fake).read({ data: Buffer.from("x"), contentType: "image/png" }, [])).toBeNull();
  });
});

describe("purchase bills and WhatsApp", () => {
  it("keeps only readable bill lines with sane codes and numbers", async () => {
    const { cleanBill } = await import("../src/integrations/receipts.js");
    expect(cleanBill({ vendor_gstin: "27AAPFU0939F1ZV", invoice_no: "A-101", date: "2026-10-05", total: "4,200.00", lines: [
      { description: "Basmati rice 25kg", hsn: "1006 30", qty: "5", rate: "₹800.00", gst_rate: "5%" }, { description: "", qty: "1" }, { description: "Freight", hsn: "ABC" },
    ] })).toEqual({ vendorName: null, vendorGstin: "27AAPFU0939F1ZV", invoiceNo: "A-101", date: "2026-10-05", total: "4200.00", lines: [
      { description: "Basmati rice 25kg", hsn: "100630", qty: "5", rate: "800.00", gstRate: "5" }, { description: "Freight", hsn: null, qty: null, rate: null, gstRate: null },
    ] });
  });

  it("sends an approved template through the WhatsApp Cloud API", async () => {
    const { WhatsAppCloud } = await import("../src/integrations/messaging.js");
    let sent: { url: string; body: Record<string, unknown> } | null = null;
    const ok = (async (url: string, init: RequestInit) => { sent = { url, body: JSON.parse(String(init.body)) }; return new Response(JSON.stringify({ messages: [{ id: "wamid.1" }] })); }) as unknown as typeof fetch;
    const r = await new WhatsAppCloud("token", "123", ok).send({ to: "919876543210", body: "x", template: { name: "payment_reminder_v1", language: "en", params: ["Asha", "1,200.00"] } });
    expect(r.id).toBe("wamid.1");
    expect(sent!.url).toBe("https://graph.facebook.com/v21.0/123/messages");
    expect(sent!.body).toEqual({ messaging_product: "whatsapp", to: "919876543210", type: "template", template: { name: "payment_reminder_v1", language: { code: "en" }, components: [{ type: "body", parameters: [{ type: "text", text: "Asha" }, { type: "text", text: "1,200.00" }] }] } });
    const outside = (async () => new Response(JSON.stringify({ error: { code: 131047 } }), { status: 400 })) as unknown as typeof fetch;
    await expect(new WhatsAppCloud("t", "1", outside).send({ to: "919876543210", body: "hi" })).rejects.toThrow("outside_24h_window");
  });
});
