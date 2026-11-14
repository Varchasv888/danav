/**
 * Customer messages (WhatsApp, SMS). Templates use WhatsApp's numbered placeholders — "Dear {{1}},
 * ₹{{2}} is due" — so the same text can be registered with Meta as an approved template.
 */
export class MessageError extends Error {
  constructor(public code: "missing_param" | "invalid_phone" | "template_too_long") {
    super(code);
  }
}

/** Placeholders used in a template body, in order: "{{1}} … {{2}}" → [1, 2]. */
export function templateParams(body: string): number[] {
  return [...new Set([...body.matchAll(/\{\{(\d+)\}\}/g)].map((m) => Number(m[1])))].sort((a, b) => a - b);
}

export function renderTemplate(body: string, values: string[]): string {
  if (body.length > 1024) throw new MessageError("template_too_long");
  return body.replace(/\{\{(\d+)\}\}/g, (_m, n: string) => {
    const v = values[Number(n) - 1];
    if (v === undefined || v === "") throw new MessageError("missing_param");
    return v;
  });
}

/** An Indian mobile number as WhatsApp wants it ("919876543210"), from "+91 98765-43210", "098765 43210" or "9876543210". */
export function normalizeIndianMobile(raw: string): string | null {
  let d = raw.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  else if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? `91${d}` : null;
}

/** CRM pipeline stages, in order. Won and lost close a lead. */
export const LEAD_STAGES = ["new", "contacted", "qualified", "proposal", "won", "lost"] as const;
export type LeadStage = (typeof LEAD_STAGES)[number];
export const LEAD_SOURCES = ["walk_in", "referral", "website", "indiamart", "justdial", "whatsapp", "trade_fair", "other"] as const;

/** Pipeline value weighted by how far each open lead has got. */
export const STAGE_PROBABILITY: Record<LeadStage, number> = { new: 10, contacted: 20, qualified: 40, proposal: 60, won: 100, lost: 0 };
