import { randomUUID } from "node:crypto";

/**
 * Sending WhatsApp messages. With WHATSAPP_TOKEN and WHATSAPP_PHONE_ID set, messages go through Meta's
 * WhatsApp Cloud API: as an approved template when the template has a provider name (needed to start a
 * conversation), otherwise as plain text (only allowed within 24 hours of the customer's last message).
 * Without them, `DemoMessenger` records the message and reports it sent, so the flow can be tried.
 */
export interface OutgoingMessage {
  to: string; // 919876543210
  body: string;
  template?: { name: string; language: string; params: string[] } | undefined;
}
export interface Messenger {
  readonly name: string;
  send(m: OutgoingMessage): Promise<{ id: string }>;
}

export class MessagingError extends Error {
  constructor(public code: string) {
    super(code);
  }
}

export class DemoMessenger implements Messenger {
  readonly name = "demo";
  readonly sent: (OutgoingMessage & { id: string })[] = [];
  async send(m: OutgoingMessage) {
    const id = `demo-${randomUUID()}`;
    this.sent.push({ ...m, id });
    if (this.sent.length > 100) this.sent.shift();
    return { id };
  }
}

export class WhatsAppCloud implements Messenger {
  readonly name = "whatsapp";
  constructor(private token: string, private phoneId: string, private fetchFn: typeof fetch = fetch, private version = "v21.0") {}

  async send(m: OutgoingMessage) {
    const payload = m.template
      ? {
        messaging_product: "whatsapp", to: m.to, type: "template",
        template: { name: m.template.name, language: { code: m.template.language }, components: m.template.params.length ? [{ type: "body", parameters: m.template.params.map((text) => ({ type: "text", text })) }] : [] },
      }
      : { messaging_product: "whatsapp", to: m.to, type: "text", text: { body: m.body } };
    const res = await this.fetchFn(`https://graph.facebook.com/${this.version}/${this.phoneId}/messages`, {
      method: "POST", headers: { authorization: `Bearer ${this.token}`, "content-type": "application/json" }, body: JSON.stringify(payload), signal: AbortSignal.timeout(20_000),
    });
    const body = (await res.json().catch(() => ({}))) as { messages?: { id: string }[]; error?: { code?: number; message?: string } };
    if (!res.ok || !body.messages?.[0]) throw new MessagingError(body.error?.code === 131047 ? "outside_24h_window" : "send_failed");
    return { id: body.messages[0].id };
  }
}

export const messenger: Messenger = process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_ID
  ? new WhatsAppCloud(process.env.WHATSAPP_TOKEN, process.env.WHATSAPP_PHONE_ID)
  : new DemoMessenger();
