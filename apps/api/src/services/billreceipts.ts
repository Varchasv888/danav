import { eq } from "drizzle-orm";
import { tables, type Tx } from "@varchasv/db";
import { dec, money } from "@varchasv/domain";
import { badRequest } from "../lib/errors.js";
import { resolveCompany, postVoucher } from "./accounting.js";
import { autoEmit } from "./comms.js";
import { outstanding } from "./returns.js";

interface Actor { tenantId: string; userId: string; ip?: string | undefined }

export interface BillReceiptInput {
  kind: "receivable" | "payable";
  partyId: string;
  /** The cash or bank account the money moved through. */
  accountId: string;
  date: string;
  amount: string;
  allocations: { billVoucherId: string; amount: string }[];
  narration?: string | undefined;
  reference?: string | undefined;
  clientId?: string | undefined;
}

/** The party's open bills, as bill-wise settlement sees them (earlier allocations already taken off). */
export async function openBills(tx: Tx, kind: "receivable" | "payable", partyId: string, asOf: string) {
  const out = await outstanding(tx, undefined, kind, asOf, partyId);
  const row = out.rows[0];
  return { partyId, kind, advance: row?.advance ?? "0.00", bills: (row?.openItems ?? []).filter((o) => o.voucherId) };
}

/**
 * A receipt from a customer (or payment to a supplier) that names the bills it settles. The voucher is the
 * ordinary receipt or payment; the allocations are stored beside it. Any part of the amount not allocated
 * still settles the oldest bills first, exactly as before.
 */
export async function postBillReceipt(tx: Tx, actor: Actor, input: BillReceiptInput) {
  const company = await resolveCompany(tx);
  const total = dec(input.amount);
  if (!total.gt(0)) throw badRequest("amount_required");
  const allocated = input.allocations.reduce((s, a) => s.plus(a.amount), dec(0));
  if (allocated.gt(total)) throw badRequest("over_allocated");
  if (new Set(input.allocations.map((a) => a.billVoucherId)).size !== input.allocations.length) throw badRequest("bill_twice");

  const { bills } = await openBills(tx, input.kind, input.partyId, input.date);
  const open = new Map(bills.map((b) => [b.voucherId!, dec(b.amount)]));
  for (const a of input.allocations) {
    const left = open.get(a.billVoucherId);
    if (!left) throw badRequest("bill_not_open");
    if (dec(a.amount).gt(left)) throw badRequest("over_bill");
  }

  const money2 = money(total);
  const receipt = input.kind === "receivable";
  const { voucher, replayed } = await postVoucher(tx, actor, {
    type: receipt ? "receipt" : "payment", date: input.date, narration: input.narration, reference: input.reference, clientId: input.clientId,
    lines: receipt
      ? [{ accountId: input.accountId, debit: money2 }, { accountId: input.partyId, credit: money2 }]
      : [{ accountId: input.partyId, debit: money2 }, { accountId: input.accountId, credit: money2 }],
  });
  if (!replayed && input.allocations.length) {
    await tx.insert(tables.billAllocations).values(input.allocations.map((a) => ({
      tenantId: actor.tenantId, companyId: company.id, voucherId: voucher.id, billVoucherId: a.billVoucherId, amount: money(a.amount),
    })));
  }
  if (!replayed && receipt) {
    const [party] = await tx.select({ name: tables.accounts.name }).from(tables.accounts).where(eq(tables.accounts.id, input.partyId));
    await autoEmit(tx, actor, "payment_received", { event: "payment_received", accountId: input.partyId, params: { name: party?.name ?? "", shop: company.name, amount: money2, date: input.date }, dedupeKey: `receipt:${voucher.id}`, channels: ["whatsapp", "sms"] });
  }
  return { voucher, allocated: money(allocated), onAccount: money(total.minus(allocated)) };
}
