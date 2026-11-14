import { sql } from "drizzle-orm";
import type { Tx } from "@varchasv/db";
import { dec, money, canSetOff, GST_HEADS, type GstHead, type GstJvKind } from "@varchasv/domain";
import { audit } from "../lib/audit.js";
import { badRequest } from "../lib/errors.js";
import { postVoucher, resolveCompany } from "./accounting.js";
import { keyed } from "./vouchers.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

export interface GstJvInput {
  kind: GstJvKind;
  date: string;
  /** Per head, for every kind except a set-off. */
  amounts?: Partial<Record<GstHead, string>> | undefined;
  /** For a set-off: the credit used against each liability. */
  pairs?: { liability: GstHead; credit: GstHead; amount: string }[] | undefined;
  /** The other side of the entry for every kind except a set-off (expense, income, supplier or bank). */
  counterAccountId?: string | undefined;
  narration?: string | undefined;
  clientId?: string | undefined;
}

const out = (h: GstHead) => `output_${h}`;
const inp = (h: GstHead) => `input_${h}`;

/**
 * A journal voucher that touches only the GST accounts: paying liability out of credit, reversing or
 * claiming credit, or raising or cutting liability by itself. Built from the tax heads so the user never
 * picks the wrong ledger, and so a set-off cannot use a credit the law does not allow.
 */
export async function postGstJv(tx: Tx, actor: Actor, input: GstJvInput) {
  const company = await resolveCompany(tx);
  const lines: { accountId: string; debit?: string; credit?: string; narration?: string }[] = [];
  const keys = new Set<string>();

  if (input.kind === "setoff") {
    if (!input.pairs?.length) throw badRequest("amount_required");
    const rows = input.pairs.filter((p) => dec(p.amount).gt(0));
    if (!rows.length) throw badRequest("amount_required");
    for (const p of rows) {
      if (!canSetOff(p.credit, p.liability)) throw badRequest("setoff_not_allowed");
      keys.add(out(p.liability)); keys.add(inp(p.credit));
    }
    const acc = await keyed(tx, company, [...keys]);
    for (const p of rows) {
      lines.push({ accountId: acc[out(p.liability)]!, debit: money(p.amount) }, { accountId: acc[inp(p.credit)]!, credit: money(p.amount) });
    }
  } else {
    const heads = GST_HEADS.filter((h) => dec(input.amounts?.[h] ?? 0).gt(0));
    if (!heads.length) throw badRequest("amount_required");
    if (!input.counterAccountId) throw badRequest("counter_account_required");
    const taxKey = input.kind === "itc_reverse" || input.kind === "itc_claim" ? inp : out;
    const acc = await keyed(tx, company, heads.map(taxKey));
    const total = heads.reduce((s, h) => s.plus(input.amounts![h]!), dec(0));
    // Credit reversed or liability raised: tax is credited. Credit claimed or liability cut: tax is debited.
    const taxCredit = input.kind === "itc_reverse" || input.kind === "liability_add";
    for (const h of heads) lines.push(taxCredit ? { accountId: acc[taxKey(h)]!, credit: money(input.amounts![h]!) } : { accountId: acc[taxKey(h)]!, debit: money(input.amounts![h]!) });
    lines.push(taxCredit ? { accountId: input.counterAccountId, debit: money(total) } : { accountId: input.counterAccountId, credit: money(total) });
  }

  const { voucher, replayed } = await postVoucher(tx, actor, {
    type: "journal", date: input.date, narration: input.narration, reference: "GST JV", clientId: input.clientId, lines,
  });
  if (!replayed) await audit(tx, { tenantId: actor.tenantId, userId: actor.userId, action: "create", entity: "gst_jv", entityId: voucher.id, after: { kind: input.kind, number: voucher.number, total: voucher.total }, ip: actor.ip });
  return { voucher, replayed };
}

/** What each tax account holds now (credit available, liability owed), so the form can show it. */
export async function gstPosition(tx: Tx) {
  const company = await resolveCompany(tx);
  await keyed(tx, company, GST_HEADS.flatMap((h) => [out(h), inp(h)]));
  const rows = await tx.execute<{ key: string; balance: string }>(sql`
    select a.key, coalesce(sum(e.debit - e.credit), 0)::text as balance
    from accounts a
    left join gl_entries e on e.account_id = a.id and not e.is_reversal and exists (select 1 from vouchers v where v.id = e.voucher_id and v.status = 'posted')
    where a.company_id = ${company.id} and a.key in (${sql.join(GST_HEADS.flatMap((h) => [out(h), inp(h)]).map((k) => sql`${k}`), sql`, `)})
    group by a.key`);
  const bal = new Map([...rows].map((r) => [r.key, dec(r.balance)]));
  return GST_HEADS.map((h) => ({
    head: h,
    // Input accounts hold debits (credit available); output accounts hold credits (liability owed).
    credit: money(bal.get(inp(h)) ?? 0),
    liability: money((bal.get(out(h)) ?? dec(0)).negated()),
  }));
}
