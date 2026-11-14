import { randomUUID } from "node:crypto";

/**
 * SMS and push behind one small interface. No paid provider is wired in: the demo senders record what would go out and report it sent, so
 * every flow can be tried end to end, and a real gateway plugs in by implementing `ChannelSender`. WhatsApp uses the messenger in messaging.ts
 * and email the mailer in lib/mailer.ts.
 */
export interface ChannelMessage { to: string; body: string; subject?: string | undefined }
export interface ChannelSender {
  readonly name: string;
  send(m: ChannelMessage): Promise<{ id: string }>;
}

export class DemoSender implements ChannelSender {
  readonly sent: (ChannelMessage & { id: string })[] = [];
  constructor(readonly name: string) {}
  async send(m: ChannelMessage) {
    const id = `${this.name}-${randomUUID()}`;
    this.sent.push({ ...m, id });
    if (this.sent.length > 100) this.sent.shift();
    return { id };
  }
}

export const demoSms = new DemoSender("demo-sms");
export const demoPush = new DemoSender("demo-push");
