import { createTransport } from "nodemailer";

/**
 * Outgoing email behind an interface. The dev adapter logs messages (and keeps the last few in memory
 * for tests); a real provider (SES, Postmark, ...) plugs in by implementing `Mailer`.
 */
export interface Mail {
  to: string;
  subject: string;
  text: string;
  attachments?: { filename: string; contentType: string; content: string; encoding?: "base64" }[];
}

export interface Mailer {
  send(mail: Mail): Promise<void>;
}

export class LogMailer implements Mailer {
  readonly sent: Mail[] = [];
  constructor(private readonly log: (msg: string) => void = console.log) {}
  async send(mail: Mail) {
    this.sent.push(mail);
    if (this.sent.length > 50) this.sent.shift();
    this.log(`[mail] to=${mail.to} subject="${mail.subject}"\n${mail.text}`);
  }
}

/** Real delivery over SMTP (any provider: SES, Postmark, Zoho Mail, Gmail…), used when SMTP_URL is set. */
export class SmtpMailer implements Mailer {
  private readonly transport;
  constructor(url: string, private readonly from: string) {
    this.transport = createTransport(url);
  }
  async send(mail: Mail) {
    await this.transport.sendMail({
      from: this.from, to: mail.to, subject: mail.subject, text: mail.text,
      attachments: mail.attachments?.map((a) => ({ filename: a.filename, contentType: a.contentType, content: a.content, ...(a.encoding ? { encoding: a.encoding } : {}) })),
    });
  }
}
