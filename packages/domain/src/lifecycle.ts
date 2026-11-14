/**
 * The written life of each kind of document: the states it can be in and the moves between them. A state outside this list,
 * or a move not listed, is a bug. Cancelling or reversing is a state of its own, never a delete.
 */
export type Machine = Record<string, readonly string[]>;

export const LIFECYCLES = {
  salesOrder: { open: ["partial", "delivered", "closed", "cancelled"], partial: ["partial", "delivered", "closed", "cancelled", "open"], delivered: ["partial", "open"], closed: [], cancelled: [] },
  deliveryOrder: { open: ["closed", "cancelled"], closed: [], cancelled: [] },
  deliveryNote: { posted: ["invoiced", "closed", "cancelled"], invoiced: ["posted"], closed: ["posted"], cancelled: [] },
  stockTransfer: { in_transit: ["received", "cancelled"], received: [], cancelled: [] },
  stockCount: { counting: ["submitted", "cancelled"], submitted: ["approved", "counting", "cancelled"], approved: [], cancelled: [] },
  loanRequest: { pending: ["approved", "rejected"], approved: [], rejected: [] },
  changeRequest: { pending: ["approved", "rejected"], approved: [], rejected: [] },
  stipendPayment: { posted: ["cancelled"], cancelled: [] },
  repairJob: { received: ["estimated", "in_repair", "declined", "cancelled"], estimated: ["approved", "declined", "cancelled"], approved: ["in_repair", "cancelled"], in_repair: ["ready", "cancelled"], ready: ["delivered", "cancelled"], delivered: [], declined: [], cancelled: [] },
  salesInvoice: { posted: ["cancelled"], cancelled: [] },
  purchaseBill: { posted: ["cancelled"], cancelled: [] },
  posBill: { paid: ["void"], void: [] },
  voucher: { posted: ["cancelled"], cancelled: [] },
  goodsReceipt: { posted: ["billed", "cancelled"], billed: ["posted"], cancelled: [] },
  productionOrder: { planned: ["released", "cancelled"], released: ["completed", "cancelled"], completed: [], cancelled: [] },
  itemVariant: { active: ["archived", "merged"], archived: ["active"], merged: [] },
  payment: { posted: ["cancelled"], cancelled: [] },
  employeeLoan: { active: ["closed", "cancelled"], closed: ["active"], cancelled: [] },
} as const satisfies Record<string, Machine>;

export type LifecycleName = keyof typeof LIFECYCLES;

/** Is moving from one state to another allowed for this kind of document? Staying put is always fine. */
export function canMove(machine: LifecycleName, from: string, to: string) {
  if (from === to) return from in LIFECYCLES[machine];
  const next = (LIFECYCLES[machine] as Machine)[from];
  return !!next && next.includes(to);
}
